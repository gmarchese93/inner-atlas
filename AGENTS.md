# Inner Atlas

## Skill Router

Before starting, inspect the available skills and select only the skills relevant to the task.

Core rules:

- Prefer Inner Atlas project-specific skills over generic skills when they overlap.
- Use the minimum useful skill set.
- Do not use unrelated skills.
- Do not add dependencies only because a skill exists.
- Do not use mobile, iOS, macOS, Expo, Twilio, Zoom, Stripe, Gmail, Outlook, SharePoint, Slack, Teams, HubSpot, life-science, Hugging Face, deployment, database, auth, payments, analytics, automation, or CI/CD skills unless the task explicitly requires them.

## Local Skill And Tool Discovery

Before selecting skills for substantial work, check both:

- the active visible skill list
- locally installed plugin/skill caches when a requested or relevant skill is not visible

Relevant local tools/skills may include:

- Superpowers
- AgentMemory
- Gitleaks
- OSV-Scanner
- uv
- gsd
- Headroom
- Matt Pocock TypeScript skills
- AI Engineering From Scratch
- ECC
- Oxc / Oxlint / Oxfmt
- SkillOpt
- Spec Kit / Specify CLI
- Open Design
- book-to-skill
- awesome-design-md reference library
- agency-agents / Codex custom agents

Use these only when relevant to the task. Do not force them into every request.

If a requested tool or skill is not visible, search the local machine before declaring it unavailable. If it still cannot be found, report that clearly.

Current Headroom caveat: Headroom has been evaluated for context/log compression but is not currently installed as a usable Windows CLI. `headroom --help` must succeed before routing work through it. Native `uv tool install` attempts are blocked on this machine because Headroom's Rust/Python build produces generated Cargo executables that Windows refuses to run with Access Denied, even after Visual Studio Build Tools installation. Do not use `headroom learn` or let Headroom write to `AGENTS.md` unless explicitly approved.

## AI Engineering From Scratch Routing

AI Engineering from Scratch is an optional learning and agent-engineering reference, not an Inner Atlas implementation workflow.

Installed skills:

- `find-your-level`
- `check-understanding`

Use these only when the task explicitly involves:

- assessing the user's AI/ML learning level
- quizzing or reviewing AI Engineering from Scratch phases
- learning-path planning for AI, ML, LLMs, tools, MCP, agent engineering, or multi-agent systems
- using the curriculum as background education before future AI/agent milestones

Do not use these skills for:

- ordinary Inner Atlas R.0.X implementation
- audio engine work
- Web Audio bugs
- localStorage/session logic
- UI visual refactors
- build/lint/typecheck work
- routine code review
- GitHub merge work

Current caveat: the skills.sh install for `rohitg00/ai-engineering-from-scratch` exposes and installs only the two skills above. It does not install the full lesson artifact set advertised by the README. The installed skill text still refers to a 260+ lesson curriculum, while the current README advertises 503 lessons; treat the skills as lightweight routing/quiz helpers, not a complete local mirror of the current curriculum.

## Meta-Skill Router

SkillOpt is a local/global tool for improving skill documents, not for implementing app features.

It is installed globally through `uv tool install skillopt` as SkillOpt v0.1.0.

Installed executable shims:

- `skillopt-train`
- `skillopt-eval`

Current Windows caveat: the uv-generated `.exe` shims return Access Denied on this machine. Use the underlying venv Python entrypoints instead:

`C:\Users\gmarchese\AppData\Roaming\uv\tools\skillopt\Scripts\python.exe -m scripts.train --help`

`C:\Users\gmarchese\AppData\Roaming\uv\tools\skillopt\Scripts\python.exe -m scripts.eval_only --help`

Use SkillOpt only when optimizing:

- `AGENTS.md`
- Skill Router instructions
- project-specific `SKILL.md` files

Appropriate triggers:

- repeated weak outputs from existing instructions
- major milestone retrospectives
- creating benchmarks for skill quality
- evaluating whether a skill document reliably improves agent behavior

Do not use SkillOpt during:

- ordinary R.0.X implementation
- bugfixing
- visual refactors
- QA
- merge work
- app feature implementation

SkillOpt requires benchmark tasks, scoring criteria, and validation splits before serious use.

Optimized output such as `best_skill.md` must be reviewed manually before replacing any `AGENTS.md` or `SKILL.md` content.

Do not store secrets, transient logs, command noise, or private content in SkillOpt datasets.

Keep SkillOpt data outside the app repo unless explicitly approved.

## R.0.X SkillOpt Readiness Automation

At the end of every R.0.X milestone, run the SkillOpt readiness check automatically before final Claude review, merge, or branch closeout.

Use:

`tools/skillopt-readiness/r0x-skillopt-check.md`

Create the report with:

`powershell -ExecutionPolicy Bypass -File tools/skillopt-readiness/new-readiness-report.ps1 -Milestone r0.x`

Then fill:

- `docs/retrospectives/<milestone>-skillopt-readiness.md`

The readiness check must inspect:

- branch diff and changed files
- local Codex review notes
- Claude review findings, if available
- user corrections during the milestone
- verification gaps
- skill/tool routing mistakes
- repeated scope or completion-claim issues
- unclear `AGENTS.md` or `SKILL.md` instructions

SkillOpt readiness output must decide:

- SkillOpt recommended: yes/no/defer
- trigger category
- evidence
- candidate benchmark prompts
- scoring criteria
- target instruction file
- whether running SkillOpt requires approval

Do not run SkillOpt training automatically. Do not send data to SkillOpt automatically. Do not let SkillOpt replace `AGENTS.md` or any `SKILL.md` automatically.

If SkillOpt is recommended, prepare the benchmark pack outside app source under:

