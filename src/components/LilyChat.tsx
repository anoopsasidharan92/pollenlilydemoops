"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Send,
  X,
  FileText,
  Clock,
  ChevronDown,
  Zap,
} from "lucide-react";

interface Message {
  role: "user" | "lily";
  content: string;
  timestamp: Date;
}

const DEMO_RESPONSES: Record<string, string> = {
  "allocate": "I've analyzed your inventory and allocated 19 listings across your preferred channels based on your allocation strategy:\n\n• **Marketplace**: 11 batches (highest volume)\n• **Employee F&F**: 3 batches (near-expiry items)\n• **Catalogs**: 3 batches (premium items)\n• **Auctions**: 2 batches (discontinued items)\n\nAllocation optimizes for highest recovery rate while prioritizing items closest to expiry. Ready to publish?",
  "price": "I've optimized pricing across all 19 listings using PSI (Price Sensitivity Index):\n\n• **Near-expiry items**: 20-35% markdown from original retail\n• **Overstock items**: 15-25% markdown\n• **Discontinued items**: 30-45% markdown\n• **Packaging change**: 10-20% markdown\n\nEstimated total recovery value: **$186,420** with a projected sell-through rate of 87.3%.",
  "buyer": "I've identified top buyer matches for your current inventory:\n\n1. **PT Mitra Kosmetik** (Indonesia) — 92% match, interested in Hair Care\n2. **BeautyHub Philippines** — 88% match, interested in Skin Care\n3. **Tok Kosmetik MY** (Malaysia) — 85% match, high-value buyer\n4. **Watsons Thailand** — 82% match, bulk purchaser\n\nShall I send outreach to these buyers with personalized catalogs?",
  "outreach": "Outreach initiated for 4 matched buyers:\n\n✅ **PT Mitra Kosmetik** — Personalized catalog sent via email + WhatsApp\n✅ **BeautyHub Philippines** — Marketplace listing notification sent\n✅ **Tok Kosmetik MY** — Catalog invitation sent\n✅ **Watsons Thailand** — Employee store access granted\n\nBuyers will receive tailored product recommendations based on their purchase history and approved markets.",
  "counter": "I've detected an offer from **PT Mitra Kosmetik** for LST-001 at $2.40/unit (PSI price: $3.20).\n\nThis is 25% below PSI — triggering auto-counter per your negotiation rules.\n\n📤 **Counter offer sent**: $2.88/unit (10% discount from PSI)\n\nRationale: Buyer has strong purchase history and the item is near-expiry. A 10% discount balances recovery with sell-through urgency.",
  "approve": "Order TXN-003 is ready for final approval:\n\n✅ **Sales team**: Approved\n✅ **Finance team**: Approved\n✅ **Legal team**: Approved (grey market check passed)\n\n📋 All compliance checks passed:\n• Buyer authorized for Malaysia + Singapore markets\n• No grey market risk detected\n• Payment terms verified\n\nOrder has been created. Invoice and PO will be generated automatically.",
  "sustainability": "Here's your sustainability impact summary:\n\n🌱 **Products diverted from waste**: 42,800 units\n📦 **Total weight saved**: 28,560 kg\n🌍 **CO₂e emissions avoided**: 14,280 kg\n💰 **Revenue recovered**: $186,420\n\nYour sell-through rate of 87.3% means only 12.7% of excess inventory remains unsold. This exceeds industry benchmarks by 23%.",
  "pipeline": "Your **automated auction pipeline** is running:\n\n• **3 assignment templates** active (SEA Flash Clearance, Discontinued Bulk Recovery, Overstock Competitive)\n• **5 events** in pipeline — 1 live, 1 scheduled, 3 progressing\n• **17 products** auto-routed via allocation strategies\n• **$129.9K** total pipeline value\n\nNo manual intervention needed. Events generate automatically when products match template criteria. I handle bundling, pricing, buyer matching, and publishing.",
  "template": "Your **assignment templates** are pre-configured auction structures that run without products assigned upfront:\n\n• **SEA Flash Clearance** — English auction, 24h, auto-publish ON. Triggered by near-expiry products.\n• **Discontinued Bulk Recovery** — Sealed Bid, 48h, manual review. Biweekly cadence.\n• **Overstock Competitive Event** — English auction, 36h, auto-publish ON. Weekly cadence.\n• **Packaging Change Flash Sale** — Dutch auction, 12h. Currently paused.\n\nProducts flow into templates dynamically based on allocation strategies. No need to manually assign inventory.",
  "strategy": "Your **allocation strategies** control how products flow into auction templates:\n\n• **Near-Expiry Urgent Clearance** — Routes products within 120 days of expiry, bundles by category, shelf-life decay pricing\n• **Discontinued SKU Recovery** — Pools discontinued items by brand, floor-plus-margin pricing\n• **Overstock Competitive Bidding** — Groups by risk score, demand-weighted pricing\n• **Packaging Change Rapid Sell-Through** — Bundles by expiry window, market-rate pricing (currently inactive)\n\nStrategies evaluate inventory continuously. When conditions match, products auto-fill into the linked template.",
  "automat": "The auction workflow is **fully automated**. Here's how it works:\n\n1. **Detection** — I continuously scan inventory for auction-eligible products\n2. **Allocation** — Products auto-route to assignment templates via allocation strategies\n3. **Bundling** — Products are grouped into lots (by category, brand, risk, or expiry window)\n4. **Pricing** — Start bids and reserves are calculated using the strategy's pricing model\n5. **Buyer Matching** — Qualified buyers are matched via template buyer-tier rules\n6. **Publishing** — Events auto-publish (or stage for review if template requires it)\n\nYou only intervene when a template is set to manual review. Everything else flows automatically.",
  "ff": "Here's the status of your **Employee F&F Sale**:\n\n🛍️ **10 SKUs** allocated to F&F channel with 50-60% discounts\n📊 **347 orders** placed (208 online, 139 bazaar)\n👥 **289 unique buyers** across 9 departments\n💰 **$28.8K revenue** recovered (42.6% net recovery rate)\n\n**Access controls active**: SSO login, @loreal.com domain, $200 spending cap per buyer, per-SKU quantity limits.\n\n2 SKUs sold out (Revitalift Serum, UV Protection SPF50). Overall sell-through: 81%. Bazaar POS sync is live — single stock pool, no overselling.",
  "bazaar": "The **offline bazaar** is running at L'Oréal Thailand HQ — Lobby Level, Hall B:\n\n📍 **3 POS terminals** active (POS-B01, POS-B02, POS-B03)\n📡 **Real-time sync** to unified stock pool\n🛒 **139 bazaar orders** processed today\n💰 **THB 414K bazaar revenue**\n\nAll bazaar transactions feed back to Lily AI in real time. Combined with online orders, this gives you a single source of truth — no overselling across channels.\n\nEvery bazaar purchase is traced by buyer SSO ID -> prevents grey-market leakage.",
  "access": "Your **F&F access controls** are configured:\n\n🔒 **Authentication**: Corporate SSO required\n📧 **Allowed domains**: @loreal.com, @lorealgroup.com\n💳 **Spending cap**: $200 per employee per event\n📦 **Max items per order**: 10\n🏷️ **SKU-level limits**: Configured per-product (e.g., max 3 shampoos, max 2 serums)\n\n**Anti-abuse protection** is active:\n• All purchases traceable by employee ID\n• Grey-market leakage detection enabled\n• Fraudulent return prevention active\n\nNo manual guest verification needed — SSO handles identity automatically.",
  "recovery": "**Net Recovery Report** for the F&F event:\n\n📊 **Original retail value**: $67.7K\n💰 **F&F sale revenue**: $28.8K\n📈 **Net recovery rate**: 42.6%\n\n**SKU sell-through highlights**:\n• Revitalift Serum — 100% sold (top performer)\n• UV Protection SPF50 — 100% sold\n• Soft Matte Lip Cream — 81.8% sold\n• Elvive Shampoo — 80.3% sold\n\nWithout this F&F event, estimated write-off would have been 100%. The event recovered $28.8K from what would have been $0.",
  "default": "I can help you with that! Here's what I can do:\n\n• **Allocate** inventory across channels\n• **Optimize pricing** using PSI analysis\n• **Match buyers** to your products\n• **F&F store** — manage employee Friends & Family sale\n• **Bazaar** — view offline POS sync status\n• **Auction pipeline** — view automated auction status\n• **Templates** — manage assignment templates\n• **Strategies** — configure allocation strategies\n• **Manage negotiations** with auto-counter offers\n• **Report** on sustainability & F&F analytics\n\nWhat would you like to do?",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("f&f") || lower.includes("friends") || lower.includes("family") || lower.includes("employee") || lower.includes("employee sale"))
    return DEMO_RESPONSES.ff;
  if (lower.includes("bazaar") || lower.includes("pos") || lower.includes("offline"))
    return DEMO_RESPONSES.bazaar;
  if (lower.includes("access control") || lower.includes("sso") || lower.includes("spending cap") || lower.includes("purchase limit"))
    return DEMO_RESPONSES.access;
  if (lower.includes("recovery") || lower.includes("sell-through") || lower.includes("sell through") || lower.includes("analytics"))
    return DEMO_RESPONSES.recovery;
  if (lower.includes("pipeline") || lower.includes("auction status") || lower.includes("auction pipeline"))
    return DEMO_RESPONSES.pipeline;
  if (lower.includes("template") || lower.includes("assignment"))
    return DEMO_RESPONSES.template;
  if (lower.includes("strateg") || lower.includes("allocation rule"))
    return DEMO_RESPONSES.strategy;
  if (lower.includes("automat") || lower.includes("how does auction") || lower.includes("auction workflow") || lower.includes("how do auction"))
    return DEMO_RESPONSES.automat;
  if (lower.includes("allocat")) return DEMO_RESPONSES.allocate;
  if (lower.includes("pric") || lower.includes("optimi")) return DEMO_RESPONSES.price;
  if (lower.includes("match") || lower.includes("buyer") || lower.includes("recommend"))
    return DEMO_RESPONSES.buyer;
  if (lower.includes("outreach") || lower.includes("send") || lower.includes("reach out"))
    return DEMO_RESPONSES.outreach;
  if (lower.includes("counter") || lower.includes("negotiat") || lower.includes("offer"))
    return DEMO_RESPONSES.counter;
  if (lower.includes("approv") || lower.includes("order") || lower.includes("create order"))
    return DEMO_RESPONSES.approve;
  if (lower.includes("sustain") || lower.includes("report") || lower.includes("co2") || lower.includes("impact"))
    return DEMO_RESPONSES.sustainability;
  return DEMO_RESPONSES.default;
}

