import { listings } from "./demo-data";

export interface AuctionBundle {
  id: string;
  name: string;
  skus: string[];
  totalQuantity: number;
  totalRetailValue: number;
  recommendedStartBid: number;
  recommendedReserveBid: number;
  bidIncrement: number;
  showReserve: boolean;
  riskScore: "High" | "Medium" | "Low";
  reason: string;
}

export interface AuctionEvent {
  id: string;
  title: string;
  seller: string;
  sellerLogo: string;
  status: "Draft" | "Scheduled" | "Live" | "Ended" | "Cancelled";
  auctionType: "English" | "Dutch" | "Sealed Bid";
  buyerAccess: "Invite Only" | "Approved Marketplace" | "Private List";
  startTime: string;
  endTime: string;
  bundles: AuctionBundle[];
  invitedBuyers: string[];
  totalLots: number;
  totalUnits: number;
  totalStartValue: number;
  brandColor: string;
  brandName: string;
}

export interface AuctionBid {
  id: string;
  lotId: string;
  bundleName: string;
  buyer: string;
  buyerCompany: string;
  amount: number;
  timestamp: string;
  status: "Active" | "Outbid" | "Winning" | "Won" | "Lost";
}

export interface EligibleBuyer {
  id: string;
  name: string;
  company: string;
  region: string;
  matchScore: number;
  categoryInterest: string[];
  approvedMarkets: string[];
  pastAuctions: number;
  avgBidValue: number;
  selected: boolean;
}

export const auctionOpportunities = listings
  .filter((l) => l.condition === "Near Expiry" || l.condition === "Discontinued" || l.condition === "Overstock")
  .map((l) => ({
    ...l,
    auctionScore: l.condition === "Near Expiry" ? 94 : l.condition === "Discontinued" ? 87 : 72,
    reason:
      l.condition === "Near Expiry"
        ? `Expiry risk — ${l.expiryDate || "upcoming"}. Price gap vs. retail at ${(30 + Math.random() * 20).toFixed(0)}%. Auction recovery potential high.`
        : l.condition === "Discontinued"
        ? `Discontinued SKU with limited channel options. Auction competitive bidding likely to maximize recovery.`
        : `Overstock with slow sell-through variance. Auction bundling can accelerate clearance at better margins than markdown.`,
  }))
  .sort((a, b) => b.auctionScore - a.auctionScore);

export const suggestedBundles: AuctionBundle[] = [
  {
    id: "BDL-001",
    name: "Hair Care Essentials Bundle",
    skus: ["LOR-SHP-001", "LOR-CDN-005", "GAR-SHM-009"],
    totalQuantity: 8700,
    totalRetailValue: 26580,
    recommendedStartBid: 12900,
    recommendedReserveBid: 17200,
    bidIncrement: 250,
    showReserve: false,
    riskScore: "High",
    reason: "Near-expiry hair care SKUs. Bundled for fast clearance with competitive start bid at 49% of retail.",
  },
  {
    id: "BDL-002",
    name: "Premium Skin Care Bundle",
    skus: ["LOR-SER-002", "LOR-CRM-013", "GAR-CLN-006"],
    totalQuantity: 5900,
    totalRetailValue: 37240,
    recommendedStartBid: 20400,
    recommendedReserveBid: 27200,
    bidIncrement: 500,
    showReserve: false,
    riskScore: "Medium",
    reason: "High-value skin care with strong buyer demand. Reserve set at 73% retail to protect floor.",
  },
  {
    id: "BDL-003",
    name: "Makeup Clearance Bundle",
    skus: ["LOR-MSC-008", "MAY-PWD-010", "LOR-LIP-016"],
    totalQuantity: 2170,
    totalRetailValue: 15125,
    recommendedStartBid: 6800,
    recommendedReserveBid: 9800,
    bidIncrement: 200,
    showReserve: true,
    riskScore: "Medium",
    reason: "Mixed discontinued + overstock makeup. Visible reserve to anchor buyer expectations.",
  },
  {
    id: "BDL-004",
    name: "Sun & Body Care Bundle",
    skus: ["GAR-SUN-012", "GAR-LOT-015", "GAR-FCW-018"],
    totalQuantity: 8200,
    totalRetailValue: 31520,
    recommendedStartBid: 14200,
    recommendedReserveBid: 20400,
    bidIncrement: 300,
    showReserve: false,
    riskScore: "High",
    reason: "Near-expiry and packaging-change Garnier products. Strong regional demand in SEA markets.",
  },
  {
    id: "BDL-005",
    name: "Eye & Brow Specialist Bundle",
    skus: ["MAY-EYE-014", "NYX-BRW-017", "LOR-EYE-019"],
    totalQuantity: 6000,
    totalRetailValue: 22400,
    recommendedStartBid: 11200,
    recommendedReserveBid: 15600,
    bidIncrement: 250,
    showReserve: true,
    riskScore: "Low",
    reason: "Stable overstock with long shelf life. Good lot for competitive bidding from multiple buyer segments.",
  },
];

