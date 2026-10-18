import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const folder = path.resolve('src/assets/stitch');
const screens = ['landing','login','registro','recuperar-acceso','panel-general','sectores-priorizados','rutas-de-inspeccion','analisis-temporal','informes','configuracion','perfil'];
for (const screen of screens) {
  const file = path.join(folder, `${screen}.html`);
  assert.ok(fs.existsSync(file), `Vista faltante: ${file}`);
  const html = fs.readFileSync(file,'utf8');
  assert.ok(html.length > 2500, `Vista incompleta: ${screen}`);
  assert.doesNotMatch(html,/<script\b/i, `La vista ${screen} contiene scripts ejecutables`);
  assert.doesNotMatch(html, /\s+on[a-z]+\s*=/i, `La vista ${screen} tiene handlers inline`);
  assert.doesNotMatch(html, /(?:AIza[0-9A-Za-z_-]{15,}|pk\.ey[A-Za-z0-9._-]{20,})/, `La vista ${screen} contiene posibles credenciales`);
}
const routes = fs.readFileSync('src/app/app.routes.ts','utf8');
for(const screen of screens)assert.ok(routes.includes(`screen:'${screen}'`), `Ruta no encontrada: ${screen}`);
const component = fs.readFileSync('src/app/stitch-page.component.ts','utf8');
assert.ok(component.includes('handleSubmit') && component.includes('handleClick'),'No hay interacciones de frontend');
console.log(`OK: ${screens.length} vistas principales, rutas y sanitización de eventos verificadas.`);