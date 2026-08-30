import type { GlossaryEntry, LearningStep, SideTrack } from "./types.ts";

export const trackSteps: LearningStep[] = [
  {
    id: "models.presets-protocols",
    contentVersion: 1,
    volumeId: null,
    outcome: "读懂模型预设、协议与验证状态",
    estimatedMinutes: 4,
    sections: [
      {
        id: "preset-protocol-reference",
        title: "按运行时状态选择模型",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "v0.9.2 提供七个非自定义预设：DeepSeek-V4-Pro、DeepSeek-V4-Flash、Qwen3.8-Max (阿里云)、GLM-5.3 (智谱 BigModel)、GLM-5.2 (智谱 BigModel)、Kimi-K3 (月之暗面 Moonshot) 和 MiniMax-M3。预设仍然可见不等于当前可以执行，应同时查看协议与验证状态。",
              "内置预设固定使用 Responses API。自定义地址若明确包含 /v1/messages 或 /anthropic，会推断为 Anthropic Messages；其他地址统一推断为 Responses API。Chat Completions 已移除，任何分支都不会回退到该协议。",
            ],
          },
          {
            type: "fields",
            items: [
              {
                label: "协议徽标",
                value: "Responses API 或 Anthropic",
                detail: "说明请求采用的传输格式；自定义模型也可以在设置中明确选择。",
              },
              {
                label: "verified",
                value: "DeepSeek-V4-Pro、DeepSeek-V4-Flash",
                detail: "这两个预设在运行时表中可执行。",
              },
              {
                label: "unverified",
                value: "Qwen3.8-Max、GLM-5.3、GLM-5.2、MiniMax-M3",
                detail: "运行时表保留配置，但在验证通过前不执行。",
              },
              {
                label: "incompatible",
                value: "Kimi-K3",
                detail: "配置被保留，但 v0.9.2 将该预设禁用。",
              },
            ],
          },
          {
            type: "checklist",
            items: [
              "先看协议徽标，再核对 compatibility 验证徽标",
              "只有运行时标记为 verified 且 executable 的预设才直接执行",
              "自定义连接先完成 Function Calling 与连接验证，再用于真实任务",
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "模型预设",
      "preset",
      "wireApi",
      "Responses API",
      "Anthropic Messages",
      "Chat Completions 已移除",
      "verified",
      "unverified",
      "incompatible",
      "协议徽标",
      "验证徽标",
    ],
  },
  {
    id: "models.context-budget",
    contentVersion: 1,
    volumeId: null,
    outcome: "配置上下文窗口与输出预算",
    estimatedMinutes: 4,
    sections: [
      {
        id: "context-window-reference",
        title: "为输入、输出和压缩留出空间",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "模型设置可以选择 256K、512K 或 1M，上下文窗口默认是 256K。窗口是输入历史、工具信息和输出预留共同使用的总预算；较大的数字不能替代清楚的任务边界。",
              "默认压缩阈值是所选窗口的 90%。达到阈值后，应用尝试摘要较早的消息并保留系统消息与最近 12 轮；摘要失败时会跳过本轮压缩，不会用空摘要替换历史。",
            ],
          },
          {
            type: "fields",
            items: [
              {
                label: "contextWindow",
                value: "256000 / 512000 / 1000000",
                detail: "对应设置中的 256K、512K 与 1M。",
              },
              {
                label: "maxOutputTokens",
                value: "模型允许的最大输出预算",
                detail: "Context Hub 会先从窗口中扣除输出、工具与安全预留，再计算可用输入预算。",
              },
              {
                label: "reasoningEffort",
                value: "low / medium / high / max",
                detail: "只在相应供应商支持时生效；预设可以提供自己的默认值。",
              },
              {
                label: "压缩阈值",
                value: "contextWindow × 90%",
                detail: "这是触发整理历史的阈值，不是供应商保证可接收的输出长度。",
              },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "先修正任务范围",
            body: "遇到上下文过长时，优先结束已经完成的目标或开启新会话；确有长资料需求时，再切换到更大的窗口。",
          },
        ],
      },
    ],
    searchTerms: [
      "上下文窗口",
      "contextWindow",
      "256K",
      "512K",
      "1M",
      "90%",
      "上下文压缩",
      "maxOutputTokens",
      "reasoningEffort",
      "token budget",
    ],
  },
  {
    id: "workflow.plan-build-tools",
    contentVersion: 1,
    volumeId: null,
    outcome: "在 Plan 与 Build 之间选择正确工具",
    estimatedMinutes: 4,
    sections: [
      {
        id: "plan-build-reference",
        title: "先分析，再在批准后执行",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Plan 模式只提供读取、搜索与只读 git 工具，用来理解范围并形成计划。用户批准计划后才进入 Build；Build 可以使用完整工具集，但危险动作仍要逐次审批。",
            ],
          },
          {
            type: "checklist",
            items: [
              "文件工具：read_file、write_file、edit_file、list_files",
              "搜索工具：search_files、search_content、search_symbol",
              "命令工具：run_command；命令受白名单、工作目录和审批约束",
              "git 工具：git_status、git_diff、git_log，均为只读",
              "网页工具：web_fetch，只读取经过安全检查的公开文本内容",
              "记忆工具：memory_search、memory_save",
              "子代理工具：dispatch_subagents",
              "完成工具：task_complete，必须先通过 Context Hub 门禁",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "用 Plan 确认边界",
                detail: "读取相关文件、搜索符号并检查 git 差异；Plan 不执行命令、不写文件，也不访问网页或记忆。",
              },
              {
                title: "批准后进入 Build",
                detail: "核对计划覆盖目标、范围与验证，再明确批准执行。",
              },
              {
                title: "用证据结束",
                detail: "修改后重读文件，运行匹配的测试或构建，最后再调用 task_complete。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "Plan 模式",
      "Build 模式",
      "read_file",
      "search_content",
      "run_command",
      "git_diff",
      "web_fetch",
      "memory_save",
      "dispatch_subagents",
      "task_complete",
      "工具集",
    ],
  },
  {
    id: "workflow.subagents",
    contentVersion: 1,
    volumeId: null,
    outcome: "安全编排子代理",
    estimatedMinutes: 4,
    sections: [
      {
        id: "subagent-coordination",
        title: "按角色与文件范围拆分工作",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "一次批次最多包含 10 个子代理。research 与 verify 可以并行，协调器的并发上限是 4；build 始终串行执行，以降低同时改写工作区的风险。",
              "每个 build 子代理必须声明 fileScopes。两个 build 的范围若相同、互相包含或目录重叠，批次会在执行前报告冲突，而不是尝试合并。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "research", value: "调查资料与代码，默认只读" },
              { label: "build", value: "实施改动，必须声明非重叠 fileScopes" },
              { label: "verify", value: "检查结果与证据，默认只读" },
              { label: "批次上限", value: "10" },
              { label: "并发上限", value: "4（仅 research / verify）" },
            ],
          },
          {
            type: "checklist",
            items: [
              "任务必须可以独立验收，不让两个子代理共同拥有同一文件",
              "为 build 填写准确且不重叠的 fileScopes",
              "把结论、修改文件、验证与未解决问题写入期望输出",
              "父任务取消时，所有仍在运行或等待的子代理会一起取消",
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "subagent",
      "子代理",
      "research",
      "build",
      "verify",
      "fileScopes",
      "并发 4",
      "最多 10",
      "文件冲突",
      "串行构建",
    ],
  },
  {
    id: "workflow.context-hub",
    contentVersion: 1,
    volumeId: null,
    outcome: "用检查点与任务门禁保持上下文可靠",
    estimatedMinutes: 4,
    sections: [
      {
        id: "context-hub-gates",
        title: "让状态、证据与完成结论保持一致",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Context Hub 是任务上下文的单一写入者。它按事件推进 context revision，并在文件变化时推进 workspace revision；基于旧 revision 的验证或子代理结果会被视为过期。",
              "checkpoint 保存目标、约束、决策、改动文件、验证结果、失败、计划状态和待办。task gate 则在结束前检查计划、工具、子代理、未验证文件、过期证据与上下文冲突。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "在长任务节点创建 checkpoint",
                detail: "尤其在完成一组改动、准备压缩上下文或交接之前保存结构化状态。",
              },
              {
                title: "文件变化后重新验证",
                detail: "任何关联文件再次修改都会让旧证据失效；重新运行检查并关联当前 workspace revision。",
              },
              {
                title: "逐项清除 task gate 原因",
                detail: "完成所有计划步骤，等待工具与子代理结束，并处理未验证文件和 stale evidence。",
              },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "门禁不替代人工验收",
            body: "task gate 证明记录完整且状态一致；最终结果是否符合业务目标，仍需对照原始完成标准。",
          },
        ],
      },
    ],
    searchTerms: [
      "Context Hub",
      "checkpoint",
      "task gate",
      "context revision",
      "workspace revision",
      "stale evidence",
      "验证门禁",
      "上下文恢复",
    ],
  },
  {
    id: "extensions.skills",
    contentVersion: 1,
    volumeId: null,
    outcome: "用 Skills 提供项目内工作方法",
    estimatedMinutes: 3,
    sections: [
      {
        id: "skills-reference",
        title: "把稳定规则放进工作目录",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Skills 从当前 working directory 的 skills/ 目录加载。Markdown 技能使用 frontmatter 描述 name、description 与可选 enabled，正文作为执行提示；旧的 JSON 技能仍可读取。",
              "Skills 会进入 Agent 的系统提示，因此应保持目标单一、规则明确，并只放入当前项目可以信任和复用的操作方法。",
            ],
          },
          {
            type: "checklist",
            items: [
              "用 name 给技能稳定且可辨认的名称",
              "用 description 说明什么时候应使用，而不是重复正文",
              "正文写清步骤、边界与验收方式，不放 API Key 或私人数据",
              "格式错误的文件会在设置中标出，不会静默当作可用技能",
              "暂不使用的 Markdown 技能设为 enabled: false",
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "Skills",
      "skills 目录",
      "技能",
      "frontmatter",
      "name",
      "description",
      "enabled false",
      "项目规则",
    ],
  },
  {
    id: "extensions.mcp",
    contentVersion: 1,
    volumeId: null,
    outcome: "连接并限制 MCP 工具",
    estimatedMinutes: 3,
    sections: [
      {
        id: "mcp-reference",
        title: "先测试服务器，再开放所需工具",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "MCP 服务器可以使用 stdio 命令或 HTTP URL。启用后，服务器暴露的工具以带服务器命名空间的名称接入 Agent；连接失败的服务器会被跳过，不应阻塞基础工具。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "添加可信服务器",
                detail: "为 stdio 填写命令与参数，或为 HTTP 填写 http/https URL；服务器 ID 必须唯一。",
              },
              {
                title: "先运行连接测试",
                detail: "确认返回的工具数量、名称和说明都符合预期，再启用服务器。",
              },
              {
                title: "缩小工具列表",
                detail: "配置 tools 白名单时只开放当前工作需要的能力；列表为空才表示开放服务器返回的全部工具。",
              },
              {
                title: "按外部能力审查结果",
                detail: "MCP 工具由外部服务器实现，仍要核对参数、输出与副作用。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "MCP",
      "Model Context Protocol",
      "stdio",
      "HTTP server",
      "MCP 工具",
      "工具白名单",
      "连接测试",
      "mcp__",
    ],
  },
  {
    id: "extensions.memory",
    contentVersion: 1,
    volumeId: null,
    outcome: "控制记忆范围与注入数量",
    estimatedMinutes: 4,
    sections: [
      {
        id: "memory-scope-reference",
        title: "只把相关记忆带入当前任务",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "记忆分为 personal、project 与 workspace 三种 memory scope。personal 适合跨项目偏好，project 只服务当前项目，workspace 用于较稳定的工作区规则；范围越宽，内容越应克制。",
              "默认注入最多 10 条记忆。候选来源上限分别是：相关 personal 搜索 3 条、当前 project 5 条、workspace 3 条、高重要度 personal preference 3 条；系统去重后按重要度排序，再应用最终上限。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "personal", value: "跨项目个人事实与偏好" },
              { label: "project", value: "绑定当前 projectId 的项目知识" },
              { label: "workspace", value: "工作区级规则与约定" },
              { label: "最终注入上限", value: "10 条" },
              { label: "相关查询长度", value: "最多取用户消息前 200 个字符" },
            ],
          },
          {
            type: "checklist",
            items: [
              "保存前选择最窄且仍然有效的 memory scope",
              "不要把密钥、访问令牌或完整私人对话保存为记忆",
              "任务结束后到记忆中心复查自动提取内容",
              "过时或范围过宽的记忆及时编辑或删除",
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "memory scope",
      "personal memory",
      "project memory",
      "workspace memory",
      "记忆注入",
      "最多 10 条",
      "Memory Center",
      "memory_save",
    ],
  },
  {
    id: "extensions.shortcuts",
    contentVersion: 1,
    volumeId: null,
    outcome: "查阅全部默认快捷键",
    estimatedMinutes: 3,
    sections: [
      {
        id: "shortcut-reference",
        title: "17 个默认快捷键",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "v0.9.2 的共享快捷键表定义了以下 17 个默认快捷键。设置中的自定义绑定会覆盖默认值，也可以一次恢复全部默认绑定。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "切换左会话栏", value: "Ctrl+B" },
              { label: "切换右工作区", value: "Ctrl+Shift+W" },
              { label: "切换 Plan 模式", value: "Ctrl+Shift+P" },
              { label: "发送消息", value: "Ctrl+Enter" },
              { label: "拒绝当前批准", value: "Escape" },
              { label: "打开命令面板", value: "Ctrl+K" },
              { label: "切换到 Tab 1", value: "Ctrl+1" },
              { label: "切换到 Tab 2", value: "Ctrl+2" },
              { label: "切换到 Tab 3", value: "Ctrl+3" },
              { label: "切换到 Tab 4", value: "Ctrl+4" },
              { label: "切换到 Tab 5", value: "Ctrl+5" },
              { label: "切换到 Tab 6", value: "Ctrl+6" },
              { label: "切换到 Tab 7", value: "Ctrl+7" },
              { label: "切换到 Tab 8", value: "Ctrl+8" },
              { label: "切换到 Tab 9", value: "Ctrl+9" },
              { label: "关闭当前 Tab", value: "Ctrl+W" },
              { label: "恢复关闭的 Tab", value: "Ctrl+Shift+T" },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "冲突时以设置为准",
            body: "如果系统或其他应用占用了组合键，请在快捷键设置中换成容易记忆且不冲突的绑定。",
          },
        ],
      },
    ],
    searchTerms: [
      "快捷键",
      "17 个默认快捷键",
      "Ctrl+B",
      "Ctrl+Shift+P",
      "Ctrl+Enter",
      "Escape",
      "Ctrl+K",
      "Ctrl+1",
      "Ctrl+W",
      "Ctrl+Shift+T",
    ],
  },
  {
    id: "security.approvals",
    contentVersion: 1,
    volumeId: null,
    outcome: "理解审批等待、拒绝与取消",
    estimatedMinutes: 3,
    sections: [
      {
        id: "approval-lifecycle",
        title: "每次只授权当前动作",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "write_file、edit_file、run_command、web_fetch 与 dispatch_subagents 属于危险工具，会在执行前请求审批。“允许这一次”只解决当前请求，不会形成后续通行证。",
              "普通工具审批默认等待 60 秒，Plan 审批默认等待 300 秒；超时都按拒绝处理。默认快捷键 Escape 会拒绝当前审批，取消任务也会先把该任务仍在等待的审批全部设为拒绝。",
            ],
          },
          {
            type: "checklist",
            items: [
              "核对工具名称与全部参数，而不只看摘要",
              "确认路径、URL、命令和子代理范围都服务于当前目标",
              "不理解的请求先按 Escape 拒绝，再要求解释或缩小范围",
              "审批超时后重新检查上下文，不要凭记忆重复允许",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "审批不是安全结论",
            body: "审批只决定是否执行一次操作；执行结束后仍要检查结果、差异与验证证据。",
          },
        ],
      },
    ],
    searchTerms: [
      "approval",
      "审批超时",
      "60 秒",
      "300 秒",
      "Escape",
      "允许这一次",
      "拒绝当前批准",
      "取消任务",
    ],
  },
  {
    id: "security.execution-boundaries",
    contentVersion: 1,
    volumeId: null,
    outcome: "核对命令、路径、网页与渲染器边界",
    estimatedMinutes: 5,
    sections: [
      {
        id: "execution-safeguards",
        title: "把工作限制在明确的本地边界内",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "渲染器以 nodeIntegration: false、contextIsolation: true 和 sandbox: true 启动，不能直接读取文件系统或密钥。文件、命令和网络能力都经过主进程的专用入口。",
            ],
          },
          {
            type: "checklist",
            items: [
              "Shell：只运行白名单程序且 shell: false；拒绝多行、管道、重定向、变量展开和破坏性命令",
              "命令路径：拒绝绝对路径、越出 working directory 的 ..、危险路径参数和关键环境变量覆盖",
              "文件路径：同时检查词法路径与 realpath，阻止符号链接或 junction 逃逸工作目录",
              "网页读取：只允许 http/https 公网地址，拒绝 localhost、私网、链路本地和云元数据地址",
              "网页响应：每次重定向重新校验，最多 5 次、15 秒、默认 500KB，且只接受文本类内容",
              "外部链接：只允许 http、https 与 mailto，拒绝 file、smb 和自定义协议",
              "网页正文带不可信标记，不能覆盖系统规则、审批规则或工具权限",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "安全拒绝通常说明边界需要调整",
            body: "不要尝试绕过被拒绝的路径或命令；先确认是否选错工作目录、任务范围过大，或可以改用更窄的内置工具。",
          },
        ],
      },
    ],
    searchTerms: [
      "sandbox",
      "nodeIntegration false",
      "contextIsolation",
      "shell 白名单",
      "path traversal",
      "symlink",
      "working directory",
      "SSRF",
      "localhost",
      "web_fetch",
      "URL 安全",
    ],
  },
  {
    id: "security.local-data",
    contentVersion: 1,
    volumeId: null,
    outcome: "找到本地数据并确认密钥保护状态",
    estimatedMinutes: 4,
    sections: [
      {
        id: "data-directory-reference",
        title: "区分配置、数据库、密钥与日志",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Stellara Work 使用 Electron 的标准 userData 目录保存配置、会话、记忆与密钥记录。Windows 目录是 %APPDATA%\\Stellara Work，macOS 目录是 ~/Library/Application Support/Stellara Work。",
              "API Key 只由主进程读取。safeStorage 可用时，Windows 使用 DPAPI，macOS 使用 Keychain 支持的加密；若当前环境不提供 safeStorage，应用会记录明文降级警告，因此排查时应先确认加密能力而不是作默认假设。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "config.json", value: "模型元数据、应用设置与 MCP 配置" },
              { label: ".env", value: "STELLARA_KEY_ 记录；文件权限写为 0600，值在 safeStorage 可用时加密" },
              { label: "stellara.db", value: "项目、会话、消息、记忆、Context Hub 事件与检查点" },
              { label: "Windows 日志", value: "%APPDATA%\\Stellara Work\\logs" },
              { label: "macOS 主日志", value: "~/Library/Logs/Stellara Work/main.log" },
            ],
          },
          {
            type: "checklist",
            items: [
              "从设置打开数据目录，不在应用运行时手工编辑数据库文件",
              "不要把 .env、数据库或完整日志加入项目版本控制",
              "macOS 首次读取加密密钥时，按系统提示授予所需 Keychain 权限",
              "共享诊断前只报告密钥是否已配置，不复制密钥值",
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "%APPDATA%\\Stellara Work",
      "~/Library/Application Support/Stellara Work",
      "userData",
      "safeStorage",
      "DPAPI",
      "Keychain",
      "config.json",
      ".env",
      "stellara.db",
      "本地数据",
    ],
  },
  {
    id: "security.backup-restore",
    contentVersion: 1,
    volumeId: null,
    outcome: "完整备份并谨慎恢复本地数据",
    estimatedMinutes: 4,
    sections: [
      {
        id: "backup-restore-procedure",
        title: "把恢复能力建立在完整副本上",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "可靠备份应在应用完全退出后复制整个标准数据目录，而不是只复制一个数据库文件。这样可以同时保留配置、密钥记录、SQLite 主文件以及可能仍有关联内容的 WAL 文件。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "退出并确认文件不再占用",
                detail: "关闭 Stellara Work；退出流程会尝试完成 SQLite WAL checkpoint。",
              },
              {
                title: "复制完整数据集",
                detail: "保留 config.json、config.json.bak、.env、stellara.db、stellara.db-wal 与 stellara.db-shm，以及目录权限。",
              },
              {
                title: "恢复到标准目录",
                detail: "在应用关闭时把可信备份还原到当前系统的数据目录，再启动并检查模型、项目、会话和记忆。",
              },
              {
                title: "处理旧版目录",
                detail: "首次启动会从 ~/.stellara 复制目标目录中尚不存在的旧文件，并保留旧目录作为恢复副本。",
              },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "先备份，再清除",
            body: "“清除全部数据”会删除配置、密钥记录和数据库文件并创建空库。它是不可逆的最后手段，不是修复备份。",
          },
        ],
      },
    ],
    searchTerms: [
      "备份",
      "恢复",
      "backup",
      "restore",
      "config.json.bak",
      "stellara.db-wal",
      "~/.stellara",
      "清除全部数据",
      "WAL checkpoint",
    ],
  },
  {
    id: "troubleshooting.install",
    contentVersion: 1,
    volumeId: null,
    outcome: "处理未签名安装包与首次启动问题",
    estimatedMinutes: 3,
    sections: [
      {
        id: "unsigned-installers",
        title: "只为核对过的正式安装包放行",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "v0.9.2 的公开安装包尚未签名。系统警告是预期限制，但仍应先核对文件来自正式 GitHub Release、版本为 0.9.2，且架构与设备一致。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Windows SmartScreen",
                detail: "确认是 Stellara Work-Setup-0.9.2-x64.exe 后，选择“更多信息”与“仍要运行”。",
              },
              {
                title: "macOS Gatekeeper",
                detail: "确认 DMG 架构正确后，在“应用程序”中右键 Stellara Work，选择“打开”并再次确认。",
              },
              {
                title: "白屏或无法完成启动",
                detail: "先查主进程日志；常见方向是数据目录权限或 macOS Keychain 访问被拒绝。",
              },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "来源不明时停止",
            body: "如果文件名、版本、架构或下载来源有任何一项不一致，不要绕过 SmartScreen 或 Gatekeeper；重新从正式发布页下载。",
          },
        ],
      },
    ],
    searchTerms: [
      "SmartScreen",
      "Gatekeeper",
      "未签名",
      "更多信息",
      "仍要运行",
      "右键打开",
      "白屏",
      "首次启动",
    ],
  },
  {
    id: "troubleshooting.connection",
    contentVersion: 1,
    volumeId: null,
    outcome: "按错误类别恢复模型连接",
    estimatedMinutes: 5,
    sections: [
      {
        id: "connection-error-branches",
        title: "先分类，再改变一个条件",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "连接失败时只记录状态码、错误类别与简短消息，不记录 API Key。每次只改变一个条件，再回到应用运行同一项连接测试，避免同时改动地址、协议和模型名。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "401 / 403", value: "auth：重新核对凭证是否有效、过期或缺少权限" },
              { label: "404", value: "model_not_found：核对 Base URL、协议路径、模型名与访问权限" },
              { label: "network / timeout", value: "检查网络、代理、DNS 与 Base URL；流 120 秒无新数据也会判为空闲超时" },
              { label: "413", value: "context_too_long：上下文溢出；开启新会话，或改用 512K / 1M 窗口" },
              { label: "429", value: "rate_limit：稍候重试，降低请求频率，或确认额度与供应商限制" },
              { label: "5xx / 529", value: "供应商服务错误：等待自动重试后再决定是否切换服务" },
            ],
          },
          {
            type: "checklist",
            items: [
              "凭证错误进入未授权分支",
              "地址、协议或模型名错误进入端点分支",
              "无法访问或超时进入网络分支",
              "429 进入频率或额度分支",
              "无法分类时保留非敏感摘要，进入通用分支",
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "连接诊断",
      "401",
      "403",
      "404",
      "413 context overflow",
      "429 rate limit",
      "网络超时",
      "Base URL",
      "context_too_long",
      "模型不存在",
    ],
  },
  {
    id: "troubleshooting.storage-logs",
    contentVersion: 1,
    volumeId: null,
    outcome: "在不泄露凭证的前提下恢复存储",
    estimatedMinutes: 4,
    sections: [
      {
        id: "storage-log-recovery",
        title: "保留原件，再收集最小诊断信息",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "配置消失、数据库无法打开或启动白屏时，先退出应用并备份当前数据目录。不要直接删除 stellara.db 或 .env；原件是确认权限、迁移和恢复问题的重要依据。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "确认目录与权限",
                detail: "从设置打开数据目录；macOS 同时检查 Keychain 权限，Windows 检查文件是否仍被进程占用。",
              },
              {
                title: "保留并恢复已知良好副本",
                detail: "备份当前文件后，按完整备份流程恢复 config、密钥记录、数据库与 WAL 配套文件。",
              },
              {
                title: "收集脱敏诊断",
                detail: "设置中的诊断包含版本、平台、运行时、路径、数量和短日志尾部；密钥只报告哪些模型已配置，不返回密钥值。",
              },
              {
                title: "分享前再次检查",
                detail: "即使使用诊断摘要，也要人工删除任务内容、私人路径、令牌或其他不应外传的信息。",
              },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "重置是最后一步",
            body: "只有在备份完成且恢复失败后，才考虑选择性清除会话、记忆或全部数据；清除全部数据无法撤销。",
          },
        ],
      },
    ],
    searchTerms: [
      "storage recovery",
      "存储恢复",
      "数据库损坏",
      "stellara.db",
      "日志",
      "main.log",
      "复制诊断信息",
      "脱敏",
      "不含密钥",
      "Keychain 权限",
    ],
  },
  {
    id: "reference.platform-runtime",
    contentVersion: 1,
    volumeId: null,
    outcome: "核对 v0.9.2 平台与运行时基线",
    estimatedMinutes: 3,
    sections: [
      {
        id: "platform-runtime-matrix",
        title: "使用发布目标对应的安装包",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "v0.9.2 的发布目标是 Windows x64、macOS Apple Silicon arm64 与 macOS Intel x64。构建配置同时为两种 Mac 架构生成 DMG/ZIP，并为 Windows x64 生成 NSIS 安装程序。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "Windows x64", value: "Stellara Work-Setup-0.9.2-x64.exe" },
              { label: "macOS arm64", value: "Stellara Work-0.9.2-arm64.dmg" },
              { label: "macOS x64", value: "Stellara Work-0.9.2-x64.dmg" },
              { label: "桌面运行时", value: "Electron 43.2.0" },
              { label: "界面运行时", value: "React 19.2.8 / React DOM 19.2.8" },
              { label: "构建基线", value: "TypeScript 7.0.2 / Vite 8.1.5" },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "开发环境与发布支持不同",
            body: "README 提供 Linux 开发说明，但 v0.9.2 下载表与打包目标没有列出 Linux 桌面安装包。",
          },
        ],
      },
    ],
    searchTerms: [
      "v0.9.2",
      "Windows x64",
      "macOS arm64",
      "macOS Intel x64",
      "Apple Silicon",
      "Electron 43.2.0",
      "React 19.2.8",
      "TypeScript 7.0.2",
      "Vite 8.1.5",
      "supported platforms",
    ],
  },
  {
    id: "reference.highlights-limitations",
    contentVersion: 1,
    volumeId: null,
    outcome: "区分 v0.9.2 新能力与当前限制",
    estimatedMinutes: 4,
    sections: [
      {
        id: "release-highlights",
        title: "按发布版本理解行为",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "v0.9.2 把内置模型流量统一到 Responses API，并为自定义模型增加 Anthropic Messages 选择；同时加入 Context Hub、检查点、验证证据、任务门禁、会话级子代理协调和协议状态展示。",
            ],
          },
          {
            type: "checklist",
            items: [
              "Responses 工具结果使用 function_call_output，并在请求中固定 store: false",
              "Context 事件带 sequence、context revision 与 workspace revision",
              "子代理按 research / build / verify 角色调度并检查文件范围冲突",
              "模型设置显示协议与验证状态，自定义连接保存前先测试",
              "当前安装包未签名，需要按平台安全提示手动确认来源",
              "运行时预设表只有两个 DeepSeek 预设是 verified 且 executable；其他预设需按实际状态处理",
              "产品数据留在本机，但模型请求仍会发送到用户选择的 API 服务",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "不要用旧版说明推断当前协议",
            body: "连接、兼容性与运行限制以 v0.9.2 的运行时配置和当前验证结果为准，不以历史截图或旧网站措辞为准。",
          },
        ],
      },
    ],
    searchTerms: [
      "release highlights",
      "current limitations",
      "v0.9.2 新增",
      "function_call_output",
      "store false",
      "协议状态",
      "未签名安装包",
      "local-first",
      "BYO API Key",
    ],
  },
  {
    id: "reference.terms-history",
    contentVersion: 1,
    volumeId: null,
    outcome: "快速定位术语与历史版本",
    estimatedMinutes: 3,
    sections: [
      {
        id: "terminology-history",
        title: "用当前术语阅读任务记录",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "同一界面可能同时显示协议、模型兼容性、上下文窗口、revision、checkpoint 与 task gate。先按术语表确认它描述的是连接格式、容量还是任务状态，再决定操作。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "wire API", value: "模型连接使用的 Responses 或 Anthropic Messages 传输格式" },
              { label: "compatibility", value: "verified、unverified 或 incompatible 的运行时状态" },
              { label: "context window", value: "输入、工具信息、预留与输出共享的 token 容量" },
              { label: "revision", value: "Context Hub 用来判断状态与证据是否仍然新鲜的版本号" },
              { label: "checkpoint / task gate", value: "结构化恢复点 / 任务结束前的完整性检查" },
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "查当前版本",
                detail: "先阅读 CHANGELOG.md 的 0.9.2 条目，确认新增、变更、安全与迁移事项。",
              },
              {
                title: "追溯能力来源",
                detail: "0.9.0 记录 Skills、MCP、记忆中心与项目模式；0.8.x 指向 W1 Agent、W2 桌面交互和 W3 本地数据阶段。",
              },
              {
                title: "回到当前实现验证",
                detail: "历史条目用于解释演进，不覆盖 v0.9.2 运行时源文件与当前连接测试。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: [
      "术语",
      "terminology",
      "CHANGELOG.md",
      "历史版本",
      "0.9.0",
      "0.8.x",
      "wire API",
      "compatibility",
      "revision",
      "release history",
    ],
  },
];

