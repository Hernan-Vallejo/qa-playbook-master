# Reglas de Negocio — Módulo Pedidos y seguimiento (ejemplo SDD)

> **Para qué sirve:** reúne las reglas estables que aplican a todo el módulo de pedidos, no a una HU puntual. Cada regla tiene un identificador (`RN-PED-xx`) para poder citarla en casos y specs.
> **Quién lo usa:** QA del Equipo Delta y los agentes SDD, al revisar una spec y derivar casos de prueba.
> **Cuándo se usa:** al revisar el `requirement.md` de una HU del módulo, para comprobar que la spec respeta estas reglas o para detectar contradicciones.

> **Atención:** el sitio demo SauceDemo **no tiene pedidos**. Este módulo es un **ejemplo ficticio** que extiende Tienda Demo. Las reglas marcadas "Pendiente de definir por el PO" no se pueden afirmar y no se deben suponer al diseñar casos.

| ID | Regla | Fuente |
| :--- | :--- | :--- |
| RN-PED-01 | Cada compra confirmada en el checkout genera un único pedido | Ejemplo del módulo |
| RN-PED-02 | El pedido guarda los datos del comprador (nombre, apellido, código postal) tal como se ingresaron en el checkout | [RN-CHK-06](../04-checkout/reglas-negocio.md) |
| RN-PED-03 | El pedido guarda, por cada producto, el precio al momento de la compra. Un cambio posterior de precio en el catálogo no modifica pedidos existentes | Ejemplo del módulo. Confirmar con el PO |
| RN-PED-04 | Los importes del pedido cumplen: `total = subtotal + impuesto` y `subtotal = suma de (cantidad × precio unitario)` de sus ítems | [RN-CHK-10 a RN-CHK-12](../04-checkout/reglas-negocio.md) |
| RN-PED-05 | Un comprador solo ve **sus propios pedidos**. Si pide el pedido de otro comprador, el sistema no lo muestra | Área crítica: permisos |
| RN-PED-06 | La consulta de un pedido requiere sesión iniciada | [RN-ACC-08](../01-acceso/reglas-negocio.md) |
| RN-PED-07 | El pedido tiene un único estado vigente a la vez | Ejemplo del módulo |
| RN-PED-08 | Los estados del pedido, en orden, son: `CREADO` → `EN_PREPARACION` → `ENVIADO` → `ENTREGADO`. `CANCELADO` es un estado final alternativo | Ejemplo. **Pendiente de definir por el PO** la lista oficial |
| RN-PED-09 | Un pedido en estado final (`ENTREGADO` o `CANCELADO`) no cambia de estado | Ejemplo. **Pendiente de definir por el PO** |
| RN-PED-10 | Un pedido no puede retroceder a un estado anterior (ej. de `ENVIADO` a `EN_PREPARACION`) | Ejemplo. **Pendiente de definir por el PO** |

## Estados del pedido (modelo de ejemplo)

`CREADO` → `EN_PREPARACION` → `ENVIADO` → `ENTREGADO`

| Estado | Significado | Transición desde |
| :--- | :--- | :--- |
| `CREADO` | Compra confirmada; el pedido todavía no se empezó a preparar | Confirmación de la compra (paso 3 del checkout) |
| `EN_PREPARACION` | La tienda está armando el pedido | `CREADO` |
| `ENVIADO` | El pedido salió hacia el comprador | `EN_PREPARACION` |
| `ENTREGADO` | El comprador recibió el pedido | `ENVIADO` |
| `CANCELADO` | El pedido se canceló | Pendiente de definir por el PO desde qué estados se permite cancelar |

> **Nota:** estos estados son un **modelo de ejemplo** para practicar SDD. En un proyecto real, el PO confirma la lista y las transiciones, y las specs las referencian.

## Consulta de estado de un pedido

> Reglas de la historia [PROJ-142](./historias/proj-142-consultar-estado-pedido/contexto.md).

| ID | Regla | Fuente |
| :--- | :--- | :--- |
| RN-PED-20 | Al consultar un pedido existente del propio comprador, el sistema muestra su número, su estado vigente y la fecha de creación | PROJ-142 |
| RN-PED-21 | Si el número de pedido no existe, el sistema informa que no se encontró el pedido. El texto exacto es **Pendiente de definir por el PO** | PROJ-142 |
| RN-PED-22 | Si el pedido pertenece a otro comprador, el sistema responde igual que si no existiera (no revela que existe) | RN-PED-05. Confirmar con el PO |
| RN-PED-23 | Si el comprador no tiene pedidos, el sistema muestra un estado vacío. El texto exacto es **Pendiente de definir por el PO**. Aplica al listado de pedidos (PROJ-143, ejemplo). En PROJ-142, un comprador sin pedidos que consulta un número recibe lo mismo que ante un pedido inexistente (`RN-PED-21`) | PROJ-143 (ejemplo); PROJ-142 solo por `RN-PED-21` |
| RN-PED-24 | El estado mostrado coincide con el estado guardado en la base de datos (`pedidos.estado`) | RN-PED-07 |

> **Implicancia para QA:** como los textos exactos de los mensajes no están definidos, los casos que dependen de ellos se escriben con el texto "a confirmar" y se marcan como bloqueados hasta que el PO responda (ver `preguntas-abiertas.md` de la HU).

## Pendiente de definir por el PO

| # | Tema | Por qué importa |
| :--- | :--- | :--- |
| 1 | Lista oficial de estados y transiciones permitidas | Define los casos de borde del ciclo de vida |
| 2 | Quién cancela un pedido y hasta qué estado | Afecta permisos y casos negativos |
| 3 | Formato del número de pedido | Necesario para casos de formato inválido |
| 4 | Cuántos pedidos se muestran por pantalla (paginación) | Casos de borde de volumen |
| 5 | Si hay notificación al comprador ante cada cambio de estado | Define si hay que probarla |
| 6 | Vigencia de la información: cuánto tarda un cambio de estado en verse | No se puede esperar un valor sin la regla |

## Referencias

- Contexto del módulo: [contexto.md](./contexto.md)
- Datos de prueba: [datos-prueba.md](./datos-prueba.md)
- Glosario: [glosario.md](./glosario.md)
