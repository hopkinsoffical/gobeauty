# EC2 products API

`gb_products_api.py` runs on the ops EC2, mounted into the Twilio inbound shim
(`~/documents/twiml_inbound_shim.py`, uvicorn on 172.31.4.179:8443 with the
nip.io Let's Encrypt cert) because:

1. The gb_* tables live on the VPC-private RDS — Vercel cannot reach it.
2. 8443 is the only public port controlled by our user (SG blocks new ports).

The canonical running copy is `~/documents/gb_products_api.py` on the EC2;
this directory tracks it in git. After editing, copy it there and restart the
shim (`pkill -f twiml_inbound_shim && setsid ~/documents/run_inbound_shim.sh`).

Endpoints (read-only, CORS-scoped to gobeauty.ai):
- GET /api/gb/products?q=&limit=&offset=
- GET /api/gb/products/{slug}
- GET /api/gb/compare?a={slug}&b={slug}

The Next.js side consumes these via `lib/gbApi.ts` (GB_API_URL env overrides
the default https://52-207-187-219.nip.io:8443).
