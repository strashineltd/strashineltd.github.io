"use client";

import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  CircleHelp,
  Clipboard,
  Clock3,
  Command,
  Cpu,
  Database,
  FolderKanban,
  Gauge,
  Info,
  Keyboard,
  LayoutPanelLeft,
  LifeBuoy,
  Link2,
  ListChecks,
  MessageSquareText,
  Monitor,
  Moon,
  PanelRight,
  Printer,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  TriangleAlert,
  WandSparkles,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  docArticles,
  getArticleSearchText,
  getDocArticle,
  type DocIconName,
  type DocNote,
} from "../content/docs";
import { calculateReadingProgress } from "../utils/readingProgress";

const iconMap: Record<DocIconName, typeof BookOpen> = {
  rocket: Rocket,
  message: MessageSquareText,
  layout: LayoutPanelLeft,
  folders: FolderKanban,
  plan: ListChecks,
  workspace: PanelRight,
  tools: Wrench,
  models: Cpu,
  context: Gauge,
  settings: Settings2,
  skills: WandSparkles,
  shield: ShieldCheck,
  database: Database,
  keyboard: Keyboard,
  command: Command,
  lifebuoy: LifeBuoy,
  help: CircleHelp,
};

const noteIconMap = {
  info: Info,
  warning: TriangleAlert,
  success: CircleCheckBig,
};

