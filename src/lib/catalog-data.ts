import { listings } from "./demo-data";

export interface CatalogTemplate {
  id: string;
  name: string;
  pricingModel: "fixed-markup" | "tiered-volume" | "negotiable" | "market-rate";
  accessLevel: "Open Marketplace" | "Approved Buyers" | "Invite Only";
  countryRestrictions: string[];
  buyerTypeRestrictions: string[];
  productOrganization: "by-category" | "by-brand" | "by-condition" | "curated";
  validityDays: number;
  refreshCadence: "daily" | "weekly" | "biweekly" | "on-change";
  autoPublish: boolean;
  brandColor: string;
  brandName: string;
  status: "active" | "paused" | "draft";
  createdAt: string;
  lastPublished: string | null;
  totalCatalogsGenerated: number;
  productsListed: number;
  activeViewers: number;
}

export interface CatalogEvent {
  id: string;
  templateId: string;
  templateName: string;
  title: string;
  stage: CatalogPipelineStage;
  triggeredBy: string;
  triggeredAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
  productsIncluded: number;
  categoriesCovered: number;
  buyersNotified: number;
  estimatedValue: number;
  autoActions: string[];
  requiresApproval: boolean;
}

export type CatalogPipelineStage =
  | "detected"
  | "organized"
  | "priced"
  | "access-configured"
  | "staged"
  | "published";

export const CATALOG_PIPELINE_STAGES: {
  key: CatalogPipelineStage;
  label: string;
  color: string;
}[] = [
  { key: "detected", label: "Detected", color: "bg-gray-400" },
  { key: "organized", label: "Organized", color: "bg-blue-400" },
  { key: "priced", label: "Priced", color: "bg-indigo-400" },
  { key: "access-configured", label: "Access Set", color: "bg-purple-400" },
  { key: "staged", label: "Staged", color: "bg-orange-400" },
  { key: "published", label: "Published", color: "bg-green-500" },
];

export const catalogTemplates: CatalogTemplate[] = [
  {
    id: "CTPL-001",
    name: "SEA Wholesale Catalog",
    pricingModel: "tiered-volume",
    accessLevel: "Approved Buyers",
    countryRestrictions: ["Indonesia", "Malaysia", "Thailand", "Philippines"],
    buyerTypeRestrictions: ["Wholesale", "Distributor"],
    productOrganization: "by-category",
    validityDays: 30,
    refreshCadence: "weekly",
    autoPublish: true,
    brandColor: "#6B3FA0",
    brandName: "L'Oréal Indonesia",
    status: "active",
    createdAt: "2026-03-01T10:00:00Z",
    lastPublished: "2026-04-28T06:00:00Z",
    totalCatalogsGenerated: 8,
    productsListed: 14,
    activeViewers: 12,
  },
  {
    id: "CTPL-002",
    name: "Garnier Overstock Clearance",
    pricingModel: "fixed-markup",
    accessLevel: "Open Marketplace",
    countryRestrictions: [],
    buyerTypeRestrictions: [],
    productOrganization: "by-brand",
    validityDays: 14,
    refreshCadence: "on-change",
    autoPublish: true,
    brandColor: "#10B981",
    brandName: "Garnier SEA",
    status: "active",
    createdAt: "2026-03-15T10:00:00Z",
    lastPublished: "2026-04-27T10:00:00Z",
    totalCatalogsGenerated: 6,
    productsListed: 8,
    activeViewers: 23,
  },
  {
    id: "CTPL-003",
    name: "Premium Skin Care Lookbook",
    pricingModel: "negotiable",
    accessLevel: "Invite Only",
    countryRestrictions: ["Singapore", "Malaysia"],
    buyerTypeRestrictions: ["Premium Retail"],
    productOrganization: "curated",
    validityDays: 60,
    refreshCadence: "biweekly",
    autoPublish: false,
    brandColor: "#F59E0B",
    brandName: "L'Oréal Luxe",
    status: "active",
    createdAt: "2026-04-05T10:00:00Z",
    lastPublished: "2026-04-20T14:00:00Z",
    totalCatalogsGenerated: 2,
    productsListed: 5,
    activeViewers: 4,
  },
  {
    id: "CTPL-004",
    name: "Discontinued SKU Outlet",
    pricingModel: "market-rate",
    accessLevel: "Open Marketplace",
    countryRestrictions: [],
    buyerTypeRestrictions: ["Outlet", "Off-price"],
    productOrganization: "by-condition",
    validityDays: 7,
    refreshCadence: "daily",
    autoPublish: true,
    brandColor: "#3B82F6",
    brandName: "L'Oréal Group",
    status: "paused",
    createdAt: "2026-04-10T10:00:00Z",
    lastPublished: null,
    totalCatalogsGenerated: 0,
    productsListed: 0,
    activeViewers: 0,
  },
];

