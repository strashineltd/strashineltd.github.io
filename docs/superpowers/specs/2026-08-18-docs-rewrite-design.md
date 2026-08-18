# 网站文档重写设计

## 目标

基于 Stellara Work v0.9.0 最新实现，重写网站文档（`app/content/docs.ts`），采用功能模块化信息架构，覆盖所有新功能，保持 DocsExplorer UI 不变。

## 范围

- **重写**：`app/content/docs.ts` 中的 `docArticles` 数组
- **不变**：
  - DocsExplorer 组件（搜索、键盘导航、打印、阅读进度、分组折叠）
  - 文档页面样式（`globals.css`）
  - 文档路由（`/docs`）

## 信息架构

### 入门（5 篇）

1. **安装与首次启动**
   - 双平台下载（Windows NSIS / macOS DMG）
   - 签名说明（当前未签名，macOS 右键打开，Windows SmartScreen）
   - 新数据目录（Windows: `%APPDATA%\Stellara Work`，macOS: `~/Library/Application Support/Stellara Work`）
   - 密钥加密存储（macOS Keychain / Windows DPAPI）
   - 首次启动引导（选择模型、API Key、工作目录）

2. **界面导览**
   - 无边框窗口设计
   - 首页仪表盘（任务输入、附件拖拽）
   - 三栏布局（侧栏/主区/工作区）
   - 侧栏文件视图
   - 悬停预览

3. **完成第一个任务**
   - 任务输入与附件
   - 流式响应与 Markdown 渲染
   - Diff 卡片与 Shell 卡片
   - 工具调用可视化

4. **模型配置**
   - 内置预设（GLM/DeepSeek/Kimi/MiniMax）
   - 自定义 OpenAI 兼容端点
   - 上下文窗口选择（256K/512K/1M）
   - 模型切换

5. **工作目录与项目**
   - 工作目录概念
   - 项目文件夹模式
   - 路径安全边界

### 核心工作流（6 篇）

6. **Plan 与 Build 模式**
   - Plan 模式（只读分析、计划生成）
   - Build 模式（执行、审批）
   - 模式切换

7. **工具集**
   - 文件操作（read/write/edit）
   - 搜索（grep/search/symbol-search）
   - Shell 命令执行
   - Git 操作
   - Web 抓取
   - 记忆工具
   - 子代理调度

8. **审批与安全边界**
   - 审批顶部栏
   - 危险操作确认
   - 命令白名单
   - 渲染进程沙箱

9. **工作区检查器**
   - 目标/进度/交付物
   - 文件树
   - 上下文使用追踪

10. **记忆中心**
    - 跨会话持久记忆
    - 记忆提取与注入
    - 记忆管理（查看/编辑/删除）

11. **附件与悬停预览**
    - 拖拽文件/图片
    - 附件选择器
    - 图片内联渲染
    - 文件路径悬停预览

### 扩展能力（4 篇）

12. **Skills 自定义工作流**
    - Skills 目录与格式
    - 编写 Skill
    - 加载与调用

13. **MCP 服务器集成**
    - MCP 概念
    - 配置 MCP 服务器
    - MCP 工具使用

14. **命令面板与快捷键**
    - 命令面板（Ctrl+K）
    - 快捷键列表
    - 自定义快捷键

15. **上下文窗口与压缩**
    - 窗口选项
    - 90% 压缩阈值
    - 上下文使用追踪

### 设置与数据（4 篇）

16. **应用内设置面板**
    - 应用设置
    - 模型设置
    - 会话设置
    - 快捷键设置
    - Skills 设置
    - MCP 设置

17. **会话与项目管理**
    - 会话创建/切换/关闭
    - 项目分组
    - 会话导出

18. **本地数据与备份**
    - 数据目录结构
    - 加密密钥存储
    - 备份与恢复
    - 跨平台迁移

19. **故障排查**
    - 模型连接错误
    - 工具执行错误
    - 数据目录问题
    - macOS 特定问题（Keychain、Gatekeeper）

### 参考（3 篇）

20. **常见问题**
    - 平台支持
    - 离线使用
    - 云同步
    - 密钥安全

21. **版本记录**
    - v0.9.0 变更
    - 已知限制

22. **术语表**
    - 核心概念
    - 功能术语
    - 技术术语

## 数据结构

保持现有 `DocArticle` 类型不变：

```typescript
type DocArticle = {
  id: string;
  group: string;  // "入门" | "核心工作流" | "扩展能力" | "设置与数据" | "参考"
  title: string;
  summary: string;
  icon: DocIconName;
  readTime: string;
  updated: string;
  keywords: string[];
  sections: DocSection[];
  related: string[];
};
```

## 内容要求

- **详细**：每篇文章包含多个 section，每个 section 包含 body、steps/bullets/table/checklist/code/note 等多种内容块
- **准确**：基于源程序最新实现（v0.9.0, 2026-08-15）
- **双平台**：所有平台相关内容同时说明 Windows 和 macOS
- **实用**：提供具体步骤、示例、故障排查

## 验证

- `npm run lint` 通过
- `npx tsc --noEmit` 通过
- `npm test` 通过（现有测试断言保持）
- 浏览器核对：22 篇文章全部显示，搜索/导航/打印/进度条正常工作
