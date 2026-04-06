---
title: "From 25% to 90%: Building a Reliable Tool-Calling Layer for LLM Agents"
published: false
description: "How I built an AI SDK middleware that tripled tool-calling reliability through stage-gated parsing and schema coercion."
tags: ai, llm, typescript, toolcalling
---

# From 25% to 90%: Building a Reliable Tool-Calling Layer for LLM Agents

If you've shipped an LLM agent that calls tools, you already know the dirty secret: **tool calling is the most fragile part of your system.**

The model hallucinates tool names that don't exist. It produces JSON with trailing commas. It drops required arguments or invents optional ones your schema never defined. And when you're chaining multiple tool calls in a single turn, the failure rate compounds fast.

I spent three months building a middleware layer that took tool-calling reliability from 25% to 90% on a 40-case benchmark. This post walks through the problem, the architecture, and the implementation.

## The Baseline: 25% Reliability

I started by measuring. I built a benchmark of 40 tool-calling scenarios across different complexity tiers:

- **Tier 1 (10 cases):** Single tool, simple arguments (`getWeather({ city: "Seoul" })`)
- **Tier 2 (10 cases):** Single tool, nested or array arguments
- **Tier 3 (10 cases):** Multi-tool sequences with dependencies between calls
- **Tier 4 (10 cases):** Ambiguous prompts requiring tool selection reasoning

I ran these against a base setup using Vercel's AI SDK with `streamText` and XML-formatted tool calls from hosted frontier models and open-source runtimes. The result: **10 out of 40 passed end-to-end**. A 25% success rate.

The failure breakdown looked like this:

| Failure Mode | Count | % of Failures |
|---|---|---|
| Malformed XML/JSON in arguments | 11 | 36.7% |
| Wrong tool name selected | 6 | 20.0% |
| Missing required arguments | 5 | 16.7% |
| Extra/hallucinated arguments | 4 | 13.3% |
| Correct call, wrong sequencing | 4 | 13.3% |

The most common failure wasn't some exotic edge case. It was the model producing `{"temperature": 72,}` with a trailing comma, or wrapping a string argument in nested quotes. Mundane parsing failures.

## Why Existing Solutions Fall Short

The standard approaches I tried before building something custom:

**Regex-based parsing.** You write a regex to extract the tool name and arguments from the model's output. This works until the model outputs a tool call inside a markdown code block, or nests XML tags, or includes a literal `>` character in a string argument. Regex is fundamentally the wrong tool for parsing structured output embedded in freeform text.

**Single-pass retry.** When a tool call fails, you feed the error back to the model and ask it to try again. This works sometimes, but it burns tokens on every retry, the model often makes the same mistake twice, and you have no budget control. I've seen retry loops consume 15K tokens to fix a missing comma.

**JSON mode / structured output.** Provider-level JSON mode helps, but it doesn't solve tool *selection* errors, doesn't handle multi-tool sequences, and isn't available across all models. You're coupling your reliability strategy to a single provider's feature.

None of these compose well together, and none of them give you observability into *where* the failure happened.

## The Stage-Gated Approach

StagePilot decomposes tool-call processing into four sequential stages, each with a clear contract:

```
┌─────────────────────────────────────────────────────┐
│                   LLM Response                      │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Stage 1: Parse │  Extract tool name + raw args
              │  (XML/JSON)     │  from freeform model output
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Stage 2: Coerce│  Cast types, fill defaults,
              │  (Schema)       │  strip unknown fields
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Stage 3: Retry │  Bounded retry with error
              │  (Budget-aware) │  injection (max 2 attempts)
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Stage 4: Judge │  Validate final output
              │  (Pass/Fail)    │  against tool contract
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Tool Execution │
              └─────────────────┘
```

The key insight: **each stage can independently recover from specific failure classes.** The parser handles malformed syntax. The coercion layer handles type mismatches and missing defaults. The retry layer handles cases where the model needs a second chance. The judge prevents silent failures from propagating.

This means a trailing comma in JSON (Stage 1 fix) never reaches the retry loop (Stage 3), saving tokens and latency.

## Implementation

StagePilot ships as AI SDK middleware. You wrap your language model, and the stages run automatically on every tool call:

```typescript
import { morphXmlToolMiddleware } from "@ai-sdk-tool/parser";
import { wrapLanguageModel, streamText } from "ai";
import { z } from "zod";

// Wrap the model with StagePilot middleware
const baseModel = /* any AI SDK-compatible model */;

const model = wrapLanguageModel({
  model: baseModel,
  middleware: morphXmlToolMiddleware({
    // Stage 1: Parser config
    parser: {
      format: "xml",          // or "json"
      recoveryMode: "lenient" // attempt partial parse on malformed input
    },
    // Stage 2: Schema coercion
    coercion: {
      fillDefaults: true,     // inject default values for missing optional args
      stripUnknown: true,     // remove hallucinated arguments
      castTypes: true         // "72" -> 72 for number fields
    },
    // Stage 3: Retry budget
    retry: {
      maxAttempts: 2,
      budgetTokens: 4000     // hard cap on retry token spend
    }
  })
});

// Use it like any AI SDK model
const result = await streamText({
  model,
  tools: {
    getWeather: {
      description: "Get current weather for a city",
      parameters: z.object({
        city: z.string().describe("City name"),
        units: z.enum(["celsius", "fahrenheit"]).default("celsius")
      })
    }
  },
  prompt: "What's the weather like in Seoul right now?"
});
```

### Stage 1: The Parser

The parser doesn't use regex. It builds a lightweight state machine that tolerates common model quirks:

