# Perfil de Equipo: Equipo Alfa (ALFA)

> **Para qué sirve:** reúne lo propio del Equipo Alfa (proyecto de Jira, integrantes, nombres de artefactos, etiquetas, rutas) para que los agentes y skills lo lean en lugar de preguntarlo cada vez.
> **Quién lo usa:** el QA del Equipo Alfa y los agentes de Kiro (`qa-maestro` y sus skills).
> **Cuándo se usa:** al empezar el sprint, al analizar una HU (historia de usuario) de catálogo o carrito, y cada vez que cambie algún dato del equipo.

> **Nota:** este perfil es un **ejemplo genérico** del producto Tienda Demo. Los campos marcados "Por completar" los configura el equipo. Si una skill necesita uno, lo pregunta y propone actualizar este archivo.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Última actualización | 2026-11-02 |
| Responsable del perfil | Por completar |
| Modalidad de trabajo | Funcional |

## 1. Jira

| Campo | Valor |
| :--- | :--- |
| Proyecto de las HU | `PROJ` (el equipo se distingue por la etiqueta `alfa`) |
| Board | Por completar |
| Patrón del nombre del sprint | `Sprint N` (ej. "Sprint 12") |
| HU a probar (JQL) | `project = PROJ AND issuetype = Story AND labels = alfa AND "Requiere pruebas de testing" = Sí AND sprint = <SPRINT_ID>` |
| Subtareas QA | `[QA] - Definición de Casos de Prueba`, `[QA] - Ejecución de Casos de Prueba` |
| Proyecto de los bugs | `PROJ` (tipo de issue `Bug`) |

> **Nota:** el JQL es el lenguaje de búsqueda de Jira. `<SPRINT_ID>` se reemplaza por el identificador del sprint. El campo "Requiere pruebas de testing" es el que usa el playbook (steering `qa-jira-xray`) para saber qué HU necesitan QA; es propio de cada instancia de Jira: confirmá el nombre real con el equipo. Como los cuatro equipos comparten el proyecto `PROJ`, el JQL filtra por la etiqueta del equipo.

## 2. Integrantes y reparto

| Campo | Valor |
| :--- | :--- |
| Modalidad | Varios QA |
| Integrantes | Por completar |
| Reparto | Lo deciden los QA |
| Regla de reparto | Por completar |
| Responsable del test plan | Por completar (puede alternar por sprint) |

## 3. Contexto funcional

| Visión | Carpetas de `04-funcionalidades/` |
| :--- | :--- |
| Cliente | `vision-cliente/02-catalogo/` y `vision-cliente/03-carrito/` |

> **Nota:** si una HU de carrito toca el checkout o el login, también se leen `vision-cliente/04-checkout/` y `vision-cliente/01-acceso/`.

## 4. Nombres de los artefactos

| Artefacto | Patrón |
| :--- | :--- |
| Test | `Cliente.<Capa>.<título>` (ej. `Cliente.FRONT.Contador del carrito suma un producto`) |
| Test Set | `<CLAVE-HU> <título de la HU>` |
| Test Execution | `<CLAVE-HU> <título de la HU>` |
| Test plan del sprint | `Test Plan Sprint 12 - Equipo Alfa` |
| Plantilla del test plan | Homologada: `02-qa-funcional/plantillas/test-plan-sprint.html` |
| Test plan de regresión | `Test Plan Regresión Release 2.4` |
| Estrategia propia (sección 3 del plan) | Por completar |
| Tarea de automatización (proyecto `AUTO`) | `[TAE] Alfa - Web \| <título exacto de la tarea origen>` |

> **Nota:** `Cliente` es el Área (la visión de `04-funcionalidades/`) y `FRONT` es la Capa del nombre del test (`FRONT`, `BFF`, `BACK` o `BACKOFFICE`); no es la etiqueta de capa del catálogo (`front`, `api`, ...). `[TAE]` es el prefijo de ejemplo de las tareas de automatización (TAE: *Test Automation Engineering*); cada equipo define el suyo y, si el perfil no lo trae, la skill `qa-crear-tarea-automatizacion` propone uno y lo confirma con el QA.

## 5. Etiquetas

| Categoría | Valor |
| :--- | :--- |
| Equipo | `alfa` |
| Visión | No aplica (el catálogo de etiquetas no usa etiqueta de visión) |
| Funcionalidad (nivel 2) habitual | `catalogo`, `carrito` |
| Módulo habitual | Por completar |
| Cómo se elige el nivel 3 | Se busca en el catálogo según la HU ([catalogo-etiquetas.md](../02-qa-funcional/catalogo-etiquetas.md)) |

## 6. Rutas en Xray y en el repositorio de evidencias

| Campo | Valor |
| :--- | :--- |
| Repositorio de tests en Xray | `Alfa/Sprint N/<CLAVE-HU> <título>` (ejemplo) |
| Base de evidencias | Por completar (repositorio documental del equipo, ej. SharePoint o Drive) |
| Carpeta del sprint | `Sprint N` |
| Carpeta de la HU | `<CLAVE-HU> <summary>` |
| Clasificación por área | No aplica |

> **Nota:** en `plantilla-automation`, las capturas automáticas quedan en `evidencias/<ID-HISTORIA>/` y desde ahí se copian al repositorio documental.

## 7. Bugs

| Campo | Valor |
| :--- | :--- |
| Versiones por capa | Por completar (FRONT, BFF y BACK) |
| Sprint o backlog | Preguntar al QA en cada bug |

## 8. Descripción de los tests

| Campo | Valor |
| :--- | :--- |
| Incluye bloque técnico | Por completar |
| Referencias habituales | Figma (opcional): por completar. Documentación de API: por completar |
| Consultas habituales | SQL de referencia (solo SELECT) sobre la base ficticia `tienda_qa`: `vision-cliente/02-catalogo/consultas-sql-qa.md` |

## 9. Particularidades

- Los precios y el orden del catálogo se verifican contra `vision-cliente/02-catalogo/reglas-negocio.md` (6 productos, orden A-Z, Z-A y por precio).
- El contador del carrito se verifica siempre contra los botones de quitar visibles.
- Para casos con `problem_user`, comparar siempre con `standard_user` antes de reportar un bug.
- Los puntos "Pendiente de definir por el PO" de catálogo y carrito se consultan al PO con mención en Jira, previa aprobación del texto.

## 10. Registro de cambios

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Versión inicial del perfil de ejemplo |
