import type {
  GuideProgress,
  LearningStep,
  ManualTheme,
  PlatformId,
  ProviderId,
  StepProgress,
  ValidationResult,
} from "../../content/field-guide/types.ts";
import { platformOptions, providerOptions } from "../../content/field-guide/profile-options.ts";

export const FIELD_GUIDE_STORAGE_KEY = "stellara.field-guide.progress.v1";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LoadProgressResult =
  | { kind: "empty"; value: GuideProgress }
  | { kind: "ready"; value: GuideProgress }
  | { kind: "corrupt"; value: GuideProgress; raw: string }
  | { kind: "unavailable"; value: GuideProgress };

export type SaveResult = { ok: true } | { ok: false; reason: "unavailable" };

type StepRef = Pick<LearningStep, "id" | "contentVersion">;

const PLATFORM_IDS: readonly PlatformId[] = platformOptions.map((option) => option.id);
const PROVIDER_IDS: readonly ProviderId[] = providerOptions.map((option) => option.id);
const THEMES: readonly ManualTheme[] = ["system", "light", "night"];
const STATUSES: readonly StepProgress["status"][] = ["in-progress", "completed", "review"];
const VALIDATION_RESULTS: readonly ValidationResult[] = ["passed", "failed"];

export function createEmptyProgress(): GuideProgress {
  return {
    schemaVersion: 1,
    catalogVersion: "",
    profile: null,
    routeId: null,
    activeStepId: null,
    steps: {},
    theme: "system",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return options.includes(value as T);
}

function isProfile(value: unknown): value is GuideProgress["profile"] {
  if (value === null) return true;
  return (
    isRecord(value) &&
    isOneOf(value.platform, PLATFORM_IDS) &&
    isOneOf(value.provider, PROVIDER_IDS)
  );
}

function isStepRecord(value: unknown): value is StepProgress {
  if (!isRecord(value)) return false;
  if (typeof value.contentVersion !== "number") return false;
  if (!isOneOf(value.status, STATUSES)) return false;
  if (value.validationResult !== undefined && !isOneOf(value.validationResult, VALIDATION_RESULTS)) {
    return false;
  }
  return true;
}

function isGuideProgress(value: unknown): value is GuideProgress {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== 1) return false;
  if (typeof value.catalogVersion !== "string") return false;
  if (!isProfile(value.profile)) return false;
  if (value.routeId !== null && typeof value.routeId !== "string") return false;
  if (value.activeStepId !== null && typeof value.activeStepId !== "string") return false;
  if (!isOneOf(value.theme, THEMES)) return false;
  if (!isRecord(value.steps)) return false;
  return Object.values(value.steps).every(isStepRecord);
}

export function parseProgress(raw: string | null): LoadProgressResult {
  if (raw === null) return { kind: "empty", value: createEmptyProgress() };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { kind: "corrupt", value: createEmptyProgress(), raw };
  }
  if (!isGuideProgress(parsed)) {
    return { kind: "corrupt", value: createEmptyProgress(), raw };
  }
  return { kind: "ready", value: parsed };
}

export function reconcileProgress(
  state: GuideProgress,
  route: { steps: StepRef[] },
): GuideProgress {
  const steps: Record<string, StepProgress> = {};
  for (const step of route.steps) {
    const record = state.steps[step.id];
    if (record === undefined) continue;
    if (record.contentVersion === step.contentVersion) {
      steps[step.id] = record;
    } else if (record.status === "completed") {
      const stale: StepProgress = {
        contentVersion: step.contentVersion,
        status: "review",
      };
      if (record.validationResult !== undefined) {
        stale.validationResult = record.validationResult;
      }
      steps[step.id] = stale;
    } else {
      steps[step.id] = { ...record, contentVersion: step.contentVersion };
    }
  }
  return { ...state, steps };
}

export function completeStep(state: GuideProgress, step: StepRef): GuideProgress {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.id]: { contentVersion: step.contentVersion, status: "completed" },
    },
  };
}

export function acknowledgeReview(state: GuideProgress, step: StepRef): GuideProgress {
  const record = state.steps[step.id];
  if (record === undefined || record.contentVersion !== step.contentVersion || record.status !== "review") {
    return state;
  }
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.id]: { ...record, status: "completed" },
    },
  };
}

export function recordValidation(
  state: GuideProgress,
  step: StepRef,
  result: ValidationResult,
): GuideProgress {
  const existing = state.steps[step.id];
  if (existing !== undefined && existing.contentVersion > step.contentVersion) {
    return state;
  }
  const record: StepProgress =
    result === "passed"
      ? { contentVersion: step.contentVersion, status: "completed", validationResult: "passed" }
      : { contentVersion: step.contentVersion, status: "in-progress", validationResult: "failed" };
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.id]: record,
    },
  };
}

export function loadProgress(storage: StorageLike): LoadProgressResult {
  let raw: string | null;
  try {
    raw = storage.getItem(FIELD_GUIDE_STORAGE_KEY);
  } catch {
    return { kind: "unavailable", value: createEmptyProgress() };
  }
  return parseProgress(raw);
}

export function saveProgress(storage: StorageLike, state: GuideProgress): SaveResult {
  try {
    storage.setItem(FIELD_GUIDE_STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export function clearProgress(storage: StorageLike): SaveResult {
  try {
    storage.removeItem(FIELD_GUIDE_STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
