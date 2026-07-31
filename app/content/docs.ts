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
  code?: { label: string; content: string };
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
    group: "开始使用",
    title: "安装与首次配置",
    summary: "了解当前发布范围，完成模型连接和工作目录设置。",
    icon: "rocket",
    readTime: "8 分钟",
    updated: "2026-07-31",
    keywords: ["安装", "Windows", "x64", "首次启动", "引导", "API Key", "工作目录", "连接测试"],
    sections: [
      {
        id: "requirements",
        title: "发布范围与安装前准备",
        body: [
          "Stellara Work v0.9 当前面向 Windows x64。安装器采用可选择安装位置的 NSIS 向导，并会创建开始菜单与桌面快捷方式。项目尚未发布明确的最低 Windows 版本，因此文档不会虚构系统版本门槛。",
          "应用本身不要求注册 Stellara 云端账号，但需要一个受支持模型服务的 API Key，以及一个你允许 Agent 读取和修改的本地工作目录。",
        ],
        checklist: [
          "Windows x64 电脑",
          "GLM、DeepSeek、Kimi、MiniMax 或 OpenAI 兼容服务的 API Key",
          "一个明确、可备份的项目文件夹",
          "可访问所选模型服务的网络连接",
        ],
        note: {
          tone: "warning",
          title: "当前下载状态",
          body: "公开安装包暂未上传，下载页会显示“下载通道准备中”。在正式开放前，请勿从非官方来源获取同名安装程序。",
        },
      },
      {
        id: "wizard",
        title: "两步完成首次引导",
        body: [
          "首次启动会进入两页引导。第一页选择模型预设，第二页填写 API Key 并选择工作目录。内置预设会自动填充 Base URL 和模型名称；只有“自定义模型”需要手动填写这两项。",
        ],
        steps: [
          { title: "选择模型", detail: "从四个内置预设或“自定义模型（OpenAI 兼容）”中选择一个。" },
          { title: "选择工作目录", detail: "点击“浏览…”，选择本次工作的项目根目录。文件和命令能力会受该目录约束。" },
          { title: "填写 API Key", detail: "输入对应模型服务商提供的密钥；重新配置时留空可保留旧密钥。" },
          { title: "完成连接测试", detail: "应用先请求模型服务验证配置，成功后才保存并进入主界面。" },
        ],
      },
      {
        id: "connection-failed",
        title: "连接测试失败时",
        body: [
          "测试失败并不代表本地项目有问题。优先核对 API Key、Base URL 和网络，再检查模型名称是否与服务商实际开放的标识完全一致。自定义端点通常还需要保留服务端要求的版本路径。",
        ],
        table: {
          headers: ["现象", "先检查", "下一步"],
          rows: [
            ["API Key 无效 / 401 / 403", "密钥是否复制完整、是否过期", "重新填写 Key 后再次测试"],
            ["模型不存在 / 404", "模型 ID 的大小写和拼写", "使用服务商控制台显示的精确模型名"],
            ["网络失败", "网络、代理、Base URL", "确认端点可访问且协议为 HTTPS/HTTP"],
            ["连接成功但保存失败", "数据目录是否可写", "打开主日志，保留错误信息后重试"],
          ],
        },
      },
    ],
    related: ["models", "workdir-tools", "troubleshooting"],
  },
  {
    id: "first-task",
    group: "开始使用",
    title: "完成第一项任务",
    summary: "把目标、边界和验收条件写进任务，让执行过程更可控。",
    icon: "message",
    readTime: "7 分钟",
    updated: "2026-07-31",
    keywords: ["任务", "提示词", "需求", "验收", "发送", "停止", "重试", "第一个任务"],
    sections: [
      {
        id: "prompt-structure",
        title: "一条高质量任务应包含什么",
        body: [
          "Stellara Work 会读取项目、调用工具并持续保存会话，但它仍需要清楚的目标。把“要得到什么”“允许改哪里”“怎样算完成”放在同一条任务里，通常比只写一句“帮我优化”更稳定。",
        ],
        bullets: [
          { title: "目标", detail: "说明最终结果，例如修复登录错误、补充测试或生成发布说明。" },
          { title: "上下文", detail: "指出相关目录、技术栈、报错信息或必须遵守的现有约定。" },
          { title: "边界", detail: "明确不允许修改的区域、是否可执行命令、是否只做分析。" },
          { title: "验收", detail: "列出构建、测试、页面行为或输出格式等可验证标准。" },
        ],
        code: {
          label: "任务模板",
          content: "目标：修复登录页提交后无响应的问题。\n范围：只修改 src/auth 与相关测试，不改接口协议。\n要求：先定位根因，再实现修复；保留现有错误提示。\n验收：登录成功可跳转、失败有提示、相关测试通过。",
        },
      },
      {
        id: "choose-mode",
        title: "先决定使用 Plan 还是 Build",
        body: [
          "如果需求复杂、涉及多个文件或你还不确定改法，先切到 Plan 模式。它只能读取、搜索和查看 Git 信息，会先形成步骤；准备执行时再回到 Build 模式。简单且范围明确的任务可以直接在 Build 模式开始。",
        ],
        note: {
          tone: "info",
          title: "建议",
          body: "“先分析并给出计划，暂时不要改文件”适合风险较高的任务；“实现并验证”才表示允许进入实际修改阶段。",
        },
      },
      {
        id: "during-run",
        title: "执行中如何判断进展",
        body: [
          "消息流会显示模型输出、工具调用和结果。右侧工作区同步汇总目标、进度、交付物和文件；遇到写入、命令或外部请求时，顶部会出现审批条。你可以拒绝不符合预期的动作，也可以中止当前生成后补充要求。",
        ],
        checklist: [
          "工具目标是否位于预期工作目录",
          "写入前是否已经读取并理解现有文件",
          "审批栏中的工具名和参数是否合理",
          "完成后是否运行了与改动匹配的检查",
          "最终回复是否说明改了什么、验证了什么",
        ],
      },
      {
        id: "follow-up",
        title: "用追问收敛结果",
        body: [
          "不需要为每次补充都新建会话。当前会话保留上下文，适合继续要求解释某个改动、补测试或调整实现。只有当目标完全不同、上下文已混杂，或需要切换独立项目时，再新建会话更清晰。",
        ],
      },
    ],
    related: ["plan-build", "workspace-inspector", "approvals"],
  },
  {
    id: "interface-tour",
    group: "开始使用",
    title: "界面导览",
    summary: "快速认识会话区、聊天区、工作区和设置入口。",
    icon: "layout",
    readTime: "6 分钟",
    updated: "2026-07-31",
    keywords: ["界面", "侧栏", "标签页", "聊天", "输入框", "工作区", "主题"],
    sections: [
      {
        id: "regions",
        title: "三个主要区域",
        body: [
          "默认工作界面由左侧会话区、中间聊天区和右侧工作区组成。应用设置可将会话导航改为顶部 Tab 模式；左右两侧面板也都可以独立隐藏，为正文留出更多空间。",
        ],
        table: {
          headers: ["区域", "主要用途", "常用操作"],
          rows: [
            ["会话区", "按项目组织历史任务", "搜索、新建、重命名、导出、删除"],
            ["聊天区", "输入任务并查看流式结果", "发送、中止、审批、切换模型/模式"],
            ["工作区", "汇总任务执行状态", "查看步骤、进度、交付物和文件树"],
          ],
        },
      },
      {
        id: "navigation-modes",
        title: "侧栏模式与 Tab 模式",
        body: [
          "侧栏模式适合项目和会话较多的长期工作；Tab 模式更像编辑器，适合同时切换少量活跃任务。关闭 Tab 只会关闭当前视图，不会删除数据库中的会话；可用 Ctrl+Shift+T 恢复最近关闭的标签页。",
        ],
      },
      {
        id: "theme-layout",
        title: "主题与布局偏好",
        body: [
          "设置 → 应用提供浅色、深色和跟随系统三种主题，并允许设置默认工作目录和工作区模式。布局偏好会保存在本地配置中，在下一次启动时继续生效。",
        ],
      },
    ],
    related: ["projects-sessions", "app-settings", "shortcuts"],
  },
  {
    id: "projects-sessions",
    group: "工作流",
    title: "项目、会话与标签页",
    summary: "组织长期工作，理解删除、关闭、导出和恢复之间的区别。",
    icon: "folders",
    readTime: "10 分钟",
    updated: "2026-07-31",
    keywords: ["项目", "会话", "标签页", "未分组", "重命名", "删除", "导出 JSON", "恢复"],
    sections: [
      {
        id: "project-model",
        title: "项目是会话的组织层",
        body: [
          "项目用于把相关会话放在一起。左侧栏会显示每个项目的会话数量，并为没有项目归属的会话提供“未分组”区域。项目不会改变磁盘目录结构，也不会替代会话自己的工作目录。",
        ],
        bullets: [
          { title: "新建项目", detail: "创建一个命名分组，随后可直接在该项目中创建会话。" },
          { title: "重命名项目", detail: "只更新分组名称，不改变会话内容。" },
          { title: "删除项目", detail: "项目记录被移除，其中的会话会保留并转入“未分组”。" },
        ],
        note: {
          tone: "success",
          title: "删除边界",
          body: "删除项目不会删除其会话，这一操作用于整理导航，不等同于清除聊天记录。",
        },
      },
      {
        id: "session-lifecycle",
        title: "会话的完整生命周期",
        body: [
          "每个会话保存标题、模型、工作目录、所属项目、消息数量和时间信息。列表按最近更新排序；在没有新增消息的情况下，普通保存不会无意义地把旧会话顶到最前。",
        ],
        steps: [
          { title: "创建", detail: "从侧栏、项目菜单或命令面板创建一个空会话。" },
          { title: "工作", detail: "消息和工具结果持续写入本地数据库，关闭应用后仍可继续。" },
          { title: "整理", detail: "按标题搜索、内联重命名，或移动到更合适的项目。" },
          { title: "归档", detail: "需要共享或留档时导出 JSON；导出不会删除原会话。" },
          { title: "删除", detail: "删除会话会同时删除其消息，属于不可恢复操作。" },
        ],
      },
      {
        id: "close-vs-delete",
        title: "关闭标签页不等于删除会话",
        body: [
          "在 Tab 模式按 Ctrl+W 只关闭当前标签页，会话仍然保存在本地。Ctrl+Shift+T 可恢复最近关闭的标签页。只有执行“删除会话”并确认后，会话及其消息才会从数据库移除。",
        ],
        table: {
          headers: ["操作", "会话是否保留", "消息是否保留", "能否恢复"],
          rows: [
            ["关闭标签页", "是", "是", "Ctrl+Shift+T 或重新打开"],
            ["删除项目", "是，移到未分组", "是", "项目需重新创建"],
            ["删除会话", "否", "否", "应用内不可恢复"],
            ["清空所有数据", "否", "否", "只能依赖外部备份"],
          ],
        },
      },
      {
        id: "search-export",
        title: "搜索与导出",
        body: [
          "侧栏搜索按会话标题过滤，并会展开命中的项目组。若需要在应用外审计或保存对话，使用会话导出生成 JSON。导出的记录可能包含任务文本、模型回复和工具结果，分享前应检查是否含有项目敏感信息。",
        ],
      },
    ],
    related: ["interface-tour", "local-data", "command-palette"],
  },
  {
    id: "plan-build",
    group: "工作流",
    title: "Plan 与 Build 模式",
    summary: "先只读分析，再按清晰计划执行；理解两种模式的能力边界。",
    icon: "plan",
    readTime: "9 分钟",
    updated: "2026-07-31",
    keywords: ["Plan", "Build", "计划模式", "只读", "READY TO EXECUTE", "步骤", "执行模式"],
    sections: [
      {
        id: "comparison",
        title: "两种模式的差异",
        body: [
          "Plan 模式用于调查和设计方案，Build 模式用于实际执行。Plan 模式不是一句提示词约定，而是工具层面的限制：它不会获得写文件、执行命令、外部抓取或记忆工具。",
        ],
        table: {
          headers: ["能力", "Plan 模式", "Build 模式"],
          rows: [
            ["读取文件 / 搜索内容 / 目录树", "允许", "允许"],
            ["Git status / diff / log", "允许，只读", "允许，只读"],
            ["写入或编辑文件", "不提供", "提供，需审批"],
            ["执行命令", "不提供", "提供，需审批且受白名单限制"],
            ["HTTP GET", "不提供", "提供，需审批"],
            ["输出执行计划", "主要目标", "可按计划执行"],
          ],
        },
      },
      {
        id: "plan-flow",
        title: "推荐的计划工作流",
        body: [
          "复杂任务先在 Plan 模式里定位文件、阅读关键实现并列出有序步骤。计划中的编号步骤会进入工作区，执行阶段可按待做、进行中和已完成跟踪。",
        ],
        steps: [
          { title: "描述目标与限制", detail: "说明希望得到的结果，以及当前阶段禁止修改。" },
          { title: "允许只读调查", detail: "让 Agent 搜索文件、读取相关代码并查看 Git 现状。" },
          { title: "审核计划", detail: "检查每一步的理由、涉及文件和验证方法。" },
          { title: "切回 Build", detail: "确认计划后再允许修改；执行中继续通过审批控制动作。" },
          { title: "核对交付", detail: "根据工作区步骤和最终验证结果判断是否完成。" },
        ],
      },
      {
        id: "verification",
        title: "修改后的自动验证引导",
        body: [
          "Build 模式要求先读后改、改完重读。写入或编辑成功后，Agent 会收到重新读取目标文件的验证提示；命令失败时，还会针对 TypeScript、测试退出码、文件不存在、JSON、权限、磁盘、语法、端口、Git 和精确替换失败等情况获得修复建议。",
        ],
        note: {
          tone: "warning",
          title: "验证不是绝对保证",
          body: "自动重读和测试能降低错误概率，但不能替代你的代码审查、业务验收和外部备份。",
        },
      },
    ],
    related: ["first-task", "workspace-inspector", "workdir-tools"],
  },
  {
    id: "workspace-inspector",
    group: "工作流",
    title: "右侧工作区检查器",
    summary: "在一个面板里查看目标、执行进度、交付物和文件树。",
    icon: "workspace",
    readTime: "7 分钟",
    updated: "2026-07-31",
    keywords: ["工作区", "检查器", "目标", "进度", "交付物", "文件树", "步骤状态"],
    sections: [
      {
        id: "four-sections",
        title: "四个信息区",
        body: [
          "工作区是任务状态的摘要，不需要从长消息流中反复寻找关键信息。四个区域默认展开，也可以分别折叠。",
        ],
        bullets: [
          { title: "目标", detail: "有计划时显示计划步骤，否则显示本次任务的首条用户消息。" },
          { title: "进度", detail: "Plan 任务按完成步骤计算；普通任务按已完成工具调用计算。" },
          { title: "交付物", detail: "列出本次会话通过 write_file 或 edit_file 写过的文件。" },
          { title: "文件", detail: "展示工作目录树，并标出当前任务触碰过的文件。" },
        ],
      },
      {
        id: "step-status",
        title: "手动校正计划步骤状态",
        body: [
          "计划步骤支持鼠标点击或键盘 Enter/Space 切换状态，顺序为“待做 → 完成 → 失败”。这适合在自动匹配没有准确判断步骤时手动校正。进度百分比只把“完成”计入已完成数量。",
        ],
      },
      {
        id: "deliverables",
        title: "如何理解交付物列表",
        body: [
          "交付物列表表示 Agent 在本次会话中执行过写入或精确编辑，并不等同于最终可发布产物，也不会自动判断文件内容是否正确。结合 Git diff、测试结果和实际运行检查，才能完成验收。",
        ],
      },
      {
        id: "resize-toggle",
        title: "调整与隐藏工作区",
        body: [
          "工作区宽度可调整，并会作为界面偏好保留。使用 Ctrl+Shift+W 或命令面板可快速显隐右侧工作区。",
        ],
      },
    ],
    related: ["plan-build", "workdir-tools", "shortcuts"],
  },
  {
    id: "workdir-tools",
    group: "工作流",
    title: "工作目录、文件与工具",
    summary: "理解目录安全边界，以及读取、编辑、命令和 Git 工具的限制。",
    icon: "tools",
    readTime: "12 分钟",
    updated: "2026-07-31",
    keywords: ["工作目录", "工具", "read_file", "write_file", "edit_file", "run_command", "Git", "web_fetch", "白名单"],
    sections: [
      {
        id: "boundary",
        title: "工作目录是文件操作边界",
        body: [
          "读取、写入、编辑、搜索和目录树都以当前工作目录为根。路径会被规范化并检查是否越界；Shell 参数也拒绝绝对路径和解析后逃出工作目录的 `..` 路径。",
          "选择过大的目录会增加无关搜索，选择过小的目录又可能缺少依赖上下文。通常应选择仓库或独立项目的根目录。",
        ],
        note: {
          tone: "info",
          title: "切换目录",
          body: "可从模型配置或命令面板切换工作目录。切换前先确认当前任务是否依赖旧目录中的文件。",
        },
      },
      {
        id: "tool-reference",
        title: "核心工具参考",
        body: [
          "工具调用会出现在消息流中。只读工具可直接运行；会改变文件、执行命令或访问外部 URL 的工具会进入审批。",
        ],
        table: {
          headers: ["工具", "用途", "关键限制"],
          rows: [
            ["read_file", "读取文本并返回行号", "单文件最多 10 MiB；支持 offset/limit"],
            ["write_file", "新建或覆盖整个文件", "路径必须在工作目录内；覆盖前应先读取"],
            ["edit_file", "按 oldText 精确替换", "默认必须唯一匹配；replaceAll 才替换全部"],
            ["search_files / search_content", "按文件名或文本/正则定位", "适合先搜后读，减少无关读取"],
            ["list_files", "列出受限深度的目录树", "结果以工作目录为根"],
            ["run_command", "运行开发命令", "无 shell、白名单、单行、路径受限"],
            ["git_status / git_diff / git_log", "查看版本控制状态", "当前实现是只读 Git 操作"],
            ["web_fetch", "HTTP GET 获取外部内容", "Plan 模式不可用，Build 模式需审批"],
          ],
        },
      },
      {
        id: "shell-safety",
        title: "命令执行的安全限制",
        body: [
          "run_command 直接启动白名单中的可执行程序，不经过系统 shell。它只接受单行命令，拒绝管道、重定向、变量展开和 `| & ; < > ` $ ( )` 等 shell 特殊字符；del、rm、mv、cp、rmdir、move 等破坏性文件命令不在白名单。",
          "命令默认在工作目录中运行，最长可请求 300 秒超时，输出最多保留 5 MiB。复杂流水线应拆成多个可审查的工具调用。",
        ],
        code: {
          label: "可审查的命令方式",
          content: "npm test\nnpm run build\ngit status\nrg TODO src",
        },
      },
      {
        id: "review-changes",
        title: "审查文件变更",
        body: [
          "优先要求 Agent 先读后改，并在完成后说明修改文件、关键差异和验证结果。Git 项目可通过 git_status 和 git_diff 查看工作区变化；非 Git 项目也应检查工作区交付物并打开关键文件复核。",
        ],
        checklist: [
          "变更文件都在预期目录内",
          "没有覆盖用户已有但无关的修改",
          "精确编辑没有误替换多处内容",
          "构建或测试命令与项目技术栈匹配",
          "失败命令已经分析原因，而不是盲目重复",
        ],
      },
    ],
    related: ["approvals", "plan-build", "troubleshooting"],
  },
  {
    id: "models",
    group: "模型与配置",
    title: "模型与 Provider",
    summary: "添加、测试、切换和删除多个模型配置。",
    icon: "models",
    readTime: "11 分钟",
    updated: "2026-07-31",
    keywords: ["模型", "Provider", "GLM", "DeepSeek", "Kimi", "MiniMax", "OpenAI 兼容", "Base URL"],
    sections: [
      {
        id: "presets",
        title: "内置预设",
        body: [
          "v0.9 内置四个中文模型预设和一个自定义槽位。预设值来自当前应用配置；服务商可能调整模型可用性，最终以你的服务商账号权限和连接测试结果为准。",
        ],
        table: {
          headers: ["预设", "Base URL", "模型 ID"],
          rows: [
            ["GLM-5.2（智谱 BigModel）", "https://open.bigmodel.cn/api/paas/v4", "glm-5.2"],
            ["DeepSeek-v4-Pro", "https://api.deepseek.com", "deepseek-v4-pro"],
            ["Kimi-K3（月之暗面 Moonshot）", "https://api.moonshot.cn", "kimi-k3"],
            ["MiniMax-M3", "https://api.minimaxi.com/v1", "MiniMax-M3"],
            ["自定义模型", "手动填写", "手动填写"],
          ],
        },
      },
      {
        id: "add-model",
        title: "添加一个模型配置",
        body: [
          "打开设置 → 模型 → 添加模型。配置包含显示名称、Base URL、模型名称、API Key、工作目录和上下文窗口。内置预设自动带入端点和模型，自定义模型需要完整填写。",
        ],
        steps: [
          { title: "选择预设或自定义", detail: "预设适合对应官方端点，自定义适合其他 OpenAI 兼容服务。" },
          { title: "填写密钥和目录", detail: "API Key 必填；工作目录决定该模型会话的文件边界。" },
          { title: "选择上下文窗口", detail: "可选 256K、512K 或 1M；不确定时保留 256K。" },
          { title: "测试并保存", detail: "只有连接测试成功，配置才会写入本地。" },
          { title: "设为活跃", detail: "活跃模型用于新任务，也可从顶部或命令面板切换。" },
        ],
      },
      {
        id: "multiple-models",
        title: "管理多个模型",
        body: [
          "模型卡片显示端点、模型名、工作目录、是否已配置 Key 和上下文窗口。你可以更新 Key、调整工作目录、设为活跃或删除。删除模型会移除对应密钥，但不会删除历史会话。",
        ],
        note: {
          tone: "warning",
          title: "历史会话引用",
          body: "若历史会话引用了已删除模型，继续发送前需要重新选择一个可用模型。",
        },
      },
      {
        id: "custom-provider",
        title: "自定义 OpenAI 兼容端点",
        body: [
          "兼容端点至少要接受应用使用的 OpenAI 风格聊天请求和流式响应。Base URL 是否包含 `/v1` 由服务商决定，不能一概追加或删除。模型 ID 也必须使用端点实际识别的值。",
        ],
        code: {
          label: "自定义配置示意",
          content: "显示名称   团队网关\nBase URL  https://gateway.example.com/v1\n模型名称   team-coder\nAPI Key    <由服务商提供>\n上下文窗口 256K",
        },
      },
    ],
    related: ["context-window", "install-setup", "troubleshooting"],
  },
  {
    id: "context-window",
    group: "模型与配置",
    title: "上下文窗口与自动压缩",
    summary: "选择 256K、512K 或 1M，并理解长会话的压缩行为。",
    icon: "context",
    readTime: "8 分钟",
    updated: "2026-07-31",
    keywords: ["上下文", "token", "256K", "512K", "1M", "压缩", "长会话", "90%"],
    sections: [
      {
        id: "window-options",
        title: "三个窗口选项",
        body: [
          "每个模型配置可选择 256K、512K 或 1M token，上下文窗口默认是 256K。这里的值用于应用侧预算管理，不会提升服务商实际支持的模型上限；应选择不超过模型真实能力的值。",
        ],
        table: {
          headers: ["选项", "适合场景", "注意事项"],
          rows: [
            ["256K（默认）", "一般代码库、常规任务", "更稳妥，优先使用"],
            ["512K", "较长会话、更多文件上下文", "需确认 Provider 支持"],
            ["1M", "超长上下文模型和大型调查", "成本、延迟和服务限制可能更高"],
          ],
        },
      },
      {
        id: "compression",
        title: "达到 90% 时自动压缩",
        body: [
          "默认压缩阈值是所选窗口的 90%。接近阈值时，应用会把较早上下文整理为摘要，以便继续对话，并在流式事件中记录压缩前后的 token 信息。",
          "压缩保留的是任务要点而不是逐字完整历史。对必须精确保留的错误文本、协议或验收条件，建议放在当前消息中重新明确，或保存在项目文件里。",
        ],
      },
      {
        id: "too-long",
        title: "上下文过长错误",
        body: [
          "如果 Provider 返回 413 或上下文长度错误，说明服务端实际限制低于当前请求。可以新建会话、减少一次读取的文件量、让 Agent 先总结，或把模型配置切换到正确的窗口值。",
        ],
        checklist: [
          "确认模型真实上下文上限",
          "避免一次读取大量生成文件、锁文件或日志",
          "大文件使用 read_file 的 offset/limit 分段读取",
          "把新目标放到新会话，减少无关历史",
        ],
      },
    ],
    related: ["models", "projects-sessions", "troubleshooting"],
  },
  {
    id: "app-settings",
    group: "模型与配置",
    title: "设置中心",
    summary: "完整了解模型、会话、应用、快捷键和 Skills 五个页签。",
    icon: "settings",
    readTime: "9 分钟",
    updated: "2026-07-31",
    keywords: ["设置", "模型", "会话", "应用", "快捷键", "Skills", "主题", "诊断", "清空数据"],
    sections: [
      {
        id: "tabs",
        title: "五个设置页签",
        body: [
          "设置中心按职责分为模型、会话、应用、快捷键和 Skills。命令面板可以直接打开设置，也可以直接跳到 Skills 管理。",
        ],
        table: {
          headers: ["页签", "可管理内容"],
          rows: [
            ["模型", "添加、测试、更新 Key、工作目录、上下文窗口、活跃状态、删除"],
            ["会话", "查看标题、模型、消息数、更新时间并删除"],
            ["应用", "导航模式、默认目录、数据/日志、主题、诊断和危险区"],
            ["快捷键", "逐项录制组合键或恢复默认"],
            ["Skills", "查看目录、重新加载、打开文件夹和检查 prompt"],
          ],
        },
      },
      {
        id: "application",
        title: "应用偏好",
        body: [
          "应用页可在侧栏与 Tab 工作模式之间切换，设置默认工作目录，并选择浅色、深色或跟随系统主题。它还提供数据目录和主日志的快捷入口。",
        ],
      },
      {
        id: "diagnostics",
        title: "复制诊断信息",
        body: [
          "诊断信息用于反馈启动、模型或存储问题。当前内容包括应用版本、平台、架构、Node/Electron 版本、模型数量、会话数量、活跃模型 ID、是否配置工作目录，以及日志和数据路径。它不包含 API Key 或会话正文。",
        ],
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
          "清空操作要求准确输入 `DELETE`。实现会删除整个 `~/.stellara` 数据目录并重新初始化空数据库，因此模型配置、Key、会话、消息和应用偏好都会失去。完成后应重启应用。",
        ],
        note: {
          tone: "warning",
          title: "不可撤销",
          body: "应用内没有恢复入口。执行前先导出重要会话，并在需要时备份整个数据目录。若 Windows 报文件占用，请关闭应用后再处理。",
        },
      },
    ],
    related: ["local-data", "shortcuts", "skills"],
  },
  {
    id: "skills",
    group: "模型与配置",
    title: "Skills 自定义工作流",
    summary: "用工作目录中的 JSON 文件为 Agent 添加可复用指令。",
    icon: "skills",
    readTime: "10 分钟",
    updated: "2026-07-31",
    keywords: ["Skills", "skill", "JSON", "prompt", "斜杠命令", "自动补全", "工作流"],
    sections: [
      {
        id: "location-format",
        title: "目录与必填字段",
        body: [
          "Skills 从当前工作目录的 `skills/*.json` 自动加载。每个 JSON 文件至少需要 `name`、`description` 和 `prompt` 三个字符串字段；文件读取被限制在已配置工作目录的 skills 子目录内。",
        ],
        code: {
          label: "skills/code-review.json",
          content: "{\n  \"name\": \"code-review\",\n  \"description\": \"按项目规范审查当前改动\",\n  \"prompt\": \"先读取贡献指南和 git diff，按严重程度列出可执行问题；不要直接修改文件。\"\n}",
        },
      },
      {
        id: "write-good-skill",
        title: "编写稳定的 Skill",
        body: [
          "Skill prompt 应描述流程和边界，不要只写一句角色设定。把输入来源、执行顺序、禁止事项和输出格式写清楚，能让同一个 Skill 在不同会话中得到更一致的结果。",
        ],
        checklist: [
          "name 简短、唯一，适合在斜杠命令中输入",
          "description 说明何时使用，而不是重复名称",
          "prompt 写出步骤、限制和交付格式",
          "不要把 API Key 或其他密钥写进 JSON",
          "提交到 Git 前确认 Skill 不含个人路径或内部信息",
        ],
      },
      {
        id: "load-use",
        title: "加载与调用",
        body: [
          "打开设置 → Skills 可查看实际目录、已加载数量和每个 Skill 的 prompt。新增或修改 JSON 后点击“重新加载”；也可点“打开目录”进入文件管理器。",
        ],
        steps: [
          { title: "创建文件", detail: "在 `<workDir>/skills/` 中保存一个合法 JSON。" },
          { title: "重新加载", detail: "在 Skills 页让应用从磁盘重新读取全部文件。" },
          { title: "检查内容", detail: "展开卡片确认 name、description 和 prompt 已按预期解析。" },
          { title: "在聊天中调用", detail: "输入 `/skill-name`；输入 `sl` 时会出现自动补全。" },
        ],
      },
      {
        id: "skill-errors",
        title: "Skill 没有出现时",
        body: [
          "先确认当前模型配置已经选择工作目录，再检查目录名是否为 `skills`、扩展名是否为 `.json`、JSON 是否可解析，以及三个必填字段是否都为非空字符串。修正后手动重新加载。",
        ],
      },
    ],
    related: ["app-settings", "first-task", "command-palette"],
  },
  {
    id: "approvals",
    group: "安全与数据",
    title: "操作审批与安全边界",
    summary: "识别需要确认的动作，了解单次授权、超时和拒绝行为。",
    icon: "shield",
    readTime: "10 分钟",
    updated: "2026-07-31",
    keywords: ["安全", "审批", "允许这一次", "拒绝", "超时", "Esc", "危险工具", "外部请求"],
    sections: [
      {
        id: "approval-matrix",
        title: "哪些工具需要审批",
        body: [
          "当前审批策略按工具类别执行。读取和搜索可以直接进行；写文件、精确编辑、执行命令和 HTTP GET 会等待用户确认。",
        ],
        table: {
          headers: ["类别", "工具", "是否审批"],
          rows: [
            ["本地读取", "read_file、search_files、search_content、list_files", "否"],
            ["Git 查看", "git_status、git_diff、git_log", "否"],
            ["文件修改", "write_file、edit_file", "是"],
            ["命令执行", "run_command", "是"],
            ["外部访问", "web_fetch", "是"],
          ],
        },
      },
      {
        id: "top-bar",
        title: "如何阅读审批顶部条",
        body: [
          "待确认动作会以固定顶部条出现，显示工具名称和格式化参数。按钮只有“拒绝”和“允许这一次”。允许后只放行当前请求，不会建立对该工具、路径或会话的永久授权。",
        ],
        checklist: [
          "工具类型是否与当前任务相符",
          "文件路径是否在预期项目内",
          "写入是新建、覆盖还是精确替换",
          "命令是否只做必要的构建或测试",
          "外部 URL 是否可信、是否可能传出敏感参数",
        ],
      },
      {
        id: "reject-timeout",
        title: "拒绝、Esc 与超时",
        body: [
          "点击“拒绝”或按 Esc 会拒绝当前审批，Agent 会收到未获批准的结果并继续对话。默认等待时间是 60 秒；超时默认拒绝。内部允许的审批等待范围为 1–300 秒。",
        ],
        note: {
          tone: "success",
          title: "拒绝不会删除会话",
          body: "拒绝只阻止当前工具调用。你可以继续说明原因、要求换一种方案，或在确认参数后重新发起。",
        },
      },
      {
        id: "defense-in-depth",
        title: "审批之外的限制",
        body: [
          "审批不是唯一保护。文件工具限制在工作目录内；Shell 采用无 shell 白名单执行并拒绝破坏性命令和特殊字符；Plan 模式根本不提供修改工具；Electron 渲染进程还启用了上下文隔离、沙箱和 Web 安全。",
        ],
      },
    ],
    related: ["workdir-tools", "local-data", "plan-build"],
  },
  {
    id: "local-data",
    group: "安全与数据",
    title: "本地数据、密钥与备份",
    summary: "准确了解本地保存内容、进程隔离、联网边界和清除方式。",
    icon: "database",
    readTime: "12 分钟",
    updated: "2026-07-31",
    keywords: ["本地数据", "密钥", ".env", "config.json", "stellara.db", "备份", "隐私", "沙箱", "诊断"],
    sections: [
      {
        id: "files",
        title: "`~/.stellara` 中保存什么",
        body: [
          "v0.9 的主要用户数据位于当前 Windows 用户主目录下的 `.stellara` 文件夹。应用设置页可直接打开该目录；不建议在应用运行时手工编辑或删除其中的文件。",
        ],
        table: {
          headers: ["文件", "内容", "敏感程度"],
          rows: [
            ["config.json", "模型元数据、活跃模型、工作目录和应用偏好", "可能包含本地路径和端点"],
            [".env", "按模型 ID 保存 API Key", "高：本机受限明文"],
            ["stellara.db", "项目、会话、消息及相关本地记录", "高：可能含项目与对话内容"],
            ["config.json.bak", "配置写入时的备份", "与 config.json 相同"],
          ],
        },
      },
      {
        id: "key-boundary",
        title: "API Key 的真实安全边界",
        body: [
          "API Key 保存在本机 `.env` 文件中，创建时设置 0600 权限。它不是加密保险库，因此拥有该 Windows 用户文件访问权限的程序仍可能读取。应用代码要求裸 Key 只在 Electron 主进程使用，不通过 IPC 传给渲染界面。",
          "模型列表和诊断信息只暴露“是否已配置 Key”，不会返回 Key 本身。删除模型时，对应密钥也会从本地密钥映射中移除。",
        ],
        note: {
          tone: "warning",
          title: "不要提交密钥",
          body: "不要把 `~/.stellara/.env`、包含密钥的截图或完整数据目录提交到 Git、工单或公共聊天。怀疑泄露时应立即在服务商侧撤销并重建密钥。",
        },
      },
      {
        id: "renderer-isolation",
        title: "渲染界面隔离",
        body: [
          "桌面窗口关闭 Node 集成，并启用 contextIsolation、sandbox 和 webSecurity。界面只能通过预加载层暴露的受控 IPC 请求主进程能力，不能直接获得任意 Node API。",
        ],
      },
      {
        id: "network-boundary",
        title: "本地优先不等于完全离线",
        body: [
          "会话和配置默认保存在本机，也不要求 Stellara 云账号；但使用在线模型时，请求内容仍会发送给你配置的 Provider。使用 web_fetch 时还会访问审批条中显示的外部 URL。请同时遵守服务商的数据政策和组织内部的代码外发规则。",
        ],
      },
      {
        id: "backup-clear",
        title: "备份、迁移与清除",
        body: [
          "重要会话可逐个导出 JSON。需要完整备份时，应先关闭应用，再复制整个 `.stellara` 目录；恢复或跨设备迁移前也应保留原目录副本。设置中的“清空所有数据”会删除整个目录并重新初始化数据库。",
        ],
        checklist: [
          "关闭 Stellara Work，避免数据库文件锁和未落盘状态",
          "备份整个 `.stellara`，不要只复制数据库",
          "将备份存放在受控位置，不要公开分享",
          "恢复后重新启动，并检查模型、会话和工作目录",
        ],
      },
    ],
    related: ["app-settings", "approvals", "projects-sessions"],
  },
  {
    id: "shortcuts",
    group: "效率与参考",
    title: "键盘快捷键",
    summary: "查看 v0.9 的完整默认绑定，并学习录制与重置方法。",
    icon: "keyboard",
    readTime: "6 分钟",
    updated: "2026-07-31",
    keywords: ["快捷键", "Ctrl", "Esc", "Tab", "录制", "重置", "命令面板"],
    sections: [
      {
        id: "defaults",
        title: "完整默认快捷键",
        body: [
          "以下列表以当前 `shared/shortcuts.ts` 实现为准。v0.9 没有默认的 `Ctrl+,` 打开设置快捷键；请用 Ctrl+K 命令面板搜索“打开设置”。",
        ],
        table: {
          headers: ["操作", "默认按键", "说明"],
          rows: [
            ["切换左侧会话栏", "Ctrl+B", "显示或隐藏会话导航"],
            ["切换右侧工作区", "Ctrl+Shift+W", "显示或隐藏任务检查器"],
            ["切换 Plan 模式", "Ctrl+Shift+P", "在只读计划与执行模式间切换"],
            ["发送消息", "Ctrl+Enter", "在输入框中提交当前任务"],
            ["拒绝当前审批", "Escape", "审批出现时快速拒绝"],
            ["打开命令面板", "Ctrl+K", "搜索并执行应用命令"],
            ["切换标签页", "Ctrl+1 … Ctrl+9", "跳到对应位置的会话标签"],
            ["关闭当前标签页", "Ctrl+W", "只关闭视图，不删除会话"],
            ["恢复关闭的标签页", "Ctrl+Shift+T", "恢复最近关闭的会话标签"],
          ],
        },
      },
      {
        id: "customize",
        title: "录制自定义组合键",
        body: [
          "打开设置 → 快捷键，找到目标操作并点击“录制”。按钮进入录制状态后按下新的组合键；按 Esc 会取消本次录制。每一项都可独立点击“重置”恢复默认。",
        ],
        steps: [
          { title: "选择操作", detail: "确认要更改的是面板、模式、发送、审批还是标签页动作。" },
          { title: "开始录制", detail: "点击该行的“录制”，界面显示“按下任意键…”。" },
          { title: "按下组合键", detail: "尽量使用 Ctrl/Shift 与字母组合，避免覆盖系统常用输入。" },
          { title: "实际测试", detail: "关闭设置后验证新按键在对应上下文中生效。" },
        ],
      },
      {
        id: "conflicts",
        title: "快捷键冲突时",
        body: [
          "如果组合键被系统、输入法或其他应用拦截，Stellara Work 可能收不到事件。改用另一组组合键，或点击“重置”恢复默认。Escape 在不同上下文中还用于取消快捷键录制、关闭命令面板或拒绝审批。",
        ],
      },
    ],
    related: ["command-palette", "interface-tour", "approvals"],
  },
  {
    id: "command-palette",
    group: "效率与参考",
    title: "命令面板",
    summary: "不用离开键盘，搜索会话、模型、主题和界面操作。",
    icon: "command",
    readTime: "7 分钟",
    updated: "2026-07-31",
    keywords: ["命令面板", "Ctrl+K", "搜索命令", "切换模型", "主题", "工作目录"],
    sections: [
      {
        id: "use",
        title: "打开、搜索与执行",
        body: [
          "按 Ctrl+K 打开命令面板，输入中文或英文关键词过滤。使用 ↑/↓ 移动选择，Enter 执行，Esc 关闭。底部会显示当前匹配命令数量。",
        ],
      },
      {
        id: "catalog",
        title: "当前命令范围",
        body: [
          "命令根据当前会话、已配置模型和主题动态生成，因此不同环境中的数量会不同。会话切换列表默认取最近的前 10 项。",
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
      },
      {
        id: "new-session-task",
        title: "“新建会话”与“新任务”的区别",
        body: [
          "“新建会话”创建一条新的本地会话记录；“新任务（清空当前聊天）”用于清空当前任务上下文。执行删除当前会话时会再次确认，并明确提示不可恢复。",
        ],
      },
      {
        id: "search-tips",
        title: "搜索技巧",
        body: [
          "可以搜索命令名称，也可以使用内置关键词，例如 settings、workdir、session、model、theme、sidebar、workspace 或中文的“设置”“目录”“切换”“计划”。搜索采用匹配评分，最相关结果优先。",
        ],
      },
    ],
    related: ["shortcuts", "projects-sessions", "skills"],
  },
  {
    id: "troubleshooting",
    group: "效率与参考",
    title: "故障排查",
    summary: "按错误类型快速定位模型、网络、上下文、文件和存储问题。",
    icon: "lifebuoy",
    readTime: "14 分钟",
    updated: "2026-07-31",
    keywords: ["错误", "排错", "401", "403", "404", "429", "5xx", "网络", "超时", "日志", "诊断"],
    sections: [
      {
        id: "model-errors",
        title: "模型与网络错误对照表",
        body: [
          "错误横幅会把服务端或网络错误转换为更易读的类型，并按情况显示“打开设置”“切换模型”“重试”或网络检查提示。",
        ],
        table: {
          headers: ["错误", "常见原因", "处理方式"],
          rows: [
            ["API Key 无效（401/403）", "Key 错误、过期或无权限", "设置 → 模型更新 Key，再测试连接"],
            ["API 余额不足（402/配额）", "余额或套餐额度耗尽", "服务商充值，或切换 Provider"],
            ["模型不存在（404）", "模型 ID 错误或账号未开通", "核对精确模型名和账号权限"],
            ["请求被限流（429）", "频率或并发超过限制", "等待几秒重试，降低频率或换模型"],
            ["上下文窗口超出（413/长度错误）", "请求 token 超过模型能力", "减少上下文、新建会话或修正窗口值"],
            ["Provider 5xx", "服务商临时故障", "稍后重试；持续失败时切换 Provider"],
            ["网络连接失败", "DNS、代理、端点或网络中断", "检查网络、Base URL 和代理要求"],
            ["流空闲超时", "120 秒没有新数据", "重试；若反复出现，检查 Provider 稳定性"],
          ],
        },
      },
      {
        id: "tool-errors",
        title: "文件与命令错误",
        body: [
          "Agent 会针对常见工具失败生成修复引导。你也可以把完整错误保留在当前会话中，要求先解释原因再采取下一步。",
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
          ],
        },
      },
      {
        id: "collect-evidence",
        title: "收集可用的排错信息",
        body: [
          "打开设置 → 应用，先复制诊断信息，再打开主日志。反馈问题时说明发生时间、操作步骤、所选模型、错误标题和是否可以稳定复现。不要粘贴 API Key、完整 `.env` 或未经检查的会话导出。",
        ],
        checklist: [
          "Stellara Work 版本与 Windows 架构",
          "错误出现前的具体操作步骤",
          "错误横幅标题、状态码和提示",
          "脱敏诊断信息",
          "相关日志片段（删除密钥、路径和业务数据）",
          "是否在其他模型或新会话中复现",
        ],
      },
      {
        id: "data-issues",
        title: "数据目录问题",
        body: [
          "如果启动后配置或会话异常，先关闭应用并备份 `.stellara`，再查看主日志。不要直接把清空所有数据作为第一步，因为它会删除模型、密钥和全部聊天。只有确认备份完成且问题确实来自本地状态时，才考虑危险区操作。",
        ],
        note: {
          tone: "warning",
          title: "保留证据",
          body: "清空数据也会移除定位问题所需的状态。需要反馈缺陷时，先复制诊断和日志，再决定是否清除。",
        },
      },
    ],
    related: ["models", "local-data", "workdir-tools"],
  },
  {
    id: "faq",
    group: "效率与参考",
    title: "常见问题与版本边界",
    summary: "集中回答安装、联网、数据、模型和当前 v0.9 限制。",
    icon: "help",
    readTime: "8 分钟",
    updated: "2026-07-31",
    keywords: ["FAQ", "常见问题", "离线", "账号", "macOS", "Linux", "安装包", "版本"],
    sections: [
      {
        id: "platform",
        title: "支持 macOS 或 Linux 吗？",
        body: [
          "当前公开产品信息只确认 Windows x64 安装器。文档不会承诺 macOS、Linux、ARM64 或明确的最低 Windows 版本；后续以下载页和正式发布说明为准。",
        ],
      },
      {
        id: "offline",
        title: "它能完全离线运行吗？",
        body: [
          "应用界面、会话数据库和配置是本地的，也不需要 Stellara 云账号。但当前模型预设都是网络 Provider；使用它们必须联网，并会把请求内容发送到对应端点。若配置本地 OpenAI 兼容服务，是否真正离线取决于该服务本身。",
        ],
      },
      {
        id: "cloud-sync",
        title: "会话会自动云同步吗？",
        body: [
          "当前文档和实现没有 Stellara 云同步流程。会话保存在本机 SQLite 数据库中；跨设备使用需要自行安全备份和迁移数据目录，或导出重要会话。",
        ],
      },
      {
        id: "installer",
        title: "为什么下载按钮暂时不可用？",
        body: [
          "安装包尚未上传到公开站点，因此下载页只展示版本、文件名、体积和校验信息，不提供无效链接。通道开放后应从本站下载，并核对发布页给出的 SHA-256。",
        ],
      },
      {
        id: "keys",
        title: "API Key 是否加密？",
        body: [
          "v0.9 使用本机权限受限的 `.env` 明文文件，不是加密保险库。Key 只在 Electron 主进程内部使用，渲染界面和诊断信息不会读取或返回裸密钥。请保护 Windows 账户并定期轮换服务商密钥。",
        ],
      },
      {
        id: "version",
        title: "文档适用于哪个版本？",
        body: [
          "本手册以 2026-07-31 的 Stellara Work v0.9.0 代码与配置为依据。旧设计文档中的开发进度可能落后于当前实现；涉及快捷键、工具和设置项时，以本页标注的当前行为和应用实际界面为准。",
        ],
      },
    ],
    related: ["install-setup", "local-data", "troubleshooting"],
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
      section.code?.content ?? "",
      section.note?.title ?? "",
      section.note?.body ?? "",
    ]),
  ].join(" ").toLowerCase();
}
