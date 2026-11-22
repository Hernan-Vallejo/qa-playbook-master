---
name: qa-sdd-plan-datos
description: Arma el plan de datos de prueba de una HU de un equipo SDD a partir de los casos aprobados - por cada caso, qué datos necesita, de dónde salen (reutilizar, crear por API, receta de base, carga previa, mock o excepción manual), quién los provee y en qué estado están - sin crear datos. Cumple el criterio 8 del DoR SDD. Usar cuando el agente qa-sdd o el QA pide "PAQUETE", "plan de datos", "qué datos necesito", "datos de prueba de la HU". Solo lectura; no genera ni modifica datos.
---
# Plan de datos (SDD)

> **Para qué sirve:** dejar definido, antes del sprint, qué datos de prueba necesita cada caso, cómo se consiguen, quién los provee y en qué estado están, sin crear ni modificar ningún dato.
> **Quién lo usa:** el QA de un equipo que trabaja con SDD (por ejemplo el Equipo Delta), directamente o a través del agente `qa-sdd`.
> **Cuándo se usa:** después de aprobar los casos de una historia de usuario (HU), como parte del "Paquete" (segundo punto de control del flujo SDD, junto con la cobertura para desarrollo).

> **Nota:** **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) es la forma de trabajo en la que desarrollo escribe antes una spec (`requirement.md`, `design.md`, `tasks.md`) que QA revisa y usa para derivar casos y datos. **DoR** (*Definition of Ready*) es la lista de condiciones que una HU debe cumplir para entrar al sprint; la versión para equipos SDD está en `01-estandares-globales/definicion-dor-dod-sdd.md`. Un **mock** es una respuesta simulada que reemplaza a un servicio externo.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Paquete (junto con `qa-sdd-cobertura-dev`) |
| Archivos en `.qa-work/<CLAVE-HU>/` | Lee `04-casos.md`. Escribe `sdd/03-plan-datos.md` |

> **Nota:** `<CLAVE-HU>` es la clave de la historia en Jira, por ejemplo `PROJ-142`. `.qa-work/` es la carpeta de trabajo local donde los agentes guardan sus borradores (cada archivo pasa por los estados Borrador, Aprobado y Publicado).

## Propósito

Que el equipo sepa, antes del sprint, qué datos necesita cada caso, cómo se obtienen y quién los provee, para que la ejecución no se frene por falta de datos.

> **Ejemplo:** para `PROJ-142` "Consultar el estado de un pedido", el caso de consultar un pedido propio necesita un pedido en estado `ENVIADO` del usuario `standard_user` (en `datos-prueba.md`, el pedido `PED-0003`). El plan dice si ese pedido ya existe en la base de QA (`REUSE`), si se crea con un paso previo por API (`API_FACTORY`) o si lo tiene que cargar desarrollo (`SEED`).

## Cuándo usarla

- Después de aprobar los casos de una HU de un equipo SDD, para el Paquete.
- Cuando el DoR SDD pide el plan de datos (criterio 8).

## Cuándo no usarla

- Para crear o modificar datos en un ambiente: no lo hace ninguna skill del flujo SDD.
- Para datos de performance → `qa-performance-plan`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU | Sí | Pedirla |
| Casos aprobados (`04-casos.md` Aprobado) | Sí | Detenerse y pedir aprobar los casos |
| Ambiente | No | Se asume QA (nunca PROD) |

> **Nota:** los ambientes del proyecto son QA, PRE (preproducción) y PROD (producción). Nunca se prueba en PROD.

## Contexto que lee

1. Steering `qa-sdd` (reglas del flujo SDD) y steering `qa-seguridad-datos` (qué datos se pueden mostrar y cómo se enmascaran).
2. Documentos de datos de prueba de las carpetas del perfil del equipo en `04-funcionalidades/` (por ejemplo `datos-prueba.md` en `04-funcionalidades/vision-cliente/05-pedidos-sdd/` y las recetas de consulta SQL).
3. `design.md` (contratos y estados) según `sdd/00-fuentes.md`.

## Herramientas MCP

