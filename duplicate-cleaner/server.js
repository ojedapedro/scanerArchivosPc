// Servidor HTTP local estático con cero dependencias externas (usa solo módulos nativos de Node.js)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // Manejo de URL limpia y decode
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  // Seguridad: evitar path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Acceso denegado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    // Si no existe, fallback a index.html para soporte SPA
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Headers de seguridad y caché
    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    };

    if (ext === '.html' || ext === '.webmanifest') {
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Error interno del servidor');
        return;
      }
      res.writeHead(200, headers);
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(`  🚀 DuplicateCleaner - Servidor Local Listo`);
  console.log(`  📡 URL: ${url}`);
  console.log(`  🔒 100% Offline y Privado`);
  console.log(`  💡 Abre en Chrome o Edge para compatibilidad completa`);
  console.log(`======================================================\n`);

  // Intentar abrir el navegador automáticamente según SO
  const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                   process.platform === 'darwin' ? `open "${url}"` :
                   `xdg-open "${url}"`;
  exec(startCmd, () => {});
});