export const eligibleBuyers: EligibleBuyer[] = [
  {
    id: "EB-001",
    name: "Ahmad Rizal",
    company: "PT Mitra Kosmetik",
    region: "Indonesia",
    matchScore: 96,
    categoryInterest: ["Hair Care", "Skin Care"],
    approvedMarkets: ["Indonesia", "Malaysia"],
    pastAuctions: 8,
    avgBidValue: 12400,
    selected: true,
  },
  {
    id: "EB-002",
    name: "Siriporn Mee",
    company: "Watsons Thailand",
    region: "Thailand",
    matchScore: 93,
    categoryInterest: ["Skin Care", "Makeup", "Body Care"],
    approvedMarkets: ["Thailand", "Myanmar", "Cambodia"],
    pastAuctions: 14,
    avgBidValue: 18200,
    selected: true,
  },
  {
    id: "EB-003",
    name: "Tan Wei Lin",
    company: "Tok Kosmetik MY",
    region: "Malaysia",
    matchScore: 91,
    categoryInterest: ["Skin Care", "Sun Care"],
    approvedMarkets: ["Malaysia", "Singapore"],
    pastAuctions: 11,
    avgBidValue: 15600,
    selected: true,
  },
  {
    id: "EB-004",
    name: "Maria Santos",
    company: "BeautyHub Philippines",
    region: "Philippines",
    matchScore: 88,
    categoryInterest: ["Makeup", "Hair Care"],
    approvedMarkets: ["Philippines"],
    pastAuctions: 5,
    avgBidValue: 8900,
    selected: true,
  },
  {
    id: "EB-005",
    name: "Fahad Al-Rashid",
    company: "BinDawood Retail",
    region: "Saudi Arabia",
    matchScore: 82,
    categoryInterest: ["Skin Care", "Body Care"],
    approvedMarkets: ["Saudi Arabia", "UAE", "Bahrain"],
    pastAuctions: 2,
    avgBidValue: 22000,
    selected: false,
  },
  {
    id: "EB-006",
    name: "Lee Kai Wen",
    company: "SG Beauty Outlet",
    region: "Singapore",
    matchScore: 79,
    categoryInterest: ["Makeup"],
    approvedMarkets: ["Singapore"],
    pastAuctions: 3,
    avgBidValue: 6800,
    selected: false,
  },
  {
    id: "EB-007",
    name: "Juan Dela Cruz",
    company: "Metro Manila Cosmetics",
    region: "Philippines",
    matchScore: 75,
    categoryInterest: ["Makeup", "Skin Care"],
    approvedMarkets: ["Philippines"],
    pastAuctions: 1,
    avgBidValue: 4200,
    selected: false,
  },
];

export const sampleBids: AuctionBid[] = [
  { id: "BID-001", lotId: "BDL-001", bundleName: "Hair Care Essentials Bundle", buyer: "Ahmad Rizal", buyerCompany: "PT Mitra Kosmetik", amount: 15400, timestamp: "2026-04-29T10:05:00Z", status: "Active" },
  { id: "BID-002", lotId: "BDL-001", bundleName: "Hair Care Essentials Bundle", buyer: "Siriporn Mee", buyerCompany: "Watsons Thailand", amount: 15650, timestamp: "2026-04-29T10:12:00Z", status: "Winning" },
  { id: "BID-003", lotId: "BDL-002", bundleName: "Premium Skin Care Bundle", buyer: "Tan Wei Lin", buyerCompany: "Tok Kosmetik MY", amount: 23800, timestamp: "2026-04-29T10:08:00Z", status: "Active" },
  { id: "BID-004", lotId: "BDL-002", bundleName: "Premium Skin Care Bundle", buyer: "Siriporn Mee", buyerCompany: "Watsons Thailand", amount: 24300, timestamp: "2026-04-29T10:15:00Z", status: "Winning" },
  { id: "BID-005", lotId: "BDL-003", bundleName: "Makeup Clearance Bundle", buyer: "Maria Santos", buyerCompany: "BeautyHub Philippines", amount: 7800, timestamp: "2026-04-29T10:10:00Z", status: "Winning" },
  { id: "BID-006", lotId: "BDL-004", bundleName: "Sun & Body Care Bundle", buyer: "Fahad Al-Rashid", buyerCompany: "BinDawood Retail", amount: 17500, timestamp: "2026-04-29T10:18:00Z", status: "Winning" },
  { id: "BID-007", lotId: "BDL-004", bundleName: "Sun & Body Care Bundle", buyer: "Tan Wei Lin", buyerCompany: "Tok Kosmetik MY", amount: 16200, timestamp: "2026-04-29T10:06:00Z", status: "Outbid" },
  { id: "BID-008", lotId: "BDL-005", bundleName: "Eye & Brow Specialist Bundle", buyer: "Lee Kai Wen", buyerCompany: "SG Beauty Outlet", amount: 12800, timestamp: "2026-04-29T10:20:00Z", status: "Winning" },
  { id: "BID-009", lotId: "BDL-001", bundleName: "Hair Care Essentials Bundle", buyer: "Maria Santos", buyerCompany: "BeautyHub Philippines", amount: 14200, timestamp: "2026-04-29T10:02:00Z", status: "Outbid" },
  { id: "BID-010", lotId: "BDL-005", bundleName: "Eye & Brow Specialist Bundle", buyer: "Juan Dela Cruz", buyerCompany: "Metro Manila Cosmetics", amount: 11800, timestamp: "2026-04-29T10:14:00Z", status: "Outbid" },
];

