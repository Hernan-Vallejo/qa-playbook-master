---
name: qa-performance-plan
description: Arma el plan de una prueba de performance a partir del análisis aprobado - objetivos, alcance, flujo y pasos, endpoints, datos, tipos de prueba y carga, criterios de aceptación iniciales a acordar con el TL y arquitectura, monitoreo, riesgos y orden de ejecución (smoke en QA, calibración y corridas en PRE desde GitHub Actions). Usar cuando el agente qa-performance o el QA pide "PLANIFICAR", "armá el plan de performance", "qué pruebas corremos". No escribe código.
---
# Plan de una prueba de performance

> **Para qué sirve:** deja por escrito qué se prueba, cómo, con qué carga y con qué criterios, antes de escribir el script de performance.
> **Quién lo usa:** el QA de performance, directamente o a través del agente [`qa-performance`](../../agents/qa-performance.md).
> **Cuándo se usa:** cuando el análisis (`01-analisis.md`) ya está aprobado y falta definir el plan (`02-plan.md`).

> **Nota:** se usa [k6](https://k6.io/) como ejemplo genérico de herramienta de performance (es pública y gratuita). k6 es opcional y no viene incluida en la plantilla [`plantilla-automation/`](../../../plantilla-automation/README.md); el equipo puede sumar el framework que prefiera. "TL" = líder técnico. "PO" = *Product Owner*. "SRE" = *Site Reliability Engineering*, el equipo que opera la infraestructura. "PRE" = preproducción. "Smoke" = corrida mínima que solo verifica que el script funciona. "Calibración" = corridas de ajuste para fijar la carga y los valores de referencia.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.2 |
| Puntos de control | Plan de la prueba |
| Archivos en `.qa-work/<CLAVE>/performance/` | Lee `01-analisis.md`. Escribe `02-plan.md` |

## Propósito

Dejar acordado qué se prueba, cómo, con qué carga y con qué criterios antes de escribir el script.

> **Atención:** las pruebas de carga se ejecutan solo en ambientes propios del equipo (QA para el smoke, PRE para medir). Nunca contra producción ni contra sitios públicos de terceros como el demo SauceDemo.

## Cuándo usarla

- El análisis (`01-analisis.md`) está aprobado.

## Cuándo no usarla

- No hay análisis → [`qa-performance-analisis`](../qa-performance-analisis/SKILL.md).
- El plan está aprobado → la skill de implementación del framework de performance (si el equipo la tiene).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| `01-analisis.md` aprobado | Sí | No avanzar |
| Contratos de los endpoints | Sí | Pedirlos |
| Objetivos del TL y arquitectura | No | Proponer parámetros básicos para la primera corrida, marcados como provisorios |

## Contexto que lee

1. Steering [`qa-performance`](../../steering/qa-performance.md) y, si el equipo sumó un framework de performance, el steering de su proyecto.
2. `01-analisis.md`.
3. Referencia: un plan de una prueba anterior del repositorio de performance del equipo (si existe). Ejemplo de nombre: `tests/checkout/crear-pedido-plan.md`.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue` (servidor `@atlassian`); lectura de los contratos de los endpoints desde el repositorio o el catálogo de APIs del equipo |
| Escritura | Solo `.qa-work/` |

## Pasos

1. **Flujo y pasos:** cada llamada en orden con su método, endpoint, tag (`N-Dominio-Accion`), datos y qué se valida (checks).
2. **Datos de prueba** por ambiente:
   - **QA (piloto):** los arma QA Automation. Indicar cuáles y cómo.
   - **PRE (prueba real):** especificación para el PO (con el analista funcional y el equipo de implementación): tipo de entidad (usuarios, productos, carritos, pedidos), cantidad de registros distintos según la carga planificada, estados y condiciones (stock, permisos, usuarios activos o bloqueados), si se consumen en cada iteración o se reutilizan, y qué efectos tienen. Plazo de entrega: **una semana como máximo** desde la especificación. Los datos **quedan disponibles en PRE** para las re-ejecuciones.
3. **Efectos reales:** qué genera cada iteración en PRE (pedidos, mensajes, registros) y si el TL lo aprobó.
4. **Tipos de prueba y carga** desde el análisis: tasa, duración, rampa.
5. **Criterios iniciales:** thresholds por paso y del flujo, errores aceptables. **Provisorios**: se fijan en la calibración y se acuerdan con el TL y arquitectura.
6. **Monitoreo:** qué métricas del sistema se piden a arquitectura durante las corridas.
7. **Riesgos y mitigaciones** (tabla de `qa-performance`).
8. **Orden de ejecución:** smoke en QA → entrega de la batería de datos en PRE (PO) → validación de SRE de pods y memoria de PRE → baseline y calibración en PRE (GitHub Actions) → corridas en PRE (GitHub Actions) → publicación de cada corrida en el repositorio documental → informe final con severidad → decisión del TL.
9. **Carpeta del repositorio documental** de la prueba (SharePoint, Drive u otro que use el equipo): `…/Test Performance <Nombre>`. Verificar si existe; si no, proponer crearla.
10. **[PUNTO DE CONTROL] Plan de la prueba · esperando tu confirmación.** Mostrar el plan y guardarlo en `02-plan.md`. Esperar OK. Con OK aparte, proponer dejar la especificación de datos de PRE como comentario en el pedido para el PO (no se escribe en Jira sin confirmación).

> **Nota:** un *threshold* es un umbral que el script verifica automáticamente (por ejemplo, "el percentil 95 del tiempo de respuesta debe ser menor a 800 ms"; si no se cumple, la corrida falla). Un *tag* en k6 es una etiqueta que se le pone a cada solicitud para separar sus métricas por paso. Un *pod* es la unidad en la que corre un servicio en la infraestructura; SRE valida que PRE tenga la misma cantidad de pods y memoria que producción (o declara las diferencias).
>
> **Ejemplo de flujo para la Tienda Demo (checkout):**
>
> | Paso | Método | Endpoint | Tag | Valida |
> | :--- | :--- | :--- | :--- | :--- |
> | 1 | POST | `/api/login` | `1-Acceso-Login` | Código 200 y token presente |
> | 2 | GET | `/api/productos` | `2-Catalogo-Listar` | Código 200 y lista no vacía |
> | 3 | POST | `/api/carrito/items` | `3-Carrito-Agregar` | Código 201 |
> | 4 | POST | `/api/pedidos` | `4-Checkout-Confirmar` | Código 201 y número de pedido |
>
> Los endpoints son ficticios, solo ilustran el formato.

## Punto de confirmación

Mostrar flujo y pasos, datos, efectos reales, tipos y carga, criterios provisorios, monitoreo, riesgos, orden de ejecución y carpeta del repositorio documental.

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

`02-plan.md` (se copia junto al test como `<prueba>-plan.md`):

```markdown
# <Prueba> — Plan de la prueba de performance
## 1. Contexto y qué se pidió
## 2. Cómo trabajamos: QA arma, PRE mide, GitHub Actions ejecuta
## 3. Flujo de la API
| Paso | Método | Endpoint | Tag | Valida |
## 4. Datos de prueba
### 4.1 QA (piloto, los arma QA Automation)
### 4.2 PRE (especificación para el PO: entidad, cantidad, estados, consumo, efectos, plazo de una semana)
## 5. Tipos de prueba y carga
| Tipo | Tasa | Duración | Objetivo |
## 6. Baseline y criterios de aceptación (provisorios hasta la calibración)
| Métrica | Valor inicial | Acordado con TL y arquitectura |
## 7. Monitoreo
## 8. Riesgos
## 9. Orden de ejecución y publicación en el repositorio documental
```

> **Nota:** en "Baseline y criterios" la columna "Acordado con TL y arquitectura" se completa con `Sí` o `No`; mientras sea `No`, el valor es provisorio.

Siguiente paso sugerido: `IMPLEMENTAR` (con la skill `k6-implementar` del repositorio de performance, si el equipo usa k6).

## Reglas

- Criterios iniciales siempre marcados como provisorios.
- No planificar corridas en QA para medir.
- No incluir operaciones con efecto real sin el OK del TL.
- Sin batería de datos en PRE y sin validación de SRE no se planifica la calibración como lista para correr: se marca como bloqueada.
- No hay criterios mínimos generales: toda prueba define un baseline antes de las corridas que se informan.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| No hay datos en PRE | Datos solo en QA o pasó la semana de plazo | Marcarlo como bloqueante de la calibración y avisar que el pedido está bloqueado por datos |

## Criterios de calidad

- Un QA que no armó la prueba puede implementarla con este plan.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Análisis aprobado | Plan completo con criterios provisorios |
| 2 | Operación con efecto real | La marca como riesgo y pide OK del TL |
| 3 | El QA no confirma | No avanza a implementar |
