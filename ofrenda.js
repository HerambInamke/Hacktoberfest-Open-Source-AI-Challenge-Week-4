// Pure logic: no DOM, no model. Tested with `node --test`.

export const MODELS = {
  "Llama-3.2-3B-Instruct-q4f16_1-MLC": "Llama 3.2 3B (best, ~2.3 GB)",
  "Qwen2.5-1.5B-Instruct-q4f16_1-MLC": "Qwen 2.5 1.5B (faster, ~1 GB)",
};

const FIELDS = { years: "Years", relation: "Who they were to me", foods: "Favorite foods", songs: "Favorite songs", story: "A memory" };

export function validatePerson(p) {
  if (!p?.name?.trim()) return "Please tell us their name.";
  return null;
}

export function buildMessages(p) {
  const details = Object.entries(FIELDS)
    .filter(([k]) => p[k]?.trim())
    .map(([k, label]) => `${label}: ${p[k].trim()}`)
    .join("\n");
  return [
    {
      role: "system",
      content:
        "You help families honor loved ones for Día de los Muertos. Write warmly and specifically. " +
        "Mention their foods, songs and memory BY NAME. Never invent facts about the person. " +
        "Respond in exactly two parts, with these headings on their own lines:\n" +
        "REMEMBRANCE\n(one paragraph, 80-120 words)\n" +
        "CALAVERA\n(a playful rhyming poem of 8 short lines, one per line, where La Catrina comes for them and they charm her)\n\n" +
        "Example calavera shape (replace [Name] and the details with theirs):\n" +
        "La Catrina knocked at [Name]'s door,\n[Name] offered her [food] and asked, \"Want some more?\"\n" +
        "She came to take [Name], but stayed for the dance,\n[song] played and put Death in a trance.",
    },
    { role: "user", content: `Name: ${p.name.trim()}\n${details}` },
  ];
}

// Split the model output into { remembrance, calavera }; tolerant of markdown/bold headings.
export function parseOutput(text) {
  // A heading is a short line starting with the word, e.g. "CALAVERA", "**Calavera for Rosa:**".
  const m = text.split(/^\W*CALAVERA\b[^\n]{0,40}$/im);
  const strip = (s) => (s || "").replace(/^\W*REMEMBRANCE\b[^\n]{0,40}$/im, "").trim();
  return { remembrance: strip(m[0]), calavera: strip(m[1]) };
}

const KEY = "ofrendas";
export function loadAll(storage) {
  try { return JSON.parse(storage.getItem(KEY)) || []; } catch { return []; }
}
export function saveAll(storage, list) {
  try { storage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
}
