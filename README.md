# blow-up-frontend

BlowUp web app. Backend must be running: see ../blow-up-backend/README.md.

    npm install
    npm run gen:api    # backend must be up on :8000
    npm run dev        # :3000, /api proxied to the backend
    npm test

## Contact form

The public `/contact` form replaces every email address on the Terms and Privacy
pages. Its Server Action does two things, in order:

1. **Saves the inquiry** by calling the backend's `POST /api/v1/contact`
   server-to-server at `API_BASE_URL`. The `contact_inquiries` table is the record.
   If this fails the sender sees a retry message and keeps what they typed.
2. **Emails a heads-up** through Resend. This is best-effort: once the inquiry is
   saved the sender sees success even if the email fails or is not configured.
   Failures are logged without the message contents.

### Reading inquiries

Open the `contact_inquiries` table in the Supabase table editor, newest
`created_at` first. Set `handled_at` on a row when you have dealt with it. The
application's database role can insert and read inquiries but never edit or
delete them, and Supabase's public API roles have no access to the table.

The backend migration must be applied before deploying this form
(`make migrate-prod` in `../blow-up-backend`).

### Notification email setup (optional)

1. Create a [Resend account](https://resend.com), add the business domain, and
   add the DNS records Resend shows until the domain verifies.
   See [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction).
2. Create a sending API key and set `RESEND_API_KEY` in `.env.local`.
3. Set `CONTACT_TO_EMAIL` to the business inbox that should receive notifications
   and `CONTACT_FROM_EMAIL` to a sender on the verified domain, such as
   `BlowUp <contact@your-verified-domain>`. The sender needs no mailbox.
4. Add the same variables to the **frontend** hosting service and redeploy.
   Locally, restart `npm run dev` after changing them.
5. Submit `/contact`, confirm the row appears in `contact_inquiries`, the email
   arrives, and Reply targets the submitter.

Never prefix these variables with `NEXT_PUBLIC_`, commit their values, or put an
address in source; `.env.example` has empty placeholders. Automated tests mock
both the backend call and Resend.

Abuse limits: input validation on both sides, a honeypot, the framework's
same-origin checks for Server Actions, and a backend cap of 30 stored inquiries
per hour (the sender is asked to try again later). Retrying an unchanged
submission never creates a second row or a second email.
