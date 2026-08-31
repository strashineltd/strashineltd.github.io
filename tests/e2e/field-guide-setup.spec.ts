import { expect, test } from "@playwright/test";
import { resetGuide } from "./helpers";

test("first visit creates a personalized field guide", async ({ page }) => {
  await resetGuide(page);
  await page.goto("/docs");
  await expect(page.getByText("Stellara Field Notes")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "为你编排一份现场手册" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Windows x64" }).check();
  await page.getByRole("radio", { name: "DeepSeek" }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();
  await expect(
    page.getByRole("heading", { name: "准备好你的工作环境" }),
  ).toBeVisible();
  await expect(page.getByText("45 分钟")).toBeVisible();
});
