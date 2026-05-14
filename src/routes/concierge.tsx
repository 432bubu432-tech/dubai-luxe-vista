import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/concierge")({
  head: () => ({
    meta: [
      { title: "Private Concierge — Aureus Capital" },
      { name: "description", content: "Request a private investment consultation with our Dubai advisory team. Calendar booking, WhatsApp, and direct lines." },
      { property: "og:title", content: "Private Concierge — Aureus Capital" },
      { property: "og:description", content: "Request a private Dubai investment consultation." },
      { property: "og:url", content: "/concierge" },
    ],
    links: [{ rel: "canonical", href: "/concierge" }],
  }),
  component: ConciergePage,
});

function ConciergePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Private Concierge"
        title={<>Speak with a <span className="italic">Dubai investment advisor</span></>}
        intro="A private, discreet conversation with our advisory desk. We respond to qualified requests within one business day."
      />

      <section className="px-6 md:px-10 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Field label="Full Name" id="c-name" type="text" placeholder="Your name" />
            <Field label="Email" id="c-email" type="email" placeholder="you@firm.com" />
            <Field label="Phone (incl. country code)" id="c-phone" type="tel" placeholder="+1 …" />
            <div>
              <label htmlFor="c-budget" className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Investment Budget
              </label>
              <select
                id="c-budget"
                className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                <option className="bg-background">Under $1M</option>
                <option className="bg-background">$1M – $5M</option>
                <option className="bg-background">$5M – $20M</option>
                <option className="bg-background">$20M+</option>
              </select>
            </div>
            <div>
              <label htmlFor="c-msg" className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Brief
              </label>
              <textarea
                id="c-msg"
                rows={4}
                maxLength={1000}
                placeholder="Investment goal, timeline, lifestyle preferences…"
                className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:brightness-110 transition-all"
            >
              Request Private Consultation
            </button>
          </form>

          <aside className="space-y-10 border-l border-border pl-12">
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Direct</span>
              <p className="text-2xl font-serif mt-3 italic">+971 4 000 0000</p>
              <p className="text-sm text-muted-foreground mt-2">Sun–Thu, 09:00–19:00 GST</p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">WhatsApp Advisor</span>
              <p className="text-base font-serif mt-3">Instant access to a luxury concierge.</p>
              <a href="https://wa.me/97100000000" className="inline-block mt-4 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1">
                Open WhatsApp
              </a>
            </div>
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Headquarters</span>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                DIFC Precinct Building 4<br />
                Level 12, Gate District<br />
                Dubai, UAE
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, id, type, placeholder }: { label: string; id: string; type: string; placeholder: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        maxLength={255}
        placeholder={placeholder}
        className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
      />
    </div>
  );
}
