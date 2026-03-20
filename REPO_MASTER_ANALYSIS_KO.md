# GitHub 레포 총분석 리포트

기준: GitHub 전체 33개 레포(활성/아카이브/비공개 포함) + 로컬 clone/README 표면 분석
작성일: 2026-03-23

## 1. 전체 진단

- 현재 포트폴리오의 중심축은 **운영형 AI 시스템 / 플랫폼·백엔드 / 데이터 거버넌스 / 제조·의료 도메인 응용**이다.
- 가장 강한 active flagship은 `stage-pilot`, `AegisOps`, `enterprise-llm-adoption-kit`, `lakehouse-contract-lab`, `retina-scan-ai`, `ops-reliability-workbench`, `memory-test-master-change-gate`다.
- 아카이브된 레포 중 일부는 이미 통합 완료 후 삭제된 레포(`gemini-cli-tool-runtime`→`ogx`, `advisor-review-desk`→`signal-risk-lab`, `scanner-field-response`→`fab-ops-yield-control-tower`)는 active inventory에서 제거했다.
- 앞으로 품질을 더 올리려면 개별 레포 개선도 중요하지만, **공용 리소스/계약/리뷰 surface 통합**이 더 큰 효율을 만든다.

## 2. 공용 리소스 통합 제안

1. **Review Bundle 표준화**: `ops-reliability-workbench`, `memory-test-master-change-gate`, `regulated-case-workbench`, `AegisOps`, `the-logistics-prophet`의 export/manifest/checksum 구조를 공용 패턴으로 묶기.
2. **Approval / Audit 공통 모듈화**: 승인 절차, signed export, audit log, owner sign-off 흐름을 `regulated-case-workbench`, `fab-ops-yield-control-tower`, `memory-test-master-change-gate` 사이에서 재사용 가능하게 정리.
3. **Data Contract / Quality Gate 공유**: `lakehouse-contract-lab`, `Nexus-Hive`, `signal-risk-lab`, `memory-test-master-change-gate`, `the-logistics-prophet`에 공통 데이터 계약/품질 검증 라이브러리 도입.
4. **Operator UI 리소스 통합**: `AegisOps`, `twincity-ui`, `ops-reliability-workbench`, `fab-ops-yield-control-tower`에서 card, status pill, decision board, review surface UI 패턴을 통합.
5. **Deploy Supervisor 재사용**: public deploy supervisor/launch agent 구조를 Streamlit 기반 레포에 공통으로 적용.
6. **Vision 보고서 공통화**: `retina-scan-ai`, `weld-defect-vision`의 severity/report/disclaimer/report pack 구조를 공통 모듈로 합치기.

## 3. 레포별 상세 분석

### KIM3310
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 프로필 허브 / 포트폴리오 관문
- **주요 도구/스택**: Markdown, GitHub profile README, portfolio linking
- **무엇을 하는 레포인가**: GitHub profile hub for recruiter review order, target-company fit, and flagship proof paths.
- **현재 가치/강점**: 프로필 허브로서 전체 포트폴리오의 진입점 역할을 한다.
- **개선하면 더 좋아질 점**: Pinned repo 순서와 요약 문구를 직무별로 분기하면 더 강해진다.
- **통합하면 좋은 리소스/레포**: doeon-kim-portfolio, MASTER_PROFILE_KO.md, 각 brief 문서와 연동
- **링크**: https://github.com/KIM3310/KIM3310
- **홈페이지/데모**: https://kim3310.github.io/doeon-kim-portfolio/

