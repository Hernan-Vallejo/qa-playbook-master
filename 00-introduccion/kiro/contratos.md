# Contratos de los Componentes de Kiro para QA

> **Para qué sirve:** define cómo se construye cada componente homologado de Kiro (skills, agentes, steerings, perfiles de equipo, hooks y frameworks de automatización): dónde vive, qué debe contener, cómo controla el QA el resultado y cuándo se lo considera homologado ("validado y disponible para todo el equipo").
> **Quién lo usa:** quien crea o modifica un componente (QA, QA Automation o responsable del playbook) y quien revisa un cambio. Los agentes y skills citan sus secciones (por ejemplo "contratos §9.8" o "contratos §10").
> **Cuándo se usa:** cada vez que se arma o se corrige una skill, un agente, un steering, un perfil o un hook, y cuando se quiere saber qué punto de control corresponde en cada etapa.

| Dato | Valor |
| :--- | :--- |
| Estado | En revisión |
| Última actualización | 2026-11-21 |
| Relacionado | [Análisis y decisiones de unificación](./decisiones.md) |

Este documento define cómo se construye cada componente homologado: dónde vive, qué debe contener, cómo controla el QA el resultado y cuándo se considera homologado. Toda skill, agente, steering o hook nuevo se arma siguiendo estos contratos.

> **Glosario rápido:** **HU** = historia de usuario. **Skill** = procedimiento completo que Kiro ejecuta a pedido. **Agente** = rol de Kiro que elige skills y respeta puntos de control. **Steering** = archivo de reglas que Kiro lee. **Hook** = disparador automático de Kiro. **MCP** = *Model Context Protocol*, la forma en que Kiro se conecta con herramientas externas (Jira, Xray, GitHub). **Xray** = herramienta de gestión de pruebas que se usa dentro de Jira. **Test Plan / Test Set / Test Execution** = artefactos de Xray: el plan de pruebas, el conjunto de tests de una HU y una corrida de esos tests. **PR** = *Pull Request*, el pedido de revisión de una rama en GitHub. **CI** = integración continua (en este playbook, GitHub Actions). **SDD** = *Spec-Driven Development*, desarrollo guiado por especificaciones.

---

## 1. Dónde vive cada cosa

```text
qa-playbook/
├── .kiro/
│   ├── agents/              ← qa-maestro y qa-sdd (HU), qa-sprint (sprint), qa-regresion (release), automatización, PR y performance
│   ├── skills/<nombre>/     ← una carpeta por skill, con SKILL.md
│   ├── steering/            ← reglas comunes (qa-principios, qa-jira-xray, ...)
│   └── hooks/               ← hooks manuales y opcionales (qa-inicio-sprint)
├── 00-introduccion/kiro/    ← contratos (este documento), decisiones y plantillas
├── 01-estandares-globales/  ← DoR, DoD y estándares globales
├── 02-qa-funcional/         ← catálogo de etiquetas, estructura y plantillas de Test Plan
├── 03-qa-automatizacion/    ← procesos y guías de automatización, CI/CD y performance
├── 04-funcionalidades/      ← conocimiento funcional por visión y funcionalidad
├── 05-equipos/<equipo>.md   ← perfil de cada equipo
├── plantilla-automation/    ← repositorio de ejemplo de automatización con Playwright (web y API)
└── .qa-work/               ← trabajo local, ignorado por git salvo dos planillas (sección 3.5)
```

> **Nota:** `plantilla-automation/` vive dentro de este repositorio para que se pueda copiar como punto de partida; en un proyecto real se convierte en su propio repositorio (ver sección 9).

> **Nota:** DoR (*Definition of Ready*) es la lista de condiciones que una HU debe cumplir para empezar a trabajarse. DoD (*Definition of Done*) es la lista de condiciones para darla por terminada.

| Componente | Contiene | No contiene |
| :--- | :--- | :--- |
| Steering | Reglas y criterios que aplican siempre o en un contexto | Procedimientos paso a paso ni datos de un equipo |
| Skill | Un procedimiento completo con entradas, pasos, confirmación y entregable | Datos de un equipo (accountIds, boards, rutas): los lee del perfil |
| Agente | Rol, elección de skills, puntos de control y permisos de herramientas | El detalle de cada procedimiento: lo delega a las skills |
| Perfil de equipo | Datos que cambian entre equipos | Reglas comunes ni procedimientos |
| Documentación funcional | Reglas de negocio, contratos, flujos, datos de prueba | Reglas de proceso QA |
| Hook | Un disparador manual y opcional que invoca skills | Procedimientos largos. Nunca `UserPromptSubmit` con instrucciones extensas |

Los repositorios de automatización (`plantilla-automation`, que usa Playwright y trae pruebas de web y de API, y los de otros frameworks que el equipo sume, como Karate para API, k6 para performance o uno de mobile) solo tienen skills y steerings de su framework, sin agentes. Los agentes de automatización (`qa-automation`, `qa-pr`) viven en el playbook (sección 9).

---

## 2. Convenciones de nombres

| Componente | Formato | Ejemplo |
| :--- | :--- | :--- |
| Skill de QA funcional | `qa-<accion>` | `qa-analisis-hu`, `qa-carga-xray` |
| Skill de framework | `<prefijo>-<accion>`, en el repositorio del framework | `karate-implementar`, `pw-reparar` (ejemplos del formato: `plantilla-automation` hoy no trae skills propias) |
| Steering de framework | `<prefijo>-<tema>.md`, en el repositorio del framework | `pw-proyecto.md`, `karate-code-review.md` |
| Agente | `qa-<rol>` | `qa-maestro` |
| Steering común | `qa-<tema>.md` | `qa-principios.md` |
| Perfil de equipo | `<clave-del-equipo>.md` en minúsculas | `05-equipos/alfa.md` |
| Hook | `qa-<evento>.json` | `qa-inicio-sprint.json` |

