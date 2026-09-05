import { expect, test } from "@playwright/test";
import { FIELD_GUIDE_STORAGE_KEY } from "../../app/lib/field-guide/progress-store";
import { createGuide } from "./helpers";

test("command search ranks a 401 diagnosis and restores focus", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  const trigger = page.getByRole("button", { name: "搜索手册" });
  await trigger.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  const dialog = page.getByRole("dialog", { name: "查阅手册" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox").fill("401");
  await expect(dialog.getByRole("option").first()).toContainText("未授权或凭证无效");
  await expect(dialog.getByText("建议诊断")).toBeVisible();
  await expect(dialog.getByText("手册内容")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("theme follows settings and survives reload", async ({ page }) => {
  await createGuide(page, "macOS · Intel", "自定义 · Anthropic Messages");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  await expect(page.locator("[data-manual-theme='night']")).toBeVisible();
  await page.reload();
  await expect(page.locator("[data-manual-theme='night']")).toBeVisible();
});

test("enter opens a diagnostic from its return step", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.getByRole("button", { name: "搜索手册" }).click();
  const dialog = page.getByRole("dialog", { name: "查阅手册" });
  await dialog.getByRole("searchbox").fill("401");
  await expect(dialog.getByRole("option").first()).toContainText("未授权或凭证无效");
  await dialog.getByRole("searchbox").press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("article")).toContainText("在应用内重新输入凭证");
});

test("glossary selection shows an inline definition", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.getByRole("button", { name: "搜索手册" }).click();
  const dialog = page.getByRole("dialog", { name: "查阅手册" });
  await dialog.getByRole("searchbox").fill("checkpoint");
  const glossaryGroup = dialog.getByRole("listbox", { name: "术语" });
  await expect(glossaryGroup.getByRole("option").first()).toContainText("checkpoint");
  await glossaryGroup.getByRole("option").first().click();
  await expect(dialog.locator(".manual-search__definition")).toContainText(
    "保存目标、约束、决策、改动、验证、计划状态与待办的结构化恢复点。",
  );
  await expect(dialog).toBeVisible();
});

test("tab stays inside each dialog", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");

  await page.getByRole("button", { name: "打开手册设置" }).click();
  const settingsDialog = page.getByRole("dialog", { name: "手册设置" });
  await expect(settingsDialog.getByRole("button", { name: "关闭手册设置" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    settingsDialog.getByRole("button", { name: "清除全部本地数据" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(settingsDialog.getByRole("button", { name: "关闭手册设置" })).toBeFocused();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "搜索手册" }).click();
  const searchDialog = page.getByRole("dialog", { name: "查阅手册" });
  const searchbox = searchDialog.getByRole("searchbox");
  await expect(searchbox).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(searchDialog.getByRole("button", { name: "关闭查阅手册" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(searchbox).toBeFocused();
});

test("opening one dialog closes the other before focus moves", async ({ page }, testInfo) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  const shortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";
  const openDirectory = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("button", { name: "打开学习路线" }).click()
      : page.getByRole("button", { name: "完整目录" }).click();

  await openDirectory();
  const directoryDialog = page.getByRole("dialog", { name: "学习路线" });
  await expect(directoryDialog).toBeVisible();
  await page.keyboard.press(shortcut);
  const searchDialog = page.getByRole("dialog", { name: "查阅手册" });
  await expect(directoryDialog).not.toBeVisible();
  await expect(searchDialog).toBeVisible();
  await expect(searchDialog.getByRole("searchbox")).toBeFocused();

  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  const settingsDialog = page.getByRole("dialog", { name: "手册设置" });
  await expect(searchDialog).not.toBeVisible();
  await expect(settingsDialog).toBeVisible();
  await page.keyboard.press(shortcut);
  await expect(settingsDialog).not.toBeVisible();
  await expect(searchDialog).toBeVisible();
  await expect(searchDialog.getByRole("searchbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "打开手册设置" })).toBeFocused();
});

test("diagnostic flow search button opens search and restores focus", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.goto("/docs#connect.verify");
  await page.getByRole("button", { name: "验证失败" }).click();
  await page.getByRole("button", { name: "未授权或凭证无效" }).click();
  await page.getByRole("button", { name: "仍未解决" }).click();
  await page.getByRole("button", { name: "仍未解决" }).click();
  const searchOther = page.getByRole("button", { name: "搜索其他错误" });
  await expect(searchOther).toBeEnabled();
  await searchOther.click();
  await expect(page.getByRole("dialog", { name: "查阅手册" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(searchOther).toBeFocused();
});

test("changing profile rebuilds the route", async ({ page }) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("button", { name: "重新生成路线" }).click();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
  await page.getByRole("radio", { name: "macOS · Apple 芯片" }).check();
  await page.getByRole("radio", { name: "Kimi" }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();
  await expect(page.getByRole("heading", { name: "准备好你的工作环境" })).toBeVisible();
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await expect(
    page.getByRole("dialog", { name: "手册设置" }).getByText("macOS · Apple 芯片 · Kimi"),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "准备好你的工作环境" })).toBeVisible();
});

test("route reset keeps profile and theme but clears steps", async ({ page }, testInfo) => {
  await createGuide(page, "Windows x64", "DeepSeek");
  await page.goto("/docs#connect.verify");
  await page.getByRole("button", { name: "验证通过" }).click();
  await expect(page.getByRole("article").getByRole("status")).toContainText("本步骤已完成");

  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  const settingsDialog = page.getByRole("dialog", { name: "手册设置" });

  await page.getByRole("button", { name: "重置当前路线" }).click();
  await expect(settingsDialog.getByText("完成进度将被清空")).toBeVisible();
  await page.getByRole("button", { name: "取消" }).click();
  await expect(settingsDialog.getByText("完成进度将被清空")).not.toBeVisible();

  await page.getByRole("button", { name: "重置当前路线" }).click();
  await page.getByRole("button", { name: "确认重置" }).click();
  await expect(settingsDialog).not.toBeVisible();

  const openRoute = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("button", { name: "打开学习路线" }).click()
      : Promise.resolve();
  const closeRoute = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("button", { name: "关闭学习路线" }).click()
      : Promise.resolve();
  const connectStepButton = () =>
    testInfo.project.name === "mobile"
      ? page.getByRole("dialog", { name: "学习路线" }).getByRole("button", { name: /在应用内验证模型连接/ })
      : page.getByRole("button", { name: /在应用内验证模型连接/ });

  await openRoute();
  await expect(connectStepButton()).toContainText("未开始");
  await closeRoute();

  await page.getByRole("button", { name: "打开手册设置" }).click();
  await expect(page.getByRole("radio", { name: "夜间版" })).toBeChecked();
  await expect(settingsDialog.getByText("Windows x64 · DeepSeek")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-manual-theme='night']")).toBeVisible();
});

test("clear all returns to profile setup and system theme", async ({ page }) => {
  await createGuide(page, "macOS · Intel", "自定义 · Anthropic Messages");
  await page.getByRole("button", { name: "打开手册设置" }).click();
  await page.getByRole("radio", { name: "夜间版" }).check();
  const settingsDialog = page.getByRole("dialog", { name: "手册设置" });

  await page.getByRole("button", { name: "清除全部本地数据" }).click();
  await expect(settingsDialog.getByText("主题恢复为跟随系统")).toBeVisible();
  await page.getByRole("button", { name: "确认清除" }).click();

  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
  await expect(page.locator("[data-manual-theme='system']")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
});

test("unavailable storage keeps the session temporary", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage denied", "SecurityError");
      },
    });
  });
  await page.goto("/docs");
  const banner = page.getByText("当前为临时会话；关闭页面后进度会丢失");
  await expect(banner).toBeVisible();
  await page.getByRole("radio", { name: "Windows x64" }).check();
  await page.getByRole("radio", { name: "DeepSeek" }).check();
  await page.getByRole("button", { name: "生成我的路线" }).click();
  await expect(page.getByRole("heading", { name: "准备好你的工作环境" })).toBeVisible();
  await expect(banner).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeVisible();
  await expect(banner).toBeVisible();
});

test("corrupt storage inspects raw data and requires explicit reset", async ({ page }) => {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, "{");
  }, FIELD_GUIDE_STORAGE_KEY);
  await page.goto("/docs");
  await expect(
    page.getByRole("heading", { level: 1, name: "本地进度无法读取" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).not.toBeVisible();
  await page.getByRole("button", { name: "检查失败的数据" }).click();
  await expect(page.locator(".manual-storage-error__raw")).toHaveText("{");
  await page.getByRole("button", { name: "重置本地进度" }).click();
  await expect(page.getByRole("heading", { name: "为你编排一份现场手册" })).toBeFocused();
});
