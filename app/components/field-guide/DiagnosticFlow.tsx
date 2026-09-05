"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Search } from "lucide-react";
import type { DiagnosticBranch } from "../../content/field-guide/types.ts";

type DiagnosticFlowProps = {
  branch: DiagnosticBranch;
  onReturnToValidation: () => void;
  onOpenSearch?: () => void;
};

export function DiagnosticFlow({
  branch,
  onReturnToValidation,
  onOpenSearch,
}: DiagnosticFlowProps) {
  const [checkIndex, setCheckIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = useId();
  const check = branch.steps[checkIndex];
  const isFinal = checkIndex === branch.steps.length - 1;
  const nextCheck = branch.steps[checkIndex + 1];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="manual-diagnostic" aria-labelledby={headingId}>
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>
        {branch.symptom}
      </h2>
      <p className="manual-diagnostic__progress">
        检查 {checkIndex + 1} / {branch.steps.length}
        {nextCheck ? (
          <>
            <span aria-hidden="true"> · </span>下一项检查：{nextCheck.title}
          </>
        ) : null}
      </p>

      <h3>{check.title}</h3>
      <p>{check.instruction}</p>
      <p className="manual-diagnostic__expected">
        <strong>预期结果</strong>
        {check.expected}
      </p>

      <div className="manual-validation__actions">
        <button
          className="manual-primary-action"
          onClick={onReturnToValidation}
          type="button"
        >
          <CheckCircle2 aria-hidden="true" />
          问题已解决，重新验证
        </button>
        {isFinal ? (
          <>
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else document.dispatchEvent(new CustomEvent("manual:open-search"));
              }}
              type="button"
            >
              <Search aria-hidden="true" />
              搜索其他错误
            </button>
            <button onClick={onReturnToValidation} type="button">
              <ArrowLeft aria-hidden="true" />
              返回验证步骤
            </button>
          </>
        ) : (
          <button
            onClick={() => setCheckIndex((index) => index + 1)}
            type="button"
          >
            <ArrowRight aria-hidden="true" />
            仍未解决
          </button>
        )}
      </div>
    </section>
  );
}
