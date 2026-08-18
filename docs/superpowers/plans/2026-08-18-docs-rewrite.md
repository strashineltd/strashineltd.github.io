# 网站文档重写实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 Stellara Work v0.9.0 最新实现，重写网站文档（`app/content/docs.ts`），采用功能模块化信息架构，覆盖所有新功能。

**Architecture:** 按 5 个分组分批重写 22 篇文章（入门 → 核心工作流 → 扩展能力 → 设置与数据 → 参考），每批完成后验证测试通过。保持 DocsExplorer UI 不变，只重写 `docs.ts` 内容数据。

**Tech Stack:** TypeScript, React (DocsExplorer 组件), Next.js

## Global Constraints

- 只修改 `app/content/docs.ts` 中的 `docArticles` 数组
- 保持现有 `DocArticle` 类型结构不变
- 所有平台相关内容同时说明 Windows 和 macOS
- 内容必须基于源程序 v0.9.0 最新实现（2026-08-15）
- 每篇文章包含多个 section，每个 section 包含 body、steps/bullets/table/checklist/code/note 等多种内容块
- 现有测试断言必须保持通过（`npm test`）
- 文章总数：22 篇

---

### Task 1: 入门分组（5 篇文章）

**Files:**
- Modify: `app/content/docs.ts`

**Interfaces:**
- Consumes: 现有 `DocArticle` 类型定义
- Produces: 5 篇入门文章（安装与首次启动、界面导览、完成第一个任务、模型配置、工作目录与项目）

**Context:**
- 读取源程序 `/Users/lhy/Stellara Work/README.md` 和 `/Users/lhy/Stellara Work/docs/macos-migration.md` 了解双平台细节
- 读取 `/Users/lhy/Stellara Work/CHANGELOG.md` 了解 v0.9.0 新功能
- 数据目录：Windows `%APPDATA%\Stellara Work`，macOS `~/Library/Application Support/Stellara Work`
- 密钥加密：macOS Keychain / Windows DPAPI
- 签名状态：当前未签名，macOS 右键打开，Windows SmartScreen

**Steps:**

- [ ] **Step 1: 读取源程序文档，收集入门相关内容**
  
  读取以下文件，提取入门相关内容：
  - `/Users/lhy/Stellara Work/README.md` - 双平台下载、安装、首次启动
  - `/Users/lhy/Stellara Work/docs/macos-migration.md` - macOS 特定说明
  - `/Users/lhy/Stellara Work/CHANGELOG.md` - v0.9.0 功能列表
  - `/Users/lhy/Stellara Work/electron/config/data-dir.ts` - 数据目录逻辑
  - `/Users/lhy/Stellara Work/electron/config/secrets.ts` - 密钥加密逻辑

- [ ] **Step 2: 编写"安装与首次启动"文章**
  
  包含以下 sections：
  - 双平台下载（Windows NSIS / macOS DMG）
  - 签名说明（未签名，macOS 右键打开，Windows SmartScreen）
  - 数据目录位置（双平台）
  - 密钥加密存储（Keychain/DPAPI）
  - 首次启动引导（选择模型、API Key、工作目录）

- [ ] **Step 3: 编写"界面导览"文章**
  
  包含以下 sections：
  - 无边框窗口设计
  - 首页仪表盘（任务输入、附件拖拽）
  - 三栏布局（侧栏/主区/工作区）
  - 侧栏文件视图
  - 悬停预览
  
  读取源程序：`/Users/lhy/Stellara Work/src/components/HomeDashboard.tsx`、`Sidebar.tsx`、`hover/`

- [ ] **Step 4: 编写"完成第一个任务"文章**
  
  包含以下 sections：
  - 任务输入与附件
  - 流式响应与 Markdown 渲染
  - Diff 卡片与 Shell 卡片
  - 工具调用可视化
  
  读取源程序：`/Users/lhy/Stellara Work/src/components/chat/`、`DiffCard.tsx`、`ShellCard.tsx`

- [ ] **Step 5: 编写"模型配置"文章**
  
  包含以下 sections：
  - 内置预设（GLM/DeepSeek/Kimi/MiniMax）
  - 自定义 OpenAI 兼容端点
  - 上下文窗口选择（256K/512K/1M）
  - 模型切换
  
  读取源程序：`/Users/lhy/Stellara Work/electron/config/models.ts`、`/Users/lhy/Stellara Work/shared/context-window.ts`

- [ ] **Step 6: 编写"工作目录与项目"文章**
  
  包含以下 sections：
  - 工作目录概念
  - 项目文件夹模式
  - 路径安全边界
  
  读取源程序：`/Users/lhy/Stellara Work/electron/agent/tools/fs.ts`

- [ ] **Step 7: 运行测试，确保通过**
  
  ```bash
  npm test
  ```

- [ ] **Step 8: 提交**
  
  ```bash
  git add app/content/docs.ts
  git commit -m "docs: rewrite onboarding section (5 articles)"
  ```

