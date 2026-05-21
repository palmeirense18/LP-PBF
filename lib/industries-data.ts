export type IndustryIconKey =
  | "aerospace"
  | "defense"
  | "automotive"
  | "medical"
  | "industrial"
  | "energy";

export interface Industry {
  id: string;
  icon: IndustryIconKey;
  name: string;
  body: string;
  sectorCode: string;
}

export const INDUSTRIES: readonly Industry[] = [
  {
    id: "aerospace",
    icon: "aerospace",
    name: "AEROSPACE",
    sectorCode: "AERO · 01",
    body:
      "Structural brackets, fasteners, and turbine components produced with full material traceability and rigorous in-process inspection.",
  },
  {
    id: "defense",
    icon: "defense",
    name: "DEFENSE",
    sectorCode: "DEF · 02",
    body:
      "Weapon system housings, optical mounts, and export-controlled assemblies for prime contractors.",
  },
  {
    id: "automotive",
    icon: "automotive",
    name: "AUTOMOTIVE",
    sectorCode: "AUTO · 03",
    body:
      "Prototype and short-run production parts for motorsport and OEM development programs.",
  },
  {
    id: "medical",
    icon: "medical",
    name: "MEDICAL",
    sectorCode: "MED · 04",
    body:
      "Surgical instrument components and implant-grade machining in stainless and titanium.",
  },
  {
    id: "industrial",
    icon: "industrial",
    name: "INDUSTRIAL",
    sectorCode: "IND · 05",
    body:
      "Custom shafts, manifolds, and wear components for hydraulic and pneumatic systems.",
  },
  {
    id: "energy",
    icon: "energy",
    name: "ENERGY",
    sectorCode: "ENERGY · 06",
    body:
      "Downhole tools, valve internals, and high-pressure fittings rated for oilfield service.",
  },
] as const;
