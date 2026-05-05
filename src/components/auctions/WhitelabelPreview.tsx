"use client";

import { useEffect, useState } from "react";
import {
  Gavel,
  Clock,
  Users,
  Eye,
  EyeOff,
  Shield,
  Globe,
  ChevronDown,
} from "lucide-react";
import type { AuctionBundle } from "@/lib/auction-data";
import { listings } from "@/lib/demo-data";

interface Props {
  eventTitle: string;
  brandColor: string;
  brandName: string;
  auctionType: string;
  startTime: string;
  endTime: string;
  bundles: AuctionBundle[];
  bundlePrices: Record<string, { start: number; reserve: number; increment: number; showReserve: boolean }>;
  buyerAccess: string;
  invitedCount: number;
}

export default function WhitelabelPreview({
  eventTitle,
  brandColor,
  brandName,
  auctionType,
  startTime,
  endTime,
  bundles,
  bundlePrices,
  buyerAccess,
  invitedCount,
}: Props) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const [selectedLotId, setSelectedLotId] = useState<string>(bundles[0]?.id || "");

  useEffect(() => {
    if (!bundles.length) {
      setSelectedLotId("");
      return;
    }
    if (!bundles.some((b) => b.id === selectedLotId)) {
      setSelectedLotId(bundles[0].id);
    }
  }, [bundles, selectedLotId]);

  const selectedLot = bundles.find((b) => b.id === selectedLotId) || bundles[0];
  const selectedLotPrices = selectedLot ? bundlePrices[selectedLot.id] : null;
  const [workspaceTab, setWorkspaceTab] = useState<"lot" | "product">("lot");
  const totalSkus = bundles.reduce((sum, b) => sum + b.skus.length, 0);
  const totalQty = bundles.reduce((sum, b) => sum + b.totalQuantity, 0);
  const totalRetail = bundles.reduce((sum, b) => sum + b.totalRetailValue, 0);
  const selectedLotSkuCount = selectedLot?.skus.length || 0;
  const selectedLotQty = selectedLot?.totalQuantity || 0;
  const selectedLotRetail = selectedLot?.totalRetailValue || 0;
  const lotRows = bundles.map((bundle, idx) => ({
    lotId: `LOT-${String(idx + 1).padStart(3, "0")}`,
    lotName: bundle.name,
    auctionChannel: eventTitle,
    auctionCode: "AUC-WK",
    lotType: "Bundle lot",
    products: bundle.skus.length,
    listingsCount: bundle.skus.length,
    qty: bundle.totalQuantity,
    valueTHB: Math.round(bundle.totalRetailValue * 34),
    state: "Draft",
    bundleId: bundle.id,
  }));
  const selectedLotRow = selectedLot
    ? lotRows.find((r) => r.bundleId === selectedLot.id)
    : undefined;
  const productRows = (selectedLot?.skus || []).map((sku) => {
    const item = listings.find((l) => l.sku === sku);
    return {
      sku,
      productName: item?.product || `${sku} product`,
      lotId: selectedLotRow?.lotId || "LOT-001",
      lotName: selectedLot?.name || "Lot",
      batchDetail: `${sku}-TH95`,
      warehouse: "L'Oreal Thailand Distribution Center",
      qty: item?.quantity || Math.round((selectedLot?.totalQuantity || 0) / Math.max(1, selectedLot?.skus.length || 1)),
    };
  });
  const selectedAuctionLabel = eventTitle;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-primary">
                <span className="w-5 h-5 rounded bg-black text-white flex items-center justify-center text-[9px]">
                  {brandName.slice(0, 1).toUpperCase()}
                </span>
                {brandName.toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-text-primary">{eventTitle}</h2>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-1 rounded-full bg-primary-50 text-primary font-medium">
                  Ends {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="px-2 py-1 rounded-full bg-primary-50 text-primary font-medium">Thailand</span>
                <span className="px-2 py-1 rounded-full bg-primary-50 text-primary font-medium">{invitedCount} bidders</span>
              </div>
            </div>
            <button className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: brandColor }}>
              View Bid Summary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 bg-surface-muted/20">
          <div className="col-span-8 space-y-3">
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div
                className="h-[300px] relative"
                style={{
                  background: "linear-gradient(120deg, #a855f7 0%, #8b5cf6 35%, #7c3aed 100%)",
                }}
              >
                <div className="absolute inset-0 p-6 flex items-end">
                  <div className="text-white">
                    <p className="text-sm opacity-90">LOT DISPLAY</p>
                    <p className="text-lg font-bold">{selectedLot?.name || "Weekly P1 Mixed Beauty Lot"}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-0 border-t border-border">
                <div className="p-4 border-r border-border">
                  <p className="text-[10px] text-text-muted uppercase">Lot SKUs</p>
                  <p className="text-2xl font-bold mt-1">{selectedLotSkuCount}</p>
                </div>
                <div className="p-4 border-r border-border">
                  <p className="text-[10px] text-text-muted uppercase">Lot Quantity</p>
                  <p className="text-2xl font-bold mt-1">{selectedLotQty.toLocaleString()}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-text-muted uppercase">Lot Retail Value</p>
                  <p className="text-2xl font-bold mt-1">THB {Math.round(selectedLotRetail * 34).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-[11px] font-semibold text-primary mb-2">Ends in 2 days</p>
                <p className="text-xs text-text-secondary">
                  {endDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {endDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {["02", "04", "33", "34"].map((v, idx) => (
                    <div key={v} className="rounded-lg bg-surface-muted px-2 py-2">
                      <p className="text-lg font-bold text-primary">{v}</p>
                      <p className="text-[9px] text-text-muted">{["Days", "Hrs", "Min", "Sec"][idx]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-[11px] font-semibold mb-2">Lot Specifications</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p className="text-text-muted">Market Access</p>
                  <p className="font-medium">Domestic & Export</p>
                  <p className="text-text-muted">Auction Format</p>
                  <p className="font-medium">{auctionType} Auction</p>
                  <p className="text-text-muted">Selected Lot</p>
                  <p className="font-medium">{selectedLot?.name || "N/A"}</p>
                  <p className="text-text-muted">Lot Items</p>
                  <p className="font-medium">{selectedLotSkuCount} Unique Items</p>
                  <p className="text-text-muted">Curated Categories</p>
                  <p className="font-medium">{selectedLot ? selectedLot.skus.slice(0, 3).join(", ") : "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 space-y-3">
              <p className="text-[11px] font-semibold text-text-secondary">Filter & Search</p>
              <div className="h-10 rounded-lg border border-border bg-surface-muted/40 px-3 flex items-center text-xs text-text-muted">
                Search by SKU, name, or brand...
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["All Categories", "All Sub-Categories", "All Brands", "All Warehouses", "All Shelf Lifes"].map((x) => (
                  <div key={x} className="h-9 rounded-lg border border-border px-3 flex items-center justify-between text-[11px] text-text-secondary">
                    {x}
                    <ChevronDown size={12} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xl font-bold">Manifest Details</h4>
                  <div className="flex items-center gap-1">
                    {bundles.map((bundle, i) => (
                      <button
                        key={bundle.id}
                        onClick={() => setSelectedLotId(bundle.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                          selectedLot?.id === bundle.id
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-text-secondary border-border"
                        }`}
                      >
                        Lot {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Showing manifest for <span className="font-semibold text-text-primary">{selectedLot?.name || "selected lot"}</span>
                </p>
              </div>
              <div className="grid grid-cols-6 gap-2 px-4 py-2 text-[10px] font-semibold text-text-muted uppercase border-b border-border">
                <p>Item Details</p>
                <p>SKU / Barcode</p>
                <p>Inventory Qty</p>
                <p>Exp Date</p>
                <p>Warehouse</p>
                <p>Retail Price</p>
              </div>
              {(selectedLot?.skus || []).slice(0, 5).map((sku, idx) => (
                <div key={sku} className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-border/40 text-xs">
                  <div>
                    <p className="font-semibold">Item {idx + 1}</p>
                    <p className="text-[10px] text-primary">NEW</p>
                  </div>
                  <div className="font-mono">{sku}</div>
                  <div className="font-semibold">{Math.max(2, Math.round((selectedLot?.totalQuantity || 1200) / (idx + 3) / 100))} CARTONS</div>
                  <div>01 MAY 2027</div>
                  <div>L&apos;OREAL THAILAND DISTRIBUTION CENTER</div>
                  <div className="font-semibold text-primary">THB {(2300 + idx * 880).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <div className="rounded-xl border border-border bg-white p-4 space-y-4 sticky top-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 text-accent-orange font-medium">
                  Reserve not met
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-surface-muted text-text-secondary font-medium">
                  2d 4h remaining
                </span>
              </div>
              <div className="text-center">
                <p className="text-[11px] text-text-muted">THB</p>
                <p className="text-5xl font-black">{(selectedLotPrices?.start || 75000).toLocaleString()}</p>
                <p className="text-[10px] text-text-muted mt-1">STARTING PRICE ({Math.max(0, invitedCount - 1)} BIDS)</p>
              </div>
              <div className="rounded-full px-3 py-2 bg-primary-50 text-primary text-xs font-semibold text-center">
                Effective Unit Price: THB {selectedLotQty > 0 ? ((Math.round((selectedLotPrices?.start || 0) * 100) / 100) / selectedLotQty).toFixed(2) : "0.00"} / item
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-3 py-2 bg-primary-50/60 border-b border-border">
                  <p className="text-sm font-semibold text-primary">Place your bid</p>
                  <p className="text-[10px] text-text-muted">Adjust & participate</p>
                </div>
                <div className="p-3 space-y-3">
                  <div className="rounded-lg bg-orange-50 border border-orange-100 text-[11px] text-accent-orange px-3 py-2">
                    Be the first bidder! Place your bid now to take the lead.
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted mb-1">Your bid amount</p>
                    <div className="rounded-lg border border-border px-3 py-2 flex items-center justify-between">
                      <button className="w-8 h-8 rounded-lg border border-border">-</button>
                      <p className="text-3xl font-extrabold text-primary">THB {selectedLotPrices?.start.toLocaleString() || "75,000"}</p>
                      <button className="w-8 h-8 rounded-lg border border-border">+</button>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {["+2%", "+5%", "+10%", "Reset"].map((x) => (
                        <button key={x} className="px-2 py-1 text-[10px] rounded-full border border-border">
                          {x}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs">
                    <input type="checkbox" />
                    Enable auto-bidding
                  </label>
                  <button className="w-full py-3 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: brandColor }}>
                    Confirm Bid
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-text-muted flex items-center justify-between">
                <span className="flex items-center gap-1"><Shield size={10} /> Verified Seller</span>
                <span className="flex items-center gap-1">
                  {buyerAccess === "Invite Only" ? "🔒" : <Globe size={10} />}
                  {buyerAccess}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-white text-[10px] text-text-muted flex items-center justify-between">
          <span className="flex items-center gap-1"><Gavel size={10} /> {auctionType} Auction</span>
          <span className="flex items-center gap-1"><Clock size={10} /> Opens {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          <span className="flex items-center gap-1"><Users size={10} /> {invitedCount} invited buyers</span>
          <span className="flex items-center gap-1"><EyeOff size={10} /> Reserves may be hidden by lot</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] font-bold text-accent-orange uppercase">Event Structure</p>
            <h4 className="text-2xl font-bold">{eventTitle}</h4>
            <p className="text-xs text-text-muted">This event contains lot-level and product-level allocations.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-border bg-surface-muted">
              Auction: 1
            </span>
            <span className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-border bg-surface-muted">
              Lots: {bundles.length}
            </span>
            <span className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-border bg-surface-muted">
              Products: {selectedLotSkuCount}
            </span>
            {[
              { key: "lot", label: "Lot list" },
              { key: "product", label: "Product list" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setWorkspaceTab(tab.key as "lot" | "product")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  workspaceTab === tab.key ? "bg-yellow-50 border-yellow-300 text-amber-700" : "border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          {workspaceTab === "lot" && (
            <table className="w-full text-xs">
              <thead className="bg-surface-muted/50 text-text-muted uppercase text-[10px]">
                <tr>
                  <th className="text-left px-3 py-2">Lot #</th>
                  <th className="text-left px-3 py-2">Lot Name</th>
                  <th className="text-left px-3 py-2">Auction Channel</th>
                  <th className="text-left px-3 py-2">Lot Type</th>
                  <th className="text-right px-3 py-2">Products</th>
                  <th className="text-right px-3 py-2">Listings</th>
                  <th className="text-right px-3 py-2">Qty</th>
                  <th className="text-right px-3 py-2">Value</th>
                  <th className="text-right px-3 py-2">State</th>
                </tr>
              </thead>
              <tbody>
                {lotRows.map((row) => (
                  <tr key={row.lotId} className={`border-t border-border/40 ${selectedLotRow?.lotId === row.lotId ? "bg-primary-50/20" : ""}`}>
                    <td className="px-3 py-2 font-bold text-amber-700">{row.lotId}</td>
                    <td className="px-3 py-2 font-semibold">{row.lotName}</td>
                    <td className="px-3 py-2">{eventTitle}</td>
                    <td className="px-3 py-2">{row.lotType}</td>
                    <td className="px-3 py-2 text-right font-semibold">{row.products}</td>
                    <td className="px-3 py-2 text-right font-semibold">{row.listingsCount}</td>
                    <td className="px-3 py-2 text-right font-semibold">{row.qty.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-semibold">THB {row.valueTHB.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right"><span className="px-2 py-0.5 rounded-full bg-yellow-50 text-amber-700 font-semibold">{row.state}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {workspaceTab === "product" && (
            <table className="w-full text-xs">
              <thead className="bg-surface-muted/50 text-text-muted uppercase text-[10px]">
                <tr>
                  <th className="text-left px-3 py-2">SKU #</th>
                  <th className="text-left px-3 py-2">Product Name</th>
                  <th className="text-left px-3 py-2">Auction Name</th>
                  <th className="text-left px-3 py-2">Lot #</th>
                  <th className="text-left px-3 py-2">Lot Name</th>
                  <th className="text-left px-3 py-2">Batch Detail</th>
                  <th className="text-left px-3 py-2">Warehouse</th>
                  <th className="text-right px-3 py-2">Unallocated Units</th>
                </tr>
              </thead>
              <tbody>
                {productRows.map((row) => (
                  <tr key={`${row.lotId}-${row.sku}`} className="border-t border-border/40">
                    <td className="px-3 py-2"><span className="px-2 py-1 rounded-lg bg-surface-muted font-bold">{row.sku}</span></td>
                    <td className="px-3 py-2 font-semibold">{row.productName}</td>
                    <td className="px-3 py-2 font-semibold text-amber-700">{selectedAuctionLabel}</td>
                    <td className="px-3 py-2 font-bold">{row.lotId}</td>
                    <td className="px-3 py-2">{row.lotName}</td>
                    <td className="px-3 py-2 font-semibold">{row.batchDetail}</td>
                    <td className="px-3 py-2">{row.warehouse}</td>
                    <td className="px-3 py-2 text-right font-bold">{row.qty.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
