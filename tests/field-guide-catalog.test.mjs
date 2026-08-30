import assert from "node:assert/strict";
import test from "node:test";

import { fieldGuideCatalog } from "../app/content/field-guide/catalog.ts";
import {
  assertValidCatalog,
  validateCatalog,
} from "../app/lib/field-guide/catalog-validation.ts";

const emptyCatalog = {
  version: "0.9.2",
  platforms: [],
  providers: [],
  volumes: [],
  steps: [],
  sideTracks: [],
  diagnostics: [],
  glossary: [],
};

function makeStep(overrides = {}) {
  return {
    id: "prepare.download",
    contentVersion: 1,
    volumeId: null,
    outcome: "Download the installer",
    estimatedMinutes: 2,
    sections: [],
    searchTerms: [],
    ...overrides,
  };
}

test("catalog emits stable codes and paths for duplicate ids", () => {
  const volume = {
    id: "prepare",
    title: "Prepare",
    outcome: "Launch the application",
    estimatedMinutes: 0,
    stepIds: [],
  };
  const step = makeStep();
  const track = {
    id: "repair",
    title: "Troubleshooting",
    summary: "Resolve setup problems",
    stepIds: [],
  };
  const diagnostic = {
    id: "connection-timeout",
    symptom: "The request times out",
    aliases: [],
    steps: [],
    returnStepId: step.id,
  };
  const glossaryEntry = {
    id: "base-url",
    term: "Base URL",
    definition: "The service endpoint root",
    aliases: [],
  };

  const issues = validateCatalog({
    ...emptyCatalog,
    volumes: [volume, volume],
    steps: [step, step],
    sideTracks: [track, track],
    diagnostics: [diagnostic, diagnostic],
    glossary: [glossaryEntry, glossaryEntry],
  });

  assert.deepEqual(
    issues.map((issue) => `${issue.code}:${issue.path}`).sort(),
    [
      "duplicate-diagnostic-id:diagnostics.connection-timeout",
      "duplicate-glossary-id:glossary.base-url",
      "duplicate-step-id:steps.prepare.download",
      "duplicate-track-id:sideTracks.repair",
      "duplicate-volume-id:volumes.prepare",
    ],
  );
});

test("catalog emits stable codes and paths for missing references", () => {
  const issues = validateCatalog({
    ...emptyCatalog,
    volumes: [
      {
        id: "prepare",
        title: "Prepare",
        outcome: "Launch the application",
        estimatedMinutes: 8,
        stepIds: ["missing.volume-step"],
      },
    ],
    steps: [
      makeStep({
        id: "orphan.step",
        volumeId: "missing-volume",
        relatedTrackIds: ["missing-track"],
        validation: {
          id: "check-connection",
          title: "Check the connection",
          applicationSteps: [],
          successText: "Connected",
          failureDiagnosticIds: ["missing-diagnostic"],
        },
      }),
    ],
    sideTracks: [
      {
        id: "repair",
        title: "Troubleshooting",
        summary: "Resolve setup problems",
        stepIds: ["missing.track-step"],
      },
    ],
    diagnostics: [
      {
        id: "connection-timeout",
        symptom: "The request times out",
        aliases: [],
        steps: [],
        returnStepId: "missing.return-step",
      },
    ],
  });

  assert.deepEqual(
    issues.map((issue) => `${issue.code}:${issue.path}`).sort(),
    [
      "missing-diagnostic-reference:steps.orphan.step.validation",
      "missing-step-reference:diagnostics.connection-timeout.returnStepId",
      "missing-step-reference:sideTracks.repair.stepIds",
      "missing-step-reference:volumes.prepare.stepIds",
      "missing-track-reference:steps.orphan.step.relatedTrackIds",
      "missing-volume-reference:steps.orphan.step.volumeId",
    ],
  );
});

