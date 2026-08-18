# 下载页 hero 按钮通用化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将下载页 hero 主按钮从「下载 Windows 版」改为通用文案「前往下载 v0.9」，按钮旁说明改为双平台描述。

**Architecture:** 只改 `app/components/DownloadPanel.tsx` 两处文案与 `tests/rendered-html.test.mjs` 一处断言。链接、图标、样式、平台卡、安装卡均不动。

**Tech Stack:** React 19 + Next.js 16 (vinext) + TypeScript；测试用 `node --test`（渲染测试需先 `npm run build`）。

## Global Constraints

- hero 主按钮文案改为 `前往下载 v0.9`；保留 `Download` 图标、`button--primary button--download` 类、`releaseUrl` 链接与 `target="_blank" rel="noopener noreferrer"`。
- 按钮旁说明改为 `Windows x64 与 macOS (arm64) · 2026-08-16`。
- 平台卡（`前往 GitHub 下载`）、安装信息卡、徽章行、GitHub URL、双 SHA-256、`117.3 MiB`/`144.4 MiB` 断言全部保留。
- `下载 Windows 版` 不得再出现在下载路由 HTML 中。
- 测试流程：渲染断言变更后先 `npm run build` 再 `node --test tests/rendered-html.test.mjs`。
- 只修改 app/components/DownloadPanel.tsx 与 tests/rendered-html.test.mjs。

---

### Task 1: hero 按钮通用化

**Files:**
- Modify: `app/components/DownloadPanel.tsx`（hero 按钮文案 + 按钮旁说明）
- Modify: `tests/rendered-html.test.mjs`（按钮文案断言）

**Interfaces:**
- Consumes: 现有 `releaseUrl` 常量与组件结构
- Produces: 更新后的 `DownloadPanel`（导出名不变）

- [ ] **Step 1: 更新测试断言（先写失败测试）**

在 `tests/rendered-html.test.mjs` 的下载路由测试中，将 `assert.match(html, /下载 Windows 版/);` 替换为：

```js
  assert.match(html, /前往下载 v0\.9/);
  assert.doesNotMatch(html, /下载 Windows 版/);
```

- [ ] **Step 2: 运行构建与测试，确认失败**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：构建成功；下载路由测试 FAIL（`前往下载 v0.9` 未匹配；`下载 Windows 版` 仍存在）。

- [ ] **Step 3: 修改 `app/components/DownloadPanel.tsx`**

**3a. hero 按钮文案**（第 54 行附近）：

```tsx
                前往下载 v0.9
```

**3b. 按钮旁说明**：

```tsx
              <span>Windows x64 与 macOS (arm64) · 2026-08-16</span>
```

- [ ] **Step 4: 运行构建与测试，确认通过**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：全部测试 PASS（新断言匹配、旧文案不存在、其余断言保持）。

- [ ] **Step 5: 检查类型与 lint**

运行：`npx tsc --noEmit` 与 `npm run lint`
预期：无错误。

- [ ] **Step 6: 提交**

```bash
git add app/components/DownloadPanel.tsx tests/rendered-html.test.mjs
git commit -m "feat(download): generalize hero download button for dual platforms"
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

- [ ] **Step 2: 检查 diff 空白与工作树**

运行：`git diff --check`，并确认 `git status` 无多余文件（`docs/` 为计划文档，忽略）。

- [ ] **Step 3: GitHub Pages 静态导出检查**

运行：`GITHUB_PAGES=true npm run build`，确认 `dist/client/download/index.html` 含 `前往下载 v0.9`、不含 `下载 Windows 版`、含 `前往 GitHub 下载`；随后重新执行 `npm run build` 恢复常规产物。

- [ ] **Step 4: 提交（如有验证修正）**

若任何验证脚本需要修正，提交对应修正：

```bash
git add -A
git commit -m "chore(download): finalize generic hero button verification"
```