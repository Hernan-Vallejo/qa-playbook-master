# Repositorios y Frameworks de Automatización

> **Para qué sirve:** explicar con qué repositorios y frameworks se automatiza en este playbook: la plantilla `plantilla-automation` (incluida) y los frameworks opcionales que un equipo puede sumar (Karate, mobile, k6), con criterios para elegir cada uno.
> **Quién lo usa:** QA Automation y QA Funcional que quieren saber dónde se implementa cada tipo de prueba, y líderes de QA que deciden qué frameworks adoptar.
> **Cuándo se usa:** al empezar a automatizar, al derivar un caso de prueba al framework correcto (paso 3 de [proceso-automatizacion.md](./proceso-automatizacion.md)) y al evaluar sumar un framework nuevo.

> **Nota:** en este documento "la empresa" es una organización genérica (Acme). El producto bajo prueba de los ejemplos es **Tienda Demo**, una tienda online con login, catálogo, carrito y checkout, inspirada en el sitio demo público https://www.saucedemo.com/.

## Resumen general

El playbook trabaja con dos repositorios de QA:

| Repositorio | Qué es | Incluido |
| :--- | :--- | :--- |
| `qa-playbook` | Este repositorio: procesos, estándares, agentes, skills y steering de Kiro | Sí |
| `plantilla-automation` | Plantilla de automatización web con Playwright + Page Object Model, lista para copiar y usar | Sí |

Además, un equipo puede sumar otros frameworks según su necesidad. **No están incluidos en esta plantilla**: se describen para que el equipo sepa cuándo conviene cada uno.

| Framework opcional | Para qué | Incluido |
| :--- | :--- | :--- |
| Karate | Pruebas de API de mayor alcance (contratos, validación contra la base de QA, suites grandes). La plantilla ya trae pruebas de API básicas con el cliente de Playwright (ver sección 1) | No |
| Framework mobile (por ejemplo WebdriverIO con Appium) | Pruebas de app nativa Android e iOS | No |
| k6 | Pruebas de performance | No |

> **Nota (siglas):** **E2E** = *end-to-end*, prueba que recorre un flujo completo de punta a punta, como lo haría un usuario. **POM** = *Page Object Model*, patrón que separa cómo se interactúa con una pantalla (el Page Object) de qué se espera comprobar (el test). **CI/CD** = integración continua / entrega continua, es decir, ejecución automática de validaciones en un servidor.

---

## 1. Incluido: `plantilla-automation` (Playwright + Page Object Model)

| Aspecto | Detalle |
| :--- | :--- |
| **Repositorio** | `plantilla-automation` (carpeta dentro de este playbook) |
| **Propósito** | Pruebas E2E de la interfaz web de Tienda Demo y pruebas de API de ejemplo |
| **Framework** | Playwright (`@playwright/test`) |
| **Lenguaje** | TypeScript |
| **Navegadores** | Chromium (por defecto), Firefox y WebKit (los que Playwright instala con `npx playwright install`) y `movil` (emula un teléfono Pixel 5). Se eligen con la variable `BROWSERS` (por ejemplo `BROWSERS=chromium,firefox`) |
| **Ejecución** | Local (`npx playwright test`) y CI en GitHub Actions (dos workflows, ver [pipelines-ci-cd.md](./pipelines-ci-cd.md)) |
| **Sitio de ejemplo** | https://www.saucedemo.com/ (sitio demo público) y la API pública de práctica https://jsonplaceholder.typicode.com. En un proyecto real se cambia el ambiente con `TEST_ENV` (`demo`, `qa` o `pre`) o con `BASE_URL` y `API_URL` |
| **Qué se prueba** | Flujos de usuario en la web (login, catálogo, carrito y checkout) y, con el cliente de API de Playwright, respuestas y contratos básicos de un servicio (código HTTP y campos presentes) |