`C:\Users\gmarchese\SkillOpt\inner-atlas\<milestone>\`

Then stop and ask for explicit approval before running:

`C:\Users\gmarchese\AppData\Roaming\uv\tools\skillopt\Scripts\python.exe -m scripts.train ...`

The R.0.X milestone is not closeout-ready until the readiness report exists or the user explicitly waives it.

## Claude Web Architecture Handoff

Claude Web / Sonnet is a human-mediated architecture and diff-review surface. Codex cannot call it directly.

For non-trivial R.0.X milestones, create or reuse:

`docs/milestones/<milestone>-claude-architecture-handoff.md`

Use:

`powershell -ExecutionPolicy Bypass -File tools/claude-handoff/new-claude-handoff.ps1 -Milestone r0.x`

The template is:

`docs/milestones/templates/claude-architecture-handoff.md`

Create the handoff before implementation when any of these applies:

- a new non-trivial R.0.X milestone starts
- architecture, state flow, persistence, audio, routing, or data contracts change
- a new runtime dependency is proposed
- a cross-system or high-risk refactor is planned
- the user asks for Claude architecture confirmation

Codex must fill the repository-evidence and pre-plan sections, tell the user the handoff is ready, and stop for the human-mediated Claude response unless the user explicitly waives the checkpoint.

After the user returns Claude's response, Codex must classify each recommendation as:

- valid and fix now
- valid but defer
- false positive
- requires human decision

Record the classification and final human decisions in the same handoff artifact before implementation continues.

For final Claude diff review, update the same artifact with changed files, verification evidence, manual QA status, remaining risks, and the review prompt.

Small fixes and docs-only changes may use an abbreviated handoff or an explicit waiver. Do not create duplicate handoff documents for the same milestone.

## Spec Kit / Specify CLI Routing

Spec Kit is an optional spec-driven development toolkit installed globally as `specify-cli`.

Use Spec Kit only when a task benefits from explicit spec-driven artifacts, such as:

- large R.0.X or beta-readiness milestones
- ambiguous feature discovery that needs requirements clarification
- turning product intent into a durable spec, technical plan, and task list
- cross-agent handoff between GPT, Claude, Codex, and GitHub review
- architecture-heavy work where consistency across spec, plan, tasks, and implementation matters
- milestone planning that should become repeatable project process

Do not use Spec Kit for:

- ordinary small bugfixes
- R0.3-style implementation-only refactors
- audio engine internals unless the milestone explicitly asks for a new architecture/spec workflow
- Web Audio bug diagnosis
- localStorage/session logic fixes
- small CSS or TypeScript edits
- normal build/lint/typecheck work
- routine code review
- merge work

Spec Kit is not an Inner Atlas runtime dependency. Do not add it to package.json or lockfiles.

The global CLI is installed as `specify`, but on this Windows profile the uv shim may be blocked by Access Denied. If that happens, invoke the installed entry point with:

`C:\Users\gmarchese\AppData\Roaming\uv\tools\specify-cli\Scripts\python.exe -c "import sys, specify_cli; sys.argv=['specify','--help']; specify_cli.main()"`

Do not run `specify init --here`, `specify init .`, or any command that creates `.specify/`, agent command files, or agent skills inside Inner Atlas unless the user explicitly approves that project-local initialization.

If project-local initialization is approved, prefer Codex skills mode:

`specify init --here --integration codex --integration-options="--skills"`

Before using Spec Kit, state:

- why Spec Kit is needed instead of the existing GPT scope / Claude architecture / Codex implementation pipeline
- whether the operation is read-only CLI inspection, project initialization, spec creation, planning, task generation, analysis, or implementation
- expected files or directories it may create or modify
- whether outputs are throwaway planning artifacts or production-facing project process

After using Spec Kit, report:

- command used
- files created or changed
- whether `.specify/` or agent skills/commands were added
- how the resulting spec/plan/tasks map to the Inner Atlas roadmap
- what should be sent to Claude for architecture or diff-risk review

## Open Design Routing

Open Design is an optional local-first design/prototype/artifact system for agent-native design workflows.

It is installed as the Windows desktop app at:

`C:\Users\gmarchese\AppData\Local\Programs\Open Design\Open Design.exe`

Bundled reference assets are available under:

`C:\Users\gmarchese\AppData\Local\Programs\Open Design\resources\open-design\`

Open Design may provide:

- DESIGN.md design systems
- agent skills
- plugins
- prototype generation
- artifact previews
- MCP access through the configured Codex `open-design` MCP server
- Codex/Cursor/Claude-compatible design-source workflows
- HTML/PDF/PPTX/MP4 export
- HyperFrames motion workflows
- design-system-driven artifact generation

Open Design is not part of the normal Inner Atlas R.0.X implementation workflow.

Use Open Design only when the task explicitly involves:

- design-system exploration
- creating or refining Inner Atlas DESIGN.md
- visual-system work
- UI prototype generation
- landing page or waitlist page prototyping
- dashboard/live artifact prototyping
- deck/presentation artifact generation
- image/video/motion artifact exploration
- HyperFrames motion graphics
- DESIGN.md-driven implementation research
- comparing design systems
- generating throwaway prototypes for review before production implementation

Do not use Open Design for:

- ordinary Inner Atlas R.0.X implementation
- audio engine work
- Web Audio bugs
- localStorage/session logic
- small CSS edits
- small TypeScript edits
- normal build/lint work
- database/backend logic
- GitHub merge work
- routine code review
- production implementation unless explicitly approved

Open Design is not an Inner Atlas runtime dependency. Do not add it to package.json or lockfiles.

Do not copy generated artifacts, DESIGN.md files, plugins, HTML, or prototype outputs into Inner Atlas production code without explicit approval.

Current install caveat: the desktop app is installed, and Codex has an `open-design` MCP server configured with the packaged Node CLI entrypoint. The Open Design `od` command is still not on PATH; Git Bash `od` is GNU octal-dump, not Open Design. Use the configured MCP server or the packaged CLI directly:

`C:\Program Files\nodejs\node.exe "C:\Users\gmarchese\AppData\Local\Programs\Open Design\resources\app\prebundled\daemon\daemon-cli.mjs" ...`

The MCP server proxies to a running Open Design daemon at `http://127.0.0.1:7456`. Start the Open Design desktop app or daemon before expecting MCP tool calls to return live projects/artifacts. If the current Codex session does not expose Open Design tools yet, restart Codex so it reloads MCP config.

