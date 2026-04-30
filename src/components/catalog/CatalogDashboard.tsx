"use client";

import { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Globe,
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
  catalogTemplates,
  catalogEvents,
  catalogEligibleProducts,
  CATALOG_PIPELINE_STAGES,
} from "@/lib/catalog-data";
import CatalogAISetup from "./CatalogAISetup";

export default function CatalogDashboard() {
  const [showAISetup, setShowAISetup] = useState(false);

  if (showAISetup) {
    return (
      <CatalogAISetup
        onBack={() => setShowAISetup(false)}
        onComplete={() => setShowAISetup(false)}
      />
    );
  }

  const activeTemplates = catalogTemplates.filter((t) => t.status === "active");
  const publishedEvents = catalogEvents.filter((e) => e.stage === "published");
  const stagedEvents = catalogEvents.filter((e) => e.stage === "staged");
  const pipelineInProgress = catalogEvents.filter(
    (e) => !["published", "staged"].includes(e.stage)
  ).length;
  const totalViewers = activeTemplates.reduce((s, t) => s + t.activeViewers, 0);
  const pipelineValue = catalogEvents.reduce((s, e) => s + e.estimatedValue, 0);

  return (
    <div className="space-y-5">
      {/* Lily catalog orchestrator widget */}
      <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-xl border border-primary/10 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text-primary">
                Lily — Catalog Orchestrator
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-[10px] text-accent-green font-medium">
                  Pipeline active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-text-primary mb-1">
                Automated Catalog Pipeline Active
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {activeTemplates.length} catalog templates running. Lily organizes,
                prices, restricts access, and publishes catalogs automatically.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowAISetup(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={12} /> New AI Setup
                </button>
                <button className="px-4 py-2 border border-border rounded-lg text-xs text-text-primary hover:bg-surface-muted transition-colors">
                  View pipeline
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 shrink-0 w-[260px]">
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    Published
                  </span>
                </div>
                <p className="text-lg font-bold text-accent-green">
                  {publishedEvents.length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar size={10} className="text-accent-blue" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    Staged
                  </span>
                </div>
                <p className="text-lg font-bold text-accent-blue">
                  {stagedEvents.length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users size={10} className="text-accent-orange" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    Viewers
                  </span>
                </div>
                <p className="text-lg font-bold text-accent-orange">{totalViewers}</p>
              </div>
              <div className="bg-white rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={10} className="text-primary" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    Value
                  </span>
                </div>
                <p className="text-lg font-bold text-primary">
                  ${(pipelineValue / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Catalog Templates
            </span>
          </div>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            Manage all <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {catalogTemplates.map((tpl) => {
            const tplEvents = catalogEvents.filter(
              (e) => e.templateId === tpl.id
            );
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
                    <h4 className="text-sm font-semibold text-text-primary truncate pr-2">
                      {tpl.name}
                    </h4>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        isActive
                          ? "bg-green-50 text-accent-green"
                          : tpl.status === "paused"
                          ? "bg-orange-50 text-accent-orange"
                          : "bg-gray-100 text-text-muted"
                      }`}
                    >
                      {isActive
                        ? "Active"
                        : tpl.status === "paused"
                        ? "Paused"
                        : "Draft"}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mb-3">
                    {tpl.pricingModel.replace("-", " ")} · {tpl.accessLevel.toLowerCase()} ·{" "}
                    {tpl.validityDays}d
                  </p>
                  <div className="space-y-1.5 text-[11px] text-text-muted">
                    <div className="flex items-center justify-between">
                      <span>Pricing</span>
                      <span className="font-medium text-text-secondary">
                        {tpl.pricingModel.replace("-", " ")}{" "}
                        <span className="text-primary text-[9px]">AI</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Refresh</span>
                      <span className="font-medium text-text-secondary">
                        {tpl.refreshCadence.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Access</span>
                      <span className="font-medium text-text-secondary">
                        {tpl.countryRestrictions.length > 0
                          ? `${tpl.countryRestrictions.length} countries`
                          : "Global"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  {tplEvents.length > 0 ? (
                    <span className="text-[10px] text-primary font-medium">
                      {tplEvents.length} editions in pipeline
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-muted">No editions</span>
                  )}
                  <button className="text-[10px] text-primary font-medium hover:underline">
                    Configure
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catalog Events table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">
              Catalog Editions
            </h3>
            <div className="flex items-center gap-2 ml-2">
              {[
                {
                  label: "Published",
                  count: publishedEvents.length,
                  dot: "bg-accent-green animate-pulse",
                  text: "text-accent-green",
                },
                {
                  label: "Staged",
                  count: stagedEvents.length,
                  dot: "bg-accent-blue",
                  text: "text-accent-blue",
                },
                {
                  label: "In Progress",
                  count: pipelineInProgress,
                  dot: "bg-accent-orange",
                  text: "text-accent-orange",
                },
              ].map((s) => (
                <span
                  key={s.label}
                  className={`flex items-center gap-1 text-[10px] font-medium ${s.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.count} {s.label}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-text-muted bg-surface-muted px-2 py-1 rounded-md">
            {catalogEvents.length} total
          </span>
        </div>

        <div className="grid grid-cols-12 gap-3 px-5 py-2 bg-surface-muted/50 border-b border-border/60 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
          <div className="col-span-4">Catalog</div>
          <div className="col-span-1 text-center">Products</div>
          <div className="col-span-1 text-center">Categories</div>
          <div className="col-span-2 text-center">Value</div>
          <div className="col-span-1 text-center">Buyers</div>
          <div className="col-span-1 text-center">Stage</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-border/40">
          {catalogEvents.map((event) => {
            const stageInfo = CATALOG_PIPELINE_STAGES.find(
              (s) => s.key === event.stage
            );
            return (
              <div key={event.id}>
                <div
                  className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors hover:bg-surface-muted/20 ${
                    event.stage === "published"
                      ? "border-l-[3px] border-l-accent-green"
                      : ""
                  }`}
                >
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                      <BookOpen size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            event.stage === "published"
                              ? "bg-green-50 text-accent-green"
                              : event.stage === "staged"
                              ? "bg-blue-50 text-accent-blue"
                              : "bg-orange-50 text-accent-orange"
                          }`}
                        >
                          {event.stage === "published" && "● "}
                          {stageInfo?.label}
                        </span>
                        {!event.requiresApproval && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-primary font-medium">
                            Auto
                          </span>
                        )}
                        <span className="text-[9px] text-text-muted">
                          {event.templateName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-xs font-semibold">
                      {event.productsIncluded}
                    </p>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-xs font-medium text-text-secondary">
                      {event.categoriesCovered}
                    </p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-xs font-semibold">
                      ${event.estimatedValue.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-text-muted">est. value</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-xs font-medium text-text-secondary">
                      {event.buyersNotified}
                    </p>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-lg font-medium ${
                        event.stage === "published"
                          ? "bg-green-50 text-accent-green"
                          : event.stage === "staged"
                          ? "bg-blue-50 text-accent-blue"
                          : event.requiresApproval
                          ? "bg-orange-50 text-accent-orange"
                          : "bg-gray-100 text-text-secondary"
                      }`}
                    >
                      {stageInfo?.label}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {event.stage === "published" ? (
                      <button className="flex items-center gap-1.5 text-[10px] font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">
                        <Eye size={10} /> View catalog
                      </button>
                    ) : event.requiresApproval ? (
                      <button className="flex items-center gap-1.5 text-[10px] font-medium border border-accent-orange/30 text-accent-orange px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                        Review
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 text-[10px] font-medium border border-border text-text-secondary px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors">
                        <Eye size={10} /> Preview
                      </button>
                    )}
                  </div>
                </div>
                {event.stage === "published" && (
                  <div className="px-5 py-2 bg-green-50/30 border-t border-green-100/60 flex items-center gap-5 border-l-[3px] border-l-accent-green">
                    <span className="text-[10px] text-accent-green font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      Live to buyers
                    </span>
                    <span className="text-[10px] text-text-muted">
                      Expires{" "}
                      {event.expiresAt
                        ? new Date(event.expiresAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {event.buyersNotified} buyers notified
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {event.productsIncluded} products listed
                    </span>
                  </div>
                )}
              </div>
            );
          })}
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
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden divide-y divide-border/40">
          {catalogEvents.map((ce) => {
            const stageInfo = CATALOG_PIPELINE_STAGES.find(
              (s) => s.key === ce.stage
            );
            return (
              <div
                key={ce.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-surface-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      ce.stage === "published"
                        ? "bg-green-50"
                        : ce.stage === "staged"
                        ? "bg-blue-50"
                        : ce.requiresApproval
                        ? "bg-orange-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ce.stage === "published"
                          ? "bg-accent-green animate-pulse"
                          : ce.stage === "staged"
                          ? "bg-accent-blue"
                          : ce.requiresApproval
                          ? "bg-accent-orange"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-primary">
                      {ce.title}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {ce.autoActions[ce.autoActions.length - 1]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="bg-surface-muted px-1.5 py-0.5 rounded">
                      {ce.productsIncluded} products
                    </span>
                    <span className="bg-surface-muted px-1.5 py-0.5 rounded">
                      {ce.categoriesCovered} categories
                    </span>
                    <span className="font-medium text-text-secondary">
                      ${ce.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-lg font-medium ${
                      ce.stage === "published"
                        ? "bg-green-50 text-accent-green"
                        : ce.stage === "staged"
                        ? "bg-blue-50 text-accent-blue"
                        : ce.requiresApproval
                        ? "bg-orange-50 text-accent-orange"
                        : "bg-gray-100 text-text-secondary"
                    }`}
                  >
                    {ce.stage === "published" && "● "}
                    {stageInfo?.label}
                    {ce.requiresApproval && " · Review"}
                  </span>
                  <ChevronRight size={12} className="text-text-muted" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catalog-eligible inventory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-accent-green" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Catalog-Eligible Inventory
            </span>
          </div>
          <span className="text-[10px] text-text-muted bg-surface-muted px-2 py-1 rounded-md">
            {catalogEligibleProducts.length} SKUs detected by Lily
          </span>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-muted/50 border-b border-border">
                <th className="px-4 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">
                  SKU
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">
                  Product
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">
                  Condition
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">
                  Qty
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">
                  Value
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {catalogEligibleProducts.slice(0, 6).map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/30 hover:bg-surface-muted/20 transition-colors"
                >
                  <td className="px-4 py-2.5 text-xs font-mono text-primary">
                    {item.sku}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-text-primary max-w-[200px] truncate">
                    {item.product}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.condition === "Overstock"
                          ? "bg-orange-50 text-accent-orange"
                          : item.condition === "Packaging Change"
                          ? "bg-blue-50 text-accent-blue"
                          : item.condition === "Discontinued"
                          ? "bg-gray-100 text-text-secondary"
                          : "bg-red-50 text-accent-red"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-medium">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-medium">
                    ${item.totalValue.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.catalogScore >= 85
                              ? "bg-accent-green"
                              : item.catalogScore >= 75
                              ? "bg-accent-blue"
                              : "bg-accent-orange"
                          }`}
                          style={{ width: `${item.catalogScore}%` }}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-bold ${
                          item.catalogScore >= 85
                            ? "text-accent-green"
                            : item.catalogScore >= 75
                            ? "text-accent-blue"
                            : "text-accent-orange"
                        }`}
                      >
                        {item.catalogScore}
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
