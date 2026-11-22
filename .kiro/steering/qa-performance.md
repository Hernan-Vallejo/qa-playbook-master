---
inclusion: auto
name: qa-performance
description: Conceptos de pruebas de performance (base ISTQB Performance Testing) y forma de trabajo del equipo - tipos de prueba, perfil operacional, modelo de carga, métricas, criterios de aceptación, riesgos, ambientes (QA para armar, PRE para medir, siempre desde el pipeline de CI) y cómo leer resultados. Activar al analizar, planificar, ejecutar o informar pruebas de carga, estrés o rendimiento, o cuando se habla de throughput, percentiles, thresholds, VUs o k6.
---
# Pruebas de performance

> **Para qué sirve:** es la base conceptual y la forma de trabajo para las pruebas no funcionales de rendimiento (carga, estrés, resistencia, picos): qué tipos hay, cómo se dimensiona la carga, qué se mide, cómo se acuerdan los criterios y cómo se lee un resultado.
> **Quién lo usa:** el agente `qa-performance` y las skills `qa-performance-analisis`, `qa-performance-plan` y `qa-performance-informe` (Kiro lo carga solo, `inclusion: auto`), y los QA que planifican o informan estas pruebas.
> **Cuándo se usa:** al analizar, planificar, ejecutar o informar una prueba de carga, estrés o rendimiento, o cuando se habla de throughput, percentiles, thresholds, VUs o k6.

> **Nota:** las pruebas de performance miden *cómo* responde el sistema (tiempos, capacidad, estabilidad), no *si* una función es correcta. Siglas usadas: **ISTQB** (programa de certificación de testing; el módulo CT-PT cubre performance), **TL** (Tech Lead, líder técnico del equipo), **PO** (Product Owner), **PA** (analista de producto, o analista funcional), **VU** (*virtual user*, usuario virtual que genera carga), **PRE** (preproducción, ambiente parecido a producción) y **CI** (integración continua: el pipeline automático que ejecuta tareas, por ejemplo GitHub Actions).
>
> **Ejemplo que se usa en todo el archivo:** la Tienda Demo quiere saber si el checkout aguanta la campaña de fin de año.

Base conceptual para las pruebas no funcionales de rendimiento. Sigue el programa ISTQB de Performance Testing (CT-PT) y la forma de trabajo del equipo. Lo usa el agente `qa-performance`. Lo propio de la herramienta de carga (por ejemplo k6, un generador de carga que el equipo puede sumar y que no viene incluido en la plantilla de automatización) está en el repositorio de performance del equipo. El equipo de **QA Automation** se hace cargo de estas pruebas y de su revisión.

## Forma de trabajo del equipo

1. **El pedido** lo hace el equipo dueño del servicio o flujo (por ejemplo, el Equipo Beta para el checkout), formalizado por su **TL**, como Tarea o Historia con la planilla de pedido del proceso formal (`03-qa-automatizacion/plan-pruebas-performance.md`) y **al menos 2 sprints antes del release**. Nace de la decisión de performance que deja el QA del equipo en el análisis de la HU.
2. Al empezar a armar la prueba se **crea la tarea en el proyecto `AUTO`** (`qa-crear-tarea-automatizacion`) bajo la épica de performance de ese proyecto, con las etiquetas `PERFORMANCE` y la del equipo en minúscula, vinculada al pedido (vínculo `Test`), y se trabaja en la rama de esa tarea (por ejemplo `feature/AUTO-45-performance-checkout`).
3. **Análisis** del uso en producción y **plan** de la prueba.
4. **Se arma en QA** con un **smoke en QA**: cada paso funciona. En QA no se miden tiempos.
5. **Los datos.** Los de QA los arma QA Automation para el piloto. Los de PRE los entrega el **PO** (con el equipo de infraestructura) en **una semana como máximo**, según la especificación del plan, y quedan en PRE para las re-ejecuciones. **Infraestructura (SRE) valida** pods y memoria de PRE antes de las corridas.
   > **Nota:** SRE es *Site Reliability Engineering*, el equipo que cuida la disponibilidad de los ambientes. Un *pod* es la unidad mínima en la que corre un servicio en Kubernetes.
