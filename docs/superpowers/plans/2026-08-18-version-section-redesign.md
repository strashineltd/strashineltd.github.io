# 下载页版本信息区重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将下载页版本信息区重排为三栏等宽卡片（版本卡片 / 本次更新 / 安装信息），并修复软色带被限制在内容宽度内的区域显示问题。

**Architecture:** 只改 `app/components/DownloadPanel.tsx` 的版本区 JSX 与 `app/globals.css` 的版本区样式：版本区改为全宽 `section--soft` 色带 + 内部 `page-shell` 容器；`version-layout` 改三栏等宽网格；移除折叠状态与折叠按钮；在 `tests/rendered-html.test.mjs` 增加新结构断言。

**Tech Stack:** React 19 + Next.js 16 (vinext) + TypeScript + lucide-react；测试用 `node --test`（渲染测试需先 `npm run build`）。

## Global Constraints

- 版本号、日期、更新文案、安装信息文本全部保留（`v0.9.0`、`2026-07-30`、5 条 `releaseNotes`、`Windows x64`、`111.8 MiB`、`Stellara Work-Setup-0.9.0.exe`、`安装器未设置额外的 Windows 版本限制。`）。
- 本次更新列表**常驻展开**：移除 `releaseOpen` 状态与折叠按钮；`useState` 保留（仍用于校验值复制）。
- 版本区从 `<section className="version-section section section--soft page-shell">` 改为全宽 `<section className="version-section section section--soft">`，内容包裹 `<div className="page-shell">`。
- `tests/rendered-html.test.mjs` 下载路由现有断言必须继续匹配（`下载通道准备中`、`111.8 MiB`、安装文件名、SHA-256 值、`首次引导`、`连接测试通过，配置已保存`）。
- 测试流程：渲染断言变更后先 `npm run build` 再 `node --test tests/rendered-html.test.mjs`。
- 移动端 `≤860px` 三栏堆叠为单列；版本区垂直留白沿用现有断点（`padding-block: 82px`）。

---

### Task 1: 版本信息区三栏重排

**Files:**
- Modify: `app/components/DownloadPanel.tsx`（版本区 JSX；移除折叠状态；移除 `ChevronDown` 导入）
- Modify: `app/globals.css`（版本区全宽色带、三栏网格、新增版本卡/更新卡样式、更新 release-notes 为 `li` 结构、删除 version-panel 系列）
- Modify: `tests/rendered-html.test.mjs`（下载路由测试新增结构断言）

**Interfaces:**
- Consumes: 现有 `releaseNotes` 常量（`app/components/DownloadPanel.tsx` 顶部，5 项字符串数组，保持不动）
- Produces: 三栏版本区（`.version-card` / `.changelog-card` / `.install-card`）；导出名 `DownloadPanel` 与文件路径不变

- [ ] **Step 1: 在下载路由测试中新增结构断言（先写失败测试）**

在 `tests/rendered-html.test.mjs` 的 `server-renders the download route` 测试中、现有断言之后追加：

```js
  assert.match(html, /version-card/);
  assert.match(html, /changelog-card/);
  assert.doesNotMatch(html, /version-panel/);
```

- [ ] **Step 2: 运行构建与测试，确认失败**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：构建成功；下载路由测试 FAIL（`version-card` 未匹配；`version-panel` 仍存在）。

- [ ] **Step 3: 重写 `app/components/DownloadPanel.tsx` 的版本区 JSX**

将版本区 `<section ...aria-labelledby="version-title">...</section>`（当前第 113–150 行）整体替换为：

