"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type Dispatch,
  type Ref,
  type RefObject,
} from "react";
import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import type {
  GuideProgress,
  StepProgress,
} from "../../content/field-guide/types.ts";
import {
  getNextStepId,
  resolveStep,
  type GeneratedRoute,
  type ResolvedStep,
} from "../../lib/field-guide/route-engine.ts";
import { GuideDialog } from "./GuideDialog";
import { LessonReader } from "./LessonReader";
import type { FieldGuideAction } from "./useFieldGuideState";

type RouteBookProps = {
  directoryOpen: boolean;
  dispatch: Dispatch<FieldGuideAction>;
  headingRef?: Ref<HTMLHeadingElement>;
  onCloseDirectory: () => void;
  onOpenDirectory: () => void;
  progress: GuideProgress;
  route: GeneratedRoute;
};

type RouteTreeProps = {
  activeStepId: string | null;
  initialFocusRef?: RefObject<HTMLButtonElement | null>;
  onSelectStep: (stepId: string) => void;
  progress: GuideProgress["steps"];
  route: GeneratedRoute;
  trackStepById: Map<string, ResolvedStep>;
};

function hasCurrentStatus(
  progress: Record<string, StepProgress>,
  step: ResolvedStep,
  status: StepProgress["status"],
) {
  const record = progress[step.id];
  return record?.contentVersion === step.contentVersion && record.status === status;
}

function isComplete(
  progress: Record<string, StepProgress>,
  step: ResolvedStep,
) {
  return hasCurrentStatus(progress, step, "completed");
}

function getVolumeState(
  volume: GeneratedRoute["volumes"][number],
  progress: Record<string, StepProgress>,
  activeStepId: string | null,
) {
  if (volume.steps.some((step) => hasCurrentStatus(progress, step, "review"))) {
    return "需复查";
  }
  if (volume.steps.every((step) => isComplete(progress, step))) return "完成";
  if (volume.steps.some((step) => step.id === activeStepId)) return "当前";
  return "未开始";
}

function getStepState(
  step: ResolvedStep,
  progress: Record<string, StepProgress>,
  activeStepId: string | null,
) {
  if (hasCurrentStatus(progress, step, "review")) return "需复查";
  if (isComplete(progress, step)) return "完成";
  if (step.id === activeStepId) return "当前";
  return "未开始";
}

function getVolumeEditorialTitle(
  volume: GeneratedRoute["volumes"][number],
) {
  return volume.id === "prepare-device" ? "准备好设备" : volume.outcome;
}

