import type { CoreVolume, LearningStep } from "../types.ts";

export const firstOutcomeVolume: CoreVolume = {
  id: "first-outcome",
  title: "首次成果",
  outcome: "完成你的第一个成果",
  estimatedMinutes: 12,
  stepIds: [
    "outcome.choose-workspace",
    "outcome.write-brief",
    "outcome.follow-execution",
    "outcome.review-result",
  ],
};

export const firstOutcomeSteps: LearningStep[] = [
  {
    id: "outcome.choose-workspace",
    contentVersion: 1,
    volumeId: "first-outcome",
    outcome: "创建边界清楚的工作区",
    estimatedMinutes: 3,
    sections: [
      {
        id: "workspace-boundary",
        title: "为第一次任务划定目录",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "工作目录是 Agent 可读取、编辑和运行开发命令的路径边界。第一次练习应选一个内容明确、可以恢复的文件夹，不要直接选择包含大量无关资料的上级目录。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "创建项目",
                detail: "在首页或“项目”页选择“新建项目”，填写一个能辨认任务范围的名称。",
              },
              {
                title: "选择文件夹或入口文件",
                detail: "选择文件夹会直接把它设为工作区；选择文件时，其所在文件夹成为工作区，入口文件作为可选提示。",
              },
              {
                title: "核对路径范围",
                detail: "在项目窗口确认显示的完整路径。文件操作会被限制在这个工作目录内，越界路径会被拒绝。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: ["项目", "工作目录", "工作区", "路径", "入口文件"],
  },
  {
    id: "outcome.write-brief",
    contentVersion: 1,
    volumeId: "first-outcome",
    outcome: "写出可执行的任务说明",
    estimatedMinutes: 4,
    sections: [
      {
        id: "task-brief",
        title: "把完成标准写进任务",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "一条可靠的首次任务应同时说明想得到的结果、允许触及的范围、必须遵守的约束，以及用什么证据判断完成。这样 Agent 可以少做假设，你也更容易验收。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "结果", value: "明确描述任务结束时应出现的成果" },
              { label: "范围", value: "指出可读取或修改的目录、文件与功能" },
              { label: "约束", value: "列出不能改变的行为、格式、依赖或时间边界" },
              { label: "验收证据", value: "要求列出改动文件，并提供测试、构建或人工检查结果" },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "适合第一次练习的任务",
            body: "优先选择可在一个目录内完成、改动容易撤销、验收方式明确的小任务。先获得一个完整闭环，再逐步扩大范围。",
          },
        ],
      },
    ],
    searchTerms: ["任务说明", "目标", "范围", "约束", "完成标准", "验收证据"],
  },
  {
    id: "outcome.follow-execution",
    contentVersion: 1,
    volumeId: "first-outcome",
    outcome: "看懂任务执行过程",
    estimatedMinutes: 3,
    sections: [
      {
        id: "follow-work",
        title: "在关键时刻介入",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "发送任务后，回复会流式出现，读取、搜索、编辑和命令会显示为工具卡片。复杂或风险较高的工作先用 Plan 模式审阅步骤，批准计划后再进入 Build 执行。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "先看计划与当前目标",
                detail: "确认执行计划没有遗漏约束，且每一步都服务于当前结果；不合适时拒绝并补充说明。",
              },
              {
                title: "跟随流式记录与工具卡片",
                detail: "展开工具卡片核对文件路径、命令和返回结果；任务详情会同步显示目标、进度与交付物。",
              },
              {
                title: "处理审批",
                detail: "只有请求与任务范围一致时才允许这一次；拒绝不会授权该操作，可以补充更安全的做法后继续。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: ["流式", "工具卡片", "Plan", "Build", "计划", "审批"],
  },
  {
    id: "outcome.review-result",
    contentVersion: 1,
    volumeId: "first-outcome",
    outcome: "验收第一个任务成果",
    estimatedMinutes: 2,
    sections: [
      {
        id: "review-first-result",
        title: "用证据而不是语气判断完成",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "任务停止输出不等于结果已经可交付。把最初的完成标准与实际改动逐项对照，并确认验证证据来自改动后的工作区版本。",
            ],
          },
          {
            type: "checklist",
            items: [
              "在“交付物”和文件列表中核对所有新增或修改的路径",
              "展开工具结果，确认测试或构建命令成功且没有被截断的关键错误",
              "检查最终摘要是否说明做了什么、未做什么以及仍存在的风险",
              "亲自打开关键输出，确认它符合任务中的验收标准",
            ],
          },
        ],
      },
    ],
    validation: {
      id: "outcome.review-result.evidence",
      title: "确认第一次成果可验收",
      applicationSteps: [
        "在任务详情中核对交付物与改动文件。",
        "检查至少一项与任务匹配的验证证据。",
        "将结果与原始完成标准逐项对照。",
      ],
      successText: "第一个成果已有清楚范围和可复查证据。",
      failureDiagnosticIds: [],
    },
    searchTerms: ["验收", "改动文件", "交付物", "测试", "构建", "证据"],
  },
];
