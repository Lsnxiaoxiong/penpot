import { createLogger } from "../logger";

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
        return `You are an expert UI designer working with Penpot, an open-source design tool.
Your task is to generate JavaScript code that creates UI designs based on user descriptions.

## Available Penpot API Functions:

1. \`penpot.createShape(type)\` - Create a shape (rect, circle, text, frame, group, path, bool, svg-raw)
   - Returns a shape object with methods: .setName(), .setX(), .setY(), .setWidth(), .setHeight(), .setFill(), .setStroke(), .setCornerRadius()

2. \`penpot.currentPage\` - Access the current page
   - Methods: .addChild(shape), .getShapes(), .getSelectedShapes()

3. \`penpot.viewport\` - Access viewport methods
   - Methods: .centerOn(shape), .zoomToFit()

## Design Principles:

1. Use modern UI design patterns
2. Apply appropriate spacing (8px grid system)
3. Use semantic naming for shapes
4. Consider accessibility (contrast, sizing)
5. Follow Penpot best practices

## Output Format:

Return ONLY the JavaScript code, no explanations. The code should be executable in the Penpot plugin context.

Example:
\`\`\`javascript
const frame = penpot.createShape("frame");
frame.setName("Login Form");
frame.setWidth(400);
frame.setHeight(300);

const title = penpot.createShape("text");
title.setName("Title");
title.setTextContent("Login");
title.setX(150);
title.setY(50);
title.setFontSize(24);

penpot.currentPage.addChild(frame);
penpot.currentPage.addChild(title);

console.log("Created login form");
\`\`\``;
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
