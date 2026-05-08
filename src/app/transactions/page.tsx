"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import { transactions } from "@/lib/demo-data";
import { ffOrders, ffPosLiveFeed } from "@/lib/ff-data";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Package,
  ArrowRight,
  AlertTriangle,
  Shield,
  FileText,
  Sparkles,
  X,
  Radio,
  Wifi,
  Users,
  Monitor,
  MapPin,
} from "lucide-react";
import type { Transaction } from "@/lib/demo-data";

type TxnStatus = "All" | "Pending" | "Counter Sent" | "Approved" | "Order Created" | "In Transit" | "Delivered" | "Rejected";
type ViewMode = "all" | "ff";

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Clock }> = {
  "Pending": { color: "text-accent-orange", bg: "bg-orange-50", icon: Clock },
  "Counter Sent": { color: "text-accent-blue", bg: "bg-blue-50", icon: ArrowRight },
  "Approved": { color: "text-accent-green", bg: "bg-green-50", icon: CheckCircle2 },
  "Order Created": { color: "text-primary", bg: "bg-primary-lighter", icon: Package },
  "In Transit": { color: "text-accent-blue", bg: "bg-blue-50", icon: Truck },
  "Delivered": { color: "text-accent-green", bg: "bg-green-50", icon: CheckCircle2 },
  "Rejected": { color: "text-accent-red", bg: "bg-red-50", icon: XCircle },
};

const ffStatusConfig: Record<string, { color: string; bg: string }> = {
  "Completed": { color: "text-accent-green", bg: "bg-green-50" },
  "Processing": { color: "text-accent-orange", bg: "bg-orange-50" },
  "Picked Up": { color: "text-accent-blue", bg: "bg-blue-50" },
  "Shipped": { color: "text-primary", bg: "bg-primary-lighter" },
};

