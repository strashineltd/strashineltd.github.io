import assert from "node:assert/strict";
import test from "node:test";

import { fieldGuideCatalog } from "../app/content/field-guide/catalog.ts";
import {
  buildSearchIndex,
  groupSearchResults,
  searchFieldGuide,
} from "../app/lib/field-guide/search-index.ts";

function step(id, outcome, body) {
  return {
    id,
    contentVersion: 1,
    volumeId: null,
    outcome,
    estimatedMinutes: 1,
    sections: [
      {
        id: `${id}.section`,
        title: "Section",
        blocks: [{ type: "prose", paragraphs: [body] }],
      },
    ],
    searchTerms: [],
  };
}

function makeCatalog({ steps = [], diagnostics = [], glossary = [] }) {
  return {
    version: "test",
    platforms: [],
    providers: [],
    volumes: [],
    steps,
    sideTracks: [],
    diagnostics,
    glossary,
  };
}

test("an error code ranks diagnosis before general lessons", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  const results = searchFieldGuide(index, "401", { currentStepIds: ["connect.verify"] });
  assert.equal(results[0].kind, "diagnostic");
  assert.equal(results[0].id, "connection.unauthorized");
});

test("current-route lessons rank before optional references", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  const results = searchFieldGuide(index, "连接模型", {
    currentStepIds: ["connect.choose-service", "connect.enter-settings", "connect.verify"],
  });
  assert.equal(results[0].kind, "step");
  assert.ok(results.slice(0, 3).every((result) => result.inCurrentRoute));
});

test("blank query returns the complete browsable index", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  assert.deepEqual(
    searchFieldGuide(index, "", { currentStepIds: [] }),
    index.map((entry) => ({ ...entry, score: 0, inCurrentRoute: false })),
  );
});

test("blank query ignores the current route and keeps every entry unscored", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  const results = searchFieldGuide(index, "  ", { currentStepIds: ["connect.verify"] });
  assert.equal(results.length, index.length);
  assert.ok(results.every((result) => result.score === 0 && !result.inCurrentRoute));
});

test("buildSearchIndex emits exactly one document per step, diagnostic and glossary entry", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  assert.equal(
    index.length,
    fieldGuideCatalog.steps.length +
      fieldGuideCatalog.diagnostics.length +
      fieldGuideCatalog.glossary.length,
  );
});

test("exact diagnostic alias outranks an exact title match", () => {
  const catalog = makeCatalog({
    steps: [step("s.token", "invalid token", "body")],
    diagnostics: [
      {
        id: "d.creds",
        symptom: "凭证无效",
        aliases: ["invalid token"],
        steps: [
          { title: "重新输入凭证", instruction: "body", expected: "done" },
        ],
        returnStepId: "s.token",
      },
    ],
  });
  const results = searchFieldGuide(buildSearchIndex(catalog), "invalid token", {
    currentStepIds: [],
  });
  assert.deepEqual(
    results.map((result) => result.id),
    ["d.creds", "s.token"],
  );
  assert.equal(results[0].score, 550);
  assert.equal(results[1].score, 520);
});

test("current-route boost lifts an in-route lesson above an equal out-of-route match", () => {
  const catalog = makeCatalog({
    steps: [
      step("s.exact", "token", "body"),
      step("s.mid", "token setup", "body"),
      step("s.low", "token basics", "body"),
    ],
  });
  const results = searchFieldGuide(buildSearchIndex(catalog), "token", {
    currentStepIds: ["s.mid"],
  });
  assert.deepEqual(
    results.map((result) => result.id),
    ["s.exact", "s.mid", "s.low"],
  );
  assert.deepEqual(
    results.map((result) => result.score),
    [520, 370, 170],
  );
  assert.deepEqual(
    results.map((result) => result.inCurrentRoute),
    [false, true, false],
  );
});

test("glossary alias match outranks a body-only match", () => {
  const catalog = makeCatalog({
    steps: [step("s.body", "step title", "术语别名 appears in the body")],
    glossary: [
      { id: "g.term", term: "some term", definition: "definition", aliases: ["术语别名"] },
    ],
  });
  const results = searchFieldGuide(buildSearchIndex(catalog), "术语别名", {
    currentStepIds: [],
  });
  assert.deepEqual(
    results.map((result) => result.id),
    ["g.term", "s.body"],
  );
  assert.equal(results[0].score, 130);
  assert.equal(results[1].score, 50);
});

test("equal scores keep stable catalog order", () => {
  const catalog = makeCatalog({
    steps: [
      step("s.first", "title one", "共享词 in the body"),
      step("s.second", "title two", "共享词 in the body"),
    ],
  });
  const results = searchFieldGuide(buildSearchIndex(catalog), "共享词", {
    currentStepIds: [],
  });
  assert.deepEqual(
    results.map((result) => result.id),
    ["s.first", "s.second"],
  );
  assert.ok(results.every((result) => result.score === 50));
});

test("queries match case-insensitively against normalized text", () => {
  const catalog = makeCatalog({
    steps: [step("s.hello", "Hello World", "body")],
  });
  const index = buildSearchIndex(catalog);
  assert.equal(searchFieldGuide(index, "hello world", { currentStepIds: [] }).length, 1);
  assert.equal(searchFieldGuide(index, "HELLO WORLD", { currentStepIds: [] }).length, 1);
});

test("diagnostic documents point at their return step and steps and glossary have no target", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  const diagnostic = index.find((entry) => entry.id === "connection.unauthorized");
  assert.equal(diagnostic.kind, "diagnostic");
  assert.equal(diagnostic.targetStepId, "connect.verify");
  const lesson = index.find((entry) => entry.id === "connect.verify");
  assert.equal(lesson.kind, "step");
  assert.equal(lesson.targetStepId, null);
  const term = index.find((entry) => entry.id === "responses-api");
  assert.equal(term.kind, "glossary");
  assert.equal(term.targetStepId, null);
});

test("groupSearchResults orders diagnostic, step and glossary groups with Chinese labels", () => {
  const catalog = makeCatalog({
    steps: [step("s.g", "step title", "共享词")],
    diagnostics: [
      {
        id: "d.g",
        symptom: "症状",
        aliases: [],
        steps: [{ title: "排查", instruction: "共享词", expected: "done" }],
        returnStepId: "s.g",
      },
    ],
    glossary: [{ id: "g.g", term: "术语", definition: "定义", aliases: ["共享词"] }],
  });
  const results = searchFieldGuide(buildSearchIndex(catalog), "共享词", {
    currentStepIds: [],
  });
  const groups = groupSearchResults(results);
  assert.deepEqual(
    groups.map((group) => group.key),
    ["diagnostic", "step", "glossary"],
  );
  assert.deepEqual(
    groups.map((group) => group.label),
    ["建议诊断", "手册内容", "术语"],
  );
  assert.deepEqual(
    groups.map((group) => group.results.map((result) => result.id)),
    [["d.g"], ["s.g"], ["g.g"]],
  );
});

test("groupSearchResults omits empty groups", () => {
  const catalog = makeCatalog({
    steps: [step("s.g", "step title", "共享词")],
  });
  const results = searchFieldGuide(buildSearchIndex(catalog), "共享词", {
    currentStepIds: [],
  });
  const groups = groupSearchResults(results);
  assert.deepEqual(
    groups.map((group) => group.key),
    ["step"],
  );
});

test("non-matching queries return no results", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  assert.deepEqual(searchFieldGuide(index, "zzzz-no-match", { currentStepIds: [] }), []);
});