---

### Task 2: 核心工作流分组（6 篇文章）

**Files:**
- Modify: `app/content/docs.ts`

**Interfaces:**
- Consumes: Task 1 完成的入门文章
- Produces: 6 篇核心工作流文章（Plan 与 Build 模式、工具集、审批与安全边界、工作区检查器、记忆中心、附件与悬停预览）

**Context:**
- 工具集新增：symbol-search、dispatch-subagents
- 记忆中心：跨会话持久记忆，提取/注入/管理
- 附件：拖拽文件/图片，内联渲染
- 悬停预览：文件路径悬停预览内容

**Steps:**

- [ ] **Step 1: 读取源程序，收集核心工作流相关内容**
  
  读取以下文件：
  - `/Users/lhy/Stellara Work/electron/agent/plan.ts` - Plan 模式
  - `/Users/lhy/Stellara Work/electron/agent/tools/` - 所有工具
  - `/Users/lhy/Stellara Work/src/components/ApprovalTopBar.tsx` - 审批
  - `/Users/lhy/Stellara Work/src/components/WorkspacePanel.tsx` - 工作区
  - `/Users/lhy/Stellara Work/electron/memory/` - 记忆系统
  - `/Users/lhy/Stellara Work/src/components/attachments/` - 附件
  - `/Users/lhy/Stellara Work/src/components/hover/` - 悬停预览

- [ ] **Step 2: 编写"Plan 与 Build 模式"文章**
  
  包含以下 sections：
  - Plan 模式（只读分析、计划生成）
  - Build 模式（执行、审批）
  - 模式切换

- [ ] **Step 3: 编写"工具集"文章**
  
  包含以下 sections：
  - 文件操作（read/write/edit）
  - 搜索（grep/search/symbol-search）
  - Shell 命令执行
  - Git 操作
  - Web 抓取
  - 记忆工具
  - 子代理调度

- [ ] **Step 4: 编写"审批与安全边界"文章**
  
  包含以下 sections：
  - 审批顶部栏
  - 危险操作确认
  - 命令白名单
  - 渲染进程沙箱

- [ ] **Step 5: 编写"工作区检查器"文章**
  
  包含以下 sections：
  - 目标/进度/交付物
  - 文件树
  - 上下文使用追踪

- [ ] **Step 6: 编写"记忆中心"文章**
  
  包含以下 sections：
  - 跨会话持久记忆
  - 记忆提取与注入
  - 记忆管理（查看/编辑/删除）

- [ ] **Step 7: 编写"附件与悬停预览"文章**
  
  包含以下 sections：
  - 拖拽文件/图片
  - 附件选择器
  - 图片内联渲染
  - 文件路径悬停预览

- [ ] **Step 8: 运行测试，确保通过**
  
  ```bash
  npm test
  ```

- [ ] **Step 9: 提交**
  
  ```bash
  git add app/content/docs.ts
  git commit -m "docs: rewrite core workflow section (6 articles)"
  ```

---

### Task 3: 扩展能力分组（4 篇文章）

**Files:**
- Modify: `app/content/docs.ts`

**Interfaces:**
- Consumes: Task 2 完成的核心工作流文章
- Produces: 4 篇扩展能力文章（Skills 自定义工作流、MCP 服务器集成、命令面板与快捷键、上下文窗口与压缩）

**Context:**
- Skills：`<workDir>/skills/*.json` 格式
- MCP：Model Context Protocol 服务器集成
- 快捷键：17 个默认快捷键（见 `/Users/lhy/Stellara Work/shared/shortcuts.ts`）
- 上下文窗口：256K/512K/1M，90% 压缩阈值

**Steps:**

- [ ] **Step 1: 读取源程序，收集扩展能力相关内容**
  
  读取以下文件：
  - `/Users/lhy/Stellara Work/electron/agent/skills.ts` - Skills 系统
  - `/Users/lhy/Stellara Work/electron/mcp/` - MCP 系统
  - `/Users/lhy/Stellara Work/shared/shortcuts.ts` - 快捷键定义
  - `/Users/lhy/Stellara Work/shared/context-window.ts` - 上下文窗口
  - `/Users/lhy/Stellara Work/electron/agent/compress.ts` - 压缩逻辑

- [ ] **Step 2: 编写"Skills 自定义工作流"文章**
  
  包含以下 sections：
  - Skills 目录与格式
  - 编写 Skill
  - 加载与调用

- [ ] **Step 3: 编写"MCP 服务器集成"文章**
  
  包含以下 sections：
  - MCP 概念
  - 配置 MCP 服务器
  - MCP 工具使用

- [ ] **Step 4: 编写"命令面板与快捷键"文章**
  
  包含以下 sections：
  - 命令面板（Ctrl+K）
  - 快捷键列表（17 个默认快捷键）
  - 自定义快捷键

