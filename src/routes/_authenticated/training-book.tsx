import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import { TRAINING_BOOK_URL } from "@/data/training-book";

const trainingBookSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
});

export const Route = createFileRoute("/_authenticated/training-book")({
  validateSearch: trainingBookSearchSchema,
  component: TrainingBookPage,
  head: () => ({
    meta: [
      { title: "Training Book — QualityNotes" },
      {
        name: "description",
        content: "Consulte le processus de référence dans le Training Book.",
      },
      { property: "og:title", content: "Training Book — QualityNotes" },
      {
        property: "og:description",
        content: "Consulte le processus de référence dans le Training Book.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function TrainingBookPage() {
  const { page } = Route.useSearch();
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let blobUrl: string | null = null;

    void fetch(TRAINING_BOOK_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Training Book indisponible");
        return response.blob();
      })
      .then((blob) => {
        if (!active) return;
        blobUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        setDocumentUrl(`${blobUrl}#page=${page}&zoom=page-fit`);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [page]);

  if (failed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center text-destructive">
          <AlertCircle className="mx-auto h-8 w-8" />
          <p className="mt-3 text-sm font-medium">Le Training Book n’a pas pu être chargé.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <h1 className="text-sm font-semibold text-foreground">Training Book</h1>
        <span className="text-xs text-muted-foreground">Page {page}</span>
      </header>
      {documentUrl ? (
        <iframe
          title={`Training Book — page ${page}`}
          src={documentUrl}
          className="min-h-0 flex-1 border-0"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p className="inline-flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement de la page {page}…
          </p>
        </div>
      )}
    </main>
  );
}