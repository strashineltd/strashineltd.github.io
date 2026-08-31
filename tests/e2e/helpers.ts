import type { Page } from "@playwright/test";

const progressStorageKey = "stellara.field-guide.progress.v1";

export async function resetGuide(page: Page) {
  await page.addInitScript((storageKey) => {
    window.localStorage.removeItem(storageKey);
  }, progressStorageKey);
}
