# 下载页与站内文档双平台文案更新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 消除双平台发布后残留的 Windows-only 与「下载待开放」过期文案：下载页 hero 导语 + 站内文档 `docs.ts`（安装指南/FAQ/版本变更/搜索词/日期）+ 两处测试断言。

**Architecture:** 纯文案与断言替换：`app/components/DownloadPanel.tsx`（1 处）、`app/content/docs.ts`（6 处内容 + keywords + 3 篇文章 updated 日期）、`tests/rendered-html.test.mjs` 与 `tests/docs-content.test.mjs`（各 1 处断言）。

**Tech Stack:** React 19 + Next.js 16 (vinext) + TypeScript；测试用 `node --test`（渲染测试需先 `npm run build`）。

## Global Constraints

- 所有新文案以本计划给出的精确字符串为准（含全角括号、引号、标点）。
- 旧文案 `公开安装包暂未上传` 与 `下载通道准备中`（文档正文）必须从站内文档与文档路由 HTML 中消失；下载路由的 `下载通道准备中` 不匹配断言保持。
- 测试断言：`安装包通过 GitHub Releases 提供` 在文档路由 HTML 与 `docs.ts` 源码中必须匹配。
- 文档正文中与平台无关的内容（模型、审批、快捷键、本地数据等）一律不改。
- `app/content/docs.ts` 是 TypeScript 数据文件：所有修改必须保持合法 TS 字符串字面量（引号/逗号完整）。
- 只修改 app/components/DownloadPanel.tsx、app/content/docs.ts、tests/rendered-html.test.mjs、tests/docs-content.test.mjs。

---

### Task 1: 文案与断言更新

**Files:**
- Modify: `app/components/DownloadPanel.tsx`（hero 导语 1 处）
- Modify: `app/content/docs.ts`（B 项全部）
- Modify: `tests/rendered-html.test.mjs`（文档路由断言 1 处）
- Modify: `tests/docs-content.test.mjs`（断言 1 处）

**Interfaces:**
- Consumes: 现有 `docArticles` 数据结构（无需改类型）
- Produces: 更新后的文案数据；`DownloadPanel` 导出不变

- [ ] **Step 1: 更新两处测试断言（先写失败测试）**

**1a.** `tests/rendered-html.test.mjs` 文档路由测试（`server-renders the documentation route`）中，将 `assert.match(html, /公开安装包暂未上传/);` 替换为：

```js
  assert.match(html, /安装包通过 GitHub Releases 提供/);
```

**1b.** `tests/docs-content.test.mjs` 中，将 `assert.match(source, /公开安装包暂未上传/);` 替换为：

```js
  assert.match(source, /安装包通过 GitHub Releases 提供/);
```

- [ ] **Step 2: 运行构建与测试，确认失败**

运行：`npm run build && node --test tests/rendered-html.test.mjs tests/docs-content.test.mjs`
预期：构建成功；文档路由测试与 docs-content 测试 FAIL（新文案未匹配）。

- [ ] **Step 3: 修改 `app/components/DownloadPanel.tsx` hero 导语**

将 hero 导语（约第 49 行）：

```tsx
              为 Windows x64 打造的本地优先桌面 Agent。安装后选择模型和工作目录，即可开始第一个任务。
```

改为：

```tsx
              为 Windows 与 macOS 打造的本地优先桌面 Agent。安装后选择模型和工作目录，即可开始第一个任务。
```

- [ ] **Step 4: 修改 `app/content/docs.ts`（按精确文本替换）**

**4a. install-setup 文章「发布范围与安装前准备」正文首段**（以 `id: "install-setup"` 所在文章内、`id: "requirements"` 章节的首个 body 字符串为定位）：

替换：
`"Stellara Work v0.9 当前面向 Windows x64。安装器采用可选择安装位置的 NSIS 向导，并会创建开始菜单与桌面快捷方式。项目尚未发布明确的最低 Windows 版本，因此文档不会虚构系统版本门槛。",`
为：
`"Stellara Work v0.9 提供 Windows x64 与 macOS（Apple 芯片）安装包。Windows 安装器采用可选择安装位置的 NSIS 向导，并会创建开始菜单与桌面快捷方式；macOS 安装包以 DMG 形式提供，需要 macOS 12 或更高版本。",`

**4b. install-setup 文章安装前清单**：

替换：`"Windows x64 电脑",`
为：`"Windows x64 或 macOS（Apple 芯片）电脑",`

**4c. install-setup 文章「当前下载状态」提示卡**（`id: "requirements"` 章节的 note）：

替换：
```
        note: {
          tone: "warning",
          title: "当前下载状态",
          body: "公开安装包暂未上传，下载页会显示\"下载通道准备中\"。在正式开放前，请勿从非官方来源获取同名安装程序。",
        },
```
为：
```
        note: {
          tone: "success",
          title: "下载方式",
          body: "安装包通过 GitHub Releases 提供，下载页可直接跳转。请仅从官方 GitHub 仓库获取安装程序，并核对发布页给出的 SHA-256 校验值。",
        },
```

**4d. FAQ 文章「支持 macOS 或 Linux 吗？」**（`id: "faq"` 文章、`id: "platform"` 章节，替换整个 body 数组的两个字符串）：

