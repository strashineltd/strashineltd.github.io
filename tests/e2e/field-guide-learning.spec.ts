import { expect, test } from "@playwright/test";
import { createGuide } from "./helpers";

test("desktop shows the route on the left and lesson on the right", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop structure belongs to the desktop project");
  await createGuide(page, "Windows x64", "DeepSeek");
  await expect(page.getByRole("navigation", { name: "学习路线" })).toContainText("准备好设备");
  await expect(page.getByRole("article")).toContainText("确认你的安装版本");
  await page.getByRole("button", { name: /接通智能能力/ }).click();
  await expect(page).toHaveURL(/#connect\.choose-service$/);
  await expect(page.getByRole("article")).toContainText("选择模型服务");
});

test("an obsolete step hash returns to the route with an explanation", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.goto("/docs#retired.step");
  await expect(page.getByRole("status")).toContainText("此内容已移动，已返回你的学习路线");
  await expect(page).toHaveURL(/#prepare\.choose-build$/);
});

test("mobile uses a single lesson and opens route navigation on demand", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile structure belongs to the mobile project");
  await createGuide(page, "macOS · Apple 芯片", "Kimi");
  await expect(page.locator("[data-layout='mobile-single-page']")).toBeVisible();
  await page.getByRole("button", { name: "打开学习路线" }).click();
  await expect(page.getByRole("dialog", { name: "学习路线" })).toBeVisible();
});

test("validation failure diagnoses and passing survives reload", async ({ page }, testInfo) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.goto("/docs#connect.verify");
  await expect(page.getByRole("article")).toContainText("在应用内验证模型连接");

  const connectStepButton = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("dialog", { name: "学习路线" }).getByRole("button", { name: /在应用内验证模型连接/ })
      : page.getByRole("button", { name: /在应用内验证模型连接/ });
  const openRoute = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("button", { name: "打开学习路线" }).click()
      : Promise.resolve();
  const closeRoute = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("button", { name: "关闭学习路线" }).click()
      : Promise.resolve();

  await openRoute();
  await expect(connectStepButton()).toContainText("当前");
  await closeRoute();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByText("API Key 始终留在 Stellara Work 中；不要粘贴到本网页。")).toBeVisible();

  await page.getByRole("button", { name: "验证失败" }).click();
  await expect(page.getByRole("alert")).toContainText("请选择应用显示的错误类型");
  await page.getByRole("button", { name: "未授权或凭证无效" }).click();
  await expect(page.getByRole("article")).toContainText("在应用内重新输入凭证");
  await page.getByRole("button", { name: "问题已解决，重新验证" }).click();
  await expect(page.getByRole("button", { name: "验证通过" })).toBeVisible();
  await page.getByRole("button", { name: "验证通过" }).click();
  await expect(page.getByRole("article").getByRole("status")).toContainText("本步骤已完成");
  await expect(page.getByRole("button", { name: "继续下一步" })).toBeVisible();

  await openRoute();
  await expect(connectStepButton()).toContainText("完成");
  await closeRoute();

  await page.reload();
  await expect(page.getByRole("article")).toContainText("在应用内验证模型连接");
  await openRoute();
  await expect(connectStepButton()).toContainText("完成");
});
