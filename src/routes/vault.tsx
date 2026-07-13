import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Off-Market Vault — Aureus Capital" },
      { name: "description", content: "NDA-protected access to Dubai's most exclusive off-market luxury real estate — trophy villas, pre-launch branded residences and family-office resales." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "The Aureus Off-Market Vault" },
      { property: "og:description", content: "Private, NDA-protected Dubai luxury inventory." },
      { property: "og:url", content: "/vault" },
    ],
    links: [{ rel: "canonical", href: "/vault" }],
  }),
  component: VaultPage,
});

const teasers = [
  { code: "AC-247", area: "Palm Jumeirah · Frond M", type: "Trophy Villa", price: "$28.5M", tag: "Signature Estate" },
  { code: "AC-198", area: "Downtown · One Za'abeel", type: "Sky Mansion", price: "$23.0M", tag: "Pre-launch" },
  { code: "AC-321", area: "Bluewaters Island", type: "Bulgari Lighthouse", price: "$9.4M", tag: "Branded" },
  { code: "AC-402", area: "Emirates Hills · W-Sector", type: "Custom Mansion", price: "$42.0M", tag: "Family Office Resale" },
  { code: "AC-118", area: "Creek Harbour", type: "Waterfront Penthouse", price: "$6.8M", tag: "Off-plan" },
  { code: "AC-509", area: "Jumeirah Bay Island", type: "Bulgari Villa", price: "$36.0M", tag: "Ultra-scarcity" },
];

function VaultPage() {
  const [unlocked, setUnlocked] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Name: String(fd.get("name") ?? ""),
      Email: String(fd.get("email") ?? ""),
      Budget: String(fd.get("budget") ?? ""),
      Country: String(fd.get("country") ?? ""),
    };
    if (!data.Email) return;
    captureLead("Off-Market Vault", data);
    window.open(whatsappUrl(buildLeadMessage("Vault Access Request", data)), "_blank", "noopener,noreferrer");
    setUnlocked(true);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="NDA-Protected · Invitation Only"
        title={<>The Off-Market <span className="italic">Vault</span></>}
        intro="A discreet register of Dubai's most exclusive residential opportunities — pre-launch trophies, family-office resales, and branded residences never listed publicly."
      />

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border relative">
          {teasers.map((t) => (
            <div key={t.code} className="relative bg-background p-8 group">
              <div className={unlocked ? "" : "blur-md select-none pointer-events-none"}>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{t.code}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground border border-border px-2 py-1">{t.tag}</span>
                </div>
                <h3 className="text-2xl font-serif italic">{t.type}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t.area}</p>
                <div className="mt-8 pt-6 border-t border-border flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Guide</span>
                  <span className="font-serif text-xl">{t.price}</span>
                </div>
              </div>
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent border border-accent/40 px-3 py-1.5">Sealed</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {!unlocked && (
          <div className="max-w-2xl mx-auto mt-16 border border-accent/30 bg-foreground/[0.02] p-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Vault Access · Qualification</span>
            <h2 className="text-3xl font-serif italic mt-4 mb-3">Unlock private inventory</h2>
            <p className="text-sm text-muted-foreground mb-8">Access is issued to qualified investors only. Details are kept strictly confidential and never shared.</p>
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" placeholder="Full name" className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent" />
              <input name="email" type="email" required placeholder="Email" className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent" />
              <input name="country" placeholder="Country of residence" className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent" />
              <select name="budget" className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent">
                <option value="">Investment range</option>
                <option>$1M – $3M</option>
                <option>$3M – $10M</option>
                <option>$10M – $25M</option>
                <option>$25M+</option>
              </select>
              <button type="submit" className="sm:col-span-2 mt-2 px-6 py-4 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.3em] hover:brightness-110">
                Unlock the Vault
              </button>
            </form>
          </div>
        )}

        {unlocked && (
          <div className="max-w-2xl mx-auto mt-16 text-center border border-accent/40 p-10 bg-accent/5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Access Granted</span>
            <p className="text-2xl font-serif italic mt-4">A senior advisor is preparing your full dossier.</p>
            <p className="text-sm text-muted-foreground mt-3">Expect a discreet call within one business hour.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
