"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "首页" },
  { href: "/docs", label: "文档" },
  { href: "/download", label: "下载" },
];

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Stellara Work 首页">
          <Image
            className="brand__mark"
            src={`${assetBasePath}/stellara-icon.png`}
            alt=""
            width={36}
            height={36}
            priority
            unoptimized
          />
          <span className="brand__name">Stellara Work</span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {navigation.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                className={`nav-link${active ? " nav-link--active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__actions">
          <Link className="button button--small button--dark desktop-download" href="/download">
            <Download aria-hidden="true" size={16} />
            下载 v0.9
          </Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={open ? "关闭导航" : "打开导航"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="移动端主导航">
          {navigation.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                className={`mobile-nav__link${active ? " mobile-nav__link--active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
