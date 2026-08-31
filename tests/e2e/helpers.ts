import type { Page } from "@playwright/test";
import { FIELD_GUIDE_STORAGE_KEY } from "../../app/lib/field-guide/progress-store";

export async function resetGuide(page: Page) {
  await page.addInitScript((storageKey) => {
    const marker = `${storageKey}:e2e-reset`;
    if (window.sessionStorage.getItem(marker)) {
      return;
    }
    window.localStorage.removeItem(storageKey);
    window.sessionStorage.setItem(marker, "done");
  }, FIELD_GUIDE_STORAGE_KEY);
}
