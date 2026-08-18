"use client";

import { Check, ShieldCheck } from "lucide-react";

export function DownloadDemo() {
  return (
    <div className="download-demo">
      <div className="download-demo__glow" aria-hidden="true" />
      <div className="download-demo__window">
        <div className="download-demo__bar">
          <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
          <span>Stellara Work · 首次引导</span>
          <small>v0.9</small>
        </div>
        <div className="download-demo__body">
          <aside className="download-demo__steps">
            <span className="download-demo__steps-label">引导</span>
            <div className="download-demo__step download-demo__step--active">
              <span className="download-demo__num">1</span>选择模型
            </div>
            <div className="download-demo__step">
              <span className="download-demo__num">2</span>选择目录
            </div>
            <div className="download-demo__step">
              <span className="download-demo__num">3</span>连接测试
            </div>
          </aside>
          <div className="download-demo__main">
            <div className="download-demo__head">
              <span>DeepSeek-v4-Pro <em>当前</em></span>
              <small>工作目录 · D:\project</small>
            </div>
            <div className="download-demo__message">
              <span className="download-demo__tag">Agent</span>
              <p>已连接到模型服务。我将在你确认的项目目录内开始第一个任务。</p>
            </div>
            <div className="download-demo__approval">
              <ShieldCheck aria-hidden="true" size={13} />
              <strong>准备写入 README.md</strong>
              <span className="download-demo__actions">
                <button type="button" tabIndex={-1}>拒绝</button>
                <button type="button" tabIndex={-1} className="download-demo__approve">允许这一次</button>
              </span>
            </div>
            <div className="download-demo__ok">
              <Check aria-hidden="true" size={12} />连接测试通过，配置已保存
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
