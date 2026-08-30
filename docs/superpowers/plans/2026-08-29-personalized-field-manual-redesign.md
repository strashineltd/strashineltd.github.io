# 个性化现场手册 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用从零设计的“个性化现场手册”完整替换 `/docs`，让首次使用者按专属路线完成环境配置、首个任务和可靠交付。

**Architecture:** 网站继续保持静态构建；新的结构化课程目录、路线生成器、版本化本地进度仓库和本地搜索索引组成无后端学习系统。React 客户端在 `/docs` 内根据平台与模型服务生成路线，桌面渲染双页手册，移动端渲染单页阅读，并将敏感验证始终留在 Stellara Work 应用内。

**Tech Stack:** React 19.2.6, TypeScript 5.9.3, Next.js 16.2.6 through vinext 0.0.50, node:test, Playwright Chromium, axe-core, scoped CSS

**Spec:** `docs/superpowers/specs/2026-08-29-personalized-field-manual-redesign-design.md`

## Global Constraints

- 保留公开入口 `/docs`，但不复用旧文章结构、旧正文、旧目录、`DocsExplorer` 组件或旧文档 CSS。
- 核心受众是首次使用者；核心路线严格由 8 + 12 + 12 + 13 = 45 分钟的四个成果卷组成。
- 路线条件只使用用户确认的平台与模型服务；支持 `windows-x64`、`macos-arm64`、`macos-x64`。
- 模型服务选项为 DeepSeek、Qwen、GLM、Kimi、MiniMax、自定义 Responses、自定义 Anthropic。
- v0.9.2 只支持 Responses API 与 Anthropic Messages；任何新正文都不得宣称支持 Chat Completions 回退。
- 网页不得接收、保存或转发 API Key；连接验证在 Stellara Work 内执行，网页只记录用户选择的通过或失败。
- 状态仅保存在当前浏览器；不得新增账号、数据库、云同步、D1、R2 或其他后端依赖。
- 产品继续作为静态站点构建和部署，不新增服务端运行时。
- 进度记录必须带内容版本；内容变化时保留完成记录并标记“有更新，请复查”。
- 全局搜索索引必须在构建数据中生成并在浏览器本地查询；不得调用外部搜索服务。
- 验证失败必须进入分支诊断，修复后返回原核心步骤，不得把失败步骤标记为完成。
- 日间版使用暖纸张与砖红，夜间版使用暖墨黑与陶土红；默认跟随系统并支持手动切换。
- 桌面使用手册摊页；移动端使用独立单页布局，不缩放桌面双栏。
- 所有交互满足 WCAG 2.2 AA、键盘可操作、焦点可恢复、状态可播报，并尊重 `prefers-reduced-motion`。
- 课程事实必须回查 `/Users/lhy/Stellara Work` 的 v0.9.2 源码和 `CHANGELOG.md`，不能从旧网站正文复制。
- Node.js 最低版本保持 `>=22.13.0`；不引入运行时依赖，Playwright 与 axe 仅作为开发依赖。

## Current Baseline

- `npm run lint`：通过。
- `npx tsc --noEmit`：通过。
- `node --test tests/docs-content.test.mjs tests/reading-progress.test.mjs`：5 通过、1 失败。
- 当前失败是旧测试要求已不存在的 `context-window` 文章；Task 2 将删除旧结构测试并以新课程目录契约替换。

## Source-Of-Truth Files

- `/Users/lhy/Stellara Work/electron/llm/presets.ts`: 7 个模型预设、Base URL、协议和验证状态。
- `/Users/lhy/Stellara Work/electron/llm/client-factory.ts`: Responses 与 Anthropic 两种客户端。
- `/Users/lhy/Stellara Work/shared/ipc.ts`: `WireApi` 与 URL 协议推断。
- `/Users/lhy/Stellara Work/src/components/Onboarding.tsx`: 首次启动流程。
- `/Users/lhy/Stellara Work/src/components/settings/SettingsModelsPanel.tsx`: 模型配置字段与协议选择器。
- `/Users/lhy/Stellara Work/src/components/HomeDashboard.tsx`: 首页任务入口与未配置状态。
- `/Users/lhy/Stellara Work/src/components/WorkspacePanel.tsx`: Context Hub、检查点、任务门禁和进度。
- `/Users/lhy/Stellara Work/src/components/ApprovalTopBar.tsx`: 审批交互。
- `/Users/lhy/Stellara Work/electron/context/context-hub.ts`: 修订、证据、检查点和门禁逻辑。
- `/Users/lhy/Stellara Work/electron/agent/tools/`: 工具行为和安全限制。
- `/Users/lhy/Stellara Work/electron/agent/subagent-coordinator.ts`: 子代理角色与并发规则。
- `/Users/lhy/Stellara Work/electron/config/data-dir.ts`: 双平台数据目录。
- `/Users/lhy/Stellara Work/electron/config/secrets.ts`: 凭证加密。
- `/Users/lhy/Stellara Work/shared/shortcuts.ts`: 17 个默认快捷键。
- `/Users/lhy/Stellara Work/electron/agent/skills.ts`: Skills。
- `/Users/lhy/Stellara Work/electron/mcp/`: MCP。
- `/Users/lhy/Stellara Work/electron/memory/`: 记忆存储、提取和注入。
- `/Users/lhy/Stellara Work/CHANGELOG.md`: v0.9.2 发布事实与历史版本。

## File Structure

### Create

- `app/content/field-guide/types.ts`: 课程、路线、验证、诊断和本地状态类型。
- `app/content/field-guide/profile-options.ts`: 平台与模型服务选项及准确连接元数据。
- `app/content/field-guide/volumes/prepare-device.ts`: 第一卷内容。
- `app/content/field-guide/volumes/connect-intelligence.ts`: 第二卷内容。
- `app/content/field-guide/volumes/first-outcome.ts`: 第三卷内容。
- `app/content/field-guide/volumes/reliable-work.ts`: 第四卷内容。
- `app/content/field-guide/diagnostics.ts`: 验证失败诊断图。
- `app/content/field-guide/tracks.ts`: 六条可选支线和参考内容。
- `app/content/field-guide/catalog.ts`: 新课程目录唯一聚合入口。
- `app/lib/field-guide/catalog-validation.ts`: 构建时目录完整性检查。
- `app/lib/field-guide/route-engine.ts`: 个性化路线生成和内容条件解析。
- `app/lib/field-guide/progress-store.ts`: 版本化状态、迁移、重建和 Storage 适配。
- `app/lib/field-guide/search-index.ts`: 本地索引生成、评分和分组。
- `app/components/field-guide/FieldManual.tsx`: 客户端编排根组件。
- `app/components/field-guide/useFieldGuideState.ts`: 浏览器状态与持久化 hook。
- `app/components/field-guide/FieldGuideHeader.tsx`: 品牌、进度、搜索、目录、主题和设置入口。
- `app/components/field-guide/ProfileSetup.tsx`: 平台与模型服务问答。
- `app/components/field-guide/RouteBook.tsx`: 桌面双页与移动目录。
- `app/components/field-guide/LessonReader.tsx`: 新课程内容块渲染器。
- `app/components/field-guide/ValidationFlow.tsx`: 通过、失败和完成反馈。
- `app/components/field-guide/DiagnosticFlow.tsx`: 失败分支和返回主线。
- `app/components/field-guide/GuideDialog.tsx`: 搜索与设置共用的可访问弹层。
- `app/components/field-guide/SearchDialog.tsx`: 本地搜索和完整索引降级。
- `app/components/field-guide/GuideSettingsDialog.tsx`: 个性化、主题和本地数据操作。
- `app/docs/field-manual.css`: 完整的编辑手册视觉、响应式和打印样式。
- `tests/field-guide-catalog.test.mjs`: 内容图和事实契约。
- `tests/field-guide-route.test.mjs`: 路线组合测试。
- `tests/field-guide-progress.test.mjs`: 本地状态和迁移测试。
- `tests/field-guide-search.test.mjs`: 搜索排序和降级测试。
- `tests/e2e/helpers.ts`: Playwright 路线建立辅助函数。
- `tests/e2e/field-guide-setup.spec.ts`: 首次配置与恢复。
- `tests/e2e/field-guide-learning.spec.ts`: 阅读、验证和诊断。
- `tests/e2e/field-guide-search-settings.spec.ts`: 搜索、主题和本地设置。
- `tests/e2e/field-guide-visual.spec.ts`: axe、减弱动效和视觉回归。
- `playwright.config.ts`: Chromium 桌面与移动项目。