export function DocsExplorer() {
  const [activeId, setActiveId] = useState(docArticles[0].id);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Theme state: light / dark / system
  type Theme = "light" | "dark" | "system";
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docs-theme") as Theme | null;
      if (saved && ["light", "dark", "system"].includes(saved)) {
        return saved;
      }
    }
    return "system";
  });

  // Resolve effective theme (light or dark) based on system preference
  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  }, [theme]);

  // Apply theme to docs container
  useEffect(() => {
    const container = document.querySelector(".docs-page");
    if (container) {
      container.setAttribute("data-theme", resolvedTheme);
    }
  }, [resolvedTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const container = document.querySelector(".docs-page");
      if (container) {
        container.setAttribute("data-theme", mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Cycle theme: light → dark → system
  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      localStorage.setItem("docs-theme", next);
      return next;
    });
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return docArticles;
    return docArticles.filter((article) => getArticleSearchText(article).includes(normalizedQuery));
  }, [normalizedQuery]);

  // Flat list of visible article IDs for keyboard navigation
  const flatFilteredIds = useMemo(() => {
    return filtered.filter((a) => !collapsedGroups.has(a.group)).map((a) => a.id);
  }, [filtered, collapsedGroups]);

  const active = getDocArticle(activeId) ?? docArticles[0];
  const ActiveIcon = iconMap[active.icon];
  const groups = Array.from(new Set(filtered.map((article) => article.group)));
  const activeIndex = docArticles.findIndex((article) => article.id === active.id);
  const previous = activeIndex > 0 ? docArticles[activeIndex - 1] : null;
  const next = activeIndex < docArticles.length - 1 ? docArticles[activeIndex + 1] : null;
  const sectionCount = docArticles.reduce((count, article) => count + article.sections.length, 0);

  const popularSearchTerms = ["模型", "工作目录", "审批", "快捷键", "429", "工具", "项目", "安全"];

  // Toggle group collapse
  const toggleGroup = useCallback((group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);

  // Get search snippet for an article
  function getSearchSnippet(article: (typeof docArticles)[number]): string | null {
    if (!normalizedQuery) return null;
    const searchText = getArticleSearchText(article);
    const idx = searchText.indexOf(normalizedQuery);
    if (idx < 0) return null;
    const start = Math.max(0, idx - 20);
    const end = Math.min(searchText.length, idx + normalizedQuery.length + 40);
    const prefix = start > 0 ? "…" : "";
    const suffix = end < searchText.length ? "…" : "";
    return prefix + searchText.slice(start, end) + suffix;
  }

  // Highlight matched text in a string
  function highlightText(text: string, q: string): React.ReactNode {
    if (!q) return text;
    const lowerText = text.toLowerCase();
    const lowerQ = q.toLowerCase();
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let idx = lowerText.indexOf(lowerQ);
    while (idx >= 0) {
      if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));
      parts.push(<mark className="docs-highlight" key={`${idx}-${text.slice(idx, idx + lowerQ.length)}`}>{text.slice(idx, idx + lowerQ.length)}</mark>);
      lastIndex = idx + lowerQ.length;
      idx = lowerText.indexOf(lowerQ, lastIndex);
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length > 0 ? parts : text;
  }

  // Print article
  function printArticle() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const sectionsHtml = active.sections.map((s) => {
      const bodyHtml = s.body.map((p) => `<p>${p}</p>`).join("");
      const stepsHtml = s.steps
        ? `<ol>${s.steps.map((st) => `<li><strong>${st.title}</strong><p>${st.detail}</p></li>`).join("")}</ol>`
        : "";
      return `<section><h2>${s.title}</h2>${bodyHtml}${stepsHtml}</section>`;
    }).join("");
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${active.title}</title><style>
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#14171d;line-height:1.7;font-size:14px}
      h1{font-size:28px;margin-bottom:8px}h2{font-size:20px;margin-top:32px;border-bottom:1px solid #e3e6eb;padding-bottom:8px}
      p{color:#4e5867}strong{color:#14171d}ol{padding-left:20px}
      .meta{color:#7d8695;font-size:12px;margin-bottom:24px}
    </style></head><body><h1>${active.title}</h1><p class="meta">${active.readTime} · 更新于 ${active.updated}</p><p>${active.summary}</p>${sectionsHtml}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  }

  // Scroll progress tracking
  useEffect(() => {
    let animationFrame = 0;

    function updateProgress() {
      animationFrame = 0;
      const articleEl = document.getElementById("docs-article-content");
      if (!articleEl) { setScrollProgress(0); return; }
      const rect = articleEl.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const root = document.documentElement;
      const documentHeight = Math.max(root.scrollHeight, document.body?.scrollHeight ?? 0);
      const progress = calculateReadingProgress({
        scrollY: window.scrollY,
        viewportHeight: root.clientHeight,
        documentHeight,
        articleTop,
        articleHeight: articleEl.offsetHeight,
      });
      setScrollProgress((current) => Math.abs(current - progress) < 0.001 ? current : progress);
    }

    function scheduleProgressUpdate() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateProgress);
    }

    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleProgressUpdate);
    scheduleProgressUpdate();
    return () => {
      window.removeEventListener("scroll", scheduleProgressUpdate);
      window.removeEventListener("resize", scheduleProgressUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [activeId]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !sidebarRef.current) return;
    const items = sidebarRef.current.querySelectorAll<HTMLElement>(".docs-nav-item");
    const visibleIndex = flatFilteredIds.indexOf(filtered[focusedIndex]?.id ?? "");
    if (visibleIndex >= 0 && items[visibleIndex]) {
      items[visibleIndex].scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, flatFilteredIds, filtered]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
      // Arrow navigation in sidebar
      if (!isTyping && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        setFocusedIndex((prev) => {
          if (event.key === "ArrowDown") return Math.min(filtered.length - 1, prev + 1);
          return Math.max(0, prev - 1);
        });
      }
      if (!isTyping && event.key === "Enter" && focusedIndex >= 0 && focusedIndex < filtered.length) {
        event.preventDefault();
        selectArticle(filtered[focusedIndex].id);
      }
      // n/p for next/previous article
      if (!isTyping && event.key === "n") {
        event.preventDefault();
        if (next) selectArticle(next.id);
      }
      if (!isTyping && event.key === "p") {
        event.preventDefault();
        if (previous) selectArticle(previous.id);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [filtered, focusedIndex, next, previous]);

  function selectArticle(id: string, scroll = true) {
    setActiveId(id);

    if (scroll) {
      window.requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const articleElement = document.getElementById("docs-article-content");
        articleElement?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        articleElement?.focus({ preventScroll: true });
      });
    }
  }

  function updateQuery(value: string) {
    setQuery(value);
    const nextQuery = value.trim().toLowerCase();
    if (!nextQuery) return;
    const matches = docArticles.filter((article) => getArticleSearchText(article).includes(nextQuery));
    if (matches.length > 0 && !matches.some((article) => article.id === activeId)) {
      setActiveId(matches[0].id);
    }
  }

  async function copyCode(code: string, key: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <>
      <section className="docs-hero">
        <div className="page-shell docs-hero__inner">
          <div className="docs-hero__copy">
            <span className="section-kicker">Stellara Work 文档 · v0.9</span>
            <h1>从首次配置到安全交付，每一步都有依据。</h1>
            <p>这是一份以当前程序实现为准的完整手册，覆盖模型、项目工作流、工具边界、本地数据与故障排查。</p>
            <div className="docs-hero__stats" aria-label="文档概况">
              <span><strong>{docArticles.length}</strong> 个主题</span>
              <span><strong>{sectionCount}</strong> 个章节</span>
              <span><strong>v0.9.1</strong> 当前版本</span>
            </div>
          </div>
          <div className="docs-search-wrap">
            <div className="docs-search-bar">
              <label className="docs-search">
                <Search aria-hidden="true" size={18} />
                <span className="sr-only">搜索全部文档</span>
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="搜索功能、错误或快捷键…"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  aria-describedby="docs-search-status"
                />
                {query ? (
                  <button type="button" onClick={() => updateQuery("")} aria-label="清除搜索">
                    <X aria-hidden="true" size={16} />
                  </button>
                ) : <kbd>/</kbd>}
              </label>
              <button
                type="button"
                className="docs-theme-toggle"
                onClick={cycleTheme}
                aria-label={`主题：${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"}，点击切换`}
              >
                {theme === "light" && <Sun aria-hidden="true" size={16} />}
                {theme === "dark" && <Moon aria-hidden="true" size={16} />}
                {theme === "system" && <Monitor aria-hidden="true" size={16} />}
              </button>
            </div>
            <p id="docs-search-status" className="docs-search-status" aria-live="polite">
              {normalizedQuery ? `找到 ${filtered.length} 个相关主题` : "按 / 随时聚焦搜索框"}
            </p>
          </div>
        </div>
      </section>

      <div className="docs-layout page-shell">
        <aside className="docs-sidebar" ref={sidebarRef} aria-label="文档目录">
          <div className="docs-sidebar__summary">
            <span>{normalizedQuery ? "搜索结果" : "文档目录"}</span>
            <strong>{filtered.length} / {docArticles.length}</strong>
          </div>
          {filtered.length === 0 ? (
            <div className="docs-empty">
              <Search aria-hidden="true" size={20} />
              <strong>没有找到相关内容</strong>
              <span>尝试以下热门搜索：</span>
              <div className="docs-empty__chips">
                {popularSearchTerms.map((term) => (
                  <button key={term} type="button" className="docs-empty__chip" onClick={() => updateQuery(term)}>{term}</button>
                ))}
              </div>
              <button type="button" onClick={() => updateQuery("")}>清除搜索</button>
            </div>
          ) : groups.map((group) => {
            const groupArticles = filtered.filter((article) => article.group === group);
            const isCollapsed = collapsedGroups.has(group);
            return (
              <div className={`docs-group${isCollapsed ? " docs-group--collapsed" : ""}`} key={group}>
                <button
                  type="button"
                  className="docs-group__header"
                  onClick={() => toggleGroup(group)}
                  aria-expanded={!isCollapsed}
                >
                  <span className="docs-group__title">{group}</span>
                  <span className="docs-group__badge">{groupArticles.length}</span>
                  <ChevronDown aria-hidden="true" size={13} className="docs-group__chevron" />
                </button>
                {!isCollapsed && groupArticles.map((article) => {
                  const Icon = iconMap[article.icon];
                  const selected = article.id === active.id;
                  const snippet = getSearchSnippet(article);
                  return (
                    <button
                      key={article.id}
                      type="button"
                      className={`docs-nav-item${selected ? " docs-nav-item--active" : ""}${focusedIndex >= 0 && filtered[focusedIndex]?.id === article.id ? " docs-nav-item--focused" : ""}`}
                      onClick={() => { selectArticle(article.id); setFocusedIndex(filtered.findIndex((a) => a.id === article.id)); }}
                      aria-current={selected ? "page" : undefined}
                    >
                      <Icon aria-hidden="true" size={16} />
                      <span className="docs-nav-item__copy">
                        <strong>{normalizedQuery ? highlightText(article.title, normalizedQuery) : article.title}</strong>
                        {snippet ? (
                          <small className="docs-nav-item__snippet">{snippet}</small>
                        ) : (
                          <small>{article.readTime}</small>
                        )}
                      </span>
                      <ChevronRight aria-hidden="true" size={14} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </aside>

        {filtered.length === 0 ? (
          <section className="docs-no-result" aria-labelledby="docs-no-result-title">
            <Search aria-hidden="true" size={26} />
            <h2 id="docs-no-result-title">没有匹配“{query.trim()}”的文档</h2>
            <p>搜索会检查标题、正文、表格、示例和排错关键词。可以尝试更短的关键词。</p>
            <div className="docs-no-result__chips">
              {popularSearchTerms.map((term) => (
                <button key={term} type="button" className="docs-no-result__chip" onClick={() => updateQuery(term)}>{term}</button>
              ))}
            </div>
          </section>
        ) : (
          <article id="docs-article-content" className="docs-article" tabIndex={-1} aria-labelledby="docs-article-title">
            <div className="docs-scroll-progress" role="progressbar" aria-valuenow={Math.round(scrollProgress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="阅读进度">
              <div className="docs-scroll-progress__bar" style={{ width: `${scrollProgress * 100}%` }} />
            </div>
            <div className="docs-breadcrumb">
              <span>文档</span>
              <ChevronRight aria-hidden="true" size={13} />
              <span>{active.group}</span>
              <ChevronRight aria-hidden="true" size={13} />
              <strong>{active.title}</strong>
              <button type="button" className="docs-print-btn" onClick={printArticle} aria-label="打印本文" title="打印本文">
                <Printer aria-hidden="true" size={14} />
                <span>打印</span>
              </button>
            </div>
            <header className="docs-article__header">
              <div className="docs-article__icon"><ActiveIcon aria-hidden="true" size={24} /></div>
              <div>
                <h2 id="docs-article-title">{normalizedQuery ? highlightText(active.title, normalizedQuery) : active.title}</h2>
                <p>{normalizedQuery ? highlightText(active.summary, normalizedQuery) : active.summary}</p>
                <div className="docs-article__meta">
                  <span><Clock3 aria-hidden="true" size={13} />{active.readTime}</span>
                  <span><CalendarDays aria-hidden="true" size={13} />更新于 {active.updated}</span>
                </div>
              </div>
            </header>

            {active.sections.map((section, sectionIndex) => {
              const sectionId = `${active.id}-${section.id}`;
              const codeKey = `${active.id}-${section.id}`;
              return (
                <section className="docs-section" id={sectionId} key={section.id}>
                  <h3>
                    <a href={`#${sectionId}`} aria-label={`链接到：${section.title}`}>
                      {normalizedQuery ? highlightText(section.title, normalizedQuery) : section.title}<Link2 aria-hidden="true" size={15} />
                    </a>
                  </h3>
                  <div className="docs-prose">
                    {section.body.map((paragraph) => <p key={paragraph}>{normalizedQuery ? highlightText(paragraph, normalizedQuery) : paragraph}</p>)}
                  </div>

                  {section.steps && (
                    <ol className="docs-steps">
                      {section.steps.map((step, index) => (
                        <li key={step.title}>
                          <span>{index + 1}</span>
                          <div><strong>{normalizedQuery ? highlightText(step.title, normalizedQuery) : step.title}</strong><p>{normalizedQuery ? highlightText(step.detail, normalizedQuery) : step.detail}</p></div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {section.bullets && (
                    <div className="docs-bullet-grid">
                      {section.bullets.map((item) => (
                        <div key={item.title}>
                          <Check aria-hidden="true" size={15} />
                          <p><strong>{normalizedQuery ? highlightText(item.title, normalizedQuery) : item.title}</strong><span>{normalizedQuery ? highlightText(item.detail, normalizedQuery) : item.detail}</span></p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.table && (
                    <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={`${section.title}表格`}>
                      <table className="docs-table">
                        <thead><tr>{section.table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
                        <tbody>
                          {section.table.rows.map((row, rowIndex) => (
                            <tr key={`${section.id}-${rowIndex}`}>
                              {row.map((cell, cellIndex) => cellIndex === 0
                                ? <th key={cellIndex} scope="row">{cell}</th>
                                : <td key={cellIndex}>{cell}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.checklist && (
                    <ul className="docs-checklist">
                      {section.checklist.map((item) => <li key={item}><CircleCheckBig aria-hidden="true" size={16} /><span>{normalizedQuery ? highlightText(item, normalizedQuery) : item}</span></li>)}
                    </ul>
                  )}

                  {section.code && (() => {
                    const codeBlocks = Array.isArray(section.code) ? section.code : [section.code];
                    return codeBlocks.map((block, blockIndex) => {
                      const blockKey = `${codeKey}-${blockIndex}`;
                      return (
                        <div key={blockKey} className="code-block">
                          <div className="code-block__header">
                            <span>{block.label}</span>
                            <button type="button" onClick={() => copyCode(block.content, blockKey)}>
                              {copied === blockKey ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                              {copied === blockKey ? "已复制" : "复制"}
                            </button>
                          </div>
                          <pre><code>{block.content}</code></pre>
                        </div>
                      );
                    });
                  })()}

                  {section.note && <DocsNote note={section.note} />}
                  <span className="sr-only">章节 {sectionIndex + 1}，共 {active.sections.length} 章</span>
                </section>
              );
            })}

            <section className="docs-related" aria-labelledby="docs-related-title">
              <span className="docs-related__eyebrow">继续阅读</span>
              <h3 id="docs-related-title">相关主题</h3>
              <div>
                {active.related.map((id) => {
                  const article = getDocArticle(id);
                  if (!article) return null;
                  const Icon = iconMap[article.icon];
                  return (
                    <button key={id} type="button" onClick={() => selectArticle(id)}>
                      <Icon aria-hidden="true" size={17} />
                      <span><strong>{article.title}</strong><small>{article.summary}</small></span>
                      <ChevronRight aria-hidden="true" size={15} />
                    </button>
                  );
                })}
              </div>
            </section>

            <nav className="docs-pager" aria-label="上一篇和下一篇">
              {previous ? (
                <button type="button" onClick={() => selectArticle(previous.id)}>
                  <ChevronLeft aria-hidden="true" size={16} />
                  <span><small>上一篇</small><strong>{previous.title}</strong></span>
                </button>
              ) : <span />}
              {next && (
                <button type="button" onClick={() => selectArticle(next.id)}>
                  <span><small>下一篇</small><strong>{next.title}</strong></span>
                  <ChevronRight aria-hidden="true" size={16} />
                </button>
              )}
            </nav>
          </article>
        )}

        {filtered.length > 0 && (
          <aside className="docs-on-this-page" aria-label="本文目录">
            <span>本文内容</span>
            {active.sections.map((section) => (
              <a key={section.id} href={`#${active.id}-${section.id}`}>{section.title}</a>
            ))}
            <div className="docs-version-note">
              <BookOpen aria-hidden="true" size={14} />
              <span>适用于 Stellara Work v0.9.1</span>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

function DocsNote({ note }: { note: DocNote }) {
  const Icon = noteIconMap[note.tone];
  return (
    <aside className={`docs-note docs-note--${note.tone}`}>
      <Icon aria-hidden="true" size={18} />
      <div><strong>{note.title}</strong><p>{note.body}</p></div>
    </aside>
  );
}
