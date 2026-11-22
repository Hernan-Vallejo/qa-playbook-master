# Homologación de Kiro para QA: análisis y decisiones de unificación

> **Para qué sirve:** registra el análisis, las decisiones (numeradas D-01, D-02, ...), las reglas técnicas verificadas y el plan con que se construyeron los agentes, skills, steerings y hooks homologados de QA. Es la memoria de "por qué está hecho así".
> **Quién lo usa:** el responsable del playbook y los QA que proponen cambios; las skills y los contratos citan sus decisiones (por ejemplo "D-83") y su sección 5 de reglas técnicas.
> **Cuándo se usa:** antes de cambiar un componente (para ver qué se decidió y por qué), al agregar una decisión nueva y al revisar el estado de la implementación.

| Dato | Valor |
| :--- | :--- |
| Estado | En definición |
| Última actualización | 2026-11-21 |
| Alcance inicial | Flujo de trabajo del QA Manual (funcional) |
| Insumos | Configuración inicial del Equipo Beta (checkout y pagos), configuración inicial del Equipo Alfa (catálogo y carrito), `.kiro` de los repositorios de automatización |

Este documento registra el análisis, las decisiones y el plan para construir los agentes, skills, steerings y hooks homologados de QA. Se actualiza en cada paso de la implementación.

> **Glosario rápido:** **HU** = historia de usuario. **Homologar** = validar un componente para que lo use todo el equipo. **Skill / agente / steering / hook** = piezas de Kiro (procedimiento, rol, reglas y disparador). **MCP** = *Model Context Protocol*, conexión de Kiro con herramientas externas. **Xray** = herramienta de gestión de pruebas dentro de Jira (Test, Test Set, Test Execution y Test Plan). **PO** = *Product Owner*. **SDD** = *Spec-Driven Development*. **POM** = *Page Object Model*. **CI** = integración continua (GitHub Actions). **PR** = *Pull Request*. **ISTQB** = organización que define estándares y certificaciones de testing.

---

## 1. Objetivo

Contar con un conjunto único de componentes de Kiro para todo el equipo de QA, que:

- Tenga a `qa-playbook` como cerebro: reglas, procedimientos, agentes y documentación funcional viven acá.
- Sirva a todos los equipos sin copiar ni editar archivos: lo que cambia entre equipos va en un perfil.
- Mantenga al QA en control: cada paso propone y el QA confirma antes de publicar.
- Use los créditos de Kiro de forma eficiente: pasos cortos, revisión a medida que se avanza, carga de contexto solo cuando hace falta.
- Se base en criterios ISTQB y en los estándares de QA del equipo.

---

## 2. Principios de diseño

1. **El playbook es el hub.** Todos los QA tienen siempre abierto `qa-playbook`. Los repositorios de automatización se suman al workspace según la tarea.
2. **Agentes por responsabilidad, skills por procedimiento.** El QA pide lo que necesita hacer; no tiene que saber qué combinación de componentes usar.
3. **Tres niveles de control (human in the loop).**
   - **Skill:** ejecuta un procedimiento y al terminar muestra lo que propone o lo que va a crear, y pide confirmación.
   - **Agente:** encadena skills con puntos de control obligatorios y limita las herramientas de escritura por permisos.
   - **Workflow:** etapa posterior, para los equipos que trabajan con SDD (Equipo Delta).
4. **Fuente de verdad única.** Jira y Xray son la fuente de lo publicado. El trabajo en curso se guarda en `.qa-work/` (D-38).
5. **Separar criterio, procedimiento y contexto.** El criterio senior es común; el procedimiento vive en la skill; los datos del equipo viven en el perfil; el conocimiento funcional vive en `04-funcionalidades/`.
6. **Nada se carga en cada mensaje sin necesidad.** Solo los principios básicos van en modo `always`; el resto se activa a pedido.

---

## 3. Insumos analizados

### 3.1 Configuración inicial del Equipo Beta (checkout y pagos)

| Componente | Tipo | Qué hace |
| :--- | :--- | :--- |
| `qa-senior` | Steering manual (`#qa-senior`) | QA Senior estratégico con 15 comandos (`ANALIZAR_HU`, `GENERAR_TESTS`, `REPORTAR_BUG`, `QUALITY_GATE`, etc.), principios, checklist integral (a-g), motores de riesgo, impacto, regresión e integración, formatos de salida |
| `preparar-sprint-qa` | Hook `UserPromptSubmit` | Carpetas de evidencias en el repositorio documental y Test Plan del sprint desde plantilla HTML |
| `mapeo-seguimiento-sprint-qa` | Hook `UserPromptSubmit` | Valida y sube los tests de una HU, crea Test Set y Test Execution, vínculos y link de evidencias en 4 lugares |
| `reportar-bug-qa` | Hook `UserPromptSubmit` | Crea el bug con capa, ambiente, versiones, épica y vínculo al test |
| `reejecutar-qa` | Hook `UserPromptSubmit` | Crea la re-ejecución `#2`, `#3` con los mismos vínculos y el link al bug |
| `informe-cierre-sprint-qa` | Hook `UserPromptSubmit` | Informe de cierre con métricas desde la API de Xray y semáforo |
| `preparar-regresion-qa` | Hook `UserPromptSubmit` | Test Plan de regresión y carpeta de evidencias |
| `informe-regresion-release-qa` | Hook `UserPromptSubmit` | Informe de regresión con veredicto de release |
| `_plantilla-test-plan*.html` | Plantillas | Descripción del Test Plan de sprint y de regresión |

> **Nota:** un hook `UserPromptSubmit` se dispara con cada mensaje que escribe el QA. Un Test Plan es el artefacto de Xray que agrupa lo que se prueba en un sprint o en un release.

### 3.2 Configuración inicial del Equipo Alfa (catálogo y carrito)

| Componente | Tipo | Qué hace |
| :--- | :--- | :--- |
| `carpetas-sprint` | Skill | Carpetas de evidencias del sprint en el repositorio documental, por área |
| `xray-sprint` | Skill | Casos Gherkin desde los criterios de aceptación, carpetas en Xray, Test Set y Test Execution por HU, reparto entre QAs, subtarea, comentario de evidencia, Test Plan del sprint |
| `detectar-sprint-nuevo` | Hook `SessionStart` (deshabilitado) | Detecta un sprint activo sin procesar y propone correr las skills |
| `.kiro/state/*.json` | Estado local | Registro de sprints procesados |
| `bdd-standards`, `dor-dod-rules`, `jira-rules` | Steerings | Versiones anteriores del playbook |

### 3.3 Hallazgos

- **Hooks que se disparan con cada mensaje.** Los 7 hooks del Equipo Beta son `UserPromptSubmit` y suman unos 64 KB de instrucciones que se inyectan en cada pregunta del QA. Aumentan el consumo de créditos y generan interferencia. Se convierten en skills.
- **Datos del equipo dentro de los procedimientos.** AccountIds (identificadores de usuario de Jira), boards, labels, versiones, rutas del repositorio documental y nombres de QA están escritos en los hooks y skills. Pasan al perfil del equipo o se obtienen de la sesión.
- **`qa-senior` mezcla tres capas:** criterio senior (común), procedimientos (Xray, Jira, repositorio documental) y contexto de un módulo (URLs, queries, rutas). Se separan (ver sección 6).
- **Datos desactualizados.** `preparar-regresion-qa` indica que no hay API de Xray (error 401); hoy el MCP de Xray funciona.
- **Las transiciones dependen del proyecto.** El id numérico de una transición cambia entre proyectos (por ejemplo, el mismo número es "Cancelar" en uno e "Iniciar" en otro). Las skills buscan transiciones por nombre, nunca por id fijo.
- **Base común entre ambos.** Casos tipo Cucumber, Test Set y Test Execution por HU, vínculo `Test` con dirección "is tested by", Test Plan por sprint, carpeta de evidencias por HU, aprobación previa y anti-duplicación. Esto pasa directo al estándar.

