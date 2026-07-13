import { useEffect, useRef, useState } from "react";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";

type Msg = { role: "ai" | "user"; text: string; suggestions?: string[] };

const OPENING: Msg = {
  role: "ai",
  text:
    "Good evening. I'm Aurelia — your private Dubai investment concierge. I can help you compare communities, model ROI, unlock off-market inventory, or arrange a private consultation. Where shall we begin?",
  suggestions: [
    "Best areas for yield",
    "Can Americans buy in Dubai?",
    "Show me off-market villas",
    "Book a consultation",
  ],
};

// Lightweight intent engine — deterministic, luxury voice.
function respond(input: string): Msg {
  const q = input.toLowerCase();

  if (/\b(american|u\.?s\.?|usa|foreigner|citizen)\b/.test(q))
    return {
      role: "ai",
      text:
        "Yes — U.S. citizens hold full freehold rights in Dubai's designated zones, with no residency requirement, no capital gains tax, and unrestricted repatriation. Many of our American clients also secure a 10-year Golden Visa on qualifying acquisitions.",
      suggestions: ["Golden Visa pathway", "Recommended U.S. investor areas", "Book consultation"],
    };

  if (/\b(yield|roi|return|rental|income)\b/.test(q))
    return {
      role: "ai",
      text:
        "Dubai Marina and JVC currently lead on gross yield (8.5–9.4%). Palm Jumeirah and Bluewaters combine 7%+ yield with strong appreciation and scarcity. For net income modeling, I recommend our ROI calculator.",
      suggestions: ["Open ROI calculator", "Compare Marina vs Palm", "Off-market yield assets"],
    };

  if (/\b(palm|jumeirah|waterfront|beach|villa)\b/.test(q))
    return {
      role: "ai",
      text:
        "Palm Jumeirah remains the trophy waterfront address — average $1,650/sqft, 7.2% gross yield, and appreciation +12% YoY. We hold private inventory on Fronds G, K and M, including a Bulgari-branded lighthouse residence.",
      suggestions: ["Request Palm portfolio", "Compare with Bluewaters", "Book viewing"],
    };

  if (/\b(downtown|burj|penthouse|skyline)\b/.test(q))
    return {
      role: "ai",
      text:
        "Downtown Dubai delivers institutional-grade liquidity and prestige — 6.8% yield with 10% appreciation. Sky Residences and One Za'abeel Sky Mansions are our most requested penthouse assets.",
      suggestions: ["View sky residences", "Open dashboard preview", "Book consultation"],
    };

  if (/\b(off[- ]?market|private|vault|exclusive)\b/.test(q))
    return {
      role: "ai",
      text:
        "Our vault holds 40+ off-market opportunities — trophy villas, pre-launch branded residences, and family-office resales. Access is issued after a brief qualification.",
      suggestions: ["Unlock the Vault", "Book consultation"],
    };

  if (/\b(golden visa|residency|visa)\b/.test(q))
    return {
      role: "ai",
      text:
        "A single qualifying property of AED 2M+ (approx. $545K) secures a 10-year renewable Golden Visa covering spouse, children and household staff. Our legal team handles the entire pathway.",
      suggestions: ["Golden Visa consultation", "Qualifying properties"],
    };

  if (/\b(tax|capital gain|income tax)\b/.test(q))
    return {
      role: "ai",
      text:
        "Dubai imposes 0% personal income tax, 0% capital gains tax, and 0% annual property tax. A one-time 4% transfer fee applies at acquisition. It is one of the world's most efficient personal-tax jurisdictions.",
      suggestions: ["Compare with U.S. tax", "Book consultation"],
    };

  if (/\b(consult|book|advisor|call|speak|meet)\b/.test(q))
    return {
      role: "ai",
      text:
        "I'll arrange a private 30-minute call with a senior advisor. Would you prefer to continue on WhatsApp with our concierge, or leave your details for a discreet call-back?",
      suggestions: ["Continue on WhatsApp", "Leave my details"],
    };

  if (/\b(compare|vs|versus)\b/.test(q))
    return {
      role: "ai",
      text:
        "Our comparison engine benchmarks up to four districts across yield, appreciation, lifestyle, privacy and stability. I recommend starting with Palm Jumeirah vs Downtown vs Marina.",
      suggestions: ["Open comparison tool", "Recommend by budget"],
    };

  if (/\b(quiz|match|recommend|profile)\b/.test(q))
    return {
      role: "ai",
      text:
        "Our AI Investor Quiz maps your capital, intent and lifestyle to a bespoke Dubai allocation in under 60 seconds.",
      suggestions: ["Start the quiz", "Speak to advisor"],
    };

  return {
    role: "ai",
    text:
      "Understood. I can help with community intelligence, ROI modeling, off-market access, Golden Visa pathways, or arranging a private consultation. What would you like to explore?",
    suggestions: ["Best areas for yield", "Off-market inventory", "Golden Visa", "Book consultation"],
  };
}

