import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "QualityNotes — Rédige tes notes d'évaluation qualité" },
      {
        name: "description",
        content:
          "Recherche instantanée et copie en un clic de tes typologies d'évaluation qualité.",
      },
      { property: "og:title", content: "QualityNotes" },
      {
        property: "og:description",
        content:
          "Recherche instantanée et copie en un clic de tes typologies d'évaluation qualité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Typology = {
  title: string;
  description: string;
  category: "Recovery" | "Device" | "Communication" | "Process" | "Empathy";
};

const TYPOLOGIES: Typology[] = [
  {
    title: "Recovery Pass",
    category: "Recovery",
    description:
      "Le représentant a identifié le blocage du client et fourni la solution exacte.",
  },
  {
    title: "Recovery Fail",
    category: "Recovery",
    description: "Échec dans l'identification de la solution appropriée.",
  },
  {
    title: "Device Match",
    category: "Device",
    description: "Le modèle a été correctement identifié.",
  },
  {
    title: "Device Mismatch",
    category: "Device",
    description:
      "Le modèle de l'appareil n'a pas été correctement identifié, entraînant une orientation erronée du diagnostic.",
  },
  {
    title: "Empathy Pass",
    category: "Empathy",
    description:
      "Le représentant a fait preuve d'empathie et a reconnu la frustration du client de manière sincère.",
  },
  {
    title: "Empathy Fail",
    category: "Empathy",
    description:
      "Absence d'empathie : le représentant n'a pas reconnu la situation ou les émotions du client.",
  },
  {
    title: "Communication Clear",
    category: "Communication",
    description:
      "Les explications fournies étaient claires, concises et adaptées au niveau technique du client.",
  },
  {
    title: "Communication Unclear",
    category: "Communication",
    description:
      "Les explications étaient confuses ou trop techniques, ce qui a nui à la compréhension du client.",
  },
  {
    title: "Process Compliant",
    category: "Process",
    description:
      "Le représentant a respecté l'ensemble de la procédure interne attendue pour ce type de dossier.",
  },
  {
    title: "Process Deviation",
    category: "Process",
    description:
      "Non-respect d'une ou plusieurs étapes clés de la procédure interne établie.",
  },
  {
    title: "Hold Handled",
    category: "Process",
    description:
      "La mise en attente a été correctement annoncée, justifiée et suivie d'un remerciement au retour.",
  },
  {
    title: "Hold Mishandled",
    category: "Process",
    description:
      "La mise en attente n'a pas été annoncée ou a été excessive sans mise à jour du client.",
  },
  {
    title: "Escalation Correct",
    category: "Process",
    description:
      "Le dossier a été correctement escaladé vers le bon niveau de support avec un contexte complet.",
  },
  {
    title: "Ownership Taken",
    category: "Recovery",
    description:
      "Le représentant a pris la pleine responsabilité du dossier jusqu'à sa résolution sans transfert inutile.",
  },
];

function Index() {
  const [query, setQuery] = useState("");
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TYPOLOGIES;
    return TYPOLOGIES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [query]);

  const handleCopy = async (t: Typology) => {
    try {
      await navigator.clipboard.writeText(t.description);
      setCopiedTitle(t.title);
      setTimeout(
        () => setCopiedTitle((c) => (c === t.title ? null : c)),
        1400,
      );
    } catch {
      // no-op
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Quality Evaluation
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Typologies
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recherche une typologie et copie sa description en un clic.
          </p>
        </header>

        <div className="sticky top-4 z-10">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une typologie (ex: Recovery)…"
              className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-16 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
              aria-label="Rechercher une typologie"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 select-none rounded-md border border-border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground sm:inline-block">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </kbd>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {results.map((t) => {
            const copied = copiedTitle === t.title;
            return (
              <li
                key={t.title}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-ring/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-base font-semibold text-foreground">
                        {t.title}
                      </h2>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {t.category}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(t)}
                    aria-label={`Copier la description de ${t.title}`}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      copied
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground/40 hover:bg-muted"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copier
                      </>
                    )}
                  </button>
                </div>
              </li>
            );
          })}

          {results.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Aucune typologie ne correspond à «&nbsp;{query}&nbsp;».
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
