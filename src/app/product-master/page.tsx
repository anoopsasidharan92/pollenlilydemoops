"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import { listings } from "@/lib/demo-data";
import {
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Package,
  Tag,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export default function ProductMaster() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = listings.filter(
    (l) =>
      l.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredListings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredListings.map((l) => l.id));
    }
  };

  const startOnboarding = () => {
    setIsOnboarding(true);
    setOnboardingStep(0);
    const steps = [1, 2, 3, 4];
    steps.forEach((step, i) => {
      setTimeout(() => setOnboardingStep(step), (i + 1) * 1500);
    });
  };

  const onboardingSteps = [
    { label: "Validating product data", icon: Package },
    { label: "Categorizing by condition & shelf life", icon: Tag },
    { label: "Setting optimal PSI pricing", icon: DollarSign },
    { label: "Flagging near-expiry items", icon: AlertTriangle },
  ];

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-[1200px]">
        <LilyChat />

        {isOnboarding && onboardingStep < 4 && (
          <div className="bg-primary-50/40 border border-primary/20 rounded-xl p-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-primary">Lily is making your inventory sales-ready...</h3>
            </div>
            <div className="space-y-3">
              {onboardingSteps.map((step, i) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    i <= onboardingStep ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {i < onboardingStep ? (
                    <CheckCircle2 size={18} className="text-accent-green" />
                  ) : i === onboardingStep ? (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm ${i < onboardingStep ? "text-accent-green" : i === onboardingStep ? "text-primary font-medium" : "text-text-muted"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOnboarding && onboardingStep >= 4 && (
          <div className="bg-green-50/40 border border-accent-green/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={20} className="text-accent-green" />
            <div className="flex-1">
              <p className="text-sm font-medium text-accent-green">All 19 products are now sales-ready!</p>
              <p className="text-xs text-text-secondary">PSI pricing applied, categories assigned, near-expiry items flagged.</p>
            </div>
            <a
              href="/channels"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors"
            >
              Go to Channels <ArrowRight size={12} />
            </a>
          </div>
        )}

        <div className="bg-white rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Product Master</h2>
              <p className="text-xs text-text-muted mt-0.5">
                {listings.length} products · Total value: ${listings.reduce((s, l) => s + l.totalValue, 0).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isOnboarding && (
                <button
                  onClick={startOnboarding}
                  className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors"
                >
                  <Sparkles size={12} /> Run Onboarding
                </button>
              )}
            </div>
          </div>

          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU, product, brand..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <button className="flex items-center gap-1 text-xs text-text-secondary border border-border px-3 py-2 rounded-lg hover:bg-surface-muted transition-colors">
              <Filter size={12} /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-muted text-left">
                  <th className="px-4 py-2.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredListings.length && filteredListings.length > 0}
                      onChange={selectAll}
                      className="rounded accent-primary"
                    />
                  </th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">SKU</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">Product</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">Brand</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">Category</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">Qty</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">PSI Price</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">Condition</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className={`border-b border-border/50 hover:bg-surface-muted/50 transition-colors ${
                      selectedItems.includes(listing.id) ? "bg-primary-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                        className="rounded accent-primary"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-text-secondary">{listing.sku}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-text-primary max-w-[250px] truncate">{listing.product}</td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary">{listing.brand}</td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary">{listing.category}</td>
                    <td className="px-4 py-2.5 text-xs text-text-primary font-medium">{listing.quantity.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-xs text-text-primary font-medium">${listing.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        listing.condition === "Near Expiry" ? "bg-red-50 text-accent-red" :
                        listing.condition === "Overstock" ? "bg-orange-50 text-accent-orange" :
                        listing.condition === "Discontinued" ? "bg-gray-100 text-text-secondary" :
                        "bg-blue-50 text-accent-blue"
                      }`}>
                        {listing.condition}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        listing.status === "Active" ? "bg-green-50 text-accent-green" :
                        listing.status === "Draft" ? "bg-gray-100 text-text-secondary" :
                        "bg-red-50 text-accent-red"
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
