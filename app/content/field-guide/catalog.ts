import { assertValidCatalog } from "../../lib/field-guide/catalog-validation.ts";
import { diagnosticBranches } from "./diagnostics.ts";
import { platformOptions, providerOptions } from "./profile-options.ts";
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

export const coreSteps: LearningStep[] = [
  ...prepareDeviceSteps,
  ...connectIntelligenceSteps,
  ...firstOutcomeSteps,
  ...reliableWorkSteps,
];

export const fieldGuideCatalog: FieldGuideCatalog = Object.freeze({
  version: "0.9.2",
  platforms: platformOptions,
  providers: providerOptions,
  volumes: coreVolumes,
  steps: coreSteps,
  sideTracks: [],
  diagnostics: diagnosticBranches,
  glossary: [],
});

assertValidCatalog(fieldGuideCatalog);
