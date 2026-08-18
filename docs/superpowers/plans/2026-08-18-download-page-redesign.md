# 下载页 UI 重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将下载页重设计为现代 SaaS 产品站风格（渐变 hero + 产品演示窗口 + 精致卡片网格），保留全部内容与「诚实待开放」下载状态，不引入科幻风格。

**Architecture:** 新增纯展示的 `DownloadDemo` 演示窗组件，重构 `DownloadPanel` 的 JSX 结构，样式全部集中在 `app/globals.css`。所有现有测试断言保持通过，仅在下载路由测试中新增演示窗内容断言。

**Tech Stack:** React 19 + Next.js 16 (vinext) + TypeScript + lucide-react；测试用 `node --test`（`tests/rendered-html.test.mjs` 需先 `npm run build` 生成 `dist/server`）。

## Global Constraints

- 保留全部现有下载页内容：版本信息、平台支持、更新日志、系统要求、SHA-256 校验值、三步引导。
- 下载按钮保持禁用状态，文案 `下载通道准备中`（安装包未公开托管，不虚构可用按钮）。
- 所有颜色引用 `globals.css` 现有变量（`--blue`、`--blue-soft`、`--green`、`--charcoal`、`--line`、`--ink-*` 等）；新渐变仅用于 hero 背景与演示窗辉光。
- 保持无障碍：44px 触控目标、可见焦点、`prefers-reduced-motion` 支持、移动端单列堆叠。
- `tests/rendered-html.test.mjs` 下载路由断言必须继续匹配：`Stellara Work-Setup-0.9.0.exe`、`111.8 MiB`、`下载通道准备中`、`78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037`。
- 测试流程约定：任何渲染断言变更后先执行 `npm run build`，再执行 `node --test tests/rendered-html.test.mjs`。

---

### Task 1: 新增 DownloadDemo 演示窗口组件与样式

**Files:**
- Create: `app/components/DownloadDemo.tsx`
- Modify: `app/globals.css`（追加演示窗口样式段）
- Modify: `tests/rendered-html.test.mjs`（下载路由测试新增演示窗内容断言）

**Interfaces:**
- Consumes: 无（不依赖既有组件）
- Produces: `DownloadDemo` — 导出函数组件，无 props，无内部状态，纯展示。供 Task 2 的 `DownloadPanel` 在 hero 右侧渲染。

- [ ] **Step 1: 在下载路由测试中新增演示窗断言（先写失败测试）**

在 `tests/rendered-html.test.mjs` 的 `server-renders the download route` 测试中、现有断言之后追加：

```js
  assert.match(html, /首次引导/);
  assert.match(html, /连接测试通过，配置已保存/);
```

- [ ] **Step 2: 运行构建与测试，确认失败**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：构建成功；下载路由测试 FAIL，报 `首次引导` 未匹配（组件尚未创建）。

- [ ] **Step 3: 创建 `app/components/DownloadDemo.tsx`**

