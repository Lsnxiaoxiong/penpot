import { z } from "zod";
import "reflect-metadata";
import { Tool } from "../Tool";
import type { ToolResponse } from "../ToolResponse";
import { TextResponse } from "../ToolResponse";
import { PenpotMcpServer } from "../PenpotMcpServer";
import { getProvider, AIProviderConfig } from "../providers";
import { ExecuteCodePluginTask } from "../tasks/ExecuteCodePluginTask";

/**
 * Arguments class for GenerateUITool
 */
export class GenerateUIArgs {
    static schema = {
        prompt: z
            .string()
            .min(1, "Prompt cannot be empty")
            .describe("Natural language description of the UI to generate"),
        provider: z
            .enum(["anthropic", "openai", "deepseek"])
            .default("anthropic")
            .describe("AI provider to use"),
        model: z
            .string()
            .optional()
            .describe("Optional model name (uses provider default if not specified)"),
        fileId: z
            .string()
            .optional()
            .describe("Target file ID for context"),
        pageId: z
            .string()
            .optional()
            .describe("Target page ID for context"),
    };

    prompt!: string;
    provider!: "anthropic" | "openai" | "deepseek";
    model?: string;
    fileId?: string;
    pageId?: string;
}

/**
 * Tool for generating UI designs using AI
 */
export class GenerateUITool extends Tool<GenerateUIArgs> {
    constructor(mcpServer: PenpotMcpServer) {
        super(mcpServer, GenerateUIArgs.schema);
    }

    public getToolName(): string {
        return "generate_ui";
    }

    public getToolDescription(): string {
        return (
            "Generates UI designs in Penpot based on natural language descriptions. " +
            "Uses AI (Claude or GPT) to create JavaScript code that builds the UI. " +
            "The generated code is automatically executed in the Penpot plugin context. " +
            "Before using this tool, ensure the MCP plugin is connected to Penpot."
        );
    }

    protected async executeCore(args: GenerateUIArgs): Promise<ToolResponse> {
        // Get the appropriate AI provider
        // For deepseek, use custom base URL
        const baseUrl = args.provider === "deepseek" ? "https://api.deepseek.com/v1" : undefined;
        const provider = getProvider(args.provider, baseUrl);

        // Load API key from configuration
        const apiKey = await this.loadApiKey(args.provider);
        if (!apiKey) {
            return new TextResponse(
                `Error: No API key configured for ${args.provider}. ` +
                `Please set PENPOT_MCP_${args.provider.toUpperCase()}_API_KEY environment variable.`
            );
        }

        // Build provider config
        const config: AIProviderConfig = {
            apiKey,
            defaultModel: args.model || provider.getAvailableModels()[0],
        };

        try {
            this.logger.info("Generating UI design for prompt: %s", args.prompt);

            // Call AI provider to generate design code
            const aiResult = await provider.generateDesign(
                args.prompt,
                config,
                { fileId: args.fileId, pageId: args.pageId }
            );

            this.logger.info("AI generation complete: %s tokens, %sms",
                aiResult.tokensUsed, aiResult.duration);

            // Execute the generated code in the plugin context
            const task = new ExecuteCodePluginTask({ code: aiResult.content });
            const executionResult = await this.mcpServer.pluginBridge.executePluginTask(task);

            // Return combined result
            return new TextResponse(JSON.stringify({
                success: true,
                generatedCode: aiResult.content,
                executionResult: executionResult.data?.result,
                executionLog: executionResult.data?.log,
                metadata: {
                    provider: args.provider,
                    model: aiResult.model,
                    tokensUsed: aiResult.tokensUsed,
                    duration: aiResult.duration,
                },
            }, null, 2));

        } catch (error) {
            this.logger.error(error, "Failed to generate UI design");
            return new TextResponse(`Error generating UI design: ${String(error)}`);
        }
    }

    /**
     * Load API key from environment or configuration
     */
    private async loadApiKey(provider: string): Promise<string | null> {
        // Map provider names to environment variable names
        const providerEnvMap: Record<string, string> = {
            anthropic: "ANTHROPIC",
            openai: "OPENAI",
            deepseek: "DEEPSEEK",
        };
        const envName = providerEnvMap[provider] || provider.toUpperCase();
        const envVarName = `PENPOT_MCP_${envName}_API_KEY`;
        return process.env[envVarName] || null;
    }
}
