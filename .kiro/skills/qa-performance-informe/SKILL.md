---
name: qa-performance-informe
description: Analiza cada corrida de performance en PRE desde GitHub Actions y la registra en el repositorio documental del equipo con su análisis, y al final arma el informe de la prueba - línea base, resultados por corrida, cuellos de botella, cumplimiento de criterios y recomendaciones. Usar cuando el agente qa-performance o el QA pide "EJECUTAR", "analizá el run de performance", "subí la corrida al repositorio documental", "INFORMAR", "armá el informe final". No usar para calibrar (skill de calibración del framework de performance).
---
# Corridas e informe de performance

> **Para qué sirve:** analiza cada corrida de performance hecha en PRE, la guarda con su análisis en el repositorio documental del equipo y, al terminar todas las corridas, arma el informe final con una severidad.
> **Quién lo usa:** el QA de performance, directamente o a través del agente [`qa-performance`](../../agents/qa-performance.md).
> **Cuándo se usa:** antes y después de cada ejecución en PRE (modo corrida), y cuando terminaron las corridas del plan (modo informe).

> **Nota:** se usa [k6](https://k6.io/) como ejemplo genérico de herramienta de performance (pública). k6 y los demás frameworks de performance son opcionales y no vienen incluidos en la plantilla [`plantilla-automation/`](../../../plantilla-automation/README.md). "PRE" = preproducción. "SRE" = *Site Reliability Engineering*, el equipo que opera la infraestructura. "TL" = líder técnico. "PO" = *Product Owner*. "PA" = analista de producto o funcional. "Percentil" (p50, p95, p99) = valor por debajo del cual queda ese porcentaje de las respuestas; por ejemplo, p95 = 800 ms significa que el 95 % de las respuestas tardó 800 ms o menos.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.2 |
| Puntos de control | Corrida a ejecutar, Análisis de la corrida, Publicación en el repositorio documental, Informe final |
| Archivos en `.qa-work/<CLAVE>/performance/` | Escribe `05-corridas/<run>-<tipo>.md` y `06-informe.md` |

## Propósito

Que cada corrida en PRE quede analizada y guardada en el repositorio documental, y que el informe final se arme con todas, sin depender de la memoria de nadie.

> **Atención:** las corridas se ejecutan solo en el ambiente PRE del equipo. Nunca contra producción ni contra sitios públicos de terceros.

## Cuándo usarla

- **Corrida:** antes y después de cada ejecución en PRE desde GitHub Actions.
- **Informe:** cuando terminaron las corridas del plan.

## Cuándo no usarla

- Calibración → skill de calibración del framework de performance (si el equipo la tiene).
- Una corrida falló por la prueba (script roto) → skill de reparación del framework de performance.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la tarea `AUTO` | Sí | Pedirla |
| `02-plan.md` y criterios acordados | Sí | Pedirlos |
| Número del run de GitHub Actions en PRE | Sí, por corrida | El QA lanza el workflow y pasa el número de run |
| Validación de SRE de PRE (pods y memoria de los servicios involucrados y diferencias con producción) | Sí | Pedirla a SRE por medio del QA |
| Contexto del ambiente durante la corrida (cambios, incidentes, recursos) | No | Pedirlo a arquitectura si hace falta para explicar el resultado |

> **Nota:** un *run* es una ejecución de un workflow de GitHub Actions. Se lanza a mano desde la pestaña Actions del repositorio con un workflow que tenga el disparador `workflow_dispatch`, que permite pasar parámetros.

## Contexto que lee

1. Steering [`qa-performance`](../../steering/qa-performance.md) y, si el equipo sumó un framework de performance, el steering de su proyecto.
2. `02-plan.md`, `04-calibracion.md` (la deja la calibración; si el equipo no usa `k6-calibrar`, la arma `qa-performance` con los mismos datos; ver la lista de archivos en el agente [`qa-performance`](../../agents/qa-performance.md)) y las corridas anteriores.
3. Referencia: un informe de una prueba anterior del repositorio de performance del equipo (si existe) y las carpetas `Test Performance …` del repositorio documental.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | Servidor `@github` (estado del run, sus artefactos y el contenido de cada artefacto); lectura del repositorio documental del equipo (SharePoint, Drive u otro), si hay un MCP configurado; `getJiraIssue` (servidor `@atlassian`) |
| Escritura (solo después de la confirmación) | Crear carpeta y subir archivos al repositorio documental (si el MCP lo permite); `addOrEditJiraIssueComment` en la tarea `AUTO` |

## Modo corrida

1. **Preparar** los parámetros del workflow según el plan: suite a ejecutar, `ENV=pre`, tipo de prueba (`TYPE`) y los propios de la prueba.
2. **[PUNTO DE CONTROL] Corrida a ejecutar · esperando tu confirmación.** Mostrar los parámetros, los criterios de entrada (smoke en QA OK, calibración hecha, datos en PRE, ventana coordinada) y pedir al QA que lance el workflow. Criterios de entrada completos (ver [`plan-pruebas-performance.md`](../../../03-qa-automatizacion/plan-pruebas-performance.md)): batería de datos en PRE entregada, configuración de PRE validada por SRE, baseline definido y criterios acordados. Si falta alguno, no se ejecuta.
3. **Leer el run:** `summary.json`, `metrics.json` y el reporte HTML de los artefactos. Nunca `.zip` ni el log completo de la consola.
4. **Analizar** con "Cómo leer un resultado" de `qa-performance`: carga lograda, errores, percentiles por paso y del flujo, estabilidad en el tiempo, cuellos de botella, criterios cumplidos o no.
5. **[PUNTO DE CONTROL] Análisis de la corrida · esperando tu confirmación.** Mostrar el análisis y guardarlo en `05-corridas/<run>-<tipo>.md`. Esperar OK.
6. **[PUNTO DE CONTROL] Publicación en el repositorio documental · esperando tu confirmación.** Mostrar la carpeta destino (`…/Test Performance <Nombre>/<run>-<tipo>-pre/`) y los archivos: reporte HTML, `summary.json`, `metrics.json` y el análisis. Esperar OK y publicar. Si el MCP no permite subir archivos, dejar el listado y pedir al QA que los suba.
7. Opcional, con OK: comentario en la tarea `AUTO` con el resumen y el link.

> **Nota:** `summary.json` es el resumen final que exporta k6 (`--summary-export`), `metrics.json` son las métricas punto a punto (`--out json=`), y el reporte HTML lo genera el workflow si el equipo lo configuró. Si el framework que usa el equipo exporta otros archivos, se leen los equivalentes.

## Modo informe

1. Reunir todas las corridas de `05-corridas/` y la calibración.
2. Armar el informe (ver "Entregable") y asignar la **severidad del resultado** (Baja, Media o Alta) con las definiciones del steering `qa-performance`. La severidad Media necesita la aceptación explícita de PO, PA y TL en el pedido; la Alta significa que QA no recomienda salir a producción.
3. **[PUNTO DE CONTROL] Informe final · esperando tu confirmación.** Mostrarlo, guardarlo en `06-informe.md` y, con OK, publicarlo en la carpeta del repositorio documental y copiarlo junto al test (`Informe-Performance-<Prueba>.md`). Con OK, dejar el resumen y la severidad en la tarea `AUTO` y la tabla comparativa en el pedido.

## Entregable

Análisis de una corrida:

```markdown
# Corrida <run> — <tipo> — PRE
| Dato | Valor |
| :--- | :--- |
| Fecha | <AAAA-MM-DD HH:MM> |
| Parámetros | TYPE=…, tasa=…, duración=… |
| Carga lograda | <throughput>, dropped_iterations=<n> |
| Resultado | Cumple / No cumple / Con observaciones |
| Paso | p50 | p95 | p99 | Errores | Criterio | Cumple |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
## Observaciones
## Contexto del ambiente
## Conclusión de la corrida
```

> **Nota:** `dropped_iterations` es la cantidad de iteraciones que k6 no pudo iniciar por falta de capacidad del generador de carga o del sistema; si es alto, la carga lograda es menor que la pedida. La columna "Cumple" lleva `Sí` o `No`.

Informe final:

```markdown
# Informe de Performance — <Prueba>
## 1. Objetivo
## 2. Descripción del servicio y del flujo
## 3. Resumen de ejecuciones
| Run | Tipo | Fecha | Resultado |
## 4. Línea base
## 5. Resultados por corrida
## 6. Cuellos de botella y hallazgos
## 7. Cumplimiento de criterios
## 8. Recomendaciones
## 9. Severidad del resultado (Baja / Media / Alta, con su fundamento)
## 10. Próximos pasos
```

Firma en publicaciones: `Elaborado por <USUARIO> y Kiro`.

## Reglas

- Solo se informan corridas en **PRE desde GitHub Actions**.
- Las diferencias de PRE con producción (pods, memoria) se declaran en el análisis de cada corrida y en el informe final. Si cambian durante una corrida, se suspende y se repite completa.
- La evidencia queda en el repositorio documental del equipo durante el plazo que defina arquitectura (por ejemplo, 5 años como máximo).
- Cada corrida se publica con su análisis antes de la siguiente.
- No inventar resultados: todo número sale del run.
- Una degradación o un incumplimiento es un hallazgo; se informa con evidencia.
- No publicar sin confirmación.
- Todo informe final lleva severidad. La asigna QA Automation; la aceptación de una severidad Media es de PO, PA y TL.
- No incluir datos reales de clientes ni credenciales en el análisis ni en los artefactos publicados.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| `dropped_iterations` alto | La carga no fue la pedida | La corrida no sirve para concluir; repetir tras calibrar |
| Resultados muy distintos entre corridas iguales | Ambiente inestable o compartido | Documentar el contexto y repetir |

## Criterios de calidad

- Cada corrida tiene análisis y está en el repositorio documental.
- El informe permite a arquitectura decidir sin abrir los runs.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Soak (carga sostenida) en PRE terminado | Análisis, publicación en el repositorio documental con OK |
| 2 | El QA pasa un run de QA | Lo rechaza para el informe |
| 3 | Todas las corridas del plan hechas | Informe final con línea base y recomendaciones |
| 4 | El QA no confirma la publicación | No publica |
