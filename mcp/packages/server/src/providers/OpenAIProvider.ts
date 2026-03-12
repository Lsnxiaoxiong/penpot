import { AIProvider, AIProviderConfig, AIGenerationResult } from "./AIProvider";

export class OpenAIProvider extends AIProvider {
    private readonly baseUrl: string;

    constructor(baseUrl?: string) {
        super();
        this.baseUrl = baseUrl || "https://api.openai.com/v1";
    }

    getProviderName(): string {
        return "openai";
    }

    getAvailableModels(): string[] {
        // For custom OpenAI-compatible endpoints, return common models
        if (this.baseUrl !== "https://api.openai.com/v1") {
            return [
                "deepseek-chat",
                "deepseek-reasoner",
                "gpt-4o",
                "gpt-4o-mini",
                "gpt-4-turbo",
            ];
        }
        return [
            "gpt-4o",
            "gpt-4o-mini",
            "gpt-4-turbo",
        ];
    }

    async validateApiKey(apiKey: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
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

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${config.apiKey}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: 4096,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const endTime = Date.now();

        const content = data.choices?.[0]?.message?.content || "";
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
