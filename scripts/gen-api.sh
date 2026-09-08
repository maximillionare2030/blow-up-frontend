#!/bin/bash
set -euo pipefail
curl -sf http://localhost:8000/openapi.json -o /tmp/blowup-openapi.json
npx openapi-typescript /tmp/blowup-openapi.json -o lib/api/schema.d.ts
echo "generated lib/api/schema.d.ts"