export interface CompletedLotResult {
  lotId: string;
  bundleName: string;
  skuCount: number;
  totalUnits: number;
  retailValue: number;
  startBid: number;
  reserveBid: number;
  winningBid: number;
  winnerName: string;
  winnerCompany: string;
  totalBids: number;
  reserveMet: boolean;
  recoveryRate: number;
}

export interface CompletedAuction {
  id: string;
  title: string;
  seller: string;
  sellerLogo: string;
  auctionType: "English" | "Dutch" | "Sealed Bid";
  buyerAccess: "Invite Only" | "Approved Marketplace" | "Private List";
  startTime: string;
  endTime: string;
  brandColor: string;
  brandName: string;
  templateName: string;
  totalLots: number;
  totalUnits: number;
  totalRetailValue: number;
  totalStartValue: number;
  totalFinalValue: number;
  overallRecoveryRate: number;
  invitedBuyers: number;
  activeBidders: number;
  totalBidsPlaced: number;
  lotResults: CompletedLotResult[];
  auditTrail: { timestamp: string; action: string; detail: string }[];
}

export const completedAuctions: CompletedAuction[] = [
  {
    id: "CAUC-001",
    title: "L'Oréal Indonesia Q1 Clearance Auction",
    seller: "L'Oréal Indonesia",
    sellerLogo: "L",
    auctionType: "English",
    buyerAccess: "Approved Marketplace",
    startTime: "2026-04-10T08:00:00Z",
    endTime: "2026-04-11T18:00:00Z",
    brandColor: "#6B3FA0",
    brandName: "L'Oréal Indonesia",
    templateName: "SEA Flash Clearance",
    totalLots: 4,
    totalUnits: 12400,
    totalRetailValue: 89200,
    totalStartValue: 43600,
    totalFinalValue: 62840,
    overallRecoveryRate: 70.4,
    invitedBuyers: 6,
    activeBidders: 4,
    totalBidsPlaced: 28,
    lotResults: [
      {
        lotId: "CLOT-001",
        bundleName: "Hair Care Near-Expiry Bundle",
        skuCount: 3,
        totalUnits: 4200,
        retailValue: 28500,
        startBid: 13800,
        reserveBid: 18500,
        winningBid: 21200,
        winnerName: "Ahmad Rizal",
        winnerCompany: "PT Mitra Kosmetik",
        totalBids: 9,
        reserveMet: true,
        recoveryRate: 74.4,
      },
      {
        lotId: "CLOT-002",
        bundleName: "Premium Skin Care Collection",
        skuCount: 2,
        totalUnits: 2800,
        retailValue: 24600,
        startBid: 12000,
        reserveBid: 16000,
        winningBid: 18400,
        winnerName: "Siriporn Mee",
        winnerCompany: "Watsons Thailand",
        totalBids: 7,
        reserveMet: true,
        recoveryRate: 74.8,
      },
      {
        lotId: "CLOT-003",
        bundleName: "Makeup Discontinued Mix",
        skuCount: 4,
        totalUnits: 3100,
        retailValue: 21400,
        startBid: 10400,
        reserveBid: 13900,
        winningBid: 14240,
        winnerName: "Maria Santos",
        winnerCompany: "BeautyHub Philippines",
        totalBids: 5,
        reserveMet: true,
        recoveryRate: 66.5,
      },
      {
        lotId: "CLOT-004",
        bundleName: "Sun & Body Overstock Bundle",
        skuCount: 3,
        totalUnits: 2300,
        retailValue: 14700,
        startBid: 7400,
        reserveBid: 9600,
        winningBid: 9000,
        winnerName: "Tan Wei Lin",
        winnerCompany: "Tok Kosmetik MY",
        totalBids: 7,
        reserveMet: false,
        recoveryRate: 61.2,
      },
    ],
    auditTrail: [
      { timestamp: "2026-04-09T14:00:00Z", action: "Template Triggered", detail: "SEA Flash Clearance template detected 8 near-expiry SKUs meeting threshold" },
      { timestamp: "2026-04-09T14:02:00Z", action: "Products Bundled", detail: "8 SKUs auto-bundled into 4 lots by category (Hair Care, Skin Care, Makeup, Body)" },
      { timestamp: "2026-04-09T14:05:00Z", action: "Pricing Applied", detail: "Shelf-life decay pricing: start bids at 49–51% retail, reserves at 65–67% retail" },
      { timestamp: "2026-04-09T14:08:00Z", action: "Buyers Matched", detail: "6 buyers matched (region: SEA, past_auctions >= 3, match_score >= 80)" },
      { timestamp: "2026-04-09T14:10:00Z", action: "Event Auto-Published", detail: "Whitelabel room generated with L'Oréal Indonesia branding, buyer notifications sent" },
      { timestamp: "2026-04-10T08:00:00Z", action: "Auction Started", detail: "Bidding opened for 4 lots. 6 invited buyers, 4 joined within first hour" },
      { timestamp: "2026-04-10T08:12:00Z", action: "First Bid Received", detail: "PT Mitra Kosmetik placed opening bid of $13,800 on Hair Care lot" },
      { timestamp: "2026-04-10T14:30:00Z", action: "Reserve Met", detail: "3 of 4 lots reached reserve price. Lot 4 (Sun & Body) still below reserve" },
      { timestamp: "2026-04-11T16:45:00Z", action: "Final Bids", detail: "Last bid placed on Premium Skin Care lot by Watsons Thailand ($18,400)" },
      { timestamp: "2026-04-11T18:00:00Z", action: "Auction Ended", detail: "All 4 lots closed. 3/4 reserves met. Total final value: $62,840 (70.4% recovery)" },
      { timestamp: "2026-04-11T18:01:00Z", action: "Winners Notified", detail: "4 winning buyers notified via email + in-app. Payment terms: Net 30" },
      { timestamp: "2026-04-12T09:00:00Z", action: "Lily Analysis", detail: "Recovery rate 70.4% vs 62% avg for markdown. Net improvement: +$7,490 over alternative channels" },
    ],
  },
  {
    id: "CAUC-002",
    title: "Garnier Discontinued SKU Recovery — March",
    seller: "L'Oréal Indonesia",
    sellerLogo: "G",
    auctionType: "Sealed Bid",
    buyerAccess: "Invite Only",
    startTime: "2026-03-25T08:00:00Z",
    endTime: "2026-03-27T18:00:00Z",
    brandColor: "#10B981",
    brandName: "Garnier SEA",
    templateName: "Discontinued Bulk Recovery",
    totalLots: 2,
    totalUnits: 5600,
    totalRetailValue: 42800,
    totalStartValue: 21400,
    totalFinalValue: 28900,
    overallRecoveryRate: 67.5,
    invitedBuyers: 4,
    activeBidders: 3,
    totalBidsPlaced: 6,
    lotResults: [
      {
        lotId: "CLOT-005",
        bundleName: "Garnier Skin Care Discontinued",
        skuCount: 3,
        totalUnits: 3400,
        retailValue: 26800,
        startBid: 13400,
        reserveBid: 17400,
        winningBid: 19200,
        winnerName: "Tan Wei Lin",
        winnerCompany: "Tok Kosmetik MY",
        totalBids: 3,
        reserveMet: true,
        recoveryRate: 71.6,
      },
      {
        lotId: "CLOT-006",
        bundleName: "Garnier Hair Care End-of-Line",
        skuCount: 2,
        totalUnits: 2200,
        retailValue: 16000,
        startBid: 8000,
        reserveBid: 10400,
        winningBid: 9700,
        winnerName: "Ahmad Rizal",
        winnerCompany: "PT Mitra Kosmetik",
        totalBids: 3,
        reserveMet: false,
        recoveryRate: 60.6,
      },
    ],
    auditTrail: [
      { timestamp: "2026-03-24T10:00:00Z", action: "Template Triggered", detail: "Discontinued Bulk Recovery biweekly cadence — 5 discontinued SKUs in pool" },
      { timestamp: "2026-03-24T10:03:00Z", action: "Products Bundled", detail: "5 SKUs grouped into 2 lots by brand (Garnier Skin Care, Garnier Hair Care)" },
      { timestamp: "2026-03-24T10:06:00Z", action: "Pricing Applied", detail: "Floor-plus-margin pricing: reserve at 65% retail, start at 50% retail" },
      { timestamp: "2026-03-24T10:10:00Z", action: "Buyers Matched", detail: "4 buyers invited (category_interest: match, avg_bid >= 10000)" },
      { timestamp: "2026-03-24T10:12:00Z", action: "Manual Review Required", detail: "Template requires manual approval — event held for seller review" },
      { timestamp: "2026-03-24T14:30:00Z", action: "Seller Approved", detail: "Event approved by seller after lot review. Published to invited buyers" },
      { timestamp: "2026-03-25T08:00:00Z", action: "Sealed Bids Opened", detail: "Bidding window opened. 4 invited buyers, sealed bid format" },
      { timestamp: "2026-03-27T18:00:00Z", action: "Bids Revealed", detail: "6 sealed bids revealed across 2 lots. Highest bidders win" },
      { timestamp: "2026-03-27T18:01:00Z", action: "Auction Ended", detail: "2 lots closed. 1/2 reserves met. Total: $28,900 (67.5% recovery)" },
      { timestamp: "2026-03-28T09:00:00Z", action: "Lily Analysis", detail: "Sealed bid format achieved 67.5% vs 55% estimated markdown. Net gain: +$5,350" },
    ],
  },
];

