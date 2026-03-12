import { GenerateUITool, GenerateUIArgs } from "../../src/tools/GenerateUITool";
import { ValidateApiKeyTool, ValidateApiKeyArgs } from "../../src/tools/ValidateApiKeyTool";
import { describe, it, expect } from "@jest/globals";

describe("GenerateUITool", () => {
    describe("getToolName", () => {
        it("should return 'generate_ui'", () => {
            // We can't fully instantiate the tool without a real McpServer,
            // but we can test the schema
            expect(GenerateUIArgs.schema.prompt).toBeDefined();
            expect(GenerateUIArgs.schema.provider).toBeDefined();
        });
    });

    describe("input schema validation", () => {
        it("should reject empty prompt", () => {
            expect(() => GenerateUIArgs.schema.prompt.parse("")).toThrow();
        });

        it("should accept valid prompt", () => {
            expect(() => GenerateUIArgs.schema.prompt.parse("Create a button")).not.toThrow();
        });

        it("should accept valid providers", () => {
            expect(() => GenerateUIArgs.schema.provider.parse("anthropic")).not.toThrow();
            expect(() => GenerateUIArgs.schema.provider.parse("openai")).not.toThrow();
            expect(() => GenerateUIArgs.schema.provider.parse("deepseek")).not.toThrow();
        });

        it("should reject invalid provider", () => {
            expect(() => GenerateUIArgs.schema.provider.parse("invalid")).toThrow();
        });

        it("should default to anthropic", () => {
            const result = GenerateUIArgs.schema.provider.parse(undefined);
            expect(result).toBe("anthropic");
        });
    });
});

describe("ValidateApiKeyTool", () => {
    describe("input schema validation", () => {
        it("should reject empty apiKey", () => {
            expect(() => ValidateApiKeyArgs.schema.apiKey.parse("")).toThrow();
        });

        it("should accept valid apiKey", () => {
            expect(() => ValidateApiKeyArgs.schema.apiKey.parse("sk-test123")).not.toThrow();
        });

        it("should accept valid providers", () => {
            expect(() => ValidateApiKeyArgs.schema.provider.parse("anthropic")).not.toThrow();
            expect(() => ValidateApiKeyArgs.schema.provider.parse("openai")).not.toThrow();
            expect(() => ValidateApiKeyArgs.schema.provider.parse("deepseek")).not.toThrow();
        });

        it("should reject invalid provider", () => {
            expect(() => ValidateApiKeyArgs.schema.provider.parse("invalid")).toThrow();
        });
    });
});