6. **Se define el baseline y se calibra en PRE desde el pipeline de CI**: smoke o corrida corta para saber qué valores apuntar. Sin baseline no se ejecutan las corridas que se informan. (El *baseline* o línea base es el resultado de referencia contra el que se compara todo lo demás.)
7. **Los criterios** (tiempos, throughput, errores) se **acuerdan entre el QA, el TL y arquitectura** sobre esos valores. Se pueden usar parámetros básicos para la primera corrida.
8. **Se ejecuta siempre en PRE y desde el pipeline de CI.** Nunca desde una PC.
9. **Cada corrida en PRE se publica en el repositorio de evidencias del equipo con su análisis.**
10. Con todas las corridas se arma el **informe final**, con la **severidad del resultado** (ver más abajo).

El proceso formal completo (roles, disparadores, controles) está en `03-qa-automatizacion/plan-pruebas-performance.md`.

## Tipos de prueba

| Tipo (ISTQB) | Pregunta que responde | En k6 (`TYPE`) |
| :--- | :--- | :--- |
| Humo (smoke) | ¿El flujo funciona con 1 usuario? | `Smoke` |
| Carga (load) | ¿Con la carga esperada se cumplen los objetivos? | `Soak_Normal` (promedio), `Soak_Alto` (pico) |
| Resistencia (soak / endurance) | ¿Se degrada con el tiempo (memoria, conexiones, colas)? | `Soak_Extendido` |
| Estrés (stress) | ¿Cómo se comporta por encima del pico y cómo se recupera? | `Stress` |
| Capacidad / punto de quiebre | ¿Hasta dónde llega antes de incumplir los objetivos? | `Breakpoint` |
| Picos (spike) | ¿Soporta un salto brusco de carga? | `Stress` con patrón agresivo o `Custom` |
| Concurrencia | ¿Hay problemas cuando N usuarios hacen lo mismo a la vez? | `Concurrency` |
| Volumen | ¿Se comporta igual con grandes volúmenes de datos? | `Volume` |
| Escalabilidad | ¿Mejora al agregar recursos? | Mismas corridas antes y después del cambio de infraestructura |

> **Nota:** la columna `TYPE` es un parámetro de ejemplo de un repositorio de k6 del equipo. Si usás otra herramienta o nombres distintos, se ajusta esa columna: lo importante es la pregunta que responde cada tipo.

Orden habitual: smoke en QA → calibración en PRE → carga (promedio y pico) → estrés → punto de quiebre → resistencia si aplica.

## Perfil operacional y modelo de carga

El perfil operacional describe cómo se usa el sistema en producción. Sin él, la carga es arbitraria.

| Dato | Pregunta | Fuente |
| :--- | :--- | :--- |
| Volumen | ¿Cuántas operaciones por día o mes? | Producción, TL, negocio |
| Ventana | ¿En cuántas horas se concentra? | Producción |
| Pico | ¿Cuál es la hora o el día pico y cuánto más que el promedio? | Producción |
| Mezcla | ¿Qué proporción de cada operación o tamaño? | Producción |
| Crecimiento | ¿Cuánto se espera crecer? | Negocio, arquitectura |
| Datos | ¿Cuántos usuarios, cuentas o registros distintos? | Producción |

> **Ejemplo (ficticio):** el checkout de la Tienda Demo registra 36.000 compras por día, concentradas en 10 horas. Throughput objetivo = 36.000 / (10 × 3.600 s) = 1 compra por segundo en promedio.

Cálculos básicos (se muestran siempre con la fórmula):

- **Throughput objetivo** = operaciones en la ventana / segundos de la ventana. (Throughput es la cantidad de operaciones que el sistema procesa por segundo.)
- **Ley de Little:** concurrencia = throughput × tiempo de iteración. Sirve para dimensionar VUs. Ejemplo: 1 compra por segundo con iteraciones de 8 s requiere 1 × 8 = 8 VUs en simultáneo.
- **Modelo abierto** (tasa de llegada fija, `arrival-rate`): representa usuarios que llegan independientemente de cómo responde el sistema. Es el modelo de los Soak, Stress y Breakpoint.
- **Modelo cerrado** (VUs fijos): cada usuario espera la respuesta antes de seguir. Útil para smoke, calibración y concurrencia.

