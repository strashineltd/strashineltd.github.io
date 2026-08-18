# 下载页双平台发布更新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将下载页更新为 Windows + macOS 双平台真实可用状态：下载入口跳转 GitHub Releases，替换全部过期的发布元数据（体积、校验值、平台状态）。

**Architecture:** 只改 `app/components/DownloadPanel.tsx`（常量、复制状态、hero/平台卡/安装卡 JSX）、`app/globals.css`（如需平台卡链接与多哈希行微调）、`tests/rendered-html.test.mjs`（断言替换）。

**Tech Stack:** React 19 + Next.js 16 (vinext) + TypeScript + lucide-react；测试用 `node --test`（渲染测试需先 `npm run build`）。

## Global Constraints

- 下载目标固定为 `https://github.com/strashineltd/stellara-work/releases`，所有下载入口（hero 按钮、Windows 卡、macOS 卡）均为新标签页打开（`target="_blank" rel="noopener noreferrer"`）。
- 真实发布数据（2026-08-16 构建）：
  - Windows x64：`Stellara Work-Setup-0.9.0.exe`，117.3 MiB，SHA-256 `34784C8356B367EDEE1AD07064950272F5BA59EE36D898C5758750411DE52475`
  - macOS arm64：`Stellara Work-0.9.0-arm64.dmg`，144.4 MiB，SHA-256 `380826DC0010433A70F3C417616A96CBFA6D8F0F8DE5394F3F0F2E3E428051E7`
- 旧值（`111.8 MiB`、`下载通道准备中`、`78DBC0…`）必须从下载页 HTML 中消失。
- macOS 卡说明：`Apple 芯片 · 需 macOS 12 或更高版本`；安装卡备注：`Windows 无额外版本限制；macOS 需 12.0 或更高版本。`
- 两个复制按钮独立反馈（`copiedKey: string | null`，键 `win`/`mac`，1800ms 清除）。
- 测试断言：文件名 `Stellara Work-Setup-0.9.0.exe` 仍须匹配（保留在安装卡行值内）；`首次引导`、`连接测试通过，配置已保存`、`class="version-card"`、`changelog-card`、`version-panel` 不存在、版本区无 `aria-expanded`、`checksum-section` 不存在 全部保持。
- 测试流程：渲染断言变更后先 `npm run build` 再 `node --test tests/rendered-html.test.mjs`。
- 只修改 app/components/DownloadPanel.tsx、app/globals.css、tests/rendered-html.test.mjs。

---

### Task 1: 下载页双平台更新

**Files:**
- Modify: `app/components/DownloadPanel.tsx`
- Modify: `app/globals.css`（如需要）
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: 无外部依赖；`DownloadDemo` 组件保持不动
- Produces: 更新后的 `DownloadPanel`（导出名与路径不变）

- [ ] **Step 1: 更新下载路由测试断言（先写失败测试）**

将 `tests/rendered-html.test.mjs` 中 `server-renders the download route` 测试的断言替换为：

```js
test("server-renders the download route with verified release metadata", async () => {
  const response = await render("/download");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Stellara Work-Setup-0\.9\.0\.exe/);
  assert.match(html, /117\.3 MiB/);
  assert.match(html, /144\.4 MiB/);
  assert.match(html, /下载 Windows 版/);
  assert.match(html, /前往 GitHub 下载/);
  assert.match(html, /https:\/\/github\.com\/strashineltd\/stellara-work\/releases/);
  assert.match(html, /34784C8356B367EDEE1AD07064950272F5BA59EE36D898C5758750411DE52475/);
  assert.match(html, /380826DC0010433A70F3C417616A96CBFA6D8F0F8DE5394F3F0F2E3E428051E7/);
  assert.doesNotMatch(html, /111\.8 MiB/);
  assert.doesNotMatch(html, /下载通道准备中/);
  assert.doesNotMatch(html, /78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037/);
  assert.doesNotMatch(html, /version-panel/);
  assert.match(html, /class="version-card"/);
  assert.match(html, /changelog-card/);
  assert.doesNotMatch(html, /checksum-section/);
});
```

注意：将 `assert.match(html, /checksum-section/);` 之前的 `assert.match` 与 `assert.doesNotMatch(html, /checksum-section/)` 顺序调整，并保留原有 `首次引导`、`连接测试通过，配置已保存` 断言与版本区 `aria-expanded` 局部断言（用 `versionSection` 提取逻辑，若存在）。以文件现有内容为准做最小替换：只替换体积/按钮/哈希相关断言，其余保持。

> 若原测试中存在用 `html.match(/<section[^>]*version-section[\s\S]*?<\/section>/)` 提取 `versionSection` 的代码，请保留该逻辑并继续在其上断言 `aria-expanded` 不存在。

- [ ] **Step 2: 运行构建与测试，确认失败**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：构建成功；下载路由测试 FAIL（`117.3 MiB`、GitHub 链接、新哈希未匹配；旧值仍存在）。

- [ ] **Step 3: 重写 `app/components/DownloadPanel.tsx`**

**3a. 常量区**（替换第 21–22 行的 `installerName`/`sha256` 为双平台常量）：

```tsx
const releaseUrl = "https://github.com/strashineltd/stellara-work/releases";
const winInstallerName = "Stellara Work-Setup-0.9.0.exe";
const winSize = "117.3 MiB";
const winSha256 = "34784C8356B367EDEE1AD07064950272F5BA59EE36D898C5758750411DE52475";
const macInstallerName = "Stellara Work-0.9.0-arm64.dmg";
const macSize = "144.4 MiB";
const macSha256 = "380826DC0010433A70F3C417616A96CBFA6D8F0F8DE5394F3F0F2E3E428051E7";
```

