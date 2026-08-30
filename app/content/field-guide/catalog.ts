import { assertValidCatalog } from "../../lib/field-guide/catalog-validation.ts";
import { diagnosticBranches } from "./diagnostics.ts";
import { platformOptions, providerOptions } from "./profile-options.ts";
import { glossaryEntries, sideTracks, trackSteps } from "./tracks.ts";
import type { CoreVolume, FieldGuideCatalog, LearningStep } from "./types.ts";
import {
  connectIntelligenceSteps,
  connectIntelligenceVolume,
} from "./volumes/connect-intelligence.ts";
import {
  firstOutcomeSteps,
  firstOutcomeVolume,
} from "./volumes/first-outcome.ts";
import {
  prepareDeviceSteps,
  prepareDeviceVolume,
} from "./volumes/prepare-device.ts";
import {
  reliableWorkSteps,
  reliableWorkVolume,
} from "./volumes/reliable-work.ts";

export const coreVolumes: CoreVolume[] = [
  prepareDeviceVolume,
  connectIntelligenceVolume,
  firstOutcomeVolume,
  reliableWorkVolume,
];

const sourceCoreSteps: LearningStep[] = [
  ...prepareDeviceSteps,
  ...connectIntelligenceSteps,
  ...firstOutcomeSteps,
  ...reliableWorkSteps,
];

const relatedTracksByStep: Record<string, string[]> = {
  "prepare.choose-build": ["release-reference"],
  "prepare.install": ["troubleshooting", "security-data", "release-reference"],
  "prepare.first-launch": ["troubleshooting", "security-data"],
  "connect.choose-service": ["models-context", "release-reference"],
  "connect.enter-settings": ["models-context", "security-data"],
  "connect.verify": ["models-context", "troubleshooting"],
  "outcome.choose-workspace": ["workflow-tools", "security-data"],
  "outcome.write-brief": ["workflow-tools"],
  "outcome.follow-execution": ["workflow-tools", "extensions"],
  "outcome.review-result": ["workflow-tools"],
  "reliable.approvals": ["security-data", "workflow-tools"],
  "reliable.context": ["models-context", "workflow-tools", "extensions"],
  "reliable.review": ["workflow-tools", "extensions"],
  "reliable.complete": ["workflow-tools", "release-reference"],
};

export const coreSteps: LearningStep[] = sourceCoreSteps.map((step) => ({
  ...step,
  relatedTrackIds: relatedTracksByStep[step.id],
}));

export const fieldGuideCatalog: FieldGuideCatalog = Object.freeze({
  version: "0.9.2",
  platforms: platformOptions,
  providers: providerOptions,
  volumes: coreVolumes,
  steps: [...coreSteps, ...trackSteps],
  sideTracks,
  diagnostics: diagnosticBranches,
  glossary: glossaryEntries,
});

assertValidCatalog(fieldGuideCatalog);
