"use client";

import {
  BookOpen,
  CalendarDays,
  Check,
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
  PanelRight,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  WandSparkles,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  docArticles,
  getArticleSearchText,
  getDocArticle,
  type DocIconName,
  type DocNote,
} from "../content/docs";

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
  const searchRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return docArticles;
    return docArticles.filter((article) => getArticleSearchText(article).includes(normalizedQuery));
  }, [normalizedQuery]);

  const active = getDocArticle(activeId) ?? docArticles[0];
  const ActiveIcon = iconMap[active.icon];
  const groups = Array.from(new Set(filtered.map((article) => article.group)));
  const activeIndex = docArticles.findIndex((article) => article.id === active.id);
  const previous = activeIndex > 0 ? docArticles[activeIndex - 1] : null;
  const next = activeIndex < docArticles.length - 1 ? docArticles[activeIndex + 1] : null;
  const sectionCount = docArticles.reduce((count, article) => count + article.sections.length, 0);

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
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

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
              <span><strong>v0.9.0</strong> 当前版本</span>
            </div>
          </div>
          <div className="docs-search-wrap">
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
            <p id="docs-search-status" className="docs-search-status" aria-live="polite">
              {normalizedQuery ? `找到 ${filtered.length} 个相关主题` : "按 / 随时聚焦搜索框"}
            </p>
          </div>
        </div>
      </section>

      <div className="docs-layout page-shell">
        <aside className="docs-sidebar" aria-label="文档目录">
          <div className="docs-sidebar__summary">
            <span>{normalizedQuery ? "搜索结果" : "文档目录"}</span>
            <strong>{filtered.length} / {docArticles.length}</strong>
          </div>
          {filtered.length === 0 ? (
            <div className="docs-empty">
              <Search aria-hidden="true" size={20} />
              <strong>没有找到相关内容</strong>
              <span>尝试“模型”“审批”“429”或“快捷键”。</span>
              <button type="button" onClick={() => updateQuery("")}>清除搜索</button>
            </div>
          ) : groups.map((group) => (
            <div className="docs-group" key={group}>
              <h2>{group}</h2>
              {filtered.filter((article) => article.group === group).map((article) => {
                const Icon = iconMap[article.icon];
                const selected = article.id === active.id;
                return (
                  <button
                    key={article.id}
                    type="button"
                    className={`docs-nav-item${selected ? " docs-nav-item--active" : ""}`}
                    onClick={() => selectArticle(article.id)}
                    aria-current={selected ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" size={16} />
                    <span className="docs-nav-item__copy">
                      <strong>{article.title}</strong>
                      <small>{article.readTime}</small>
                    </span>
                    <ChevronRight aria-hidden="true" size={14} />
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {filtered.length === 0 ? (
          <section className="docs-no-result" aria-labelledby="docs-no-result-title">
            <Search aria-hidden="true" size={26} />
            <h2 id="docs-no-result-title">没有匹配“{query.trim()}”的文档</h2>
            <p>搜索会检查标题、正文、表格、示例和排错关键词。可以尝试更短的关键词。</p>
            <div>
              {["模型", "工作目录", "审批", "快捷键"].map((term) => (
                <button key={term} type="button" onClick={() => updateQuery(term)}>{term}</button>
              ))}
            </div>
          </section>
        ) : (
          <article id="docs-article-content" className="docs-article" tabIndex={-1} aria-labelledby="docs-article-title">
            <div className="docs-breadcrumb">
              <span>文档</span>
              <ChevronRight aria-hidden="true" size={13} />
              <span>{active.group}</span>
              <ChevronRight aria-hidden="true" size={13} />
              <strong>{active.title}</strong>
            </div>
            <header className="docs-article__header">
              <div className="docs-article__icon"><ActiveIcon aria-hidden="true" size={24} /></div>
              <div>
                <h2 id="docs-article-title">{active.title}</h2>
                <p>{active.summary}</p>
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
                      {section.title}<Link2 aria-hidden="true" size={15} />
                    </a>
                  </h3>
                  <div className="docs-prose">
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>

                  {section.steps && (
                    <ol className="docs-steps">
                      {section.steps.map((step, index) => (
                        <li key={step.title}>
                          <span>{index + 1}</span>
                          <div><strong>{step.title}</strong><p>{step.detail}</p></div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {section.bullets && (
                    <div className="docs-bullet-grid">
                      {section.bullets.map((item) => (
                        <div key={item.title}>
                          <Check aria-hidden="true" size={15} />
                          <p><strong>{item.title}</strong><span>{item.detail}</span></p>
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
                      {section.checklist.map((item) => <li key={item}><CircleCheckBig aria-hidden="true" size={16} /><span>{item}</span></li>)}
                    </ul>
                  )}

                  {section.code && (
                    <div className="code-block">
                      <div className="code-block__header">
                        <span>{section.code.label}</span>
                        <button type="button" onClick={() => copyCode(section.code!.content, codeKey)}>
                          {copied === codeKey ? <Check aria-hidden="true" size={14} /> : <Clipboard aria-hidden="true" size={14} />}
                          {copied === codeKey ? "已复制" : "复制"}
                        </button>
                      </div>
                      <pre><code>{section.code.content}</code></pre>
                    </div>
                  )}

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
              <span>适用于 Stellara Work v0.9.0</span>
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
