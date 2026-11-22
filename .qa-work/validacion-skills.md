# Validación de agentes y skills

> **Para qué sirve:** es una planilla para anotar cada vez que un agente o una skill de Kiro falla, se saltea algo, le falta algo o le sobra algo, y también lo que funcionó bien. Con esas observaciones se mejoran los agentes y las skills del playbook.
> **Quién lo usa:** cada QA que trabaja con Kiro, en su copia local. Quien mantiene el playbook revisa las observaciones que se envían.
> **Cuándo se usa:** durante el uso diario de los agentes y las skills, y al final del período de validación para enviar las filas nuevas al canal del equipo.

> **Nota:** una *skill* es una tarea repetible que Kiro sabe hacer (por ejemplo, analizar una HU). Un *agente* agrupa varias skills en un flujo completo (por ejemplo, `qa-maestro` para un equipo funcional). HU es *Historia de Usuario*. PR es *Pull Request*. Los datos de ejemplo corresponden a la **Tienda Demo** de la empresa ficticia Acme.

| Dato | Valor |
| :--- | :--- |
| QA | `<Nombre>` (ejemplo: Lucía Prueba) |
| Equipo | `<Equipo>` (ejemplo: Equipo Alfa) |
| Período | `<AAAA-MM-DD>` a `<AAAA-MM-DD>` |
| Enviado al canal del equipo el | `<AAAA-MM-DD>` |

Los agentes y skills están en estado **Experimental**: se van ajustando con el uso de todos los días. Aquí se anota cada vez que un agente o una skill falla, se saltea algo, le falta algo o le sobra algo. Con las observaciones documentadas, se envía este archivo (o las filas nuevas) por el canal del equipo (por ejemplo, chat o correo) para corregirlas en el playbook.

También sirve anotar lo que **funcionó bien**: para homologar una skill hace falta que funcione con al menos dos equipos o dos QA distintos.

> **Atención:** esta planilla es personal. Se llena en la copia local y **no se commitea**. Ver "Cómo usar estas planillas" en `indice-general.md`.

## Qué anotar

| Tipo | Cuándo |
| :--- | :--- |
| Falla | Hizo algo incorrecto: dato inventado, etiqueta o campo equivocado, escribió sin confirmación, publicó en el lugar equivocado |
| Se saltea | No se detuvo en un punto de control o salteó un paso de la skill |
| Falta | Le falta un paso, una regla, un dato del perfil, un caso o un ejemplo |
| Sobra | Hace algo innecesario, pregunta de más o el resultado es demasiado largo |
| Mejora | Funciona, pero se podría hacer mejor o más simple |
| Funcionó | Se usó en un caso real y el resultado fue el esperado |

**Impacto:** Alto (no se puede usar o publica algo mal) · Medio (hay que corregir a mano) · Bajo (detalle).

## Registro

Una fila por observación. La primera fila es un ejemplo: reemplazala por la tuya.

| # | Fecha | Agente | Modo o skill | Clave (HU, tarea, PR) | Tipo | Impacto | Mensaje enviado | Qué esperaba | Qué hizo | Evidencia | Sugerencia | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 2026-11-02 | `qa-maestro` | `qa-diseno-casos` | PROJ-123 | Se saltea | Medio | "Generá los tests de PROJ-123" | Que se detuviera en la matriz de cobertura para mi confirmación | Pasó directo a escribir los escenarios | `.qa-work/PROJ-123/03-matriz-cobertura.md` | Reforzar el punto de control de la matriz | Nuevo |
| 2 | | | | | | | | | | | | Nuevo |

- **Mensaje enviado:** el mensaje exacto que se le escribió a Kiro.
- **Evidencia:** archivo de `.qa-work/`, captura, link al comentario de Jira o al PR. Sin credenciales ni datos sensibles (steering `qa-seguridad-datos`).
- **Estado:** Nuevo · Enviado · Corregido · Descartado.

## Detalle (opcional, para los casos de impacto Alto)

Copiar este bloque por cada observación que necesite más explicación:

```text
### #<n> · <agente o skill> · <tipo>
Contexto: <HU o tarea, equipo, profundidad, si fue con agente o skill suelta>
Pedido: <mensaje exacto>
Resultado esperado: <qué debería haber hecho>
Resultado obtenido: <qué hizo; en qué paso o punto de control>
Evidencia: <archivo, captura o link>
Sugerencia: <qué cambiar en la skill, el agente, el perfil o la documentación>
```

## Skills a validar

