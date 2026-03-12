# AI UI Generation Guide

This guide explains how to use the AI-powered UI generation feature in Penpot MCP.

## Quick Start

### 1. Configure API Key

Set your AI provider API key as an environment variable:

```bash
# For Anthropic Claude
export PENPOT_MCP_ANTHROPIC_API_KEY=sk-ant-...

# For OpenAI GPT
export PENPOT_MCP_OPENAI_API_KEY=sk-...

# For DeepSeek (OpenAI-compatible)
export PENPOT_MCP_DEEPSEEK_API_KEY=sk-...
```

Or create a `.env` file in the `mcp/` directory:

```bash
PENPOT_MCP_ANTHROPIC_API_KEY=sk-ant-...
PENPOT_MCP_OPENAI_API_KEY=sk-...
PENPOT_MCP_DEEPSEEK_API_KEY=sk-...
```

### 2. Start the MCP Server

```bash
cd mcp
pnpm run bootstrap
```

### 3. Connect the Plugin

1. Open Penpot
2. Navigate to a design file
3. Open Plugins menu
4. Load plugin from `http://localhost:4400/manifest.json`
5. Click "Connect to MCP server"

### 4. Generate UI

Use the `generate_ui` tool with your description:

**Example using Claude Code:**
```bash
claude mcp call generate_ui --prompt "Create a login form with email and password fields"
```

**Example using Claude Desktop:**
Simply ask: "Create a login form with email and password fields"

**Example using API:**
```json
{
  "tool": "generate_ui",
  "arguments": {
    "prompt": "Create a login form with email and password fields, a submit button, and a forgot password link",
    "provider": "anthropic"
  }
}
```

## Available Tools

### generate_ui

Generates UI designs in Penpot based on natural language descriptions.

**Arguments:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prompt | string | Yes | - | Natural language description of the UI |
| provider | string | No | anthropic | AI provider to use (anthropic, openai, or deepseek) |
| model | string | No | - | Specific model to use |
| fileId | string | No | - | Target file ID for context |
| pageId | string | No | - | Target page ID for context |

**Supported Providers:**
- `anthropic` - Anthropic Claude (claude-sonnet-4-5-20250929, claude-opus-4-5-20251106)
- `openai` - OpenAI GPT (gpt-4o, gpt-4o-mini, gpt-4-turbo)
- `deepseek` - DeepSeek (deepseek-chat, deepseek-reasoner) - uses OpenAI-compatible API

**Response:**
```json
{
  "success": true,
  "generatedCode": "...",
  "executionResult": {...},
  "executionLog": "...",
  "metadata": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-5-20250929",
    "tokensUsed": 1234,
    "duration": 2500
  }
}
```

### validate_api_key

Validates an API key for the specified AI provider.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| provider | string | Yes | AI provider (anthropic or openai) |
| apiKey | string | Yes | The API key to validate |

**Response:**
```json
{
  "valid": true,
  "provider": "anthropic",
  "message": "API key is valid"
}
```

## Tips for Better Results

### 1. Be Specific

Include details about:
- Layout (centered, grid, sidebar)
- Colors (hex codes or descriptions)
- Spacing (tight, spacious, 8px grid)
- Content (text, images, buttons)

**Good:** "Create a centered card with blue background, white text, and rounded corners"
**Bad:** "Make a card"

### 2. Use Common UI Patterns

Reference well-known patterns:
- Login form
- Dashboard
- Navigation bar
- Card component
- Modal dialog
- Button group

### 3. Iterate

Start with a basic design, then refine:
1. "Create a button"
2. "Make it larger with a gradient"
3. "Add an icon on the left"

### 4. Specify Dimensions

When size matters:
- "400px wide card"
- "64x64 icon"
- "Full-width header"

## Example Prompts

### Login Form
```
Create a login form with:
- Email input field (full width)
- Password input field (full width)
- "Remember me" checkbox
- Blue primary button "Sign In"
- "Forgot password?" link below the button
Center the form on the page with a light gray card background.
```

