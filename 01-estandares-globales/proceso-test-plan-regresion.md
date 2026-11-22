---
inclusion: auto
name: proceso-test-plan-regresion
description: Proceso formal de QA para armar el Test Plan de Regresión y el flujo de QA manual (Máster Test Plan). Activar al diseñar regresión, armar un Test Plan, definir qué casos entran en regresión, versionar o deprecar tests, o determinar criterios de inclusión y exclusión, estrategia de ejecución, severidades de defectos y trazabilidad en Jira y Xray.
---

# Proceso: Definición y Armado del Test Plan de Regresión + Proceso de QA Manual

> **Para qué sirve:** describe cómo se arma un Test Plan de Regresión (qué casos entran, cómo se ejecutan y cómo se documentan) y el flujo general de QA manual que lo rodea (el "Máster Test Plan").
> **Quién lo usa:** el QA funcional de cada equipo (Alfa, Beta, Gamma y Delta) y los agentes `qa-regresion`, `qa-maestro` y `qa-sprint`.
> **Cuándo se usa:** al preparar una salida productiva o un release, al versionar o deprecar tests, y como referencia de severidades y estrategia de pruebas durante el sprint.

**Glosario rápido:**

- **Regresión:** volver a ejecutar pruebas ya diseñadas para comprobar que un cambio no rompió lo que funcionaba.
- **Test Plan:** documento (un issue de Xray en Jira) que reúne el objetivo, el alcance, la estrategia, los riesgos y los resultados de un ciclo de pruebas.
- **Test Set:** agrupación de tests en Xray. **Test Execution:** corrida concreta de un conjunto de tests, con su resultado.
- **HU:** historia de usuario. **PO:** Product Owner. **BA:** analista funcional. **TL:** Tech Lead (líder técnico).
- **Campo Regresión:** campo del test en Jira con valores `Sí` / `No`. **Campo Automatizado:** campo del test con valores `SI` / `NO`. Ambos definen qué entra a la regresión y cómo se ejecuta (ver `02-qa-funcional/catalogo-etiquetas.md`, sección 5).

> **Nota:** este proceso es la fuente de verdad del equipo de QA; prevalece sobre criterios genéricos que Kiro pueda proponer por su cuenta.

## 1. Objetivo de la regresión

Garantizar que los cambios (features, correcciones, releases, hotfixes) no impacten negativamente las funcionalidades existentes ni introduzcan nuevos defectos. Se ejecuta re-ejecutando casos previamente definidos con el campo Regresión en `Sí`. Ámbito por defecto: **ambiente QA** (cualquier excepción, por ejemplo PRE, se indica expresamente). Nunca se prueba en PROD (producción).

> **Ejemplo:** en Tienda Demo, un cambio en el checkout puede afectar el contador del carrito. La regresión vuelve a ejecutar los casos de carrito y de login marcados para regresión, aunque la HU solo toque el checkout.

## 2. Proceso para definir y armar el Test Plan de Regresión

### 2.1 Consideraciones previas (limpieza del repositorio)

- Verificar que cada caso tenga bien marcado el campo **Regresión** (`Sí` o `No`). No se usa una etiqueta `regresion`: la regresión va solo en el campo.
- Si un caso ya no aplica a la regresión, cambiar el campo Regresión a **`No`** y retirarlo del alcance.
- La evaluación se basa en el conocimiento funcional y técnico del QA Senior.

### 2.2 Mantenimiento continuo del repositorio (durante los sprints)

- Si una historia impacta una funcionalidad existente, revisar los casos relacionados.
- Si cambian resultados esperados o pasos, actualizar el caso y su campo Regresión.
- Si el caso deja de ser válido, deprecarlo: pasarlo a **No aplicable** con el comentario `deprecado por <CLAVE>` (así lo hace `qa-revision-casos`, que depreca en lugar de borrar).
- Resultado: el repositorio se mantiene alineado con el producto real, sin deuda técnica en pruebas.

### 2.3 Selección de casos para la regresión

Aplicar filtros en Jira y Xray sobre los tests con **Regresión = Sí** de las funcionalidades del alcance (etiquetas del catálogo), separados por el campo **Automatizado**:

- Casos **automatizados** aplicables a regresión: `Automatizado = SI`.
- Casos **manuales** aplicables a regresión: `Automatizado = NO`.
- Casos con Regresión = Sí y sin valor en Automatizado: se listan aparte y el QA decide.

Generar dos conjuntos:

- **Test Set Manual** (manuales aplicables, no automatizados): se crea un **Test Execution Manual**.
- **Test Set Automatizado** (automatizados aplicables): se crea un **Test Execution Automatizado** asociado al pipeline (la corrida automática de CI/CD, por ejemplo GitHub Actions).

