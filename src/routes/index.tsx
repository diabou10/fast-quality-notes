import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useTypologies, type Typology } from "@/hooks/use-typologies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "QualityNotes — Rédige tes notes d'évaluation qualité" },
      {
        name: "description",
        content:
          "Recherche instantanée, ajout, édition et copie en un clic de tes typologies d'évaluation qualité.",
      },
      { property: "og:title", content: "QualityNotes" },
      {
        property: "og:description",
        content:
          "Recherche instantanée, ajout, édition et copie en un clic de tes typologies d'évaluation qualité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

type EditorState =
  | { mode: "create" }
  | { mode: "edit"; typology: Typology }
  | null;

function Index() {
  const { typologies, addTypology, updateTypology, deleteTypology } =
    useTypologies();
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [toDelete, setToDelete] = useState<Typology | null>(null);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) {
      return typologies.map((t) => ({ typology: t, descriptions: t.descriptions }));
    }
    const out: { typology: Typology; descriptions: Typology["descriptions"] }[] = [];
    for (const t of typologies) {
      const titleMatch = norm(t.title).includes(q);
      const matched = t.descriptions.filter((d) => norm(d.text).includes(q));
      if (titleMatch) {
        out.push({ typology: t, descriptions: t.descriptions });
      } else if (matched.length > 0) {
        out.push({ typology: t, descriptions: matched });
      }
    }
    return out;
  }, [query, typologies]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1400);
    } catch {
      // no-op
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Quality Evaluation
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Typologies
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Recherche, édite et copie une description en un clic.
            </p>
          </div>
          <Button onClick={() => setEditor({ mode: "create" })} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" /> Ajouter
          </Button>
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
              placeholder="Rechercher une typologie (ex: Refund)…"
              className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-20 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
              aria-label="Rechercher une typologie"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 select-none rounded-md border border-border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground sm:inline-block">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </kbd>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {results.map(({ typology, descriptions }) => (
            <li
              key={typology.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-ring/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="truncate text-base font-semibold text-foreground">
                    {typology.title}
                  </h2>
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {typology.descriptions.length} variante
                    {typology.descriptions.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditor({ mode: "edit", typology })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground"
                    aria-label={`Modifier ${typology.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(typology)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Supprimer ${typology.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <ul className="mt-3 space-y-2">
                {descriptions.map((d) => {
                  const copied = copiedId === d.id;
                  return (
                    <li
                      key={d.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-3"
                    >
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {d.text}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(d.id, d.text)}
                        aria-label="Copier la description"
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
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
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}

          {results.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Aucune typologie ne correspond à «&nbsp;{query}&nbsp;».
              </p>
            </li>
          )}
        </ul>
      </div>

      <TypologyEditor
        state={editor}
        onClose={() => setEditor(null)}
        onCreate={(title, descs) => {
          addTypology(title, descs);
          setEditor(null);
        }}
        onUpdate={(id, title, descs) => {
          updateTypology(id, title, descs);
          setEditor(null);
        }}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer «&nbsp;{toDelete?.title}&nbsp;» ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les variantes seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteTypology(toDelete.id);
                setToDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type DraftDesc = { id?: string; text: string };

function TypologyEditor({
  state,
  onClose,
  onCreate,
  onUpdate,
}: {
  state: EditorState;
  onClose: () => void;
  onCreate: (title: string, descriptions: string[]) => void;
  onUpdate: (
    id: string,
    title: string,
    descriptions: DraftDesc[],
  ) => void;
}) {
  const open = state !== null;
  const [title, setTitle] = useState("");
  const [descs, setDescs] = useState<DraftDesc[]>([{ text: "" }]);

  useMemo(() => {
    if (state?.mode === "edit") {
      setTitle(state.typology.title);
      setDescs(
        state.typology.descriptions.map((d) => ({ id: d.id, text: d.text })),
      );
    } else if (state?.mode === "create") {
      setTitle("");
      setDescs([{ text: "" }]);
    }
  }, [state]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const cleaned = descs.filter((d) => d.text.trim().length > 0);
    if (cleaned.length === 0) return;
    if (state?.mode === "edit") {
      onUpdate(state.typology.id, trimmedTitle, cleaned);
    } else {
      onCreate(
        trimmedTitle,
        cleaned.map((d) => d.text),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {state?.mode === "edit" ? "Modifier la typologie" : "Nouvelle typologie"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Titre
            </label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Refund"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Descriptions ({descs.length})
            </label>
            <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
              {descs.map((d, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Textarea
                    value={d.text}
                    onChange={(e) =>
                      setDescs((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, text: e.target.value } : p,
                        ),
                      )
                    }
                    placeholder="Décris la typologie…"
                    className="min-h-[80px] flex-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDescs((prev) =>
                        prev.length === 1
                          ? [{ text: "" }]
                          : prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Supprimer la variante"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDescs((prev) => [...prev, { text: "" }])}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une variante
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
