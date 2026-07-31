"use client";

import {
  BookOpen,
  Check,
  ChevronRight,
  Clipboard,
  Command,
  FileKey2,
  FolderOpen,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type DocArticle = {
  id: string;
  group: string;
  title: string;
  summary: string;
  icon: typeof BookOpen;
  sections: Array<{
    title: string;
    body: string;
    code?: string;
    note?: string;
    steps?: string[];
  }>;
};

const articles: DocArticle[] = [
  {
    id: "quick-start",
    group: "开始使用",
    title: "快速开始",
    summary: "安装、首次启动，并在几分钟内完成第一个任务。",
    icon: Sparkles,
    sections: [
      {
        title: "安装 Stellara Work",
        body: "下载 Windows x64 安装包并按向导完成安装。首次打开时，应用会引导你选择模型和工作目录。",
        steps: ["下载 v0.9 安装包", "选择一个模型服务", "选择要处理的项目目录", "输入第一条任务说明"],
      },
      {
        title: "写好第一条任务",
        body: "说明目标、期望结果和边界。Stellara Work 会先读取上下文，再展示计划与工具调用。",
        code: "阅读当前项目的 README 和入口文件，\n说明项目结构、运行方式和最值得优先处理的三个问题。",
        note: "如果只想分析、不希望修改文件，可以开启“计划模式”。",
      },
    ],
  },
  {
    id: "models",
    group: "配置",
    title: "配置模型",
    summary: "使用内置预设，或连接任意 OpenAI 兼容服务。",
    icon: SlidersHorizontal,
    sections: [
      {
        title: "内置模型预设",
        body: "当前内置 GLM-5.2、DeepSeek-v4-Pro、Kimi-K3 与 MiniMax-M3。你可以在设置中添加多个配置，并从聊天顶部快速切换。",
      },
      {
        title: "添加自定义模型",
        body: "打开“设置 → 模型 → 添加模型”，填写显示名称、Base URL、模型 ID 和 API Key。服务需兼容 OpenAI API 协议。",
        code: "Base URL  https://example.com/v1\n模型 ID    your-model-name\nAPI Key    sk-••••••••",
        note: "API Key 保存在主进程配置中，渲染界面不会直接读取密钥。",
      },
    ],
  },
  {
    id: "workspace",
    group: "核心概念",
    title: "项目与工作区",
    summary: "理解工作目录、项目分组和右侧工作区面板。",
    icon: FolderOpen,
    sections: [
      {
        title: "工作目录是安全边界",
        body: "Agent 会以你选择的目录作为主要工作范围。明确的目录能减少无关扫描，也让文件变更更容易复查。",
      },
      {
        title: "项目与会话",
        body: "左侧栏可按项目组织会话。每个会话保存独立上下文，可重命名、搜索、导出或继续执行。",
        steps: ["创建或选择项目", "在项目内新建会话", "从历史会话继续任务", "需要时导出 JSON 记录"],
      },
      {
        title: "右侧工作区",
        body: "工作区同步显示当前目标、计划步骤、完成进度、交付物与本次触碰的文件。",
      },
    ],
  },
  {
    id: "approvals",
    group: "安全与控制",
    title: "操作审批",
    summary: "在写文件和执行命令前，清楚看到将要发生什么。",
    icon: ShieldCheck,
    sections: [
      {
        title: "哪些操作需要确认",
        body: "读取与搜索通常可直接进行；写文件、编辑文件和运行可能改变系统状态的命令会进入审批流程。",
      },
      {
        title: "审批顶部条",
        body: "待确认操作会出现在消息流上方，并展示工具名、目标与摘要。选择“同意”后执行，选择“拒绝”则继续对话但不做修改。",
        note: "按 Esc 可以快速拒绝当前审批。",
      },
    ],
  },
  {
    id: "shortcuts",
    group: "效率",
    title: "快捷键与命令面板",
    summary: "用键盘切换面板、模型和常用动作。",
    icon: Command,
    sections: [
      {
        title: "常用快捷键",
        body: "快捷键可在“设置 → 快捷键”中重新录制或恢复默认。",
        code: "Ctrl + K        打开命令面板\nCtrl + B        切换会话侧栏\nCtrl + Shift + W 切换右侧工作区\nCtrl + Enter    发送消息\nCtrl + ,        打开设置",
      },
      {
        title: "命令面板",
        body: "命令面板集中提供导航、会话、模型、主题和界面操作。输入关键词即可筛选，无需离开键盘。",
      },
    ],
  },
  {
    id: "local-data",
    group: "安全与控制",
    title: "本地数据与密钥",
    summary: "了解会话、设置和 API Key 在本机的保存方式。",
    icon: FileKey2,
    sections: [
      {
        title: "本地存储",
        body: "会话与设置使用本地数据库和配置文件保存。应用不要求你先创建云端账号。",
      },
      {
        title: "渲染进程隔离",
        body: "应用关闭 Node 集成并启用上下文隔离与沙箱。API Key 留在主进程，界面通过受控 IPC 发起请求。",
        note: "本地优先并不等于离线模型；调用在线模型时，请同时遵守对应服务商的数据政策。",
      },
    ],
  },
  {
    id: "settings",
    group: "配置",
    title: "设置与技能",
    summary: "管理模型、会话、应用偏好、Skills 和快捷键。",
    icon: Settings2,
    sections: [
      {
        title: "统一设置中心",
        body: "设置窗口按模型、会话、应用、Skills 与快捷键组织。你可以调整主题、工作区模式和常用行为。",
      },
      {
        title: "Skills",
        body: "Skills 让 Agent 了解特定领域的工作流程。技能保存在工作目录中，可在设置里查看并刷新。",
      },
    ],
  },
];

export function DocsExplorer() {
  const [activeId, setActiveId] = useState(articles[0].id);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return articles;
    return articles.filter((article) =>
      [article.title, article.summary, article.group, ...article.sections.flatMap((section) => [section.title, section.body])]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const active = articles.find((article) => article.id === activeId) ?? articles[0];
  const ActiveIcon = active.icon;
  const groups = Array.from(new Set(filtered.map((article) => article.group)));

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "/" && document.activeElement !== searchRef.current) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  async function copyCode(code: string, key: string) {
    await navigator.clipboard.writeText(code);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <>
      <section className="docs-hero">
        <div className="page-shell docs-hero__inner">
          <div>
            <span className="section-kicker">Stellara Work 文档</span>
            <h1>从安装到交付，清楚地走完每一步。</h1>
            <p>查找模型配置、工作区、安全审批和快捷键的使用方法。</p>
          </div>
          <label className="docs-search">
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">搜索文档</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="搜索文档…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="清除搜索">
                <X aria-hidden="true" size={16} />
              </button>
            ) : <kbd>/</kbd>}
          </label>
        </div>
      </section>

      <div className="docs-layout page-shell">
        <aside className="docs-sidebar" aria-label="文档目录">
          {filtered.length === 0 ? (
            <div className="docs-empty">
              <Search aria-hidden="true" size={20} />
              <strong>没有找到相关内容</strong>
              <span>换一个关键词试试。</span>
            </div>
          ) : groups.map((group) => (
            <div className="docs-group" key={group}>
              <h2>{group}</h2>
              {filtered.filter((article) => article.group === group).map((article) => {
                const Icon = article.icon;
                const selected = article.id === active.id;
                return (
                  <button
                    key={article.id}
                    type="button"
                    className={`docs-nav-item${selected ? " docs-nav-item--active" : ""}`}
                    onClick={() => setActiveId(article.id)}
                    aria-current={selected ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" size={16} />
                    <span>{article.title}</span>
                    <ChevronRight aria-hidden="true" size={14} />
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <article className="docs-article" key={active.id}>
          <div className="docs-breadcrumb"><span>文档</span><ChevronRight aria-hidden="true" size={13} /><span>{active.group}</span></div>
          <div className="docs-article__header">
            <ActiveIcon aria-hidden="true" size={24} />
            <div><h2>{active.title}</h2><p>{active.summary}</p></div>
          </div>

          {active.sections.map((section, sectionIndex) => (
            <section className="docs-section" id={`${active.id}-${sectionIndex}`} key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              {section.steps && (
                <ol className="docs-steps">
                  {section.steps.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}
                </ol>
              )}
              {section.code && (
                <div className="code-block">
                  <div className="code-block__header"><span>示例</span><button type="button" onClick={() => copyCode(section.code!, `${active.id}-${sectionIndex}`)}>
                    {copied === `${active.id}-${sectionIndex}` ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                    {copied === `${active.id}-${sectionIndex}` ? "已复制" : "复制"}
                  </button></div>
                  <pre><code>{section.code}</code></pre>
                </div>
              )}
              {section.note && <aside className="docs-note"><ShieldCheck aria-hidden="true" size={17} /><p>{section.note}</p></aside>}
            </section>
          ))}

          <div className="docs-next">
            <span>下一步</span>
            {(() => {
              const currentIndex = articles.findIndex((article) => article.id === active.id);
              const next = articles[(currentIndex + 1) % articles.length];
              return <button type="button" onClick={() => setActiveId(next.id)}>{next.title}<ChevronRight aria-hidden="true" size={16} /></button>;
            })()}
          </div>
        </article>

        <aside className="docs-on-this-page" aria-label="本文目录">
          <span>本文内容</span>
          {active.sections.map((section, index) => <a key={section.title} href={`#${active.id}-${index}`}>{section.title}</a>)}
        </aside>
      </div>
    </>
  );
}