Cada responsable ejecuta su tipo de pruebas. La skill `qa-preparar-regresion` arma estos conjuntos y los JQL exactos.

### 2.4 Estructura del Test Plan de Regresión (documentar siempre)

1. **Objetivo** del Test Plan (qué se busca validar, por ejemplo la no regresión de funcionalidades críticas).
2. **Alcance (Scope):** funcionalidades, módulos y flujos cubiertos.
3. **Criterios de Inclusión y Exclusión:** qué casos entran o salen y por qué.
4. **Estrategia de Ejecución:** manual, automatizada o mixta.
5. **Entorno de Pruebas:** ambiente QA.
6. **Cronograma y fechas de ejecución:** fechas clave y ventanas.
7. **Asignación de Responsables:** quién ejecuta cada set.
8. **Riesgos e Impactos Identificados:** funcionalidades críticas, dependencias, ventanas cortas.
9. **Criterios de Éxito y Cierre:** qué define el éxito (por ejemplo 0 bugs bloqueantes y una cobertura mínima).

Ejemplos de nombre: `Test Plan Regresión Release 2.4`, `Test Plan Regresión Release 2.4 - Checkout y Pagos`.

> **Nota:** la plantilla HTML lista para completar está en [test-plan-regresion.html](../02-qa-funcional/plantillas/test-plan-regresion.html) y la explicación de cada sección en [estructura-test-plan.md](../02-qa-funcional/estructura-test-plan.md).

> **Nota:** la plantilla HTML tiene 11 secciones y no coincide número a número con esta lista de 9 puntos. Equivalencias: Objetivo → sección 1; Alcance → sección 2; Criterios de inclusión y exclusión → secciones 2.3 (flujos incluidos y excluidos) y 3 (regla de selección); Estrategia de ejecución → sección 3; Entorno de pruebas → sección 3.2; Cronograma y fechas → panel del encabezado; Asignación de responsables → sección 7 (QA participantes) y la tabla de ejecución de la sección 3; Riesgos e impactos → sección 6; Criterios de éxito y cierre → sección 4.2 y sección 11 (veredicto).

### 2.5 Seguimiento y trazabilidad en Jira y Xray

El Test Plan de Regresión debe vincularse:

- Al **Test Plan del Sprint** correspondiente (`Relates`).
- A la **iniciativa** (`implements`) y a las **épicas** del release (`is implemented by`), si se indicaron.
- A la **historia de regresión** (`Relates`), si existe como historia específica.
- A sus Test Sets y Test Executions (`is tested by`, tipo de vínculo `Test`).

Los tipos de vínculo dependen de la configuración de Jira; el detalle está en el steering `qa-jira-xray` y en la skill `qa-preparar-regresion`.

Beneficio: trazabilidad completa desde la épica hasta la ejecución, para auditoría, métricas y seguimiento.

## 3. Roles

**QA Manual Funcional:**

- Identificar funcionalidades impactadas por cambios, correcciones, releases y hotfixes, y definir los casos manuales que entran en regresión.
- Diseñar, actualizar y ejecutar los casos manuales, registrar evidencias y reportar desvíos y defectos.
- Mantener la trazabilidad requerimiento → caso → ejecución, comunicando avance, resultados y riesgos.

## 4. Flujo de QA Manual (Máster Test Plan): contexto del proceso general

