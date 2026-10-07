import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBusinessTypeStateParams, getBusinessTypeStateData, slugify } from "@/lib/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllBusinessTypeStateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; state: string }>;
}): Promise<Metadata> {
  const { type, state } = await params;
  const page = getBusinessTypeStateData(type, state);

  if (!page || !page.state) {
    return {
      title: "State guide not found",
    };
  }

  return {
    title: `${page.business.definition.label} in ${page.state.state_name}`,
    description: `A practical licensing guide for ${page.business.definition.label.toLowerCase()} businesses in ${page.state.state_name}.`,
  };
}

export default async function BusinessTypeStatePage({
  params,
}: {
  params: Promise<{ type: string; state: string }>;
}) {
  const { type, state } = await params;
  const page = getBusinessTypeStateData(type, state);

  if (!page || !page.state) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-16 text-slate-900">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {page.business.definition.label} in {page.state.state_name}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Licensing guide for {page.state.state_name}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Start with the state-level filing steps, then confirm local city or county requirements before you launch.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">State facts</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">State business registration</dt>
            <dd className="mt-2 text-slate-700">
              <a className="text-blue-700 underline" href={page.state.secretary_of_state_business_url} target="_blank" rel="noreferrer">
                Secretary of State business portal
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tax registration</dt>
            <dd className="mt-2 text-slate-700">
              <a className="text-blue-700 underline" href={page.state.dept_of_revenue_tax_registration_url} target="_blank" rel="noreferrer">
                Department of Revenue tax portal
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">General state business license</dt>
            <dd className="mt-2 text-slate-700">
              {page.state.has_general_state_business_license
                ? `${page.state.state_name} requires a general state business license in addition to any trade-specific permits below.`
                : `${page.state.state_name} does not issue one general state business license - you register the business itself, then meet the specific requirements below and your city or county rules.`}
            </dd>
          </div>
          {page.state.licensing_board_naming_note && page.state.licensing_board_naming_note !== "standard naming" ? (
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">State note</dt>
              <dd className="mt-2 text-slate-700">{page.state.licensing_board_naming_note}</dd>
            </div>
          ) : null}
        </dl>
        {Array.isArray(page.state.source_urls) && page.state.source_urls.length > 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            Sources:{" "}
            {page.state.source_urls.map((url, i) => (
              <span key={url}>
                {i > 0 ? " - " : ""}
                <a className="text-blue-700 underline" href={url} target="_blank" rel="noreferrer">
                  {(() => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } })()}
                </a>
              </span>
            ))}
            {page.state.last_verified_date ? <> - Last verified {page.state.last_verified_date}</> : null}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Typical requirements</h2>
          <ul className="mt-5 space-y-3 text-slate-600">
            {(Array.isArray(page.business.data.typical_state_requirements) ? page.business.data.typical_state_requirements : []).map((item) => (
              <li key={item.requirement_name} className="leading-7">
                <span className="font-medium text-slate-900">{item.requirement_name}</span>
                {item.why_needed ? <span className="block text-sm">{item.why_needed}</span> : null}
                <span className="block text-sm">{item.how_commonly_required}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Need a broader overview?</h2>
          <p className="mt-3 text-slate-600">
            Use the pillar page for this business type to review the general requirements before you narrow to a specific state.
          </p>
          <Link href={`/business-type/${type}`} className="mt-6 inline-flex text-blue-700 underline">
            Return to the pillar page
          </Link>
        </article>
      </section>

      {Array.isArray(page.business.data.federal_requirements) && page.business.data.federal_requirements.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Federal requirements (all states)</h2>
          <ul className="mt-5 space-y-3 text-slate-600">
            {page.business.data.federal_requirements.map((item) => (
              <li key={item.requirement_name} className="leading-7">
                <span className="font-medium text-slate-900">{item.requirement_name}</span>
                {item.why_needed ? <span className="block text-sm">{item.why_needed}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {page.business.data.typical_local_requirements ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">City &amp; county requirements in {page.state.state_name}</h2>
          <p className="mt-3 text-slate-600">{page.business.data.typical_local_requirements.general_pattern}</p>
          {Array.isArray(page.business.data.typical_local_requirements.common_local_permits) && page.business.data.typical_local_requirements.common_local_permits.length > 0 ? (
            <ul className="mt-5 space-y-3 text-slate-600">
              {page.business.data.typical_local_requirements.common_local_permits.map((permit) => (
                <li key={permit.permit_name} className="leading-7">
                  <span className="font-medium text-slate-900">{permit.permit_name}</span>
                  {permit.why_needed ? <span className="block text-sm">{permit.why_needed}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {page.business.data.typical_local_requirements.caveat ? (
            <p className="mt-4 text-sm text-slate-500">{page.business.data.typical_local_requirements.caveat}</p>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
