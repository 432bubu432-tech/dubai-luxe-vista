import { useCallback, useEffect, useState } from "react";

const KEY = "aureus:saved";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/** Client-side saved-property shortlist (no account required). */
export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(read());
    const sync = () => setSaved(read());
    window.addEventListener("aureus:saved", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("aureus:saved", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const next = read().includes(slug) ? read().filter((s) => s !== slug) : [...read(), slug];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("aureus:saved"));
  }, []);

  return { saved, toggle, isSaved: (slug: string) => saved.includes(slug) };
}
