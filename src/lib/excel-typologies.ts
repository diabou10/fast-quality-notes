import * as XLSX from "xlsx";
import type { DescriptionKind } from "@/hooks/use-typologies";

export type ImportRow = { title: string; kind: DescriptionKind; text: string };

const norm = (s: string) =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

const TITLE_KEYS = ["typologie", "typology", "process", "processus", "titre", "title", "nom"];
const KIND_KEYS = ["statut", "status", "kind", "type", "resultat", "result"];
const TEXT_KEYS = ["description", "commentaire", "comment", "texte", "text"];

function pick(row: Record<string, unknown>, keys: string[]) {
  for (const k of Object.keys(row)) {
    if (keys.includes(norm(k))) {
      const v = row[k];
      if (v === null || v === undefined) return "";
      return String(v).trim();
    }
  }
  return "";
}

export type ParseResult = { rows: ImportRow[]; skipped: number };

export async function parseTypologiesFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return { rows: [], skipped: 0 };

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const rows: ImportRow[] = [];
  let skipped = 0;

  for (const r of raw) {
    const title = pick(r, TITLE_KEYS);
    const text = pick(r, TEXT_KEYS);
    const kindRaw = norm(pick(r, KIND_KEYS));
    const kind: DescriptionKind =
      kindRaw.startsWith("f") || kindRaw.startsWith("ko") || kindRaw.startsWith("non")
        ? "fail"
        : "pass";

    if (!title || !text) {
      skipped += 1;
      continue;
    }
    rows.push({ title, kind, text });
  }

  return { rows, skipped };
}

export function downloadTypologiesTemplate() {
  const data = [
    {
      Typologie: "Recovery",
      Statut: "Pass",
      Description:
        "Le représentant a identifié le blocage du client et fourni la solution exacte.",
    },
    {
      Typologie: "Recovery",
      Statut: "Fail",
      Description: "Échec dans l'identification de la solution appropriée.",
    },
    {
      Typologie: "Refund",
      Statut: "Pass",
      Description:
        "Après identification et présentation, le rep procède au remboursement et en informe le client.",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data, {
    header: ["Typologie", "Statut", "Description"],
  });
  ws["!cols"] = [{ wch: 24 }, { wch: 10 }, { wch: 90 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Typologies");
  XLSX.writeFile(wb, "modele-typologies.xlsx");
}
