export type PlatformId = "windows-x64" | "macos-arm64" | "macos-x64";
export type ProviderId =
  | "deepseek"
  | "qwen"
  | "glm"
  | "kimi"
  | "minimax"
  | "custom-responses"
  | "custom-anthropic";
export type ManualTheme = "system" | "light" | "night";
export type ValidationResult = "passed" | "failed";

export type AudienceCondition = {
  platforms?: PlatformId[];
  providers?: ProviderId[];
};

export type LessonBlock =
  | { type: "prose"; paragraphs: string[]; audience?: AudienceCondition }
  | {
      type: "steps";
      items: Array<{ title: string; detail: string }>;
      audience?: AudienceCondition;
    }
  | {
      type: "fields";
      items: Array<{ label: string; value: string; detail?: string }>;
      audience?: AudienceCondition;
    }
  | {
      type: "callout";
      tone: "note" | "warning" | "success";
      title: string;
      body: string;
      audience?: AudienceCondition;
    }
  | { type: "checklist"; items: string[]; audience?: AudienceCondition }
  | {
      type: "code";
      label: string;
      content: string;
      audience?: AudienceCondition;
    };

export type LessonSection = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};

export type ValidationTask = {
  id: string;
  title: string;
  applicationSteps: string[];
  successText: string;
  failureDiagnosticIds: string[];
};

export type LearningStep = {
  id: string;
  contentVersion: number;
  volumeId: string | null;
  outcome: string;
  estimatedMinutes: number;
  audience?: AudienceCondition;
  sections: LessonSection[];
  validation?: ValidationTask;
  relatedTrackIds?: string[];
  searchTerms: string[];
};

export type CoreVolume = {
  id: string;
  title: string;
  outcome: string;
  estimatedMinutes: number;
  stepIds: string[];
};

export type SideTrack = {
  id: string;
  title: string;
  summary: string;
  stepIds: string[];
};

export type DiagnosticBranch = {
  id: string;
  symptom: string;
  aliases: string[];
  steps: Array<{ title: string; instruction: string; expected: string }>;
  returnStepId: string;
};

export type PlatformOption = {
  id: PlatformId;
  label: string;
  shortLabel: string;
};

export type ProviderOption = {
  id: ProviderId;
  label: string;
  presetLabels: string[];
  baseUrl: string | null;
  wireApi: "responses" | "anthropic";
};

export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  aliases: string[];
};

export type FieldGuideCatalog = {
  version: string;
  platforms: PlatformOption[];
  providers: ProviderOption[];
  volumes: CoreVolume[];
  steps: LearningStep[];
  sideTracks: SideTrack[];
  diagnostics: DiagnosticBranch[];
  glossary: GlossaryEntry[];
};

export type LearnerProfile = {
  platform: PlatformId;
  provider: ProviderId;
};

export type StepProgress = {
  contentVersion: number;
  status: "in-progress" | "completed" | "review";
  validationResult?: ValidationResult;
};

export type GuideProgress = {
  schemaVersion: 1;
  catalogVersion: string;
  profile: LearnerProfile | null;
  routeId: string | null;
  activeStepId: string | null;
  steps: Record<string, StepProgress>;
  theme: ManualTheme;
};