export const existingAuctionEvents: AuctionEvent[] = [
  {
    id: "AUC-001",
    title: "L'Oréal Indonesia Q2 Clearance Auction",
    seller: "L'Oréal Indonesia",
    sellerLogo: "L",
    status: "Live",
    auctionType: "English",
    buyerAccess: "Approved Marketplace",
    startTime: "2026-04-29T08:00:00Z",
    endTime: "2026-04-30T18:00:00Z",
    bundles: suggestedBundles.slice(0, 3),
    invitedBuyers: ["PT Mitra Kosmetik", "Watsons Thailand", "Tok Kosmetik MY", "BeautyHub Philippines"],
    totalLots: 3,
    totalUnits: 16770,
    totalStartValue: 40100,
    brandColor: "#6B3FA0",
    brandName: "L'Oréal Indonesia",
  },
  {
    id: "AUC-002",
    title: "Garnier SEA Near-Expiry Flash Auction",
    seller: "L'Oréal Indonesia",
    sellerLogo: "G",
    status: "Scheduled",
    auctionType: "English",
    buyerAccess: "Invite Only",
    startTime: "2026-05-02T08:00:00Z",
    endTime: "2026-05-03T18:00:00Z",
    bundles: suggestedBundles.slice(3, 5),
    invitedBuyers: ["PT Mitra Kosmetik", "BinDawood Retail", "Tok Kosmetik MY"],
    totalLots: 2,
    totalUnits: 14200,
    totalStartValue: 25400,
    brandColor: "#10B981",
    brandName: "Garnier SEA",
  },
];

