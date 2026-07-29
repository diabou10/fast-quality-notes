import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Copy, Lock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "QualityNotes — Tes notes d'évaluation qualité, en un clic" },
      {
        name: "description",
        content:
          "Base personnelle de typologies d'évaluation qualité : recherche instantanée, variantes Pass/Fail et copie en un clic.",
      },
      { property: "og:title", content: "QualityNotes" },
      {
        property: "og:description",
        content:
          "Base personnelle de typologies d'évaluation qualité : recherche instantanée et copie en un clic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Quality Evaluation
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Rédige tes notes d'évaluation qualité en quelques secondes.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Ta base de typologies personnelle : recherche instantanée, variantes Pass /
          Fail, et copie en un clic. Chaque compte a sa propre base, privée.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/auth">
              Commencer <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Recherche instantanée",
              text: "Filtre titres et descriptions en temps réel, sans accent près.",
            },
            {
              icon: Copy,
              title: "Copie en un clic",
              text: "Chaque variante se copie directement dans ton presse-papiers.",
            },
            {
              icon: Lock,
              title: "Base privée",
              text: "Tes ajouts et modifications ne sont visibles que par toi.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
              <h2 className="mt-3 text-sm font-semibold text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
