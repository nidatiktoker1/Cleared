"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BusinessTypeDefinition, LicenseFinderData, StateReference } from "@/lib/content";

interface LicenseFinderClientProps {
  businessTypes: BusinessTypeDefinition[];
  states: StateReference[];
  initialBusinessTypeSlug: string;
  initialStateName: string;
  showBusinessTypeSelector?: boolean;
  finderData: Record<string, LicenseFinderData>;
}

function buildKey(businessSlug: string, stateName: string) {
  return `${businessSlug}::${stateName}`;
}

export function LicenseFinderClient({
  businessTypes,
  states,
  initialBusinessTypeSlug,
  initialStateName,
  showBusinessTypeSelector = true,
  finderData,
}: LicenseFinderClientProps) {
  const [selectedBusinessTypeSlug, setSelectedBusinessTypeSlug] = useState(
    initialBusinessTypeSlug,
  );
  const [selectedStateName, setSelectedStateName] = useState(initialStateName);

  const selectedBusiness =
    businessTypes.find((entry) => entry.slug === selectedBusinessTypeSlug) ??
    businessTypes[0];
  const selectedState =
    states.find((entry) => entry.state_name === selectedStateName) ?? states[0];

  const currentData = useMemo(() => {
    if (!selectedBusiness || !selectedState) {
      return null;
    }

    return finderData[buildKey(selectedBusiness.slug, selectedState.state_name)] ?? null;
  }, [finderData, selectedBusiness, selectedState]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            License Finder
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Find what your business likely needs in seconds.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Choose a business type and state to unlock a checklist from the same data that powers the full state guides.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
          {showBusinessTypeSelector ? (
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Business type
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {businessTypes.map((business) => {
                  const isActive = selectedBusiness?.slug === business.slug;
                  return (
                    <button
                      key={business.slug}
                      type="button"
                      onClick={() => setSelectedBusinessTypeSlug(business.slug)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      {business.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Business type
              </p>
              <p className="mt-2 text-sm font-medium text-slate-800">{selectedBusiness?.label}</p>
            </div>
          )}

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <label className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500" htmlFor="state-select">
              State
            </label>
            <select
              id="state-select"
              value={selectedState?.state_name ?? ""}
              onChange={(event) => setSelectedStateName(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900"
            >
              {states.map((state) => (
                <option key={state.state_abbreviation} value={state.state_name}>
                  {state.state_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentData ? (
          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Suggested checklist for {selectedState?.state_name}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedBusiness?.label} business checklist
                </h3>
              </div>
              <Link
                href={`/business-type/${selectedBusiness?.slug}/${selectedState ? selectedState.state_name.toLowerCase().replace(/\s+/g, "-") : ""}`}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                View full state guide
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <h4 className="text-base font-semibold text-slate-900">Commonly required</h4>
                </div>
                <div className="space-y-3">
                  {currentData.commonlyRequiredItems.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-amber-200 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <h4 className="text-base font-semibold text-slate-900">State-verified</h4>
                </div>
                <div className="space-y-3">
                  {currentData.stateVerifiedItems.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Disclaimer</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                This is general guidance, not legal advice. Requirements change — verify with your state's official site before applying.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
