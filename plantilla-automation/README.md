# Plantilla de automation: Playwright + Page Object Model

> **Para qué sirve:** es un proyecto listo para copiar y usar como base de la automatización de pruebas de front y de API. Trae Playwright, TypeScript, Page Object Model (POM), fixtures, sesión guardada, ambientes, lint, formato, un pipeline de GitHub Actions y reglas de Kiro.
> **Quién lo usa:** QA que automatiza y personas que quieren aprender el patrón POM con un ejemplo que corre.
> **Cuándo se usa:** al arrancar la automatización de un producto nuevo, o como referencia al revisar tests existentes.

El ejemplo prueba el sitio demo público **SauceDemo** (https://www.saucedemo.com/), una tienda online de práctica con login, catálogo, carrito y checkout, y la API pública de práctica https://jsonplaceholder.typicode.com. Es el mismo producto ("Tienda Demo") que se describe en `04-funcionalidades/` del playbook. La guía completa, con el porqué de cada decisión, está en [`../03-qa-automatizacion/guia-plantilla-automation.md`](../03-qa-automatizacion/guia-plantilla-automation.md). Para llevarla a un proyecto propio, seguí [`../00-introduccion/adaptar-a-un-proyecto-nuevo.md`](../00-introduccion/adaptar-a-un-proyecto-nuevo.md).

## Qué es cada cosa (glosario rápido)

| Término                      | Qué significa                                                                                                      |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Playwright**               | Herramienta de Microsoft que controla un navegador por código para probar una aplicación web                       |
| **POM** (Page Object Model)  | Patrón que crea una clase por pantalla con sus elementos y acciones; los tests usan esas clases                    |
| **Spec**                     | Archivo de tests (`*.spec.ts`)                                                                                     |
| **Locator**                  | Forma de encontrar un elemento de la pantalla (por ejemplo `[data-test="login-button"]`)                           |
| **Aserción**                 | Comprobación del resultado esperado (`expect(...)`)                                                                |
| **Fixture**                  | Objeto que el test recibe ya armado, como `page`. Acá, los Page Objects (ver `fixtures/index.ts`)                  |
| **storageState**             | Archivo con la sesión guardada (cookies) para no repetir el login en cada test                                     |
| **Proyecto** (de Playwright) | Combinación de "qué tests" y "con qué configuración" (navegador, sesión, URL). Se define en `playwright.config.ts` |
| **E2E**                      | _End to end_: prueba que recorre un flujo completo de punta a punta                                                |
| **CI**                       | Integración continua: correr los tests automáticamente en cada cambio (acá, GitHub Actions)                        |

## Estructura

```text
plantilla-automation/
├── README.md                    Este archivo
├── package.json                 Dependencias y atajos de comandos (npm run ...)
├── package-lock.json            Versiones exactas de las dependencias
├── tsconfig.json                Configuración de TypeScript (solo para revisar tipos)
├── playwright.config.ts         Configuración de Playwright: proyectos, navegadores, reportes, URL base
├── eslint.config.mjs            Reglas de calidad de código (sin esperas fijas, sin test.only...)
├── .prettierrc.json             Reglas de formato del código (comillas simples, 100 columnas)
├── .prettierignore              Archivos que Prettier no formatea
├── .env.example                 Modelo de variables de entorno (copiar a .env)
├── .gitignore                   Archivos que no se suben al repositorio
├── .github/workflows/
│   └── playwright.yml           Pipeline de CI para cuando la plantilla es su propio repositorio
├── .kiro/steering/
│   ├── pw-proyecto.md           Reglas y convenciones del proyecto para Kiro
│   └── pw-code-review.md        Checklist de revisión de Pull Requests
├── config/
│   ├── ambientes.ts             URLs por ambiente (demo, qa, pre) y bloqueo de producción
│   └── sesion.ts                Ruta del archivo de sesión guardada
├── data/
│   ├── usuarios.ts              Usuarios de prueba (del sitio demo, públicos)
│   └── comprador.ts             Datos ficticios del comprador para el checkout
├── pages/                       Page Objects: una clase por pantalla
│   ├── BasePage.ts              Clase base que comparten todas las pantallas
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── api/
│   └── UsuariosApi.ts           Cliente de la API (el "Page Object" de la API)
├── fixtures/
│   └── index.ts                 Page Objects listos para usar en los tests
├── utils/
│   └── evidencia.ts             Guarda capturas en evidencias/<ID-HISTORIA>/
├── tests/
│   ├── auth.setup.ts            Inicia sesión una vez y guarda la sesión (no es un test de negocio)
│   ├── sin-sesion/              Tests que arrancan sin usuario autenticado
│   │   ├── login.spec.ts        5 casos: 1 positivo y 4 negativos
│   │   └── compra.spec.ts       1 caso E2E de compra completa, con evidencia
│   ├── con-sesion/              Tests que arrancan con la sesión ya iniciada
│   │   ├── carrito.spec.ts      3 casos: agregar, ver y quitar
│   │   └── checkout.spec.ts     4 casos: 3 campos requeridos y el resumen
│   └── api/
│       └── usuarios.api.spec.ts 3 casos de API: lista, usuario existente e inexistente
└── evidencias/                  Capturas por historia: evidencias/<ID-HISTORIA>/
```

## Requisitos

- **Node.js** 18 o superior (recomendado la versión LTS). Se verifica con `node -v`.
- **Git** para clonar el repositorio.
- Acceso a internet (el ejemplo prueba sitios públicos).

## Primera vez: instalación y primera corrida

```bash
# 1. Instalar las dependencias exactas del proyecto
npm ci

# 2. Descargar los navegadores que usa Playwright (una sola vez por equipo)
npx playwright install

# 3. (Opcional) Crear tu archivo de variables de entorno
cp .env.example .env          # en Windows PowerShell: Copy-Item .env.example .env

# 4. Correr todos los tests
npx playwright test

# 5. Abrir el reporte HTML de la corrida
npx playwright show-report
```

Resultado esperado: 17 tests pasan (1 de preparación de sesión, 13 de web y 3 de API) en unos 15 segundos.

## Comandos más usados

| Comando                                              | Para qué sirve                                                            |
| :--------------------------------------------------- | :------------------------------------------------------------------------ |
| `npx playwright test`                                | Corre todos los tests (sin ver el navegador)                              |
| `npx playwright test --headed`                       | Corre viendo el navegador                                                 |
| `npx playwright test --ui`                           | Modo interactivo: elegís tests, ves cada paso y los volvés a correr       |
| `npx playwright test tests/sin-sesion/login.spec.ts` | Corre un solo archivo                                                     |
| `npx playwright test -g "CP02"`                      | Corre solo los tests cuyo título contiene "CP02"                          |
| `npx playwright test --project=api`                  | Corre solo los tests de API                                               |
| `npx playwright test --project=chromium-con-sesion`  | Corre solo los tests con sesión en Chromium                               |
| `npx playwright test --debug`                        | Corre paso a paso con el inspector                                        |
| `npx playwright show-report`                         | Abre el último reporte HTML                                               |
| `npm run verificar`                                  | Revisa tipos (`tsc`), reglas (`eslint`) y formato (`prettier`) de una vez |
| `npm run format`                                     | Da formato al código con Prettier                                         |

Los atajos de `package.json` son: `npm test`, `npm run test:headed`, `npm run test:ui`, `npm run test:web`, `npm run test:api`, `npm run test:login`, `npm run report`, `npm run typecheck`, `npm run lint`, `npm run format`, `npm run format:check` y `npm run verificar`.

## Variables de entorno

Se leen de un archivo `.env` (que no se sube al repositorio) o del entorno del CI. Todas son opcionales.

| Variable           | Valor por defecto | Para qué sirve                                                                               |
| :----------------- | :---------------- | :------------------------------------------------------------------------------------------- |
| `TEST_ENV`         | `demo`            | Ambiente a probar: `demo`, `qa` o `pre`. `prod` corta la ejecución                           |
| `BASE_URL`         | la del ambiente   | URL de la aplicación web. Pisa a la de `TEST_ENV`                                            |
| `API_URL`          | la del ambiente   | URL de la API. Pisa a la de `TEST_ENV`                                                       |
| `HOSTS_BLOQUEADOS` | vacío             | Textos que no pueden aparecer en las URLs (hosts de producción), separados por comas         |
| `BROWSERS`         | `chromium`        | Navegadores separados por comas: `chromium`, `firefox`, `webkit`, `movil`                    |
| `HEADLESS`         | `true`            | `false` para ver el navegador                                                                |
| `SLOW_MO`          | `0`               | Pausa en milisegundos entre acciones, solo para demostraciones (por ejemplo `700`)           |
| `BROWSER_CHANNEL`  | vacío             | `msedge` o `chrome` para usar el navegador instalado en tu equipo (solo afecta a `chromium`) |
| `QA_USER`          | `standard_user`   | Usuario de prueba                                                                            |
| `QA_PASSWORD`      | `secret_sauce`    | Clave de prueba                                                                              |

> **Nota de seguridad:** `standard_user` y `secret_sauce` son las credenciales públicas del sitio demo, no son secretos. En un proyecto real las credenciales se piden al equipo, se guardan en `.env` (ignorado por Git) o en los secretos del CI, y nunca se escriben en el código.

## Cómo leer un test

```ts
// 1. "test" y "expect" vienen de fixtures/: el test ya recibe los Page Objects armados
import { test, expect } from '../../fixtures';
import { USUARIOS } from '../../data/usuarios';

// 2. El título lleva el ID del caso de prueba
test('PROJ-101-CP01 - Login exitoso con usuario válido', async ({ loginPage, page }) => {
  await loginPage.navigate(); // 3. Acciones: las define el Page Object
  await loginPage.login(USUARIOS.estandar.username, USUARIOS.estandar.password);
  await expect(page).toHaveURL(/inventory\.html/); // 4. El resultado esperado lo define el test
});
```

Para ver la forma equivalente sin fixtures (con `new LoginPage(page)`), leé `tests/sin-sesion/compra.spec.ts`.

## Cómo adaptarla a tu proyecto

La lista completa y ordenada está en [`../00-introduccion/adaptar-a-un-proyecto-nuevo.md`](../00-introduccion/adaptar-a-un-proyecto-nuevo.md). En resumen:

1. **Copiá la carpeta** a un repositorio nuevo (la carpeta `.github/` tiene que quedar en la raíz del repositorio).
2. **Cargá las URLs reales** en `config/ambientes.ts` (`qa`, `pre`) y definí `HOSTS_BLOQUEADOS` con los hosts de producción.
3. **Reemplazá los Page Objects** de `pages/` por los de tus pantallas, conservando el estilo de `LoginPage.ts`, y registralos en `fixtures/index.ts`.
4. **Reemplazá los tests** de `tests/` conservando la convención `<ID-HISTORIA>-CP<NN> - <qué se prueba>` y los casos negativos y de borde.
5. **Reemplazá los datos** de `data/` por usuarios de prueba de tu ambiente, pasados por variables de entorno.
6. **Ajustá el nombre del proyecto** en `package.json` y las claves `PROJ` / `AUTO` por las de tu proyecto en Jira.
7. **Cargá `QA_USER` y `QA_PASSWORD`** como secretos del repositorio en GitHub (Settings, Secrets and variables, Actions) y descomentá las líneas del workflow.

## Problemas frecuentes

| Síntoma                                       | Causa probable                                       | Qué hacer                                                                                                                      |
| :-------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `Executable doesn't exist` al correr          | No se descargaron los navegadores                    | `npx playwright install`                                                                                                       |
| `Chromium distribution 'msedge' is not found` | `BROWSER_CHANNEL=msedge` pero Edge no está instalado | Vaciar `BROWSER_CHANNEL` o instalar el navegador                                                                               |
| `TEST_ENV apunta a producción`                | Se pidió `TEST_ENV=prod`                             | Usar `qa`, `pre` o `demo`. Las pruebas nunca corren en producción                                                              |
| `BROWSERS contiene "x", que no existe`        | Error de tipeo en la lista de navegadores            | Usar `chromium`, `firefox`, `webkit` o `movil`                                                                                 |
| Los tests con sesión fallan todos             | Falló `tests/auth.setup.ts` (el login)               | Mirar el error del proyecto `setup` en el reporte: usuario, clave o URL incorrectos                                            |
| Error de certificado en un ambiente interno   | El ambiente usa una CA interna                       | Pedir el certificado raíz a infraestructura. Solo para QA y con acuerdo del equipo, agregar `ignoreHTTPSErrors: true` en `use` |
| Un test pasa solo a veces                     | Dependencia entre tests o dato compartido            | Hacer cada test independiente, con su propia precondición                                                                      |
| `Cannot find module 'dotenv'`                 | Falta instalar dependencias                          | `npm ci`                                                                                                                       |
| Fallan los tests de API                       | La API pública de práctica no responde o no hay red  | Reintentar. En un proyecto real, apuntar `API_URL` a la API de tu ambiente de QA                                               |
