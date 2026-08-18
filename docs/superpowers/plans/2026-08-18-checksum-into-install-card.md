# 下载页校验值并入安装信息卡 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将独立的「验证下载文件」校验值区块并入版本信息区的安装信息卡，作为第 4 行（SHA-256 + 复制按钮），并移除独立区块及其样式。

**Architecture:** 只改 `app/components/DownloadPanel.tsx`（安装信息卡新增第 4 行、删除 checksum-section JSX、合并备注文案）、`app/globals.css`（新增哈希行样式、删除 checksum 区块样式）、`tests/rendered-html.test.mjs`（新增 `checksum-section` 移除断言）。

**Tech Stack:** React 19 + Next.js 16 (vinext) + TypeScript + lucide-react；测试用 `node --test`（渲染测试需先 `npm run build`）。

## Global Constraints

- 哈希值常量 `sha256`（`78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037`）必须继续渲染在下载路由 HTML 中（现有测试断言依赖）。
- 复制交互逻辑（`copyHash`、`copied` 状态、1800ms 反馈）不变，仅移动位置。
- 安装信息卡前 3 行（系统 / 包体积 / 文件）与卡片头部、底部备注结构保留。
- 备注文案改为：`安装器未设置额外的 Windows 版本限制。下载后可复制 SHA-256 校验文件完整性。`
- `tests/rendered-html.test.mjs` 下载路由其余断言必须继续匹配（`下载通道准备中`、`111.8 MiB`、安装文件名、`首次引导`、`连接测试通过，配置已保存`、`class="version-card"`、`changelog-card`、`version-panel` 不存在、版本区无 `aria-expanded`）。
- 测试流程：渲染断言变更后先 `npm run build` 再 `node --test tests/rendered-html.test.mjs`。
- 只修改 app/components/DownloadPanel.tsx、app/globals.css、tests/rendered-html.test.mjs。

---

### Task 1: 校验值并入安装信息卡

**Files:**
- Modify: `app/components/DownloadPanel.tsx`（安装信息卡新增第 4 行；删除 checksum-section）
- Modify: `app/globals.css`（新增哈希行样式；删除 checksum 区块样式）
- Modify: `tests/rendered-html.test.mjs`（新增 `checksum-section` 移除断言）

**Interfaces:**
- Consumes: 现有 `sha256` 常量、`copyHash` 函数、`copied` 状态（`app/components/DownloadPanel.tsx` 顶部与组件内，均保持不动）
- Produces: 安装信息卡第 4 行（`.install-card__hash`）；导出名 `DownloadPanel` 与文件路径不变

- [ ] **Step 1: 在下载路由测试中新增移除断言（先写失败测试）**

在 `tests/rendered-html.test.mjs` 的 `server-renders the download route` 测试中、现有断言之后追加：

```js
  assert.doesNotMatch(html, /checksum-section/);
```

- [ ] **Step 2: 运行构建与测试，确认失败**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：构建成功；下载路由测试 FAIL（`checksum-section` 仍存在于 HTML）。

- [ ] **Step 3: 修改 `app/components/DownloadPanel.tsx`**

**3a. 删除独立校验值区块**（当前第 157–169 行的整个 `<section className="checksum-section page-shell">...</section>` 块）：

```tsx
      <section className="checksum-section page-shell" aria-labelledby="checksum-title">
        <div className="checksum-copy">
          <span className="icon-box"><FileCheck2 aria-hidden="true" size={21} /></span>
          <div><h2 id="checksum-title">验证下载文件</h2><p>下载完成后，可用 SHA-256 确认文件是否完整。</p></div>
        </div>
        <div className="checksum-value">
          <code>{sha256}</code>
          <button type="button" onClick={copyHash} aria-label="复制 SHA-256 校验值">
            {copied ? <Check aria-hidden="true" size={16} /> : <Clipboard aria-hidden="true" size={16} />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </section>
```

**3b. 安装信息卡的 `<dl>` 追加第 4 行**（在现有第 149 行 `<div><dt><FolderKanban .../>文件</dt><dd>{installerName}</dd></div>` 之后追加）：

```tsx
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{sha256}</code>
                    <button type="button" onClick={copyHash} aria-label="复制 SHA-256 校验值">
                      {copied ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copied ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
```

**3c. 更新底部备注**（第 151 行）：

```tsx
              <p className="install-card__note">安装器未设置额外的 Windows 版本限制。下载后可复制 SHA-256 校验文件完整性。</p>
```

**3d. 核对图标导入**：`Clipboard`、`Check`、`FileCheck2`、`FolderKanban`、`Laptop`、`HardDrive` 仍被使用（第 4 行 dt 用 `Clipboard`，复制按钮用 `Clipboard`/`Check`）；若 lint 报未使用导入则移除。

- [ ] **Step 4: 修改 `app/globals.css`**

**4a. 删除校验值区块样式**：

- 删除基础块（第 494–500 行）：`.checksum-section`、`.checksum-copy`、`.checksum-copy h2`、`.checksum-copy p`、`.checksum-value`、`.checksum-value code`、`.checksum-value button`。
- 删除 `@media (max-width: 860px)` 中的 `.checksum-section { grid-template-columns: 1fr; gap: 18px; }`（第 712 行）。
- 删除 `@media (max-width: 640px)` 中的 `.checksum-value { grid-template-columns: 1fr; }`、`.checksum-value code { ... }`、`.checksum-value button { justify-content: center; }`（第 749–751 行）。

**4b. 在 `.install-card__note` 规则之后追加哈希行样式**：

```css
.install-card__hash dd {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  font-weight: 400;
}
.install-card__hash-code {
  min-width: 0;
  flex: 1 1 auto;
  font: 11px/1.7 var(--font-mono);
  color: var(--ink-soft);
  overflow-wrap: anywhere;
  text-align: right;
}
.install-card__hash dd button {
  flex-shrink: 0;
  min-height: 44px;
  padding: 4px 11px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
  color: var(--blue-dark);
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;
}
.install-card__hash dd button:hover { background: var(--bg-soft); border-color: var(--line-strong); }
```

- [ ] **Step 5: 运行构建与测试，确认通过**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：全部测试 PASS，含新断言（`checksum-section` 不存在）与既有 SHA-256 断言（哈希值仍在安装信息卡内）。

- [ ] **Step 6: 检查类型与 lint**

运行：`npx tsc --noEmit` 与 `npm run lint`
预期：无错误。

- [ ] **Step 7: 提交**

```bash
git add app/components/DownloadPanel.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat(download): merge checksum into install info card"
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

运行：`git diff --check`，并确认 `git status` 无多余文件（`docs/` 为计划文档，忽略；`package-lock.json` 若被 npm 改动则 `git checkout -- package-lock.json` 还原）。

- [ ] **Step 3: GitHub Pages 静态导出检查**

运行：`GITHUB_PAGES=true npm run build`，确认 `dist/client/download/index.html` 存在且不含 `checksum-section`、全树无 `.exe`；随后重新执行 `npm run build` 恢复常规产物。

- [ ] **Step 4: 提交（如有验证修正）**

若任何验证脚本需要修正，提交对应修正：

```bash
git add -A
git commit -m "chore(download): finalize checksum merge verification"
```