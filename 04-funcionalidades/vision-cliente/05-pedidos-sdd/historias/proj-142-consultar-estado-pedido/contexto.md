# Historia: PROJ-142 — Consultar el estado de un pedido

> **Para qué sirve:** resume qué hace y qué no hace la historia PROJ-142, sus dependencias, precondiciones y contrato de errores. Es el contexto que usa QA para revisar la spec y derivar casos.
> **Quién lo usa:** QA del Equipo Delta y el agente `qa-sdd` con sus skills (`qa-sdd-revision-spec`, `qa-sdd-plan-datos`).
> **Cuándo se usa:** al revisar la spec de la HU, al diseñar los casos (`PROJ-142-CP01`, `PROJ-142-CP02`, ...) y al ejecutarlos.

> **Atención:** historia **ficticia de ejemplo**. Los códigos y textos de error son un modelo. Lo no definido figura como "Pendiente de definir por el PO".

## Datos básicos

| Campo | Valor |
| :--- | :--- |
| Key | PROJ-142 |
| Tipo | Historia |
| Épica | PROJ-40 — Pedidos y seguimiento |
| Estado | Tareas por hacer |
| Prioridad | Medium |
| Equipo | Delta (SDD) |
| Etiqueta | `delta` |
| Sprint | Sprint 12 (ejemplo) |

## Resumen funcional

El comprador con sesión iniciada indica el número de uno de sus pedidos y el sistema le muestra el estado vigente del pedido.

**Endpoint de ejemplo:** `GET /v1/pedidos/{numeroPedido}`

**Lo que SÍ hace:**

- Verifica que haya sesión iniciada.
- Busca el pedido por su número.
- Verifica que el pedido pertenezca al comprador de la sesión.
- Devuelve número de pedido, estado vigente y fecha de creación.
- Si el pedido no existe o es de otro comprador, responde de la misma forma (no revela que existe).

**Lo que NO hace:**

- NO cancela ni modifica el pedido.
- NO envía notificaciones.
- NO muestra el historial de cambios de estado (**Pendiente de definir por el PO** si entra en otra HU).
- NO lista todos los pedidos con filtros (**Pendiente de definir por el PO**).

## Dependencias

| Tipo | Key | Título | Estado |
| :--- | :--- | :--- | :--- |
| Debe hacerse después de | PROJ-120 | Confirmar compra en el checkout (ejemplo) | Finalizada |
| Debe hacerse antes de | PROJ-143 | Listar pedidos del comprador (ejemplo) | Tareas por hacer |
| Relacionada con | PROJ-130 | Estados del pedido (ejemplo) | En curso |

## Precondiciones

- El comprador tiene sesión iniciada.
- Existe al menos un pedido guardado (generado por el checkout).
- El pedido tiene un estado de la lista vigente (ver `RN-PED-08`).

## Contrato de errores (modelo de ejemplo)

| HTTP | Situación | Texto exacto |
| :--- | :--- | :--- |
| 401 | Sin sesión | Pendiente de definir por el PO |
| 404 | Pedido inexistente o de otro comprador | Pendiente de definir por el PO |
| 400 | Número de pedido con formato inválido | Pendiente de definir por el PO |
| 500 | Error interno | Pendiente de definir por el PO |

> **Nota:** el contrato real se lee del Swagger del servicio. QA no inventa mensajes de error que no estén en la historia.

## Criterios de aceptación (ejemplo, formato estándar)

| ID | Criterio |
| :--- | :--- |
| CA-1 | Cuando el comprador consulta un pedido propio existente, el sistema debe mostrar su número, su estado vigente y la fecha de creación |
| CA-2 | Cuando el comprador consulta un número de pedido que no existe, el sistema debe informar que no se encontró el pedido |
| CA-3 | Cuando el comprador consulta un pedido de otro comprador, el sistema debe responder igual que ante un pedido inexistente |
| CA-4 | Cuando no hay sesión iniciada, el sistema debe rechazar la consulta y pedir ingresar |
| CA-5 | Cuando el estado del pedido cambia, el sistema debe mostrar el estado nuevo en la siguiente consulta |

> **Ejemplo:** `PROJ-142-CP03 - Consultar un pedido de otro comprador`. Precondición: `standard_user` con sesión; el pedido `PED-0101` pertenece a `problem_user`. Resultado esperado: el sistema responde igual que ante un pedido inexistente (el texto exacto se confirma con el PO).

## Referencias

- Datos de prueba: [datos-prueba.md](./datos-prueba.md)
- Preguntas abiertas: [preguntas-abiertas.md](./preguntas-abiertas.md)
- Reglas del módulo: [reglas-negocio.md](../../reglas-negocio.md)
- Épica: [PROJ-40](../../epicas/proj-40-seguimiento-de-pedidos/contexto.md)
