"use client";

import { useEffect, useReducer } from "react";
import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import type {
  GuideProgress,
  LearnerProfile,
  ManualTheme,
} from "../../content/field-guide/types.ts";
import {
  clearProgress,
  createEmptyProgress,
  loadProgress,
  reconcileProgress,
  saveProgress,
  type LoadProgressResult,
} from "../../lib/field-guide/progress-store.ts";
import {
  generateRoute,
  getNextStepId,
  type GeneratedRoute,
} from "../../lib/field-guide/route-engine.ts";

export type FieldGuideAction =
  | { type: "hydrate"; result: LoadProgressResult }
  | { type: "set-profile"; profile: LearnerProfile }
  | { type: "open-step"; stepId: string }
  | { type: "set-theme"; theme: ManualTheme }
  | { type: "storage-unavailable" }
  | { type: "confirm-corrupt-reset" }
  | { type: "reset-route" }
  | { type: "clear-all" };

type StorageMode = "ready" | "unavailable" | "corrupt";
type StorageIntent = "save" | "clear" | null;

export type FieldGuideState = {
  hydrated: boolean;
  progress: GuideProgress;
  route: GeneratedRoute | null;
  storageMode: StorageMode;
  corruptRaw: string | null;
  storageIntent: StorageIntent;
};

const initialState: FieldGuideState = {
  hydrated: false,
  progress: createEmptyProgress(),
  route: null,
  storageMode: "ready",
  corruptRaw: null,
  storageIntent: null,
};

function restoreRoute(progress: GuideProgress) {
  if (!progress.profile) return { progress, route: null };
  const route = generateRoute(fieldGuideCatalog, progress.profile);
  const reconciled = reconcileProgress(progress, route);
  const activeStepId = route.steps.some(
    (step) => step.id === reconciled.activeStepId,
  )
    ? reconciled.activeStepId
    : getNextStepId(route, reconciled.steps) ?? route.steps[0]?.id ?? null;
  return {
    route,
    progress: {
      ...reconciled,
      catalogVersion: fieldGuideCatalog.version,
      routeId: route.id,
      activeStepId,
    },
  };
}

export function fieldGuideReducer(
  state: FieldGuideState,
  action: FieldGuideAction,
): FieldGuideState {
  switch (action.type) {
    case "hydrate": {
      if (action.result.kind === "corrupt") {
        return {
          ...state,
          hydrated: true,
          progress: action.result.value,
          route: null,
          storageMode: "corrupt",
          corruptRaw: action.result.raw,
          storageIntent: null,
        };
      }
      const restored = restoreRoute(action.result.value);
      return {
        ...state,
        ...restored,
        hydrated: true,
        storageMode:
          action.result.kind === "unavailable" ? "unavailable" : "ready",
        corruptRaw: null,
        storageIntent:
          action.result.kind === "ready" && restored.route ? "save" : null,
      };
    }
    case "set-profile": {
      const route = generateRoute(fieldGuideCatalog, action.profile);
      const reconciled = reconcileProgress(
        { ...state.progress, profile: action.profile },
        route,
      );
      return {
        ...state,
        route,
        progress: {
          ...reconciled,
          catalogVersion: fieldGuideCatalog.version,
          routeId: route.id,
          activeStepId:
            getNextStepId(route, reconciled.steps) ?? route.steps[0]?.id ?? null,
        },
        storageIntent: "save",
      };
    }
    case "open-step":
      return {
        ...state,
        progress: { ...state.progress, activeStepId: action.stepId },
        storageIntent: "save",
      };
    case "set-theme":
      return {
        ...state,
        progress: { ...state.progress, theme: action.theme },
        storageIntent: "save",
      };
    case "storage-unavailable":
      return {
        ...state,
        storageMode: "unavailable",
        storageIntent: null,
      };
    case "confirm-corrupt-reset":
      return {
        ...initialState,
        hydrated: true,
        storageIntent: "save",
      };
    case "reset-route": {
      if (!state.route) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          activeStepId: state.route.steps[0]?.id ?? null,
          steps: {},
        },
        storageIntent: "save",
      };
    }
    case "clear-all":
      return {
        ...initialState,
        hydrated: true,
        storageIntent: "clear",
      };
  }
}

export function useFieldGuideState() {
  const [state, dispatch] = useReducer(fieldGuideReducer, initialState);

  useEffect(() => {
    dispatch({ type: "hydrate", result: loadProgress(window.localStorage) });
  }, []);

  useEffect(() => {
    if (!state.hydrated || state.storageMode !== "ready") return;
    if (state.storageIntent === "save") {
      const result = saveProgress(window.localStorage, state.progress);
      if (!result.ok) dispatch({ type: "storage-unavailable" });
    } else if (state.storageIntent === "clear") {
      const result = clearProgress(window.localStorage);
      if (!result.ok) dispatch({ type: "storage-unavailable" });
    }
  }, [state.hydrated, state.progress, state.storageIntent, state.storageMode]);

  return { state, dispatch };
}
