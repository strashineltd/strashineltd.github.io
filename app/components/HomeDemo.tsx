"use client";

import {
  Check,
  ChevronDown,
  Circle,
  Command,
  FileCode2,
  Folder,
  Search,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useState } from "react";

const scenarios = [
  {
    label: "梳理项目",
    prompt: "阅读这个项目，说明结构和主要风险。",
    steps: ["扫描项目结构", "阅读入口与配置", "整理风险与建议"],
    file: "README.md",
  },
  {
    label: "修复测试",
    prompt: "定位失败测试，给出最小修复并验证。",
    steps: ["复现失败用例", "定位根因", "修改并重新运行测试"],
    file: "src/utils.test.ts",
  },
  {
    label: "更新文档",
    prompt: "根据代码更新安装与配置说明。",
    steps: ["核对当前配置", "更新快速开始", "检查链接与示例"],
    file: "docs/getting-started.md",
  },
];

export function HomeDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [approval, setApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const scenario = scenarios[scenarioIndex];

  function selectScenario(index: number) {
    setScenarioIndex(index);
    setApproval("pending");
    setPaletteOpen(false);
  }

  return (
    <div className="product-demo">
      <div className="demo-window-bar">
        <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
        <span>Stellara Work</span>
        <button type="button" onClick={() => setPaletteOpen((value) => !value)} aria-expanded={paletteOpen}>
          <Command aria-hidden="true" size={13} /> Ctrl K
        </button>
      </div>

      <div className="demo-tabs" aria-label="选择演示任务">
        {scenarios.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={scenarioIndex === index ? "demo-tab demo-tab--active" : "demo-tab"}
            onClick={() => selectScenario(index)}
            aria-pressed={scenarioIndex === index}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="demo-app">
        <aside className="demo-sidebar">
          <div className="demo-sidebar__brand">工作区</div>
          <button type="button" className="demo-new">＋ 新建任务</button>
          <div className="demo-search"><Search aria-hidden="true" size={12} /> 搜索会话</div>
          <div className="demo-project"><ChevronDown aria-hidden="true" size={12} /><Folder aria-hidden="true" size={13} /> Stellara</div>
          {scenarios.map((item, index) => (
            <button
              type="button"
              key={item.label}
              className={scenarioIndex === index ? "demo-session demo-session--active" : "demo-session"}
              onClick={() => selectScenario(index)}
            >
              <Circle aria-hidden="true" size={8} fill="currentColor" />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        <div className="demo-main">
          <div className="demo-main__header">
            <span>stellara / work</span>
            <button type="button">DeepSeek-v4-Pro <ChevronDown aria-hidden="true" size={12} /></button>
          </div>

          {approval === "pending" && (
            <div className="approval-bar" role="status">
              <ShieldCheck aria-hidden="true" size={15} />
              <span>准备写入 {scenario.file}</span>
              <button type="button" onClick={() => setApproval("rejected")}>拒绝</button>
              <button className="approval-bar__approve" type="button" onClick={() => setApproval("approved")}>同意</button>
            </div>
          )}

          <div className="demo-chat">
            <div className="demo-message demo-message--user">{scenario.prompt}</div>
            <div className="demo-message demo-message--agent">
              <span className="demo-agent-label">Agent</span>
              <p>我会先理解项目，再按最小改动完成任务。</p>
              <div className="demo-tool"><FileCode2 aria-hidden="true" size={14} /><span>读取 {scenario.file}</span><small>完成</small></div>
              <div className="demo-tool"><Terminal aria-hidden="true" size={14} /><span>检查项目状态</span><small>1.2s</small></div>
              {approval === "approved" && <div className="demo-result"><Check aria-hidden="true" size={14} /> 已确认，变更已写入并验证。</div>}
              {approval === "rejected" && <div className="demo-result demo-result--muted">操作已取消，没有修改任何文件。</div>}
            </div>
          </div>
        </div>

        <aside className="demo-workspace">
          <span className="demo-workspace__kicker">工作区</span>
          <h3>当前目标</h3>
          <p>{scenario.label}</p>
          <h3>计划</h3>
          <ol>
            {scenario.steps.map((step, index) => (
              <li key={step}><span>{index + 1}</span>{step}</li>
            ))}
          </ol>
          <div className="demo-progress"><span>进度</span><b>2 / 3</b></div>
          <div className="demo-progress-bar"><i /></div>
        </aside>
      </div>

      {paletteOpen && (
        <div className="demo-palette" role="dialog" aria-label="命令面板演示">
          <div><Search aria-hidden="true" size={14} /><span>搜索命令…</span><kbd>Esc</kbd></div>
          {scenarios.map((item, index) => (
            <button key={item.label} type="button" onClick={() => selectScenario(index)}>
              <span>{item.label}</span><small>切换演示任务</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
