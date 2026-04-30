"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Gavel,
  Clock,
  DollarSign,
  BarChart3,
  Layers,
  FileText,
  ChevronDown,
  Sparkles,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { type CompletedAuction } from "@/lib/auction-data";

interface Props {
  auction: CompletedAuction;
  onBack: () => void;
}

type ReviewTab = "results" | "audit";

export default function AuctionReview({ auction, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("results");
  const [expandedLot, setExpandedLot] = useState<string | null>(auction.lotResults[0]?.lotId ?? null);

  const reserveMetCount = auction.lotResults.filter((l) => l.reserveMet).length;
  const avgRecovery = auction.overallRecoveryRate;
  const vsMarkdown = avgRecovery - 62;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: auction.brandColor }}
          >
            {auction.sellerLogo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-text-primary">{auction.title}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-text-secondary">
                Ended
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {auction.auctionType} · {auction.buyerAccess} · {auction.templateName} template ·{" "}
              {new Date(auction.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" – "}
              {new Date(auction.endTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-muted transition-colors">
          <Download size={13} /> Export Report
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-6 gap-3">
        {[
          {
            label: "Final Value",
            value: `$${auction.totalFinalValue.toLocaleString()}`,
            sub: `of $${auction.totalRetailValue.toLocaleString()} retail`,
            icon: DollarSign,
            color: "text-accent-green",
          },
          {
            label: "Recovery Rate",
            value: `${avgRecovery}%`,
            sub: `+${vsMarkdown.toFixed(1)}% vs markdown`,
            icon: TrendingUp,
            color: "text-accent-green",
          },
          {
            label: "Lots",
            value: `${auction.totalLots}`,
            sub: `${reserveMetCount}/${auction.totalLots} reserves met`,
            icon: Gavel,
            color: reserveMetCount === auction.totalLots ? "text-accent-green" : "text-accent-orange",
          },
          {
            label: "Units Sold",
            value: auction.totalUnits.toLocaleString(),
            sub: `across ${auction.lotResults.reduce((s, l) => s + l.skuCount, 0)} SKUs`,
            icon: Layers,
            color: "text-primary",
          },
          {
            label: "Bids Placed",
            value: `${auction.totalBidsPlaced}`,
            sub: `${auction.activeBidders} of ${auction.invitedBuyers} bidded`,
            icon: BarChart3,
            color: "text-primary",
          },
          {
            label: "Duration",
            value: `${Math.round((new Date(auction.endTime).getTime() - new Date(auction.startTime).getTime()) / 3600000)}h`,
            sub: `${auction.auctionType} format`,
            icon: Clock,
            color: "text-text-secondary",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} className={stat.color} />
              <span className="text-[11px] text-text-muted uppercase tracking-wide font-medium">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Lily insight */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            Li
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary mb-1">Lily&rsquo;s Post-Auction Analysis</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              This auction achieved a <strong className="text-accent-green">{avgRecovery}% recovery rate</strong>,
              recovering <strong>${auction.totalFinalValue.toLocaleString()}</strong> from
              ${auction.totalRetailValue.toLocaleString()} retail value.
              Compared to the estimated markdown recovery of 62%, this represents an
              <strong className="text-accent-green"> additional ${((auction.totalRetailValue * vsMarkdown) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in
              recovered value. {reserveMetCount < auction.totalLots
                ? `${auction.totalLots - reserveMetCount} lot${auction.totalLots - reserveMetCount > 1 ? "s" : ""} did not meet reserve — consider adjusting reserve strategy for similar product categories in future templates.`
                : "All lots met reserve — pricing strategy was well-calibrated for this product mix."}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {([
          { key: "results" as ReviewTab, label: "Lot Results", icon: Gavel },
          { key: "audit" as ReviewTab, label: "Audit Trail", icon: FileText },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "results" && (
        <div className="space-y-3">
          {auction.lotResults.map((lot) => {
            const isExpanded = expandedLot === lot.lotId;
            return (
              <div key={lot.lotId} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedLot(isExpanded ? null : lot.lotId)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-surface-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      lot.reserveMet ? "bg-green-50 text-accent-green" : "bg-orange-50 text-accent-orange"
                    }`}>
                      {lot.reserveMet ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold">{lot.bundleName}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          lot.reserveMet ? "bg-green-50 text-accent-green" : "bg-orange-50 text-accent-orange"
                        }`}>
                          {lot.reserveMet ? "Reserve Met" : "Below Reserve"}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">
                        {lot.skuCount} SKUs · {lot.totalUnits.toLocaleString()} units · {lot.totalBids} bids
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent-green">${lot.winningBid.toLocaleString()}</p>
                      <p className="text-xs text-text-muted">{lot.recoveryRate}% recovery</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 space-y-4 animate-fade-in">
                    {/* Price breakdown */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-surface-muted/50 rounded-xl p-3.5">
                        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-1">Retail Value</p>
                        <p className="text-lg font-bold text-text-primary">${lot.retailValue.toLocaleString()}</p>
                      </div>
                      <div className="bg-surface-muted/50 rounded-xl p-3.5">
                        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-1">Start Bid</p>
                        <p className="text-lg font-bold text-text-secondary">${lot.startBid.toLocaleString()}</p>
                        <p className="text-xs text-text-muted">{((lot.startBid / lot.retailValue) * 100).toFixed(0)}% of retail</p>
                      </div>
                      <div className="bg-surface-muted/50 rounded-xl p-3.5">
                        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-1">Reserve</p>
                        <p className="text-lg font-bold text-text-secondary">${lot.reserveBid.toLocaleString()}</p>
                        <p className="text-xs text-text-muted">{((lot.reserveBid / lot.retailValue) * 100).toFixed(0)}% of retail</p>
                      </div>
                      <div className={`rounded-xl p-3.5 ${lot.reserveMet ? "bg-green-50/50" : "bg-orange-50/50"}`}>
                        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-1">Winning Bid</p>
                        <p className={`text-lg font-bold ${lot.reserveMet ? "text-accent-green" : "text-accent-orange"}`}>
                          ${lot.winningBid.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-muted">{lot.recoveryRate}% recovery</p>
                      </div>
                    </div>

                    {/* Price progress bar */}
                    <div className="bg-surface-muted/50 rounded-xl p-4">
                      <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-3">Bid Progression</p>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full rounded-full ${lot.reserveMet ? "bg-accent-green" : "bg-accent-orange"}`}
                          style={{ width: `${Math.min((lot.winningBid / lot.retailValue) * 100, 100)}%` }}
                        />
                        <div
                          className="absolute h-full w-0.5 bg-gray-400"
                          style={{ left: `${(lot.startBid / lot.retailValue) * 100}%` }}
                          title="Start bid"
                        />
                        <div
                          className="absolute h-full w-0.5 bg-red-400"
                          style={{ left: `${(lot.reserveBid / lot.retailValue) * 100}%` }}
                          title="Reserve"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-text-muted">
                        <span>$0</span>
                        <span className="text-gray-400">Start: ${lot.startBid.toLocaleString()}</span>
                        <span className="text-red-400">Reserve: ${lot.reserveBid.toLocaleString()}</span>
                        <span>${lot.retailValue.toLocaleString()} retail</span>
                      </div>
                    </div>

                    {/* Winner */}
                    <div className="flex items-center justify-between bg-surface-muted/50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {lot.winnerName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{lot.winnerName}</p>
                          <p className="text-xs text-text-muted">{lot.winnerCompany}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-text-muted">Winner · {lot.totalBids} total bids on lot</span>
                        <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                          View profile <ArrowUpRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {auction.auditTrail.map((entry, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 ${
                    entry.action.includes("Ended") || entry.action.includes("Analysis") ? "bg-accent-green" :
                    entry.action.includes("Reserve") ? "bg-accent-orange" :
                    entry.action.includes("Started") || entry.action.includes("Opened") ? "bg-accent-blue" :
                    "bg-gray-300"
                  }`} />
                  {i < auction.auditTrail.length - 1 && (
                    <div className="w-px h-full bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-text-primary">{entry.action}</p>
                    {entry.action.includes("Auto") && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-primary font-medium flex items-center gap-0.5">
                        <Sparkles size={8} /> Automated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{entry.detail}</p>
                </div>
                <span className="text-[11px] text-text-muted whitespace-nowrap shrink-0">
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