Figma Make remains useful for exploratory UI/UX design and visual ideation. Open Design is useful for agent-native artifact generation, DESIGN.md-driven prototypes, and Codex-accessible design-system references. Codex remains responsible for production implementation in the Inner Atlas repo, and Claude remains responsible for architecture/product review and final diff risk analysis.

The Inner Atlas visual direction in this file remains authoritative. Open Design output is reference material until reviewed and explicitly accepted.

Before using Open Design, state:

- why Open Design is needed
- why Figma/Codex alone is insufficient
- selected Open Design mode, skill, plugin, or design system if known
- whether output is throwaway prototype, design reference, or production candidate
- expected files or artifacts
- whether generated output will remain outside the repo

After using Open Design, report:

- command/tool used
- artifact or design system used
- files/artifacts generated
- whether anything was copied into Inner Atlas
- visual/UX findings
- production implementation recommendations
- what should be discarded, kept as reference, or passed to Claude/Codex

## Book-To-Skill / Codex Knowledge Skill Generation Routing

`book-to-skill` is a Codex/global knowledge-skill generator for turning approved source material into durable skills.

Use `book-to-skill` only when the explicit task is to generate or update a knowledge skill from approved books, documents, papers, manuals, or long-form reference material.

Do not use `book-to-skill` for:

- ordinary Inner Atlas implementation
- R.0.X bugfixing
- visual refactors
- audio engine work
- QA
- merge work
- runtime app logic
- dependency updates
- product planning

Generated knowledge skills should normally live under `~/.agents/skills/<generated-skill-slug>`, not inside the Inner Atlas repo.

Before converting any source material:

- confirm the source is approved for this use
- confirm copyright, license, privacy, and confidentiality constraints
- ask whether the user wants analyze-only mode or full skill generation
- estimate cost and output location before generation
- do not install optional extraction dependencies unless explicitly approved

Never store copyrighted, licensed, private, sensitive, confidential, or unapproved generated skills inside the Inner Atlas repo.

Do not store secrets, credentials, `.env` files, transient logs, command noise, or private content in generated skill datasets.

Do not convert any book or document unless the user explicitly approves that specific conversion.

## Agency Agents / Codex Custom Agent Routing

`agency-agents` is an optional Codex custom-agent library.

It provides specialist role agents installed globally under:

`~/.codex/agents/`

Source checkout:

`C:\Users\gmarchese\reference\agency-agents`

Installed from upstream revision `f541d07` for these divisions:

- Engineering
- Design
- Product
- Project Management
- Testing
- Security
- Support
- Specialized
- Academic

These nine divisions currently provide 126 Codex custom-agent TOML files. Codex auto-discovers standalone agents under `~/.codex/agents/`; restart Codex after installing or updating them.

Use agency-agents only when a task benefits from explicit specialist perspective, role-based critique, cross-functional review, or domain-specific planning.

Inner Atlas project-specific skills remain primary.

Do not use agency-agents as the default path for ordinary implementation.

## Core Rules

Use agency-agents when the task explicitly involves:

- product strategy
- UX research
- design critique
- visual-system review
- frontend engineering review
- senior engineering review
- software architecture review
- project planning
- evidence collection
- reality checking
- landing page strategy
- marketing/public positioning
- beta readiness
- large multi-phase planning
- architectural tradeoff review
- pre-implementation debate
- post-implementation critique
- specialist domain review that normal Inner Atlas skills do not cover

Do not use agency-agents for:

- small bugfixes
- ordinary R0.X implementation
- audio engine bugfixes
- localStorage fixes
- simple CSS edits
- simple TypeScript edits
- routine build/lint checks
- normal GitHub merge work
- tasks already sufficiently handled by Inner Atlas project skills

Routing priority:

1. Use Inner Atlas project-specific skills first.
2. Use normal Skill Router specialist skills second.
3. Use agency-agents only when an explicit specialist role adds value.
4. Use the minimum number of agency agents.
5. Do not ask multiple agency agents to review the same task unless the task is large enough to justify cross-functional review.

Before using an agency agent, state:

- selected agency agent
- why that role is needed
- why normal Inner Atlas skills are insufficient
- expected output
- whether the agent is advisory, review-focused, planning-focused, or implementation-facing

Agency agents should usually be advisory.

They may produce:

- critique
- risk analysis
- implementation brief
- test ideas
- design feedback
- product framing
- evidence checklist
- specialist review
- role-based objections
- readiness verdict

They should not silently modify code unless the current Codex task explicitly authorizes implementation.

## Engineering Role Routing

Use `Frontend Developer` for React/Vue/Angular UI implementation, performance, pixel-perfect UI work, Core Web Vitals, component behavior, and modern web app frontend quality.

Use `Backend Architect` for API design, database architecture, scalability, server-side systems, microservices, cloud infrastructure, and backend integration strategy.

Use `Mobile App Builder` only if Inner Atlas becomes mobile-native or cross-platform. Do not use for ordinary web app work.

Use `AI Engineer` when a milestone introduces ML models, AI integration, data pipelines, semantic search, embeddings, recommendation logic, or AI-powered app behavior.

Use `DevOps Automator` for CI/CD, deployment automation, monitoring, environment automation, Netlify/GitHub Actions workflow design, and production operations.

