export type DocIconName =
  | "rocket"
  | "message"
  | "layout"
  | "folders"
  | "plan"
  | "workspace"
  | "tools"
  | "models"
  | "context"
  | "settings"
  | "skills"
  | "shield"
  | "database"
  | "keyboard"
  | "command"
  | "lifebuoy"
  | "help";

export type DocNote = {
  tone: "info" | "warning" | "success";
  title: string;
  body: string;
};

export type DocSection = {
  id: string;
  title: string;
  body: string[];
  steps?: Array<{ title: string; detail: string }>;
  bullets?: Array<{ title: string; detail: string }>;
  table?: { headers: string[]; rows: string[][] };
  checklist?: string[];
  code?: { label: string; content: string } | Array<{ label: string; content: string }>;
  note?: DocNote;
};

export type DocArticle = {
  id: string;
  group: string;
  title: string;
  summary: string;
  icon: DocIconName;
  readTime: string;
  updated: string;
  keywords: string[];
  sections: DocSection[];
  related: string[];
};

export const docArticles: DocArticle[] = [
  {
    id: "install-setup",
    group: "入门",
    title: "安装与首次启动",
    summary: "下载、安装并首次启动 Stellara Work，完成模型连接与工作目录设置。",
    icon: "rocket",
    readTime: "10 分钟",
    updated: "2026-08-19",
    keywords: ["安装", "Windows", "macOS", "NSIS", "DMG", "首次启动", "未签名", "SmartScreen", "Gatekeeper", "API Key", "数据目录"],
    sections: [
      {
        id: "download",
        title: "下载安装包",
        body: [
          "Stellara Work v0.9.2 提供两个平台的安装包，均通过 GitHub Releases 发布。Windows 使用 NSIS 安装向导，macOS 使用 DMG 磁盘映像。",
          "下载前请确认平台与架构匹配。Windows 安装包仅支持 x64 架构；macOS 提供 Apple 芯片（arm64）与 Intel（x64）两种磁盘映像。",
        ],
        table: {
          headers: ["平台", "安装包格式", "文件名", "架构要求"],
          rows: [
            ["Windows", "NSIS 安装向导", "Stellara.Work-Setup-0.9.2-x64.exe", "x64"],
            ["macOS", "DMG 磁盘映像", "Stellara.Work-0.9.2-arm64.dmg", "Apple Silicon"],
            ["macOS", "DMG 磁盘映像", "Stellara.Work-0.9.2-x64.dmg", "Intel"]
          ],
        },
        note: {
          tone: "info",
          title: "下载来源",
          body: "请仅从官方 GitHub 仓库（github.com/strashineltd/stellara-work）获取安装包，并核对发布页给出的 SHA-256 校验值。",
        },
      },
      {
        id: "unsigned",
        title: "未签名安装包的处理",
        body: [
          "当前版本的安装包尚未经过代码签名。两个平台都需要额外步骤才能正常启动。",
          "macOS 的 Gatekeeper 会阻止未签名的应用直接打开。Windows 的 SmartScreen 会显示安全警告。这些都是正常现象，按以下步骤操作即可。",
        ],
        steps: [
          { title: "macOS：右键打开", detail: "在 Finder 中找到 Stellara Work，右键点击选择「打开」，在弹出对话框中再次点击「打开」。首次操作后，后续可直接双击启动。" },
          { title: "Windows：SmartScreen 放行", detail: "运行安装程序后，SmartScreen 会显示「Windows 已保护你的电脑」。点击「更多信息」，然后点击「仍要运行」。" },
        ],
        note: {
          tone: "warning",
          title: "安全提示",
          body: "如果遇到非预期的安全警告，请确认安装包来源是否为官方 GitHub 仓库，并核对 SHA-256 校验值。",
        },
      },
      {
        id: "install-steps",
        title: "安装步骤",
        body: [
          "Windows NSIS 安装向导会引导你选择安装位置，并自动创建开始菜单快捷方式和桌面快捷方式。macOS DMG 打开后将 Stellara Work 拖入「应用程序」文件夹即可。",
        ],
        steps: [
          { title: "Windows 安装", detail: "双击 .exe 安装程序，按向导选择安装路径，完成后点击「安装」。" },
          { title: "macOS 安装", detail: "双击 .dmg 打开磁盘映像，将 Stellara Work 拖入「应用程序」文件夹。" },
          { title: "首次启动", detail: "通过快捷方式或应用程序文件夹启动 Stellara Work。" },
        ],
      },
      {
        id: "data-directory",
        title: "数据目录位置",
        body: [
          "Stellara Work 将所有用户数据（配置、会话数据库、加密密钥）存储在平台标准的应用数据目录中。应用不会在用户主目录下创建隐藏文件夹。",
          "旧版本（v0.8 及更早）使用 `~/.stellara` 目录。首次启动 v0.9.0 时，应用会自动将旧数据迁移到新的数据目录，原目录保留作为备份。",
        ],
        table: {
          headers: ["平台", "数据目录路径"],
          rows: [
            ["Windows", "%APPDATA%\\Stellara Work"],
            ["macOS", "~/Library/Application Support/Stellara Work"],
          ],
        },
        bullets: [
          { title: "config.json", detail: "模型配置、活跃模型、工作目录和应用偏好设置。" },
          { title: ".env", detail: "按模型 ID 存储的 API Key（加密存储）。" },
          { title: "stellara.db", detail: "SQLite 数据库，存储项目、会话和消息记录。" },
          { title: "logs/", detail: "应用运行日志，用于问题排查。" },
        ],
      },
      {
        id: "key-encryption",
        title: "密钥加密存储",
        body: [
          "API Key 使用操作系统提供的加密机制进行保护。加密后的密钥以 `enc:v1:` 前缀存储在 `.env` 文件中，只有 Electron 主进程可以解密读取。",
          "渲染界面（聊天窗口）无法通过 IPC 获取裸密钥。模型列表和诊断信息只暴露「是否已配置 Key」的布尔值，不返回密钥本身。",
        ],
        table: {
          headers: ["平台", "加密机制"],
          rows: [
            ["macOS", "Keychain（通过 Electron safeStorage）"],
            ["Windows", "DPAPI（通过 Electron safeStorage）"],
          ],
        },
        note: {
          tone: "success",
          title: "安全设计",
          body: "密钥只在主进程中使用，不通过 IPC 传给渲染界面。即使网页中注入了恶意脚本，也无法读取你的 API Key。",
        },
      },
      {
        id: "first-launch",
        title: "首次启动引导",
        body: [
          "首次启动时，应用会进入引导流程，引导你完成三项基本配置：选择模型、填写 API Key、选择工作目录。",
          "内置模型预设会自动填充 Base URL 和模型名称，只需填写 API Key。选择「自定义模型」则需要手动填写所有字段。",
        ],
        steps: [
          { title: "选择模型预设", detail: "从 GLM-5.2、DeepSeek-v4-Pro、Kimi-K3、MiniMax-M3 或自定义模型中选择一个。" },
          { title: "填写 API Key", detail: "输入对应模型服务商提供的密钥。密钥会加密存储。" },
          { title: "选择工作目录", detail: "点击「浏览」选择项目根目录。Agent 的文件操作和命令执行都受此目录约束。" },
          { title: "连接测试", detail: "应用向模型服务发送测试请求。测试通过后保存配置并进入主界面；失败则可返回修改重新测试。" },
        ],
        checklist: [
          "已下载安装包并成功启动应用",
          "已准备好模型服务商的 API Key",
          "已确定一个项目文件夹作为工作目录",
          "网络连接正常，可以访问所选模型服务",
        ],
      },
    ],
    related: ["models", "troubleshooting"],
  },
  {
    id: "first-task",
    group: "入门",
    title: "完成第一个任务",
    summary: "输入任务、查看流式响应、理解 Diff 卡片和 Shell 卡片，掌握工具调用可视化。",
    icon: "message",
    readTime: "10 分钟",
    updated: "2026-08-19",
    keywords: ["任务", "流式响应", "Markdown", "Diff 卡片", "Shell 卡片", "工具调用", "审批", "附件"],
    sections: [
      {
        id: "task-input",
        title: "任务输入与附件",
        body: [
          "在首页仪表盘或聊天区的输入框中描述你的任务。良好的任务描述应包含目标、范围、上下文和验收标准，这比简单的一句「帮我优化」更能产生准确的结果。",
          "输入框支持多行文本（Shift+Enter 换行），Ctrl+Enter 发送。输入框上方的附件区域支持拖拽添加文件和图片。图片会在消息中内联渲染，文件点击可打开。",
        ],
        code: {
          label: "任务描述示例",
          content: "目标：修复登录页提交后无响应的问题。\n范围：只修改 src/auth 与相关测试，不改接口协议。\n要求：先定位根因，再实现修复；保留现有错误提示。\n验收：登录成功可跳转、失败有提示、相关测试通过。",
        },
        bullets: [
          { title: "附件支持", detail: "通过拖拽或附件选择器添加文件和图片。附件与消息一起发送，帮助 Agent 理解上下文。" },
          { title: "快捷任务", detail: "首页提供「梳理项目计划」「总结当前进展」「检查代码问题」「整理交付清单」四个快捷入口。" },
        ],
      },
      {
        id: "streaming",
        title: "流式响应与 Markdown 渲染",
        body: [
          "Agent 的回复以流式方式实时显示在聊天区。模型逐 token 生成响应，你可以实时看到输出过程，而不需要等待完整回复。",
          "回复内容使用 Markdown 格式渲染，支持标题、列表、代码块、链接等常见格式。代码块会根据语言自动高亮语法。",
        ],
        bullets: [
          { title: "实时渲染", detail: "模型输出通过 SSE（Server-Sent Events）流式传输，逐 token 显示在聊天区。" },
          { title: "Markdown 支持", detail: "支持标题、列表、代码块、表格、链接等 Markdown 格式。" },
          { title: "中止生成", detail: "在 Agent 执行过程中，可以点击输入框的中止按钮停止生成。已产生的工具调用结果不会回滚。" },
        ],
      },
      {
        id: "diff-card",
        title: "Diff 卡片",
        body: [
          "当 Agent 创建或修改文件时，聊天区会显示 Diff 卡片。Diff 卡片使用 CodeMirror 的 MergeView 组件，以并排对比的方式展示修改前后的差异。",
          "新增文件显示为单侧只读编辑器；修改文件显示为左右对比视图，左侧为修改前内容，右侧为修改后内容。卡片头部显示文件路径、新增/删除行数统计。",
        ],
        table: {
          headers: ["元素", "说明"],
          rows: [
            ["文件路径", "显示相对路径，支持悬停预览和点击打开"],
            ["新增/删除统计", "绿色 +N 表示新增行数，红色 -N 表示删除行数"],
            ["折叠/展开", "点击卡片头部可折叠或展开 diff 视图"],
            ["语法高亮", "根据文件扩展名自动选择语言（TS/JS/JSON/HTML/CSS/Python/Markdown）"],
            ["主题适配", "自动跟随应用的深色/浅色主题"],
          ],
        },
        note: {
          tone: "info",
          title: "Diff 卡片来源",
          body: "Diff 卡片来自 write_file 和 edit_file 工具调用的结果。每次文件修改都会自动生成 before/after 对比视图。",
        },
      },
      {
        id: "shell-card",
        title: "Shell 卡片",
        body: [
          "当 Agent 执行命令时，聊天区会显示 Shell 卡片。卡片头部显示命令内容、执行时长和退出码；展开后显示标准输出（stdout）和标准错误（stderr）。",
          "长输出默认折叠（超过 500 字符时），点击可展开。输出超过 10000 字符时会被截断并显示提示。卡片还提供行号切换和一键复制功能。",
        ],
        table: {
          headers: ["元素", "说明"],
          rows: [
            ["命令", "显示执行的命令，超过 80 字符时中间截断"],
            ["时长", "显示执行耗时（秒）"],
            ["退出码", "exit 0 为绿色（成功），非零为红色（失败）"],
            ["stdout/stderr", "分色显示，stderr 使用醒目样式"],
            ["行号", "可切换显示/隐藏行号（仅 stdout）"],
            ["复制", "一键复制全部输出内容"],
          ],
        },
      },
      {
        id: "tool-calls",
        title: "工具调用可视化",
        body: [
          "Agent 的每次工具调用都会在聊天区显示为对应的卡片。只读工具（read_file、search_files 等）直接执行并显示结果；写入工具（write_file、edit_file）和命令执行（run_command）需要用户审批。",
          "审批请求会以顶部固定条的形式出现，显示工具名称和格式化参数。点击「允许这一次」放行当前请求，点击「拒绝」或按 Esc 拒绝。审批只放行当前请求，不会建立永久授权。",
        ],
        checklist: [
          "检查审批条中的工具类型是否与当前任务相符",
          "确认文件路径在预期工作目录内",
          "确认命令参数合理，不包含敏感信息",
          "拒绝后可以在输入框中说明原因，引导 Agent 调整方案",
        ],
        note: {
          tone: "warning",
          title: "审批超时",
          body: "审批默认等待 60 秒，超时自动拒绝。可以在设置中调整等待时间（1-300 秒）。",
        },
      },
    ],
    related: ["interface-tour", "models"],
  },
  {
    id: "interface-tour",
    group: "入门",
    title: "界面导览",
    summary: "了解无边框窗口、首页仪表盘、三栏布局、侧栏文件视图和悬停预览。",
    icon: "layout",
    readTime: "8 分钟",
    updated: "2026-08-19",
    keywords: ["界面", "无边框", "首页", "仪表盘", "三栏布局", "侧栏", "文件视图", "悬停预览", "附件"],
    sections: [
      {
        id: "frameless",
        title: "无边框窗口设计",
        body: [
          "Stellara Work v0.9.2 在两个平台上都采用无边框窗口设计，移除了系统标题栏和交通灯按钮。窗口拖动、关闭、最小化等操作由应用内部的自定义控件实现。",
          "macOS 用户通过 Cmd+Q 或应用菜单退出应用；Windows 用户通过窗口右上角的关闭按钮退出。无边框设计为内容区域留出了更多空间。",
        ],
        note: {
          tone: "info",
          title: "窗口控制",
          body: "由于移除了系统标题栏，窗口的拖动区域位于顶部空白区域。关闭应用请使用应用内控件或系统快捷键。",
        },
      },
      {
        id: "home-dashboard",
        title: "首页仪表盘",
        body: [
          "启动应用后首先看到的是首页仪表盘。这里是任务入口和工作概览的中心，包含任务输入区、附件拖拽区、快捷任务按钮和继续工作列表。",
          "任务输入区支持多行文本输入，按 Ctrl+Enter（macOS 为 Cmd+Enter）发送。输入区下方显示当前项目或工作目录名称。",
        ],
        bullets: [
          { title: "任务输入", detail: "描述你的目标、范围和验收标准，Agent 会在当前工作区执行。" },
          { title: "附件拖拽", detail: "将文件或图片拖入输入区，或通过附件选择器添加。图片会内联渲染，文件点击可打开。" },
          { title: "快捷任务", detail: "提供「梳理项目计划」「总结当前进展」「检查代码问题」「整理交付清单」四个快捷入口。" },
          { title: "继续工作", detail: "显示最近 3 个会话或项目，点击可快速恢复之前的工作。" },
        ],
        note: {
          tone: "warning",
          title: "附件与工作目录",
          body: "附件功能需要先配置工作目录（通过创建项目）。未配置工作目录时，附件按钮为禁用状态。",
        },
      },
      {
        id: "three-column",
        title: "三栏布局",
        body: [
          "进入会话后，界面切换为三栏布局：左侧导航栏、中间聊天区、右侧工作区检查器。每个区域的宽度和可见性都可以独立调整，偏好设置会自动保存。",
        ],
        table: {
          headers: ["区域", "内容", "操作"],
          rows: [
            ["左侧导航栏", "首页、项目、工作记录、记忆、文件、设置入口；项目与会话列表", "搜索、新建、重命名、导出、删除"],
            ["中间聊天区", "消息流、工具调用卡片、审批条、输入框", "发送、中止、审批、切换模型/模式"],
            ["右侧工作区", "目标、进度、交付物、文件树", "查看步骤状态、折叠/展开"],
          ],
        },
        checklist: [
          "使用 Ctrl+B 切换左侧导航栏的显示/隐藏",
          "使用 Ctrl+Shift+W 切换右侧工作区的显示/隐藏",
          "拖动区域边界可调整宽度，偏好会自动保存",
        ],
      },
      {
        id: "sidebar-nav",
        title: "侧栏导航入口",
        body: [
          "左侧导航栏顶部提供六个快捷入口，分别对应应用的主要功能模块。当前所在页面会以高亮状态标识。",
        ],
        table: {
          headers: ["入口", "功能"],
          rows: [
            ["首页", "返回仪表盘首页"],
            ["项目", "查看和管理所有项目"],
            ["工作记录", "查看所有会话列表（按项目分组）"],
            ["记忆", "查看跨会话持久记忆"],
            ["文件", "浏览当前工作目录的文件树"],
            ["设置", "打开应用内设置面板"],
          ],
        },
      },
      {
        id: "sidebar-files",
        title: "侧栏文件视图",
        body: [
          "点击侧栏的「文件」入口，可以在侧栏中浏览当前工作目录的目录结构。文件视图以树形结构展示，支持展开和折叠目录。",
          "文件视图是只读的，主要用于了解项目的目录组织和 Agent 正在操作的文件范围。被当前任务触碰过的文件会有特殊标记。",
        ],
      },
      {
        id: "hover-preview",
        title: "悬停预览",
        body: [
          "在聊天消息中出现的文件路径（如 Diff 卡片中的路径），鼠标悬停 300 毫秒后会弹出文件预览浮层。浮层显示文件的前 100KB 内容，最大尺寸为 480×320 像素。",
          "预览浮层支持点击路径复制文件名，点击「打开」按钮会用系统默认应用打开文件。鼠标移出路径和浮层后 200 毫秒自动关闭。",
        ],
        bullets: [
          { title: "触发条件", detail: "鼠标悬停在带有 HoverablePath 组件的文件路径上，延迟 300ms 后显示。" },
          { title: "预览内容", detail: "读取文件前 100KB 内容，超出部分显示「已截断」提示。" },
          { title: "点击打开", detail: "点击文件路径会调用系统默认应用打开该文件。" },
          { title: "缓存机制", detail: "预览内容会被缓存，重复悬停同一文件不会重复读取。" },
        ],
      },
    ],
    related: ["first-task", "shortcuts"],
  },
  {
    id: "projects-sessions",
    group: "设置与数据",
    title: "会话与项目管理",
    summary: "创建、切换和关闭会话，使用项目分组组织工作，导出会话记录用于备份或迁移。",
    icon: "folders",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["会话", "项目", "创建", "切换", "删除", "导出", "未分组", "标签页", "搜索"],
    sections: [
      {
        id: "session-create-switch",
        title: "会话创建与切换",
        body: [
          "会话是 Stellara Work 中的基本工作单元。每个会话保存标题、模型配置、工作目录、所属项目、消息数量和时间信息。会话数据存储在本地 SQLite 数据库（stellara.db）中，关闭应用后仍可继续。",
          "会话列表按最近更新排序。在没有新增消息的情况下，普通保存不会无意义地把旧会话顶到最前。会话标题默认由首条用户消息的前几个字生成，也可以在设置面板中内联重命名。",
        ],
        steps: [
          { title: "创建会话", detail: "从侧栏导航、项目菜单或命令面板（Ctrl+K）创建新会话。新会话会继承当前活跃模型的配置。" },
          { title: "切换会话", detail: "在侧栏会话列表中点击目标会话即可切换。Tab 模式下可使用 Ctrl+1 到 Ctrl+9 快速切换标签页。" },
          { title: "恢复关闭的标签页", detail: "按 Ctrl+Shift+T 恢复最近关闭的标签页。关闭标签页不会删除会话数据。" },
          { title: "搜索会话", detail: "侧栏搜索框按会话标题过滤，并会展开命中的项目组。" },
        ],
        table: {
          headers: ["操作", "快捷键", "说明"],
          rows: [
            ["新建会话", "命令面板搜索", "创建空会话，继承活跃模型配置"],
            ["切换标签页", "Ctrl+1 到 Ctrl+9", "Tab 模式下快速切换前 9 个标签页"],
            ["关闭标签页", "Ctrl+W", "只关闭视图，会话数据保留"],
            ["恢复标签页", "Ctrl+Shift+T", "恢复最近关闭的标签页"],
          ],
        },
        note: {
          tone: "info",
          title: "会话标题",
          body: "会话标题用于搜索和导航，不影响实际执行。可以在设置 → 会话面板中内联重命名。",
        },
      },
      {
        id: "session-close-delete",
        title: "关闭标签页与删除会话",
        body: [
          "关闭标签页和删除会话是两个不同的操作。关闭标签页（Ctrl+W）只关闭当前视图，会话仍然保存在本地数据库中。只有执行「删除会话」并确认后，会话及其所有消息才会从数据库永久移除。",
          "侧栏模式下没有标签页概念，会话列表中的删除操作会直接触发确认对话框。删除操作不可恢复，请谨慎执行。",
        ],
        table: {
          headers: ["操作", "会话是否保留", "消息是否保留", "能否恢复"],
          rows: [
            ["关闭标签页", "是", "是", "Ctrl+Shift+T 或重新打开"],
            ["删除项目", "是，移到未分组", "是", "项目需重新创建"],
            ["删除会话", "否", "否", "应用内不可恢复"],
            ["清空所有会话", "否", "否", "只能依赖外部备份"],
          ],
        },
        note: {
          tone: "warning",
          title: "删除不可恢复",
          body: "删除会话会同时删除其所有消息。执行前请确认已导出重要内容。设置 → 会话面板提供「清空所有会话」的危险区操作。",
        },
      },
      {
        id: "project-grouping",
        title: "项目分组",
        body: [
          "项目用于把相关会话组织在一起。左侧栏会显示每个项目的会话数量，并为没有项目归属的会话提供「未分组」区域。项目不会改变磁盘目录结构，也不会替代会话自己的工作目录。",
          "项目可以理解为一个虚拟文件夹，它只在 Stellara Work 的数据库中维护层级关系。一个会话在同一时间只能属于一个项目，或不属于任何项目（即「未分组」）。",
        ],
        bullets: [
          { title: "新建项目", detail: "创建一个命名分组，随后可直接在该项目中创建会话。" },
          { title: "重命名项目", detail: "只更新分组名称，不改变会话内容。" },
          { title: "删除项目", detail: "项目记录被移除，其中的会话会保留并转入「未分组」。" },
          { title: "移动会话", detail: "在会话右键菜单中选择目标项目，或拖动到项目组中。" },
          { title: "未分组", detail: "所有没有项目归属的会话都会出现在这里，无法删除此分组。" },
        ],
        note: {
          tone: "success",
          title: "删除边界",
          body: "删除项目不会删除其会话，这一操作用于整理导航，不等同于清除聊天记录。",
        },
      },
      {
        id: "session-export",
        title: "会话导出",
        body: [
          "会话导出功能将会话内容保存为 JSON 文件，用于备份、审计或跨设备迁移。导出的记录包含任务文本、模型回复和工具调用结果，分享前应检查是否含有项目敏感信息。",
          "导出的 JSON 文件可以被重新导入到其他 Stellara Work 实例中，用于跨设备迁移或团队共享（需注意脱敏）。导入前确认本地不存在同名会话以避免混淆。",
        ],
        checklist: [
          "导出前确认会话中不包含 API Key 或密码",
          "大文件导出可能需要几秒钟，期间不要关闭应用",
          "导出的 JSON 文件包含完整的消息历史和工具调用结果",
          "导入前确认目标设备已安装相同版本的 Stellara Work",
          "将备份存放在受控位置，不要公开分享",
        ],
        code: {
          label: "导出 JSON 结构示例",
          content: "{\n  \"id\": \"session-uuid\",\n  \"title\": \"会话标题\",\n  \"modelId\": \"deepseek-v4-pro\",\n  \"workDir\": \"/path/to/project\",\n  \"projectId\": \"project-uuid\",\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"用户消息\",\n      \"createdAt\": 1729324800000\n    },\n    {\n      \"role\": \"assistant\",\n      \"content\": \"Agent 回复\",\n      \"toolCalls\": [...],\n      \"createdAt\": 1729324801000\n    }\n  ],\n  \"createdAt\": 1729324800000,\n  \"updatedAt\": 1729324900000\n}",
        },
      },
    ],
    related: ["app-settings", "local-data", "shortcuts"],
  },
  {
    id: "plan-build",
    group: "核心工作流",
    title: "Plan 与 Build 模式",
    summary: "Plan 模式只读分析并输出执行计划，Build 模式使用全部工具执行修改，理解两种模式的能力边界与切换方式。",
    icon: "plan",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["Plan", "Build", "计划模式", "只读", "READY TO EXECUTE", "执行模式", "模式切换", "Ctrl+Shift+P"],
    sections: [
      {
        id: "plan-mode",
        title: "Plan 模式：只读分析与计划生成",
        body: [
          "Plan 模式是工具层面的只读限制，而非提示词约定。进入 Plan 模式后，Agent 只能调用只读工具，无法写入文件、执行命令或访问外部 URL。系统提示词明确要求 Agent 分析需求并输出有序执行计划，计划末尾用 \"READY TO EXECUTE\" 标记表示准备就绪。",
          "Plan 模式下可用的工具包括：read_file（读取文件）、search_files（文件名搜索）、search_content（内容搜索）、search_symbol（符号定位）、list_files（目录树）、git_status / git_diff / git_log（Git 只读操作）。web_fetch 和记忆工具不进入 Plan 模式。",
        ],
        bullets: [
          { title: "只读工具集", detail: "read_file、search_files、search_content、search_symbol、list_files 以及三个 Git 只读工具。" },
          { title: "计划输出格式", detail: "有序列表，每一步说明要做什么、为什么、涉及哪些文件。" },
          { title: "就绪标记", detail: "计划末尾输出 READY TO EXECUTE，表示分析完成、等待用户批准后执行。" },
          { title: "工具使用建议", detail: "不确定位置时先用 search_files 或 search_content 定位；大文件用 offset/limit 分段读取。" },
        ],
        code: {
          label: "Plan 模式示例输出",
          content: "1. 用 search_files 找到 src/ 下所有 .ts 文件\n2. 用 read_file 读取 src/index.ts 了解入口结构\n3. 用 read_file(offset=50, limit=30) 读取 src/utils.ts 第 50-80 行\n4. 在 src/utils/ 新增 helper.ts 实现 X 功能\n5. 在 src/index.ts 引入新 helper\n6. 运行 npm test 验证\n\nREADY TO EXECUTE",
        },
      },
      {
        id: "build-mode",
        title: "Build 模式：全工具执行",
        body: [
          "Build 模式提供全部工具访问权限，包括文件读写、命令执行、Web 抓取和记忆工具。系统提示词规定了六条核心规则，确保 Agent 以安全、可控的方式执行修改。",
          "Build 模式的核心规则：先读后改（修改前必须先 read_file）、先搜后读（不确定位置时先搜索）、改完必验（修改后重新 read_file 确认）、出错必析（不盲目重试）、一次一改（一次一个逻辑变更）、优先 edit_file（精确替换优于整文件覆盖）。",
        ],
        table: {
          headers: ["规则", "说明"],
          rows: [
            ["先读后改", "修改文件前必须先 read_file 确认当前内容"],
            ["先搜后读", "不确定文件位置时先 search_files 或 search_content 定位"],
            ["改完必验", "每次修改后重新 read_file 确认修改正确"],
            ["出错必析", "遇到错误先分析原因，不盲目重试"],
            ["一次一改", "一次只做一个逻辑变更，不批量修改不相关文件"],
            ["优先 edit_file", "能用 edit_file 精确替换就不用 write_file 整文件覆盖"],
          ],
        },
        note: {
          tone: "info",
          title: "错误处理引导",
          body: "edit_file 匹配失败时，Agent 会先重新读取文件获取准确内容再重试；命令执行失败时会仔细阅读错误信息定位原因。这些引导是系统级的，不需要在任务中重复要求。",
        },
      },
      {
        id: "mode-comparison",
        title: "两种模式的能力对比",
        body: [
          "两种模式共享同一个会话上下文。Plan 模式中产生的调查结论和计划步骤，切到 Build 后 Agent 仍然可以访问，保证先分析后执行的连贯性。",
        ],
        table: {
          headers: ["能力", "Plan 模式", "Build 模式"],
          rows: [
            ["读取文件 / 搜索内容 / 目录树", "允许", "允许"],
            ["符号定位 (search_symbol)", "允许", "允许"],
            ["Git status / diff / log", "允许，只读", "允许，只读"],
            ["写入或编辑文件", "不提供", "提供，需审批"],
            ["执行命令 (run_command)", "不提供", "提供，需审批且受白名单限制"],
            ["HTTP GET (web_fetch)", "不提供", "提供，需审批"],
            ["记忆搜索 / 保存", "不提供", "提供，需审批"],
            ["子代理调度", "不提供", "提供"],
            ["输出执行计划", "主要目标", "可按计划执行"],
          ],
        },
      },
      {
        id: "mode-switch",
        title: "模式切换",
        body: [
          "使用 Ctrl+Shift+P 快捷键或命令面板（Ctrl+K）搜索「切换 Plan 模式」可在两种模式间切换。切换后系统提示词会立即更换，工具集也随之变化。",
          "推荐的工作流：复杂任务先在 Plan 模式调查和规划，审核计划无误后切到 Build 模式执行。执行中继续通过审批控制每个写入和命令操作。",
        ],
        steps: [
          { title: "Plan 阶段", detail: "描述目标与限制，允许 Agent 只读调查，审核输出的执行计划。" },
          { title: "审核计划", detail: "检查每一步的理由、涉及文件和验证方法，必要时要求补充或调整。" },
          { title: "切换到 Build", detail: "确认计划后按 Ctrl+Shift+P 切到 Build 模式，Agent 开始按计划执行。" },
          { title: "审批执行", detail: "执行中通过审批顶部条逐个确认文件修改和命令执行。" },
          { title: "核对交付", detail: "根据工作区检查器的步骤状态和交付物列表判断是否完成。" },
        ],
        note: {
          tone: "success",
          title: "平台感知",
          body: "系统提示词会自动注入当前运行环境信息（macOS 或 Windows），Agent 会输出平台正确的命令。macOS 使用 POSIX 命令语法，Windows 使用 Windows 命令语法。",
        },
      },
    ],
    related: ["tools", "approvals", "workspace-inspector"],
  },
  {
    id: "workspace-inspector",
    group: "核心工作流",
    title: "工作区检查器",
    summary: "右侧面板集中展示任务目标、执行进度、上下文使用、子代理状态、交付物、记忆注入和文件树。",
    icon: "workspace",
    readTime: "11 分钟",
    updated: "2026-08-19",
    keywords: ["工作区", "检查器", "目标", "进度", "上下文", "子代理", "交付物", "记忆注入", "文件树", "步骤状态"],
    sections: [
      {
        id: "goal-section",
        title: "目标区：计划步骤与任务消息",
        body: [
          "目标区根据任务类型显示不同内容。当 Agent 在 Plan 模式下生成执行计划时，目标区显示有序步骤列表，每一步包含序号和描述文本。没有计划时则显示本次任务的首条用户消息。",
          "计划步骤支持手动切换状态：点击步骤或使用键盘 Enter/Space，状态按「待做 → 完成 → 失败」循环。进度百分比只把「完成」状态计入已完成数量。",
        ],
        bullets: [
          { title: "计划步骤", detail: "有序列表展示，每步显示序号、描述文本和状态徽标（对勾/警告图标）。" },
          { title: "用户消息", detail: "无计划时显示首条用户消息的文本内容。" },
          { title: "状态切换", detail: "点击或 Enter/Space 切换：待做（灰色）→ 完成（绿色）→ 失败（红色）。" },
          { title: "无障碍支持", detail: "步骤支持 role=\"button\"、tabIndex 和 aria-label，可键盘操作。" },
        ],
      },
      {
        id: "progress-section",
        title: "进度区：百分比与操作统计",
        body: [
          "进度区显示一个进度条和百分比文本。Plan 任务按步骤完成数计算（如「步骤 3 / 6」），普通任务按已完成工具调用数计算（如「已完成 12 / 20 项操作」）。",
          "当前正在执行的工具名称也会显示在进度区下方，帮助你了解 Agent 此刻正在做什么。",
        ],
        table: {
          headers: ["元素", "说明"],
          rows: [
            ["进度条", "可视化百分比，role=\"progressbar\"，支持 aria-valuenow"],
            ["百分比文本", "如 50%，紧跟进度条右侧"],
            ["摘要文本", "Plan 模式显示「步骤 N / M」，普通模式显示「已完成 N / M 项操作」"],
            ["当前操作", "显示当前正在执行的工具名称"],
          ],
        },
      },
      {
        id: "context-section",
        title: "上下文区：Token 使用与工具调用统计",
        body: [
          "上下文区追踪当前会话的 Token 消耗和工具调用情况。顶部显示上下文使用率（promptTokens / contextWindow），超过 80% 时进度条变为警告色。",
          "下方显示输入/输出 Token 数、各工具的调用次数分布（带可视化条形图），以及最近调用的成功/失败状态和耗时。当消息被压缩时，还会显示已压缩的消息条数。",
        ],
        table: {
          headers: ["指标", "说明"],
          rows: [
            ["上下文使用率", "promptTokens / contextWindow，超过 80% 显示警告色"],
            ["输入 / 输出 Token", "以 K 为单位显示（如 45.2K），provider 未上报时标注「估算」"],
            ["工具调用分布", "按调用次数降序排列，每行显示工具中文名、条形图和次数"],
            ["最近调用", "显示最近几次调用的成功/失败状态、工具名和耗时（秒）"],
            ["压缩计数", "已压缩的消息条数，长会话中自动触发"],
          ],
        },
        note: {
          tone: "info",
          title: "工具中文名映射",
          body: "工具调用统计使用中文标签：read_file → 读取，write_file → 写入，edit_file → 编辑，run_command → 命令，search_files/search_content → 搜索，git 相关 → git，web_fetch → 网络，memory 相关 → 记忆，task_complete → 完成。未映射的工具显示原名。",
        },
      },
      {
        id: "subagents-section",
        title: "子代理区：并行任务状态",
        body: [
          "当 Agent 使用 dispatch_subagents 工具分发子任务时，子代理区会显示每个子代理的状态卡片。没有子代理时此区域不显示。",
          "每个子代理卡片显示 ID、任务描述、状态徽标（排队/执行中/完成/失败）、最近使用的工具和执行耗时。点击卡片可展开查看子代理的汇总报告。",
        ],
        table: {
          headers: ["状态", "徽标文本", "说明"],
          rows: [
            ["queued", "排队", "子代理已创建但尚未开始执行"],
            ["running", "执行中", "子代理正在执行任务"],
            ["done", "完成", "子代理已成功完成任务"],
            ["failed", "失败", "子代理执行失败"],
          ],
        },
      },
      {
        id: "deliverables-section",
        title: "交付物区：文件变更记录",
        body: [
          "交付物列表记录本次会话中通过 write_file 或 edit_file 写入或编辑的所有文件。每个条目显示文件图标（新建用 file 图标，编辑用 edit 图标）和相对路径。",
          "交付物列表表示 Agent 执行过写入操作，并不等同于最终可发布产物。结合 Git diff、测试结果和实际运行检查才能完成验收。",
        ],
      },
      {
        id: "memory-section",
        title: "记忆注入区：本次使用的记忆",
        body: [
          "当系统从记忆库中检索并注入记忆到当前会话时，记忆注入区会显示本次注入的记忆条目。没有注入记忆时此区域不显示。",
          "每条记忆显示类型（kind）、内容摘要和重要性标记。重要性 ≥ 0.8 的记忆会显示星号（★），表示这是高重要性记忆。",
        ],
      },
      {
        id: "file-tree-section",
        title: "文件区：工作目录文件树",
        body: [
          "文件区展示工作目录的目录树结构，最大深度 3 层。被当前任务触碰过的文件会显示星号（*）标记，帮助你快速识别变更范围。",
          "目录节点支持展开和折叠。文件树在组件挂载时异步加载，加载中和加载失败都有对应的提示文本。",
        ],
        checklist: [
          "文件树是只读视图，不能直接编辑文件",
          "星号标记的文件是本次会话中被 write_file 或 edit_file 修改过的",
          "目录树自动忽略 node_modules、.git、dist、build 等目录",
          "使用 Ctrl+Shift+W 快速切换工作区检查器的显示/隐藏",
          "拖动左边界可调整宽度（200px - 500px），偏好自动保存",
        ],
      },
      {
        id: "resize-toggle",
        title: "调整与隐藏",
        body: [
          "工作区检查器宽度可通过拖动左边界调整，范围 200px 到 500px，默认 280px。也支持键盘操作：聚焦 resize handle 后用 ←/→ 方向键以 16px 步进调整。",
          "宽度偏好会自动保存。使用 Ctrl+Shift+W 或命令面板可快速显隐右侧工作区检查器。",
        ],
      },
    ],
    related: ["plan-build", "tools", "shortcuts"],
  },
  {
    id: "tools",
    group: "核心工作流",
    title: "工具集",
    summary: "完整参考 Agent 可用的 12 类工具：文件操作、搜索、Shell 命令、Git、Web 抓取、记忆和子代理调度。",
    icon: "tools",
    readTime: "16 分钟",
    updated: "2026-08-19",
    keywords: ["工具", "read_file", "write_file", "edit_file", "run_command", "search_files", "search_content", "search_symbol", "list_files", "git", "web_fetch", "memory", "dispatch_subagents"],
    sections: [
      {
        id: "file-operations",
        title: "文件操作：read_file / write_file / edit_file",
        body: [
          "文件操作是 Agent 最核心的能力。三个工具分别对应读取、新建/覆盖和精确编辑，所有路径都受工作目录安全边界约束。",
        ],
        table: {
          headers: ["工具", "功能", "关键参数", "限制"],
          rows: [
            ["read_file", "读取文件内容（带行号）", "path, offset（起始行 1-indexed）, limit（最大行数）", "单文件最大 10MB；支持分段读取"],
            ["write_file", "新建或覆盖整个文件", "path, content", "自动创建父目录；覆盖前应先 read_file"],
            ["edit_file", "按 oldText 精确替换", "path, oldText, newText, replaceAll", "默认要求恰好 1 次匹配；replaceAll=true 替换所有"],
          ],
        },
        bullets: [
          { title: "read_file 分段读取", detail: "大文件使用 offset 和 limit 只读取需要的行范围，返回带行号的内容。" },
          { title: "edit_file 匹配规则", detail: "oldText 必须精确匹配（含缩进和换行）。匹配 0 处返回错误；匹配多处时除非 replaceAll=true 否则也返回错误。" },
          { title: "路径安全", detail: "所有路径经过字符串检查和真实路径验证（含 symlink 检查），确保不越出工作目录。" },
        ],
        code: {
          label: "文件操作示例",
          content: "read_file(path=\"src/utils.ts\", offset=50, limit=30)\nwrite_file(path=\"src/helper.ts\", content=\"...\")\nedit_file(path=\"src/index.ts\", oldText=\"import ...\", newText=\"import ...\", replaceAll=false)",
        },
      },
      {
        id: "search-tools",
        title: "搜索：search_files / search_content / search_symbol",
        body: [
          "三个搜索工具分别用于文件名搜索、内容搜索和代码符号定位。它们自动忽略 node_modules、.git、dist、build、release 目录。",
        ],
        table: {
          headers: ["工具", "功能", "关键参数"],
          rows: [
            ["search_files", "glob 模式搜索文件名", "pattern（如 **/*.ts）, cwd（可选）"],
            ["search_content", "文本/正则搜索文件内容", "pattern（glob）, query, caseSensitive, regex, cwd"],
            ["search_symbol", "定位代码符号定义位置", "symbol, include（文件 glob）, contextLines, limit"],
          ],
        },
        bullets: [
          { title: "search_files", detail: "仅匹配文件名，不搜索内容。最多返回 200 条结果。" },
          { title: "search_content", detail: "类似 grep，返回匹配行和行号。最多 200 条匹配，跳过 >10MB 文件。支持正则（regex=true）。" },
          { title: "search_symbol", detail: "匹配 function/const/class/def/func/interface/enum/type/import/赋值等定义模式。默认搜索 TS/JS/Py/Swift/Go/Rs/Java 文件，返回匹配行及上下文。" },
        ],
      },
      {
        id: "shell-tool",
        title: "Shell 命令：run_command",
        body: [
          "run_command 直接启动白名单中的程序，不经过系统 shell。只接受单行命令，拒绝管道、重定向和 shell 特殊字符。",
          "命令默认在工作目录中运行。可通过 cwd 参数指定工作目录内的子目录（相对路径），绝对路径和越界路径会被拒绝。",
        ],
        bullets: [
          { title: "白名单限制", detail: "只允许预定义的开发工具（npm/git/python/cargo 等）。破坏性命令（rm/mv/cp）不在白名单。" },
          { title: "路径约束", detail: "所有路径参数必须是工作目录内的相对路径。git -C、npm --prefix 等 flag 的路径值也受检查。" },
          { title: "环境变量", detail: "最多 10 个额外变量，键名须合法，禁止覆盖 PATH/HOME/SHELL 等关键变量。" },
          { title: "超时与输出", detail: "默认超时 30 秒（可设 100-300000ms），输出上限 5MB，超出自动截断。" },
        ],
        note: {
          tone: "info",
          title: "平台差异",
          body: "macOS 白名单额外包含 swift、swiftc、xcrun、xcodebuild、brew、plutil、open、sqlite3 等开发工具。Windows 白名单不包含 POSIX 专属命令。",
        },
      },
      {
        id: "git-tools",
        title: "Git 操作：git_status / git_diff / git_log",
        body: [
          "三个 Git 工具提供只读的版本控制信息查询。它们在 Plan 模式和 Build 模式下都可用。",
        ],
        table: {
          headers: ["工具", "功能", "参数"],
          rows: [
            ["git_status", "查看工作区状态（当前分支 + 变更文件）", "无参数，等同于 git status --porcelain -b"],
            ["git_diff", "查看变更差异", "staged（是否已暂存）, file（指定文件）"],
            ["git_log", "查看提交记录", "count（显示数量，默认 10）"],
          ],
        },
      },
      {
        id: "web-fetch",
        title: "Web 抓取：web_fetch",
        body: [
          "web_fetch 发送 HTTP GET 请求抓取公共 URL 的文本内容。内置 SSRF 防护，自动拒绝 localhost、私网地址和云元数据地址。",
          "返回的内容会标记为不可信外部内容，不能覆盖系统规则或审批权限。每次重定向都会重新校验目标地址的安全性。",
        ],
        bullets: [
          { title: "SSRF 防护", detail: "DNS 解析后检查所有 IP，拒绝 127.0.0.0/8、10.0.0.0/8、172.16.0.0/12、192.168.0.0/16、169.254.0.0/16 等受限地址。" },
          { title: "Content-Type 检查", detail: "只接受文本类内容（text/*、application/json 等），拒绝二进制内容。" },
          { title: "大小限制", detail: "默认最大 500KB，可通过 maxBytes 参数调整。超出自动截断。" },
          { title: "重定向处理", detail: "手动处理重定向（最多 5 次），每次重定向都校验目标地址。" },
        ],
      },
      {
        id: "memory-tools",
        title: "记忆工具：memory_search / memory_save",
        body: [
          "记忆工具让 Agent 可以主动搜索和保存跨会话的持久记忆。记忆存储在本地 SQLite 数据库中，支持 FTS5 全文搜索。",
        ],
        table: {
          headers: ["工具", "功能", "关键参数"],
          rows: [
            ["memory_search", "搜索记忆库", "query, scope（personal/project/workspace）, kind, limit"],
            ["memory_save", "保存新记忆", "content, kind, scope, tags, importance"],
          ],
        },
        bullets: [
          { title: "记忆类型", detail: "fact（事实）、preference（偏好）、decision（决策）、codebase（代码库知识）、requirement（需求）、meeting（会议记录）。" },
          { title: "重要性", detail: "0-1 之间，默认 0.7。≥ 0.8 的记忆会进入记忆中心的重要记忆置顶区。" },
          { title: "搜索回退", detail: "FTS5 查询语法错误时自动回退到 LIKE 模糊搜索。" },
        ],
      },
      {
        id: "subagent-tool",
        title: "子代理调度：dispatch_subagents",
        body: [
          "dispatch_subagents 把大任务拆分成多个独立子任务，并行分发给子代理执行。每个子代理共享工作目录但拥有独立上下文。",
          "子代理最多 10 个并行执行，超出部分排队等待。单次最多分发 20 个子任务。所有子代理的 ID 必须唯一。",
        ],
        code: {
          label: "子代理调度示例",
          content: "dispatch_subagents({\n  subagents: [\n    { id: \"refactor-fs\", task: \"重构文件系统模块...\" },\n    { id: \"write-tests\", task: \"为 auth 模块编写单元测试...\" },\n    { id: \"update-docs\", task: \"更新 API 文档...\" }\n  ]\n})",
        },
        bullets: [
          { title: "并行限制", detail: "最多 10 个并行，超出排队。总数上限 20 个。" },
          { title: "结果汇总", detail: "所有子代理完成后返回各自的汇总报告，失败的子代理会标注并说明原因。" },
          { title: "工作区显示", detail: "子代理的状态和进度会显示在工作区检查器的子代理区。" },
        ],
      },
      {
        id: "plan-mode-tools",
        title: "Plan 模式的工具子集",
        body: [
          "Plan 模式下只有只读工具可用。以下工具会被排除：write_file、edit_file、run_command、web_fetch、memory_search、memory_save、dispatch_subagents、task_complete。",
        ],
        checklist: [
          "Plan 模式可用：read_file、search_files、search_content、search_symbol、list_files、git_status、git_diff、git_log",
          "Build 模式额外可用：write_file、edit_file、run_command、web_fetch、memory_search、memory_save、dispatch_subagents、task_complete",
          "所有工具的路径参数都受工作目录安全边界约束",
          "修改类工具（write/edit/run_command/web_fetch/memory）需要用户审批",
        ],
      },
    ],
    related: ["approvals", "plan-build", "workspace-inspector"],
  },

  {
    id: "models",
    group: "入门",
    title: "模型配置",
    summary: "了解内置模型预设、自定义端点、上下文窗口选项和模型切换。",
    icon: "models",
    readTime: "10 分钟",
    updated: "2026-08-19",
    keywords: ["模型", "预设", "GLM", "DeepSeek", "Kimi", "MiniMax", "自定义", "上下文窗口", "256K", "512K", "1M"],
    sections: [
      {
        id: "presets",
        title: "内置模型预设",
        body: [
          "Stellara Work v0.9.2 内置七个中文模型预设和一个自定义槽位。预设会自动填充 Base URL 和模型名称，你只需填写 API Key 即可使用。",
          "预设只是配置模板，不包含任何密钥。服务商可能调整模型可用性，最终以你的账号权限和连接测试结果为准。",
        ],
        table: {
          headers: ["预设名称", "服务商", "Base URL", "模型 ID"],
          rows: [
            ["DeepSeek-V4-Pro", "DeepSeek", "https://api.deepseek.com", "deepseek-v4-pro"],
            ["DeepSeek-V4-Flash", "DeepSeek", "https://api.deepseek.com", "deepseek-v4-flash"],
            ["Qwen3.8-Max", "阿里云 DashScope", "https://dashscope.aliyuncs.com/compatible-mode/v1", "qwen3.8-max"],
            ["GLM-5.3", "智谱 BigModel", "https://open.bigmodel.cn/api/v1", "glm-5.3"],
            ["GLM-5.2", "智谱 BigModel", "https://open.bigmodel.cn/api/v1", "glm-5.2"],
            ["Kimi-K3", "月之暗面 Moonshot", "https://api.moonshot.cn", "kimi-k3"],
            ["MiniMax-M3", "MiniMax", "https://api.minimax.io/v1", "MiniMax-M3"],
            ["自定义模型", "任意", "手动填写", "手动填写"],
          ],
        },
      },
      {
        id: "custom-endpoint",
        title: "自定义 OpenAI 兼容端点",
        body: [
          "选择「自定义模型」可以接入任何兼容 OpenAI Chat Completions API 的端点。这包括本地部署的模型服务（如 Ollama、vLLM）和企业内部网关。",
          "自定义端点需要手动填写 Base URL 和模型名称。Base URL 是否包含 `/v1` 路径由服务商决定，请参照服务商文档。端点必须支持流式输出（SSE），否则无法正常显示生成结果。",
        ],
        code: {
          label: "自定义配置示例",
          content: "显示名称：团队网关\nBase URL：https://gateway.example.com/v1\n模型名称：team-coder\nAPI Key ：<由服务商提供>\n上下文窗口：256K",
        },
        note: {
          tone: "info",
          title: "本地模型",
          body: "如果使用 Ollama 等本地服务，Base URL 通常为 http://localhost:11434/v1。请确认本地服务已启动且模型已下载。",
        },
      },
      {
        id: "context-window",
        title: "上下文窗口选项",
        body: [
          "每个模型配置可选择上下文窗口大小。上下文窗口决定了单次请求可以携带多少历史消息和文件内容。窗口越大，Agent 能参考的信息越多，但成本和延迟也会增加。",
          "这里的值用于应用侧预算管理，不会提升服务商实际支持的模型上限。应选择不超过模型真实能力的值。",
        ],
        table: {
          headers: ["选项", "Token 数", "适合场景"],
          rows: [
            ["256K（默认）", "256,000", "一般代码库、常规任务，最稳妥的选择"],
            ["512K", "512,000", "较长会话、需要更多文件上下文时"],
            ["1M", "1,000,000", "超长上下文模型和大型调查任务"],
          ],
        },
        bullets: [
          { title: "默认值", detail: "新建模型配置时默认选择 256K。" },
          { title: "压缩阈值", detail: "当上下文使用量达到窗口大小的 90% 时，应用会自动压缩较早的历史消息为摘要。" },
          { title: "注意事项", detail: "选择超过模型实际能力的窗口值会导致请求失败（413 错误）。" },
        ],
      },
      {
        id: "model-switching",
        title: "模型切换",
        body: [
          "你可以在会话中随时切换已配置的模型。切换后立即生效，新模型从切换后的消息开始参与对话，不会重新发送之前的上下文。",
          "活跃模型决定新会话使用的默认配置。可以通过设置面板、聊天区顶部或命令面板（Ctrl+K）切换模型。",
        ],
        steps: [
          { title: "通过设置切换", detail: "打开设置 → 模型，在模型卡片中点击「设为活跃」。" },
          { title: "通过命令面板切换", detail: "按 Ctrl+K，搜索「切换模型」，选择目标模型。" },
          { title: "在聊天区切换", detail: "点击输入框上方的模型名称，从下拉列表中选择。" },
        ],
        note: {
          tone: "warning",
          title: "历史会话与模型",
          body: "如果历史会话引用的模型已被删除，继续发送前需要重新选择一个可用模型。删除模型不会删除历史会话。",
        },
      },
    ],
    related: ["install-setup", "first-task"],
  },
  {
    id: "context-window",
    group: "扩展能力",
    title: "上下文窗口与压缩",
    summary: "选择 256K、512K 或 1M 上下文窗口，理解 90% 压缩阈值和上下文使用追踪机制。",
    icon: "context",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["上下文窗口", "256K", "512K", "1M", "压缩", "90%", "阈值", "token", "摘要", "tiktoken", "长会话"],
    sections: [
      {
        id: "window-options",
        title: "窗口选项：256K、512K 或 1M",
        body: [
          "每个模型配置可选择 256K、512K 或 1M token 的上下文窗口，默认值为 256K。这里的值用于应用侧预算管理，不会提升服务商实际支持的模型上限；应选择不超过模型真实能力的值。",
          "上下文窗口大小直接影响每次请求可以携带多少历史消息和文件内容。窗口越大，Agent 能参考的信息越多，但成本和延迟也会相应增加。选择超过模型实际能力的窗口值会导致请求失败（413 错误）。",
        ],
        table: {
          headers: ["选项", "Token 数", "适合场景"],
          rows: [
            ["256K（默认）", "256,000", "一般代码库、常规任务，最稳妥的选择"],
            ["512K", "512,000", "较长会话、需要更多文件上下文时"],
            ["1M", "1,000,000", "超长上下文模型和大型调查任务"],
          ],
        },
        bullets: [
          { title: "默认值", detail: "新建模型配置时默认选择 256K。" },
          { title: "自定义值", detail: "代码中预设了三个档位，不在列表中的值也算合法但没有预设档位。" },
          { title: "注意事项", detail: "选择超过模型实际能力的窗口值会导致请求失败（413 错误）。" },
        ],
        note: {
          tone: "info",
          title: "窗口值来源",
          body: "上下文窗口选项定义在 shared/context-window.ts 中，主进程和渲染进程共享同一份配置。",
        },
      },
      {
        id: "compression-threshold",
        title: "90% 压缩阈值",
        body: [
          "默认压缩阈值等于所选上下文窗口大小的 90%。例如，256K 窗口的压缩阈值为 230,400 token（256,000 × 0.9），512K 窗口为 460,800 token，1M 窗口为 900,000 token。",
          "当消息累积的 token 数超过阈值时，应用会自动触发压缩。压缩将最早一批消息交给 LLM 生成摘要，保留 system 消息和最近 12 轮对话（user-assistant 对算 1 轮）。",
        ],
        table: {
          headers: ["窗口大小", "压缩阈值（90%）", "保留轮次"],
          rows: [
            ["256K", "230,400 token", "12 轮"],
            ["512K", "460,800 token", "12 轮"],
            ["1M", "900,000 token", "12 轮"],
          ],
        },
        steps: [
          { title: "Token 估算", detail: "使用 tiktoken（cl100k_base 编码）估算消息总 token 数。tiktoken 加载失败时回退到字符数/4 的粗估方式。" },
          { title: "阈值判定", detail: "每次 LLM 调用前检查当前 token 数是否超过阈值。未超过则跳过压缩。" },
          { title: "确定压缩范围", detail: "从消息数组尾部向前数 12 轮 user-assistant 对，确定保留边界。tool 消息绑到所属 assistant 轮次一起保留。" },
          { title: "生成摘要", detail: "将压缩范围内的消息格式化为纯文本，交给 LLM 生成 800 字以内的中文摘要。" },
          { title: "替换消息", detail: "用摘要消息替换被压缩的消息。新数组 = system 消息 + 摘要消息 + 最近 12 轮对话。" },
        ],
        note: {
          tone: "warning",
          title: "压缩失败兜底",
          body: "如果摘要生成失败（网络错误、模型返回空内容等），应用会跳过本次压缩，保留原始消息，下一轮再判定。不会破坏 agent 流程。",
        },
      },
      {
        id: "context-tracking",
        title: "上下文使用追踪",
        body: [
          "工作区检查器的上下文区实时追踪当前会话的 Token 消耗。顶部显示上下文使用率（promptTokens / contextWindow），超过 80% 时进度条变为警告色。",
          "Token 估算使用 tiktoken 库的 cl100k_base 编码，对中英文都有准确的计算。每条消息额外计算 4 个 token 的 metadata 开销（OpenAI 标准），对话起始额外 2 个 token。",
        ],
        table: {
          headers: ["指标", "说明"],
          rows: [
            ["上下文使用率", "promptTokens / contextWindow，超过 80% 显示警告色"],
            ["输入 / 输出 Token", "以 K 为单位显示（如 45.2K），provider 未上报时标注「估算」"],
            ["工具调用分布", "按调用次数降序排列，每行显示工具中文名、条形图和次数"],
            ["压缩计数", "已压缩的消息条数，长会话中自动触发时显示"],
          ],
        },
        bullets: [
          { title: "估算精度", detail: "tiktoken 的 cl100k_base 编码对 GPT-4、DeepSeek、GLM 等模型的 token 计算都兼容。" },
          { title: "回退机制", detail: "tiktoken 加载失败时回退到字符数/4 的粗估方式，控制台会输出警告信息。" },
          { title: "实时性", detail: "每次 LLM 调用后更新 token 统计，工作区检查器实时反映最新状态。" },
        ],
        code: {
          label: "压缩配置生成逻辑",
          content: "// 按模型 contextWindow 生成压缩配置\nfunction compressionForContextWindow(contextWindow) {\n  if (!contextWindow || contextWindow <= 0) return {};\n  return { thresholdTokens: Math.floor(contextWindow * 0.9) };\n}\n\n// 示例：256K 窗口 → thresholdTokens = 230400\n// 示例：512K 窗口 → thresholdTokens = 460800",
        },
      },
      {
        id: "compression-details",
        title: "压缩算法细节",
        body: [
          "压缩过程保留 system 消息（始终在最前）和最近 12 轮对话。中间的早期消息被替换为一条摘要消息，格式为 `[conversation summary — N messages compressed]` 加上摘要正文。",
          "摘要由 LLM 生成，使用专门的系统提示词引导。提示词要求保留：用户的关键需求和约束、已完成的工作、重要的失败与排除过程、助手当前进展与下一步计划。摘要长度控制在 800 字以内，使用第三人称叙述。",
        ],
        checklist: [
          "压缩是自动的，不需要手动触发",
          "压缩后的历史消息被替换为摘要版本，无法在界面上看到原始完整历史",
          "压缩保留任务要点而非逐字完整历史",
          "对必须精确保留的错误文本或验收条件，建议放在当前消息中重新明确",
          "压缩只保留最近 12 轮对话，更早的消息会被摘要化",
        ],
      },
      {
        id: "token-optimization",
        title: "Token 消耗优化",
        body: [
          "一个中文字大约占用 1-2 个 token，一个英文单词大约占用 1 个 token。代码中的标识符、注释和字符串都会消耗 token。工具调用的结果（如文件内容、命令输出）也会占用上下文窗口。",
        ],
        bullets: [
          { title: "优化读取范围", detail: "用 search_content 先定位，再用 read_file 的 offset/limit 精确读取需要的行范围。" },
          { title: "分段处理", detail: "大任务拆分为多个子任务，每个子任务在新会话中执行，避免单个会话上下文膨胀。" },
          { title: "清理输出", detail: "命令输出过长时，要求 Agent 只关注关键行或使用 grep 过滤。" },
          { title: "避免大文件", detail: "避免一次读取大量生成文件、锁文件或日志文件。" },
        ],
        note: {
          tone: "success",
          title: "自动管理",
          body: "上下文压缩是全自动的。你只需要选择合适的窗口大小，应用会在接近阈值时自动压缩历史消息，确保对话可以持续进行。",
        },
      },
    ],
    related: ["models", "workspace-inspector", "troubleshooting"],
  },
  {
    id: "app-settings",
    group: "设置与数据",
    title: "应用内设置面板",
    summary: "了解设置面板的 5 个页签：模型、会话、应用、技能与 MCP、快捷键，掌握各项配置的操作方式。",
    icon: "settings",
    readTime: "14 分钟",
    updated: "2026-08-19",
    keywords: ["设置", "模型", "会话", "应用", "快捷键", "Skills", "MCP", "主题", "诊断", "清空数据"],
    sections: [
      {
        id: "settings-tabs",
        title: "设置面板概览",
        body: [
          "设置面板以模态对话框形式打开，左侧导航栏包含 5 个页签：模型、会话、应用、技能与 MCP、快捷键。每个页签的修改都会立即保存，不需要点击额外的确认按钮。",
          "部分设置（如主题）会实时生效，另一些（如工作目录）会在下次操作时生效。设置面板支持键盘操作：使用 Tab 键在导航项之间切换，Enter 或 Space 激活选中的页签。",
        ],
        table: {
          headers: ["页签", "功能", "主要内容"],
          rows: [
            ["模型", "管理 API 提供商与模型连接", "添加模型、切换活跃模型、编辑 API Key、删除模型"],
            ["会话", "管理本地会话记录", "查看会话列表、删除单个会话、清空所有会话"],
            ["应用", "界面偏好与数据管理", "主题、工作区模式、数据目录、日志、诊断信息、危险区"],
            ["技能与 MCP", "项目技能与 MCP 服务器", "技能管理（新建/编辑/删除/启用）、MCP 服务器配置"],
            ["快捷键", "自定义键盘快捷键", "录制组合键、重置全部为默认值"],
          ],
        },
        note: {
          tone: "info",
          title: "打开设置",
          body: "使用 Ctrl+K 打开命令面板，搜索「打开设置」即可进入。设置面板也支持从侧栏导航的「设置」入口打开。",
        },
      },
      {
        id: "models-panel",
        title: "模型设置",
        body: [
          "模型页签用于管理所有已配置的 API 提供商和模型连接。顶部显示当前活跃模型的信息（名称、Base URL、上下文窗口大小、Key 配置状态），下方是完整的模型列表。",
          "每个模型配置独立保存 API Key。你可以为同一个服务商创建多个配置（使用不同的 Key 或模型），并在会话中根据需要切换。删除模型时，对应的 API Key 也会从本地密钥存储中移除。",
        ],
        steps: [
          { title: "添加模型", detail: "点击右上角「添加模型」按钮，从预设（GLM-5.2、DeepSeek-v4-Pro、Kimi-K3、MiniMax-M3）或自定义模型中选择。填写 API Key 后点击「保存」，应用会自动测试连接。" },
          { title: "切换活跃模型", detail: "在活跃模型区域点击「切换」，从列表中选择目标模型。切换后立即生效，新模型从切换后的消息开始参与对话。" },
          { title: "编辑 API Key", detail: "在模型列表中点击编辑图标，输入新的 API Key 后保存。Key 会加密存储。" },
          { title: "删除模型", detail: "在模型列表或危险区点击删除按钮，确认后模型配置和对应的 Key 会被永久移除。" },
        ],
        table: {
          headers: ["操作", "说明"],
          rows: [
            ["添加模型", "选择预设或自定义，填写 API Key，自动测试连接"],
            ["设为活跃", "将选中的模型设为当前活跃模型，新会话将使用此配置"],
            ["编辑 Key", "行内编辑 API Key，加密存储"],
            ["删除", "移除模型配置和对应的 Key，不可恢复"],
          ],
        },
        note: {
          tone: "warning",
          title: "连接测试",
          body: "添加模型时会自动测试连接。测试不通过时配置不会写入，请检查 API Key、Base URL 和网络连接。",
        },
      },
      {
        id: "sessions-panel",
        title: "会话设置",
        body: [
          "会话页签显示所有本地会话的列表，每条记录包含标题、更新时间（相对时间格式）和所属项目。可以在这里快速删除不需要的会话，或使用危险区的「清空所有会话」批量清除。",
          "会话列表按更新时间降序排列。更新时间使用相对时间格式显示：刚刚、N 分钟前、N 小时前、昨天、N 天前、或具体日期。",
        ],
        bullets: [
          { title: "查看会话", detail: "列表显示所有会话的标题、更新时间和所属项目。" },
          { title: "删除会话", detail: "点击会话右侧的删除图标，确认后永久删除该会话及其所有消息。" },
          { title: "清空所有会话", detail: "危险区操作，删除全部会话与消息，不可恢复。执行前会弹出确认对话框。" },
        ],
        note: {
          tone: "warning",
          title: "删除不可恢复",
          body: "删除会话会同时删除其所有消息。如需保留，请先使用会话导出功能备份。",
        },
      },
      {
        id: "app-panel",
        title: "应用设置",
        body: [
          "应用页签管理界面偏好、数据与日志、诊断信息和危险区操作。界面偏好包括主题选择和工作区模式；数据与日志区域提供数据目录和日志文件的快捷打开按钮。",
          "主题支持三种模式：浅色、深色和跟随系统。选择「跟随系统」时，应用会自动响应系统深色模式的变化。工作区模式决定主界面右侧面板的呈现方式：侧栏模式或标签页模式。",
        ],
        table: {
          headers: ["设置项", "选项", "说明"],
          rows: [
            ["主题", "浅色 / 深色 / 跟随系统", "控制应用的深浅色外观"],
            ["工作区模式", "侧栏 / 标签页", "主界面右侧面板的呈现方式"],
            ["数据目录", "打开按钮", "在文件管理器中打开数据目录"],
            ["日志", "查看按钮", "打开主进程日志文件"],
            ["诊断信息", "复制按钮", "复制版本、系统和数据库状态到剪贴板"],
          ],
        },
        steps: [
          { title: "切换主题", detail: "在「界面」区域点击主题卡片（浅色/深色/跟随系统），立即生效。" },
          { title: "切换工作区模式", detail: "在「界面」区域选择「侧栏」或「标签页」，立即生效。" },
          { title: "打开数据目录", detail: "点击「数据与日志」区域的「打开」按钮，在文件管理器中打开数据目录。" },
          { title: "查看日志", detail: "点击「查看」按钮打开主进程日志文件，用于排查问题。" },
          { title: "复制诊断信息", detail: "点击「复制」按钮将诊断信息复制到剪贴板，用于反馈问题。" },
        ],
      },
      {
        id: "diagnostics",
        title: "诊断信息",
        body: [
          "诊断信息包含应用版本、平台、架构、Node/Electron 版本、模型数量、会话数量、活跃模型 ID、是否配置工作目录，以及日志和数据路径。诊断信息不包含 API Key 或会话正文。",
          "诊断信息是纯文本格式（Markdown），可以直接粘贴到工单或反馈表中。提交前建议人工浏览一次，确认路径等环境信息是否适合公开。",
        ],
        code: {
          label: "诊断信息示例",
          content: "# Stellara Work 诊断信息\n采集时间：2026-08-28T10:30:00.000Z\n\n## 版本\n- Stellara Work: v0.9.2\n- Electron: 31.0.0\n- Chromium: 126.0.6478.126\n- Node.js: 20.14.0\n- 平台: darwin arm64\n\n## 数据\n- 数据目录: /Users/xxx/Library/Application Support/Stellara Work\n- 日志文件: /Users/xxx/Library/Application Support/Stellara Work/logs/main.log\n- DB 大小: 256.0 KB\n- 会话数: 12 / 消息数: 348\n- 已配 model: 3（已配 key: deepseek-v4-pro, glm-5.2）\n- 活跃 model: deepseek-v4-pro",
        },
        note: {
          tone: "info",
          title: "提交问题前",
          body: "复制诊断信息后仍建议人工浏览一次，确认模型 ID、路径等环境信息是否适合公开。",
        },
      },
      {
        id: "danger-zone",
        title: "危险区：清空所有数据",
        body: [
          "应用页签底部的危险区提供「清空所有数据」操作。清空操作要求准确输入 `DELETE` 五个字母确认。执行后会删除数据目录中的所有文件（config.json、.env、stellara.db 等），并重新初始化空数据库。",
          "清空操作是不可逆的。模型配置、API Key、所有会话和消息、应用偏好都会丢失。完成后应重启应用。如果 Windows 报文件占用错误，请关闭应用后再处理。",
        ],
        checklist: [
          "已导出所有重要会话",
          "已备份整个数据目录",
          "确认输入了 DELETE（五个大写字母）",
          "理解此操作不可恢复",
        ],
        note: {
          tone: "warning",
          title: "不可撤销",
          body: "应用内没有恢复入口。执行前先导出重要会话，并在需要时备份整个数据目录。Windows 上如果报文件占用，请关闭应用后再处理。",
        },
      },
      {
        id: "skills-mcp-panel",
        title: "技能与 MCP 设置",
        body: [
          "技能与 MCP 页签将 Skills 管理和 MCP 服务器配置合并在同一个面板中。上半部分是技能管理区域，下半部分是 MCP 服务器管理区域。",
          "技能管理需要先配置模型并选择工作目录。技能文件存储在工作目录的 `skills/` 子目录下。MCP 服务器配置则独立于工作目录，存储在应用配置文件中。",
        ],
        bullets: [
          { title: "技能搜索", detail: "按名称或描述搜索已加载的技能。" },
          { title: "新建技能", detail: "点击「新建技能」按钮，填写名称、描述和内容（prompt），保存为 Markdown 文件。" },
          { title: "编辑技能", detail: "点击技能卡片右侧的编辑图标，修改名称、描述或内容。" },
          { title: "启用/停用", detail: "使用开关控制技能是否启用。停用的技能不会注入到系统提示词中。" },
          { title: "删除技能", detail: "点击删除图标，内联确认后永久删除技能文件。" },
          { title: "复制模板", detail: "点击「复制模板」按钮将 Markdown 技能模板复制到剪贴板。" },
          { title: "打开目录", detail: "点击「打开目录」按钮在文件管理器中打开 skills 目录。" },
        ],
        note: {
          tone: "info",
          title: "技能格式",
          body: "技能支持 Markdown 格式（推荐）和 JSON 格式（旧格式，仅可删除）。Markdown 文件使用 YAML frontmatter 定义 name 和 description，正文作为 prompt。",
        },
      },
      {
        id: "shortcuts-panel",
        title: "快捷键设置",
        body: [
          "快捷键页签按三组展示所有可自定义的操作：导航（切换侧栏、切换工作区、打开命令面板）、操作（切换 Plan 模式、发送消息、拒绝审批）、标签页（切换到 Tab 1-9、关闭当前 Tab、恢复关闭的 Tab）。",
          "点击任意操作行进入录制模式，界面显示「按任意键…」，按下新的组合键后自动保存。录制过程中按 Esc 取消。面板头部提供「重置全部」按钮，可恢复所有快捷键为默认值。",
        ],
        table: {
          headers: ["分组", "操作", "默认快捷键"],
          rows: [
            ["导航", "切换左侧会话栏", "Ctrl+B"],
            ["导航", "切换右侧工作区", "Ctrl+Shift+W"],
            ["导航", "打开命令面板", "Ctrl+K"],
            ["操作", "切换 Plan 模式", "Ctrl+Shift+P"],
            ["操作", "发送消息", "Ctrl+Enter"],
            ["操作", "拒绝当前审批", "Escape"],
            ["标签页", "切换到 Tab 1-9", "Ctrl+1 到 Ctrl+9"],
            ["标签页", "关闭当前 Tab", "Ctrl+W"],
            ["标签页", "恢复关闭的 Tab", "Ctrl+Shift+T"],
          ],
        },
        steps: [
          { title: "选择操作", detail: "找到要自定义的操作行。" },
          { title: "开始录制", detail: "点击该行，界面显示「按任意键…」状态。" },
          { title: "按下组合键", detail: "按下新的组合键，系统自动序列化并保存。" },
          { title: "测试验证", detail: "关闭设置后验证新按键在对应上下文中生效。" },
        ],
        note: {
          tone: "info",
          title: "平台差异",
          body: "快捷键定义中统一使用 Ctrl 前缀。macOS 上通过 metaKey 兼容，实际按键为 Cmd+B、Cmd+K 等。Windows 上直接使用 Ctrl。",
        },
      },
    ],
    related: ["projects-sessions", "local-data", "shortcuts"],
  },
  {
    id: "skills",
    group: "扩展能力",
    title: "Skills 自定义工作流",
    summary: "通过工作目录下的 JSON 或 Markdown 文件为 Agent 添加可复用的自定义指令和工作流模板。",
    icon: "skills",
    readTime: "14 分钟",
    updated: "2026-08-19",
    keywords: ["Skills", "skill", "JSON", "Markdown", "prompt", "斜杠命令", "自动补全", "工作流", "模板", "skills 目录"],
    sections: [
      {
        id: "skills-directory-format",
        title: "Skills 目录与格式",
        body: [
          "Skills 从当前工作目录的 `skills/` 子目录自动加载。系统支持两种文件格式：JSON 文件（`<workDir>/skills/*.json`）和 Markdown 文件（`<workDir>/skills/*.md`）。文件读取被严格限制在已配置工作目录的 skills 子目录内。",
          "Skills 目录支持子目录结构。应用会扫描 `skills/` 下的所有 `.json` 文件和所有子目录中的 `.md` 文件。子目录中的 Markdown 文件使用文件名作为 fallback name（如果 frontmatter 中未指定 name）。",
        ],
        table: {
          headers: ["格式", "文件位置", "必需字段"],
          rows: [
            ["JSON", "<workDir>/skills/*.json", "name、description、prompt（均为非空字符串）"],
            ["Markdown", "<workDir>/skills/*.md 或子目录/*.md", "frontmatter 中的 name、description；正文作为 prompt"],
          ],
        },
        code: [
          {
            label: "JSON 格式示例：skills/code-review.json",
            content: "{\n  \"name\": \"code-review\",\n  \"description\": \"按项目规范审查当前改动\",\n  \"prompt\": \"先读取贡献指南和 git diff，按严重程度列出可执行问题；不要直接修改文件。\"\n}",
          },
          {
            label: "Markdown 格式示例：skills/deploy-check.md",
            content: "---\nname: deploy-check\ndescription: 部署前的安全检查清单\n---\n\n1. 检查所有环境变量是否已配置\n2. 运行完整测试套件\n3. 检查是否有未提交的敏感信息\n4. 确认构建产物可以正常生成\n5. 输出检查结果报告",
          },
        ],
        note: {
          tone: "info",
          title: "格式优先级",
          body: "JSON 和 Markdown 文件都会被加载。JSON 文件使用文件名作为 file 标识；Markdown 文件使用相对于 skills 目录的路径（如子目录中的文件会显示为 `子目录/文件名.md`）。",
        },
      },
      {
        id: "write-skill",
        title: "编写 Skill",
        body: [
          "Skill prompt 应描述流程和边界，不要只写一句角色设定。把输入来源、执行顺序、禁止事项和输出格式写清楚，能让同一个 Skill 在不同会话中得到更一致的结果。",
          "好的 Skill prompt 应该像一份简短的操作手册：第一步做什么、第二步做什么、结果如何呈现、哪些情况需要中止。Markdown 格式支持 frontmatter 中的 `enabled: false` 字段来禁用某个 Skill 而不删除文件。",
        ],
        table: {
          headers: ["字段", "类型", "说明"],
          rows: [
            ["name", "string（必填）", "Skill 的唯一标识，用于斜杠命令调用。建议使用简短的英文名称"],
            ["description", "string（必填）", "说明 Skill 的用途和使用场景，会显示在自动补全列表中"],
            ["prompt", "string（必填）", "Skill 的核心指令内容，描述流程、边界和输出格式"],
            ["enabled", "boolean（可选）", "Markdown 格式支持。设为 false 可禁用 Skill，默认 true"],
          ],
        },
        checklist: [
          "name 简短、唯一，适合在斜杠命令中输入",
          "description 说明何时使用，而不是重复名称",
          "prompt 写出步骤、限制和交付格式",
          "不要把 API Key 或其他密钥写进文件",
          "提交到 Git 前确认 Skill 不含个人路径或内部信息",
          "prompt 中明确说明不允许的操作（如不修改配置文件）",
          "为常见失败场景提供处理建议",
        ],
        bullets: [
          { title: "JSON 格式", detail: "三个必填字段（name、description、prompt）均为非空字符串。JSON 不支持注释，格式错误会导致加载失败。" },
          { title: "Markdown 格式", detail: "使用 YAML frontmatter 定义 name 和 description，正文作为 prompt。支持 enabled 字段控制启用状态。" },
          { title: "文件命名", detail: "文件名不影响 Skill 识别，但建议使用与 name 一致的文件名以便管理。" },
        ],
      },
      {
        id: "load-invoke",
        title: "加载与调用",
        body: [
          "打开设置 → Skills 可查看实际目录路径、已加载数量、加载错误和每个 Skill 的 prompt 内容。新增或修改文件后点击「重新加载」让应用从磁盘重新读取全部文件；也可点击「打开目录」在文件管理器中进入 skills 目录。",
          "Skill 被加载后，会在输入框中通过斜杠命令自动补全。输入 `/` 后跟 Skill 名称的前几个字符，会出现匹配的补全建议。Skill 也会被注入到系统提示词中，Agent 可以感知可用的 Skills 列表。",
        ],
        steps: [
          { title: "创建文件", detail: "在 `<workDir>/skills/` 中保存一个合法 JSON 或 Markdown 文件。" },
          { title: "重新加载", detail: "在设置 → Skills 页面点击「重新加载」，让应用从磁盘重新读取全部文件。" },
          { title: "检查内容", detail: "展开卡片确认 name、description 和 prompt 已按预期解析。检查是否有加载错误提示。" },
          { title: "在聊天中调用", detail: "在输入框中输入 `/skill-name`，从自动补全列表中选择即可调用。" },
        ],
        bullets: [
          { title: "自动注入", detail: "加载的 Skills 列表会格式化后注入系统提示词，格式为 `可用技能（skills/ 目录）：- name: description`。" },
          { title: "斜杠命令", detail: "输入 `/` 触发自动补全，显示所有已加载 Skill 的名称和描述。" },
          { title: "错误处理", detail: "无效文件不再静默跳过，而是在 Skills 页面标注「格式错误」并显示具体原因（缺少 name / 缺少 description / 缺少 prompt / 格式解析失败 / 读取失败）。" },
        ],
        note: {
          tone: "success",
          title: "子目录支持",
          body: "Skills 目录支持子目录结构。应用会递归扫描 skills/ 下的所有子目录，加载其中的 .md 文件。子目录中的文件使用 `子目录/文件名.md` 作为标识。",
        },
      },
      {
        id: "skill-errors",
        title: "Skill 加载错误排查",
        body: [
          "当 Skill 没有出现在列表中时，先确认当前模型配置已经选择工作目录，再检查文件位置和格式。v0.9.2 会返回详细的错误信息，帮助定位问题。",
        ],
        table: {
          headers: ["错误原因", "说明", "解决方式"],
          rows: [
            ["缺少 name", "JSON 中 name 字段为空或非字符串", "添加有效的 name 字段"],
            ["缺少 description", "JSON 中 description 字段为空或非字符串", "添加有效的 description 字段"],
            ["缺少 prompt", "JSON 中 prompt 字段为空或非字符串；Markdown 正文为空", "添加有效的 prompt 内容"],
            ["格式解析失败", "JSON 语法错误（注释、尾逗号等）；Markdown 缺少 frontmatter", "修正文件格式"],
            ["读取失败", "文件权限问题或编码错误", "检查文件权限和 UTF-8 编码"],
          ],
        },
        checklist: [
          "工作目录已正确配置",
          "文件位于 `<workDir>/skills/` 目录下（含子目录）",
          "JSON 文件扩展名为 `.json`，Markdown 文件扩展名为 `.md`",
          "JSON 格式合法（无注释、无尾逗号）",
          "Markdown 文件包含 `---` 包裹的 frontmatter",
          "name、description、prompt 均为非空字符串",
        ],
      },
      {
        id: "skill-examples",
        title: "实用 Skill 示例",
        body: [
          "以下是几个常见的 Skill 配置示例，你可以根据项目需求进行修改。",
        ],
        table: {
          headers: ["Skill 名称", "用途", "prompt 要点"],
          rows: [
            ["code-review", "代码审查", "读取 git diff，按严重程度列出问题，不直接修改文件"],
            ["test-writer", "生成测试", "读取目标文件，生成匹配框架的单元测试"],
            ["doc-generator", "文档生成", "读取源码注释，生成 Markdown API 文档"],
            ["refactor-plan", "重构计划", "分析依赖关系，列出安全的重构步骤和验证方法"],
            ["deploy-check", "部署检查", "按清单逐项检查部署前置条件"],
          ],
        },
        code: {
          label: "自动化 Skill 示例",
          content: "{\n  \"name\": \"refactor-check\",\n  \"description\": \"重构前分析 + 重构后验证的完整流程\",\n  \"prompt\": \"1. Plan 模式：分析目标代码的依赖关系和影响范围。\\n2. 列出安全的重构步骤和每步的验证方法。\\n3. Build 模式：按步骤执行重构。\\n4. 每步完成后运行相关测试。\\n5. 输出最终的变更摘要和测试结果。\"\n}",
        },
      },
    ],
    related: ["app-settings", "shortcuts", "mcp"],
  },
  {
    id: "mcp",
    group: "扩展能力",
    title: "MCP 服务器集成",
    summary: "通过 Model Context Protocol 连接外部工具服务器，扩展 Agent 的能力边界。",
    icon: "command",
    readTime: "13 分钟",
    updated: "2026-08-19",
    keywords: ["MCP", "Model Context Protocol", "服务器", "工具", "stdio", "http", "集成", "扩展", "配置"],
    sections: [
      {
        id: "mcp-concept",
        title: "MCP 概念",
        body: [
          "Model Context Protocol（MCP）是一个开放协议，允许 AI 应用连接外部工具和数据源。通过 MCP，Agent 可以调用第三方服务器提供的工具，扩展自身的能力边界——从数据库查询、API 调用到自定义业务逻辑，都可以通过 MCP 服务器接入。",
          "Stellara Work 作为 MCP 客户端，支持两种传输方式：stdio（标准输入/输出）和 HTTP（Streamable HTTP）。每个 MCP 服务器可以提供多个工具，这些工具会被自动注册到 Agent 的工具列表中，与内置工具一起参与任务执行。",
        ],
        bullets: [
          { title: "客户端-服务器模型", detail: "Stellara Work 作为客户端连接 MCP 服务器。服务器可以是本地进程（stdio）或远程服务（HTTP）。" },
          { title: "工具自动发现", detail: "连接后自动获取服务器提供的工具列表（名称、描述、参数 schema），无需手动配置。" },
          { title: "统一调用接口", detail: "MCP 工具被转换为 OpenAI function calling 格式，与内置工具使用相同的调用和审批机制。" },
          { title: "连接超时", detail: "连接和工具列表获取均有 10 秒超时保护，避免阻塞应用启动。" },
        ],
        note: {
          tone: "info",
          title: "MCP SDK",
          body: "Stellara Work 使用官方 @modelcontextprotocol/sdk 库实现客户端。支持 stdio 和 Streamable HTTP 两种传输方式。",
        },
      },
      {
        id: "configure-mcp",
        title: "配置 MCP 服务器",
        body: [
          "MCP 服务器配置存储在应用配置文件（config.json）的 `mcpServers` 数组中。每个服务器需要唯一的 ID、显示名称、传输方式和连接参数。可以通过设置界面或直接编辑配置文件来管理。",
        ],
        table: {
          headers: ["字段", "类型", "说明"],
          rows: [
            ["id", "string（必填）", "服务器唯一标识，用于工具命名和缓存管理"],
            ["name", "string（必填）", "显示名称，在界面和工具列表中使用"],
            ["transport", "\"stdio\" | \"http\"（必填）", "传输方式：stdio 用于本地进程，http 用于远程服务"],
            ["command", "string（stdio 必填）", "启动命令，如 \"node\"、\"python\" 等"],
            ["args", "string[]（stdio 可选）", "命令参数数组"],
            ["url", "string（http 必填）", "服务器 URL，需以 http:// 或 https:// 开头"],
            ["headers", "object（http 可选）", "HTTP 请求头，用于认证等"],
            ["enabled", "boolean（可选）", "是否启用，禁用后工具不会注册到 Agent"],
            ["tools", "string[]（可选）", "工具白名单，为空则启用服务器所有工具"],
          ],
        },
        code: [
          {
            label: "stdio 服务器配置示例",
            content: "{\n  \"id\": \"filesystem\",\n  \"name\": \"文件系统服务器\",\n  \"transport\": \"stdio\",\n  \"command\": \"node\",\n  \"args\": [\"/path/to/mcp-filesystem/dist/index.js\", \"/allowed/dir\"],\n  \"enabled\": true\n}",
          },
          {
            label: "HTTP 服务器配置示例",
            content: "{\n  \"id\": \"api-tools\",\n  \"name\": \"API 工具服务器\",\n  \"transport\": \"http\",\n  \"url\": \"https://mcp.example.com/tools\",\n  \"headers\": { \"Authorization\": \"Bearer xxx\" },\n  \"enabled\": true,\n  \"tools\": [\"query_db\", \"send_notification\"]\n}",
          },
        ],
        steps: [
          { title: "添加服务器", detail: "在设置中点击「添加 MCP 服务器」，填写 ID、名称和连接参数。或通过编辑 config.json 的 mcpServers 数组添加。" },
          { title: "测试连接", detail: "点击「测试连接」验证服务器可达。测试会尝试连接并获取工具列表，返回工具数量或错误信息。" },
          { title: "配置工具过滤", detail: "如果只需要服务器提供的部分工具，在 tools 数组中指定工具名称白名单。为空则启用所有工具。" },
          { title: "启用/禁用", detail: "通过 enabled 字段控制服务器是否参与工具注册。禁用的服务器不会建立连接。" },
        ],
        note: {
          tone: "warning",
          title: "安全提示",
          body: "MCP 服务器提供的工具与内置工具共享审批机制。但外部服务器的行为不受 Stellara Work 控制，请确保只连接可信的 MCP 服务器。stdio 服务器会在本地执行命令，请仔细检查 command 和 args 参数。",
        },
      },
      {
        id: "mcp-tools",
        title: "MCP 工具使用",
        body: [
          "已启用的 MCP 服务器提供的工具会自动注册到 Agent 的工具列表中。工具名称使用 `mcp__<serverId>__<toolName>` 格式命名，确保不同服务器的工具不会冲突。例如，filesystem 服务器的 read_file 工具会被注册为 `mcp__filesystem__read_file`。",
          "MCP 工具与内置工具使用相同的调用和审批机制。当 Agent 调用 MCP 工具时，审批顶部栏会显示工具名称和参数，你需要确认后才会执行。工具执行结果会显示在聊天区中。",
        ],
        table: {
          headers: ["特性", "说明"],
          rows: [
            ["工具命名", "mcp__<serverId>__<toolName> 格式，双下划线分隔"],
            ["参数传递", "使用服务器定义的 inputSchema，以 JSON 对象形式传递"],
            ["结果处理", "提取 text 类型的内容作为输出；错误时返回 ok: false 和错误信息"],
            ["连接缓存", "首次调用时建立连接并缓存，后续调用复用连接。配置变更后缓存自动失效。"],
            ["失败重试", "工具调用因连接问题失败时，自动重连并重试一次。"],
          ],
        },
        bullets: [
          { title: "工具发现", detail: "连接后通过 listTools 获取工具列表，包括名称、描述和 inputSchema。" },
          { title: "工具过滤", detail: "服务器配置中的 tools 数组可指定白名单，只注册列出的工具。" },
          { title: "错误处理", detail: "MCP 工具执行错误时返回结构化错误信息。连接失败会触发缓存失效和重连。" },
          { title: "缓存管理", detail: "添加、删除或更新服务器配置后，连接缓存自动失效。下次调用时重新建立连接。" },
        ],
        code: {
          label: "MCP 工具命名示例",
          content: "// 服务器 ID: filesystem, 工具名: read_file\n// 注册为: mcp__filesystem__read_file\n\n// 服务器 ID: api-tools, 工具名: query_db\n// 注册为: mcp__api-tools__query_db\n\n// 解析逻辑：\n// \"mcp__filesystem__read_file\" → serverId: \"filesystem\", toolName: \"read_file\"\n// \"mcp__api__send__email\" → serverId: \"api\", toolName: \"send__email\"",
        },
        checklist: [
          "MCP 服务器已在配置中正确定义并通过连接测试",
          "服务器 enabled 字段为 true（或省略，默认启用）",
          "需要的工具在 tools 白名单中（或 tools 为空表示全部启用）",
          "MCP 工具调用需要经过审批确认",
          "连接失败时检查服务器进程是否正常运行（stdio）或 URL 是否可达（http）",
        ],
        note: {
          tone: "success",
          title: "无缝集成",
          body: "MCP 工具与内置工具在 Agent 看来没有区别。它们共享相同的调用流程、审批机制和结果展示。你不需要学习新的操作方式，只需要知道这些额外的工具来自外部服务器。",
        },
      },
    ],
    related: ["skills", "tools", "approvals"],
  },
  {
    id: "approvals",
    group: "核心工作流",
    title: "审批与安全边界",
    summary: "审批顶部条确认敏感操作，命令白名单限制可执行范围，渲染进程沙箱隔离界面层。",
    icon: "shield",
    readTime: "13 分钟",
    updated: "2026-08-19",
    keywords: ["审批", "允许这一次", "拒绝", "Esc", "超时", "白名单", "命令安全", "沙箱", "contextIsolation"],
    sections: [
      {
        id: "approval-top-bar",
        title: "审批顶部栏",
        body: [
          "当 Agent 调用需要确认的工具时，聊天区顶部会出现固定的审批栏。审批栏使用 role=\"alertdialog\" 确保无障碍可读，包含盾牌图标、工具名称、格式化的参数预览，以及「拒绝」和「允许这一次」两个按钮。",
          "审批是单次的：允许后只放行当前请求，不会建立对该工具、路径或会话的永久授权。子代理发起的审批会额外显示子代理 ID（如「子代理 refactor-fs 请求：」）。",
        ],
        table: {
          headers: ["元素", "说明"],
          rows: [
            ["盾牌图标", "使用 shield 图标，标识这是安全确认操作"],
            ["标题", "默认显示「需要确认」，子代理请求时显示「子代理 {id} 请求：」"],
            ["工具名称", "以 code 样式显示触发的工具名（如 write_file）"],
            ["参数预览", "以 pre 格式化显示工具参数，方便快速审查"],
            ["拒绝按钮", "btn-secondary 样式，点击或按 Esc 拒绝当前操作"],
            ["允许按钮", "btn-primary 样式，点击放行当前请求（单次授权）"],
          ],
        },
      },
      {
        id: "approval-matrix",
        title: "哪些工具需要审批",
        body: [
          "审批策略按工具类别执行。只读工具（文件读取、搜索、Git 查看）可以直接运行；会改变状态的工具（文件写入、命令执行、外部访问、记忆操作）需要用户确认。",
        ],
        table: {
          headers: ["类别", "工具", "是否审批"],
          rows: [
            ["本地读取", "read_file、search_files、search_content、search_symbol、list_files", "否"],
            ["Git 查看", "git_status、git_diff、git_log", "否"],
            ["文件修改", "write_file、edit_file", "是"],
            ["命令执行", "run_command", "是"],
            ["外部访问", "web_fetch", "是"],
            ["记忆操作", "memory_search、memory_save", "是"],
            ["子代理调度", "dispatch_subagents", "是"],
          ],
        },
        checklist: [
          "工具类型是否与当前任务相符",
          "文件路径是否在预期工作目录内",
          "写入是新建、覆盖还是精确替换",
          "命令是否只做必要的构建或测试",
          "外部 URL 是否可信",
          "命令参数中是否包含敏感信息",
        ],
      },
      {
        id: "command-whitelist",
        title: "命令白名单",
        body: [
          "run_command 使用白名单机制限制可执行的程序。命令直接启动目标程序（无 shell），不经过 bash/zsh/cmd 等解释器。白名单按平台区分，只包含只读和安全的开发命令。",
          "破坏性文件命令（rm、mv、cp、del、rmdir、move、ren、copy、attrib）不在白名单中。Shell 特殊字符（| & ; < > ` $ ( )）会被拒绝，多行命令和管道也不被支持。",
        ],
        table: {
          headers: ["平台", "白名单命令"],
          rows: [
            ["Windows", "npm, npx, pnpm, yarn, node, corepack, git, where, findstr, whoami, systeminfo, tasklist, ver, hostname, python, pip, cargo, rustc, rustup, go, java, javac, gradle, mvn"],
            ["macOS / POSIX", "Windows 全部命令，加上 ls, cat, head, tail, grep, find, rg, pwd, which, env, sed, awk, cut, sort, uniq, wc, diff, make, cmake, ninja, clang, gcc, g++, swift, swiftc, xcrun, xcodebuild, brew, plutil, open, sqlite3, curl, sw_vers, sysctl, stat, du, df, file 等"],
          ],
        },
        bullets: [
          { title: "路径约束", detail: "所有路径参数必须是工作目录内的相对路径，拒绝绝对路径和 .. 越界。" },
          { title: "Flag 路径检查", detail: "git -C、npm --prefix、cargo --manifest-path 等带路径语义的 flag 也受约束。" },
          { title: "环境变量限制", detail: "最多 10 个额外环境变量，键名必须合法，禁止覆盖 PATH/HOME/SHELL 等关键变量。" },
          { title: "超时与输出", detail: "默认超时 30 秒（可设 100-300000ms），输出上限 5MB。" },
        ],
        note: {
          tone: "warning",
          title: "无 Shell 执行",
          body: "命令通过 spawn(exe, args, { shell: false }) 直接启动程序。这意味着管道、重定向、变量展开和脚本解释器（sh/bash/osascript）都不可用。复杂流水线应拆成多个独立的 run_command 调用。",
        },
      },
      {
        id: "renderer-sandbox",
        title: "渲染进程沙箱",
        body: [
          "Electron 渲染进程（聊天界面）启用了多层安全隔离。界面代码无法直接访问 Node.js API 或文件系统，所有敏感操作必须通过预加载层暴露的受控 IPC 接口请求主进程执行。",
          "这些安全机制是 Electron BrowserWindow 的配置项，在应用启动时设定，运行时无法被界面代码修改。",
        ],
        table: {
          headers: ["安全配置", "作用"],
          rows: [
            ["nodeIntegration: false", "界面中无法使用 require() 或 Node.js API"],
            ["contextIsolation: true", "预加载脚本与页面脚本运行在隔离的上下文中"],
            ["sandbox: true", "渲染进程运行在 Chrome 沙箱中，限制系统资源访问"],
            ["webSecurity: true", "启用同源策略，防止跨域攻击"],
          ],
        },
        note: {
          tone: "success",
          title: "多层防御",
          body: "审批机制、命令白名单、工作目录边界和渲染进程沙箱构成了多层防御体系。即使 Agent 的提示词被恶意篡改，这些系统级限制也无法被绕过。",
        },
      },
      {
        id: "reject-timeout",
        title: "拒绝、Esc 与超时",
        body: [
          "点击「拒绝」或按 Esc 会拒绝当前审批。Agent 会收到未获批准的结果并继续对话。默认等待时间是 60 秒，超时自动拒绝。可在设置中调整等待时间（1-300 秒）。",
          "拒绝后 Agent 通常会尝试替代方案或询问原因。你可以在输入框中说明拒绝理由，帮助 Agent 调整方案。",
        ],
      },
    ],
    related: ["tools", "plan-build", "local-data"],
  },
  {
    id: "memory-center",
    group: "核心工作流",
    title: "记忆中心",
    summary: "跨会话持久记忆系统：自动提取对话中的关键信息，注入相关记忆到上下文，并在记忆中心统一管理。",
    icon: "database",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["记忆", "Memory", "跨会话", "持久记忆", "提取", "注入", "FTS5", "SQLite", "管理", "记忆中心"],
    sections: [
      {
        id: "persistent-memory",
        title: "跨会话持久记忆",
        body: [
          "记忆系统基于 SQLite + FTS5 全文索引实现。每条记忆包含内容、类型、作用域、重要性、置信度、标签和访问时间戳。记忆在会话结束后仍然保留，后续会话可以检索和使用。",
          "记忆按作用域分为三级：personal（个人偏好，如「用户偏好中文回复」）、project（项目知识，如「这个项目使用 Electron + React」）和 workspace（企业规则，如「代码审查必须包含安全扫描」）。",
        ],
        table: {
          headers: ["属性", "说明"],
          rows: [
            ["id", "UUID 唯一标识"],
            ["scope", "作用域：personal / project / workspace"],
            ["scopeId", "项目 ID（project 作用域时使用）"],
            ["kind", "类型：fact / preference / decision / codebase / requirement / meeting"],
            ["content", "记忆内容（简洁的一句话）"],
            ["source", "来源标记（如 agent、manual、session:xxx）"],
            ["importance", "重要性 0-1，默认 0.5；≥ 0.8 进入重要记忆置顶区"],
            ["confidence", "置信度 0-1，自动提取默认 0.8，手动保存为 1.0"],
            ["accessCount", "访问计数，每次注入时递增"],
            ["tags", "标签数组，用于分类和搜索"],
          ],
        },
      },
      {
        id: "extraction",
        title: "记忆提取：从对话中自动学习",
        body: [
          "记忆提取器使用 LLM 分析对话历史，自动识别值得长期记忆的信息。提取过程只分析用户和 assistant 的消息，忽略工具调用结果。对话太短（少于 50 字符）时不会触发提取。",
          "提取器会过滤掉临时性信息（如「帮我看看这个文件」）和通用知识（如「JavaScript 是编程语言」），只保留用户明确表达的、有长期价值的信息。",
        ],
        bullets: [
          { title: "提取目标", detail: "用户技术偏好（如「我喜欢极简 UI」）、项目决策（如「决定用 SQLite」）、代码库知识（如「使用 Electron + React」）、需求变更。" },
          { title: "去重检查", detail: "保存前会通过 FTS5 精确短语搜索和 LIKE 前缀匹配检查是否已存在高度相似的记忆，避免重复。" },
          { title: "手动保存", detail: "用户也可以手动触发保存，手动保存的记忆置信度为 1.0、重要性为 0.8。" },
        ],
        note: {
          tone: "info",
          title: "提取不总是完美",
          body: "自动提取依赖 LLM 的理解能力，可能遗漏隐含信息或提取不准确的记忆。建议在记忆中心定期审查和修正。",
        },
      },
      {
        id: "injection",
        title: "记忆注入：让 Agent 记住你",
        body: [
          "每次 Agent 启动前，记忆注入器会根据当前用户消息检索相关记忆，并格式化后拼接到 system prompt 中。这让 Agent 在每次会话中都能参考之前积累的知识和偏好。",
          "注入器从四个来源检索记忆：与当前消息相关的个人记忆（语义搜索，最多 3 条）、当前项目的记忆（最多 5 条）、workspace 记忆（最多 3 条）和高重要性个人偏好（最多 3 条）。去重后按重要性排序，取 Top N（默认最多 10 条）。",
        ],
        steps: [
          { title: "语义搜索", detail: "用用户消息的前 200 字符作为搜索词，在个人记忆中检索相关条目。" },
          { title: "项目记忆", detail: "获取当前项目作用域下的最新记忆。" },
          { title: "企业规则", detail: "获取 workspace 作用域的全局规则。" },
          { title: "高重要性偏好", detail: "获取个人作用域下 preference 类型的高重要性记忆。" },
          { title: "去重排序", detail: "按 ID 去重，按重要性降序排列，取前 N 条。" },
          { title: "格式化注入", detail: "拼接为 [相关记忆] 文本块，注入 system prompt。同时更新访问计数。" },
        ],
        code: {
          label: "注入格式示例",
          content: "[相关记忆]\n- 用户偏好中文回复（置信度 90%，来源：agent）\n- 项目使用 Electron + React 架构（置信度 80%，来源：session 3）\n- 代码审查必须包含安全扫描（置信度 95%，来源：manual）",
        },
      },
      {
        id: "management",
        title: "记忆管理：查看、编辑与删除",
        body: [
          "记忆中心提供完整的记忆管理功能。通过侧栏的「记忆」入口或命令面板可以打开记忆中心，查看所有已保存的记忆。",
          "记忆支持按作用域和类型筛选，按更新时间排序。每条记忆可以编辑内容、调整重要性和修改标签。删除操作不可恢复。",
        ],
        table: {
          headers: ["操作", "说明"],
          rows: [
            ["查看", "列表展示所有记忆，显示内容、类型、作用域、重要性和更新时间"],
            ["编辑", "修改记忆内容、重要性评分和标签数组"],
            ["删除", "从数据库中删除记忆及对应的 FTS5 索引条目，不可恢复"],
            ["搜索", "通过 FTS5 全文搜索快速定位记忆"],
            ["统计", "显示记忆总数、按作用域/类型分布和近 7 天新增数"],
          ],
        },
        checklist: [
          "定期审查自动提取的记忆，修正不准确的内容",
          "为重要记忆设置较高的 importance 值（≥ 0.8），确保它们被优先注入",
          "使用 tags 对记忆进行分类，便于后续检索",
          "删除过时或不再适用的记忆，保持记忆库的质量",
          "注意不要在记忆中保存敏感信息（如密码、API Key）",
        ],
      },
    ],
    related: ["tools", "workspace-inspector", "local-data"],
  },
  {
    id: "local-data",
    group: "设置与数据",
    title: "本地数据与备份",
    summary: "了解数据目录结构、加密密钥存储机制，掌握备份恢复和跨平台迁移方法。",
    icon: "database",
    readTime: "14 分钟",
    updated: "2026-08-19",
    keywords: ["数据目录", "备份", "恢复", "迁移", "加密", "Keychain", "DPAPI", "safeStorage", "config.json", "stellara.db"],
    sections: [
      {
        id: "data-directory",
        title: "数据目录结构",
        body: [
          "Stellara Work 将所有用户数据（配置、会话数据库、加密密钥、日志）存储在平台标准的应用数据目录中。应用不会在用户主目录下创建隐藏文件夹。",
          "旧版本（v0.8 及更早）使用 `~/.stellara` 目录。首次启动 v0.9.0 时，应用会自动将旧数据迁移到新的数据目录，原目录保留作为备份。",
        ],
        table: {
          headers: ["平台", "数据目录路径"],
          rows: [
            ["Windows", "%APPDATA%\\Stellara Work"],
            ["macOS", "~/Library/Application Support/Stellara Work"],
          ],
        },
        bullets: [
          { title: "config.json", detail: "应用配置文件，存储模型元数据（id、label、baseUrl、model、workDir、contextWindow）、活跃模型 ID、应用偏好（主题、工作区模式、快捷键）、MCP 服务器配置。schemaVersion 为 1。" },
          { title: "config.json.bak", detail: "配置写入时的备份文件，从旧版本迁移时自动生成。" },
          { title: ".env", detail: "按模型 ID 存储的 API Key。Key 使用 `enc:v1:` 前缀加密存储（见下文）。文件权限设置为 0600。敏感程度：高，使用操作系统加密机制保护（enc:v1: 前缀），仅主进程可解密。" },
          { title: "stellara.db", detail: "SQLite 数据库，存储项目（projects）、会话（sessions）、消息（messages）、记忆（memories）和知识实体（knowledge_entities）。启用 WAL 模式和外键约束。" },
          { title: "stellara.db-wal / stellara.db-shm", detail: "SQLite WAL 模式的辅助文件，用于提高并发读写性能。" },
          { title: "logs/", detail: "应用运行日志目录，记录启动、模型连接、工具调用和错误信息。" },
        ],
        note: {
          tone: "info",
          title: "数据目录自包含",
          body: "数据目录的结构设计为自包含，所有用户数据和配置都集中在这里。这使得备份和迁移变得简单——只需复制整个目录即可。",
        },
      },
      {
        id: "encrypted-key-storage",
        title: "加密密钥存储",
        body: [
          "API Key 使用操作系统提供的加密机制进行保护。加密后的密钥以 `enc:v1:` 前缀存储在 `.env` 文件中，只有 Electron 主进程可以解密读取。渲染界面（聊天窗口）无法通过 IPC 获取裸密钥。",
          "密钥加密通过 Electron 的 safeStorage API 实现，底层使用操作系统的密钥管理服务。模型列表和诊断信息只暴露「是否已配置 Key」的布尔值，不返回密钥本身。",
        ],
        table: {
          headers: ["平台", "加密机制", "说明"],
          rows: [
            ["macOS", "Keychain（通过 Electron safeStorage）", "使用 macOS 系统钥匙串加密，只有同一用户账户可以解密"],
            ["Windows", "DPAPI（通过 Electron safeStorage）", "使用 Windows 数据保护 API，绑定到当前用户账户"],
          ],
        },
        code: {
          label: ".env 文件格式示例",
          content: "# 加密存储的 API Key（enc:v1: 前缀表示已加密）\nSTELLARA_KEY_deepseek-v4-pro=enc:v1:aGVsbG8gd29ybGQ=\nSTELLARA_KEY_glm-5.2=enc:v1:c2VjcmV0IGtleQ==\n\n# 旧版本迁移前的明文 Key（应用启动时会自动加密）\nSTELLARA_KEY_kimi-k3=sk-xxx",
        },
        steps: [
          { title: "密钥写入", detail: "添加模型时输入 API Key，主进程使用 safeStorage.encrypt() 加密后写入 .env 文件，添加 enc:v1: 前缀。" },
          { title: "密钥读取", detail: "模型调用时，主进程从 .env 读取加密值，使用 safeStorage.decrypt() 解密。裸 Key 只在主进程内存中使用。" },
          { title: "密钥删除", detail: "删除模型时，对应的 Key 条目从 .env 文件中移除。" },
          { title: "明文迁移", detail: "应用启动时会检测 .env 中的明文 Key（无 enc:v1: 前缀），自动加密重写。" },
        ],
        note: {
          tone: "success",
          title: "安全设计",
          body: "密钥只在主进程中使用，不通过 IPC 传给渲染界面。即使网页中注入了恶意脚本，也无法读取你的 API Key。",
        },
      },
      {
        id: "backup-restore",
        title: "备份与恢复",
        body: [
          "重要会话可以逐个导出 JSON 用于分享或归档。需要完整备份时（包含所有模型配置、API Key、会话和偏好），应先关闭应用，再复制整个数据目录。",
          "恢复时，将备份的数据目录内容复制回目标位置，然后重新启动应用。如果目标位置已有数据，建议先备份现有数据以防覆盖。",
        ],
        checklist: [
          "关闭 Stellara Work，避免数据库文件锁和未落盘状态",
          "备份整个数据目录（包含 config.json、.env、stellara.db、logs/）",
          "将备份存放在受控位置，不要公开分享（包含 API Key 和会话内容）",
          "恢复后重新启动应用，检查模型、会话和工作目录是否正常",
          "如果 .env 文件从其他设备复制，加密密钥可能无法解密（绑定到原设备的用户账户）",
        ],
        steps: [
          { title: "完整备份", detail: "关闭应用 → 复制整个数据目录到安全位置（如外部硬盘或加密云存储）。" },
          { title: "完整恢复", detail: "关闭应用 → 将备份目录内容复制回数据目录位置 → 启动应用。" },
          { title: "会话导出", detail: "在会话列表中右键导出 JSON，用于单独备份或分享特定会话。" },
          { title: "选择性恢复", detail: "如果只需要恢复部分数据，可以手动复制 stellara.db（会话数据库）或 config.json（配置），但要注意版本兼容性。" },
        ],
        note: {
          tone: "warning",
          title: "加密密钥的平台绑定",
          body: ".env 中的加密密钥绑定到创建时的设备用户账户。跨设备迁移时，加密的 API Key 可能无法解密。建议在新设备上重新配置 API Key。",
        },
      },
      {
        id: "cross-platform-migration",
        title: "跨平台迁移",
        body: [
          "从 Windows 迁移到 macOS（或反向）时，数据目录位置不同，需要手动迁移。会话数据库（stellara.db）和配置文件（config.json）是跨平台兼容的，但加密的 API Key 需要重新配置。",
          "旧版本（v0.8 及更早）使用 `~/.stellara` 目录。首次启动 v0.9.0 时，应用会自动检测并迁移旧数据到新位置，原目录保留作为备份。",
        ],
        table: {
          headers: ["迁移方向", "源路径", "目标路径"],
          rows: [
            ["Windows → macOS", "%APPDATA%\\Stellara Work", "~/Library/Application Support/Stellara Work"],
            ["macOS → Windows", "~/Library/Application Support/Stellara Work", "%APPDATA%\\Stellara Work"],
            ["v0.8 → v0.9（同平台）", "~/.stellara", "平台标准数据目录"],
          ],
        },
        steps: [
          { title: "导出旧数据", detail: "在源设备上关闭应用，复制整个数据目录到外部存储。" },
          { title: "安装新版本", detail: "在目标设备安装相同版本的 Stellara Work。" },
          { title: "复制数据文件", detail: "将 stellara.db、config.json 复制到目标设备的数据目录。不要复制 .env（加密密钥不兼容）。" },
          { title: "重新配置 Key", detail: "启动应用后，在设置中重新配置所有模型的 API Key。" },
          { title: "验证迁移", detail: "检查会话列表、项目分组和模型配置是否正常。" },
        ],
        bullets: [
          { title: "数据库兼容", detail: "stellara.db 使用 SQLite 格式，跨平台完全兼容。" },
          { title: "配置兼容", detail: "config.json 是纯 JSON 格式，跨平台兼容。但工作目录路径可能需要调整（Windows 使用反斜杠，macOS 使用正斜杠）。" },
          { title: "密钥不兼容", detail: ".env 中的加密密钥绑定到原设备的用户账户，跨平台无法解密。" },
          { title: "日志不迁移", detail: "logs/ 目录不需要迁移，新设备会自动生成新日志。" },
        ],
        note: {
          tone: "info",
          title: "版本兼容性",
          body: "跨设备迁移时，确保目标设备已安装相同版本的 Stellara Work。不同版本之间的数据库结构可能不兼容。",
        },
      },
      {
        id: "data-privacy",
        title: "数据隐私总结",
        body: [
          "Stellara Work 的设计原则是「本地优先」。所有用户数据（配置、密钥、会话）都保存在本机，不上传到 Stellara 云端。唯一的网络请求是发送给用户配置的模型 Provider，以及通过 web_fetch 访问用户审批的外部 URL。",
          "应用不收集使用统计、崩溃报告或用户行为数据。诊断信息仅在用户主动复制时才会被查看。渲染进程（聊天界面）启用了多层安全隔离：nodeIntegration 关闭、contextIsolation 启用、sandbox 启用、webSecurity 启用。",
        ],
        table: {
          headers: ["数据类型", "存储位置", "是否上传"],
          rows: [
            ["模型配置", "config.json（本地）", "否"],
            ["API Key", ".env（本地加密）", "否"],
            ["会话与消息", "stellara.db（本地）", "否"],
            ["记忆", "stellara.db（本地）", "否"],
            ["日志", "logs/（本地）", "否"],
            ["模型请求", "发送到配置的 Provider", "是（用户配置）"],
            ["web_fetch", "访问审批的外部 URL", "是（用户审批）"],
          ],
        },
        note: {
          tone: "success",
          title: "本地优先",
          body: "你的数据始终在你自己的设备上。使用在线模型时，请求内容会发送给配置的 Provider，请同时遵守服务商的数据政策和组织内部的代码外发规则。",
        },
      },
    ],
    related: ["app-settings", "projects-sessions", "troubleshooting"],
  },
  {
    id: "shortcuts",
    group: "扩展能力",
    title: "命令面板与快捷键",
    summary: "通过 Ctrl+K 命令面板快速执行命令，掌握 17 个默认快捷键和自定义录制方法。",
    icon: "keyboard",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["命令面板", "快捷键", "Ctrl+K", "Ctrl+B", "Ctrl+Shift+P", "Ctrl+Enter", "Escape", "录制", "重置", "17 个默认快捷键"],
    sections: [
      {
        id: "command-palette",
        title: "命令面板（Ctrl+K）",
        body: [
          "按 Ctrl+K 打开命令面板，输入中文或英文关键词过滤。使用 ↑/↓ 移动选择，Enter 执行，Esc 关闭。底部会显示当前匹配命令数量。命令面板支持模糊搜索，即使只输入部分关键词也能匹配到相关命令。",
          "命令根据当前会话、已配置模型和主题动态生成，因此不同环境中的数量会不同。会话切换列表默认取最近的前 10 项。命令面板中的命令会随应用状态变化，例如当没有活跃会话时，「删除当前会话」命令不会出现。",
        ],
        table: {
          headers: ["分组", "可执行操作"],
          rows: [
            ["导航", "打开设置、管理 Skills、打开文件树、切换工作目录"],
            ["会话", "新建会话、新任务、切换最近会话、删除当前会话"],
            ["模型", "切换到已配置模型、添加新模型"],
            ["主题", "深色、浅色、跟随系统"],
            ["界面", "切换左侧栏、右侧工作区和 Plan 模式"],
          ],
        },
        bullets: [
          { title: "模糊匹配", detail: "输入部分关键词即可匹配，不需要完整命令名称。例如输入 \"set\" 可以匹配「打开设置」。" },
          { title: "中英文混合", detail: "支持中英文关键词混合搜索。例如输入 \"model 切换\" 可以找到切换模型的命令。" },
          { title: "Skill 集成", detail: "已加载的 Skills 也会出现在命令面板中。输入 `/` 前缀可以过滤出所有 Skill 命令。" },
          { title: "全程键盘", detail: "全程可键盘操作（↑/↓ 选择、Enter 执行、Esc 关闭），不需要鼠标。" },
        ],
        note: {
          tone: "info",
          title: "新建会话 vs 新任务",
          body: "「新建会话」创建一条新的本地会话记录；「新任务（清空当前聊天）」用于清空当前任务上下文但不创建新会话。执行删除当前会话时会再次确认，并明确提示不可恢复。",
        },
      },
      {
        id: "default-shortcuts",
        title: "快捷键列表：17 个默认快捷键",
        body: [
          "以下列表以 `shared/shortcuts.ts` 实现为准，共 17 个默认快捷键。快捷键只在应用窗口处于前台时生效。输入框获得焦点时，部分快捷键（如 Ctrl+B 切换侧栏）仍然可用，但不会影响正在输入的文字。",
          "macOS 上 Ctrl 键会自动映射为 Cmd 键（通过 metaKey 兼容）。v0.9 没有默认的 `Ctrl+,` 打开设置快捷键；请用 Ctrl+K 命令面板搜索「打开设置」。",
        ],
        table: {
          headers: ["操作", "Action ID", "默认按键"],
          rows: [
            ["切换左侧会话栏", "toggleSidebar", "Ctrl+B"],
            ["切换右侧工作区", "toggleWorkspace", "Ctrl+Shift+W"],
            ["切换 Plan 模式", "togglePlanMode", "Ctrl+Shift+P"],
            ["发送消息", "sendMessage", "Ctrl+Enter"],
            ["拒绝当前审批", "rejectApproval", "Escape"],
            ["打开命令面板", "openCommandPalette", "Ctrl+K"],
            ["切换到 Tab 1", "switchTab1", "Ctrl+1"],
            ["切换到 Tab 2", "switchTab2", "Ctrl+2"],
            ["切换到 Tab 3", "switchTab3", "Ctrl+3"],
            ["切换到 Tab 4", "switchTab4", "Ctrl+4"],
            ["切换到 Tab 5", "switchTab5", "Ctrl+5"],
            ["切换到 Tab 6", "switchTab6", "Ctrl+6"],
            ["切换到 Tab 7", "switchTab7", "Ctrl+7"],
            ["切换到 Tab 8", "switchTab8", "Ctrl+8"],
            ["切换到 Tab 9", "switchTab9", "Ctrl+9"],
            ["关闭当前 Tab", "closeActiveTab", "Ctrl+W"],
            ["恢复关闭的 Tab", "reopenClosedTab", "Ctrl+Shift+T"],
          ],
        },
        note: {
          tone: "info",
          title: "平台差异",
          body: "快捷键定义中统一使用 Ctrl 前缀。macOS 上通过 metaKey 兼容，实际按键为 Cmd+B、Cmd+K 等。Windows 上直接使用 Ctrl。",
        },
      },
      {
        id: "custom-shortcuts",
        title: "自定义快捷键",
        body: [
          "打开设置 → 快捷键，找到目标操作并点击「录制」。按钮进入录制状态后按下新的组合键；按 Esc 会取消本次录制。每一项都可独立点击「重置」恢复默认。自定义快捷键会立即保存到本地配置文件（`~/.stellara/config.json`）。",
          "快捷键序列化规则：KeyboardEvent 被转换为 `Ctrl+Shift+P` 格式的字符串。单独的修饰键（Control/Shift/Alt/Meta）不会触发录制。空格键序列化为 `Space`，单字符键转为大写。",
        ],
        steps: [
          { title: "选择操作", detail: "确认要更改的是面板、模式、发送、审批还是标签页动作。17 个操作均可自定义。" },
          { title: "开始录制", detail: "点击该行的「录制」，界面显示「按下任意键…」状态。" },
          { title: "按下组合键", detail: "按下新的组合键。系统自动序列化为 `Ctrl+Shift+X` 格式。尽量使用 Ctrl/Shift 与字母组合。" },
          { title: "实际测试", detail: "关闭设置后验证新按键在对应上下文中生效。如有冲突，应用会提示。" },
        ],
        bullets: [
          { title: "即时保存", detail: "自定义绑定立即持久化到 config.json，重启后仍然有效。" },
          { title: "重置默认", detail: "每一项都可独立点击「重置」恢复默认绑定，不影响其他操作。" },
          { title: "Esc 取消", detail: "录制过程中按 Esc 取消本次录制，不修改原有绑定。" },
        ],
      },
      {
        id: "context-aware",
        title: "上下文感知的快捷键",
        body: [
          "Escape 键在不同上下文中有不同行为：在审批条中表示拒绝当前审批，在命令面板中表示关闭面板，在快捷键录制中表示取消录制。应用会根据当前焦点自动选择对应动作。",
          "Ctrl+Enter 的行为取决于输入框状态：在单行输入时直接发送，在多行输入时发送整段内容。Shift+Enter 始终用于换行。Ctrl+W 只关闭当前标签页视图，不会删除会话数据。",
        ],
        checklist: [
          "使用 Ctrl+K 打开命令面板，搜索任何命令而不需要记忆快捷键",
          "使用 Ctrl+1 到 Ctrl+9 快速切换标签页",
          "使用 Ctrl+Shift+T 恢复误关闭的标签页",
          "使用 Ctrl+B 和 Ctrl+Shift+W 快速切换侧栏和工作区的显示",
          "使用 Ctrl+Shift+P 在 Plan 和 Build 模式间快速切换",
          "自定义快捷键保存在本地配置中，跨会话持久化",
        ],
        note: {
          tone: "warning",
          title: "快捷键冲突",
          body: "如果组合键被系统、输入法或其他应用拦截，Stellara Work 可能收不到事件。某些输入法（如中文输入法）会拦截 Ctrl+Space 等组合键。建议改用 Ctrl+Shift 或 Ctrl+Alt 的组合，与系统快捷键错开。",
        },
      },
    ],
    related: ["interface-tour", "skills", "approvals"],
  },
  {
    id: "troubleshooting",
    group: "设置与数据",
    title: "故障排查",
    summary: "按错误类型快速定位模型连接、工具执行、数据目录和 macOS 特定问题。",
    icon: "lifebuoy",
    readTime: "16 分钟",
    updated: "2026-08-19",
    keywords: ["故障排查", "错误", "401", "403", "404", "429", "5xx", "网络", "Keychain", "Gatekeeper", "日志", "诊断"],
    sections: [
      {
        id: "model-connection-errors",
        title: "模型连接错误",
        body: [
          "模型连接错误通常由 API Key 无效、网络问题或服务商限制引起。错误横幅会把服务端或网络错误转换为更易读的类型，并按情况显示「打开设置」「切换模型」「重试」或网络检查提示。",
          "大多数模型错误都可以通过检查配置来解决。如果错误持续出现，建议查看主日志获取更详细的错误信息。",
        ],
        table: {
          headers: ["错误类型", "状态码", "常见原因", "处理方式"],
          rows: [
            ["API Key 无效", "401/403", "Key 错误、过期或无权限", "设置 → 模型更新 Key，再测试连接"],
            ["余额不足", "402/配额", "余额或套餐额度耗尽", "服务商充值，或切换 Provider"],
            ["模型不存在", "404", "模型 ID 错误或账号未开通", "核对精确模型名和账号权限"],
            ["请求被限流", "429", "频率或并发超过限制", "等待几秒重试，降低频率或换模型"],
            ["上下文窗口超出", "413/长度错误", "请求 token 超过模型能力", "减少上下文、新建会话或修正窗口值"],
            ["Provider 服务器错误", "5xx", "服务商临时故障", "稍后重试；持续失败时切换 Provider"],
            ["网络连接失败", "—", "DNS、代理、端点或网络中断", "检查网络、Base URL 和代理要求"],
            ["流空闲超时", "—", "120 秒没有新数据", "重试；若反复出现，检查 Provider 稳定性"],
          ],
        },
        steps: [
          { title: "检查 API Key", detail: "在设置 → 模型中确认 Key 是否正确配置。点击编辑图标重新输入 Key 并保存。" },
          { title: "测试连接", detail: "添加模型时会自动测试连接。如果测试失败，检查 Key、Base URL 和网络。" },
          { title: "检查网络", detail: "确认可以访问模型服务商的 API 端点。如果使用代理或 VPN，确认配置正确。" },
          { title: "切换模型", detail: "如果当前模型持续报错，尝试切换到其他已配置的模型。" },
          { title: "查看日志", detail: "在设置 → 应用中点击「查看」打开主日志，搜索错误信息获取详细原因。" },
        ],
        note: {
          tone: "info",
          title: "连接测试",
          body: "添加或更新模型时，应用会自动向模型服务发送测试请求。测试通过后才会保存配置；失败则可返回修改重新测试。",
        },
      },
      {
        id: "tool-execution-errors",
        title: "工具执行错误",
        body: [
          "工具执行错误通常分为两类：路径/权限问题和内容匹配问题。Agent 会针对常见工具失败生成修复引导，你也可以把完整错误保留在当前会话中，要求先解释原因再采取下一步。",
          "路径/权限问题需要检查工作目录和文件状态；内容匹配问题需要确认编辑内容的准确性。所有工具错误都会在聊天区显示为对应的卡片（Diff 卡片或 Shell 卡片）。",
        ],
        table: {
          headers: ["现象", "原因方向", "推荐动作"],
          rows: [
            ["文件不存在", "路径或工作目录不对", "先 search_files / list_files 确认路径"],
            ["edit_file 匹配失败", "oldText 与现有内容不完全一致或多处命中", "重新 read_file，复制精确缩进与换行"],
            ["权限不足 / 文件占用", "其他程序锁定或目录权限不足", "关闭占用程序，必要时检查权限"],
            ["命令未在白名单", "工具安全策略不允许该程序", "改用受支持的开发命令或手动执行"],
            ["包含 shell 特殊字符", "使用了管道、重定向或变量", "拆成多个独立、可审查命令"],
            ["端口已占用", "已有服务占用监听端口", "换端口或定位占用进程"],
            ["磁盘空间不足", "工作盘或用户目录空间不足", "释放空间后再重试"],
            ["路径越界", "路径超出工作目录范围", "确认路径在工作目录内，不使用绝对路径或 .. 越界"],
          ],
        },
        bullets: [
          { title: "路径安全", detail: "所有路径经过字符串检查和真实路径验证（含 symlink 检查），确保不越出工作目录。" },
          { title: "命令白名单", detail: "run_command 使用白名单机制限制可执行的程序。破坏性命令（rm/mv/cp）不在白名单。" },
          { title: "审批机制", detail: "写入工具（write_file、edit_file）和命令执行（run_command）需要用户审批。审批默认等待 60 秒，超时自动拒绝。" },
        ],
        note: {
          tone: "warning",
          title: "edit_file 匹配规则",
          body: "oldText 必须精确匹配（含缩进和换行）。匹配 0 处返回错误；匹配多处时除非 replaceAll=true 否则也返回错误。建议先 read_file 确认精确内容。",
        },
      },
      {
        id: "data-directory-issues",
        title: "数据目录问题",
        body: [
          "如果启动后配置或会话异常，先关闭应用并备份数据目录，再查看主日志。不要直接把「清空所有数据」作为第一步，因为它会删除模型、密钥和全部聊天。只有确认备份完成且问题确实来自本地状态时，才考虑危险区操作。",
          "数据库文件损坏是罕见但严重的问题。如果怀疑数据库损坏，先复制一份备份，然后尝试用 SQLite 工具检查文件完整性。",
        ],
        checklist: [
          "关闭 Stellara Work",
          "备份整个数据目录（复制到其他位置）",
          "查看主日志（设置 → 应用 → 查看日志）",
          "检查 config.json 是否为合法 JSON 格式",
          "检查 stellara.db 是否可以用 SQLite 工具打开",
          "如果问题无法定位，复制诊断信息（设置 → 应用 → 复制）",
          "只有确认备份完成后，才考虑「清空所有数据」",
        ],
        steps: [
          { title: "备份数据", detail: "关闭应用，复制整个数据目录到安全位置。" },
          { title: "查看日志", detail: "打开主日志文件，搜索 error 或异常信息。" },
          { title: "检查配置", detail: "用文本编辑器打开 config.json，确认 JSON 格式合法。" },
          { title: "检查数据库", detail: "使用 SQLite 工具（如 sqlite3 命令行或 DB Browser for SQLite）打开 stellara.db，检查表结构是否完整。" },
          { title: "复制诊断", detail: "在设置 → 应用中点击「复制」按钮，将诊断信息保存到剪贴板。" },
          { title: "清空数据（最后手段）", detail: "如果以上步骤都无法解决问题，且已确认备份完成，可以在设置 → 应用的危险区输入 DELETE 清空所有数据。" },
        ],
        note: {
          tone: "warning",
          title: "保留证据",
          body: "清空数据也会移除定位问题所需的状态。需要反馈缺陷时，先复制诊断和日志，再决定是否清除。",
        },
      },
      {
        id: "macos-specific-issues",
        title: "macOS 特定问题",
        body: [
          "macOS 用户可能遇到两个特有问题：Keychain 访问权限和 Gatekeeper 安全限制。这些问题与 macOS 的安全机制有关，需要额外的操作步骤来解决。",
        ],
        bullets: [
          { title: "Keychain 访问被拒绝", detail: "如果应用无法访问 Keychain（加密密钥存储），可能是权限问题。尝试在「系统设置 → 隐私与安全 → 钥匙串」中检查 Stellara Work 的访问权限。" },
          { title: "Gatekeeper 阻止打开", detail: "未签名的应用会被 Gatekeeper 阻止。右键点击应用选择「打开」，在弹出对话框中再次点击「打开」。首次操作后，后续可直接双击启动。" },
          { title: "应用损坏错误", detail: "如果提示「应用已损坏，无法打开」，可能是下载不完整。重新下载安装包并核对 SHA-256 校验值。" },
          { title: "钥匙串锁定", detail: "如果长时间未使用或系统重启后，Keychain 可能被锁定。启动 Stellara Work 时系统会提示输入钥匙串密码。" },
        ],
        table: {
          headers: ["问题", "原因", "解决方案"],
          rows: [
            ["Keychain 访问被拒绝", "权限问题或钥匙串锁定", "检查系统设置中的钥匙串访问权限，或输入钥匙串密码解锁"],
            ["Gatekeeper 阻止打开", "应用未签名", "右键选择「打开」，在对话框中确认打开"],
            ["应用损坏错误", "下载不完整或文件损坏", "重新下载安装包，核对 SHA-256 校验值"],
            ["钥匙串密码提示", "Keychain 被锁定", "输入 macOS 用户密码解锁钥匙串"],
            ["权限请求", "首次访问某些系统资源", "在系统设置中允许 Stellara Work 的访问请求"],
          ],
        },
        steps: [
          { title: "Gatekeeper 放行", detail: "右键点击 Stellara Work → 选择「打开」→ 在弹出对话框中点击「打开」。" },
          { title: "Keychain 解锁", detail: "如果提示钥匙串密码，输入 macOS 用户密码。可以在「钥匙串访问」应用中管理钥匙串设置。" },
          { title: "检查权限", detail: "打开「系统设置 → 隐私与安全」，检查 Stellara Work 是否有必要的权限（如文件访问、钥匙串访问）。" },
          { title: "重新安装", detail: "如果问题持续，尝试完全删除应用和数据目录后重新安装。" },
        ],
        note: {
          tone: "info",
          title: "macOS 安全机制",
          body: "这些安全机制是 macOS 系统级别的保护，不是 Stellara Work 的缺陷。未签名的应用需要手动放行，Keychain 访问需要用户授权。",
        },
      },
      {
        id: "collect-evidence",
        title: "收集排错信息",
        body: [
          "反馈问题时，提供完整的排错信息可以帮助更快定位原因。打开设置 → 应用，先复制诊断信息，再打开主日志。说明发生时间、操作步骤、所选模型、错误标题和是否可以稳定复现。",
          "不要粘贴 API Key、完整 `.env` 或未经检查的会话导出。如果问题可以稳定复现，尝试在新会话中用简化的步骤重现，这有助于排除历史上下文的干扰。",
        ],
        checklist: [
          "Stellara Work 版本与平台架构",
          "错误出现前的具体操作步骤",
          "错误横幅标题、状态码和提示",
          "脱敏诊断信息（复制诊断信息后人工检查）",
          "相关日志片段（删除密钥、路径和业务数据）",
          "是否在其他模型或新会话中复现",
          "网络环境（是否使用代理、VPN）",
        ],
        code: {
          label: "诊断信息示例（脱敏后）",
          content: "# Stellara Work 诊断信息\n采集时间：2026-08-28T10:30:00.000Z\n\n## 版本\n- Stellara Work: v0.9.2\n- Electron: 31.0.0\n- 平台: darwin arm64\n\n## 数据\n- 数据目录: /Users/xxx/Library/Application Support/Stellara Work\n- 会话数: 12 / 消息数: 348\n- 已配 model: 3（已配 key: deepseek-v4-pro, glm-5.2）\n- 活跃 model: deepseek-v4-pro\n\n## main.log 最近 50 行\n[错误日志片段...]",
        },
        note: {
          tone: "success",
          title: "脱敏提醒",
          body: "提交问题前，确认诊断信息中不包含 API Key、完整路径或业务敏感数据。可以手动编辑删除敏感部分。",
        },
      },
    ],
    related: ["app-settings", "local-data", "models"],
  },
  {
    id: "faq",
    group: "参考",
    title: "常见问题",
    summary: "按主题集中解答平台支持、离线使用、云同步和密钥安全等高频疑问。",
    icon: "help",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["FAQ", "常见问题", "平台支持", "离线", "云同步", "密钥安全", "Windows", "macOS", "Linux", "加密"],
    sections: [
      {
        id: "platform-support",
        title: "平台支持",
        body: [
          "Stellara Work v0.9.2 提供 Windows 和 macOS 两个平台的安装包。Windows 版本仅支持 x64 架构，使用 NSIS 安装向导；macOS 提供 Apple 芯片（arm64）与 Intel（x64）两种 DMG 磁盘映像。Linux 版本尚未提供。",
          "两个平台的功能完全一致，包括 Agent 工具集、Plan/Build 模式、Skills、MCP 和记忆中心。差异仅体现在安装包格式、数据目录路径和命令白名单（macOS 白名单额外包含 swift、brew 等 POSIX 工具）。",
        ],
        table: {
          headers: ["平台", "安装包格式", "架构要求", "数据目录"],
          rows: [
            ["Windows", "NSIS 安装向导（.exe）", "x64", "%APPDATA%\\Stellara Work"],
            ["macOS", "DMG 磁盘映像（.dmg）", "Apple Silicon（arm64）", "~/Library/Application Support/Stellara Work"],
            ["Linux", "暂未提供", "—", "—"],
          ],
        },
        bullets: [
          { title: "macOS 版本要求", detail: "需要 macOS 12.0 或更高版本。不支持 Intel Mac。" },
          { title: "Windows 版本要求", detail: "支持 Windows 10 及以上版本（x64）。" },
          { title: "未签名安装包", detail: "当前版本未经代码签名。macOS 需右键打开绕过 Gatekeeper；Windows 需在 SmartScreen 中选择「仍要运行」。" },
          { title: "旧版本迁移", detail: "v0.8 及更早版本使用 ~/.stellara 目录。首次启动 v0.9.0 时自动迁移到新的数据目录，原目录保留作为备份。" },
        ],
        note: {
          tone: "info",
          title: "下载来源",
          body: "安装包通过 GitHub Releases 提供。请仅从官方 GitHub 仓库（github.com/strashineltd/stellara-work）获取安装包，并核对发布页给出的 SHA-256 校验值。",
        },
      },
      {
        id: "offline-usage",
        title: "离线使用",
        body: [
          "Stellara Work 的应用界面、会话数据库（stellara.db）、配置文件和技能文件全部存储在本地，不依赖 Stellara 云端服务，也不需要注册 Stellara 账号。应用本身可以在无网络环境下启动和操作界面。",
          "但 Agent 的核心能力依赖模型服务。内置的四个预设（GLM-5.2、DeepSeek-v4-Pro、Kimi-K3、MiniMax-M3）都是网络 Provider，使用它们必须联网，请求内容会发送到对应端点。如果需要离线使用，可以配置本地部署的 OpenAI 兼容服务（如 Ollama、vLLM），但本地模型的能力和上下文窗口可能不如云端模型。",
        ],
        table: {
          headers: ["功能", "是否需要网络", "说明"],
          rows: [
            ["应用启动与界面操作", "否", "界面、配置、数据库全部本地"],
            ["使用内置预设模型", "是", "请求发送到对应 Provider 端点"],
            ["使用自定义网络模型", "是", "请求发送到自定义 Base URL"],
            ["使用本地模型（Ollama 等）", "否（局域网）", "取决于本地服务是否在本机运行"],
            ["web_fetch 工具", "是", "需访问外部 URL，且需用户审批"],
            ["记忆搜索与保存", "否", "存储在本地 SQLite 数据库"],
            ["会话导出", "否", "导出为本地 JSON 文件"],
          ],
        },
        checklist: [
          "确认本地模型服务已启动且可访问",
          "Base URL 指向本地地址（如 http://localhost:11434/v1）",
          "本地模型支持流式输出（SSE）",
          "本地模型的上下文窗口满足任务需求",
        ],
        note: {
          tone: "info",
          title: "本地模型配置",
          body: "使用 Ollama 等本地服务时，Base URL 通常为 http://localhost:11434/v1。请确认本地服务已启动且模型已下载。",
        },
      },
      {
        id: "cloud-sync",
        title: "云同步",
        body: [
          "Stellara Work 不提供云端同步功能。所有数据（配置、会话、记忆、API Key）都保存在本机数据目录中，不会自动上传到任何云端服务。跨设备使用需要手动备份和迁移数据目录，或逐个导出重要会话。",
          "数据目录的结构设计为自包含，所有用户数据集中存储。完整备份只需复制整个数据目录。但请注意，加密的 API Key 绑定到创建时的设备用户账户，跨设备迁移时可能需要重新配置密钥。",
        ],
        table: {
          headers: ["数据类型", "存储位置", "是否可跨设备迁移"],
          rows: [
            ["模型配置", "config.json", "是，跨平台兼容"],
            ["会话与消息", "stellara.db（SQLite）", "是，跨平台兼容"],
            ["记忆", "stellara.db", "是，跨平台兼容"],
            ["API Key", ".env（加密存储）", "否，绑定到设备用户账户"],
            ["应用偏好", "config.json", "是，跨平台兼容"],
            ["Skills 文件", "<workDir>/skills/", "是，随工作目录迁移"],
            ["日志", "logs/", "否，新设备自动生成"],
          ],
        },
        steps: [
          { title: "完整备份", detail: "关闭应用，复制整个数据目录到安全位置（如外部硬盘或加密云存储）。" },
          { title: "恢复到新设备", detail: "在新设备安装相同版本的 Stellara Work，将 stellara.db 和 config.json 复制到新设备的数据目录。" },
          { title: "重新配置 Key", detail: "启动应用后，在设置中重新配置所有模型的 API Key。加密密钥无法跨设备解密。" },
          { title: "验证迁移", detail: "检查会话列表、项目分组和模型配置是否正常。工作目录路径可能需要调整。" },
        ],
        note: {
          tone: "warning",
          title: "加密密钥的平台绑定",
          body: ".env 中的加密密钥使用 macOS Keychain 或 Windows DPAPI 加密，绑定到创建时的设备用户账户。跨设备迁移时，加密的 API Key 无法解密，需要在新设备上重新配置。",
        },
      },
      {
        id: "key-security",
        title: "密钥安全",
        body: [
          "API Key 使用操作系统提供的加密机制进行保护。macOS 使用 Keychain（通过 Electron safeStorage），Windows 使用 DPAPI（通过 Electron safeStorage）。加密后的密钥以 `enc:v1:` 前缀存储在 `.env` 文件中，文件权限设置为 0600（仅当前用户可读写）。",
          "密钥只在 Electron 主进程中使用和解密，不通过 IPC 传给渲染界面（聊天窗口）。模型列表和诊断信息只暴露「是否已配置 Key」的布尔值，不返回密钥本身。即使网页中注入了恶意脚本，也无法读取你的 API Key。",
        ],
        table: {
          headers: ["安全措施", "说明"],
          rows: [
            ["加密存储", "使用 OS Keychain（macOS）/ DPAPI（Windows）加密，enc:v1: 前缀标识"],
            ["文件权限", ".env 文件权限 0600，仅当前用户可读写"],
            ["主进程隔离", "密钥只在主进程解密使用，不通过 IPC 传给渲染界面"],
            ["渲染进程沙箱", "nodeIntegration: false、contextIsolation: true、sandbox: true"],
            ["诊断信息脱敏", "诊断信息不包含 API Key 或会话正文"],
            ["明文自动迁移", "应用启动时自动检测并加密旧版明文 Key"],
          ],
        },
        checklist: [
          "不要在 Skills 文件或会话中写入 API Key",
          "不要在会话导出 JSON 中包含密钥信息",
          "定期在服务商控制台轮换密钥",
          "保护操作系统用户账户安全（加密密钥绑定到用户账户）",
          "不要将 .env 文件提交到 Git 仓库",
          "跨设备迁移时在新设备上重新配置 Key",
        ],
        note: {
          tone: "success",
          title: "多层防御",
          body: "审批机制、命令白名单、工作目录边界、渲染进程沙箱和密钥加密构成了多层防御体系。即使 Agent 的提示词被恶意篡改，这些系统级限制也无法被绕过。",
        },
      },
      {
        id: "multi-account",
        title: "多模型与多账号",
        body: [
          "每个模型配置独立保存 API Key。你可以为同一个服务商创建多个配置（使用不同的 Key 或模型），并在会话中根据需要切换。这适合团队共用设备或个人有多个服务商账号的场景。",
          "活跃模型决定新会话使用的默认配置。可以通过设置面板、聊天区顶部或命令面板（Ctrl+K）随时切换活跃模型。切换后立即生效，新模型从切换后的消息开始参与对话。",
        ],
        table: {
          headers: ["操作", "方式"],
          rows: [
            ["添加模型", "设置 → 模型 → 添加模型，选择预设或自定义"],
            ["切换活跃模型", "设置 → 模型 → 切换，或 Ctrl+K 搜索「切换模型」"],
            ["会话中切换", "点击输入框上方的模型名称，从下拉列表中选择"],
            ["删除模型", "设置 → 模型 → 删除，对应的 Key 也会移除"],
          ],
        },
        bullets: [
          { title: "独立工作目录", detail: "每个模型配置可以设置不同的工作目录，适合不同项目使用不同模型。" },
          { title: "独立上下文窗口", detail: "每个模型配置可以设置不同的上下文窗口大小（256K/512K/1M）。" },
          { title: "历史会话兼容", detail: "删除模型不会删除历史会话。但如果历史会话引用的模型已被删除，继续发送前需要重新选择可用模型。" },
        ],
      },
      {
        id: "doc-version",
        title: "文档版本",
        body: [
          "本文档以 Stellara Work v0.9.2（2026-08-28 发布）的代码和配置为依据。涉及快捷键、工具接口和设置项时，以文档标注的行为和应用实际界面为准。",
          "后续版本可能会调整工具接口、快捷键绑定或设置项布局。更新版本后建议重新浏览文档的对应章节，关注版本记录中的变更说明。",
        ],
        bullets: [
          { title: "当前版本", detail: "v0.9.2（2026-08-28）" },
          { title: "文档更新日期", detail: "2026-08-28" },
          { title: "配置格式", detail: "config.json schemaVersion 为 1" },
          { title: "数据库格式", detail: "SQLite，启用 WAL 模式和外键约束" },
        ],
      },
    ],
    related: ["install-setup", "local-data", "troubleshooting"],
  },
  {
    id: "advanced-usage",
    group: "高级指南",
    title: "高级使用模式",
    summary: "掌握多模型协作、批量操作、上下文优化和自动化工作流。",
    icon: "tools",
    readTime: "15 分钟",
    updated: "2026-08-02",
    keywords: ["高级", "多模型", "批量", "优化", "自动化", "工作流", "上下文", "效率"],
    sections: [
      {
        id: "multi-model-workflow",
        title: "多模型协作工作流",
        body: [
          "不同模型擅长不同任务。代码生成、创意写作、数据分析和推理可能需要不同的模型。通过在同一项目中配置多个模型，可以在不同阶段使用最适合的工具。",
          "典型的工作流是：先用推理能力强的模型做需求分析和方案设计，再用代码生成能力强的模型执行实现。这种分工可以提高整体质量和效率。",
        ],
        steps: [
          { title: "配置多个模型", detail: "在设置中添加 2-3 个不同特性的模型，分别用于分析、编码和审查。" },
          { title: "Plan 阶段用分析模型", detail: "用推理能力强的模型进行需求分析和方案设计。" },
          { title: "Build 阶段用编码模型", detail: "切换到代码生成模型执行实际修改。" },
          { title: "审查阶段用通用模型", detail: "用另一个模型审查改动，避免单一视角的盲点。" },
        ],
        bullets: [
          { title: "模型切换时机", detail: "在 Plan/Build 模式切换时同时切换模型，最大化每个阶段的效果。" },
          { title: "上下文保持", detail: "同一会话中切换模型会保留历史消息，新模型可以继续之前的上下文。" },
          { title: "成本控制", detail: "分析阶段用小模型降低成本，关键实现阶段再用大模型。" },
        ],
      },
      {
        id: "batch-operations",
        title: "批量操作技巧",
        body: [
          "当需要对多个文件执行相似操作时，可以要求 Agent 在一次会话中批量处理。明确列出目标文件列表和每个文件的修改要求，Agent 会按顺序逐一执行。",
          "对于结构化的批量修改（如重命名变量、更新注释格式），可以先让 Agent 在 Plan 模式中分析影响范围，确认无误后再批量执行。",
        ],
        checklist: [
          "明确列出所有需要修改的文件路径",
          "说明每个文件的具体修改要求",
          "要求 Agent 每修改 3-5 个文件后暂停并汇报进度",
          "在修改完成后要求 Agent 运行测试验证",
          "检查是否有遗漏的文件或未预期的修改",
        ],
      },
      {
        id: "context-optimization",
        title: "上下文优化策略",
        body: [
          "长会话会逐渐消耗上下文窗口，导致可用空间减少。优化上下文使用可以延长单个会话的有效工作时间。",
          "避免在一次消息中读取大量无关文件。使用 search_content 先定位关键文件，再用 read_file 精确读取。这比一次性读取整个目录更高效。",
        ],
        bullets: [
          { title: "精确搜索", detail: "用 search_content 定位后再读取，避免加载无关文件。" },
          { title: "分段读取", detail: "大文件使用 offset/limit 读取关键段落，而非整个文件。" },
          { title: "定期总结", detail: "在长会话中定期要求 Agent 总结当前进展，压缩历史消息。" },
          { title: "新会话分割", detail: "完成一个子任务后新建会话，避免上下文污染。" },
        ],
      },
      {
        id: "automation-patterns",
        title: "自动化工作流模式",
        body: [
          "通过 Skill 可以定义可复用的自动化工作流。将常用的操作流程封装为 Skill，可以减少重复描述，提高一致性。",
          "结合 Plan 模式和 Skill，可以实现\"分析 → 计划 → 执行 → 验证\"的标准化工作流。每个阶段都有明确的输入、输出和验证标准。",
        ],
        code: {
          label: "自动化 Skill 示例",
          content: "{\n  \"name\": \"refactor-check\",\n  \"description\": \"重构前分析 + 重构后验证的完整流程\",\n  \"prompt\": \"1. Plan 模式：分析目标代码的依赖关系和影响范围。\\n2. 列出安全的重构步骤和每步的验证方法。\\n3. Build 模式：按步骤执行重构。\\n4. 每步完成后运行相关测试。\\n5. 输出最终的变更摘要和测试结果。\"\n}",
        },
      },
      {
        id: "advanced-tips",
        title: "更多高级技巧",
        body: [
          "以下是一些在实际使用中发现的高效技巧，可以帮助你更好地利用 Stellara Work。",
        ],
        table: {
          headers: ["技巧", "说明", "适用场景"],
          rows: [
            ["增量修改", "每次只修改一个小目标，验证后再继续", "复杂重构"],
            ["对比验证", "让 Agent 在修改前后分别运行测试", "关键功能"],
            ["回退策略", "在修改前要求 Agent 说明如何回退", "高风险改动"],
            ["并行任务", "在不同会话中处理独立的子任务", "多模块项目"],
          ],
        },
      },
    ],
    related: ["plan-build", "models", "skills"],
  },
  {
    id: "best-practices",
    group: "高级指南",
    title: "最佳实践",
    summary: "从任务编写到项目管理，掌握高效使用 Stellara Work 的核心原则。",
    icon: "shield",
    readTime: "14 分钟",
    updated: "2026-08-02",
    keywords: ["最佳实践", "任务编写", "项目组织", "安全", "性能", "效率"],
    sections: [
      {
        id: "task-writing",
        title: "任务编写最佳实践",
        body: [
          "好的任务描述是高效协作的基础。明确的目标、清晰的边界和可验证的验收标准，能让 Agent 更准确地理解你的意图，减少反复确认的时间。",
          "避免模糊的描述如\"优化代码\"或\"修复 bug\"。应该具体说明优化什么（性能？可读性？）、修复哪个 bug（错误信息？复现步骤？）。",
        ],
        bullets: [
          { title: "具体目标", detail: "\"修复登录页提交后 500 错误\"比\"修复登录问题\"更清晰。" },
          { title: "明确边界", detail: "\"只修改 src/auth 目录\"比\"修改相关文件\"更安全。" },
          { title: "可验证标准", detail: "\"登录成功后跳转首页\"比\"登录正常\"更可测。" },
          { title: "提供上下文", detail: "附上错误信息、相关文件路径或复现步骤。" },
          { title: "说明优先级", detail: "如果有多个目标，说明哪个最重要。" },
        ],
        code: {
          label: "好的任务描述示例",
          content: "目标：修复用户登录后无法跳转的问题。\n范围：只修改 src/auth 和 src/pages/login 相关文件。\n上下文：错误发生在点击登录按钮后，控制台显示 500 错误。\n要求：先定位根因，再实现修复；保留现有错误提示逻辑。\n验收：登录成功后跳转到 /dashboard，失败时显示错误信息。",
        },
      },
      {
        id: "project-organization",
        title: "项目组织策略",
        body: [
          "合理组织项目和会话可以提高长期工作的效率。建议按功能模块或工作类型创建项目，将会话归类到对应项目中。",
          "项目命名应简洁明了，能够一眼看出内容。例如\"用户认证重构\"比\"项目1\"更有意义。",
        ],
        table: {
          headers: ["组织维度", "示例", "优点"],
          rows: [
            ["按功能模块", "用户认证、支付系统、内容管理", "相关会话集中，便于查找"],
            ["按工作类型", "Bug 修复、新功能、重构", "区分工作性质，便于统计"],
            ["按时间周期", "Sprint 1、Q3 计划", "与项目管理周期对齐"],
            ["按优先级", "紧急修复、计划任务", "快速定位高优先级工作"],
          ],
        },
      },
      {
        id: "security-practices",
        title: "安全使用准则",
        body: [
          "安全是使用 AI 工具时不可忽视的问题。保护密钥、审查操作、控制数据外发，是每个用户应该养成的习惯。",
          "定期检查审批记录，确保所有敏感操作都经过了人工确认。对于不确定的操作，宁可拒绝也不盲目允许。",
        ],
        checklist: [
          "API Key 不提交到 Git 或公共平台",
          "定期在服务商控制台轮换密钥",
          "审批时仔细检查文件路径和命令参数",
          "不将敏感代码或数据发送给不可信的模型服务",
          "使用完后及时关闭应用，避免长时间暴露密钥",
          "定期备份重要会话和配置",
        ],
      },
      {
        id: "performance-tips",
        title: "性能优化建议",
        body: [
          "合理配置上下文窗口、优化工作目录范围、控制会话长度，可以显著提升使用体验。",
          "避免在一次会话中处理过多无关任务。每个会话专注于一个明确的目标，完成后新建会话处理下一个任务。",
        ],
        bullets: [
          { title: "上下文窗口", detail: "根据任务复杂度选择合适的窗口大小，不要盲目选择最大值。" },
          { title: "工作目录", detail: "选择项目根目录，避免包含大量无关文件（如 node_modules）。" },
          { title: "会话长度", detail: "长会话会降低响应速度，建议定期新建会话。" },
          { title: "模型选择", detail: "简单任务用小模型，复杂任务用大模型，避免不必要的开销。" },
          { title: "批量操作", detail: "相似的修改合并到一次会话中处理，减少上下文切换。" },
        ],
      },
      {
        id: "collaboration",
        title: "团队协作建议",
        body: [
          "在团队环境中使用 Stellara Work，需要注意数据安全、知识共享和工作流标准化。",
          "可以将常用的 Skill 文件提交到项目仓库中，让团队成员共享。但要确保 Skill 中不包含个人配置或敏感信息。",
        ],
        bullets: [
          { title: "Skill 共享", detail: "将通用 Skill 提交到项目仓库，团队成员自动加载。" },
          { title: "会话导出", detail: "重要决策的会话可以导出为文档，供团队参考。" },
          { title: "配置标准化", detail: "团队统一使用相同的模型配置和工作目录设置。" },
          { title: "安全审计", detail: "定期检查团队成员的审批记录和数据外发情况。" },
        ],
      },
    ],
    related: ["first-task", "approvals", "advanced-usage"],
  },
  {
    id: "changelog",
    group: "参考",
    title: "版本记录",
    summary: "版本变更记录：v0.9.2 的新增、变更、安全修复和已知限制。",
    icon: "rocket",
    readTime: "12 分钟",
    updated: "2026-08-28",
    keywords: ["版本", "变更", "changelog", "v0.9.2", "发布", "新功能", "限制", "已知问题"],
    sections: [
      {
        id: "v092-changes",
        title: "v0.9.2（2026-08-28）",
        body: [
          "Stellara Work v0.9.2 在 v0.9.1 基础上重构了模型连接层并加入统一的克制动效系统。内置模型全部切换到 Responses API，同时为自定义模型新增 Anthropic Messages 协议支持。",
          "任务上下文由 Context Hub 统一管理，支持检查点、验证证据与过期检测；子代理调度改为会话级协调，按研究/构建/验证角色并发执行。界面新增深色/浅色主题工作台与受控动效，历史记录保持静态，只有实时条目播放进入动画。",
        ],
        table: {
          headers: ["类别", "功能", "说明"],
          rows: [
            ["模型", "Responses API", "内置模型统一使用 Responses API，无旧协议回退"],
            ["模型", "Anthropic Messages", "自定义模型可选 Anthropic Messages 并走完整 Agent 工具循环"],
            ["模型", "协议自动识别", "统一自定义模型配置，连接时自动识别协议"],
            ["模型", "新增预设", "DeepSeek-V4-Flash、Qwen3.8-Max、GLM-5.3"],
            ["上下文", "Context Hub", "检查点、验证证据、过期检测与修订号追踪"],
            ["子代理", "会话级协调", "研究/构建/验证角色并发，会话作用域管理"],
            ["工具", "执行上下文", "工具调用携带会话/修订/计划步骤审计信息"],
            ["界面", "克制动效系统", "菜单、页面、弹窗、状态与微交互统一动效契约"],
            ["界面", "主题工作台", "浅色/深色/跟随系统，协议徽章与实时上下文修订"],
            ["界面", "任务门禁", "工作区检查点与任务门禁语义（阻塞/就绪）"],
            ["性能", "合成器友好动效", "进度条使用 scaleX transform，仅 opacity/transform/颜色/边框/阴影"],
            ["无障碍", "状态语义", "审批/错误/验证节点即时 alert/status/alertdialog 语义"],
            ["无障碍", "减弱动效", "系统减弱动效偏好下立即完成过渡并停用循环"],
          ],
        },
      },
      {
        id: "v091-changes",
        title: "v0.9.1（2026-08-18）",
        body: [
          "Stellara Work v0.9.1 是首个公开版本，提供本地优先的 Codex 风格桌面 Agent 体验。此版本涵盖 AI 辅助编程的完整工作流：流式对话、Plan/Build 双模式、文件操作、命令执行、项目管理和安全审批。",
          "所有用户数据（配置、密钥、会话、记忆）保存在本机，不依赖 Stellara 云端服务。应用支持 Windows（x64）和 macOS（Apple Silicon）两个平台。",
        ],
        table: {
          headers: ["类别", "功能", "说明"],
          rows: [
            ["核心", "AI 聊天与流式输出", "SSE 流式传输，实时 Markdown 渲染"],
            ["核心", "Plan / Build 双模式", "Plan 只读分析，Build 全工具执行"],
            ["核心", "文件操作", "read_file / write_file / edit_file，路径受工作目录约束"],
            ["核心", "搜索工具", "search_files / search_content / search_symbol"],
            ["核心", "Shell 命令", "run_command，白名单限制，无 Shell 执行"],
            ["核心", "Git 只读操作", "git_status / git_diff / git_log"],
            ["核心", "Web 抓取", "web_fetch，内置 SSRF 防护"],
            ["模型", "四个内置中文预设", "GLM-5.2、DeepSeek-v4-Pro、Kimi-K3、MiniMax-M3"],
            ["模型", "自定义 OpenAI 兼容端点", "支持任意 OpenAI Chat Completions API"],
            ["模型", "多模型配置与切换", "每个配置独立保存 Key 和上下文窗口"],
            ["模型", "上下文窗口管理", "256K/512K/1M 三档，90% 自动压缩"],
            ["会话", "项目分组", "会话按项目组织，支持「未分组」"],
            ["会话", "会话导出", "导出为 JSON 文件，支持备份和迁移"],
            ["会话", "上下文压缩", "超过 90% 阈值自动摘要化历史消息"],
            ["安全", "操作审批", "写入和命令操作需用户确认，单次授权"],
            ["安全", "命令白名单", "只允许安全的开发命令，破坏性命令被禁止"],
            ["安全", "工作目录边界", "所有路径受工作目录约束，防止越界"],
            ["安全", "渲染进程沙箱", "nodeIntegration: false, contextIsolation: true, sandbox: true"],
            ["安全", "密钥加密", "macOS Keychain / Windows DPAPI 加密存储"],
            ["界面", "无边框窗口", "两个平台均移除系统标题栏"],
            ["界面", "三栏布局", "左侧导航、中间聊天、右侧工作区检查器"],
            ["界面", "首页仪表盘", "任务输入、附件拖拽、快捷任务、继续工作"],
            ["界面", "Diff 卡片", "CodeMirror MergeView 并排对比"],
            ["界面", "Shell 卡片", "命令输出展示，支持行号和复制"],
            ["界面", "悬停预览", "文件路径悬停 300ms 弹出预览"],
            ["界面", "深色/浅色/跟随系统", "三种主题模式"],
            ["界面", "侧栏 / Tab 两种模式", "可切换的导航模式"],
            ["扩展", "Skills 自定义工作流", "JSON/Markdown 格式，斜杠命令调用"],
            ["扩展", "MCP 服务器集成", "stdio 和 HTTP 传输，工具自动发现"],
            ["扩展", "记忆中心", "跨会话持久记忆，FTS5 全文搜索"],
            ["扩展", "子代理调度", "最多 10 并行，20 总数上限"],
            ["效率", "命令面板", "Ctrl+K 模糊搜索，中英文混合"],
            ["效率", "17 个默认快捷键", "可自定义录制，即时保存"],
            ["效率", "附件支持", "拖拽文件和图片，内联渲染"],
          ],
        },
      },
      {
        id: "v090-security",
        title: "v0.9.1 安全改进",
        body: [
          "v0.9.1 在安全方面做了多项改进，确保用户数据和操作的安全性。",
        ],
        bullets: [
          { title: "API Key 加密", detail: "使用 OS Keychain（macOS safeStorage）/ DPAPI（Windows）加密存储。加密后的密钥以 enc:v1: 前缀存储在 .env 文件中。" },
          { title: "渲染进程隔离", detail: "渲染界面无法通过 IPC 获取裸密钥。模型列表和诊断信息只暴露「是否已配置 Key」的布尔值。" },
          { title: "明文 Key 自动迁移", detail: "应用启动时自动检测 .env 中的明文 Key（无 enc:v1: 前缀），自动加密重写。" },
          { title: "附件字段过滤", detail: "附件字段从 LLM 请求体中剥离，兼容严格网关。" },
        ],
        note: {
          tone: "success",
          title: "安全设计",
          body: "密钥只在主进程中使用，不通过 IPC 传给渲染界面。即使网页中注入了恶意脚本，也无法读取你的 API Key。",
        },
      },
      {
        id: "v090-fixes",
        title: "v0.9.1 修复",
        body: [
          "v0.9.1 修复了以下问题：",
        ],
        bullets: [
          { title: "无边框窗口控件重复", detail: "修复了无边框窗口上控件重复显示的问题。" },
          { title: "附件泄漏", detail: "修复了附件字段泄漏到 LLM 请求体的问题。" },
          { title: "设置窗口迁移", detail: "设置从独立窗口迁移到应用内覆盖面板。" },
          { title: "窗口控制统一", detail: "移除系统窗口控件，两个平台统一通过 Cmd+Q / 应用菜单关闭。" },
        ],
      },
      {
        id: "v08x-history",
        title: "v0.8.x 及更早版本",
        body: [
          "v0.9.0 之前的开发迭代分为多个工作周（Work Week），逐步构建了后端 Agent 循环、桌面 Shell、聊天 UI 和本地数据层。",
        ],
        table: {
          headers: ["阶段", "内容", "关键产出"],
          rows: [
            ["W1", "后端 Agent 循环", "Agent 循环、工具实现、LLM 客户端"],
            ["W2", "桌面 Shell + 聊天 UI", "流式聊天、Plan 模式 + 审批门禁、Diff/Shell 卡片、命令面板"],
            ["W3", "本地数据", "引导流程、设置、会话持久化与恢复、上下文压缩、NSIS 打包"],
          ],
        },
      },
      {
        id: "known-limitations",
        title: "已知限制",
        body: [
          "v0.9.1 存在以下已知限制，将在后续版本中逐步改进。了解这些限制可以帮助你更好地规划使用方式。",
        ],
        table: {
          headers: ["限制", "说明", "临时方案"],
          rows: [
            ["平台覆盖", "Windows x64 + macOS Apple Silicon；暂无 Linux 版本，不支持 Intel Mac", "Linux 用户可关注官方发布渠道"],
            ["安装包签名", "安装包未经代码签名，macOS 需右键打开，Windows 需 SmartScreen 放行", "核对 SHA-256 校验值确认来源"],
            ["云同步", "不支持跨设备云同步", "手动备份和迁移数据目录"],
            ["加密密钥迁移", "加密的 API Key 绑定到设备用户账户，跨设备无法解密", "在新设备上重新配置 API Key"],
            ["界面语言", "界面主要支持中文，部分技术术语使用英文", "—"],
            ["插件系统", "暂不支持第三方插件扩展（MCP 提供部分扩展能力）", "使用 Skills 和 MCP 服务器扩展"],
            ["多行命令", "run_command 不支持管道、重定向和 Shell 特殊字符", "拆分为多个独立的 run_command 调用"],
            ["破坏性命令", "rm、mv、cp、del 等破坏性命令不在白名单中", "通过 Agent 的文件操作工具（write_file/edit_file）实现"],
          ],
        },
        note: {
          tone: "info",
          title: "反馈渠道",
          body: "如果你遇到问题或有改进建议，欢迎通过官方 GitHub 仓库反馈。提交问题时请附上脱敏后的诊断信息和日志片段。",
        },
      },
    ],
    related: ["install-setup", "faq"],
  },
  {
    id: "glossary",
    group: "参考",
    title: "术语表",
    summary: "按类别解释文档中使用的核心概念、功能术语和技术术语。",
    icon: "help",
    readTime: "12 分钟",
    updated: "2026-08-19",
    keywords: ["术语", "概念", "定义", "Agent", "Token", "上下文", "模型", "Electron", "SQLite", "MCP", "Skills"],
    sections: [
      {
        id: "core-concepts",
        title: "核心概念",
        body: [
          "以下是理解 Stellara Work 所需的核心术语。掌握这些概念有助于更高效地使用产品和阅读文档。",
        ],
        table: {
          headers: ["术语", "英文", "定义"],
          rows: [
            ["Agent", "Agent", "AI 代理，能够理解任务描述、自主选择工具、调用模型并生成响应的智能体。Stellara Work 的核心交互对象。"],
            ["API Key", "API Key", "模型服务商提供的密钥，用于身份验证和访问控制。Stellara Work 使用 enc:v1: 前缀加密存储，仅主进程可读。"],
            ["Build 模式", "Build Mode", "执行模式。Agent 拥有全部工具权限，可以读取、修改文件、执行命令和访问外部资源。所有写入操作需用户审批。"],
            ["Plan 模式", "Plan Mode", "只读分析模式。Agent 只能调用只读工具（read_file、search_files 等），分析需求并输出有序执行计划，末尾以 READY TO EXECUTE 标记就绪。"],
            ["上下文窗口", "Context Window", "模型单次请求能处理的最大 token 数。Stellara Work 提供 256K、512K、1M 三档选项，默认 256K。"],
            ["Token", "Token", "文本的基本单位。一个中文字约 1-2 个 token，一个英文单词约 1 个 token。使用 tiktoken cl100k_base 编码估算。"],
            ["Provider", "Provider", "模型服务商，提供 OpenAI 兼容 API 端点。内置预设包括智谱（GLM）、DeepSeek、月之暗面（Kimi）和 MiniMax。"],
            ["Base URL", "Base URL", "模型服务的 API 端点地址。例如 https://api.deepseek.com。是否包含 /v1 路径由服务商决定。"],
            ["工作目录", "Work Directory", "Agent 的文件操作范围根目录。所有工具的路径参数都受此约束，防止越界访问。在引导流程或设置中配置。"],
          ],
        },
        note: {
          tone: "info",
          title: "Plan 与 Build 的关系",
          body: "两种模式共享同一个会话上下文。Plan 模式中产生的调查结论和计划步骤，切到 Build 后 Agent 仍然可以访问。推荐先用 Plan 分析，再切 Build 执行。",
        },
      },
      {
        id: "feature-terms",
        title: "功能术语",
        body: [
          "这些术语描述了 Stellara Work 的具体功能模块和交互组件。",
        ],
        table: {
          headers: ["术语", "英文", "定义"],
          rows: [
            ["会话", "Session", "一次完整的对话记录，包含标题、模型配置、工作目录、所属项目、消息历史和工具调用结果。存储在本地 SQLite 数据库中。"],
            ["项目", "Project", "会话的组织分组，用于将相关会话归类管理。项目是虚拟分组，不改变磁盘目录结构。没有项目归属的会话归入「未分组」。"],
            ["Skills", "Skills", "自定义工作流模板。存储在工作目录的 skills/ 子目录中，支持 JSON 和 Markdown 两种格式。通过斜杠命令（/skill-name）或自动注入系统提示词调用。"],
            ["MCP", "Model Context Protocol", "开放协议，允许 AI 应用连接外部工具服务器。Stellara Work 作为 MCP 客户端，支持 stdio 和 HTTP 两种传输方式。"],
            ["命令面板", "Command Palette", "Ctrl+K 打开的快速命令搜索界面。支持模糊搜索和中英文混合，全程键盘操作。"],
            ["工作区检查器", "Workspace Inspector", "右侧面板，集中展示任务目标、执行进度、上下文使用率、子代理状态、交付物列表、记忆注入和工作目录文件树。"],
            ["审批", "Approval", "对敏感操作（write_file、edit_file、run_command、web_fetch、memory 等）的人工确认机制。审批顶部栏显示工具名和参数，单次授权。"],
            ["交付物", "Deliverable", "本次会话中 Agent 通过 write_file 或 edit_file 创建或修改的文件列表。显示在工作区检查器中。"],
            ["记忆中心", "Memory Center", "跨会话持久记忆系统。基于 SQLite + FTS5 全文索引，支持自动提取、语义搜索和手动管理。"],
            ["子代理", "Subagent", "通过 dispatch_subagents 工具分发的并行任务执行者。最多 10 个并行，20 个总数上限。共享工作目录但拥有独立上下文。"],
            ["Diff 卡片", "Diff Card", "当 Agent 创建或修改文件时，聊天区显示的并排对比视图。使用 CodeMirror MergeView 组件，展示修改前后的差异。"],
            ["Shell 卡片", "Shell Card", "当 Agent 执行命令时，聊天区显示的命令输出卡片。包含命令、执行时长、退出码、stdout 和 stderr。"],
          ],
        },
      },
      {
        id: "technical-terms",
        title: "技术术语",
        body: [
          "这些术语涉及 Stellara Work 的底层技术实现。了解它们有助于排查问题和理解安全模型。",
        ],
        table: {
          headers: ["术语", "英文", "定义"],
          rows: [
            ["Electron", "Electron", "基于 Chromium 和 Node.js 的桌面应用框架。Stellara Work 使用 Electron 构建跨平台桌面应用，主进程处理敏感操作，渲染进程显示界面。"],
            ["SQLite", "SQLite", "轻量级嵌入式关系数据库。Stellara Work 使用 better-sqlite3 驱动，存储项目、会话、消息和记忆数据。启用 WAL 模式和外键约束。"],
            ["数据目录", "App Data Directory", "存储所有用户数据的目录。Windows: %APPDATA%\\Stellara Work；macOS: ~/Library/Application Support/Stellara Work。旧版本使用 ~/.stellara。"],
            ["config.json", "config.json", "应用配置文件（JSON 格式），存储模型元数据（id、label、baseUrl、model、workDir、contextWindow）、活跃模型 ID、应用偏好（主题、工作区模式、快捷键）和 MCP 服务器配置。schemaVersion 为 1。"],
            [".env", ".env", "密钥存储文件，按模型 ID 存储 API Key。Key 使用 enc:v1: 前缀加密存储。文件权限 0600，仅当前用户可读写。"],
            ["SSE", "Server-Sent Events", "流式数据传输协议。模型响应通过 SSE 逐 token 传输到应用，实现实时显示生成结果。"],
            ["IPC", "Inter-Process Communication", "进程间通信。Electron 主进程和渲染进程之间通过预加载层暴露的受控 IPC 接口通信。渲染进程无法直接访问 Node.js API。"],
            ["白名单", "Allowlist", "允许 run_command 执行的程序列表。按平台区分，只包含安全的开发命令。破坏性命令（rm、mv、cp 等）不在白名单中。命令直接启动程序，不经过系统 Shell。"],
            ["safeStorage", "safeStorage", "Electron 提供的加密 API。macOS 底层使用 Keychain，Windows 底层使用 DPAPI。Stellara Work 通过 safeStorage 加密和解密 API Key。"],
            ["FTS5", "Full-Text Search 5", "SQLite 的全文搜索扩展。记忆系统使用 FTS5 实现高效的记忆检索，支持精确短语搜索和模糊匹配。查询语法错误时自动回退到 LIKE 搜索。"],
            ["contextIsolation", "Context Isolation", "Electron 安全配置。设为 true 时，预加载脚本与页面脚本运行在隔离的上下文中，防止页面脚本访问预加载层暴露的 API。"],
            ["WAL", "Write-Ahead Logging", "SQLite 的日志模式。启用后提高并发读写性能，数据写入先记录到 WAL 文件（stellara.db-wal），再批量同步到主数据库。"],
          ],
        },
        code: {
          label: "数据目录结构",
          content: "%APPDATA%\\Stellara Work\\          (Windows)\n~/Library/Application Support/Stellara Work\\  (macOS)\n├── config.json          应用配置（schemaVersion: 1）\n├── config.json.bak      配置备份\n├── .env                 加密 API Key（enc:v1: 前缀）\n├── stellara.db          SQLite 数据库（项目、会话、消息、记忆）\n├── stellara.db-wal      WAL 日志\n├── stellara.db-shm      共享内存\n└── logs/                应用运行日志",
        },
      },
      {
        id: "model-terms",
        title: "模型相关术语",
        body: [
          "这些术语与 AI 模型配置和 API 交互相关。",
        ],
        table: {
          headers: ["术语", "定义"],
          rows: [
            ["GLM-5.2", "智谱 BigModel 的大语言模型。Base URL: https://open.bigmodel.cn/api/paas/v4"],
            ["DeepSeek-v4-Pro", "DeepSeek 的大语言模型。Base URL: https://api.deepseek.com"],
            ["Kimi-K3", "月之暗面 Moonshot 的大语言模型。Base URL: https://api.moonshot.cn"],
            ["MiniMax-M3", "MiniMax 的大语言模型。Base URL: https://api.minimaxi.com/v1"],
            ["OpenAI 兼容", "遵循 OpenAI Chat Completions API 格式的服务端点。Stellara Work 支持接入任何兼容此协议的端点，包括本地部署和自定义网关。"],
            ["流式输出", "模型逐 token 生成响应的方式。通过 SSE 传输，用户可以实时看到输出过程，而不需要等待完整回复。"],
            ["上下文压缩", "当消息累积的 token 数超过上下文窗口的 90% 时，自动将早期消息摘要化为一条摘要，保留 system 消息和最近 12 轮对话。"],
            ["tiktoken", "OpenAI 的 token 计数库。Stellara Work 使用 cl100k_base 编码估算消息 token 数。加载失败时回退到字符数/4 的粗估方式。"],
            ["活跃模型", "当前选中的模型配置，决定新会话使用的默认配置。可通过设置面板、聊天区或命令面板切换。"],
          ],
        },
      },
      {
        id: "security-terms",
        title: "安全相关术语",
        body: [
          "这些术语与 Stellara Work 的安全模型和防护机制相关。",
        ],
        table: {
          headers: ["术语", "定义"],
          rows: [
            ["渲染进程沙箱", "Electron 渲染进程的多层安全隔离：nodeIntegration: false（禁用 Node.js API）、contextIsolation: true（隔离上下文）、sandbox: true（Chrome 沙箱）、webSecurity: true（同源策略）。"],
            ["单次授权", "审批机制的特性。允许后只放行当前请求，不会建立对该工具、路径或会话的永久授权。每次写入操作都需要独立确认。"],
            ["路径安全", "所有工具的路径参数经过字符串检查和真实路径验证（含 symlink 检查），确保不越出工作目录。绝对路径和 .. 越界会被拒绝。"],
            ["SSRF 防护", "web_fetch 工具的安全机制。DNS 解析后检查所有 IP，自动拒绝 localhost、私网地址（10.x、172.16.x、192.168.x）和云元数据地址（169.254.x）。"],
            ["密钥加密", "API Key 使用 OS Keychain（macOS）/ DPAPI（Windows）加密。加密后的密钥以 enc:v1: 前缀存储在 .env 文件中，只有主进程可以解密。"],
            ["诊断信息脱敏", "诊断信息不包含 API Key 或会话正文。模型列表只暴露「是否已配置 Key」的布尔值。"],
          ],
        },
        checklist: [
          "审批机制确保每次写入操作都经过人工确认",
          "命令白名单限制 Agent 只能执行安全的开发命令",
          "工作目录边界防止 Agent 访问项目外的文件",
          "渲染进程沙箱隔离界面代码和系统资源",
          "密钥加密保护 API Key 不被未授权访问",
        ],
      },
    ],
    related: ["install-setup", "faq", "troubleshooting"],
  },
];

export const docGroups = Array.from(new Set(docArticles.map((article) => article.group)));

export function getDocArticle(id: string) {
  return docArticles.find((article) => article.id === id);
}

export function getArticleSearchText(article: DocArticle) {
  return [
    article.title,
    article.summary,
    article.group,
    ...article.keywords,
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.body,
      ...(section.steps?.flatMap((step) => [step.title, step.detail]) ?? []),
      ...(section.bullets?.flatMap((item) => [item.title, item.detail]) ?? []),
      ...(section.table?.headers ?? []),
      ...(section.table?.rows.flat() ?? []),
      ...(section.checklist ?? []),
      ...(Array.isArray(section.code) ? section.code.map(c => c.content) : [section.code?.content ?? ""]),
      section.note?.title ?? "",
      section.note?.body ?? "",
    ]),
  ].join(" ").toLowerCase();
}
