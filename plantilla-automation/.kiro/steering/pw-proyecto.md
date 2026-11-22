---
inclusion: auto
name: pw-proyecto
description: Estructura, convenciones y comandos del proyecto de automatización con Playwright y Page Object Model (web y API). Usar al crear, modificar o revisar tests, Page Objects, fixtures o la configuración de este repositorio.
---

# Proyecto de automatización con Playwright (POM)

> **Para qué sirve:** le explica a Kiro (y a cualquier persona nueva) cómo está organizado este repositorio y qué reglas se siguen al escribir tests de web y de API.
> **Quién lo usa:** Kiro, cuando el pedido trata de tests, Page Objects o configuración de Playwright (`inclusion: auto`), y los QA que automatizan.
> **Cuándo se usa:** al implementar un test nuevo, reparar uno que falla o revisar cómo se hizo.

## Estructura

| Carpeta o archivo                  | Qué contiene                                                                                                                               |
| :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/`                           | Page Objects. Una clase por pantalla, todas heredan de `BasePage.ts`: `LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutPage.ts` |
| `api/`                             | Clientes de API (el "Page Object" de la API): `UsuariosApi.ts`                                                                             |
| `fixtures/index.ts`                | Fixtures propios: los Page Objects listos para recibir como parámetro del test                                                             |
| `tests/sin-sesion/`                | Tests de web que arrancan sin usuario autenticado (login y flujos completos)                                                               |
| `tests/con-sesion/`                | Tests de web que arrancan con la sesión ya iniciada (la guarda `tests/auth.setup.ts`)                                                      |
| `tests/api/`                       | Tests de API, con nombre `[recurso].api.spec.ts`                                                                                           |
| `data/`                            | Datos de prueba ficticios (usuarios, comprador)                                                                                            |
| `config/ambientes.ts`              | URLs por ambiente y bloqueo de producción                                                                                                  |
| `utils/evidencia.ts`               | Guarda capturas en `evidencias/<ID-HISTORIA>/`                                                                                             |
| `evidencias/`                      | Capturas de las corridas, una subcarpeta por historia                                                                                      |
| `playwright.config.ts`             | Configuración general: proyectos, navegadores, reintentos, reportes                                                                        |
| `eslint.config.mjs`                | Reglas de código que hacen cumplir las de este documento                                                                                   |
| `.env.example`                     | Modelo de variables de entorno. El `.env` real no se sube                                                                                  |
| `.github/workflows/playwright.yml` | Pipeline de CI en GitHub Actions                                                                                                           |

## Reglas de código

1. **Page Object Model.** Los localizadores y las acciones de una pantalla viven en su clase de `pages/`. Los tests no escriben selectores.
2. **Las aserciones van en el test.** El Page Object y el cliente de API no contienen `expect`: saben cómo interactuar, el test decide qué espera.
3. **Selectores estables.** Preferir `data-test` o `data-testid`. Después, `getByRole` con nombre accesible. Evitar clases CSS, textos largos y posiciones (`nth`).
4. **Sin esperas fijas.** Prohibido `waitForTimeout` (lo controla ESLint). Playwright espera solo a que el elemento esté listo, y las aserciones `expect(...)` reintentan hasta cumplirse.
5. **Tests independientes.** Cada test arma su propia precondición (`test.beforeEach`) y no depende del resultado de otro.
6. **Un test, una cosa.** Un caso de prueba por `test(...)`.
7. **Cada test tiene que poder fallar.** Si se cambia el resultado esperado, el test se pone en rojo. Verificarlo al escribirlo.
8. **Datos de prueba ficticios.** Nunca datos reales. Usuarios y claves salen de `data/usuarios.ts` y de variables de entorno, no de los tests.
9. **Nunca contra producción.** El ambiente sale de `config/ambientes.ts`; `TEST_ENV=prod` corta la ejecución.
10. **Una sola forma de crear Page Objects.** En este proyecto, con fixtures (`async ({ loginPage })`). La forma explícita (`new LoginPage(page)`) queda solo en `tests/sin-sesion/compra.spec.ts` como ejemplo didáctico.
11. **Dónde va cada test de web.** En `tests/sin-sesion/` si prueba el login o recorre el flujo desde cero; en `tests/con-sesion/` si el login es solo una precondición.

## Tests excluidos y marcador provisorio

Estas reglas vienen de `00-introduccion/kiro/contratos.md` (secciones 9.7 y 9.9) y aplican igual en Playwright.

| Situación                                                                             | Cómo se marca en Playwright                                                                             | Qué debe llevar                                                                                                                                                 |
| :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| El test falla por un bug de la aplicación, ya reportado en Jira                       | `test.skip(...)` y un comentario con `@BUG @BUG_<ID>`                                                   | Causa, clave del bug, fecha y QA que lo marcó. Nunca se borra el test                                                                                           |
| El test falla por un problema de ambiente o de datos, ajeno al test y a la aplicación | `test.skip(...)` y un comentario con `@SKIP_WIP`                                                        | Causa con evidencia, desde cuándo (`AAAA-MM-DD`), fecha de revisión (por defecto dos semanas después) y QA que lo marcó                                         |
| El caso todavía no existe en Xray, así que no hay ID real para el título              | Se escribe `XRAY-PENDIENTE` en lugar del ID: `test('XRAY-PENDIENTE - Login con usuario inactivo', ...)` | Al registrar la automatización (skill `qa-registro-automatizacion`) se reemplaza por la clave real. Ningún test debe llegar a la rama principal con el marcador |

> **Nota:** un `test.skip` sin comentario es un bloqueante en la revisión (ver `pw-code-review.md`).

## Convenciones de nombres

| Elemento             | Convención                                             | Ejemplo                                                   |
| :------------------- | :----------------------------------------------------- | :-------------------------------------------------------- |
| Page Object          | `[Pantalla]Page.ts`, clase en PascalCase               | `LoginPage.ts`                                            |
| Archivo de tests web | `[funcionalidad].spec.ts`, en minúsculas               | `login.spec.ts`                                           |
| Archivo de tests API | `[recurso].api.spec.ts`                                | `usuarios.api.spec.ts`                                    |
| Título del test      | `<ID-HISTORIA>-CP<NN> - <qué se prueba>`               | `PROJ-101-CP02 - Login fallido con contraseña incorrecta` |
| Grupo                | `test.describe('<ID-HISTORIA> - <Funcionalidad>')`     | `PROJ-101 - Login`                                        |
| Captura de evidencia | `evidencias/<ID-HISTORIA>/<ID-CASO>-<descripcion>.png` | `evidencias/PROJ-104/PROJ-104-CP01-compra-exitosa.png`    |
| Rama                 | `feature/<CLAVE>-<resumen>`                            | `feature/AUTO-45-login-negativos`                         |
| Commit               | `<CLAVE>: <qué cambia>`                                | `AUTO-45: agrega casos negativos de login`                |

## Comandos

```bash
npm ci                                  # instala las dependencias exactas del package-lock.json
npx playwright install                  # descarga los navegadores de Playwright (una sola vez)
npx playwright test                     # corre todos los tests (setup, web y API)
npx playwright test tests/sin-sesion/login.spec.ts # corre un solo archivo
npx playwright test -g "CP02"           # corre los tests cuyo título contiene "CP02"
npx playwright test --project=api       # corre solo los tests de API
npx playwright test --headed            # corre viendo el navegador
npx playwright test --ui                # abre el modo interactivo de Playwright
npx playwright show-report              # abre el último reporte HTML
npm run verificar                       # tipos (tsc) + reglas (eslint) + formato (prettier)
npm run format                          # da formato al código
```

## Cómo agregar un test nuevo (pasos)

1. Leer la historia y los casos de prueba aprobados. No inventar mensajes ni reglas que no estén en la historia: dejarlos como pregunta para el PO.
2. Si la pantalla es nueva, crear `pages/<Pantalla>Page.ts` con sus localizadores y acciones, copiando el estilo de `LoginPage.ts`, y registrarla en `fixtures/index.ts`.
3. Elegir la carpeta (`sin-sesion`, `con-sesion` o `api`) y crear o ampliar `tests/.../<funcionalidad>.spec.ts`. Poner el ID del caso en el título.
4. Correr el test, ver que pasa y luego cambiar el resultado esperado para comprobar que falla. Revertir el cambio.
5. Correr `npm run verificar` y toda la suite (`npx playwright test`).
6. Guardar la evidencia con `guardarEvidencia(...)` si el caso lo pide.
7. Abrir el Pull Request con la rama y el commit según las convenciones.
