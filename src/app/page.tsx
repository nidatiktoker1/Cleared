import Link from "next/link";
import { getBusinessTypes, getLicenseFinderData, getStateReferenceTable } from "@/lib/content";
import { LicenseFinderClient } from "@/components/license-finder-client";

export default function Home() {
  const businessTypes = getBusinessTypes();
  const states = getStateReferenceTable().states;
  const finderData = getLicenseFinderData();

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-12 text-slate-900 sm:px-10">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Cleared
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Clear business licensing for the business you’re starting.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Practical state-by-state guidance for service and online businesses, built from the same content that powers the full guide pages.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              How Cleared works
            </Link>
            <a
              href="#finder"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Open the License Finder
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Fast answer</p>
              <p className="mt-3 text-base font-medium text-slate-900">See common requirements instantly.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Single source</p>
              <p className="mt-3 text-base font-medium text-slate-900">Uses the same data layer as the static guides.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Next step</p>
              <p className="mt-3 text-base font-medium text-slate-900">Link directly to the full state guide.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-200/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">License Finder</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Start with your business type and your state.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Use the interactive finder to compare likely checklist items, then open the full guide for the state that matters.
          </p>
          <div className="mt-8 space-y-4 rounded-3xl bg-slate-900/90 p-6 ring-1 ring-white/10">
            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Business type</p>
              <p className="mt-2 text-base font-semibold">{businessTypes[0].label}</p>
            </div>
            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">State</p>
              <p className="mt-2 text-base font-semibold">{states[0].state_name}</p>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-100">
              This is an interactive preview — the full finder below is powered from the same data layer as the site guides.
            </div>
          </div>
        </div>
      </section>

      <section id="finder" className="mt-12">
        <LicenseFinderClient
          businessTypes={businessTypes}
          states={states}
          initialBusinessTypeSlug={businessTypes[0].slug}
          initialStateName={states[0].state_name}
          finderData={finderData}
        />
      </section>

      <section id="guides" className="mt-16 space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Guides</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Start with the business type that matches your plan.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {businessTypes.map((business) => (
            <Link
              key={business.slug}
              href={`/business-type/${business.slug}`}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{business.label}</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">{business.description}</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">Open the guide for timelines, filing steps, and essential next actions.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900 opacity-80 transition group-hover:text-slate-950">
                <span>Open guide</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
