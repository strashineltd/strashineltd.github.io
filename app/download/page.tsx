import type { Metadata } from "next";
import { DownloadPanel } from "../components/DownloadPanel";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "下载",
  description: "查看 Stellara Work v0.9.2 Windows 与 macOS 正式版、版本信息与安装包校验值。",
};

export default function DownloadPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <DownloadPanel />
      </main>
      <SiteFooter />
    </>
  );
}
