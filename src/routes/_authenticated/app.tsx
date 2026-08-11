import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileX,
  Layers,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { findTrainingRefs } from "@/data/training-book";
import {
  useTypologies,
  type Typology,
  type DescriptionKind,
} from "@/hooks/use-typologies";
import {
  downloadTypologiesTemplate,
  parseTypologiesFile,
  type ImportRow,
} from "@/lib/excel-typologies";
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
  const {
    typologies,
    loading,
    saving,
    addTypology,
    updateTypology,
    deleteTypology,
    importRows,
  } = useTypologies();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [toDelete, setToDelete] = useState<Typology | null>(null);
  const [kindFilter, setKindFilter] = useState<"all" | DescriptionKind>("all");
  const [importOpen, setImportOpen] = useState(false);


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
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="mr-1.5 h-4 w-4" /> Importer Excel
            </Button>
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

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={importRows}
      />
    </div>
  );
}

function ImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (
    rows: ImportRow[],
    mode: "merge" | "replace",
  ) => Promise<{ created: number; added: number; typologies: number }>;
}) {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [skipped, setSkipped] = useState(0);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setRows([]);
    setFileName("");
    setSkipped(0);
    setMode("merge");
    setError(null);
    setBusy(false);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setFileName(file.name);
    try {
      const res = await parseTypologiesFile(file);
      setRows(res.rows);
      setSkipped(res.skipped);
      if (res.rows.length === 0)
        setError(
          "Aucune ligne valide trouvée. Vérifie les colonnes Typologie, Statut et Description.",
        );
    } catch {
      setRows([]);
      setError("Fichier illisible. Utilise le modèle Excel (.xlsx ou .csv).");
    }
  };

  const handleImport = async () => {
    setBusy(true);
    try {
      await onImport(rows, mode);
      reset();
      onClose();
    } catch {
      setError("L'import a échoué. Réessaie.");
      setBusy(false);
    }
  };

  const typologyCount = useMemo(
    () => new Set(rows.map((r) => r.title)).size,
    [rows],
  );

  const passCount = useMemo(
    () => rows.filter((r) => r.kind === "pass").length,
    [rows],
  );

  const failCount = useMemo(
    () => rows.filter((r) => r.kind === "fail").length,
    [rows],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <div className="bg-gradient-to-br from-primary/10 via-info/5 to-background px-6 pb-5 pt-6">
          <DialogHeader className="text-left">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-card text-primary shadow-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Importer depuis Excel
            </DialogTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Charge ton fichier pour enrichir ou remplacer ta base de typologies.
            </p>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-2">
          {/* Modèle */}
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Format attendu : 3 colonnes
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Typologie</span>,{" "}
                <span className="font-semibold text-foreground">Statut</span> (Pass/Fail),{" "}
                <span className="font-semibold text-foreground">Description</span>.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => downloadTypologiesTemplate()}
            >
              Modèle
            </Button>
          </div>

          {/* Zone de drop */}
          {!rows.length ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <input
                id="import-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              <div className="pointer-events-none mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                Glisse un fichier ici, ou clique pour parcourir
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                .xlsx, .xls, .csv — jusqu'à 2 000 lignes
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-success/25 bg-success/5 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-success/20 bg-success/10 text-success">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{fileName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {rows.length} ligne{rows.length > 1 ? "s" : ""} valide
                  {rows.length > 1 ? "s" : ""} sur {typologyCount} typologie
                  {typologyCount > 1 ? "s" : ""}
                  {skipped > 0 && (
                    <span className="ml-1 text-warning">
                      · {skipped} ignorée{skipped > 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Changer de fichier"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Stats */}
          {rows.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
                <p className="text-lg font-semibold text-foreground">{rows.length}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Description{rows.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="rounded-xl border border-success/25 bg-success/5 p-3 text-center">
                <p className="text-lg font-semibold text-success">{passCount}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-success/80">
                  Pass
                </p>
              </div>
              <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-center">
                <p className="text-lg font-semibold text-destructive">{failCount}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-destructive/80">
                  Fail
                </p>
              </div>
            </div>
          )}

          {/* Aperçu */}
          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Aperçu ({Math.min(rows.length, 20)} sur {rows.length})
              </p>
              <div className="max-h-44 overflow-y-auto rounded-xl border border-border bg-card p-1">
                {rows.slice(0, 20).map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted/40"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        r.kind === "pass"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {r.kind}
                    </span>
                    <span className="shrink-0 font-medium text-foreground">{r.title}</span>
                    <span className="min-w-0 truncate text-muted-foreground">{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode */}
          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mode d'import
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("merge")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                    mode === "merge"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
                      mode === "merge"
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Ajouter à ma base</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Les nouvelles lignes viennent compléter tes typologies existantes.
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("replace")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                    mode === "replace"
                      ? "border-destructive bg-destructive/5 shadow-sm"
                      : "border-border bg-card hover:border-destructive/30"
                  }`}
                >
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
                      mode === "replace"
                        ? "border-destructive/20 bg-destructive/10 text-destructive"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Remplacer ma base</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Supprime toutes tes typologies actuelles avant d'importer.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
              <FileX className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {fileName && !error && rows.length === 0 && !busy && (
            <div className="flex items-center gap-2 rounded-xl border border-info/25 bg-info/5 p-3 text-sm text-info">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyse de {fileName}…</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t border-border bg-muted/20 px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Annuler
          </Button>
          <Button
            onClick={() => void handleImport()}
            disabled={rows.length === 0 || busy}
            className="min-w-[8rem]"
          >
            {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Importer {rows.length > 0 ? `(${rows.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