> **Nota:** **MCP** (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a sistemas externos. Acá se usan `@atlassian` (Jira) y `@github` (repositorio). La consulta a la base de QA depende de que el equipo tenga un servidor MCP de base de datos configurado; si no lo tiene, el estado de los datos queda como `UNKNOWN`.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | Consulta SQL de solo lectura (SELECT) a la base de QA `tienda_qa`, si el equipo tiene el servidor MCP configurado, con las reglas de `qa-seguridad-datos`; `getJiraIssue` (`@atlassian`); lectura de archivos del repositorio (`@github`) |
| Escritura | Ninguna |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/sdd/` y que los casos estén Aprobados.
1. **Necesidades por caso.** Para cada caso: entidades (usuario, producto, carrito, pedido, ítem de pedido), estado que necesitan, cantidad y si el caso los consume (no se pueden reutilizar).
2. **Agrupar** las necesidades iguales entre casos, conservando la lista de casos.
3. **Estrategia** de cada necesidad, en este orden de preferencia:

   | Estrategia | Cuándo |
   | :--- | :--- |
   | `REUSE` | Hay un dato documentado o encontrado en el ambiente que sirve y no se consume |
   | `API_FACTORY` | Se crea con una API del propio sistema como paso previo del caso |
   | `DB_RECIPE` | Se busca con una receta de consulta documentada |
   | `SEED` | Lo tiene que cargar desarrollo o el equipo de datos (carga previa de datos de prueba) |
   | `MOCK` | Integración externa simulada (mock, sandbox o stub). Indicar quién la provee |
   | `MANUAL_EXCEPTION` | Solo se consigue a mano. Indicar por qué y quién |

4. **Verificar disponibilidad** solo con lectura: si hay una receta o un dato documentado, consultarlo en el ambiente. Nunca mostrar datos sensibles completos (steering `qa-seguridad-datos`).
5. **Estado** de cada necesidad:

   | Estado | Significado |
   | :--- | :--- |
   | `AVAILABLE` | Verificado en el ambiente |
   | `PLAN_DEFINED` | Se sabe cómo obtenerlo y quién, pero todavía no existe |
   | `GAP` | No hay forma conocida de obtenerlo |
   | `UNKNOWN` | No se pudo verificar |

6. Guardar `sdd/03-plan-datos.md` (Borrador) y devolver el resumen al agente para el **Paquete**.

> **Nota:** un **stub** es un componente que devuelve siempre una respuesta fija, y un **sandbox** es un entorno de pruebas que ofrece un servicio externo con datos ficticios. Los dos entran en la estrategia `MOCK` cuando el caso depende de un servicio que no se puede forzar.

## Punto de confirmación

Sin punto de control propio: se muestra en el **Paquete** del agente `qa-sdd`. Si se usa suelta: "¿Aprobás el plan de datos, ajustamos algo o lo dejamos acá?"

> **Nota:** un punto de control se presenta con la marca `[PUNTO DE CONTROL] Paquete · esperando tu confirmación`. Hasta que el QA responda, el agente no avanza ni publica nada.

## Entregable

El archivo `sdd/03-plan-datos.md` tiene esta estructura. Cada fila de la tabla principal es una necesidad de datos (no un caso).

```text
Plan de datos - <CLAVE-HU> · Ambiente <QA>
Resumen: AVAILABLE <n> · PLAN_DEFINED <n> · GAP <n> · UNKNOWN <n>

| ID | Necesidad | Casos | Se consume | Estrategia | Cómo se obtiene | Responsable | Estado |

Integraciones externas
| Integración | Estrategia (mock, sandbox, stub) | Quién la provee | Estado |

Gaps y pedidos
1. <necesidad> - casos <n> - pedido a <desarrollo, datos, PO>
```

Los datos se describen por sus características (por ejemplo "usuario comprador con al menos un pedido en estado Enviado"), no con datos personales. Los usuarios de prueba son ficticios (`standard_user`, `locked_out_user`, `problem_user`, comprador "Ana Prueba"). Los identificadores técnicos de prueba se pueden incluir enmascarados según `qa-seguridad-datos`.

> **Ejemplo:** filas del plan de `PROJ-142` (ficticias, con los datos de `04-funcionalidades/vision-cliente/05-pedidos-sdd/datos-prueba.md`). Los IDs `DAT-xx` son una convención de este entregable.
>
> | ID | Necesidad | Casos | Se consume | Estrategia | Cómo se obtiene | Responsable | Estado |
> | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
> | DAT-01 | Pedido propio en estado `ENVIADO` (`PED-0003` de `standard_user`) | `PROJ-142-CP01` | No | `REUSE` | Dato documentado; se verifica con `SELECT` sobre `pedidos` | QA | `AVAILABLE` |
> | DAT-02 | Pedido de otro comprador (`PED-0101` de `problem_user`) | `PROJ-142-CP03` | No | `REUSE` | Dato documentado | QA | `AVAILABLE` |
> | DAT-03 | Pedido que cambia de estado durante el caso (para `CA-5`) | `PROJ-142-CP06` | Sí | `API_FACTORY` | Crear el pedido con el checkout y avanzar el estado con un paso previo. Falta definir quién cambia el estado | Desarrollo | `PLAN_DEFINED` |
> | DAT-04 | Respuesta del servicio de logística | `PROJ-142-CP07` | No | `MOCK` | Integración pendiente de definir por el PO | Desarrollo | `GAP` |

> **Nota:** las claves de los usuarios del sitio demo público (por ejemplo `secret_sauce`) no se escriben en el plan. En un proyecto real las credenciales se piden en la sesión y se usan con variables de entorno, nunca en archivos.

## Reglas

- **Solo lectura.** No se insertan, actualizan ni borran datos.
- No se inventan datos: si no se encontró, es `GAP` o `UNKNOWN`.
- Un dato que el caso consume no se marca como reutilizable sin una forma de reponerlo.
- No se exige que los datos existan para el DoR: se exige que el plan esté definido.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La conexión a la base de QA falla por el nombre | El nombre de la conexión del servidor MCP distingue mayúsculas de minúsculas | Usar el nombre exactamente como está configurado (por ejemplo `tienda_qa`, en minúscula) |
| La consulta de metadatos (DDL) falla por permisos | El usuario de solo lectura no tiene ese permiso | Inspeccionar las columnas consultando las vistas del catálogo del motor (por ejemplo `information_schema.columns`) |

## Criterios de calidad

- Cada caso tiene sus datos cubiertos por al menos una necesidad.
- Cada `GAP` tiene a quién se le pide.
- No aparecen datos sensibles sin enmascarar.

## Casos de aceptación

Son los escenarios con los que se verifica que la skill se comporta como se espera.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Caso que usa un usuario documentado en `datos-prueba.md` | `REUSE`, verificado como `AVAILABLE` si se pudo consultar |
| 2 | Caso que necesita una respuesta de un servicio externo de logística que no se puede forzar | `MOCK` con responsable |
| 3 | Caso sin forma conocida de obtener el dato | `GAP` con pedido |
| 4 | El QA pide crear el dato | Se explica que la skill es de solo lectura y se deja el pedido en Gaps |
