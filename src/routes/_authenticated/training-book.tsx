import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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
  const documentUrl = `/api/training-book#page=${page}&zoom=page-fit`;

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <h1 className="text-sm font-semibold text-foreground">Training Book</h1>
        <span className="text-xs text-muted-foreground">Page {page}</span>
      </header>
      <iframe
        title={`Training Book — page ${page}`}
        src={documentUrl}
        className="min-h-0 flex-1 border-0"
      />
    </main>
  );
}