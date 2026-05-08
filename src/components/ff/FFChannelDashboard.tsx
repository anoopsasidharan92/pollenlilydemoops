"use client";

import { useState } from "react";
import {
  Shield,
  ShoppingBag,
  Settings,
  Tag,
  Users,
  Lock,
  Mail,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Eye,
  Sparkles,
  Globe,
  MapPin,
  Calendar,
  Hash,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { ffListings, ffAccessConfig } from "@/lib/ff-data";
import type { FFListing } from "@/lib/ff-data";

type FFView = "inventory" | "access";

export default function FFChannelDashboard() {
  const USD_TO_MYR = 4.7;
  const formatMYR = (value: number) =>
    `RM ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value * USD_TO_MYR)}`;

  const [activeView, setActiveView] = useState<FFView>("inventory");
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedSKUs, setSelectedSKUs] = useState<string[]>([]);

  const totalAllocated = ffListings.reduce((s, l) => s + l.allocatedQty, 0);
  const totalSold = ffListings.reduce((s, l) => s + l.soldQty, 0);
  const totalRevenue = ffListings.reduce((s, l) => s + l.soldQty * l.ffPrice, 0);
  const liveCount = ffListings.filter((l) => l.status === "Live").length;
  const soldOutCount = ffListings.filter((l) => l.status === "Sold Out").length;

  const toggleSKU = (id: string) => {
    setSelectedSKUs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeView === "inventory"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surface-muted"
            }`}
          >
            <Tag size={13} /> Inventory & Pricing
          </button>
          <button
            onClick={() => setActiveView("access")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeView === "access"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surface-muted"
            }`}
          >
            <Shield size={13} /> Access Controls
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/ff-shop"
            className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary-50/50 transition-colors"
          >
            <Eye size={12} /> Preview F&F Shop <ExternalLink size={10} />
          </a>
          <button
            onClick={() => setShowAllocationModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Sparkles size={12} /> Push SKUs to F&F
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Allocated SKUs", value: ffListings.length, color: "text-primary", bg: "bg-primary-lighter", icon: Package },
          { label: "Units Allocated", value: totalAllocated.toLocaleString(), color: "text-accent-blue", bg: "bg-blue-50", icon: Hash },
          { label: "Units Sold", value: totalSold.toLocaleString(), color: "text-accent-green", bg: "bg-green-50", icon: ShoppingBag },
          { label: "Revenue Recovered", value: `RM ${((totalRevenue * USD_TO_MYR) / 1000).toFixed(1)}K`, color: "text-accent-green", bg: "bg-green-50", icon: DollarSign },
          { label: "Live / Sold Out", value: `${liveCount} / ${soldOutCount}`, color: "text-accent-orange", bg: "bg-orange-50", icon: Tag },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-3">
            <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon size={14} className={stat.color} />
            </div>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {activeView === "inventory" && (
        <InventoryView
          listings={ffListings}
          selectedSKUs={selectedSKUs}
          toggleSKU={toggleSKU}
          formatMYR={formatMYR}
        />
      )}

      {activeView === "access" && <AccessControlsView />}

      {showAllocationModal && (
        <AllocationModal onClose={() => setShowAllocationModal(false)} />
      )}
    </div>
  );
}

