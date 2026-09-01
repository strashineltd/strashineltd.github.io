"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FieldGuideHeader } from "./FieldGuideHeader";
import { ProfileSetup } from "./ProfileSetup";
import { RouteBook } from "./RouteBook";
import { useFieldGuideState } from "./useFieldGuideState";

export function FieldManual() {
  const { state, dispatch } = useFieldGuideState();
  const pendingFocus = useRef<"route" | "setup" | null>(null);
  const routeHeading = useRef<HTMLHeadingElement>(null);
  const setupHeading = useRef<HTMLHeadingElement>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const openDirectory = useCallback(() => setDirectoryOpen(true), []);
  const closeDirectory = useCallback(() => setDirectoryOpen(false), []);

  useEffect(() => {
    if (pendingFocus.current === "route" && state.route) {
      routeHeading.current?.focus();
      pendingFocus.current = null;
    } else if (
      pendingFocus.current === "setup" &&
      !state.route &&
      state.storageMode !== "corrupt"
    ) {
      setupHeading.current?.focus();
      pendingFocus.current = null;
    }
  }, [state.route, state.storageMode]);

  return (
    <main
      className="field-manual"
      data-field-guide
      data-hydrated={state.hydrated ? "true" : "false"}
      data-manual-theme={state.progress.theme}
    >
      <FieldGuideHeader
        onOpenDirectory={openDirectory}
        route={state.route}
        theme={state.progress.theme}
      />
      {state.storageMode === "unavailable" ? (
        <p className="manual-storage-note" role="status">
          当前为临时会话；关闭页面后进度会丢失
        </p>
      ) : null}
      {state.storageMode === "corrupt" ? (
        <section className="manual-storage-error" role="alert">
          <h1>本地进度无法读取</h1>
          <p>我们没有自动清除数据。确认后可重新开始。</p>
          <button
            onClick={() => {
              pendingFocus.current = "setup";
              dispatch({ type: "confirm-corrupt-reset" });
            }}
            type="button"
          >
            重置本地进度
          </button>
        </section>
      ) : state.route ? (
        <RouteBook
          directoryOpen={directoryOpen}
          dispatch={dispatch}
          headingRef={routeHeading}
          onCloseDirectory={closeDirectory}
          onOpenDirectory={openDirectory}
          progress={state.progress}
          route={state.route}
        />
      ) : (
        <ProfileSetup
          headingRef={setupHeading}
          onCreate={(profile) => {
            pendingFocus.current = "route";
            dispatch({ type: "set-profile", profile });
          }}
        />
      )}
      <div className="manual-dialog-root" data-guide-dialog-root />
    </main>
  );
}