Todo en minúsculas, con guiones, sin tildes ni Ñ (regla del pipeline de documentación del playbook, que valida los nombres en CI).

---

## 3. Modelo de control (human in the loop)

> **Nota:** *human in the loop* significa que una persona (el QA) confirma cada paso importante antes de que Kiro publique o modifique algo.

### 3.1 Reglas comunes

1. **Ninguna escritura en Jira, Xray o en el repositorio documental del equipo (SharePoint, Drive u otro) sin confirmación explícita.** Antes de escribir se muestra la lista completa de lo que se va a crear, modificar o vincular.
2. **Nunca borrar ni pisar.** Si algo ya existe, se reutiliza o se avisa.
3. **No inventar.** Si falta un dato, se marca **INFORMACIÓN INSUFICIENTE** y se pide.
4. **No suponer etiquetas, capas ni equipos.** Ante una duda, se pregunta.
5. **Diferenciar recomendación de ejecución.** "Regresión recomendada" no es "regresión ejecutada".
6. **Una confirmación vale para lo que se mostró.** Si la lista cambia, se vuelve a pedir confirmación.

### 3.2 Control en una skill

Cada skill tiene al menos un **punto de confirmación** antes de su entregable. Formato del cierre:

```text
Propuesta / Lo que voy a crear:
<lista exacta>

¿Confirmás, ajustamos algo o lo dejamos acá?
```

Si el QA pide ajustes, la skill corrige y vuelve a mostrar. La skill termina indicando el siguiente paso sugerido, sin ejecutarlo.

### 3.3 Puntos de control

Un punto de control es un momento en que Kiro se detiene, muestra lo que hizo o lo que va a hacer, y espera la respuesta del QA. Se nombran por la etapa, para que el QA sepa siempre dónde está.

| # | Punto de control | Momento | Qué se muestra | Qué confirma el QA |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Contexto** | Inicio | HU o tarea, perfil del equipo, fuentes disponibles (Jira, Xray, Figma, Swagger, documentación funcional) y su vigencia, trabajo previo en `.qa-work/`, profundidad | Contexto correcto y completo |
| 2 | **Análisis** | Después del análisis | Conclusión de readiness (si la HU está lista para probarse), observaciones, riesgos, preguntas, impacto | El análisis. Si se publica el comentario en Jira |
| 3 | **Matriz de cobertura** | Antes de escribir casos | Criterio de aceptación, condición de prueba, técnica, prioridad, capa, cobertura existente en Xray | Qué se va a probar y qué no |
| 4 | **Casos de prueba** | Después de escribir casos | Escenarios Gherkin, etiquetas, campo Regresión, descripción | Los casos |
| 5 | **Carga en Xray** | Antes de cargar | Lista exacta de tests, Test Set, Test Execution, carpetas, vínculos y comentarios de evidencia | La carga |
| 6 | **Reporte de bug** | Antes de crear un bug | Contenido del bug, severidad, épica, versión, sprint o backlog, vínculos | El bug |
| 6b | **Re-ejecución** | Antes de crear una re-ejecución | Nombre con sufijo, tests incluidos, vínculos y bug de origen | La re-ejecución |
| 7 | **Cierre** | Al terminar las pruebas | Estado post testing, DoD, comentario, transiciones de la subtarea, estado de riesgos | La publicación y las transiciones |

> **Nota:** Gherkin es el formato de casos escritos con `Dado / Cuando / Entonces` (en inglés `Given / When / Then`). Una "re-ejecución" es una Test Execution nueva que repite los tests después de corregir un bug.

Puntos de control de los modos de mantenimiento y auditoría de `qa-maestro`:

| Modo | Puntos de control |
| :--- | :--- |
| `VALIDAR_TESTS` | Revisión de casos, Correcciones |
| `AUDITAR_EJECUCION` | Auditoría de la ejecución |
| `ACTUALIZAR_DOCUMENTACION` | Aprendizajes, Cambios en el playbook |

Puntos de control de los otros agentes:

| Agente | Puntos de control |
| :--- | :--- |
| `qa-sprint` | Planificación del sprint, Test Plan, Avance del sprint, Actualización del Test Plan, Informe del sprint |
| `qa-regresion` | Alcance del release, Selección de tests, Test Plan de regresión, Informe de release |
| `qa-sdd` | Los de la HU (1 a 7, incluido 6b) más Coherencia, Paquete, FWT, Auditoría de la ejecución y Comentario en Jira (este último es un punto aparte después de Coherencia, Paquete o FWT; en Análisis, Auditoría de la ejecución y Cierre el comentario se propone dentro del propio punto). Ver el agente y el steering `qa-sdd` |
| `qa-automation` | Contexto, Plan de automatización, Feature, Implementación, Verificación, Registro en Xray; en `REPARAR`, Diagnóstico y Corrección (sección 9.8) |
| `qa-pr` | Revisión y Publicación de la revisión (`REVISAR_PR`); Revisión previa y PR a crear (`CREAR_PR`) (sección 9.8) |
| `qa-performance` | Pedido y Modelo de carga (`ANALIZAR`); Plan de la prueba (`PLANIFICAR`); Diseño del script, Implementación y Smoke en QA (`IMPLEMENTAR`); Corrida de calibración y Valores propuestos (`CALIBRAR`); Corrida a ejecutar, Análisis de la corrida y Publicación en el repositorio documental (`EJECUTAR`); Informe final (`INFORMAR`); Diagnóstico y Corrección (`REPARAR`) |

