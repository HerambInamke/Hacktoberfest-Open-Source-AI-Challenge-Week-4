# 🕯️ Ofrenda Local

*A private digital ofrenda for Día de los Muertos, written by an open-weight model running on your own GPU.*

Tell it about someone you miss: their name, the foods they loved, their songs, one small memory. Llama 3.2 (or Qwen 2.5) runs **inside your browser** through [WebLLM](https://github.com/mlc-ai/web-llm). It writes a short remembrance and a playful *calavera literaria*, then places both on an altar with candles, marigolds, papel picado and their photo.

## Run it

```bash
python -m http.server 8000
# open http://localhost:8000 in Chrome or Edge (WebGPU required)
```

The first run downloads the model weights once (~1–2 GB) into the browser cache. After that it works **offline**.

```bash
node --test   # unit tests for prompt building, parsing, storage
```

## Why open matters here

- **Grief is private.** A grandmother's story shouldn't go to someone else's server. Here the model, the prompt, the photo and the saved ofrendas all stay on your device. There is nothing to log, leak or train on.
- **It works with the lights (and Wi-Fi) off.** Once cached, the model runs locally, so you can sit at the family altar with no connection.
- **Costs nothing, needs no account or API key.** Anyone with a laptop GPU can use it, forever.
- **You can swap the model.** Pick Llama or Qwen from the dropdown, or add any MLC-compiled open model in `ofrenda.js`. A closed API locks you into one model and its policies.
- **It can't be shut down.** It is a static folder. As long as the files exist, the ofrenda does too, and that fits a holiday about memory outlasting us.

## How it works

| File | Role |
|------|------|
| `ofrenda.js` | Pure logic: model list, prompt, output parsing, storage |
| `app.js` | UI, WebLLM engine, streaming, photo downscaling, save/list |
| `index.html` / `style.css` | Altar, papel picado, flickering candles |

Built with open source: WebLLM (Apache-2.0), Llama 3.2 (Llama Community License), Qwen 2.5 (Apache-2.0).
