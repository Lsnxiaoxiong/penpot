import { AnthropicProvider } from "../../src/providers/AnthropicProvider";
import { describe, it, expect } from "@jest/globals";

describe("AnthropicProvider", () => {
    describe("getProviderName", () => {
        it("should return 'anthropic'", () => {
            const provider = new AnthropicProvider();
            expect(provider.getProviderName()).toBe("anthropic");
        });
    });

    describe("getAvailableModels", () => {
        it("should return supported Claude models", () => {
            const provider = new AnthropicProvider();
            const models = provider.getAvailableModels();
            expect(models).toContain("claude-sonnet-4-5-20250929");
            expect(models).toContain("claude-opus-4-5-20251106");
        });
    });

    describe("validateApiKey", () => {
        it("should return false for invalid key format", async () => {
            const provider = new AnthropicProvider();
            const result = await provider.validateApiKey("invalid-key");
            expect(result).toBe(false);
        });

        it("should return false for empty key", async () => {
            const provider = new AnthropicProvider();
            const result = await provider.validateApiKey("");
            expect(result).toBe(false);
        });

        it("should return false for key without sk-ant prefix", async () => {
            const provider = new AnthropicProvider();
            const result = await provider.validateApiKey("wrong-prefix-key");
            expect(result).toBe(false);
        });
    });
});