- [ ] **Step 5: 编写"上下文窗口与压缩"文章**
  
  包含以下 sections：
  - 窗口选项（256K/512K/1M）
  - 90% 压缩阈值
  - 上下文使用追踪

- [ ] **Step 6: 运行测试，确保通过**
  
  ```bash
  npm test
  ```

- [ ] **Step 7: 提交**
  
  ```bash
  git add app/content/docs.ts
  git commit -m "docs: rewrite extension capabilities section (4 articles)"
  ```

---

### Task 4: 设置与数据分组（4 篇文章）

**Files:**
- Modify: `app/content/docs.ts`

**Interfaces:**
- Consumes: Task 3 完成的扩展能力文章
- Produces: 4 篇设置与数据文章（应用内设置面板、会话与项目管理、本地数据与备份、故障排查）

**Context:**
- 设置面板：6 个面板（应用/模型/会话/快捷键/Skills/MCP）
- 数据目录：双平台位置
- 加密存储：Keychain/DPAPI
- 故障排查：macOS 特定问题（Keychain、Gatekeeper）

**Steps:**

- [ ] **Step 1: 读取源程序，收集设置与数据相关内容**
  
  读取以下文件：
  - `/Users/lhy/Stellara Work/src/components/settings/` - 所有设置面板
  - `/Users/lhy/Stellara Work/electron/config/` - 配置系统
  - `/Users/lhy/Stellara Work/electron/store/` - 数据存储

- [ ] **Step 2: 编写"应用内设置面板"文章**
  
  包含以下 sections：
  - 应用设置
  - 模型设置
  - 会话设置
  - 快捷键设置
  - Skills 设置
  - MCP 设置

- [ ] **Step 3: 编写"会话与项目管理"文章**
  
  包含以下 sections：
  - 会话创建/切换/关闭
  - 项目分组
  - 会话导出

- [ ] **Step 4: 编写"本地数据与备份"文章**
  
  包含以下 sections：
  - 数据目录结构
  - 加密密钥存储
  - 备份与恢复
  - 跨平台迁移

- [ ] **Step 5: 编写"故障排查"文章**
  
  包含以下 sections：
  - 模型连接错误
  - 工具执行错误
  - 数据目录问题
  - macOS 特定问题（Keychain、Gatekeeper）

- [ ] **Step 6: 运行测试，确保通过**
  
  ```bash
  npm test
  ```

- [ ] **Step 7: 提交**
  
  ```bash
  git add app/content/docs.ts
  git commit -m "docs: rewrite settings and data section (4 articles)"
  ```

---

### Task 5: 参考分组（3 篇文章）

**Files:**
- Modify: `app/content/docs.ts`

**Interfaces:**
- Consumes: Task 4 完成的设置与数据文章
- Produces: 3 篇参考文章（常见问题、版本记录、术语表）

**Context:**
- 常见问题：平台支持、离线使用、云同步、密钥安全
- 版本记录：v0.9.0 变更、已知限制
- 术语表：核心概念、功能术语、技术术语

**Steps:**

- [ ] **Step 1: 编写"常见问题"文章**
  
  包含以下 sections：
  - 平台支持
  - 离线使用
  - 云同步
  - 密钥安全

- [ ] **Step 2: 编写"版本记录"文章**
  
  包含以下 sections：
  - v0.9.0 变更（基于 `/Users/lhy/Stellara Work/CHANGELOG.md`）
  - 已知限制

- [ ] **Step 3: 编写"术语表"文章**
  
  包含以下 sections：
  - 核心概念
  - 功能术语
  - 技术术语

- [ ] **Step 4: 运行测试，确保通过**
  
  ```bash
  npm test
  ```

- [ ] **Step 5: 提交**
  
  ```bash
  git add app/content/docs.ts
  git commit -m "docs: rewrite reference section (3 articles)"
  ```

---

### Task 6: 最终验证与清理

**Files:**
- Modify: `app/content/docs.ts`（如有需要）

**Interfaces:**
- Consumes: Task 1-5 完成的所有文章
- Produces: 22 篇完整文档

**Steps:**

- [ ] **Step 1: 运行完整测试套件**
  
  ```bash
  npm run lint
  npx tsc --noEmit
  npm test
  ```

- [ ] **Step 2: 浏览器验证**
  
  启动开发服务器：
  ```bash
  npm run dev
  ```
  
  访问 `http://localhost:3000/docs`，验证：
  - 22 篇文章全部显示
  - 5 个分组正确分组
  - 搜索功能正常
  - 键盘导航正常
  - 打印功能正常
  - 阅读进度条正常

- [ ] **Step 3: 检查文章交叉引用**
  
  确保所有 `related` 字段引用的文章 ID 存在。

- [ ] **Step 4: 最终提交（如有修改）**
  
  ```bash
  git add app/content/docs.ts
  git commit -m "docs: final verification and cleanup"
  ```
