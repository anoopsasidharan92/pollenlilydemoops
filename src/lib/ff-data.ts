export interface FFListing {
  id: string;
  sku: string;
  product: string;
  brand: string;
  category: string;
  allocatedQty: number;
  soldQty: number;
  remainingQty: number;
  retailPrice: number;
  ffDiscount: number;
  ffPrice: number;
  maxPerBuyer: number;
  status: "Live" | "Sold Out" | "Reserved" | "Upcoming";
  channel: "Online" | "Bazaar" | "Both";
  image?: string;
}

export interface FFOrder {
  id: string;
  buyer: string;
  buyerEmail: string;
  department: string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  channel: "Online" | "Bazaar";
  status: "Completed" | "Processing" | "Picked Up" | "Shipped";
  date: string;
  time: string;
  posTerminal?: string;
}

export interface FFAccessConfig {
  authMethod: "SSO" | "Email Domain" | "Invite Code";
  allowedDomains: string[];
  spendingCap: number;
  maxItemsPerOrder: number;
  eventStartDate: string;
  eventEndDate: string;
  bazaarEnabled: boolean;
  bazaarLocation: string;
  bazaarDates: string[];
}

export interface FFAnalytics {
  totalRevenue: number;
  totalOrders: number;
  uniqueBuyers: number;
  avgOrderValue: number;
  onlineRevenue: number;
  bazaarRevenue: number;
  onlineOrders: number;
  bazaarOrders: number;
  netRecoveryRate: number;
  originalRetailValue: number;
  recoveredValue: number;
  skuSellThrough: { sku: string; product: string; brand: string; allocated: number; sold: number; sellThrough: number; revenue: number }[];
  hourlyTraffic: { hour: string; online: number; bazaar: number }[];
  departmentBreakdown: { department: string; orders: number; spend: number }[];
}

export const ffListings: FFListing[] = [
  { id: "FF-001", sku: "LOR-SHP-001", product: "L'Oréal Paris Elvive Total Repair 5 Shampoo 680ml", brand: "L'Oréal Paris", category: "Hair Care", allocatedQty: 600, soldQty: 482, remainingQty: 118, retailPrice: 8.90, ffDiscount: 55, ffPrice: 4.01, maxPerBuyer: 3, status: "Live", channel: "Both", image: "/products/LOR-SHP-001.png" },
  { id: "FF-002", sku: "LOR-SER-002", product: "L'Oréal Paris Revitalift Hyaluronic Acid Serum 30ml", brand: "L'Oréal Paris", category: "Skin Care", allocatedQty: 400, soldQty: 400, remainingQty: 0, retailPrice: 24.90, ffDiscount: 60, ffPrice: 9.96, maxPerBuyer: 2, status: "Sold Out", channel: "Both", image: "/products/LOR-SER-002.png" },
  { id: "FF-003", sku: "GAR-MSK-003", product: "Garnier Bright Complete Vitamin C Serum Mask", brand: "Garnier", category: "Skin Care", allocatedQty: 1200, soldQty: 948, remainingQty: 252, retailPrice: 4.90, ffDiscount: 50, ffPrice: 2.45, maxPerBuyer: 6, status: "Live", channel: "Both", image: "/products/GAR-MSK-003.jpg" },
  { id: "FF-004", sku: "MAY-FND-004", product: "Maybelline Fit Me Matte Foundation 30ml", brand: "Maybelline", category: "Makeup", allocatedQty: 300, soldQty: 216, remainingQty: 84, retailPrice: 14.90, ffDiscount: 55, ffPrice: 6.71, maxPerBuyer: 2, status: "Live", channel: "Online", image: "/products/MAY-FND-004.jpg" },
  { id: "FF-005", sku: "NYX-LIP-007", product: "NYX Professional Makeup Soft Matte Lip Cream", brand: "NYX", category: "Makeup", allocatedQty: 800, soldQty: 654, remainingQty: 146, retailPrice: 11.90, ffDiscount: 50, ffPrice: 5.95, maxPerBuyer: 4, status: "Live", channel: "Both", image: "/products/NYX-LIP-007.jpg" },
  { id: "FF-006", sku: "GAR-SUN-012", product: "Garnier Bright Complete UV Protection SPF50", brand: "Garnier", category: "Sun Care", allocatedQty: 500, soldQty: 500, remainingQty: 0, retailPrice: 15.90, ffDiscount: 60, ffPrice: 6.36, maxPerBuyer: 2, status: "Sold Out", channel: "Both", image: "/products/GAR-SUN-012.png" },
  { id: "FF-007", sku: "GAR-LOT-015", product: "Garnier Body Sakura White Lotion 400ml", brand: "Garnier", category: "Body Care", allocatedQty: 600, soldQty: 378, remainingQty: 222, retailPrice: 9.90, ffDiscount: 55, ffPrice: 4.46, maxPerBuyer: 3, status: "Live", channel: "Both" },
  { id: "FF-008", sku: "LOR-LIP-016", product: "L'Oréal Paris Color Riche Matte Lipstick", brand: "L'Oréal Paris", category: "Makeup", allocatedQty: 350, soldQty: 0, remainingQty: 350, retailPrice: 18.90, ffDiscount: 50, ffPrice: 9.45, maxPerBuyer: 3, status: "Upcoming", channel: "Bazaar" },
  { id: "FF-009", sku: "LOR-CDN-005", product: "L'Oréal Paris Elvive Total Repair 5 Conditioner 680ml", brand: "L'Oréal Paris", category: "Hair Care", allocatedQty: 500, soldQty: 412, remainingQty: 88, retailPrice: 8.90, ffDiscount: 55, ffPrice: 4.01, maxPerBuyer: 3, status: "Live", channel: "Both", image: "/products/LOR-CDN-005.png" },
  { id: "FF-010", sku: "GAR-CLN-006", product: "Garnier Micellar Cleansing Water Pink 400ml", brand: "Garnier", category: "Skin Care", allocatedQty: 700, soldQty: 588, remainingQty: 112, retailPrice: 12.90, ffDiscount: 55, ffPrice: 5.81, maxPerBuyer: 2, status: "Live", channel: "Online", image: "/products/GAR-CLN-006.jpg" },
];