Use `Rapid Prototyper` for fast proof-of-concepts, MVP experiments, throwaway spikes, feature feasibility tests, and rapid UI/interaction exploration.

Use `Senior Developer` for complex implementation planning, architectural tradeoffs, advanced patterns, risky refactors, and code-quality arbitration.

Use `Autonomous Optimization Architect` for LLM routing, cost optimization, shadow testing, intelligent API selection, autonomous agent cost guardrails, and model-routing experiments.

Use `Codebase Onboarding Engineer` for fast read-only repo exploration, code path tracing, factual codebase explanations, and helping a new agent or human understand structure and behavior.

Use `Technical Writer` for developer docs, API references, implementation notes, tutorials, README improvements, release notes, architecture docs, and handoff documentation.

Use `Code Reviewer` for constructive PR review, maintainability, correctness, security, mentoring-style feedback, and pre-merge quality gates.

Use `Database Optimizer` for schema design, indexing, slow query debugging, migration planning, PostgreSQL/MySQL tuning, Supabase/Postgres performance, and data model review.

Use `Git Workflow Master` for branching strategies, conventional commits, history cleanup, PR discipline, release branching, and CI-friendly Git workflow.

Use `Software Architect` for system design, DDD, architectural patterns, tradeoff analysis, domain modeling, system evolution strategy, and long-term app architecture.

Use `SRE` for SLOs, error budgets, observability, chaos engineering, reliability planning, capacity planning, and toil reduction.

Use `Data Engineer` for ETL/ELT, lakehouse architecture, analytics pipelines, data warehousing, durable data workflows, and structured data ingestion.

Use `Email Intelligence Engineer` for email parsing, MIME extraction, thread summarization, and transforming email content into structured reasoning-ready context.

Use `Voice AI Integration Engineer` if Inner Atlas later introduces transcription, ASR, Whisper, diarization, voice journaling, or structured transcript workflows.

Use `IT Service Manager` for ITIL-style incident/problem/change management, SLAs, CMDB thinking, service operations, and support-process design.

Use `Minimal Change Engineer` when the task must produce a minimum-viable diff, avoid scope creep, and fix only what was asked.

Use `Prompt Engineer` for turning vague instructions into reliable AI behaviors, improving prompts, agent instructions, Skill Router rules, Claude briefs, Codex briefs, or reusable workflow prompts.

Use `Threat Detection Engineer`, `Embedded Firmware Engineer`, `Solidity Smart Contract Engineer`, `WeChat Mini Program Developer`, `Filament Optimization Specialist`, `OrgScript Engineer`, `Feishu Integration Developer`, `CMS Developer`, and `AI Data Remediation Engineer` only when the milestone explicitly touches those domains.

## Design Division Routing

Use `UI Designer` for interface creation, brand consistency, component libraries, design systems, typography, spacing, visual hierarchy, and component design.

Use `UX Researcher` for understanding users, usability testing, behavior analysis, design insights, tester feedback interpretation, and friction discovery.

Use `UX Architect` for technical UX architecture, CSS systems, implementation foundations, developer-friendly design systems, layout architecture, and design implementation guidance.

Use `Brand Guardian` for brand identity, consistency, positioning, tone, visual language, and protecting Inner Atlas from becoming generic SaaS.

Use `Visual Storyteller` for visual narratives, multimedia content, product storytelling, symbolic journeys, landing page narrative, and emotionally coherent visual flow.

Use `Whimsy Injector` for tasteful delight, micro-interactions, playful but functional personality, emotional easing, and subtle interaction warmth. Do not use it to add distracting gimmicks.

Use `Image Prompt Engineer` for AI image generation prompts, photography prompts, visual asset generation, symbolic image prompts, and moodboard creation.

Use `Inclusive Visuals Specialist` for representation, bias mitigation, culturally accurate imagery, inclusive AI image/video generation, and avoiding exclusionary visual choices.

Use `Persona Walkthrough Specialist` for persona-driven cognitive walkthroughs, simulating user reactions, scroll-position friction, onboarding friction, and UX empathy checks.

## Product Division Routing

Use `Sprint Prioritizer` for feature prioritization, sprint planning, sequencing R0.X builds, resource allocation, and deciding what to defer.

Use `Trend Researcher` for market intelligence, competitive analysis, opportunity assessment, mindfulness/journaling app analysis, AI wellness trends, and product direction checks.

Use `Feedback Synthesizer` for user feedback analysis, tester feedback clustering, insight extraction, product priorities, and converting qualitative feedback into build candidates.

Use `Behavioral Nudge Engine` for behavioral psychology, nudge design, engagement mechanics, journaling motivation, habit loops, and ethical engagement design. Avoid manipulative gamification.

Use `Product Manager` for discovery, PRDs, roadmap planning, outcome measurement, GTM framing, scope control, and translating product direction into milestones.

## Project Management Division Routing

Use `Studio Producer` for high-level orchestration, portfolio management, strategic alignment, and coordinating multiple workstreams.

Use `Project Shepherd` for cross-functional coordination, timeline management, stakeholder-style tracking, and end-to-end milestone coordination.

Use `Studio Operations` for process optimization, operational efficiency, team support, and workflow cleanup.

Use `Experiment Tracker` for A/B tests, hypothesis validation, experiment management, metrics definition, and data-driven product decisions.

Use `Senior Project Manager` for realistic scoping, task conversion, scope management, milestone planning, and converting specs into executable tasks.

Use `Jira Workflow Steward` only when Jira-linked Git discipline, issue traceability, branch naming, and delivery governance are relevant.

Use `Meeting Notes Specialist` for structured summaries, decisions, action items, open questions, and meeting-to-task conversion.

## Testing Division Routing

Use `Evidence Collector` for screenshot-based QA, visual proof, bug documentation, before/after screenshots, browser evidence, and reproducible issue packets.

Use `Reality Checker` for evidence-based certification, production readiness, quality approval, merge readiness, and release certification.

