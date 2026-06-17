export type EquipmentSpec = { label: string; value: string };
export type Equipment = {
  id: string;
  designation: string;
  name: string;
  category: "Milling" | "Turning" | "Workholding";
  image: string;
  alt: string;
  specs: EquipmentSpec[];
};

export const EQUIPMENT: readonly Equipment[] = [
  {
    id: "vm04",
    designation: "PBF-VM-04",
    name: "4-Axis Vertical Machining Center",
    category: "Milling",
    image: "/machines/01-vm04-vertical-machining-center.jpg",
    alt: "Four-axis vertical machining center on the production floor.",
    specs: [
      { label: "Work Envelope", value: '40" × 22" × 22"' },
      { label: "Spindle", value: "12,000 RPM · BT40" },
      { label: "Positioning", value: '±0.0002"' },
      { label: "Table Load", value: "4,400 lb" },
      { label: "Tool Carousel", value: "30-station ATC" },
    ],
  },
  {
    id: "vm02",
    designation: "PBF-VM-02",
    name: "Heavy Vertical Mill",
    category: "Milling",
    image: "/machines/02-vm02-heavy-vertical-mill.jpg",
    alt: "Large enclosed vertical mill paired with an LNS automation cabinet.",
    specs: [
      { label: "Travel", value: '50" × 26" × 25"' },
      { label: "Spindle", value: "120,000 RPM" },
      { label: "Repeatability", value: '±0.0001"' },
      { label: "Automation", value: "LNS Quickload bar feed" },
      { label: "Coolant", value: "1,000 psi through-spindle" },
    ],
  },
  {
    id: "tc01",
    designation: "PBF-TC-01",
    name: "Multi-Axis Turning Cell — Live Tooling",
    category: "Turning",
    image: "/machines/03-tc01-multi-axis-turning-cell.jpg",
    alt: "Multi-axis CNC turning center with live tooling and an attached LNS bar feeder.",
    specs: [
      { label: "Bar Capacity", value: 'Ø2.5" through spindle' },
      { label: "Spindle", value: "5,000 RPM · 30 HP" },
      { label: "Tolerance", value: '±0.0002"' },
      { label: "Live Tools", value: "Axial + radial milling" },
      { label: "Bar Magazine", value: "LNS 12-foot" },
    ],
  },
  {
    id: "tt03",
    designation: "PBF-TT-03",
    name: "Tool Turret System",
    category: "Turning",
    image: "/machines/04-tt03-live-tool-turret.jpg",
    alt: "Close-up of a multi-station tool turret loaded with cutting tools.",
    specs: [
      { label: "Stations", value: "12 driven positions" },
      { label: "Index Time", value: "0.2 s station-to-station" },
      { label: "Repeatability", value: '±0.00005"' },
      { label: "Coolant", value: "Through-tool, all stations" },
      { label: "Tool Holders", value: "VDI 40 / BMT 65 compatible" },
    ],
  },
  {
    id: "tc02",
    designation: "PBF-TC-02",
    name: "Compact Turning Center",
    category: "Turning",
    image: "/machines/05-tc02-compact-turning-center.jpg",
    alt: "Compact CNC turning center with auxiliary parts catcher.",
    specs: [
      { label: "Chuck", value: '6" hydraulic three-jaw' },
      { label: "Spindle", value: "6,000 RPM · 22 HP" },
      { label: "Tolerance", value: '±0.0001"' },
      { label: "X/Z Travel", value: '8.7" / 18.5"' },
      { label: "Auxiliary", value: "Tailstock + parts catcher" },
    ],
  },
  {
    id: "wh04",
    designation: "PBF-WH-04",
    name: "Precision Workholding Assembly",
    category: "Workholding",
    image: "/machines/06-wh04-precision-workholding.jpg",
    alt: "Precision spindle face with a blue collet workholding system installed.",
    specs: [
      { label: "Collet System", value: "Hardinge 5C compatible and 8-inch chuck" },
      { label: "Concentricity", value: '±0.00015"' },
      { label: "Grip Force", value: "6,500 lbf" },
      { label: "Max RPM", value: "8,000" },
      { label: "Application", value: "Bar work + second-op fixtures" },
    ],
  },
] as const;
