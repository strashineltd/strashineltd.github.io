"use client";

import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  FileCheck2,
  Laptop,
  Monitor,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { DownloadDemo } from "./DownloadDemo";

const releaseUrl = "https://github.com/strashineltd/stellara-work/releases";
const winInstallerName = "Stellara.Work-Setup-0.9.2-x64.exe";
const winSize = "117.5 MiB";
const winSha256 = "5C46E367AB265873C2C1D6FBA3B4F32D720ACFE03D5D52F9F5DA5BFA0564BD03";
const macInstallerName = "Stellara.Work-0.9.2-arm64.dmg";
const macSize = "144.6 MiB";
const macSha256 = "225C70E36C43B5426F2C5C5726BACA7DA722B1BD98C7F269B5BD7BD3EF9EFC5D";
const macX64InstallerName = "Stellara.Work-0.9.2-x64.dmg";
const macX64Size = "146.3 MiB";
const macX64Sha256 = "DE926EFAEB8088CB578FA09ECCDC8951BDBB55935C247FBA8876D82E7D74BF8B";

const releaseNotes = [
  "Responses API 与 Anthropic Messages 双协议模型连接",
  "Context Hub 上下文检查点与任务门禁",
  "会话级子代理协调与角色并发（研究/构建/验证）",
  "克制动效系统：菜单、页面、状态与微交互",
  "新增 DeepSeek-V4-Flash、Qwen3.8-Max、GLM-5.3 模型预设",
];

export function DownloadPanel() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function copyHash(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  }

  return (
    <>
      <section className="download-hero">
        <div className="page-shell download-hero__grid">
          <div className="download-hero__copy">
            <span className="eyebrow"><span className="status-dot" aria-hidden="true" />v0.9.2 内测版</span>
            <h1>下载 Stellara Work</h1>
            <p className="download-hero__lead">
              为 Windows 与 macOS 打造的本地优先桌面 Agent。安装后选择模型和工作目录，即可开始第一个任务。
            </p>
            <div className="download-hero__actions">
              <a
                className="button button--primary button--download"
                href={releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download aria-hidden="true" size={19} />
                前往下载
              </a>
              <span>Windows x64 与 macOS (arm64 / x64) · 2026-08-28</span>
            </div>
            <div className="download-feedback" role="status">
              <CheckCircle2 aria-hidden="true" size={17} />
              v0.9.2 已开放下载，安装包通过 GitHub Releases 提供。
            </div>
            <ul className="download-chips" aria-label="版本摘要">
              <li><span className="download-chip__dot" aria-hidden="true" />Windows x64 <strong>可下载</strong></li>
              <li><span className="download-chip__dot" aria-hidden="true" />macOS (arm64) <strong>可下载</strong></li>
              <li>版本 <strong>0.9.2</strong></li>
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
          <p>v0.9.2 提供 Windows x64 与 macOS (arm64 / x64) 安装包；Linux 尚未提供。</p>
        </div>
        <div className="platform-grid">
          <article className="platform-card platform-card--available">
            <div className="platform-card__header">
              <span className="icon-box"><Monitor aria-hidden="true" size={22} /></span>
              <span className="availability">可下载</span>
            </div>
            <h3>Windows</h3>
            <p>64 位安装包，支持自定义安装目录、桌面与开始菜单快捷方式。</p>
            <a
              className="platform-card__link"
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往 GitHub 下载 <ArrowRight aria-hidden="true" size={15} />
            </a>
          </article>
          <article className="platform-card platform-card--available">
            <div className="platform-card__header">
              <span className="icon-box"><Apple aria-hidden="true" size={22} /></span>
              <span className="availability">可下载</span>
            </div>
            <h3>macOS</h3>
            <p>Apple 芯片与 Intel · 需 macOS 12 或更高版本。</p>
            <a
              className="platform-card__link"
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往 GitHub 下载 <ArrowRight aria-hidden="true" size={15} />
            </a>
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
          <h2 id="version-title" className="version-title">v0.9.2 内测版</h2>
          <p className="version-lead">这一版本已经完成从项目、会话到执行与审批的桌面工作闭环。</p>
          <div className="version-layout">
            <article className="version-card">
              <span className="version-card__badge">内测版</span>
              <h3 className="version-card__num">v0.9.2</h3>
              <dl className="version-card__meta">
                <div><dt>发布日期</dt><dd>2026-08-28</dd></div>
              </dl>
              <div className="version-card__status">
                <span className="version-card__ok"><Check aria-hidden="true" size={14} />已通过本地构建验证</span>
                <span className="version-card__wait">已通过 GitHub Releases 开放下载</span>
              </div>
            </article>

            <article className="changelog-card">
              <div className="changelog-card__head">
                <h3>本次更新</h3>
                <small>2026-08-28</small>
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
                <div><dt><Monitor aria-hidden="true" size={18} />系统</dt><dd>Windows x64 · macOS (arm64 / x64)</dd></div>
                <div><dt><Laptop aria-hidden="true" size={18} />Windows 安装包</dt><dd>{winInstallerName} · {winSize}</dd></div>
                <div><dt><Apple aria-hidden="true" size={18} />macOS 安装包</dt><dd>{macInstallerName} · {macSize}</dd></div>
                <div><dt><Apple aria-hidden="true" size={18} />macOS (Intel) 安装包</dt><dd>{macX64InstallerName} · {macX64Size}</dd></div>
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />Windows SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{winSha256}</code>
                    <button type="button" onClick={() => copyHash("win", winSha256)} aria-label="复制 Windows SHA-256 校验值">
                      {copiedKey === "win" ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copiedKey === "win" ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />macOS SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{macSha256}</code>
                    <button type="button" onClick={() => copyHash("mac", macSha256)} aria-label="复制 macOS SHA-256 校验值">
                      {copiedKey === "mac" ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copiedKey === "mac" ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
                <div className="install-card__hash">
                  <dt><Clipboard aria-hidden="true" size={18} />macOS (Intel) SHA-256</dt>
                  <dd>
                    <code className="install-card__hash-code">{macX64Sha256}</code>
                    <button type="button" onClick={() => copyHash("macx64", macX64Sha256)} aria-label="复制 macOS (Intel) SHA-256 校验值">
                      {copiedKey === "macx64" ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                      {copiedKey === "macx64" ? "已复制" : "复制"}
                    </button>
                  </dd>
                </div>
              </dl>
              <p className="install-card__note">Windows 无额外版本限制；macOS 需 12.0 或更高版本。</p>
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