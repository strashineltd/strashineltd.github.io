import assert from "node:assert/strict";
import test from "node:test";

import { fieldGuideCatalog } from "../app/content/field-guide/catalog.ts";
import {
  generateRoute,
  getNextStepId,
  matchesAudience,
  resolveStep,
} from "../app/lib/field-guide/route-engine.ts";

test("every supported profile gets the complete 45-minute route", () => {
  for (const platform of fieldGuideCatalog.platforms) {
    for (const provider of fieldGuideCatalog.providers) {
      const route = generateRoute(fieldGuideCatalog, { platform: platform.id, provider: provider.id });
      assert.equal(route.totalMinutes, 45);
      assert.equal(route.volumes.length, 4);
      assert.equal(route.steps[0].id, "prepare.choose-build");
      assert.equal(route.steps.at(-1)?.id, "reliable.complete");
      assert.equal(route.id, `core:${platform.id}:${provider.id}`);
    }
  }
});

test("audience blocks resolve to only the selected platform and provider", () => {
  const route = generateRoute(fieldGuideCatalog, { platform: "macos-x64", provider: "custom-anthropic" });
  const serialized = JSON.stringify(route);
  assert.match(serialized, /Intel/);
  assert.match(serialized, /Anthropic Messages/);
  assert.doesNotMatch(serialized, /Windows SmartScreen/);
  assert.doesNotMatch(serialized, /Responses API 是当前选择/);
});

test("next step skips completed steps", () => {
  const route = generateRoute(fieldGuideCatalog, { platform: "windows-x64", provider: "deepseek" });
  assert.equal(getNextStepId(route, { "prepare.choose-build": { contentVersion: 1, status: "completed" } }), "prepare.install");
});

test("generateRoute rejects platform and provider ids outside the catalog", () => {
  assert.throws(
    () => generateRoute(fieldGuideCatalog, { platform: "linux-x64", provider: "deepseek" }),
    /unknown platform/,
  );
  assert.throws(
    () => generateRoute(fieldGuideCatalog, { platform: "windows-x64", provider: "openai" }),
    /unknown provider/,
  );
});

test("matchesAudience returns true for missing conditions and requires every supplied condition", () => {
  const profile = { platform: "windows-x64", provider: "deepseek" };
  assert.equal(matchesAudience(undefined, profile), true);
  assert.equal(matchesAudience({}, profile), true);
  assert.equal(matchesAudience({ platforms: ["windows-x64"] }, profile), true);
  assert.equal(matchesAudience({ platforms: ["macos-x64"] }, profile), false);
  assert.equal(matchesAudience({ providers: ["deepseek"] }, profile), true);
  assert.equal(matchesAudience({ providers: ["qwen"] }, profile), false);
  assert.equal(
    matchesAudience({ platforms: ["windows-x64"], providers: ["deepseek"] }, profile),
    true,
  );
  assert.equal(
    matchesAudience({ platforms: ["windows-x64"], providers: ["qwen"] }, profile),
    false,
  );
  assert.equal(
    matchesAudience({ platforms: ["macos-x64"], providers: ["deepseek"] }, profile),
    false,
  );
});

test("resolveStep removes non-matching blocks and sections but preserves section order", () => {
  const step = {
    id: "synthetic.step",
    contentVersion: 1,
    volumeId: null,
    outcome: "Synthetic step",
    estimatedMinutes: 1,
    sections: [
      {
        id: "mixed",
        title: "Mixed",
        blocks: [
          { type: "prose", paragraphs: ["always"] },
          { type: "prose", paragraphs: ["windows"], audience: { platforms: ["windows-x64"] } },
          { type: "prose", paragraphs: ["deepseek"], audience: { providers: ["deepseek"] } },
        ],
      },
      {
        id: "windows-only",
        title: "Windows only",
        blocks: [
          { type: "prose", paragraphs: ["windows"], audience: { platforms: ["windows-x64"] } },
        ],
      },
    ],
    searchTerms: [],
  };

  const resolved = resolveStep(step, { platform: "macos-x64", provider: "deepseek" });
  assert.deepEqual(resolved.sections.map((section) => section.id), ["mixed"]);
  assert.deepEqual(
    resolved.sections[0].blocks.map((block) => block.paragraphs[0]),
    ["always", "deepseek"],
  );
});

test("generateRoute attaches every side track and keeps the requested profile", () => {
  const route = generateRoute(fieldGuideCatalog, { platform: "windows-x64", provider: "deepseek" });
  assert.deepEqual(route.sideTracks, fieldGuideCatalog.sideTracks);
  assert.deepEqual(route.profile, { platform: "windows-x64", provider: "deepseek" });
});

test("getNextStepId returns null when every step is complete at its current version", () => {
  const route = generateRoute(fieldGuideCatalog, { platform: "windows-x64", provider: "deepseek" });
  const progress = {};
  for (const step of route.steps) {
    progress[step.id] = { contentVersion: step.contentVersion, status: "completed" };
  }
  assert.equal(getNextStepId(route, progress), null);
});

test("getNextStepId treats completion at a stale content version as incomplete", () => {
  const route = generateRoute(fieldGuideCatalog, { platform: "windows-x64", provider: "deepseek" });
  const first = route.steps[0];
  const progress = {
    [first.id]: { contentVersion: first.contentVersion - 1, status: "completed" },
  };
  assert.equal(getNextStepId(route, progress), first.id);
});

test("getNextStepId treats review as incomplete until acknowledged at the current version", () => {
  const route = generateRoute(fieldGuideCatalog, { platform: "windows-x64", provider: "deepseek" });
  const first = route.steps[0];
  const review = { [first.id]: { contentVersion: first.contentVersion, status: "review" } };
  assert.equal(getNextStepId(route, review), first.id);
  const acknowledged = { [first.id]: { contentVersion: first.contentVersion, status: "completed" } };
  assert.equal(getNextStepId(route, acknowledged), "prepare.install");
});

test("route generation is deterministic and never mutates the catalog", () => {
  const profile = { platform: "windows-x64", provider: "deepseek" };
  const snapshot = fieldGuideCatalog.sideTracks.map((track) => ({ id: track.id, stepIds: track.stepIds }));
  const first = generateRoute(fieldGuideCatalog, profile);
  const second = generateRoute(fieldGuideCatalog, profile);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(
    fieldGuideCatalog.sideTracks.map((track) => ({ id: track.id, stepIds: track.stepIds })),
    snapshot,
  );
});
