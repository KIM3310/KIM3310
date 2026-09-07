# Selected implementation paths

This index follows the same order as the profile and the selected-work gallery. Start with the repository README for supported runtime versions and verification commands.

| Order | Project | Implementation to inspect | Design question |
|---:|---|---|---|
| 1 | [AegisOps](https://github.com/KIM3310/AegisOps) | `server/lib/schemas.ts`, `server/lib/sessionStore.ts`, replay fixtures | Can a complete AI workflow remain understandable when inputs or persisted records fail? |
| 2 | [MemoryFlow Lab](https://github.com/KIM3310/memoryflow-lab) | `src/memoryflow/simulator.py`, `analysis.py`, `evidence/` | Which placement decisions remain feasible under explicit capacity and transfer constraints? |
| 3 | [Nexus-Hive](https://github.com/KIM3310/Nexus-Hive) | `policy/engine.py`, `graph/nodes.py`, warehouse adapters | Does a policy decision actually control query execution? |
| 4 | [StagePilot](https://github.com/KIM3310/stage-pilot) | `src/stagepilot/benchmark.ts`, per-case benchmark report, `NOTICE.md` | How do recovery and retry budgets change the outcomes of controlled malformed inputs? |
| 5 | [Secure XL2HWP](https://github.com/KIM3310/secure-xl2hwp-local) | `app/services/excel_processor.py`, `export_service.py`, template engine | Can repeated document-processing runs produce traceable outputs without overwriting earlier work? |

These are complementary implementation examples, not a ranking of repository size. Synthetic fixture outcomes do not establish model accuracy, customer usage, or production reliability. StagePilot's upstream attribution and MemoryFlow's measurement boundary are part of the technical reading path.
