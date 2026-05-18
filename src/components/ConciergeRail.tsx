import { Link } from "@tanstack/react-router";
import { whatsappUrl } from "@/lib/contact";

export function ConciergeRail() {
  return (
    <div className="fixed right-6 bottom-8 z-40 flex flex-col gap-3 items-end">
      <a
        href={whatsappUrl("Hello Aureus Capital — I would like to speak with a private advisor about Dubai luxury real estate.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Advisor"
        className="group flex items-center gap-3 px-4 h-12 bg-surface border border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300"
      >
        <span className="size-1.5 rounded-full bg-accent group-hover:bg-accent-foreground" />
        <span className="text-[10px] uppercase tracking-[0.25em]">WhatsApp Advisor</span>
      </a>
      <Link
        to="/concierge"
        className="hidden md:flex h-48 w-12 bg-accent text-accent-foreground items-center justify-center [writing-mode:vertical-lr] text-[10px] uppercase tracking-[0.3em] font-medium hover:brightness-110"
      >
        Book Consultation
      </Link>
    </div>
  );
}
