# Guía de la plantilla de automation

> **Para qué sirve:** explica, archivo por archivo, cómo está armada la plantilla `plantilla-automation/` (Playwright + Page Object Model) y por qué se tomó cada decisión.
> **Quién lo usa:** QA que automatiza, QA que revisa Pull Requests de automatización y personas que se suman al equipo.
> **Cuándo se usa:** antes de escribir el primer test, al revisar un PR de automatización o al adaptar la plantilla a otro producto.

La plantilla es un proyecto real que corre: 17 tests contra el sitio demo público SauceDemo (https://www.saucedemo.com/) y una API pública de práctica. Es el mismo producto "Tienda Demo" documentado en `04-funcionalidades/`. Para instalarla y correrla, seguí el [README de la plantilla](../plantilla-automation/README.md). Para llevarla a un proyecto propio, seguí [Adaptar a un proyecto nuevo](../00-introduccion/adaptar-a-un-proyecto-nuevo.md).

## 1. Qué problema resuelve

Sin una estructura común, cada QA escribe los tests a su manera: selectores repetidos en veinte archivos, usuarios escritos a mano, esperas fijas que hacen los tests lentos e inestables, y URLs de ambientes mezcladas con el código. La plantilla fija una forma única de trabajar:

- Un **Page Object por pantalla**, para corregir un selector en un solo lugar.
- **Datos de prueba separados** del código de los tests.
- **Configuración por variables de entorno**, para usar el mismo código en tu equipo y en el CI.
- **Ambientes con protección contra producción**, para que nadie corra pruebas donde no debe.
- **Un título de test que lleva el ID del caso**, para que cada test quede trazado a su caso de prueba.
- **Controles automáticos** (tipos, lint y formato) que hacen cumplir las reglas del equipo.

## 2. El patrón Page Object Model (POM)

Una pantalla de la aplicación se representa con una clase. La clase tiene dos partes:

| Parte         | Qué contiene                      | Ejemplo en `LoginPage.ts`                                       |
| :------------ | :-------------------------------- | :-------------------------------------------------------------- |
| Localizadores | Cómo encontrar cada elemento      | `this.loginButton = page.locator('[data-test="login-button"]')` |
| Acciones      | Qué se puede hacer en la pantalla | `login(username, password)`                                     |

**Regla de reparto:** el Page Object sabe **cómo** interactuar; el test decide **qué** resultado espera. Por eso las aserciones (`expect`) están en los tests y no en las clases de `pages/`.

Sin POM:

```ts
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();
```

Con POM:

```ts
await loginPage.login(USUARIOS.estandar.username, USUARIOS.estandar.password);
```

Si el desarrollador cambia el selector del botón, con POM se corrige una línea en `LoginPage.ts`; sin POM, hay que buscarlo en todos los tests.

`pages/BasePage.ts` es la clase de la que heredan todos los Page Objects. Guarda la pestaña del navegador (`page`) y el método `goto()`. Si todas las pantallas comparten algo (un menú, un banner), se agrega ahí una sola vez.

## 3. Fixtures: los Page Objects ya armados

Un **fixture** es algo que el test recibe listo, como `page`. En `fixtures/index.ts` se definen fixtures propios, uno por Page Object. Así un test escribe `async ({ loginPage })` en lugar de crear el objeto a mano.

| Forma                                        | Dónde se ve                      | Cuándo conviene                     |
| :------------------------------------------- | :------------------------------- | :---------------------------------- |
| Explícita: `const loginPage = new LoginPage(page)` | `tests/sin-sesion/compra.spec.ts` | Para aprender: se ve qué pasa       |
| Con fixtures: `async ({ loginPage }) => ...` | El resto de los tests            | En proyectos reales: menos repetición |

Las dos son equivalentes. Elegí una y usala en todo el proyecto.

## 4. Sesión guardada y proyectos

Iniciar sesión por la pantalla en cada test es lento y es la causa más común de fallos ajenos a lo que se prueba. La plantilla lo resuelve así:

1. `tests/auth.setup.ts` inicia sesión **una sola vez** y guarda las cookies en `playwright/.auth/estandar.json` (archivo ignorado por Git).
2. `playwright.config.ts` define **proyectos**. Un proyecto es una combinación de "qué tests" y "con qué configuración".

| Proyecto            | Qué corre                       | Cómo arranca                                    |
| :------------------ | :------------------------------ | :---------------------------------------------- |
| `setup`             | `tests/auth.setup.ts`           | Hace el login y guarda la sesión                |
| `<navegador>-sin-sesion` | `tests/sin-sesion/`        | Sin usuario autenticado (login y flujos completos) |
| `<navegador>-con-sesion` | `tests/con-sesion/`        | Con la sesión cargada; depende de `setup`      |
| `api`               | `tests/api/*.api.spec.ts`       | Sin navegador, contra la URL de la API          |

`<navegador>` es cada valor de la variable `BROWSERS` (`chromium` por defecto). Con `BROWSERS=chromium,firefox` los tests de web corren una vez por navegador.

**Regla práctica:** un test va en `sin-sesion/` si prueba el login o recorre el flujo desde cero, y en `con-sesion/` si el login es solo una precondición.

## 5. Ambientes y protección contra producción

`config/ambientes.ts` decide contra qué URL corren los tests, en este orden de prioridad:

1. `BASE_URL` y `API_URL`, si están definidas.
2. El ambiente de `TEST_ENV` (`demo`, `qa` o `pre`).
3. `demo`, si no se define nada.

Tiene dos barreras contra producción: `TEST_ENV=prod` corta la ejecución con un error, y `HOSTS_BLOQUEADOS` corta si alguna URL contiene un texto prohibido (por ejemplo el dominio de producción). Es el código que hace cumplir la regla "nunca se prueba en producción".

## 6. Recorrido por los archivos

| Archivo                                  | Qué hace                                                                                   | Qué mirar                                                          |
| :--------------------------------------- | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `playwright.config.ts`                   | Configura Playwright: carpeta de tests, proyectos, navegadores, reintentos, reportes       | Cada opción tiene un comentario                                    |
| `config/ambientes.ts`                    | URLs por ambiente y bloqueo de producción                                                  | La tabla `AMBIENTES` es lo primero que se edita en un proyecto real |
| `config/sesion.ts`                       | Ruta del archivo de sesión guardada                                                        | Una sola constante                                                 |
| `.env.example`                           | Modelo de las variables de entorno                                                         | Se copia a `.env`, que no se sube al repositorio                   |
| `data/usuarios.ts`                       | Usuarios de prueba                                                                         | Las credenciales del sitio demo son públicas; en un proyecto real vienen del entorno |
| `data/comprador.ts`                      | Datos ficticios del comprador                                                              | `COMPRADOR` se copia y se modifica un campo para los casos negativos |
| `pages/BasePage.ts`                      | Clase base de los Page Objects                                                             | Se hereda con `extends`                                            |
| `pages/LoginPage.ts`                     | Pantalla de login                                                                          | Es el ejemplo mejor comentado: leelo primero                       |
| `pages/InventoryPage.ts`                 | Catálogo de productos                                                                      | Incluye el contador del carrito (`cartBadge`)                      |
| `pages/CartPage.ts`                      | Carrito                                                                                    | La pantalla más simple                                             |
| `pages/CheckoutPage.ts`                  | Las tres pantallas del checkout (datos, resumen, confirmación)                             | Una sola clase porque es un único flujo                            |
| `api/UsuariosApi.ts`                     | Cliente de la API                                                                          | Mismo patrón que un Page Object, sin aserciones                    |
| `fixtures/index.ts`                      | Page Objects como fixtures                                                                 | Para sumar una pantalla, se agrega en dos lugares                  |
| `utils/evidencia.ts`                     | Guarda capturas en `evidencias/<ID-HISTORIA>/`                                             | Fija el nombre del archivo                                         |
| `tests/auth.setup.ts`                    | Inicia sesión y guarda la sesión                                                           | No es un test de negocio                                           |
| `tests/sin-sesion/login.spec.ts`         | 5 casos de login: 1 positivo y 4 negativos                                                 | Usa `test.describe` y `test.beforeEach`                            |
| `tests/sin-sesion/compra.spec.ts`        | 1 caso E2E de compra completa                                                              | Forma explícita y evidencia                                        |
| `tests/con-sesion/carrito.spec.ts`       | 3 casos: agregar, ver y quitar                                                             | Incluye un caso de borde (de 1 a 0 productos)                      |
| `tests/con-sesion/checkout.spec.ts`      | 4 casos: un negativo por campo requerido y el resumen                                      | Usa `{ ...COMPRADOR, firstName: '' }` para vaciar un solo campo    |
| `tests/api/usuarios.api.spec.ts`         | 3 casos de API: lista, usuario existente e inexistente                                     | Verifica código HTTP y contrato (campos presentes)                 |
| `eslint.config.mjs`                      | Reglas de código: sin `waitForTimeout`, sin `test.only`, todo test con aserciones          | Hace cumplir las reglas del equipo en cada PR                      |
| `.prettierrc.json`                       | Formato del código                                                                         | Comillas simples y 100 columnas                                    |
| `.github/workflows/playwright.yml`       | Pipeline de CI para cuando la plantilla es su propio repositorio                           | Ver [pipelines-ci-cd.md](./pipelines-ci-cd.md)                     |
| `.kiro/steering/pw-proyecto.md`          | Reglas del proyecto para Kiro                                                              | Se carga solo cuando el pedido trata de tests o Page Objects       |
| `.kiro/steering/pw-code-review.md`       | Checklist de revisión de PR                                                                | La usa la skill `qa-revisar-pr`                                    |

## 7. Convenciones de la plantilla

| Tema            | Convención                                                       | Dónde se aplica                                            |
| :-------------- | :--------------------------------------------------------------- | :--------------------------------------------------------- |
| Page Objects    | `[Pantalla]Page.ts`, clase en PascalCase                         | `pages/`                                                   |
| Tests de web    | `[funcionalidad].spec.ts`, en minúsculas, en `sin-sesion/` o `con-sesion/` | `tests/`                                         |
| Tests de API    | `[recurso].api.spec.ts`                                          | `tests/api/`                                               |
| Título del test | `<ID-HISTORIA>-CP<NN> - <qué se prueba>`                         | `PROJ-101-CP02 - Login fallido con contraseña incorrecta`  |
| Selectores      | `data-test` o `data-testid` primero, `getByRole` después, nunca posiciones | `pages/`                                         |
| Esperas         | Solo las automáticas de Playwright; prohibido `waitForTimeout`   | Todo el código (lo controla ESLint)                        |
| Evidencias      | `evidencias/<ID-HISTORIA>/<ID-CASO>-<descripcion>.png`           | `utils/evidencia.ts`                                       |
| Credenciales    | Variables de entorno, nunca en el código                         | `data/usuarios.ts`, `.env`                                 |
| Ambientes       | Nunca producción                                                 | `config/ambientes.ts`                                      |
| Rama y commit   | `feature/<CLAVE>-<resumen>` y `<CLAVE>: <qué cambia>`            | Git                                                        |

Los IDs `PROJ-101` a `PROJ-105` son historias de ejemplo. Los casos están alineados con las reglas de `04-funcionalidades/vision-cliente/` (acceso, catálogo, carrito y checkout).

## 8. Qué cubre cada tipo de caso

La [cobertura mínima](../.kiro/steering/qa-gherkin.md) pide camino feliz, validaciones y bordes. En la plantilla:

| Tipo     | Ejemplo en la plantilla                                                                                           |
| :------- | :---------------------------------------------------------------------------------------------------------------- |
| Positivo | `PROJ-101-CP01` login exitoso; `PROJ-104-CP01` compra completa; `PROJ-105-CP01` lista de usuarios por API         |
| Negativo | `PROJ-101-CP02` clave incorrecta; `PROJ-101-CP03` usuario bloqueado; `PROJ-103-CP01` a `CP03` campos vacíos; `PROJ-105-CP03` usuario inexistente (404) |
| Borde    | `PROJ-102-CP03` quitar el único producto: el contador desaparece                                                  |

## 9. Cómo agregar un test nuevo

1. Tené a mano la historia y los casos aprobados. Si algo no está en la historia (un mensaje, una regla), dejalo como pregunta para el PO; no lo inventes.
2. Si la pantalla es nueva, creá `pages/<Pantalla>Page.ts` copiando el estilo de `LoginPage.ts` y registrala en `fixtures/index.ts`.
3. Elegí la carpeta: `tests/sin-sesion/` o `tests/con-sesion/` (ver sección 4).
4. Creá o ampliá `tests/<carpeta>/<funcionalidad>.spec.ts` con el ID del caso en el título.
5. Corré el test: tiene que pasar.
6. Cambiá a propósito el resultado esperado y corré de nuevo: tiene que fallar. Después revertí el cambio. Un test que nunca falla no prueba nada.
7. Corré `npm run verificar` y toda la suite (`npx playwright test`).
8. Abrí el Pull Request. Con Kiro, usá el agente `qa-pr` (modo `CREAR_PR`) y la skill `qa-revisar-pr` para revisarlo.

## 10. Cómo se relaciona con el resto del playbook

| Pieza del playbook                                              | Relación con la plantilla                                                       |
| :-------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `qa-plan-automatizacion`                                        | Decide qué casos conviene automatizar                                           |
| `qa-crear-tarea-automatizacion`                                 | Crea la tarea `AUTO-xx` que organiza el trabajo                                 |
| `qa-automation` (agente)                                        | Guía el flujo de implementar, reparar y registrar                               |
| `qa-registro-automatizacion`                                    | Registra en la herramienta de gestión de pruebas qué casos quedaron automatizados |
| `qa-crear-pr` y `qa-revisar-pr`                                 | Crean y revisan el Pull Request, con `pw-code-review.md` como checklist propio  |
| [pipelines-ci-cd.md](./pipelines-ci-cd.md)                      | Explica los workflows de GitHub Actions                                         |
| [repositorios-y-frameworks.md](./repositorios-y-frameworks.md)  | Describe cuándo sumar Karate, mobile o k6                                       |

## 11. Qué no incluye la plantilla

- **Karate u otro framework de API dedicado:** las pruebas de API de la plantilla usan el cliente HTTP de Playwright, suficiente para validaciones simples (código HTTP y contrato). Para suites grandes de API conviene un framework dedicado; ver [repositorios-y-frameworks.md](./repositorios-y-frameworks.md).
- **Pruebas mobile nativas y de performance:** no están incluidas. La opción `BROWSERS=movil` solo emula un teléfono en el navegador; no prueba una app nativa.
- **Reglas de accesibilidad automatizadas:** se pueden sumar con una librería de accesibilidad para Playwright. La validación completa de accesibilidad requiere además pruebas manuales con tecnologías de asistencia.
- **Datos de prueba creados por API:** los tests de ejemplo usan datos fijos del sitio demo. En un proyecto real conviene crear y borrar los datos de cada test por API, para que sean independientes.

## 12. Usarla sin Kiro

Todo funciona sin Kiro: la plantilla es un proyecto de Node.js común. Las carpetas `.kiro/` solo contienen texto que Kiro lee; las mismas reglas están escritas en este documento y en el README. Si usás otro asistente de IA, podés pegarle `plantilla-automation/.kiro/steering/pw-proyecto.md` como instrucciones.
