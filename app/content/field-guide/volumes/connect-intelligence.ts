import type { CoreVolume, LearningStep } from "../types.ts";

export const connectIntelligenceVolume: CoreVolume = {
  id: "connect-intelligence",
  title: "连接模型",
  outcome: "接通智能能力",
  estimatedMinutes: 12,
  stepIds: [
    "connect.choose-service",
    "connect.enter-settings",
    "connect.verify",
  ],
};

export const connectIntelligenceSteps: LearningStep[] = [
  {
    id: "connect.choose-service",
    contentVersion: 1,
    volumeId: "connect-intelligence",
    outcome: "确认模型服务与接口协议",
    estimatedMinutes: 3,
    sections: [
      {
        id: "choose-provider",
        title: "选择你已有账户的服务",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "路线提供七种连接选择：五个内置服务和两种自定义协议。服务名称决定推荐的 Base URL 与模型预设，协议徽标则说明 Stellara Work 将按哪一种请求格式通信。",
            ],
          },
          {
            type: "checklist",
            items: [
              "DeepSeek：DeepSeek-V4-Pro 或 DeepSeek-V4-Flash",
              "Qwen：Qwen3.8-Max",
              "GLM：GLM-5.3 或 GLM-5.2",
              "Kimi：Kimi-K3",
              "MiniMax：MiniMax-M3",
              "自定义 · Responses API：使用服务方提供的模型名与地址",
              "自定义 · Anthropic Messages：使用兼容 Messages 的模型名与地址",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "当前协议",
            body: "Responses API 是当前选择。v0.9.2 会按 Responses 协议测试并执行，不会回退到其他接口格式。",
            audience: {
              providers: [
                "deepseek",
                "qwen",
                "glm",
                "kimi",
                "minimax",
                "custom-responses",
              ],
            },
          },
          {
            type: "callout",
            tone: "note",
            title: "当前协议",
            body: "Anthropic Messages 是当前选择。请使用明确支持 Anthropic Messages 的服务地址与模型。",
            audience: { providers: ["custom-anthropic"] },
          },
        ],
      },
    ],
    searchTerms: ["模型服务", "提供商", "协议", "Responses API", "Anthropic Messages"],
  },
  {
    id: "connect.enter-settings",
    contentVersion: 1,
    volumeId: "connect-intelligence",
    outcome: "在应用内填写连接设置",
    estimatedMinutes: 5,
    sections: [
      {
        id: "connection-fields",
        title: "按服务核对连接字段",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "在 Stellara Work 的“设置 → 模型”中选择“添加模型”。内置预设会自动带出 Base URL 与模型名；自定义连接则应逐字采用服务方提供的地址和模型标识。",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "凭证只留在应用内",
            body: "API Key 只在 Stellara Work 的密码字段中填写。现场手册不会请求、读取、保存或显示它。",
          },
          {
            type: "fields",
            audience: { providers: ["deepseek"] },
            items: [
              { label: "Base URL", value: "https://api.deepseek.com" },
              { label: "模型预设", value: "DeepSeek-V4-Pro 或 DeepSeek-V4-Flash" },
              { label: "协议", value: "Responses API" },
            ],
          },
          {
            type: "fields",
            audience: { providers: ["qwen"] },
            items: [
              { label: "Base URL", value: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
              { label: "模型预设", value: "Qwen3.8-Max" },
              { label: "协议", value: "Responses API" },
            ],
          },
          {
            type: "fields",
            audience: { providers: ["glm"] },
            items: [
              { label: "Base URL", value: "https://open.bigmodel.cn/api/v1" },
              { label: "模型预设", value: "GLM-5.3 或 GLM-5.2" },
              { label: "协议", value: "Responses API" },
            ],
          },
          {
            type: "fields",
            audience: { providers: ["kimi"] },
            items: [
              { label: "Base URL", value: "https://api.moonshot.cn" },
              { label: "模型预设", value: "Kimi-K3" },
              { label: "协议", value: "Responses API" },
            ],
          },
          {
            type: "fields",
            audience: { providers: ["minimax"] },
            items: [
              { label: "Base URL", value: "https://api.minimax.io/v1" },
              { label: "模型预设", value: "MiniMax-M3" },
              { label: "协议", value: "Responses API" },
            ],
          },
          {
            type: "fields",
            audience: { providers: ["custom-responses"] },
            items: [
              { label: "Base URL", value: "采用服务方提供的 Responses API 地址" },
              { label: "模型", value: "采用服务方提供的准确模型标识" },
              { label: "协议", value: "Responses API" },
            ],
          },
          {
            type: "fields",
            audience: { providers: ["custom-anthropic"] },
            items: [
              { label: "Base URL", value: "采用服务方提供的 Anthropic Messages 地址" },
              { label: "模型", value: "采用服务方提供的准确模型标识" },
              { label: "协议", value: "Anthropic Messages" },
            ],
          },
        ],
      },
    ],
    searchTerms: ["设置", "添加模型", "Base URL", "Model", "API Key"],
  },
  {
    id: "connect.verify",
    contentVersion: 1,
    volumeId: "connect-intelligence",
    outcome: "在应用内验证模型连接",
    estimatedMinutes: 4,
    sections: [
      {
        id: "run-connection-test",
        title: "运行连接测试并记录结果",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "连接验证必须在 Stellara Work 内完成。不要在网页中输入 API Key；返回现场手册时只记录测试通过或失败，不粘贴凭证或完整敏感日志。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "在应用内提交配置",
                detail: "在首次引导选择“完成配置”，或在“设置 → 模型”中保存新增模型。应用会先测试连接，失败时不会写入新配置。",
              },
              {
                title: "读取应用反馈",
                detail: "看到连接成功后回到手册选择通过；若显示错误，只记下非敏感的状态码、错误类别与简短消息。",
              },
              {
                title: "失败时进入诊断",
                detail: "按最接近的现象排查，修复后回到本步骤再次运行同一项连接测试。",
              },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "五条诊断入口",
            body: "失败时选择 connection.unauthorized、connection.endpoint、connection.timeout、connection.rate-limit 或 connection.unknown；五条分支都会返回 connect.verify。",
          },
        ],
      },
    ],
    validation: {
      id: "connect.verify.result",
      title: "记录应用内连接测试结果",
      applicationSteps: [
        "在 Stellara Work 内保存模型配置并等待连接测试结束。",
        "确认应用显示连接成功，或选择最接近的失败现象。",
        "回到现场手册，只提交通过或失败状态。",
      ],
      successText: "连接已在 Stellara Work 内验证，可以继续创建第一个成果。",
      failureDiagnosticIds: [
        "connection.unauthorized",
        "connection.endpoint",
        "connection.timeout",
        "connection.rate-limit",
        "connection.unknown",
      ],
    },
    searchTerms: ["连接测试", "验证", "未授权", "超时", "429", "错误"],
  },
];