Use `Test Results Analyzer` for test output analysis, coverage interpretation, quality insights, and summarizing failing test patterns.

Use `Performance Benchmarker` for speed testing, load testing, Core Web Vitals, rendering performance, audio/UI performance, and optimization measurement.

Use `API Tester` for endpoint verification, integration testing, API validation, request/response checks, and backend/API regression testing.

Use `Tool Evaluator` for evaluating software tools, repositories, libraries, deployment platforms, testing tools, design tools, and AI workflow tools.

Use `Workflow Optimizer` for process analysis, workflow improvement, automation opportunities, and reducing friction in the Inner Atlas build pipeline.

Use `Accessibility Auditor` for WCAG auditing, assistive technology testing, screen reader behavior, keyboard navigation, contrast, focus states, and inclusive UI verification.

## Security Division Routing

Use `Security Architect` for threat modeling, trust boundaries, secure-by-design architecture, defense in depth, and security requirements before implementation.

Use `Application Security Engineer` for secure code review, SAST/DAST, dependency and secret scanning, secure SDLC, vulnerability remediation, and security regression tests.

Use `Senior SecOps Engineer` for defensive code-level security gates, secrets scanning, secure defaults, and pre-release security verification.

Use `Cloud Security Architect` only when cloud infrastructure, IAM, zero trust, network boundaries, or cloud-native deployment security is in scope.

Use `Penetration Tester` only for explicitly authorized security testing with a defined target and scope. Never use it for unapproved exploitation.

Use `Incident Responder` only for active or simulated breach investigation, containment, forensics, and recovery.

Use `Threat Intelligence Analyst` for adversary, campaign, ATT&CK, and threat-landscape research relevant to a defined risk.

Use `Threat Detection Engineer` for SIEM rules, detection logic, threat hunting, telemetry requirements, and ATT&CK coverage.

Use `Compliance Auditor` for SOC 2, ISO 27001, HIPAA, PCI-DSS, privacy controls, and formal compliance evidence.

Use `Blockchain Security Auditor` only for smart-contract or blockchain security work.

## Specialized Division Routing

Use `Agents Orchestrator` only for complex projects requiring multiple agency agents or cross-functional role coordination. Do not use it for ordinary single-task work.

Use `LSP/Index Engineer` for language server protocol, code intelligence, semantic indexing, search/index architecture, and repo intelligence systems.

Use `Agentic Identity & Trust Architect` for multi-agent identity, agent authorization, audit trails, trust verification, and secure agentic system design.

Use `Identity Graph Operator` for shared identity resolution, entity deduplication, merge proposals, and cross-agent identity consistency.

Use `Cultural Intelligence Strategist` for global UX, cultural exclusion, representation, localization sensitivity, and cross-cultural product resonance.

Use `Developer Advocate` for developer community, DX, documentation tone, public technical content, and bridging product with developer audiences.

Use `Model QA Specialist` for ML audits, interpretability, model behavior, feature analysis, and AI system quality assurance.

Use `ZK Steward` for knowledge management, Zettelkasten, note systems, connected knowledge bases, and validated project memory.

Use `MCP Builder` for Model Context Protocol servers, AI agent tooling, MCP integrations, and tool extension architecture.

Use `Document Generator` for professional PDF, PPTX, DOCX, XLSX generation, reports, artifacts, and data visualization documents.

Use `Automation Governance Architect` for automation governance, n8n/workflow auditing, business automation control, and approval/risk frameworks.

Use `Corporate Training Designer` for curriculum, enterprise training, onboarding materials, and learning systems.

Use `Personal Growth Mentor` only when the task is explicitly personal development, goal clarity, habit systems, accountability, or life strategy. Do not use for code implementation.

Use `Workflow Architect` for mapping every path through a system before code is written, workflow discovery, routing maps, and process specification.

Use `Business Strategist`, `Change Management Consultant`, `Chief of Staff`, `Customer Success Manager`, and `Pricing Analyst` only for public launch, business strategy, GTM, stakeholder planning, adoption, pricing, or customer lifecycle work.

## Support Division Routing

Use `Support Responder` for customer-support workflows, issue resolution, escalation design, and support experience.

Use `Analytics Reporter` for KPI summaries, dashboards, business intelligence, and evidence-based reporting.

Use `Infrastructure Maintainer` for system operations, monitoring, reliability maintenance, and infrastructure health.

Use `Executive Summary Generator` for concise decision-oriented milestone, risk, or leadership summaries.

Use `Finance Tracker` only for budgeting, cash-flow, or business-performance work.

Use `Legal Compliance Checker` only for preliminary legal/regulatory risk identification; it does not replace qualified legal advice.

## Academic Division Routing

Use `Anthropologist` for culturally coherent societies, rituals, belief systems, kinship, and world-building analysis.

Use `Geographer` for physical/human geography, climate, terrain, settlements, and cartographic coherence.

Use `Historian` for historical analysis, period coherence, material culture, and evidence-based setting review.

Use `Narratologist` for narrative structure, story theory, character arcs, and storytelling analysis.

Use `Psychologist` for research-grounded motivation, personality, cognition, and psychologically credible characters.

Academic agents are primarily for narrative, research, learning, and world-building work. Do not route ordinary Inner Atlas implementation through them.

## Inner Atlas Suggested Agency Agent Sets

For visual-system milestones:

- UI Designer
- UX Architect
- Brand Guardian
- Visual Storyteller
- Accessibility Auditor
- Reality Checker

For R0.6 premium visual refactor:

- UI Designer
- Brand Guardian
- Whimsy Injector
- Evidence Collector
- Frontend Developer
- Minimal Change Engineer

For product/competitor checkpoints:

- Product Manager
- Trend Researcher
- Feedback Synthesizer
- Behavioral Nudge Engine
- Reality Checker

For beta readiness:

