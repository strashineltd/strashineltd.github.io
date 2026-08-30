import type {
  AudienceCondition,
  CoreVolume,
  FieldGuideCatalog,
  LearningStep,
  LessonSection,
  LearnerProfile,
  SideTrack,
  StepProgress,
} from "../../content/field-guide/types.ts";

export type ResolvedStep = Omit<LearningStep, "sections"> & {
  sections: LessonSection[];
};

export type GeneratedRoute = {
  id: string;
  profile: LearnerProfile;
  volumes: Array<CoreVolume & { steps: ResolvedStep[] }>;
  steps: ResolvedStep[];
  sideTracks: SideTrack[];
  totalMinutes: number;
};

export function matchesAudience(
  condition: AudienceCondition | undefined,
  profile: LearnerProfile,
): boolean {
  if (!condition) return true;
  if (condition.platforms && !condition.platforms.includes(profile.platform)) {
    return false;
  }
  if (condition.providers && !condition.providers.includes(profile.provider)) {
    return false;
  }
  return true;
}

export function resolveStep(step: LearningStep, profile: LearnerProfile): ResolvedStep {
  const sections = step.sections
    .map((section) => ({
      ...section,
      blocks: section.blocks.filter((block) =>
        matchesAudience(block.audience, profile),
      ),
    }))
    .filter((section) => section.blocks.length > 0);
  return { ...step, sections };
}

export function generateRoute(
  catalog: FieldGuideCatalog,
  profile: LearnerProfile,
): GeneratedRoute {
  if (!catalog.platforms.some((option) => option.id === profile.platform)) {
    throw new Error(`unknown platform: ${profile.platform}`);
  }
  if (!catalog.providers.some((option) => option.id === profile.provider)) {
    throw new Error(`unknown provider: ${profile.provider}`);
  }

  const stepById = new Map(catalog.steps.map((step) => [step.id, step]));
  const volumes = catalog.volumes.map((volume) => ({
    ...volume,
    steps: volume.stepIds.map((stepId) => resolveStep(stepById.get(stepId)!, profile)),
  }));
  const steps = volumes.flatMap((volume) => volume.steps);
  const totalMinutes = steps.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0,
  );
  return {
    id: `core:${profile.platform}:${profile.provider}`,
    profile,
    volumes,
    steps,
    sideTracks: catalog.sideTracks,
    totalMinutes,
  };
}

export function getNextStepId(
  route: GeneratedRoute,
  progress: Record<string, StepProgress>,
): string | null {
  for (const step of route.steps) {
    const record = progress[step.id];
    const completed =
      record?.status === "completed" &&
      record.contentVersion === step.contentVersion;
    if (!completed) return step.id;
  }
  return null;
}