export const WORKFLOW_STEPS = [
  "Opportunity Detection",
  "Auction Parameters",
  "Bundle Selection",
  "Pricing & Lots",
  "Buyer Access",
  "Whitelabel Preview",
  "Publish & Monitor",
] as const;

export type WorkflowStep = (typeof WORKFLOW_STEPS)[number];

export const LILY_AUCTION_MESSAGES: Record<string, string> = {
  welcome:
    "I've detected **8 SKUs** across your inventory that are strong candidates for auction clearance.\n\nThese include **near-expiry hair care**, **discontinued makeup**, and **overstock skin care** items with high recovery potential through competitive bidding.\n\nShall I set up an auction event for you?",
  parameters:
    "Great! I've pre-filled the auction parameters based on your seller profile and inventory analysis:\n\n• **Auction Type**: English (ascending) — best for competitive clearance\n• **Buyer Access**: Approved Marketplace — widest qualified pool\n• **Duration**: 24 hours — optimal for SEA time zones\n• **Bid increment**: Varies by lot value\n\nYou can edit any of these before we proceed. Ready to select your product bundles?",
  bundles:
    "I've created **5 bundle lots** from your auction-eligible inventory, grouped by category and risk profile:\n\n• **Hair Care Essentials** — 3 SKUs, high urgency (near-expiry)\n• **Premium Skin Care** — 3 SKUs, high value\n• **Makeup Clearance** — 3 SKUs, discontinued items\n• **Sun & Body Care** — 3 SKUs, mixed near-expiry + packaging change\n• **Eye & Brow Specialist** — 3 SKUs, stable overstock\n\nPricing is at **bundle level**, not SKU level. Select the bundles you want to include.",
  pricing:
    "Here are my pricing recommendations for each lot:\n\n• Start bids range from **49% to 55%** of retail value\n• Reserve bids set at **65% to 73%** of retail value\n• Increments scaled to lot value ($200–$500)\n\nPricing factors: SKU mix, expiry risk, seller floor prices, recent market signals, and historical auction performance in SEA markets.\n\nAll values are **editable** — adjust any field before generating the final lots.",
  buyers:
    "I've matched **7 eligible buyers** for this auction based on:\n\n• Category interest alignment\n• Approved resale market verification\n• Past auction participation history\n• Geographic proximity to inventory location\n\nTop matches: **PT Mitra Kosmetik** (96%), **Watsons Thailand** (93%), **Tok Kosmetik MY** (91%).\n\nI've pre-selected the top 4. You can adjust the invite list before publishing.",
  preview:
    "Your whitelabel auction event is ready for preview!\n\nThe buyer-facing room will show your **L'Oréal Indonesia** branding, auction title, lot details, bidding rules, and countdown timer.\n\nReserve bids will be **hidden** for lots where you chose hidden reserve, showing only \"Reserve not met\" or \"Reserve met\" status to bidders.\n\nReview the preview and publish when ready.",
  published:
    "Auction event **published** successfully!\n\n✅ 4 invited buyers notified via email + in-app\n✅ Auction room live at branded URL\n✅ Bid monitoring active\n✅ Auto-counter rules enabled for sub-reserve bids\n\nI'll track all bids in real-time and alert you when lots approach or exceed reserve. You can monitor from this dashboard.",
};