### Estructura
```text
plantilla-automation/
├── README.md  package.json  tsconfig.json  playwright.config.ts  .env.example  .gitignore
├── eslint.config.mjs  .prettierrc.json  .prettierignore   # reglas de código y de formato (npm run verificar)
├── .github/workflows/playwright.yml    # pipeline de GitHub Actions para cuando la plantilla es su propio repositorio
├── .kiro/steering/                     # reglas para Kiro: pw-proyecto.md, pw-code-review.md
├── config/                             # ambientes.ts (URLs por ambiente y bloqueo de producción) y sesion.ts (ruta de la sesión guardada)
├── data/                               # datos de prueba: usuarios.ts, comprador.ts
├── pages/                              # Page Objects: BasePage, LoginPage, InventoryPage, CartPage, CheckoutPage
├── api/                                # cliente de la API: UsuariosApi.ts (el "Page Object" de la API)
├── fixtures/                           # index.ts: los Page Objects listos para recibir como parámetro del test
├── utils/                              # evidencia.ts: guarda capturas con el nombre correcto
├── tests/
│   ├── auth.setup.ts                   # inicia sesión una vez y guarda la sesión (no es un test de negocio)
│   ├── sin-sesion/                     # login.spec.ts, compra.spec.ts: arrancan sin usuario autenticado
│   ├── con-sesion/                     # carrito.spec.ts, checkout.spec.ts: arrancan con la sesión guardada
│   └── api/                            # usuarios.api.spec.ts: pruebas de API sin navegador
└── evidencias/                         # capturas por historia: evidencias/<ID-HISTORIA>/
```
> **Nota:** además de esta carpeta, la raíz de este repositorio tiene el workflow ``.github/workflows/automation.yml``, que corre la plantilla cuando vive dentro del playbook. Explicación de cada archivo en [guia-plantilla-automation.md](./guia-plantilla-automation.md).
> **Nota (proyectos de Playwright):** ``playwright.config.ts`` define cuatro tipos de *proyecto* (una combinación de "qué tests" y "con qué configuración"): ``setup`` (prepara la sesión), ``api`` (sin navegador), ``<navegador>-sin-sesion`` y ``<navegador>-con-sesion``. Un test de web va en ``sin-sesion/`` si prueba el login o recorre el flujo desde cero, y en ``con-sesion/`` si el login es solo una precondición.
### Características principales

- **Page Object Model:** `pages/[Pantalla]Page.ts` contiene los localizadores y las acciones ("cómo interactuar"). El test decide "qué se espera": las aserciones `expect` quedan en el archivo `tests/sin-sesion/[funcionalidad].spec.ts` o `tests/con-sesion/[funcionalidad].spec.ts`.
- **Fixtures:** `fixtures/index.ts` entrega los Page Objects ya armados (`async ({ loginPage }) => ...`), así el test no crea las clases a mano.
- **Sesión guardada:** `tests/auth.setup.ts` inicia sesión una sola vez y guarda la sesión (`storageState`) en `playwright/.auth/estandar.json`, archivo ignorado por Git. Los tests de `con-sesion/` arrancan ya autenticados.
- **Ambientes con protección contra producción:** `config/ambientes.ts` elige la URL según `TEST_ENV`. `TEST_ENV=prod` corta la ejecución, y `HOSTS_BLOQUEADOS` corta si alguna URL contiene un texto prohibido.
- **Pruebas de API:** `api/UsuariosApi.ts` (sin aserciones, como un Page Object) y `tests/api/[recurso].api.spec.ts`, con el cliente de API de Playwright y sin abrir navegador.
- **Controles de código:** `npm run verificar` corre tipos (`tsc`), ESLint (sin `waitForTimeout`, sin `test.only`, todo test con aserciones) y formato (Prettier). El CI lo ejecuta antes de los tests.
- **Selectores estables:** se prefiere `data-test` / `data-testid` antes que textos o posiciones (SauceDemo usa `data-test`).
- **Sin esperas fijas:** nunca `waitForTimeout`; se usan las esperas automáticas de Playwright y las aserciones *web-first* (`await expect(locator).toBeVisible()`), que reintentan hasta que se cumple la condición o vence el tiempo.
- **Trazabilidad:** el título de cada test lleva el ID del caso: `test('PROJ-123-CP01 - Login exitoso con usuario válido', ...)`.
- **Precondiciones y orden:** `test.beforeEach` para las precondiciones y `test.describe` para agrupar.
- **Datos ficticios:** usuarios públicos de SauceDemo (`standard_user`, `locked_out_user`, `problem_user`, clave `secret_sauce`) y comprador ficticio "Ana Prueba", código postal "1000". Son credenciales de un sitio demo público; en un proyecto real las credenciales van en variables de entorno (`QA_USER`, `QA_PASSWORD`), nunca en archivos.
- **Configuración por variables de entorno:** `TEST_ENV`, `BASE_URL`, `API_URL`, `HOSTS_BLOQUEADOS`, `BROWSERS`, `HEADLESS`, `SLOW_MO`, `BROWSER_CHANNEL`, `QA_USER`, `QA_PASSWORD` (ver `.env.example`; todas son opcionales y tienen valor por defecto).
- **Evidencias:** la función `guardarEvidencia` (`utils/evidencia.ts`) guarda capturas en `evidencias/<ID-HISTORIA>/<ID-CASO>-<descripcion>.png`. En un proyecto real se copian al repositorio documental del equipo (por ejemplo SharePoint o Drive).
- **CI:** GitHub Actions corre `npm run verificar` y `npx playwright test` en cada push y Pull Request y sube el reporte HTML como artefacto. Hay un workflow para cuando la plantilla es su propio repositorio y otro en la raíz de este, para cuando vive dentro del playbook (detalle en [pipelines-ci-cd.md](./pipelines-ci-cd.md)).

