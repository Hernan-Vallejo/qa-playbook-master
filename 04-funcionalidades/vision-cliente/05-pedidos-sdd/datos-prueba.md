# Datos de Prueba — Módulo Pedidos y seguimiento

> **Para qué sirve:** reúne los datos de prueba reutilizables entre las historias del módulo: usuarios, pedidos de referencia y números de pedido para casos positivos, negativos y de borde.
> **Quién lo usa:** QA del Equipo Delta y el agente `qa-sdd` (skill `qa-sdd-plan-datos`) al armar el plan de datos de una HU.
> **Cuándo se usa:** al diseñar casos de una HU del módulo y al preparar la precondición de cada uno.

> **Atención:** todos los datos son **ficticios**. Nunca se usan datos reales de clientes. Las credenciales de ejemplo (`standard_user` / `secret_sauce`) son de un **sitio demo público**: en un proyecto real se piden al QA en la sesión y se usan por variables de entorno, no en archivos. Los pedidos de este documento son un **modelo**: el sitio demo no tiene pedidos.

## Usuarios

| Usuario | Clave | Para qué sirve |
| :--- | :--- | :--- |
| `standard_user` | `secret_sauce` (sitio demo público) | Comprador con pedidos (dueño de los pedidos de referencia) |
| `problem_user` | `secret_sauce` (sitio demo público) | Segundo comprador: sirve como "otro comprador" para casos de permisos (RN-PED-05) |

## Comprador ficticio

| Campo | Valor |
| :--- | :--- |
| Nombre | Ana |
| Apellido | Prueba |
| Código postal | 1000 |

## Pedidos de referencia (modelo)

> Estos pedidos deben existir en el ambiente de QA. En un proyecto real, el responsable del set de datos de QA los crea. **Pendiente de definir por el PO** y por el equipo cómo se solicita el set.

| Número de pedido (ejemplo) | Dueño | Estado | Productos | Subtotal | Impuesto (8%) | Total |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PED-0001` | `standard_user` | `CREADO` | Sauce Labs Backpack | $29.99 | $2.40 | $32.39 |
| `PED-0002` | `standard_user` | `EN_PREPARACION` | Backpack, Bike Light | $39.98 | $3.20 | $43.18 |
| `PED-0003` | `standard_user` | `ENVIADO` | Fleece Jacket | $49.99 | $4.00 | $53.99 |
| `PED-0004` | `standard_user` | `ENTREGADO` | Onesie | $7.99 | $0.64 | $8.63 |
| `PED-0005` | `standard_user` | `CANCELADO` | Bolt T-Shirt | $15.99 | $1.28 | $17.27 |
| `PED-0101` | `problem_user` | `CREADO` | Bike Light | $9.99 | $0.80 | $10.79 |

> **Nota:** el formato `PED-0001` y la regla de impuesto del 8% son un **modelo**. El formato real del número de pedido es **Pendiente de definir por el PO**.

## Números de pedido para casos negativos y de borde

| Valor | Caso | Resultado esperado |
| :--- | :--- | :--- |
| `PED-0001` con `standard_user` | Pedido propio | Se muestra el pedido y su estado (RN-PED-20) |
| `PED-0101` con `standard_user` | Pedido de otro comprador | Mismo resultado que un pedido inexistente (RN-PED-22) |
| `PED-9999` | Pedido que no existe | Se informa que no se encontró (texto exacto: Pendiente de definir por el PO) |
| (vacío) | Número vacío | Pendiente de definir por el PO |
| `ped-0001` | Minúsculas | Pendiente de definir por el PO |
| `PED-0001 ` (con espacio al final) | Espacios | Pendiente de definir por el PO |
| Un texto de 500 caracteres | Largo excesivo | Pendiente de definir por el PO |

## Comprador sin pedidos

| Dato | Valor |
| :--- | :--- |
| Usuario | Un comprador nuevo del set de QA sin compras |
| Resultado esperado en el listado (PROJ-143, ejemplo) | Estado vacío (texto exacto: Pendiente de definir por el PO) |
| Resultado esperado al consultar un número en PROJ-142 | Igual que un pedido inexistente (`RN-PED-21`, asunción A4) |

## Cómo verificar los datos

Con la base ficticia `tienda_qa` (ver [04-checkout/consultas-sql-qa.md](../04-checkout/consultas-sql-qa.md)):

```sql
-- Pedidos de un usuario con su estado (solo lectura)
SELECT p.id, p.estado, p.subtotal, p.impuesto, p.total
FROM pedidos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE u.username = 'standard_user'
ORDER BY p.id;
```
