import type { CoreVolume, LearningStep } from "../types.ts";

export const reliableWorkVolume: CoreVolume = {
  id: "reliable-work",
  title: "可靠工作",
  outcome: "建立可靠的工作习惯",
  estimatedMinutes: 13,
  stepIds: [
    "reliable.approvals",
    "reliable.context",
    "reliable.review",
    "reliable.complete",
  ],
};

export const reliableWorkSteps: LearningStep[] = [
  {
    id: "reliable.approvals",
    contentVersion: 1,
    volumeId: "reliable-work",
    outcome: "只批准符合预期的操作",
    estimatedMinutes: 3,
    sections: [
      {
        id: "approval-discipline",
        title: "把审批当作范围检查",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "文件写入或编辑、命令执行与网页访问需要审批时，审批条会显示工具名称和参数，“允许这一次”只放行当前请求。不要因为任务整体看起来合理就连续批准；每次都应核对动作、目标和影响范围。",
            ],
          },
          {
            type: "checklist",
            items: [
              "写入或编辑：路径属于当前工作目录，内容与任务要求一致",
              "命令执行：命令、参数和子目录都在预期范围内，不夹带无关操作",
              "网页访问：URL 是完成任务所需的公开来源，不包含本地或私网地址",
              "memory_save 不会显示标准的逐次审批提示：任务结束后到记忆中心核对保存内容，不应保留的信息立即删除",
              "任何参数看不懂或超出范围时选择拒绝，再要求 Agent 解释或缩小动作",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "审批不是完成证明",
            body: "允许操作只代表同意执行。执行后仍要检查工具结果、文件差异和验证证据。",
          },
        ],
      },
    ],
    searchTerms: ["审批", "允许这一次", "拒绝", "写入", "命令", "网页", "记忆"],
  },
  {
    id: "reliable.context",
    contentVersion: 1,
    volumeId: "reliable-work",
    outcome: "识别上下文与验证状态",
    estimatedMinutes: 3,
    sections: [
      {
        id: "context-health",
        title: "用 Context Hub 判断任务是否仍然可靠",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Context Hub 统一记录任务目标、计划、工具活动和工作区变化。上下文 revision 随事件推进，workspace revision 在文件变化时推进；这两个编号帮助你判断结论和证据是否仍基于当前状态。",
            ],
          },
          {
            type: "fields",
            items: [
              { label: "Checkpoint", value: "保存当前目标、决策、改动、计划状态与待办，便于恢复" },
              { label: "Stale evidence", value: "文件在验证后又发生变化，旧证据不能继续证明当前结果" },
              { label: "Task gate", value: "在计划、工具、子代理、未验证文件和过期证据都满足条件后才允许完成" },
            ],
          },
          {
            type: "checklist",
            items: [
              "长任务或准备切换工作前创建当前检查点",
              "看到未验证文件或过期证据时，重新运行与改动匹配的验证",
              "任务门禁阻塞时按列出的原因处理，不把阻塞状态当作完成",
            ],
          },
        ],
      },
    ],
    searchTerms: ["Context Hub", "revision", "checkpoint", "stale evidence", "task gate", "上下文"],
  },
  {
    id: "reliable.review",
    contentVersion: 1,
    volumeId: "reliable-work",
    outcome: "核对交付物与验证证据",
    estimatedMinutes: 4,
    sections: [
      {
        id: "delivery-review",
        title: "从进度走到可交付结论",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "任务详情把目标、进度、上下文、交付物和文件放在同一处。先确认计划进度，再沿着交付物回到实际文件，最后检查验证是否覆盖了本次改动。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "检查进度",
                detail: "确认计划步骤没有失败或遗漏，当前操作已经结束，子代理也不再运行。",
              },
              {
                title: "检查交付范围",
                detail: "逐个打开交付物与带改动标记的文件，排除不在任务说明中的额外变化。",
              },
              {
                title: "检查验证证据",
                detail: "确认测试、构建或人工检查成功，关联当前工作区 revision，且没有 stale 标记。",
              },
              {
                title: "记录剩余风险",
                detail: "无法验证的部分应明确写入摘要，而不是用笼统的完成声明代替证据。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: ["进度", "交付物", "改动", "验证证据", "未验证文件", "风险"],
  },
  {
    id: "reliable.complete",
    contentVersion: 1,
    volumeId: "reliable-work",
    outcome: "安全完成任务并继续工作",
    estimatedMinutes: 3,
    sections: [
      {
        id: "complete-and-continue",
        title: "通过任务门禁后完成",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Agent 使用 task_complete 提交完成状态时，Context Hub 会先检查计划、运行中的工具与子代理、未验证文件和过期证据。门禁通过后，应用生成可复查的任务报告；若被阻塞，应先解决列出的原因。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "确认完成门禁",
                detail: "等待任务详情显示“任务可完成”，不要跳过未验证文件或过期证据。",
              },
              {
                title: "阅读完成摘要",
                detail: "摘要应说明完成的结果、改动文件、验证结果和任何保留风险。",
              },
              {
                title: "选择下一项工作",
                detail: "同一目标的后续工作可继续当前项目；边界不同的目标应新建任务或会话，避免混淆上下文。",
              },
            ],
          },
          {
            type: "callout",
            tone: "success",
            title: "可靠完成",
            body: "完成不是停止输出，而是结果、范围与证据彼此一致，并能让下一位检查者复现结论。",
          },
        ],
      },
    ],
    validation: {
      id: "reliable.complete.gate",
      title: "确认任务已可靠完成",
      applicationSteps: [
        "在任务详情中确认 task gate 显示任务可完成。",
        "阅读完成报告并核对改动文件与验证结果。",
        "记录保留风险，再决定继续当前项目或开始新任务。",
      ],
      successText: "你已经完成 45 分钟核心路线，并建立了可复查的工作闭环。",
      failureDiagnosticIds: [],
    },
    searchTerms: ["task_complete", "任务完成", "task gate", "摘要", "新任务", "会话"],
  },
];
