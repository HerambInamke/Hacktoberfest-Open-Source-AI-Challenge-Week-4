import { CreateMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.79/+esm";
import { MODELS, validatePerson, buildMessages, parseOutput, loadAll, saveAll } from "./ofrenda.js";

const $ = (id) => document.getElementById(id);
const form = $("form"), status = $("status"), progress = $("progress"), modelSel = $("model");
let engine = null, loadedModel = null, current = null;

for (const [id, label] of Object.entries(MODELS)) modelSel.add(new Option(label, id));

if (!navigator.gpu) {
  status.textContent = "This browser has no WebGPU. Open in recent Chrome or Edge on desktop to run the model locally.";
  $("go").disabled = true;
}

async function ensureEngine() {
  const id = modelSel.value;
  if (engine && loadedModel === id) return;
  progress.hidden = false;
  const onProgress = (r) => { progress.value = r.progress; status.textContent = r.text; };
  if (engine) await engine.reload(id); else engine = await CreateMLCEngine(id, { initProgressCallback: onProgress });
  loadedModel = id;
  progress.hidden = true;
}

// Shrink the photo so it fits in localStorage; it is never uploaded anywhere.
function readPhoto(file) {
  if (!file?.size) return Promise.resolve("");
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 320 / Math.max(img.width, img.height));
      const c = Object.assign(document.createElement("canvas"), { width: img.width * s, height: img.height * s });
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => resolve("");
    img.src = URL.createObjectURL(file);
  });
}

function render(o) {
  $("altar").hidden = false;
  $("altar-name").textContent = o.name;
  $("altar-years").textContent = o.years || "";
  $("photo").src = o.photo || "";
  $("photo").hidden = !o.photo;
  $("photo").alt = o.photo ? `Photo of ${o.name}` : "";
  $("initial").textContent = o.photo ? "" : o.name.trim()[0].toUpperCase();
  $("remembrance").textContent = o.remembrance || "";
  $("calavera").textContent = o.calavera || "";
  $("offering-list").textContent = [o.foods, o.songs].filter(Boolean).join(" · ");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const err = validatePerson(data);
  if (err) { status.textContent = err; return; }
  $("go").disabled = true; $("save").hidden = true;
  try {
    const photo = await readPhoto(data.photo);
    await ensureEngine();
    current = { ...data, photo, remembrance: "", calavera: "", created: Date.now() };
    render(current);
    status.textContent = "The spirits are writing…";
    let text = "";
    const stream = await engine.chat.completions.create({ messages: buildMessages(data), stream: true, temperature: 0.8 });
    for await (const chunk of stream) {
      text += chunk.choices[0]?.delta?.content || "";
      Object.assign(current, parseOutput(text));
      render(current);
    }
    status.textContent = "";
    $("save").hidden = false;
    $("altar").scrollIntoView({ behavior: "smooth" });
  } catch (x) {
    status.textContent = `Something went wrong: ${x.message}`;
    progress.hidden = true;
  } finally {
    $("go").disabled = !navigator.gpu;
  }
});

function renderSaved() {
  const list = loadAll(localStorage);
  $("saved-wrap").hidden = !list.length;
  $("saved").replaceChildren(...list.map((o, i) => {
    const li = document.createElement("li");
    const open = Object.assign(document.createElement("button"), { textContent: o.name, className: "link" });
    open.onclick = () => { render(o); $("save").hidden = true; $("altar").scrollIntoView({ behavior: "smooth" }); };
    const del = Object.assign(document.createElement("button"), { textContent: "×", className: "del", ariaLabel: `Remove ${o.name}` });
    del.onclick = () => { if (confirm(`Remove the ofrenda for ${o.name}?`)) { list.splice(i, 1); saveAll(localStorage, list); renderSaved(); } };
    li.append(open, del);
    return li;
  }));
}

$("save").onclick = () => {
  const list = loadAll(localStorage);
  list.unshift(current);
  if (!saveAll(localStorage, list)) { status.textContent = "Couldn't save. Browser storage is full or blocked."; return; }
  $("save").hidden = true;
  renderSaved();
};

renderSaved();
