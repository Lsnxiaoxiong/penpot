import { z } from "zod";
import "reflect-metadata";
import { Tool } from "../Tool";
import type { ToolResponse } from "../ToolResponse";
import { TextResponse } from "../ToolResponse";
import { PenpotMcpServer } from "../PenpotMcpServer";
import { getProvider } from "../providers";

/**
 * Arguments class for ValidateApiKeyTool
 */
export class ValidateApiKeyArgs {
    static schema = {
        provider: z
            .enum(["anthropic", "openai"])
            .describe("AI provider to validate"),
        apiKey: z
            .string()
            .min(1, "API key cannot be empty")
            .describe("The API key to validate"),
    };

    provider!: "anthropic" | "openai";
    apiKey!: string;
}

/**
 * Tool for validating API keys before saving them
 */
export class ValidateApiKeyTool extends Tool<ValidateApiKeyArgs> {
    constructor(mcpServer: PenpotMcpServer) {
        super(mcpServer, ValidateApiKeyArgs.schema);
    }

    public getToolName(): string {
        return "validate_api_key";
    }

    public getToolDescription(): string {
        return (
            "Validates an API key for the specified AI provider. " +
            "Returns whether the key is valid and can be used for AI generation."
        );
    }

    protected async executeCore(args: ValidateApiKeyArgs): Promise<ToolResponse> {
        const provider = getProvider(args.provider);

        try {
            this.logger.info("Validating API key for provider: %s", args.provider);

            const isValid = await provider.validateApiKey(args.apiKey);

            return new TextResponse(JSON.stringify({
                valid: isValid,
                provider: args.provider,
                message: isValid
                    ? "API key is valid"
                    : "API key validation failed. Please check your key and try again.",
            }, null, 2));

        } catch (error) {
            this.logger.error(error, "API key validation error");
            return new TextResponse(JSON.stringify({
                valid: false,
                provider: args.provider,
                error: error instanceof Error ? error.message : String(error),
            }, null, 2));
        }
    }
}
