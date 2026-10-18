# DAR-Trace AI

Repositorio previsto para frontend Angular y backend FastAPI.

## Estado de esta entrega

Solo se incorpora el **frontend** en [`frontend/`](./frontend/). El backend FastAPI se implementará en una etapa posterior.

```bash
cd frontend
npm install
npm start
```

Consultar [`frontend/README.md`](./frontend/README.md) para rutas, alcance, limitaciones de demostración e integración futura.
## Prototipo desplegable en Vercel
El repositorio incluye configuraciones para Vercel con Root Directory en la raíz (`/vercel.json`) o en `frontend` (`/frontend/vercel.json`). Utilizar Framework Preset **Other** si se solicita. La compilación se publica desde `dist/dartrace-frontend/browser` y dispone de fallback SPA.

Los datos actuales provienen de los archivos JSON sintéticos de `frontend/src/assets/data/`, no de una API ni de análisis ambientales reales. La autenticación, mapas operativos y exportaciones requieren el futuro backend FastAPI.

### Pruebas
```bash
cd frontend
npm install
npm test
npm run build:production
```

Las advertencias de npm sobre `cache-dir`, `uuid` e `install-scripts` no son errores de compilación por sí mismas.
