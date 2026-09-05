import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  const env = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
  const ctx = {
    waitUntil() {},
    passThroughOnException() {},
  };

  let response = await worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", host: "localhost" },
    }),
    env,
    ctx,
  );

  while ([301, 302, 307, 308].includes(response.status)) {
    const location = response.headers.get("location");
    if (!location) break;
    response = await worker.fetch(
      new Request(new URL(location, "http://localhost").href, {
        headers: { accept: "text/html", host: "localhost" },
      }),
      env,
      ctx,
    );
  }

  return response;
}

test("server-renders the Stellara Work homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Stellara Work/);
  assert.match(html, /把复杂工作/);
  assert.match(html, /数据留在本地/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/download"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("server-renders the documentation route", async () => {
  const response = await render("/docs");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Stellara Field Notes/);
  assert.match(html, /为你编排一份现场手册/);
  assert.match(html, /准备环境/);
  assert.match(html, /数据仅保存在当前浏览器/);
  assert.match(html, /data-field-guide/);
  assert.doesNotMatch(html, /<strong>22<\/strong> 个主题/);
  assert.doesNotMatch(html, /class="docs-hero/);
});

test("server-renders the download route with verified release metadata", async () => {
  const response = await render("/download");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Stellara\.Work-Setup-0\.9\.2-x64\.exe/);
  assert.match(html, /117\.5 MiB/);
  assert.match(html, /144\.6 MiB/);
  assert.match(html, /前往下载/);
  assert.doesNotMatch(html, /下载 Windows 版/);
  assert.match(html, /前往 GitHub 下载/);
  assert.match(html, /https:\/\/github\.com\/strashineltd\/stellara-work\/releases/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /5C46E367AB265873C2C1D6FBA3B4F32D720ACFE03D5D52F9F5DA5BFA0564BD03/);
  assert.match(html, /225C70E36C43B5426F2C5C5726BACA7DA722B1BD98C7F269B5BD7BD3EF9EFC5D/);
  assert.doesNotMatch(html, /111\.8 MiB/);
  assert.doesNotMatch(html, /下载通道准备中/);
  assert.doesNotMatch(html, /78DBC0D14441E1FE98164C88BC5A57027BE126DD5EF0C00C5AC636F7C1580037/);
  assert.match(html, /首次引导/);
  assert.match(html, /连接测试通过，配置已保存/);
  assert.match(html, /class="version-card"/);
  assert.match(html, /changelog-card/);
  assert.doesNotMatch(html, /version-panel/);
  const versionSection = html.match(/<section class="version-section[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(versionSection, /aria-expanded/);
  assert.doesNotMatch(html, /checksum-section/);
});
