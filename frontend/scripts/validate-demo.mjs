import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const read = name => JSON.parse(fs.readFileSync(path.resolve('src/assets/data',name),'utf8'));
const context=read('context.json');
const sectors=read('sectors.json').sectors;
const series=read('series.json');
const inspections=read('inspections.json');
const reports=read('reports.json');
assert.equal(context.demo,true);
assert.equal(context.source,'DATOS SINTÉTICOS PARA PROTOTIPO');
assert.ok(sectors.length>=3);
assert.equal(new Set(sectors.map(s=>s.code)).size,sectors.length);
assert.ok(sectors.every(s=>Number.isFinite(s.risk)&&s.risk>=0&&s.risk<=100));
const totalArea=sectors.reduce((a,s)=>a+s.areaHa,0);
const average=sectors.reduce((a,s)=>a+s.areaHa*s.risk,0)/totalArea;
assert.ok(Math.abs(average-context.globalRisk)<0.06,'Riesgo global incoherente con superficies');
assert.equal(series.months.length,4);
for(const s of sectors){
  const row=series.sectors[s.code];
  assert.ok(row,'Falta serie: '+s.code);
  for(const field of ['risk','ironOxides','ndvi','ndwi']){
    assert.equal(row[field].length,4);
    assert.ok(row[field].every(Number.isFinite));
  }
  assert.equal(row.risk[3],s.risk);
}
for(const route of inspections.routes){
  for(const code of route.sectorCodes)assert.ok(sectors.some(s=>s.code===code));
}
for(const report of reports.reports)assert.ok(sectors.some(s=>s.code===report.sectorCode));
const rootConfig=JSON.parse(fs.readFileSync('../vercel.json','utf8'));
const frontendConfig=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const angular=JSON.parse(fs.readFileSync('angular.json','utf8'));
const output=angular.projects['dartrace-frontend'].architect.build.options.outputPath;
assert.equal(rootConfig.outputDirectory,`frontend/${output}/browser`);
assert.equal(frontendConfig.outputDirectory,`${output}/browser`);
assert.deepEqual(rootConfig.routes,frontendConfig.routes);
assert.equal(rootConfig.routes[0].handle,'filesystem');
assert.equal(frontendConfig.routes[1].dest,'/index.html');
const component=fs.readFileSync('src/app/stitch-page.component.ts','utf8');
assert.ok(component.includes('this.demoService.data$'));
assert.ok(component.includes('this.bindDemoData()'));
console.log(`OK: ${sectors.length} sectores, 4 meses y archivos de Vercel validados.`);
