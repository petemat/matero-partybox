# PartyBox — Agent Swarm Orchestration Plan

## Objective
Iterate fast without breaking quality. Each cycle produces a shippable improvement.

## Roles (subagents)
- **Gameplay Designer**: rules, pacing, twists, solo modes
- **UI/UX Designer**: layout hierarchy, motion, accessibility
- **Frontend Engineer**: implementation in React/TS, PWA
- **QA Engineer**: test plan, edge cases, devices
- **Content Curator**: packs, word lists, translations
- **Growth Designer**: recap/share hooks, packaging, store listing drafts

## Workflow
1) Define 1–3 outcomes for the next release (small)
2) Spawn subagents per outcome
3) Each subagent returns:
   - changeset summary
   - risks
   - acceptance checklist
4) Integrator (main) merges, runs build, runs smoke tests
5) Ship (push) + validate on iOS Safari

## Guardrails
- No breaking changes without migration notes
- Every UX change must be testable in 30 seconds
- Prefer feature flags (localStorage) for experimental features

## Definition of Done (per feature)
- Works on iPhone Safari + Chrome
- No console errors
- Responsive + safe-area
- i18n strings exist for DE/EN
- Basic test added (unit or e2e) OR documented manual check

## Cadence
- Daily: 1 improvement + ship
- Weekly: 1 “pillar” feature (Packs / Recap Share / Solo)

## Test focus
- Start → handoff → countdown → round → correct/skip → time up → next team
- No repeats across a session
- Timer accuracy