### Nexus-Hive
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: governed analytics / NL-to-SQL BI copilot
- **주요 도구/스택**: Python, FastAPI, warehouse-style analytics, audited query review
- **무엇을 하는 레포인가**: Multi-agent BI copilot: NL-to-SQL with policy checks, audit trails, and Chart.js visualization on a local Ollama + FastAPI stack
- **현재 가치/강점**: 데이터·분석·거버넌스 축에서 포트폴리오 대표성이 높다.
- **개선하면 더 좋아질 점**: 실제 demo dataset과 metric certification board를 더 추가하면 좋다.
- **통합하면 좋은 리소스/레포**: lakehouse-contract-lab, signal-risk-lab, enterprise-llm-adoption-kit와 결합 가치 높음
- **링크**: https://github.com/KIM3310/Nexus-Hive
- **홈페이지/데모**: https://nexus-hive.pages.dev

### twincity-ui
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 디지털 트윈형 ops console
- **주요 도구/스택**: Next.js, TypeScript, spatial UI, report APIs
- **무엇을 하는 레포인가**: Next.js digital twin ops console — spatial events, dispatch, SLA reporting
- **현재 가치/강점**: 공간 이벤트/dispatch/handoff 흐름을 UI 관점에서 보여준다.
- **개선하면 더 좋아질 점**: 지도/도면 데이터 샘플과 role-based walkthrough를 추가하면 더 강해진다.
- **통합하면 좋은 리소스/레포**: AegisOps, fab-ops-yield-control-tower, ops-reliability-workbench와 UI 리소스 통합 가능
- **링크**: https://github.com/KIM3310/twincity-ui
- **홈페이지/데모**: https://twincity-ui.pages.dev

### stage-pilot
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: tool-calling reliability runtime
- **주요 도구/스택**: TypeScript, benchmark suite, parser recovery, runtime API
- **무엇을 하는 레포인가**: Tool-calling reliability middleware for AI SDK - parser hardening, bounded retry, benchmark suite, and workflow orchestration
- **현재 가치/강점**: AI 시스템 신뢰성 측면에서 가장 강한 flagship 중 하나다.
- **개선하면 더 좋아질 점**: 대형 benchmark dataset과 hosted review dashboard를 붙이면 더 좋아진다.
- **통합하면 좋은 리소스/레포**: ops-reliability-workbench, dv-regression-lab, ogx와 공용 runtime/benchmark 리소스화 가능
- **링크**: https://github.com/KIM3310/stage-pilot
- **홈페이지/데모**: https://stage-pilot.pages.dev

### honeypot
- **상태**: 활성 / fork / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: AI-assisted handover generator
- **주요 도구/스택**: Python backend, React/Vite frontend, retrieval workflow, document processing
- **무엇을 하는 레포인가**: AI-assisted handover document generator with Azure integration, retrieval-backed Q&A, and web security controls
- **현재 가치/강점**: 문서 기반 workflow와 handoff 구조를 잘 보여준다.
- **개선하면 더 좋아질 점**: 실제 문서 템플릿 세트와 보안 정책 모드가 추가되면 더 실무적이다.
- **통합하면 좋은 리소스/레포**: Upstage-DocuAgent와 문서 파이프라인/추출 유틸 통합 가능
- **링크**: https://github.com/KIM3310/honeypot
- **홈페이지/데모**: https://honeypot-proto.vercel.app

### the-logistics-prophet
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 물류 control tower
- **주요 도구/스택**: Python, Streamlit, ML scoring, SHAP, semantic layer
- **무엇을 하는 레포인가**: Logistics control tower with delay prediction, SHAP explainability, and Streamlit ops console
- **현재 가치/강점**: 예측+설명+운영 콘솔을 묶은 control tower 성격이 강하다.
- **개선하면 더 좋아질 점**: carrier integration mock과 scenario gallery를 더 넣으면 좋다.
- **통합하면 좋은 리소스/레포**: ops-reliability-workbench, lakehouse-contract-lab과 review/export contract 통합 추천
- **링크**: https://github.com/KIM3310/the-logistics-prophet
- **홈페이지/데모**: https://the-logistics-prophet.pages.dev