```tsx
"use client";

import { Check, ShieldCheck } from "lucide-react";

export function DownloadDemo() {
  return (
    <div className="download-demo">
      <div className="download-demo__glow" aria-hidden="true" />
      <div className="download-demo__window">
        <div className="download-demo__bar">
          <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
          <span>Stellara Work · 首次引导</span>
          <small>v0.9</small>
        </div>
        <div className="download-demo__body">
          <aside className="download-demo__steps">
            <span className="download-demo__steps-label">引导</span>
            <div className="download-demo__step download-demo__step--active">
              <span className="download-demo__num">1</span>选择模型
            </div>
            <div className="download-demo__step">
              <span className="download-demo__num">2</span>选择目录
            </div>
            <div className="download-demo__step">
              <span className="download-demo__num">3</span>连接测试
            </div>
          </aside>
          <div className="download-demo__main">
            <div className="download-demo__head">
              <span>DeepSeek-v4-Pro <em>当前</em></span>
              <small>工作目录 · D:\project</small>
            </div>
            <div className="download-demo__message">
              <span className="download-demo__tag">Agent</span>
              <p>已连接到模型服务。我将在你确认的项目目录内开始第一个任务。</p>
            </div>
            <div className="download-demo__approval">
              <ShieldCheck aria-hidden="true" size={13} />
              <strong>准备写入 README.md</strong>
              <span className="download-demo__actions">
                <button type="button">拒绝</button>
                <button type="button" className="download-demo__approve">允许这一次</button>
              </span>
            </div>
            <div className="download-demo__ok">
              <Check aria-hidden="true" size={12} />连接测试通过，配置已保存
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 在 `app/globals.css` 追加演示窗口样式**

在文件末尾（`@media (prefers-reduced-motion: reduce)` 块之前）追加：

```css
/* Download demo window */
.download-demo { position: relative; }
.download-demo__glow {
  position: absolute;
  inset: -30px -20px auto -20px;
  height: 60px;
  background: radial-gradient(60% 60% at 50% 0%, rgba(47, 111, 221, 0.12), transparent 70%);
  pointer-events: none;
}
.download-demo__window {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: 14px;
  background: #fff;
  box-shadow: var(--shadow-lg);
}
.download-demo__bar {
  height: 40px;
  padding: 0 12px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--line);
  background: #f7f8fa;
  color: var(--ink-faint);
}
.download-demo__bar > span { justify-self: center; color: var(--ink-soft); font-size: 11px; font-weight: 650; }
.download-demo__bar > small { justify-self: end; font: 10px var(--font-mono); color: var(--ink-faint); }
.download-demo__body {
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 14px;
  background: linear-gradient(180deg, #fafbfd, #fff);
}
.download-demo__steps { padding: 12px 9px; border-radius: 9px; background: var(--charcoal); }
.download-demo__steps-label {
  display: block;
  margin: 0 6px 10px;
  color: #7f8998;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.download-demo__step {
  min-height: 30px;
  padding: 5px 6px;
  display: flex;
  align-items: center;
  gap: 7px;
  border-radius: 6px;
  color: #9aa4b3;
  font-size: 10px;
}
.download-demo__step + .download-demo__step { margin-top: 4px; }
.download-demo__step--active { background: #2c3442; color: #f5f7fa; }
.download-demo__num {
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border: 1px solid #3a4352;
  border-radius: 50%;
  font-size: 9px;
  color: #8f98a7;
}
.download-demo__step--active .download-demo__num { border-color: var(--blue); background: var(--blue); color: #fff; }
.download-demo__main { min-width: 0; }
.download-demo__head {
  min-height: 34px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  font-size: 10px;
  color: var(--ink-soft);
}
.download-demo__head em {
  padding: 2px 7px;
  border-radius: 5px;
  background: var(--blue-soft);
  border: 1px solid #d8e5ff;
  color: var(--blue-dark);
  font-style: normal;
  font-weight: 700;
  font-size: 9px;
}
.download-demo__head small { color: var(--ink-faint); font-size: 9px; }
.download-demo__message {
  margin-top: 12px;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  font-size: 10px;
  color: #3c4450;
}
.download-demo__tag {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.download-demo__message p { margin: 4px 0 0; line-height: 1.6; }
.download-demo__approval {
  margin-top: 12px;
  padding: 9px 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #f0ddb4;
  border-radius: 8px;
  background: var(--amber-soft);
  color: #755215;
  font-size: 10px;
}
.download-demo__approval svg { flex-shrink: 0; }
.download-demo__approval strong { font-weight: 700; }
.download-demo__actions { margin-left: auto; display: flex; gap: 5px; }
.download-demo__actions button {
  min-height: 24px;
  padding: 2px 9px;
  border: 1px solid #d8c496;
  border-radius: 5px;
  background: #fff;
  color: #755215;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
}
.download-demo__actions .download-demo__approve { background: #8a5c10; border-color: #8a5c10; color: #fff; }
.download-demo__ok {
  margin-top: 12px;
  padding: 9px 11px;
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #cfe6d8;
  border-radius: 8px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 10px;
  font-weight: 600;
}
```

- [ ] **Step 5: 运行构建与测试，确认通过**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：全部测试 PASS（此时组件尚未接入页面，但组件文件已存在；若下载路由断言 `首次引导` 失败，属预期 —— 见 Step 6 说明）。

> 说明：`DownloadDemo` 尚未被 `DownloadPanel` 引用，因此下载路由 HTML 尚不包含 `首次引导`。若你的执行采用「严格红-绿」流程，请将本任务与 Task 2 的接入步骤合并验证；若分开执行，本任务以「组件可独立编译、构建成功」为通过标准，测试断言在 Task 2 接入后转绿。

- [ ] **Step 6: 提交**

```bash
git add app/components/DownloadDemo.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat(download): add onboarding demo window component"
```

---

### Task 2: 重构 DownloadPanel 为新结构

**Files:**
- Modify: `app/components/DownloadPanel.tsx`（整体重构 JSX）
- Modify: `app/globals.css`（新增 hero 渐变、chips、平台卡、版本/安装信息面板、校验卡样式）

**Interfaces:**
- Consumes: `DownloadDemo`（来自 Task 1，`import { DownloadDemo } from "./DownloadDemo"`）
- Produces: 重构后的 `DownloadPanel` 组件（无 props 导出名不变，供 `app/download/page.tsx` 继续引用）

- [ ] **Step 1: 重写 `app/components/DownloadPanel.tsx`**

用以下内容整体替换：

```tsx
"use client";

import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  FileCheck2,
  FolderKanban,
  HardDrive,
  Laptop,
  Monitor,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { DownloadDemo } from "./DownloadDemo";

const installerName = "Stellara Work-Setup-0.9.0.exe";
const sha256 = "78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037";
const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const releaseNotes = [
  "项目与会话分组、搜索、重命名和导出",
  "三栏紧凑工作台与可切换工作区模式",
  "文件读写、命令执行、Diff 与结果卡片",
  "危险操作审批顶部条与计划模式",
  "模型管理、Skills 和可配置快捷键",
];

export function DownloadPanel() {
  const [copied, setCopied] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(true);

  async function copyHash() {
    await navigator.clipboard.writeText(sha256);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <section className="download-hero">
        <div className="page-shell download-hero__grid">
          <div className="download-hero__copy">
            <span className="eyebrow"><span className="status-dot" aria-hidden="true" />v0.9 内测版</span>
            <h1>下载 Stellara Work</h1>
            <p className="download-hero__lead">
              为 Windows x64 打造的本地优先桌面 Agent。安装后选择模型和工作目录，即可开始第一个任务。
            </p>
            <div className="download-hero__actions">
              <button className="button button--primary button--download" type="button" disabled>
                <ShieldCheck aria-hidden="true" size={19} />
                下载通道准备中
              </button>
              <span>安装包已构建 · 111.8 MiB · x64 · 2026-07-30</span>
            </div>
            <div className="download-feedback" role="status">
              <CheckCircle2 aria-hidden="true" size={17} />
              v0.9 安装包已通过本地构建验证，公开文件托管通道正在准备。
            </div>
            <ul className="download-chips" aria-label="版本摘要">
              <li><span className="download-chip__dot" aria-hidden="true" />Windows x64 <strong>可下载</strong></li>
              <li>NSIS 安装向导</li>
              <li>版本 <strong>0.9.0</strong></li>
            </ul>
          </div>

          <div className="download-hero__demo">
            <DownloadDemo />
          </div>
        </div>
      </section>

      <section className="platform-section section page-shell" aria-labelledby="platform-title">
        <div className="section-heading section-heading--split">
          <div><span className="section-kicker">可用平台</span><h2 id="platform-title">选择你的系统</h2></div>
          <p>v0.9 当前提供 Windows x64 安装包；其他平台尚未提供。</p>
        </div>
        <div className="platform-grid">
          <article className="platform-card platform-card--available">
            <div className="platform-card__header">
              <span className="icon-box"><Monitor aria-hidden="true" size={22} /></span>
              <span className="availability">可下载</span>
            </div>
            <h3>Windows</h3>
            <p>64 位安装包，支持自定义安装目录、桌面与开始菜单快捷方式。</p>
            <span className="platform-card__disabled">安装包暂未公开托管</span>
          </article>
          <article className="platform-card">
            <div className="platform-card__header">
              <span className="icon-box"><Apple aria-hidden="true" size={22} /></span>
              <span className="availability availability--muted">尚未提供</span>
            </div>
            <h3>macOS</h3>
            <p>当前版本没有 macOS 构建。请关注后续版本更新。</p>
            <span className="platform-card__disabled">暂不可下载</span>
          </article>
          <article className="platform-card">
            <div className="platform-card__header">
              <span className="icon-box"><Terminal aria-hidden="true" size={22} /></span>
              <span className="availability availability--muted">尚未提供</span>
            </div>
            <h3>Linux</h3>
            <p>当前版本没有 Linux 构建。请关注后续版本更新。</p>
            <span className="platform-card__disabled">暂不可下载</span>
          </article>
        </div>
      </section>

      <section className="version-section section section--soft page-shell" aria-labelledby="version-title">
        <span className="section-kicker">版本信息</span>
        <h2 id="version-title" className="version-title">v0.9.0 内测版</h2>
        <p className="version-lead">这一版本已经完成从项目、会话到执行与审批的桌面工作闭环。</p>
        <div className="version-layout">
          <div className="version-panel">
            <button
              className="version-panel__header"
              type="button"
              aria-expanded={releaseOpen}
              onClick={() => setReleaseOpen((value) => !value)}
            >
              <span><strong>本次更新</strong><small>2026-07-30</small></span>
              <ChevronDown aria-hidden="true" size={18} className={releaseOpen ? "version-panel__icon version-panel__icon--open" : "version-panel__icon"} />
            </button>
            {releaseOpen && (
              <div className="release-notes">
                {releaseNotes.map((note) => (
                  <div key={note}><Check aria-hidden="true" size={15} /><span>{note}</span></div>
                ))}
              </div>
            )}
          </div>

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
      </section>

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

      <section className="download-help page-shell">
        <div>
          <span className="section-kicker">第一次使用？</span>
          <h2>安装后，三步开始第一个任务。</h2>
        </div>
        <ol>
          <li><span>1</span><p><strong>选择模型</strong>使用内置预设或添加兼容服务。</p></li>
          <li><span>2</span><p><strong>选择目录</strong>指定 Agent 可以理解和操作的项目。</p></li>
          <li><span>3</span><p><strong>描述任务</strong>从分析项目或修复一个小问题开始。</p></li>
        </ol>
        <Link className="text-link" href="/docs">阅读快速开始 <ArrowRight aria-hidden="true" size={16} /></Link>
      </section>
    </>
  );
}
```

- [ ] **Step 2: 在 `app/globals.css` 追加新版下载页样式**

在文件末尾追加：

```css
/* Download page v2 */
.download-hero {
  padding-block: 88px 100px;
  background: linear-gradient(180deg, #ffffff 0%, #eef4ff 100%);
  border-bottom: 1px solid var(--line);
}
.download-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 56px;
  align-items: center;
}
.download-hero h1 { margin: 18px 0 16px; font-size: clamp(48px, 5.2vw, 70px); line-height: 1.08; letter-spacing: -0.052em; }
.download-hero__lead { max-width: 600px; margin: 0; color: var(--ink-soft); font-size: 18px; line-height: 1.8; }
.download-hero__actions { margin-top: 30px; display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
.download-hero__actions > span { color: var(--ink-faint); font-size: 12px; }
.button--download { min-height: 54px; padding-inline: 24px; }
.download-feedback {
  width: fit-content;
  margin-top: 18px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 13px;
}
.download-chips {
  margin: 26px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}
.download-chips li {
  min-height: 34px;
  padding: 5px 13px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 550;
}
.download-chips strong { color: var(--ink); font-weight: 700; }
.download-chip__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }
.download-hero__demo { min-width: 0; }

.version-section { padding-block: 88px 96px; }
.version-title { margin: 8px 0 8px; font-size: clamp(34px, 4vw, 46px); letter-spacing: -0.04em; }
.version-lead { margin: 0 0 30px; max-width: 650px; color: var(--ink-soft); }
.version-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr); gap: 18px; align-items: start; }
.version-panel { overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.version-panel__header {
  width: 100%;
  min-height: 62px;
  padding: 12px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.version-panel__header span > * { display: block; }
.version-panel__header strong { font-size: 15px; }
.version-panel__header small { margin-top: 2px; color: var(--ink-faint); font-size: 11px; }
.version-panel__icon { transition: transform 180ms ease; color: var(--ink-faint); }
.version-panel__icon--open { transform: rotate(180deg); }
.release-notes { padding: 0 22px 22px; display: grid; gap: 12px; }
.release-notes > div { display: flex; align-items: center; gap: 10px; color: var(--ink-soft); font-size: 14px; }
.release-notes svg { color: var(--green); flex-shrink: 0; }
.install-card { padding: 22px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg-soft); }
.install-card__head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.install-card__head h3 { margin: 0; font-size: 18px; }
.install-card dl { margin: 8px 0 0; }
.install-card dl > div {
  min-height: 48px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--line);
  font-size: 13px;
}
.install-card dl > div:first-child { border-top: 0; }
.install-card dt { display: flex; align-items: center; gap: 8px; color: var(--ink-faint); }
.install-card dt svg { color: var(--blue-dark); }
.install-card dd { margin: 0; color: var(--ink); font-weight: 600; text-align: right; overflow-wrap: anywhere; }
.install-card__note { margin: 14px 0 0; color: var(--ink-faint); font-size: 11px; }

@media (max-width: 860px) {
  .download-hero__grid { grid-template-columns: 1fr; gap: 44px; }
  .version-layout { grid-template-columns: 1fr; gap: 18px; }
}
@media (max-width: 640px) {
  .download-hero__grid { gap: 36px; }
  .download-chips li { padding: 4px 11px; }
}
```

- [ ] **Step 3: 删除旧的下载页样式**

删除 `app/globals.css` 中以下旧块（保留 `.checksum-section`、`.checksum-copy`、`.checksum-value` 及平台卡、`.download-help`、`.section--soft` 等仍被使用的样式）：

- 旧的 `.download-hero`（480–489 行附近）与旧 `.download-hero__copy` 选择器
- 旧 `.download-card` 系列（`.download-card__top`、`.download-card dl`、`.download-card__seal`）
- 旧的 `.release-layout`、`.release-main`、`.release-toggle`、`.requirements-card` 系列
- 旧 `.platform-grid` / `.platform-card` 若与新结构语义重复则保留（新结构复用它们，无需删除）

> 关键：只删除不再被引用的类。`.checksum-section` 与 `.download-help` 仍被新 JSX 使用，必须保留。删除后运行 lint/构建确认无失效选择器。

- [ ] **Step 4: 运行完整测试**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：下载路由测试 PASS，且新增断言 `首次引导`、`连接测试通过，配置已保存` 均匹配。

- [ ] **Step 5: 检查类型与 lint**

运行：`npx tsc --noEmit` 与 `npm run lint`
预期：无错误；如 lint 报未使用 import（如 `Image`、`FileCheck2` 等），按提示移除未用图标导入。

- [ ] **Step 6: 提交**

```bash
git add app/components/DownloadPanel.tsx app/globals.css
git commit -m "feat(download): redesign download page with modern SaaS layout"
```

---

### Task 3: 完整验证与静态导出检查

**Files:**
- 无源码改动；仅验证

**Interfaces:**
- Consumes: Task 1 + Task 2 的完整实现

- [ ] **Step 1: 运行完整验证套件**

运行：`npm run lint && npx tsc --noEmit && npm test`
预期：lint 无错误、类型检查通过、构建成功、9 项测试（3 渲染 + 内容 + 进度）全部 PASS。

- [ ] **Step 2: 检查 diff 空白与未跟踪文件**

运行：`git diff --check`
预期：无空白错误；`git status` 应仅显示本计划涉及的文件（若此前已提交则工作树干净）。

- [ ] **Step 3: GitHub Pages 静态导出检查（可选，若需发布）**

运行：`GITHUB_PAGES=true npm run build`，随后检查 `dist/client` 存在首页、`docs`、`download` 三个路由目录，且不含 `.exe` 安装文件。

运行：`ls dist/client && ls dist/client/download`
预期：`download` 目录含 `index.html`；全树无安装包文件。

- [ ] **Step 4: 提交（如有验证改动）**

若 Step 1–3 中任何验证脚本需要修正（例如测试断言），提交对应修正：

```bash
git add -A
git commit -m "chore(download): finalize verification for redesigned download page"
```