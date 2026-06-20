# Security

## Secrets

- Store `CRON_SECRET` and optional `OPENAI_API_KEY` in Vercel environment variables.
- Use `.env.local` only for local development. Git ignores every `.env*` file except `.env.example`.
- Never use a `NEXT_PUBLIC_*` name for a secret. Next.js intentionally includes those values in browser bundles.
- Rotate a credential immediately if it appears in a commit, log, screenshot, or client response. Removing it from the latest commit is not sufficient.

## Application Controls

- `/api/simulate` accepts same-site JSON only, rejects bodies over 64 KiB, validates a strict schema, and restores canonical server-owned player data before simulation.
- Simulation and roster endpoints are rate-limited. LLM explanations also have per-IP and global daily quotas and fall back to local explanations when unavailable.
- `/api/cron/nba-refresh` fails closed without `CRON_SECRET`, compares bearer credentials in constant time, and returns non-cacheable responses.
- Production responses include CSP, HSTS, frame denial, MIME-sniffing prevention, restrictive permissions, and cross-origin isolation headers.

## Vercel Controls

Application rate limits are per function instance. For distributed production enforcement, configure a Vercel Firewall fixed-window rule for `POST /api/simulate`, keyed by IP, with a limit no higher than 12 requests per minute. Enable Bot Protection in log mode first, then challenge after checking legitimate traffic. Vercel's platform DDoS protection is automatic.

Review Firewall events and function errors after each release. During an active attack, enable Attack Challenge Mode in the Vercel dashboard.

## Reporting

Do not open a public issue containing a credential or exploit payload. Contact the repository owner privately with the affected route, impact, and reproduction steps.