// --- Automated Auction Pipeline Types & Data ---

export interface AllocationStrategy {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  bundlingRule: "by-category" | "by-brand" | "by-risk" | "by-expiry-window";
  pricingModel: "shelf-life-decay" | "demand-weighted" | "floor-plus-margin" | "market-rate";
  active: boolean;
}

export interface AssignmentTemplate {
  id: string;
  name: string;
  auctionType: "English" | "Dutch" | "Sealed Bid";
  buyerAccess: "Invite Only" | "Approved Marketplace" | "Private List";
  durationHours: number;
  brandColor: string;
  brandName: string;
  allocationStrategyId: string;
  buyerTierRules: string[];
  autoPublish: boolean;
  minLots: number;
  maxLots: number;
  reserveStrategy: "hidden" | "visible" | "adaptive";
  scheduleCadence: "on-trigger" | "weekly" | "biweekly" | "monthly";
  status: "active" | "paused" | "draft";
  createdAt: string;
  lastTriggered: string | null;
  totalEventsGenerated: number;
}

export type PipelineStage = "detected" | "allocated" | "bundled" | "priced" | "buyers-matched" | "scheduled" | "live";

export interface PipelineEvent {
  id: string;
  templateId: string;
  templateName: string;
  stage: PipelineStage;
  title: string;
  triggeredBy: string;
  triggeredAt: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  productsMatched: number;
  lotsFormed: number;
  buyersMatched: number;
  estimatedValue: number;
  autoActions: string[];
  requiresApproval: boolean;
}

export const allocationStrategies: AllocationStrategy[] = [
  {
    id: "AS-001",
    name: "Near-Expiry Urgent Clearance",
    description: "Auto-routes products within 120 days of expiry into flash auction bundles grouped by category",
    conditions: ["Near Expiry", "condition:expiry_days <= 120"],
    bundlingRule: "by-category",
    pricingModel: "shelf-life-decay",
    active: true,
  },
  {
    id: "AS-002",
    name: "Discontinued SKU Recovery",
    description: "Pools discontinued products by brand into sealed-bid lots for bulk recovery",
    conditions: ["Discontinued"],
    bundlingRule: "by-brand",
    pricingModel: "floor-plus-margin",
    active: true,
  },
  {
    id: "AS-003",
    name: "Overstock Competitive Bidding",
    description: "Groups overstock inventory by risk score into English auction lots to maximize competitive recovery",
    conditions: ["Overstock"],
    bundlingRule: "by-risk",
    pricingModel: "demand-weighted",
    active: true,
  },
  {
    id: "AS-004",
    name: "Packaging Change Rapid Sell-Through",
    description: "Bundles old-packaging items by expiry window for Dutch auction flash sales",
    conditions: ["Packaging Change"],
    bundlingRule: "by-expiry-window",
    pricingModel: "market-rate",
    active: false,
  },
];

