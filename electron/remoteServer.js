// Servidor HTTP + WebSocket embutido no Electron main.
// Serve a UI mobile (dist-mobile/) e aceita conexões WS para comando/estado.
// Escopo: apenas LAN (sem autenticação). O usuário pareia via QR code.

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { WebSocketServer } = require('ws');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function getLocalIPv4() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function serveStatic(req, res, rootDir) {
  // Normaliza URL, remove query string
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  const filePath = path.join(rootDir, urlPath);

  // Proteção contra traversal (?/../)
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: qualquer rota não-encontrada → index.html
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(rootDir, 'index.html'), (err2, fallback) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallback);
          }
        });
        return;
      }
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

/**
 * Inicia servidor HTTP + WS.
 * @param {object} opts
 * @param {number} opts.port
 * @param {string} opts.staticDir — pasta com build mobile (dist-mobile)
 * @param {(cmd: object) => void} opts.onCommand — callback recebendo comandos do celular
 */
function startRemoteServer({ port, staticDir, onCommand }) {
  const server = http.createServer((req, res) => serveStatic(req, res, staticDir));
  const wss = new WebSocketServer({ server, path: '/ws' });

  const clients = new Set();
  let lastState = null; // guardamos pra enviar ao novo cliente quando ele conecta

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`[remote] client connected (${clients.size} total)`);

    // Enviar estado atual pro novo cliente, se tivermos
    if (lastState) {
      try {
        ws.send(JSON.stringify({ type: 'state', payload: lastState }));
      } catch (e) {
        console.error('[remote] failed to send initial state:', e);
      }
    }

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg && msg.type === 'command' && msg.payload) {
          onCommand && onCommand(msg.payload);
        } else if (msg && msg.type === 'ping') {
          // responde pong pra manter conexão viva (alguns proxies derrubam idle)
          try {
            ws.send(JSON.stringify({ type: 'pong' }));
          } catch {}
        }
      } catch (e) {
        console.error('[remote] invalid message:', e);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`[remote] client disconnected (${clients.size} left)`);
    });

    ws.on('error', (err) => {
      console.error('[remote] ws error:', err);
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '0.0.0.0', () => {
      const ip = getLocalIPv4();
      const url = `http://${ip}:${port}`;
      console.log(`[remote] server ready at ${url}`);
      resolve({
        url,
        port,
        broadcast: (state) => {
          lastState = state;
          const payload = JSON.stringify({ type: 'state', payload: state });
          for (const ws of clients) {
            if (ws.readyState === 1) {
              try { ws.send(payload); } catch {}
            }
          }
        },
        getClientCount: () => clients.size,
        stop: () => {
          for (const ws of clients) {
            try { ws.close(); } catch {}
          }
          clients.clear();
          wss.close();
          server.close();
        },
      });
    });
  });
}

module.exports = { startRemoteServer };
