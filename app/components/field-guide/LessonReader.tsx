"use client";

import { useRef, useState, type RefObject } from "react";
import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import type {
  LessonBlock,
  StepProgress,
  ValidationResult,
} from "../../content/field-guide/types.ts";
import type { ResolvedStep } from "../../lib/field-guide/route-engine.ts";
import { DiagnosticFlow } from "./DiagnosticFlow";
import { ValidationFlow } from "./ValidationFlow";

type LessonReaderProps = {
  articleRef: RefObject<HTMLElement | null>;
  step: ResolvedStep;
  status?: StepProgress["status"];
  volumeNumber: number | null;
  trackTitle?: string;
  activeBranchId: string | null;
  onAcknowledgeReview: () => void;
  onContinue: () => void;
  onOpenDiagnostic: (branchId: string) => void;
  onRecordValidation: (result: ValidationResult) => void;
  onReturnToValidation: () => void;
};

type LessonBlockViewProps = {
  block: LessonBlock;
  blockKey: string;
  copiedBlock: string | null;
  onCopy: (blockKey: string, content: string) => void;
};

function LessonBlockView({
  block,
  blockKey,
  copiedBlock,
  onCopy,
}: LessonBlockViewProps) {
  switch (block.type) {
    case "prose":
      return (
        <div className="manual-prose">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );
    case "steps":
      return (
        <ol className="manual-numbered-steps">
          {block.items.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      );
    case "fields":
      return (
        <dl className="manual-field-list">
          {block.items.map((item) => (
            <div key={`${item.label}-${item.value}`}>
              <dt>{item.label}</dt>
              <dd>
                <strong>{item.value}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "callout":
      return (
        <aside
          aria-label={block.title}
          className={`manual-callout manual-callout--${block.tone}`}
        >
          <h3>{block.title}</h3>
          <p>{block.body}</p>
        </aside>
      );
    case "checklist":
      return (
        <ul className="manual-checklist">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <figure className="manual-code">
          <figcaption>
            <span>{block.label}</span>
            <button
              aria-label={`复制${block.label}`}
              onClick={() => onCopy(blockKey, block.content)}
              type="button"
            >
              复制
            </button>
          </figcaption>
          <pre>
            <code>{block.content}</code>
          </pre>
          {copiedBlock === blockKey ? (
            <span aria-live="polite" className="manual-copy-status" role="status">
              已复制
            </span>
          ) : null}
        </figure>
      );
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

export function LessonReader({
  articleRef,
  step,
  status,
  volumeNumber,
  trackTitle,
  activeBranchId,
  onAcknowledgeReview,
  onContinue,
  onOpenDiagnostic,
  onRecordValidation,
  onReturnToValidation,
}: LessonReaderProps) {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const validationHeadingRef = useRef<HTMLHeadingElement>(null);
  const activeBranch = activeBranchId
    ? (fieldGuideCatalog.diagnostics.find(
        (branch) => branch.id === activeBranchId,
      ) ?? null)
    : null;

  async function copyBlock(blockKey: string, content: string) {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(blockKey);
    } catch {
      return;
    }
  }

  function returnToValidation() {
    onReturnToValidation();
    window.requestAnimationFrame(() => validationHeadingRef.current?.focus());
  }

  return (
    <article
      className="manual-lesson"
      data-step-id={step.id}
      ref={articleRef}
      tabIndex={-1}
    >
      <header className="manual-lesson__header">
        <p className="manual-kicker">
          {volumeNumber === null
            ? (trackTitle ?? "延伸阅读")
            : `第 ${String(volumeNumber).padStart(2, "0")} 卷`}
          <span aria-hidden="true"> · </span>
          {step.estimatedMinutes} 分钟
        </p>
        {step.id === "connect.choose-service" ? (
          <p className="manual-lesson__action">选择模型服务</p>
        ) : null}
        <h1>{step.outcome}</h1>
      </header>

      {status === "review" ? (
        <div className="manual-review-note">
          <p aria-live="polite" role="status">
            <strong>内容已更新</strong>
          </p>
          <button onClick={onAcknowledgeReview} type="button">
            确认已复查
          </button>
        </div>
      ) : null}

      <div className="manual-lesson__sections">
        {step.sections.map((section) => {
          const anchor = `${step.id}-${section.id}`;
          return (
            <section aria-labelledby={`${anchor}-title`} id={anchor} key={section.id}>
              <h2 id={`${anchor}-title`}>{section.title}</h2>
              {section.blocks.map((block, blockIndex) => {
                const blockKey = `${anchor}-${blockIndex}`;
                return (
                  <LessonBlockView
                    block={block}
                    blockKey={blockKey}
                    copiedBlock={copiedBlock}
                    key={blockKey}
                    onCopy={(key, content) => void copyBlock(key, content)}
                  />
                );
              })}
            </section>
          );
        })}
      </div>

      {step.validation ? (
        activeBranch ? (
          <DiagnosticFlow
            branch={activeBranch}
            onReturnToValidation={returnToValidation}
          />
        ) : (
          <ValidationFlow
            headingRef={validationHeadingRef}
            onContinue={onContinue}
            onOpenDiagnostic={onOpenDiagnostic}
            onRecordResult={onRecordValidation}
            status={status}
            step={step}
          />
        )
      ) : null}
    </article>
  );
}
