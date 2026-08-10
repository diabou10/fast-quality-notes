import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  bootstrapTypologies,
  createTypology,
  deleteTypology as deleteTypologyFn,
  importTypologies as importTypologiesFn,
  listTypologies,
  updateTypology as updateTypologyFn,
} from "@/lib/typologies.functions";


export type DescriptionKind = "pass" | "fail";

export type Description = { id: string; kind: DescriptionKind; text: string };

export type Typology = {
  id: string;
  title: string;
  descriptions: Description[];
};

const LEGACY_KEY = "qualitynotes.typologies.v2";

/** Reads any data saved by the old local-only version, to import it once. */
function readLegacyLocal() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Typology[];
    if (!Array.isArray(parsed) || parsed.length === 0) return undefined;
    return parsed
      .map((t) => ({
        title: (t.title ?? "").trim(),
        descriptions: (t.descriptions ?? [])
          .map((d) => ({
            kind: d.kind === "fail" ? ("fail" as const) : ("pass" as const),
            text: (d.text ?? "").trim(),
          }))
          .filter((d) => d.text.length > 0),
      }))
      .filter((t) => t.title.length > 0);
  } catch {
    return undefined;
  }
}

export function useTypologies() {
  const queryClient = useQueryClient();
  const list = useServerFn(listTypologies);
  const bootstrap = useServerFn(bootstrapTypologies);
  const create = useServerFn(createTypology);
  const update = useServerFn(updateTypologyFn);
  const remove = useServerFn(deleteTypologyFn);
  const importFn = useServerFn(importTypologiesFn);
  const bootstrapped = useRef(false);


  const query = useQuery({
    queryKey: ["typologies"],
    queryFn: () => list(),
  });

  useEffect(() => {
    if (bootstrapped.current) return;
    if (!query.isSuccess || (query.data && query.data.length > 0)) return;
    bootstrapped.current = true;
    void bootstrap({ data: { local: readLegacyLocal() } })
      .then((res) => {
        if (res.seeded) {
          try {
            window.localStorage.removeItem(LEGACY_KEY);
          } catch {
            // ignore
          }
          void queryClient.invalidateQueries({ queryKey: ["typologies"] });
        }
      })
      .catch(() => {
        bootstrapped.current = false;
      });
  }, [query.isSuccess, query.data, bootstrap, queryClient]);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["typologies"] }),
    [queryClient],
  );

  const createMutation = useMutation({ mutationFn: create, onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: update, onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: remove, onSuccess: invalidate });
  const importMutation = useMutation({ mutationFn: importFn, onSuccess: invalidate });

  const importRows = useCallback(
    (
      rows: { title: string; kind: DescriptionKind; text: string }[],
      mode: "merge" | "replace" = "merge",
    ) => importMutation.mutateAsync({ data: { rows, mode } }),
    [importMutation],
  );


  const addTypology = useCallback(
    (title: string, descriptions: { kind: DescriptionKind; text: string }[]) => {
      const clean = descriptions
        .map((d) => ({ kind: d.kind, text: d.text.trim() }))
        .filter((d) => d.text.length > 0);
      createMutation.mutate({ data: { title: title.trim(), descriptions: clean } });
    },
    [createMutation],
  );

  const updateTypology = useCallback(
    (
      id: string,
      title: string,
      descriptions: { id?: string; kind: DescriptionKind; text: string }[],
    ) => {
      const clean = descriptions
        .map((d) => ({ kind: d.kind, text: d.text.trim() }))
        .filter((d) => d.text.length > 0);
      updateMutation.mutate({ data: { id, title: title.trim(), descriptions: clean } });
    },
    [updateMutation],
  );

  const deleteTypology = useCallback(
    (id: string) => deleteMutation.mutate({ data: { id } }),
    [deleteMutation],
  );

  return {
    typologies: query.data ?? [],
    loading: query.isPending,
    saving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      importMutation.isPending,
    addTypology,
    updateTypology,
    deleteTypology,
    importRows,
    importing: importMutation.isPending,

  };
}
