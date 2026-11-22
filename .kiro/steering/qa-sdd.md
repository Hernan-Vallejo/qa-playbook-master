---
inclusion: auto
name: qa-sdd
description: Reglas del flujo de QA de los equipos que trabajan con SDD (Spec-Driven Development) - la HU llega con requirement.md, design.md y tasks.md escritos por desarrollo; jerarquía de verdad, dónde están las specs (las indica el QA), subtarea estándar de QA, versiones de las fuentes, revisión de la spec, paquete para desarrollo, FWT, auditoría de la ejecución y DoR/DoD SDD. Activar cuando la HU es de un equipo con Modalidad de trabajo SDD, cuando se habla de SDD, spec, requirement.md, design.md, tasks.md, FWT o del agente qa-sdd.
---
# Flujo SDD (Spec-Driven Development)

> **Para qué sirve:** define cómo trabaja QA con un equipo que usa SDD: jerarquía de fuentes, dónde está la spec, qué subtareas y comentarios se usan, qué etapas tiene el recorrido y qué reglas se respetan.
> **Quién lo usa:** el agente `qa-sdd` y las skills `qa-sdd-revision-spec`, `qa-sdd-cobertura-dev`, `qa-sdd-plan-datos` y `qa-sdd-fwt` (Kiro lo carga solo, `inclusion: auto`), y los QA del **Equipo Delta**, que es el equipo de ejemplo que trabaja con SDD.
> **Cuándo se usa:** cuando la HU es de un equipo con Modalidad de trabajo SDD, o cuando se habla de spec, `requirement.md`, `design.md`, `tasks.md` o FWT.

> **Nota:** **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) significa que antes de programar se escribe una especificación (*spec*) revisable. QA la revisa y deriva de ella casos y datos de prueba. Ejemplo funcional del playbook: la épica "Pedidos y seguimiento" (`PROJ-40`) y la historia `PROJ-142` "Consultar el estado de un pedido"; sus documentos están en `04-funcionalidades/vision-cliente/05-pedidos-sdd/`.

Un equipo **SDD** trabaja con Spec-Driven Development: antes de implementar, desarrollo escribe la especificación de la HU en `requirement.md` (qué se necesita), `design.md` (cómo se diseña: endpoints, contratos, estados) y `tasks.md` (las tareas de implementación). La HU de Jira suele traer menos detalle que en un equipo funcional; QA analiza a partir de la HU **y** de la spec, diseña los casos en paralelo al desarrollo y valida contra ellos.

El equipo se reconoce por el campo **Modalidad de trabajo** de su perfil en `05-equipos/`. Si dice `SDD`, se usa el agente `qa-sdd`. Si dice `Funcional`, el agente `qa-maestro`. Los dos flujos conviven y reutilizan las mismas skills de análisis, diseño, carga, bugs, re-ejecución y cierre.

DoR y DoD de estos equipos: #[[file:01-estandares-globales/definicion-dor-dod-sdd.md]]

## Recorrido

```text
Refinamiento (antes del sprint)            Sprint
──────────────────────────────            ─────────────────────────────────────────────
REVISAR_SPEC → ANALIZAR → GENERAR_TESTS → PAQUETE → CARGAR_XRAY → FWT → EJECUTAR → CIERRE_HU
 Coherencia    Contexto    Matriz (Gate 1)  Paquete    Carga en     FWT   Ejecución   Cierre
 Comentario    Análisis    Casos            (Gate 2)   Xray               Auditoría
```

- **Gate 1** es la Matriz de cobertura: qué se prueba y qué no, antes de escribir los casos. (Un *gate* es un punto de control donde el QA aprueba antes de seguir.)
- **Gate 2** es el Paquete: la cobertura que se propone a desarrollo y el plan de datos, antes de cargar en Xray y de entregarlo al equipo.
- `REPORTAR_BUG` y `REEJECUTAR` se usan cuando corresponden, igual que en el flujo funcional.

## Jerarquía de verdad

1. **HU de Jira** (criterios de aceptación y decisiones de refinamiento).
2. `requirement.md`.
3. `design.md`.
4. `tasks.md`.

El código, la base de datos y el comportamiento del ambiente son **contexto**: sirven para entender y para buscar datos, pero **nunca redefinen el resultado esperado**. Si el código hace otra cosa que la spec, es un hallazgo; no se ajusta el caso al código.

Si dos fuentes se contradicen, gana la de mayor jerarquía y la contradicción se informa. Nunca se resuelve en silencio.

> **Ejemplo:** la HU `PROJ-142` y la regla `RN-PED-08` definen el estado final de un pedido cancelado como `CANCELADO`, pero `design.md` lo llama `ANULADO`. Gana la HU, y la diferencia se informa al equipo en el comentario de la revisión de la spec.

## Dónde está la spec

Cada equipo SDD decide dónde guarda su spec. **La ubicación la indica el QA**:

- Repositorio de GitHub, rama y ruta de cada archivo, o
- Ruta local en el workspace.

Si el QA no la indica, se pregunta. **Nunca se adivina** el repositorio, la rama ni la ruta, aunque el perfil sugiera un patrón. Si un archivo no se puede leer, se informa cuál y no se sigue con esa fuente.

