# Épica: PROJ-40 — Pedidos y seguimiento

> **Para qué sirve:** resume el alcance, la definición de terminado, las historias, las dependencias y los riesgos de la épica PROJ-40.
> **Quién lo usa:** QA del Equipo Delta y el agente `qa-sdd`, al revisar una historia de la épica para entender el contexto mayor.
> **Cuándo se usa:** al empezar a trabajar una HU de la épica y al armar el plan de pruebas de un sprint que la incluya.

> **Atención:** épica **ficticia de ejemplo**. Lo que no está definido figura como "Pendiente de definir por el PO".

## Resumen

El comprador, después de confirmar una compra, puede consultar sus pedidos y ver en qué estado está cada uno, sin tener que contactar a la tienda.

## Alcance

### Incluye

- Consultar el estado de un pedido propio (PROJ-142).
- Mostrar el estado vigente, el número de pedido y la fecha de creación.
- Respuesta ante un pedido inexistente o ajeno (PROJ-142).
- Listar los pedidos del comprador, con estado vacío cuando no tiene pedidos (PROJ-143, ejemplo).

### No incluye

- Cancelación de pedidos por parte del comprador.
- Notificaciones por cambio de estado (correo, push).
- Seguimiento del transportista en un mapa.
- Administración de pedidos por el personal de la tienda (ver [vision-administracion](../../../../vision-administracion/reglas-negocio.md)).

> **Nota:** todo lo del "No incluye" es **Pendiente de definir por el PO** si entra en una épica futura.

## Definition of Done (épica)

- El comprador ve el estado actual de cualquier pedido propio.
- Un comprador no puede ver pedidos de otro comprador.
- Las reglas `RN-PED-20` a `RN-PED-24` están cubiertas por casos ejecutados (`RN-PED-20`, `21`, `22` y `24` en PROJ-142; `RN-PED-23`, el estado vacío, en PROJ-143).
- Existe evidencia de ejecución por historia en `evidencias/<ID-HISTORIA>/`.

## Historias dentro de esta épica

| Key | Título | Estado |
| :--- | :--- | :--- |
| PROJ-142 | Consultar el estado de un pedido | Tareas por hacer |
| PROJ-143 | Listar pedidos del comprador (ejemplo) | Tareas por hacer |
| Pendiente | Otras historias de la épica: buscar en Jira | — |

## Dependencias

- Checkout funcionando: genera el pedido ([04-checkout](../../../04-checkout/reglas-negocio.md)).
- Login funcionando: la consulta requiere sesión ([01-acceso](../../../01-acceso/reglas-negocio.md)).
- Servicio `pedidos-back` (nombre de ejemplo) disponible en QA.

## Riesgos

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| Lista de estados no confirmada por el PO | Casos de borde sin definir | Dejarlo como pregunta en `preguntas-abiertas.md` y revisarlo antes del sprint |
| Un comprador ve pedidos de otro | Impacto alto (permisos, datos personales) | Casos negativos de permisos desde el primer sprint |
| Datos de prueba insuficientes (faltan pedidos en cada estado) | Casos sin poder ejecutarse | Plan de datos con `qa-sdd-plan-datos` y pedido al set de QA |

## Referencias

- Reglas del módulo: [reglas-negocio.md](../../reglas-negocio.md)
- Contexto del módulo: [contexto.md](../../contexto.md)
