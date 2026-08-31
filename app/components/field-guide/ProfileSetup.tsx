"use client";

import { useState, type FormEvent, type Ref } from "react";
import {
  platformOptions,
  providerOptions,
} from "../../content/field-guide/profile-options.ts";
import type {
  LearnerProfile,
  PlatformId,
  ProviderId,
} from "../../content/field-guide/types.ts";

type ProfileSetupProps = {
  headingRef?: Ref<HTMLHeadingElement>;
  onCreate: (profile: LearnerProfile) => void;
};

export function ProfileSetup({ headingRef, onCreate }: ProfileSetupProps) {
  const [platform, setPlatform] = useState<PlatformId | "">("");
  const [provider, setProvider] = useState<ProviderId | "">("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!platform || !provider) return;
    onCreate({ platform, provider });
  }

  return (
    <section className="manual-setup" aria-labelledby="manual-setup-title">
      <div className="manual-setup__intro">
        <p className="manual-kicker">准备环境 · 约 45 分钟</p>
        <h1 id="manual-setup-title" ref={headingRef} tabIndex={-1}>
          为你编排一份现场手册
        </h1>
        <p>
          先确认设备与模型服务，我们会把安装、连接、首次成果和可靠交付整理成一条连续路线。
        </p>
        <p className="manual-local-note">数据仅保存在当前浏览器</p>
      </div>

      <form className="manual-setup__form" onSubmit={submit}>
        <fieldset>
          <legend>你正在使用哪台设备？</legend>
          <div className="manual-choice-grid">
            {platformOptions.map((option) => (
              <label className="manual-choice" key={option.id}>
                <input
                  checked={platform === option.id}
                  name="platform"
                  onChange={() => setPlatform(option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>你准备连接哪一种模型服务？</legend>
          <div className="manual-choice-grid manual-choice-grid--providers">
            {providerOptions.map((option) => (
              <label className="manual-choice" key={option.id}>
                <input
                  checked={provider === option.id}
                  name="provider"
                  onChange={() => setProvider(option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className="manual-primary-action" disabled={!platform || !provider} type="submit">
          生成我的路线
        </button>
      </form>
    </section>
  );
}