function RouteTree({
  activeStepId,
  initialFocusRef,
  onSelectStep,
  progress,
  route,
  trackStepById,
}: RouteTreeProps) {
  const [openTrackId, setOpenTrackId] = useState<string | null>(null);
  const trackPanelPrefix = useId();
  const trackTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function toggleTrack(trackId: string) {
    const closing = openTrackId === trackId;
    setOpenTrackId(closing ? null : trackId);
    if (closing) {
      window.requestAnimationFrame(() => {
        trackTriggerRefs.current[trackId]?.focus();
      });
    }
  }

  return (
    <div className="manual-route-tree">
      <ol className="manual-volume-list">
        {route.volumes.map((volume, volumeIndex) => {
          const firstIncomplete =
            volume.steps.find((step) => !isComplete(progress, step)) ??
            volume.steps[0];
          const volumeState = getVolumeState(
            volume,
            progress,
            activeStepId,
          );
          return (
            <li className="manual-volume" key={volume.id}>
              <button
                className="manual-volume__button"
                onClick={() => {
                  if (firstIncomplete) onSelectStep(firstIncomplete.id);
                }}
                ref={volumeIndex === 0 ? initialFocusRef : undefined}
                type="button"
              >
                <span className="manual-volume__number">
                  {String(volumeIndex + 1).padStart(2, "0")}
                </span>
                <span className="manual-volume__heading">
                  <strong>{getVolumeEditorialTitle(volume)}</strong>
                  <span>{volume.title}</span>
                </span>
                <span className="manual-volume__minutes">
                  {volume.estimatedMinutes} 分钟
                </span>
                <span className="manual-volume__state">{volumeState}</span>
              </button>
              <ol className="manual-step-list">
                {volume.steps.map((step) => (
                  <li key={step.id}>
                    <button
                      aria-current={
                        step.id === activeStepId ? "step" : undefined
                      }
                      onClick={() => onSelectStep(step.id)}
                      type="button"
                    >
                      <span>{step.outcome}</span>
                      <small>
                        {step.estimatedMinutes} 分钟 ·{" "}
                        {getStepState(step, progress, activeStepId)}
                      </small>
                    </button>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>

      <section className="manual-tracks" aria-labelledby={`${trackPanelPrefix}-title`}>
        <h2 id={`${trackPanelPrefix}-title`}>延伸阅读</h2>
        <ul>
          {route.sideTracks.map((track) => {
            const open = openTrackId === track.id;
            const panelId = `${trackPanelPrefix}-${track.id}`;
            return (
              <li key={track.id}>
                <button
                  aria-controls={panelId}
                  aria-expanded={open}
                  className="manual-track__trigger"
                  onClick={() => toggleTrack(track.id)}
                  ref={(node) => {
                    trackTriggerRefs.current[track.id] = node;
                  }}
                  type="button"
                >
                  <span>
                    <strong>{track.title}</strong>
                    <small>{track.summary}</small>
                  </span>
                  <span aria-hidden="true">{open ? "-" : "+"}</span>
                </button>
                {open ? (
                  <ol className="manual-track__steps" id={panelId}>
                    {track.stepIds.map((stepId) => {
                      const step = trackStepById.get(stepId);
                      if (!step) return null;
                      return (
                        <li key={step.id}>
                          <button
                            aria-current={
                              step.id === activeStepId ? "step" : undefined
                            }
                            onClick={() => onSelectStep(step.id)}
                            type="button"
                          >
                            {step.outcome}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function assignResponsiveHeading(
  ref: Ref<HTMLHeadingElement> | undefined,
  node: HTMLHeadingElement | null,
  desktop: boolean,
) {
  if (!ref || !node || typeof window === "undefined") return;
  if (window.matchMedia("(min-width: 1024px)").matches !== desktop) return;
  if (typeof ref === "function") ref(node);
  else ref.current = node;
}

export function RouteBook({
  directoryOpen,
  dispatch,
  headingRef,
  onCloseDirectory,
  onOpenDirectory,
  progress,
  route,
}: RouteBookProps) {
  const [routeMessage, setRouteMessage] = useState<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const directoryInitialFocusRef = useRef<HTMLButtonElement>(null);
  const platform = fieldGuideCatalog.platforms.find(
    (option) => option.id === route.profile.platform,
  );
  const provider = fieldGuideCatalog.providers.find(
    (option) => option.id === route.profile.provider,
  );
  const trackSteps = route.sideTracks.flatMap((track) =>
    track.stepIds.map((stepId) => {
      const step = fieldGuideCatalog.steps.find((entry) => entry.id === stepId);
      if (!step) throw new Error(`unknown side-track step: ${stepId}`);
      return resolveStep(step, route.profile);
    }),
  );
  const trackStepById = new Map(trackSteps.map((step) => [step.id, step]));
  const allStepById = new Map(
    [...route.steps, ...trackSteps].map((step) => [step.id, step]),
  );
  const activeStep =
    allStepById.get(progress.activeStepId ?? "") ?? route.steps[0];

  function writeStepHash(stepId: string) {
    window.history.replaceState(window.history.state, "", `#${stepId}`);
  }

  function selectStep(stepId: string, closeDirectory = false) {
    startTransition(() => {
      dispatch({ type: "open-step", stepId });
    });
    writeStepHash(stepId);
    setRouteMessage(null);
    if (closeDirectory) onCloseDirectory();

    const focusLesson = () => articleRef.current?.focus();
    window.requestAnimationFrame(() => {
      if (closeDirectory) window.requestAnimationFrame(focusLesson);
      else focusLesson();
    });
  }

  const syncStepFromHash = useEffectEvent(() => {
    const requestedStepId = window.location.hash.slice(1);
    let stepId: string | null;

    if (requestedStepId && allStepById.has(requestedStepId)) {
      stepId = requestedStepId;
      setRouteMessage(null);
    } else if (requestedStepId) {
      stepId = getNextStepId(route, progress.steps) ?? route.steps[0]?.id ?? null;
      setRouteMessage("此内容已移动，已返回你的学习路线");
    } else {
      stepId =
        (progress.activeStepId && allStepById.has(progress.activeStepId)
          ? progress.activeStepId
          : null) ??
        getNextStepId(route, progress.steps) ??
        route.steps[0]?.id ??
        null;
      setRouteMessage(null);
    }

    if (!stepId) return;
    if (progress.activeStepId !== stepId) {
      startTransition(() => dispatch({ type: "open-step", stepId }));
    }
    if (requestedStepId !== stepId) writeStepHash(stepId);
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => syncStepFromHash());
    const handleHashChange = () => syncStepFromHash();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [route.id]);

  if (!activeStep) return null;

  const volumeIndex = route.volumes.findIndex((volume) =>
    volume.steps.some((step) => step.id === activeStep.id),
  );
  const activeTrack = route.sideTracks.find((track) =>
    track.stepIds.includes(activeStep.id),
  );
  const activeStatus = progress.steps[activeStep.id]?.status;

  return (
    <section className="manual-book">
      <nav aria-label="学习路线" className="manual-book__route">
        <header className="manual-route__header">
          <p className="manual-kicker">
            {platform?.label} · {provider?.label}
          </p>
          <h1
            id="manual-route-title"
            ref={(node) => assignResponsiveHeading(headingRef, node, true)}
            tabIndex={-1}
          >
            准备好你的工作环境
          </h1>
          <p>从设备准备开始，沿着四个成果完成第一次可靠交付。</p>
          <strong className="manual-route__time">{route.totalMinutes} 分钟</strong>
        </header>
        <RouteTree
          activeStepId={activeStep.id}
          onSelectStep={(stepId) => selectStep(stepId)}
          progress={progress.steps}
          route={route}
          trackStepById={trackStepById}
        />
      </nav>

      <div className="manual-book__reader" data-layout="mobile-single-page">
        <header className="manual-route__mobile-header">
          <p className="manual-kicker">
            {platform?.label} · {provider?.label}
          </p>
          <h1
            id="manual-route-title-mobile"
            ref={(node) => assignResponsiveHeading(headingRef, node, false)}
            tabIndex={-1}
          >
            准备好你的工作环境
          </h1>
          <p>{route.totalMinutes} 分钟 · 四卷核心路线</p>
        </header>

        {routeMessage ? (
          <p className="manual-route-message" role="status">
            {routeMessage}
          </p>
        ) : null}

        <LessonReader
          articleRef={articleRef}
          onAcknowledgeReview={() =>
            dispatch({ type: "acknowledge-review", step: activeStep })
          }
          status={activeStatus}
          step={activeStep}
          trackTitle={activeTrack?.title}
          volumeNumber={volumeIndex >= 0 ? volumeIndex + 1 : null}
        />

        <div className="manual-mobile-actions">
          <button onClick={onOpenDirectory} type="button">
            打开学习路线
          </button>
        </div>
      </div>

      <GuideDialog
        initialFocusRef={directoryInitialFocusRef}
        onClose={onCloseDirectory}
        open={directoryOpen}
        title="学习路线"
      >
        <nav aria-label="学习路线" className="manual-dialog-route">
          <RouteTree
            activeStepId={activeStep.id}
            initialFocusRef={directoryInitialFocusRef}
            onSelectStep={(stepId) => selectStep(stepId, true)}
            progress={progress.steps}
            route={route}
            trackStepById={trackStepById}
          />
        </nav>
      </GuideDialog>
    </section>
  );
}
