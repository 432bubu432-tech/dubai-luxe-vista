import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Find My Ideal Dubai Investment — Aureus Capital" },
      { name: "description", content: "AI-powered Dubai luxury property recommendation. Personalised community, asset and ROI match in under two minutes." },
      { property: "og:title", content: "Find My Ideal Dubai Investment" },
      { property: "og:description", content: "AI-powered Dubai luxury property recommendation in under two minutes." },
      { property: "og:url", content: "/quiz" },
    ],
    links: [{ rel: "canonical", href: "/quiz" }],
  }),
  component: QuizPage,
});

type Choice = { value: string; label: string; hint?: string };
type Question = { id: string; title: string; subtitle: string; choices: Choice[] };

const questions: Question[] = [
  { id: "budget", title: "Investment budget", subtitle: "Capital available for this allocation.", choices: [
    { value: "1-3", label: "$1M – $3M" },
    { value: "3-10", label: "$3M – $10M" },
    { value: "10-25", label: "$10M – $25M" },
    { value: "25+", label: "$25M+" },
  ]},
  { id: "intent", title: "Primary intent", subtitle: "What this acquisition must deliver.", choices: [
    { value: "yield", label: "Cash yield" },
    { value: "appreciation", label: "Capital appreciation" },
    { value: "residency", label: "Residency / Golden Visa" },
    { value: "lifestyle", label: "Lifestyle residence" },
  ]},
  { id: "horizon", title: "Hold horizon", subtitle: "Expected investment window.", choices: [
    { value: "short", label: "1 – 3 years" },
    { value: "mid", label: "3 – 7 years" },
    { value: "long", label: "7+ years" },
  ]},
  { id: "vibe", title: "Preferred setting", subtitle: "The world you want to live in.", choices: [
    { value: "waterfront", label: "Waterfront & beach" },
    { value: "skyline", label: "Skyline & downtown" },
    { value: "golf", label: "Golf & estate" },
    { value: "urban", label: "Marina & urban" },
  ]},
  { id: "use", title: "Use profile", subtitle: "How it will be lived in.", choices: [
    { value: "primary", label: "Primary residence" },
    { value: "vacation", label: "Vacation home" },
    { value: "rental", label: "Short-term rental" },
    { value: "hold", label: "Pure hold asset" },
  ]},
];

function recommend(a: Record<string, string>) {
  const community =
    a.vibe === "waterfront" ? "Palm Jumeirah & Bluewaters"
    : a.vibe === "skyline" ? "Downtown Dubai & Business Bay"
    : a.vibe === "golf" ? "Emirates Hills & Dubai Hills Estate"
    : "Dubai Marina & Creek Harbour";
  const asset =
    a.budget === "25+" ? "Signature waterfront mansion"
    : a.budget === "10-25" ? "Branded residence penthouse"
    : a.budget === "3-10" ? "Sky-residence or villa"
    : "Boutique branded residence";
  const yieldBand =
    a.use === "rental" ? "8 – 11% gross"
    : a.intent === "yield" ? "6 – 9% gross"
    : "5 – 7% gross";
  const strategy =
    a.intent === "appreciation" ? "Off-plan capital growth allocation"
    : a.intent === "residency" ? "Golden Visa qualifying acquisition"
    : a.intent === "lifestyle" ? "Trophy lifestyle residence"
    : "Income-producing branded inventory";
  return { community, asset, yieldBand, strategy };
}

function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"quiz" | "capture" | "result">("quiz");

  const rec = useMemo(() => recommend(answers), [answers]);
  const q = questions[step];
  const progress = ((step + (stage === "quiz" ? 0 : 1)) / (questions.length + 1)) * 100;

  function pick(v: string) {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
    else setStage("capture");
  }

  function onCapture(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Name: String(fd.get("name") ?? ""),
      Email: String(fd.get("email") ?? ""),
      Phone: String(fd.get("phone") ?? ""),
      Budget: answers.budget ?? "",
      Intent: answers.intent ?? "",
      Horizon: answers.horizon ?? "",
      Setting: answers.vibe ?? "",
      Use: answers.use ?? "",
      Match: `${rec.asset} in ${rec.community}`,
    };
    captureLead("AI Property Quiz", data);
    setStage("result");
  }

  return (
    <PageShell>
      <section className="min-h-[calc(100vh-5rem)] px-6 md:px-10 py-16 flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">AI Investor Match</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-px bg-border mb-12 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>

          {stage === "quiz" && (
            <div key={q.id} className="animate-reveal">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Question {step + 1} of {questions.length}</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-3 italic">{q.title}</h1>
              <p className="text-muted-foreground mb-10">{q.subtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.choices.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => pick(c.value)}
                    className="text-left p-6 border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                  >
                    <span className="block font-serif text-xl">{c.label}</span>
                    {c.hint && <span className="block text-xs text-muted-foreground mt-2">{c.hint}</span>}
                    <span className="block mt-4 text-[10px] uppercase tracking-[0.25em] text-accent opacity-0 group-hover:opacity-100 transition">Select →</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="mt-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent">
                  ← Previous
                </button>
              )}
            </div>
          )}

          {stage === "capture" && (
            <form onSubmit={onCapture} className="animate-reveal space-y-6 max-w-xl">
              <h1 className="text-4xl font-serif italic mb-3">Unlock your portfolio</h1>
              <p className="text-muted-foreground mb-8">Your private match is ready. Share contact details to receive the AI-generated investment dossier.</p>
              <input required name="name" placeholder="Full name" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none" />
              <input required type="email" name="email" placeholder="Email" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none" />
              <input required type="tel" name="phone" placeholder="Phone (incl. country code)" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none" />
              <button className="w-full bg-accent text-accent-foreground py-4 text-xs uppercase tracking-[0.3em] hover:brightness-110">Unlock My Dubai Portfolio</button>
            </form>
          )}

          {stage === "result" && (
            <div className="animate-reveal">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">Your Match</span>
              <h1 className="text-4xl md:text-5xl font-serif italic mt-4 mb-10">A bespoke allocation</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border mb-10">
                <Cell label="Recommended Community" value={rec.community} />
                <Cell label="Asset Class" value={rec.asset} />
                <Cell label="Indicative Yield" value={rec.yieldBand} />
                <Cell label="Strategy" value={rec.strategy} />
              </div>
              <a
                href={whatsappUrl(buildLeadMessage("AI Property Quiz Result", { Match: `${rec.asset} in ${rec.community}`, Yield: rec.yieldBand, Strategy: rec.strategy }))}
                target="_blank" rel="noopener noreferrer"
                className="inline-block bg-accent text-accent-foreground px-8 py-4 text-xs uppercase tracking-[0.3em] hover:brightness-110"
              >
                Discuss with an Advisor
              </a>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{label}</span>
      <p className="font-serif text-2xl mt-3">{value}</p>
    </div>
  );
}
