# Selected implementation paths

The profile and gallery use the same reading order. Public repositories expose implementation and tests; the two private projects expose summaries without source links.

| Order | Project | Design question |
|---:|---|---|
| 1 | [AegisOps](https://github.com/KIM3310/AegisOps) | Can a complete AI workflow recover from invalid persisted state? |
| 2 | [IdleMesh — private source](https://kim3310.github.io/doeon-kim-portfolio/#project-idlemesh) | Can a late result from an earlier attempt corrupt retried work? |
| 3 | [MemoryFlow Lab](https://github.com/KIM3310/memoryflow-lab) | Which placement choices remain feasible under memory and transfer constraints? |
| 4 | [Nexus-Hive](https://github.com/KIM3310/Nexus-Hive) | Does a policy decision actually stop query execution? |
| 5 | [StagePilot](https://github.com/KIM3310/stage-pilot) | How do bounded retries change controlled malformed-input outcomes? |
| 6 | [Memory Change Gate — private source](https://kim3310.github.io/doeon-kim-portfolio/#project-memory-test-master-change-gate) | Can an exported snapshot reconstruct the same approval and rollback decision? |
| 7 | [Secure XL2HWP](https://github.com/KIM3310/secure-xl2hwp-local) | Can repeated document exports remain traceable without overwriting earlier work? |
| 8 | [Tool-Call Fine-Tune Lab](https://github.com/KIM3310/tool-call-finetune-lab) | Can data leakage or a permissive scorer make evaluation misleading? |

Synthetic outcomes do not establish model quality, customer adoption, or production reliability. StagePilot retains upstream attribution. MemoryFlow distinguishes analytical and measured experiments. IdleMesh has single-machine recovery evidence, and Fine-Tune Lab has CPU evaluator-contract evidence rather than a verified trained-model checkpoint.