export const ffOrders: FFOrder[] = [
  { id: "FFO-001", buyer: "Sarah Chen", buyerEmail: "sarah.chen@loreal.com", department: "Marketing", product: "L'Oréal Paris Revitalift Hyaluronic Acid Serum 30ml", sku: "LOR-SER-002", quantity: 2, unitPrice: 9.96, totalAmount: 19.92, channel: "Online", status: "Shipped", date: "2026-04-28", time: "09:15" },
  { id: "FFO-002", buyer: "David Lim", buyerEmail: "david.lim@loreal.com", department: "R&D", product: "NYX Professional Makeup Soft Matte Lip Cream", sku: "NYX-LIP-007", quantity: 4, unitPrice: 5.95, totalAmount: 23.80, channel: "Bazaar", status: "Picked Up", date: "2026-04-28", time: "11:32", posTerminal: "POS-B02" },
  { id: "FFO-003", buyer: "Aisha Rahman", buyerEmail: "aisha.rahman@loreal.com", department: "Finance", product: "Garnier Bright Complete Vitamin C Serum Mask", sku: "GAR-MSK-003", quantity: 6, unitPrice: 2.45, totalAmount: 14.70, channel: "Online", status: "Processing", date: "2026-04-29", time: "08:42" },
  { id: "FFO-004", buyer: "James Park", buyerEmail: "james.park@loreal.com", department: "Supply Chain", product: "Garnier Bright Complete UV Protection SPF50", sku: "GAR-SUN-012", quantity: 2, unitPrice: 6.36, totalAmount: 12.72, channel: "Bazaar", status: "Picked Up", date: "2026-04-28", time: "14:20", posTerminal: "POS-B01" },
  { id: "FFO-005", buyer: "Priya Nair", buyerEmail: "priya.nair@loreal.com", department: "HR", product: "L'Oréal Paris Elvive Total Repair 5 Shampoo 680ml", sku: "LOR-SHP-001", quantity: 3, unitPrice: 4.01, totalAmount: 12.03, channel: "Online", status: "Completed", date: "2026-04-27", time: "16:05" },
  { id: "FFO-006", buyer: "Tom Wilson", buyerEmail: "tom.wilson@loreal.com", department: "Sales", product: "Maybelline Fit Me Matte Foundation 30ml", sku: "MAY-FND-004", quantity: 2, unitPrice: 6.71, totalAmount: 13.42, channel: "Online", status: "Shipped", date: "2026-04-28", time: "10:18" },
  { id: "FFO-007", buyer: "Mei Ling", buyerEmail: "mei.ling@loreal.com", department: "Marketing", product: "Garnier Body Sakura White Lotion 400ml", sku: "GAR-LOT-015", quantity: 3, unitPrice: 4.46, totalAmount: 13.38, channel: "Bazaar", status: "Picked Up", date: "2026-04-29", time: "09:45", posTerminal: "POS-B03" },
  { id: "FFO-008", buyer: "Alex Tan", buyerEmail: "alex.tan@loreal.com", department: "IT", product: "L'Oréal Paris Elvive Total Repair 5 Conditioner 680ml", sku: "LOR-CDN-005", quantity: 2, unitPrice: 4.01, totalAmount: 8.02, channel: "Online", status: "Processing", date: "2026-04-29", time: "10:30" },
  { id: "FFO-009", buyer: "Nina Patel", buyerEmail: "nina.patel@loreal.com", department: "Legal", product: "Garnier Micellar Cleansing Water Pink 400ml", sku: "GAR-CLN-006", quantity: 2, unitPrice: 5.81, totalAmount: 11.62, channel: "Bazaar", status: "Picked Up", date: "2026-04-28", time: "13:10", posTerminal: "POS-B01" },
  { id: "FFO-010", buyer: "Raj Kumar", buyerEmail: "raj.kumar@loreal.com", department: "Operations", product: "L'Oréal Paris Revitalift Hyaluronic Acid Serum 30ml", sku: "LOR-SER-002", quantity: 2, unitPrice: 9.96, totalAmount: 19.92, channel: "Online", status: "Completed", date: "2026-04-27", time: "11:22" },
  { id: "FFO-011", buyer: "Lisa Wang", buyerEmail: "lisa.wang@loreal.com", department: "R&D", product: "Garnier Bright Complete UV Protection SPF50", sku: "GAR-SUN-012", quantity: 2, unitPrice: 6.36, totalAmount: 12.72, channel: "Online", status: "Shipped", date: "2026-04-28", time: "15:40" },
  { id: "FFO-012", buyer: "Kevin Yeo", buyerEmail: "kevin.yeo@loreal.com", department: "Finance", product: "NYX Professional Makeup Soft Matte Lip Cream", sku: "NYX-LIP-007", quantity: 3, unitPrice: 5.95, totalAmount: 17.85, channel: "Bazaar", status: "Picked Up", date: "2026-04-29", time: "10:05", posTerminal: "POS-B02" },
  { id: "FFO-013", buyer: "Emily Ng", buyerEmail: "emily.ng@loreal.com", department: "Marketing", product: "Garnier Bright Complete Vitamin C Serum Mask", sku: "GAR-MSK-003", quantity: 4, unitPrice: 2.45, totalAmount: 9.80, channel: "Online", status: "Completed", date: "2026-04-26", time: "14:55" },
  { id: "FFO-014", buyer: "Hassan Ali", buyerEmail: "hassan.ali@loreal.com", department: "Supply Chain", product: "L'Oréal Paris Elvive Total Repair 5 Shampoo 680ml", sku: "LOR-SHP-001", quantity: 2, unitPrice: 4.01, totalAmount: 8.02, channel: "Bazaar", status: "Picked Up", date: "2026-04-28", time: "12:30", posTerminal: "POS-B03" },
  { id: "FFO-015", buyer: "Yuki Sato", buyerEmail: "yuki.sato@loreal.com", department: "Digital", product: "L'Oréal Paris Elvive Total Repair 5 Conditioner 680ml", sku: "LOR-CDN-005", quantity: 3, unitPrice: 4.01, totalAmount: 12.03, channel: "Online", status: "Processing", date: "2026-04-29", time: "11:15" },
];