---

## 4. Decisiones

> **Nota:** cada decisión tiene un ID estable (`D-NN`) que otros documentos citan; por eso la numeración se conserva aunque una decisión se reemplace por otra (se indica en su texto). Las decisiones se listan en orden numérico.

| ID | Tema | Decisión | Fecha |
| :--- | :--- | :--- | :--- |
| D-01 | Nombre del test | `<Área>.<Capa>.<título>`. El Área es la visión (ver `04-funcionalidades/`) y la Capa es `FRONT`, `BFF`, `BACK` o `BACKOFFICE`. Ejemplo: `Cliente.FRONT.Visualización del modal de sesión por expirar` | 2026-10-28 |
| D-02 | Nombre de Test Set y Test Execution | `<CLAVE> <título de la HU>`, sin prefijo "Test Set -" ni "Test Execution -". El issuetype ya indica qué es | 2026-10-28 |
| D-03 | Scenario Outline | Usarlo cuando el test valida la misma lógica con distintos datos u opciones. Si la lógica cambia, escenarios independientes | 2026-10-28 |
| D-04 | Labels | Niveles de general a puntual: equipo, capa, tipo de caso, funcionalidad y funcionalidad específica de la HU o tarea que se está probando (categoría Historia / Servicio del catálogo), más Módulo, Versión y Extra opcionales. Formato en minúsculas con guion bajo, sin tildes. La lista completa, el orden y los valores están en `02-qa-funcional/catalogo-etiquetas.md` (fuente única). La decisión original usaba tres niveles y MAYÚSCULAS; se actualizó cuando el catálogo pasó a ser genérico. No confundir con la **Capa del nombre del test** (`FRONT`, `BFF`, `BACK`, `BACKOFFICE`, D-01), que es otro dato | 2026-10-28 |
| D-05 | Campo Regresión | Se completa siempre en cada test (`Sí` / `No`). Nunca se usa una label `REGRESION` en los tests | 2026-10-28 |
| D-06 | Descripción del test | Base común: objetivo + referencias (Figma, Swagger, SQL de solo lectura). El bloque técnico es opcional según el perfil del equipo | 2026-10-28 |
| D-07 | Link de evidencias | En 4 lugares: enlace web en la HU, comentario del test-run de cada test, comentario en el Test Set y comentario en la Test Execution | 2026-10-28 |
| D-08 | Carpetas del repositorio documental | `<CLAVE> <summary>` (por ejemplo `PROJ-123 Login de usuarios`). Se saltean las HU de arrastre que ya tienen carpeta en un sprint anterior | 2026-10-28 |
| D-09 | Test Plan | Se crea desde una plantilla versionada en el playbook (reproducible). No se copia el plan anterior. Detallada en D-42 | 2026-10-28 |
| D-10 | Subtarea QA | La skill propone la transición de la subtarea y el QA confirma | 2026-10-28 |
| D-11 | Estado | Jira y Xray son la fuente de lo publicado. Ajustada por D-38 | 2026-10-28 |
| D-12 | Firma de publicaciones | `Elaborado por <USUARIO JIRA> y Kiro` | 2026-10-28 |
| D-13 | Documentación funcional | Vive en `04-funcionalidades/<visión>/<NN-funcionalidad>/`. Cada carpeta tiene `reglas-negocio.md` y los documentos extra que necesite. Los steerings y el perfil apuntan a la carpeta de cada equipo | 2026-10-28 |
| D-14 | Filtro de HU a probar | El campo "Requiere pruebas de testing" existe en las HU de todos los equipos y se usa como filtro común | 2026-10-28 |
| D-15 | Datos de las personas | No se guardan en archivos. El usuario y su accountId se obtienen de la sesión del MCP de Atlassian (`atlassianUserInfo`) | 2026-10-28 |
| D-16 | Hook de inicio de sprint | Se renombra a un nombre claro (inicio de sprint), es opcional y se ejecuta de forma manual. No corre al iniciar cada sesión | 2026-10-28 |
| D-17 | Tipo de test en Xray | Cucumber | 2026-10-28 |
| D-18 | Claves de trabajo | Automation usa tareas `AUTO`. Los QA de los equipos usan sus subtareas (ej. `PROJ-124`) de definición y de ejecución de casos | 2026-10-28 |
| D-19 | Catálogo de etiquetas | La planilla de etiquetas (Excel) se convierte en `02-qa-funcional/catalogo-etiquetas.md`, que pasa a ser la fuente oficial. Se usan las etiquetas existentes; una etiqueta nueva se agrega primero al catálogo y recién después se usa en Jira o Xray | 2026-10-28 |
| D-20 | Orden y obligatoriedad de etiquetas | Obligatorias: Equipo, Capa, Tipo de caso (`positivo`, `negativo` o `borde`), Funcionalidad, Historia / Servicio. Opcionales: Módulo, Versión, Extra. La visión no es una etiqueta: va en el nombre del test como Área (D-01). Las skills consultan el catálogo antes de proponer y preguntan al QA si hay dudas | 2026-10-28 |
| D-21 | Tests integrales | Llevan las etiquetas de cada capa que recorren más `integracion`, para todos los equipos. La skill pregunta antes de suponer que un test es integral | 2026-10-28 |
| D-22 | Etiquetas de capa anteriores | Las variantes anteriores de la etiqueta de capa (`frontend`, `backend`, `front-end`, `back-end`) sirven solo para buscar tests existentes; en tests nuevos se usan las del catálogo (`front`, `api`, `mobile`, `performance`). Una etiqueta equivalente a otra no se duplica (catálogo, sección 1) | 2026-10-28 |
| D-23 | Reparto entre QAs | Depende del equipo. La primera vez, la skill pregunta si el QA trabaja solo o con otros. Si son varios, pregunta quiénes son y cómo dividen el trabajo (lo deciden ellos o lo reparte Kiro). La respuesta queda en el perfil del equipo | 2026-10-28 |
| D-24 | Contexto funcional en las skills | Las skills leen todos los documentos disponibles en la carpeta de la funcionalidad del equipo en `04-funcionalidades/`. No dependen de nombres de archivo específicos de un módulo | 2026-10-28 |
| D-25 | Etiquetas confirmadas | Se agregan, a modo de ejemplo del criterio, una etiqueta de Equipo (`gamma`), una de Funcionalidad (`carrito`) y una de Módulo (`tienda_web`). Para mobile se usa `mobile`, no `mob`. Todas están en el catálogo de etiquetas | 2026-10-28 |
| D-26 | Automatización y tipo de artefacto | No se usan las etiquetas `testing_manual`, `TEST_SET`, `TEST_EXECUTION` ni `TEST_PLAN`. La automatización se registra en los campos Automatizado y Estado Automatización del test; el tipo de artefacto lo indica el issuetype | 2026-10-28 |
| D-27 | Ubicación de los perfiles de equipo | Un archivo por equipo en `05-equipos/<equipo>.md`. El perfil apunta a las carpetas de `04-funcionalidades/` que usa el equipo, porque un equipo puede trabajar sobre varias funcionalidades (ej. un equipo con canal web y mobile) | 2026-10-28 |
| D-28 | Borradores locales | Reemplazada por D-38 | 2026-10-28 |
| D-29 | Estados de homologación | Cada componente tiene un estado: Experimental, En evaluación, Homologado o Retirado | 2026-10-28 |
| D-30 | Caracteres prohibidos en el repositorio documental | Para todos los equipos, los caracteres `" * : < > ? / \ \|` se reemplazan por `-` en nombres de carpeta y archivo (SharePoint y otros repositorios documentales no los admiten) | 2026-10-28 |
| D-31 | Entrada en vigencia de los formatos nuevos | Los nombres nuevos aplican desde el sprint en que se publiquen los agentes y skills homologados. Lo ya creado no se modifica | 2026-10-28 |
| D-32 | Canal en el nombre del test | La diferencia entre web y mobile queda en las etiquetas de capa (`front` y `mobile`), no en el nombre. Se documenta en el perfil del equipo cómo buscar | 2026-10-28 |
| D-33 | Steerings del playbook | `qa-principios` (always), `qa-jira-xray`, `qa-gherkin` y `qa-seguridad-datos` (auto) reemplazan a `bdd-standards`, `dor-dod-rules` y `jira-rules`. El DoR y DoD pasan a `01-estandares-globales/definicion-dor-dod.md` | 2026-10-28 |
| D-34 | Labels de DoR y DoD | No se usan las labels `DoR-Passed`, `DoR-Pending`, `DoD-Passed`, `QA-Functional` ni `QA-Automated-Candidate` (sin uso en Jira en el último año). El resultado del análisis va en el campo QA Análisis; la automatización, en sus campos | 2026-10-28 |
| D-35 | Nombre del agente | El agente inicial de QA funcional se llama `qa-maestro`. Conserva los modos de `qa-senior` (`ANALIZAR_HU`, `GENERAR_TESTS`, `REPORTAR_BUG`, ...) | 2026-10-28 |
| D-36 | Permisos del agente | Lectura en Jira, Xray, Figma, bases de datos y repositorio documental sin pedir permiso. Escrituras en Jira, Xray y repositorio documental con aprobación (`ask`), además del punto de control. Borrados denegados (`deny`). Escritura local solo en `.qa-work/`; cambios al perfil, catálogo o documentación funcional con aprobación | 2026-10-28 |
| D-37 | Nombre de los puntos de control | Los gates G0 a G6 pasan a llamarse por su etapa: Contexto, Análisis, Matriz de cobertura, Casos de prueba, Carga en Xray, Reporte de bug y Cierre. Cada uno se anuncia con `[PUNTO DE CONTROL] <etapa> · esperando tu confirmación` (sin emojis) y, en el flujo completo, con el recorrido | 2026-10-28 |
| D-38 | Espacio de trabajo local | Cada HU tiene `.qa-work/<CLAVE-HU>/` con `indice.md`, un archivo por etapa y `bugs/`. Las skills y el agente lo verifican al iniciar, lo crean si falta, reutilizan el trabajo previo y guardan cada etapa con estado Borrador, Aprobado o Publicado. Jira y Xray siguen siendo la fuente de lo publicado (contratos, sección 3.5) | 2026-10-28 |
| D-39 | Tres niveles de trabajo | Sprint (`qa-sprint`), HU (`qa-maestro`) y release (`qa-regresion`). Agentes separados; las skills siguen siendo la unidad de trabajo | 2026-10-28 |
| D-40 | Test Plan del sprint | Uno por equipo y sprint (ej. "Test Plan Sprint 12 - Equipo Alfa"), creado al terminar la Planning con `qa-sprint`. Todo lo de las HU (tests, sets, ejecuciones, bugs, riesgos) se asocia a él. Quién lo crea y a quién se asigna lo define cada equipo; si el perfil no lo tiene, el agente pregunta | 2026-10-28 |
| D-41 | `qa-maestro` sin Test Plan | No crea Test Plans. Si no existe el del sprint, se detiene e indica usar `qa-sprint` | 2026-10-28 |
| D-42 | Plantilla única de Test Plan | Una plantilla de sprint y una de regresión para todos los equipos, en `02-qa-funcional/plantillas/`, con secciones dinámicas (listas JQL) y secciones vivas. Detalla D-09 | 2026-10-28 |
| D-43 | Riesgos | Tabla en la descripción del Test Plan: Nivel, Riesgo, Impacto, Mitigación, Estado. Un riesgo no se borra, cambia de estado | 2026-10-28 |
| D-44 | Selección de regresión | Entran los tests con Regresión = Sí de las funcionalidades del alcance. Automatizado = SI va a la suite automatizada; NO va a la ejecución manual. El campo se completa siempre | 2026-10-28 |
| D-45 | Hook de inicio de sprint | `qa-inicio-sprint.json`, tipo agent: solo actúa si el mensaje empieza con `/inicio-sprint` | 2026-10-28 |
| D-46 | Cierre de HU | `qa-cierre-hu` evalúa el DoD con la última ejecución de cada test y propone comentario, transición de la subtarea de ejecución y estado de riesgos. La HU la mueve el equipo | 2026-10-28 |
| D-47 | Re-ejecución | Siempre una Test Execution nueva con sufijo `#N`, mismos vínculos que la original más el bug de origen. No suma a las métricas | 2026-10-28 |
| D-48 | Revisión de casos | `qa-revision-casos` revisa con un checklist de 12 criterios, propone cada cambio con valor anterior y nuevo, depreca en lugar de borrar y no inventa el valor de Automatizado | 2026-10-28 |
| D-49 | Documentación viva | `qa-actualizar-contexto` reemplaza el aprendizaje continuo de `qa-senior`: separa hechos confirmados (con fuente) de "a confirmar", no duplica, escribe solo con confirmación y los cambios se suben por Pull Request del playbook. Aplica a todos los módulos | 2026-10-28 |
| D-50 | Limpieza de documentos | Se eliminan de `02-qa-funcional/` los documentos vacíos y los procedimientos manuales que ya resuelven las skills: creación de test case en Jira, importación desde Excel, test plan de regresión, ejecución de pruebas, diseño de casos, guía de análisis de HU, integración Jira/Xray, manejo de etiquetas (lo cubre el catálogo) y `prompts/`. La regla de cancelar subtareas QA de HU sin pruebas pasa a `qa-inicio-sprint` | 2026-10-28 |
| D-51 | Ubicación de la homologación | `homologacion/` pasa a `00-introduccion/kiro/`: `contratos.md`, `decisiones.md` (antes `analisis-unificacion.md`) y `plantillas/`. `05-equipos/` queda en la raíz porque lo leen todas las skills. `como-trabajamos-con-kiro.md` y `vision-qa.md` describen el modelo de agentes, skills y puntos de control | 2026-10-28 |
| D-52 | Documentos de estándares de automatización | Se eliminan `politica-de-bugs.md`, `metricas-de-testing.md`, `estrategia-niveles-testing.md` y `mantenimiento-tests.md`. Las reglas de bugs y métricas ya están en el steering `qa-jira-xray` y en las skills de informe; estrategia de niveles y mantenimiento de tests quedan para las skills y steerings de cada repositorio de automatización | 2026-10-28 |
| D-53 | Perfiles de todos los equipos | Un perfil por equipo en `05-equipos/` (archivo en minúsculas por la regla del repositorio; nombre del equipo en mayúsculas en el título) y `indice-equipos.md` para identificar el equipo por el proyecto de Jira. Equipos: Equipo Alfa (catálogo y carrito), Equipo Beta (checkout y pagos), Equipo Gamma (cuenta y acceso) y Equipo Delta (trabaja con SDD) | 2026-10-28 |
| D-54 | Agentes de automatización | Dos agentes en el playbook: `qa-automation` (implementa y mantiene) y `qa-pr` (revisa y comenta Pull Requests; no modifica código). Reemplazan a los agentes que cada repositorio de automatización tenía por separado | 2026-10-28 |
| D-55 | Contrato de framework | Cada repositorio de automatización expone piezas con nombre fijo: steerings `<prefijo>-proyecto`, `<prefijo>-buenas-practicas`, `<prefijo>-code-review` y skills `<prefijo>-implementar`, `<prefijo>-reparar`. Sin steerings `always`. Prefijo de Playwright: `pw` (`plantilla-automation`); un framework que el equipo sume, por ejemplo Karate, usa el suyo (`karate`). Ver contratos, sección 9 | 2026-10-28 |
| D-56 | Entrada de la automatización | Los casos pueden venir de Xray, del flujo `qa-maestro`, pegados por el QA o diseñados a partir de una HU antigua. Lo obligatorio es tenerlos en Gherkin antes de implementar | 2026-10-28 |
| D-57 | Salida de la automatización | Se propone crear en Xray los casos nuevos y, en los existentes, pasar Automatizado a `SI` y Estado Automatización a `Automatizado`. En ambos casos se reemplaza el marcador provisional `XRAY-PENDIENTE` del título del test por la clave real (el marcador se define en contratos, sección 9.7). Con confirmación | 2026-10-28 |
| D-58 | Convenciones de Git | Rama `feature/<CLAVE>-<resumen>`; commit `<CLAVE>: <qué cambia>`; título del PR `<FEAT\|FIX\|CHORE> \| <CLAVE> \| <título de la tarea>`. Iguales para el playbook y los repositorios de automatización, alojados en GitHub. La clave puede ser de cualquier proyecto | 2026-10-28 |
| D-59 | Hook de descripción del código generado | No se usa un hook para describir el código generado. La descripción de qué hace el código, por qué, dónde conecta y qué falta es parte del entregable de `pw-implementar` | 2026-10-28 |
| D-61 | Workspace QA-WORKSPACE | Todos trabajan en un workspace de Kiro llamado QA-WORKSPACE con `qa-playbook` siempre presente y primero. Los agentes viven solo en `qa-playbook`. Los repositorios de automatización se suman según la tarea o se tienen todos. Los repositorios de automatización no tienen agentes propios | 2026-10-28 |
| D-62 | Catálogo de errores por framework | Cada repositorio de automatización tiene `<prefijo>-troubleshooting.md` (pieza obligatoria del contrato). Se parte de los errores ya documentados en los agentes y skills que se retiran. `<prefijo>-reparar` lo consulta y lo actualiza en el punto de control Corrección | 2026-10-28 |
| D-63 | Autoría de skills | La skill de autoría que existía en un repositorio de automatización pasa al playbook como `qa-escribir-skills`, adaptada al contrato de skill. Se retira la skill `crear-steering`: lo cubren contratos §7 y la plantilla | 2026-10-28 |
| D-65 | Formato único de casos de API | Todo el playbook usa un mismo formato de casos de API (`Given el dominio`, `And path`, `When metodo`, `And status`, contrato en `"""`, `Examples` con `verificacionMensaje`). Se integra en `qa-gherkin`, que reemplaza su formato anterior, y se retira el steering propio de Karate. `karate-implementar` (si el equipo suma Karate) convierte desde ese formato | 2026-10-28 |
| D-66 | `@SKIP_WIP` | Marca oficial para todos los frameworks: escenario excluido por un problema de ambiente o de datos. Siempre con su explicación, causa, fecha desde, fecha de revisión y QA. Se incorporan además: ejecución en segundo plano con el reporte del framework como fuente de verdad, evidencia entre corridas, reparación desde el reporte local, CI y tarea `AUTO`, ciclo del bug, verificación de duplicados y código sin uso, clase base de los Page Objects que solo se extiende y mocks de servicios solo con los pasos genéricos | 2026-10-28 |
| D-67 | Intentos de reparación | Máximo 2 por escenario en todos los frameworks. Después, se deja el código como estaba y se avisa al QA con el problema para que lo verifique a mano | 2026-10-28 |
| D-68 | Dos usos del CI | Pipeline en cada push y PR (GitHub Actions): el QA valida ahí su rama antes de integrar. Ejecuciones periódicas programadas: resultados y tareas de revisión `AUTO-`. Los agentes solo leen. El PR de automatización lleva la corrida de validación | 2026-10-28 |
| D-69 | Tareas del tablero de automatización | Skill `qa-crear-tarea-automatizacion` en el playbook para todos los equipos. Tipo Tarea, vínculo `Test`, título según el patrón del perfil del equipo (campo de la sección 4 del perfil) | 2026-10-28 |
| D-70 | Tamaño de los features | Recomendación para todos los frameworks: hasta 10 escenarios por feature y Background de hasta 3 steps. Si un caso necesita más, el agente avisa y sigue con el OK del QA (contratos §9.9) | 2026-10-28 |
| D-71 | Excepciones temporales al modelo | Un repositorio puede conservar temporalmente agentes, steerings o skills propios fuera de D-61 mientras se migran al playbook. Cada excepción se registra acá con su motivo; cuando se retoma, la pieza pasa al playbook o se convierte en skill | 2026-10-28 |
| D-72 | Guía y README | `como-trabajamos-con-kiro.md` muestra los agentes en el modelo, dónde vive cada pieza, cuándo se carga cada steering, cuándo usar el agente o la skill suelta y la tabla de qué skill sirve para qué. El README de cada repositorio de automatización remite al playbook para Git y suma "Trabajar con Kiro" | 2026-10-28 |
| D-74 | Mobile en `qa-automation` | Mobile se registra como framework opcional (`mob`) y usa `qa-automation` y `qa-pr`, sin agente propio. Un caso de Xray = un test = un escenario para Android e iOS; cambian solo los selectores. No corre en el CI del repositorio: el QA ejecuta en un servicio de dispositivos en la nube (o local) y le pasa el resultado al agente. Solo para el equipo que lo sume: con otro equipo se avisa y se sigue con confirmación. Piezas: `mob-proyecto`, `mob-buenas-practicas`, `mob-code-review`, `mob-troubleshooting`, `mob-implementar`, `mob-reparar`, `mob-explorar-pantalla` | 2026-10-28 |
| D-75 | Performance (k6) con agente propio | Agente `qa-performance` en el playbook, con steering `qa-performance` (base ISTQB CT-PT, certificación de pruebas de performance) y skills `qa-performance-analisis`, `-plan` e `-informe`. En el repositorio de k6 (opcional): `k6-proyecto`, `k6-buenas-practicas`, `k6-code-review`, `k6-troubleshooting`, `k6-implementar`, `k6-calibrar` y `k6-reparar`. El pedido llega del equipo con servicios, flujo e información del líder técnico y de arquitectura; se crea la tarea en `AUTO`; se arma en QA con smoke, se calibra y se ejecuta en PRE desde el CI; cada corrida va al repositorio documental con su análisis; los criterios los acuerdan el QA, el líder técnico y arquitectura. El equipo de automatización se hace cargo de estas pruebas y su revisión. El archivo de variables de entorno (`.env`) no se versiona | 2026-10-28 |
| D-76 | Flujo SDD con agente propio | Nuevo agente `qa-sdd` para los equipos que trabajan con Spec-Driven Development, con steering `qa-sdd` y DoR/DoD SDD en `01-estandares-globales/definicion-dor-dod-sdd.md`. Reutiliza `qa-analisis-hu`, `qa-diseno-casos`, `qa-carga-xray`, `qa-reporte-bug`, `qa-reejecucion` y `qa-cierre-hu` y deriva a `qa-automation` y `qa-pr`. Se descarta un workflow de Kiro porque los puntos de control tienen que ser conversacionales. El perfil del equipo suma `Modalidad de trabajo` (`Funcional` o `SDD`); `qa-maestro` sugiere `qa-sdd` si el equipo es SDD. Primer equipo: Equipo Delta | 2026-10-28 |
| D-77 | Subtareas de QA de los equipos SDD | Los comentarios van a las subtareas estándar: `[QA] Análisis de Testabilidad y Refinamiento de Contexto` (revisión de la spec y análisis), `[QA] Diseño de Pruebas y Datos` (paquete) y `[QA] Ejecución de test cases` (FWT, auditoría y cierre). Nunca en la HU padre sin indicación del QA. Comentarios de hasta ~40 líneas, sin rutas locales ni nombres de skills | 2026-10-28 |
| D-78 | Spec y versiones | La ubicación de `requirement.md`, `design.md` y `tasks.md` la indica el QA en cada HU; si falta, se pregunta y nunca se adivina. La versión leída de cada fuente se registra en Markdown en `.qa-work/<HU>/sdd/00-fuentes.md` (sin hashes ni JSON). Jerarquía de verdad: HU > requirement > design > tasks; el código y la base no redefinen el resultado esperado | 2026-10-28 |
| D-79 | Skills del flujo SDD | `qa-sdd-revision-spec` (revisión de requirement y design unificada), `qa-sdd-cobertura-dev`, `qa-sdd-plan-datos`, `qa-sdd-fwt` (FWT y cobertura unitaria unificados) y `qa-auditar-ejecucion` (sirve también fuera de SDD). Siguen el contrato de skill (§4.1). Los intentos de reparación siguen la regla de 2 (§9.9) | 2026-10-28 |
| D-83 | Planillas de `.qa-work/` | `.qa-work/` sigue ignorada por git (D-28), salvo `indice-general.md` (resumen del trabajo en curso de cada QA) y `validacion-skills.md` (registro de fallas, faltantes, sobrantes, mejoras y usos exitosos de agentes y skills). Se versionan con una fila de ejemplo; cada QA las completa en su copia local, no las commitea (se sugiere `git update-index --skip-worktree`) y envía la validación por el canal de comunicación del equipo. `check-naming.sh` excluye `.qa-work/` | 2026-10-28 |
| D-84 | Estado de la Test Execution | La Test Execution nace en Por hacer, pasa a En curso al empezar a ejecutar y se transiciona a **Finalizada** al terminar la ejecución, cuando ninguno de sus tests está en TO DO o EXECUTING. Finalizada indica que la ejecución terminó, no que los tests pasaron. El workflow del proyecto no permite ir de Por hacer a Finalizada: se pasa por En curso. La transición la propone `qa-cierre-hu` (y `qa-informe-regresion` para las de regresión) con confirmación. Una re-ejecución se crea con la original ya Finalizada y nunca se reabre una Finalizada. Corrige "Test Execution en Por hacer" de la sección 5 y elimina el desvío "tests en passed con ejecución en curso" que observó la auditoría | 2026-11-12 |
| D-85 | Performance en el análisis de la HU y en la regresión | `qa-analisis-hu` evalúa los disparadores de la sección 4 de `03-qa-automatizacion/plan-pruebas-performance.md` y deja en el comentario de análisis la línea `Performance: aplica (O-x / R-x) / no aplica`; si aplica y no hay pedido vinculado, lo informa como faltante del DoR y ofrece un borrador para el líder técnico. `qa-preparar-regresion` lista las HU del release con prueba y su estado (pedido, informe, severidad). `qa-informe-regresion` suma la línea de performance al veredicto: severidad Alta, NO GO; Media, solo GO WITH RISKS con la aceptación documentada de PO, analista funcional y líder técnico; prueba obligatoria sin informe o sin severidad, riesgo informado y sin GO. `qa-performance-informe` asigna la severidad en el informe final | 2026-11-12 |
| D-86 | Cierre de HU con vinculadas abiertas | `qa-cierre-hu` no propone cerrar una HU con vinculadas bloqueantes abiertas: Test Set que no está en Finalizada; Test Execution que no está en Finalizada, salvo una re-ejecución ya cubierta por otra posterior; bugs Highest o High; subtareas QA. Un bug de severidad baja no bloquea y se resuelve con el acuerdo del PO (resultado "aceptado con bug de severidad baja") | 2026-11-12 |
| D-87 | Proceso de performance en el agente y las skills | `qa-performance`, `qa-performance-analisis`, `qa-performance-plan`, `qa-performance-informe`, `k6-calibrar` y `qa-crear-tarea-automatizacion` siguen `03-qa-automatizacion/plan-pruebas-performance.md`: el pedido lo crea el líder técnico con la planilla de pedido al menos 2 sprints antes del release; la tarea `AUTO` va bajo la épica de performance con etiqueta `PERFORMANCE` y vínculo `Test` con el pedido; los datos de QA los arma QA Automation y los de PRE los entrega el PO en una semana como máximo; el equipo de infraestructura valida pods y memoria de PRE antes de calibrar; toda prueba define un baseline (valor de referencia; sin criterios mínimos generales); el informe final lleva severidad Baja, Media o Alta. El agente no crea el pedido ni registra la aceptación de una severidad Media | 2026-11-12 |

