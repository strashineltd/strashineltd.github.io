import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
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
  assert.match(html, /Stellara Work 文档/);
  assert.match(html, /<strong>21<\/strong> 个主题/);
  assert.match(html, /安装与首次配置/);
  assert.match(html, /安装包通过 GitHub Releases 提供/);
  assert.match(html, /工作目录/);
  assert.match(html, /适用于 Stellara Work v0\.9\.0/);
});

test("server-renders the download route with verified release metadata", async () => {
  const response = await render("/download");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Stellara Work-Setup-0\.9\.0\.exe/);
  assert.match(html, /117\.3 MiB/);
  assert.match(html, /144\.4 MiB/);
  assert.match(html, /前往下载 v0\.9/);
  assert.doesNotMatch(html, /下载 Windows 版/);
  assert.match(html, /前往 GitHub 下载/);
  assert.match(html, /https:\/\/github\.com\/strashineltd\/stellara-work\/releases/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /34784C8356B367EDEE1AD07064950272F5BA59EE36D898C5758750411DE52475/);
  assert.match(html, /380826DC0010433A70F3C417616A96CBFA6D8F0F8DE5394F3F0F2E3E428051E7/);
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