Los equipos con `Modalidad de trabajo = SDD` en su perfil (en este playbook, el Equipo Delta) usan `qa-sdd`: el trabajo propio de ese flujo se guarda en `.qa-work/<CLAVE-HU>/sdd/` y la auditoría de la ejecución en `.qa-work/<CLAVE-HU>/10-auditoria-ejecucion.md`. La ubicación de la spec (`requirement.md`, `design.md`, `tasks.md`) la indica el QA; ninguna skill la adivina.

> **Nota:** FWT (*Functional Walkthrough*) es una revisión estática del código de la HU antes del deploy a QA: se lee el código contra la spec, sin ejecutar el sistema (skill `qa-sdd-fwt`). La "auditoría de la ejecución" (skill `qa-auditar-ejecucion`) revisa cada test marcado PASS y comprueba, con la evidencia, que de verdad validó el resultado esperado; clasifica cada PASS y detecta los falsos PASS. En `qa-sdd`, "Gate 1" es el punto de control Matriz de cobertura y "Gate 2" es el punto de control Paquete: los dos puntos de aprobación obligatorios del flujo SDD. Los nombres de punto de control de cada skill y de cada agente son los de esta sección y de la 9.8: si una skill o un agente usa otro nombre, se corrige la skill o el agente, no este documento.

La **Matriz de cobertura** es el punto de control que más créditos de Kiro ahorra: un error de alcance se corrige antes de escribir los casos.

#### Cómo se muestra

Cada punto de control empieza con una línea que indica la etapa, sin emojis:

```text
[PUNTO DE CONTROL] Matriz de cobertura · esperando tu confirmación
```

En el flujo completo, además se muestra el recorrido, con el estado de cada etapa en texto:

```text
Contexto (hecho) → Análisis (hecho) → Matriz de cobertura (actual) → Casos de prueba → Carga en Xray
```

El **Reporte de bug** y la **Re-ejecución** no forman parte del recorrido fijo: se usan cuando corresponden. El recorrido completo de una HU termina en **Cierre**.

### 3.4 Profundidad

| Nivel | Uso |
| :--- | :--- |
| Rápido | Cambios chicos o consultas. Solo las fuentes principales |
| Estándar (por defecto) | Trabajo diario |
| Exhaustivo | HU de alto riesgo, cambios que cruzan varios módulos o releases |

El QA puede indicar la profundidad al pedir la tarea. Si no la indica, se usa Estándar.

### 3.5 Espacio de trabajo local (`.qa-work/`)

Cada HU tiene una carpeta local donde se guarda lo que se va produciendo en cada etapa. Sirve para retomar el trabajo en otra sesión sin repetir consultas, para revisar lo que se hizo y como respaldo de lo publicado. Está ignorada por git, salvo dos planillas personales que vienen en el repositorio con una fila de ejemplo (D-83): `.qa-work/indice-general.md` (resumen de todo el trabajo en curso del QA) y `.qa-work/validacion-skills.md` (registro de fallas, faltantes y mejoras de agentes y skills, que el QA envía por el canal de comunicación del equipo). Cada QA las completa en su copia local y no las commitea.

**Jira y Xray siguen siendo la fuente de verdad** de lo publicado. Si lo local y Jira o Xray no coinciden, vale Jira o Xray y se actualiza lo local.

#### Estructura

```text
.qa-work/
└── <CLAVE-HU>/                   ← por ejemplo PROJ-123
    ├── indice.md                 ← HU, equipo, QA, estado de cada etapa y archivos
    ├── 01-contexto.md
    ├── 02-analisis.md
    ├── 03-matriz-cobertura.md
    ├── 04-casos.md
    ├── 04-casos.csv              ← solo si se pidió CSV
    ├── 05-carga-xray.md          ← plan de carga y claves creadas
    ├── 06-reejecucion-<N>.md     ← una por re-ejecución (#2, #3)
    ├── 07-cierre.md
    ├── 08-revision-casos.md      ← si se revisan los casos de la HU
    ├── 09-contexto.md            ← aprendizajes llevados al playbook
    ├── 10-auditoria-ejecucion.md ← auditoría de la ejecución (skill qa-auditar-ejecucion)
    ├── sdd/                      ← solo equipos SDD (00-fuentes.md, 01-revision-spec.md, 02-cobertura-dev.md, 03-plan-datos.md, 04-fwt.md)
    └── bugs/
        └── <AAAA-MM-DD>-<resumen-corto>.md
```

Se usa siempre la clave de la **HU**, aunque el QA haya pasado la de una subtarea. El resto del trabajo local tiene su propia carpeta, cada una con su `indice.md` y archivos numerados por etapa (ver cada skill):

