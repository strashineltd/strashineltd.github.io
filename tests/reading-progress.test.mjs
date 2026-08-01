import assert from "node:assert/strict";
import test from "node:test";

import { calculateReadingProgress } from "../app/utils/readingProgress.js";

const baseMetrics = {
  viewportHeight: 1000,
  documentHeight: 4000,
  articleTop: 1000,
  articleHeight: 3000,
  startOffset: 72,
};

test("reading progress starts when the article reaches the sticky offset", () => {
  assert.equal(calculateReadingProgress({ ...baseMetrics, scrollY: 927 }), 0);
  assert.equal(calculateReadingProgress({ ...baseMetrics, scrollY: 928 }), 0);
});

test("reading progress uses the reachable article scroll distance", () => {
  const midpoint = (928 + 3000) / 2;
  assert.equal(calculateReadingProgress({ ...baseMetrics, scrollY: midpoint }), 0.5);
});

test("reading progress reaches 100 percent at the page bottom", () => {
  assert.equal(calculateReadingProgress({ ...baseMetrics, scrollY: 3000 }), 1);
  assert.equal(calculateReadingProgress({ ...baseMetrics, scrollY: 2998.5 }), 1);
});

test("reading progress completes when the article ends before the page", () => {
  assert.equal(calculateReadingProgress({
    ...baseMetrics,
    documentHeight: 4500,
    scrollY: 3000,
  }), 1);
});

test("a page without a scrollable range is already fully readable", () => {
  assert.equal(calculateReadingProgress({
    scrollY: 0,
    viewportHeight: 1000,
    documentHeight: 800,
    articleTop: 120,
    articleHeight: 600,
  }), 1);
});
