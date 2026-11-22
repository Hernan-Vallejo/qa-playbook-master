# Proceso de Automatización de Pruebas

> **Para qué sirve:** describir el recorrido completo de una prueba automatizada, desde la historia de usuario hasta que corre en un pipeline, con los criterios de elegibilidad, los puntos de control y las responsabilidades de cada rol.
> **Quién lo usa:** QA Automation (quien implementa) y QA Funcional (quien diseña los casos y marca candidatos).
> **Cuándo se usa:** en cada sprint, cuando hay casos de prueba que conviene automatizar, y al revisar el estado de la suite de regresión.

> **Nota (siglas):** **HU** = historia de usuario. **AUTO** = clave del proyecto Jira donde viven las tareas de automatización (por ejemplo `AUTO-45`). **PR** = Pull Request, la solicitud para integrar una rama al repositorio principal. **POM** = Page Object Model. **CI/CD** = integración y entrega continuas (el pipeline). **BDD** = *Behaviour-Driven Development*, forma de escribir escenarios con Given/When/Then (Dado/Cuando/Entonces).

## Flujo general

El proceso nace en las historias de usuario de Jira y termina con tests ejecutándose en un pipeline de CI/CD.

```text
┌─────────────┐   ┌──────────────────┐   ┌────────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  HU en Jira │ → │ Casos de prueba  │ → │ Tarea AUTO     │ → │ Automatiza-  │ → │ Pull Request │ → │ Pipeline     │
│  (Sprint)   │   │ (Jira + Xray)    │   │ (candidato)    │   │ ción (rama)  │   │ (revisión)   │   │ (GitHub      │
│             │   │                  │   │                │   │              │   │              │   │  Actions)    │
└─────────────┘   └──────────────────┘   └────────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

> **Ejemplo:** la HU `PROJ-123` "Login con usuario válido y bloqueado" tiene los casos `PROJ-123-CP01` a `PROJ-123-CP05`. Dos de ellos se eligen para automatizar y se crea la tarea `AUTO-45`. La rama se llama `feature/AUTO-45-login-negativos`, el PR corre el pipeline y, al aprobarse, los tests quedan en la regresión.

---

## Puntos de control del proceso y del agente `qa-automation`

Los puntos de control de este documento son los del **proceso completo** (de la HU al pipeline) y los usan las personas. El agente `qa-automation` tiene sus propios puntos de control, que cubren los pasos 3 a 6 y están definidos en contratos, sección 9.8. La tabla muestra cuál corresponde a cuál:

| Punto de control del proceso | Punto de control del agente | Modo del agente |
| :--- | :--- | :--- |
| HU lista para diseñar casos | No aplica: lo cubren `qa-maestro` y `qa-analisis-hu` | — |
| Candidatos seleccionados | Contexto y Plan de automatización | `PLANIFICAR` |
| Automatización terminada localmente | Feature, Implementación y Verificación (y, si un test falla, Diagnóstico y Corrección) | `IMPLEMENTAR` y `REPARAR` |
| Sin punto de control propio: el registro en Xray se hace al empezar el paso 6, antes de abrir el PR | Registro en Xray | `REGISTRAR_XRAY` |
| PR aprobado | Revisión y Publicación de la revisión (agente `qa-pr`) | `REVISAR_PR` |

> **Nota:** en Playwright no hay archivos `.feature`: el punto de control "Feature" muestra el caso con el título y los pasos del test que se va a escribir.

---

## Paso 1: Historia de usuario (HU) en Jira

El equipo de desarrollo tiene la HU en su proyecto de Jira (clave `PROJ`). La HU contiene:

- Criterios de aceptación.
- Reglas de negocio.
- Links a Figma o a especificaciones de API, si existen.

> **Nota:** si la HU no dice algo (un mensaje de error, un límite), no se supone: se deja como pregunta para el Product Owner (PO) antes de diseñar los casos.

**[PUNTO DE CONTROL] HU lista para diseñar casos · esperando tu confirmación** (la HU cumple el DoR, *Definition of Ready*, definido en [definicion-dor-dod.md](../01-estandares-globales/definicion-dor-dod.md)).

---

## Paso 2: Casos de prueba en Jira + Xray

El QA Funcional crea los **casos de prueba** en Jira con Xray (herramienta de gestión de pruebas), vinculados a la HU y siguiendo el estándar BDD del steering de Gherkin del playbook.

Cada caso contiene:

- Escenario BDD (Given/When/Then).
- Tipo: Positivo, Negativo o Borde.
- Precondiciones y datos necesarios (siempre ficticios).
- Resultado esperado comprobable, sin ambigüedad (qué se ve, qué valor, qué mensaje).
- Validación de base de datos o de servicio, si corresponde.

Los IDs usan el prefijo de la historia: `PROJ-123-CP01`, `PROJ-123-CP02`, etc.

---

## Paso 3: Selección para automatización

El QA Automation revisa los casos y selecciona los candidatos según los criterios de elegibilidad. El QA Funcional puede marcar casos como candidatos con un campo o etiqueta en el caso.

### Criterios para automatizar

| Criterio | Qué significa |
| :--- | :--- |
| Datos de prueba determinísticos | El caso siempre arranca con los mismos datos y da el mismo resultado |
| Contratos de UI o API estables | La pantalla o el servicio no está en desarrollo activo |
| Alta frecuencia de ejecución | Se corre en cada regresión |
| Acceso a datos para validar | Se puede comprobar el resultado (pantalla, servicio o base de datos de QA) |
| Sin dependencia de datos efímeros | No depende de datos que desaparecen o cambian solos |

> **Atención:** no se automatiza un caso inestable. Un test que falla de manera intermitente (*flaky*) le quita confianza a toda la suite.

### Derivación por tipo

| Tipo de caso | Dónde se implementa | Framework | Estado |
| :--- | :--- | :--- | :--- |
| Flujo web E2E | `plantilla-automation` (`tests/sin-sesion/` o `tests/con-sesion/`) | Playwright + POM | Incluido |
| API / servicio / back, pocas verificaciones (código HTTP y campos) | `plantilla-automation` (`tests/api/`) | Playwright (cliente de API) | Incluido |
| API / servicio / back, suites grandes, esquemas o validación en la base de QA | Repositorio propio del equipo | Karate | Opcional, no incluido |
| Flujo mobile (app nativa) | Repositorio propio del equipo | Framework mobile | Opcional, no incluido |
| Performance / carga | Repositorio propio del equipo | k6 | Opcional, no incluido |

Más detalle en [repositorios-y-frameworks.md](./repositorios-y-frameworks.md).

**[PUNTO DE CONTROL] Candidatos seleccionados · esperando tu confirmación**

---

## Paso 4: Tarea AUTO en Jira

Por cada grupo de casos a automatizar se crea una tarea en el proyecto `AUTO` (por ejemplo `AUTO-45`), vinculada a la HU y a los casos. La skill `qa-crear-tarea-automatizacion` del playbook ayuda a armarla. La tarea indica:

- Casos que se automatizan (`PROJ-123-CP01`, `PROJ-123-CP02`, ...).
- Framework y repositorio destino.
- Datos de prueba necesarios.
- Criterio de terminado (ver más abajo).

> **Nota:** según el estándar del equipo, antes de crear o editar tickets en Jira se muestra el texto exacto y se espera la aprobación del QA.

---

## Paso 5: Automatización

### Web (Playwright, `plantilla-automation`)
1. Crear la rama desde la principal: `feature/AUTO-45-login-negativos`.
2. Tomar el caso de Jira + Xray y confirmar los datos de prueba.
3. Si la pantalla no tiene Page Object, crearlo en `pages/[Pantalla]Page.ts` (por ejemplo `LoginPage.ts`, que hereda de `BasePage`) con localizadores estables (`data-test` / `data-testid`) y acciones. El Page Object **no** lleva aserciones. Registrarlo en `fixtures/index.ts` (en los dos lugares que indica el archivo) para recibirlo como parámetro del test.
4. Elegir la carpeta: `tests/sin-sesion/` si el caso prueba el login o recorre el flujo desde cero, `tests/con-sesion/` si el login es solo una precondición (arranca con la sesión guardada por `tests/auth.setup.ts`).
5. Crear o ampliar el archivo `tests/<carpeta>/[funcionalidad].spec.ts` (por ejemplo `tests/sin-sesion/login.spec.ts`). El título del test lleva el ID del caso: `test('PROJ-123-CP01 - Login exitoso con usuario válido', ...)`. Las aserciones `expect` van en el test.
6. Usar `test.beforeEach` para las precondiciones y `test.describe` para agrupar. Sin `waitForTimeout`: se usan las esperas automáticas de Playwright (ESLint lo controla).
7. Parametrizar datos (carpeta `data/`). Las credenciales reales o de ambientes propios van en variables de entorno (`QA_USER`, `QA_PASSWORD`), nunca en archivos. Las credenciales de SauceDemo (`standard_user` / `secret_sauce`) son públicas de un sitio demo. El ambiente se elige con `TEST_ENV` (`config/ambientes.ts`); nunca producción.
8. Ejecutar localmente: `npx playwright test tests/sin-sesion/login.spec.ts`, y con `--headed` si hay que ver el navegador.
9. Comprobar que **el test puede fallar**: cambiar el resultado esperado y confirmar que se pone en rojo. Volver el valor correcto.
10. Correr `npm run verificar` (tipos, ESLint y formato) y toda la suite (`npx playwright test`). Es lo mismo que corre el pipeline, así se evita que el PR falle por un detalle de formato.
11. Guardar las capturas de evidencia con `guardarEvidencia(...)` (`utils/evidencia.ts`) en `evidencias/<ID-HISTORIA>/` con nombres que incluyan el caso.
12. Hacer commit con el formato `AUTO-45: agrega casos negativos de login`.
> **Nota:** si un test no puede pasar por un bug de la aplicación o por un problema de ambiente, no se borra: se excluye con `test.skip` y la marca `@BUG @BUG_<ID>` o `@SKIP_WIP`, con su causa y fechas (ver contratos, sección 9.9).
### API con la plantilla (cliente de Playwright)
1. Tomar el caso de Jira + Xray.
2. Si el recurso no tiene cliente, crearlo en `api/[Recurso]Api.ts` (por ejemplo `UsuariosApi.ts`) con los métodos que llaman al servicio. Igual que un Page Object, **no** lleva aserciones.
3. Crear o ampliar `tests/api/[recurso].api.spec.ts` (por ejemplo `usuarios.api.spec.ts`). El título lleva el ID del caso y el test verifica el código HTTP y el contrato (campos presentes). Estos tests no abren navegador: corren en el proyecto `api` de Playwright (`npx playwright test --project=api`).
4. Para el resto (comprobar que puede fallar, `npm run verificar`, evidencia y commit) se siguen los pasos 9 a 12 de Web.
> **Nota:** para suites de API grandes, validación de esquemas o consultas a la base de QA, el equipo puede sumar Karate (sección siguiente).### API con Karate (opcional, no incluido)

1. Tomar el caso de Jira + Xray.
2. Escribir el feature con la URL del servicio, el body del request y las validaciones.
3. Validar la respuesta HTTP y, si corresponde, el impacto en la base de datos de QA con consultas de solo lectura (SELECT).
4. Ejecutar en el pipeline.

### Mobile (opcional)

1. Tomar el caso de Jira + Xray.
2. Implementarlo con Page Objects de la app nativa.
3. Ejecutar en Android e iOS (dispositivos o emuladores, y las últimas 2 o 3 versiones del sistema operativo).
4. Validar comportamiento visual y funcional en ambas plataformas.

### Performance (k6, opcional)

El flujo de performance es distinto: **no nace de un caso funcional sino de una solicitud específica**, descrita en [plan-pruebas-performance.md](./plan-pruebas-performance.md). Resumen:

1. Se recibe una tarea con los endpoints a probar, los volúmenes a representar, el tipo de prueba (carga, estrés, pico, resistencia) y los umbrales esperados (latencia, tasa de error).
2. Se diseña el script con los escenarios pedidos.
3. Se ejecuta en el ambiente de preproducción (PRE) y se genera el reporte con métricas.
4. Se comparten los resultados y se documentan los hallazgos.

**[PUNTO DE CONTROL] Automatización terminada localmente · esperando tu confirmación**

---

## Paso 6: Registro en Xray y Pull Request (PR)

1. Subir la rama (`git push -u origin feature/AUTO-45-login-negativos`) y esperar el resultado del pipeline sobre la rama. Después, registrar la automatización en Xray con la skill `qa-registro-automatizacion` (modo `REGISTRAR_XRAY` del agente `qa-automation`): cada caso queda marcado como automatizado, los casos nuevos se crean en Xray y los IDs provisorios de los tests (`@PROJ-XXXX`) se reemplazan por el ID real. Ese cambio se commitea (`AUTO-45: registra IDs de Xray en los tests`) y se sube a la misma rama.
2. Abrir el PR hacia la rama principal con la plantilla homologada del equipo (la skill `qa-crear-pr` y el agente `qa-pr` ayudan a armarlo). Debe incluir: tarea AUTO, HU y casos cubiertos, qué se automatizó, cómo correrlo y las evidencias.
3. El pipeline de GitHub Actions corre automáticamente sobre el PR (ver [pipelines-ci-cd.md](./pipelines-ci-cd.md)): `Playwright Tests` si la plantilla es su propio repositorio, `Automation (plantilla)` si vive dentro de este. El PR no se aprueba con el pipeline en rojo.
4. Otra persona del equipo revisa el PR (skill `qa-revisar-pr`, reglas de `pw-code-review.md` de la plantilla). Se revisa: Page Objects sin aserciones, selectores estables, sin esperas fijas, títulos con el ID del caso, cada test en la carpeta correcta (`sin-sesion`, `con-sesion` o `api`), pantallas nuevas registradas en `fixtures/index.ts`, sin credenciales ni datos reales y con `npm run verificar` en verde.
5. Con la aprobación, se integra el PR.

**[PUNTO DE CONTROL] PR aprobado · esperando tu confirmación**

---

## Paso 7: Pipeline, ejecución y mantenimiento

| Qué | Dónde se ejecuta | Frecuencia |
| :--- | :--- | :--- |
| Tests web y de API de la plantilla (Playwright) | GitHub Actions: `npm run verificar` y `npx playwright test` | En cada push y PR, y regresión programada (workflow con `schedule`, opcional) |
| Tests de API (Karate, opcional) | Pipeline de CI | En cada PR y regresión programada |
| Tests mobile (opcional) | Dispositivos o nube de dispositivos | Por release y regresión programada |
| Performance (k6, opcional) | Ambiente PRE, local o CI | Bajo demanda y antes de un release |

Después de integrar:

- Se verifica que el caso quedó marcado como automatizado y vinculado al test (el registro se hizo en el paso 6).
- Se revisa el reporte de cada corrida. Un fallo se analiza antes de reintentar: puede ser un bug del producto (se reporta con la skill `qa-reporte-bug`), un problema del test o un problema del ambiente.
- Se mantiene la suite: se actualizan los tests cuando cambia la pantalla o la regla de negocio, y se corrigen los tests inestables o, si no se pueden corregir enseguida, se excluyen con `@BUG` o `@SKIP_WIP` (nunca se dejan fallando en el pipeline; ver contratos, sección 9.9).

### Definición de terminado de una automatización

1. El test corre local y en el pipeline (incluido `npm run verificar`).
2. El título lleva el ID del caso.
3. El test puede fallar (se verificó cambiando el resultado esperado).
4. No hay esperas fijas, credenciales ni datos reales.
5. Hay evidencia en `evidencias/<ID-HISTORIA>/`.
6. El PR está aprobado e integrado y el caso está marcado como automatizado.

---

## Diagrama de responsabilidades

```text
QA Funcional                              QA Automation
────────────                              ─────────────
Analiza la HU ─────────────────────┐
                                   │
Crea los casos en Jira + Xray ─────┤
                                   │
Marca candidatos a automatizar ───>├───> Revisa los candidatos
                                   │
                                   │     Crea la tarea AUTO
                                   │
                                   │     Implementa en la rama y abre el PR
                                   │
                                   │     Revisa el pipeline y reporta resultados
                                   │
Valida la ejecución manual <───────┘     Mantiene la suite de regresión
```
