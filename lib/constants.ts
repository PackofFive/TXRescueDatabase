// Single source of truth for field lists and review rules.
// Both the API routes and the frontend forms import from here,
// so the "what needs review" decision can never drift out of sync.

export const CAPABILITY_STATUSES = ["Yes", "No", "Limited", "Case-by-case", "Unknown"] as const;
export type CapabilityStatus = (typeof CAPABILITY_STATUSES)[number];

// column name in `capabilities` table -> display label
export const CAPABILITY_FIELDS = [
  { key: "owner_surrender", label: "Owner Surrender" },
  { key: "shelter_pull", label: "Shelter Pull" },
  { key: "stray_found", label: "Stray/Found Animal" },
  { key: "emergency_medical", label: "Emergency Medical" },
  { key: "cruelty_neglect", label: "Cruelty/Neglect" },
  { key: "behavioral", label: "Behavioral" },
  { key: "senior", label: "Senior" },
  { key: "special_needs", label: "Special Needs" },
  { key: "neonatal", label: "Neonatal" },
  { key: "pregnant_nursing", label: "Pregnant/Nursing" },
  { key: "breed_specific", label: "Breed Specific" },
  { key: "wildlife", label: "Wildlife" },
  { key: "farm_equine", label: "Farm/Equine" },
  { key: "transport", label: "Transport" },
  { key: "temporary_foster", label: "Temporary Foster" },
  { key: "pet_retention", label: "Pet-Retention Assistance" },
] as const;

// organizations columns that publish immediately when an org edits them —
// low risk, easy to correct, don't affect where an animal gets routed.
export const AUTO_PUBLISH_FIELDS = ["website", "social_media", "public_email", "public_phone", "service_area"];

// organizations columns that always route to admin review —
// these affect where someone sends an animal, or are legal/verification claims.
export const REVIEW_REQUIRED_FIELDS = [
  "intake_status",
  "intake_restrictions",
  "intake_form_url",
  "resource_status",
  "c3_status",
];

// Every capabilities.* column is review-required, no exceptions —
// see CAPABILITY_FIELDS above for the full list.

export const RESOURCE_STATUS_OPTIONS = [
  "Verified",
  "Verified – Restricted Intake",
  "Verification Needed",
  "Temporarily Closed",
  "Inactive / Closed",
];