### Comandos habituales
```bash
npm ci                                              # instala las dependencias exactas del package-lock.json
npx playwright install                              # descarga los navegadores que usa Playwright
npx playwright test                                 # corre todo: setup, web y API (headless)
npx playwright test tests/sin-sesion/login.spec.ts  # corre un solo archivo
npx playwright test --project=api                   # corre solo los tests de API
npx playwright test --headed                        # corre mostrando el navegador
npm run verificar                                   # tipos + lint + formato (lo mismo que corre el CI antes de los tests)
npm run format                                      # da formato al código con Prettier
npx playwright show-report                          # abre el reporte HTML de la última corrida
```> **Nota:** la guía de uso paso a paso de la plantilla está en [guia-plantilla-automation.md](./guia-plantilla-automation.md) y el resumen técnico en el `README.md` de `plantilla-automation`.

---

## 2. Opcional (no incluido): Karate para API

| Aspecto | Detalle |
| :--- | :--- |
| **Propósito** | Pruebas de integración y de contrato de APIs y microservicios |
| **Framework** | Karate DSL |
| **Lenguaje** | Sintaxis tipo Gherkin propia de Karate (Java solo para utilidades opcionales) |
| **Qué se prueba** | Endpoints REST, validación de contratos, reglas de negocio del back, integraciones entre servicios |

**Características principales**

- Sintaxis declarativa tipo Gherkin para escribir requests HTTP sin programar mucho.
- Validación de esquemas JSON de las respuestas.
- Reutilización de features mediante llamadas entre archivos.
- Soporte para autenticación (por ejemplo tokens Bearer u OAuth).
- Posibilidad de validar contra la base de datos en el mismo test (solo lectura en QA).
- Reportes HTML integrados.

**Cuándo conviene**

- La regla de negocio vive en el back y se puede comprobar sin pasar por la pantalla (por ejemplo, que el carrito calcule bien el total).
- Se necesitan pruebas rápidas y estables, que corran en cada Pull Request.
- Hay que probar respuestas de error (400, 401, 403, 404, 422, 500) que son difíciles de provocar desde la interfaz.
- Hay un contrato de API (Swagger/OpenAPI) que conviene verificar para detectar cambios que rompan a los consumidores.

**Cuándo no conviene:** si lo que se quiere comprobar es lo que ve el usuario (mensajes, estados de pantalla, navegación). Eso es terreno de Playwright. Tampoco hace falta para unas pocas verificaciones de una API: la plantilla ya las resuelve con `tests/api/`.

---

## 3. Opcional (no incluido): framework mobile

| Aspecto | Detalle |
| :--- | :--- |
| **Propósito** | Pruebas automatizadas de la aplicación mobile nativa |
| **Opciones habituales** | WebdriverIO + Appium, o Appium con otro cliente; ejecución en dispositivos locales, emuladores o una granja de dispositivos en la nube |
| **Plataformas** | Android e iOS |
| **Qué se prueba** | Flujos en la app: navegación, gestos, permisos del dispositivo, notificaciones, integración con servicios |

**Características principales**

- Capacidades de Appium para controlar apps nativas.
- Page Objects también para la app (misma idea que en web).
- Ejecución en paralelo en varias versiones del sistema operativo si se usa una granja de dispositivos.
- Reportes con capturas y logs del dispositivo.

**Cuándo conviene**

