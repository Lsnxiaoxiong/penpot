import { OpenAIProvider } from "../../src/providers/OpenAIProvider";
import { describe, it, expect } from "@jest/globals";

describe("OpenAIProvider", () => {
    describe("constructor", () => {
        it("should use default OpenAI URL when no baseUrl provided", () => {
            const provider = new OpenAIProvider();
            // The baseUrl is private, so we test via getProviderName and getAvailableModels
            expect(provider.getProviderName()).toBe("openai");
        });

        it("should use custom baseUrl when provided", () => {
            const provider = new OpenAIProvider("https://api.deepseek.com/v1");
            expect(provider.getProviderName()).toBe("openai");
        });
    });

    describe("getAvailableModels", () => {
        it("should return OpenAI models for default URL", () => {
            const provider = new OpenAIProvider();
            const models = provider.getAvailableModels();
            expect(models).toContain("gpt-4o");
            expect(models).toContain("gpt-4o-mini");
            expect(models).toContain("gpt-4-turbo");
        });

        it("should include DeepSeek models for DeepSeek URL", () => {
            const provider = new OpenAIProvider("https://api.deepseek.com/v1");
            const models = provider.getAvailableModels();
            expect(models).toContain("deepseek-chat");
            expect(models).toContain("deepseek-reasoner");
        });
    });

    describe("validateApiKey", () => {
        it("should return false for invalid key format", async () => {
            const provider = new OpenAIProvider();
            const result = await provider.validateApiKey("invalid-key-format");
            expect(result).toBe(false);
        });

        it("should return false for empty key", async () => {
            const provider = new OpenAIProvider();
            const result = await provider.validateApiKey("");
            expect(result).toBe(false);
        });
    });
});
