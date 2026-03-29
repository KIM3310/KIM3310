# 김도언 통합 프로필 총합본

생성 기준: 레쥬메 원천(`doeon-kim-portfolio/content/resume/*.json`) + 로컬 GitHub 레포 전체 표면(README / verify / 배포 상태)
최종 갱신: 2026-03-23

---

## 1. 기본 정보

- **이름**: 김도언 (Doeon Kim)
- **거주**: 부산, 대한민국
- **연락처**: +82 10-5791-8465
- **이메일**: ehdjs1351@gmail.com
- **LinkedIn**: https://linkedin.com/in/doeon-kim-4742a2388
- **GitHub**: https://github.com/KIM3310
- **포트폴리오**: https://kim3310.github.io/doeon-kim-portfolio

---

## 2. 현재 포지셔닝

김도언은 단순히 AI 기능을 붙이는 개발자가 아니라, **운영 가능한 플랫폼·백엔드·데이터 시스템**을 만들고 이를 **검토·통제·인계 가능한 형태**로 정리하는 엔지니어다.

핵심 강점은 아래 네 축으로 정리된다.

1. **AI / LLM 시스템 엔지니어링** — runtime, evals, operator workflow, reviewer surface
2. **플랫폼 / 백엔드 / 운영 시스템** — incident review, control tower, release gate, audit surface
3. **데이터 엔지니어링 / 거버넌스** — contract, quality gate, lakehouse, governed analytics
4. **도메인형 응용 시스템** — 의료 AI, 제조/반도체형 운영 IT, 산업 비전

---

## 3. 학력 / 교육

### 정규 학력
- **한국방송통신대학교 (KNOU)**
  - 컴퓨터과학과 학사 재학
  - 입학: 2026년 3월

### 교육 / 훈련
- **Microsoft AI School**
  - 기간: 2025.09 ~ 2026.02
  - 위치: 서울, 대한민국
  - 성격: AI·Cloud·Data 중심 실무형 프로젝트 훈련

---

## 4. 경력

### 1) ATOM TECH SOLUTIONS LTD
- **직무**: Backend / Full Stack Engineer Intern
- **기간**: 2025.06 ~ 2025.09
- **위치**: Berkeley, CA, United States
- **핵심 내용**
  - 기존 리뷰 플랫폼에서 Node.js / Express 기반 기능 개발과 OpenAI 기반 문의 챗봇 연동 수행
  - 서버 측 환경설정, 인증 정보 관리, 요청·응답 예외 처리, 외부 API 연동 흐름 정리로 운영 안정성 보강
  - 로그 기반 오류 분석과 프론트엔드-백엔드 연동 이슈 수정, 배포 전 품질 점검 대응
  - 미국 팀과 비동기 협업하며 요구사항 반영, 수정 대응, 기능 전달 흐름 지원

### 2) 국군지휘통신사령부 / 제1정보통신단
- **직무**: 전략 지휘통신망 네트워크·보안 운영 / 팀 리드
- **기간**: 2023.11 ~ 2025.05
- **위치**: 성남, 대한민국
- **핵심 내용**
  - 전략 지휘통신망의 네트워크·보안 인프라 운영과 안정성 관리
  - 24/7 환경에서 장애 모니터링, 원인 분석, 복구 대응
  - 계정·권한 관리와 보안 통제를 통한 운영 신뢰성 유지
  - 반복 장애 분석 및 운영 절차 개선
  - 팀 운영 및 인수인계 체계 관리

### 3) Microsoft AI School
- **직무 성격**: Trainee
- **기간**: 2025.09 ~ 2026.02
- **위치**: 서울, 대한민국
- **핵심 내용**
  - AI·Cloud·Data 기반 실무형 프로젝트 수행
  - RAG, incident operations, operator workflow, backend delivery surface 구현
  - 다양한 도메인 팀원들과 Azure 기반 팀 프로젝트 3회 수행
  - 요구사항을 demo / runtime surface / handoff artifact 형태로 구조화

---

## 5. 언어

- **한국어**: Native
- **영어**: Business / Working
- **일본어**: Business / Working

---

## 6. 자격증 / 인증

### 핵심 자격 / 인증
- AI-900
- SnowPro Associate
- Palantir Foundry Data Engineer Associate
- Palantir Foundry Foundations
- Databricks Platform Architect (AWS)
- Databricks Platform Architect (GCP)
- Databricks Fundamentals
- Datadog Observability Certifications

### 추가 학습 / 인증
- IBM AI Fundamentals
- IBM Cloud Computing Fundamentals
- IBM Cyber Security Fundamentals
- SAP Cloud Platform Integration Service

---

## 7. 기술 스택 총합

### 언어 / 프레임워크
- Python
- TypeScript
- SQL
- FastAPI
- Express
- React
- Next.js
- Streamlit
- Vite

