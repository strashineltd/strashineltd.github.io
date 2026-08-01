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
    "advanced-usage",
    "best-practices",
    "changelog",
    "glossary",
  ]) {
    assert.ok(articleIds.includes(id), `missing documentation article: ${id}`);
  }

  // Verify article count (21 total: 17 original + 4 new)
  assert.ok(articleIds.length >= 21, `expected at least 21 articles, got ${articleIds.length}`);

  assert.match(source, /256K、512K 或 1M/);
  assert.match(source, /默认等待时间是 60 秒/);
  assert.match(source, /本机受限明文/);
  assert.match(source, /Ctrl\+Shift\+P/);
  assert.match(source, /公开安装包暂未上传/);
  assert.doesNotMatch(source, /Ctrl \+ ,/);

  // Verify new article content
  assert.match(source, /高级使用模式/);
  assert.match(source, /最佳实践/);
  assert.match(source, /版本变更记录/);
  assert.match(source, /术语表/);
});
