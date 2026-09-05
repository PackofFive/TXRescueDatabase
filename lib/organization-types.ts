export const ORGANIZATION_TYPES = [
  {
    value: "Animal Rescue",
    label: "Animal Rescue",
    description: "A rescue organization that accepts, fosters, and places animals.",
    portal: "Rescue Manager",
  },
  {
    value: "Municipal Shelter",
    label: "Municipal or Government Shelter",
    description: "A city, county, or other government-operated animal shelter or animal-services department.",
    portal: "Shelter Express",
  },
  {
    value: "Private Shelter",
    label: "Private or Nonprofit Shelter",
    description: "A privately operated shelter with a physical facility and shelter-based animal care.",
    portal: "Shelter Express",
  },
  {
    value: "Animal Control",
    label: "Animal Control or Field Services",
    description: "A public agency responsible for animal control, field services, or municipal intake.",
    portal: "Shelter Express",
  },
  {
    value: "Wildlife Rescue",
    label: "Wildlife Rescue or Rehabilitation",
    description: "An organization that rescues or rehabilitates wildlife.",
    portal: "Rescue Manager",
  },
  {
    value: "Sanctuary",
    label: "Animal Sanctuary",
    description: "An organization providing long-term or lifetime care rather than traditional adoption placement.",
    portal: "Rescue Manager",
  },
  {
    value: "Farm / Equine",
    label: "Farm or Equine Rescue",
    description: "A rescue or sanctuary focused on horses, livestock, or farm animals.",
    portal: "Rescue Manager",
  },
  {
    value: "Veterinary / Care Partner",
    label: "Veterinary or Professional Care Partner",
    description: "A veterinary clinic or professional service provider supporting animals and organizations.",
    portal: "Care Partner Portal (coming soon)",
  },
  {
    value: "Resource Organization",
    label: "Animal-Welfare Resource Organization",
    description: "A food bank, transport group, assistance program, or other organization providing resources.",
    portal: "Directory listing; portal access is reviewed individually",
  },
  {
    value: "Other",
    label: "Other Animal-Welfare Organization",
    description: "An animal-welfare organization that does not fit one of the choices above.",
    portal: "Portal access is reviewed individually",
  },
] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number]["value"];

export function isOrganizationType(value: unknown): value is OrganizationType {
  return typeof value === "string" && ORGANIZATION_TYPES.some((type) => type.value === value);
}

export function organizationTypeDetails(value: string) {
  return ORGANIZATION_TYPES.find((type) => type.value === value) ?? null;
}

export function isShelterExpressOrganization(value: unknown) {
  return value === "Municipal Shelter" || value === "Private Shelter" || value === "Animal Control";
}
