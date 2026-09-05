"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

type GuideDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter((element) => element.getClientRects().length > 0 && !element.inert);
}

export function GuideDialog({
  open,
  title,
  onClose,
  initialFocusRef,
  children,
}: GuideDialogProps) {
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const releaseDialogRef = useRef<(() => void) | null>(null);

  function closeDialog() {
    releaseDialogRef.current?.();
    onClose();
  }

  useEffect(() => {
    if (!open) return;

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const portalRoot = document.querySelector<HTMLElement>(
      "[data-guide-dialog-root]",
    );
    const guideRoot = document.querySelector<HTMLElement>("[data-field-guide]");
    let backgroundElements: HTMLElement[] = [];
    if (guideRoot) {
      backgroundElements =
        portalRoot && portalRoot.parentElement === guideRoot
          ? Array.from(guideRoot.children).filter(
              (element): element is HTMLElement =>
                element instanceof HTMLElement && element !== portalRoot,
            )
          : [guideRoot];
    }
    const inertStates = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
    }));
    const previousOverflow = document.body.style.overflow;
    let released = false;

    for (const { element } of inertStates) element.inert = true;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      (initialFocusRef?.current ?? closeButtonRef.current)?.focus();
    });

    function releaseDialog() {
      if (released) return;
      released = true;
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      for (const { element, inert } of inertStates) element.inert = inert;
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
      releaseDialogRef.current = null;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        releaseDialog();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    releaseDialogRef.current = releaseDialog;
    document.addEventListener("keydown", handleKeyDown);
    return releaseDialog;
  }, [initialFocusRef, onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const portalRoot =
    document.querySelector<HTMLElement>("[data-guide-dialog-root]") ??
    document.body;

  return createPortal(
    <div className="manual-dialog-backdrop">
      <div
        aria-labelledby={headingId}
        aria-modal="true"
        className="manual-dialog"
        ref={dialogRef}
        role="dialog"
      >
        <header className="manual-dialog__header">
          <h2 id={headingId}>{title}</h2>
          <button
            aria-label={`关闭${title}`}
            onClick={closeDialog}
            ref={closeButtonRef}
            type="button"
          >
            关闭
          </button>
        </header>
        <div className="manual-dialog__body">{children}</div>
      </div>
    </div>,
    portalRoot,
  );
}
