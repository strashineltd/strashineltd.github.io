"use client";

import { useId, useRef, useState, type RefObject } from "react";
import { Check, Lock, X } from "lucide-react";
import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import type {
  StepProgress,
  ValidationResult,
} from "../../content/field-guide/types.ts";
import type { ResolvedStep } from "../../lib/field-guide/route-engine.ts";

type ValidationFlowProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  step: ResolvedStep;
  status?: StepProgress["status"];
  onContinue: () => void;
  onOpenDiagnostic: (branchId: string) => void;
  onRecordResult: (result: ValidationResult) => void;
};

export function ValidationFlow({
  headingRef,
  step,
  status,
  onContinue,
  onOpenDiagnostic,
  onRecordResult,
}: ValidationFlowProps) {
  const [chooserOpen, setChooserOpen] = useState(false);
  const chooserRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const task = step.validation;
  if (!task) return null;

  const completed = status === "completed";
  const symptoms = task.failureDiagnosticIds
    .map((id) =>
      fieldGuideCatalog.diagnostics.find((branch) => branch.id === id),
    )
    .filter((branch): branch is NonNullable<typeof branch> => branch !== undefined);

  function failValidation() {
    onRecordResult("failed");
    setChooserOpen(true);
    window.requestAnimationFrame(() => chooserRef.current?.focus());
  }

  return (
    <section className="manual-validation" aria-labelledby={headingId}>
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>
        {task.title}
      </h2>

      <ol className="manual-validation__steps">
        {task.applicationSteps.map((applicationStep) => (
          <li key={applicationStep}>{applicationStep}</li>
        ))}
      </ol>

      <p className="manual-validation__warning">
        <Lock aria-hidden="true" />
        API Key 始终留在 Stellara Work 中；不要粘贴到本网页。
      </p>

      {completed ? (
        <div className="manual-validation__completed">
          <p className="manual-validation__announcement" role="status">
            <Check aria-hidden="true" />
            本步骤已完成
          </p>
          <p className="manual-validation__success">
            <Check aria-hidden="true" />
            {task.successText}
          </p>
          <button
            className="manual-primary-action"
            onClick={onContinue}
            type="button"
          >
            <Check aria-hidden="true" />
            继续下一步
          </button>
        </div>
      ) : chooserOpen ? (
        <div className="manual-symptom-chooser">
          <p className="manual-symptom-chooser__prompt" role="alert">
            请选择应用显示的错误类型
          </p>
          <ul>
            {symptoms.map((branch, index) => (
              <li key={branch.id}>
                <button
                  onClick={() => onOpenDiagnostic(branch.id)}
                  ref={index === 0 ? chooserRef : undefined}
                  type="button"
                >
                  {branch.symptom}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="manual-validation__actions">
          <button
            className="manual-primary-action"
            onClick={() => onRecordResult("passed")}
            type="button"
          >
            <Check aria-hidden="true" />
            验证通过
          </button>
          <button
            className="manual-validation__fail"
            onClick={failValidation}
            type="button"
          >
            <X aria-hidden="true" />
            验证失败
          </button>
        </div>
      )}
    </section>
  );
}