### AI / ML / LLM
- RAG
- tool-calling runtime
- eval / benchmark / replay suite
- multimodal workflow
- structured summary / review pack
- SHAP / explanation workflow
- reviewer-first AI surface 설계

### 데이터 / 플랫폼
- Spark
- Delta Lake
- medallion pipeline
- contract-first data quality gate
- warehouse export pattern
- governed analytics
- NL-to-SQL
- ontology / SPARQL

### 인프라 / 운영
- Docker
- Kubernetes
- Terraform
- Prometheus / OpenTelemetry / Datadog
- RBAC / IAM
- audit logging
- signed export / verification
- runtime scorecard / smoke verification

---

## 8. 대표 프로젝트 요약

### 1) stage-pilot
- 도구 호출 안정성, 파서 복구, benchmark, regression gate를 갖춘 runtime 프로젝트
- AI 시스템을 “잘 동작하는지”가 아니라 “계속 신뢰할 수 있는지”로 보여주는 레포

### 2) AegisOps
- 로그·스크린샷·증거를 구조화해 incident review와 handoff를 지원하는 운영형 시스템
- 운영 콘솔 / review surface / replay proof가 강점

### 3) enterprise-llm-adoption-kit
- enterprise rollout, governance, diagnostics, summary pack 중심의 LLM 도입 키트
- 조직 단위 AI 도입과 통제 구조를 보여주는 레포

### 4) lakehouse-contract-lab
- Spark + Delta Lake 기반 레이크하우스 파이프라인과 데이터 품질 게이트를 구현한 레포
- 데이터 계약, 품질 리포트, KPI export를 통해 데이터 엔지니어링 역량을 보여줌

### 5) retina-scan-ai
- 안저 이미지 기반 망막 질환 판별 / 운영 검증 / release readiness까지 포함한 의료 AI 시스템
- 도메인형 AI + backend + ops proof가 결합된 프로젝트

### 6) ops-reliability-workbench
- 운영 안정성·데이터 거버넌스·incident review를 하나의 reviewer-first Streamlit surface로 통합
- deterministic core + optional AI assist 구조

### 7) memory-test-master-change-gate
- 메모리 테스트 기준정보 변경이 ETL·대시보드·알람·traceability·고객 리포트에 미치는 영향을 사전 분석하는 제조 IT형 change-control 프로젝트
- 하이닉스 IT 직무 정렬도가 특히 높음

---

## 9. GitHub 프로젝트군 정리

### A. 운영 / 플랫폼 / incident / control tower
- **Aegis-Air (archived)** — 로컬 우선 incident review engine
- **AegisOps** — 멀티모달 incident review system
- **fab-ops-yield-control-tower** — 제조 운영 control tower / release gate
- **ops-reliability-workbench** — 운영 안정성·거버넌스 workbench
- **the-logistics-prophet (archived)** — 물류 control tower + 예측 + 운영 콘솔
- **twincity-ui (archived)** — 디지털 트윈 ops console
- **dv-regression-lab (archived)** — 검증/회귀 control tower

### B. AI / LLM / governed workflow
- **stage-pilot** — stage-gated tool-calling reliability runtime
- **enterprise-llm-adoption-kit** — enterprise LLM 도입/거버넌스 키트
- **regulated-case-workbench** — 규제/승인/검토 workflow workbench
- **Upstage-DocuAgent** — 문서 기반 추출 / grounded Q&A / LMS export
- **honeypot** — 문서 기반 handover 생성 및 retrieval workflow
- **ogx (archived)** — Gemini CLI orchestration layer

### C. 데이터 / 분석 / 거버넌스
- **lakehouse-contract-lab** — Spark + Delta Lake + 품질 게이트
- **Nexus-Hive** — governed analytics / NL-to-SQL BI copilot
- **signal-risk-lab (archived)** — quant signal / advisory review platform

### D. 도메인형 AI / 산업 / 제조 / 의료
- **retina-scan-ai** — 의료 AI / 안저 판별 시스템
- **weld-defect-vision** — 용접 결함 탐지 및 검사 보고 시스템
- **memory-test-master-change-gate** — 메모리 테스트 기준정보 변경 영향 분석 게이트

### E. 프로필 / 포트폴리오 / 메타 surface
- **KIM3310** — GitHub 프로필 README
- **doeon-kim-portfolio** — 포트폴리오 사이트

---

## 10. GitHub 전체 레포 목록 (전체)

