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
  assert.match(html, /<strong>22<\/strong> 个主题/);
  assert.match(html, /安装与首次启动/);
  assert.match(html, /通过 GitHub Releases 发布/);
  assert.match(html, /工作目录/);
  assert.match(html, /适用于 Stellara Work v0\.9\.1/);
});

test("server-renders the download route with verified release metadata", async () => {
  const response = await render("/download");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Stellara\.Work-Setup-0\.9\.1\.exe/);
  assert.match(html, /113\.5 MiB/);
  assert.match(html, /140\.6 MiB/);
  assert.match(html, /前往下载 v0\.9\.1/);
  assert.doesNotMatch(html, /下载 Windows 版/);
  assert.match(html, /前往 GitHub 下载/);
  assert.match(html, /https:\/\/github\.com\/strashineltd\/stellara-work\/releases/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /B55259D7FDB6A83575ABE4D05DD20E5CF5CF3C13C01D5509BC3C992348EC2DEC/);
  assert.match(html, /EFE89A999EC154BAF225335D91B20983C65AB38E72FF3F827A788F5E67A9F4E7/);
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
