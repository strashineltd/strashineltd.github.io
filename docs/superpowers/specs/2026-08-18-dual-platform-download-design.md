# 下载页双平台发布更新

**日期：** 2026-08-18
**状态：** 已确认

## 目标

下载页从「Windows 独占、下载待开放」更新为「Windows + macOS 双平台、经 GitHub Releases 提供下载」的真实可用状态，替换全部过期的发布元数据。

## 真实发布数据（2026-08-16 构建，来源 `~/Stellara Work/release/`）

| 文件 | 字节 | 显示大小 | SHA-256 |
|------|------|----------|---------|
| `Stellara Work-Setup-0.9.0.exe`（Windows x64） | 123,034,491 | 117.3 MiB | `34784c8356b367edee1ad07064950272f5ba59ee36d898c5758750411de52475` |
| `Stellara Work-0.9.0-arm64.dmg`（macOS arm64） | 151,437,855 | 144.4 MiB | `380826dc0010433a70f3c417616a96cbfa6d8f0f8de5394f3f0f2e3e428051e7` |
| `Stellara Work-0.9.0-arm64.zip`（自动更新用，不在页面展示） | 151,447,652 | — | `b0bbc6d4b694508fdb4adc84725ad74878cad70ae4965001fedef364689d4005` |

- 下载目标：`https://github.com/strashineltd/stellara-work/releases`（新标签页打开）
- macOS 最低系统：macOS 12.0（`LSMinimumSystemVersion` = 12.0）；Windows 无额外版本限制

## 变更

### 1. 首屏 Hero（`DownloadPanel.tsx`）

- 主按钮：`下载通道准备中`（disabled）→ 真实链接 `<a class="button button--primary button--download" href="https://github.com/strashineltd/stellara-work/releases" target="_blank" rel="noopener noreferrer">`，文案 `下载 Windows 版`，保留下载图标。
- 按钮旁说明：`Windows x64 · 117.3 MiB · 2026-08-16`。
- 反馈条：`v0.9 已开放下载，安装包通过 GitHub Releases 提供。`
- 徽章行：`Windows x64 可下载`、`macOS (arm64) 可下载`、`版本 0.9.0`。

### 2. 平台卡

- 平台区副标题由 `v0.9 当前提供 Windows x64 安装包；其他平台尚未提供。` 改为 `v0.9 提供 Windows x64 与 macOS (arm64) 安装包；Linux 尚未提供。`
- **Windows**：状态「可下载」；卡片底部由 `平台-card__disabled` 文本改为链接 `前往 GitHub 下载` → GitHub Releases（新标签页）。
- **macOS**：改为「可下载」状态（可用样式），说明 `Apple 芯片 · 需 macOS 12 或更高版本`；底部同样为 `前往 GitHub 下载` 链接。
- **Linux**：保持「尚未提供」。

### 3. 安装信息卡（双平台扩展，SHA-256 保留在卡内）

行结构改为：
- 系统：`Windows x64 · macOS (arm64)`
- Windows 安装包：`Stellara Work-Setup-0.9.0.exe · 117.3 MiB`（文件名保留，便于核对与维持测试断言）
- macOS 安装包：`Stellara Work-0.9.0-arm64.dmg · 144.4 MiB`
- SHA-256（Windows）：`34784c83…2475` 全值 + 复制按钮
- SHA-256（macOS）：`380826dc…051e7` 全值 + 复制按钮

哈希行样式沿用现有 `.install-card__hash`（两行各带 `dt`（图标+`Windows SHA-256` / `macOS SHA-256`）与 `dd`（code + 复制按钮））。

底部备注：`Windows 无额外版本限制；macOS 需 12.0 或更高版本。`

复制交互：两个复制按钮各自独立反馈。组件内 `copied` 状态扩展为 `copiedKey: string | null`（键为 `win` / `mac`），复制函数改为 `copyHash(key, value)`，1800ms 后清除。

### 4. 版本信息区文案修正（消除与新发布状态矛盾的残留文案）

- 版本卡状态行 `公开托管通道准备中` → `已通过 GitHub Releases 开放下载`。
- 版本卡「发布日期」与更新列表头部日期 `2026-07-30` → `2026-08-16`（与 hero 说明的构建日期一致）。

### 5. 其余不变

- 三步引导、演示窗口（`DownloadDemo`）、首页、文档页均不改动。

## 测试更新（`tests/rendered-html.test.mjs`）

下载路由测试断言同步替换：
- `111.8 MiB` → `117.3 MiB`（并新增 `144.4 MiB`）
- `下载通道准备中` → 移除，改为断言 GitHub Releases 链接（`https://github.com/strashineltd/stellara-work/releases`）与 `前往 GitHub 下载`、`下载 Windows 版`
- 旧 SHA-256 `78DBC0…` → 新 Windows 哈希 `34784c83…` 与 macOS 哈希 `380826dc…`
- 其余断言（`Stellara Work-Setup-0.9.0.exe`、`首次引导`、`连接测试通过，配置已保存`、`class="version-card"`、`changelog-card`、`version-panel` 不存在、版本区无 `aria-expanded`、`checksum-section` 不存在）保持。

## 文件变更

| 文件 | 变更 |
|------|------|
| `app/components/DownloadPanel.tsx` | 按钮/反馈/徽章/平台卡/安装信息卡更新；`copied` 改为双键复制状态 |
| `app/globals.css` | 平台卡链接样式（复用 `.platform-card a` 已有样式，必要时微调）；安装卡多哈希行排版 |
| `tests/rendered-html.test.mjs` | 断言替换与新增 |

## 非目标

- 不在页面内嵌安装包文件（文件托管于 GitHub Releases，页面只跳转）。
- 不更新文档页内容（`app/content/docs.ts` 中过期的发布描述另作后续处理）。
- 不提供 Linux 下载。

## 验证

1. `npm run lint`、`npx tsc --noEmit` 通过。
2. `npm test` 全部通过。
3. 浏览器核对：三个下载入口（hero 按钮、Windows 卡、macOS 卡）均跳转 GitHub Releases 新标签页；两个复制按钮独立反馈；移动端安装卡哈希换行正常。
4. GitHub Pages 静态导出三路由正常、无安装文件。