Cada dato se marca como **[Dato]** (de producción), **[Cálculo]** (derivado, con fórmula) o **[Hipótesis]** (supuesto sin respaldo). Una hipótesis nunca se presenta como dato.

## Métricas

| Métrica | Qué mide | Cómo se lee |
| :--- | :--- | :--- |
| Tiempo de respuesta por paso | Latencia de cada request | **Percentiles** (p50, p90, p95, p99), no promedio: el promedio oculta la cola. Un p95 de 800 ms significa que el 95 % de las respuestas tardó 800 ms o menos |
| Duración de iteración | El flujo completo | p95 contra el objetivo del flujo |
| Throughput | Operaciones por segundo logradas | Debe alcanzar la tasa pedida |
| Tasa de errores | Requests o pasos fallidos | Global y por paso |
| `dropped_iterations` | Iteraciones que el generador no pudo lanzar | Si es > 0, la carga no fue la pedida |
| Recursos del sistema | CPU, memoria, conexiones, colas, base | Se piden a arquitectura o al monitoreo para explicar los resultados |

## Criterios de aceptación

- Se expresan como thresholds (umbrales) medibles: `p(95) < X ms` por paso, `iteration_duration p(95) < Y s`, `http_req_failed rate < Z`, throughput ≥ W.
- Los **acuerdan el QA, el TL y arquitectura**. El agente no los inventa.
- La primera corrida usa parámetros básicos; los definitivos salen de la **calibración en PRE** (referencia: ~2x el p95 observado) y se ajustan con las corridas siguientes.
- Criterios de entrada de una corrida: smoke en QA OK, datos en PRE, ambiente estable, monitoreo disponible.
- Criterios de salida: corrida completa sin errores del generador, resultados publicados y analizados.

## Ambientes

| Ambiente | Uso | Por qué |
| :--- | :--- | :--- |
| QA | Armar la prueba y el smoke | No es representativo: otra infraestructura, otros datos, otro tráfico |
| PRE | Calibrar y ejecutar | Es el más parecido a producción |
| PROD (producción) | No se prueba | Las pruebas de carga afectan a usuarios reales |

Un resultado de QA nunca se usa para concluir sobre performance.

## Riesgos habituales

| Riesgo | Mitigación |
| :--- | :--- |
| Datos de prueba insuficientes o repetidos | Datasets por ambiente con suficientes registros distintos |
| Efectos reales (pagos, mensajes, notificaciones) | Confirmar con el TL qué se puede ejecutar en PRE |
| Generador como cuello de botella | Revisar `dropped_iterations` y recursos del nodo |
| Caché o datos calientes que no representan producción | Variar los datos; documentar la mezcla |
| Otras pruebas o despliegues en PRE en simultáneo | Coordinar la ventana con arquitectura |
| Conclusiones con una sola corrida | Repetir la corrida antes de concluir |

## Cómo leer un resultado

1. ¿La carga fue la pedida? (`dropped_iterations`, throughput logrado).
2. ¿Hubo errores? ¿En qué paso, desde cuándo, con qué status?
3. ¿Los percentiles se mantienen estables o crecen con la carga o con el tiempo?
4. ¿Dónde está el cuello de botella? Paso más lento, recursos del sistema.
5. ¿Se cumplen los criterios acordados?
6. ¿Qué se recomienda? Ajuste, repetir, escalar o aceptar.

Una degradación o un incumplimiento es **un hallazgo de la prueba**, no un error a corregir en el script.

## Severidad del resultado

Cada informe final lleva una severidad. La asigna QA Automation y define la recomendación de salida a producción (ver `03-qa-automatizacion/plan-pruebas-performance.md`).

| Severidad | Significado | Recomendación | Quién decide |
| :--- | :--- | :--- | :--- |
| Baja | Sin problemas: se cumplen los criterios acordados o los desvíos no tienen impacto | GO | TL |
| Media | Hay un riesgo identificado y entendido | GO WITH RISKS, con la aceptación explícita del PO, el PA y el TL en el pedido | PO, PA y TL |
| Alta | El riesgo es inaceptable | QA no recomienda salir a producción (NO GO) | TL, con la recomendación de QA registrada |