> **Nota:** las decisiones D-60, D-64, D-73 y D-80 a D-82 registraban casos propios de sistemas o equipos concretos de un proyecto particular (mocks de un módulo, formatos de un módulo, etiquetas de plataforma mobile, sincronizaciones con ramas y contextos de equipos específicos). No tienen equivalente genérico y se retiraron; sus números no se reutilizan.

---

## 5. Reglas técnicas verificadas

Reglas que los dos equipos piloto ya probaron en su instancia de Jira y Xray. Las skills las aplican sin volver a descubrirlas.

> **Nota:** los ids numéricos de campos (`customfield_NNNNN`), de valores y de proyectos **cambian entre instancias de Jira**. Por eso esta tabla nombra los campos y no sus ids: antes de escribir un campo, la skill consulta los metadatos del tipo de issue en tu instancia y usa el id que corresponda.

| Tema | Regla |
| :--- | :--- |
| Identificador de la instancia (cloudId) | Se obtiene de la sesión del MCP `@atlassian`. No se guarda en el playbook |
| Proyecto de tests | `PROJ` (los tests de Xray viven en el mismo proyecto que las historias; en proyectos reales, el que defina el equipo) |
| Vínculo de trazabilidad | Tipo `Test`. `inwardIssue` = Test Set o Test Execution; `outwardIssue` = HU, Test Plan o Bug. Así la HU muestra "is tested by". Nunca al revés |
| Campo Ambiente | Campo personalizado de selección con valor `QA`, en Test, Test Set y Test Execution. La Test Execution además lleva `testEnvironments=["QA"]` nativo de Xray |
| Campo Regresión | Campo de selección. El valor Sí se escribe con tilde: `Sí`. Solo en Tests |
| Campo Automatizado | Campo de selección con valores `SI` y `NO`. Solo en Tests |
| Campo Estado Automatización | Valor `Automatizado` para un test automatizado. Los demás valores se consultan antes de setear el campo |
| Campo QA Análisis | Valores `NO_REVISADO`, `REVISADO_OK`, `REVISADO_NOOK` (estados de revisión de QA de `qa-senior`) |
| Tipo de HU en JQL | `issuetype = Story`. Los nombres en español (`Historia`) fallan en JQL |
| Estados finales | Tests y Test Set en Finalizada. Test Execution: Por hacer al crearla, En curso al empezar a ejecutar y Finalizada al terminar la ejecución (D-84) |
| Tipo de bug | Issuetype `Bug` (en una instancia de Jira en español se llama `Error`). Se usa el nombre que tenga la instancia |
| Severidad del bug | Campo Priority: Bloqueante → Highest, Alta → High, Media → Medium, Baja → Low, Muy baja → Lowest. Es distinta de la criticidad del PO (Blocker/Alta/Media/Baja) |
| Vínculo bug → test | `Blocks` si es Highest o High; `Relates` si es Medium o menor |
| Épica del bug | El bug cuelga de la misma épica que la HU afectada |
| Escrituras en el repositorio de Xray | De a una. En paralelo Xray responde "repository is being updated"; si ocurre, buscar el test por summary antes de reintentar y moverlo con la herramienta de mover tests de Xray |
| Transiciones | Se buscan por nombre con `listJiraIssueTransitions`. Los ids cambian entre proyectos |
| Métricas de ejecución | Por GraphQL de Xray, con el status consolidado del Test Plan y sin parámetro `environment`. Los JQL `testPlanTests` dan números erróneos |
| Comentario del test-run | Mutation `updateTestRunComment` con formato wiki `[texto\|url]` |
| Enlace web en la HU | Antes de crear, listar los enlaces existentes: la misma URL dos veces crea dos enlaces y no hay API para borrar uno |
| Links del repositorio documental | Solo lectura para la organización. Nunca links de edición ni anónimos |
| Nombres en el repositorio documental | Reemplazar los caracteres prohibidos `" * : < > ? / \ \|` |
| Vínculos en Jira | No hay operación para borrar vínculos; si uno queda mal, lo borra el QA a mano |

