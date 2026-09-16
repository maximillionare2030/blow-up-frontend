import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export const metadata = { title: "Terms of Service — BlowUp" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <h2 className="mb-3 text-[15px] font-semibold">{title}</h2>
    <div className="space-y-3 text-[13px] leading-relaxed text-neutral">{children}</div>
  </section>
);

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-mono text-[15px] font-bold"><LogoMark size={28} />BlowUp</Link>
        <Link href="/login" className="text-[13px] text-neutral hover:text-ink">Log in</Link>
      </header>

      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-[13px] text-neutral">Last updated: September 14, 2026</p>

      <Section title="1. What BlowUp is">
        <p>
          BlowUp (&ldquo;BlowUp&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a tool that lets
          you publish videos to TikTok accounts you own and compare how those videos perform.
          By creating an account or using BlowUp you agree to these terms. If you do not agree,
          do not use the service.
        </p>
      </Section>

      <Section title="2. Eligibility and your account">
        <p>You must be at least 13 years old (or the minimum age required to use TikTok in your
          region, if higher) and able to form a binding agreement. You are responsible for your
          login credentials and for all activity under your account. Keep your contact email
          accurate so we can reach you about the service.</p>
      </Section>

      <Section title="3. Connecting TikTok accounts">
        <p>You may only connect TikTok accounts that you own or are expressly authorized to
          operate. When you connect an account you authorize BlowUp to access it through
          TikTok&rsquo;s official APIs with the permissions you approve — including reading your
          profile and video data and publishing videos on your behalf when you initiate a post.
          You can revoke this access at any time, in BlowUp or in TikTok&rsquo;s settings.</p>
        <p>Your use of TikTok through BlowUp remains subject to TikTok&rsquo;s own
          <a className="underline" href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noreferrer"> Terms of Service</a> and
          <a className="underline" href="https://www.tiktok.com/community-guidelines" target="_blank" rel="noreferrer"> Community Guidelines</a>.
          BlowUp does not create, buy, sell, or supply TikTok accounts.</p>
      </Section>

      <Section title="4. Your content">
        <p>You retain all rights to the videos, captions, and other content you upload. You
          grant us a limited license to host, store, process, and transmit that content solely
          to operate the service — for example, storing a video file and delivering it to TikTok
          when you publish. You are responsible for your content: you must have the rights to
          everything you upload (including any music or third-party material), and it must not
          be unlawful or infringe anyone&rsquo;s rights.</p>
      </Section>

      <Section title="5. Acceptable use">
        <p>You agree not to: use BlowUp to spam, mislead, or artificially manipulate engagement;
          connect accounts you do not own or lack authorization to operate; attempt to
          circumvent TikTok&rsquo;s rules, rate limits, or moderation; probe, disrupt, or
          reverse-engineer the service; or resell access to it. We may suspend or terminate
          accounts that violate these terms or put the service or other users at risk.</p>
      </Section>

      <Section title="6. Service availability">
        <p>BlowUp depends on third-party platforms, including TikTok&rsquo;s APIs, which may
          change, rate-limit, or become unavailable without notice. We provide the service on an
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis and do not guarantee
          uninterrupted operation, that any video will publish successfully or at a particular
          time, or that metrics from TikTok are accurate or complete. BlowUp makes no promises
          about the performance of your content — it reports comparisons; it does not guarantee
          views or growth.</p>
      </Section>

      <Section title="7. Disclaimer and limitation of liability">
        <p>To the maximum extent permitted by law, we disclaim all warranties, express or
          implied, including merchantability, fitness for a particular purpose, and
          non-infringement. To the same extent, we are not liable for indirect, incidental,
          special, consequential, or punitive damages, or for lost profits, revenues, data, or
          goodwill, arising from your use of the service. Our total liability for any claim
          relating to the service is limited to the greater of the amount you paid us in the
          twelve months before the claim or USD $50.</p>
      </Section>

      <Section title="8. Termination">
        <p>You may stop using BlowUp and request deletion of your account and data at any time
          by emailing <a className="underline" href="mailto:maxtrinh4@gmail.com">maxtrinh4@gmail.com</a>.
          We may suspend or terminate the service or your access to it for violation of these
          terms, legal requirements, or discontinuation of the service; where practical we will
          give reasonable notice. Sections 4 (as to past use), 7, and 9 survive termination.</p>
      </Section>

      <Section title="9. General">
        <p>These terms are the entire agreement between you and us regarding the service. If a
          provision is found unenforceable, the rest remains in effect. We may update these
          terms; we will revise the date above and, for material changes, notify registered
          users by email. Continued use after changes take effect constitutes acceptance. These
          terms are governed by the laws of the United States and the state in which the
          operator of BlowUp resides, without regard to conflict-of-law rules.</p>
      </Section>

      <Section title="10. Contact">
        <p><a className="underline" href="mailto:maxtrinh4@gmail.com">maxtrinh4@gmail.com</a></p>
      </Section>
    </div>
  );
}