export default function Transactions() {
  const USD_TO_MYR = 4.7;
  const formatMYR = (value: number) =>
    `RM ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value * USD_TO_MYR)}`;

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [statusFilter, setStatusFilter] = useState<TxnStatus>("All");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [ffChannelFilter, setFfChannelFilter] = useState<"All" | "Online" | "Bazaar">("All");
  const [showPosLive, setShowPosLive] = useState(false);
  const [liveFeedItems, setLiveFeedItems] = useState(ffPosLiveFeed.slice(0, 3));

  useEffect(() => {
    if (!showPosLive) return;
    const interval = setInterval(() => {
      setLiveFeedItems((prev) => {
        if (prev.length >= ffPosLiveFeed.length) return prev;
        return [...prev, ffPosLiveFeed[prev.length]];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [showPosLive]);

  const filteredTxns = transactions.filter(
    (t) => statusFilter === "All" || t.status === statusFilter
  );

  const filteredFFOrders = ffOrders.filter(
    (o) => ffChannelFilter === "All" || o.channel === ffChannelFilter
  );

  const handleCounter = (txn: Transaction) => {
    setSelectedTxn(txn);
    setCounterPrice((txn.psiPrice * 0.9).toFixed(2));
    setShowCounterModal(true);
  };

  const handleApproval = (txn: Transaction) => {
    setSelectedTxn(txn);
    setShowApprovalFlow(true);
  };

  const ffOnlineOrders = ffOrders.filter((o) => o.channel === "Online").length;
  const ffBazaarOrders = ffOrders.filter((o) => o.channel === "Bazaar").length;
  const ffTotalRevenue = ffOrders.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <AppShell>
      <div className="p-6 space-y-4 max-w-[1200px]">
        <LilyChat />

        {/* View mode toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "all" ? "bg-primary text-white" : "bg-white border border-border text-text-secondary hover:bg-surface-muted"
            }`}
          >
            <Package size={13} /> All Channels
          </button>
          <button
            onClick={() => { setViewMode("ff"); setShowPosLive(true); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "ff" ? "bg-primary text-white" : "bg-white border border-border text-text-secondary hover:bg-surface-muted"
            }`}
          >
            <Users size={13} /> Employee F&F Orders
          </button>
        </div>

        {viewMode === "all" && (
          <>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Pending Offers", value: transactions.filter((t) => t.status === "Pending").length, color: "text-accent-orange", bg: "bg-orange-50" },
                { label: "Active Negotiations", value: transactions.filter((t) => t.status === "Counter Sent").length, color: "text-accent-blue", bg: "bg-blue-50" },
                { label: "Orders In Transit", value: transactions.filter((t) => t.status === "In Transit").length, color: "text-primary", bg: "bg-primary-lighter" },
                { label: "Completed", value: transactions.filter((t) => t.status === "Delivered").length, color: "text-accent-green", bg: "bg-green-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-base font-semibold">Transactions</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      placeholder="Search transactions..."
                      className="pl-9 pr-3 py-1.5 text-xs border border-border rounded-lg outline-none focus:border-primary/40 w-64"
                    />
                  </div>
                  <button className="flex items-center gap-1 text-xs text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface-muted">
                    <Filter size={12} /> Filter
                  </button>
                </div>
              </div>

              <div className="px-4 pt-3 pb-0 flex gap-1 border-b border-border overflow-x-auto">
                {(["All", "Pending", "Counter Sent", "Approved", "Order Created", "In Transit", "Delivered"] as TxnStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                      statusFilter === status
                        ? "border-primary text-primary"
                        : "border-transparent text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {status}
                    <span className="ml-1 text-[10px]">
                      {status === "All"
                        ? transactions.length
                        : transactions.filter((t) => t.status === status).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-muted/50">
                      <th className="px-4 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">TXN ID</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Buyer</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Qty</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Offer</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">PSI Price</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Gap</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Channel</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Status</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((txn) => {
                      const gap = ((txn.psiPrice - txn.offerPrice) / txn.psiPrice * 100).toFixed(0);
                      const config = statusConfig[txn.status];
                      return (
                        <tr key={txn.id} className="border-b border-border/30 hover:bg-surface-muted/30 transition-colors">
                          <td className="px-4 py-2.5 text-xs font-mono text-primary">{txn.id}</td>
                          <td className="px-3 py-2.5 text-xs font-medium text-text-primary">{txn.buyer}</td>
                          <td className="px-3 py-2.5 text-xs text-text-secondary max-w-[180px] truncate">{txn.product}</td>
                          <td className="px-3 py-2.5 text-xs font-medium">{txn.quantity.toLocaleString()}</td>
                          <td className="px-3 py-2.5 text-xs font-medium">{formatMYR(txn.offerPrice)}</td>
                          <td className="px-3 py-2.5 text-xs font-medium">{formatMYR(txn.psiPrice)}</td>
                          <td className="px-3 py-2.5">
                            <span className={`text-xs font-medium ${Number(gap) > 15 ? "text-accent-red" : Number(gap) > 5 ? "text-accent-orange" : "text-accent-green"}`}>
                              {Number(gap) > 0 ? `-${gap}%` : "Match"}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-text-secondary">{txn.channel}</td>
                          <td className="px-3 py-2.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config?.bg || ""} ${config?.color || ""}`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              {txn.status === "Pending" && (
                                <button
                                  onClick={() => handleCounter(txn)}
                                  className="text-[10px] px-2 py-1 bg-primary text-white rounded font-medium hover:bg-primary-dark transition-colors"
                                >
                                  Counter
                                </button>
                              )}
                              {txn.status === "Approved" && (
                                <button
                                  onClick={() => handleApproval(txn)}
                                  className="text-[10px] px-2 py-1 bg-accent-green text-white rounded font-medium hover:opacity-80 transition-colors"
                                >
                                  View Order
                                </button>
                              )}
                              {txn.status === "Order Created" && (
                                <button
                                  onClick={() => handleApproval(txn)}
                                  className="text-[10px] px-2 py-1 bg-primary text-white rounded font-medium hover:bg-primary-dark transition-colors"
                                >
                                  Track
                                </button>
                              )}
                              {txn.status === "Counter Sent" && (
                                <button
                                  onClick={() => handleApproval(txn)}
                                  className="text-[10px] px-2 py-1 border border-primary text-primary rounded font-medium hover:bg-primary-50/50 transition-colors"
                                >
                                  Details
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {viewMode === "ff" && (
          <>
            {/* F&F Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total F&F Orders", value: ffOrders.length, color: "text-primary", bg: "bg-primary-lighter" },
                { label: "Online Orders", value: ffOnlineOrders, color: "text-accent-blue", bg: "bg-blue-50", icon: Monitor },
                { label: "Bazaar Orders", value: ffBazaarOrders, color: "text-accent-orange", bg: "bg-orange-50", icon: MapPin },
                { label: "Total Revenue", value: `RM ${Math.round(ffTotalRevenue * USD_TO_MYR).toLocaleString()}`, color: "text-accent-green", bg: "bg-green-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* POS Live Feed */}
            <div className="bg-white rounded-xl border border-accent-green/30 overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between bg-accent-green/5">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Wifi size={14} className="text-accent-green" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  </div>
                  <h3 className="text-sm font-semibold text-accent-green">Bazaar POS — Live Sync</h3>
                  <span className="text-[10px] bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full font-medium">Real-time</span>
                </div>
                <span className="text-[10px] text-text-muted">Single stock pool · No overselling</span>
              </div>
              <div className="p-4 space-y-2 max-h-56 overflow-y-auto">
                {liveFeedItems.map((evt, i) => (
                  <div
                    key={evt.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      evt.status === "syncing" ? "bg-accent-orange/5 border border-accent-orange/20" : "bg-surface-muted/50"
                    } ${i === liveFeedItems.length - 1 ? "animate-fade-in" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      evt.status === "syncing" ? "bg-accent-orange/10" : "bg-accent-green/10"
                    }`}>
                      {evt.status === "syncing" ? (
                        <Radio size={14} className="text-accent-orange animate-pulse" />
                      ) : (
                        <CheckCircle2 size={14} className="text-accent-green" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-text-primary">{evt.buyer}</span>
                        <span className="text-[10px] text-text-muted">via {evt.terminal}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary truncate">{evt.product} × {evt.qty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-text-primary">{formatMYR(evt.amount)}</p>
                      <p className="text-[10px] text-text-muted">{evt.time}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      evt.status === "syncing" ? "bg-accent-orange/10 text-accent-orange" : "bg-accent-green/10 text-accent-green"
                    }`}>
                      {evt.status === "syncing" ? "Syncing..." : "Synced"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* F&F Consolidated Order Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-base font-semibold">F&F Orders — Consolidated</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-surface-muted rounded-lg p-0.5">
                    {(["All", "Online", "Bazaar"] as const).map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setFfChannelFilter(ch)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          ffChannelFilter === ch
                            ? "bg-white shadow-sm text-primary"
                            : "text-text-muted hover:text-text-secondary"
                        }`}
                      >
                        {ch === "Online" && <Monitor size={10} className="inline mr-1" />}
                        {ch === "Bazaar" && <MapPin size={10} className="inline mr-1" />}
                        {ch}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center gap-1 text-xs text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface-muted">
                    <Filter size={12} /> Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-muted/50">
                      <th className="px-4 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Order ID</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Buyer</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Dept.</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Qty</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Amount</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Channel</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Date/Time</th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFFOrders.map((order) => {
                      const sc = ffStatusConfig[order.status];
                      return (
                        <tr key={order.id} className="border-b border-border/30 hover:bg-surface-muted/30 transition-colors">
                          <td className="px-4 py-2.5 text-xs font-mono text-primary">{order.id}</td>
                          <td className="px-3 py-2.5">
                            <div>
                              <p className="text-xs font-medium text-text-primary">{order.buyer}</p>
                              <p className="text-[10px] text-text-muted">{order.buyerEmail}</p>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-text-secondary">{order.department}</td>
                          <td className="px-3 py-2.5 text-xs text-text-secondary max-w-[160px] truncate">{order.product}</td>
                          <td className="px-3 py-2.5 text-xs font-medium">{order.quantity}</td>
                          <td className="px-3 py-2.5 text-xs font-medium">{formatMYR(order.totalAmount)}</td>
                          <td className="px-3 py-2.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${
                              order.channel === "Online" ? "bg-blue-50 text-accent-blue" : "bg-orange-50 text-accent-orange"
                            }`}>
                              {order.channel === "Online" ? <Monitor size={9} /> : <MapPin size={9} />}
                              {order.channel}
                              {order.posTerminal && <span className="text-[9px] opacity-60 ml-0.5">({order.posTerminal})</span>}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-text-muted">{order.date} {order.time}</td>
                          <td className="px-3 py-2.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sc?.bg || ""} ${sc?.color || ""}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showCounterModal && selectedTxn && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Counter Offer</h3>
              <button onClick={() => setShowCounterModal(false)} className="text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-surface-muted rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Buyer</span>
                  <span className="font-medium">{selectedTxn.buyer}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Product</span>
                  <span className="font-medium truncate max-w-[200px]">{selectedTxn.product}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Buyer Offer</span>
                  <span className="font-medium text-accent-red">{formatMYR(selectedTxn.offerPrice)}/unit</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">PSI Price</span>
                  <span className="font-medium">{formatMYR(selectedTxn.psiPrice)}/unit</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-accent-orange/5 border border-accent-orange/20 rounded-lg p-3">
                <AlertTriangle size={14} className="text-accent-orange shrink-0" />
                <p className="text-[11px] text-text-secondary">
                  Offer is {((selectedTxn.psiPrice - selectedTxn.offerPrice) / selectedTxn.psiPrice * 100).toFixed(0)}% below PSI. Auto-counter rule suggests 10% discount from PSI.
                </p>
              </div>

              <div>
                <label className="text-xs text-text-secondary mb-1 block">Counter Price (per unit)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">RM</span>
                  <input
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> Send Counter
                </button>
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApprovalFlow && selectedTxn && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Order Details — {selectedTxn.id}</h3>
              <button onClick={() => setShowApprovalFlow(false)} className="text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-surface-muted rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Buyer</span>
                  <span className="font-medium">{selectedTxn.buyer}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Product</span>
                  <span className="font-medium truncate max-w-[250px]">{selectedTxn.product}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Agreed Price</span>
                  <span className="font-medium text-accent-green">{formatMYR(selectedTxn.offerPrice)}/unit</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Total Value</span>
                  <span className="font-bold">{formatMYR(selectedTxn.offerPrice * selectedTxn.quantity)}</span>
                </div>
              </div>

              {selectedTxn.approvals && (
                <div>
                  <h4 className="text-xs font-semibold mb-2">Approval Chain</h4>
                  <div className="space-y-2">
                    {selectedTxn.approvals.map((a) => (
                      <div key={a.team} className="flex items-center gap-2 text-xs">
                        {a.approved ? (
                          <CheckCircle2 size={16} className="text-accent-green" />
                        ) : (
                          <Clock size={16} className="text-accent-orange" />
                        )}
                        <span className={a.approved ? "text-text-primary" : "text-text-muted"}>
                          {a.team} team
                        </span>
                        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                          a.approved ? "bg-green-50 text-accent-green" : "bg-orange-50 text-accent-orange"
                        }`}>
                          {a.approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                  <Shield size={12} /> Compliance Checks
                </h4>
                <div className="space-y-1.5">
                  {[
                    "Grey market verification — Passed",
                    "Buyer authorized market check — Passed",
                    "Payment terms verified — Confirmed",
                  ].map((check) => (
                    <div key={check} className="flex items-center gap-2 text-xs text-accent-green">
                      <CheckCircle2 size={12} />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                  <FileText size={12} /> Documents
                </h4>
                <div className="flex gap-2">
                  {["Invoice", "Purchase Order", "Packing List"].map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg cursor-pointer hover:bg-surface-muted transition-colors"
                    >
                      <FileText size={11} className="text-primary" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowApprovalFlow(false)}
                className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