## Versiones de las fuentes

Cada vez que se lee la spec, se registra en `.qa-work/<CLAVE-HU>/sdd/00-fuentes.md`:

| Fuente | Ubicación | Versión leída | Leída el |
| :--- | :--- | :--- | :--- |
| HU | `<CLAVE>` | Actualizada en Jira el `<fecha>` | `<fecha>` |
| requirement.md | `<repo> · <rama> · <ruta>` o ruta local | Último commit `<sha corto>` del `<fecha>` o fecha de modificación | `<fecha>` |
| design.md | ... | ... | ... |
| tasks.md | ... | ... | ... |

Al retomar una etapa, se compara con lo registrado. Si alguna fuente cambió, se avisa qué etapas aprobadas pueden haber quedado desactualizadas y se pregunta si se rehacen. No se usan hashes ni archivos JSON.

> **Nota:** el "sha corto" es el identificador abreviado de un commit de Git (por ejemplo `a1b2c3d`). Sirve para saber exactamente qué versión del archivo se leyó.

## Subtareas estándar de QA

Todo equipo SDD tiene en cada HU estas subtareas de QA. Los comentarios de cada etapa van a la subtarea que corresponde:

| Subtarea | Etapas que comenta |
| :--- | :--- |
| **`[QA] Análisis de Testabilidad y Refinamiento de Contexto`** | Revisión de la spec, Análisis |
| `[QA] Diseño de Pruebas y Datos` | Paquete (cobertura para desarrollo y plan de datos) |
| `[QA] Ejecución de test cases` | FWT, Auditoría de la ejecución, Cierre |

- Las subtareas se buscan por nombre entre las de la HU, sin distinguir tildes (en Jira pueden estar escritas de las dos formas).
- Si la subtarea de una etapa no existe, se usa la de Análisis de Testabilidad solo si el QA lo confirma. Si tampoco existe, se pide la clave al QA. **Nunca** se publica en la HU padre sin que el QA lo indique.
- El comentario es un resumen accionable de hasta ~40 líneas, no el reporte completo.
- Se muestra el borrador y se publica solo con OK explícito. Ver el steering `qa-jira-xray` para el formato y la firma.
- Si ya hay un comentario anterior de la misma etapa, se pregunta si se edita o se agrega uno nuevo.
- **No** se incluyen rutas locales, nombres de skills ni referencias al flujo interno de Kiro: el comentario es para el equipo.

## Espacio de trabajo

El trabajo propio del flujo SDD va en `.qa-work/<CLAVE-HU>/sdd/`, junto a los archivos comunes de la HU (`02-analisis.md`, `03-matriz-cobertura.md`, `04-casos.md`, ...):

```text
.qa-work/<CLAVE-HU>/
├── indice.md
├── 01-contexto.md … 07-cierre.md   ← mismos archivos que el flujo funcional
├── 10-auditoria-ejecucion.md       ← auditoría de la ejecución (skill qa-auditar-ejecucion, también se usa fuera de SDD)
└── sdd/
    ├── 00-fuentes.md               ← ubicación y versión de la spec
    ├── 01-revision-spec.md
    ├── 02-cobertura-dev.md
    ├── 03-plan-datos.md
    └── 04-fwt.md
```

## Qué es propio del flujo SDD

| Etapa | Qué agrega frente al flujo funcional |
| :--- | :--- |
| Revisión de la spec | Comparación 1×1 de los criterios entre HU, requirement y design; contratos completos; trazabilidad criterio → endpoint; tasks huérfanas (tareas que no responden a ningún criterio); gaps que impiden escribir casos |
| Análisis | La spec aprobada es fuente del análisis, además de la HU y la documentación funcional |
| Paquete | Qué cobertura conviene que haga desarrollo (unitarios, mocks de front) y qué queda para QA integrado; plan de datos por caso |
| FWT | *Functional Walkthrough*: revisión estática del código antes del deploy a QA: alineación, Swagger, seguridad básica, testabilidad y cobertura unitaria |
| Ejecución | Cada PASS se audita: un PASS del runner no es un PASS validado |
| Cierre | DoD SDD, incluida la spec actualizada |

## Reglas

- **SDD no es cascada.** Una diferencia entre lo implementado y la spec se informa; el equipo decide si se corrige el código o se actualiza la spec. QA no rechaza una mejora solo porque no estaba escrita.
- **Toda diferencia se reporta** con su severidad. Que parezca menor no la saca del reporte; decide el QA.
- **Una decisión de refinamiento que la spec contradice es una discrepancia funcional**, aunque en la spec aparezca como configuración o parámetro técnico.
- **Un mock de front no cubre un endpoint.** Demuestra que el front maneja esa respuesta, no que el back la produzca. (Un *mock* es una respuesta simulada que reemplaza al servicio real.)
- **Lectura del código de desarrollo: solo lectura.** No se modifica requirement, design, tasks ni código del producto. Publicar algo en la rama de desarrollo necesita OK explícito.
- Las demás reglas (confirmación antes de escribir, no inventar, no borrar) son las de `qa-principios` y `00-introduccion/kiro/contratos.md`.
