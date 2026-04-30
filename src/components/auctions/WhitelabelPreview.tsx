"use client";

import {
  Gavel,
  Clock,
  Users,
  Eye,
  EyeOff,
  Shield,
  ArrowUp,
  Globe,
} from "lucide-react";
import type { AuctionBundle } from "@/lib/auction-data";

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

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-secondary mb-2">
        This is how buyers will see your auction event. All branding, lot details, and bidding rules are
        generated from your configuration.
      </p>

      {/* Simulated buyer-facing preview */}
      <div className="border-2 border-border rounded-xl overflow-hidden shadow-sm">
        {/* Preview header */}
        <div className="px-5 py-4 text-white" style={{ backgroundColor: brandColor }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {brandName[0]}
              </div>
              <div>
                <h2 className="text-sm font-bold">{eventTitle}</h2>
                <p className="text-[11px] opacity-80">Hosted by {brandName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                <Shield size={10} /> Verified Seller
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                {buyerAccess === "Invite Only" ? "🔒" : <Globe size={10} />} {buyerAccess}
              </span>
            </div>
          </div>
        </div>

        {/* Auction info bar */}
        <div className="px-5 py-3 bg-surface-muted/50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1"><Gavel size={11} /> {auctionType} Auction</span>
            <span className="flex items-center gap-1"><Clock size={11} /> Opens {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="flex items-center gap-1"><Clock size={11} /> Closes {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {endDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="flex items-center gap-1"><Users size={11} /> {invitedCount} bidders</span>
          </div>
          <span className="text-[10px] bg-blue-50 text-accent-blue px-2 py-1 rounded-full font-medium">
            {bundles.length} Lots
          </span>
        </div>

        {/* Lot cards */}
        <div className="p-4 space-y-3">
          {bundles.map((bundle, i) => {
            const prices = bundlePrices[bundle.id];
            return (
              <div key={bundle.id} className="border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-primary-lighter text-primary px-1.5 py-0.5 rounded font-medium">
                        Lot {i + 1}
                      </span>
                      <h4 className="text-xs font-semibold">{bundle.name}</h4>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {bundle.skus.length} products · {bundle.totalQuantity.toLocaleString()} units total
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Starting Bid</p>
                    <p className="text-base font-bold" style={{ color: brandColor }}>
                      ${prices.start.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] border-t border-border/50 pt-2 mt-2">
                  <span className="flex items-center gap-1 text-text-muted">
                    <ArrowUp size={10} /> Increment: ${prices.increment}
                  </span>
                  <span className="flex items-center gap-1 text-text-muted">
                    {prices.showReserve ? (
                      <><Eye size={10} /> Reserve: ${prices.reserve.toLocaleString()}</>
                    ) : (
                      <><EyeOff size={10} /> Reserve: Hidden</>
                    )}
                  </span>
                  <span className={`flex items-center gap-1 ${
                    bundle.riskScore === "High" ? "text-accent-red" : bundle.riskScore === "Medium" ? "text-accent-orange" : "text-accent-green"
                  }`}>
                    {bundle.riskScore === "High" ? "⚡" : bundle.riskScore === "Medium" ? "●" : "✓"} {bundle.riskScore} Priority
                  </span>
                </div>

                <div className="mt-2">
                  <button
                    className="w-full py-2 rounded-lg text-xs font-medium text-white transition-colors"
                    style={{ backgroundColor: brandColor }}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-surface-muted/30 border-t border-border text-center">
          <p className="text-[10px] text-text-muted">
            Powered by <strong>Pollen LMS</strong> · All bids are binding · Terms and conditions apply
          </p>
        </div>
      </div>
    </div>
  );
}
