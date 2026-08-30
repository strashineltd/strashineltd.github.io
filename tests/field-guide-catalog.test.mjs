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

function blocksForStep(stepId) {
  const step = fieldGuideCatalog.steps.find((item) => item.id === stepId);
  assert.ok(step, `missing step: ${stepId}`);
  return step.sections.flatMap((section) => section.blocks);
}

function blocksForProvider(stepId, providerId) {
  return blocksForStep(stepId)
    .filter((block) => !block.audience?.providers || block.audience.providers.includes(providerId));
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

test("catalog root and profile records match the v0.9.2 contract", () => {
  assert.equal(fieldGuideCatalog.version, "0.9.2");
  assert.equal(Object.isFrozen(fieldGuideCatalog), true);
  assert.deepEqual(fieldGuideCatalog.platforms, [
    { id: "windows-x64", label: "Windows x64", shortLabel: "Windows x64" },
    { id: "macos-arm64", label: "macOS · Apple 芯片", shortLabel: "Apple 芯片" },
    { id: "macos-x64", label: "macOS · Intel", shortLabel: "Intel" },
  ]);
  assert.deepEqual(fieldGuideCatalog.providers, [
    {
      id: "deepseek",
      label: "DeepSeek",
      presetLabels: ["DeepSeek-V4-Pro", "DeepSeek-V4-Flash"],
      baseUrl: "https://api.deepseek.com",
      wireApi: "responses",
    },
    {
      id: "qwen",
      label: "Qwen",
      presetLabels: ["Qwen3.8-Max"],
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      wireApi: "responses",
    },
    {
      id: "glm",
      label: "GLM",
      presetLabels: ["GLM-5.3", "GLM-5.2"],
      baseUrl: "https://open.bigmodel.cn/api/v1",
      wireApi: "responses",
    },
    {
      id: "kimi",
      label: "Kimi",
      presetLabels: ["Kimi-K3"],
      baseUrl: "https://api.moonshot.cn",
      wireApi: "responses",
    },
    {
      id: "minimax",
      label: "MiniMax",
      presetLabels: ["MiniMax-M3"],
      baseUrl: "https://api.minimax.io/v1",
      wireApi: "responses",
    },
    {
      id: "custom-responses",
      label: "自定义 · Responses API",
      presetLabels: ["自定义模型"],
      baseUrl: null,
      wireApi: "responses",
    },
    {
      id: "custom-anthropic",
      label: "自定义 · Anthropic Messages",
      presetLabels: ["自定义模型"],
      baseUrl: null,
      wireApi: "anthropic",
    },
  ]);
});

test("core volumes and steps match the exact ordered route table", () => {
  const coreSteps = fieldGuideCatalog.steps.filter((step) => step.volumeId !== null);

  assert.deepEqual(fieldGuideCatalog.volumes.map((volume) => ({
    id: volume.id,
    estimatedMinutes: volume.estimatedMinutes,
    stepIds: volume.stepIds,
  })), [
    {
      id: "prepare-device",
      estimatedMinutes: 8,
      stepIds: ["prepare.choose-build", "prepare.install", "prepare.first-launch"],
    },
    {
      id: "connect-intelligence",
      estimatedMinutes: 12,
      stepIds: ["connect.choose-service", "connect.enter-settings", "connect.verify"],
    },
    {
      id: "first-outcome",
      estimatedMinutes: 12,
      stepIds: [
        "outcome.choose-workspace",
        "outcome.write-brief",
        "outcome.follow-execution",
        "outcome.review-result",
      ],
    },
    {
      id: "reliable-work",
      estimatedMinutes: 13,
      stepIds: [
        "reliable.approvals",
        "reliable.context",
        "reliable.review",
        "reliable.complete",
      ],
    },
  ]);
  assert.deepEqual(coreSteps.map((step) => ({
    id: step.id,
    volumeId: step.volumeId,
    estimatedMinutes: step.estimatedMinutes,
  })), [
    { id: "prepare.choose-build", volumeId: "prepare-device", estimatedMinutes: 2 },
    { id: "prepare.install", volumeId: "prepare-device", estimatedMinutes: 4 },
    { id: "prepare.first-launch", volumeId: "prepare-device", estimatedMinutes: 2 },
    { id: "connect.choose-service", volumeId: "connect-intelligence", estimatedMinutes: 3 },
    { id: "connect.enter-settings", volumeId: "connect-intelligence", estimatedMinutes: 5 },
    { id: "connect.verify", volumeId: "connect-intelligence", estimatedMinutes: 4 },
    { id: "outcome.choose-workspace", volumeId: "first-outcome", estimatedMinutes: 3 },
    { id: "outcome.write-brief", volumeId: "first-outcome", estimatedMinutes: 4 },
    { id: "outcome.follow-execution", volumeId: "first-outcome", estimatedMinutes: 3 },
    { id: "outcome.review-result", volumeId: "first-outcome", estimatedMinutes: 2 },
    { id: "reliable.approvals", volumeId: "reliable-work", estimatedMinutes: 3 },
    { id: "reliable.context", volumeId: "reliable-work", estimatedMinutes: 3 },
    { id: "reliable.review", volumeId: "reliable-work", estimatedMinutes: 4 },
    { id: "reliable.complete", volumeId: "reliable-work", estimatedMinutes: 3 },
  ]);
  assert.equal(fieldGuideCatalog.volumes.reduce((sum, volume) => sum + volume.estimatedMinutes, 0), 45);
});

test("core steps keep required content and block-level personalization", () => {
  const actionBlockTypes = new Set(["steps", "fields", "checklist", "callout"]);
  const coreSteps = fieldGuideCatalog.steps.filter((step) => step.volumeId !== null);
  const stepIds = coreSteps.map((step) => step.id);
  let audienceBlockCount = 0;

  assert.equal(new Set(stepIds).size, 14);
  for (const step of coreSteps) {
    assert.equal(Object.hasOwn(step, "audience"), false, `${step.id} carries whole-step audience`);
    const blocks = step.sections.flatMap((section) => {
      assert.equal(Object.hasOwn(section, "audience"), false, `${step.id} section carries audience`);
      return section.blocks;
    });
    assert.ok(blocks.some((block) => block.type === "prose"), `${step.id} missing prose`);
    assert.ok(
      blocks.some((block) => actionBlockTypes.has(block.type)),
      `${step.id} missing an action block`,
    );
    for (const block of blocks) {
      if (block.audience) audienceBlockCount += 1;
    }
  }
  assert.ok(audienceBlockCount > 0);
});

test("optional tracks cover every major v0.9.2 reference area", () => {
  assert.deepEqual(fieldGuideCatalog.sideTracks.map((track) => track.id), [
    "models-context",
    "workflow-tools",
    "extensions",
    "security-data",
    "troubleshooting",
    "release-reference",
  ]);
  const searchable = JSON.stringify(fieldGuideCatalog).replaceAll("\\\\", "\\");
  for (const fact of [
    "256K、512K 或 1M",
    "90%",
    "research",
    "build",
    "verify",
    "fileScopes",
    "Context Hub",
    "Chat Completions 已移除",
    "Skills",
    "MCP",
    "17 个默认快捷键",
    "%APPDATA%\\Stellara Work",
    "~/Library/Application Support/Stellara Work",
    "Electron 43.2.0",
  ]) assert.match(searchable, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(searchable, /支持 Chat Completions|不支持 Intel|minimaxi\.com|Electron 31/);
});

test("optional track steps are focused, searchable, and structurally complete", () => {
  const actionBlockTypes = new Set(["steps", "fields", "checklist", "callout"]);
  const trackStepIds = fieldGuideCatalog.sideTracks.flatMap((track) => {
    assert.ok(track.stepIds.length >= 2 && track.stepIds.length <= 5, `${track.id} step count`);
    return track.stepIds;
  });
  const trackSteps = fieldGuideCatalog.steps.filter((step) => step.volumeId === null);

  assert.ok(trackStepIds.length > 0);
  assert.deepEqual(trackSteps.map((step) => step.id), trackStepIds);
  assert.equal(new Set(trackStepIds).size, trackStepIds.length);
  for (const step of trackSteps) {
    assert.ok(Number.isFinite(step.estimatedMinutes) && step.estimatedMinutes > 0, `${step.id} duration`);
    assert.ok(step.searchTerms.length > 0 && step.searchTerms.every((term) => term.trim()), `${step.id} aliases`);
    assert.equal(Object.hasOwn(step, "audience"), false, `${step.id} carries whole-step audience`);
    assert.equal(Object.hasOwn(step, "relatedTrackIds"), false, `${step.id} links to a core step`);
    const blocks = step.sections.flatMap((section) => {
      assert.equal(Object.hasOwn(section, "audience"), false, `${step.id} section carries audience`);
      return section.blocks;
    });
    assert.ok(blocks.some((block) => block.type === "prose"), `${step.id} missing prose`);
    assert.ok(
      blocks.some((block) => actionBlockTypes.has(block.type)),
      `${step.id} missing an action block`,
    );
  }
});

test("glossary and core links make every side track discoverable", () => {
  const requiredTerms = [
    "Responses API",
    "Anthropic Messages",
    "Context Hub",
    "checkpoint",
    "task gate",
    "approval",
    "working directory",
    "subagent",
    "Skills",
    "MCP",
    "memory scope",
    "reduced motion",
  ];
  const trackIds = new Set(fieldGuideCatalog.sideTracks.map((track) => track.id));
  const coreSteps = fieldGuideCatalog.steps.filter((step) => step.volumeId !== null);

  assert.ok(fieldGuideCatalog.glossary.length >= requiredTerms.length);
  for (const term of requiredTerms) {
    const entry = fieldGuideCatalog.glossary.find((item) => item.term === term);
    assert.ok(entry, `missing glossary term: ${term}`);
    assert.ok(entry.definition.trim(), `${term} missing definition`);
    assert.ok(entry.aliases.length > 0, `${term} missing aliases`);
  }
  for (const step of coreSteps) {
    for (const trackId of step.relatedTrackIds ?? []) {
      assert.ok(trackIds.has(trackId), `${step.id} has invalid track ${trackId}`);
    }
  }
  for (const trackId of trackIds) {
    assert.ok(
      coreSteps.some((step) => step.relatedTrackIds?.includes(trackId)),
      `${trackId} is not linked from a core step`,
    );
  }
});

test("catalog has no structural issues", () => {
  assert.deepEqual(validateCatalog(fieldGuideCatalog), []);
});

test("connection diagnostics match the exact return contract", () => {
  const expectedDiagnostics = [
    { id: "connection.unauthorized", symptom: "未授权或凭证无效" },
    { id: "connection.endpoint", symptom: "找不到地址或协议不匹配" },
    { id: "connection.timeout", symptom: "请求超时或网络不可达" },
    { id: "connection.rate-limit", symptom: "请求频率或额度受限" },
    { id: "connection.unknown", symptom: "其他错误" },
  ];
  const expectedIds = expectedDiagnostics.map((diagnostic) => diagnostic.id);

  assert.deepEqual(fieldGuideCatalog.diagnostics.map(({ id, symptom }) => ({ id, symptom })), expectedDiagnostics);
  for (const diagnostic of fieldGuideCatalog.diagnostics) {
    assert.equal(diagnostic.returnStepId, "connect.verify");
    assert.ok(diagnostic.steps.length > 0, `${diagnostic.id} has no checks`);
    for (const check of diagnostic.steps) {
      assert.ok(check.instruction.trim(), `${diagnostic.id} has an empty instruction`);
      assert.ok(check.expected.trim(), `${diagnostic.id} has an empty expected result`);
    }
  }

  const verifyStep = fieldGuideCatalog.steps.find((step) => step.id === "connect.verify");
  assert.ok(verifyStep?.validation);
  assert.deepEqual(verifyStep.validation.failureDiagnosticIds, expectedIds);
});

test("Kimi warnings replace executable setup blocks without suppressing validation", () => {
  const kimiSteps = [
    { id: "connect.choose-service", excludedBlockType: null },
    { id: "connect.enter-settings", excludedBlockType: "fields" },
    { id: "connect.verify", excludedBlockType: "steps" },
  ];

  for (const { id, excludedBlockType } of kimiSteps) {
    const blocks = blocksForProvider(id, "kimi");
    const content = JSON.stringify(blocks);

    assert.match(content, /Kimi-K3/);
    assert.match(content, /当前不可执行/);
    assert.doesNotMatch(content, /测试并执行/);
    if (excludedBlockType) {
      const allBlocks = blocksForStep(id);
      assert.ok(allBlocks.some((block) =>
        block.type === excludedBlockType
        && block.audience?.providers
        && !block.audience.providers.includes("kimi"),
      ));
      assert.equal(blocks.some((block) => block.type === excludedBlockType), false);
      assert.ok(blocks.some((block) =>
        block.type === "callout"
        && block.tone === "warning"
        && block.audience?.providers?.includes("kimi"),
      ));
      assert.match(content, /选择可执行的提供商/);
    }
  }

  const verifyStep = fieldGuideCatalog.steps.find((step) => step.id === "connect.verify");
  assert.ok(verifyStep?.validation);
});

test("custom Anthropic validation uses the Settings-only setup path", () => {
  const blocks = blocksForProvider("connect.verify", "custom-anthropic");
  const content = JSON.stringify(blocks);

  assert.ok(blocks.some((block) =>
    block.type === "steps" && block.audience?.providers?.includes("custom-anthropic"),
  ));
  assert.match(content, /设置 → 模型/);
  assert.match(content, /添加模型/);
  assert.match(content, /自定义模型/);
  assert.match(content, /Anthropic Messages/);
  assert.doesNotMatch(content, /首次引导|完成配置/);
});

test("memory saves are reviewed outside the standard approval prompt", () => {
  const step = fieldGuideCatalog.steps.find((item) => item.id === "reliable.approvals");
  assert.ok(step);
  const memoryItems = step.sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === "checklist")
    .flatMap((block) => block.items)
    .filter((item) => item.includes("memory_save"));
  const content = memoryItems.join("\n");

  assert.equal(memoryItems.length, 1);
  assert.match(content, /memory_save 不会显示标准的逐次审批提示/);
  assert.match(content, /记忆中心/);
  assert.match(content, /删除/);
  assert.doesNotMatch(content, /批准|允许/);
});
