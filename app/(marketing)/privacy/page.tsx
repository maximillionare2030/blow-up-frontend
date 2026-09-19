import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export const metadata = { title: "Privacy Policy — BlowUp" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <h2 className="mb-3 text-[15px] font-semibold">{title}</h2>
    <div className="space-y-3 text-[13px] leading-relaxed text-neutral">{children}</div>
  </section>
);

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-mono text-[15px] font-bold"><LogoMark size={28} />BlowUp</Link>
        <Link href="/login" className="text-[13px] text-neutral hover:text-ink">Log in</Link>
      </header>

      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-[13px] text-neutral">Last updated: September 18, 2026</p>

      <Section title="Who we are">
        <p>
          BlowUp (&ldquo;BlowUp&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a tool that helps
          creators publish videos to their own TikTok accounts and compare how those videos
          perform. This policy explains what information we collect, how we use it, and the
          choices you have. Questions: use our <Link className="underline" href="/contact?topic=privacy">contact form</Link>.
        </p>
      </Section>

      <Section title="Information we collect">
        <p><strong className="text-ink">Contact requests.</strong> When you contact us, we collect
          your name, email address, request type, and message. We store the request in our
          database and send a copy to our business inbox so we can respond.</p>
        <p><strong className="text-ink">Account information.</strong> When you sign up we collect
          your email address and a password (stored only as a salted hash), or, if you sign in
          with Google, your email address and basic profile information provided by Google.</p>
        <p><strong className="text-ink">TikTok account data.</strong> When you connect a TikTok
          account, TikTok provides us, with your authorization, an access token and refresh
          token, your basic profile information (such as display name, avatar, and account
          identifier), and the list of videos on that account together with their metadata and
          performance metrics (such as view counts). Tokens are stored encrypted. We only access
          the TikTok data covered by the permissions you approve during TikTok&rsquo;s
          authorization flow.</p>
        <p><strong className="text-ink">Content you upload.</strong> Video files, captions, tags,
          and notes you create in BlowUp in order to publish or analyze your posts.</p>
        <p><strong className="text-ink">Usage and technical data.</strong> Standard server logs
          (such as IP address, browser type, and timestamps) generated when you use the service,
          used for security and debugging.</p>
      </Section>

      <Section title="How we use information">
        <p>We use this information solely to operate BlowUp: to authenticate you, to publish
          videos to the TikTok accounts you connect (only when you initiate a post), to ingest
          and display the performance of your videos, to compute comparisons across your own
          posts, to respond to contact requests, and to keep the service secure. We do not use your data for advertising, we do
          not sell or rent your personal information, and we do not use your content or metrics
          to build products for anyone other than you.</p>
      </Section>

      <Section title="How information is shared">
        <p>We share data only with the service providers that host BlowUp, and only as needed to
          run it: Supabase (database hosting, including stored contact requests), Cloudflare R2 (video
          file storage), Railway (application hosting), Resend and our business email provider
          (delivery and storage of contact request notifications), Google (if you sign in with
          Google), and TikTok (to publish
          your videos and retrieve your video data through TikTok&rsquo;s official APIs, subject
          to TikTok&rsquo;s own <a className="underline" href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a>).
          We may also disclose information if required by law. There are no other third
          parties.</p>
      </Section>

      <Section title="Data retention and deletion">
        <p>We keep your data while your account is active. You can disconnect a TikTok account
          at any time from within BlowUp, or revoke BlowUp&rsquo;s access from TikTok&rsquo;s own
          settings (Settings &rarr; Security &amp; permissions &rarr; Apps &amp; websites); either action
          invalidates the stored tokens. To delete your BlowUp account and its associated data
          — including stored tokens, uploaded videos, and ingested metrics — submit an
          <Link className="underline" href="/contact?topic=deletion"> account deletion request</Link> and
          we will complete the deletion within 30 days.</p>
        <p>Contact requests and related correspondence are retained as needed to respond to and resolve your request
          and meet applicable legal obligations. You can request its deletion through the contact form.</p>
      </Section>

      <Section title="Security">
        <p>TikTok access and refresh tokens are encrypted at rest. Passwords are stored only as
          salted hashes. All traffic to and from BlowUp is encrypted in transit (HTTPS). No
          method of storage or transmission is perfectly secure, but we limit collection to what
          the service needs to function.</p>
      </Section>

      <Section title="Children">
        <p>BlowUp is not directed at children and may not be used by anyone under 13 (or the
          minimum age required to use TikTok in your region, if higher).</p>
      </Section>

      <Section title="Changes">
        <p>If we change this policy we will update this page and revise the date above. Material
          changes will be communicated to registered users by email.</p>
      </Section>

      <Section title="Contact">
        <p>For any privacy question or request:
          <Link className="underline" href="/contact?topic=privacy"> use our contact form</Link>.</p>
      </Section>
    </div>
  );
}
