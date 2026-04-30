"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Sparkles,
  Send,
  CheckCircle2,
  RotateCcw,
  Settings,
  DollarSign,
  Globe,
  LayoutGrid,
  CalendarClock,
  Shield,
} from "lucide-react";

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

interface ChatMessage {
  id: string;
  role: "lily" | "user";
  content: string;
  timestamp: string;
  options?: ChatOption[];
}

interface ChatOption {
  label: string;
  value: string;
  recommended?: boolean;
}

interface TemplateConfig {
  name: string;
  pricing: { model: string; reasoning: string } | null;
  access: { level: string; countries: string[]; buyerTypes: string[]; reasoning: string } | null;
  organization: { strategy: string; reasoning: string } | null;
  validity: { days: string; refresh: string; reasoning: string } | null;
}

type SetupPhase = "intro" | "pricing" | "access" | "organization" | "validity" | "review" | "complete";

const PHASE_ORDER: SetupPhase[] = ["intro", "pricing", "access", "organization", "validity", "review", "complete"];

const AI_MESSAGES: Record<string, { content: string; options?: ChatOption[] }> = {
  intro: {
    content:
      "I'll set up a new catalog template — an **empty container** that dynamic allocation fills automatically.\n\nWhat would you like to call this template?",
  },
  "intro-named": {
    content:
      "Got it. Analyzing your sales data now...",
  },
  pricing: {
    content:
      "**Pricing: Tiered Volume**\n\nTiered pricing drove **31% higher order volumes** across **23 catalog editions**. Tiers: 0% / 5% / 12% off at qty thresholds. Avg margin at **42%**, well above your **28% floor**.",
    options: [
      { label: "Tiered Volume Pricing", value: "tiered-volume", recommended: true },
      { label: "Fixed Markup (flat %)", value: "fixed-markup" },
      { label: "Negotiable (floor + suggested)", value: "negotiable" },
      { label: "Market Rate (dynamic)", value: "market-rate" },
    ],
  },
  access: {
    content:
      "**Access: Approved Buyers · SEA · Wholesale + Distributor**\n\n• Countries: Indonesia, Malaysia, Thailand, Philippines\n• Buyer types: Wholesale, Distributor\n\n**12 qualified buyers** — account for **87%** of your catalog order volume.",
    options: [
      { label: "Approved Buyers · SEA · 2 types", value: "approved-sea", recommended: true },
      { label: "Invite Only · Custom list", value: "invite-only" },
      { label: "Open Marketplace · No restrictions", value: "open" },
    ],
  },
  organization: {
    content:
      "**Organization: By Category**\n\nBuyers browse by category **73% of the time**. Groups: Hair Care, Skin Care, Makeup, Body Care, Sun Care — aligns with your product master hierarchy.",
    options: [
      { label: "By Category", value: "by-category", recommended: true },
      { label: "By Brand", value: "by-brand" },
      { label: "By Condition", value: "by-condition" },
      { label: "Curated (manual)", value: "curated" },
    ],
  },
  validity: {
    content:
      "**Validity: 30 days · Weekly refresh**\n\nMatches your buyer procurement cycle (**avg 18 days**). Weekly refresh auto-adds new products, removes sold-out items, and adjusts pricing.",
    options: [
      { label: "30 days · Weekly refresh", value: "30-weekly", recommended: true },
      { label: "14 days · On inventory change", value: "14-on-change" },
      { label: "60 days · Biweekly refresh", value: "60-biweekly" },
      { label: "7 days · Daily refresh", value: "7-daily" },
    ],
  },
  review: {
    content:
      "All set. AI configured all parameters from your historical data.\n\n**This is an empty container** — products fill in automatically via dynamic allocation.\n\nActivate now?",
    options: [
      { label: "Activate template", value: "activate", recommended: true },
      { label: "Save as draft", value: "draft" },
    ],
  },
  complete: {
    content:
      "**Activated** ✅\n\n✅ Empty container ready\n✅ AI parameters locked · manual override enabled\n✅ Buyer notifications configured\n✅ Audit trail started\n\nI'll auto-organize, price, apply access rules, and publish when products are allocated.",
  },
};

