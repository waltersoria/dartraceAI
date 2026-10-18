# DAR-Trace AI — Frontend

Frontend de DAR-Trace AI basado en las pantallas exportadas de Google Stitch. Aplicación **Angular 20 + TypeScript + Tailwind CSS 3**, preparada para conectarse posteriormente a un backend en FastAPI.

> **Estado:** prototipo funcional de interfaz. Los valores, mapas, sectores, fechas, nombres de faenas, alertas y resultados de las capturas de Stitch son **datos de demostración**. No deben interpretarse como resultados reales de análisis ambiental.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+, npm e Internet para instalar las dependencias inicialmente.

```bash
cd frontend
npm install
npm start
```

Abrir `http://localhost:4200`.

Compilar:

```bash
npm run build:production
```

Validación de archivos/rutas de Stitch:

```bash
npm test
```

No se pudo ejecutar `ng build` durante la preparación porque este entorno no dispone de las dependencias de Angular y no tiene acceso al registro de npm. Se verificaron la sintaxis TypeScript y los archivos/rutas mediante pruebas estáticas.

## Rutas

| Ruta | Vista Stitch |
|---|---|
| `/` | Landing page |
| `/login` | Acceso |
| `/registro` | Registro |
| `/recuperar-acceso` | Recuperación |
| `/app/panel-general` | Panel general |
| `/app/sectores-priorizados` | Sectores priorizados |
| `/app/rutas-de-inspeccion` | Rutas de inspección |
| `/app/analisis-temporal` | Análisis temporal |
| `/app/informes` | Informes |
| `/app/configuracion` | Configuración |
| `/app/perfil` | Perfil |

## Organización

```text
frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── stitch-page.component.ts
│   │   └── services/api.service.ts
│   ├── assets/
│   │   ├── media/dartrace-logo.svg
│   │   └── stitch/*.html
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── design-reference/*.png
├── scripts/validate-screens.mjs
├── tailwind.config.cjs
├── package.json
└── angular.json
```

Las vistas originales se trasladaron a archivos HTML estáticos con su estructura visual intacta. Se eliminaron scripts y manejadores de eventos inline de Stitch. La navegación, interacción con pestañas, cambio de modo de rutas, resaltado de sectores, formularios y notificaciones se gestionan en `stitch-page.component.ts`.

## Alcance y seguridad

- El formulario de **acceso** permite abrir el dashboard como **demostración visual sin autenticar**; no hay sesiones reales, tokens ni permisos.
- El registro, la recuperación de contraseña, el almacenamiento de API keys, las exportaciones, la generación de informes y la ejecución de inspecciones requieren endpoints reales. El frontend informa explícitamente que esas acciones están pendientes de conexión.
- El mapa y los gráficos actuales representan el diseño de Stitch; cambiar de capa selecciona la visualización de interfaz, pero no consulta datos de Sentinel, índices científicos ni servicios GIS.
- No guardar contraseñas ni llaves LLM/cartográficas en localStorage, en el repositorio o en el frontend empaquetado. Esas credenciales deben quedar resguardadas en FastAPI o un gestor de secretos.
- Las imágenes remotas procedentes de Stitch pueden necesitar sustitución por activos propios si dejan de estar disponibles. El logotipo local es un SVG sencillo independiente de esas URL.
- `src/app/services/api.service.ts` define un servicio HTTP tipado con prefijo `/api/v1`, sin realizar llamadas hasta que FastAPI esté listo. Para desarrollo, configurar un proxy de Angular hacia el backend cuando exista.
- **AngularJS 1.x** está fuera de soporte; se utiliza Angular moderno, el framework mantenido, para un proyecto nuevo.

## Integración futura con FastAPI

Implementar una API versionada en `/api/v1`, definir contrato OpenAPI y reemplazar cada comportamiento de demostración por las llamadas correspondientes (autenticación, proyectos, índices, sectores, archivos, rutas, informes). Reemplazar las vistas exportadas por componentes Angular tipados por módulo a medida que se implemente lógica real; en esta entrega se ha priorizado conservar la fidelidad de Stitch y habilitar la navegación completa.

La cabecera o nombres de proyectos incluidos en Stitch se conservan como datos de diseño, no están respaldados por una base de datos real.