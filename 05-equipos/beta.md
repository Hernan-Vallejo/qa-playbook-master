# Perfil de Equipo: Equipo Beta (BETA)

> **Para qué sirve:** reúne lo propio del Equipo Beta (proyecto de Jira, integrantes, nombres de artefactos, etiquetas, rutas) para que los agentes y skills lo lean en lugar de preguntarlo cada vez.
> **Quién lo usa:** el QA del Equipo Beta y los agentes de Kiro (`qa-maestro` y sus skills).
> **Cuándo se usa:** al empezar el sprint, al analizar una HU (historia de usuario) de checkout o pagos, y cada vez que cambie algún dato del equipo.

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
| Proyecto de las HU | `PROJ` (el equipo se distingue por la etiqueta `beta`) |
| Board | Por completar |
| Patrón del nombre del sprint | `Sprint N` (ej. "Sprint 12") |
| HU a probar (JQL) | `project = PROJ AND issuetype = Story AND labels = beta AND "Requiere pruebas de testing" = Sí AND sprint = <SPRINT_ID>` |
| Subtareas QA | `[QA] - Definición de Casos de Prueba`, `[QA] - Ejecución de Casos de Prueba` |
| Proyecto de los bugs | `PROJ` (tipo de issue `Bug`) |

> **Nota:** el JQL es el lenguaje de búsqueda de Jira. `<SPRINT_ID>` se reemplaza por el identificador del sprint. El campo "Requiere pruebas de testing" es el que usa el playbook (steering `qa-jira-xray`) para saber qué HU necesitan QA; es propio de cada instancia de Jira: confirmá el nombre real con el equipo. Como los cuatro equipos comparten el proyecto `PROJ`, el JQL filtra por la etiqueta del equipo.

## 2. Integrantes y reparto

| Campo | Valor |
| :--- | :--- |
| Modalidad | Varios QA |
| Integrantes | Por completar |
| Reparto | Lo reparte Kiro por HU |
| Regla de reparto | Por completar (ej. reparto parejo entre los QA) |
| Responsable del test plan | Por completar (puede alternar por sprint) |

## 3. Contexto funcional

| Visión | Carpetas de `04-funcionalidades/` |
| :--- | :--- |
| Cliente | `vision-cliente/04-checkout/` |

> **Nota:** el checkout parte del carrito y genera un pedido. Si la HU lo toca, también se leen `vision-cliente/03-carrito/` y `vision-cliente/05-pedidos-sdd/`.

## 4. Nombres de los artefactos

| Artefacto | Patrón |
| :--- | :--- |
| Test | `Cliente.<Capa>.<título>` (ej. `Cliente.FRONT.Checkout sin apellido muestra error`) |
| Test Set | `<CLAVE-HU> <título de la HU>` |
| Test Execution | `<CLAVE-HU> <título de la HU>` |
| Test plan del sprint | `Test Plan Sprint 12 - Equipo Beta` |
| Plantilla del test plan | Homologada: `02-qa-funcional/plantillas/test-plan-sprint.html` |
| Test plan de regresión | `Test Plan Regresión Release 2.4` |
| Estrategia propia (sección 3 del plan) | Por completar |
| Tarea de automatización (proyecto `AUTO`) | `[TAE] Beta - Web \| <título exacto de la tarea origen>` |

> **Nota:** `Cliente` es el Área (la visión de `04-funcionalidades/`) y `FRONT` es la Capa del nombre del test (`FRONT`, `BFF`, `BACK` o `BACKOFFICE`); no es la etiqueta de capa del catálogo (`front`, `api`, ...). `[TAE]` es el prefijo de ejemplo de las tareas de automatización (TAE: *Test Automation Engineering*); cada equipo define el suyo y, si el perfil no lo trae, la skill `qa-crear-tarea-automatizacion` propone uno y lo confirma con el QA.

## 5. Etiquetas

| Categoría | Valor |
| :--- | :--- |
| Equipo | `beta` |
| Visión | No aplica (el catálogo de etiquetas no usa etiqueta de visión) |
| Funcionalidad (nivel 2) habitual | `checkout` |
| Módulo habitual | Por completar |
| Cómo se elige el nivel 3 | Se busca en el catálogo según la HU ([catalogo-etiquetas.md](../02-qa-funcional/catalogo-etiquetas.md)) |

## 6. Rutas en Xray y en el repositorio de evidencias

| Campo | Valor |
| :--- | :--- |
| Repositorio de tests en Xray | `Beta/Sprint N/<CLAVE-HU> <título>` (ejemplo) |
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
| Referencias habituales | Figma (opcional): por completar. Documentación de API de pagos: por completar |
| Consultas habituales | SQL de referencia (solo SELECT) sobre la base ficticia `tienda_qa`: `vision-cliente/04-checkout/consultas-sql-qa.md` |

## 9. Particularidades

- El checkout es un **área crítica** (movimientos de importes): no se da por probado solo con el camino feliz.
- Los mensajes de validación se verifican con el texto exacto de `vision-cliente/04-checkout/reglas-negocio.md` (`Error: First Name is required`, `Error: Last Name is required`, `Error: Postal Code is required`).
- Los importes (subtotal, impuesto y total) se calculan a mano en el caso y se comparan con el resumen.
- Datos de prueba: comprador ficticio "Ana Prueba", código postal "1000". Nunca datos reales ni medios de pago reales.
- Los puntos "Pendiente de definir por el PO" (formato de campos, carrito vacío, impuestos) se consultan al PO con mención en Jira, previa aprobación del texto.

## 10. Registro de cambios

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Versión inicial del perfil de ejemplo |
