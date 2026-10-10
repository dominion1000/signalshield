import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { analyzeLocally, buildAiPrompt } from "./src/analyzer.js";

const port = Number(process.env.PORT || 3000);
const publicDir = join(process.cwd(), "public");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png" };

function send(res, status, data, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(type.startsWith("application/json") ? JSON.stringify(data) : data);
}

async function parseBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 50000) throw new Error("Message is too large");
  }
  return JSON.parse(raw || "{}");
}

async function aiAnalysis(message, baseline) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: buildAiPrompt(message, baseline),
      text: { format: { type: "json_object" } }
    })
  });
  if (!response.ok) throw new Error(`AI service returned ${response.status}`);
  const data = await response.json();
  const outputText = data.output_text || data.output
    ?.flatMap((item) => item.content || [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text)
    .join("");
  if (!outputText) throw new Error("AI service returned no text");
  const parsed = JSON.parse(outputText);
  return { ...baseline, ...parsed, engine: `OpenAI ${process.env.OPENAI_MODEL || "gpt-5-mini"} + local signals`, senderDomain: baseline.senderDomain, linksFound: baseline.linksFound };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/analyze") {
      const message = await parseBody(req);
      if (!message.body?.trim()) return send(res, 400, { error: "Paste a message to analyze." });
      const clean = { sender: String(message.sender || "").slice(0, 300), subject: String(message.subject || "").slice(0, 500), body: String(message.body).slice(0, 15000) };
      const baseline = analyzeLocally(clean);
      if (!process.env.OPENAI_API_KEY) return send(res, 200, baseline);
      try { return send(res, 200, await aiAnalysis(clean, baseline)); }
      catch (error) { return send(res, 200, { ...baseline, engine: "Local fallback", note: error.message }); }
    }

    if (req.method === "GET" && req.url === "/api/health") return send(res, 200, { ok: true, aiEnabled: Boolean(process.env.OPENAI_API_KEY) });
    if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" });

    const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const filePath = normalize(join(publicDir, requestPath));
    if (!filePath.startsWith(publicDir)) return send(res, 403, { error: "Forbidden" });
    const file = await readFile(filePath);
    send(res, 200, file, types[extname(filePath)] || "application/octet-stream");
  } catch (error) {
    send(res, error.code === "ENOENT" ? 404 : 500, { error: error.code === "ENOENT" ? "Not found" : error.message });
  }
});

server.listen(port, () => console.log(`SignalShield running at http://localhost:${port}`));
