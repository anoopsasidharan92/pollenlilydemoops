export interface Listing {
  id: string;
  sku: string;
  product: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  status: "Active" | "Draft" | "Expired";
  channel: string;
  image?: string;
  condition: string;
  expiryDate?: string;
}

export interface Channel {
  name: string;
  icon: string;
  count: number;
  status: "active" | "upgrade";
}

export interface Transaction {
  id: string;
  buyer: string;
  product: string;
  quantity: number;
  offerPrice: number;
  psiPrice: number;
  status: "Pending" | "Counter Sent" | "Approved" | "Order Created" | "In Transit" | "Delivered" | "Rejected";
  channel: string;
  date: string;
  approvals?: { team: string; approved: boolean }[];
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  region: string;
  totalOrders: number;
  totalSpend: number;
  lastOrder: string;
  status: "Active" | "Inactive";
  approvedMarkets: string[];
}

export const channels: Channel[] = [
  { name: "All Channels", icon: "grid", count: 19, status: "active" },
  { name: "Marketplace", icon: "store", count: 11, status: "active" },
  { name: "Catalogs", icon: "book", count: 3, status: "active" },
  { name: "Auctions", icon: "gavel", count: 2, status: "active" },
  { name: "Employee F&F", icon: "users", count: 3, status: "active" },
  { name: "Consumer Store", icon: "shopping-bag", count: 0, status: "upgrade" },
];

export const listings: Listing[] = [
  { id: "LST-001", sku: "LOR-SHP-001", product: "L'Oréal Paris Elvive Total Repair 5 Shampoo 680ml", brand: "L'Oréal Paris", category: "Hair Care", quantity: 2400, unitPrice: 3.20, totalValue: 7680, status: "Active", channel: "Marketplace", condition: "Near Expiry", expiryDate: "2026-08-15" },
  { id: "LST-002", sku: "LOR-SER-002", product: "L'Oréal Paris Revitalift Hyaluronic Acid Serum 30ml", brand: "L'Oréal Paris", category: "Skin Care", quantity: 1800, unitPrice: 8.50, totalValue: 15300, status: "Active", channel: "Marketplace", condition: "Overstock", expiryDate: "2027-03-20" },
  { id: "LST-003", sku: "GAR-MSK-003", product: "Garnier Bright Complete Vitamin C Serum Mask", brand: "Garnier", category: "Skin Care", quantity: 5000, unitPrice: 1.80, totalValue: 9000, status: "Active", channel: "Marketplace", condition: "Packaging Change", expiryDate: "2027-06-10" },
  { id: "LST-004", sku: "MAY-FND-004", product: "Maybelline Fit Me Matte Foundation 30ml", brand: "Maybelline", category: "Makeup", quantity: 960, unitPrice: 5.40, totalValue: 5184, status: "Active", channel: "Catalogs", condition: "Discontinued", expiryDate: "2028-01-01" },
  { id: "LST-005", sku: "LOR-CDN-005", product: "L'Oréal Paris Elvive Total Repair 5 Conditioner 680ml", brand: "L'Oréal Paris", category: "Hair Care", quantity: 2100, unitPrice: 3.20, totalValue: 6720, status: "Active", channel: "Marketplace", condition: "Near Expiry", expiryDate: "2026-08-15" },
  { id: "LST-006", sku: "GAR-CLN-006", product: "Garnier Micellar Cleansing Water Pink 400ml", brand: "Garnier", category: "Skin Care", quantity: 3200, unitPrice: 4.10, totalValue: 13120, status: "Active", channel: "Marketplace", condition: "Overstock" },
  { id: "LST-007", sku: "NYX-LIP-007", product: "NYX Professional Makeup Soft Matte Lip Cream", brand: "NYX", category: "Makeup", quantity: 1500, unitPrice: 4.80, totalValue: 7200, status: "Active", channel: "Employee F&F", condition: "Overstock" },
  { id: "LST-008", sku: "LOR-MSC-008", product: "L'Oréal Paris Voluminous Lash Paradise Mascara", brand: "L'Oréal Paris", category: "Makeup", quantity: 800, unitPrice: 7.20, totalValue: 5760, status: "Active", channel: "Auctions", condition: "Discontinued" },
  { id: "LST-009", sku: "GAR-SHM-009", product: "Garnier Fructis Hair Food Banana Shampoo 350ml", brand: "Garnier", category: "Hair Care", quantity: 4200, unitPrice: 2.90, totalValue: 12180, status: "Active", channel: "Marketplace", condition: "Near Expiry", expiryDate: "2026-09-30" },
  { id: "LST-010", sku: "MAY-PWD-010", product: "Maybelline Fit Me Loose Finishing Powder", brand: "Maybelline", category: "Makeup", quantity: 650, unitPrice: 6.10, totalValue: 3965, status: "Active", channel: "Marketplace", condition: "Overstock" },
  { id: "LST-011", sku: "LOR-DYE-011", product: "L'Oréal Paris Excellence Creme Hair Color", brand: "L'Oréal Paris", category: "Hair Color", quantity: 1100, unitPrice: 6.80, totalValue: 7480, status: "Draft", channel: "Marketplace", condition: "Packaging Change" },
  { id: "LST-012", sku: "GAR-SUN-012", product: "Garnier Bright Complete UV Protection SPF50", brand: "Garnier", category: "Sun Care", quantity: 2800, unitPrice: 5.50, totalValue: 15400, status: "Active", channel: "Employee F&F", condition: "Near Expiry", expiryDate: "2026-07-20" },
  { id: "LST-013", sku: "LOR-CRM-013", product: "L'Oréal Paris Revitalift Crystal Micro-Essence 65ml", brand: "L'Oréal Paris", category: "Skin Care", quantity: 900, unitPrice: 9.80, totalValue: 8820, status: "Active", channel: "Auctions", condition: "Overstock" },
  { id: "LST-014", sku: "MAY-EYE-014", product: "Maybelline The Colossal Kajal 12HR", brand: "Maybelline", category: "Makeup", quantity: 3500, unitPrice: 2.40, totalValue: 8400, status: "Active", channel: "Marketplace", condition: "Overstock" },
  { id: "LST-015", sku: "GAR-LOT-015", product: "Garnier Body Sakura White Lotion 400ml", brand: "Garnier", category: "Body Care", quantity: 1600, unitPrice: 3.90, totalValue: 6240, status: "Active", channel: "Employee F&F", condition: "Packaging Change" },
  { id: "LST-016", sku: "LOR-LIP-016", product: "L'Oréal Paris Color Riche Matte Lipstick", brand: "L'Oréal Paris", category: "Makeup", quantity: 720, unitPrice: 7.50, totalValue: 5400, status: "Active", channel: "Marketplace", condition: "Discontinued" },
  { id: "LST-017", sku: "NYX-BRW-017", product: "NYX Professional Micro Brow Pencil", brand: "NYX", category: "Makeup", quantity: 2000, unitPrice: 4.20, totalValue: 8400, status: "Active", channel: "Catalogs", condition: "Overstock" },
  { id: "LST-018", sku: "GAR-FCW-018", product: "Garnier Men Oil Clear Face Wash 100ml", brand: "Garnier", category: "Skin Care", quantity: 3800, unitPrice: 2.60, totalValue: 9880, status: "Active", channel: "Marketplace", condition: "Near Expiry", expiryDate: "2026-10-15" },
  { id: "LST-019", sku: "LOR-EYE-019", product: "L'Oréal Paris True Match Eye Cream 15ml", brand: "L'Oréal Paris", category: "Skin Care", quantity: 500, unitPrice: 11.20, totalValue: 5600, status: "Active", channel: "Catalogs", condition: "Overstock" },
];