---

## 6. Destino de `qa-senior`

`qa-senior` (el steering monolítico inicial) funciona bien y es la base del agente inicial, que se llama `qa-maestro` (D-35). Se separa por capas:

| Capa de `qa-senior` | Destino |
| :--- | :--- |
| Rol, principios (no inventar, no sobretestear ni subtestear, causalidad, recomendación distinta de ejecución), reglas finales, profundidad | Steering `qa-principios` (always, corto) |
| Checklist integral (a-f) y motores de riesgo, impacto, regresión e integración | Documento de referencia de las skills de análisis |
| Cada comando | Una skill (sección 7) |
| Comando maestro `QA`, elección del modo, "no mezclar modos" | Agente `qa-maestro` |
| Aprendizaje continuo (punto g) | Skill `qa-actualizar-contexto`, que propone el cambio y el QA lo sube por Pull Request |
| Contexto de un módulo (URLs, queries, rutas) | Perfil del equipo correspondiente (ej. `05-equipos/beta.md`) y la carpeta del módulo en `04-funcionalidades/vision-cliente/` (ej. `04-checkout/`) |

---

## 7. Catálogo de skills

> **Nota:** la columna Fase indica en qué tanda se construyó la skill: A (flujo base de una HU), B (sprint, re-ejecución y cierre) y C (regresión y mantenimiento). Las skills que se sumaron después, en la segunda tabla, indican el área en la que se construyeron (Automatización, SDD o Performance).

