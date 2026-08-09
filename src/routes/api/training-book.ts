import { createFileRoute } from "@tanstack/react-router";
import { TRAINING_BOOK_URL } from "@/data/training-book";

export const Route = createFileRoute("/api/training-book")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sourceUrl = new URL(TRAINING_BOOK_URL, request.url);
        const range = request.headers.get("range");
        const upstream = await fetch(sourceUrl, {
          headers: range ? { range } : undefined,
        });

        if (!upstream.ok && upstream.status !== 206) {
          return new Response("Training Book indisponible", { status: 502 });
        }

        const headers = new Headers();
        headers.set("content-type", "application/pdf");
        headers.set("content-disposition", 'inline; filename="training-book.pdf"');
        headers.set("cache-control", "public, max-age=3600");
        headers.set("accept-ranges", "bytes");
        for (const name of ["content-length", "content-range", "etag"]) {
          const value = upstream.headers.get(name);
          if (value) headers.set(name, value);
        }

        return new Response(upstream.body, {
          status: upstream.status,
          headers,
        });
      },
    },
  },
});