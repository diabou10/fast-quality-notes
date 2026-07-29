import { useCallback, useEffect, useState } from "react";
import { SEED_TYPOLOGIES } from "@/data/typologies-seed";

export type Typology = {
  id: string;
  title: string;
  descriptions: { id: string; text: string }[];
};

const STORAGE_KEY = "qualitynotes.typologies.v1";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function seed(): Typology[] {
  return SEED_TYPOLOGIES.map((t) => ({
    id: uid(),
    title: t.title,
    descriptions: t.descriptions.map((text) => ({ id: uid(), text })),
  }));
}

function load(): Typology[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as Typology[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

export function useTypologies() {
  const [typologies, setTypologies] = useState<Typology[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTypologies(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(typologies));
    } catch {
      // ignore
    }
  }, [typologies, hydrated]);

  const addTypology = useCallback(
    (title: string, descriptions: string[]) => {
      const clean = descriptions.map((t) => t.trim()).filter(Boolean);
      const id = uid();
      setTypologies((prev) => [
        {
          id,
          title: title.trim(),
          descriptions: clean.map((text) => ({ id: uid(), text })),
        },
        ...prev,
      ]);
      return id;
    },
    [],
  );

  const updateTypology = useCallback(
    (id: string, title: string, descriptions: { id?: string; text: string }[]) => {
      setTypologies((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title: title.trim(),
                descriptions: descriptions
                  .map((d) => ({ id: d.id ?? uid(), text: d.text.trim() }))
                  .filter((d) => d.text.length > 0),
              }
            : t,
        ),
      );
    },
    [],
  );

  const deleteTypology = useCallback((id: string) => {
    setTypologies((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetToSeed = useCallback(() => {
    setTypologies(seed());
  }, []);

  return {
    typologies,
    hydrated,
    addTypology,
    updateTypology,
    deleteTypology,
    resetToSeed,
  };
}