function InventoryView({
  listings,
  selectedSKUs,
  toggleSKU,
  formatMYR,
}: {
  listings: FFListing[];
  selectedSKUs: string[];
  toggleSKU: (id: string) => void;
  formatMYR: (value: number) => string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">F&F Inventory Allocation & Pricing</h3>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-green" /> Live
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-red" /> Sold Out
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-orange" /> Upcoming
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-muted/50">
              <th className="px-4 py-2.5 w-10">
                <input type="checkbox" className="rounded accent-primary" />
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">SKU</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Brand</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Allocated</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Sold</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Retail</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">F&F Disc.</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">F&F Price</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Max / Buyer</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Channel</th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => {
              const sellPct = item.allocatedQty > 0 ? (item.soldQty / item.allocatedQty) * 100 : 0;
              return (
                <tr
                  key={item.id}
                  className={`border-b border-border/30 hover:bg-surface-muted/30 transition-colors ${
                    selectedSKUs.includes(item.id) ? "bg-primary-50/30" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedSKUs.includes(item.id)}
                      onChange={() => toggleSKU(item.id)}
                      className="rounded accent-primary"
                    />
                  </td>
                  <td className="px-3 py-2 text-xs font-mono text-primary">{item.sku}</td>
                  <td className="px-3 py-2 text-xs text-text-primary max-w-[180px] truncate">{item.product}</td>
                  <td className="px-3 py-2 text-xs text-text-secondary">{item.brand}</td>
                  <td className="px-3 py-2 text-xs font-medium">{item.allocatedQty.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{item.soldQty.toLocaleString()}</span>
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${sellPct >= 90 ? "bg-accent-green" : sellPct >= 60 ? "bg-accent-blue" : "bg-accent-orange"}`}
                          style={{ width: `${Math.min(sellPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-text-muted line-through">{formatMYR(item.retailPrice)}</td>
                  <td className="px-3 py-2">
                    <span className="text-xs font-medium text-accent-green">-{item.ffDiscount}%</span>
                  </td>
                  <td className="px-3 py-2 text-xs font-bold text-primary">{formatMYR(item.ffPrice)}</td>
                  <td className="px-3 py-2 text-xs font-medium">{item.maxPerBuyer}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.channel === "Both" ? "bg-primary-lighter text-primary" :
                      item.channel === "Online" ? "bg-blue-50 text-accent-blue" :
                      "bg-orange-50 text-accent-orange"
                    }`}>
                      {item.channel}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.status === "Live" ? "bg-green-50 text-accent-green" :
                      item.status === "Sold Out" ? "bg-red-50 text-accent-red" :
                      item.status === "Upcoming" ? "bg-orange-50 text-accent-orange" :
                      "bg-blue-50 text-accent-blue"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccessControlsView() {
  const USD_TO_MYR = 4.7;
  const formatMYR = (value: number) =>
    `RM ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value * USD_TO_MYR)}`;

  const config = ffAccessConfig;
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [bazaarEnabled, setBazaarEnabled] = useState(config.bazaarEnabled);
  const [authMethod, setAuthMethod] = useState<"SSO" | "Email Domain" | "Invite Code">(config.authMethod);
  const [domains, setDomains] = useState(config.allowedDomains);
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [spendingCap, setSpendingCap] = useState(config.spendingCap);
  const [maxItems, setMaxItems] = useState(config.maxItemsPerOrder);
  const [skuLimits, setSkuLimits] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    ffListings.forEach((l) => { map[l.sku] = l.maxPerBuyer; });
    return map;
  });
  const [showSkuLimits, setShowSkuLimits] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addDomain = () => {
    const d = newDomain.trim().replace(/^@/, "");
    if (d && !domains.includes(d)) {
      setDomains([...domains, d]);
    }
    setNewDomain("");
    setShowDomainInput(false);
  };

  const removeDomain = (d: string) => {
    setDomains(domains.filter((x) => x !== d));
  };

  const updateSkuLimit = (sku: string, delta: number) => {
    setSkuLimits((prev) => ({
      ...prev,
      [sku]: Math.max(1, Math.min(20, (prev[sku] || 1) + delta)),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Save bar */}
      <div className="flex items-center justify-end gap-2">
        {saved && (
          <span className="text-xs text-accent-green font-medium flex items-center gap-1 animate-fade-in">
            <CheckCircle2 size={12} /> Saved
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 text-xs font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Sparkles size={12} /> Save Controls
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={16} className="text-primary" />
            <h3 className="text-sm font-semibold">Authentication & Access</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-primary" />
                <div>
                  <p className="text-xs font-medium">SSO Login Required</p>
                  <p className="text-[10px] text-text-muted">Employees authenticate via corporate SSO</p>
                </div>
              </div>
              <button onClick={() => setSsoEnabled(!ssoEnabled)}>
                {ssoEnabled ? (
                  <ToggleRight size={24} className="text-accent-green" />
                ) : (
                  <ToggleLeft size={24} className="text-text-muted" />
                )}
              </button>
            </div>

            <div className="p-3 bg-surface-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-primary" />
                <p className="text-xs font-medium">Allowed Email Domains</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {domains.map((d) => (
                  <span key={d} className="text-[11px] bg-primary-lighter text-primary px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    @{d}
                    <button onClick={() => removeDomain(d)} className="hover:text-accent-red transition-colors ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {showDomainInput ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-text-muted">@</span>
                    <input
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addDomain()}
                      placeholder="company.com"
                      autoFocus
                      className="text-[11px] px-2 py-1 rounded-lg border border-primary/30 outline-none focus:border-primary w-28"
                    />
                    <button onClick={addDomain} className="text-[11px] text-primary font-medium hover:underline">Add</button>
                    <button onClick={() => { setShowDomainInput(false); setNewDomain(""); }} className="text-[11px] text-text-muted hover:text-text-secondary">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDomainInput(true)}
                    className="text-[11px] border border-dashed border-primary/30 text-primary px-2.5 py-1 rounded-full hover:bg-primary-50/50"
                  >
                    + Add domain
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-surface-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-primary" />
                <p className="text-xs font-medium">Invite Method</p>
              </div>
              <div className="flex gap-2">
                {(["SSO", "Email Domain", "Invite Code"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setAuthMethod(method)}
                    className={`text-[11px] px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                      authMethod === method
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-text-secondary hover:bg-surface-muted"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Settings size={16} className="text-primary" />
            <h3 className="text-sm font-semibold">Purchase Controls</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-surface-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-accent-green" />
                  <p className="text-xs font-medium">Per-Buyer Spending Cap</p>
                </div>
                <span className="text-sm font-bold text-accent-green">{formatMYR(spendingCap)}</span>
              </div>
              <p className="text-[10px] text-text-muted ml-6">Maximum total spend per employee across the event</p>
              <div className="mt-2 ml-6">
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={spendingCap}
                  onChange={(e) => setSpendingCap(Number(e.target.value))}
                  className="w-full accent-[#10B981] h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-text-muted mt-1">
                  <span>RM 235</span>
                  <span>RM 1,175</span>
                  <span>RM 2,350</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-accent-blue" />
                  <p className="text-xs font-medium">Max Items per Order</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMaxItems(Math.max(1, maxItems - 1))}
                    className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center text-text-secondary hover:bg-surface-muted transition-colors"
                  >
                    <span className="text-sm font-medium leading-none">−</span>
                  </button>
                  <span className="text-sm font-bold text-accent-blue w-6 text-center">{maxItems}</span>
                  <button
                    onClick={() => setMaxItems(Math.min(50, maxItems + 1))}
                    className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center text-text-secondary hover:bg-surface-muted transition-colors"
                  >
                    <span className="text-sm font-medium leading-none">+</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-text-muted ml-6">Limit per checkout to ensure fair access</p>
            </div>

            <div className="p-3 bg-surface-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-accent-orange" />
                  <p className="text-xs font-medium">SKU-Level Quantity Limits</p>
                </div>
                <button
                  onClick={() => setShowSkuLimits(!showSkuLimits)}
                  className="text-[10px] bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full font-medium hover:bg-accent-green/20 transition-colors cursor-pointer"
                >
                  {showSkuLimits ? "Collapse" : "Configure"}
                </button>
              </div>
              <p className="text-[10px] text-text-muted ml-6 mb-2">Set max buy quantity per buyer for each SKU</p>
              {showSkuLimits && (
                <div className="ml-6 space-y-1.5 mt-2 border-t border-border/50 pt-2">
                  {ffListings.map((l) => (
                    <div key={l.sku} className="flex items-center justify-between py-1">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-primary">{l.sku}</span>
                        <span className="text-[10px] text-text-muted ml-2 truncate">{l.product.split(" ").slice(0, 4).join(" ")}…</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => updateSkuLimit(l.sku, -1)}
                          className="w-5 h-5 rounded bg-white border border-border flex items-center justify-center text-text-muted hover:bg-surface-muted text-[10px]"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-accent-orange">{skuLimits[l.sku]}</span>
                        <button
                          onClick={() => updateSkuLimit(l.sku, 1)}
                          className="w-5 h-5 rounded bg-white border border-border flex items-center justify-center text-text-muted hover:bg-surface-muted text-[10px]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-accent-orange/5 border border-accent-orange/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-accent-orange" />
                <p className="text-xs font-medium text-accent-orange">Anti-Abuse Protection</p>
              </div>
              <p className="text-[10px] text-text-secondary mt-1 ml-6">
                All purchases are traceable by buyer ID. Grey-market leakage detection and fraudulent return prevention are active.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <h3 className="text-sm font-semibold">Event Schedule</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-muted rounded-lg">
              <p className="text-[10px] text-text-muted mb-1">Online Store Opens</p>
              <p className="text-xs font-semibold">{config.eventStartDate}</p>
            </div>
            <div className="p-3 bg-surface-muted rounded-lg">
              <p className="text-[10px] text-text-muted mb-1">Event Closes</p>
              <p className="text-xs font-semibold">{config.eventEndDate}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent-green/5 border border-accent-green/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-accent-green" />
              <div>
                <p className="text-xs font-medium text-accent-green">Online Store</p>
                <p className="text-[10px] text-text-muted">ff-shop.loreal.pollen.com</p>
              </div>
            </div>
            <span className="text-[10px] bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full font-medium">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-accent-orange" />
              <h3 className="text-sm font-semibold">Offline Bazaar</h3>
            </div>
            <button onClick={() => setBazaarEnabled(!bazaarEnabled)}>
              {bazaarEnabled ? (
                <ToggleRight size={24} className="text-accent-green" />
              ) : (
                <ToggleLeft size={24} className="text-text-muted" />
              )}
            </button>
          </div>
          <div className="p-3 bg-surface-muted rounded-lg">
            <p className="text-[10px] text-text-muted mb-1">Location</p>
            <p className="text-xs font-medium">{config.bazaarLocation}</p>
          </div>
          <div className="p-3 bg-surface-muted rounded-lg">
            <p className="text-[10px] text-text-muted mb-1">Bazaar Dates</p>
            <div className="flex gap-2">
              {config.bazaarDates.map((d) => (
                <span key={d} className="text-[11px] bg-accent-orange/10 text-accent-orange px-2.5 py-1 rounded-full font-medium">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <CheckCircle2 size={12} className="text-accent-green" />
            <span>POS terminals synced to unified stock pool</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllocationModal({ onClose }: { onClose: () => void }) {
  const USD_TO_MYR = 4.7;
  const formatMYR = (value: number) =>
    `RM ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value * USD_TO_MYR)}`;

  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["LOR-SHP-001", "GAR-MSK-003", "MAY-FND-004"]);
  const [discount, setDiscount] = useState("55");
  const [isAllocating, setIsAllocating] = useState(false);

  const handleAllocate = () => {
    setIsAllocating(true);
    setTimeout(() => {
      setIsAllocating(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Push SKUs to Employee F&F Channel
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= s ? "bg-primary text-white" : "bg-gray-100 text-text-muted"
                }`}>
                  {step > s ? <CheckCircle2 size={12} /> : s}
                </div>
                <span className={`text-[10px] ${step >= s ? "text-text-primary font-medium" : "text-text-muted"}`}>
                  {s === 1 ? "Select SKUs" : s === 2 ? "Set Pricing" : "Confirm"}
                </span>
                {s < 3 && <ChevronRight size={12} className="text-text-muted mx-1" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">Select SKUs from Product Master to allocate to the F&F channel:</p>
              {["LOR-SHP-001", "LOR-SER-002", "GAR-MSK-003", "MAY-FND-004", "NYX-LIP-007"].map((sku) => (
                <label key={sku} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(sku)}
                    onChange={() => setSelectedProducts((prev) =>
                      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
                    )}
                    className="rounded accent-primary"
                  />
                  <span className="text-xs font-mono text-primary">{sku}</span>
                </label>
              ))}
              <button
                onClick={() => setStep(2)}
                className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-3 hover:bg-primary-dark transition-colors"
              >
                Next: Set Pricing
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">Set F&F discount for {selectedProducts.length} selected SKUs:</p>
              <div className="p-3 bg-surface-muted rounded-lg">
                <label className="text-xs font-medium mb-2 block">F&F Discount %</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-lg font-bold text-primary w-14 text-right">{discount}%</span>
                </div>
                <p className="text-[10px] text-text-muted mt-1">Off retail price. Recommended: 50-60% for F&F events.</p>
              </div>
              <div className="p-3 bg-accent-green/5 border border-accent-green/20 rounded-lg">
                <p className="text-xs text-accent-green font-medium">Preview: A {formatMYR(10)} retail item {"->"} {formatMYR(10 * (1 - Number(discount) / 100))} F&F price</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAllocate}
                  disabled={isAllocating}
                  className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  {isAllocating ? (
                    <>
                      <Sparkles size={14} className="animate-pulse" /> Allocating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Allocate to F&F
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} className="text-accent-green" />
              </div>
              <p className="text-sm font-semibold text-accent-green">SKUs allocated to F&F channel!</p>
              <p className="text-xs text-text-secondary">
                {selectedProducts.length} SKUs pushed with {discount}% F&F discount. They are now live in the Employee F&F Shop.
              </p>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
