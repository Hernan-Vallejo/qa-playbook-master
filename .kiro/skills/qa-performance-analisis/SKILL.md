---
name: qa-performance-analisis
description: Analiza el pedido de una prueba de performance y el uso en producción - servicios, flujo, volumen, ventana, pico, mezcla y crecimiento - y arma el perfil operacional y el modelo de carga con cada dato marcado como Dato, Cálculo o Hipótesis. Usar cuando el agente qa-performance o el QA pide "ANALIZAR", "analizá el pedido de performance", "con qué carga probamos", "dimensioná la prueba". No usar para escribir el plan (qa-performance-plan) ni el script (skill de implementación del framework de performance).
---
# Análisis de una prueba de performance

> **Para qué sirve:** convierte el pedido de una prueba de performance en un perfil de uso y un modelo de carga (cuántas solicitudes por segundo, durante cuánto tiempo, con qué mezcla), donde cada número dice de dónde sale.
> **Quién lo usa:** el QA de performance, directamente o a través del agente [`qa-performance`](../../agents/qa-performance.md).
> **Cuándo se usa:** cuando llega un pedido de prueba de performance de un equipo, o cuando hay que redimensionar una prueba existente con datos nuevos de producción.

> **Nota:** una *prueba de performance* mide cómo responde el sistema bajo carga (tiempos de respuesta, errores, capacidad). Los pasos de este documento usan [k6](https://k6.io/) como ejemplo genérico de herramienta pública; k6 y cualquier otro framework de performance son opcionales y no vienen incluidos en la plantilla [`plantilla-automation/`](../../../plantilla-automation/README.md). "TL" = líder técnico del equipo. "PO" = *Product Owner*. "PRE" = ambiente de preproducción. "HU" = Historia de Usuario.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.2 |
| Puntos de control | Pedido, Modelo de carga |
| Archivos en `.qa-work/<CLAVE>/performance/` | Escribe `indice.md` y `01-analisis.md` |

## Propósito

Que la carga de la prueba salga del uso real (o de supuestos explícitos), no de un número arbitrario.

> **Atención:** las pruebas de carga nunca se ejecutan contra producción ni contra sitios públicos de terceros (por ejemplo, el sitio demo SauceDemo es solo para ejercicios funcionales de un usuario). Los ejemplos de este documento hablan de la Tienda Demo en un ambiente propio, como `https://qa.example.com`.

## Cuándo usarla

- Llega un pedido de prueba de performance de un equipo.
- Hay que redimensionar una prueba existente con datos nuevos de producción.

## Cuándo no usarla

- El modelo de carga ya está aprobado → [`qa-performance-plan`](../qa-performance-plan/SKILL.md).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Pedido (Tarea o Historia creada por su TL) | Sí | Pedirla. Debe seguir la planilla de pedido de la guía de performance (ver [`plan-pruebas-performance.md`](../../../03-qa-automatizacion/plan-pruebas-performance.md)): Objetivo, Flujo funcional, Puntos críticos a estresar, Documentación de la API (Swagger/OpenAPI de BACK y BFF), Volumen de referencia y Qué se espera obtener |
| Tarea en `AUTO` | Sí | Proponer crearla con [`qa-crear-tarea-automatizacion`](../qa-crear-tarea-automatizacion/SKILL.md) (bajo la épica de performance, vinculada al pedido) |
| Datos de producción (volumen, ventana, pico, mezcla) | Sí para el modelo | Pedirlos al TL o a arquitectura. Si no hay, trabajar con hipótesis explícitas |
| Contratos de los servicios | No | Pedirlos para el plan |

> **Nota:** *BACK* es el servicio de negocio y *BFF* (*Backend For Frontend*) es el servicio que arma las respuestas que consume la pantalla. *Swagger/OpenAPI* es la documentación de los endpoints de una API. Un *contrato* describe qué recibe y qué devuelve cada endpoint.

## Contexto que lee

1. Steering [`qa-performance`](../../steering/qa-performance.md).
2. La tarea o historia del pedido y sus comentarios y adjuntos.
3. Pruebas parecidas del repositorio de performance del equipo (si existe) y sus `.md` de análisis. Ejemplo de nombre: `tests/catalogo/listar-productos-analisis-prod.md`.
4. Documentación funcional de [`04-funcionalidades/`](../../../04-funcionalidades/contexto-funcionalidades.md).

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue`, `searchJiraIssuesUsingJql`, `listJiraIssueComments` (servidor `@atlassian`); lectura de documentos del repositorio documental del equipo (por ejemplo SharePoint o Drive), si hay un MCP configurado |
| Escritura | Solo `.qa-work/` |

## Pasos

0. **Espacio de trabajo.** Crear `.qa-work/<CLAVE>/performance/` e `indice.md`.
1. **Pedido.** Leer la tarea o historia: objetivo, servicios, flujo, quién pide, restricciones (efectos reales, ventanas, datos). Contrastarla con la planilla de pedido de performance y verificar que la creó el TL del equipo, que está vinculada a la HU de origen y que se hizo al menos 2 sprints antes del release.
2. **[PUNTO DE CONTROL] Pedido · esperando tu confirmación.** Mostrar el resumen, qué secciones de la planilla faltan y lo que falta (datos de producción, contratos, información del TL o de arquitectura). Una sección faltante se pide en el pedido (lo completa el TL) y no se avanza al modelo de carga hasta tenerla. Si faltan menos de 2 sprints para el release, informarlo como riesgo del release. Esperar OK.
3. **Perfil operacional** con la tabla de `qa-performance`: volumen, ventana, pico, mezcla, crecimiento, datos.
4. **Modelo de carga:** throughput promedio y pico, concurrencia esperada (Little), mezcla, tipos de prueba recomendados y la carga de cada uno. Cada número con su etiqueta **[Dato] / [Cálculo] / [Hipótesis]** y fórmula.
5. **Datos faltantes** y cómo conseguirlos.
6. **[PUNTO DE CONTROL] Modelo de carga · esperando tu confirmación.** Mostrar el análisis y guardarlo en `01-analisis.md` (Borrador). Esperar OK.

> **Nota:** *throughput* es la cantidad de solicitudes por segundo que procesa el sistema. *Ventana* es el período del día en que se concentra el uso. *Pico* es el momento de mayor carga. *Mezcla* es la proporción entre los distintos flujos (por ejemplo, 70 % de consultas al catálogo y 30 % de compras). **Ley de Little:** concurrencia = tasa de llegada × tiempo de respuesta promedio (por ejemplo, 20 solicitudes/s × 0,5 s = 10 solicitudes en curso a la vez).
>
> **Ejemplo:** la Tienda Demo recibe 36.000 consultas al catálogo por día, concentradas en 4 horas. Promedio en la ventana = 36.000 / (4 × 3.600 s) = 2,5 solicitudes/s **[Cálculo]**, a partir del volumen diario **[Dato]**. Si no se conoce el pico, se propone 3 veces el promedio (7,5 solicitudes/s) **[Hipótesis]** y se pide el dato real.

## Punto de confirmación

| Punto | Se muestra |
| :--- | :--- |
| Pedido | Objetivo, servicios, flujo, restricciones, faltantes |
| Modelo de carga | Perfil operacional, cálculos con fórmula, tipos de prueba y carga propuesta, supuestos, faltantes |

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

`01-analisis.md` (se copia también junto al test como `<prueba>-analisis-prod.md`):

```markdown
# <Prueba> — Análisis para dimensionar la prueba
| Dato | Valor |
| :--- | :--- |
| Pedido | <clave del equipo, por ejemplo PROJ-150> |
| Tarea AUTO | <AUTO-…> |
| Estado | Borrador / Aprobado |
## 1. Objetivo
## 2. Resumen ejecutivo
## 3. Fuente de los datos
## 4. Uso actual en producción
| Métrica | Valor | Etiqueta | Observación |
## 5. Carga esperada: promedio y pico
## 6. Cálculo de throughput y concurrencia
## 7. Tipos de prueba y carga propuesta
| Tipo | Tasa | Duración | Etiqueta |
## 8. Datos faltantes y cómo conseguirlos
## 9. Supuestos
## 10. Próximos pasos
```

> **Nota:** la columna "Etiqueta" lleva `Dato`, `Cálculo` o `Hipótesis`. Tipos de prueba habituales: *smoke* (verificación mínima de que el script funciona), *load* (carga esperada), *stress* (más allá de lo esperado, para encontrar el límite), *soak* (carga sostenida por horas, para detectar degradación) y *spike* (aumento brusco).

Siguiente paso sugerido: `PLANIFICAR`.

## Reglas

- No inventar volúmenes ni picos. Lo que no es dato se marca como hipótesis.
- Toda cifra calculada muestra la fórmula.
- No definir criterios de aceptación acá: se acuerdan con el TL y arquitectura en el plan y la calibración. No hay criterios mínimos generales: cada flujo es distinto y toda prueba define un baseline (línea base: los valores de referencia contra los que se compara).
- Todas las pruebas son por endpoint. Un recorrido de usuario por el front se modela llamando a los BFF en el mismo orden que la aplicación.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| Solo hay totales mensuales | Sin timestamps (fecha y hora de cada operación) | Calcular el piso calendario y marcarlo como no representativo del pico |

## Criterios de calidad

- Cada número es trazable a un dato, un cálculo o una hipótesis declarada.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Pedido con datos de producción | Modelo de carga con cálculos y etiquetas |
| 2 | Sin datos de producción | Modelo con hipótesis explícitas y lista de faltantes |
| 3 | Pedido sin servicios ni flujo | Lo pide; no avanza |
| 4 | Pedido sin la sección "Volumen de referencia" | Pide completarla al TL en el pedido; no avanza al modelo de carga |
| 5 | Pedido creado con menos de 2 sprints de anticipación | Lo informa como riesgo del release |