Las 27 skills del playbook (carpetas de `.kiro/skills/`). En la columna "Validada" anotá `Sí` cuando la hayas usado en un caso real con el resultado esperado, y en "Equipos o QA" cuántos equipos o QA distintos la probaron (para homologar hacen falta al menos dos). Los valores de ejemplo se reemplazan por los tuyos.

| # | Skill | Para qué se usa | Se usa con | Validada | Equipos o QA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `qa-actualizar-contexto` | Mantener la documentación funcional de `04-funcionalidades/` | `qa-maestro`, `qa-sdd` (la ofrece al cerrar), skill suelta | No | 0 |
| 2 | `qa-analisis-hu` | Analizar una HU (readiness, riesgos, impacto) | `qa-maestro`, `qa-sdd`, `qa-automation` (si no hay casos) | No | 0 |
| 3 | `qa-auditar-ejecucion` | Verificar que cada PASS esté respaldado por evidencia | `qa-sdd`, `qa-maestro` (opcional), skill suelta (sirve para cualquier equipo) | No | 0 |
| 4 | `qa-carga-xray` | Cargar casos aprobados en Xray | `qa-maestro`, `qa-sdd` | No | 0 |
| 5 | `qa-cierre-hu` | Evaluar el cierre de QA de una HU | `qa-maestro`, `qa-sdd` | No | 0 |
| 6 | `qa-crear-pr` | Crear el Pull Request de una rama de QA | `qa-pr` | No | 0 |
| 7 | `qa-crear-tarea-automatizacion` | Crear la tarea `AUTO` de automatización | skill suelta (`qa-performance` la propone) | No | 0 |
| 8 | `qa-diseno-casos` | Diseñar la matriz de cobertura y los escenarios Gherkin | `qa-maestro`, `qa-sdd`, `qa-automation` (si no hay casos) | No | 0 |
| 9 | `qa-escribir-skills` | Crear o corregir una skill | skill suelta | No | 0 |
| 10 | `qa-informe-regresion` | Informe de regresión de un release | `qa-regresion` | No | 0 |
| 11 | `qa-informe-sprint` | Informe de cierre de QA del sprint | `qa-sprint` | No | 0 |
| 12 | `qa-inicio-sprint` | Arrancar el sprint y crear el Test Plan | `qa-sprint` | No | 0 |
| 13 | `qa-performance-analisis` | Perfil operacional y modelo de carga | `qa-performance` | No | 0 |
| 14 | `qa-performance-informe` | Análisis de corridas e informe final de performance | `qa-performance` | No | 0 |
| 15 | `qa-performance-plan` | Plan de una prueba de performance | `qa-performance` | No | 0 |
| 16 | `qa-plan-automatizacion` | Plan de automatización de una tarea | `qa-automation` | No | 0 |
| 17 | `qa-preparar-regresion` | Preparar la regresión de un release | `qa-regresion` | No | 0 |
| 18 | `qa-reejecucion` | Crear una re-ejecución (`#2`, `#3`) | `qa-maestro`, `qa-sdd` | No | 0 |
| 19 | `qa-registro-automatizacion` | Registrar en Xray lo automatizado | `qa-automation` | No | 0 |
| 20 | `qa-reporte-bug` | Redactar y crear un bug en Jira | `qa-maestro`, `qa-sdd`, `qa-automation` (si un test detecta un bug) | No | 0 |
| 21 | `qa-revisar-pr` | Code review de un Pull Request de QA | `qa-pr` | No | 0 |
| 22 | `qa-revision-casos` | Revisar la calidad de casos existentes | `qa-maestro` | No | 0 |
| 23 | `qa-sdd-cobertura-dev` | Cobertura que se propone a desarrollo (equipos SDD) | `qa-sdd` | No | 0 |
| 24 | `qa-sdd-fwt` | Revisión estática del código antes del deploy (equipos SDD) | `qa-sdd` | No | 0 |
| 25 | `qa-sdd-plan-datos` | Plan de datos de prueba (equipos SDD) | `qa-sdd` | No | 0 |
| 26 | `qa-sdd-revision-spec` | Revisión de la spec de la HU (equipos SDD) | `qa-sdd` | No | 0 |
| 27 | `qa-seguimiento-sprint` | Avance del sprint y actualización del Test Plan | `qa-sprint` | No | 0 |

## Resumen para enviar

Contá cuántas observaciones de cada tipo tuvo cada agente o skill. La primera fila es un ejemplo.

| Agente o skill | Falla | Se saltea | Falta | Sobra | Mejora | Funcionó |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `qa-diseno-casos` | 0 | 1 | 0 | 0 | 0 | 2 |
| | | | | | | |
