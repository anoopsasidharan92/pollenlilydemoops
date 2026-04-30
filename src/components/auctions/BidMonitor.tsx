"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  TrendingUp,
  Users,
  Clock,
  Gavel,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { sampleBids, suggestedBundles, existingAuctionEvents } from "@/lib/auction-data";

interface Props {
  onBack: () => void;
}

export default function BidMonitor({ onBack }: Props) {
  const event = existingAuctionEvents[0];
  const [activeLot, setActiveLot] = useState("BDL-001");
  const [bids, setBids] = useState(sampleBids);
  const [timeRemaining, setTimeRemaining] = useState("23h 42m 15s");

  useEffect(() => {
    const timer = setInterval(() => {
      const endTime = new Date(event.endTime).getTime();
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        setTimeRemaining("Ended");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [event.endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBidChance = Math.random();
      if (newBidChance > 0.7) {
        const lots = ["BDL-001", "BDL-002", "BDL-003"];
        const lotId = lots[Math.floor(Math.random() * lots.length)];
        const currentHighest = bids
          .filter((b) => b.lotId === lotId && (b.status === "Winning" || b.status === "Active"))
          .reduce((max, b) => Math.max(max, b.amount), 0);
        const bundle = suggestedBundles.find((b) => b.id === lotId);
        if (!bundle) return;

        const buyers = [
          { name: "Ahmad Rizal", company: "PT Mitra Kosmetik" },
          { name: "Siriporn Mee", company: "Watsons Thailand" },
          { name: "Maria Santos", company: "BeautyHub Philippines" },
          { name: "Tan Wei Lin", company: "Tok Kosmetik MY" },
        ];
        const buyer = buyers[Math.floor(Math.random() * buyers.length)];
        const increment = bundle.bidIncrement;
        const newAmount = currentHighest + increment;

        setBids((prev) => {
          const updated = prev.map((b) =>
            b.lotId === lotId && b.status === "Winning"
              ? { ...b, status: "Outbid" as const }
              : b
          );
          return [
            ...updated,
            {
              id: `BID-${Date.now()}`,
              lotId,
              bundleName: bundle.name,
              buyer: buyer.name,
              buyerCompany: buyer.company,
              amount: newAmount,
              timestamp: new Date().toISOString(),
              status: "Winning" as const,
            },
          ];
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [bids]);

  const lotBids = bids.filter((b) => b.lotId === activeLot);
  const highestBid = lotBids.reduce((max, b) => Math.max(max, b.amount), 0);
  const currentBundle = suggestedBundles.find((b) => b.id === activeLot);
  const reserveMet = currentBundle ? highestBid >= currentBundle.recommendedReserveBid : false;
  const totalBids = bids.length;
  const totalHighestValue = suggestedBundles
    .slice(0, 3)
    .reduce((sum, bundle) => {
      const lotMax = bids
        .filter((b) => b.lotId === bundle.id)
        .reduce((max, b) => Math.max(max, b.amount), 0);
      return sum + (lotMax || bundle.recommendedStartBid);
    }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Auctions
        </button>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs bg-green-50 text-accent-green px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            Live
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock size={12} /> {timeRemaining}
          </span>
        </div>
      </div>

      {/* Event header */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: event.brandColor }}>
              {event.sellerLogo}
            </div>
            <div>
              <h2 className="text-sm font-semibold">{event.title}</h2>
              <div className="flex items-center gap-3 mt-0.5 text-[11px] text-text-muted">
                <span>{event.auctionType} Auction</span>
                <span>{event.totalLots} lots</span>
                <span>{event.invitedBuyers.length} invited buyers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-border p-3">
          <p className="text-xl font-bold text-primary">{totalBids}</p>
          <p className="text-[11px] text-text-muted">Total Bids</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-3">
          <p className="text-xl font-bold text-accent-green">${(totalHighestValue / 1000).toFixed(1)}K</p>
          <p className="text-[11px] text-text-muted">Current Highest Total</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-3">
          <p className="text-xl font-bold text-accent-blue">3/3</p>
          <p className="text-[11px] text-text-muted">Lots with Bids</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-3">
          <p className="text-xl font-bold text-accent-orange">
            {suggestedBundles.slice(0, 3).filter((b) => {
              const max = bids.filter((bid) => bid.lotId === b.id).reduce((m, bid) => Math.max(m, bid.amount), 0);
              return max >= b.recommendedReserveBid;
            }).length}/3
          </p>
          <p className="text-[11px] text-text-muted">Reserve Met</p>
        </div>
      </div>

      {/* Lot tabs + Bid feed */}
      <div className="grid grid-cols-3 gap-4">
        {/* Lot selector */}
        <div className="col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-text-secondary uppercase px-1">Lots</h3>
          {suggestedBundles.slice(0, 3).map((bundle, i) => {
            const lotMax = bids
              .filter((b) => b.lotId === bundle.id)
              .reduce((max, b) => Math.max(max, b.amount), 0);
            const lotReserveMet = lotMax >= bundle.recommendedReserveBid;
            const lotBidCount = bids.filter((b) => b.lotId === bundle.id).length;

            return (
              <button
                key={bundle.id}
                onClick={() => setActiveLot(bundle.id)}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  activeLot === bundle.id
                    ? "border-primary bg-primary-50/30 shadow-sm"
                    : "border-border bg-white hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-text-muted">Lot {i + 1}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    lotReserveMet ? "bg-green-50 text-accent-green" : "bg-orange-50 text-accent-orange"
                  }`}>
                    {lotReserveMet ? "Reserve Met" : "Below Reserve"}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-1">{bundle.name}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-muted">{lotBidCount} bids</span>
                  <span className="font-bold text-primary">${lotMax > 0 ? lotMax.toLocaleString() : bundle.recommendedStartBid.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                  <div
                    className={`h-1 rounded-full transition-all ${lotReserveMet ? "bg-accent-green" : "bg-accent-orange"}`}
                    style={{ width: `${Math.min((lotMax / bundle.recommendedReserveBid) * 100, 100)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bid feed */}
        <div className="col-span-2 bg-white rounded-xl border border-border overflow-hidden flex flex-col max-h-[400px]">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-muted/30 sticky top-0">
            <div>
              <h3 className="text-xs font-semibold">{currentBundle?.name} — Bid History</h3>
              <div className="flex items-center gap-3 mt-0.5 text-[10px] text-text-muted">
                <span>Start: ${currentBundle?.recommendedStartBid.toLocaleString()}</span>
                <span>Reserve: ${currentBundle?.recommendedReserveBid.toLocaleString()}</span>
                <span>Increment: ${currentBundle?.bidIncrement}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Current Highest</p>
              <p className="text-lg font-bold text-primary">${highestBid.toLocaleString()}</p>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                reserveMet ? "bg-green-50 text-accent-green" : "bg-orange-50 text-accent-orange"
              }`}>
                {reserveMet ? "Reserve Met" : "Below Reserve"}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {lotBids
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((bid) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all animate-fade-in ${
                    bid.status === "Winning"
                      ? "border-accent-green/30 bg-green-50/30"
                      : bid.status === "Outbid"
                      ? "border-border bg-white opacity-60"
                      : "border-border bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-lighter flex items-center justify-center text-primary text-[10px] font-bold">
                      {bid.buyer[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium">{bid.buyer}</span>
                        <span className="text-[9px] text-text-muted">{bid.buyerCompany}</span>
                      </div>
                      <span className="text-[9px] text-text-muted">
                        {new Date(bid.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">${bid.amount.toLocaleString()}</span>
                    {bid.status === "Winning" && (
                      <span className="text-[9px] bg-green-50 text-accent-green px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                        <ArrowUpRight size={8} /> Highest
                      </span>
                    )}
                    {bid.status === "Outbid" && (
                      <span className="text-[9px] bg-gray-100 text-text-muted px-1.5 py-0.5 rounded-full font-medium">
                        Outbid
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