| Skill | Origen | Fase |
| :--- | :--- | :--- |
| `qa-analisis-hu` | `ANALIZAR_HU` + impacto, riesgo, regresión, integral y cambio de alcance | A |
| `qa-diseno-casos` | `GENERAR_TESTS` | A |
| `qa-carga-xray` | `mapeo-seguimiento-sprint-qa` + `xray-sprint` (pasos 3 a 8) | A |
| `qa-reporte-bug` | `REPORTAR_BUG` + `reportar-bug-qa` | A |
| `qa-reejecucion` | `reejecutar-qa` | B |
| `qa-cierre-hu` | `STATUS_POST_TESTING`, `QUALITY_GATE`, DoD | B |
| `qa-inicio-sprint` | `preparar-sprint-qa` + `carpetas-sprint` + `xray-sprint` (paso 8c) | B |
| `qa-informe-sprint` | `informe-cierre-sprint-qa` | B |
| `qa-preparar-regresion` | `preparar-regresion-qa` | C |
| `qa-informe-regresion` | `informe-regresion-release-qa`, `RELEASE_READINESS` | C |
| `qa-revision-casos` | `VALIDAR_TESTS` | C |
| `qa-actualizar-contexto` | `ACTUALIZAR_DOCUMENTACION` + aprendizaje continuo | C |

