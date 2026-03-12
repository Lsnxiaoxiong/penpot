export { AIProvider, AIProviderConfig, AIGenerationResult } from "./AIProvider";
export { AnthropicProvider } from "./AnthropicProvider";
export { OpenAIProvider } from "./OpenAIProvider";

/**
 * Factory function to get the appropriate provider instance
 */
export function getProvider(name: string): AIProvider {
    switch (name) {
        case "anthropic":
            return new AnthropicProvider();
        case "openai":
            return new OpenAIProvider();
        default:
            throw new Error(`Unknown AI provider: ${name}`);
    }
}
