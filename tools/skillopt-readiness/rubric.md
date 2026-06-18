# SkillOpt Readiness Rubric

Use this rubric to decide whether a milestone should produce a SkillOpt benchmark pack.

## Score

Rate each category from 0 to 3.

| Category | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Repeatability | One-off | Could recur | Recurred in this milestone | Recurred across milestones |
| Instruction Cause | Code/task issue | Weak link to instructions | Likely instruction gap | Clear instruction conflict/gap |
| Impact | Low | Some rework | Meaningful delay/risk | Merge-blocking or trust-damaging |
| Benchmarkability | Hard to test | Vague examples | Several concrete prompts | Clear prompts + expected outputs |
| Safer Than Manual Edit | Manual edit is enough | Maybe | SkillOpt may help | SkillOpt clearly useful |

## Recommendation Thresholds

- `0-5`: Do not run SkillOpt.
- `6-8`: Defer. Track the pattern, but prefer manual instruction edits.
- `9-11`: Prepare benchmark pack. Ask whether to run SkillOpt.
- `12-15`: Strongly recommend SkillOpt after user approval.

## Required Evidence

For any `yes` or `defer` recommendation, include:

- At least one concrete prompt/task that exposed the issue
- The observed weak behavior
- The expected behavior
- The target instruction file
- A scoring rule that can judge pass/fail without relying on vibes

## Safety Gates

Never recommend automatic replacement of `AGENTS.md` or `SKILL.md`.

Never include secrets, raw private logs, or hidden credentials in benchmark cases.

Never run SkillOpt without:

- user approval
- benchmark cases
- scoring criteria
- train/validation split
- output path outside app source
- manual review plan
