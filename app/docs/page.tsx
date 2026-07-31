import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { DocsExplorer } from "../components/DocsExplorer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "文档",
  description: "Stellara Work v0.9 完整使用手册：安装配置、项目工作流、模型、工具安全、本地数据、快捷键与故障排查。",
};

export default function DocsPage() {
  return (
    <>
      <SiteHeader />
      <main className="docs-page">
        <DocsExplorer />
      </main>
      <SiteFooter />
    </>
  );
}
