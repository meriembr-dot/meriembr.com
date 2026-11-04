// js/galerie.test.mjs : lancer avec node --test js/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { lireHash, visibles, voisin } from "./galerie.js";

test("lireHash", () => {
  assert.equal(lireHash("#travaux/packaging_labels"), "packaging_labels");
  assert.equal(lireHash("#travaux"), "tout");
  assert.equal(lireHash(""), "tout");
  assert.equal(lireHash("#contact"), "tout");
});

test("visibles", () => {
  const items = [{ cat: "logos" }, { cat: "web" }, { cat: "logos" }];
  assert.deepEqual(visibles(items, "tout"), [0, 1, 2]);
  assert.deepEqual(visibles(items, "logos"), [0, 2]);
  assert.deepEqual(visibles(items, "gaming"), []);
});

test("voisin boucle", () => {
  assert.equal(voisin(0, 3, -1), 2);
  assert.equal(voisin(2, 3, 1), 0);
  assert.equal(voisin(1, 3, 1), 2);
});
