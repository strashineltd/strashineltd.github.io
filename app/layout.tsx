import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Stellara Work — 本地优先的 Windows 桌面 Agent",
      template: "%s · Stellara Work",
    },
    description:
      "数据留在本地，模型自由选择，危险操作先确认。Stellara Work 是为真实项目打造的 Windows 桌面 Agent。",
    icons: {
      icon: "/stellara-icon.png",
      shortcut: "/stellara-icon.png",
      apple: "/stellara-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: "Stellara Work",
      title: "Stellara Work — 把复杂工作，留在本地完成。",
      description: "本地数据、模型自由、操作可控的 Windows 桌面 Agent。",
      images: [{ url: "/og.png", width: 1729, height: 909, alt: "Stellara Work" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Stellara Work — 把复杂工作，留在本地完成。",
      description: "本地数据、模型自由、操作可控的 Windows 桌面 Agent。",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
