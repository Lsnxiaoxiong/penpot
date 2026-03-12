/**
 * Result of a plugin task execution.
 *
 * Contains the outcome status of a task and any additional result data.
 */
export interface PluginTaskResult<T> {
    /**
     * Optional result data from the task execution.
     */
    data?: T;
}

/**
 * Request message sent from server to plugin.
 *
 * Contains a unique identifier, task name, and parameters for execution.
 */
export interface PluginTaskRequest {
    /**
     * Unique identifier for request/response correlation.
     */
    id: string;

    /**
     * The name of the task to execute.
     */
    task: string;

    /**
     * The parameters for task execution.
     */
    params: any;
}

/**
 * Response message sent from plugin back to server.
 *
 * Contains the original request ID and the execution result.
 */
export interface PluginTaskResponse<T> {
    /**
     * Unique identifier matching the original request.
     */
    id: string;

    /**
     * Whether the task completed successfully.
     */
    success: boolean;

    /**
     * Optional error message if the task failed.
     */
    error?: string;

    /**
     * The result of the task execution.
     */
    data?: T;
}

/**
 * Parameters for the executeCode task.
 */
export interface ExecuteCodeTaskParams {
    /**
     * The JavaScript code to be executed.
     */
    code: string;
}

/**
 * Result data for the executeCode task.
 */
export interface ExecuteCodeTaskResultData<T> {
    /**
     * The result of the executed code, if any.
     */
    result: T;

    /**
     * Captured console output during code execution.
     */
    log: string;
}

// ============================================================
// AI UI Generator Types
// ============================================================

/**
 * Parameters for the generate-ui task.
 */
export interface GenerateUITaskParams {
    /**
     * Natural language description of the UI to generate.
     */
    prompt: string;

    /**
     * AI provider to use: 'anthropic' or 'openai'.
     */
    provider: 'anthropic' | 'openai';

    /**
     * Optional: Model name (uses provider default if not specified).
     */
    model?: string;

    /**
     * Optional: File ID context.
     */
    fileId?: string;

    /**
     * Optional: Page ID context.
     */
    pageId?: string;
}

/**
 * Result data from generate-ui task execution.
 */
export interface GenerateUITaskResultData {
    /**
     * Whether the generation was successful.
     */
    success: boolean;

    /**
     * Generated JavaScript/ClojureScript code.
     */
    generatedCode: string;

    /**
     * Result from executing the generated code.
     */
    executionResult?: any;

    /**
     * Execution log from plugin.
     */
    executionLog?: string;

    /**
     * AI response metadata.
     */
    metadata: {
        provider: string;
        model: string;
        tokensUsed: number;
        duration: number;
    };
}

/**
 * Parameters for validate-api-key task.
 */
export interface ValidateApiKeyTaskParams {
    /**
     * AI provider to validate.
     */
    provider: 'anthropic' | 'openai';

    /**
     * The API key to validate.
     */
    apiKey: string;
}

/**
 * Result data from validate-api-key task.
 */
export interface ValidateApiKeyTaskResultData {
    /**
     * Whether the API key is valid.
     */
    valid: boolean;

    /**
     * Provider name.
     */
    provider: string;

    /**
     * Optional message or error details.
     */
    message?: string;

    /**
     * Optional error details.
     */
    error?: string;
}
