"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchResult } from "../../lib/field-guide/search-index.ts";
import { FieldGuideHeader } from "./FieldGuideHeader";
import { GuideSettingsDialog } from "./GuideSettingsDialog";
import { ProfileSetup } from "./ProfileSetup";
import { RouteBook } from "./RouteBook";
import { SearchDialog } from "./SearchDialog";
import { useFieldGuideState } from "./useFieldGuideState";

export function FieldManual() {
  const { state, dispatch } = useFieldGuideState();
  const pendingFocus = useRef<"route" | "setup" | null>(null);
  const routeHeading = useRef<HTMLHeadingElement>(null);
  const setupHeading = useRef<HTMLHeadingElement>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showCorruptRaw, setShowCorruptRaw] = useState(false);

  const openDirectory = useCallback(() => {
    setSearchOpen(false);
    setSettingsOpen(false);
    setDirectoryOpen(true);
  }, []);
  const closeDirectory = useCallback(() => setDirectoryOpen(false), []);
  const openSearch = useCallback(() => {
    setDirectoryOpen(false);
    setSettingsOpen(false);
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openSettings = useCallback(() => {
    setDirectoryOpen(false);
    setSearchOpen(false);
    setSettingsOpen(true);
  }, []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.metaKey && !event.ctrlKey) return;
      if (event.key.toLowerCase() !== "k") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-manual-search-input]")) return;
      if (!state.route) return;
      event.preventDefault();
      openSearch();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSearch, state.route]);

  useEffect(() => {
    function handleOpenSearchEvent() {
      openSearch();
    }
    document.addEventListener("manual:open-search", handleOpenSearchEvent);
    return () => document.removeEventListener("manual:open-search", handleOpenSearchEvent);
  }, [openSearch]);

  function selectSearchResult(result: SearchResult) {
    if (result.kind === "step") {
      dispatch({ type: "open-step", stepId: result.id });
      window.history.replaceState(window.history.state, "", `#${result.id}`);
    } else if (result.kind === "diagnostic" && result.targetStepId) {
      dispatch({ type: "open-step", stepId: result.targetStepId });
      dispatch({ type: "open-diagnostic", branchId: result.id });
      window.history.replaceState(window.history.state, "", `#${result.targetStepId}`);
    }
  }

  return (
    <main
      className="field-manual"
      data-field-guide
      data-hydrated={state.hydrated ? "true" : "false"}
      data-manual-theme={state.progress.theme}
    >
      <FieldGuideHeader
        onOpenDirectory={openDirectory}
        onOpenSearch={openSearch}
        onOpenSettings={openSettings}
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
            aria-expanded={showCorruptRaw}
            onClick={() => setShowCorruptRaw((value) => !value)}
            type="button"
          >
            检查失败的数据
          </button>
          {showCorruptRaw && state.corruptRaw !== null ? (
            <pre className="manual-storage-error__raw">{state.corruptRaw}</pre>
          ) : null}
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
          diagnosticBranchId={state.diagnosticBranchId}
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
      <SearchDialog
        currentStepIds={state.route?.steps.map((step) => step.id) ?? []}
        key={`search-${searchOpen}`}
        onClose={closeSearch}
        onSelectResult={selectSearchResult}
        open={searchOpen}
      />
      {state.route ? (
        <GuideSettingsDialog
          key={`settings-${settingsOpen}`}
          onClearAll={() => {
            pendingFocus.current = "setup";
            dispatch({ type: "clear-all" });
            closeSettings();
          }}
          onClose={closeSettings}
          onEditProfile={() => {
            pendingFocus.current = "setup";
            dispatch({ type: "edit-profile" });
            closeSettings();
          }}
          onResetRoute={() => {
            dispatch({ type: "reset-route" });
            closeSettings();
          }}
          onSetTheme={(theme) => dispatch({ type: "set-theme", theme })}
          open={settingsOpen}
          route={state.route}
          theme={state.progress.theme}
        />
      ) : null}
    </main>
  );
}