export const transactions: Transaction[] = [
  { id: "TXN-001", buyer: "PT Mitra Kosmetik", product: "L'Oréal Paris Elvive Total Repair 5 Shampoo 680ml", quantity: 1200, offerPrice: 2.40, psiPrice: 3.20, status: "Counter Sent", channel: "Marketplace", date: "2026-04-28", approvals: [{ team: "Sales", approved: true }, { team: "Finance", approved: false }, { team: "Legal", approved: false }] },
  { id: "TXN-002", buyer: "BeautyHub Philippines", product: "Garnier Bright Complete Vitamin C Serum Mask", quantity: 2500, offerPrice: 1.60, psiPrice: 1.80, status: "Approved", channel: "Marketplace", date: "2026-04-27", approvals: [{ team: "Sales", approved: true }, { team: "Finance", approved: true }, { team: "Legal", approved: true }] },
  { id: "TXN-003", buyer: "Tok Kosmetik MY", product: "L'Oréal Paris Revitalift Hyaluronic Acid Serum 30ml", quantity: 600, offerPrice: 7.80, psiPrice: 8.50, status: "Order Created", channel: "Catalogs", date: "2026-04-26", approvals: [{ team: "Sales", approved: true }, { team: "Finance", approved: true }, { team: "Legal", approved: true }] },
  { id: "TXN-004", buyer: "SG Beauty Outlet", product: "Maybelline Fit Me Matte Foundation 30ml", quantity: 480, offerPrice: 5.40, psiPrice: 5.40, status: "In Transit", channel: "Marketplace", date: "2026-04-24" },
  { id: "TXN-005", buyer: "BinDawood Retail", product: "Garnier Micellar Cleansing Water Pink 400ml", quantity: 1600, offerPrice: 3.80, psiPrice: 4.10, status: "Pending", channel: "Marketplace", date: "2026-04-29" },
  { id: "TXN-006", buyer: "Watsons Thailand", product: "NYX Professional Makeup Soft Matte Lip Cream", quantity: 750, offerPrice: 4.50, psiPrice: 4.80, status: "Delivered", channel: "Employee F&F", date: "2026-04-18" },
  { id: "TXN-007", buyer: "Metro Manila Cosmetics", product: "L'Oréal Paris Voluminous Lash Paradise Mascara", quantity: 400, offerPrice: 6.00, psiPrice: 7.20, status: "Pending", channel: "Auctions", date: "2026-04-29" },
  { id: "TXN-008", buyer: "Internal Employee Purchase", product: "Garnier Bright Complete UV Protection SPF50", quantity: 200, offerPrice: 3.30, psiPrice: 5.50, status: "Approved", channel: "Employee F&F", date: "2026-04-28" },
];

