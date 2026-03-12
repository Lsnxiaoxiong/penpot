import { createLogger } from "../logger";
import { UI_GENERATION_SYSTEM_PROMPT } from "../prompts/ui-generation-prompt";

/**
 * Result from an AI generation request
 */
export interface AIGenerationResult {
    /** Generated content (JavaScript/ClojureScript code) */
    content: string;
    /** Model that generated the content */
    model: string;
    /** Number of tokens used */
    tokensUsed: number;
    /** Generation duration in milliseconds */
    duration: number;
    /** Raw API response for debugging */
    rawResponse?: any;
}

/**
 * Configuration for an AI provider
 */
export interface AIProviderConfig {
    /** API key for authentication */
    apiKey: string;
    /** Base URL for the API */
    baseUrl?: string;
    /** Default model to use */
    defaultModel: string;
}

/**
 * Protocol for AI providers (Anthropic, OpenAI, etc.)
 */
export abstract class AIProvider {
    protected readonly logger = createLogger(this.constructor.name);

    /**
     * The provider name (e.g., 'anthropic', 'openai')
     */
    abstract getProviderName(): string;

    /**
     * List of available models for this provider
     */
    abstract getAvailableModels(): string[];

    /**
     * Generate UI design code from a natural language prompt
     *
     * @param prompt - The natural language description
     * @param config - Provider configuration
     * @param context - Optional context about the current file/page
     */
    abstract generateDesign(
        prompt: string,
        config: AIProviderConfig,
        context?: { fileId?: string; pageId?: string }
    ): Promise<AIGenerationResult>;

    /**
     * Validate an API key by making a minimal API call
     */
    abstract validateApiKey(apiKey: string): Promise<boolean>;

    /**
     * Build the system prompt for UI generation
     */
    protected buildSystemPrompt(): string {
        return UI_GENERATION_SYSTEM_PROMPT;
    }

    /**
     * Build the user prompt with context
     */
    protected buildUserPrompt(
        prompt: string,
        context?: { fileId?: string; pageId?: string }
    ): string {
        let userPrompt = `Create a UI design with the following requirements:\n\n${prompt}`;

        if (context?.fileId || context?.pageId) {
            userPrompt += `\n\nContext:`;
            if (context.fileId) userPrompt += `\n- File ID: ${context.fileId}`;
            if (context.pageId) userPrompt += `\n- Page ID: ${context.pageId}`;
        }

        userPrompt += `\n\nGenerate the JavaScript code to create this design.`;

        return userPrompt;
    }
}
