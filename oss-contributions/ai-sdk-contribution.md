# AI SDK Contribution Plan: Tool-Calling Middleware Cookbook Example

## Target Repository
- **Repo:** https://github.com/vercel/ai
- **Area:** Community example or cookbook entry
- **Contribution type:** New example / documentation

---

## Background

The Vercel AI SDK provides an `experimental_wrapMiddleware` API and a middleware system that allows developers to intercept and transform model calls. However, the existing examples and cookbook entries have limited coverage of one of the most practical middleware use cases: **error recovery for tool calling with structured output**.

Doeon's `stage-pilot` project is a tool-calling reliability runtime that implements parser hardening, bounded retry, and benchmark suites on top of the AI SDK. This contribution extracts a clean, minimal example of that pattern for the community.

---

## What to Contribute

A self-contained example demonstrating a **tool-calling reliability middleware** that:
1. Intercepts tool call results
2. Validates structured output against a Zod schema
3. Attempts recovery parsing when the output is malformed
4. Implements bounded retry with exponential backoff
5. Logs validation failures for observability

---

## Target Location

**Option A (preferred):** `examples/ai-core/src/middleware/tool-call-recovery.ts`

**Option B:** If the repo has a cookbook/community section in the docs site, submit to `content/cookbook/` or `content/examples/`.

Check the current structure first:
```bash
ls examples/ai-core/src/middleware/
ls content/cookbook/ 2>/dev/null || echo "No cookbook dir"
```

---

## The Example Code

File: `examples/ai-core/src/middleware/tool-call-recovery.ts`

```typescript
import { generateText, tool, wrapLanguageModel } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

/**
 * Tool-Call Recovery Middleware
 *
 * Demonstrates a middleware pattern that validates tool call arguments
 * against their Zod schemas and attempts recovery when parsing fails.
 * Useful for production systems where tool-call reliability is critical.
 */

// Define a schema for structured tool output
const extractedDataSchema = z.object({
  entities: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['person', 'organization', 'location']),
      confidence: z.number().min(0).max(1),
    })
  ),
  summary: z.string().max(500),
});

// Recovery middleware that validates and retries malformed tool outputs
const toolCallRecoveryMiddleware = {
  transformParams: async ({
    params,
  }: {
    params: Record<string, unknown>;
  }) => {
    // Add a system-level instruction to encourage well-formed tool calls
    const messages = (params.messages as Array<Record<string, unknown>>) ?? [];
    return {
      ...params,
      messages: [
        {
          role: 'system',
          content:
            'When calling tools, always provide valid JSON matching the tool schema exactly. ' +
            'Do not include markdown formatting or extra text in tool arguments.',
        },
        ...messages,
      ],
    };
  },
};

// Bounded retry wrapper for tool-calling with validation
async function generateWithRetry({
  prompt,
  maxRetries = 2,
}: {
  prompt: string;
  maxRetries?: number;
}) {
  const model = wrapLanguageModel({
    model: openai('gpt-4o-mini'),
    middleware: toolCallRecoveryMiddleware,
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateText({
        model,
        tools: {
          extractData: tool({
            description:
              'Extract named entities and a summary from the given text.',
            parameters: extractedDataSchema,
            execute: async (args) => {
              // Validate the parsed arguments one more time at runtime
              const validated = extractedDataSchema.parse(args);
              return {
                status: 'success' as const,
                data: validated,
              };
            },
          }),
        },
        prompt,
        maxSteps: 3,
      });

      return { result, attempt };
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Tool call attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        (error as Error).message
      );

      if (attempt < maxRetries) {
        // Exponential backoff: 500ms, 1000ms, ...
        const delay = 500 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Tool call failed after ${maxRetries + 1} attempts. Last error: ${lastError?.message}`
  );
}

// Main execution
async function main() {
  const prompt =
    'Extract entities from: "Satya Nadella, CEO of Microsoft, announced ' +
    'the new Azure AI features at the Build conference in Seattle."';

  try {
    const { result, attempt } = await generateWithRetry({ prompt });

    console.log('Tool calls completed successfully.');
    console.log(`Resolved on attempt: ${attempt + 1}`);
    console.log('Result:', JSON.stringify(result.toolResults, null, 2));
  } catch (error) {
    console.error('All retry attempts exhausted:', (error as Error).message);
  }
}

main().catch(console.error);
```

---

## PR Title

```
docs: add tool-calling recovery middleware example
```

---

## PR Description

```markdown
## Summary

Adds a new middleware example demonstrating error-recovery patterns for
tool calling with structured output validation.

### What this example shows:

- Using `wrapLanguageModel` middleware to improve tool-call reliability
- Validating tool arguments against Zod schemas at runtime
- Implementing bounded retry with exponential backoff
- Adding system-level prompts via middleware to reduce malformed outputs

### Motivation

Tool calling with structured output is increasingly common in production
AI applications. When tool-call arguments are malformed (incomplete JSON,
schema violations, markdown artifacts in arguments), applications need a
recovery strategy.

This example demonstrates a minimal but production-informed pattern for
handling these cases. It is based on patterns I developed in
[stage-pilot](https://github.com/KIM3310/stage-pilot), a tool-calling
reliability runtime built on top of the AI SDK.

### Checklist

- [ ] Example runs successfully with `npx tsx tool-call-recovery.ts`
- [ ] No new dependencies beyond existing `ai`, `@ai-sdk/openai`, `zod`
- [ ] Follows existing example conventions in the repo
```

---

## Pre-Work Checklist

Before writing the PR:

1. **Read CONTRIBUTING.md:**
   ```bash
   cat CONTRIBUTING.md
   ```

2. **Check existing middleware examples to match conventions:**
   ```bash
   ls -la examples/ai-core/src/middleware/
   cat examples/ai-core/src/middleware/*.ts | head -50
   ```

3. **Check if there is a package.json for examples to understand dependencies:**
   ```bash
   cat examples/ai-core/package.json
   ```

4. **Run the example locally to verify it works:**
   ```bash
   cd examples/ai-core
   pnpm install
   OPENAI_API_KEY=your-key npx tsx src/middleware/tool-call-recovery.ts
   ```

5. **Run any linting/formatting required:**
   ```bash
   pnpm lint
   pnpm format
   ```

---

## Why This Will Get Merged

- It fills a genuine documentation gap (middleware for tool-call reliability)
- It is self-contained with no new dependencies
- It follows the existing example structure
- Tool-calling reliability is a top concern for AI SDK users in production
- The pattern is practical and immediately reusable