export default function CatalogAISetup({ onBack, onComplete }: Props) {
  const [phase, setPhase] = useState<SetupPhase>("intro");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [config, setConfig] = useState<TemplateConfig>({
    name: "",
    pricing: null,
    access: null,
    organization: null,
    validity: null,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdRef = useRef(0);
  const initRef = useRef(false);
  const nextId = (prefix: string) => `${prefix}-${++msgIdRef.current}`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    addLilyMessage("intro");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addLilyMessage(key: string) {
    setIsTyping(true);
    const delay = key === "intro" ? 800 : 1200;
    setTimeout(() => {
      const msg = AI_MESSAGES[key];
      if (!msg) return;
      setMessages((prev) => [
        ...prev,
        {
          id: nextId("lily"),
          role: "lily",
          content: msg.content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          options: msg.options,
        },
      ]);
      setIsTyping(false);
    }, delay);
  }

  function handleUserInput(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: nextId("user"),
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputValue("");

    if (phase === "intro") {
      setConfig((prev) => ({ ...prev, name: text.trim() }));
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId("lily"),
            role: "lily",
            content: AI_MESSAGES["intro-named"].content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        setTimeout(() => {
          setPhase("pricing");
          addLilyMessage("pricing");
        }, 600);
      }, 800);
    }
  }

  function handleOptionSelect(option: ChatOption) {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId("user"),
        role: "user",
        content: option.label,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    const nextPhaseIdx = PHASE_ORDER.indexOf(phase) + 1;
    const nextPhase = PHASE_ORDER[nextPhaseIdx] || "complete";

    if (phase === "pricing") {
      setConfig((prev) => ({
        ...prev,
        pricing: {
          model: option.label,
          reasoning: "31% higher order volumes vs fixed pricing; avg order 1,200 units",
        },
      }));
    } else if (phase === "access") {
      const countries =
        option.value === "approved-sea"
          ? ["Indonesia", "Malaysia", "Thailand", "Philippines"]
          : option.value === "invite-only"
          ? ["Custom list"]
          : [];
      const buyerTypes =
        option.value === "approved-sea"
          ? ["Wholesale", "Distributor"]
          : option.value === "invite-only"
          ? ["Custom selection"]
          : ["All"];
      setConfig((prev) => ({
        ...prev,
        access: {
          level:
            option.value === "approved-sea"
              ? "Approved Buyers"
              : option.value === "invite-only"
              ? "Invite Only"
              : "Open Marketplace",
          countries,
          buyerTypes,
          reasoning: "12 approved buyers in SEA account for 87% of catalog order volume",
        },
      }));
    } else if (phase === "organization") {
      setConfig((prev) => ({
        ...prev,
        organization: {
          strategy: option.label,
          reasoning: "Buyers browse by category 73% of the time based on analytics",
        },
      }));
    } else if (phase === "validity") {
      const parts = option.value.split("-");
      setConfig((prev) => ({
        ...prev,
        validity: {
          days: parts[0] + " days",
          refresh: parts.slice(1).join("-").replace("-", " "),
          reasoning: "Avg buyer procurement cycle 18 days; inventory turns at ~22 days",
        },
      }));
    } else if (phase === "review") {
      if (option.value === "activate") {
        setPhase("complete" as SetupPhase);
        addLilyMessage("complete");
        return;
      }
    }

    setPhase(nextPhase as SetupPhase);
    addLilyMessage(nextPhase);
  }

  function renderMarkdown(text: string) {
    return text.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
        .replace(/• /g, '<span class="text-primary mr-1">•</span> ');
      return (
        <p key={i} className={line === "" ? "h-2" : "text-sm leading-relaxed"} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  }

  const phaseIndex = PHASE_ORDER.indexOf(phase);
  const completedSteps = Math.max(0, phaseIndex - 1);

  const configSteps = [
    { key: "pricing", icon: DollarSign, label: "Pricing Strategy", value: config.pricing?.model, reasoning: config.pricing?.reasoning },
    { key: "access", icon: Globe, label: "Access & Distribution", value: config.access ? `${config.access.level} · ${config.access.countries.length > 0 ? config.access.countries.length + " countries" : "Global"}` : null, reasoning: config.access?.reasoning },
    { key: "organization", icon: LayoutGrid, label: "Product Organization", value: config.organization?.strategy, reasoning: config.organization?.reasoning },
    { key: "validity", icon: CalendarClock, label: "Validity & Refresh", value: config.validity ? `${config.validity.days} · ${config.validity.refresh}` : null, reasoning: config.validity?.reasoning },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">AI Catalog Setup</h2>
            <p className="text-xs text-text-muted">Lily configures your template through conversation</p>
          </div>
        </div>
        {phase === "complete" && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4" style={{ minHeight: "600px" }}>
        {/* Chat panel — 2 cols */}
        <div className="col-span-2 bg-white rounded-xl border border-border flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
              Li
            </div>
            <div>
              <p className="text-sm font-semibold">Lily</p>
              <p className="text-xs text-text-muted">AI Catalog Configuration</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-accent-green font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" /> Active
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
                  {msg.role === "lily" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-[9px] font-bold">
                        Li
                      </div>
                      <span className="text-[11px] text-text-muted">{msg.timestamp}</span>
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-surface-muted/60 text-text-secondary"
                    }`}
                  >
                    {renderMarkdown(msg.content)}
                  </div>
                  {msg.options && msg.role === "lily" && PHASE_ORDER.indexOf(phase) <= PHASE_ORDER.indexOf("review") && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleOptionSelect(opt)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            opt.recommended
                              ? "border-primary text-primary bg-primary-50/30 hover:bg-primary-50/60"
                              : "border-border text-text-secondary hover:bg-surface-muted"
                          }`}
                        >
                          {opt.recommended && <Sparkles size={10} className="inline mr-1" />}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.role === "user" && (
                    <p className="text-[11px] text-text-muted text-right mt-1">{msg.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-[9px] font-bold">
                  Li
                </div>
                <div className="bg-surface-muted/60 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-5 py-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleUserInput(inputValue);
                  }
                }}
                placeholder={phase === "intro" ? "Type a template name..." : "Type a message or select an option above..."}
                className="flex-1 px-4 py-2.5 text-sm border border-border rounded-lg outline-none focus:border-primary/40 transition-colors"
                disabled={isTyping || phase === "complete"}
              />
              <button
                onClick={() => handleUserInput(inputValue)}
                disabled={!inputValue.trim() || isTyping || phase === "complete"}
                className="p-2.5 rounded-lg bg-primary text-white disabled:opacity-40 hover:bg-primary-dark transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Config panel — 1 col */}
        <div className="bg-white rounded-xl border border-border flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Template Configuration
                </p>
                <p className="text-sm font-semibold text-text-primary mt-1">
                  {config.name || "Unnamed Template"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Settings size={13} className="text-text-muted" />
                <span className="text-xs text-text-muted">{completedSteps}/4 set</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < completedSteps ? "bg-primary" : i === completedSteps && phaseIndex > 0 ? "bg-primary/30" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {configSteps.map((step) => {
              const isActive = phase === step.key;
              const isComplete = step.value != null;
              const isPending = !isComplete && !isActive;
              return (
                <div
                  key={step.key}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? "border-primary/40 bg-primary-50/20"
                      : isComplete
                      ? "border-accent-green/30 bg-green-50/20"
                      : "border-border bg-surface-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isComplete
                          ? "bg-accent-green/10 text-accent-green"
                          : isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-100 text-text-muted"
                      }`}
                    >
                      {isComplete ? <CheckCircle2 size={16} /> : <step.icon size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${isPending ? "text-text-muted" : "text-text-primary"}`}>
                        {step.label}
                      </p>
                      {isActive && !isComplete && (
                        <p className="text-[11px] text-primary font-medium">Configuring...</p>
                      )}
                    </div>
                    {isComplete && (
                      <span className="text-[10px] text-primary font-medium flex items-center gap-0.5">
                        <Sparkles size={9} /> AI-set
                      </span>
                    )}
                  </div>
                  {isComplete && (
                    <div className="ml-11">
                      <p className="text-sm font-medium text-text-primary capitalize">{step.value}</p>
                      {step.reasoning && (
                        <p className="text-xs text-text-muted mt-1">{step.reasoning}</p>
                      )}
                      <button className="text-[11px] text-text-muted hover:text-primary mt-2 flex items-center gap-1 transition-colors">
                        <RotateCcw size={10} /> Override
                      </button>
                    </div>
                  )}
                  {isPending && (
                    <p className="text-xs text-text-muted ml-11">Waiting...</p>
                  )}
                </div>
              );
            })}

            {phase === "review" || phase === "complete" ? (
              <div className="mt-4 p-4 bg-primary-50/30 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">Empty Container Ready</span>
                </div>
                <p className="text-xs text-text-secondary">
                  This template is a pre-configured catalog structure. Products will flow in automatically
                  from dynamic allocation when they meet eligibility criteria.
                </p>
                {phase === "complete" && (
                  <div className="mt-3 flex items-center gap-1.5 text-accent-green text-xs font-medium">
                    <CheckCircle2 size={12} /> Activated
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
