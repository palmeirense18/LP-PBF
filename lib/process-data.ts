export type ProcessStep = {
  id: string;
  index: string;
  phase: string;
  title: string;
  body: string;
};

export const PROCESS: readonly ProcessStep[] = [
  {
    id: "review",
    index: "01",
    phase: "DESIGN",
    title: "Engineering Review",
    body: "Every print is reviewed by our engineering team before quoting.",
  },
  {
    id: "material",
    index: "02",
    phase: "SOURCING",
    title: "Material Procurement",
    body: "Domestic and certified material sourcing for full traceability.",
  },
  {
    id: "machining",
    index: "03",
    phase: "PRODUCTION",
    title: "Precision Machining",
    body: "CNC programming, setup, and machining on calibrated equipment.",
  },
  {
    id: "inspection",
    index: "04",
    phase: "VERIFICATION",
    title: "Inspection & QC",
    body: "First-article inspection, CMM verification, full documentation.",
  },
  {
    id: "delivery",
    index: "05",
    phase: "FULFILLMENT",
    title: "Delivery",
    body: "Packaged and shipped to your specifications, with lead times agreed at quote.",
  },
] as const;
