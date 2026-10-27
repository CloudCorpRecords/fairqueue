'use strict';
/** Zero-dependency static server. Run: node server.js  (then open http://localhost:5173) */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.md': 'text/plain; charset=utf-8', '.png': 'image/png' };

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('FairQueue prototype running at http://localhost:' + PORT));