export const assignmentTemplates: AssignmentTemplate[] = [
  {
    id: "TPL-001",
    name: "SEA Flash Clearance",
    auctionType: "English",
    buyerAccess: "Approved Marketplace",
    durationHours: 24,
    brandColor: "#6B3FA0",
    brandName: "L'Oréal Indonesia",
    allocationStrategyId: "AS-001",
    buyerTierRules: ["region:SEA", "past_auctions >= 3", "match_score >= 80"],
    autoPublish: true,
    minLots: 2,
    maxLots: 6,
    reserveStrategy: "hidden",
    scheduleCadence: "on-trigger",
    status: "active",
    createdAt: "2026-03-15T10:00:00Z",
    lastTriggered: "2026-04-29T06:00:00Z",
    totalEventsGenerated: 4,
  },
  {
    id: "TPL-002",
    name: "Discontinued Bulk Recovery",
    auctionType: "Sealed Bid",
    buyerAccess: "Invite Only",
    durationHours: 48,
    brandColor: "#10B981",
    brandName: "Garnier SEA",
    allocationStrategyId: "AS-002",
    buyerTierRules: ["category_interest:match", "avg_bid >= 10000"],
    autoPublish: false,
    minLots: 1,
    maxLots: 4,
    reserveStrategy: "visible",
    scheduleCadence: "biweekly",
    status: "active",
    createdAt: "2026-03-20T10:00:00Z",
    lastTriggered: "2026-04-15T08:00:00Z",
    totalEventsGenerated: 2,
  },
  {
    id: "TPL-003",
    name: "Overstock Competitive Event",
    auctionType: "English",
    buyerAccess: "Approved Marketplace",
    durationHours: 36,
    brandColor: "#F59E0B",
    brandName: "L'Oréal Group",
    allocationStrategyId: "AS-003",
    buyerTierRules: ["region:any", "past_auctions >= 1"],
    autoPublish: true,
    minLots: 3,
    maxLots: 8,
    reserveStrategy: "adaptive",
    scheduleCadence: "weekly",
    status: "active",
    createdAt: "2026-04-01T10:00:00Z",
    lastTriggered: "2026-04-28T08:00:00Z",
    totalEventsGenerated: 3,
  },
  {
    id: "TPL-004",
    name: "Packaging Change Flash Sale",
    auctionType: "Dutch",
    buyerAccess: "Approved Marketplace",
    durationHours: 12,
    brandColor: "#3B82F6",
    brandName: "Garnier Indonesia",
    allocationStrategyId: "AS-004",
    buyerTierRules: ["region:SEA"],
    autoPublish: false,
    minLots: 1,
    maxLots: 3,
    reserveStrategy: "hidden",
    scheduleCadence: "monthly",
    status: "paused",
    createdAt: "2026-04-10T10:00:00Z",
    lastTriggered: null,
    totalEventsGenerated: 0,
  },
  {
    id: "TPL-005",
    name: "Weekly Auction",
    auctionType: "English",
    buyerAccess: "Approved Marketplace",
    durationHours: 24,
    brandColor: "#6B3FA0",
    brandName: "L'Oréal Indonesia",
    allocationStrategyId: "AS-001",
    buyerTierRules: ["region:SEA", "past_auctions >= 1", "match_score >= 70"],
    autoPublish: true,
    minLots: 3,
    maxLots: 8,
    reserveStrategy: "hidden",
    scheduleCadence: "weekly",
    status: "active",
    createdAt: "2026-02-10T10:00:00Z",
    lastTriggered: "2026-04-28T08:00:00Z",
    totalEventsGenerated: 11,
  },
  {
    id: "TPL-006",
    name: "Bulk Lot Auction",
    auctionType: "Sealed Bid",
    buyerAccess: "Invite Only",
    durationHours: 48,
    brandColor: "#F59E0B",
    brandName: "L'Oréal Group",
    allocationStrategyId: "AS-003",
    buyerTierRules: ["avg_bid >= 15000", "category_interest:match"],
    autoPublish: false,
    minLots: 1,
    maxLots: 4,
    reserveStrategy: "visible",
    scheduleCadence: "biweekly",
    status: "active",
    createdAt: "2026-03-01T10:00:00Z",
    lastTriggered: "2026-04-22T08:00:00Z",
    totalEventsGenerated: 5,
  },
];

