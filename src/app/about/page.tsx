import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Cleared",
  description: "How Cleared helps small business owners understand licensing requirements clearly.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-16 text-slate-900">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">About</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Cleared is built for clarity.</h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          We turn business-licensing rules into plain-language guides so owners can spot the likely requirements before they spend money or time on the wrong filings.
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">What we do</h2>
        <p className="mt-3 text-slate-600">
          Our guides combine general business-type patterns with state-specific filing info so owners can move from broad questions to concrete next steps.
        </p>
      </section>
    </main>
  );
}
