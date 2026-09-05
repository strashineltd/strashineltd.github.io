import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { createGuide } from "./helpers";

async function expectNoAxeViolations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document.getAnimations().map((animation) =>
        animation.finished.catch(() => undefined),
      ),
    ),
  );
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test("field guide has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/docs");
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
  await expectNoAxeViolations(page);

  await createGuide(page, "Windows x64", "DeepSeek");
  await expect(page.getByRole("article")).toBeVisible();
  await expectNoAxeViolations(page);

  await page.getByRole("button", { name: "搜索手册" }).click();
  await expect(page.getByRole("dialog", { name: "查阅手册" })).toBeVisible();
  await expectNoAxeViolations(page);
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "打开手册设置" }).click();
  await expect(page.getByRole("dialog", { name: "手册设置" })).toBeVisible();
  await expectNoAxeViolations(page);
  await page.keyboard.press("Escape");

  await page.goto("/docs#connect.verify");
  await page.getByRole("button", { name: "验证失败" }).click();
  await expect(page.getByRole("alert")).toContainText("请选择应用显示的错误类型");
  await expectNoAxeViolations(page);

  await page.getByRole("button", { name: "未授权或凭证无效" }).click();
  await expect(page.getByText("在应用内重新输入凭证")).toBeVisible();
  await expectNoAxeViolations(page);
});

test("desktop day edition matches the approved baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop visual belongs to the desktop project");
  await createGuide(page, "Windows x64", "DeepSeek");
  await expect(page).toHaveScreenshot("field-guide-day-desktop.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.15,
  });
});

test("desktop night edition matches the approved baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop visual belongs to the desktop project");
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("field-guide-night-desktop.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.15,
  });
});

test("mobile day edition matches the approved baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile visual belongs to the mobile project");
  await createGuide(page, "macOS · Apple 芯片", "Kimi");
  await expect(page).toHaveScreenshot("field-guide-day-mobile.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.15,
  });
});

test("mobile night edition matches the approved baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile visual belongs to the mobile project");
  await createGuide(page, "macOS · Apple 芯片", "Kimi");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("field-guide-night-mobile.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.15,
  });
});

test("reduced motion disables lesson and dialog transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await expect(page.getByRole("dialog", { name: "手册设置" })).toBeVisible();
  const allowed = new Set(["0s", "0.01ms", "1e-05s"]);
  for (const selector of [".manual-dialog-backdrop", ".manual-dialog"]) {
    const duration = await page
      .locator(selector)
      .evaluate((element) => getComputedStyle(element).animationDuration);
    expect(allowed, `${selector} animationDuration`).toContain(duration);
  }
});