| Trabajo | Carpeta | Ejemplo | Lo crea |
| :--- | :--- | :--- | :--- |
| Sprint | `sprint-<equipo>-<N>/` | `sprint-alfa-12/` | `qa-sprint` |
| Regresión de un release | `regresion-<equipo>-<release>/` (el `<release>` es solo la versión) | `regresion-alfa-2.4/` | `qa-regresion` |
| Automatización | `<CLAVE>/automatizacion/` (clave de la tarea `AUTO`) | `AUTO-45/automatizacion/` | `qa-automation` |
| Performance | `<AUTO-XX>/performance/` | `AUTO-45/performance/` | `qa-performance` |
| Revisión de un PR sin tarea asociada | `pr-<repositorio>/` | `pr-plantilla-automation/` | `qa-pr` |
| Skills en construcción | `skills/<nombre-skill>/` | `skills/qa-revision-accesibilidad/` | `qa-escribir-skills` |

#### Encabezado de cada archivo

```markdown
| Dato | Valor |
| :--- | :--- |
| HU | <CLAVE> <título> |
| Etapa | <Punto de control> |
| Estado | Borrador / Aprobado / Publicado |
| QA | <USUARIO JIRA> |
| Actualizado | <AAAA-MM-DD HH:MM> |
| Publicado en | <claves o links, si aplica> |
```

> **Nota:** cada `<...>` es un dato que la skill reemplaza. "Estado" indica si lo guardado es un borrador, si el QA ya lo aprobó o si ya se publicó en Jira o Xray.

#### Reglas

1. **Al iniciar**, toda skill verifica que exista `.qa-work/<CLAVE-HU>/` y `indice.md`. Si no existen, los crea. No hace falta pedir confirmación: es local.
2. **Si hay trabajo previo**, la skill lo muestra en el punto de control Contexto y pregunta si se reutiliza. Antes, compara la fecha de actualización de la HU en Jira con la del archivo: si la HU cambió después, lo avisa.
3. **Al pasar cada punto de control**, la skill guarda el resultado en su archivo con estado Borrador. Cuando el QA aprueba, lo cambia a Aprobado. Cuando se publica en Jira o Xray, lo cambia a Publicado y anota las claves.
4. **Al guardar**, actualiza `indice.md`.
5. Si un archivo existe, se reemplaza su contenido por la versión nueva y se agrega una línea al historial del `indice.md`. No se crean copias.
6. Nunca se guardan credenciales, tokens ni datos sensibles (steering `qa-seguridad-datos`).

#### Formato de `indice.md`

```markdown
# <CLAVE-HU> <título>

| Dato | Valor |
| :--- | :--- |
| Equipo | <equipo> |
| QA | <USUARIO JIRA> |
| Subtareas QA | <claves> |

## Etapas

| Etapa | Estado | Archivo | Publicado en |
| :--- | :--- | :--- | :--- |
| Contexto | Aprobado | 01-contexto.md | — |
| Análisis | Publicado | 02-analisis.md | Comentario en <CLAVE> |
| Matriz de cobertura | Borrador | 03-matriz-cobertura.md | — |
| Casos de prueba | — | — | — |
| Carga en Xray | — | — | — |
| Re-ejecuciones | — | — | — |
| Cierre | — | — | — |

## Bugs

| Archivo | Estado | Clave |
| :--- | :--- | :--- |

## Historial

| Fecha | Etapa | Cambio |
| :--- | :--- | :--- |
```

---

## 4. Contrato de skill

Una skill es un archivo `.kiro/skills/<nombre>/SKILL.md`. Se arma con la [plantilla de skill](./plantillas/plantilla-skill.md).

### 4.1 Secciones obligatorias

| Sección | Contenido |
| :--- | :--- |
| Frontmatter | `name` y `description`. La descripción dice qué hace y cuándo usarla, con las frases con que la pide un QA |
| Propósito | Qué resuelve, en una o dos oraciones |
| Cuándo usarla y cuándo no | Para evitar que se active en el momento equivocado |
| Entradas | Obligatorias y opcionales. Qué hacer si falta cada una |
| Contexto que lee | Perfil del equipo, documentación funcional, steerings, catálogo de etiquetas |
| Herramientas MCP | Lectura y escritura por separado |
| Pasos | Numerados. Cada paso dice qué consulta o qué produce |
| Punto de confirmación | Qué se muestra y qué confirma el QA (sección 3.2) |
| Entregable | Formato exacto de la salida |
| Reglas | Restricciones propias de la skill, además de las comunes |
| Errores conocidos | Problemas ya vistos y cómo resolverlos |
| Criterios de calidad | Cómo se reconoce una buena salida |
| Casos de aceptación | Situaciones con las que se valida la skill para homologarla |

> **Nota:** el *frontmatter* es el bloque inicial del archivo, entre dos líneas `---`, con los campos `name` (igual al nombre de la carpeta) y `description`.

Sección opcional: **Anti-racionalización**, después de "Reglas", cuando la prueba sin la skill mostró que el agente se saltea pasos. Su formato (regla central, tabla excusa → realidad y banderas rojas) y los dos grados de obligatoriedad (**Recomendación con OK del QA**, por defecto, y **Ley de Hierro**, solo para seguridad o acciones irreversibles) están definidos en `.kiro/skills/qa-escribir-skills/anti-racionalizacion.md`. Toda skill nueva o corregida se escribe con `qa-escribir-skills` (D-63).

> **Nota:** una "racionalización" es una excusa que suena razonable para saltarse una regla de la skill (por ejemplo, "es solo un comentario, lo publico directo").

### 4.2 Reglas de redacción

- Instrucciones en imperativo, cortas y verificables.
- Sin datos de un equipo: se leen del perfil.
- Las reglas técnicas verificadas (campos, vínculos, estados) se toman de `decisiones.md` sección 5 o del steering `qa-jira-xray`. No se copian en cada skill.
- Las transiciones de Jira se buscan por nombre, nunca por id.
- Escrituras en el repositorio de Xray de a una.