- Product Manager
- Senior Developer
- Software Architect
- Security Architect
- Application Security Engineer
- Accessibility Auditor
- Evidence Collector
- Reality Checker

For backend/auth/database future:

- Backend Architect
- Database Optimizer
- Security Architect
- Application Security Engineer
- Software Architect
- SRE

For deployment/CI/CD future:

- DevOps Automator
- SRE
- Git Workflow Master
- Senior SecOps Engineer
- Evidence Collector

For code review:

- Code Reviewer
- Senior Developer
- Minimal Change Engineer
- Application Security Engineer, only when security-sensitive
- Accessibility Auditor, only when UI changed

For documentation:

- Technical Writer
- Document Generator
- Developer Advocate, only for public-facing developer content
- ZK Steward, only for durable knowledge organization

For tool evaluation:

- Tool Evaluator
- Software Architect
- Senior Developer
- Reality Checker

## Usage Constraints

Agency agents may supplement the pipeline, but must not silently replace it.

For small R0.X tasks, prefer the normal pipeline:

GPT scope / Claude architecture / Codex implementation / Codex local review / Claude diff review / GitHub merge.

For large R0.X or beta-readiness tasks, agency-agents may supplement the pipeline with specialist review.

If multiple agency agents are used, explain why each role is necessary and what unique perspective it adds.

Do not use more than three agency agents in one task unless explicitly approved.

For security scans:

- use Gitleaks when secrets, tokens, pre-release risk, or public push risk is relevant
- use OSV-Scanner when dependencies change or before beta/release checks

For memory:

- use AgentMemory only for durable project context, handoff, recall, and milestone summaries
- do not store transient logs, command noise, secrets, or speculative thoughts

For TypeScript:

- use Matt Pocock / TypeScript-specific skills when doing non-trivial TypeScript typing, migrations, or type-level refactors

## Oxc / Oxlint / Oxfmt Routing

Oxc is optional JavaScript/TypeScript development tooling.

Use Oxc-related tools only when the task involves:

- JavaScript/TypeScript linting
- React/TSX quality checks
- pre-merge verification
- broad refactors touching multiple JS/TS/TSX files
- fast static analysis
- CI/lint optimization
- formatter evaluation
- beta/release quality gates

Preferred usage:

- use `oxlint` as a fast supplemental linter
- keep existing ESLint/TypeScript/build checks as authoritative unless explicitly changed
- use `oxfmt` only after confirming it does not conflict with the project's current formatting conventions
- do not format the entire repository without explicit approval

Do not use Oxc/Oxlint/Oxfmt for:

- audio design decisions
- Web Audio architecture
- UI/UX critique
- visual refactors unless JS/TS/TSX quality is also being checked
- p5.js/GSAP/Three.js design decisions
- database work
- deployment work
- product planning
- ordinary small copy/text changes

Safety rules:

- do not install Oxc tools as runtime dependencies
- prefer devDependencies or `npx` usage
- do not replace existing lint/format tooling without explicit approval
- do not run auto-fix or whole-repo formatting without approval
- report findings clearly before applying code changes
- if Oxc tools are requested but unavailable, search local tools and package scripts before declaring them unavailable

Verification guidance:

- after non-trivial TypeScript/React changes, consider running `npm run lint:ox` if available
- before beta/release checks, run existing lint/build checks plus Oxlint if available
- if dependency or tool configuration changes, verify with the existing build and lint pipeline

For workflow:

- use Superpowers skills for systematic debugging, TDD, code review handling, plan execution, and verification when relevant

## Automated Testing Routing

The repository uses:

- Vitest for unit and integration tests
- Testing Library and jsdom for React/DOM integration tests
- `@vitest/coverage-v8` for coverage evidence
- Playwright Test for Chromium, Firefox, and WebKit E2E tests

For testable features, bug fixes, refactors, and behavior changes, use the Superpowers TDD workflow:

1. Write a focused failing test.
2. Run it and verify it fails for the expected reason.
3. Implement the minimum change.
4. Run the focused test and the affected suite.
5. Refactor only while tests remain green.

Exceptions such as generated code, throwaway prototypes, configuration-only changes, or work that cannot be tested first require an explicit user-approved waiver.

Every R.0.X milestone must evaluate:

- unit tests
- integration tests
- E2E/browser tests
- coverage
- manual browser QA
- human visual QA when UI changes
- human listening QA when audio changes

Not every category must receive new tests in every milestone. Every category must be marked applicable or not applicable. If an applicable category is not run, report the reason, omission risk, approver, and whether it blocks merge.

Portable commands:

```bash
pnpm test
pnpm run test:unit
pnpm run test:integration
pnpm run test:coverage
pnpm run test:e2e
```

On this Windows machine, the workspace intentionally excludes platform-native
optional packages. Recreate the verified caches after `%TEMP%` cleanup or a
dependency upgrade:

```powershell
$esbuildCache = Join-Path $env:TEMP "inner-atlas-esbuild-0.28.1"
$nativeCache = Join-Path $env:TEMP "inner-atlas-native-win32"

npm install --prefix $esbuildCache --ignore-scripts --no-audit --no-fund `
  "@esbuild/win32-x64@0.28.1"

npm install --prefix $nativeCache --ignore-scripts --no-audit --no-fund `
  "lightningcss-win32-x64-msvc@1.32.0" `
  "@tailwindcss/oxide-win32-x64-msvc@4.3.0" `
  "@rollup/rollup-win32-x64-msvc@4.60.3"
```

Keep these versions aligned with `pnpm-lock.yaml` after upgrades. Prefix
Vitest, Vite, Playwright web-server, and build commands with the verified
esbuild binary and native cache path:

```powershell
$env:ESBUILD_BINARY_PATH="$env:TEMP\inner-atlas-esbuild-0.28.1\node_modules\@esbuild\win32-x64\esbuild.exe"
$env:NODE_PATH="$env:TEMP\inner-atlas-native-win32\node_modules"
pnpm test
```