### Dashboard
```
Create a dashboard layout with:
- Top navigation bar (60px height) with logo and user menu
- Left sidebar (250px width) with navigation items
- Main content area with 3 statistic cards in a row
- Each card: title, large number, and trend indicator (up/down arrow)
Use a blue and white color scheme.
```

### Button
```
Create a primary button with:
- Blue background (#3B82F6)
- White text "Get Started"
- 16px horizontal padding, 12px vertical
- 8px border radius
- Slightly darker hover state
```

### Card Component
```
Create a card component with:
- Image placeholder at the top (16:9 aspect ratio)
- Title "Card Title" (bold, 18px)
- Description text (gray, 14px)
- Action button at the bottom
- Subtle shadow effect
```

### Using DeepSeek (Cost-Effective)
```bash
# DeepSeek uses OpenAI-compatible API with lower costs
export PENPOT_MCP_DEEPSEEK_API_KEY=sk-...

# Use deepseek-chat for standard generation
claude mcp call generate_ui --provider deepseek --model deepseek-chat --prompt "Create a pricing card with three tiers"

# Use deepseek-reasoner for complex reasoning tasks
claude mcp call generate_ui --provider deepseek --model deepseek-reasoner --prompt "Create a complex data visualization dashboard"
```

## Troubleshooting

### "No API key configured"

**Cause:** Environment variable not set before starting the server.

**Solution:**
```bash
export PENPOT_MCP_ANTHROPIC_API_KEY=sk-ant-...
# Restart the server
pnpm run bootstrap
```

### "Plugin not connected"

**Cause:** The Penpot MCP plugin is not connected.

**Solution:**
1. Ensure the plugin UI is open in Penpot
2. Click "Connect to MCP server" in the plugin
3. Check the browser console for connection status

### Generated code doesn't work

**Possible causes:**
1. Complex prompt - try simpler requests first
2. API returned malformed code - retry the request
3. Plugin API changed - check Penpot version compatibility

**Solution:**
- Simplify your prompt
- Try a different provider (Claude vs GPT vs DeepSeek)
- Check the execution log for error details

### DeepSeek-specific issues

**"Invalid API key" for DeepSeek:**
- Ensure you're using `PENPOT_MCP_DEEPSEEK_API_KEY` (not `OPENAI`)
- DeepSeek keys start with `sk-` (same format as OpenAI)
- Verify key at https://platform.deepseek.com/

**Wrong model for DeepSeek:**
- Use `deepseek-chat` for standard UI generation (non-reasoning mode)
- Use `deepseek-reasoner` for complex problems requiring step-by-step reasoning

### Rate limiting

**Cause:** Too many requests in a short time.

**Solution:**
- Wait a few seconds between requests
- Reduce the frequency of generation requests

## Security Considerations

- **Never commit API keys** to version control
- **Use environment variables** or `.env` files (which are gitignored)
- **Monitor usage** through your AI provider's dashboard
- **Set spending limits** with your provider to avoid unexpected costs

## Cost Estimates

Approximate costs per generation (as of 2024):

| Provider | Model | Avg Tokens | Cost/Request |
|----------|-------|------------|--------------|
| Anthropic | Claude Sonnet | ~2000 | ~$0.02 |
| Anthropic | Claude Opus | ~2000 | ~$0.15 |
| OpenAI | GPT-4o | ~2000 | ~$0.05 |
| OpenAI | GPT-4o-mini | ~2000 | ~$0.003 |

Costs vary based on prompt complexity and response length.

**DeepSeek** (cost-effective alternative):
| Model | Avg Tokens | Cost/Request |
|-------|------------|--------------|
| deepseek-chat | ~2000 | ~$0.0005 |
| deepseek-reasoner | ~2000 | ~$0.001 |

DeepSeek provides OpenAI-compatible API at significantly lower costs.

## Getting Help

- **Documentation:** See README.md for setup instructions
- **Issues:** Report bugs on the Penpot GitHub repository
- **Discord:** Join the Penpot Discord server for community support