Toda skill sigue la misma plantilla: propósito, cuándo usarla y cuándo no, entradas obligatorias, MCP que usa, pasos, punto de confirmación, entregable, criterios de calidad y casos de aceptación.

Las 15 skills restantes (hasta las 27 que hay en `.kiro/skills/`) se sumaron con las decisiones indicadas. Cada una está descripta en [Cómo trabajamos con Kiro](../como-trabajamos-con-kiro.md), sección 2.

| Skill | Decisión que la origina | Fase |
| :--- | :--- | :--- |
| `qa-seguimiento-sprint` | D-39, D-40 y D-43 (nivel sprint) | B |
| `qa-plan-automatizacion`, `qa-registro-automatizacion` | D-54, D-56 y D-57 (automatización) | Automatización |
| `qa-crear-pr`, `qa-revisar-pr` | D-54 y D-58 (Pull Requests) | Automatización |
| `qa-crear-tarea-automatizacion` | D-69 y D-87 | Automatización |
| `qa-escribir-skills` | D-63 | Automatización |
| `qa-sdd-revision-spec`, `qa-sdd-cobertura-dev`, `qa-sdd-plan-datos`, `qa-sdd-fwt`, `qa-auditar-ejecucion` | D-76 a D-79 (flujo SDD) | SDD |
| `qa-performance-analisis`, `qa-performance-plan`, `qa-performance-informe` | D-75, D-85 y D-87 (performance) | Performance |

---

## 8. Agente `qa-maestro`

Agente inicial del QA. Elige el modo, encadena las skills y aplica los puntos de control (detalle en `contratos.md`, sección 3.3).

