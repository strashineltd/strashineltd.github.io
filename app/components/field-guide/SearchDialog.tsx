"use client";

import {
  useDeferredValue,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import {
  buildSearchIndex,
  groupSearchResults,
  searchFieldGuide,
  type SearchDocument,
  type SearchResult,
} from "../../lib/field-guide/search-index.ts";
import { GuideDialog } from "./GuideDialog";

type SearchDialogProps = {
  open: boolean;
  currentStepIds: string[];
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
};

function buildFallbackIndex(): SearchDocument[] {
  const documents: SearchDocument[] = [];
  for (const step of fieldGuideCatalog.steps) {
    documents.push({
      id: step.id,
      kind: "step",
      title: step.outcome,
      summary: "",
      text: step.outcome.toLowerCase(),
      aliases: [...step.searchTerms],
      targetStepId: null,
      order: documents.length,
    });
  }
  for (const branch of fieldGuideCatalog.diagnostics) {
    documents.push({
      id: branch.id,
      kind: "diagnostic",
      title: branch.symptom,
      summary: branch.steps[0]?.title ?? "",
      text: branch.symptom.toLowerCase(),
      aliases: [...branch.aliases],
      targetStepId: branch.returnStepId,
      order: documents.length,
    });
  }
  for (const entry of fieldGuideCatalog.glossary) {
    documents.push({
      id: entry.id,
      kind: "glossary",
      title: entry.term,
      summary: entry.definition,
      text: entry.term.toLowerCase(),
      aliases: [...entry.aliases],
      targetStepId: null,
      order: documents.length,
    });
  }
  return documents;
}

const searchIndexState: { index: SearchDocument[]; unavailable: boolean } = (() => {
  try {
    return { index: buildSearchIndex(fieldGuideCatalog), unavailable: false };
  } catch {
    return { index: buildFallbackIndex(), unavailable: true };
  }
})();

export function SearchDialog({
  open,
  currentStepIds,
  onClose,
  onSelectResult,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [selectedGlossary, setSelectedGlossary] = useState<SearchResult | null>(null);

  const normalized = deferredQuery.trim().replace(/\s+/g, " ");
  const results = searchFieldGuide(
    searchIndexState.index,
    normalized.length < 2 ? "" : normalized,
    { currentStepIds },
  );
  const groups = groupSearchResults(results);
  const flatResults = groups.flatMap((group) => group.results);
  const flatIndex = new Map(flatResults.map((result, index) => [result, index]));
  const activeIndex = Math.max(
    0,
    flatResults.findIndex((result) => result.id === activeResultId),
  );

  function openResult(result: SearchResult) {
    if (result.kind === "glossary") {
      setSelectedGlossary(result);
      return;
    }
    onSelectResult(result);
    onClose();
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!flatResults.length) return;
      setActiveResultId(
        flatResults[(activeIndex + 1) % flatResults.length].id,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!flatResults.length) return;
      setActiveResultId(
        flatResults[(activeIndex - 1 + flatResults.length) % flatResults.length].id,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = flatResults[activeIndex];
      if (active) openResult(active);
    }
  }

  return (
    <GuideDialog initialFocusRef={inputRef} onClose={onClose} open={open} title="查阅手册">
      <div className="manual-search">
        <input
          aria-label="搜索现场手册"
          className="manual-search__input"
          data-manual-search-input
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="搜索错误现象、步骤或术语"
          ref={inputRef}
          type="search"
          value={query}
        />
        {searchIndexState.unavailable ? (
          <p className="manual-search__note" role="status">
            搜索暂时不可用，以下是完整目录
          </p>
        ) : null}
        {selectedGlossary ? (
          <div className="manual-search__definition">
            <h3>{selectedGlossary.title}</h3>
            <p>{selectedGlossary.summary}</p>
          </div>
        ) : null}
        <div
          aria-label="搜索结果"
          className="manual-search__groups"
          role="listbox"
        >
          {groups.map((group) => (
            <div
              aria-label={group.label}
              className="manual-search__group"
              key={group.key}
              role="group"
            >
              <h3>{group.label}</h3>
              {group.results.map((result) => (
                <div
                  aria-selected={activeIndex === flatIndex.get(result)}
                  className="manual-search__option"
                  key={result.id}
                  onClick={() => openResult(result)}
                  role="option"
                >
                  <strong>{result.title}</strong>
                  <small>{result.summary}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </GuideDialog>
  );
}