export const customers: Customer[] = [
  { id: "CUS-001", name: "Ahmad Rizal", company: "PT Mitra Kosmetik", region: "Indonesia", totalOrders: 12, totalSpend: 45600, lastOrder: "2026-04-28", status: "Active", approvedMarkets: ["Indonesia", "Malaysia"] },
  { id: "CUS-002", name: "Maria Santos", company: "BeautyHub Philippines", region: "Philippines", totalOrders: 8, totalSpend: 32400, lastOrder: "2026-04-27", status: "Active", approvedMarkets: ["Philippines"] },
  { id: "CUS-003", name: "Tan Wei Lin", company: "Tok Kosmetik MY", region: "Malaysia", totalOrders: 15, totalSpend: 67800, lastOrder: "2026-04-26", status: "Active", approvedMarkets: ["Malaysia", "Singapore"] },
  { id: "CUS-004", name: "Lee Kai Wen", company: "SG Beauty Outlet", region: "Singapore", totalOrders: 6, totalSpend: 28900, lastOrder: "2026-04-24", status: "Active", approvedMarkets: ["Singapore"] },
  { id: "CUS-005", name: "Fahad Al-Rashid", company: "BinDawood Retail", region: "Saudi Arabia", totalOrders: 3, totalSpend: 15200, lastOrder: "2026-04-29", status: "Active", approvedMarkets: ["Saudi Arabia", "UAE", "Bahrain"] },
  { id: "CUS-006", name: "Siriporn Mee", company: "Watsons Thailand", region: "Thailand", totalOrders: 22, totalSpend: 89400, lastOrder: "2026-04-18", status: "Active", approvedMarkets: ["Thailand", "Myanmar", "Cambodia"] },
  { id: "CUS-007", name: "Juan Dela Cruz", company: "Metro Manila Cosmetics", region: "Philippines", totalOrders: 4, totalSpend: 18600, lastOrder: "2026-04-29", status: "Active", approvedMarkets: ["Philippines"] },
];

export const automations = [
  { name: "Auto-allocate by channel priority", category: "Allocation", active: true },
  { name: "Price optimization by shelf life", category: "Pricing", active: true },
  { name: "Buyer matching by product category", category: "Matching", active: true },
  { name: "Auto-publish when allocation complete", category: "Publishing", active: true },
  { name: "Near-expiry alert → markdown trigger", category: "Pricing", active: true },
  { name: "Grey market check on new buyer", category: "Compliance", active: true },
  { name: "Auto-counter when offer < 80% PSI", category: "Negotiation", active: true },
  { name: "Multi-team approval routing", category: "Approval", active: true },
  { name: "Invoice generation on order confirm", category: "Fulfillment", active: true },
  { name: "Pickup scheduling notification", category: "Logistics", active: true },
  { name: "Sustainability metrics calculation", category: "Reporting", active: true },
  { name: "Buyer outreach by channel segment", category: "Outreach", active: true },
  { name: "Catalog creation from allocation", category: "Publishing", active: false },
  { name: "Duplicate listing detection", category: "Quality", active: true },
  { name: "Auto-archive expired listings", category: "Maintenance", active: true },
  { name: "Bulk price update by brand", category: "Pricing", active: false },
  { name: "Restock alert for high-demand SKUs", category: "Inventory", active: true },
  { name: "Weekly channel performance digest", category: "Reporting", active: true },
  { name: "Buyer credit check automation", category: "Compliance", active: false },
  { name: "Auto-assign lot numbers", category: "Inventory", active: true },
  { name: "Cross-channel dedup", category: "Quality", active: true },
  { name: "Seasonal pricing adjustment", category: "Pricing", active: false },
];

export const sustainabilityData = {
  totalProductsDiverted: 42800,
  totalWeightKg: 28560,
  co2eAvoided: 14280,
  revenueRecovered: 186420,
  sellThroughRate: 87.3,
  avgDaysToSell: 18,
  channelPerformance: [
    { channel: "Marketplace", units: 22400, revenue: 98500, sellThrough: 91.2 },
    { channel: "Employee F&F", units: 8200, revenue: 28600, sellThrough: 95.4 },
    { channel: "Catalogs", units: 6800, revenue: 34200, sellThrough: 82.1 },
    { channel: "Auctions", units: 5400, revenue: 25120, sellThrough: 76.8 },
  ],
  monthlyTrend: [
    { month: "Nov", units: 5200, co2e: 1820 },
    { month: "Dec", units: 7800, co2e: 2730 },
    { month: "Jan", units: 6400, co2e: 2240 },
    { month: "Feb", units: 8200, co2e: 2870 },
    { month: "Mar", units: 9100, co2e: 3185 },
    { month: "Apr", units: 6100, co2e: 2135 },
  ],
};
