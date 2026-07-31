# Stellara Work Website

Stellara Work 的产品网站，包含首页、交互式文档和 Windows 下载页。

## 本地运行

```powershell
npm install
npm run dev
```

## 验证

```powershell
npm run build
node --test tests/rendered-html.test.mjs
```

网站使用 vinext 构建，并通过 `.openai/hosting.json` 接入 Sites 托管。
