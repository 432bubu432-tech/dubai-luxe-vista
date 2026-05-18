import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  whatsappUrl,
  captureLead,
  buildLeadMessage,
  ADVISOR_PHONE,
  ADVISOR_EMAIL,
} from "@/lib/contact";

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
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Name: String(fd.get("name") ?? ""),
      Email: String(fd.get("email") ?? ""),
      Phone: String(fd.get("phone") ?? ""),
      Budget: String(fd.get("budget") ?? ""),
      Brief: String(fd.get("brief") ?? ""),
    };
    captureLead("Private Consultation", data);
    const url = whatsappUrl(buildLeadMessage("Private Consultation", data));
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Private Concierge"
        title={<>Speak with a <span className="italic">Dubai investment advisor</span></>}
        intro="A private, discreet conversation with our advisory desk. We respond to qualified requests within one business day."
      />

      <section className="px-6 md:px-10 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {submitted ? (
            <div className="border border-accent/40 p-10">
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Received</span>
              <h2 className="text-3xl font-serif mt-4">Your request is with a partner.</h2>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                A senior advisor will reply within one business day. We have also opened a WhatsApp thread so you can attach any reference material.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <Field label="Full Name" id="c-name" name="name" type="text" placeholder="Your name" />
              <Field label="Email" id="c-email" name="email" type="email" placeholder="you@firm.com" />
              <Field label="Phone (incl. country code)" id="c-phone" name="phone" type="tel" placeholder="+1 …" />
              <div>
                <label htmlFor="c-budget" className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Investment Budget
                </label>
                <select
                  id="c-budget"
                  name="budget"
                  defaultValue="$5M – $20M"
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
                  name="brief"
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
              <p className="text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em]">
                Submitting opens a secure WhatsApp thread with our desk.
              </p>
            </form>
          )}

          <aside className="space-y-10 border-l border-border pl-12">
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Direct</span>
              <p className="text-2xl font-serif mt-3 italic">{ADVISOR_PHONE}</p>
              <p className="text-sm text-muted-foreground mt-2">Sun–Thu, 09:00–19:00 GST</p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">WhatsApp Advisor</span>
              <p className="text-base font-serif mt-3">Instant access to a luxury concierge.</p>
              <a
                href={whatsappUrl("Hello Aureus Capital — I would like to speak with a private advisor.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1"
              >
                Open WhatsApp
              </a>
            </div>
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Email</span>
              <p className="text-sm mt-3">
                <a href={`mailto:${ADVISOR_EMAIL}`} className="hover:text-accent transition-colors">{ADVISOR_EMAIL}</a>
              </p>
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

function Field({ label, id, name, type, placeholder }: { label: string; id: string; name: string; type: string; placeholder: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        maxLength={255}
        placeholder={placeholder}
        className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
      />
    </div>
  );
}