| Punto de control | Qué confirma el QA |
| :--- | :--- |
| Contexto | Fuentes disponibles, vigencia del contexto y trabajo previo en `.qa-work/` |
| Análisis | Observaciones, riesgos y preguntas. Si se publica el comentario |
| Matriz de cobertura | Criterios de aceptación, condiciones de prueba y prioridad, antes de escribir el Gherkin |
| Casos de prueba | Borrador completo de los escenarios |
| Carga en Xray | Lista exacta de lo que se va a crear y vincular |
| Reporte de bug | Contenido del bug antes de crearlo |
| Cierre | Publicación del comentario y transiciones |

La profundidad (Rápido, Estándar, Exhaustivo) se mantiene como forma de controlar el costo.

---

## 9. Perfil de equipo

Cada equipo tiene un perfil con los datos que cambian entre equipos. Las skills son iguales para todos y leen el perfil.

Contenido del perfil:

- Proyecto Jira, board y tipos de subtarea QA.
- Carpeta de documentación funcional en `04-funcionalidades/`.
- Labels de nivel 2 (funcionalidad) y reglas para el nivel 3.
- Área para el nombre de los tests (`Web`, `Mob`, etc.).
- Ruta del repositorio en Xray y ruta base en el repositorio documental.
- Plantilla del Test Plan y patrón de nombre del Test Plan.
- Versiones por capa y política de sprint o backlog para los bugs.
- Si incluye el bloque técnico en la descripción del test (D-06).

Primeros perfiles: Equipo Beta (desde su configuración inicial) y Equipo Alfa (desde la suya).

---

## 10. Steerings del playbook

| Steering | Inclusión | Contenido |
| :--- | :--- | :--- |
| `qa-principios` | always | Rol, idioma, principios de `qa-senior`, regla de no publicar ni transicionar sin confirmación |
| `qa-jira-xray` | auto | Proyectos, artefactos, nombres, labels, campos y reglas técnicas de la sección 5 |
| `qa-gherkin` | auto | Estándar de escritura de escenarios (D-03, D-06) |
| `qa-seguridad-datos` | auto | Bases de datos en solo lectura; sin datos personales ni credenciales en Jira |

Los steerings anteriores (`bdd-standards`, `dor-dod-rules`, `jira-rules`) se reemplazan por estos.

---

## 11. Componentes que se retiran

| Componente | Reemplazo |
| :--- | :--- |
| Hooks `UserPromptSubmit` del Equipo Beta | Skills de la sección 7 |
| Skills `carpetas-sprint` y `xray-sprint` del Equipo Alfa | `qa-inicio-sprint` y `qa-carga-xray` |
| `.kiro/state/*.json` | Consultas a Jira y Xray (D-11) |
| Steering `qa-senior` | Agente `qa-maestro` + steering `qa-principios` + skills |
| Steerings anteriores del playbook | Steerings de la sección 10 |

El retiro se hace recién cuando el reemplazo está validado por el equipo que usa el componente original.

---

## 12. Plan de implementación

| Paso | Entregable | Validación | Estado |
| :--- | :--- | :--- | :--- |
| 1 | Decisiones de unificación | Aprobadas | Hecho (2026-10-28) |
| 2 | Contratos: plantilla de skill, plantilla de perfil, puntos de control. Perfiles de los equipos piloto (Beta y Alfa) | Revisión | Hecho (2026-10-28): `00-introduccion/kiro/contratos.md`, `00-introduccion/kiro/plantillas/`, `05-equipos/` |
| 3 | Steerings de la sección 10 | Sin contradicciones con los repos abiertos | En revisión (2026-10-28). Pendiente: steerings `always` de los repositorios de automatización que contradicen a `qa-principios` (saneamiento) |
| 4 | Skills fase A | Los dos equipos piloto obtienen con su perfil lo mismo que hoy | Experimental (2026-10-28): `qa-analisis-hu`, `qa-diseno-casos`, `qa-carga-xray`, `qa-reporte-bug`. Validación con una HU real de cada equipo |
| 5 | Agente `qa-maestro` con puntos de control | Un QA nuevo lo usa sin guía | Experimental (2026-10-28): `.kiro/agents/qa-maestro.md` |
| 6 | Nivel sprint y release: plantillas de Test Plan, agentes `qa-sprint` y `qa-regresion`, skills `qa-inicio-sprint`, `qa-seguimiento-sprint`, `qa-informe-sprint`, `qa-preparar-regresion`, `qa-informe-regresion`, hook de inicio de sprint, ajustes en `qa-maestro` | Un sprint real | Experimental (2026-10-28) |
| 6b | `qa-reejecucion` y `qa-cierre-hu`, modos `REEJECUTAR` y `CIERRE_HU` en `qa-maestro` | Una HU real | Experimental (2026-10-28) |
| 7 | Skills fase C: `qa-revision-casos` y `qa-actualizar-contexto`, modos `VALIDAR_TESTS` y `ACTUALIZAR_DOCUMENTACION` en `qa-maestro` | Una funcionalidad real | Experimental (2026-10-28) |
| 8 | Retiro de componentes, guía para el equipo, `mcp.json` común (Atlassian, Xray, GitHub y, opcional, Figma) | Adopción | Pendiente |
| 9 | Automatización, paso 1: contrato de framework (contratos, sección 9) y convenciones de Git (sección 10) | Revisión | Hecho (2026-10-28) |
| 9b | Automatización, paso 2: steerings `pw-*` (y `karate-*` si el equipo suma Karate), `.gitignore` del repositorio | Sin contradicciones con el playbook | Hecho (2026-10-28) |
| 9c | Automatización, paso 3: skills `pw-implementar`, `pw-reparar`, `pw-explorar-dom` (y las `karate-*` si corresponde) | Una tarea `AUTO` real por framework | Experimental (2026-10-28) |
| 9d | Automatización, paso 4: skills del playbook `qa-plan-automatizacion`, `qa-registro-automatizacion`, `qa-crear-pr`, `qa-revisar-pr` | Una tarea `AUTO` real | Experimental (2026-10-28) |
| 9e | Automatización, paso 5: agentes `qa-automation` y `qa-pr`, workspace QA-WORKSPACE (D-61) | Un QA de automation lo usa sin guía | Experimental (2026-10-28) |
| 9f | Automatización, paso 6: retiro de los agentes, skills, steerings y hooks viejos de los repositorios de automatización; catálogo `<prefijo>-troubleshooting` (D-62) | Después de la prueba | Hecho (2026-10-28): D-62, D-63 y D-65 |

> **Nota:** el estado de cada componente nuevo se registra como una fila más de esta tabla (por ejemplo, una skill creada con `qa-escribir-skills` entra como "Experimental" con su fecha). Los estados posibles son los de contratos, sección 8: Experimental, En evaluación, Homologado y Retirado.

---

## 13. Pendientes

