"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Edit3,
  Clock,
  Users,
  Gavel,
  Eye,
  EyeOff,
  DollarSign,
  Package,
  Shield,
  Send,
  Star,
  Globe,
  Lock,
  UserCheck,
  ChevronDown,
  X,
} from "lucide-react";
import {
  WORKFLOW_STEPS,
  LILY_AUCTION_MESSAGES,
  suggestedBundles,
  eligibleBuyers as defaultBuyers,
  type AuctionBundle,
  type EligibleBuyer,
} from "@/lib/auction-data";
import { listings } from "@/lib/demo-data";
import WhitelabelPreview from "./WhitelabelPreview";

interface Props {
  onBack: () => void;
}

interface LilyMessage {
  role: "lily" | "user";
  content: string;
}

export default function AuctionWorkflow({ onBack }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lilyMessages, setLilyMessages] = useState<LilyMessage[]>([]);
  const [lilyInput, setLilyInput] = useState("");
  const [isLilyTyping, setIsLilyTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auction parameters state
  const [auctionType, setAuctionType] = useState<"English" | "Dutch" | "Sealed Bid">("English");
  const [buyerAccess, setBuyerAccess] = useState<"Invite Only" | "Approved Marketplace" | "Private List">("Approved Marketplace");
  const [startDate, setStartDate] = useState("2026-05-05");
  const [startTime, setStartTime] = useState("08:00");
  const [endDate, setEndDate] = useState("2026-05-06");
  const [endTime, setEndTime] = useState("18:00");
  const [eventTitle, setEventTitle] = useState("L'Oréal Indonesia Q2 Clearance Auction");
  const [brandColor, setBrandColor] = useState("#6B3FA0");

  // Bundle state
  const [selectedBundles, setSelectedBundles] = useState<string[]>(
    suggestedBundles.map((b) => b.id)
  );
  const [editingBundle, setEditingBundle] = useState<string | null>(null);
  const [bundlePrices, setBundlePrices] = useState<Record<string, { start: number; reserve: number; increment: number; showReserve: boolean }>>(
    Object.fromEntries(
      suggestedBundles.map((b) => [
        b.id,
        { start: b.recommendedStartBid, reserve: b.recommendedReserveBid, increment: b.bidIncrement, showReserve: b.showReserve },
      ])
    )
  );

  // Buyer state
  const [buyers, setBuyers] = useState<EligibleBuyer[]>(defaultBuyers);

  // Published state
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lilyMessages]);

  const addLilyMessage = (content: string, delay = 800) => {
    setIsLilyTyping(true);
    setTimeout(() => {
      setLilyMessages((prev) => [...prev, { role: "lily", content }]);
      setIsLilyTyping(false);
    }, delay);
  };

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const t = setTimeout(() => {
      setLilyMessages([{ role: "lily", content: LILY_AUCTION_MESSAGES.welcome }]);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    const keys = ["welcome", "parameters", "bundles", "pricing", "buyers", "preview", "published"];
    if (keys[step] && !lilyMessages.some((m) => m.content === LILY_AUCTION_MESSAGES[keys[step]])) {
      addLilyMessage(LILY_AUCTION_MESSAGES[keys[step]]);
    }
  };

  const nextStep = () => {
    if (currentStep < WORKFLOW_STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleLilySend = () => {
    if (!lilyInput.trim()) return;
    setLilyMessages((prev) => [...prev, { role: "user", content: lilyInput.trim() }]);
    const input = lilyInput.toLowerCase();
    setLilyInput("");

    let response = "Got it! I've noted your preferences. You can continue editing the parameters on the right, or let me know if you need any adjustments.";
    if (input.includes("yes") || input.includes("start") || input.includes("let's go") || input.includes("proceed")) {
      if (currentStep === 0) {
        response = "Let's set up your auction. I've pre-filled the parameters based on your seller profile. Review and edit them on the right panel.";
        setTimeout(() => goToStep(1), 400);
      } else {
        response = "Moving to the next step. Review the details and let me know if anything needs adjustment.";
        setTimeout(() => nextStep(), 400);
      }
    } else if (input.includes("english") || input.includes("ascending")) {
      setAuctionType("English");
      response = "Set auction type to **English (ascending)**. This encourages competitive bidding and typically yields the highest recovery rates for clearance inventory.";
    } else if (input.includes("dutch") || input.includes("descending")) {
      setAuctionType("Dutch");
      response = "Set auction type to **Dutch (descending)**. Good for fast clearance — first buyer to accept wins.";
    } else if (input.includes("sealed")) {
      setAuctionType("Sealed Bid");
      response = "Set auction type to **Sealed Bid**. Buyers submit one bid without seeing others. Best when you want to prevent competitive anchoring.";
    } else if (input.includes("invite") || input.includes("private")) {
      setBuyerAccess("Invite Only");
      response = "Set buyer access to **Invite Only**. Only buyers you specifically invite can participate in this auction.";
    } else if (input.includes("hide reserve") || input.includes("hidden reserve")) {
      response = "I'll set all bundle reserves to **hidden**. Bidders will only see \"Reserve not met\" or \"Reserve met\" status.";
    } else if (input.includes("show reserve") || input.includes("visible reserve")) {
      response = "I'll set all bundle reserves to **visible**. This can anchor buyer expectations and encourage bidding above the floor.";
    }
    addLilyMessage(response, 1000);
  };

  const toggleBundle = (id: string) => {
    setSelectedBundles((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const toggleBuyer = (id: string) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, selected: !b.selected } : b))
    );
  };

  const getSkuDetails = (skuCode: string) => listings.find((l) => l.sku === skuCode);

  const totalSelectedStart = suggestedBundles
    .filter((b) => selectedBundles.includes(b.id))
    .reduce((s, b) => s + (bundlePrices[b.id]?.start || b.recommendedStartBid), 0);

  const totalSelectedReserve = suggestedBundles
    .filter((b) => selectedBundles.includes(b.id))
    .reduce((s, b) => s + (bundlePrices[b.id]?.reserve || b.recommendedReserveBid), 0);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Auctions
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Seller:</span>
          <div className="flex items-center gap-1.5 bg-primary-lighter/50 px-2.5 py-1 rounded-lg">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-[9px] font-bold">L</div>
            <span className="text-xs font-medium text-primary">L&apos;Oréal Indonesia</span>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-xl border border-border p-3">
        <div className="flex items-center gap-1">
          {WORKFLOW_STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => i <= currentStep && goToStep(i)}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all ${
                i === currentStep
                  ? "bg-primary text-white"
                  : i < currentStep
                  ? "bg-green-50 text-accent-green cursor-pointer hover:bg-green-100"
                  : "text-text-muted"
              }`}
            >
              {i < currentStep ? <CheckCircle2 size={12} /> : <span className="text-[10px]">{i + 1}</span>}
              <span className="hidden xl:inline">{step}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content: Lily panel + Config panel */}
      <div className="grid grid-cols-5 gap-4">
        {/* Lily automation panel */}
        <div className="col-span-2 bg-white rounded-xl border border-border flex flex-col max-h-[calc(100vh-280px)]">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold">Lily Auction Assistant</p>
              <p className="text-[10px] text-text-muted">Guiding your auction setup</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {lilyMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "lily" && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={8} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-relaxed ${
                    msg.role === "user" ? "bg-primary text-white" : "bg-surface-muted text-text-primary border border-border"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              </div>
            ))}
            {isLilyTyping && (
              <div className="flex gap-2 items-start animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles size={8} className="text-white" />
                </div>
                <div className="bg-surface-muted border border-border rounded-lg px-3 py-2 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-border flex items-center gap-2">
            <input
              value={lilyInput}
              onChange={(e) => setLilyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLilySend()}
              placeholder="Ask Lily or type a command..."
              className="flex-1 text-xs outline-none placeholder:text-text-muted"
            />
            <button onClick={handleLilySend} disabled={!lilyInput.trim()} className="text-primary disabled:text-text-muted">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Configure panel */}
        <div className="col-span-3 bg-white rounded-xl border border-border overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Edit3 size={14} className="text-primary" />
              {WORKFLOW_STEPS[currentStep]}
            </h3>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button onClick={() => goToStep(currentStep - 1)} className="text-xs text-text-muted hover:text-text-secondary flex items-center gap-1">
                  <ArrowLeft size={12} /> Previous
                </button>
              )}
              {currentStep < WORKFLOW_STEPS.length - 1 && (
                <button
                  onClick={nextStep}
                  className="text-xs font-medium text-primary flex items-center gap-1 bg-primary-lighter/50 px-3 py-1.5 rounded-lg hover:bg-primary-lighter transition-colors"
                >
                  Next <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            {/* Step 0: Opportunity Detection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-xs text-text-secondary">
                  Lily has analyzed your inventory and identified SKUs with high auction recovery potential.
                  Review the candidates below, then start the auction setup.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-red-50/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-accent-red">6</p>
                    <p className="text-[10px] text-text-muted">Near Expiry</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-text-secondary">3</p>
                    <p className="text-[10px] text-text-muted">Discontinued</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-accent-orange">8</p>
                    <p className="text-[10px] text-text-muted">Overstock</p>
                  </div>
                </div>
                <button
                  onClick={nextStep}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  <Sparkles size={14} /> Start Auction Setup
                </button>
              </div>
            )}

            {/* Step 1: Auction Parameters */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-text-secondary font-medium block mb-1.5">Event Title</label>
                  <input
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-text-secondary font-medium block mb-1.5">Auction Type</label>
                    <div className="space-y-1.5">
                      {(["English", "Dutch", "Sealed Bid"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setAuctionType(type)}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                            auctionType === type
                              ? "border-primary bg-primary-50/50 text-primary font-medium"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="font-medium">{type}</div>
                          <div className="text-[10px] text-text-muted mt-0.5">
                            {type === "English" && "Ascending bids. Highest bidder wins."}
                            {type === "Dutch" && "Descending price. First to accept wins."}
                            {type === "Sealed Bid" && "One blind bid per buyer. Highest wins."}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary font-medium block mb-1.5">Buyer Access</label>
                    <div className="space-y-1.5">
                      {([
                        { value: "Invite Only" as const, icon: Lock, desc: "Only invited buyers can bid" },
                        { value: "Approved Marketplace" as const, icon: Globe, desc: "All approved marketplace buyers" },
                        { value: "Private List" as const, icon: UserCheck, desc: "Specific buyer list from CRM" },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setBuyerAccess(opt.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                            buyerAccess === opt.value
                              ? "border-primary bg-primary-50/50 text-primary font-medium"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <opt.icon size={14} />
                          <div>
                            <div className="font-medium">{opt.value}</div>
                            <div className="text-[10px] text-text-muted">{opt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-text-secondary font-medium block mb-1.5">Start Date & Time</label>
                    <div className="flex gap-2">
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1 text-xs border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40" />
                      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-24 text-xs border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary font-medium block mb-1.5">End Date & Time</label>
                    <div className="flex gap-2">
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1 text-xs border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40" />
                      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-24 text-xs border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-text-secondary font-medium block mb-1.5">Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                    <input value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="text-xs border border-border rounded-lg px-3 py-2 w-28 outline-none" />
                    <span className="text-[10px] text-text-muted">Used for whitelabel buyer room</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Bundle Selection */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-text-secondary mb-2">
                  Lily has grouped your auction-eligible inventory into <strong>{suggestedBundles.length} bundled lots</strong>.
                  Pricing applies at the bundle level, not per SKU. Select bundles to include.
                </p>
                {suggestedBundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      selectedBundles.includes(bundle.id) ? "border-primary bg-primary-50/20" : "border-border"
                    }`}
                  >
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBundles.includes(bundle.id)}
                          onChange={() => toggleBundle(bundle.id)}
                          className="rounded accent-primary"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{bundle.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                              bundle.riskScore === "High" ? "bg-red-50 text-accent-red" :
                              bundle.riskScore === "Medium" ? "bg-orange-50 text-accent-orange" :
                              "bg-green-50 text-accent-green"
                            }`}>
                              {bundle.riskScore} Risk
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {bundle.skus.length} SKUs · {bundle.totalQuantity.toLocaleString()} units · Retail ${bundle.totalRetailValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-primary">${bundle.recommendedStartBid.toLocaleString()}</p>
                        <p className="text-[10px] text-text-muted">Recommended start</p>
                      </div>
                    </div>
                    <div className="px-4 pb-3">
                      <div className="flex flex-wrap gap-1">
                        {bundle.skus.map((sku) => {
                          const item = getSkuDetails(sku);
                          return item ? (
                            <span key={sku} className="text-[9px] bg-surface-muted px-2 py-0.5 rounded border border-border">
                              {item.sku} — {item.product.slice(0, 35)}...
                            </span>
                          ) : null;
                        })}
                      </div>
                      <p className="text-[10px] text-text-muted mt-1.5 italic">{bundle.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Pricing & Lots */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-text-secondary">
                    Review and edit bundle-level pricing. All values pre-filled by Lily.
                  </p>
                  <div className="text-right">
                    <p className="text-xs font-medium">Total Start: <span className="text-primary">${totalSelectedStart.toLocaleString()}</span></p>
                    <p className="text-[10px] text-text-muted">Total Reserve: ${totalSelectedReserve.toLocaleString()}</p>
                  </div>
                </div>
                {suggestedBundles
                  .filter((b) => selectedBundles.includes(b.id))
                  .map((bundle) => {
                    const prices = bundlePrices[bundle.id];
                    const isEditing = editingBundle === bundle.id;
                    return (
                      <div key={bundle.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-xs font-semibold">{bundle.name}</span>
                            <span className="text-[10px] text-text-muted ml-2">{bundle.id}</span>
                          </div>
                          <button
                            onClick={() => setEditingBundle(isEditing ? null : bundle.id)}
                            className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                          >
                            <Edit3 size={10} /> {isEditing ? "Done" : "Edit"}
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] text-text-muted block mb-1">Bundle Starting Bid</label>
                            {isEditing ? (
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                                <input
                                  type="number"
                                  value={prices.start}
                                  onChange={(e) =>
                                    setBundlePrices((p) => ({ ...p, [bundle.id]: { ...p[bundle.id], start: Number(e.target.value) } }))
                                  }
                                  className="w-full pl-5 pr-2 py-1.5 text-xs border border-primary/40 rounded-lg outline-none bg-white"
                                />
                              </div>
                            ) : (
                              <p className="text-sm font-semibold text-primary">${prices.start.toLocaleString()}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted block mb-1">Bundle Reserve Bid</label>
                            {isEditing ? (
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                                <input
                                  type="number"
                                  value={prices.reserve}
                                  onChange={(e) =>
                                    setBundlePrices((p) => ({ ...p, [bundle.id]: { ...p[bundle.id], reserve: Number(e.target.value) } }))
                                  }
                                  className="w-full pl-5 pr-2 py-1.5 text-xs border border-primary/40 rounded-lg outline-none bg-white"
                                />
                              </div>
                            ) : (
                              <p className="text-sm font-semibold">${prices.reserve.toLocaleString()}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted block mb-1">Bid Increment</label>
                            {isEditing ? (
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                                <input
                                  type="number"
                                  value={prices.increment}
                                  onChange={(e) =>
                                    setBundlePrices((p) => ({ ...p, [bundle.id]: { ...p[bundle.id], increment: Number(e.target.value) } }))
                                  }
                                  className="w-full pl-5 pr-2 py-1.5 text-xs border border-primary/40 rounded-lg outline-none bg-white"
                                />
                              </div>
                            ) : (
                              <p className="text-sm font-semibold">${prices.increment}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted block mb-1">Reserve Visibility</label>
                            <button
                              onClick={() =>
                                setBundlePrices((p) => ({
                                  ...p,
                                  [bundle.id]: { ...p[bundle.id], showReserve: !p[bundle.id].showReserve },
                                }))
                              }
                              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                                prices.showReserve
                                  ? "border-accent-green bg-green-50 text-accent-green"
                                  : "border-border text-text-muted"
                              }`}
                            >
                              {prices.showReserve ? <Eye size={12} /> : <EyeOff size={12} />}
                              {prices.showReserve ? "Visible" : "Hidden"}
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-text-muted">
                          <Sparkles size={10} className="text-primary" />
                          Start at {((prices.start / bundle.totalRetailValue) * 100).toFixed(0)}% of retail ·
                          Reserve at {((prices.reserve / bundle.totalRetailValue) * 100).toFixed(0)}% of retail
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Step 4: Buyer Access */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    Lily matched <strong>{buyers.length} eligible buyers</strong>. Select who to invite.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">{buyers.filter((b) => b.selected).length} selected</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      buyerAccess === "Invite Only" ? "bg-orange-50 text-accent-orange" :
                      buyerAccess === "Approved Marketplace" ? "bg-green-50 text-accent-green" :
                      "bg-blue-50 text-accent-blue"
                    }`}>
                      {buyerAccess}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {buyers.map((buyer) => (
                    <div
                      key={buyer.id}
                      className={`border rounded-lg p-3 flex items-center justify-between transition-all ${
                        buyer.selected ? "border-primary bg-primary-50/20" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={buyer.selected}
                          onChange={() => toggleBuyer(buyer.id)}
                          className="rounded accent-primary"
                        />
                        <div className="w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center text-primary font-bold text-xs">
                          {buyer.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{buyer.name}</span>
                            <span className="text-[10px] text-text-muted">{buyer.company}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-[10px] text-text-muted">
                            <span>{buyer.region}</span>
                            <span>{buyer.pastAuctions} past auctions</span>
                            <span>Avg bid ${buyer.avgBidValue.toLocaleString()}</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {buyer.categoryInterest.map((cat) => (
                              <span key={cat} className="text-[8px] bg-surface-muted px-1.5 py-0.5 rounded border border-border">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star size={10} className={buyer.matchScore >= 90 ? "text-accent-orange fill-accent-orange" : "text-text-muted"} />
                          <span className={`text-sm font-bold ${
                            buyer.matchScore >= 90 ? "text-accent-green" :
                            buyer.matchScore >= 80 ? "text-accent-blue" :
                            "text-accent-orange"
                          }`}>
                            {buyer.matchScore}%
                          </span>
                        </div>
                        <p className="text-[9px] text-text-muted">Match score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Whitelabel Preview */}
            {currentStep === 5 && (
              <WhitelabelPreview
                eventTitle={eventTitle}
                brandColor={brandColor}
                brandName="L'Oréal Indonesia"
                auctionType={auctionType}
                startTime={`${startDate}T${startTime}:00Z`}
                endTime={`${endDate}T${endTime}:00Z`}
                bundles={suggestedBundles.filter((b) => selectedBundles.includes(b.id))}
                bundlePrices={bundlePrices}
                buyerAccess={buyerAccess}
                invitedCount={buyers.filter((b) => b.selected).length}
              />
            )}

            {/* Step 6: Publish & Monitor */}
            {currentStep === 6 && (
              <div className="space-y-4">
                {!isPublished ? (
                  <>
                    <div className="bg-surface-muted rounded-lg p-4 space-y-2">
                      <h4 className="text-xs font-semibold">Auction Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between"><span className="text-text-muted">Title</span><span className="font-medium">{eventTitle}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Type</span><span className="font-medium">{auctionType}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Lots</span><span className="font-medium">{selectedBundles.length}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Buyer Access</span><span className="font-medium">{buyerAccess}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Total Start Value</span><span className="font-medium text-primary">${totalSelectedStart.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Total Reserve</span><span className="font-medium">${totalSelectedReserve.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Invited Buyers</span><span className="font-medium">{buyers.filter((b) => b.selected).length}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Duration</span><span className="font-medium">{startDate} → {endDate}</span></div>
                      </div>
                    </div>

                    <div className="bg-green-50/30 border border-accent-green/20 rounded-lg p-3 space-y-1.5">
                      <h4 className="text-xs font-semibold text-accent-green flex items-center gap-1"><Shield size={12} /> Pre-publish Checks</h4>
                      {[
                        "All bundle pricing validated",
                        "Buyer eligibility verified for all invitees",
                        "Grey market check passed for all approved markets",
                        "Whitelabel branding configured",
                        "Auction rules and terms set",
                      ].map((check) => (
                        <div key={check} className="flex items-center gap-2 text-xs text-accent-green">
                          <CheckCircle2 size={12} /> {check}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setIsPublished(true);
                        addLilyMessage(LILY_AUCTION_MESSAGES.published);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      <Sparkles size={16} /> Publish Auction Event
                    </button>
                  </>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-green-50/40 border border-accent-green/20 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-accent-green" />
                      <div>
                        <p className="text-sm font-semibold text-accent-green">Auction Published Successfully!</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {buyers.filter((b) => b.selected).length} buyers notified · Bidding opens {startDate} at {startTime}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Buyer notifications sent", icon: Users },
                        { label: "Branded auction room live", icon: Globe },
                        { label: "Bid monitoring active", icon: Eye },
                        { label: "Auto-counter rules enabled", icon: Shield },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 bg-surface-muted rounded-lg p-3 text-xs">
                          <CheckCircle2 size={14} className="text-accent-green" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={onBack}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      <Eye size={14} /> Go to Bid Monitor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
