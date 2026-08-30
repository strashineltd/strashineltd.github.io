import type { DiagnosticBranch } from "./types.ts";

export const diagnosticBranches: DiagnosticBranch[] = [
  {
    id: "connection.unauthorized",
    symptom: "未授权或凭证无效",
    aliases: ["401", "unauthorized", "invalid key", "凭证过期"],
    steps: [
      {
        title: "在应用内重新输入凭证",
        instruction: "回到 Stellara Work 的模型设置，清空并重新输入该服务的 API Key。不要把凭证粘贴到现场手册。",
        expected: "应用显示该模型已配置凭证，网页中没有出现任何凭证内容。",
      },
      {
        title: "核对账户与服务",
        instruction: "确认凭证属于当前选择的提供商与账户，并且账户允许使用所选模型。",
        expected: "账户、提供商和模型彼此匹配，凭证没有撤销或过期。",
      },
      {
        title: "重新测试",
        instruction: "保存设置，让 Stellara Work 再次运行连接测试。",
        expected: "测试通过；若仍失败，保留非敏感错误类别并回到 connect.verify 重新选择症状。",
      },
    ],
    returnStepId: "connect.verify",
  },
  {
    id: "connection.endpoint",
    symptom: "找不到地址或协议不匹配",
    aliases: ["404", "endpoint", "protocol", "路径不匹配", "协议不匹配"],
    steps: [
      {
        title: "核对 Base URL",
        instruction: "在 Stellara Work 中将 Base URL 与当前提供商的推荐值或服务方文档逐字比较，清除重复路径和多余空格。",
        expected: "地址指向当前提供商，并与所选模型来自同一服务。",
      },
      {
        title: "核对接口协议",
        instruction: "确认设置中的协议是 Responses API 或 Anthropic Messages，并与服务端明确支持的接口一致。",
        expected: "协议徽标与服务端接口一致。",
      },
      {
        title: "移除错误的回退假设",
        instruction: "不要把 Chat Completions 路径当作备用地址；v0.9.2 不会回退到该协议。修正后重新保存并测试。",
        expected: "测试只使用已选择的 Responses 或 Anthropic 协议，并返回明确结果。",
      },
    ],
    returnStepId: "connect.verify",
  },
  {
    id: "connection.timeout",
    symptom: "请求超时或网络不可达",
    aliases: ["timeout", "network", "DNS", "proxy", "网络不可达"],
    steps: [
      {
        title: "检查本机网络路径",
        instruction: "确认设备可以访问互联网，并检查代理、防火墙与 DNS 是否允许访问当前提供商域名。",
        expected: "提供商域名能够从当前网络解析并访问。",
      },
      {
        title: "短暂等待后重试",
        instruction: "保持配置不变，等待片刻后在 Stellara Work 中重新运行连接测试。",
        expected: "临时网络抖动消失，测试得到成功或更具体的错误。",
      },
      {
        title: "区分服务故障",
        instruction: "若其他网站正常而该服务持续超时，查看提供商公开状态信息或换一条已知可用网络验证。",
        expected: "能够判断问题来自本机网络还是提供商暂时不可用，再回到 connect.verify。",
      },
    ],
    returnStepId: "connect.verify",
  },
  {
    id: "connection.rate-limit",
    symptom: "请求频率或额度受限",
    aliases: ["429", "rate limit", "quota", "额度不足", "频率限制"],
    steps: [
      {
        title: "识别限制类型",
        instruction: "查看 Stellara Work 中的非敏感状态码与简短消息，区分 429 频率限制和账户额度不足。",
        expected: "已经确认需要等待降频，还是需要恢复账户额度。",
      },
      {
        title: "等待或恢复额度",
        instruction: "频率受限时等待服务方建议的时间；额度不足时在提供商账户中处理配额或计费状态。",
        expected: "账户重新具备发起一次连接测试的条件。",
      },
      {
        title: "再次运行测试",
        instruction: "回到 Stellara Work，用同一配置重新测试一次，避免连续快速重试。",
        expected: "测试通过，或返回可转入其他分支的具体错误。",
      },
    ],
    returnStepId: "connect.verify",
  },
  {
    id: "connection.unknown",
    symptom: "其他错误",
    aliases: ["unknown", "其他", "未知错误", "unexpected"],
    steps: [
      {
        title: "记录非敏感线索",
        instruction: "只记录状态码、错误类别和简短消息，移除凭证、完整请求头、账户信息与私人路径。",
        expected: "手中有一段可以安全检索的错误摘要，不含秘密。",
      },
      {
        title: "搜索现场手册",
        instruction: "用状态码或错误类别搜索手册，优先查看匹配的连接诊断和当前服务说明。",
        expected: "找到更具体的排查路径，或确认仍属于未知错误。",
      },
      {
        title: "返回连接测试",
        instruction: "完成可安全执行的修正后回到 connect.verify，再在 Stellara Work 中运行测试。",
        expected: "测试通过，或出现能够归入其他四条分支的明确现象。",
      },
    ],
    returnStepId: "connect.verify",
  },
];
