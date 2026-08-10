import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { findTrainingRefs } from "@/data/training-book";
import {
  useTypologies,
  type Typology,
  type DescriptionKind,
} from "@/hooks/use-typologies";
import { supabase } from "@/integrations/supabase/client";
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

export const Route = createFileRoute("/_authenticated/app")({
  component: AppPage,
  head: () => ({
    meta: [
      { title: "Mes typologies — QualityNotes" },
      {
        name: "description",
        content:
          "Recherche instantanée, ajout, édition et copie en un clic de tes typologies d'évaluation qualité.",
      },
      { property: "og:title", content: "Mes typologies — QualityNotes" },
      {
        property: "og:description",
        content: "Ta base personnelle de typologies d'évaluation qualité.",
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

function AppPage() {
  const { typologies, loading, saving, addTypology, updateTypology, deleteTypology } =
    useTypologies();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [toDelete, setToDelete] = useState<Typology | null>(null);
  const [kindFilter, setKindFilter] = useState<"all" | DescriptionKind>("all");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const results = useMemo(() => {
    const q = norm(query.trim());
    const out: { typology: Typology; descriptions: Typology["descriptions"] }[] = [];
    for (const t of typologies) {
      const pool = t.descriptions.filter(
        (d) => kindFilter === "all" || d.kind === kindFilter,
      );
      if (pool.length === 0) continue;
      if (!q) {
        out.push({ typology: t, descriptions: pool });
        continue;
      }
      const titleMatch = norm(t.title).includes(q);
      const matched = pool.filter((d) => norm(d.text).includes(q));
      if (titleMatch) out.push({ typology: t, descriptions: pool });
      else if (matched.length > 0) out.push({ typology: t, descriptions: matched });
    }
    return out;
  }, [query, typologies, kindFilter]);

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
    <div className="min-h-screen bg-gradient-to-b from-accent/40 via-background to-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Quality Evaluation
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-primary to-info bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
              Typologies
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {email ? `Base privée de ${email}` : "Recherche, édite et copie en un clic."}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {saving && (
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enregistrement…
              </span>
            )}
            <Button onClick={() => setEditor({ mode: "create" })}>
              <Plus className="mr-1.5 h-4 w-4" /> Ajouter
            </Button>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Se déconnecter"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
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
              className="w-full rounded-2xl border border-primary/25 bg-card py-4 pl-12 pr-20 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
              aria-label="Rechercher une typologie"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 select-none rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary sm:inline-block">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </kbd>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {(["all", "pass", "fail"] as const).map((k) => {
            const active = kindFilter === k;
            const activeClass =
              k === "pass"
                ? "border-success bg-success text-success-foreground"
                : k === "fail"
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : "border-primary bg-primary text-primary-foreground";
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKindFilter(k)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? activeClass
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {k === "all" ? "Tout" : k === "pass" ? "Pass" : "Fail"}
              </button>
            );
          })}
        </div>


        <ul className="mt-6 space-y-3">
          {results.map(({ typology, descriptions }) => (
            <li
              key={typology.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-primary to-info" aria-hidden />
                  <h2 className="truncate text-base font-semibold text-foreground">
                    {typology.title}
                  </h2>
                  <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                    {typology.descriptions.filter((d) => d.kind === "pass").length} pass
                  </span>
                  <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-destructive">
                    {typology.descriptions.filter((d) => d.kind === "fail").length} fail
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditor({ mode: "edit", typology })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"

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
                  const refs =
                    d.kind === "fail" ? findTrainingRefs(typology.title, d.text) : [];
                  const justification = refs
                    .map((r) => `${r.title} (${r.page}) : ${r.excerpt}`)
                    .join("\n\n");
                  const copiedWithRef = copiedId === `${d.id}-ref`;
                  return (
                    <li
                      key={d.id}
                      className={`rounded-xl border p-3 transition ${
                        d.kind === "pass"
                          ? "border-success/25 bg-success/5"
                          : "border-destructive/25 bg-destructive/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span
                            className={`mb-1.5 inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              d.kind === "pass"
                                ? "border-success/30 bg-success/15 text-success"
                                : "border-destructive/30 bg-destructive/15 text-destructive"
                            }`}
                          >
                            {d.kind}
                          </span>
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {d.text}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(d.id, d.text)}
                          aria-label="Copier la description"
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                            copied
                              ? "border-success bg-success text-success-foreground"
                              : "border-primary/30 bg-card text-primary hover:bg-primary hover:text-primary-foreground"
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

                      {refs.length > 0 && (
                        <div className="mt-3 rounded-lg border border-info/30 bg-info/5 p-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-info">
                              <BookOpen className="h-3.5 w-3.5" /> Justification — Training Book
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  `${d.id}-ref`,
                                  `${d.text}\n\nRéférence Training Book :\n${justification}`,
                                )
                              }
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                                copiedWithRef
                                  ? "border-success bg-success text-success-foreground"
                                  : "border-info/40 bg-card text-info hover:bg-info hover:text-info-foreground"
                              }`}
                            >
                              {copiedWithRef ? (
                                <>
                                  <Check className="h-3 w-3" /> Copié
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copier avec justification
                                </>
                              )}
                            </button>
                          </div>
                          <ul className="mt-2 space-y-2">
                            {refs.map((r) => (
                              <li key={r.id} className="text-xs leading-relaxed">
                                <span className="font-semibold text-foreground">
                                  {r.title}
                                </span>{" "}
                                <span className="text-muted-foreground">({r.page})</span>
                                <p className="mt-0.5 text-muted-foreground">{r.excerpt}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}

          {loading && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Chargement de ta base…
              </p>
            </li>
          )}

          {!loading && results.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                {query
                  ? `Aucune typologie ne correspond à «\u00a0${query}\u00a0».`
                  : "Aucune typologie pour l'instant. Ajoute la première."}
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
            <AlertDialogTitle>
              Supprimer «&nbsp;{toDelete?.title}&nbsp;» ?
            </AlertDialogTitle>
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

type DraftDesc = { id?: string; kind: DescriptionKind; text: string };

function TypologyEditor({
  state,
  onClose,
  onCreate,
  onUpdate,
}: {
  state: EditorState;
  onClose: () => void;
  onCreate: (
    title: string,
    descriptions: { kind: DescriptionKind; text: string }[],
  ) => void;
  onUpdate: (id: string, title: string, descriptions: DraftDesc[]) => void;
}) {
  const open = state !== null;
  const [title, setTitle] = useState("");
  const [descs, setDescs] = useState<DraftDesc[]>([{ kind: "pass", text: "" }]);

  useEffect(() => {
    if (state?.mode === "edit") {
      setTitle(state.typology.title);
      setDescs(
        state.typology.descriptions.map((d) => ({
          id: d.id,
          kind: d.kind,
          text: d.text,
        })),
      );
    } else if (state?.mode === "create") {
      setTitle("");
      setDescs([{ kind: "pass", text: "" }]);
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
        cleaned.map((d) => ({ kind: d.kind, text: d.text })),
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
            <label className="text-xs font-medium text-muted-foreground">Titre</label>
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
                  <div className="mt-1 flex flex-col gap-1">
                    {(["pass", "fail"] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() =>
                          setDescs((prev) =>
                            prev.map((p, i) => (i === idx ? { ...p, kind: k } : p)),
                          )
                        }
                        className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase transition ${
                          d.kind === k
                            ? k === "pass"
                              ? "border-success bg-success text-success-foreground"
                              : "border-destructive bg-destructive text-destructive-foreground"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}

                      >
                        {k}
                      </button>
                    ))}
                  </div>
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
                          ? [{ kind: "pass", text: "" }]
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
              onClick={() => setDescs((prev) => [...prev, { kind: "pass", text: "" }])}
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
