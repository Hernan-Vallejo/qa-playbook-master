// =============================================================================
// playwright.config.ts - Configuración general de Playwright
// =============================================================================
// Este archivo le dice a Playwright DÓNDE están los tests, EN QUÉ NAVEGADOR correrlos y CÓMO
// comportarse (reintentos, capturas, reportes).
//
// Los valores salen de variables de entorno (ver .env.example) para que el mismo código sirva en
// tu equipo (con navegador visible) y en el CI (sin ventana).
//
// Conceptos clave que se usan acá:
//   - PROYECTO ("project"): una combinación de "qué tests" + "con qué configuración". Un mismo
//     test puede correr en varios proyectos (por ejemplo, en Chromium y en Firefox).
//   - SETUP: un proyecto que corre antes y prepara algo (acá, la sesión iniciada).
//   - storageState: archivo con la sesión guardada (cookies) para no repetir el login.
// =============================================================================

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { resolverAmbiente } from './config/ambientes';
import { RUTA_SESION } from './config/sesion';

// Carga las variables del archivo ".env" (si existe) en process.env.
// Si no existe el archivo, no pasa nada: se usan los valores por defecto.
dotenv.config();

// Ambiente a probar (URL web y URL de API). Lanza un error si se apunta a producción.
const ambiente = resolverAmbiente();

// "process.env.CI" lo define automáticamente GitHub Actions (y la mayoría de los CI).
// Lo usamos para endurecer el comportamiento cuando corre en integración continua.
const esCI = !!process.env.CI;

// -----------------------------------------------------------------------------
// Navegadores y dispositivos
// -----------------------------------------------------------------------------
// Variable BROWSERS: lista separada por comas. Valores posibles:
//   chromium (por defecto), firefox, webkit (motor de Safari) y movil (emula un teléfono Pixel 5).
// Ejemplos: BROWSERS=chromium            -> solo Chromium
//           BROWSERS=chromium,firefox    -> los tests corren dos veces, una por navegador
const navegadores = (process.env.BROWSERS ?? 'chromium')
  .split(',')
  .map((nombre) => nombre.trim())
  .filter((nombre) => nombre.length > 0);

// Configuración de cada navegador. "devices" trae tamaños de pantalla y agentes de usuario ya definidos.
// Para sumar una resolución propia (por ejemplo 360x640), agregá una entrada con "viewport".
const DISPOSITIVOS: Record<string, object> = {
  chromium: {
    ...devices['Desktop Chrome'],
    // BROWSER_CHANNEL (opcional): usa un navegador instalado en tu equipo, por ejemplo "msedge" o "chrome".
    // Vacío = el Chromium que descarga Playwright.
    channel: process.env.BROWSER_CHANNEL || undefined,
  },
  firefox: { ...devices['Desktop Firefox'] },
  webkit: { ...devices['Desktop Safari'] },
  movil: { ...devices['Pixel 5'] },
};

// Valida los nombres antes de usarlos, para dar un mensaje claro si hay un error de tipeo.
for (const nombre of navegadores) {
  if (!(nombre in DISPOSITIVOS)) {
    throw new Error(
      `BROWSERS contiene "${nombre}", que no existe. Valores posibles: ${Object.keys(DISPOSITIVOS).join(', ')}.`,
    );
  }
}

export default defineConfig({
  // Carpeta donde están los tests. Playwright ejecuta todos los archivos *.spec.ts y *.setup.ts.
  testDir: './tests',

  // Tiempo máximo de cada test (en milisegundos). Si se pasa, el test falla.
  timeout: 30_000,

  // Aserciones "expect": cuánto esperar a que se cumpla una condición. Playwright reintenta la
  // aserción hasta que se cumple o se agota este tiempo, por eso NO hacen falta esperas fijas.
  expect: {
    timeout: 5_000,
  },

  // Corre en paralelo los tests de archivos distintos. Cada test tiene su propio navegador limpio,
  // por eso los tests deben ser independientes entre sí.
  fullyParallel: true,

  // En CI, falla si alguien dejó un "test.only" olvidado (evita que se omitan tests sin darse cuenta).
  forbidOnly: esCI,

  // Reintentos ante fallos: 0 en tu equipo (querés ver el fallo enseguida), 2 en CI (tolera fallos de red puntuales).
  retries: esCI ? 2 : 0,

  // Procesos en paralelo. En CI se usa 1 para resultados más estables; en tu equipo, el valor por defecto.
  workers: esCI ? 1 : undefined,

  // Reportes: "list" imprime una línea por test en la consola; "html" genera la carpeta playwright-report/
  // (se abre con: npx playwright show-report). "open: never" evita que se abra solo el navegador.
  reporter: [['list'], ['html', { open: 'never' }]],

  // Opciones comunes a TODOS los proyectos.
  use: {
    // URL base de la aplicación web. Con esto, en los Page Objects alcanza con goto('/').
    baseURL: ambiente.web,

    // headless = true: sin ventana (CI). headless = false: se ve el navegador (depuración local).
    // Solo es "false" si HEADLESS vale exactamente "false".
    headless: process.env.HEADLESS !== 'false',

    // Pausa (en milisegundos) entre cada acción. 0 = velocidad normal. Útil solo para demostraciones.
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO ?? 0),
    },

    // Guarda una captura de pantalla automáticamente cuando un test falla (queda en test-results/).
    screenshot: 'only-on-failure',

    // Guarda un "trace" (grabación paso a paso con DOM, red y consola) en el primer reintento de un test fallido.
    // Se abre con: npx playwright show-trace <archivo.zip>
    trace: 'on-first-retry',
  },

  // ---------------------------------------------------------------------------
  // Proyectos
  // ---------------------------------------------------------------------------
  projects: [
    // 1. SETUP: inicia sesión una vez y guarda la sesión en RUTA_SESION. No es un test de negocio.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. API: pruebas sin navegador. Usan la URL de la API en lugar de la web.
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: { baseURL: ambiente.api },
    },

    // 3. Por cada navegador pedido en BROWSERS se crean dos proyectos:
    ...navegadores.flatMap((nombre) => [
      // 3a. Tests que arrancan SIN sesión (el login y los flujos que lo incluyen).
      {
        name: `${nombre}-sin-sesion`,
        testDir: './tests/sin-sesion',
        use: { ...DISPOSITIVOS[nombre] },
      },
      // 3b. Tests que arrancan CON la sesión ya iniciada. "dependencies" hace que el setup corra antes.
      {
        name: `${nombre}-con-sesion`,
        testDir: './tests/con-sesion',
        dependencies: ['setup'],
        use: { ...DISPOSITIVOS[nombre], storageState: RUTA_SESION },
      },
    ]),
  ],
});
