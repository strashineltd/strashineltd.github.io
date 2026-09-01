"use client";

import { useState } from "react";
import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import type { ManualTheme } from "../../content/field-guide/types.ts";
import type { GeneratedRoute } from "../../lib/field-guide/route-engine.ts";
import { GuideDialog } from "./GuideDialog";

type GuideSettingsDialogProps = {
  open: boolean;
  route: GeneratedRoute;
  theme: ManualTheme;
  onClose: () => void;
  onSetTheme: (theme: ManualTheme) => void;
  onEditProfile: () => void;
  onResetRoute: () => void;
  onClearAll: () => void;
};

const themeOptions: Array<{ value: ManualTheme; label: string }> = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "日间版" },
  { value: "night", label: "夜间版" },
];

type ConfirmAction = "reset-route" | "clear-all" | null;

export function GuideSettingsDialog({
  open,
  route,
  theme,
  onClose,
  onSetTheme,
  onEditProfile,
  onResetRoute,
  onClearAll,
}: GuideSettingsDialogProps) {
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const platform = fieldGuideCatalog.platforms.find(
    (option) => option.id === route.profile.platform,
  );
  const provider = fieldGuideCatalog.providers.find(
    (option) => option.id === route.profile.provider,
  );

  return (
    <GuideDialog onClose={onClose} open={open} title="手册设置">
      <div className="manual-settings">
        <fieldset className="manual-settings__fieldset">
          <legend>外观主题</legend>
          <div className="manual-settings__themes">
            {themeOptions.map((option) => (
              <label key={option.value}>
                <input
                  checked={theme === option.value}
                  name="manual-theme"
                  onChange={() => onSetTheme(option.value)}
                  type="radio"
                  value={option.value}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="manual-settings__route">
          <h3>当前路线</h3>
          <p className="manual-settings__route-meta">
            {platform?.label} · {provider?.label} · {route.totalMinutes} 分钟
          </p>
          <button onClick={onEditProfile} type="button">
            重新生成路线
          </button>
          <button onClick={() => setConfirm("reset-route")} type="button">
            重置当前路线
          </button>
          <button onClick={() => setConfirm("clear-all")} type="button">
            清除全部本地数据
          </button>
        </div>

        {confirm === "reset-route" ? (
          <div className="manual-settings__confirm" role="alert">
            <p>确认重置当前路线？完成进度将被清空，路线条件与主题保留。</p>
            <button onClick={onResetRoute} type="button">
              确认重置
            </button>
            <button onClick={() => setConfirm(null)} type="button">
              取消
            </button>
          </div>
        ) : null}
        {confirm === "clear-all" ? (
          <div className="manual-settings__confirm" role="alert">
            <p>确认清除全部本地数据？将回到个性化设置，主题恢复为跟随系统。</p>
            <button onClick={onClearAll} type="button">
              确认清除
            </button>
            <button onClick={() => setConfirm(null)} type="button">
              取消
            </button>
          </div>
        ) : null}
      </div>
    </GuideDialog>
  );
}
