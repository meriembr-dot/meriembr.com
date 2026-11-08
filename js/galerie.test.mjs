// js/galerie.test.mjs : lancer avec node --test js/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { lireHash, visibles, voisin } from "./galerie.js";

const D = ["identite", "packaging", "edition", "digital"];

test("lireHash", () => {
  assert.equal(lireHash("#expertise/identite", D), "identite");
  assert.equal(lireHash("#galerie-digital", D), "digital");
  assert.equal(lireHash("#expertise/inconnu", D), null);
  assert.equal(lireHash("#expertise", D), null);
  assert.equal(lireHash("", D), null);
  assert.equal(lireHash("#travaux/packaging_labels", D), null);
});

test("visibles", () => {
  const items = [{ domaine: "identite" }, { domaine: "digital" }, { domaine: "identite" }];
  assert.deepEqual(visibles(items, "identite"), [0, 2]);
  assert.deepEqual(visibles(items, "edition"), []);
  assert.deepEqual(visibles(items, null), []);
});

test("voisin boucle", () => {
  assert.equal(voisin(0, 3, -1), 2);
  assert.equal(voisin(2, 3, 1), 0);
  assert.equal(voisin(1, 3, 1), 2);
});