export const ffAccessConfig: FFAccessConfig = {
  authMethod: "SSO",
  allowedDomains: ["loreal.com", "lorealgroup.com"],
  spendingCap: 200,
  maxItemsPerOrder: 10,
  eventStartDate: "2026-04-25",
  eventEndDate: "2026-05-02",
  bazaarEnabled: true,
  bazaarLocation: "L'Oréal Indonesia HQ — Lobby Level, Hall B",
  bazaarDates: ["2026-04-28", "2026-04-29"],
};

export const ffAnalytics: FFAnalytics = {
  totalRevenue: 28842,
  totalOrders: 347,
  uniqueBuyers: 289,
  avgOrderValue: 83.12,
  onlineRevenue: 17305,
  bazaarRevenue: 11537,
  onlineOrders: 208,
  bazaarOrders: 139,
  netRecoveryRate: 42.6,
  originalRetailValue: 67720,
  recoveredValue: 28842,
  skuSellThrough: [
    { sku: "LOR-SER-002", product: "Revitalift Hyaluronic Acid Serum 30ml", brand: "L'Oréal Paris", allocated: 400, sold: 400, sellThrough: 100, revenue: 3984 },
    { sku: "GAR-SUN-012", product: "Bright Complete UV Protection SPF50", brand: "Garnier", allocated: 500, sold: 500, sellThrough: 100, revenue: 3180 },
    { sku: "GAR-MSK-003", product: "Bright Complete Vitamin C Serum Mask", brand: "Garnier", allocated: 1200, sold: 948, sellThrough: 79, revenue: 2323 },
    { sku: "NYX-LIP-007", product: "Soft Matte Lip Cream", brand: "NYX", allocated: 800, sold: 654, sellThrough: 81.8, revenue: 3891 },
    { sku: "LOR-SHP-001", product: "Elvive Total Repair 5 Shampoo 680ml", brand: "L'Oréal Paris", allocated: 600, sold: 482, sellThrough: 80.3, revenue: 1933 },
    { sku: "LOR-CDN-005", product: "Elvive Total Repair 5 Conditioner 680ml", brand: "L'Oréal Paris", allocated: 500, sold: 412, sellThrough: 82.4, revenue: 1652 },
    { sku: "GAR-CLN-006", product: "Micellar Cleansing Water Pink 400ml", brand: "Garnier", allocated: 700, sold: 588, sellThrough: 84, revenue: 3416 },
    { sku: "GAR-LOT-015", product: "Body Sakura White Lotion 400ml", brand: "Garnier", allocated: 600, sold: 378, sellThrough: 63, revenue: 1686 },
    { sku: "MAY-FND-004", product: "Fit Me Matte Foundation 30ml", brand: "Maybelline", allocated: 300, sold: 216, sellThrough: 72, revenue: 1449 },
    { sku: "LOR-LIP-016", product: "Color Riche Matte Lipstick", brand: "L'Oréal Paris", allocated: 350, sold: 0, sellThrough: 0, revenue: 0 },
  ],
  hourlyTraffic: [
    { hour: "8 AM", online: 12, bazaar: 0 },
    { hour: "9 AM", online: 34, bazaar: 22 },
    { hour: "10 AM", online: 48, bazaar: 38 },
    { hour: "11 AM", online: 42, bazaar: 45 },
    { hour: "12 PM", online: 28, bazaar: 52 },
    { hour: "1 PM", online: 22, bazaar: 48 },
    { hour: "2 PM", online: 36, bazaar: 35 },
    { hour: "3 PM", online: 44, bazaar: 28 },
    { hour: "4 PM", online: 38, bazaar: 18 },
    { hour: "5 PM", online: 26, bazaar: 8 },
    { hour: "6 PM", online: 18, bazaar: 0 },
  ],
  departmentBreakdown: [
    { department: "Marketing", orders: 68, spend: 5640 },
    { department: "R&D", orders: 52, spend: 4320 },
    { department: "Finance", orders: 45, spend: 3740 },
    { department: "Sales", orders: 42, spend: 3490 },
    { department: "Supply Chain", orders: 38, spend: 3156 },
    { department: "HR", orders: 35, spend: 2908 },
    { department: "IT", orders: 28, spend: 2328 },
    { department: "Operations", orders: 22, spend: 1828 },
    { department: "Legal", orders: 17, spend: 1432 },
  ],
};

