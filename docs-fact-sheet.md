# Stellara Work v0.9.2 文档重做事实清单（FACT SHEET）

本文件是重做 app/content/docs.ts 的唯一事实来源。所有内容必须与本文件一致；本文件未提及的旧内容若与下面任何一条冲突，一律以本文件为准。

## 版本与运行时
- 当前版本：v0.9.2，发布日期 2026-08-28。
- 运行时（真实值）：Electron 43.2.0 / Chromium 150.0.7871.129 / Node.js 24.18.0。
- 所有文章的 `updated` 字段统一改为 "2026-08-28"。

## 平台与安装
- 支持平台：Windows x64（NSIS .exe）、macOS arm64 与 x64（DMG）。Linux 尚未提供。
- 安装包（GitHub Releases v0.9.2）：Stellara.Work-Setup-0.9.2-x64.exe、Stellara.Work-0.9.2-arm64.dmg、Stellara.Work-0.9.2-x64.dmg。
- macOS 需要 12.0+，Apple 芯片与 Intel 均支持（x64 dmg 从 v0.9.2 开始提供）。
- 安装包未签名：macOS Gatekeeper 右键打开、Windows SmartScreen 放行。
- 数据目录：Windows %APPDATA%\Stellara Work；macOS ~/Library/Application Support/Stellara Work。旧版 ~/.stellara 自动迁移保留备份。
- 数据文件：config.json（模型/设置/mcpServers）、.env（API Key，enc:v1: 加密，OS Keychain/DPAPI）、stellara.db（SQLite WAL）。

## 模型与 API 协议（v0.9.2 重点）
- 内置模型预设 7 个 + 1 自定义槽位：DeepSeek-V4-Pro、DeepSeek-V4-Flash、Qwen3.8-Max、GLM-5.3、GLM-5.2、Kimi-K3、MiniMax-M3（Base URL 见 electron/llm/presets.ts：DeepSeek https://api.deepseek.com、Qwen https://dashscope.aliyuncs.com/compatible-mode/v1、GLM https://open.bigmodel.cn/api/v1、Kimi https://api.moonshot.cn、MiniMax https://api.minimax.io/v1）。
- 两种协议 WireApi：'responses' | 'anthropic'。
- 内置模型统一使用 Responses API（POST {baseUrl}/responses），无旧协议回退。
- 自定义模型：Base URL 含 /v1/messages 或 /anthropic → Anthropic Messages（POST {baseUrl}/v1/messages）；其余一律 Responses。也支持显式指定协议。
- Chat Completions 协议已在 v0.9.2 移除（openai-compat.ts/endpoint.ts 删除）。"支持任意 OpenAI Chat Completions API" 只存在于 v0.9.1 历史记录。
- Anthropic Messages 走完整 Agent 工具循环（工具调用/结果回传按 Anthropic 格式）。
- 设置页模型卡片显示协议徽章（Responses / Anthropic）与已验证/未验证状态。
- 上下文窗口：256K/512K/1M，90% 自动压缩；模型配置可设 maxOutputTokens 与 reasoningEffort。

## Context Hub（v0.9.2 新增）
- 统一上下文管理：修订号（每次上下文事件递增）、上下文检查点、任务门禁、过期证据检测。
- 检查点：记录目标 + 创建时间；"创建当前检查点"按钮；未验证警告。
- 任务门禁：就绪显示「任务可完成」（role=status），阻塞显示「任务阻塞」（role=alert）+ 原因列表（缺目标/证据过期/修订不一致等）。
- 工作区检查器上下文区展示 token 使用率（>80% 警告色）、输入/输出 token（估算标注）、工具调用分布、最近调用、压缩计数、检查点、门禁。

## 子代理（v0.9.2）
- 会话级协调器（每个会话独立 runner，跨会话不覆盖）。
- 角色：research（研究）/ build（构建）/ verify（验证），必填，默认 research。
- 并发：research/verify 并行（上限 4），build 串行。
- 单次最多 10 个子任务（1-10），ID 唯一。
- build 必须声明 fileScopes，且不同 build 的 fileScopes 不允许重叠，违规整次拒绝。
- UI：子代理卡片含角色徽标（研究/构建/验证）、状态（排队/执行中/完成/失败）、最近工具、耗时、可展开汇总报告。