### weld-defect-vision
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 산업 비전 검사 시스템
- **주요 도구/스택**: Python, CV/CNN, FastAPI, reporting, chatbot
- **무엇을 하는 레포인가**: Welding defect detection CV system with CNN classifier, severity scoring, automated inspection reports, and Streamlit dashboard
- **현재 가치/강점**: 산업 AI + 검사 보고 + severity scoring 조합이 분명하다.
- **개선하면 더 좋아질 점**: 실제 defect dataset card와 calibration report를 추가하면 더 강해진다.
- **통합하면 좋은 리소스/레포**: retina-scan-ai와 vision/reporting 공통 컴포넌트 통합 가능
- **링크**: https://github.com/KIM3310/weld-defect-vision

### AegisOps
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 멀티모달 incident review system
- **주요 도구/스택**: TypeScript, React/Vite, incident workflow, replay/review surface
- **무엇을 하는 레포인가**: Multimodal incident analysis tool for SREs - screenshot + log ingestion, severity classification, and escalation workflows powered by Gemini
- **현재 가치/강점**: 운영형 AI/incident UI 측면에서 강한 대표작이다.
- **개선하면 더 좋아질 점**: screenshot annotation과 richer export pack이 추가되면 더 좋아진다.
- **통합하면 좋은 리소스/레포**: Aegis-Air, ops-reliability-workbench, twincity-ui와 operator surface 통합 가능
- **링크**: https://github.com/KIM3310/AegisOps
- **홈페이지/데모**: https://aegisops-ai-incident-doctor.pages.dev

### regulated-case-workbench
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 규제 case workflow
- **주요 도구/스택**: Python, FastAPI, approval/export/audit workflow
- **무엇을 하는 레포인가**: Regulated case management workbench with approval workflows, redaction, signed export manifests, and audit trails
- **현재 가치/강점**: 승인·감사·signed export 등 high-trust workflow를 잘 보여준다.
- **개선하면 더 좋아질 점**: role matrix와 sample approval SLA 보드를 보강하면 좋다.
- **통합하면 좋은 리소스/레포**: enterprise-llm-adoption-kit, fab-ops-yield-control-tower와 approval/audit 라이브러리 통합 가능
- **링크**: https://github.com/KIM3310/regulated-case-workbench
- **홈페이지/데모**: https://regulated-case-workbench.pages.dev

### dv-regression-lab
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 회귀 검증 control tower
- **주요 도구/스택**: Python, FastAPI, replayable proof routes
- **무엇을 하는 레포인가**: RTL/DV regression control tower with triage, flaky detection, review packs, and suite trend analysis.
- **현재 가치/강점**: 검증/triage 문제를 별도 제품으로 보여준다.
- **개선하면 더 좋아질 점**: failure clustering과 flaky taxonomy를 추가하면 더 좋아진다.
- **통합하면 좋은 리소스/레포**: stage-pilot와 benchmark/proof pack 계약 공유 추천
- **링크**: https://github.com/KIM3310/dv-regression-lab

### memory-test-master-change-gate
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 메모리 테스트 기준정보 변경 영향 분석 게이트
- **주요 도구/스택**: Python, Streamlit, deterministic impact analysis, review bundle
- **무엇을 하는 레포인가**: Reviewer-first Streamlit platform for memory test master data change impact analysis, approvals, rollback planning, and release gating.
- **현재 가치/강점**: 제조 IT/하이닉스 정렬 측면에서 가장 날카로운 프로젝트 중 하나다.
- **개선하면 더 좋아질 점**: 실제 같은 master data 샘플과 downstream dependency catalog를 넣으면 더 강해진다.
- **통합하면 좋은 리소스/레포**: fab-ops-yield-control-tower, lakehouse-contract-lab와 제조 IT 데이터 리소스 통합 가능
- **링크**: https://github.com/KIM3310/memory-test-master-change-gate
- **홈페이지/데모**: https://04bc8dd7120470.lhr.life

