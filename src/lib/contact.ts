// Central contact + lead capture utilities.
// Update WHATSAPP_NUMBER (international format, digits only) and EMAIL
// to your live operations channels.

export const WHATSAPP_NUMBER = "971585000000";
export const ADVISOR_EMAIL = "private@aureus-capital.ae";
export const ADVISOR_PHONE = "+971 4 000 0000";

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export type LeadPayload = Record<string, string | number | undefined>;

export function buildLeadMessage(intent: string, data: LeadPayload) {
  const lines = [`Aureus Capital — ${intent}`, ""];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === "") continue;
    lines.push(`${k}: ${v}`);
  }
  return lines.join("\n");
}

// Lightweight client-side capture: persists to localStorage so leads are
// not lost before a backend is wired, and dispatches a CustomEvent so
// analytics or a future server function can subscribe.
export function captureLead(intent: string, data: LeadPayload) {
  if (typeof window === "undefined") return;
  try {
    const key = "aureus.leads";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
    const entry = { intent, data, at: new Date().toISOString() };
    prev.push(entry);
    localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
    window.dispatchEvent(new CustomEvent("aureus:lead", { detail: entry }));
  } catch {
    // ignore
  }
}
