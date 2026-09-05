import assert from "node:assert/strict";
import test from "node:test";

import {
  FIELD_GUIDE_STORAGE_KEY,
  acknowledgeReview,
  clearProgress,
  completeStep,
  createEmptyProgress,
  loadProgress,
  parseProgress,
  reconcileProgress,
  recordValidation,
  saveProgress,
} from "../app/lib/field-guide/progress-store.ts";

function memoryStorage(initial = null) {
  const data = new Map();
  if (initial !== null) data.set(FIELD_GUIDE_STORAGE_KEY, initial);
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

test("content version changes preserve completion as review", () => {
  const state = createEmptyProgress();
  state.steps["connect.verify"] = { contentVersion: 1, status: "completed", validationResult: "passed" };
  const route = { steps: [{ id: "connect.verify", contentVersion: 2 }] };
  const reconciled = reconcileProgress(state, route);
  assert.deepEqual(reconciled.steps["connect.verify"], { contentVersion: 2, status: "review", validationResult: "passed" });
  const acknowledged = acknowledgeReview(reconciled, { id: "connect.verify", contentVersion: 2 });
  assert.deepEqual(acknowledged.steps["connect.verify"], { contentVersion: 2, status: "completed", validationResult: "passed" });
});

test("route changes retain only applicable current-version records", () => {
  const state = createEmptyProgress();
  state.steps["prepare.install"] = { contentVersion: 1, status: "completed" };
  state.steps["removed.step"] = { contentVersion: 1, status: "completed" };
  const reconciled = reconcileProgress(state, { steps: [{ id: "prepare.install", contentVersion: 1 }] });
  assert.deepEqual(Object.keys(reconciled.steps), ["prepare.install"]);
});

test("storage exceptions produce unavailable mode without throwing", () => {
  const storage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  assert.equal(loadProgress(storage).kind, "unavailable");
});

test("corrupt JSON requires explicit reset", () => {
  const storage = { getItem() { return "{"; }, setItem() {}, removeItem() {} };
  assert.equal(loadProgress(storage).kind, "corrupt");
});

test("completeStep marks the step complete at the given content version", () => {
  const state = createEmptyProgress();
  const completed = completeStep(state, { id: "prepare.install", contentVersion: 1 });
  assert.deepEqual(completed.steps["prepare.install"], { contentVersion: 1, status: "completed" });
});

test("recordValidation passed completes the step with a passed result", () => {
  const state = createEmptyProgress();
  const passed = recordValidation(state, { id: "connect.verify", contentVersion: 1 }, "passed");
  assert.deepEqual(passed.steps["connect.verify"], { contentVersion: 1, status: "completed", validationResult: "passed" });
});

test("recordValidation failed keeps the step in-progress with a failed result", () => {
  const state = createEmptyProgress();
  const failed = recordValidation(state, { id: "connect.verify", contentVersion: 1 }, "failed");
  assert.deepEqual(failed.steps["connect.verify"], { contentVersion: 1, status: "in-progress", validationResult: "failed" });
});

test("stale in-progress records keep their status instead of entering review", () => {
  const state = createEmptyProgress();
  state.steps["connect.verify"] = { contentVersion: 1, status: "in-progress", validationResult: "failed" };
  const reconciled = reconcileProgress(state, { steps: [{ id: "connect.verify", contentVersion: 2 }] });
  assert.deepEqual(reconciled.steps["connect.verify"], { contentVersion: 2, status: "in-progress", validationResult: "failed" });
  const acknowledged = acknowledgeReview(reconciled, { id: "connect.verify", contentVersion: 2 });
  assert.deepEqual(acknowledged.steps["connect.verify"], { contentVersion: 2, status: "in-progress", validationResult: "failed" });
});

test("reconcileProgress preserves unrelated state fields", () => {
  const state = createEmptyProgress();
  state.catalogVersion = "2026.1";
  state.profile = { platform: "macos-arm64", provider: "qwen" };
  state.routeId = "core:macos-arm64:qwen";
  state.activeStepId = "prepare.install";
  state.theme = "night";
  state.steps["prepare.install"] = { contentVersion: 1, status: "completed" };
  const reconciled = reconcileProgress(state, { steps: [{ id: "prepare.install", contentVersion: 1 }] });
  assert.equal(reconciled.catalogVersion, "2026.1");
  assert.deepEqual(reconciled.profile, { platform: "macos-arm64", provider: "qwen" });
  assert.equal(reconciled.routeId, "core:macos-arm64:qwen");
  assert.equal(reconciled.activeStepId, "prepare.install");
  assert.equal(reconciled.theme, "night");
  assert.deepEqual(reconciled.steps["prepare.install"], { contentVersion: 1, status: "completed" });
});

test("completeStep drops an existing validationResult", () => {
  const state = createEmptyProgress();
  state.steps["connect.verify"] = { contentVersion: 1, status: "completed", validationResult: "passed" };
  const completed = completeStep(state, { id: "connect.verify", contentVersion: 1 });
  assert.deepEqual(completed.steps["connect.verify"], { contentVersion: 1, status: "completed" });
});

test("recordValidation ignores a stale step ref and keeps the newer record", () => {
  const state = createEmptyProgress();
  state.steps["connect.verify"] = { contentVersion: 2, status: "in-progress", validationResult: "failed" };
  const result = recordValidation(state, { id: "connect.verify", contentVersion: 1 }, "passed");
  assert.deepEqual(result.steps["connect.verify"], { contentVersion: 2, status: "in-progress", validationResult: "failed" });
});

test("acknowledgeReview only changes the matching current-version review record", () => {
  const state = createEmptyProgress();
  state.steps["connect.verify"] = { contentVersion: 2, status: "review", validationResult: "passed" };
  state.steps["connect.connect"] = { contentVersion: 2, status: "review" };
  state.steps["prepare.install"] = { contentVersion: 1, status: "completed" };
  const acknowledged = acknowledgeReview(state, { id: "connect.verify", contentVersion: 2 });
  assert.deepEqual(acknowledged.steps["connect.verify"], { contentVersion: 2, status: "completed", validationResult: "passed" });
  assert.deepEqual(acknowledged.steps["connect.connect"], { contentVersion: 2, status: "review" });
  assert.deepEqual(acknowledged.steps["prepare.install"], { contentVersion: 1, status: "completed" });
});

test("parseProgress accepts valid state as ready and loadProgress round-trips it", () => {
  const state = createEmptyProgress();
  state.catalogVersion = "2026.1";
  state.profile = { platform: "windows-x64", provider: "deepseek" };
  state.routeId = "core:windows-x64:deepseek";
  state.activeStepId = "prepare.install";
  state.theme = "night";
  state.steps["prepare.install"] = { contentVersion: 1, status: "completed" };

  const raw = JSON.stringify(state);
  const parsed = parseProgress(raw);
  assert.equal(parsed.kind, "ready");
  assert.deepEqual(parsed.value, state);

  const storage = memoryStorage(raw);
  const loaded = loadProgress(storage);
  assert.equal(loaded.kind, "ready");
  assert.deepEqual(loaded.value, state);
});

test("loadProgress returns empty state when storage holds nothing", () => {
  const loaded = loadProgress(memoryStorage());
  assert.equal(loaded.kind, "empty");
  assert.deepEqual(loaded.value, createEmptyProgress());
});

test("parseProgress rejects unsupported schema versions as corrupt", () => {
  const state = createEmptyProgress();
  state.schemaVersion = 2;
  const result = parseProgress(JSON.stringify(state));
  assert.equal(result.kind, "corrupt");
  assert.equal(result.raw, JSON.stringify(state));
});

test("parseProgress rejects invalid profile values as corrupt", () => {
  const unsupportedPlatform = createEmptyProgress();
  unsupportedPlatform.profile = { platform: "linux-x64", provider: "deepseek" };
  assert.equal(parseProgress(JSON.stringify(unsupportedPlatform)).kind, "corrupt");

  const unsupportedProvider = createEmptyProgress();
  unsupportedProvider.profile = { platform: "windows-x64", provider: "openai" };
  assert.equal(parseProgress(JSON.stringify(unsupportedProvider)).kind, "corrupt");
});

test("parseProgress rejects invalid theme values as corrupt", () => {
  const state = createEmptyProgress();
  state.theme = "dark";
  assert.equal(parseProgress(JSON.stringify(state)).kind, "corrupt");
});

test("parseProgress rejects malformed step records as corrupt", () => {
  const nonObjectSteps = createEmptyProgress();
  nonObjectSteps.steps = [];
  assert.equal(parseProgress(JSON.stringify(nonObjectSteps)).kind, "corrupt");

  const stringVersion = createEmptyProgress();
  stringVersion.steps["prepare.install"] = { contentVersion: "1", status: "completed" };
  assert.equal(parseProgress(JSON.stringify(stringVersion)).kind, "corrupt");

  const unknownStatus = createEmptyProgress();
  unknownStatus.steps["prepare.install"] = { contentVersion: 1, status: "done" };
  assert.equal(parseProgress(JSON.stringify(unknownStatus)).kind, "corrupt");

  const invalidValidationResult = createEmptyProgress();
  invalidValidationResult.steps["prepare.install"] = { contentVersion: 1, status: "completed", validationResult: "maybe" };
  assert.equal(parseProgress(JSON.stringify(invalidValidationResult)).kind, "corrupt");

  const nullRecord = createEmptyProgress();
  nullRecord.steps["prepare.install"] = null;
  assert.equal(parseProgress(JSON.stringify(nullRecord)).kind, "corrupt");
});

test("parseProgress preserves the raw payload on corrupt results", () => {
  const raw = "{not json";
  const result = parseProgress(raw);
  assert.equal(result.kind, "corrupt");
  assert.equal(result.raw, raw);
});

test("saveProgress writes the serialized state and reports ok", () => {
  const state = createEmptyProgress();
  state.steps["prepare.install"] = { contentVersion: 1, status: "completed" };
  const storage = memoryStorage();
  assert.deepEqual(saveProgress(storage, state), { ok: true });
  const stored = storage.getItem(FIELD_GUIDE_STORAGE_KEY);
  assert.deepEqual(parseProgress(stored).value, state);
});

test("saveProgress reports unavailable when storage throws", () => {
  const storage = { getItem() { return null; }, setItem() { throw new Error("blocked"); }, removeItem() {} };
  assert.deepEqual(saveProgress(storage, createEmptyProgress()), { ok: false, reason: "unavailable" });
});

test("clearProgress removes the stored key and reports ok", () => {
  const storage = memoryStorage(JSON.stringify(createEmptyProgress()));
  assert.equal(loadProgress(storage).kind, "ready");
  assert.deepEqual(clearProgress(storage), { ok: true });
  assert.equal(storage.getItem(FIELD_GUIDE_STORAGE_KEY), null);
  assert.equal(loadProgress(storage).kind, "empty");
});

test("clearProgress reports unavailable when storage throws", () => {
  const storage = { getItem() { return null; }, setItem() {}, removeItem() { throw new Error("blocked"); } };
  assert.deepEqual(clearProgress(storage), { ok: false, reason: "unavailable" });
});