### ops-reliability-workbench
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 운영 안정성·거버넌스 workbench
- **주요 도구/스택**: Python, Streamlit, deterministic + optional AI assist, signed bundle
- **무엇을 하는 레포인가**: Reviewer-first Streamlit platform for operational reliability, data governance, evidence review, and AI-assisted briefs.
- **현재 가치/강점**: 운영 안정성·incident·data governance를 가장 보기 좋게 묶어낸 workbench다.
- **개선하면 더 좋아질 점**: historical time-series dataset과 auth/role layer를 넣으면 더 좋아진다.
- **통합하면 좋은 리소스/레포**: AegisOps, the-logistics-prophet, memory-test-master-change-gate와 review bundle 표준 통합 가능
- **링크**: https://github.com/KIM3310/ops-reliability-workbench
- **홈페이지/데모**: https://c2d1de755ed92b.lhr.life

### enterprise-llm-adoption-kit
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: enterprise LLM rollout/governance kit
- **주요 도구/스택**: Python backend, Vite frontend, governance, diagnostics, rollout pack
- **무엇을 하는 레포인가**: Enterprise LLM deployment toolkit with RAG pipelines, RBAC, rollout governance, and eval framework for regulated environments
- **현재 가치/강점**: 조직 차원의 AI 도입/검토 구조를 가장 직접적으로 보여준다.
- **개선하면 더 좋아질 점**: persona별 rollout playbook과 sample migration kits를 추가하면 좋다.
- **통합하면 좋은 리소스/레포**: regulated-case-workbench, stage-pilot, lakehouse-contract-lab와 정책/검증 리소스 연계 추천
- **링크**: https://github.com/KIM3310/enterprise-llm-adoption-kit
- **홈페이지/데모**: https://enterprise-llm-kit.pages.dev

### retina-scan-ai
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 의료 AI 판별 시스템
- **주요 도구/스택**: Python, vision pipeline, ops validation, release readiness
- **무엇을 하는 레포인가**: Retinal disease detection AI system with CNN classifier, severity grading, clinical reports, and HIPAA-aware audit logging
- **현재 가치/강점**: 도메인형 AI와 운영 검증을 같이 보여주는 강한 flagship이다.
- **개선하면 더 좋아질 점**: 실제 clinical protocol style validation pack과 model card 확장 추천.
- **통합하면 좋은 리소스/레포**: weld-defect-vision과 검사 보고 / severity / review pack 공통화 가능
- **링크**: https://github.com/KIM3310/retina-scan-ai

### lakehouse-contract-lab
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 레이크하우스 데이터 엔지니어링 레포
- **주요 도구/스택**: Python, Spark, Delta Lake, FastAPI, Terraform adapters
- **무엇을 하는 레포인가**: Spark + Delta medallion pipeline with quality gates, contract boundaries, and data layer previews
- **현재 가치/강점**: 데이터 품질 게이트와 medallion 구조를 명확하게 보여준다.
- **개선하면 더 좋아질 점**: 실제 warehouse target별 benchmark와 cost/perf 표가 있으면 더 좋다.
- **통합하면 좋은 리소스/레포**: Nexus-Hive, ops-reliability-workbench, memory-test-master-change-gate와 데이터 계약 리소스 통합 추천
- **링크**: https://github.com/KIM3310/lakehouse-contract-lab

### fab-ops-yield-control-tower
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 반도체 ops platform
- **주요 도구/스택**: Python, FastAPI, monitoring, persistence, release gate
- **무엇을 하는 레포인가**: Unified semiconductor ops platform for fab yield control and scanner field response with shared auth and HMAC signatures
- **현재 가치/강점**: 반도체 제조 운영 시나리오를 platform 형태로 확장했다.
- **개선하면 더 좋아질 점**: 실제-like fab event taxonomy와 operator handbook을 넣으면 더 좋다.
- **통합하면 좋은 리소스/레포**: memory-test-master-change-gate, twincity-ui와 제조 ops 공용 model/resource 통합 추천
- **링크**: https://github.com/KIM3310/fab-ops-yield-control-tower