### 4.3 Usuario de la sesión

El usuario que ejecuta la skill se obtiene con `atlassianUserInfo` (herramienta del MCP `@atlassian`, D-15). Se usa para asignar, para el reporter y para la firma `Elaborado por <USUARIO JIRA> y Kiro` (D-12).

---

## 5. Contrato de perfil de equipo

Un perfil es un archivo `05-equipos/<equipo>.md`. Se arma con la [plantilla de perfil](./plantillas/plantilla-perfil-equipo.md).

- Contiene solo datos que cambian entre equipos.
- No contiene accountIds ni datos personales sensibles. Los nombres de los integrantes se registran para el reparto (D-23).
- Un campo sin confirmar se marca `Por completar`. La skill que lo necesite pregunta al QA y propone actualizar el perfil.
- Los cambios al perfil se suben por Pull Request del playbook.

---

## 6. Contrato de agente

Un agente es un archivo `.kiro/agents/<nombre>.md` con frontmatter de Kiro (`name`, `description`, `welcomeMessage`, `tools`, `resources`, `includeMcpJson`, `includePowers` y `permissions`). El frontmatter no lleva comentarios (romperían el lector de YAML): cada campo se explica en la sección "Cómo está configurado este agente" del propio archivo. Los permisos siguen D-36: lectura libre (`allow`), escrituras en Jira, Xray y documentación compartida con aprobación (`ask`) y borrados o escrituras en GitHub denegados (`deny`), salvo `qa-pr`, que puede publicar comentarios y PRs con confirmación. El agente debe definir:

| Sección | Contenido |
| :--- | :--- |
| Rol | Quién es y qué no hace |
| Modos | Qué pide el QA y qué skill usa en cada caso |
| Puntos de control | Cuáles de la sección 3.3 aplica en cada modo |
| Herramientas | Lectura libre; escritura en Jira, Xray y el repositorio documental solo después del punto de control correspondiente |
| Handoff | Qué deja preparado al terminar y qué sugiere como siguiente paso |

> **Nota:** *handoff* es el traspaso: lo que el agente deja listo para la etapa siguiente o para la persona que sigue.

---

## 7. Contrato de steering

| Modo de inclusión | Cuándo usarlo |
| :--- | :--- |
| `always` | Solo para reglas cortas que aplican a toda conversación de QA (`qa-principios`) |
| `auto` | Reglas de un tema que Kiro activa por descripción (`qa-jira-xray`, `qa-gherkin`) |
| `fileMatch` | Reglas de un tipo de archivo (repositorios de automatización) |
| `manual` | Referencias que el QA invoca con `#` |

Los steerings referencian la documentación del playbook con `#[[file:...]]` en lugar de copiarla.

---

## 8. Homologación de un componente

| Estado | Significado |
| :--- | :--- |
| Experimental | En construcción. Solo lo usa quien lo arma |
| En evaluación | Lo usa un equipo piloto con casos reales |
| Homologado | Validado. Disponible para todo el equipo |
| Retirado | Reemplazado. Se conserva la referencia al reemplazo |

| Componente | Qué se valida para homologarlo |
| :--- | :--- |
| Skill | Pasa sus casos de aceptación con al menos dos equipos o dos QA distintos, con resultados comparables |
| Agente | Un QA que no lo armó lo usa sin guía y respeta todos los puntos de control |
| Steering | No contradice otros steerings con los repositorios abiertos |
| Perfil | Las skills obtienen con él el mismo resultado que el equipo obtenía antes |
| Hook | Es manual u opcional y no se dispara sin pedido del QA |

El estado de cada componente se registra en `decisiones.md`. Todo cambio se hace por rama y Pull Request.

---

## 9. Contrato de framework de automatización

Los agentes de automatización viven en `qa-playbook` y son iguales para todos los frameworks. Lo que cambia entre frameworks vive en el repositorio de cada uno, con nombres fijos. Así un agente sabe qué leer sin conocer el framework de antemano.

### 9.1 Agentes

| Agente | Responsabilidad | Modos | Escribe |
| :--- | :--- | :--- | :--- |
| `qa-automation` | Implementa y mantiene tests automatizados | `PLANIFICAR`, `IMPLEMENTAR`, `REPARAR`, `REGISTRAR_XRAY`, `ESTADO`, `AUTOMATIZAR` (flujo completo) | Código en el repositorio del framework (con aprobación); Xray (con confirmación) |
| `qa-pr` | Revisa y comenta Pull Requests; crea el PR de una rama | `REVISAR_PR`, `CREAR_PR` | Solo comentarios, aprobaciones y PRs en GitHub, con confirmación. **No modifica código** |

Uso: `AUTOMATIZAR AUTO-45 playwright`, `REPARAR playwright <ruta del spec>`, `REVISAR_PR playwright #245`, `CREAR_PR playwright AUTO-45`.

> **Nota:** `AUTO-45` es una tarea de automatización de Jira (proyecto `AUTO`). `#245` es el número de un Pull Request en GitHub.

### 9.2 Frameworks registrados

