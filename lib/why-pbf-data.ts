export type WhyPbfIconKey =
  | "leadtime"
  | "precision"
  | "multiaxis"
  | "tolerance"
  | "communication"
  | "location";

export interface WhyPbfItem {
  title: string;
  body: string;
  iconKey: WhyPbfIconKey;
}

export const WHY_PBF: readonly WhyPbfItem[] = [
  {
    title: "Fast Lead Times",
    body: "Quotes inside one business day. Production scheduled to your deadline, not ours.",
    iconKey: "leadtime",
  },
  {
    title: "Precision Machining",
    body: "Multi-axis platforms running calibrated tooling and inspected workholding on every setup.",
    iconKey: "precision",
  },
  {
    title: "Multi-Axis Capability",
    body: "4-axis milling and live-tool turning consolidate operations into fewer setups and tighter parts.",
    iconKey: "multiaxis",
  },
  {
    title: "Tight Tolerances",
    body: "Sub-thousandth tolerances held repeatably. CMM-verified before any part leaves the floor.",
    iconKey: "tolerance",
  },
  {
    title: "Responsive Communication",
    body: "Direct line to engineering. No call trees, no portals, no waiting on a sales rep.",
    iconKey: "communication",
  },
  {
    title: "New Jersey Based",
    body: "Domestic shop, domestic material, full traceability. Built in Elizabeth, NJ.",
    iconKey: "location",
  },
] as const;
