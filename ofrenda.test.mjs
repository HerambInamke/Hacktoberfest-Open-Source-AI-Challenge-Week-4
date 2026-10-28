import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMessages, validatePerson, parseOutput, loadAll, saveAll } from "./ofrenda.js";

test("validatePerson requires a name", () => {
  assert.ok(validatePerson({ name: "  " }));
  assert.equal(validatePerson({ name: "Abuela Rosa" }), null);
});

test("buildMessages includes every given detail and skips empty ones", () => {
  const [sys, user] = buildMessages({ name: "Rosa", foods: "mole, pan dulce", story: "danced in the rain", songs: " " });
  assert.equal(sys.role, "system");
  assert.match(user.content, /Name: Rosa/);
  assert.match(user.content, /mole, pan dulce/);
  assert.match(user.content, /danced in the rain/);
  assert.doesNotMatch(user.content, /Favorite songs/);
});

test("parseOutput splits remembrance and calavera, tolerating markdown", () => {
  const out = parseOutput("**REMEMBRANCE**\nShe was kind.\n\n## CALAVERA\nLa Catrina came one day");
  assert.equal(out.remembrance, "She was kind.");
  assert.equal(out.calavera, "La Catrina came one day");
  assert.equal(parseOutput("Remembrance:\nKind.\n**Calavera for Rosa:**\nLa Catrina").calavera, "La Catrina");
  assert.equal(parseOutput("La Catrina knocked at the door,\nfor Rosa").remembrance, "La Catrina knocked at the door,\nfor Rosa");
  assert.deepEqual(parseOutput("just text"), { remembrance: "just text", calavera: "" });
});

test("storage round-trips and survives corrupt data", () => {
  const mem = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = v; } };
  assert.deepEqual(loadAll(mem), []);
  saveAll(mem, [{ name: "Rosa" }]);
  assert.deepEqual(loadAll(mem), [{ name: "Rosa" }]);
  mem.d.ofrendas = "{bad";
  assert.deepEqual(loadAll(mem), []);
});
