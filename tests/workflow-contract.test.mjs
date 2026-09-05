import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowUrl = new URL("../.github/workflows/deploy-pages.yml", import.meta.url);

test("Pages deployment runs every field guide quality gate", async () => {
  const workflow = await readFile(workflowUrl, "utf8");
  for (const command of [
    "npm run lint",
    "npx tsc --noEmit",
    "npm test",
    "npx playwright install --with-deps chromium",
    "npm run test:e2e",
    "GITHUB_PAGES",
  ]) assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
