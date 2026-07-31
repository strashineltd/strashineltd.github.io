import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  FileCode2,
  FolderTree,
  Keyboard,
  LockKeyhole,
  SlidersHorizontal,
} from "lucide-react";
import { HomeDemo } from "./components/HomeDemo";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Stellara Work — 把复杂工作，留在本地完成。",
  description:
    "数据本地、模型自由、操作可控的 Windows 桌面 Agent。下载 Stellara Work v0.9 内测版。",
};

const principles = [
  {
    icon: Database,
    title: "数据留在本地",
    description: "会话、设置与工作记录保存在你的电脑里，项目上下文不必绕远路。",
  },
  {
    icon: SlidersHorizontal,
    title: "模型由你选择",
    description: "内置常用模型预设，也支持任意 OpenAI 兼容服务，一次配置即可切换。",
  },
  {
    icon: LockKeyhole,
    title: "每一步都可控",
    description: "写文件与运行命令前先展示操作内容；你确认后，Agent 才会继续。",
  },
];

const capabilities = [
  { icon: FolderTree, label: "项目与会话分组" },
  { icon: FileCode2, label: "文件、Diff 与终端结果" },
  { icon: Keyboard, label: "命令面板与快捷键" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero page-shell">
          <div className="hero__copy">
            <div className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              v0.9 内测版 · Windows x64
            </div>
            <h1>把复杂工作，<br />留在本地完成。</h1>
            <p className="hero__lead">
              Stellara Work 是一款面向真实项目的 Windows 桌面 Agent。
              它理解你的工作区、执行计划和工具调用，同时把数据与决定权留给你。
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/download">
                下载 v0.9
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="button button--secondary" href="/docs">
                查看使用文档
              </Link>
            </div>
            <ul className="hero__proof" aria-label="产品特性摘要">
              <li><Check aria-hidden="true" size={16} />无需账号体系</li>
              <li><Check aria-hidden="true" size={16} />支持自定义模型</li>
              <li><Check aria-hidden="true" size={16} />安装包 111.8 MiB</li>
            </ul>
          </div>

          <div className="hero__demo">
            <HomeDemo />
          </div>
        </section>

        <section className="principles section page-shell" aria-labelledby="principles-title">
          <div className="section-heading section-heading--split">
            <div>
              <span className="section-kicker">设计原则</span>
              <h2 id="principles-title">不是黑盒，是一张清晰的工作台。</h2>
            </div>
            <p>从模型配置到每一次文件改动，关键状态都在界面里说清楚。</p>
          </div>
          <div className="principle-grid">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <article className="principle-card" key={title}>
                <div className="principle-card__topline">
                  <span className="icon-box"><Icon aria-hidden="true" size={20} /></span>
                  <span className="card-index">0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow section section--soft" aria-labelledby="workflow-title">
          <div className="page-shell">
            <div className="section-heading section-heading--center">
              <span className="section-kicker">工作方式</span>
              <h2 id="workflow-title">从一句需求，到可复查的结果。</h2>
              <p>Stellara Work 把复杂任务拆开呈现，让你随时知道正在发生什么。</p>
            </div>
            <div className="workflow-grid">
              <article>
                <span>01</span>
                <h3>选择工作目录</h3>
                <p>让 Agent 在明确的项目边界内读取代码、文档与配置。</p>
              </article>
              <ChevronRight className="workflow-arrow" aria-hidden="true" />
              <article>
                <span>02</span>
                <h3>描述要完成的事</h3>
                <p>计划、工具调用与进度集中呈现，长任务也不会失去方向。</p>
              </article>
              <ChevronRight className="workflow-arrow" aria-hidden="true" />
              <article>
                <span>03</span>
                <h3>审核并交付</h3>
                <p>危险操作先确认，文件变更可复查，结果与过程都能留档。</p>
              </article>
            </div>
          </div>
        </section>

        <section className="capability-section section page-shell" aria-labelledby="capability-title">
          <div className="capability-panel">
            <div className="capability-panel__copy">
              <span className="section-kicker section-kicker--light">为高频工作设计</span>
              <h2 id="capability-title">需要的时候很快，复杂的时候不乱。</h2>
              <p>
                侧栏管理项目与会话，主区保留完整对话，工作区同步目标、进度和交付物。
                你也可以用命令面板和快捷键完成高频操作。
              </p>
              <div className="capability-list">
                {capabilities.map(({ icon: Icon, label }) => (
                  <div key={label}><Icon aria-hidden="true" size={18} /><span>{label}</span></div>
                ))}
              </div>
              <Link className="text-link text-link--light" href="/docs">
                了解完整功能 <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="model-stack" aria-label="支持的模型服务">
              <div className="model-stack__header"><span>模型服务</span><span>可随时切换</span></div>
              {["GLM-5.2", "DeepSeek-v4-Pro", "Kimi-K3", "MiniMax-M3", "OpenAI 兼容模型"].map((model, index) => (
                <div className={`model-row${index === 1 ? " model-row--active" : ""}`} key={model}>
                  <span className="model-row__mark">{model.slice(0, 1)}</span>
                  <span>{model}</span>
                  {index === 1 ? <small>当前</small> : <ChevronRight aria-hidden="true" size={15} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta page-shell">
          <div>
            <span className="section-kicker">开始使用</span>
            <h2>把下一件复杂的事，交给更清晰的工作流。</h2>
          </div>
          <div className="final-cta__actions">
            <Link className="button button--primary" href="/download">下载 Windows 版</Link>
            <Link className="text-link" href="/docs">先阅读文档 <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
