# Plantilla de Perfil de Equipo

> **Para qué sirve:** es el molde para crear el perfil de un equipo. El perfil reúne lo que cambia de un equipo a otro (proyecto de Jira, integrantes, nombres de artefactos, etiquetas, rutas) para que los agentes y skills, que son iguales para todos, lo lean en lugar de preguntarlo.
> **Quién lo usa:** el QA responsable del perfil de un equipo (en el ejemplo: Equipo Alfa, Beta, Gamma o Delta), y los agentes y skills que lo leen.
> **Cuándo se usa:** al incorporar un equipo nuevo al playbook, y cada vez que cambie algún dato del equipo (integrantes, versiones, rutas).

Copiar el bloque de abajo en `05-equipos/<equipo>.md` (por ejemplo `05-equipos/alfa.md`) y completar cada campo. Un dato sin confirmar se marca `Por completar`. Las reglas del contrato están en [contratos.md](../contratos.md), en la parte que describe los perfiles de equipo.

**Modalidad de trabajo** indica qué agente usa el equipo para sus HU (HU = historia de usuario):

- `Funcional` → `qa-maestro`.
- `SDD` → `qa-sdd`. SDD (*Spec-Driven Development*, desarrollo guiado por especificaciones) significa que desarrollo escribe `requirement.md`, `design.md` y `tasks.md` antes de implementar. En el ejemplo, el Equipo Delta trabaja así.

En un equipo SDD, la sección 1 registra también la subtarea `[QA] Análisis de Testabilidad y Refinamiento de Contexto` y la sección 9 dónde suele guardar el equipo su spec (como referencia: la ubicación de cada HU la indica el QA).

> **Ejemplo de equipos:** Equipo Alfa (catálogo y carrito, etiqueta `alfa`), Equipo Beta (checkout y pagos, `beta`), Equipo Gamma (cuenta y acceso, `gamma`) y Equipo Delta (trabaja con SDD, `delta`). El proyecto de Jira de ejemplo tiene clave `PROJ`.

> **Nota:** el bloque de abajo usa marcadores entre `<` y `>`: se reemplazan por el valor real. Todo lo que está entre comillas o con formato de código es un ejemplo del mundo genérico (Tienda Demo).

```markdown
# Perfil de Equipo: <Nombre del equipo> (<CLAVE>)

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Última actualización | <AAAA-MM-DD> |
| Responsable del perfil | <Nombre> |
| Modalidad de trabajo | <Funcional / SDD> |

## 1. Jira

| Campo | Valor |
| :--- | :--- |
| Proyecto de las HU | `<CLAVE>` |
| Board | `<id>` (<nombre>) |
| Patrón del nombre del sprint | <ej. "Sprint N"> |
| HU a probar (JQL) | `project = <CLAVE> AND issuetype = Story AND "Requiere pruebas de testing" = Sí AND sprint = <SPRINT_ID>` |
| Subtareas QA | <ej. "[QA] - Definición de Casos de Prueba", "[QA] - Ejecución de Casos de Prueba"> |
| Proyecto de los bugs | `<CLAVE>` |

## 2. Integrantes y reparto

| Campo | Valor |
| :--- | :--- |
| Modalidad | <Un solo QA / Varios QA> |
| Integrantes | <Nombres> |
| Reparto | <Lo deciden los QA / Lo reparte Kiro por HU / No aplica> |
| Regla de reparto | <ej. 50 % de las HU para cada QA, sorteo aleatorio> |
| Responsable del test plan | <ej. alterna por sprint / fijo> |

## 3. Contexto funcional

| Visión | Carpetas de `04-funcionalidades/` |
| :--- | :--- |
| <Visión> | `<ruta>` |

## 4. Nombres de los artefactos

| Artefacto | Patrón |
| :--- | :--- |
| Test | `<Área>.<Capa>.<título>` con Área = `<visión>` (ej. `Cliente`) y Capa = `FRONT`, `BFF`, `BACK` o `BACKOFFICE` |
| Test Set | `<CLAVE-HU> <título de la HU>` |
| Test Execution | `<CLAVE-HU> <título de la HU>` |
| Test plan del sprint | <ej. "Test Plan Sprint 12 - Equipo Alfa"> |
| Plantilla del test plan | Homologada: `02-qa-funcional/plantillas/test-plan-sprint.html` |
| Test plan de regresión | <patrón, ej. "Test Plan Regresión Release 2.4"> |
| Estrategia propia (sección 3 del plan) | <texto o filtros de automatización del equipo> |
| Tarea de automatización (proyecto `AUTO`) | `[TAE] <Área> - <Canal> \| <título exacto de la tarea origen>`, con Área = <nombre del equipo, ej. "Alfa"> y Canal = <regla, ej. según el prefijo de la HU: `[WEB]` → Web, `[API]` → API>. `[TAE]` es un prefijo de ejemplo: cada equipo define el suyo |

## 5. Etiquetas

| Categoría | Valor |
| :--- | :--- |
| Equipo | `<etiqueta>` |
| Visión | `<etiqueta>` |
| Funcionalidad (nivel 2) habitual | `<etiqueta>` |
| Módulo habitual | `<etiqueta o ninguno>` |
| Cómo se elige el nivel 3 | Se busca en el catálogo según la HU |

## 6. Rutas en Xray y en el repositorio de evidencias

| Campo | Valor |
| :--- | :--- |
| Repositorio de tests en Xray | `<ruta>/Sprint N/<CLAVE-HU> <título>` |
| Base de evidencias | `<ruta en el repositorio documental del equipo, ej. SharePoint o Drive>` |
| Carpeta del sprint | `<patrón>` |
| Carpeta de la HU | `<CLAVE-HU> <summary>` |
| Clasificación por área | <No aplica / regla por prefijo del título> |

## 7. Bugs

| Campo | Valor |
| :--- | :--- |
| Versiones por capa | FRONT: `<versión>`, BFF: `<versión>`, BACK: `<versión>` |
| Sprint o backlog | Preguntar al QA en cada bug |

## 8. Descripción de los tests

| Campo | Valor |
| :--- | :--- |
| Incluye bloque técnico | <Sí / No> |
| Referencias habituales | Figma: `<url>`; documentación de API del BACK: `<url>`; documentación de API del BFF: `<url>` |
| Consultas habituales | <SQL de referencia (solo SELECT) sobre la base `tienda_qa`, o "Ver documentación funcional"> |

## 9. Particularidades

- <Reglas propias del equipo que no cubre el estándar.>

## 10. Registro de cambios

| Fecha | Cambio |
| :--- | :--- |
| <AAAA-MM-DD> | Versión inicial |
```

