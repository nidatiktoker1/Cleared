import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusinessTypeData, getBusinessTypes, getLicenseFinderData, getStateReferenceTable } from "@/lib/content";
import { LicenseFinderClient } from "@/components/license-finder-client";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getBusinessTypes().map((entry) => ({ type: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const page = getBusinessTypeData(type);

  if (!page) {
    return {
      title: "Business guide not found",
    };
  }

  return {
    title: `${page.definition.label} licensing guide`,
    description: page.definition.description,
  };
}

export default async function BusinessTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const page = getBusinessTypeData(type);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16 text-slate-900">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Cleared business licensing guide
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {page.definition.label} licensing guide
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          {page.definition.description}
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">What this guide covers</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          {page.data.scope_note}
        </p>
      </section>

      <LicenseFinderClient
        businessTypes={getBusinessTypes()}
        states={getStateReferenceTable().states}
        initialBusinessTypeSlug={type}
        initialStateName={getStateReferenceTable().states[0].state_name}
        showBusinessTypeSelector={false}
        finderData={getLicenseFinderData()}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Typical state-level requirements</h2>
          <ul className="mt-5 space-y-3 text-slate-600">
            {(Array.isArray(page.data.typical_state_requirements) ? page.data.typical_state_requirements : []).map((item) => (
              <li key={item.requirement_name} className="leading-7">
                <span className="font-medium text-slate-900">{item.requirement_name}</span>
                <span className="block text-sm">{item.how_commonly_required}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">State-by-state pages</h2>
          <p className="mt-3 text-slate-600">
            Start with the state that matters to your business and review the local filing steps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {(Array.isArray(page.states) ? page.states : []).slice(0, 12).map((state) => (
              <Link
                key={state.state_abbreviation}
                href={`/business-type/${type}/${state.state_name.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {state.state_name}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
