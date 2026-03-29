# Interview Preparation: AWS Korea AI/ML Specialist SA

## Core Positioning

Position yourself as:

> a customer-facing applied AI architect who can turn business problems into reviewable, scalable GenAI systems.

This should sound like **field architecture + working prototypes + safe rollout**, not pure ML research.

---

## Likely Interview Themes

1. Customer engagement and working backwards
2. GenAI / agent system design
3. Cloud architecture tradeoffs
4. AI/ML deployment safety and observability
5. Communication and leadership

---

## Topic 1: Working Backwards from Customer Problems

**Likely Questions**

- How do you approach a customer who wants to "do GenAI" but has unclear requirements?
- How do you turn a vague business pain point into a concrete solution plan?

**Answer Framework**

1. Clarify user, workflow, data boundaries, and business metric.
2. Identify the highest-value workflow, not the biggest demo.
3. Choose the narrowest viable pilot with clear success metrics.
4. Add reliability, observability, security, and fallback before scale.

---

## Topic 2: GenAI Architecture

**Likely Questions**

- How would you design an enterprise agent system?
- What matters most when deploying tool-using LLM systems?
- How would you help a customer choose between orchestration patterns?

**Your Best Proof**

- `stage-pilot` for reliability and tool-calling
- `enterprise-llm-adoption-kit` for governance and rollout
- `AegisOps` for multimodal incident workflows

**Key line**

> "My instinct is to design the failure path before trusting the happy path."

---

## Topic 3: Observability, Security, and Governance

**Likely Questions**

- How do you keep an AI system safe in production?
- What do you monitor?
- How do you talk to security or compliance stakeholders?

**Talking Points**

- Access control
- auditability
- evaluation baselines
- latency and cost monitoring
- model / tool failure taxonomy
- human review for sensitive actions

Use `enterprise-llm-adoption-kit` as the primary proof.

---

## Topic 4: Multi-Cloud and Competitive Questions

**Likely Questions**

- Why AWS if you also work across Snowflake and Databricks?
- How do you handle multi-platform customer environments?

**Best answer**

- Enterprise customers are multi-platform in reality.
- Your advantage is not single-vendor dogmatism but the ability to place AWS credibly inside that reality.
- The architecture skill is understanding where AWS should be the control plane, model platform, workflow runtime, or integration layer.

---

## Topic 5: Why AWS Korea

**Good answer**

- AWS gives you the broadest field architecture surface across customers and industries.
- Korea is a strong environment for data + AI transformation in manufacturing, finance, and enterprise software.
- You want to help customers move from GenAI curiosity to deployable systems with strong operational discipline.

---

## Questions to Ask the Interviewer

1. "For AWS Korea's AI/ML Specialist team, what kinds of customer conversations are most common right now: GenAI POCs, model deployment, platform integration, or modernization?"
2. "How much of the role is architecture advisory versus hands-on prototype building?"
3. "What distinguishes strong Specialist SA candidates in Korea beyond general cloud knowledge?"
4. "How closely does the Korea team work with worldwide GenAI specialists and product teams?"
5. "Which industries in Korea are creating the strongest demand for AI/ML Specialist SA support today?"