export const pipelineEvents: PipelineEvent[] = [
  {
    id: "PE-001",
    templateId: "TPL-001",
    templateName: "SEA Flash Clearance",
    stage: "live",
    title: "L'Oréal Indonesia Q2 Clearance Auction",
    triggeredBy: "Near-expiry threshold (6 SKUs matched AS-001)",
    triggeredAt: "2026-04-29T06:00:00Z",
    scheduledStart: "2026-04-29T08:00:00Z",
    scheduledEnd: "2026-04-30T08:00:00Z",
    productsMatched: 6,
    lotsFormed: 3,
    buyersMatched: 4,
    estimatedValue: 40100,
    autoActions: [
      "Products auto-bundled by category (Hair Care, Skin Care, Makeup)",
      "Shelf-life decay pricing applied — start bids at 49–55% retail",
      "4 buyers auto-matched (score ≥ 80, region: SEA, auctions ≥ 3)",
      "Whitelabel room auto-generated with L'Oréal branding",
      "Event auto-published — buyer notifications sent",
    ],
    requiresApproval: false,
  },
  {
    id: "PE-002",
    templateId: "TPL-001",
    templateName: "SEA Flash Clearance",
    stage: "scheduled",
    title: "Garnier SEA Near-Expiry Flash Auction",
    triggeredBy: "Near-expiry threshold (2 SKUs matched AS-001)",
    triggeredAt: "2026-04-29T14:00:00Z",
    scheduledStart: "2026-05-02T08:00:00Z",
    scheduledEnd: "2026-05-03T08:00:00Z",
    productsMatched: 2,
    lotsFormed: 2,
    buyersMatched: 3,
    estimatedValue: 25400,
    autoActions: [
      "Products auto-bundled by category (Sun & Body Care, Eye & Brow)",
      "Shelf-life decay pricing applied — start bids at 45–50% retail",
      "3 buyers auto-matched via template rules",
      "Whitelabel room staged — pending schedule window",
    ],
    requiresApproval: false,
  },
  {
    id: "PE-003",
    templateId: "TPL-003",
    templateName: "Overstock Competitive Event",
    stage: "buyers-matched",
    title: "L'Oréal Overstock Competitive Auction — May Week 1",
    triggeredBy: "Weekly cadence trigger + 5 overstock SKUs in pool",
    triggeredAt: "2026-04-29T08:00:00Z",
    scheduledStart: null,
    scheduledEnd: null,
    productsMatched: 5,
    lotsFormed: 3,
    buyersMatched: 5,
    estimatedValue: 34800,
    autoActions: [
      "5 overstock SKUs detected and pooled from inventory scan",
      "Auto-bundled into 3 lots by risk score",
      "Demand-weighted pricing calculated",
      "5 buyers matched — awaiting schedule window assignment",
    ],
    requiresApproval: false,
  },
  {
    id: "PE-004",
    templateId: "TPL-002",
    templateName: "Discontinued Bulk Recovery",
    stage: "priced",
    title: "Discontinued SKU Sealed Bid — May Cycle",
    triggeredBy: "Biweekly cadence + 3 discontinued SKUs flagged",
    triggeredAt: "2026-04-29T10:00:00Z",
    scheduledStart: null,
    scheduledEnd: null,
    productsMatched: 3,
    lotsFormed: 2,
    buyersMatched: 0,
    estimatedValue: 14344,
    autoActions: [
      "3 discontinued SKUs pooled by brand (L'Oréal Paris, Maybelline)",
      "Floor-plus-margin pricing applied — reserve at 60% retail",
      "Pending: buyer matching (template requires manual review)",
    ],
    requiresApproval: true,
  },
  {
    id: "PE-005",
    templateId: "TPL-003",
    templateName: "Overstock Competitive Event",
    stage: "detected",
    title: "Overstock Pool — Incoming SKUs",
    triggeredBy: "New overstock SKU flagged (LOR-SER-002)",
    triggeredAt: "2026-04-29T15:30:00Z",
    scheduledStart: null,
    scheduledEnd: null,
    productsMatched: 1,
    lotsFormed: 0,
    buyersMatched: 0,
    estimatedValue: 15300,
    autoActions: [
      "1 new overstock SKU detected — added to TPL-003 intake pool",
      "Awaiting minimum lot threshold (need 2 more SKUs for bundling)",
    ],
    requiresApproval: false,
  },
];

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "detected", label: "Detected", color: "bg-gray-400" },
  { key: "allocated", label: "Allocated", color: "bg-blue-400" },
  { key: "bundled", label: "Bundled", color: "bg-indigo-400" },
  { key: "priced", label: "Priced", color: "bg-purple-400" },
  { key: "buyers-matched", label: "Buyers Matched", color: "bg-orange-400" },
  { key: "scheduled", label: "Scheduled", color: "bg-cyan-500" },
  { key: "live", label: "Live", color: "bg-green-500" },
];
