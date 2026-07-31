import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { DocsExplorer } from "../components/DocsExplorer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "文档",
  description: "从安装、模型配置到项目工作流，快速上手 Stellara Work。",
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