export function AIConcierge() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([OPENING]);
  const [input, setInput] = useState("");
  const [showLead, setShowLead] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setInput("");
    const user: Msg = { role: "user", text: clean };
    setMsgs((m) => [...m, user]);
    setTimeout(() => setMsgs((m) => [...m, respond(clean)]), 380);
  }

  function handleSuggestion(s: string) {
    if (s === "Continue on WhatsApp") {
      window.open(whatsappUrl("I would like to speak with an Aureus Capital advisor."), "_blank", "noopener,noreferrer");
      return;
    }
    if (s === "Leave my details") { setShowLead(true); return; }
    if (s === "Open ROI calculator") { location.href = "/calculator"; return; }
    if (s === "Open comparison tool" || s === "Compare Marina vs Palm" || s === "Compare with Bluewaters") { location.href = "/compare"; return; }
    if (s === "Start the quiz") { location.href = "/quiz"; return; }
    if (s === "Unlock the Vault") { location.href = "/vault"; return; }
    if (s === "Open dashboard preview") { location.href = "/dashboard"; return; }
    send(s);
  }

  function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    if (!email) return;
    captureLead("AI Concierge", { Name: name, Email: email, Transcript: msgs.map((m) => `${m.role}: ${m.text}`).join(" | ") });
    window.open(whatsappUrl(buildLeadMessage("AI Concierge Handoff", { Name: name, Email: email })), "_blank", "noopener,noreferrer");
    setShowLead(false);
    setMsgs((m) => [...m, { role: "ai", text: "Thank you. A senior advisor will contact you within one business hour. In the meantime, feel free to keep exploring." }]);
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Concierge"
        className="fixed bottom-6 left-6 z-40 group flex items-center gap-3 pl-3 pr-5 py-3 bg-background/80 backdrop-blur-xl border border-accent/40 hover:border-accent transition-all shadow-[0_10px_40px_-10px_rgba(201,168,76,0.4)]"
      >
        <span className="relative flex h-8 w-8 items-center justify-center bg-accent text-accent-foreground font-serif italic text-sm">
          A
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/80 group-hover:text-accent transition-colors">
          Aurelia · AI
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-24 md:left-6 z-50 md:w-[420px] h-[85vh] md:h-[600px] flex flex-col bg-background/95 backdrop-blur-2xl border border-accent/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] animate-reveal">
          <header className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center bg-accent text-accent-foreground font-serif italic">
                A
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
              </span>
              <div>
                <p className="font-serif text-lg leading-none">Aurelia</p>
                <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-accent mt-1">Private Investment Concierge</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
          </header>

          <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div className={m.role === "user"
                  ? "max-w-[80%] px-4 py-3 bg-accent text-accent-foreground text-sm leading-relaxed"
                  : "max-w-[90%] text-sm leading-relaxed text-foreground/90"}>
                  {m.text}
                  {m.suggestions && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="px-3 py-1.5 border border-accent/40 text-[10px] uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showLead ? (
            <form onSubmit={submitLead} className="p-5 border-t border-border space-y-3 bg-foreground/[0.02]">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">Private call-back</p>
              <input name="name" placeholder="Full name" className="w-full bg-transparent border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
              <input name="email" type="email" required placeholder="Email" className="w-full bg-transparent border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
              <button type="submit" className="w-full px-4 py-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em]">Request Call-back</button>
            </form>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-4 border-t border-border flex gap-2 bg-foreground/[0.02]"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aurelia anything…"
                className="flex-1 bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
              <button type="submit" className="px-4 py-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em]">Send</button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
