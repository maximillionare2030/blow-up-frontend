# Contact Intake Form Design

## Goal

Remove `maxtrinh4@gmail.com` from the rendered Terms of Service and Privacy Policy and replace direct email links with a public contact form. Form submissions must reach that Gmail inbox without exposing the destination address or the Resend API key to the browser.

## User experience

Add a public `/contact` page within the marketing route group. The page uses the existing BlowUp marketing header and visual system and contains four fields:

- name
- reply email
- request type: general support, privacy, account deletion, or legal/terms
- message

The submit button shows a pending state. A successful submission replaces the form status with a clear confirmation while retaining the page navigation. Validation and delivery failures appear near the form and allow retrying without losing the entered values.

Terms and Privacy will link to `/contact` instead of displaying a personal email address. Contextual links use a `topic` query parameter so privacy, deletion, and legal requests open with the matching request type selected.

## Architecture and data flow

The contact form submits to a Next.js Server Action. This avoids the application's `/api/*` rewrite to FastAPI and keeps all Resend credentials on the server.

The Server Action will:

1. Treat all submitted fields as untrusted input.
2. Reject an invalid request type, invalid email, missing text, or values over fixed length limits.
3. Silently accept submissions whose hidden honeypot field is filled, preventing basic automated spam without revealing the filter.
4. Send one plain HTML and text email through the Resend SDK.
5. Read the recipient, sender, and API key from server environment variables.
6. Set the submitter's validated address as `replyTo` so replies go directly to the requester.
7. Return only a small success or user-safe error state to the browser.

No personal destination address or provider credential will be embedded in a Client Component, page source, or browser request payload.

## Email configuration

The runtime requires:

- `RESEND_API_KEY`: a Resend API key with sending permission
- `CONTACT_TO_EMAIL`: the private destination address, set to `maxtrinh4@gmail.com` in local and deployment environments
- `CONTACT_FROM_EMAIL`: a sender on the exact domain or subdomain verified in Resend, such as `BlowUp <contact@mail.example.com>`

The committed example environment file will use placeholders. Setup instructions will cover creating a Resend account, verifying a sending domain, creating an API key, and adding all three values locally and to the deployment platform.

## Abuse and error handling

The initial protection is same-origin Server Action CSRF enforcement, strict validation and length limits, plus a visually hidden honeypot. Provider errors are logged server-side without logging the message contents or credentials. The user receives a generic retry message. If real traffic later attracts sustained spam, CAPTCHA or durable rate limiting can be added based on observed need.

The action uses a per-submission idempotency key when calling Resend to reduce accidental duplicate deliveries caused by retries.

## Files and dependencies

- Add the `resend` package.
- Add `/app/(marketing)/contact/page.tsx` and focused contact form/action modules.
- Update `/app/(marketing)/terms/page.tsx` and `/app/(marketing)/privacy/page.tsx`.
- Add or update an example environment file and README setup instructions.
- Add focused tests for validation, email request construction, form states, and removal of the personal address from rendered legal pages.

## Verification

Run the focused tests first, then the full frontend test suite, TypeScript type checking, and ESLint. Confirm with a repository search that the personal email is absent from tracked frontend source and appears only as a deployment value supplied outside version control.