### signal-risk-lab
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: signal/risk advisory review platform
- **주요 도구/스택**: Python, FastAPI, domain-driven review flow
- **무엇을 하는 레포인가**: Domain-driven FastAPI app for quant signal/risk and advisory review with Pydantic validation and parametrized tests
- **현재 가치/강점**: 리서치/리스크/어드바이저리 흐름을 구조화한 niche 레포다.
- **개선하면 더 좋아질 점**: 더 분명한 demo dataset과 compliance angle을 붙이면 더 강해진다.
- **통합하면 좋은 리소스/레포**: Nexus-Hive, regulated-case-workbench와 review/export 패턴 통합 가능
- **링크**: https://github.com/KIM3310/signal-risk-lab
- **홈페이지/데모**: https://kim3310.github.io/signal-risk-lab/

### ogx
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: CLI orchestration layer
- **주요 도구/스택**: TypeScript/Node CLI, task graph, tmux team, HUD
- **무엇을 하는 레포인가**: CLI orchestration for Gemini — task graphs, tmux teams, MCP server, HUD
- **현재 가치/강점**: 개발 도구/오케스트레이션 능력을 보여주는 도구 레포다.
- **개선하면 더 좋아질 점**: 설치 경험과 사용자 문서를 더 간단하게 만들면 좋다.
- **통합하면 좋은 리소스/레포**: stage-pilot와 runtime tooling, ops-reliability-workbench와 assist tooling 공유 가능
- **링크**: https://github.com/KIM3310/ogx

### doeon-kim-portfolio
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 포트폴리오 사이트
- **주요 도구/스택**: React, TypeScript, Vite, briefs/evidence assets
- **무엇을 하는 레포인가**: Personal portfolio site — React + TypeScript, deployed on GitHub Pages
- **현재 가치/강점**: 전체 프로젝트를 직무별·회사별로 포장하는 중요한 surface다.
- **개선하면 더 좋아질 점**: 이제는 pinned repo·live URL·archived repo 반영을 더 자동화하면 좋다.
- **통합하면 좋은 리소스/레포**: KIM3310 profile README 및 MASTER_PROFILE 문서와 단일 소스화 추천
- **링크**: https://github.com/KIM3310/doeon-kim-portfolio
- **홈페이지/데모**: https://kim3310.github.io/doeon-kim-portfolio/

### Upstage-DocuAgent
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: document-to-learning pipeline
- **주요 도구/스택**: Python, extraction, Q&A, LMS export
- **무엇을 하는 레포인가**: Document-to-learning pipeline: upload, extract, Q&A with citations, export to SCORM/IMS CC
- **현재 가치/강점**: 문서 처리에서 추출부터 export까지 이어지는 흐름이 분명하다.
- **개선하면 더 좋아질 점**: sample course pack과 reviewer quick path를 더 넣으면 좋다.
- **통합하면 좋은 리소스/레포**: honeypot와 parsing/grounded QA 리소스 통합 추천
- **링크**: https://github.com/KIM3310/Upstage-DocuAgent
- **홈페이지/데모**: https://upstage-docuagent.pages.dev

### Aegis-Air
- **상태**: 활성 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: air-gapped incident engine
- **주요 도구/스택**: Python, FastAPI, offline-first incident workflows
- **무엇을 하는 레포인가**: Air-gapped incident analysis engine with replay evaluation, offline-first SRE workflows, and FastAPI backend
- **현재 가치/강점**: 보안 제약이 큰 환경에서의 incident review를 보여준다.
- **개선하면 더 좋아질 점**: AegisOps와 차별 포인트를 더 문서화하지 않으면 스토리가 겹칠 수 있다.
- **통합하면 좋은 리소스/레포**: AegisOps와 일부 export/replay/incident taxonomy 통합 추천
- **링크**: https://github.com/KIM3310/Aegis-Air
- **홈페이지/데모**: https://aegis-air.pages.dev

