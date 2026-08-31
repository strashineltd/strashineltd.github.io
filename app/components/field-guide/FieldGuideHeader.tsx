import type { ManualTheme } from "../../content/field-guide/types.ts";
import type { GeneratedRoute } from "../../lib/field-guide/route-engine.ts";

type FieldGuideHeaderProps = {
  route: GeneratedRoute | null;
  theme: ManualTheme;
};

const themeLabels: Record<ManualTheme, string> = {
  system: "跟随系统",
  light: "日间版",
  night: "夜间版",
};

export function FieldGuideHeader({ route, theme }: FieldGuideHeaderProps) {
  return (
    <header className="manual-header">
      <div>
        <p className="manual-brand">Stellara Field Notes</p>
        <p className="manual-edition">Stellara Work v0.9.2 · 个性化现场手册</p>
      </div>
      <div className="manual-header__tools">
        <span className="manual-theme-status">{themeLabels[theme]}</span>
        <button aria-label="搜索手册" disabled={!route} type="button">
          搜索
        </button>
      </div>
    </header>
  );
}
