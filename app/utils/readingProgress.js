const BOTTOM_THRESHOLD_PX = 2;

/**
 * Calculate article reading progress against the distance the page can
 * actually scroll, rather than the article's full rendered height.
 *
 * @param {{
 *   scrollY: number;
 *   viewportHeight: number;
 *   documentHeight: number;
 *   articleTop: number;
 *   articleHeight: number;
 *   startOffset?: number;
 * }} metrics
 */
export function calculateReadingProgress({
  scrollY,
  viewportHeight,
  documentHeight,
  articleTop,
  articleHeight,
  startOffset = 72,
}) {
  const safeViewportHeight = Math.max(0, viewportHeight);
  const maxPageScroll = Math.max(0, documentHeight - safeViewportHeight);

  if (maxPageScroll <= BOTTOM_THRESHOLD_PX) return 1;

  const currentScroll = Math.min(maxPageScroll, Math.max(0, scrollY));
  if (maxPageScroll - currentScroll <= BOTTOM_THRESHOLD_PX) return 1;

  const readingStart = Math.min(
    maxPageScroll,
    Math.max(0, articleTop - Math.max(0, startOffset)),
  );
  const articleBottomScroll = articleTop + Math.max(0, articleHeight) - safeViewportHeight;
  const readingEnd = Math.min(
    maxPageScroll,
    Math.max(readingStart, articleBottomScroll),
  );
  const readableDistance = readingEnd - readingStart;

  if (readableDistance <= BOTTOM_THRESHOLD_PX) {
    return currentScroll >= readingStart ? 1 : 0;
  }

  return Math.min(1, Math.max(0, (currentScroll - readingStart) / readableDistance));
}
