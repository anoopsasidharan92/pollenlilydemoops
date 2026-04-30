"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import AuctionDashboard from "@/components/auctions/AuctionDashboard";
import CatalogDashboard from "@/components/catalog/CatalogDashboard";
import FFChannelDashboard from "@/components/ff/FFChannelDashboard";
import { listings } from "@/lib/demo-data";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Store,
  BookOpen,
  Gavel,
  Users,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Download,
  FileText,
  Eye,
  MoreHorizontal,
  Activity,
} from "lucide-react";

const channelTabs = [
  { name: "All Channels", icon: Grid3X3, count: 19, active: true },
  { name: "Marketplace", icon: Store, count: 11, active: false },
  { name: "Catalogs", icon: BookOpen, count: 3, active: false },
  { name: "Auctions", icon: Gavel, count: 2, active: false },
  { name: "Employee F&F", icon: Users, count: 3, active: false },
  { name: "Consumer Store", icon: ShoppingBag, count: 0, upgrade: true },
];

type ViewTab = "Overview" | "Execute" | "Analyze";
type StatusFilter = "All" | "Active" | "Draft" | "Expired";

export default function Channels() {
  const [activeChannel, setActiveChannel] = useState("All Channels");
  const [activeView, setActiveView] = useState<ViewTab>("Execute");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutomationHub, setShowAutomationHub] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [expandedChannel, setExpandedChannel] = useState<string | null>("Marketplace");

  const filteredListings = listings.filter((l) => {
    const channelMatch = activeChannel === "All Channels" || l.channel === activeChannel;
    const statusMatch = statusFilter === "All" || l.status === statusFilter;
    const searchMatch =
      !searchQuery ||
      l.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return channelMatch && statusMatch && searchMatch;
  });

  const groupedByChannel: Record<string, typeof listings> = {};
  filteredListings.forEach((l) => {
    if (!groupedByChannel[l.channel]) groupedByChannel[l.channel] = [];
    groupedByChannel[l.channel].push(l);
  });

  const statusCounts = {
    All: listings.filter((l) => activeChannel === "All Channels" || l.channel === activeChannel).length,
    Active: listings.filter((l) => l.status === "Active" && (activeChannel === "All Channels" || l.channel === activeChannel)).length,
    Draft: listings.filter((l) => l.status === "Draft" && (activeChannel === "All Channels" || l.channel === activeChannel)).length,
    Expired: listings.filter((l) => l.status === "Expired" && (activeChannel === "All Channels" || l.channel === activeChannel)).length,
  };

  const toggleListingSelect = (id: string) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <AppShell>
      <div className="p-6 space-y-4 max-w-[1200px]">
        <LilyChat />

        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded bg-primary-lighter flex items-center justify-center">
              <Sparkles size={12} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-text-primary">Welcome to Channels</span>
          </div>
          <p className="text-xs text-accent-green ml-7 mb-1">
            We have automatically split your inventory across your preferred channels based on the allocation strategy selected at onboarding.
          </p>
          <p className="text-xs text-text-secondary ml-7">
            Update allocation strategy under Workflow Automation, then use the channel tabs to configure catalog, employee store, or marketplace settings.
          </p>
        </div>

        {/* Channel Creation Automations — matching production Automation Hub design */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Automation Hub
            </span>
            <button
              onClick={() => setShowAutomationHub(!showAutomationHub)}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              Manage all <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-border p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">Dynamic Allocation</h4>
                <p className="text-xs text-text-secondary mb-2">Auto-split inventory by sales strategy</p>
                <p className="text-xs text-text-muted">Strategy: Balanced</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-medium text-accent-green">Active</span>
                <button className="text-xs text-primary font-medium hover:underline">Configure</button>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border border-primary/30 p-4 flex flex-col justify-between cursor-pointer hover:bg-primary-50/20 transition-colors"
              onClick={() => setActiveChannel("Catalogs")}
            >
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">Catalog Rules</h4>
                <p className="text-xs text-text-secondary mb-2">Create catalogs using saved settings</p>
                <p className="text-xs text-text-muted">Restrictions: Country, buyer type</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-medium text-accent-green">Active · 3 templates</span>
                <button className="text-xs text-primary font-medium hover:underline">Configure</button>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border border-primary/30 p-4 flex flex-col justify-between cursor-pointer hover:bg-primary-50/20 transition-colors"
              onClick={() => setActiveChannel("Auctions")}
            >
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">Auction Setup</h4>
                <p className="text-xs text-text-secondary mb-2">Create auctions using saved settings</p>
                <p className="text-xs text-text-muted">Settings: Duration, reserve price</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-medium text-accent-green">Active · 3 templates</span>
                <button className="text-xs text-primary font-medium hover:underline">Configure</button>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border border-accent-green/30 p-4 flex flex-col justify-between cursor-pointer hover:bg-green-50/20 transition-colors"
              onClick={() => setActiveChannel("Employee F&F")}
            >
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">Employee F&F Store</h4>
                <p className="text-xs text-text-secondary mb-2">Private channel with SSO access & purchase controls</p>
                <p className="text-xs text-text-muted">Online + Offline bazaar · Unified stock pool</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-medium text-accent-green">Active · 10 SKUs live</span>
                <button className="text-xs text-primary font-medium hover:underline">Configure</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 pt-4 pb-0">
            <div className="flex items-center gap-6 mb-4">
              {(["Overview", "Execute", "Analyze"] as ViewTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`flex items-center gap-1.5 text-sm pb-3 border-b-2 transition-colors ${
                    activeView === tab
                      ? tab === "Execute"
                        ? "border-primary text-primary font-medium"
                        : "border-primary text-primary font-medium"
                      : "border-transparent text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {tab === "Execute" && <Sparkles size={14} />}
                  {tab === "Overview" && <Eye size={14} />}
                  {tab === "Analyze" && <Activity size={14} />}
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex gap-1 overflow-x-auto pb-0">
              {channelTabs.map((ch) => (
                <button
                  key={ch.name}
                  onClick={() => !ch.upgrade && setActiveChannel(ch.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeChannel === ch.name
                      ? "bg-primary text-white"
                      : ch.upgrade
                      ? "bg-surface-muted text-text-muted"
                      : "text-text-secondary hover:bg-surface-muted"
                  }`}
                >
                  <ch.icon size={13} />
                  {ch.name}
                  {ch.upgrade && (
                    <span className="text-[9px] bg-accent-orange text-white px-1.5 py-0.5 rounded-full ml-1">Upgrade</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {activeChannel === "Auctions" ? (
              <AuctionDashboard />
            ) : activeChannel === "Catalogs" ? (
              <CatalogDashboard />
            ) : activeChannel === "Employee F&F" ? (
              <FFChannelDashboard />
            ) : (
            <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
                {activeChannel === "All Channels" ? "ALL CHANNELS" : activeChannel.toUpperCase()}
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Listing ID, SKU, Product, Brand, Cate..."
                    className="pl-9 pr-3 py-1.5 text-xs border border-border rounded-lg outline-none focus:border-primary/40 w-72 transition-colors"
                  />
                </div>
                <button className="flex items-center gap-1 text-xs text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors">
                  <Filter size={12} /> Filter
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {(["All", "Active", "Draft", "Expired"] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-primary-lighter text-primary"
                        : "text-text-muted hover:bg-surface-muted"
                    }`}
                  >
                    {status}
                    <span className={`text-[10px] ${statusFilter === status ? "text-primary" : "text-text-muted"}`}>
                      {statusCounts[status]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {selectedListings.length > 0 && (
                  <span className="text-xs text-text-muted">
                    Select rows in the table to take action
                  </span>
                )}
                <div className="flex items-center gap-1">
                  {selectedListings.length > 0 && (
                    <>
                      <button className="flex items-center gap-1 text-xs text-text-muted px-2 py-1 rounded hover:bg-surface-muted">
                        <ArrowUpRight size={11} /> Publish
                      </button>
                      <button className="flex items-center gap-1 text-xs text-text-muted px-2 py-1 rounded hover:bg-surface-muted">
                        <FileText size={11} /> Draft
                      </button>
                      <button className="flex items-center gap-1 text-xs text-text-muted px-2 py-1 rounded hover:bg-surface-muted">
                        <Download size={11} /> Export
                      </button>
                    </>
                  )}
                </div>
                <button className="text-xs text-accent-green flex items-center gap-1 hover:underline">
                  <Activity size={12} /> Activity Logs & History
                </button>
                <button className="flex items-center gap-1 text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary-50/50 transition-colors">
                  <Sparkles size={12} /> Recommended actions (3)
                </button>
              </div>
            </div>

            {activeChannel === "All Channels" ? (
              <div className="space-y-1">
                {Object.entries(groupedByChannel).map(([channel, items]) => (
                  <div key={channel} className="border border-border/50 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedChannel(expandedChannel === channel ? null : channel)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 bg-surface-muted/50 hover:bg-surface-muted text-left transition-colors"
                    >
                      <ChevronDown
                        size={14}
                        className={`text-text-muted transition-transform ${
                          expandedChannel === channel ? "" : "-rotate-90"
                        }`}
                      />
                      <span className="text-xs font-medium text-text-primary">{channel}</span>
                      <span className="text-[10px] text-text-muted">({items.length} batches)</span>
                    </button>
                    {expandedChannel === channel && (
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white border-t border-border/50">
                            <th className="px-4 py-2 w-10">
                              <input type="checkbox" className="rounded accent-primary" />
                            </th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">Listing ID</th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">Brand</th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">Qty</th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">PSI Price</th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">Value</th>
                            <th className="px-3 py-2 text-[10px] font-semibold text-text-secondary uppercase text-left">Status</th>
                            <th className="px-3 py-2 w-8" />
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr
                              key={item.id}
                              className={`border-t border-border/30 hover:bg-surface-muted/30 transition-colors ${
                                selectedListings.includes(item.id) ? "bg-primary-50/30" : ""
                              }`}
                            >
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={selectedListings.includes(item.id)}
                                  onChange={() => toggleListingSelect(item.id)}
                                  className="rounded accent-primary"
                                />
                              </td>
                              <td className="px-3 py-2 text-xs font-mono text-primary">{item.id}</td>
                              <td className="px-3 py-2 text-xs text-text-primary max-w-[200px] truncate">{item.product}</td>
                              <td className="px-3 py-2 text-xs text-text-secondary">{item.brand}</td>
                              <td className="px-3 py-2 text-xs font-medium">{item.quantity.toLocaleString()}</td>
                              <td className="px-3 py-2 text-xs font-medium">${item.unitPrice.toFixed(2)}</td>
                              <td className="px-3 py-2 text-xs font-medium">${item.totalValue.toLocaleString()}</td>
                              <td className="px-3 py-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  item.status === "Active" ? "bg-green-50 text-accent-green" :
                                  item.status === "Draft" ? "bg-gray-100 text-text-secondary" :
                                  "bg-red-50 text-accent-red"
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <button className="text-text-muted hover:text-text-secondary">
                                  <MoreHorizontal size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-muted/50 border-b border-border">
                    <th className="px-4 py-2.5 w-10">
                      <input type="checkbox" className="rounded accent-primary" />
                    </th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Listing ID</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Brand</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Category</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Qty</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">PSI Price</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Value</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Condition</th>
                    <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((item) => (
                    <tr key={item.id} className="border-b border-border/30 hover:bg-surface-muted/30 transition-colors">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(item.id)}
                          onChange={() => toggleListingSelect(item.id)}
                          className="rounded accent-primary"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs font-mono text-primary">{item.id}</td>
                      <td className="px-3 py-2 text-xs text-text-primary max-w-[200px] truncate">{item.product}</td>
                      <td className="px-3 py-2 text-xs text-text-secondary">{item.brand}</td>
                      <td className="px-3 py-2 text-xs text-text-secondary">{item.category}</td>
                      <td className="px-3 py-2 text-xs font-medium">{item.quantity.toLocaleString()}</td>
                      <td className="px-3 py-2 text-xs font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 text-xs font-medium">${item.totalValue.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.condition === "Near Expiry" ? "bg-red-50 text-accent-red" :
                          item.condition === "Overstock" ? "bg-orange-50 text-accent-orange" :
                          item.condition === "Discontinued" ? "bg-gray-100 text-text-secondary" :
                          "bg-blue-50 text-accent-blue"
                        }`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.status === "Active" ? "bg-green-50 text-accent-green" :
                          item.status === "Draft" ? "bg-gray-100 text-text-secondary" :
                          "bg-red-50 text-accent-red"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