export const catalogEvents: CatalogEvent[] = [
  {
    id: "CE-001",
    templateId: "CTPL-001",
    templateName: "SEA Wholesale Catalog",
    title: "L'Oréal Indonesia — SEA Wholesale Week 18",
    stage: "published",
    triggeredBy: "Weekly cadence + 14 products in allocation pool",
    triggeredAt: "2026-04-28T06:00:00Z",
    publishedAt: "2026-04-28T08:00:00Z",
    expiresAt: "2026-05-28T08:00:00Z",
    productsIncluded: 14,
    categoriesCovered: 5,
    buyersNotified: 12,
    estimatedValue: 86420,
    autoActions: [
      "14 products organized by category (Hair Care, Skin Care, Makeup, Sun Care, Body Care)",
      "Tiered volume pricing applied — 5%, 10%, 15% discounts at qty thresholds",
      "Access restricted to approved wholesale + distributor buyers in SEA",
      "Branded catalog page generated with L'Oréal Indonesia branding",
      "12 approved buyers notified — catalog link distributed",
    ],
    requiresApproval: false,
  },
  {
    id: "CE-002",
    templateId: "CTPL-002",
    templateName: "Garnier Overstock Clearance",
    title: "Garnier Overstock — May Refresh",
    stage: "staged",
    triggeredBy: "Inventory change detected (3 new overstock SKUs)",
    triggeredAt: "2026-04-29T10:00:00Z",
    publishedAt: null,
    expiresAt: null,
    productsIncluded: 8,
    categoriesCovered: 3,
    buyersNotified: 0,
    estimatedValue: 42300,
    autoActions: [
      "8 Garnier overstock products grouped by brand sub-line",
      "Fixed markup pricing applied — 35% below retail",
      "Open marketplace access — no restrictions",
      "Pending: final staging review before auto-publish",
    ],
    requiresApproval: false,
  },
  {
    id: "CE-003",
    templateId: "CTPL-003",
    templateName: "Premium Skin Care Lookbook",
    title: "L'Oréal Luxe — Premium Skin Care Q2 Lookbook",
    stage: "priced",
    triggeredBy: "Biweekly cadence + 5 premium SKUs flagged",
    triggeredAt: "2026-04-29T14:00:00Z",
    publishedAt: null,
    expiresAt: null,
    productsIncluded: 5,
    categoriesCovered: 2,
    buyersNotified: 0,
    estimatedValue: 38600,
    autoActions: [
      "5 premium skin care SKUs curated from allocation pool",
      "Negotiable pricing set — floor at 70% retail, suggested at 82%",
      "Pending: invite list curation (template requires manual approval)",
    ],
    requiresApproval: true,
  },
  {
    id: "CE-004",
    templateId: "CTPL-001",
    templateName: "SEA Wholesale Catalog",
    title: "Incoming Products — SEA Wholesale Pool",
    stage: "detected",
    triggeredBy: "New allocation batch (2 SKUs routed to Catalogs)",
    triggeredAt: "2026-04-29T16:00:00Z",
    publishedAt: null,
    expiresAt: null,
    productsIncluded: 2,
    categoriesCovered: 1,
    buyersNotified: 0,
    estimatedValue: 12800,
    autoActions: [
      "2 new catalog-eligible SKUs detected from dynamic allocation",
      "Awaiting weekly refresh window to include in next catalog edition",
    ],
    requiresApproval: false,
  },
];

export const catalogEligibleProducts = listings
  .filter(
    (l) =>
      l.channel === "Catalogs" ||
      (l.channel === "Marketplace" &&
        (l.condition === "Overstock" || l.condition === "Packaging Change"))
  )
  .map((l) => ({
    ...l,
    catalogScore:
      l.condition === "Overstock"
        ? 88
        : l.condition === "Packaging Change"
        ? 82
        : l.condition === "Discontinued"
        ? 76
        : 70,
    reason:
      l.condition === "Overstock"
        ? `High-volume overstock with strong sell-through potential in wholesale catalogs. Volume pricing can move ${l.quantity.toLocaleString()} units within 30 days.`
        : l.condition === "Packaging Change"
        ? `Packaging change SKU — existing packaging still market-ready. Catalog listing accelerates clearance before new packaging rollout.`
        : l.condition === "Discontinued"
        ? `Discontinued SKU with limited retail placement. Catalog channel reaches bulk buyers seeking clearance inventory.`
        : `Standard inventory suitable for catalog distribution across approved buyer network.`,
  }))
  .sort((a, b) => b.catalogScore - a.catalogScore);
