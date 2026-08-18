import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const iconUrl = `${basePath}/stellara-icon.png`;
const socialImageUrl = `${basePath}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "Stellara Work — 本地优先的桌面 Agent",
    template: "%s · Stellara Work",
  },
  description:
    "数据留在本地，模型自由选择，危险操作先确认。Stellara Work 是为真实项目打造的桌面 Agent。",
  icons: {
    icon: iconUrl,
    shortcut: iconUrl,
    apple: iconUrl,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Stellara Work",
    title: "Stellara Work — 把复杂工作，留在本地完成。",
    description: "本地数据、模型自由、操作可控的桌面 Agent。",
    images: [{ url: socialImageUrl, width: 1729, height: 909, alt: "Stellara Work" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellara Work — 把复杂工作，留在本地完成。",
    description: "本地数据、模型自由、操作可控的桌面 Agent。",
    images: [socialImageUrl],
  },
};

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