Use the same environment variables for `pnpm run test:coverage` and `pnpm run test:e2e`.

The full workspace build and Playwright web server also require the verified
Lightning CSS, Tailwind Oxide, and Rollup native cache through `NODE_PATH`:

```powershell
$env:ESBUILD_BINARY_PATH="$env:TEMP\inner-atlas-esbuild-0.28.1\node_modules\@esbuild\win32-x64\esbuild.exe"
$env:NODE_PATH="$env:TEMP\inner-atlas-native-win32\node_modules"
$env:PORT="5173"
$env:BASE_PATH="/"
pnpm run build
pnpm run test:e2e
```

After installing or upgrading Playwright, install the free browser binaries with:

```bash
pnpm exec playwright install chromium firefox webkit
```

Coverage starts as an evidence baseline, not a blind global threshold. Prioritize changed files and critical modules: audio state, gain safety, storage normalization/migrations, active drafts, saved sessions, scene selection, and feature-flag fallbacks. Add thresholds only after the suite represents meaningful behavior.

Playwright certifies browser behavior, not audible quality. Human listening remains mandatory for audio milestones.

## Task-Based Routing

For feature planning:

- use `inner-atlas-planner`
- use planning skills when relevant

For refactors:

- use `inner-atlas-refactor`
- preserve behavior and visuals unless explicitly changed

For reviews:

- use `inner-atlas-review`
- use review/verification skills
- prioritize bugs, regressions, accessibility, state risks, and missing tests

For review feedback:

- use `receiving-code-review`
- validate each finding independently
- distinguish valid issues from false positives
- do not blindly accept all feedback

For bugs:

- use `systematic-debugging` before proposing fixes

For React/TypeScript changes:

- use React/TypeScript best-practice skills when available
- use Matt Pocock / TypeScript-specific skills for non-trivial typing work

For browser behavior:

- use the project Playwright suite plus `webapp-testing` or in-app browser verification when relevant
- extend `tests/e2e/` when a changed critical user flow needs repeatable regression coverage

For frontend design implementation:

- first use `inner-atlas-visual-refactor` for Inner Atlas visual direction and routing
- use `frontend-design` when building or refining web UI that needs stronger visual hierarchy, composition, responsive layout, or production-grade frontend craft
- use `design-taste-frontend` when the task needs stronger anti-generic visual direction, layout variance, typography, spacing, or motion guidance beyond the baseline frontend router
- use `gpt-taste` only for stricter Codex/GPT-oriented visual exploration, high-variance layouts, or GSAP-heavy direction; do not use it for quiet core-app maintenance unless explicitly useful
- use `image-to-code` only when the user explicitly wants an image-first workflow: generate or inspect reference images, analyze them, then implement matching frontend code
- use `redesign-existing-projects` when improving an existing screen or app surface after an audit, not for greenfield feature work
- use `high-end-visual-design` or `minimalist-ui` only when that visual direction is explicitly chosen or strongly implied by the milestone
- use `brandkit`, `imagegen-frontend-web`, or `imagegen-frontend-mobile` only for generated reference images, brand boards, comps, or mobile/web visual frames; do not treat their output as production code
- use `emil-design-eng` for component polish, interaction detail, animation judgment, and invisible UI craft after the product direction is already clear
- use `ui-ux-pro-max` only as an optional UI/UX reference lookup for design systems, layout/accessibility/palette checks, UX guideline searches, or chart/data-visualization guidance when those references directly support the task
- do not use generic frontend design skills for audio engine logic, storage, state machines, or non-visual refactors

For design critique and audits:

- use `design-critique` when reviewing screenshots, Figma links, mockups, or described screens for hierarchy, usability, consistency, and accessibility
- use `web-design-guidelines` when explicitly asked to audit UI code, accessibility, UX best practices, or compliance with web interface guidelines
- use browser/manual QA evidence when visual behavior changes

For landing pages:

- use `landing-page-design` only for public marketing pages, product pages, hero sections, CTA strategy, or conversion-oriented landing-page work
- do not use `landing-page-design` for the Inner Atlas core app, session experience, journal UI, audio engine, or reflective product flows unless the task explicitly asks for a marketing/landing page
- do not run `belt` or generate external assets through landing-page tooling unless the user explicitly requests it

## DESIGN.md Reference Routing

`awesome-design-md` is an optional design-reference library containing DESIGN.md files extracted from public websites.

It is not a normal runtime dependency, not an app dependency, and not the source of truth for Inner Atlas.

Installed reference checkout:

`C:\Users\gmarchese\reference\awesome-design-md`

Read candidate references from:

`C:\Users\gmarchese\reference\awesome-design-md\design-md\<brand>\DESIGN.md`

Use DESIGN.md references only when the task explicitly involves:

- visual-system work
- UI redesign
- design direction exploration
- layout hierarchy
- typography systems
- color/surface systems
- component styling
- premium visual polish
- landing page design
- public-facing product pages
- R0.6-style visual identity work
- creating or refining Inner Atlas own DESIGN.md

Do not use DESIGN.md references for:

- audio engine work
- Web Audio bugs
- localStorage/session logic
- backend/database work
- dependency updates
- ordinary bugfixes
- non-visual refactors
- GitHub merge work
- browser QA unrelated to UI appearance

Reference policy:

- Treat third-party DESIGN.md files as inspiration and analysis material, not as identities to clone.
- Do not copy a third-party brand identity directly into Inner Atlas.
- Do not place a third-party DESIGN.md in the project root unless explicitly approved.
- Prefer extracting reusable principles: spacing, hierarchy, density, typography scale, surface logic, interaction discipline, and design-system structure.
- Inner Atlas should eventually have its own `DESIGN.md` that reflects its own visual language.
- If multiple references are used, synthesize them into an Inner Atlas-specific direction instead of mixing brands incoherently.

