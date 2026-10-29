import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const paths = ['/', '/coleccion?tipo=Tinto', '/vino/gran-reserva', '/vino/desconocido', '/catas', '/club', '/nosotros', '/contacto', '/checkout/datos', '/checkout/entrega', '/checkout/pago', '/pedido-confirmado', '/carrito-vacio', '/ruta-no-existente'];
const baseUrl = 'http://127.0.0.1:4179';
const stripAnsi = value => value.replace(/\u001B\[[0-9;]*m/g, '');
const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4179', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
try {
  await new Promise((resolve, reject) => {
    let output = '';
    let poll;
    const timer = setTimeout(() => settle(reject, new Error('Preview did not start')), 12000);
    const settle = (fn, value) => {
      clearTimeout(timer);
      clearInterval(poll);
      child.stdout.off('data', watch);
      child.stderr.off('data', watch);
      fn(value);
    };
    const ready = () => settle(resolve);
    const watch = chunk => {
      output += stripAnsi(chunk.toString());
      if (output.includes('127.0.0.1:4179')) ready();
      else if (output.includes('already in use') || output.includes('EADDRINUSE')) settle(reject, new Error('Port 4179 occupied'));
    };
    child.once('error', error => settle(reject, error));
    child.once('exit', code => settle(reject, new Error(`Preview exited: ${code}`)));
    child.stdout.on('data', watch);
    child.stderr.on('data', watch);
    // La salida de Vite puede llegar partida o con formato; sondear la URL evita depender del texto.
    poll = setInterval(async () => {
      try {
        const response = await fetch(baseUrl);
        if (response.ok) ready();
      } catch { /* el servidor aún no escucha */ }
    }, 250);
  });
  const results = [];
  for (const path of paths) {
    const response = await fetch(`http://127.0.0.1:4179${path}`);
    const html = await response.text();
    if (!response.ok || !html.includes('<div id="root">')) throw new Error(`SPA fallback failed for ${path}`);
    results.push({ path, status: response.status, check: 'SPA HTML delivered; client route behavior not executed.' });
  }
  const model = await fetch('http://127.0.0.1:4179/models/terruno-bottle.glb');
  const binary = Buffer.from(await model.arrayBuffer());
  if (!model.ok || binary.readUInt32LE(0) !== 0x46546c67) throw new Error('Model was not served as GLB');
  const poster = await fetch('http://127.0.0.1:4179/images/terruno-bottle.webp');
  if (!poster.ok || !poster.headers.get('content-type')?.includes('webp')) throw new Error('Bottle poster missing');
  const report = { generatedAt: new Date().toISOString(), checks: results, modelBytes: binary.length, posterStatus: poster.status, browserExecuted: false };
  await fs.writeFile('docs/http-report.json', JSON.stringify(report, null, 2));
  console.log(`${results.length} SPA HTTP paths, GLB and WebP served correctly. No browser or screenshot used.`);
} finally { child.kill(); }
