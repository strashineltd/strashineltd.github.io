# 下载页版本信息区重设计

**日期：** 2026-08-18
**状态：** 已确认（三栏等宽卡片）

## 目标

优化下载页下方的「版本信息」区域：重排为三栏等宽卡片结构，并修复软色带区域在宽屏下被限制在 1180px 内、看起来像悬浮块的问题。保持全站简洁、非科幻风格与现有设计系统 token。

## 现状问题

- 版本区为 `section--soft page-shell` 组合，软色带与边框仅横跨 1180px 内容宽度，宽屏下呈「悬浮块」而非通栏色带。
- 信息结构为「可折叠的本次更新面板 + 安装信息卡」两栏，左侧面板大量空间用于折叠头部，信息密度低。

## 变更

### 1. 背景/区域修复

- 将 `<section className="version-section section section--soft page-shell">` 改为 `<section className="version-section section section--soft">`（全宽色带），内部内容包裹一层 `page-shell` 容器。
- 与首页「工作方式」区块（`workflow section section--soft` + 内部 `page-shell`）的结构保持一致。

### 2. 三栏等宽卡片（桌面端）

`version-layout` 由 `1.35fr 0.65fr` 两栏改为 `repeat(3, 1fr)` 三栏：

- **左 · 版本卡片**（`.version-card`，白底）：
  - 顶部 `内测版` 徽章（品牌蓝底白字）
  - 大号版本号 `v0.9.0`
  - 发布信息行：`发布日期 2026-07-30`
  - 状态行：`已通过本地构建验证`（绿色）与 `公开托管通道准备中`（灰字）
- **中 · 本次更新**（`.changelog-card`，白底）：
  - 标题 `本次更新` + 日期 `2026-07-30` 小字
  - 5 条勾选列表（复用现有 `releaseNotes` 数据与勾选图标样式），**常驻展开，移除折叠按钮与 `releaseOpen` 状态**（不再需要 `useState` 的 release 开关）
- **右 · 安装信息**（`.install-card`，白底，保留现有内容结构）：
  - 系统 / 包体积 / 文件 三项（图标 + 键值行）
  - 底部备注 `安装器未设置额外的 Windows 版本限制。`
  - 背景统一为 `#fff`，与相邻两张卡片保持一致（修正：原「浅色软底」描述与全宽软色带叠加后会融入色带）。

### 3. 响应式

- `≤860px`：三栏堆叠为单列，卡片间 `18px` 间距。
- 版本区垂直留白沿用现有断点（`≤860px` 时 `padding-block: 82px`）。

### 4. 无改动项

- 版本号、日期、更新文案、安装信息文本、SHA-256 校验区、三步引导区均不变。
- 现有渲染测试断言不受影响（`下载通道准备中`、`Stellara Work-Setup-0.9.0.exe`、`111.8 MiB`、SHA-256 值、`首次引导`、`连接测试通过，配置已保存` 均与此区域无关）。

## 文件变更

| 文件 | 变更 |
|------|------|
| `app/components/DownloadPanel.tsx` | 版本区 JSX 重排为三栏；移除 `releaseOpen` 状态与折叠按钮；`useState` 保留（仍用于复制校验值） |
| `app/globals.css` | 版本区改全宽软色带；`.version-layout` 改三栏；新增 `.version-card`/`.changelog-card` 样式；删除不再使用的 `.version-panel` 系列样式 |

## 验证

1. `npm run lint`、`npx tsc --noEmit` 通过。
2. `npm test`（构建 + 渲染/内容/进度测试）全部通过。
3. 浏览器核对：桌面三栏布局、≤860px 单列堆叠、软色带全宽显示、更新列表常驻展开。