### quantum-workbench
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 양자 실험 desk
- **주요 도구/스택**: Python, IBM Quantum, Amazon Braket, simulation backends
- **무엇을 하는 레포인가**: Quantum circuit experiment desk with local sim, IBM Quantum, and Amazon Braket backends
- **현재 가치/강점**: 실험 플랫폼형 사고를 보여주지만 현재 메인 포지셔닝과는 거리가 있다.
- **개선하면 더 좋아질 점**: 실험 재현 패키지와 교육형 가이드가 있으면 더 좋다.
- **통합하면 좋은 리소스/레포**: stage-pilot benchmark framing을 일부 빌려 재구성 가능
- **링크**: https://github.com/KIM3310/quantum-workbench

### beaver-study-orchestrator
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 학습/스터디 계획 서비스
- **주요 도구/스택**: planning, scheduling, risk scoring (description inference)
- **무엇을 하는 레포인가**: Study planner: syllabus extraction, adaptive scheduling, risk scoring, and what-if simulation
- **현재 가치/강점**: 개인 생산성/계획화 문제를 풀려는 레포로 보인다. (repo description 기반 추정)
- **개선하면 더 좋아질 점**: calendar sync, notification, measurable completion metrics가 있으면 좋다.
- **통합하면 좋은 리소스/레포**: ops-reliability-workbench의 review/checklist 구조를 응용할 수 있음
- **링크**: https://github.com/KIM3310/beaver-study-orchestrator

### secure-xl2hwp-local
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: 로컬 문서 변환/보안 workflow
- **주요 도구/스택**: local conversion, JWT auth, signed export, audit logging
- **무엇을 하는 레포인가**: Air-gapped Excel-to-Hancom converter with JWT auth, signed exports, and audit logging
- **현재 가치/강점**: 보안/문서/감사 흐름이 강점이다.
- **개선하면 더 좋아질 점**: sample files와 reviewer quick demo가 있으면 좋다.
- **통합하면 좋은 리소스/레포**: regulated-case-workbench, honeypot와 signed export 리소스 통합 추천
- **링크**: https://github.com/KIM3310/secure-xl2hwp-local
- **홈페이지/데모**: https://secure-xl2hwp-local.pages.dev

### SteadyTap
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: iOS accessibility coaching app
- **주요 도구/스택**: Swift/iOS, optional FastAPI backend (description inference)
- **무엇을 하는 레포인가**: iOS accessibility coaching app with optional FastAPI backend for sync and coach plans
- **현재 가치/강점**: 모바일/접근성 앱 영역의 확장성을 보여준다.
- **개선하면 더 좋아질 점**: 실사용 시나리오와 UX evidence가 있으면 더 좋아진다.
- **통합하면 좋은 리소스/레포**: twincity-ui 등 UI/UX 측면과는 별개로 mobile lane으로 분리 관리 추천
- **링크**: https://github.com/KIM3310/SteadyTap
- **홈페이지/데모**: https://steadytap.pages.dev

### smallbiz-ops-copilot
- **상태**: 비공개 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: small business ops inbox
- **주요 도구/스택**: Cloudflare-native, D1, AI drafts (description inference)
- **무엇을 하는 레포인가**: Cloudflare-native ops inbox for small support teams — D1, queue management, AI drafts
- **현재 가치/강점**: 소규모 운영팀용 ops surface라는 점이 명확하다.
- **개선하면 더 좋아질 점**: private repo라 공개 포트폴리오용 snapshot 문서가 별도로 필요하다.
- **통합하면 좋은 리소스/레포**: ops-reliability-workbench와 ops-inbox 컴포넌트 공유 가능
- **링크**: https://github.com/KIM3310/smallbiz-ops-copilot

