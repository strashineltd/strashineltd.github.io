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

export async function createGuide(
  page: Page,
  platformLabel: string,
  providerLabel: string,
) {
  await resetGuide(page);
  await page.goto("/docs");
  await page.getByRole("radio", { name: platformLabel }).check();
  await page.getByRole("radio", { name: providerLabel }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();
}