export const sideTracks: SideTrack[] = [
  {
    id: "models-context",
    title: "模型与上下文",
    summary: "核对预设、接口协议、验证状态与上下文预算。",
    stepIds: ["models.presets-protocols", "models.context-budget"],
  },
  {
    id: "workflow-tools",
    title: "工作流与工具",
    summary: "理解 Plan、Build、子代理、检查点与完成门禁。",
    stepIds: [
      "workflow.plan-build-tools",
      "workflow.subagents",
      "workflow.context-hub",
    ],
  },
  {
    id: "extensions",
    title: "扩展能力",
    summary: "管理 Skills、MCP、记忆范围与快捷键。",
    stepIds: [
      "extensions.skills",
      "extensions.mcp",
      "extensions.memory",
      "extensions.shortcuts",
    ],
  },
  {
    id: "security-data",
    title: "安全与本地数据",
    summary: "审查审批、执行边界、密钥保护与备份恢复。",
    stepIds: [
      "security.approvals",
      "security.execution-boundaries",
      "security.local-data",
      "security.backup-restore",
    ],
  },
  {
    id: "troubleshooting",
    title: "故障排查",
    summary: "处理安装、连接、存储与日志问题。",
    stepIds: [
      "troubleshooting.install",
      "troubleshooting.connection",
      "troubleshooting.storage-logs",
    ],
  },
  {
    id: "release-reference",
    title: "版本参考",
    summary: "查阅 v0.9.2 平台、运行时、变更、限制与历史。",
    stepIds: [
      "reference.platform-runtime",
      "reference.highlights-limitations",
      "reference.terms-history",
    ],
  },
];

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: "responses-api",
    term: "Responses API",
    definition: "v0.9.2 内置模型采用的请求协议；工具结果以 Response Items 与 function_call_output 表示。",
    aliases: ["Responses", "响应接口", "wire API"],
  },
  {
    id: "anthropic-messages",
    term: "Anthropic Messages",
    definition: "自定义模型可以明确选择的 Messages 协议，使用兼容的 /v1/messages 服务地址。",
    aliases: ["Anthropic", "Messages API", "消息协议"],
  },
  {
    id: "context-hub",
    term: "Context Hub",
    definition: "按事件统一记录目标、计划、工作区变化、验证、记忆与子代理状态的任务上下文单一事实源。",
    aliases: ["上下文中心", "context revision", "任务上下文"],
  },
  {
    id: "checkpoint",
    term: "checkpoint",
    definition: "保存目标、约束、决策、改动、验证、计划状态与待办的结构化恢复点。",
    aliases: ["检查点", "恢复点", "context checkpoint"],
  },
  {
    id: "task-gate",
    term: "task gate",
    definition: "task_complete 被接受前，对计划、运行中工具和子代理、未验证文件、过期证据与冲突进行的完整性检查。",
    aliases: ["任务门禁", "完成门禁", "completion gate"],
  },
  {
    id: "approval",
    term: "approval",
    definition: "用户对当前一次危险工具请求作出的允许或拒绝；允许不会自动授权后续请求。",
    aliases: ["审批", "批准", "允许这一次"],
  },
  {
    id: "working-directory",
    term: "working directory",
    definition: "Agent 读取、修改与运行开发工具时使用的本地目录边界；越界路径会被拒绝。",
    aliases: ["工作目录", "workDir", "workspace root"],
  },
  {
    id: "subagent",
    term: "subagent",
    definition: "由会话级协调器分派的独立执行单元，角色可以是 research、build 或 verify。",
    aliases: ["子代理", "delegated agent", "协作代理"],
  },
  {
    id: "skills",
    term: "Skills",
    definition: "从项目 skills/ 目录加载并注入 Agent 提示的可复用工作方法与约束。",
    aliases: ["技能", "skills 目录", "project instructions"],
  },
  {
    id: "mcp",
    term: "MCP",
    definition: "Model Context Protocol；通过配置的 stdio 或 HTTP 服务器向 Agent 提供额外工具。",
    aliases: ["Model Context Protocol", "模型上下文协议", "MCP server"],
  },
  {
    id: "memory-scope",
    term: "memory scope",
    definition: "记忆的适用范围，分为 personal、project 与 workspace，用来限制检索和注入边界。",
    aliases: ["记忆范围", "personal memory", "project memory", "workspace memory"],
  },
  {
    id: "reduced-motion",
    term: "reduced motion",
    definition: "系统的 prefers-reduced-motion: reduce 偏好，表示用户希望界面减少或立即完成非必要过渡。",
    aliases: ["减弱动效", "减少动态效果", "prefers-reduced-motion"],
  },
];