## 界面（v0.9.2）
- 无边框窗口；顶部 header（左侧栏开关/工作目录/模型切换/工作区开关/文件树/菜单）。
- 三栏布局：左侧导航（首页/项目/工作记录/记忆/文件/设置 + 项目与会话列表）、中间聊天、右侧工作区检查器。
- 主题：浅色/深色/跟随系统（设置-应用面板切换；首页设置同）。
- 克制动效系统：菜单/页面/弹窗/状态/微交互统一动效；历史记录静态，只有实时条目播放进入动画；系统减弱动效偏好下立即完成过渡并停用循环。
- 首页仪表盘：任务输入、附件、快捷任务（梳理项目计划/总结当前进展/检查代码问题/整理交付清单）、继续工作列表、未配置模型横幅。
- 设置面板 5 个页签：模型 / 会话 / 应用 / 技能与 MCP / 快捷键。
- 快捷键 17 个默认（shared/shortcuts.ts）：Ctrl+B 侧栏、Ctrl+Shift+W 工作区、Ctrl+Shift+P Plan、Ctrl+Enter 发送、Escape 拒绝批准、Ctrl+K 命令面板、Ctrl+1..9 标签页、Ctrl+W 关闭标签页、Ctrl+Shift+T 恢复标签页。
- macOS Cmd 键自动映射 Ctrl（metaKey 兼容）。

## 工具集（12 类）
- read_file（10MB 上限、offset/limit）、write_file、edit_file（精确匹配、replaceAll）。
- search_files / search_content / search_symbol（忽略 node_modules/.git/dist/build/release；各 200 条上限；search_content 跳过大文件支持正则）。
- run_command：白名单无 shell，单行命令；路径受工作目录约束（含 git -C / npm --prefix 等 flag 值）；环境变量 ≤10 禁止覆盖关键变量；默认超时 30s（100-300000ms），输出 5MB 截断；macOS 白名单含 swift/xcrun/xcodebuild/brew/plutil/open/sqlite3 等。
- git_status / git_diff / git_log（只读）。
- web_fetch：SSRF 防护（拒绝内网/云元数据）、Content-Type 文本限制、500KB 默认上限、最多 5 次重定向每跳校验。
- memory_search / memory_save（FTS5、scope personal/project/workspace）。
- dispatch_subagents（见子代理节）。
- task_complete。
- Plan 模式只读子集；写入/命令/web/记忆/子代理在 Build 模式需审批。

## 审批与安全
- 写入/命令/web/记忆类工具需审批（顶部条），Esc 拒绝；审批超时默认 60s（设置 1-300s）。
- 状态语义：审批条 alertdialog；错误 alert；成功/就绪 status；验证中 status。
- 命令白名单拒绝破坏性命令；渲染进程沙箱（nodeIntegration false / contextIsolation true / sandbox true）；密钥不经过渲染进程。

## 记忆中心
- 跨会话持久记忆，FTS5 搜索，重要性 0-1（≥0.8 置顶），scope personal/project/workspace，注入规则（个人 ≤3、项目 ≤5、workspace ≤3、高重要性偏好 ≤3、Top N ≤10）。

## 动效系统（v0.9.2 新增，可写进界面导览或新增文章）
- 克制、合成器友好：仅 opacity/transform/颜色/边框/阴影；无布局尺寸动画、无 transition:all、无 scale 控件缩放。
- 时序：菜单进入 180ms/退出 120ms；斜杠菜单 120ms；页面 180ms/4px；设置内容 120ms/2px；弹窗 180/220/140ms；状态 120ms/2px；实时条目 180ms/4px；进度条 scaleX 220ms。
- 循环动画只在实际活动时存在（加载旋转 800ms、思考脉冲 1200ms、录音录制）；页面隐藏时暂停；减弱动效偏好全部停用。
- 无障碍：焦点在关闭过渡前恢复；离场节点 inert；ARIA 状态即时。

## 文档结构要求
- 保留全部 22 篇文章的 id 与 group，保留全部现有 section id（锚点与链接依赖）。
- 保留 changelog 中 v0.9.1 及更早的历史记录原样（它们是历史）。
- 已知限制章节改为"当前"状态描述（平台覆盖：Windows x64 + macOS arm64/x64，暂无 Linux）。
- 可在 workspace-inspector 或新增文章补充动效/无障碍；新增文章需给出新 id（建议 "motion-accessibility"，group "扩展能力"，icon "layout"）。
- 所有 updated 改为 2026-08-28；readTime 按篇幅合理调整。
- 校验：npm run build 必须成功；node --test tests/rendered-html.test.mjs 必须 3/3 通过（该测试断言 /docs 渲染含 "Stellara Work 文档"、"/适用于 Stellara Work v0.9.2/"、"/安装与首次启动/" 等）。