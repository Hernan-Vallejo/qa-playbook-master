# Cómo Trabajamos con Kiro

> **Para qué sirve:** explica el modelo de trabajo de QA con Kiro: qué agentes, skills y steerings existen, cómo se encadenan, dónde queda cada cosa y cómo se arma el workspace.
> **Quién lo usa:** todo el equipo de QA (funcional y automatización). Es la primera lectura después de la [visión del QA](./vision-qa.md).
> **Cuándo se usa:** al empezar a usar Kiro, al configurar el workspace por primera vez y cada vez que haya dudas sobre qué agente o skill corresponde a una tarea.
> **Si vas a llevar este playbook a otro proyecto:** primero leé [Adaptar el playbook a un proyecto nuevo](./adaptar-a-un-proyecto-nuevo.md): qué se reemplaza (producto, equipos, proyecto de Jira) y qué se conserva.

Kiro es nuestro IDE con IA integrada. Con `qa-playbook` abierto, Kiro conoce nuestro proceso, nuestros estándares, el negocio y los datos de cada equipo, y trabaja con Jira, Xray y GitHub a través de MCP.

> **Nota:** MCP (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a herramientas externas (Jira, Xray, GitHub, Figma) para leer y, con confirmación, escribir en ellas. Cada conexión es un "servidor MCP" (por ejemplo `@atlassian` o `@github`). Xray es el complemento de Jira para gestionar casos de prueba; Jira y Xray se nombran como ejemplos: el proceso sirve con cualquier herramienta equivalente.

Kiro propone y prepara. **El QA decide**: nada se publica en Jira, Xray o GitHub sin su confirmación.

> **Ejemplo:** el producto de ejemplo de este playbook es la **Tienda Demo** (login, catálogo, carrito y checkout), inspirada en https://www.saucedemo.com/. El proyecto de Jira de ejemplo tiene clave `PROJ` (historias `PROJ-123`) y las tareas de automatización usan la clave `AUTO` (por ejemplo `AUTO-45`).

---

## 1. El modelo

Hay **siete agentes**. Cuatro organizan el QA funcional por nivel (sprint, HU de un equipo funcional, HU de un equipo que trabaja con SDD y release), dos el trabajo de automatización y revisión de código, y uno las pruebas de performance. Todos viven en `qa-playbook`.

> **Nota:** HU = historia de usuario. SDD = *Spec-Driven Development* (desarrollo guiado por especificaciones): antes de programar se escribe una especificación (spec) revisable, y QA la revisa y deriva casos y datos de ella. Un *test plan* es el documento (y el ítem en Xray) que agrupa las pruebas de un sprint o de un release.

| Nivel | Cuándo | Agente | Artefacto central |
| :--- | :--- | :--- | :--- |
| **Sprint** | Al terminar la Planning, durante el sprint y al cierre | `qa-sprint` | Test plan del sprint del equipo (ej. "Test Plan Sprint 12 - Equipo Alfa") |
| **HU** (equipo funcional) | Cada vez que el QA toma una historia | `qa-maestro` | Tests, Test Set, Test Execution y bugs de la HU, asociados al test plan del sprint |
| **HU** (equipo SDD) | Cada vez que el QA toma una historia de un equipo que trabaja con Spec-Driven Development | `qa-sdd` | Revisión de la spec, casos, paquete para desarrollo, FWT y auditoría de la ejecución, además de lo mismo que `qa-maestro` |
| **Release** | Solo antes de una salida a producción | `qa-regresion` | Test plan de regresión (ej. "Test Plan Regresión Release 2.4") |
| **Automatización** | Cuando una HU o un bug se automatiza, o un test automatizado falla | `qa-automation` | Código en el repositorio del framework y tests marcados como automatizados en Xray |
| **Performance** | Cuando un equipo pide una prueba de carga o estrés | `qa-performance` | Plan de prueba, corridas en PRE (preproducción) documentadas e informe final |
| **Pull Request** | Para crear o revisar el Pull Request de una rama | `qa-pr` | Pull Request (PR) en GitHub con el formato y los criterios del equipo |

> **Nota:** un *Test Set* es un grupo de tests de una HU; una *Test Execution* es una corrida de esos tests con su resultado. FWT es la revisión estática del código antes del despliegue, propia del flujo SDD (ver la skill `qa-sdd-fwt`). Un Pull Request (PR) es la solicitud para incorporar los cambios de una rama a la rama principal, con revisión de otra persona.

```text
Planning ─> qa-sprint (INICIO_SPRINT) ─> Test plan del sprint
                      │
                      │
   Por cada HU ─> qa-maestro ─> análisis → casos → carga en Xray → ejecución → bugs → re-ejecución → cierre
                      │              (todo se asocia al test plan del sprint)
                      │
   HU con SDD ─> qa-sdd ─> revisión de la spec → análisis → casos → paquete → carga en Xray
                      │                                   → FWT → ejecución y auditoría → cierre
                      │
   Durante el sprint ─> qa-sprint (SEGUIMIENTO) ─> avance, riesgos, HU no planificadas
                      │
                      │
   Fin del sprint ─> qa-sprint (CIERRE_SPRINT) ─> informe y métricas
   Salida a producción ─> qa-regresion ─> alcance → selección de tests → test plan de regresión → informe y veredicto
   Automatización ─> tarea AUTO ─> qa-automation ─> plan → implementación → verificación → registro en Xray
                                          │
                                          │
                         GitHub Actions (valida el QA) ─> qa-pr (CREAR_PR) ─> revisión (REVISAR_PR) ─> rama principal
   Ejecuciones periódicas (GitHub Actions) ─> qa-automation (REPARAR) ─> diagnóstico → corrección o marca
   Pedido de performance ─> tarea AUTO ─> qa-performance ─> análisis → plan → smoke en QA
                                               └─> calibración y corridas en PRE ─> informe
```

Los casos que diseñan `qa-maestro` y `qa-sdd` son la entrada de `qa-automation`. Los dos trabajos se conectan por los tests de Xray.

### Flujo funcional y flujo SDD

Cada equipo trabaja de una de dos formas. El perfil del equipo lo dice en **Modalidad de trabajo** (`05-equipos/`), y Kiro avisa si se usa el agente equivocado. En el ejemplo, Alfa, Beta y Gamma trabajan de forma funcional y **Delta** trabaja con SDD.

| | Flujo funcional | Flujo SDD |
| :--- | :--- | :--- |
| Equipos | Todos los que tienen `Modalidad de trabajo = Funcional` (Alfa, Beta, Gamma) | Los que tienen `SDD`. En el ejemplo: Delta |
| Qué llega a QA | La HU con sus criterios de aceptación | La HU, a veces con menos detalle, y la spec que escribe desarrollo: `requirement.md`, `design.md` y `tasks.md` |
| Agente | `qa-maestro` | `qa-sdd` |
| Fuente del resultado esperado | HU y documentación funcional | HU > requirement > design > tasks. El código y la base nunca redefinen el resultado esperado |
| Cuándo trabaja QA | Cuando la HU llega a QA | Antes del sprint (revisión de la spec, casos) y en paralelo al desarrollo |
| Etapas propias | No tiene | Revisión de la spec, paquete para desarrollo (cobertura y plan de datos), FWT del código antes del deploy, auditoría de cada PASS |
| Dónde comenta QA | En la HU | En las subtareas de QA estándar de la HU |
| DoR y DoD | [definicion-dor-dod.md](../01-estandares-globales/definicion-dor-dod.md) | [definicion-dor-dod-sdd.md](../01-estandares-globales/definicion-dor-dod-sdd.md) |

> **Ejemplo:** el equipo Delta trabaja la épica "Pedidos y seguimiento" (`PROJ-40`) con la historia `PROJ-142` "Consultar el estado de un pedido". Sus documentos de ejemplo están en `04-funcionalidades/vision-cliente/05-pedidos-sdd/`.

Las dos formas usan las mismas skills de análisis, diseño de casos, carga en Xray, bugs, re-ejecución y cierre. El flujo SDD suma sus propias skills (`qa-sdd-*` y `qa-auditar-ejecucion`) y el steering `qa-sdd`.

**La ubicación de la spec la indica el QA** en cada HU (repositorio, rama y ruta, o ruta local). Si no la indica, el agente la pide; nunca la adivina. Cada vez que la lee, registra qué versión usó, para avisar si cambia después.

---

## 2. Las piezas

Hay tres tipos de pieza que trabajan juntas:

- **Steering:** reglas que Kiro tiene en cuenta. Dan el contexto: cómo trabajamos, cómo se escribe un caso, cómo es cada framework.
- **Skill:** un procedimiento concreto, con sus pasos y su punto de control. Por ejemplo, analizar una HU o cargar casos en Xray.
- **Agente:** un rol que encadena varias skills, ordena el trabajo en modos, muestra el estado y tiene permisos acotados.

```text
Agente (rol, modos, permisos, tablero de estado)
   └── usa Skills (procedimiento paso a paso, con punto de control)
          └── siguiendo Steerings (reglas y contexto) + perfil del equipo + documentación funcional
```

### Dónde vive cada pieza

| Pieza | Qué es | Dónde está |
| :--- | :--- | :--- |
| **Agentes** | Los siete agentes de QA | `qa-playbook/.kiro/agents/` |
| **Skills comunes** (`qa-*`) | Procedimientos que sirven para todos: HU, Xray, bugs, sprint, release, plan y registro de automatización, PR | `qa-playbook/.kiro/skills/` |
| **Steerings comunes** (`qa-*`) | Principios de QA, Jira y Xray, Gherkin, seguridad de datos, performance, flujo SDD | `qa-playbook/.kiro/steering/` |
| **Steerings de framework** (`pw-*`) | Contexto del repositorio de automatización, reglas de código y criterios de revisión. En la plantilla incluida: `pw-proyecto` y `pw-code-review` | `.kiro/steering/` de `plantilla-automation` |
| **Perfil del equipo** | Lo que cambia entre equipos: proyecto, board, integrantes, reparto, rutas, versiones | `05-equipos/` |
| **Documentación funcional** | Reglas de negocio, contratos, flujos y datos de prueba de cada funcionalidad | `04-funcionalidades/` |
| **Estándares** | DoR y DoD, catálogo de etiquetas, estructura y plantillas de test plan | `01-estandares-globales/`, `02-qa-funcional/` |
| **Reglas comunes de automatización** | Convenciones compartidas por los frameworks de automatización | [Contratos](./kiro/contratos.md) |
| **Espacio de trabajo** | Lo que se va produciendo en cada etapa, para retomar y revisar. Trae dos planillas personales: `indice-general.md` (todo el trabajo en curso) y `validacion-skills.md` (fallas y mejoras de agentes y skills, para enviar a quien mantiene el playbook) | `.qa-work/` (local; solo las dos planillas, con una fila de ejemplo, están en el repositorio) |

Las skills son iguales para todos los equipos: lo propio de cada equipo lo leen del perfil. El agente de automatización lee lo propio del framework del repositorio, que tiene que estar en el workspace (sección 6).

> **Nota:** `qa-playbook` incluye 27 skills en total, todas con prefijo `qa-`. `plantilla-automation` trae Playwright para pruebas de web y un ejemplo de pruebas de API hechas con Playwright. Frameworks adicionales (Karate para API, k6 para performance, herramientas mobile) son opciones que el equipo puede sumar con sus propios steerings y skills; no vienen incluidos en la plantilla.

### Cuándo se carga cada steering

| Carga | Qué significa | Steerings |
| :--- | :--- | :--- |
| Siempre | Está en toda conversación | `qa-principios` |
| Por tema | Kiro lo carga solo cuando la tarea trata de ese tema | `qa-jira-xray`, `qa-gherkin`, `qa-seguridad-datos`, `qa-performance`, `qa-sdd`, `pw-proyecto` |
| A pedido | Se usa cuando lo pide una skill o el QA con `#nombre` | `pw-code-review` |

Por eso las reglas valen igual con un agente o con una skill suelta: los steerings se cargan por el tema y por los archivos, no por el agente.

> **Nota:** si el equipo suma otros frameworks, puede agregar steerings que se carguen "por tipo de archivo" (por ejemplo, al abrir un `.feature` de Karate o un `.js` de k6). Los steerings por tipo de archivo no vienen incluidos en la plantilla.

### Agentes y modos

Un *modo* es una clave que le indica al agente qué etapa ejecutar. El modo que lleva el nombre del flujo (`QA`, `SDD`, `AUTOMATIZAR`, `PERFORMANCE`) ejecuta el flujo completo, etapa por etapa.

| Agente | Modos |
| :--- | :--- |
| `qa-maestro` | `ANALIZAR_HU`, `GENERAR_TESTS`, `CARGAR_XRAY`, `REPORTAR_BUG`, `REEJECUTAR`, `CIERRE_HU`, `VALIDAR_TESTS`, `AUDITAR_EJECUCION`, `ACTUALIZAR_DOCUMENTACION`, `ESTADO` y `QA` (flujo completo) |
| `qa-sdd` | `REVISAR_SPEC`, `ANALIZAR`, `GENERAR_TESTS`, `PAQUETE`, `CARGAR_XRAY`, `FWT`, `EJECUTAR`, `REPORTAR_BUG`, `REEJECUTAR`, `CIERRE_HU`, `ESTADO` y `SDD` (flujo completo) |
| `qa-sprint` | `INICIO_SPRINT`, `SEGUIMIENTO`, `CIERRE_SPRINT` |
| `qa-regresion` | `PREPARAR_REGRESION`, `INFORME_REGRESION` |
| `qa-automation` | `PLANIFICAR`, `IMPLEMENTAR`, `REPARAR`, `REGISTRAR_XRAY`, `ESTADO`, `AUTOMATIZAR` (flujo completo) |
| `qa-performance` | `ANALIZAR`, `PLANIFICAR`, `IMPLEMENTAR`, `CALIBRAR`, `EJECUTAR`, `INFORMAR`, `REPARAR`, `ESTADO`, `PERFORMANCE` (flujo completo) |
| `qa-pr` | `REVISAR_PR`, `CREAR_PR` |

Para usar un agente, elegirlo en el selector de agentes del chat de Kiro y pedirle el modo con la clave: `ANALIZAR_HU PROJ-123`, `AUTOMATIZAR AUTO-45 playwright`, `REVISAR_PR playwright #245`.

### Agente o skill suelta

Cualquier skill se puede usar sola, sin agente: pidiéndola en el chat con sus palabras ("analizá la HU PROJ-123", "creá la tarea de automatización de PROJ-123") o con `/nombre-de-la-skill`. La skill sigue sus pasos, sus puntos de control y los steerings igual que dentro del agente.

| Con el agente | Con la skill suelta |
| :--- | :--- |
| Encadena etapas (por ejemplo, análisis → casos → carga en Xray) y propone la siguiente | Hace una sola tarea y sugiere el siguiente paso |
| Muestra el tablero de estado de la HU o de la tarea | No muestra el tablero |
| Permisos acotados: no puede borrar ni escribir fuera de lo suyo | Usa los permisos generales de Kiro, que piden aprobación para cada escritura |
| Verifica al inicio el equipo, el test plan del sprint, el repositorio y la rama | La skill verifica solo lo que necesita |

**Recomendación:** usar el agente para el trabajo de todos los días y la skill suelta para una tarea puntual o para las skills que no pertenecen a ningún agente.

### Qué skill sirve para qué

| Skill | Para qué | Agente que la usa |
| :--- | :--- | :--- |
| `qa-analisis-hu` | Analizar una HU: readiness (DoR), riesgos, impacto, regresión | `qa-maestro` (`ANALIZAR_HU`); `qa-sdd` (`ANALIZAR`); `qa-automation` si no hay casos |
| `qa-diseno-casos` | Matriz de cobertura y casos Gherkin | `qa-maestro` y `qa-sdd` (`GENERAR_TESTS`); `qa-automation` si no hay casos |
| `qa-carga-xray` | Cargar los casos en Xray con Test Set, Test Execution y vínculos | `qa-maestro` y `qa-sdd` (`CARGAR_XRAY`) |
| `qa-reporte-bug` | Redactar y crear un bug en Jira | `qa-maestro` y `qa-sdd` (`REPORTAR_BUG`); `qa-automation` si un test detecta un bug |
| `qa-reejecucion` | Nueva Test Execution para re-test | `qa-maestro` y `qa-sdd` (`REEJECUTAR`) |
| `qa-cierre-hu` | Cierre de QA de la HU | `qa-maestro` y `qa-sdd` (`CIERRE_HU`) |
| `qa-sdd-revision-spec` | Revisar la spec de una HU con SDD: HU ↔ requirement ↔ design ↔ tasks | `qa-sdd` (`REVISAR_SPEC`) |
| `qa-sdd-cobertura-dev` | Qué conviene que cubra desarrollo con unitarios o mocks y qué queda para QA | `qa-sdd` (`PAQUETE`) |
| `qa-sdd-plan-datos` | Plan de datos de prueba por caso, sin crear datos | `qa-sdd` (`PAQUETE`) |
| `qa-sdd-fwt` | Revisión estática del código antes del deploy: alineación, contrato de API, seguridad, testabilidad y unitarios | `qa-sdd` (`FWT`) |
| `qa-auditar-ejecucion` | Verificar que cada PASS validó el resultado esperado | `qa-sdd` (`EJECUTAR`); `qa-maestro` (`AUDITAR_EJECUCION`, opcional); también suelta, para cualquier equipo |
| `qa-revision-casos` | Revisar la calidad de casos existentes | `qa-maestro` (`VALIDAR_TESTS`) |
| `qa-actualizar-contexto` | Actualizar la documentación funcional del playbook | `qa-maestro` (`ACTUALIZAR_DOCUMENTACION`); `qa-sdd` la ofrece al cerrar la HU; también suelta |
| `qa-inicio-sprint` | Test plan y carpetas del sprint | `qa-sprint` (`INICIO_SPRINT`) |
| `qa-seguimiento-sprint` | Avance y riesgos del sprint | `qa-sprint` (`SEGUIMIENTO`) |
| `qa-informe-sprint` | Informe de cierre del sprint | `qa-sprint` (`CIERRE_SPRINT`) |
| `qa-preparar-regresion` | Alcance y test plan de regresión | `qa-regresion` (`PREPARAR_REGRESION`) |
| `qa-informe-regresion` | Informe y veredicto de la regresión | `qa-regresion` (`INFORME_REGRESION`) |
| `qa-plan-automatizacion` | Qué se automatiza, dónde y cómo | `qa-automation` (`PLANIFICAR`) |
| `qa-performance-analisis` | Perfil operacional y modelo de carga | `qa-performance` (`ANALIZAR`) |
| `qa-performance-plan` | Plan de la prueba de performance | `qa-performance` (`PLANIFICAR`) |
| `qa-performance-informe` | Analizar cada corrida en PRE y armar el informe final | `qa-performance` (`EJECUTAR`, `INFORMAR`) |
| `qa-registro-automatizacion` | Marcar en Xray lo automatizado | `qa-automation` (`REGISTRAR_XRAY`) |
| `qa-crear-pr` | Crear el PR de una rama | `qa-pr` (`CREAR_PR`) |
| `qa-revisar-pr` | Revisar un PR | `qa-pr` (`REVISAR_PR`) |
| `qa-crear-tarea-automatizacion` | Crear la tarea de automatización en el proyecto `AUTO`, indicando el equipo | Ninguno: **solo suelta** (`qa-performance` la propone cuando falta la tarea de un pedido de performance) |
| `qa-escribir-skills` | Crear o corregir una skill | Ninguno: **solo suelta** |

> **Nota:** la implementación y la reparación de tests de Playwright las hace `qa-automation` (modos `IMPLEMENTAR` y `REPARAR`) siguiendo los steerings `pw-proyecto` y `pw-code-review` de `plantilla-automation`. Si el equipo suma otro framework, puede agregar sus propias skills de implementación y reparación.

---

## 3. El control del QA

Kiro trabaja por etapas y se detiene en cada **punto de control**:

```text
[PUNTO DE CONTROL] Matriz de cobertura · esperando tu confirmación
```

En cada uno muestra lo que hizo o lo que va a hacer y espera una respuesta explícita. Si el QA pide un ajuste, Kiro corrige y vuelve a mostrar.

| Regla | Por qué |
| :--- | :--- |
| Nada se publica ni se transiciona sin confirmación | El QA es responsable de lo que queda en Jira y Xray |
| Una etapa por vez | Se revisa a medida que se avanza y un error se corrige antes de seguir |
| La matriz de cobertura se aprueba antes de escribir los casos | Es el punto que más créditos y retrabajo ahorra |
| No se inventan datos ni etiquetas | Si falta información, Kiro la pide |
| Nada se borra | Los tests se deprecan; los vínculos erróneos los corrige el QA |

Además, los agentes tienen permisos: leen libremente, piden aprobación para escribir en Jira, Xray y GitHub, y no pueden borrar.

### Profundidad

Rápido, Estándar (por defecto) o Exhaustivo. Se indica al pedir la tarea, por ejemplo "analizá la HU PROJ-123 en modo rápido".

---

## 4. Dónde queda cada cosa

| Qué | Dónde |
| :--- | :--- |
| HU, bugs, comentarios | Jira |
| Casos de prueba, Test Sets, Test Executions, test plans | Xray |
| Evidencias | El repositorio documental del equipo (por ejemplo SharePoint o Drive), con el link registrado en la HU, el Test Set, la Test Execution y cada test. En `plantilla-automation`, las capturas de los tests automatizados se guardan en `evidencias/<ID-HISTORIA>/` |
| Trabajo en curso | `.qa-work/<HU>/`, `.qa-work/sprint-<equipo>-<N>/`, `.qa-work/regresion-<equipo>-<release>/`, `.qa-work/<AUTO-XX>/automatizacion/` y `.qa-work/<AUTO-XX>/performance/` (lista completa en [contratos](./kiro/contratos.md), sección 3.5) |
| Conocimiento del negocio | `04-funcionalidades/`, actualizado con `ACTUALIZAR_DOCUMENTACION` y subido por Pull Request |

Jira y Xray son la fuente de verdad de lo publicado. `.qa-work/` permite retomar una HU en otra sesión desde la última etapa aprobada.

---

## 5. Herramientas conectadas (MCP)

| Herramienta | Servidor MCP | Para qué |
| :--- | :--- | :--- |
| Jira y Xray (Atlassian) | `@atlassian` | Leer HU, comentar, crear bugs, transicionar; tests, Test Sets, Test Executions, test plans y métricas |
| GitHub | `@github` | Código y Pull Requests de los repositorios de automatización; resultados de GitHub Actions (solo lectura) |
| Figma (opcional) | `@figma` | Leer diseños de pantallas para derivar casos. Ver [configurar-figma-mcp.md](../03-qa-automatizacion/configurar-figma-mcp.md) |
| Base de datos de QA | Servidor MCP de consulta de solo lectura, si el equipo lo configura | Verificar datos (base ficticia `tienda_qa`), siempre con consultas `SELECT` |

Cada QA configura sus propias credenciales. Kiro nunca las pide ni las escribe.

> **Atención:** las credenciales van en variables de entorno o en la configuración personal de cada QA, nunca en archivos del repositorio. Las únicas credenciales que aparecen en este playbook son las del sitio demo público SauceDemo (usuario `standard_user`, clave `secret_sauce`).

---

## 6. El workspace QA-WORKSPACE

Todos trabajamos en un workspace de Kiro llamado **QA-WORKSPACE**. Es siempre el mismo y es donde viven los agentes: los agentes, las skills comunes y los steerings de QA están solo en `qa-playbook`; cada repositorio de automatización aporta únicamente los steerings (y skills, si las tiene) de su framework.

> **Nota:** un *workspace* de Kiro es un conjunto de carpetas abiertas a la vez, guardado en un archivo `.code-workspace`. Se arma con dos repositorios: `qa-playbook` (este repositorio) y `plantilla-automation` (la plantilla de Playwright incluida).

| Carpeta del workspace | Cuándo |
| :--- | :--- |
| `qa-playbook` | Siempre. Sin él no hay agentes |
| `plantilla-automation` | Para automatizar o revisar pruebas de front con Playwright |

Cada QA elige: tener los dos repositorios en el workspace, o trabajar solo con `qa-playbook` (un QA funcional puede hacerlo). Si un agente necesita un repositorio que no está, lo pide y no sigue. Si el equipo suma más repositorios (por ejemplo, uno para API o para performance), se agregan al workspace de la misma forma.

### Crear el workspace

1. Clonar `qa-playbook` y `plantilla-automation` desde GitHub.
2. En Kiro: **Archivo → Abrir carpeta** y elegir `qa-playbook`.
3. **Archivo → Agregar carpeta al workspace** y elegir `plantilla-automation`.
4. **Archivo → Guardar workspace como…** con el nombre `qa-workspace.code-workspace`, fuera de los repositorios (por ejemplo, en una carpeta `workspaces/`).
5. Abrir siempre ese archivo para trabajar.

Ejemplo de `qa-workspace.code-workspace` con los repositorios clonados en una carpeta `proyectos/` y el workspace en `proyectos/workspaces/`. Las rutas son relativas al archivo; se ajustan a donde cada uno clonó los repositorios:

```json
{
  "folders": [
    { "name": "qa-playbook", "path": "../qa-playbook" },
    { "name": "plantilla-automation", "path": "../plantilla-automation" }
  ],
  "settings": {}
}
```

> **Nota:** JSON no admite comentarios, por eso la explicación va acá. `folders` es la lista de carpetas del workspace; `name` es el nombre que se ve en el explorador de Kiro; `path` es la ruta relativa al archivo `.code-workspace`; `settings` queda vacío salvo que el equipo quiera configuraciones compartidas.

`qa-playbook` va primero: así los agentes, skills y steerings de QA se cargan siempre, y `.qa-work/` queda dentro del playbook.

### Trabajo de automatización

Los modos de `qa-automation` y `qa-pr` están en la sección 2. Ejemplos: `AUTOMATIZAR AUTO-45 playwright`, `REPARAR playwright tests/sin-sesion/login.spec.ts`, `REVISAR_PR playwright #245`, `CREAR_PR playwright AUTO-45`. El framework y las reglas de cada repositorio están en [contratos](./kiro/contratos.md) y en [guia-plantilla-automation.md](../03-qa-automatizacion/guia-plantilla-automation.md).

La rama de trabajo, los commits y el push los hace el QA. Los agentes proponen el mensaje de commit y `qa-pr` crea el PR con confirmación.

> **Ejemplo:** rama `feature/AUTO-45-login-negativos`; commit `AUTO-45: agrega casos negativos de login`.

Ciclo de una tarea de automatización:

1. Crear la tarea en el proyecto `AUTO` con la skill `qa-crear-tarea-automatizacion`, indicando el equipo.
2. Crear la rama `feature/<CLAVE>-<resumen>` (por ejemplo `feature/AUTO-45-login-negativos`) y trabajarla con `qa-automation`.
3. Antes del PR, ejecutar los controles de la rama (`npm run verificar`: tipos, reglas de ESLint y formato de Prettier) y los tests (`npx playwright test`), y verificar que pasen. GitHub Actions repite ambas cosas en cada push y PR, y sube el reporte.
4. Crear el PR con `qa-pr` (`CREAR_PR`).

Las ejecuciones periódicas corren en GitHub Actions; sus fallos se revisan con `REPARAR` (por workflow o por la tarea de revisión que se cree para cada falla). Las convenciones comunes de los tests (Page Object Model, selectores estables como `data-test`, sin esperas fijas, IDs de caso en el título del test) están en la [guía de la plantilla](../03-qa-automatizacion/guia-plantilla-automation.md).

> **Nota:** POM (*Page Object Model*) es el patrón en el que cada pantalla tiene una clase (`pages/LoginPage.ts`) que sabe cómo interactuar con ella, y los tests (`tests/sin-sesion/login.spec.ts`) deciden qué se espera con las aserciones `expect`.

#### Qué trae `plantilla-automation`

| Pieza | Para qué sirve |
| :--- | :--- |
| `pages/` | Page Objects: `BasePage.ts` (clase base) más `LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts` y `CheckoutPage.ts` |
| `fixtures/index.ts` | Entrega los Page Objects ya armados como parámetros del test (`async ({ loginPage }) => ...`) |
| `tests/sin-sesion/` y `tests/con-sesion/` | Tests de web que arrancan sin usuario autenticado o con la sesión ya iniciada. La sesión la guarda `tests/auth.setup.ts` (usa `config/sesion.ts`) y los proyectos `*-con-sesion` la reutilizan |
| `api/` y `tests/api/` | Cliente de API (`UsuariosApi.ts`) y tests de API con el proyecto `api` de Playwright |
| `config/ambientes.ts` | URLs por ambiente (variable `TEST_ENV` con valor `demo`, `qa` o `pre`) y bloqueo de producción |
| `data/` y `utils/evidencia.ts` | Datos de prueba ficticios y guardado de capturas en `evidencias/<ID-HISTORIA>/` |
| ESLint y Prettier | `npm run verificar` revisa tipos, reglas (por ejemplo, sin `waitForTimeout`) y formato |
| `.github/workflows/playwright.yml` y `.kiro/steering/` | Pipeline de CI y los steerings `pw-proyecto` y `pw-code-review` |

---

## 7. Para profundizar

- [Visión del QA](./vision-qa.md)
- [Contratos de los componentes](./kiro/contratos.md): cómo se construye cada agente, skill, steering y perfil, puntos de control y espacio de trabajo
- [Decisiones de la homologación](./kiro/decisiones.md): qué se decidió y por qué
- [Plantillas](./kiro/plantillas/): para crear skills nuevas o el perfil de un equipo
