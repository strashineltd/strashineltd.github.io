import type { Metadata } from "next";
import { FieldManual } from "../components/field-guide/FieldManual";
import "./field-manual.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "个性化现场手册",
  description:
    "根据设备与模型服务生成 Stellara Work 的安装、连接、首次成果和可靠交付路线。",
};

export default function DocsPage() {
  return <FieldManual />;
}
