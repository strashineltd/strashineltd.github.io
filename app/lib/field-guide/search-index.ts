import type { FieldGuideCatalog } from "../../content/field-guide/types.ts";
import type { DiagnosticBranch } from "../../content/field-guide/types.ts";
import type { GlossaryEntry } from "../../content/field-guide/types.ts";
import type { LearningStep } from "../../content/field-guide/types.ts";
import type { LessonBlock } from "../../content/field-guide/types.ts";

export type SearchDocument = {
  id: string;
  kind: "step" | "diagnostic" | "glossary";
  title: string;
  summary: string;
  text: string;
  aliases: string[];
  targetStepId: string | null;
  order: number;
};

export type SearchResult = SearchDocument & {
  score: number;
  inCurrentRoute: boolean;
};

export type SearchGroup = {
  key: "diagnostic" | "step" | "glossary";
  label: string;
  results: SearchResult[];
};

const GROUP_ORDER: SearchGroup["key"][] = ["diagnostic", "step", "glossary"];

const GROUP_LABELS: Record<SearchGroup["key"], string> = {
  diagnostic: "建议诊断",
  step: "手册内容",
  glossary: "术语",
};

function blockText(block: LessonBlock): string {
  switch (block.type) {
    case "prose":
      return block.paragraphs.join(" ");
    case "steps":
      return block.items.map((item) => `${item.title} ${item.detail}`).join(" ");
    case "fields":
      return block.items
        .map((item) => `${item.label} ${item.value} ${item.detail ?? ""}`)
        .join(" ");
    case "callout":
      return `${block.title} ${block.body}`;
    case "checklist":
      return block.items.join(" ");
    case "code":
      return `${block.label} ${block.content}`;
  }
}

function routeTitleForStep(step: LearningStep, catalog: FieldGuideCatalog): string {
  if (step.volumeId) {
    const volume = catalog.volumes.find((entry) => entry.id === step.volumeId);
    if (volume) return volume.title;
  }
  const track = catalog.sideTracks.find((entry) => entry.stepIds.includes(step.id));
  return track ? track.title : "";
}

function stepText(step: LearningStep, routeTitle: string): string {
  const sections = step.sections
    .map((section) => `${section.title} ${section.blocks.map(blockText).join(" ")}`)
    .join(" ");
  const validation = step.validation
    ? `${step.validation.title} ${step.validation.applicationSteps.join(" ")} ${step.validation.successText}`
    : "";
  return [routeTitle, step.outcome, sections, validation, ...step.searchTerms]
    .filter((part) => part !== "")
    .join(" ")
    .toLowerCase();
}

function diagnosticText(branch: DiagnosticBranch): string {
  const steps = branch.steps
    .map((item) => `${item.title} ${item.instruction} ${item.expected}`)
    .join(" ");
  return [branch.symptom, ...branch.aliases, steps].join(" ").toLowerCase();
}

function glossaryText(entry: GlossaryEntry): string {
  return [entry.term, entry.definition, ...entry.aliases].join(" ").toLowerCase();
}

export function buildSearchIndex(catalog: FieldGuideCatalog): SearchDocument[] {
  const documents: SearchDocument[] = [];
  for (const step of catalog.steps) {
    const routeTitle = routeTitleForStep(step, catalog);
    documents.push({
      id: step.id,
      kind: "step",
      title: step.outcome,
      summary: routeTitle,
      text: stepText(step, routeTitle),
      aliases: [...step.searchTerms],
      targetStepId: null,
      order: documents.length,
    });
  }
  for (const branch of catalog.diagnostics) {
    documents.push({
      id: branch.id,
      kind: "diagnostic",
      title: branch.symptom,
      summary: branch.steps[0]?.title ?? "",
      text: diagnosticText(branch),
      aliases: [...branch.aliases],
      targetStepId: branch.returnStepId,
      order: documents.length,
    });
  }
  for (const entry of catalog.glossary) {
    documents.push({
      id: entry.id,
      kind: "glossary",
      title: entry.term,
      summary: entry.definition,
      text: glossaryText(entry),
      aliases: [...entry.aliases],
      targetStepId: null,
      order: documents.length,
    });
  }
  return documents;
}

function scoreDocument(
  document: SearchDocument,
  query: string,
  currentStepIds: string[],
): number {
  let score = 0;
  const title = document.title.toLowerCase();
  if (
    document.kind === "diagnostic" &&
    document.aliases.some((alias) => alias.toLowerCase() === query)
  ) {
    score += 500;
  }
  if (
    document.kind === "glossary" &&
    document.aliases.some((alias) => alias.toLowerCase() === query)
  ) {
    score += 80;
  }
  if (title === query) score += 350;
  if (title.includes(query)) score += 120;
  if (document.text.includes(query)) score += 50;
  if (
    score > 0 &&
    document.kind === "step" &&
    currentStepIds.includes(document.id)
  ) {
    score += 200;
  }
  return score;
}

export function searchFieldGuide(
  index: SearchDocument[],
  query: string,
  options: { currentStepIds: string[] },
): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") {
    return index.map((entry) => ({ ...entry, score: 0, inCurrentRoute: false }));
  }
  return index
    .map((entry) => ({
      ...entry,
      score: scoreDocument(entry, normalized, options.currentStepIds),
      inCurrentRoute:
        entry.kind === "step" && options.currentStepIds.includes(entry.id),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);
}

export function groupSearchResults(results: SearchResult[]): SearchGroup[] {
  const groups = GROUP_ORDER.map((key) => ({
    key,
    label: GROUP_LABELS[key],
    results: [] as SearchResult[],
  }));
  for (const result of results) {
    groups.find((group) => group.key === result.kind)?.results.push(result);
  }
  return groups.filter((group) => group.results.length > 0);
}
