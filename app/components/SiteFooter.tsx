import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Image src="/stellara-icon.png" alt="" width={32} height={32} />
          <div>
            <strong>Stellara Work</strong>
            <span>本地优先的 Windows 桌面 Agent</span>
          </div>
        </div>
        <nav className="site-footer__nav" aria-label="页脚导航">
          <Link href="/">首页</Link>
          <Link href="/docs">文档</Link>
          <Link href="/download">下载</Link>
        </nav>
        <p className="site-footer__meta">v0.9 内测版 · Windows x64</p>
      </div>
    </footer>
  );
}