**3b. 复制状态改为双键**：

```tsx
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function copyHash(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  }
```

**3c. lucide-react 导入**：新增 `Download`；删除不再使用的 `FolderKanban`、`HardDrive`；保留 `Apple`、`ArrowRight`、`Check`、`CheckCircle2`、`Clipboard`、`FileCheck2`、`Laptop`、`Monitor`、`ShieldCheck`、`Terminal`。

**3d. Hero 按钮与说明**（替换原禁用按钮与 `111.8 MiB` 说明）：

```tsx
            <div className="download-hero__actions">
              <a
                className="button button--primary button--download"
                href={releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download aria-hidden="true" size={19} />
                下载 Windows 版
              </a>
              <span>Windows x64 · 117.3 MiB · 2026-08-16</span>
            </div>
```

**3e. 反馈条**：

```tsx
            <div className="download-feedback" role="status">
              <CheckCircle2 aria-hidden="true" size={17} />
              v0.9 已开放下载，安装包通过 GitHub Releases 提供。
            </div>
```

**3f. 徽章行**（替换为双平台）：

```tsx
            <ul className="download-chips" aria-label="版本摘要">
              <li><span className="download-chip__dot" aria-hidden="true" />Windows x64 <strong>可下载</strong></li>
              <li><span className="download-chip__dot" aria-hidden="true" />macOS (arm64) <strong>可下载</strong></li>
              <li>版本 <strong>0.9.0</strong></li>
            </ul>
```

**3g. Windows 平台卡**（替换 `platform-card__disabled` 文本为链接）：

```tsx
            <a
              className="platform-card__link"
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往 GitHub 下载 <ArrowRight aria-hidden="true" size={15} />
            </a>
```

**3h. macOS 平台卡**（改为可用状态）：

```tsx
          <article className="platform-card platform-card--available">
            <div className="platform-card__header">
              <span className="icon-box"><Apple aria-hidden="true" size={22} /></span>
              <span className="availability">可下载</span>
            </div>
            <h3>macOS</h3>
            <p>Apple 芯片 · 需 macOS 12 或更高版本。</p>
            <a
              className="platform-card__link"
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往 GitHub 下载 <ArrowRight aria-hidden="true" size={15} />
            </a>
          </article>
```

**3i. 安装信息卡**（替换整个 `<aside className="install-card">...</aside>`）：

```tsx
            <aside className="install-card" aria-label="安装信息">
              <div className="install-card__head">
                <span className="icon-box"><FileCheck2 aria-hidden="true" size={20} /></span>
                <h3>安装信息</h3>
              </div>
              <dl>
                <div><dt><Monitor aria-hidden="true" size={18} />系统</dt><dd>Windows x64 · macOS (arm64)</dd></div>
                <div><dt><Laptop aria-hidden="true" size={18} />Windows 安装包</dt><dd>{winInstallerName} · {winSize}</dd></div>
                <div><dt><Apple aria-hidden="true" size={18} />macOS 安装包</dt><dd>{macInstallerName} · {macSize}</dd></div>
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />Windows SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{winSha256}</code>
                    <button type="button" onClick={() => copyHash("win", winSha256)} aria-label="复制 Windows SHA-256 校验值">
                      {copiedKey === "win" ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copiedKey === "win" ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />macOS SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{macSha256}</code>
                    <button type="button" onClick={() => copyHash("mac", macSha256)} aria-label="复制 macOS SHA-256 校验值">
                      {copiedKey === "mac" ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copiedKey === "mac" ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
              </dl>
              <p className="install-card__note">Windows 无额外版本限制；macOS 需 12.0 或更高版本。</p>
            </aside>
```

- [ ] **Step 4: 检查 `app/globals.css`**

现有 `.platform-card a` 样式（`min-height: 44px; margin-top: auto; padding-top: 18px; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 650; color: var(--blue-dark);`）已覆盖新链接类；无需修改。若 lint/构建无报错且链接样式生效，`globals.css` 可不改动。确认 `.install-card__hash` 样式继续覆盖两个哈希行（选择器为类，天然多实例生效）。

- [ ] **Step 5: 运行构建与测试，确认通过**

运行：`npm run build && node --test tests/rendered-html.test.mjs`
预期：全部测试 PASS（下载路由新断言匹配、旧值断言不匹配、其余路由测试保持）。

- [ ] **Step 6: 检查类型与 lint**

运行：`npx tsc --noEmit` 与 `npm run lint`
预期：无错误；若 lint 报未使用导入（如 `FolderKanban`/`HardDrive` 残留），按提示移除。

- [ ] **Step 7: 提交**

```bash
git add app/components/DownloadPanel.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat(download): enable dual-platform downloads via GitHub Releases"
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

运行：`git diff --check`，并确认 `git status` 无多余文件（`docs/` 为计划文档，忽略；`package-lock.json` 若被 npm 改动则还原）。

- [ ] **Step 3: GitHub Pages 静态导出检查**

运行：`GITHUB_PAGES=true npm run build`，确认 `dist/client/download/index.html` 含 GitHub Releases 链接与两个新 SHA-256、不含 `111.8 MiB`/`下载通道准备中`/旧哈希、全树无 `.exe`/`.dmg` 安装文件；随后重新执行 `npm run build` 恢复常规产物。

- [ ] **Step 4: 提交（如有验证修正）**

若任何验证脚本需要修正，提交对应修正：

```bash
git add -A
git commit -m "chore(download): finalize dual-platform verification"
```