Preferred workflow:

1. Inspect relevant DESIGN.md references from the global reference library.
2. Summarize useful principles.
3. Reject brand-specific elements that do not fit Inner Atlas.
4. Produce an Inner Atlas-specific design brief.
5. Optionally create or update Inner Atlas own `DESIGN.md` on a dedicated branch.
6. Use frontend/design skills for implementation.
7. Verify UI changes in browser.

Relevant skills to consider when DESIGN.md work is in scope:

- `inner-atlas-visual-refactor`
- Open Design, only for design-system references, throwaway prototypes, artifacts, or DESIGN.md exploration
- `frontend-design`
- `design-taste-frontend`
- `high-end-visual-design`
- `minimalist-ui`, only when the direction calls for restrained editorial UI
- `brandkit` or `imagegen-frontend-web`, only for reference images or design boards
- `design-critique`
- `web-design-guidelines`
- `emil-design-eng`
- `landing-page-design`, only for public/marketing surfaces
- browser/frontend verification skills

Safety rules:

- Do not add dependencies only because a DESIGN.md reference mentions a style.
- Do not introduce heavy animation, 3D, p5.js, GSAP, or Motion unless the milestone explicitly requires it.
- Do not let reference aesthetics override Inner Atlas direction: calm, reflective, symbolic, premium, minimal, atmospheric, emotionally coherent.

For current library/API docs:

- use `context7-mcp`

For broad repo analysis:

- use `repomix-explorer`
- do not use it for small targeted file inspection

For large outputs/logs/test results:

- summarize clearly
- use Headroom only when `headroom --help` verifies it is actually installed and available; if available, use it for context compression, large tool outputs, long logs, broad file reads, or cross-agent context compression
- use context/log-management skills when available instead of dumping raw output
- do not run `headroom learn` or allow Headroom to write corrections into AGENTS.md or project instructions unless the user explicitly asks for that action

## Visual, Motion, And Immersive UI Routing

For any visual/UI/motion task, first check whether `inner-atlas-visual-refactor` is available.

Use `inner-atlas-visual-refactor` when the task involves:

- visual redesign
- UI polish
- atmosphere
- motion
- layout hierarchy
- symbolic UI
- ambient visuals
- typography
- glass/liquid styling
- interaction refinement
- mood-based scenes
- frontend aesthetic audits

Then select the minimum specialist skills.

Preferred stack:

- CSS/Tailwind for layout, gradients, glass, typography, spacing, and surfaces
- React for application and component structure
- SVG for crisp symbolic glyphs and icons
- Motion / Framer Motion for component transitions and presence
- GSAP for choreographed animation timelines or complex ritual motion
- p5.js for ambient generative canvas layers
- Three.js / React Three Fiber / Drei only for true 3D or spatial scenes

Use p5.js only when the task requires ambient generative visuals, symbolic particles, flow fields, procedural mood scenes, breathing glyphs, water/noise/fog/star motion, or audio-reactive canvas layers.

Do not use p5.js for ordinary UI layout, buttons, typography, journal formatting, routing, component state, storage, or audio engine logic.

If p5.js is selected, also use:

- `inner-atlas-p5-visual-layer`
- React/frontend verification skills when available
- browser verification when behavior or visual output changes

Use Motion / Framer Motion only when implementing page transitions, presence, component animation, or UI state motion.

Use GSAP only when implementing or debugging GSAP timelines, ScrollTrigger, advanced choreography, or performance-sensitive animation.

Use Three.js / React Three Fiber / Drei only if the feature genuinely benefits from 3D space, depth, camera movement, shaders, spatial objects, or immersive room rendering.

Do not add Motion, GSAP, p5.js, Three.js, React Three Fiber, or Drei dependencies speculatively.

ASCII art is not part of the Inner Atlas product UI. Use ASCII only for CLI banners, terminal output, README decoration, dev tooling, or intentional text-art experiments. If ASCII routing is relevant, use `inner-atlas-ascii-routing`.

## Before Editing

Before modifying code, state:

- selected skills
- rejected obvious skills, if any
- why each selected skill applies
- expected files likely touched
- implementation plan
- risks and tradeoffs

## After Implementation

After implementation, report:

- selected skills
- files changed
- summary of changes
- commands run
- verification evidence
- browser/manual QA evidence when UI or behavior changed
- remaining risks
- deferred refactors

Do not claim completion without verification evidence.

## Project Vision

Inner Atlas is not a productivity application.

The goal is creating a psychologically meaningful introspection platform combining:

- journaling
- symbolic reflection
- mindfulness
- emotional mapping
- aesthetic interaction

The experience should feel calm, intentional and reflective.

Avoid generic corporate SaaS patterns.

---

## Technical Stack

- React
- TypeScript
- Vite
- Tailwind

---

## Development Philosophy

Prioritize:

1. Architecture
2. Readability
3. User experience
4. Performance

Never optimize prematurely.

---

## Design Language

Influences:

- Headspace
- Apple Human Interface Guidelines
- Calm
- Obsidian
- Minimal Japanese design
- Atmospheric creative portfolios

Avoid:

- excessive gradients
- crypto aesthetics
- dashboard overload
- enterprise UI feeling

---

## Coding Standards

- Strict TypeScript
- No any unless justified
- Prefer reusable hooks
- Prefer reusable UI primitives
- Keep files under reasonable size
- Extract repeated logic

---

## Before Large Changes

Always:

- explain the architecture impact
- explain alternatives
- explain tradeoffs

---

## Release Process

For each feature:

- implement
- lint
- follow TDD when applicable
- run applicable unit, integration, E2E, and coverage checks
- complete manual browser QA and human audio/visual QA when relevant
- summarize changes
- identify technical debt