```typescript
// Internal: how the parser handles malformed XML
// Input from model: <tool_call name="getWeather">{"city": "Seoul",}</tool_call>
//                                                              ^ trailing comma

// Step 1: Extract tool name from tag attribute -> "getWeather" (valid)
// Step 2: Extract raw argument string -> '{"city": "Seoul",}'
// Step 3: Attempt JSON.parse -> fails
// Step 4: Recovery mode: strip trailing commas, fix quotes -> '{"city": "Seoul"}'
// Step 5: JSON.parse -> { city: "Seoul" } (recovered)
```

The recovery mode handles the 8 most common JSON malformations I found in production logs: trailing commas, single quotes, unquoted keys, escaped unicode that shouldn't be escaped, nested string quotes, missing closing braces (inferred from context), BOM characters, and control characters in string values.

### Stage 2: Schema Coercion

Once we have a parsed object, we validate it against the Zod schema you defined in your tool:

```typescript
// Tool schema expects: { city: string, units: "celsius" | "fahrenheit" }
// Model produced:      { city: "Seoul", units: "metric", temp_format: "C" }

// Coercion steps:
// 1. "metric" is not in enum -> attempt fuzzy match -> no match -> use default "celsius"
// 2. "temp_format" is not in schema -> strip it (stripUnknown: true)
// 3. Result: { city: "Seoul", units: "celsius" }
```

This handles 16.7% of our baseline failures (missing required arguments) and 13.3% (hallucinated arguments) without burning a single retry token.

### Stage 3: Bounded Retry

If Stages 1 and 2 can't produce a valid tool call, we inject a structured error message back to the model:

```typescript
// Error injection prompt (internal)
const retryPrompt = `Your tool call to "${toolName}" failed validation:
- Argument "date" is required but was not provided
- Argument "city" must be a string, got number

Here is the tool schema:
${JSON.stringify(toolSchema, null, 2)}

Please produce a corrected tool call.`;
```

The budget cap (`budgetTokens: 4000`) prevents runaway retry loops. If the model can't fix the call within budget, Stage 4 receives a structured failure instead of a silent garbage result.

### Stage 4: The Judge

The final stage validates the complete tool call against its contract. If validation fails after retries are exhausted, the middleware emits a typed error with full diagnostics:

```typescript
// Judge output on failure
{
  status: "rejected",
  toolName: "getWeather",
  stage: "judge",
  errors: [
    { path: "$.date", message: "required field missing", attempts: 2 }
  ],
  tokensBurned: 3847,
  rawModelOutput: "<tool_call name=\"getWeather\">..."
}
```

This gives you observability. You know exactly which stage failed, how many tokens were spent trying to recover, and what the model actually produced. No more guessing why your agent silently returned nonsense.

## Results

After integrating the middleware, I re-ran the 40-case benchmark:

| Configuration | Pass Rate | Avg Tokens/Call |
|---|---|---|
| Baseline (no middleware) | 25.0% (10/40) | 1,200 |
| Parser only (Stage 1) | 52.5% (21/40) | 1,200 |
| Parser + Coercion (1+2) | 72.5% (29/40) | 1,200 |
| Full pipeline (1+2+3+4) | **90.0% (36/40)** | 1,850 |

The parser alone doubled reliability by fixing malformed syntax. Coercion brought it to 72.5% by handling type and argument errors. The full pipeline with bounded retry closed it to 90%.

The 4 remaining failures:

1. **Model selected a semantically wrong tool** (2 cases) -- the model called `searchProducts` when it should have called `searchInventory`. This is a reasoning error, not a parsing error. No amount of middleware can fix wrong tool selection.
2. **Multi-step dependency error** (1 case) -- the model produced correct individual calls but in the wrong order.
3. **Ambiguous prompt, no correct answer** (1 case) -- the benchmark case itself was arguably under-specified.

Token overhead averaged ~54% increase per call. For the cases where retry was triggered (11 of 40), the average was 2,400 extra tokens. For the 29 cases that passed at Stages 1-2, the overhead was near zero -- just the coercion logic running on the parsed output.

## What's Next: Closing the Last 10%

The remaining failures are reasoning errors, not parsing errors. Middleware can't fix a model that picks the wrong tool.

My current approach: **post-training plus benchmarked runtime recovery.** The runtime already fixes malformed or schema-wrong tool calls; the open question is how much additional first-attempt quality we can recover by teaching an open model to emit cleaner tool calls before the runtime has to intervene.

Those experiments live in [tool-call-finetune-lab](https://github.com/KIM3310/tool-call-finetune-lab), which packages a QLoRA post-training lab around Qwen2.5-7B with BFCL-aligned evaluation harnesses and a Kaggle-ready notebook path. The goal is not to claim frontier-scale model training; it is to study how much runtime repair work can be removed by better first-pass tool-call behavior.

## Links

- **npm:** [@ai-sdk-tool/parser](https://www.npmjs.com/package/@ai-sdk-tool/parser)
- **GitHub:** [KIM3310/stage-pilot](https://github.com/KIM3310/stage-pilot)
- **Fine-tuning experiments:** [KIM3310/tool-call-finetune-lab](https://github.com/KIM3310/tool-call-finetune-lab)
- **AI SDK docs:** [sdk.vercel.ai/docs/ai-sdk-core/middleware](https://sdk.vercel.ai/docs/ai-sdk-core/middleware)

---

*If you're building LLM agents and fighting tool-call reliability, I'd like to hear what failure modes you're seeing. Reach out on [GitHub](https://github.com/KIM3310) or [LinkedIn](https://linkedin.com/in/doeonkim).*
