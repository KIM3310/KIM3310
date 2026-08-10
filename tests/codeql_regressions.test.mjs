import assert from "node:assert/strict";
import test from "node:test";

import {
  removeAdLoader,
  stripGeneratedReadmeSections,
} from "../scripts/generate_adsense_publications.mjs";
import { titleCase } from "../scripts/implement_search_growth.mjs";

const loader =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

test("removeAdLoader removes a self-closing loader revealed by a replacement", () => {
  const nested = `<scrip<script src="${loader}" />t src="${loader}" />`;
  assert.equal(removeAdLoader(nested), "");
});

test("removeAdLoader removes a paired loader revealed by a replacement", () => {
  const nested = `<scrip<script src="${loader}"></script>t src="${loader}"></script>`;
  assert.equal(removeAdLoader(nested), "");
});

test("removeAdLoader removes an initialization script revealed by a replacement", () => {
  const initializer =
    "(adsbygoogle = window.adsbygoogle || []).push({});";
  const nested = `<scrip<script>${initializer}</script>t>${initializer}</script>`;
  assert.equal(removeAdLoader(nested), "");
});

test("removeAdLoader preserves unrelated scripts", () => {
  const unrelated = '<script src="https://example.com/application.js"></script>';
  assert.equal(removeAdLoader(unrelated), unrelated);
});

test("stripGeneratedReadmeSections removes comments revealed by a replacement", () => {
  const nested = "before <!<!-- hidden -->--outer--> after";
  assert.equal(stripGeneratedReadmeSections(nested), "before  after");
});

test("titleCase retains the intended Go display name without an identity replacement", () => {
  assert.equal(titleCase("agent-runtime-go"), "Agent Runtime Go");
});
