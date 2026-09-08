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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
