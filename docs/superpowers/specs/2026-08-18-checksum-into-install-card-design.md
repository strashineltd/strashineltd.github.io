# 下载页校验值并入安装信息卡

**日期：** 2026-08-18
**状态：** 已确认

## 目标

将独立的「验证下载文件」校验值区块并入版本信息区的「安装信息」卡片，作为第 4 行，消除页面中部独立悬浮卡片，保持三栏卡片结构完整。

## 变更

### 1. 安装信息卡新增 SHA-256 行

- 行键：`SHA-256`，图标 `Clipboard`（表示复制动作；卡片头部已用 `FileCheck2`，避免重复）。
- 行值：等宽字体哈希值 `78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037`（引用现有 `sha256` 常量）。
- 复制按钮：沿用现有 `copied` 状态（`useState`）与 1800ms「已复制」反馈；点击写入 `navigator.clipboard`。
- 行布局：哈希可换行（`overflow-wrap: anywhere`），按钮右对齐、不压缩（`flex-shrink: 0`）；`.install-card dd` 改为 flex 布局。

### 2. 移除独立校验值区块

- 删除 `DownloadPanel.tsx` 中的 `<section className="checksum-section ...">` JSX 块。
- 删除 `globals.css` 中 `.checksum-section`、`.checksum-copy`、`.checksum-value` 相关样式（含 `@media` 内的对应规则）。

### 3. 底部备注

安装信息卡底部备注改为：`安装器未设置额外的 Windows 版本限制。下载后可复制 SHA-256 校验文件完整性。`

### 4. 测试

- `tests/rendered-html.test.mjs` 下载路由测试对 SHA-256 值的断言在卡片内仍匹配，无需改动；新增断言确认 `checksum-section` 已移除（`assert.doesNotMatch(html, /checksum-section/)`）。
- 其余断言（`下载通道准备中`、`111.8 MiB`、安装文件名、`首次引导`、`连接测试通过，配置已保存`、`version-card`、`changelog-card`、`version-panel` 不存在、版本区无 `aria-expanded`）全部保持。

## 文件变更

| 文件 | 变更 |
|------|------|
| `app/components/DownloadPanel.tsx` | 安装信息卡新增 SHA-256 行与复制按钮；删除 checksum-section JSX |
| `app/globals.css` | 安装信息卡 dd 行布局支持哈希+按钮；删除 checksum 区块样式 |
| `tests/rendered-html.test.mjs` | 新增 `doesNotMatch /checksum-section/` 断言 |

## 非目标

- 不改动哈希值、版本号、更新列表、平台区、三步引导区。
- 不改变复制交互逻辑（仅移动位置）。

## 验证

1. `npm run lint`、`npx tsc --noEmit` 通过。
2. `npm test` 全部通过（含新增断言）。
3. 浏览器核对：安装信息卡第 4 行显示哈希 + 复制按钮，复制反馈正常；移动端哈希换行不溢出。