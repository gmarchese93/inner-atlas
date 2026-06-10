# R.0.X SkillOpt Readiness Check

Run this check automatically during R.0.X closeout before final Claude review, merge, or branch closure.

This check prepares evidence for possible SkillOpt use. It must not run SkillOpt training, call paid model endpoints, or overwrite `AGENTS.md` / `SKILL.md` files.

## Trigger

Run when any of these is true:

- The user says a milestone is ready to close, merge, or send for final review.
- Codex prepares an R.0.X final report.
- Codex prepares a Claude final-review bundle.
- Codex sees the phrase "R.0.X closeout", "close R0", "merge R0", "final Claude review", or "SkillOpt readiness".

## Inputs To Inspect

Use available local evidence:

- Current branch and git status
- Branch diff and changed-file list
- Existing `r0.*-branch-diff.txt` files, if present
- Codex local review notes
- Claude review prompts or findings, if present
- User corrections during the milestone
- Build/typecheck/lint/browser verification results
- Skill/tool routing decisions and mistakes
- `AGENTS.md` and relevant project `SKILL.md` files

Do not include secrets, credentials, `.env` values, raw private logs, or long command noise.

## Decision

Set `SkillOpt recommended` to `yes` only when the issue appears instruction-level and repeatable.

Recommend SkillOpt for:

- Repeated skill-routing errors
- Repeated scope creep caused by unclear instructions
- Repeated verification/completion-claim failures
- Repeated tool-installation confusion
- Repeated Claude review findings caused by weak project instructions
- A project skill consistently producing weak or incomplete output
- Conflicting or ambiguous `AGENTS.md` rules

Do not recommend SkillOpt for:

- One-off implementation bugs
- Normal code defects
- Missing tests caused by task scope, not instructions
- Audio/UI/storage bugs
- Build failures unrelated to agent instructions
- User preference changes
- Any case where a simple manual `AGENTS.md` edit is clearly enough

## Output

Create or update:

`docs/retrospectives/<milestone>-skillopt-readiness.md`

Use `tools/skillopt-readiness/template.md`.

If SkillOpt is recommended, include benchmark prompts and scoring criteria, but stop before running SkillOpt. Ask for explicit approval.

## Closeout Rule

The R.0.X milestone is not closeout-ready until this readiness report exists or the user explicitly waives it.