```tsx
      <section className="version-section section section--soft" aria-labelledby="version-title">
        <div className="page-shell">
          <span className="section-kicker">版本信息</span>
          <h2 id="version-title" className="version-title">v0.9.0 内测版</h2>
          <p className="version-lead">这一版本已经完成从项目、会话到执行与审批的桌面工作闭环。</p>
          <div className="version-layout">
            <article className="version-card">
              <span className="version-card__badge">内测版</span>
              <h3 className="version-card__num">v0.9.0</h3>
              <dl className="version-card__meta">
                <div><dt>发布日期</dt><dd>2026-07-30</dd></div>
              </dl>
              <div className="version-card__status">
                <span className="version-card__ok"><Check aria-hidden="true" size={14} />已通过本地构建验证</span>
                <span className="version-card__wait">公开托管通道准备中</span>
              </div>
            </article>

            <article className="changelog-card">
              <div className="changelog-card__head">
                <h3>本次更新</h3>
                <small>2026-07-30</small>
              </div>
              <ul className="release-notes">
                {releaseNotes.map((note) => (
                  <li key={note}><Check aria-hidden="true" size={15} /><span>{note}</span></li>
                ))}
              </ul>
            </article>

            <aside className="install-card" aria-label="安装信息">
              <div className="install-card__head">
                <span className="icon-box"><FileCheck2 aria-hidden="true" size={20} /></span>
                <h3>安装信息</h3>
              </div>
              <dl>
                <div><dt><Laptop aria-hidden="true" size={18} />系统</dt><dd>Windows x64</dd></div>
                <div><dt><HardDrive aria-hidden="true" size={18} />包体积</dt><dd>111.8 MiB</dd></div>
                <div><dt><FolderKanban aria-hidden="true" size={18} />文件</dt><dd>{installerName}</dd></div>
              </dl>
              <p className="install-card__note">安装器未设置额外的 Windows 版本限制。</p>
            </aside>
          </div>
        </div>
      </section>
```

同时在组件内完成以下修改：

- 删除 `const [releaseOpen, setReleaseOpen] = useState(true);`（`useState` 仍需保留给 `copied`）。
- 从 lucide-react 导入列表中**删除 `ChevronDown`**（已无使用）。
- 保留 `Check`、`FileCheck2`、`Laptop`、`HardDrive`、`FolderKanban` 等仍被使用的图标导入。

- [ ] **Step 4: 更新 `app/globals.css` 版本区样式**

替换 `.version-layout` 规则为三栏网格（原 `grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);` → 三栏等宽）：

```css
.version-layout { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: stretch; }
```

在 `.install-card__note` 规则之后追加：

```css
.version-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
}
.version-card__badge {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--blue);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.version-card__num { margin: 0; font-size: 40px; line-height: 1.1; letter-spacing: -0.04em; }
.version-card__meta { margin: 0; display: grid; gap: 8px; }
.version-card__meta > div { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; font-size: 13px; }
.version-card__meta dt { color: var(--ink-faint); }
.version-card__meta dd { margin: 0; color: var(--ink); font-weight: 600; }
.version-card__status {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 8px;
  font-size: 12px;
}
.version-card__ok { display: flex; align-items: center; gap: 7px; color: var(--green); font-weight: 600; }
.version-card__wait { color: var(--ink-faint); }

.changelog-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
}
.changelog-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}
.changelog-card__head h3 { margin: 0; font-size: 18px; }
.changelog-card__head small { color: var(--ink-faint); font-size: 11px; }
```

替换现有 `.release-notes` 块（当前第 1009–1011 行的 `div` 结构版本）为 `li` 结构版本：

```css
.release-notes { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; }
.release-notes li { display: flex; align-items: flex-start; gap: 10px; color: var(--ink-soft); font-size: 14px; line-height: 1.6; }
.release-notes li svg { margin-top: 2px; color: var(--green); flex-shrink: 0; }
```

删除不再使用的 `.version-panel` 系列规则（`.version-panel`、`.version-panel__header`、`.version-panel__header span > *`、`.version-panel__header strong`、`.version-panel__header small`、`.version-panel__icon`、`.version-panel__icon--open`）。

- [ ] **Step 5: 运行构建与测试，确认通过**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：全部测试 PASS，含新断言（`version-card` 匹配、`changelog-card` 匹配、`version-panel` 不存在）。

- [ ] **Step 6: 检查类型与 lint**

运行：`npx tsc --noEmit` 与 `npm run lint`
预期：无错误。若 lint 报未使用导入，按提示移除。

- [ ] **Step 7: 提交**

```bash
git add app/components/DownloadPanel.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat(download): redesign version info section into three equal cards"
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

运行：`git diff --check`，并确认 `git status` 无多余文件（`docs/` 为未跟踪的计划文档，忽略即可；`package-lock.json` 若被 npm 改动，`git checkout -- package-lock.json` 还原）。

- [ ] **Step 3: GitHub Pages 静态导出检查**

运行：`GITHUB_PAGES=true npm run build`，确认 `dist/client/download/index.html` 存在、全树无 `.exe` 安装文件；随后重新执行 `npm run build` 恢复常规产物。

- [ ] **Step 4: 提交（如有验证修正）**

若任何验证脚本需要修正，提交对应修正：

```bash
git add -A
git commit -m "chore(download): finalize version section verification"
```