import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusinessTypeStateData, slugify } from "@/lib/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { type: "cleaning-service", state: "california" },
    { type: "ecommerce-online-resale", state: "california" },
    { type: "freelance-consulting-coaching", state: "california" },
  ];
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
    title: `${page.business.definition.label} in ${page.state.state_name} | Cleared`,
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
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Typical requirements</h2>
          <ul className="mt-5 space-y-3 text-slate-600">
            {(Array.isArray(page.business.data.typical_state_requirements) ? page.business.data.typical_state_requirements : []).slice(0, 4).map((item) => (
              <li key={item.requirement_name} className="leading-7">
                <span className="font-medium text-slate-900">{item.requirement_name}</span>
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
    </main>
  );
}
