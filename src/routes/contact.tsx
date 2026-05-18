import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Aureus Capital — Dubai Luxury Real Estate Advisory" },
      { name: "description", content: "Reach the Aureus Capital private office. Dubai, London and New York. Concierge advisors for international investors in Dubai luxury real estate." },
      { property: "og:title", content: "Contact Aureus Capital" },
      { property: "og:description", content: "Dubai · London · New York. Private office for international investors." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const offices = [
  { city: "Dubai", line1: "DIFC, Gate Village 11", line2: "Sheikh Zayed Road", phone: "+971 4 000 0000" },
  { city: "London", line1: "12 Berkeley Square", line2: "Mayfair, W1J", phone: "+44 20 0000 0000" },
  { city: "New York", line1: "Park Avenue Tower", line2: "Midtown, NY 10022", phone: "+1 212 000 0000" },
];

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Name: String(fd.get("name") ?? ""),
      Email: String(fd.get("email") ?? ""),
      Country: String(fd.get("country") ?? ""),
      Range: String(fd.get("range") ?? ""),
      Brief: String(fd.get("brief") ?? ""),
    };
    captureLead("Contact Partners", data);
    window.open(whatsappUrl(buildLeadMessage("Contact Partners", data)), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Private Office"
        title={<>Speak with a <span className="italic">private advisor</span></>}
        intro="All inquiries are received in confidence and routed to a senior partner. Response within one business day."
      />
      <section className="px-6 md:px-10 py-20 border-b border-border">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {sent ? (
            <div className="lg:col-span-2 border border-accent/40 p-10">
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Received</span>
              <h2 className="text-3xl font-serif mt-4">A partner will be in touch.</h2>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Your brief has been routed to the relevant office. We've opened a WhatsApp thread for any follow-up.
              </p>
            </div>
          ) : (
            <form className="lg:col-span-2 space-y-8" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Full Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Country of Residence" name="country" />
                <Field label="Investment Range (USD)" name="range" placeholder="e.g. $5M – $20M" />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
                  Brief
                </label>
                <textarea
                  name="brief"
                  rows={6}
                  maxLength={1500}
                  className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 text-sm transition-colors resize-none"
                  placeholder="Acquisition objective, timeline, residency interest…"
                />
              </div>
              <button type="submit" className="px-10 py-4 border border-accent/50 text-accent text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-accent-foreground transition-all duration-500">
                Send to Partners
              </button>
            </form>
          )}
          <aside className="space-y-10">
            {offices.map((o) => (
              <div key={o.city} className="border-l border-accent/40 pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{o.city}</p>
                <p className="text-sm text-muted-foreground mt-3">{o.line1}</p>
                <p className="text-sm text-muted-foreground">{o.line2}</p>
                <p className="text-sm font-mono mt-3">{o.phone}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        maxLength={255}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 text-sm transition-colors"
      />
    </div>
  );
}
