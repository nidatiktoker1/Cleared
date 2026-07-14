import fs from "fs";
import path from "path";

export interface StateReference {
  state_name: string;
  state_abbreviation: string;
  secretary_of_state_business_url: string;
  dept_of_revenue_tax_registration_url: string;
  has_general_state_business_license: boolean;
  licensing_board_naming_note: string;
  last_verified_date: string;
  source_urls: string[];
}

export interface StateReferenceTable {
  states: StateReference[];
}

export interface RequirementItem {
  requirement_name: string;
  why_needed: string;
  issuing_agency?: string;
  how_commonly_required: string;
  is_license?: boolean;
  source_urls: string[];
}

export interface LayerAData {
  business_type: string;
  scope_note: string;
  federal_requirements: RequirementItem[];
  federal_requirements_summary: string;
  typical_state_requirements: RequirementItem[];
  typical_local_requirements: {
    general_pattern: string;
    typical_issuing_agency_type: string;
    common_local_permits: Array<{
      permit_name: string;
      why_needed: string;
      source_urls: string[];
    }>;
    caveat: string;
  };
  standard_cost_range?: {
    range_low_usd: number;
    range_high_usd: number;
    description: string;
  };
  standard_renewal_frequency?: {
    pattern: string;
    details: string;
  };
  standard_processing_time?: {
    range: string;
    details: string;
  };
  sources?: Array<{
    title: string;
    url: string;
    publisher?: string;
  }>;
}

export interface BusinessTypeDefinition {
  slug: string;
  label: string;
  description: string;
  jsonFilename: string;
}

export interface BusinessTypePageData {
  definition: BusinessTypeDefinition;
  data: LayerAData;
  states: StateReference[];
}

export interface LicenseFinderItem {
  label: string;
  description: string;
}

export interface LicenseFinderData {
  commonlyRequiredItems: LicenseFinderItem[];
  stateVerifiedItems: LicenseFinderItem[];
}

const BUSINESS_TYPES: BusinessTypeDefinition[] = [
  {
    slug: "cleaning-service",
    label: "Cleaning service",
    description:
      "Residential and commercial cleaning businesses that need a practical licensing checklist.",
    jsonFilename: "cleaning_service_licensing_general.json",
  },
  {
    slug: "ecommerce-online-resale",
    label: "E-commerce / online resale",
    description:
      "Online sellers and resellers that need sales-tax and business-registration guidance.",
    jsonFilename: "ecommerce_online_resale_licensing_general.json",
  },
  {
    slug: "freelance-consulting-coaching",
    label: "Freelance consulting / coaching",
    description:
      "Independent consultants and coaches that need a plain-English licensing overview.",
    jsonFilename: "freelance_consulting_coaching_licensing_general.json",
  },
];

function getContentRoot(): string {
  return process.cwd();
}

function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(getContentRoot(), fileName);
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as T;
}

export function getBusinessTypes(): BusinessTypeDefinition[] {
  return BUSINESS_TYPES;
}

export function getStateReferenceTable(): StateReferenceTable {
  return readJsonFile<StateReferenceTable>("state_reference_table.json");
}

export function getBusinessTypeData(slug: string): BusinessTypePageData | null {
  const definition = BUSINESS_TYPES.find((entry) => entry.slug === slug);

  if (!definition) {
    return null;
  }

  const data = readJsonFile<LayerAData>(definition.jsonFilename);
  const stateTable = getStateReferenceTable();

  return {
    definition,
    data,
    states: stateTable.states,
  };
}

export function getBusinessTypeStateData(
  slug: string,
  stateSlug: string,
): { business: BusinessTypePageData; state: StateReference | null } | null {
  const business = getBusinessTypeData(slug);

  if (!business) {
    return null;
  }

  const state = business.states.find(
    (entry) => slugify(entry.state_name) === stateSlug,
  );

  return {
    business,
    state: state ?? null,
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAllBusinessTypeParams() {
  return BUSINESS_TYPES.map((entry) => ({ type: entry.slug }));
}

export function getAllBusinessTypeStateParams() {
  const stateTable = getStateReferenceTable();

  return BUSINESS_TYPES.flatMap((entry) =>
    stateTable.states.map((state) => ({
      type: entry.slug,
      state: slugify(state.state_name),
    })),
  );
}

export function getLicenseFinderData(): Record<string, LicenseFinderData> {
  const stateTable = getStateReferenceTable();
  const entries: Record<string, LicenseFinderData> = {};

  for (const business of BUSINESS_TYPES) {
    const layerA = readJsonFile<LayerAData>(business.jsonFilename);

    for (const state of stateTable.states) {
      const commonlyRequiredItems = layerA.typical_state_requirements
        .slice(0, 3)
        .map((item) => ({
          label: item.requirement_name,
          description: item.how_commonly_required,
        }));

      const stateVerifiedItems = [
        {
          label: `${state.state_name} business registration`,
          description: `Use the ${state.state_name} Secretary of State business portal for entity registration and filing steps.`,
        },
        {
          label: `${state.state_name} tax registration`,
          description: `Use the ${state.state_name} Department of Revenue portal for tax registration and permit questions.`,
        },
      ];

      entries[`${business.slug}::${state.state_name}`] = {
        commonlyRequiredItems,
        stateVerifiedItems,
      };
    }
  }

  return entries;
}
