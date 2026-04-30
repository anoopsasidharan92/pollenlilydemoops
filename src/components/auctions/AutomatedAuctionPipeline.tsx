"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Gavel,
  Eye,
  Zap,
  Settings,
  ChevronDown,
  AlertTriangle,
  Package,
  Layers,
  Radio,
  Calendar,
  Globe,
  Lock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  assignmentTemplates,
  allocationStrategies,
  pipelineEvents,
  PIPELINE_STAGES,
  type AssignmentTemplate,
  type PipelineEvent,
  type PipelineStage,
  type AllocationStrategy,
} from "@/lib/auction-data";

interface Props {
  onBack: () => void;
  onMonitorBids: () => void;
}

type PipelineView = "overview" | "templates" | "event-detail";

export default function AutomatedAuctionPipeline({ onBack, onMonitorBids }: Props) {
  const [view, setView] = useState<PipelineView>("overview");
  const [selectedEvent, setSelectedEvent] = useState<PipelineEvent | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const getStageIndex = (stage: PipelineStage) =>
    PIPELINE_STAGES.findIndex((s) => s.key === stage);

  const getStageColor = (stage: PipelineStage) =>
    PIPELINE_STAGES.find((s) => s.key === stage)?.color || "bg-gray-400";

  const eventsForTemplate = (templateId: string) =>
    pipelineEvents.filter((e) => e.templateId === templateId);

  const liveCount = pipelineEvents.filter((e) => e.stage === "live").length;
  const scheduledCount = pipelineEvents.filter((e) => e.stage === "scheduled").length;
  const inProgressCount = pipelineEvents.filter((e) =>
    !["live", "scheduled"].includes(e.stage)
  ).length;

  if (view === "event-detail" && selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        template={assignmentTemplates.find((t) => t.id === selectedEvent.templateId)!}
        onBack={() => { setView("overview"); setSelectedEvent(null); }}
        onMonitorBids={onMonitorBids}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors mb-1"
          >
            <ArrowLeft size={12} /> Back to Auctions
          </button>
          <h1 className="text-xl font-semibold text-text-primary">Automated Pipeline</h1>
        </div>
        <div className="flex items-center gap-2">
          {(["overview", "templates"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                view === tab
                  ? "bg-primary text-white border-primary"
                  : "border-border text-text-secondary hover:bg-surface-muted"
              }`}
            >
              {tab === "overview" ? "Live Pipeline" : "Assignment Templates"}
            </button>
          ))}
        </div>
      </div>

      {/* Lily status widget */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
            Li
          </div>
          <span className="text-sm font-semibold">Lily — Pipeline Orchestrator</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-accent-green font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              {liveCount} Live
            </span>
            <span className="flex items-center gap-1.5 text-accent-blue font-medium">
              <Calendar size={13} /> {scheduledCount} Scheduled
            </span>
            <span className="flex items-center gap-1.5 text-accent-orange font-medium">
              <Zap size={13} /> {inProgressCount} In Pipeline
            </span>
          </div>
          <span className="text-sm text-text-muted">
            ${(pipelineEvents.reduce((s, e) => s + e.estimatedValue, 0) / 1000).toFixed(1)}K total pipeline value
          </span>
        </div>
      </div>

      {view === "overview" && (
        <PipelineOverview
          events={pipelineEvents}
          templates={assignmentTemplates}
          getStageIndex={getStageIndex}
          getStageColor={getStageColor}
          onSelectEvent={(e) => { setSelectedEvent(e); setView("event-detail"); }}
          onMonitorBids={onMonitorBids}
        />
      )}

      {view === "templates" && (
        <TemplatesView
          templates={assignmentTemplates}
          strategies={allocationStrategies}
          expandedTemplate={expandedTemplate}
          setExpandedTemplate={setExpandedTemplate}
          eventsForTemplate={eventsForTemplate}
        />
      )}
    </div>
  );
}

function PipelineOverview({
  events,
  templates,
  getStageIndex,
  getStageColor,
  onSelectEvent,
  onMonitorBids,
}: {
  events: PipelineEvent[];
  templates: AssignmentTemplate[];
  getStageIndex: (s: PipelineStage) => number;
  getStageColor: (s: PipelineStage) => string;
  onSelectEvent: (e: PipelineEvent) => void;
  onMonitorBids: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Pipeline stage visualization */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 block">
          Pipeline Stages
        </span>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-1">
            {PIPELINE_STAGES.map((stage, i) => {
              const count = events.filter((e) => e.stage === stage.key).length;
              return (
                <div key={stage.key} className="flex items-center flex-1">
                  <div className="flex-1 text-center">
                    <div className={`w-full h-2 rounded-full ${count > 0 ? stage.color : "bg-gray-100"}`} />
                    <p className="text-xs font-medium mt-2">{stage.label}</p>
                    <p className={`text-lg font-bold ${count > 0 ? "text-text-primary" : "text-text-muted"}`}>
                      {count}
                    </p>
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <ArrowRight size={12} className="text-text-muted mx-1 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event list */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 block">
          Pipeline Events
        </span>
        <div className="space-y-3">
          {events
            .sort((a, b) => getStageIndex(b.stage) - getStageIndex(a.stage))
            .map((event) => {
              const stageIdx = getStageIndex(event.stage);
              const template = templates.find((t) => t.id === event.templateId);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: template?.brandColor || "#6B3FA0" }}
                        >
                          {template?.brandName[0] || "?"}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">{event.title}</h4>
                          <p className="text-xs text-text-muted mt-0.5">
                            Template: {event.templateName} · Triggered {timeAgo(event.triggeredAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                            event.stage === "live"
                              ? "bg-green-50 text-accent-green"
                              : event.stage === "scheduled"
                              ? "bg-blue-50 text-accent-blue"
                              : event.requiresApproval
                              ? "bg-orange-50 text-accent-orange"
                              : "bg-gray-100 text-text-secondary"
                          }`}
                        >
                          {event.stage === "live" && "● "}
                          {PIPELINE_STAGES.find((s) => s.key === event.stage)?.label}
                          {event.requiresApproval && " · Needs Review"}
                        </span>
                        {event.stage === "live" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMonitorBids(); }}
                            className="flex items-center gap-1.5 text-xs font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            <Eye size={11} /> Monitor
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {PIPELINE_STAGES.map((stage, i) => (
                        <div
                          key={stage.key}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= stageIdx ? getStageColor(event.stage) : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-5 text-xs text-text-muted">
                      <span>{event.productsMatched} products</span>
                      <span>{event.lotsFormed} lots</span>
                      <span>{event.buyersMatched} buyers</span>
                      <span>${event.estimatedValue.toLocaleString()}</span>
                      <span>{event.autoActions.length} auto-actions</span>
                    </div>
                  </div>

                  <div className="border-t border-border px-5 py-2.5 bg-surface-muted/30">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Sparkles size={11} className="text-primary shrink-0" />
                      {event.autoActions[event.autoActions.length - 1]}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function TemplatesView({
  templates,
  strategies,
  expandedTemplate,
  setExpandedTemplate,
  eventsForTemplate,
}: {
  templates: AssignmentTemplate[];
  strategies: AllocationStrategy[];
  expandedTemplate: string | null;
  setExpandedTemplate: (id: string | null) => void;
  eventsForTemplate: (id: string) => PipelineEvent[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1 block">
          Step 1
        </span>
        <p className="text-sm text-text-secondary">
          Assignment templates define the auction structure <strong>before products are assigned</strong>.
          Products fill in from Product Master as they become eligible.
        </p>
      </div>

      {/* Template cards — Automation Hub style */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Templates
          </span>
          <span className="text-xs text-text-muted">
            {templates.filter((t) => t.status === "active").length} active
          </span>
        </div>

        <div className="space-y-3">
          {templates.map((tpl) => {
            const strategy = strategies.find((s) => s.id === tpl.allocationStrategyId);
            const events = eventsForTemplate(tpl.id);
            const isExpanded = expandedTemplate === tpl.id;
            return (
              <div key={tpl.id} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedTemplate(isExpanded ? null : tpl.id)}
                  className="w-full text-left p-5 flex items-center justify-between hover:bg-surface-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: tpl.brandColor }}
                    >
                      {tpl.brandName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold">{tpl.name}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            tpl.status === "active"
                              ? "bg-green-50 text-accent-green"
                              : tpl.status === "paused"
                              ? "bg-orange-50 text-accent-orange"
                              : "bg-gray-100 text-text-muted"
                          }`}
                        >
                          {tpl.status === "active" ? "Active" : tpl.status === "paused" ? "Paused" : "Draft"}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">
                        {tpl.auctionType} auction · {tpl.buyerAccess} · {tpl.durationHours}h duration ·{" "}
                        {tpl.scheduleCadence.replace("-", " ")} · {tpl.totalEventsGenerated} events generated
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-5 space-y-5 animate-fade-in">
                    {/* AI-decided parameters with manual override */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                          AI-Decided Parameters
                        </span>
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <Sparkles size={10} className="text-primary" /> Parameters set by Lily · manual override available
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {/* Reserve Pricing */}
                        <div className="bg-surface-muted/50 rounded-xl p-4">
                          <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-2">
                            Reserve Pricing
                          </p>
                          <p className="text-sm font-semibold text-text-primary mb-1 capitalize">{tpl.reserveStrategy}</p>
                          <p className="text-xs text-text-muted mb-3">Based on avg channel prices</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                              <Sparkles size={9} /> AI-set
                            </span>
                            <button className="text-[10px] text-text-muted hover:text-primary transition-colors">
                              Override
                            </button>
                          </div>
                        </div>

                        {/* Bidding Strategy */}
                        <div className="bg-surface-muted/50 rounded-xl p-4">
                          <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-2">
                            Bidding Strategy
                          </p>
                          <p className="text-sm font-semibold text-text-primary mb-1">{tpl.auctionType}</p>
                          <p className="text-xs text-text-muted mb-3">{tpl.durationHours}h, {tpl.minLots}–{tpl.maxLots} lots</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                              <Sparkles size={9} /> AI-set
                            </span>
                            <button className="text-[10px] text-text-muted hover:text-primary transition-colors">
                              Override
                            </button>
                          </div>
                        </div>

                        {/* Frequency */}
                        <div className="bg-surface-muted/50 rounded-xl p-4">
                          <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-2">
                            Frequency
                          </p>
                          <p className="text-sm font-semibold text-text-primary mb-1 capitalize">{tpl.scheduleCadence.replace("-", " ")}</p>
                          <p className="text-xs text-text-muted mb-3">
                            {tpl.totalEventsGenerated} events generated
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                              <Sparkles size={9} /> AI-set
                            </span>
                            <button className="text-[10px] text-text-muted hover:text-primary transition-colors">
                              Override
                            </button>
                          </div>
                        </div>

                        {/* Eligible Customers */}
                        <div className="bg-surface-muted/50 rounded-xl p-4">
                          <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-2">
                            Eligible Customers
                          </p>
                          <p className="text-sm font-semibold text-text-primary mb-1">{tpl.buyerAccess}</p>
                          <p className="text-xs text-text-muted mb-3">{tpl.buyerTierRules.length} tier rules active</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                              <Sparkles size={9} /> AI-set
                            </span>
                            <button className="text-[10px] text-text-muted hover:text-primary transition-colors">
                              Override
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detail rows */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-muted/50 rounded-xl p-4">
                        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-3">
                          Buyer Tier Rules
                        </p>
                        <div className="space-y-2">
                          {tpl.buyerTierRules.map((rule) => (
                            <div key={rule} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 size={12} className="text-accent-green shrink-0" />
                              <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-border">
                                {rule}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-surface-muted/50 rounded-xl p-4">
                        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-3">
                          Template Status
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-text-muted">Auto-Publish</span>
                            <span className={`font-medium ${tpl.autoPublish ? "text-accent-green" : "text-accent-orange"}`}>
                              {tpl.autoPublish ? "Yes" : "Manual Review"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-muted">Last Triggered</span>
                            <span className="font-medium">
                              {tpl.lastTriggered
                                ? new Date(tpl.lastTriggered).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                : "Never"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-muted">Created</span>
                            <span className="font-medium">
                              {new Date(tpl.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-2.5 bg-primary-50/40 rounded-lg">
                          <p className="text-xs text-primary">
                            <Sparkles size={11} className="inline mr-1" />
                            Empty container — products fill in from dynamic allocation
                          </p>
                        </div>
                      </div>
                    </div>

                    {events.length > 0 && (
                      <div>
                        <span className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-2 block">
                          Active Pipeline Events ({events.length})
                        </span>
                        <div className="space-y-2">
                          {events.map((ev) => (
                            <div
                              key={ev.id}
                              className="flex items-center justify-between bg-white border border-border rounded-lg px-4 py-3"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  ev.stage === "live" ? "bg-accent-green animate-pulse" :
                                  ev.stage === "scheduled" ? "bg-accent-blue" : "bg-accent-orange"
                                }`} />
                                <span className="text-sm">{ev.title}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-text-muted">
                                <span>{ev.productsMatched} products</span>
                                <span>{ev.lotsFormed} lots</span>
                                <span className={`px-2 py-0.5 rounded-full font-medium ${
                                  ev.stage === "live" ? "bg-green-50 text-accent-green" :
                                  ev.stage === "scheduled" ? "bg-blue-50 text-accent-blue" :
                                  "bg-gray-100 text-text-secondary"
                                }`}>
                                  {PIPELINE_STAGES.find((s) => s.key === ev.stage)?.label}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EventDetail({
  event,
  template,
  onBack,
  onMonitorBids,
}: {
  event: PipelineEvent;
  template: AssignmentTemplate;
  onBack: () => void;
  onMonitorBids: () => void;
}) {
  const stageIdx = PIPELINE_STAGES.findIndex((s) => s.key === event.stage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors mb-1"
          >
            <ArrowLeft size={12} /> Back to Pipeline
          </button>
          <h1 className="text-xl font-semibold text-text-primary">Event Detail</h1>
        </div>
        {event.stage === "live" && (
          <button
            onClick={onMonitorBids}
            className="flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Eye size={14} /> Monitor Bids
          </button>
        )}
      </div>

      {/* Event header card */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: template.brandColor }}
          >
            {template.brandName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-semibold">{event.title}</h2>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                  event.stage === "live"
                    ? "bg-green-50 text-accent-green"
                    : event.stage === "scheduled"
                    ? "bg-blue-50 text-accent-blue"
                    : "bg-orange-50 text-accent-orange"
                }`}
              >
                {event.stage === "live" && "● "}
                {PIPELINE_STAGES.find((s) => s.key === event.stage)?.label}
              </span>
            </div>
            <p className="text-xs text-text-muted">Triggered by: {event.triggeredBy}</p>
          </div>
        </div>

        {/* Pipeline progress */}
        <div className="flex items-center gap-1">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.key} className="flex items-center flex-1">
              <div className="flex-1">
                <div className={`h-2.5 rounded-full ${
                  i <= stageIdx ? stage.color : "bg-gray-100"
                } transition-all`} />
                <p className={`text-[10px] mt-1.5 text-center ${
                  i <= stageIdx ? "text-text-primary font-medium" : "text-text-muted"
                }`}>
                  {stage.label}
                </p>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <ArrowRight size={10} className="text-text-muted mx-0.5 shrink-0 mt-[-10px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Automated Actions */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 block">
            Automated Actions
          </span>
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            {event.autoActions.map((action, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {i < event.autoActions.length - 1 || !event.requiresApproval ? (
                  <CheckCircle2 size={14} className="text-accent-green shrink-0 mt-0.5" />
                ) : (
                  <Clock size={14} className="text-accent-orange shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-text-secondary leading-relaxed">{action}</p>
              </div>
            ))}

            {event.requiresApproval && (
              <div className="mt-4 p-4 bg-orange-50/50 border border-accent-orange/20 rounded-xl">
                <p className="text-sm font-medium text-accent-orange flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={14} /> Manual review required
                </p>
                <p className="text-xs text-text-muted mb-3">
                  This template requires approval before buyer matching proceeds.
                </p>
                <button className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  Approve & Continue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Event config + summary */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 block">
              Event Configuration
            </span>
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Template</span>
                  <span className="font-medium">{template.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Auction Type</span>
                  <span className="font-medium">{template.auctionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Cadence</span>
                  <span className="font-medium capitalize">{template.scheduleCadence.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Buyer Access</span>
                  <span className="font-medium">{template.buyerAccess}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Products</span>
                  <span className="font-medium">{event.productsMatched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Lots</span>
                  <span className="font-medium">{event.lotsFormed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Buyers Matched</span>
                  <span className="font-medium">{event.buyersMatched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Est. Value</span>
                  <span className="font-medium text-primary">${event.estimatedValue.toLocaleString()}</span>
                </div>
                {event.scheduledStart && (
                  <div className="flex justify-between col-span-2">
                    <span className="text-text-muted">Scheduled</span>
                    <span className="font-medium">
                      {new Date(event.scheduledStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" "}→{" "}
                      {new Date(event.scheduledEnd!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-primary/20 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-lighter flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary mb-1">No manual steps performed</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This event was fully orchestrated by Lily using the
                  <strong> {template.name}</strong> template. Eligible products were bundled into {event.lotsFormed} lots,
                  priced automatically,
                  {event.buyersMatched > 0 && ` matched to ${event.buyersMatched} qualified buyers,`}
                  {" "}and {event.stage === "live" ? "auto-published" : "staged for review"}.
                  Product eligibility is managed at the Product Master level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