### the-savior
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: mindfulness app
- **주요 도구/스택**: Cloudflare Pages + Functions + OpenAI/Ollama (description inference)
- **무엇을 하는 레포인가**: Buddhist-inspired mindfulness app — Cloudflare Pages + Functions + OpenAI/Ollama
- **현재 가치/강점**: 감성/consumer app lane의 실험작으로 보인다.
- **개선하면 더 좋아질 점**: 현재 메인 포지셔닝과 거리가 있어 보강 없이는 지원 포트폴리오 비중이 낮다.
- **통합하면 좋은 리소스/레포**: AI assist UX 실험을 ops/workbench에 일부 재활용 가능
- **링크**: https://github.com/KIM3310/the-savior
- **홈페이지/데모**: https://the-savior-9z8.pages.dev

### ecotide
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: SwiftUI simulation app
- **주요 도구/스택**: SwiftUI, telemetry, review surfaces (description inference)
- **무엇을 하는 레포인가**: SwiftUI simulation app with motion telemetry, CLI reviewer handoff fallback, and product-style review surfaces.
- **현재 가치/강점**: 시뮬레이션/consumer app 측면의 탐색 프로젝트로 보인다.
- **개선하면 더 좋아질 점**: 실사용 지표나 UX evidence가 없으면 메인 포트폴리오 비중은 낮다.
- **통합하면 좋은 리소스/레포**: 별도 lane 유지 또는 archive 유지 추천
- **링크**: https://github.com/KIM3310/ecotide

### kbbq-idle-unity
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: Unity WebGL idle tycoon
- **주요 도구/스택**: Unity, WebGL, release readiness (description inference)
- **무엇을 하는 레포인가**: Unity WebGL idle tycoon with reviewer surface, build preflight, and release-readiness proof.
- **현재 가치/강점**: 게임/Unity 실험 라인을 보여준다.
- **개선하면 더 좋아질 점**: 메인 커리어 포지셔닝과는 거리가 있어 showcase성 정리가 중요하다.
- **통합하면 좋은 리소스/레포**: 포트폴리오 supporting/historical lane으로 유지 추천
- **링크**: https://github.com/KIM3310/kbbq-idle-unity
- **홈페이지/데모**: https://kbbq-idle-unity.pages.dev

### dream-interpretation-pages
- **상태**: 아카이브 / 독립 레포 / 로컬 clone 없음 / 설명 기반 추정 포함
- **서비스 성격**: Cloudflare Pages app
- **주요 도구/스택**: Cloudflare Pages Functions, OpenAI, abuse controls (description inference)
- **무엇을 하는 레포인가**: Cloudflare Pages dream interpretation app with OpenAI-backed Pages Functions, abuse controls, and a reviewer-facing review pack.
- **현재 가치/강점**: consumer AI service 실험작으로 보인다.
- **개선하면 더 좋아질 점**: prompt 품질보다 운영/abuse control 포인트를 더 명확히 드러내면 좋다.
- **통합하면 좋은 리소스/레포**: the-savior와 consumer AI 실험군으로 묶어 정리 추천
- **링크**: https://github.com/KIM3310/dream-interpretation-pages

## 4. 삭제보다는 아카이브/정리 추천군

- 삭제 완료(통합 후 제거): `gemini-cli-tool-runtime`, `advisor-review-desk`, `scanner-field-response`
- supporting/historical lane으로 보기 좋은 archived 레포: `quantum-workbench`, `beaver-study-orchestrator`, `secure-xl2hwp-local`, `SteadyTap`, `the-savior`, `ecotide`, `kbbq-idle-unity`, `dream-interpretation-pages`
- 공개 포트폴리오 메인 노출보다 supporting / archived lane이 어울리는 레포: `ogx`, `signal-risk-lab`, `twincity-ui`, `the-logistics-prophet`, `dv-regression-lab`, `Aegis-Air`

## 5. 최종 한 줄 정리

> 김도언의 GitHub는 여러 작은 프로젝트의 집합이라기보다, **운영 가능한 AI·플랫폼·데이터 시스템을 다양한 도메인에 적용한 포트폴리오 군집**으로 보는 것이 가장 정확하다.