1. **Revisión de Criterios:** validar la HU, los criterios de aceptación, el diseño en Figma (si el equipo lo usa), las historias de back y el Swagger. Completar el campo **QA Análisis** (`REVISADO_OK` o `REVISADO_NOOK`; mientras no se revisó, `NO_REVISADO`). Si el diseño está incompleto, mencionar al PO y (no excluyente) frenar la creación de casos.
2. **Definición de TC (test cases, casos de prueba):** escenarios en **Gherkin** (Given/When/Then, el formato "Dado/Cuando/Entonces" para escribir pruebas). Carpeta en Xray: `Nombre de equipo / Número de Sprint / Código y título de la HU`. Aplicar etiquetas (ver el [catálogo de etiquetas](../02-qa-funcional/catalogo-etiquetas.md)) y completar el campo **Regresión** (`Sí` cuando aplique). Unificar en un **Test Set**. Pasar a "No aplicable" los deprecados.
3. **Creación del Test Set:** agrupar casos del módulo y vincular a la HU con "is tested by".
4. **Ejecución:** Test Execution vinculado con "is tested by". Documentar resultados y evidencias. Ante un fallo: nueva ejecución versionada (#2, #3...), reportar el bug vinculado a la HU y al TC, y re-ejecutar tras la corrección.
5. **Test Plan del Sprint:** `Test Plan Sprint 12 - Equipo Alfa` (patrón del perfil del equipo). Consolidar ejecuciones, documentar qué se probó y qué no, riesgos, estado, bugs pendientes y métricas (Passed/Failed/Blocked, defectos por severidad, % de cobertura).
6. **Test Plan de Regresión:** Test Executions con los TC con Regresión = Sí (una automatizada y una manual). Ejecutar y documentar. Ante fallas, crear la re-ejecución (`#2`, `#3`) y documentar riesgos. Si no se aprueba la salida, comentar en la HU linkeando el Test Plan y solicitar la HU de regresión.

## 5. Severidad y criticidad de defectos

**Severidad (la define QA):**

- **Bloqueante (Highest):** pocos pasos para reproducir, pérdida importante de funcionalidad.
- **Alta (High):** afecta seriamente la funcionalidad y complica el uso.
- **Media (Medium):** impacto medio (por ejemplo mensajes incorrectos).
- **Baja (Low):** muy bajo impacto (tipográficos, traducción, caracteres extraños).
- **Muy baja (Lowest):** impacto mínimo (por ejemplo algunos enlaces no funcionan).

**Criticidad (la define el PO):** Blocker (bloquea la HU), Alta, Media, Baja.

Campo "tipo defecto análisis": si el defecto está fuera del scope de la HU, se marca "Sí" y se completa la versión afectada donde se detectó.

> **Ejemplo:** en Tienda Demo, "el usuario `standard_user` no puede completar la compra" es Bloqueante (Highest). "El botón Continuar del checkout tiene un error de tipeo" es Baja (Low).

## 6. Validación de casos de prueba (checklist de calidad del TC)

- Escritos en **Gherkin**, con nomenclatura clara, concisa y similar entre casos.
- **Título descriptivo:** funcionalidad + visión a probar.
- Acciones **impersonales** (sin "yo hago" ni "el tester hace").
- Set de **datos válidos** y ficticios.

## 7. Estrategia general de pruebas

- Participación en refinamiento y planning (prevención temprana de defectos).
- Al menos **dos ciclos**: primer ciclo en QA, correcciones y re-test. Luego PRE (preproducción; PO y BA validan, QA opcional). En producción, el QA no ejecuta casos ni pruebas (regla "nunca se prueba en PROD"); si el equipo hace una revisión visual de las pantallas modificadas tras la salida, la coordina fuera de este proceso.
- Niveles: foco en **sistema** e **integración** (las pruebas unitarias las hace desarrollo).
- Tipos: funcionales, de sistema, look and feel y usabilidad, **regresión**. Mobile agrega instalación, visualización en distintas pantallas, versiones de sistema operativo e interrupciones.
- Ejecución: manual más automatización que complementa y acelera la regresión. La plantilla incluida usa Playwright (ver [guía de la plantilla](../03-qa-automatizacion/guia-plantilla-automation.md)). Karate (API), k6 (performance) y herramientas mobile son frameworks que el equipo puede sumar, no incluidos en la plantilla.

## 8. Herramientas y entornos

- Sprints y defectos: **Jira** (un proyecto por equipo, o uno compartido como `PROJ`).
- Documentación: repositorio documental del equipo (por ejemplo SharePoint o Drive), con una carpeta por equipo.
- Test cases y ejecuciones: **Xray**.
- Automatización: Playwright, con CI en GitHub Actions.
- Ambientes: DEV, QA, PRE y PROD. Nunca se prueba en PROD. Si el ambiente está inestable, avisar por el canal de mensajería del equipo y por mail al área de infraestructura.
- Pipeline y despliegue: desarrollo informa al canal de testing que hay una versión nueva; QA avisa qué pipelines aprueba por el mismo canal.

## 9. Riesgos

Cualquier integrante puede elevar un riesgo. Flujo: avisar al PO y al equipo, mapearlo en la matriz de riesgos del Test Plan y coordinar una reunión de análisis y seguimiento. El registro de riesgos se actualiza en la sección "Riesgos" del Test Plan.

## 10. Documentación relacionada

- [DoR y DoD](./definicion-dor-dod.md)
- [Guía de trabajo del QA funcional](../02-qa-funcional/proceso-qa-funcional.md)
- [Estructura de los Test Plans](../02-qa-funcional/estructura-test-plan.md)
- [Catálogo de etiquetas](../02-qa-funcional/catalogo-etiquetas.md)
