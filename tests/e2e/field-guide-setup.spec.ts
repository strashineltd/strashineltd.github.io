import { expect, test } from "@playwright/test";
import { FIELD_GUIDE_STORAGE_KEY } from "../../app/lib/field-guide/progress-store";
import { resetGuide } from "./helpers";

test("first visit creates a personalized field guide", async ({ page }, testInfo) => {
  await resetGuide(page);
  await page.goto("/docs");
  await expect(page.getByText("Stellara Field Notes")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "为你编排一份现场手册" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Windows x64" }).check();
  await page.getByRole("radio", { name: "DeepSeek" }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();
  const routeHeading = page.getByRole("heading", {
    name: "准备好你的工作环境",
  });
  await expect(routeHeading).toBeVisible();
  await expect(routeHeading).toBeFocused();
  if (testInfo.project.name === "mobile") {
    await expect(page.getByText("四卷核心路线")).toBeVisible();
  } else {
    await expect(page.getByText("45 分钟", { exact: true })).toBeVisible();
  }
});

test("saved profile restores the route after reload", async ({ page }) => {
  await resetGuide(page);
  await page.goto("/docs");
  await page.getByRole("radio", { name: "Windows x64" }).check();
  await page.getByRole("radio", { name: "DeepSeek" }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();

  await page.reload();
  await expect(page.getByRole("heading", { name: "准备好你的工作环境" })).toBeVisible();
});

test("denied browser storage falls back to a temporary session", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage denied", "SecurityError");
      },
    });
  });

  await page.goto("/docs");

  await expect(
    page.getByText("当前为临时会话；关闭页面后进度会丢失"),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
});

test("corrupt progress requires explicit reset and restores focus", async ({ page }) => {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, "{");
  }, FIELD_GUIDE_STORAGE_KEY);

  await page.goto("/docs");

  await expect(
    page.getByRole("heading", { level: 1, name: "本地进度无法读取" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "重置本地进度" }).click();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeFocused();
});