export const ffPosLiveFeed = [
  { id: "POS-EVT-001", terminal: "POS-B01", buyer: "Aisha Rahman", product: "Garnier Bright Complete UV Protection SPF50", qty: 2, amount: 12.72, time: "10:42:15", status: "confirmed" as const },
  { id: "POS-EVT-002", terminal: "POS-B02", buyer: "Kevin Yeo", product: "NYX Professional Makeup Soft Matte Lip Cream", qty: 3, amount: 17.85, time: "10:43:02", status: "confirmed" as const },
  { id: "POS-EVT-003", terminal: "POS-B03", buyer: "Mei Ling", product: "Garnier Body Sakura White Lotion 400ml", qty: 3, amount: 13.38, time: "10:44:28", status: "confirmed" as const },
  { id: "POS-EVT-004", terminal: "POS-B01", buyer: "Hassan Ali", product: "L'Oréal Paris Elvive Total Repair 5 Shampoo 680ml", qty: 2, amount: 8.02, time: "10:45:11", status: "syncing" as const },
  { id: "POS-EVT-005", terminal: "POS-B02", buyer: "Priya Nair", product: "Garnier Bright Complete Vitamin C Serum Mask", qty: 4, amount: 9.80, time: "10:45:38", status: "syncing" as const },
];