| Framework | Alias que acepta el agente | Repositorio | Prefijo |
| :--- | :--- | :--- | :--- |
| Playwright (Front y E2E, *end to end*: de punta a punta; también pruebas de API con `request`) | `playwright`, `pw`, `e2e`, `front` | `plantilla-automation` (incluida en este playbook) | `pw` |
| Karate (API), opcional | `karate`, `back`, `api` | Repositorio propio del equipo. No incluido en esta plantilla | `karate` |
| Mobile (WebdriverIO + Appium), opcional | `mobile`, `mob`, `wdio`, `appium` | Repositorio propio del equipo. No incluido en esta plantilla | `mob` |
| k6 (Performance), opcional | `k6`, `performance`, `perf` | Repositorio propio del equipo. No incluido en esta plantilla | `k6` |

Karate, mobile y k6 son frameworks que el equipo puede sumar siguiendo este contrato; el playbook no los incluye. Un framework nuevo se registra agregando su fila a esta tabla.

> **Nota:** `plantilla-automation` ya trae un ejemplo de pruebas de API hechas con Playwright (carpeta `tests/api/`, proyecto `api` de `playwright.config.ts`). Mientras el equipo no sume Karate, esas pruebas se piden con el alias `playwright`; el alias `api` de la fila de Karate solo vale si el equipo sumó ese framework.

#### Particularidades de mobile

- Lo implementa solo el equipo que haya sumado el framework mobile. Si una tarea de mobile es de otro equipo, el agente lo avisa y sigue solo con la confirmación del QA.
- **Un caso de Xray = un test = un escenario para Android e iOS.** Lo que cambia son los selectores de cada plataforma, que elige la configuración de la ejecución.
- No hay MCP de WebdriverIO y mobile no corre en el CI del repositorio: **el QA ejecuta** en un servicio de dispositivos en la nube o en su emulador y le pasa el resultado al agente. Esa ejecución reemplaza a la validación en el CI.
- Los selectores reales salen del page source (el árbol de elementos de la pantalla) que pasa el QA (skill `mob-explorar-pantalla`).

#### Particularidades de performance (k6)

- Lo atiende el agente **`qa-performance`**, no `qa-automation`: el ciclo es análisis → plan → implementación con smoke (corrida mínima de verificación) en QA → calibración en PRE → corridas en PRE → informe, sin casos Gherkin ni registro en Xray.
- **Se arma en QA, se mide en PRE (preproducción) y se corre siempre desde el CI** (GitHub Actions). Cada corrida en PRE se publica en el repositorio documental del equipo con su análisis.
- Los criterios de aceptación los acuerdan el QA, el líder técnico y arquitectura, a partir de la calibración en PRE.
- Piezas obligatorias en el repo: las mismas de §9.3 (`k6-proyecto`, `k6-buenas-practicas`, `k6-code-review`, `k6-troubleshooting`, `k6-implementar`, `k6-reparar`) más `k6-calibrar`. En el playbook: steering `qa-performance` y skills `qa-performance-analisis`, `qa-performance-plan` y `qa-performance-informe`.
- Trabajo local en `qa-playbook/.qa-work/<AUTO-XX>/performance/`.

### 9.3 Piezas obligatorias en cada repositorio

| Pieza | Ruta | Inclusión | Contenido |
| :--- | :--- | :--- | :--- |
| Contexto del proyecto | `.kiro/steering/<prefijo>-proyecto.md` | `auto` | Stack, estructura de carpetas, arquitectura por capas (en Playwright: Page Objects y tests), tags, idioma de los casos, comandos de ejecución, reglas propias |
| Reglas de código | `.kiro/steering/<prefijo>-buenas-practicas.md` | `fileMatch` | Reglas al escribir código del framework |
| Checklist de revisión | `.kiro/steering/<prefijo>-code-review.md` | `manual` | Criterios propios del framework. Los transversales están en `qa-revisar-pr` |
| Errores conocidos | `.kiro/steering/<prefijo>-troubleshooting.md` | `auto` | Catálogo vivo de errores de ejecución: síntoma, señal en el log, causa confirmada y solución. Lo consulta `<prefijo>-reparar` antes de diagnosticar y lo actualiza con cada causa nueva (D-62) |
| Implementar | `.kiro/skills/<prefijo>-implementar/SKILL.md` | — | Cómo pasar un caso Gherkin a código del framework, capa por capa |
| Reparar | `.kiro/skills/<prefijo>-reparar/SKILL.md` | — | Cómo ejecutar, diagnosticar y corregir un test que falla |

Piezas opcionales: skills de exploración (ej. `pw-explorar-dom`), steerings de patrones y hooks locales.

> **Nota:** `plantilla-automation` incluye hoy `pw-proyecto.md` y `pw-code-review.md` en `.kiro/steering/`. Las demás piezas de la tabla las suma el equipo cuando las necesita; este contrato describe el objetivo, no lo que la plantilla ya trae.

Ningún steering de un repositorio de automatización usa `inclusion: always`: el contexto de QA lo da `qa-principios` y el del framework se carga cuando se trabaja en él.

### 9.4 Cómo resuelve el framework un agente

1. Toma el framework del pedido. Si no está, lo deduce del archivo o rama mencionados; si no puede, pregunta.
2. Verifica que el repositorio esté abierto en el workspace QA-WORKSPACE (D-61). Si no está, pide sumarlo y no sigue.
3. Lee `<prefijo>-proyecto.md` y usa las skills `<prefijo>-*`.
4. Si falta una pieza obligatoria, lo informa y no improvisa.

### 9.5 Entrada: casos de prueba

El input puede venir de cualquier lado. Lo obligatorio es tener **los casos definidos en Gherkin** antes de implementar.

