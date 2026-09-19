# Contact Intake Form Design

Revised 2026-09-18: inquiries are stored in the database; email became a best-effort notification to a business inbox.

## Goal

Remove every personal email address from the rendered Terms of Service and Privacy Policy and replace direct email links with a public contact form. Each submission is saved to a database table the owner reads later, and a notification email is sent to a business inbox. No destination address or credential reaches the browser or version control.

## User experience

A public `/contact` page in the marketing route group, using the existing marketing header and visual system, with four fields:

- name
- reply email
- request type: general support, privacy, account deletion, or legal/terms
- message

The submit button shows a pending state. Success replaces the form with a confirmation that the request was received. Validation and save failures appear near the form and allow retrying without losing entered values.

Terms and Privacy link to `/contact` with a `topic` query parameter so privacy, deletion, and legal requests open with the matching request type selected.

## Architecture and data flow

The backend owns storage; the existing Next.js Server Action stays the front door.

1. The Server Action treats all fields as untrusted. It rejects an invalid request type, invalid email, missing text, over-length values, or a malformed submission id. A filled honeypot is silently accepted and discarded.
2. It POSTs the inquiry server-to-server to FastAPI `POST /api/v1/contact` at `API_BASE_URL` with a 10 second timeout. A non-2xx response or network error returns a user-safe retry message (429 returns a "try again later" message) and no email is sent.
3. After a successful save it sends one plain HTML and text email through Resend, with the submitter as `replyTo` and an idempotency key derived from the submission id and content. Any notification failure, including missing email configuration, is logged without message contents and the user still sees success, because the inquiry is stored.

Rejected alternatives: doing the email from a backend worker job (retries are unnecessary when the database is the record, and it rewrites working code), and writing to Supabase from the Server Action (a second schema owner and a service key in the frontend).

## Storage

Backend migration `0004` creates `contact_inquiries`: `id`, `submission_id` (unique), `name`, `email`, `topic` (text with a CHECK of the four topics), `message`, `created_at`, and nullable `handled_at`, with length CHECKs matching the API limits.

- `submission_id` is the UUID the contact page mints per render. Replaying it returns the existing row with `200` instead of `201`, so double submits and retries never duplicate.
- The application role `blowup_app` may INSERT and SELECT only. Supabase's `anon` and `authenticated` roles are revoked entirely so the table is not readable through the Data API. Revokes are guarded by role existence for plain Postgres environments, and `db/grants.sql` repeats the application revoke.
- Viewing is the Supabase table editor. The owner sets `handled_at` by hand. No admin screen or list endpoint exists.

## Abuse and error handling

Validation is enforced in the Server Action and again by the backend's Pydantic model, since the endpoint is reachable directly through the `/api` rewrite. The backend refuses new inquiries with `429` once 30 have been stored in the trailing hour, bounding both table growth and notification volume without per-client state. Same-origin Server Action enforcement and the honeypot remain. CAPTCHA or per-client rate limiting can be added if real traffic warrants it.

## Configuration

Frontend, server-only:

- `API_BASE_URL`: backend origin (already used by the `/api` rewrite)
- `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`: optional; power the notification. The recipient is a business inbox set only in environment configuration.

The committed `.env.example` holds empty placeholders.

## Legal copy

The Privacy Policy states that contact requests are stored in the database and copied to a business inbox, lists Supabase, Resend, and the business email provider as processors for them, and covers retention and deletion of requests.

## Verification

Backend: tests for persistence, no-session access, idempotent replay, validation, the hourly cap, and denied UPDATE/DELETE for the application role; migration upgrade/downgrade round trip. Frontend: tests for save-before-notify ordering, no email on save failure, success despite notification failure, honeypot, preserved form values, and the absence of any email address in rendered legal pages; then the full test suite, `tsc --noEmit`, and ESLint.
