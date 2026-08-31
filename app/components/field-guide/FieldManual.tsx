"use client";

import { FieldGuideHeader } from "./FieldGuideHeader";
import { ProfileSetup } from "./ProfileSetup";
import { RouteBook } from "./RouteBook";
import { useFieldGuideState } from "./useFieldGuideState";

export function FieldManual() {
  const { state, dispatch } = useFieldGuideState();

  return (
    <main
      className="field-manual"
      data-field-guide
      data-hydrated={state.hydrated ? "true" : "false"}
      data-manual-theme={state.progress.theme}
    >
      <FieldGuideHeader route={state.route} theme={state.progress.theme} />
      {state.storageMode === "unavailable" ? (
        <p className="manual-storage-note" role="status">
          当前为临时会话；关闭页面后进度会丢失
        </p>
      ) : null}
      {state.storageMode === "corrupt" ? (
        <section className="manual-storage-error" role="alert">
          <h2>本地进度无法读取</h2>
          <p>我们没有自动清除数据。确认后可重新开始。</p>
          <button
            onClick={() => dispatch({ type: "confirm-corrupt-reset" })}
            type="button"
          >
            重置本地进度
          </button>
        </section>
      ) : state.route ? (
        <RouteBook route={state.route} />
      ) : (
        <ProfileSetup
          onCreate={(profile) => dispatch({ type: "set-profile", profile })}
        />
      )}
    </main>
  );
}