### Modify

- `app/docs/page.tsx:1-23`: 改成新现场手册入口和 metadata。
- `app/globals.css:361-494,531-684,690-719,743-754,1117-1189`: 删除所有旧文档样式和全局文档暗色覆盖。
- `tests/rendered-html.test.mjs:39-49`: 改为新 SSR 外壳断言。
- `package.json:8-14,23-40`: 拆分测试脚本并增加 Playwright/axe 开发依赖。
- `package-lock.json`: 由 npm 安装命令生成锁文件变化。
- `tsconfig.json:12-15`: 允许测试直接导入 `.ts` 扩展名。
- `.gitignore:41-46`: 忽略 Playwright 临时产物，不忽略快照基线。
- `.github/workflows/deploy-pages.yml:31-39`: 部署前加入质量、浏览器和静态渲染门禁。

### Delete

- `app/components/DocsExplorer.tsx`: 旧文档 UI。
- `app/content/docs.ts`: 旧文章数组。
- `app/utils/readingProgress.js`: 仅供旧文章滚动进度使用。
- `tests/docs-content.test.mjs`: 旧 22 篇文章契约。
- `tests/reading-progress.test.mjs`: 旧文章滚动进度测试。

---

### Task 1: Define the New Catalog Contract

**Files:**
- Create: `app/content/field-guide/types.ts`
- Create: `app/lib/field-guide/catalog-validation.ts`
- Create: `tests/field-guide-catalog.test.mjs`
- Modify: `tsconfig.json`

**Interfaces:**
- Consumes: none.
- Produces: `FieldGuideCatalog`, `LearningStep`, `DiagnosticBranch`, `GuideProgress`, `validateCatalog(catalog): CatalogIssue[]`, `assertValidCatalog(catalog): void`.

- [ ] **Step 1: Write failing catalog validation tests**

Create fixtures that prove duplicate IDs and missing references are rejected:

```js
import assert from "node:assert/strict";
import test from "node:test";

import { validateCatalog } from "../app/lib/field-guide/catalog-validation.ts";

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

test("catalog rejects duplicate step ids", () => {
  const step = {
    id: "prepare.download",
    contentVersion: 1,
    volumeId: "prepare",
    outcome: "下载安装包",
    estimatedMinutes: 2,
    sections: [],
    searchTerms: [],
  };
  const issues = validateCatalog({ ...emptyCatalog, steps: [step, step] });
  assert.ok(issues.some((issue) => issue.code === "duplicate-step-id"));
});

test("catalog rejects missing step and diagnostic references", () => {
  const issues = validateCatalog({
    ...emptyCatalog,
    volumes: [{ id: "prepare", title: "准备好设备", outcome: "可启动应用", estimatedMinutes: 8, stepIds: ["missing.step"] }],
    sideTracks: [{ id: "repair", title: "排障", summary: "修复问题", stepIds: ["missing.track-step"] }],
  });
  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    ["missing-step-reference", "missing-step-reference"],
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-catalog.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `catalog-validation.ts`.

- [ ] **Step 3: Add the exact type model**

Use discriminated unions; do not use TypeScript enums because Node's type-strip runner does not transform them:

```ts
export type PlatformId = "windows-x64" | "macos-arm64" | "macos-x64";
export type ProviderId = "deepseek" | "qwen" | "glm" | "kimi" | "minimax" | "custom-responses" | "custom-anthropic";
export type ManualTheme = "system" | "light" | "night";
export type ValidationResult = "passed" | "failed";

export type AudienceCondition = {
  platforms?: PlatformId[];
  providers?: ProviderId[];
};

export type LessonBlock =
  | { type: "prose"; paragraphs: string[]; audience?: AudienceCondition }
  | { type: "steps"; items: Array<{ title: string; detail: string }>; audience?: AudienceCondition }
  | { type: "fields"; items: Array<{ label: string; value: string; detail?: string }>; audience?: AudienceCondition }
  | { type: "callout"; tone: "note" | "warning" | "success"; title: string; body: string; audience?: AudienceCondition }
  | { type: "checklist"; items: string[]; audience?: AudienceCondition }
  | { type: "code"; label: string; content: string; audience?: AudienceCondition };

export type LessonSection = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};

export type ValidationTask = {
  id: string;
  title: string;
  applicationSteps: string[];
  successText: string;
  failureDiagnosticIds: string[];
};

export type LearningStep = {
  id: string;
  contentVersion: number;
  volumeId: string | null;
  outcome: string;
  estimatedMinutes: number;
  audience?: AudienceCondition;
  sections: LessonSection[];
  validation?: ValidationTask;
  relatedTrackIds?: string[];
  searchTerms: string[];
};

export type CoreVolume = {
  id: string;
  title: string;
  outcome: string;
  estimatedMinutes: number;
  stepIds: string[];
};

export type SideTrack = {
  id: string;
  title: string;
  summary: string;
  stepIds: string[];
};

export type DiagnosticBranch = {
  id: string;
  symptom: string;
  aliases: string[];
  steps: Array<{ title: string; instruction: string; expected: string }>;
  returnStepId: string;
};

export type PlatformOption = {
  id: PlatformId;
  label: string;
  shortLabel: string;
};

export type ProviderOption = {
  id: ProviderId;
  label: string;
  presetLabels: string[];
  baseUrl: string | null;
  wireApi: "responses" | "anthropic";
};

export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  aliases: string[];
};

export type FieldGuideCatalog = {
  version: string;
  platforms: PlatformOption[];
  providers: ProviderOption[];
  volumes: CoreVolume[];
  steps: LearningStep[];
  sideTracks: SideTrack[];
  diagnostics: DiagnosticBranch[];
  glossary: GlossaryEntry[];
};

export type LearnerProfile = {
  platform: PlatformId;
  provider: ProviderId;
};

export type StepProgress = {
  contentVersion: number;
  status: "in-progress" | "completed" | "review";
  validationResult?: ValidationResult;
};

export type GuideProgress = {
  schemaVersion: 1;
  catalogVersion: string;
  profile: LearnerProfile | null;
  routeId: string | null;
  activeStepId: string | null;
  steps: Record<string, StepProgress>;
  theme: ManualTheme;
};
```

Add `"allowImportingTsExtensions": true` to `compilerOptions` so tests and production modules use the same explicit imports.

- [ ] **Step 4: Implement catalog validation**

`validateCatalog` must emit stable codes for duplicate volume, step, track, diagnostic and glossary IDs; missing volume/step/track/diagnostic references; repeated section IDs inside a step; non-positive time; and a core volume whose declared time differs from its referenced core steps. `assertValidCatalog` throws one error containing every issue path.

Core algorithm:

```ts
import type { FieldGuideCatalog } from "../../content/field-guide/types.ts";

export type CatalogIssue = { code: string; path: string; message: string };

function duplicates(values: string[]) {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return repeated;
}