| Origen | Cómo se obtiene |
| :--- | :--- |
| Xray | Tests de un Test Set, una HU o una lista de claves `PROJ-` |
| Flujo `qa-maestro` | `.qa-work/<CLAVE-HU>/04-casos.md` aprobado |
| Pegado por el QA | Gherkin en el chat o en un archivo |
| Sin casos | Se analiza la HU (aunque sea antigua) con `qa-analisis-hu` y se diseñan con `qa-diseno-casos`, con sus puntos de control, antes de planificar |

Cada caso del plan se marca como existente en Xray (con su clave) o nuevo.

### 9.6 Del caso Gherkin al test del framework

| Framework | Regla |
| :--- | :--- |
| Playwright (web) | El caso se implementa como un test de `tests/sin-sesion/<funcionalidad>.spec.ts` (arranca sin usuario autenticado: login y flujos completos) o de `tests/con-sesion/<funcionalidad>.spec.ts` (el login es solo una precondición y la sesión guardada se reutiliza). El título lleva el ID del caso (`test('PROJ-123-CP01 - Login exitoso con usuario válido', ...)`). Los pasos del caso se escriben con los métodos del Page Object (que el test recibe como fixture) y las aserciones `expect` quedan en el test |
| Playwright (API) | El caso se implementa como un test de `tests/api/<recurso>.api.spec.ts`, con el mismo formato de título, usando el cliente de API de `api/` (por ejemplo `UsuariosApi.ts`). Las aserciones sobre el estado HTTP y el cuerpo de la respuesta quedan en el test |
| Karate (si el equipo lo suma) | El caso se convierte a la sintaxis de Karate (`url`, `path`, `request`, `method`, `match`), con contenido en inglés. La skill `karate-implementar` define la conversión y mantiene la trazabilidad con el caso original |

### 9.7 Salida: registro en Xray

Al terminar la implementación, `qa-automation` propone (punto de control **Registro en Xray**):

| Situación del caso | Propuesta |
| :--- | :--- |
| Nuevo (no existe en Xray) | Crear el test Cucumber en Xray con las reglas de `qa-carga-xray` y reemplazar el marcador provisional `XRAY-PENDIENTE` del título del test automatizado por la clave creada |
| Existente en Xray | Pasar Automatizado a `SI` y Estado Automatización a `Automatizado`, y confirmar que el título del test lleve su clave (si lleva el marcador provisional, reemplazarlo) |

Nada se escribe en Xray sin confirmación.

> **Nota (marcador `XRAY-PENDIENTE`):** es el único marcador provisional del playbook y esta sección es su definición. Cuando un caso de automatización todavía no existe en Xray, el test del repositorio lleva en el título `XRAY-PENDIENTE` en lugar del ID del caso (por ejemplo `test('XRAY-PENDIENTE - Login con usuario inactivo', ...)`). La skill `qa-registro-automatizacion` lo reemplaza por el ID real (`PROJ-123-CP05` o la clave del test creado en Xray) y verifica que no quede ninguno en la tarea.

### 9.8 Trabajo local

El trabajo de automatización se guarda en `qa-playbook/.qa-work/<CLAVE>/automatizacion/` (`indice.md`, `01-plan.md`, `02-implementacion.md`, `03-reparacion-<fecha>.md`, `04-registro-xray.md`). `<CLAVE>` es la tarea de Jira del trabajo (ej. `AUTO-45`).

Puntos de control de `qa-automation`: Contexto, Plan de automatización, Feature, Implementación, Verificación, Registro en Xray. En `REPARAR`: Diagnóstico, Corrección.

Puntos de control de `qa-pr`: Revisión, Publicación de la revisión (en `REVISAR_PR`); Revisión previa, PR a crear (en `CREAR_PR`).

> **Nota:** en el punto de control "Feature" se muestra el caso Gherkin que se va a automatizar; en un framework sin archivos `.feature`, como Playwright, es el caso con el título y los pasos del test que se va a escribir.

### 9.9 Reglas comunes a todos los frameworks

Aplican a Playwright y a todo framework que se sume. Cada `<prefijo>-proyecto.md` muestra el formato con la sintaxis de su framework.

#### Escenario excluido: bug o problema de ambiente

Un escenario que no puede ejecutarse en verde se **excluye** (en Playwright, con `test.skip` y un comentario; en frameworks con archivos de texto, comentándolo entero) para que no corra en el CI, con una de estas dos marcas. Nunca se borra.

| Marca | Significa | Cuándo |
| :--- | :--- | :--- |
| `@BUG @BUG_<ID>` | Falla por un bug de la aplicación, reportado en Jira | El comportamiento real contradice la HU o el caso |
| `@SKIP_WIP` | **Excluido temporalmente por un problema de ambiente o de datos**, ajeno al test y a la aplicación | Servicio caído o inestable, dato de prueba inexistente o bloqueado, ambiente en mantenimiento |

Todo `@SKIP_WIP` lleva siempre, en las líneas de comentario de arriba del escenario:

1. Qué significa: `SKIP_WIP: excluido temporalmente por un problema de ambiente o de datos (no es un bug del test ni de la aplicación)`.
2. **Causa**, con la evidencia (servicio, dato o ambiente; error o request).
3. **Desde**: fecha en que se excluyó (`AAAA-MM-DD`).
4. **Revisar**: fecha en que se vuelve a probar. Por defecto, dos semanas después.
5. **QA** que lo marcó.

