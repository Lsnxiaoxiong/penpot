import { AIProvider, AIProviderConfig, AIGenerationResult } from "./AIProvider";

export class AnthropicProvider extends AIProvider {
    private readonly baseUrl: string = "https://api.anthropic.com/v1";

    getProviderName(): string {
        return "anthropic";
    }

    getAvailableModels(): string[] {
        return [
            "claude-sonnet-4-5-20250929",
            "claude-opus-4-5-20251106",
        ];
    }

    async validateApiKey(apiKey: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    async generateDesign(
        prompt: string,
        config: AIProviderConfig,
        context?: { fileId?: string; pageId?: string }
    ): Promise<AIGenerationResult> {
        const startTime = Date.now();
        const model = config.defaultModel;

        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(prompt, context);

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: "POST",
            headers: {
                "x-api-key": config.apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model,
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userPrompt },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const endTime = Date.now();

        const content = data.content?.[0]?.text || "";
        const tokensUsed = data.usage?.total_tokens || 0;

        // Extract code from markdown code blocks if present
        const codeMatch = content.match(/```(?:javascript|js)?\s*([\s\S]*?)```/);
        const extractedCode = codeMatch ? codeMatch[1].trim() : content.trim();

        return {
            content: extractedCode,
            model,
            tokensUsed,
            duration: endTime - startTime,
            rawResponse: data,
        };
    }
}
