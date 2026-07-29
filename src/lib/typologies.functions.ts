import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { SEED_TYPOLOGIES } from "@/data/typologies-seed";

const kindSchema = z.enum(["pass", "fail"]);

const draftSchema = z.object({
  title: z.string().trim().min(1),
  descriptions: z
    .array(z.object({ kind: kindSchema, text: z.string().trim().min(1) }))
    .default([]),
});

export type TypologyRow = {
  id: string;
  title: string;
  descriptions: { id: string; kind: "pass" | "fail"; text: string }[];
};

export const listTypologies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TypologyRow[]> => {
    const { supabase, userId } = context;

    const { data: typologies, error } = await supabase
      .from("typologies")
      .select("id, title, position")
      .eq("user_id", userId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    if (!typologies || typologies.length === 0) return [];

    const { data: descriptions, error: descError } = await supabase
      .from("descriptions")
      .select("id, typology_id, kind, text, position")
      .eq("user_id", userId)
      .order("position", { ascending: true });
    if (descError) throw new Error(descError.message);

    return typologies.map((t) => ({
      id: t.id,
      title: t.title,
      descriptions: (descriptions ?? [])
        .filter((d) => d.typology_id === t.id)
        .map((d) => ({
          id: d.id,
          kind: d.kind === "fail" ? ("fail" as const) : ("pass" as const),
          text: d.text,
        })),
    }));
  });

/**
 * Copies the starter base (or the user's legacy local data) into their account,
 * once. Idempotent thanks to the user_setup row.
 */
export const bootstrapTypologies = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ local: z.array(draftSchema).max(500).optional() })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: setup } = await supabase
      .from("user_setup")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (setup) return { seeded: false };

    const source =
      data.local && data.local.length > 0 ? data.local : SEED_TYPOLOGIES;

    const { data: inserted, error } = await supabase
      .from("typologies")
      .insert(
        source.map((t, i) => ({ user_id: userId, title: t.title, position: i })),
      )
      .select("id, title, position");
    if (error) throw new Error(error.message);

    const rows = (inserted ?? [])
      .sort((a, b) => a.position - b.position)
      .flatMap((t, i) =>
        source[i].descriptions.map((d, j) => ({
          typology_id: t.id,
          user_id: userId,
          kind: d.kind,
          text: d.text,
          position: j,
        })),
      );
    if (rows.length > 0) {
      const { error: descError } = await supabase.from("descriptions").insert(rows);
      if (descError) throw new Error(descError.message);
    }

    await supabase.from("user_setup").insert({ user_id: userId });
    return { seeded: true };
  });

export const createTypology = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => draftSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: created, error } = await supabase
      .from("typologies")
      .insert({ user_id: userId, title: data.title, position: -Date.now() / 1000 })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    if (data.descriptions.length > 0) {
      const { error: descError } = await supabase.from("descriptions").insert(
        data.descriptions.map((d, i) => ({
          typology_id: created.id,
          user_id: userId,
          kind: d.kind,
          text: d.text,
          position: i,
        })),
      );
      if (descError) throw new Error(descError.message);
    }
    return { id: created.id };
  });

export const updateTypology = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    draftSchema.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase
      .from("typologies")
      .update({ title: data.title, updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    const { error: delError } = await supabase
      .from("descriptions")
      .delete()
      .eq("typology_id", data.id)
      .eq("user_id", userId);
    if (delError) throw new Error(delError.message);

    if (data.descriptions.length > 0) {
      const { error: insError } = await supabase.from("descriptions").insert(
        data.descriptions.map((d, i) => ({
          typology_id: data.id,
          user_id: userId,
          kind: d.kind,
          text: d.text,
          position: i,
        })),
      );
      if (insError) throw new Error(insError.message);
    }
    return { ok: true };
  });

export const deleteTypology = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("typologies")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
