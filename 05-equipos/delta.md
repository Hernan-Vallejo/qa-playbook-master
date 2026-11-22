# Perfil de Equipo: Equipo Delta (DELTA)

> **Para qué sirve:** reúne lo propio del Equipo Delta (proyecto de Jira, integrantes, nombres de artefactos, etiquetas, rutas) para que los agentes y skills lo lean en lugar de preguntarlo cada vez. Delta es el equipo que trabaja con SDD.
> **Quién lo usa:** el QA del Equipo Delta y los agentes de Kiro (`qa-sdd` y sus skills).
> **Cuándo se usa:** al empezar el sprint, al revisar la spec de una HU (historia de usuario) de pedidos y seguimiento, y cada vez que cambie algún dato del equipo.

> **Nota:** este perfil es un **ejemplo genérico** del producto Tienda Demo. Los campos marcados "Por completar" los configura el equipo. Si una skill necesita uno, lo pregunta y propone actualizar este archivo.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Última actualización | 2026-11-02 |
| Responsable del perfil | Por completar |
| Modalidad de trabajo | SDD |

Equipo que trabaja con **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones): desarrollo escribe `requirement.md`, `design.md` y `tasks.md` de cada HU antes de implementar. Sus HU se trabajan con el agente `qa-sdd` y el [DoR y DoD SDD](../01-estandares-globales/definicion-dor-dod-sdd.md). DoR es *Definition of Ready* (cuándo una HU está lista para empezar) y DoD es *Definition of Done* (cuándo está terminada).

## 1. Jira

| Campo | Valor |
| :--- | :--- |
| Proyecto de las HU | `PROJ` (el equipo se distingue por la etiqueta `delta`) |
| Board | Por completar |
| Patrón del nombre del sprint | `Sprint N` (ej. "Sprint 12") |
| HU a probar (JQL) | `project = PROJ AND issuetype = Story AND labels = delta AND sprint = <SPRINT_ID>`. Confirmar si el equipo usa el campo "Requiere pruebas de testing" |
| Subtareas QA | `[QA] Análisis de Testabilidad y Refinamiento de Contexto`, `[QA] Diseño de Pruebas y Datos`, `[QA] Ejecución de test cases` |
| Proyecto de los bugs | `PROJ` (tipo de issue `Bug`). Confirmar |

> **Nota:** la subtarea `[QA] Análisis de Testabilidad y Refinamiento de Contexto` es propia de SDD: QA revisa la spec **antes** de que se programe.

## 2. Integrantes y reparto

| Campo | Valor |
| :--- | :--- |
| Modalidad | Un solo QA |
| Integrantes | Por completar |
| Reparto | No aplica |
| Regla de reparto | No aplica |
| Responsable del test plan | El QA del equipo |

## 3. Contexto funcional

| Visión | Carpetas de `04-funcionalidades/` |
| :--- | :--- |
| Cliente | `vision-cliente/05-pedidos-sdd/` (pedidos y seguimiento, épica PROJ-40, historia PROJ-142) |

> **Nota:** la carpeta `05-pedidos-sdd/` es el **ejemplo completo de documentación SDD**: contexto, reglas, datos de prueba, glosario, épicas e historias con sus preguntas abiertas.

## 4. Nombres de los artefactos

| Artefacto | Patrón |
| :--- | :--- |
| Test | `Cliente.<Capa>.<título>` (ej. `Cliente.Api.Consultar pedido de otro comprador no lo revela`) |
| Test Set | `<CLAVE-HU> <título de la HU>` |
| Test Execution | `<CLAVE-HU> <título de la HU>` |
| Test plan del sprint | `Test Plan Sprint 12 - Equipo Delta` |
| Plantilla del test plan | Homologada: `02-qa-funcional/plantillas/test-plan-sprint.html` |
| Test plan de regresión | `Test Plan Regresión Release 2.4` |
| Estrategia propia (sección 3 del plan) | Por completar |
| Tarea de automatización (proyecto `AUTO`) | `[TAE] Delta - Web \| <título exacto de la tarea origen>` (o `API`, según la capa) |

## 5. Etiquetas

| Categoría | Valor |
| :--- | :--- |
| Equipo | `delta` |
| Visión | No aplica (el catálogo de etiquetas no usa etiqueta de visión) |
| Funcionalidad (nivel 2) habitual | `pedidos` |
| Módulo habitual | Por completar |
| Cómo se elige el nivel 3 | Se busca en el catálogo según la HU ([catalogo-etiquetas.md](../02-qa-funcional/catalogo-etiquetas.md)) |

## 6. Rutas en Xray y en el repositorio de evidencias

| Campo | Valor |
| :--- | :--- |
| Repositorio de tests en Xray | `Delta/Sprint N/<CLAVE-HU> <título>` (ejemplo) |
| Base de evidencias | Por completar (repositorio documental del equipo, ej. SharePoint o Drive) |
| Carpeta del sprint | `Sprint N` |
| Carpeta de la HU | `<CLAVE-HU> <summary>` |
| Clasificación por área | No aplica |

## 7. Bugs

| Campo | Valor |
| :--- | :--- |
| Versiones por capa | Por completar (FRONT, BFF y BACK) |
| Sprint o backlog | Preguntar al QA en cada bug |

## 8. Descripción de los tests

| Campo | Valor |
| :--- | :--- |
| Incluye bloque técnico | Por completar |
| Referencias habituales | Spec de la HU (`requirement.md`, `design.md`); documentación de API (Swagger) de cada servicio en su repositorio |
| Consultas habituales | SQL de referencia (solo SELECT) sobre la base ficticia `tienda_qa`: `vision-cliente/04-checkout/consultas-sql-qa.md` y `vision-cliente/05-pedidos-sdd/historias/proj-142-consultar-estado-pedido/datos-prueba.md` |

## 9. Particularidades

- **Spec de cada HU:** la ubicación (repositorio, rama y ruta, o ruta local) la indica el QA en cada HU. El agente no la adivina. Patrones vistos en equipos SDD, solo como referencia: `.kiro/specs/<CLAVE-HU>-*/` y `specs/<CLAVE-HU>-*/` en el repositorio del servicio.
- **Servicios habituales (ejemplo):** `pedidos-back`, `tienda-bff` y `tienda-ui` (ver `vision-cliente/05-pedidos-sdd/contexto.md`). Los repositorios reales están por confirmar.
- **Integraciones externas:** el servicio de logística está **Pendiente de definir por el PO**. Para el plan de datos, definir mock, sandbox o stub de cada integración.
- **Front:** las HU con pantalla requieren el link del diseño (Figma, en el ejemplo) en la HU o en el requirement; sin él, la revisión de la spec lo marca como gap crítico. El servidor MCP `@figma` es opcional: sirve para leer el diseño, no para tenerlo.
- **Preguntas al PO:** todo lo que la spec no responde queda en `preguntas-abiertas.md` de la HU y se publica en Jira mencionando al PO, previa aprobación del texto exacto.
- **Skills SDD habituales:** `qa-sdd-revision-spec`, `qa-sdd-plan-datos`, `qa-sdd-cobertura-dev` y `qa-sdd-fwt`.

## 10. Registro de cambios

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Versión inicial del perfil de ejemplo: modalidad SDD, proyecto, subtareas QA y contexto funcional |
