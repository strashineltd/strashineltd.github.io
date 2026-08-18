# 下载页 hero 按钮改为通用下载入口

**日期：** 2026-08-18
**状态：** 已确认

## 目标

双平台（Windows + macOS）均已开放下载后，hero 主按钮不再单独指向 Windows，改为通用下载文案，避免「下载 Windows 版」与双平台现状矛盾。

## 变更

### 1. Hero 主按钮

- 文案：`下载 Windows 版` → `前往下载 v0.9`
- 保留 `Download` 图标、`button--primary button--download` 样式、GitHub Releases 链接（`target="_blank" rel="noopener noreferrer"`）

### 2. 按钮旁说明

- `Windows x64 · 117.3 MiB · 2026-08-16` → `Windows x64 与 macOS (arm64) · 2026-08-16`
- 体积信息保留在安装信息卡与平台区（徽章行），hero 不再单列 Windows 体积

### 3. 其余不动

- Windows / macOS 平台卡（各带「前往 GitHub 下载」链接）、Linux 卡、安装信息卡、徽章行（`Windows x64 可下载`、`macOS (arm64) 可下载`、`版本 0.9.0`）、三步引导、首页均不改动。

## 测试更新（`tests/rendered-html.test.mjs`）

- `assert.match(html, /下载 Windows 版/)` → `assert.match(html, /前往下载 v0\.9/)`
- `前往 GitHub 下载`、GitHub URL、`target="_blank" rel="noopener noreferrer"`、双 SHA-256、`117.3 MiB`/`144.4 MiB` 断言全部保留

## 文件变更

| 文件 | 变更 |
|------|------|
| `app/components/DownloadPanel.tsx` | hero 按钮文案 + 按钮旁说明两处 |
| `tests/rendered-html.test.mjs` | 按钮文案断言替换 |

## 验证

1. `npm run lint`、`npx tsc --noEmit` 通过。
2. `npm test` 全部通过。
3. 浏览器核对：hero 按钮文案为「前往下载 v0.9」，跳转 GitHub Releases 新标签页。