| # | Tema | Estado |
| :--- | :--- | :--- |
| P-01 | Labels base | Cerrado: D-19 y D-20. Las etiquetas en uso en Jira que no estaban en la planilla (por ejemplo `testing_manual`, `TEST_SET`, `TEST_EXECUTION`, `TEST_PLAN` y las de equipo, funcionalidad, módulo y mobile) quedan resueltas en las secciones 4 y 5 del catálogo: las de equipo, funcionalidad, módulo y capa se incorporaron y las que duplican un campo (`testing_manual`, `test_set`, `test_execution`, `test_plan`) no se usan |
| P-02 | Tests integrales | Cerrado: D-21 |
| P-03 | Nivel 3 de labels | Cerrado: D-04 |
| P-04 | Reparto entre QAs | Cerrado: D-23 |
| P-05 | Documentación funcional de un módulo | Cerrado: D-24. La carga de los documentos de un módulo la hace el responsable del módulo más adelante |
| P-06 | Hook manual | Pasa a recordatorio R-01 |
| P-07 | Área y Capa del nombre del test | Cerrado: D-01 |
| P-08 | MCP del repositorio documental | Pasa a recordatorio R-02 |
| P-09 | Etiquetas por confirmar | Cerrado: D-25 y D-26 |
| P-10 | Planilla de etiquetas en el repositorio | Cerrado: la planilla se eliminó del repositorio; el catálogo es la fuente |
| P-11 | Datos por completar en los perfiles | Cerrado: los campos "Por completar" quedan para que cada equipo los configure |
| P-12 | Caracteres prohibidos en nombres de carpeta | Cerrado: D-30 |
| P-13 | Cambio de formato en un equipo con tests existentes | Cerrado: D-31 |
| P-14 | Web y mobile en el nombre del test | Cerrado: D-32 |

---

## 13.1 Recordatorios para el cierre

Se revisan con el equipo al terminar la implementación.

| # | Recordatorio |
| :--- | :--- |
| R-01 | Confirmar que todo el equipo tiene la misma versión de Kiro y que puede ejecutar hooks de forma manual (hook de inicio de sprint, D-16) |
| R-02 | Confirmar que todos tienen configurado el MCP del repositorio documental (SharePoint, Drive u otro) con escritura |

---

## 14. Registro de cambios de este documento

| Fecha | Cambio |
| :--- | :--- |
| 2026-10-28 | Versión inicial: análisis de insumos, decisiones D-01 a D-18, plan y pendientes |
| 2026-10-28 | Decisiones D-19 a D-24, ajuste de D-01 y D-04, cierre de pendientes P-01 a P-08, recordatorios R-01 y R-02. Se crea `02-qa-funcional/catalogo-etiquetas.md` |
| 2026-10-28 | Decisiones D-25 a D-29. Se corrige el valor del campo Regresión (`Sí` con tilde) y se suman los campos de automatización y QA Análisis. Paso 2: contratos, plantillas y perfiles de los equipos piloto |
| 2026-10-28 | Flujo SDD (D-76 a D-79): agente y steering `qa-sdd`, skills `qa-sdd-*` y `qa-auditar-ejecucion`, DoR/DoD SDD, perfil del Equipo Delta, campo Modalidad de trabajo en todos los perfiles y en la plantilla, guía y README. D-83: planillas `indice-general.md` y `validacion-skills.md` en `.qa-work/` |
| 2026-10-28 | Mobile y k6 como frameworks opcionales: contratos §9.2, agente `qa-performance`, steering `qa-performance`, skills de performance, ajustes en `qa-automation`, `qa-pr`, `qa-plan-automatizacion`, `qa-registro-automatizacion`, `qa-crear-pr`, `qa-revisar-pr` y guía (D-74, D-75) |
| 2026-10-28 | Guía `como-trabajamos-con-kiro.md` (secciones 1 y 2), `README.md` del playbook y de los repositorios de automatización (D-71, D-72) |
| 2026-10-28 | Revisión de las prácticas de automatización del equipo: contratos §9.9 (D-66 a D-68, D-70), skill `qa-crear-tarea-automatizacion` (D-69), `pw-reparar` con reporte local, CI y tarea `AUTO`, y ajustes en `pw-*`, `qa-automation`, `qa-pr`, `qa-crear-pr` y `qa-revisar-pr` |
| 2026-10-28 | Automatización, cierre del paso 6: formato único de casos de API en `qa-gherkin` (D-65), skill `qa-escribir-skills` y retiro de `crear-steering` (D-63) |
| 2026-10-28 | Automatización, paso 6: retiro de componentes viejos en los repositorios de automatización; `pw-troubleshooting` como pieza obligatoria del contrato (D-62) |
| 2026-10-28 | Automatización, paso 5: agentes `qa-automation` y `qa-pr`; workspace QA-WORKSPACE (D-61) en `como-trabajamos-con-kiro.md` y contratos §9.4 |
| 2026-10-28 | Automatización, pasos 2 a 4: steerings y skills de framework en `plantilla-automation`; skills del playbook `qa-plan-automatizacion`, `qa-registro-automatizacion`, `qa-crear-pr` y `qa-revisar-pr` |
| 2026-10-28 | Automatización, paso 1: contrato de framework y convenciones de Git (D-54 a D-59). `CONTRIBUTING.md` actualizado al nuevo formato de commit y PR |
| 2026-10-28 | Limpieza del repositorio (D-50) |
| 2026-10-28 | Fase C: skills `qa-revision-casos` y `qa-actualizar-contexto`, decisiones D-48 y D-49. `qa-maestro` sin modos pendientes |
| 2026-10-28 | Paso 6b: skills `qa-reejecucion` y `qa-cierre-hu`, decisiones D-46 y D-47 |
| 2026-10-28 | Decisiones D-39 a D-45: niveles sprint, HU y release; plantillas de Test Plan; agentes `qa-sprint` y `qa-regresion` con sus skills; hook de inicio de sprint |
| 2026-10-28 | Decisiones D-37 y D-38: puntos de control con nombre de etapa y espacio de trabajo `.qa-work/` en skills, agente, contratos y plantilla |
| 2026-10-28 | Paso 5: agente `qa-maestro` en estado Experimental. Decisiones D-35 y D-36 |
| 2026-10-28 | Paso 4: skills de fase A en estado Experimental. Se eliminan los placeholders `test-case-generator` y `jira-feedback-assistant` |
| 2026-10-28 | Decisiones D-30 a D-34. Paso 3: nuevos steerings, eliminación de los anteriores, `definicion-dor-dod.md` completo y actualización de referencias en README, introducción y procesos |
| 2026-11-12 | Plan de pruebas de performance (`03-qa-automatizacion/plan-pruebas-performance.md`) y DoR/DoD con el criterio de performance. D-84: estado Finalizada de la Test Execution (ajustes en `qa-jira-xray`, `qa-carga-xray`, `qa-cierre-hu`, `qa-reejecucion`, `qa-informe-regresion`). D-85: decisión de performance en `qa-analisis-hu`, `qa-preparar-regresion`, `qa-informe-regresion` y severidad en `qa-performance-informe` |
| 2026-11-12 | D-86: `qa-cierre-hu` y vinculadas bloqueantes. D-87: agente `qa-performance` y skills `qa-performance-analisis`, `qa-performance-plan`, `qa-performance-informe`, `k6-calibrar` y `qa-crear-tarea-automatizacion` alineados con el plan de pruebas de performance |
| 2026-11-21 | Revisión de coherencia del playbook genérico: D-04, D-20, D-21, D-22, D-25 y D-32 alineadas con el catálogo de etiquetas (minúsculas, `integracion`, capas `front`/`api`/`mobile`/`performance`); D-57 y contratos §9.7 definen el marcador `XRAY-PENDIENTE`; contratos §3.3 suma los puntos de control de `qa-performance` y el modo `AUDITAR_EJECUCION` de `qa-maestro`; tabla de skills completa (27) en la sección 7 |
