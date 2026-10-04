// Server senza dipendenze: serve la pagina e fa da proxy con cache verso i dati ufficiali del TSE.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ELECTION = process.env.TSE_ELECTION || '6257'; // Presidente, 1º turno 2026 (vedi ele-c.json)
const CYCLE = process.env.TSE_CYCLE || 'ele2026';
const TTL_MS = 15000;
const BASE = `https://resultados.tse.jus.br/oficial/${CYCLE}/${ELECTION}/dados`;
const UFS = new Set('ac al am ap ba ce df es go ma mg ms mt pa pb pe pi pr rj rn ro rr rs sc se sp to zz br'.split(' '));

const cache = new Map();
async function tse(uf) {
  const hit = cache.get(uf);
  if (hit && Date.now() - hit.t < TTL_MS) return hit.body;
  const url = `${BASE}/${uf}/${uf}-c0001-e00${ELECTION}-u.json`;
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 eleicoes-brasil' } });
  if (!r.ok) throw new Error(`TSE ${r.status}`);
  const body = await r.text();
  cache.set(uf, { t: Date.now(), body });
  return body;
}

const send = (res, code, type, body) => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  const m = pathname.match(/^\/api\/(\w\w)$/);
  if (m) {
    if (!UFS.has(m[1])) return send(res, 404, 'application/json', '{"error":"uf"}');
    try { return send(res, 200, 'application/json; charset=utf-8', await tse(m[1])); }
    catch (e) { return send(res, 502, 'application/json', JSON.stringify({ error: e.message })); }
  }
  const file = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(path.join(__dirname, 'public'))) return send(res, 403, 'text/plain', 'no');
  fs.readFile(file, (err, data) => err ? send(res, 404, 'text/plain', 'not found')
    : send(res, 200, file.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream', data));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