```text
# @SKIP_WIP: excluido temporalmente por un problema de ambiente o de datos (no es un bug del test ni de la aplicación)
# Causa: <servicio, dato o ambiente y evidencia> | Desde: AAAA-MM-DD | Revisar: AAAA-MM-DD | QA: <usuario>
# <tags del escenario>
# Scenario: <nombre>
#   ...
```

> **Ejemplo (Playwright):** en un `.spec.ts` el comentario va con `//` encima del test y el test se excluye con `test.skip(...)`. Por ejemplo, un test de checkout que depende de un servicio de pagos caído en QA: `// @SKIP_WIP ... Causa: servicio de pagos de QA caído (HTTP 503) | Desde: 2026-11-02 | Revisar: 2026-11-16 | QA: ana.qa` y debajo `test.skip('PROJ-123-CP04 - Pago con tarjeta', ...)`.

> **Ejemplo (Playwright, `@BUG`):** un test que falla por un bug reportado en Jira (`PROJ-150` es una clave de ejemplo del bug) se excluye así: comentario `// @BUG @BUG_PROJ-150` encima del test y `test.skip('PROJ-103-CP04 - Datos completos muestran el resumen con el total del producto', ...)`. El `<ID>` de `@BUG_<ID>` es la clave del bug en Jira.

Se descomenta y se quita la marca cuando el escenario vuelve a pasar. Un `@SKIP_WIP` vencido (fecha de revisión pasada) se vuelve a probar o se renueva con nueva fecha y motivo; nunca queda indefinido. Un `@SKIP_WIP` sin causa o sin fechas es una observación **Importante** en la revisión del PR.

Ciclo del bug:

- Al marcarlo: excluir el escenario con `@BUG @BUG_<ID>`. Si falla el archivo entero (feature o spec), la marca va a nivel del archivo o del grupo `test.describe`; si fallan escenarios puntuales, en cada uno.
- Cuando llega el fix: reactivar y ejecutar. **Las marcas se quitan solo si el escenario pasa.** Si sigue fallando por el mismo bug, se vuelve a excluir y se informa que el bug sigue vigente. Si el fix es parcial, la marca pasa del archivo a los escenarios que siguen fallando.

#### Intentos de reparación

Como máximo **2 intentos de corrección** por escenario, en todos los frameworks. Si después del segundo sigue fallando:

1. No se sigue probando ni parchando.
2. Se deja el código como estaba antes del intento fallido (sin cambios a medias).
3. Se avisa al QA con: escenario, error, qué se probó en cada intento, causa sospechada y qué conviene verificar a mano.

Si en los 2 intentos el escenario alterna pasa/falla, se marca `FLAKY` (test inestable) en el reporte y se avisa igual.

#### CI (GitHub Actions)

| Ejecución | Herramienta | Para qué |
| :--- | :--- | :--- |
| **Pipeline en cada push y PR** | Workflow `.github/workflows/playwright.yml` del repositorio, consultado con `@github` | Validar un arreglo o una cobertura nueva **antes de integrar a la rama principal**. El QA sube su rama y el agente lee el resultado de la corrida |
| **Ejecuciones periódicas** | Workflow programado (`schedule`) del repositorio, consultado con `@github` | Ahí están los resultados y los errores a revisar, y las tareas de revisión `AUTO-` que genera cada ejecución |

Excepciones: **mobile** no usa el CI del repositorio (la validación es la ejecución del QA en Android e iOS) y **k6** usa el CI para calibrar y ejecutar en PRE.

Los agentes solo leen el CI (corridas, artefactos, logs filtrados). Un PR de automatización lleva en su descripción la corrida de GitHub Actions que lo validó.

#### Tamaño de los archivos de casos (recomendación)

- Hasta **10 escenarios** por feature (en Playwright, por archivo `.spec.ts` o por `test.describe`).
- Background (precondiciones comunes) de hasta **3 pasos** (en Playwright, un `test.beforeEach` corto).

Si un caso necesita más, el agente lo avisa en el punto de control Feature, explica por qué y sigue solo si el QA lo confirma.

---

## 10. Convenciones de Git

Aplican a `qa-playbook` y a todos los repositorios de automatización, alojados en GitHub.

| Elemento | Formato | Ejemplo |
| :--- | :--- | :--- |
| Rama | `feature/<CLAVE>-<resumen>` | `feature/AUTO-45-login-negativos` |
| Commit | `<CLAVE>: <qué cambia>` | `AUTO-45: agrega casos negativos de login` |
| Título del PR | `<TIPO> \| <CLAVE> \| <título de la tarea en Jira>` | `FEAT \| AUTO-45 \| Automatizar casos negativos de login` |
| Rama destino | `main` | |

> **Nota:** `<CLAVE>` es la clave de Jira de la tarea o historia (`AUTO-45`, `PROJ-123`). `<resumen>` son dos o tres palabras en minúscula unidas por guiones. El PR se crea con la plantilla de descripción homologada (skill `qa-crear-pr`).

| Tipo de PR | Cuándo |
| :--- | :--- |
| `FEAT` | Tarea o historia: cobertura o contenido nuevo |
| `FIX` | Bug o corrección |
| `CHORE` | Mantenimiento sin cambio funcional |

La clave de Jira puede ser de cualquier proyecto (`AUTO-`, `PROJ-`, etc.). El título del PR se toma del summary de la tarea en Jira, nunca de los commits. Un commit cuenta qué cambia en el repositorio; no lleva tipo ni prefijos adicionales.
