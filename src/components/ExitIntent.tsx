import { useEffect, useState } from "react";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";

const STORAGE_KEY = "aureus.exitintent.shown";

export function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let armed = false;
    const armTimer = window.setTimeout(() => { armed = true; }, 15000);

    const onMouseLeave = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY <= 0 && e.relatedTarget === null) trigger();
    };

    // Mobile: trigger on rapid scroll-up after meaningful engagement.
    let lastY = window.scrollY;
    let maxY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      maxY = Math.max(maxY, y);
      if (armed && maxY > 800 && lastY - y > 120) trigger();
      lastY = y;
    };

    function trigger() {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Name: String(fd.get("name") ?? ""),
      Email: String(fd.get("email") ?? ""),
      Phone: String(fd.get("phone") ?? ""),
      Budget: String(fd.get("budget") ?? ""),
      Source: "Exit Intent — Off-Market Access",
    };
    captureLead("Off-Market Access", data);
    window.open(whatsappUrl(buildLeadMessage("Off-Market Access", data)), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-reveal">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-2xl border border-accent/40 bg-background shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.25), transparent 60%), radial-gradient(ellipse at bottom left, rgba(232,93,58,0.15), transparent 60%)" }} />
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 z-10 size-8 flex items-center justify-center text-muted-foreground hover:text-accent">×</button>
        <div className="relative p-10 md:p-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">Private Invitation</span>
          {submitted ? (
            <>
              <h2 className="font-serif text-3xl md:text-4xl italic mt-4">Access granted.</h2>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">A partner will share off-market inventory within one business day. We have also opened a WhatsApp thread for live questions.</p>
              <button onClick={() => setOpen(false)} className="mt-8 text-[10px] uppercase tracking-[0.3em] text-accent border-b border-accent/40 pb-1">Continue browsing</button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-3xl md:text-4xl italic mt-4 leading-tight">Before you leave —<br/>unlock off-market<br/>Dubai luxury inventory.</h2>
              <p className="text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">Receive Dubai's luxury investment intelligence report and a curated shortlist of private opportunities not listed publicly.</p>
              <form onSubmit={onSubmit} className="mt-8 space-y-3">
                <input required name="name" placeholder="Full name" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input required type="email" name="email" placeholder="Email" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none" />
                  <input required type="tel" name="phone" placeholder="Phone" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none" />
                </div>
                <select name="budget" defaultValue="$5M – $20M" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-accent outline-none">
                  <option className="bg-background">Under $1M</option>
                  <option className="bg-background">$1M – $5M</option>
                  <option className="bg-background">$5M – $20M</option>
                  <option className="bg-background">$20M+</option>
                </select>
                <button className="w-full bg-accent text-accent-foreground py-4 text-xs uppercase tracking-[0.3em] hover:brightness-110">Unlock Private Access</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
