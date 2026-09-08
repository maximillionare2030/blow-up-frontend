export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // The funnel has no exits: no sidebar, no nav, no back. Structural, not a rule.
  return <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center py-12">{children}</main>;
}
