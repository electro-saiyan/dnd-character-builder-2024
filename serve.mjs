// Minimal static file server (no dependencies): node serve.mjs [port]
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2]) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
};

http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.normalize(path.join(root, urlPath === "/" ? "index.html" : urlPath));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
