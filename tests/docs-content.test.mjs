import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const docsPath = new URL("../app/content/docs.ts", import.meta.url);

test("documentation covers the complete v0.9 operating model", async () => {
  const source = await readFile(docsPath, "utf8");
  const articleIds = [...source.matchAll(/^    id: "([a-z-]+)",$/gm)].map((match) => match[1]);

  for (const id of [
    "install-setup",
    "projects-sessions",
    "plan-build",
    "workdir-tools",
    "models",
    "context-window",
    "skills",
    "approvals",
    "local-data",
    "shortcuts",
    "troubleshooting",
    "faq",
  ]) {
    assert.ok(articleIds.includes(id), `missing documentation article: ${id}`);
  }

  assert.match(source, /256K、512K 或 1M/);
  assert.match(source, /默认等待时间是 60 秒/);
  assert.match(source, /本机受限明文/);
  assert.match(source, /Ctrl\+Shift\+P/);
  assert.match(source, /公开安装包暂未上传/);
  assert.doesNotMatch(source, /Ctrl \+ ,/);
});