export function validateCatalog(catalog: FieldGuideCatalog): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const stepIds = new Set(catalog.steps.map((step) => step.id));
  const stepById = new Map(catalog.steps.map((step) => [step.id, step]));
  const volumeIds = new Set(catalog.volumes.map((volume) => volume.id));
  const diagnosticIds = new Set(catalog.diagnostics.map((branch) => branch.id));
  const trackIds = new Set(catalog.sideTracks.map((track) => track.id));
  const collections = [
    ["duplicate-volume-id", "volumes", catalog.volumes.map((item) => item.id)],
    ["duplicate-step-id", "steps", catalog.steps.map((item) => item.id)],
    ["duplicate-track-id", "sideTracks", catalog.sideTracks.map((item) => item.id)],
    ["duplicate-diagnostic-id", "diagnostics", catalog.diagnostics.map((item) => item.id)],
    ["duplicate-glossary-id", "glossary", catalog.glossary.map((item) => item.id)],
  ] as const;

  for (const [code, path, ids] of collections) {
    for (const id of duplicates(ids)) issues.push({ code, path: `${path}.${id}`, message: `重复 ID：${id}` });
  }
  for (const volume of catalog.volumes) {
    for (const id of volume.stepIds) {
      if (!stepIds.has(id)) issues.push({ code: "missing-step-reference", path: `volumes.${volume.id}.stepIds`, message: `不存在的步骤：${id}` });
    }
    const referenced = volume.stepIds.map((id) => stepById.get(id)).filter((step) => step !== undefined);
    const actualMinutes = referenced.reduce((sum, step) => sum + step.estimatedMinutes, 0);
    if (referenced.length === volume.stepIds.length && actualMinutes !== volume.estimatedMinutes) {
      issues.push({ code: "duration-mismatch", path: `volumes.${volume.id}.estimatedMinutes`, message: `声明 ${volume.estimatedMinutes} 分钟，步骤合计 ${actualMinutes} 分钟` });
    }
  }
  for (const track of catalog.sideTracks) {
    for (const id of track.stepIds) {
      if (!stepIds.has(id)) issues.push({ code: "missing-step-reference", path: `sideTracks.${track.id}.stepIds`, message: `不存在的步骤：${id}` });
    }
  }
  for (const step of catalog.steps) {
    if (step.estimatedMinutes <= 0) issues.push({ code: "invalid-duration", path: `steps.${step.id}.estimatedMinutes`, message: "步骤时长必须大于 0" });
    if (step.volumeId !== null && !volumeIds.has(step.volumeId)) issues.push({ code: "missing-volume-reference", path: `steps.${step.id}.volumeId`, message: `不存在的卷：${step.volumeId}` });
    for (const id of duplicates(step.sections.map((section) => section.id))) issues.push({ code: "duplicate-section-id", path: `steps.${step.id}.sections.${id}`, message: `重复章节 ID：${id}` });
    for (const id of step.relatedTrackIds ?? []) {
      if (!trackIds.has(id)) issues.push({ code: "missing-track-reference", path: `steps.${step.id}.relatedTrackIds`, message: `不存在的支线：${id}` });
    }
    for (const id of step.validation?.failureDiagnosticIds ?? []) {
      if (!diagnosticIds.has(id)) issues.push({ code: "missing-diagnostic-reference", path: `steps.${step.id}.validation`, message: `不存在的诊断：${id}` });
    }
  }
  for (const branch of catalog.diagnostics) {
    if (!stepIds.has(branch.returnStepId)) issues.push({ code: "missing-step-reference", path: `diagnostics.${branch.id}.returnStepId`, message: `不存在的返回步骤：${branch.returnStepId}` });
  }
  return issues;
}