- Existe una app nativa (no solo una web responsive) y sus flujos críticos necesitan regresión frecuente.
- Hay que cubrir comportamientos propios del dispositivo: permisos, rotación, notificaciones, biometría.

**Cuándo no conviene:** si el producto es solo web. Para comprobar una web en pantallas chicas alcanza con las emulaciones de dispositivo de Playwright (`BROWSERS=movil`).

> **Atención:** las pruebas mobile son más lentas y más frágiles que las web. Conviene automatizar pocos flujos críticos y mantenerlos bien.

---

## 4. Opcional (no incluido): k6 para performance

| Aspecto | Detalle |
| :--- | :--- |
| **Propósito** | Pruebas de rendimiento: cuánta carga soporta el sistema y cómo se comporta |
| **Framework** | k6 (herramienta de código abierto de Grafana) |
| **Lenguaje** | JavaScript (ES6) |
| **Ejecución** | Local o en un pipeline de CI/CD, en un ambiente de preproducción (PRE) |
| **Qué se prueba** | Tiempos de respuesta, throughput y tasa de errores bajo distintos escenarios de carga |

**Tipos de prueba que cubre** (el detalle está en [plan-pruebas-performance.md](./plan-pruebas-performance.md))

| Tipo | Descripción |
| :--- | :--- |
| **Carga (load)** | Carga normal esperada en producción |
| **Estrés (stress)** | Carga por encima del máximo esperado |
| **Pico (spike)** | Saltos repentinos de carga |
| **Resistencia (soak)** | Carga sostenida durante un período prolongado |
| **Punto de quiebre (breakpoint)** | Incremento progresivo hasta encontrar el límite |

**Características principales**

- Scripts en JavaScript, modulares por servicio o endpoint.
- *Thresholds* (umbrales) configurables, por ejemplo latencia p95 y tasa de error; si no se cumplen, la corrida falla.
- Salida a reportes y a paneles de monitoreo (por ejemplo Grafana).
- Datos de prueba ficticios, generados o sembrados en el ambiente de pruebas. Nunca datos reales de clientes.

**Cuándo conviene**

- Un servicio nuevo o modificado forma parte de un flujo crítico (login, checkout) y hay que conocer su capacidad.
- Se espera un pico de uso (campaña, fecha especial) y hay que comprobar que el sistema lo soporta.
- Hubo un incidente de lentitud o caída por carga y hay que reproducirlo y validar la corrección.

**Cuándo no conviene:** para validar funcionalidad (no es su objetivo) o para medir tiempos de render de la pantalla en el navegador (eso se mide con herramientas de front, no con k6).

> **Atención:** las pruebas de performance nunca se ejecutan en PROD y requieren coordinar la ventana de ejecución con quien administra el ambiente.

---

## Cómo elegir el framework

| Pregunta | Si la respuesta es "sí" | Framework |
| :--- | :--- | :--- |
| ¿Lo que se verifica es lo que ve y hace el usuario en la web? | Flujo E2E de interfaz | Playwright (`plantilla-automation`) |
| ¿Se puede verificar llamando directamente al servicio, sin pantalla? | Regla de negocio o contrato del back | Pocas verificaciones (código HTTP y campos): `tests/api/` de la plantilla, con el cliente de Playwright. Suites grandes, validación de esquemas o de la base de QA: Karate |
| ¿Es una app nativa Android o iOS? | Flujo mobile | Framework mobile |
| ¿La pregunta es "cuánta carga aguanta" o "qué tan rápido responde"? | Rendimiento | k6 |

## Tabla comparativa rápida

| Repositorio / framework | Lenguaje | Tipo de prueba | Dónde se ejecuta | Estado |
| :--- | :--- | :--- | :--- | :--- |
| `plantilla-automation` (Playwright + POM) | TypeScript | Web E2E y API básica | Local y GitHub Actions | Incluido |
| Karate | Sintaxis tipo Gherkin | API (integración y contrato) | Local y CI | Opcional, no incluido |
| Framework mobile | TypeScript / JavaScript | App nativa Android e iOS | Dispositivos locales o en la nube | Opcional, no incluido |
| k6 | JavaScript | Performance | Local y CI, en PRE | Opcional, no incluido |

> **Nota:** si el equipo suma un framework opcional, lo recomendable es crear un repositorio propio (por ejemplo `karate-automation`), con su README, su pipeline de CI y reglas de steering para Kiro equivalentes a las de `plantilla-automation/.kiro/steering/`.