test("catalog rejects repeated sections, non-positive time, and duration mismatches", () => {
  const repeatedSection = {
    id: "instructions",
    title: "Instructions",
    blocks: [],
  };
  const issues = validateCatalog({
    ...emptyCatalog,
    volumes: [
      {
        id: "prepare",
        title: "Prepare",
        outcome: "Launch the application",
        estimatedMinutes: 3,
        stepIds: ["prepare.download"],
      },
    ],
    steps: [
      makeStep({
        volumeId: "prepare",
        sections: [repeatedSection, repeatedSection],
      }),
      makeStep({ id: "invalid-duration", estimatedMinutes: 0 }),
    ],
  });

  assert.deepEqual(
    issues.map((issue) => `${issue.code}:${issue.path}`).sort(),
    [
      "duplicate-section-id:steps.prepare.download.sections.instructions",
      "duration-mismatch:volumes.prepare.estimatedMinutes",
      "invalid-duration:steps.invalid-duration.estimatedMinutes",
    ],
  );
});

test("catalog rejects non-finite step times", () => {
  const issues = validateCatalog({
    ...emptyCatalog,
    steps: [
      makeStep({ id: "nan-duration", estimatedMinutes: Number.NaN }),
      makeStep({
        id: "infinite-duration",
        estimatedMinutes: Number.POSITIVE_INFINITY,
      }),
    ],
  });

  assert.deepEqual(
    issues.map((issue) => `${issue.code}:${issue.path}`).sort(),
    [
      "invalid-duration:steps.infinite-duration.estimatedMinutes",
      "invalid-duration:steps.nan-duration.estimatedMinutes",
    ],
  );
});

test("assertValidCatalog throws one error containing every issue path", () => {
  const repeatedSection = {
    id: "instructions",
    title: "Instructions",
    blocks: [],
  };
  const catalog = {
    ...emptyCatalog,
    steps: [
      makeStep({
        id: "invalid-step",
        volumeId: "missing-volume",
        estimatedMinutes: 0,
        sections: [repeatedSection, repeatedSection],
        relatedTrackIds: ["missing-track"],
        validation: {
          id: "check-connection",
          title: "Check the connection",
          applicationSteps: [],
          successText: "Connected",
          failureDiagnosticIds: ["missing-diagnostic"],
        },
      }),
    ],
  };

  assert.throws(
    () => assertValidCatalog(catalog),
    (error) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message.split("\n").length, 5);
      for (const path of [
        "steps.invalid-step.estimatedMinutes",
        "steps.invalid-step.volumeId",
        "steps.invalid-step.sections.instructions",
        "steps.invalid-step.relatedTrackIds",
        "steps.invalid-step.validation",
      ]) {
        assert.ok(error.message.includes(path), `missing issue path: ${path}`);
      }
      return true;
    },
  );
});

test("core route has four outcome volumes totaling 45 minutes", () => {
  assert.deepEqual(fieldGuideCatalog.volumes.map((volume) => volume.id), [
    "prepare-device",
    "connect-intelligence",
    "first-outcome",
    "reliable-work",
  ]);
  assert.deepEqual(fieldGuideCatalog.volumes.map((volume) => volume.estimatedMinutes), [8, 12, 12, 13]);
  assert.equal(fieldGuideCatalog.volumes.reduce((sum, volume) => sum + volume.estimatedMinutes, 0), 45);
});

test("provider facts match v0.9.2 protocols", () => {
  const providers = Object.fromEntries(fieldGuideCatalog.providers.map((provider) => [provider.id, provider]));
  assert.deepEqual(providers.deepseek.presetLabels, ["DeepSeek-V4-Pro", "DeepSeek-V4-Flash"]);
  assert.equal(providers.qwen.baseUrl, "https://dashscope.aliyuncs.com/compatible-mode/v1");
  assert.equal(providers.glm.baseUrl, "https://open.bigmodel.cn/api/v1");
  assert.equal(providers.kimi.baseUrl, "https://api.moonshot.cn");
  assert.equal(providers.minimax.baseUrl, "https://api.minimax.io/v1");
  assert.equal(providers["custom-anthropic"].wireApi, "anthropic");
  assert.ok(fieldGuideCatalog.providers.filter((provider) => provider.id !== "custom-anthropic").every((provider) => provider.wireApi === "responses"));
});

test("catalog has no structural issues", () => {
  assert.deepEqual(validateCatalog(fieldGuideCatalog), []);
});
