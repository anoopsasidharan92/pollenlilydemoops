"use client";

import { useState } from "react";
import {
  Sparkles,
  Gavel,
  Clock,
  Radio,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
  Zap,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  existingAuctionEvents,
  auctionOpportunities,
  pipelineEvents,
  assignmentTemplates,
  completedAuctions,
  type CompletedAuction,
} from "@/lib/auction-data";
import AuctionWorkflow from "./AuctionWorkflow";
import BidMonitor from "./BidMonitor";
import AutomatedAuctionPipeline from "./AutomatedAuctionPipeline";
import AuctionAISetup from "./AuctionAISetup";
import AuctionReview from "./AuctionReview";

export default function AuctionDashboard() {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showBidMonitor, setShowBidMonitor] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showAISetup, setShowAISetup] = useState(false);
  const [reviewAuction, setReviewAuction] = useState<CompletedAuction | null>(null);

  if (reviewAuction) {
    return (
      <AuctionReview
        auction={reviewAuction}
        onBack={() => setReviewAuction(null)}
      />
    );
  }

  if (showAISetup) {
    return (
      <AuctionAISetup
        onBack={() => setShowAISetup(false)}
        onComplete={() => setShowAISetup(false)}
      />
    );
  }

  if (showPipeline) {
    return (
      <AutomatedAuctionPipeline
        onBack={() => setShowPipeline(false)}
        onMonitorBids={() => { setShowPipeline(false); setShowBidMonitor(true); }}
      />
    );
  }

  if (showWorkflow) {
    return <AuctionWorkflow onBack={() => setShowWorkflow(false)} />;
  }

  if (showBidMonitor) {
    return <BidMonitor onBack={() => setShowBidMonitor(false)} />;
  }

  const liveEvents = existingAuctionEvents.filter((e) => e.status === "Live");
  const scheduledEvents = existingAuctionEvents.filter((e) => e.status === "Scheduled");
  const pipelineInProgress = pipelineEvents.filter((e) => !["live", "scheduled"].includes(e.stage)).length;
  const activeTemplateCount = assignmentTemplates.filter((t) => t.status === "active").length;

  const pipelineValue = pipelineEvents.reduce((s, e) => s + e.estimatedValue, 0);

  return (
    <div className="space-y-5">
      {/* Lily auction orchestrator widget */}
      <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-xl border border-primary/10 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text-primary">Lily — Auction Orchestrator</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-[10px] text-accent-green font-medium">Pipeline active</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPipeline(true)}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            Full screen <ChevronRight size={12} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-start gap-6">
            {/* Left: status summary */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-text-primary mb-1">Automated Auction Pipeline Active</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {activeTemplateCount} assignment templates running. Lily bundles, prices, matches buyers, and publishes events automatically.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowAISetup(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={12} /> New AI Setup
                </button>
                <button
                  onClick={() => setShowPipeline(true)}
                  className="px-4 py-2 border border-border rounded-lg text-xs text-text-primary hover:bg-surface-muted transition-colors"
                >
                  View pipeline
                </button>
                <button
                  onClick={() => setShowWorkflow(true)}
                  className="px-4 py-2 border border-border rounded-lg text-xs text-text-primary hover:bg-surface-muted transition-colors"
                >
                  Manual setup
                </button>
                {liveEvents.length > 0 && (
                  <button
                    onClick={() => setShowBidMonitor(true)}
                    className="px-4 py-2 border border-accent-green/30 text-accent-green rounded-lg text-xs font-medium hover:bg-green-50 transition-colors flex items-center gap-1.5"
                  >
                    <Radio size={12} /> Monitor bids
                  </button>
                )}
              </div>
            </div>

            {/* Right: live stats grid */}
            <div className="grid grid-cols-2 gap-2 shrink-0 w-[260px]">
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">Live</span>
                </div>
                <p className="text-lg font-bold text-accent-green">{liveEvents.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar size={10} className="text-accent-blue" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">Scheduled</span>
                </div>
                <p className="text-lg font-bold text-accent-blue">{scheduledEvents.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={10} className="text-accent-orange" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">In Pipeline</span>
                </div>
                <p className="text-lg font-bold text-accent-orange">{pipelineInProgress}</p>
              </div>
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={10} className="text-primary" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">Value</span>
                </div>
                <p className="text-lg font-bold text-primary">${(pipelineValue / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Assignment Templates
            </span>
          </div>
          <button
            onClick={() => setShowPipeline(true)}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            Manage all <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {assignmentTemplates.map((tpl) => {
            const tplEvents = pipelineEvents.filter((e) => e.templateId === tpl.id);
            const isActive = tpl.status === "active";
            return (
              <div
                key={tpl.id}
                className={`bg-white rounded-xl border p-4 flex flex-col justify-between transition-colors hover:border-primary/20 ${
                  isActive ? "border-border" : "border-border/60 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-text-primary">{tpl.name}</h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                      isActive ? "bg-green-50 text-accent-green" :
                      tpl.status === "paused" ? "bg-orange-50 text-accent-orange" :
                      "bg-gray-100 text-text-muted"
                    }`}>
                      {isActive ? "Active" : tpl.status === "paused" ? "Paused" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mb-3">
                    {tpl.auctionType} · {tpl.buyerAccess.toLowerCase()} · {tpl.durationHours}h
                  </p>
                  <div className="space-y-1.5 text-[11px] text-text-muted">
                    <div className="flex items-center justify-between">
                      <span>Reserve</span>
                      <span className="font-medium text-text-secondary">{tpl.reserveStrategy} <span className="text-primary text-[9px]">AI</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cadence</span>
                      <span className="font-medium text-text-secondary">{tpl.scheduleCadence.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Buyer tiers</span>
                      <span className="font-medium text-text-secondary">{tpl.buyerTierRules.length} rules</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  {tplEvents.length > 0 ? (
                    <span className="text-[10px] text-primary font-medium">{tplEvents.length} events in pipeline</span>
                  ) : (
                    <span className="text-[10px] text-text-muted">No events</span>
                  )}
                  <button
                    onClick={() => setShowPipeline(true)}
                    className="text-[10px] text-primary font-medium hover:underline"
                  >
                    Configure
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auction Events table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gavel size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">Auction Events</h3>
            <div className="flex items-center gap-2 ml-2">
              {[
                { label: "Live", count: liveEvents.length, dot: "bg-accent-green animate-pulse", text: "text-accent-green" },
                { label: "Scheduled", count: scheduledEvents.length, dot: "bg-accent-blue", text: "text-accent-blue" },
                { label: "Completed", count: completedAuctions.length, dot: "bg-gray-300", text: "text-text-muted" },
              ].map((s) => (
                <span key={s.label} className={`flex items-center gap-1 text-[10px] font-medium ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.count} {s.label}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-text-muted bg-surface-muted px-2 py-1 rounded-md">
            {existingAuctionEvents.length + completedAuctions.length} total
          </span>
        </div>

        <div className="grid grid-cols-12 gap-3 px-5 py-2 bg-surface-muted/50 border-b border-border/60 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
          <div className="col-span-4">Auction</div>
          <div className="col-span-1 text-center">Lots</div>
          <div className="col-span-1 text-center">Units</div>
          <div className="col-span-2 text-center">Value</div>
          <div className="col-span-1 text-center">Buyers</div>
          <div className="col-span-1 text-center">Type</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-border/40">
          {existingAuctionEvents.map((event) => (
            <div key={event.id}>
              <div className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors hover:bg-surface-muted/20 ${
                event.status === "Live" ? "border-l-[3px] border-l-accent-green" : ""
              }`}>
                <div className="col-span-4 flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                    style={{ backgroundColor: event.brandColor }}
                  >
                    {event.sellerLogo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{event.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        event.status === "Live" ? "bg-green-50 text-accent-green" : "bg-blue-50 text-accent-blue"
                      }`}>
                        {event.status === "Live" && "● "}{event.status}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-primary font-medium">Auto</span>
                      <span className="text-[9px] text-text-muted">{event.buyerAccess}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-xs font-semibold">{event.totalLots}</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-xs font-medium text-text-secondary">{event.totalUnits.toLocaleString()}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-xs font-semibold">${(event.totalStartValue / 1000).toFixed(1)}K</p>
                  <p className="text-[9px] text-text-muted">start value</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-xs font-medium text-text-secondary">{event.invitedBuyers.length}</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[10px] text-text-muted">{event.auctionType}</p>
                </div>
                <div className="col-span-2 flex justify-end">
                  {event.status === "Live" ? (
                    <button
                      onClick={() => setShowBidMonitor(true)}
                      className="flex items-center gap-1.5 text-[10px] font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Radio size={10} /> Monitor
                    </button>
                  ) : (
                    <button className="flex items-center gap-1.5 text-[10px] font-medium border border-border text-text-secondary px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors">
                      <Eye size={10} /> Preview
                    </button>
                  )}
                </div>
              </div>
              {event.status === "Live" && (
                <div className="px-5 py-2 bg-green-50/30 border-t border-green-100/60 flex items-center gap-5 border-l-[3px] border-l-accent-green">
                  <span className="text-[10px] text-accent-green font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    Bidding active
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Ends {new Date(event.endTime).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-[10px] text-text-muted">12 bids</span>
                  <span className="text-[10px] text-text-muted">{event.totalLots}/{event.totalLots} lots with bids</span>
                </div>
              )}
            </div>
          ))}

          {completedAuctions.length > 0 && (
            <div className="px-5 py-1.5 bg-surface-muted/40 flex items-center gap-2">
              <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest">Completed</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>
          )}

          {completedAuctions.map((ca) => (
            <div
              key={ca.id}
              className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors hover:bg-surface-muted/20 cursor-pointer"
              onClick={() => setReviewAuction(ca)}
            >
              <div className="col-span-4 flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0 opacity-70"
                  style={{ backgroundColor: ca.brandColor }}
                >
                  {ca.sellerLogo}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{ca.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-gray-100 text-text-muted">Ended</span>
                    <span className="text-[9px] text-text-muted">
                      {new Date(ca.endTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className="text-[9px] text-text-muted">{ca.buyerAccess}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-xs font-semibold">{ca.totalLots}</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-xs font-medium text-text-secondary">{ca.totalUnits.toLocaleString()}</p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-xs font-semibold text-accent-green">${ca.totalFinalValue.toLocaleString()}</p>
                <p className="text-[9px] text-accent-green font-medium">{ca.overallRecoveryRate}% recovery</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-xs font-medium text-text-secondary">{ca.activeBidders}/{ca.invitedBuyers}</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-[10px] text-text-muted">{ca.auctionType}</p>
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={(e) => { e.stopPropagation(); setReviewAuction(ca); }}
                  className="flex items-center gap-1.5 text-[10px] font-medium border border-border text-text-secondary px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors"
                >
                  <Eye size={10} /> Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent-orange" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Pipeline Activity
            </span>
          </div>
          <button
            onClick={() => setShowPipeline(true)}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            View full pipeline <ArrowRight size={12} />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden divide-y divide-border/40">
          {pipelineEvents.slice(0, 4).map((pe) => (
            <div
              key={pe.id}
              className="px-4 py-3 flex items-center justify-between hover:bg-surface-muted/30 transition-colors cursor-pointer"
              onClick={() => setShowPipeline(true)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  pe.stage === "live" ? "bg-green-50" :
                  pe.stage === "scheduled" ? "bg-blue-50" :
                  pe.requiresApproval ? "bg-orange-50" : "bg-gray-50"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    pe.stage === "live" ? "bg-accent-green animate-pulse" :
                    pe.stage === "scheduled" ? "bg-accent-blue" :
                    pe.requiresApproval ? "bg-accent-orange" : "bg-gray-300"
                  }`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-primary">{pe.title}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {pe.autoActions[pe.autoActions.length - 1]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <span className="bg-surface-muted px-1.5 py-0.5 rounded">{pe.productsMatched} products</span>
                  <span className="bg-surface-muted px-1.5 py-0.5 rounded">{pe.lotsFormed} lots</span>
                  <span className="font-medium text-text-secondary">${pe.estimatedValue.toLocaleString()}</span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${
                  pe.stage === "live" ? "bg-green-50 text-accent-green" :
                  pe.stage === "scheduled" ? "bg-blue-50 text-accent-blue" :
                  pe.requiresApproval ? "bg-orange-50 text-accent-orange" :
                  "bg-gray-100 text-text-secondary"
                }`}>
                  {pe.stage === "live" && "● "}
                  {pe.stage.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  {pe.requiresApproval && " · Review"}
                </span>
                <ChevronRight size={12} className="text-text-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auction-eligible inventory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-accent-green" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Auction-Eligible Inventory
            </span>
          </div>
          <span className="text-[10px] text-text-muted bg-surface-muted px-2 py-1 rounded-md">
            {auctionOpportunities.length} SKUs detected by Lily
          </span>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-muted/50 border-b border-border">
                <th className="px-4 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">SKU</th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Condition</th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Qty</th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Value</th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {auctionOpportunities.slice(0, 6).map((item) => (
                <tr key={item.id} className="border-b border-border/30 hover:bg-surface-muted/20 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-mono text-primary">{item.sku}</td>
                  <td className="px-3 py-2.5 text-xs text-text-primary max-w-[200px] truncate">{item.product}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.condition === "Near Expiry" ? "bg-red-50 text-accent-red" :
                      item.condition === "Discontinued" ? "bg-gray-100 text-text-secondary" :
                      "bg-orange-50 text-accent-orange"
                    }`}>
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-medium">{item.quantity.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-xs font-medium">${item.totalValue.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.auctionScore >= 90 ? "bg-accent-green" :
                            item.auctionScore >= 80 ? "bg-accent-blue" :
                            "bg-accent-orange"
                          }`}
                          style={{ width: `${item.auctionScore}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        item.auctionScore >= 90 ? "text-accent-green" :
                        item.auctionScore >= 80 ? "text-accent-blue" :
                        "text-accent-orange"
                      }`}>
                        {item.auctionScore}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