export function assertValidCatalog(catalog: FieldGuideCatalog) {
  const issues = validateCatalog(catalog);
  if (issues.length > 0) throw new Error(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
}
```

The declared-time check only compares a volume after every referenced step resolves, so one missing step produces one reference issue instead of a misleading duration issue. Tests in Task 2 lock the exact 45-minute result.

- [ ] **Step 5: Run unit and type checks**

Run: `node --experimental-strip-types --test tests/field-guide-catalog.test.mjs`

Expected: PASS.

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 6: Commit the contract**

```bash
git add app/content/field-guide/types.ts app/lib/field-guide/catalog-validation.ts tests/field-guide-catalog.test.mjs tsconfig.json
git commit -m "test(docs): define field guide catalog contract"
```

---

### Task 2: Author the 45-Minute Core Route

**Files:**
- Create: `app/content/field-guide/profile-options.ts`
- Create: `app/content/field-guide/volumes/prepare-device.ts`
- Create: `app/content/field-guide/volumes/connect-intelligence.ts`
- Create: `app/content/field-guide/volumes/first-outcome.ts`
- Create: `app/content/field-guide/volumes/reliable-work.ts`
- Create: `app/content/field-guide/diagnostics.ts`
- Create: `app/content/field-guide/catalog.ts`
- Modify: `tests/field-guide-catalog.test.mjs`
- Delete: `tests/docs-content.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `FieldGuideCatalog`, `LearningStep`, `DiagnosticBranch`, `validateCatalog` from Task 1.
- Produces: `platformOptions`, `providerOptions`, `coreVolumes`, `coreSteps`, `diagnosticBranches`, `fieldGuideCatalog`.

- [ ] **Step 1: Add failing facts and duration tests**

Append tests that assert the new information architecture instead of old article IDs:

```js
import { fieldGuideCatalog } from "../app/content/field-guide/catalog.ts";

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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-catalog.test.mjs`

Expected: FAIL because `field-guide/catalog.ts` does not exist.

- [ ] **Step 3: Define platform and provider options from source**

Create exactly three platform records and seven provider records. Use these values:

| ID | Label | Presets | Base URL | Protocol |
|---|---|---|---|---|
| `windows-x64` | Windows x64 | n/a | n/a | n/a |
| `macos-arm64` | macOS · Apple 芯片 | n/a | n/a | n/a |
| `macos-x64` | macOS · Intel | n/a | n/a | n/a |
| `deepseek` | DeepSeek | DeepSeek-V4-Pro, DeepSeek-V4-Flash | `https://api.deepseek.com` | responses |
| `qwen` | Qwen | Qwen3.8-Max | `https://dashscope.aliyuncs.com/compatible-mode/v1` | responses |
| `glm` | GLM | GLM-5.3, GLM-5.2 | `https://open.bigmodel.cn/api/v1` | responses |
| `kimi` | Kimi | Kimi-K3 | `https://api.moonshot.cn` | responses |
| `minimax` | MiniMax | MiniMax-M3 | `https://api.minimax.io/v1` | responses |
| `custom-responses` | 自定义 · Responses API | 自定义模型 | null | responses |
| `custom-anthropic` | 自定义 · Anthropic Messages | 自定义模型 | null | anthropic |

Verify this table directly against `electron/llm/presets.ts`, `electron/llm/client-factory.ts`, and `shared/ipc.ts` before writing copy.

- [ ] **Step 4: Author the four core volume files from scratch**

Use these exact IDs, outcomes and durations:

| Volume | Step | Minutes | Required content |
|---|---|---:|---|
| `prepare-device` | `prepare.choose-build` | 2 | Confirm platform/architecture and choose official release asset |
| `prepare-device` | `prepare.install` | 4 | Windows NSIS, macOS DMG, SmartScreen/Gatekeeper variants |
| `prepare-device` | `prepare.first-launch` | 2 | Start the app and explain the three-step onboarding |
| `connect-intelligence` | `connect.choose-service` | 3 | Seven provider choices and protocol badge meaning |
| `connect-intelligence` | `connect.enter-settings` | 5 | Provider-specific Base URL/preset guidance; no key appears in docs |
| `connect-intelligence` | `connect.verify` | 4 | Run connection test inside the app and report pass/fail |
| `first-outcome` | `outcome.choose-workspace` | 3 | Pick a bounded working directory and understand path scope |
| `first-outcome` | `outcome.write-brief` | 4 | State outcome, scope, constraints and acceptance evidence |
| `first-outcome` | `outcome.follow-execution` | 3 | Streaming, tool cards, Plan/Build and approvals |
| `first-outcome` | `outcome.review-result` | 2 | Review changed files, evidence and output |
| `reliable-work` | `reliable.approvals` | 3 | Approve only expected write/command/web/memory actions |
| `reliable-work` | `reliable.context` | 3 | Context Hub revision, checkpoint, stale evidence and task gate |
| `reliable-work` | `reliable.review` | 4 | Inspect progress, deliverables and verification evidence |
| `reliable-work` | `reliable.complete` | 3 | Use task completion, summarize result and continue safely |

Every step must contain at least one `prose` block and either `steps`, `fields`, `checklist` or `callout`. Platform/provider differences use block-level `audience`; do not duplicate whole steps.

Use the calm professional mentor voice. Do not copy sentences from `app/content/docs.ts`.

- [ ] **Step 5: Add concrete connection diagnostics**

Create these exact branches, all returning to `connect.verify`:

| ID | Symptom | Required checks |
|---|---|---|
| `connection.unauthorized` | 未授权或凭证无效 | Re-enter key inside app; verify account/provider; rerun test |
| `connection.endpoint` | 找不到地址或协议不匹配 | Verify provider Base URL; verify Responses vs Anthropic; remove Chat Completions assumptions |
| `connection.timeout` | 请求超时或网络不可达 | Check network/proxy/DNS; retry; distinguish provider outage |
| `connection.rate-limit` | 请求频率或额度受限 | Identify 429/quota; wait or restore quota; rerun |
| `connection.unknown` | 其他错误 | Capture non-secret status/message; search guide; return to test |

The `connect.verify` validation task references all five IDs and says explicitly: “不要在网页中输入 API Key”。

- [ ] **Step 6: Aggregate and assert the catalog**

`catalog.ts` exports one frozen `fieldGuideCatalog` value and calls `assertValidCatalog(fieldGuideCatalog)` during module initialization. The catalog version is exactly `"0.9.2"`.

Update `package.json` scripts to make pure tests independently runnable:

```json
{
  "scripts": {
    "test:unit": "node --experimental-strip-types --test tests/field-guide-*.test.mjs tests/reading-progress.test.mjs",
    "test:render": "node --test tests/rendered-html.test.mjs",
    "test": "npm run test:unit && npm run build && npm run test:render"
  }
}
```

Delete `tests/docs-content.test.mjs`; it encodes the explicitly rejected legacy article model.

- [ ] **Step 7: Run tests and typecheck**

Run: `npm run test:unit`

Expected: all field-guide catalog tests and five reading-progress tests PASS.

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 8: Commit the new core content**

```bash
git add app/content/field-guide tests/field-guide-catalog.test.mjs tests/docs-content.test.mjs package.json tsconfig.json
git commit -m "docs: author the core field guide route"
```

---

### Task 3: Add Optional Tracks and Reference Coverage

**Files:**
- Create: `app/content/field-guide/tracks.ts`
- Modify: `app/content/field-guide/catalog.ts`
- Modify: `tests/field-guide-catalog.test.mjs`

**Interfaces:**
- Consumes: `LearningStep[]`, `SideTrack[]`, `fieldGuideCatalog` from Task 2.
- Produces: `trackSteps`, `sideTracks`, glossary entries and complete v0.9.2 reference coverage.

- [ ] **Step 1: Write failing coverage tests**

```js
test("optional tracks cover every major v0.9.2 reference area", () => {
  assert.deepEqual(fieldGuideCatalog.sideTracks.map((track) => track.id), [
    "models-context",
    "workflow-tools",
    "extensions",
    "security-data",
    "troubleshooting",
    "release-reference",
  ]);
  const searchable = JSON.stringify(fieldGuideCatalog);
  for (const fact of [
    "256K、512K 或 1M",
    "90%",
    "research",
    "build",
    "verify",
    "fileScopes",
    "Context Hub",
    "Skills",
    "MCP",
    "17 个默认快捷键",
    "%APPDATA%\\Stellara Work",
    "~/Library/Application Support/Stellara Work",
    "Electron 43.2.0",
  ]) assert.match(searchable, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(searchable, /支持 Chat Completions|不支持 Intel|minimaxi\.com|Electron 31/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-catalog.test.mjs`

Expected: FAIL because `sideTracks` is empty.

- [ ] **Step 3: Author six optional tracks**

Create new step IDs and content under these tracks:

| Track | Required coverage |
|---|---|
| `models-context` | 7 presets; Responses/Anthropic auto-detection; no Chat fallback; 256K/512K/1M; 90% compression; `maxOutputTokens`; `reasoningEffort`; protocol/verification badges |
| `workflow-tools` | Plan vs Build; file/search/command/git/web/memory/subagent/task-complete tools; research/build/verify roles; max 10; concurrency 4; serial build; non-overlapping `fileScopes`; Context Hub checkpoint and gate |
| `extensions` | Skills; MCP; memory scopes and injection limits; all 17 shortcuts |
| `security-data` | Approval timeout and Escape; shell/path/web safeguards; sandbox; Windows/macOS data directories; OS encryption; backup/restore |
| `troubleshooting` | SmartScreen/Gatekeeper; connection diagnostics; 413 context overflow; 429; storage recovery; logs without secrets |
| `release-reference` | v0.9.2 supported platforms; runtime versions; release highlights; current limitations; terminology and historical release pointer |

Each track gets two to five focused steps. Track steps have `volumeId: null`, positive estimated time, searchable aliases, and links back to relevant core steps through `relatedTrackIds`.

Create glossary entries for at least: Responses API, Anthropic Messages, Context Hub, checkpoint, task gate, approval, working directory, subagent, Skills, MCP, memory scope, and reduced motion.

- [ ] **Step 4: Verify content facts against the application repository**

Run these checks while reviewing the authored files:

```bash
git -C "/Users/lhy/Stellara Work" show v0.9.2:electron/llm/presets.ts
git -C "/Users/lhy/Stellara Work" show v0.9.2:shared/shortcuts.ts
git -C "/Users/lhy/Stellara Work" show v0.9.2:electron/agent/subagent-coordinator.ts
git -C "/Users/lhy/Stellara Work" show v0.9.2:electron/context/context-hub.ts
```

Do not “correct” historical release facts using current website text; the application tag is authoritative.

- [ ] **Step 5: Run content gates**

Run: `npm run test:unit`

Expected: PASS.

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 6: Commit optional content**

```bash
git add app/content/field-guide/tracks.ts app/content/field-guide/catalog.ts tests/field-guide-catalog.test.mjs
git commit -m "docs: add field guide tracks and reference coverage"
```

---

### Task 4: Generate Personalized Routes

**Files:**
- Create: `app/lib/field-guide/route-engine.ts`
- Create: `tests/field-guide-route.test.mjs`

**Interfaces:**
- Consumes: `FieldGuideCatalog`, `LearnerProfile`, `LearningStep`, `AudienceCondition`.
- Produces: `ResolvedStep`, `GeneratedRoute`, `matchesAudience`, `resolveStep`, `generateRoute`, `getNextStepId`.

- [ ] **Step 1: Write failing route matrix tests**

```js
import assert from "node:assert/strict";
import test from "node:test";

import { fieldGuideCatalog } from "../app/content/field-guide/catalog.ts";
import { generateRoute, getNextStepId } from "../app/lib/field-guide/route-engine.ts";

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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-route.test.mjs`

Expected: FAIL with missing `route-engine.ts`.

- [ ] **Step 3: Implement audience resolution and deterministic routing**

Use these exact public result types:

```ts
export type ResolvedStep = Omit<LearningStep, "sections"> & { sections: LessonSection[] };

export type GeneratedRoute = {
  id: string;
  profile: LearnerProfile;
  volumes: Array<CoreVolume & { steps: ResolvedStep[] }>;
  steps: ResolvedStep[];
  sideTracks: SideTrack[];
  totalMinutes: number;
};
```

`matchesAudience` returns true for missing conditions and requires membership in every supplied condition. `resolveStep` removes non-matching sections and blocks but preserves section order. Remove a section only when every block is filtered out. `generateRoute` validates platform/provider IDs, resolves all core steps in volume order, attaches all side tracks, and creates `core:<platform>:<provider>`. `getNextStepId` returns the first step not completed at its current content version and returns `null` when every step is complete; its return type is `string | null`.

- [ ] **Step 4: Run matrix, full unit and type tests**

Run: `node --experimental-strip-types --test tests/field-guide-route.test.mjs`

Expected: PASS for all 21 profile combinations.

Run: `npm run test:unit && npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 5: Commit route generation**

```bash
git add app/lib/field-guide/route-engine.ts tests/field-guide-route.test.mjs
git commit -m "feat(docs): generate personalized learning routes"
```

---

### Task 5: Persist and Migrate Local Progress

**Files:**
- Create: `app/lib/field-guide/progress-store.ts`
- Create: `tests/field-guide-progress.test.mjs`

**Interfaces:**
- Consumes: `GuideProgress`, `GeneratedRoute`, `LearningStep`, `LearnerProfile`.
- Produces: `FIELD_GUIDE_STORAGE_KEY`, `createEmptyProgress`, `parseProgress`, `reconcileProgress`, `completeStep`, `acknowledgeReview`, `recordValidation`, `loadProgress`, `saveProgress`, `clearProgress`.

- [ ] **Step 1: Write failing persistence and migration tests**

Cover these exact cases:

```js
test("content version changes preserve completion as review", () => {
  const state = createEmptyProgress();
  state.steps["connect.verify"] = { contentVersion: 1, status: "completed", validationResult: "passed" };
  const route = { steps: [{ id: "connect.verify", contentVersion: 2 }] };
  const reconciled = reconcileProgress(state, route);
  assert.deepEqual(reconciled.steps["connect.verify"], { contentVersion: 2, status: "review", validationResult: "passed" });
  const acknowledged = acknowledgeReview(reconciled, { id: "connect.verify", contentVersion: 2 });
  assert.deepEqual(acknowledged.steps["connect.verify"], { contentVersion: 2, status: "completed", validationResult: "passed" });
});

test("route changes retain only applicable current-version records", () => {
  const state = createEmptyProgress();
  state.steps["prepare.install"] = { contentVersion: 1, status: "completed" };
  state.steps["removed.step"] = { contentVersion: 1, status: "completed" };
  const reconciled = reconcileProgress(state, { steps: [{ id: "prepare.install", contentVersion: 1 }] });
  assert.deepEqual(Object.keys(reconciled.steps), ["prepare.install"]);
});

test("storage exceptions produce unavailable mode without throwing", () => {
  const storage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  assert.equal(loadProgress(storage).kind, "unavailable");
});

test("corrupt JSON requires explicit reset", () => {
  const storage = { getItem() { return "{"; }, setItem() {}, removeItem() {} };
  assert.equal(loadProgress(storage).kind, "corrupt");
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-progress.test.mjs`

Expected: FAIL with missing `progress-store.ts`.

- [ ] **Step 3: Implement versioned state without browser globals**

Use dependency injection so tests pass a memory storage and the hook passes `window.localStorage`:

```ts
export const FIELD_GUIDE_STORAGE_KEY = "stellara.field-guide.progress.v1";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LoadProgressResult =
  | { kind: "empty"; value: GuideProgress }
  | { kind: "ready"; value: GuideProgress }
  | { kind: "corrupt"; value: GuideProgress; raw: string }
  | { kind: "unavailable"; value: GuideProgress };
```

`parseProgress` accepts only schema version 1, valid profile values, valid theme values and object-shaped step records. Unknown or malformed state returns `corrupt`; it never silently resets storage. `saveProgress` returns `{ ok: true }` or `{ ok: false, reason: "unavailable" }`. `recordValidation(state, step, "passed")` stores `status: "completed"`; `recordValidation(state, step, "failed")` stores `status: "in-progress"` without completing it. `acknowledgeReview(state, step)` changes only the selected current-version record from `review` to `completed`.

- [ ] **Step 4: Run progress, full unit and type tests**

Run: `node --experimental-strip-types --test tests/field-guide-progress.test.mjs`

Expected: PASS.

Run: `npm run test:unit && npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 5: Commit local progress**

```bash
git add app/lib/field-guide/progress-store.ts tests/field-guide-progress.test.mjs
git commit -m "feat(docs): persist versioned guide progress"
```

---

### Task 6: Build Local Search and Result Ranking

**Files:**
- Create: `app/lib/field-guide/search-index.ts`
- Create: `tests/field-guide-search.test.mjs`

**Interfaces:**
- Consumes: `FieldGuideCatalog`, `GeneratedRoute`.
- Produces: `SearchDocument`, `SearchResult`, `buildSearchIndex`, `searchFieldGuide`, `groupSearchResults`.

- [ ] **Step 1: Write failing ranking and fallback tests**

```js
test("an error code ranks diagnosis before general lessons", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  const results = searchFieldGuide(index, "401", { currentStepIds: ["connect.verify"] });
  assert.equal(results[0].kind, "diagnostic");
  assert.equal(results[0].id, "connection.unauthorized");
});

test("current-route lessons rank before optional references", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  const results = searchFieldGuide(index, "连接模型", { currentStepIds: ["connect.choose-service", "connect.enter-settings", "connect.verify"] });
  assert.equal(results[0].kind, "step");
  assert.ok(results.slice(0, 3).every((result) => result.inCurrentRoute));
});

test("blank query returns the complete browsable index", () => {
  const index = buildSearchIndex(fieldGuideCatalog);
  assert.deepEqual(searchFieldGuide(index, "", { currentStepIds: [] }), index.map((entry) => ({ ...entry, score: 0, inCurrentRoute: false })));
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-search.test.mjs`

Expected: FAIL with missing `search-index.ts`.

- [ ] **Step 3: Implement deterministic index generation and scoring**

Create one document per step, diagnostic and glossary entry. Store normalized lowercase text and original title/summary. Score exact diagnostic alias at 500, title exact at 350, current route at +200, title contains at +120, body contains at +50, and glossary alias at +80. Sort by score descending and stable catalog order for ties. Do not add a fuzzy-search dependency.

Use these public shapes:

```ts
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
```

`groupSearchResults` returns groups in `diagnostic`, `step`, `glossary` order with Chinese labels `建议诊断`, `手册内容`, `术语`.

- [ ] **Step 4: Run search, full unit and type tests**

Run: `node --experimental-strip-types --test tests/field-guide-search.test.mjs`

Expected: PASS.

Run: `npm run test:unit && npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 5: Commit local search**

```bash
git add app/lib/field-guide/search-index.ts tests/field-guide-search.test.mjs
git commit -m "feat(docs): add local field guide search"
```

---

### Task 7: Replace the Docs Entry with Profile Setup

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/helpers.ts`
- Create: `tests/e2e/field-guide-setup.spec.ts`
- Create: `app/components/field-guide/FieldManual.tsx`
- Create: `app/components/field-guide/useFieldGuideState.ts`
- Create: `app/components/field-guide/FieldGuideHeader.tsx`
- Create: `app/components/field-guide/ProfileSetup.tsx`
- Create: `app/components/field-guide/RouteBook.tsx`
- Create: `app/docs/field-manual.css`
- Modify: `app/docs/page.tsx`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `fieldGuideCatalog`, `generateRoute`, progress-store functions.
- Produces: `/docs` SSR shell, profile setup, `useFieldGuideState()` controller, Playwright harness.

- [ ] **Step 1: Install browser-test development dependencies and configure scripts**

Run:

```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install chromium
```

Add scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:update": "playwright test --update-snapshots"
  }
}
```

Add `/test-results/`, `/playwright-report/`, and `/blob-report/` to `.gitignore`. Do not ignore `tests/e2e/*-snapshots/`.

Configure Playwright with `testDir: "./tests/e2e"`, `baseURL: "http://127.0.0.1:3000"`, `webServer.command: "npm run start"`, and `webServer.url: "http://127.0.0.1:3000/docs"`. Name the Chromium projects exactly `desktop` (1440×1000) and `mobile` (390×844). Use `reuseExistingServer: !process.env.CI`, trace on first retry, and screenshot only on failure outside visual tests.

- [ ] **Step 2: Write failing setup and SSR tests**

Use exact accessible labels:

```ts
import { expect, test } from "@playwright/test";

test("first visit creates a personalized field guide", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByText("Stellara Field Notes")).toBeVisible();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
  await page.getByRole("radio", { name: "Windows x64" }).check();
  await page.getByRole("radio", { name: "DeepSeek" }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();
  await expect(page.getByRole("heading", { name: "准备好你的工作环境" })).toBeVisible();
  await expect(page.getByText("45 分钟")).toBeVisible();
});
```

Update `/docs` rendered HTML assertions to require `Stellara Field Notes`, `为你编排一份现场手册`, `准备环境`, and `数据仅保存在当前浏览器`; remove `22 个主题` and old article-title assertions.

- [ ] **Step 3: Build and verify RED**

Run: `npm run build && npm run test:render`

Expected: rendered test FAIL because old `DocsExplorer` remains.

Run: `npm run test:e2e -- --project=desktop tests/e2e/field-guide-setup.spec.ts`

Expected: FAIL because the profile setup is absent.

- [ ] **Step 4: Implement the setup shell and state controller**

`useFieldGuideState` owns a reducer with these public actions:

```ts
type FieldGuideAction =
  | { type: "hydrate"; result: LoadProgressResult }
  | { type: "set-profile"; profile: LearnerProfile }
  | { type: "open-step"; stepId: string }
  | { type: "set-theme"; theme: ManualTheme }
  | { type: "storage-unavailable" }
  | { type: "confirm-corrupt-reset" }
  | { type: "reset-route" }
  | { type: "clear-all" };
```

The hook reads localStorage only in an effect, never during server render. Before hydration and with no saved profile, render `ProfileSetup`; a saved valid profile regenerates and reconciles its route. The initial setup uses a semantic form with one radio fieldset for three platforms, one for seven providers, and a disabled submit until both are chosen. Browser platform detection may preselect Windows vs macOS but may not guess Apple vs Intel architecture.

`FieldGuideHeader` initially exposes brand, theme status and a disabled search affordance until the route exists. `FieldManual` sets `data-field-guide` and `data-manual-theme` on its own root; it must not mutate `<html data-theme>`.

Create the durable `RouteBook` component now with the generated route title, 45-minute total and four volume rows. It is the post-setup destination tested in this task; Task 8 adds individual lesson navigation, the dual-page body and mobile drawer to the same component rather than replacing it with a temporary screen.

Replace `app/docs/page.tsx` with the new component, import `./field-manual.css`, remove `SiteHeader`, `SiteFooter`, and `DocsExplorer`, and update metadata to “个性化现场手册”。

Create a minimal scoped stylesheet sufficient for setup and header; final visual tokens arrive in Task 11.

- [ ] **Step 5: Make SSR and setup tests GREEN**

Run: `npm run test:unit && npm run build && npm run test:render`

Expected: PASS.

Run: `npm run test:e2e -- --project=desktop tests/e2e/field-guide-setup.spec.ts`

Expected: PASS.

Run: `npm run lint && npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 6: Commit the new entry experience**

```bash
git add package.json package-lock.json playwright.config.ts .gitignore app/docs/page.tsx app/docs/field-manual.css app/components/field-guide tests/rendered-html.test.mjs tests/e2e/helpers.ts tests/e2e/field-guide-setup.spec.ts
git commit -m "feat(docs): replace docs entry with field manual setup"
```

---

### Task 8: Render the Editorial Book and Lessons

**Files:**
- Modify: `app/components/field-guide/RouteBook.tsx`
- Create: `app/components/field-guide/LessonReader.tsx`
- Create: `app/components/field-guide/GuideDialog.tsx`
- Modify: `app/components/field-guide/FieldManual.tsx`
- Modify: `app/components/field-guide/useFieldGuideState.ts`
- Modify: `app/components/field-guide/FieldGuideHeader.tsx`
- Modify: `app/docs/field-manual.css`
- Create: `tests/e2e/field-guide-learning.spec.ts`
- Modify: `tests/e2e/helpers.ts`

**Interfaces:**
- Consumes: `GeneratedRoute`, `ResolvedStep`, `open-step` action and `acknowledgeReview`.
- Produces: route table of contents, active lesson, hash deep links, `acknowledge-review` action, focus-safe shared dialog and mobile route drawer.

- [ ] **Step 1: Write failing desktop and mobile lesson tests**

The helper `createGuide(page, platformLabel, providerLabel)` completes setup. Tests must assert:

```ts
test("desktop shows the route on the left and lesson on the right", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop structure belongs to the desktop project");
  await createGuide(page, "Windows x64", "DeepSeek");
  await expect(page.getByRole("navigation", { name: "学习路线" })).toContainText("准备好设备");
  await expect(page.getByRole("article")).toContainText("确认你的安装版本");
  await page.getByRole("button", { name: /接通智能能力/ }).click();
  await expect(page).toHaveURL(/#connect\.choose-service$/);
  await expect(page.getByRole("article")).toContainText("选择模型服务");
});

test("an obsolete step hash returns to the route with an explanation", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.goto("/docs#retired.step");
  await expect(page.getByRole("status")).toContainText("此内容已移动，已返回你的学习路线");
  await expect(page).toHaveURL(/#prepare\.choose-build$/);
});

test("mobile uses a single lesson and opens route navigation on demand", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile structure belongs to the mobile project");
  await createGuide(page, "macOS · Apple 芯片", "Kimi");
  await expect(page.locator("[data-layout='mobile-single-page']")).toBeVisible();
  await page.getByRole("button", { name: "打开学习路线" }).click();
  await expect(page.getByRole("dialog", { name: "学习路线" })).toBeVisible();
});
```

- [ ] **Step 2: Run targeted E2E and verify RED**

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-learning.spec.ts`

Expected: FAIL because the book and lesson components are missing.

- [ ] **Step 3: Implement the route book**

Desktop markup is one `<section className="manual-book">` with `<nav aria-label="学习路线">` as the left page and `<LessonReader>` as the right page. Each volume button shows number, title, duration and derived state: 完成、需复查、当前、未开始. A volume button opens its first incomplete step; individual step buttons remain available so the route is guidance, not a lock.

Selecting a step runs inside `startTransition`, updates `activeStepId`, writes `#<stepId>` using `history.replaceState`, and moves focus to the lesson `<article tabIndex={-1}>`. On load, accept a hash only when it belongs to the generated route or a side track. An unknown hash opens the next incomplete core step and announces `此内容已移动，已返回你的学习路线`.

Below the four core volumes, render an `延伸阅读` section containing all six optional tracks. Opening a track reveals its step list without changing core progress; closing it returns focus to the track trigger. A header `完整目录` action opens the same route-and-track tree.

Mobile renders one lesson; the same route tree appears in `GuideDialog`. Implement the final shared API now: `open`, `title`, `onClose`, `initialFocusRef`, and `children`. On open it stores the active trigger, sets background content inert, focuses the requested control or close button, traps Tab/Shift+Tab, closes on Escape, removes inert, and restores trigger focus before unmount. It renders `role="dialog"`, `aria-modal="true"`, a labelled heading and explicit close button. Search and settings reuse this component in Task 10 without changing its contract.

- [ ] **Step 4: Implement all new lesson block variants**

`LessonReader` switches exhaustively over `LessonBlock.type` and renders prose, numbered steps, fields, callouts, checklists and code. Code blocks include a labeled copy button and a polite “已复制” status. Unknown block types must fail TypeScript exhaustiveness with `const unreachable: never = block`.

The article heading shows volume number, step outcome, estimated time and stable section anchors `<stepId>-<sectionId>`. It does not render old breadcrumbs, article count, print controls or reading-percentage bar. A step marked `review` displays `内容已更新` plus `确认已复查`; activating it calls `acknowledgeReview` and restores the completed state at the current content version.

- [ ] **Step 5: Add responsive structural CSS**

At widths ≥1024px use a two-page grid between 360/640px within a maximum 1180px canvas. At widths <1024px hide the left page and expose the route button. At widths <640px use full-width content, 16px gutters, 44px minimum controls and a safe-area-aware bottom action region. No CSS from `.docs-*` selectors may be copied.

- [ ] **Step 6: Run route UI gates**

Run: `npm run lint && npx tsc --noEmit && npm run test:unit`

Expected: PASS.

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-learning.spec.ts`

Expected: desktop and mobile tests PASS.

- [ ] **Step 7: Commit the book experience**

```bash
git add app/components/field-guide app/docs/field-manual.css tests/e2e/helpers.ts tests/e2e/field-guide-learning.spec.ts
git commit -m "feat(docs): add editorial route and lesson views"
```

---

### Task 9: Close the Validation and Diagnostic Loop

**Files:**
- Create: `app/components/field-guide/ValidationFlow.tsx`
- Create: `app/components/field-guide/DiagnosticFlow.tsx`
- Modify: `app/components/field-guide/LessonReader.tsx`
- Modify: `app/components/field-guide/useFieldGuideState.ts`
- Modify: `app/lib/field-guide/progress-store.ts`
- Modify: `app/docs/field-manual.css`
- Modify: `tests/e2e/field-guide-learning.spec.ts`
- Modify: `tests/field-guide-progress.test.mjs`

**Interfaces:**
- Consumes: `ValidationTask`, `DiagnosticBranch`, `recordValidation`, route progress.
- Produces: `ValidationFlow`, `DiagnosticFlow`, reducer actions `record-validation`, `open-diagnostic`, `return-to-validation`.

- [ ] **Step 1: Write failing pass, fail and restore tests**

Add an E2E scenario that navigates to `connect.verify`, confirms the page never asks for an API Key, clicks `验证失败`, chooses `未授权或凭证无效`, sees `检查凭证是否有效`, clicks `问题已解决，重新验证`, then clicks `验证通过`. Assert the step status changes to `完成`, progress increases, and reload preserves it.

Add a unit test asserting `recordValidation(state, step, "failed")` retains `status` unset while `"passed"` stores current `contentVersion` with `status: "completed"`.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --experimental-strip-types --test tests/field-guide-progress.test.mjs`

Expected: FAIL on validation state behavior.

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-learning.spec.ts`

Expected: FAIL because validation buttons are absent.

- [ ] **Step 3: Implement validation without handling secrets**

`ValidationFlow` renders application instructions first, then two explicit buttons: `验证通过` and `验证失败`. Include the warning “API Key 始终留在 Stellara Work 中；不要粘贴到本网页。” There is no input for API Key, Base URL, full error logs or arbitrary secrets.

Passed behavior: call `recordValidation`, persist, announce `本步骤已完成`, update route progress and show `继续下一步`. Failed behavior: persist only `validationResult: "failed"`, open a symptom chooser from the task's five diagnostic IDs, and announce `请选择应用显示的错误类型`.

- [ ] **Step 4: Implement branch diagnosis and focus flow**

`DiagnosticFlow` displays one branch step at a time with instruction and expected result. `下一项检查` advances locally; `问题已解决，重新验证` returns to the validation card and focuses its heading. `仍未解决` advances or, on the final check, exposes `搜索其他错误` and `返回验证步骤`. Diagnosis does not mark the core step complete.

Use a single polite live region for progress and a separate assertive region for failed validation. Do not use color alone; include icons plus text labels.

- [ ] **Step 5: Run validation gates**

Run: `npm run test:unit && npx tsc --noEmit && npm run lint`

Expected: PASS.

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-learning.spec.ts`

Expected: pass/fail/diagnosis/reload scenarios PASS.

- [ ] **Step 6: Commit validation and diagnosis**

```bash
git add app/components/field-guide app/lib/field-guide/progress-store.ts app/docs/field-manual.css tests/field-guide-progress.test.mjs tests/e2e/field-guide-learning.spec.ts
git commit -m "feat(docs): add validation and diagnostic flows"
```

---

### Task 10: Add Search, Theme and Local Data Controls

**Files:**
- Create: `app/components/field-guide/SearchDialog.tsx`
- Create: `app/components/field-guide/GuideSettingsDialog.tsx`
- Modify: `app/components/field-guide/FieldGuideHeader.tsx`
- Modify: `app/components/field-guide/FieldManual.tsx`
- Modify: `app/components/field-guide/useFieldGuideState.ts`
- Modify: `app/components/field-guide/RouteBook.tsx`
- Modify: `app/docs/field-manual.css`
- Create: `tests/e2e/field-guide-search-settings.spec.ts`

**Interfaces:**
- Consumes: `buildSearchIndex`, `searchFieldGuide`, progress-store reset/clear/profile/theme operations.
- Produces: Cmd/Ctrl+K search, full index fallback, settings controls and storage error UI using Task 8's `GuideDialog`.

- [ ] **Step 1: Write failing search and settings E2E tests**

Cover exact behavior:

```ts
test("command search ranks a 401 diagnosis and restores focus", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  const trigger = page.getByRole("button", { name: "搜索手册" });
  await trigger.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  const dialog = page.getByRole("dialog", { name: "查阅手册" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox").fill("401");
  await expect(dialog.getByRole("option").first()).toContainText("检查凭证是否有效");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("theme follows settings and survives reload", async ({ page }) => {
  await createGuide(page, "macOS · Intel", "自定义 · Anthropic Messages");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  await expect(page.locator("[data-manual-theme='night']")).toBeVisible();
  await page.reload();
  await expect(page.locator("[data-manual-theme='night']")).toBeVisible();
});
```

Add tests for changing profile and rebuilding the route, separate confirmations for `重置当前路线` and `清除全部本地数据`, unavailable storage banner, and corrupt state requiring explicit reset.

- [ ] **Step 2: Run targeted E2E and verify RED**

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-search-settings.spec.ts`

Expected: FAIL because dialogs and controls are absent.

- [ ] **Step 3: Reuse the shared dialog for search and settings**

Render both new panels through Task 8's `GuideDialog`. Pass the search input through `initialFocusRef`; settings uses the close button as initial focus. Add E2E assertions that Tab remains inside each dialog, Escape restores the correct header trigger, and opening one dialog closes the other before focus moves.

- [ ] **Step 4: Implement local search**

Open from the header or Cmd/Ctrl+K. Use `useDeferredValue(query)` before `searchFieldGuide`; do not add `useMemo` merely to hold the static index. Arrow keys change the active option, Enter opens the result, and Escape closes. Group results as 建议诊断、手册内容、术语. A blank query displays the full index; a caught index error displays the same browsable index with the note `搜索暂时不可用，以下是完整目录`.

Selecting a core step closes the dialog and opens it. Selecting a diagnostic opens its return step with that diagnostic active. Selecting a glossary item displays an inline definition panel in the dialog.

- [ ] **Step 5: Implement theme and local data settings**

Settings includes three theme radios (`跟随系统`, `日间版`, `夜间版`), current platform/provider with `重新生成路线`, `重置当前路线`, and `清除全部本地数据`. Route reset preserves profile/theme but clears steps; clear-all returns to profile setup and system theme. Each destructive action has its own confirmation wording.

When storage is unavailable, show a persistent status banner `当前为临时会话；关闭页面后进度会丢失`. When storage is corrupt, block automatic reset and offer `检查失败的数据` plus explicit `重置本地进度`.

- [ ] **Step 6: Run search/settings gates**

Run: `npm run test:unit && npm run lint && npx tsc --noEmit`

Expected: PASS.

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-search-settings.spec.ts`

Expected: search, focus, theme, route rebuild and local data tests PASS.

- [ ] **Step 7: Commit search and local controls**

```bash
git add app/components/field-guide app/docs/field-manual.css tests/e2e/field-guide-search-settings.spec.ts
git commit -m "feat(docs): add search and local guide controls"
```

---

### Task 11: Finish the Editorial Visual System and Accessibility

**Files:**
- Modify: `app/docs/field-manual.css`
- Modify: `app/globals.css`
- Delete: `app/components/DocsExplorer.tsx`
- Delete: `app/content/docs.ts`
- Delete: `app/utils/readingProgress.js`
- Delete: `tests/reading-progress.test.mjs`
- Modify: `package.json`
- Create: `tests/e2e/field-guide-visual.spec.ts`
- Create: `tests/e2e/field-guide-visual.spec.ts-snapshots/*.png`

**Interfaces:**
- Consumes: complete field-guide component tree.
- Produces: approved day/night editorial themes, responsive layout, reduced-motion behavior, axe-clean UI and committed visual baselines.

- [ ] **Step 1: Write failing accessibility and visual tests**

Use `@axe-core/playwright` without disabling rules:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { createGuide } from "./helpers";

test("field guide has no automatically detectable accessibility violations", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("desktop day edition matches the approved baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop visual belongs to the desktop project");
  await createGuide(page, "Windows x64", "DeepSeek");
  await expect(page).toHaveScreenshot("field-guide-day-desktop.png", { fullPage: true, animations: "disabled" });
});

test("mobile night edition matches the approved baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile visual belongs to the mobile project");
  await createGuide(page, "macOS · Apple 芯片", "Kimi");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("field-guide-night-mobile.png", { fullPage: true, animations: "disabled" });
});
```

Run the axe assertion after each of these setup functions: profile setup, active lesson, search dialog, settings dialog, failed validation symptom chooser, and active diagnostic step. Do not disable any axe rule.

Generate four reviewed snapshots with project guards: `field-guide-day-desktop.png`, `field-guide-night-desktop.png`, `field-guide-day-mobile.png`, and `field-guide-night-mobile.png`. Desktop tests skip outside the `desktop` project; mobile tests skip outside the `mobile` project.

Add a reduced-motion test using `page.emulateMedia({ reducedMotion: "reduce" })`. Read the lesson transition's computed `animationDuration` and accept only `0s`, `0.01ms`, or `1e-05s`.

- [ ] **Step 2: Run visual tests and verify RED**

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-visual.spec.ts`

Expected: FAIL for missing snapshots and any accessibility defects found before polish.

- [ ] **Step 3: Implement exact editorial tokens**

Scope all variables under `.field-manual`:

```css
.field-manual {
  --manual-paper: #f8f3e9;
  --manual-paper-2: #e4d4bf;
  --manual-ink: #281f19;
  --manual-muted: #6c5d51;
  --manual-rule: #cbbbac;
  --manual-accent: #9f2e23;
  --manual-accent-contrast: #ffffff;
  --manual-display: Georgia, "Songti SC", STSong, "Noto Serif CJK SC", SimSun, serif;
  --manual-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --manual-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

.field-manual[data-manual-theme="night"] {
  --manual-paper: #191512;
  --manual-paper-2: #2a231e;
  --manual-ink: #eee2d3;
  --manual-muted: #b7a596;
  --manual-rule: #4c4036;
  --manual-accent: #df7765;
  --manual-accent-contrast: #1b1613;
}
```

Duplicate night tokens inside `@media (prefers-color-scheme: dark)` for `[data-manual-theme="system"]`. Use title line length ≤20 Chinese characters, body line length ≤42rem, body line-height 1.8, minimum body 16px desktop/15px mobile, 44px touch targets, and visible 3px focus rings using the current accent.

Only opacity and transform may animate. Use 180ms entry, 140ms exit and 120ms state changes. Add:

```css
@media (prefers-reduced-motion: reduce) {
  .field-manual *,
  .field-manual *::before,
  .field-manual *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Remove every legacy docs artifact**

Delete `DocsExplorer.tsx`, `docs.ts`, `readingProgress.js` and its test. Remove `.docs-*` blocks and `[data-theme="dark"]` document overrides from `globals.css`; preserve homepage/download/site header/footer styles. Confirm `globals.css` has no selectors beginning `.docs-` and no global `[data-theme="dark"]` block.

Update `package.json` unit script to remove `tests/reading-progress.test.mjs`:

```json
{
  "scripts": {
    "test:unit": "node --experimental-strip-types --test tests/field-guide-*.test.mjs"
  }
}
```

- [ ] **Step 5: Fix all axe findings and generate visual baselines**

Run: `npm run build && npm run test:e2e -- tests/e2e/field-guide-visual.spec.ts --update-snapshots`

Expected: axe has zero violations and desktop/mobile day/night PNGs are created under the Playwright snapshot directory.

Review every generated image at full size before accepting it. Reject clipping, double scrollbars, sticky controls covering content, line lengths above the specified limits, insufficient status differentiation, or desktop styles leaking into mobile.

- [ ] **Step 6: Run all quality gates**

Run: `npm run lint && npx tsc --noEmit && npm test`

Expected: PASS.

Run: `npm run test:e2e`

Expected: all Chromium projects PASS.

- [ ] **Step 7: Commit visual completion and legacy removal**

```bash
git add app/docs/field-manual.css app/globals.css app/components/DocsExplorer.tsx app/content/docs.ts app/utils/readingProgress.js tests/reading-progress.test.mjs tests/e2e/field-guide-visual.spec.ts tests/e2e/field-guide-visual.spec.ts-snapshots package.json
git commit -m "style(docs): finish the editorial field guide"
```

---

### Task 12: Gate Deployment and Verify the Complete Replacement

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`
- Create: `tests/workflow-contract.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: deployment quality gate and verified static GitHub Pages artifact.

- [ ] **Step 1: Add a failing workflow contract assertion**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowUrl = new URL("../.github/workflows/deploy-pages.yml", import.meta.url);

test("Pages deployment runs every field guide quality gate", async () => {
  const workflow = await readFile(workflowUrl, "utf8");
  for (const command of [
    "npm run lint",
    "npx tsc --noEmit",
    "npm test",
    "npx playwright install --with-deps chromium",
    "npm run test:e2e",
    "GITHUB_PAGES",
  ]) assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
```

- [ ] **Step 2: Run the workflow contract and verify RED**

Run: `node --test tests/workflow-contract.test.mjs`

Expected: FAIL because the current workflow only builds the static site.

- [ ] **Step 3: Update the Pages workflow in dependency order**

After `npm ci`, add these steps:

```yaml
      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npx tsc --noEmit

      - name: Unit, build, and rendered HTML tests
        run: npm test

      - name: Install Chromium
        run: npx playwright install --with-deps chromium

      - name: Browser and accessibility tests
        run: npm run test:e2e

      - name: Build static site
        run: npm run build
        env:
          GITHUB_PAGES: "true"
```

Keep artifact upload at `./dist/client`. The non-Pages build produced by `npm test` is used by Playwright; the final Pages build replaces it before upload.

Update `test:unit` so `npm test` also enforces the workflow contract:

```json
{
  "scripts": {
    "test:unit": "node --experimental-strip-types --test tests/field-guide-*.test.mjs tests/workflow-contract.test.mjs"
  }
}
```

- [ ] **Step 4: Run the entire local verification sequence**

Run in this exact order:

```bash
npm ci
npm run lint
npx tsc --noEmit
npm test
npx playwright install chromium
npm run test:e2e
GITHUB_PAGES=true npm run build
git diff --check
```

Expected: every command exits 0; rendered `/docs` contains the new field-guide setup; all 21 route matrices pass; Playwright desktop/mobile and axe tests pass; static build ends with `Build complete`.

- [ ] **Step 5: Perform final manual checks**

Run `npm run start` after the normal build and check:

1. `/docs` first visit on desktop.
2. Windows + DeepSeek route generation.
3. macOS Intel + custom Anthropic route generation.
4. Validation failure into 401 diagnosis and return.
5. Cmd/Ctrl+K search and focus restoration.
6. Night theme persistence after reload.
7. Route progress restoration after reload.
8. Profile change preserving applicable steps.
9. Corrupt storage explicit-reset flow.
10. 390×844 mobile route drawer and bottom action clearance.

Verify `/` and `/download` remain visually and functionally unchanged.

- [ ] **Step 6: Commit deployment gates**

```bash
git add .github/workflows/deploy-pages.yml tests/workflow-contract.test.mjs package.json
git commit -m "test(docs): gate field guide deployment"
```

## Completion Criteria

- `/docs` contains no old DocsExplorer UI, old article model or old document CSS.
- All four core volumes and six optional tracks are authored from application sources, not old website prose.
- Every supported platform/provider pair generates a valid 45-minute route.
- Browser state migration, storage failure and explicit reset are tested.
- API Key never appears in an input, saved state or diagnostic payload.
- Search, validation, diagnosis, theme and progress restore work by keyboard.
- Desktop day, desktop night, mobile day and mobile night visual baselines are reviewed.
- axe reports zero violations on setup, lesson, search, settings and diagnostic states.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run test:e2e`, and `GITHUB_PAGES=true npm run build` all pass.
- Homepage and download page remain unchanged.
