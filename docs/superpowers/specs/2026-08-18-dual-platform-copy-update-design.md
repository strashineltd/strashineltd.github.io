# 下载页与文档双平台文案更新

**日期：** 2026-08-18
**状态：** 已确认

## 目标

消除双平台（Windows + macOS）发布后站点与文档中残留的 Windows-only 与「下载待开放」过期文案：下载页 hero 导语、站内文档 `docs.ts`、仓库 README。

## 变更

### A. 下载页 hero 导语（`app/components/DownloadPanel.tsx`）

- `为 Windows x64 打造的本地优先桌面 Agent。` → `为 Windows 与 macOS 打造的本地优先桌面 Agent。`

### B. 站内文档（`app/content/docs.ts`，6 处内容 + 搜索词 + 日期）

1. **安装指南「发布范围与安装前准备」正文**（install-setup 首段）：
   原：`Stellara Work v0.9 当前面向 Windows x64。安装器采用可选择安装位置的 NSIS 向导，并会创建开始菜单与桌面快捷方式。项目尚未发布明确的最低 Windows 版本，因此文档不会虚构系统版本门槛。`
   新：`Stellara Work v0.9 提供 Windows x64 与 macOS（Apple 芯片）安装包。Windows 安装器采用可选择安装位置的 NSIS 向导，并会创建开始菜单与桌面快捷方式；macOS 安装包以 DMG 形式提供，需要 macOS 12 或更高版本。`
2. **安装前清单**：`Windows x64 电脑` → `Windows x64 或 macOS（Apple 芯片）电脑`
3. **「当前下载状态」提示卡**（requirements note）：
   标题：`当前下载状态` → `下载方式`
   正文：`公开安装包暂未上传，下载页会显示"下载通道准备中"。在正式开放前，请勿从非官方来源获取同名安装程序。` → `安装包通过 GitHub Releases 提供，下载页可直接跳转。请仅从官方 GitHub 仓库获取安装程序，并核对发布页给出的 SHA-256 校验值。`
4. **FAQ「支持 macOS 或 Linux 吗？」**：
   正文：`当前公开产品信息只确认 Windows x64 安装器。文档不会承诺 macOS、Linux、ARM64 或明确的最低 Windows 版本；后续以下载页和正式发布说明为准。` → `当前公开版本提供 Windows x64 与 macOS（Apple 芯片）安装包；macOS 需要 12.0 或更高版本。Linux 版本尚未提供。`
   第二段：`如果需要在其他平台使用，可以关注官方发布渠道获取最新信息。当前版本的代码架构基于 Electron，理论上具备跨平台潜力，但官方尚未公布具体计划。` → `如果需要在 Linux 等平台使用，可以关注官方发布渠道获取最新信息。`
5. **FAQ「为什么下载按钮暂时不可用？」** → 整节改为「在哪里下载安装包？」：
   正文：`安装包通过 GitHub Releases 提供：从下载页点击"前往下载"即可跳转。下载完成后，建议核对发布页给出的 SHA-256 校验值，确认文件完整。` + `请仅从官方 GitHub 仓库获取安装包，避免从非官方来源下载同名文件。当前 v0.9 为内测版本，可能包含未修复的已知问题。`
6. **版本变更记录**：
   - 已知限制「平台限制」：`仅支持 Windows x64，暂无 macOS 和 Linux 版本。` → `Windows 提供 x64 安装包；macOS 提供 Apple 芯片版本；暂无 Linux 版本。`
   - 已知限制「安装包」：`公开安装包尚未发布，下载通道准备中。` → `安装包通过 GitHub Releases 发布；下载前请核对 SHA-256 校验值。`
   - 路线图「跨平台支持」：`探索 macOS 和 Linux 版本的可能性。` → `探索 Linux 版本的可能性。`
7. **搜索词**：install-setup 的 keywords 增加 `macOS`。
8. **日期**：install-setup、faq、changelog 三篇文章的 `updated` 由 `2026-07-31`/`2026-08-02` 更新为 `2026-08-18`。

### C. 测试更新

- `tests/rendered-html.test.mjs` 文档路由断言 `assert.match(html, /公开安装包暂未上传/);` → `assert.match(html, /安装包通过 GitHub Releases 提供/);`
- `tests/docs-content.test.mjs` 断言 `assert.match(source, /公开安装包暂未上传/);` → `assert.match(source, /安装包通过 GitHub Releases 提供/);`
- 其余断言（`下载通道准备中` 在下载路由的不匹配断言等）保持。

### D. 全站 Windows-only 文案修正（用户确认扩展）

| 文件 | 位置 | 旧文案 | 新文案 |
|------|------|--------|--------|
| `app/components/SiteFooter.tsx` | 品牌副标题 | `本地优先的 Windows 桌面 Agent` | `本地优先的桌面 Agent` |
| `app/components/SiteFooter.tsx` | 页脚 meta | `v0.9 内测版 · Windows x64` | `v0.9 内测版 · Windows 与 macOS` |
| `app/page.tsx` | hero eyebrow | `v0.9 内测版 · Windows x64` | `v0.9 内测版 · Windows 与 macOS` |
| `app/page.tsx` | hero 导语 | `Stellara Work 是一款面向真实项目的 Windows 桌面 Agent。` | `Stellara Work 是一款面向真实项目的桌面 Agent。` |
| `app/page.tsx` | metadata description | `数据本地、模型自由、操作可控的 Windows 桌面 Agent。…` | `数据本地、模型自由、操作可控的桌面 Agent。…` |
| `app/page.tsx` | 底部 CTA | `下载 Windows 版` | `前往下载 v0.9` |
| `app/download/page.tsx` | metadata description | `查看 Stellara Work v0.9 Windows x64 内测版、版本信息与安装包校验值。` | `查看 Stellara Work v0.9 Windows 与 macOS 内测版、版本信息与安装包校验值。` |
| `app/layout.tsx` | default title | `Stellara Work — 本地优先的 Windows 桌面 Agent` | `Stellara Work — 本地优先的桌面 Agent` |
| `app/layout.tsx` | description | `…为真实项目打造的 Windows 桌面 Agent。` | `…为真实项目打造的桌面 Agent。` |
| `app/layout.tsx` | og/twitter description | `…操作可控的 Windows 桌面 Agent。` | `…操作可控的桌面 Agent。` |

## 文件变更

| 文件 | 变更 |
|------|------|
| `app/components/DownloadPanel.tsx` | hero 导语 1 处 |
| `app/content/docs.ts` | 上述 B 项全部（站内文档页） |
| `app/components/SiteFooter.tsx` | D 项 2 处 |
| `app/page.tsx` | D 项 4 处 |
| `app/download/page.tsx` | D 项 1 处 |
| `app/layout.tsx` | D 项 4 处 |
| `tests/rendered-html.test.mjs` | 文档路由断言 1 处 |
| `tests/docs-content.test.mjs` | 断言 1 处 |

## 验证

1. `npm run lint`、`npx tsc --noEmit` 通过。
2. `npm test` 全部通过。
3. 浏览器核对：下载页导语为双平台表述；文档页搜索「下载」可见 GitHub Releases 新文案；FAQ 与安装指南无残留「下载通道准备中」。