替换：
```
          "当前公开产品信息只确认 Windows x64 安装器。文档不会承诺 macOS、Linux、ARM64 或明确的最低 Windows 版本；后续以下载页和正式发布说明为准。",
          "如果需要在其他平台使用，可以关注官方发布渠道获取最新信息。当前版本的代码架构基于 Electron，理论上具备跨平台潜力，但官方尚未公布具体计划。",
```
为：
```
          "当前公开版本提供 Windows x64 与 macOS（Apple 芯片）安装包；macOS 需要 12.0 或更高版本。Linux 版本尚未提供。",
          "如果需要在 Linux 等平台使用，可以关注官方发布渠道获取最新信息。",
```

**4e. FAQ 文章「为什么下载按钮暂时不可用？」**（`id: "installer"` 章节，整节替换标题与正文）：

替换：
```
      {
        id: "installer",
        title: "为什么下载按钮暂时不可用？",
        body: [
          "安装包尚未上传到公开站点，因此下载页只展示版本、文件名、体积和校验信息，不提供无效链接。通道开放后应从本站下载，并核对发布页给出的 SHA-256。",
          "在安装包正式发布前，可以从官方渠道获取测试版本。测试版本可能包含未修复的已知问题，不建议在生产环境中使用。",
        ],
      },
```
为：
```
      {
        id: "installer",
        title: "在哪里下载安装包？",
        body: [
          "安装包通过 GitHub Releases 提供：从下载页点击\"前往下载\"即可跳转。下载完成后，建议核对发布页给出的 SHA-256 校验值，确认文件完整。",
          "请仅从官方 GitHub 仓库获取安装包，避免从非官方来源下载同名文件。当前 v0.9 为内测版本，可能包含未修复的已知问题。",
        ],
      },
```

**4f. changelog 文章（`id: "changelog"`）三处列表项**：

替换：`{ title: "平台限制", detail: "仅支持 Windows x64，暂无 macOS 和 Linux 版本。" },`
为：`{ title: "平台限制", detail: "Windows 提供 x64 安装包；macOS 提供 Apple 芯片版本；暂无 Linux 版本。" },`

替换：`{ title: "安装包", detail: "公开安装包尚未发布，下载通道准备中。" },`
为：`{ title: "安装包", detail: "安装包通过 GitHub Releases 发布；下载前请核对 SHA-256 校验值。" },`

替换：`{ title: "跨平台支持", detail: "探索 macOS 和 Linux 版本的可能性。" },`
为：`{ title: "跨平台支持", detail: "探索 Linux 版本的可能性。" },`

**4g. install-setup 文章 keywords**（在 `id: "install-setup"` 的 keywords 数组中 `"x64"` 之后插入 `"macOS"`）：

替换：`keywords: ["安装", "Windows", "x64", "首次启动", "引导", "API Key", "工作目录", "连接测试", "NSIS", "快捷方式"],`
为：`keywords: ["安装", "Windows", "x64", "macOS", "首次启动", "引导", "API Key", "工作目录", "连接测试", "NSIS", "快捷方式"],`

**4h. 三篇文章的 updated 日期**（各自文章内定位，勿动其他文章）：

- `id: "install-setup"` 文章：`updated: "2026-07-31",` → `updated: "2026-08-18",`
- `id: "faq"` 文章：`updated: "2026-07-31",` → `updated: "2026-08-18",`
- `id: "changelog"` 文章：`updated: "2026-08-02",` → `updated: "2026-08-18",`

- [ ] **Step 5: 运行构建与测试，确认通过**

运行：`npm run build && node --test tests/rendered-html.test.mjs tests/docs-content.test.mjs`
预期：全部 PASS（新断言匹配、文档路由与下载路由其余断言保持）。

- [ ] **Step 6: 检查类型与 lint**

运行：`npx tsc --noEmit` 与 `npm run lint`
预期：无错误。

- [ ] **Step 7: 提交**

```bash
git add app/components/DownloadPanel.tsx app/content/docs.ts tests/rendered-html.test.mjs tests/docs-content.test.mjs
git commit -m "docs: update dual-platform and download channel copy"
```

---

### Task 2: 完整验证

**Files:**
- 无源码改动；仅验证

**Interfaces:**
- Consumes: Task 1 的实现

- [ ] **Step 1: 运行完整验证套件**

运行：`npm run lint && npx tsc --noEmit && npm test`
预期：lint 无错误、类型检查通过、构建成功、9 项测试全部 PASS。

- [ ] **Step 2: 检查残留旧文案**

运行：`grep -rn "下载通道准备中\|公开安装包暂未上传" app/ tests/ --include="*.tsx" --include="*.ts" --include="*.mjs" | grep -v "assert.doesNotMatch"`
预期：无输出（下载路由测试中的 `doesNotMatch` 断言除外）。

- [ ] **Step 3: 检查 diff 空白与工作树**

运行：`git diff --check`，并确认 `git status` 无多余文件（`docs/` 为计划文档，忽略）。

- [ ] **Step 4: GitHub Pages 静态导出检查**

运行：`GITHUB_PAGES=true npm run build`，确认 `dist/client/docs/index.html` 含 `安装包通过 GitHub Releases 提供`、不含 `公开安装包暂未上传`；随后重新执行 `npm run build` 恢复常规产物。

- [ ] **Step 5: 提交（如有验证修正）**

若任何验证脚本需要修正，提交对应修正：

```bash
git add -A
git commit -m "chore(docs): finalize dual-platform copy verification"
```