1. **Aegis-Air (archived)** — Local-first incident review engine for teams that cannot send production telemetry to public APIs. 운영 환경의 로그·알람·증거를 로컬 우선으로 검토하고 incident 대응 흐름을 구조화하던 레포로, 현재 active incident-review 스토리는 AegisOps와 ops-reliability-workbench 쪽에 더 많이 통합되어 있다.
2. **AegisOps** — Multimodal incident review system for logs, screenshots, and alerts. 멀티모달 incident evidence를 리뷰 가능한 형태로 묶어 handoff와 postmortem에 연결하는 운영형 시스템.
3. **KIM3310** — Profile repository and portfolio entry point. GitHub 프로필 README와 전체 포트폴리오의 관문 역할을 하는 메타 레포.
4. **Nexus-Hive** — Governed analytics / NL-to-SQL BI copilot. 자연어 질의를 SQL·BI 리뷰 surface로 연결하는 governed analytics 프로젝트.
5. **Upstage-DocuAgent** — Document-to-learning pipeline with extraction, Q&A, and LMS export. 문서를 추출·구조화하고 grounded Q&A와 LMS export까지 연결하는 문서 workflow 레포.
6. **doeon-kim-portfolio** — Portfolio site for AI systems, data, and operations software. 본인 프로젝트와 경력, proof surface를 정리한 포트폴리오 사이트.
7. **dv-regression-lab (archived)** — Local-first regression control tower for verification workflows. 회귀·검증·재현 흐름을 reviewable control tower 형태로 만든 검증형 레포이며, 현재 active runtime reliability 스토리는 stage-pilot 쪽으로 더 많이 통합되어 있다.
8. **enterprise-llm-adoption-kit** — Enterprise rollout, diagnostics, governance, and review kit for LLM adoption. 조직 단위 AI 도입을 위한 governance / rollout / diagnostics 중심 키트.
9. **fab-ops-yield-control-tower** — Semiconductor operations platform with release gates and audit surfaces. 반도체 제조 운영을 release gate, audit, monitoring 관점으로 다룬 control tower 성격의 프로젝트.
10. **honeypot** — AI-assisted handover document generator with retrieval workflow. 문서 기반 인수인계 생성, retrieval, 후속 질의응답을 지원하는 workflow 레포.
11. **lakehouse-contract-lab** — Spark + Delta Lake medallion pipeline with contract and quality gates. 레이크하우스 구조, 데이터 계약, 품질 게이트, KPI export를 보여주는 데이터 엔지니어링 레포.
12. **memory-test-master-change-gate** — Change-control platform for memory test master data. 메모리 테스트 기준정보 변경이 downstream 시스템에 미치는 영향을 사전 분석하는 제조 IT형 change-control 프로젝트.
13. **ogx (archived)** — CLI orchestration layer for Gemini CLI with task graph / team support. 현재는 supporting/historical tooling lane으로 보는 편이 적절하다.
14. **ops-reliability-workbench** — Reviewer-first operations reliability and data governance workbench. 운영 안정성·데이터 거버넌스·incident review를 하나의 검토 surface로 통합한 workbench.
15. **regulated-case-workbench** — Regulated case operations workbench. 규제/승인/감사 추적이 필요한 case workflow를 reviewable하게 구성한 workbench.
16. **retina-scan-ai** — Automated retinal disease detection system. 안저 이미지 기반 의료 AI 판별과 운영 검증 흐름을 결합한 레포.
17. **signal-risk-lab (archived)** — Signal/risk research and advisory review platform. 현재는 supporting/historical finance-domain lane으로 보는 편이 적절하다.
18. **stage-pilot** — Stage-gated tool-calling reliability runtime. 도구 호출 안정성, 파서 복구, benchmark, regression gate를 갖춘 runtime reliability 프로젝트.
19. **the-logistics-prophet (archived)** — Logistics control tower with prediction, explanation, and ops console. 현재는 supporting/historical logistics lane으로 보는 편이 적절하다.
20. **twincity-ui (archived)** — Digital twin operations console for spatial event management. 현재는 supporting/historical spatial ops lane으로 보는 편이 적절하다.
21. **weld-defect-vision** — AI-based weld defect inspection and reporting system. 용접 결함 판별, 심각도 평가, 검사 보고까지 연결한 산업 비전 AI 레포.

## 11. 지원 관점 요약

### 하이닉스 IT 정렬이 강한 레포
1. **memory-test-master-change-gate**
2. **ops-reliability-workbench**
3. **lakehouse-contract-lab**
4. **AegisOps**
5. **stage-pilot**

### 엔지니어로서 읽히는 방식
- 단순 모델 적용형이 아니라 **운영 가능한 시스템형 개발자**
- 단순 데이터 처리형이 아니라 **검증·거버넌스까지 보는 데이터 엔지니어형 개발자**
- 단순 화면 구현형이 아니라 **reviewer / operator / approver가 실제로 쓰는 surface를 만드는 개발자**

---

## 12. 한 줄 정의

> **AI, Cloud, Data, Backend, Operations를 묶어 검토 가능하고 운영 가능한 시스템으로 만드는 엔지니어**
