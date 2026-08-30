import type { FieldGuideCatalog } from "../../content/field-guide/types.ts";

export type CatalogIssue = { code: string; path: string; message: string };

function duplicates(values: string[]) {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return repeated;
}

export function validateCatalog(catalog: FieldGuideCatalog): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const stepIds = new Set(catalog.steps.map((step) => step.id));
  const stepById = new Map(catalog.steps.map((step) => [step.id, step]));
  const volumeIds = new Set(catalog.volumes.map((volume) => volume.id));
  const diagnosticIds = new Set(
    catalog.diagnostics.map((branch) => branch.id),
  );
  const trackIds = new Set(catalog.sideTracks.map((track) => track.id));
  const collections = [
    [
      "duplicate-volume-id",
      "volumes",
      catalog.volumes.map((item) => item.id),
    ],
    ["duplicate-step-id", "steps", catalog.steps.map((item) => item.id)],
    [
      "duplicate-track-id",
      "sideTracks",
      catalog.sideTracks.map((item) => item.id),
    ],
    [
      "duplicate-diagnostic-id",
      "diagnostics",
      catalog.diagnostics.map((item) => item.id),
    ],
    [
      "duplicate-glossary-id",
      "glossary",
      catalog.glossary.map((item) => item.id),
    ],
  ] as const;

  for (const [code, path, ids] of collections) {
    for (const id of duplicates(ids)) {
      issues.push({
        code,
        path: `${path}.${id}`,
        message: `重复 ID：${id}`,
      });
    }
  }
  for (const volume of catalog.volumes) {
    for (const id of volume.stepIds) {
      if (!stepIds.has(id)) {
        issues.push({
          code: "missing-step-reference",
          path: `volumes.${volume.id}.stepIds`,
          message: `不存在的步骤：${id}`,
        });
      }
    }
    const referenced = volume.stepIds
      .map((id) => stepById.get(id))
      .filter((step) => step !== undefined);
    const actualMinutes = referenced.reduce(
      (sum, step) => sum + step.estimatedMinutes,
      0,
    );
    if (
      referenced.length === volume.stepIds.length &&
      actualMinutes !== volume.estimatedMinutes
    ) {
      issues.push({
        code: "duration-mismatch",
        path: `volumes.${volume.id}.estimatedMinutes`,
        message: `声明 ${volume.estimatedMinutes} 分钟，步骤合计 ${actualMinutes} 分钟`,
      });
    }
  }
  for (const track of catalog.sideTracks) {
    for (const id of track.stepIds) {
      if (!stepIds.has(id)) {
        issues.push({
          code: "missing-step-reference",
          path: `sideTracks.${track.id}.stepIds`,
          message: `不存在的步骤：${id}`,
        });
      }
    }
  }
  for (const step of catalog.steps) {
    if (
      !Number.isFinite(step.estimatedMinutes) ||
      step.estimatedMinutes <= 0
    ) {
      issues.push({
        code: "invalid-duration",
        path: `steps.${step.id}.estimatedMinutes`,
        message: "步骤时长必须大于 0",
      });
    }
    if (step.volumeId !== null && !volumeIds.has(step.volumeId)) {
      issues.push({
        code: "missing-volume-reference",
        path: `steps.${step.id}.volumeId`,
        message: `不存在的卷：${step.volumeId}`,
      });
    }
    for (const id of duplicates(step.sections.map((section) => section.id))) {
      issues.push({
        code: "duplicate-section-id",
        path: `steps.${step.id}.sections.${id}`,
        message: `重复章节 ID：${id}`,
      });
    }
    for (const id of step.relatedTrackIds ?? []) {
      if (!trackIds.has(id)) {
        issues.push({
          code: "missing-track-reference",
          path: `steps.${step.id}.relatedTrackIds`,
          message: `不存在的支线：${id}`,
        });
      }
    }
    for (const id of step.validation?.failureDiagnosticIds ?? []) {
      if (!diagnosticIds.has(id)) {
        issues.push({
          code: "missing-diagnostic-reference",
          path: `steps.${step.id}.validation`,
          message: `不存在的诊断：${id}`,
        });
      }
    }
  }
  for (const branch of catalog.diagnostics) {
    if (!stepIds.has(branch.returnStepId)) {
      issues.push({
        code: "missing-step-reference",
        path: `diagnostics.${branch.id}.returnStepId`,
        message: `不存在的返回步骤：${branch.returnStepId}`,
      });
    }
  }
  return issues;
}

export function assertValidCatalog(catalog: FieldGuideCatalog): void {
  const issues = validateCatalog(catalog);
  if (issues.length > 0) {
    throw new Error(
      issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"),
    );
  }
}