## Cómo completar cada sección

> **Nota:** el bloque de arriba se copia tal cual y se completa campo por campo. Esta guía explica qué va en cada sección (el bloque no lleva comentarios dentro de las tablas para no romper el formato Markdown).

| Sección | Qué se completa y por qué |
| :--- | :--- |
| Encabezado | `Estado` empieza en `Experimental` (los estados posibles son los de contratos, sección 8). `Responsable del perfil` es quien lo mantiene al día. `Modalidad de trabajo` define qué agente se usa. |
| 1. Jira | Dónde viven las HU y cómo encontrarlas. El JQL (el lenguaje de búsqueda de Jira) lista las HU del sprint que requieren testing; si varios equipos comparten proyecto, se agrega `AND labels = <etiqueta del equipo>`. El campo "Requiere pruebas de testing" es propio de cada instancia de Jira: si no existe, el equipo define otro criterio y lo anota acá. `Subtareas QA` son las subtareas estándar que se crean en cada HU. |
| 2. Integrantes y reparto | Quiénes son los QA y cómo se reparten las HU. Si hay un solo QA, `Reparto` es `No aplica`. |
| 3. Contexto funcional | Qué carpetas de `04-funcionalidades/` debe leer Kiro antes de proponer casos para este equipo. |
| 4. Nombres de los artefactos | Los patrones de nombre de tests, Test Sets, Test Executions y test plans, para que todos los equipos usen nombres consistentes. |
| 5. Etiquetas | Las etiquetas del catálogo ([catalogo-etiquetas.md](../../../02-qa-funcional/catalogo-etiquetas.md)) que usa habitualmente el equipo. |
| 6. Rutas | Dónde se guardan los tests en Xray y las evidencias en el repositorio documental. En `plantilla-automation`, las capturas automáticas quedan en `evidencias/<ID-HISTORIA>/` y desde ahí se copian. |
| 7. Bugs | Versiones por capa (FRONT, BFF y BACK) que se informan en cada bug. BFF (*Backend For Frontend*) es el servicio intermedio entre el front y el back. |
| 8. Descripción de los tests | Qué referencias (diseños, documentación de API, consultas SQL de solo lectura) se incluyen en la descripción de cada test. |
| 9. Particularidades | Todo lo propio del equipo que el estándar no cubre. |
| 10. Registro de cambios | Historial de cambios del perfil, para saber qué cambió y cuándo. |
