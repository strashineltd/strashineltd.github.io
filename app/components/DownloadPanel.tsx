"use client";

import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  FileCheck2,
  FolderKanban,
  HardDrive,
  Laptop,
  Monitor,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { DownloadDemo } from "./DownloadDemo";

const installerName = "Stellara Work-Setup-0.9.0.exe";
const sha256 = "78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037";

const releaseNotes = [
  "项目与会话分组、搜索、重命名和导出",
  "三栏紧凑工作台与可切换工作区模式",
  "文件读写、命令执行、Diff 与结果卡片",
  "危险操作审批顶部条与计划模式",
  "模型管理、Skills 和可配置快捷键",
];

export function DownloadPanel() {
  const [copied, setCopied] = useState(false);

  async function copyHash() {
    await navigator.clipboard.writeText(sha256);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <section className="download-hero">
        <div className="page-shell download-hero__grid">
          <div className="download-hero__copy">
            <span className="eyebrow"><span className="status-dot" aria-hidden="true" />v0.9 内测版</span>
            <h1>下载 Stellara Work</h1>
            <p className="download-hero__lead">
              为 Windows x64 打造的本地优先桌面 Agent。安装后选择模型和工作目录，即可开始第一个任务。
            </p>
            <div className="download-hero__actions">
              <button className="button button--primary button--download" type="button" disabled>
                <ShieldCheck aria-hidden="true" size={19} />
                下载通道准备中
              </button>
              <span>安装包已构建 · 111.8 MiB · x64 · 2026-07-30</span>
            </div>
            <div className="download-feedback" role="status">
              <CheckCircle2 aria-hidden="true" size={17} />
              v0.9 安装包已通过本地构建验证，公开文件托管通道正在准备。
            </div>
            <ul className="download-chips" aria-label="版本摘要">
              <li><span className="download-chip__dot" aria-hidden="true" />Windows x64 <strong>可下载</strong></li>
              <li>NSIS 安装向导</li>
              <li>版本 <strong>0.9.0</strong></li>
            </ul>
          </div>

          <div className="download-hero__demo">
            <DownloadDemo />
          </div>
        </div>
      </section>

      <section className="platform-section section page-shell" aria-labelledby="platform-title">
        <div className="section-heading section-heading--split">
          <div><span className="section-kicker">可用平台</span><h2 id="platform-title">选择你的系统</h2></div>
          <p>v0.9 当前提供 Windows x64 安装包；其他平台尚未提供。</p>
        </div>
        <div className="platform-grid">
          <article className="platform-card platform-card--available">
            <div className="platform-card__header">
              <span className="icon-box"><Monitor aria-hidden="true" size={22} /></span>
              <span className="availability">可下载</span>
            </div>
            <h3>Windows</h3>
            <p>64 位安装包，支持自定义安装目录、桌面与开始菜单快捷方式。</p>
            <span className="platform-card__disabled">安装包暂未公开托管</span>
          </article>
          <article className="platform-card">
            <div className="platform-card__header">
              <span className="icon-box"><Apple aria-hidden="true" size={22} /></span>
              <span className="availability availability--muted">尚未提供</span>
            </div>
            <h3>macOS</h3>
            <p>当前版本没有 macOS 构建。请关注后续版本更新。</p>
            <span className="platform-card__disabled">暂不可下载</span>
          </article>
          <article className="platform-card">
            <div className="platform-card__header">
              <span className="icon-box"><Terminal aria-hidden="true" size={22} /></span>
              <span className="availability availability--muted">尚未提供</span>
            </div>
            <h3>Linux</h3>
            <p>当前版本没有 Linux 构建。请关注后续版本更新。</p>
            <span className="platform-card__disabled">暂不可下载</span>
          </article>
        </div>
      </section>

      <section className="version-section section section--soft" aria-labelledby="version-title">
        <div className="page-shell">
          <span className="section-kicker">版本信息</span>
          <h2 id="version-title" className="version-title">v0.9.0 内测版</h2>
          <p className="version-lead">这一版本已经完成从项目、会话到执行与审批的桌面工作闭环。</p>
          <div className="version-layout">
            <article className="version-card">
              <span className="version-card__badge">内测版</span>
              <h3 className="version-card__num">v0.9.0</h3>
              <dl className="version-card__meta">
                <div><dt>发布日期</dt><dd>2026-07-30</dd></div>
              </dl>
              <div className="version-card__status">
                <span className="version-card__ok"><Check aria-hidden="true" size={14} />已通过本地构建验证</span>
                <span className="version-card__wait">公开托管通道准备中</span>
              </div>
            </article>

            <article className="changelog-card">
              <div className="changelog-card__head">
                <h3>本次更新</h3>
                <small>2026-07-30</small>
              </div>
              <ul className="release-notes">
                {releaseNotes.map((note) => (
                  <li key={note}><Check aria-hidden="true" size={15} /><span>{note}</span></li>
                ))}
              </ul>
            </article>

            <aside className="install-card" aria-label="安装信息">
              <div className="install-card__head">
                <span className="icon-box"><FileCheck2 aria-hidden="true" size={20} /></span>
                <h3>安装信息</h3>
              </div>
              <dl>
                <div><dt><Laptop aria-hidden="true" size={18} />系统</dt><dd>Windows x64</dd></div>
                <div><dt><HardDrive aria-hidden="true" size={18} />包体积</dt><dd>111.8 MiB</dd></div>
                <div><dt><FolderKanban aria-hidden="true" size={18} />文件</dt><dd>{installerName}</dd></div>
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{sha256}</code>
                    <button type="button" onClick={copyHash} aria-label="复制 SHA-256 校验值">
                      {copied ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copied ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
              </dl>
              <p className="install-card__note">安装器未设置额外的 Windows 版本限制。下载后可复制 SHA-256 校验文件完整性。</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="download-help page-shell">
        <div>
          <span className="section-kicker">第一次使用？</span>
          <h2>安装后，三步开始第一个任务。</h2>
        </div>
        <ol>
          <li><span>1</span><p><strong>选择模型</strong>使用内置预设或添加兼容服务。</p></li>
          <li><span>2</span><p><strong>选择目录</strong>指定 Agent 可以理解和操作的项目。</p></li>
          <li><span>3</span><p><strong>描述任务</strong>从分析项目或修复一个小问题开始。</p></li>
        </ol>
        <Link className="text-link" href="/docs">阅读快速开始 <ArrowRight aria-hidden="true" size={16} /></Link>
      </section>
    </>
  );
}