# BlowUp frontend — conventions

Product truth lives in the parent folder: ../PRD.md, ../technical_design_doc.md, ../Design_doc.md (visual system), ../connections.md (screen graph). Read them before changing screens.

## Non-negotiables (product claims enforced in UI)
- The five semantic components in components/domain/ are the ONLY way to render provenance, evidence class, verdict, post state, and baseline multiple. Never inline these states.
- LeverChip is read-only by construction. No tag input affordance may exist anywhere; there is no tagging screen and no route to one.
- INCONCLUSIVE renders with identical size/weight to SEPARATED, in grey. It is an answer, not an error.
- Lime (#c4f82a) only for primary actions and winning values; defined once in app/globals.css. All numbers/metrics in JetBrains Mono.
- The (onboarding) route group has no sidebar and no exits — structural, keep it that way.
- Never use: gradients, glassmorphism, illustrations, emoji, stock photos.

## Architecture
- All API calls same-origin via the /api/* rewrite proxy (next.config.ts) to the FastAPI backend (../blow-up-backend, compose on :8000). Session cookie auth; no CORS anywhere.
- Types come from `npm run gen:api` (backend must be running). Never hand-write API response types.
- Query keys live in lib/api/keys.ts — use them verbatim. Publishing invalidates ['videos']+['dashboard']; round creation invalidates ['rounds'] only.
- Stitch designs (stitch-designs/, gitignored) are layout reference, never pasted code.

## Dev
    npm install && npm run gen:api && npm run dev   # backend compose must be up
    npm test && npx tsc --noEmit

Then run `npm test` (must stay green, 1/1) and commit both files as "docs: project conventions in AGENTS.md/CLAUDE.md". Return: status, commit hash, one-line summary.