export default function LilyChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [automationMode, setAutomationMode] = useState("Automation");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setIsExpanded(true);

    setTimeout(() => {
      const response = getResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: "lily", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, [input]);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-text-primary">
            What can Lily help you with today?
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <button
            onClick={() => { setMessages([]); setIsExpanded(false); }}
            className="hover:text-text-secondary px-2 py-1 rounded transition-colors"
          >
            Clear chat
          </button>
          <button className="hover:text-text-secondary px-2 py-1 rounded transition-colors flex items-center gap-1">
            <FileText size={12} /> Files
          </button>
          <button className="hover:text-text-secondary px-2 py-1 rounded transition-colors flex items-center gap-1">
            <Clock size={12} /> Chat History
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 hover:text-text-secondary transition-colors"
          >
            {isExpanded ? <X size={14} /> : null}
          </button>
        </div>
      </div>

      {isExpanded && messages.length > 0 && (
        <div className="max-h-80 overflow-y-auto px-5 py-3 space-y-3 bg-surface-muted/50 border-t border-border">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "lily" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-text-primary"
                }`}
              >
                <div dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br/>")
                    .replace(/• /g, "• ")
                }} />
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-start animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles size={10} className="text-white" />
              </div>
              <div className="bg-white border border-border rounded-lg px-3 py-2 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="px-5 py-3 border-t border-border flex items-center gap-3">
        <button className="w-6 h-6 rounded-full bg-primary-lighter text-primary flex items-center justify-center text-lg font-light shrink-0">
          +
        </button>
        <div className="relative">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-1 bg-accent-orange/10 text-accent-orange px-3 py-1.5 rounded-lg text-xs font-medium border border-accent-orange/20"
          >
            <Zap size={12} />
            {automationMode}
            <ChevronDown size={12} />
          </button>
          {showModeDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-border py-1 z-50 w-40">
              {["Automation", "Chat", "Analysis"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setAutomationMode(mode); setShowModeDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface-muted transition-colors"
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Lily about channels — or use Automation ▼ for allocation, preview, publish, and create catalog"
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="text-primary hover:text-primary-dark disabled:text-text-muted transition-colors"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="px-5 pb-3">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Lily AI orchestrates how your inventory is priced, allocated, and sold across all channels. Sage executes buyer matching, outreach, and negotiation within these rules.
        </p>
      </div>
    </div>
  );
}
