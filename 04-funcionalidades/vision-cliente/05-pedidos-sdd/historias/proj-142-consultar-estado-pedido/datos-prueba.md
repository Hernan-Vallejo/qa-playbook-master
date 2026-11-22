# Datos de Prueba — PROJ-142

> **Para qué sirve:** datos específicos para probar la consulta del estado de un pedido: precondiciones, valores de entrada y resultado esperado de cada uno.
> **Quién lo usa:** QA del Equipo Delta, al ejecutar los casos `PROJ-142-CPxx`.
> **Cuándo se usa:** al preparar la precondición de cada caso y al ejecutarlo. Complementa los datos generales del módulo en [datos-prueba.md](../../datos-prueba.md).

> **Atención:** datos **ficticios**. Credenciales de un sitio demo público: en un proyecto real van en variables de entorno, no en archivos.

## Precondición: pedidos existentes

Deben existir en el ambiente de QA (ver la tabla completa en [datos-prueba.md](../../datos-prueba.md)):

| Pedido | Dueño | Estado | Total |
| :--- | :--- | :--- | :--- |
| `PED-0001` | `standard_user` | `CREADO` | $32.39 |
| `PED-0002` | `standard_user` | `EN_PREPARACION` | $43.18 |
| `PED-0003` | `standard_user` | `ENVIADO` | $53.99 |
| `PED-0004` | `standard_user` | `ENTREGADO` | $8.63 |
| `PED-0005` | `standard_user` | `CANCELADO` | $17.27 |
| `PED-0101` | `problem_user` | `CREADO` | $10.79 |

## Respuestas esperadas (modelo)

### Caso 1: pedido propio

```text
GET /v1/pedidos/PED-0003   (sesión: standard_user)
```

```json
{
  "numeroPedido": "PED-0003",
  "estado": "ENVIADO",
  "creadoEn": "2026-11-02T10:00:00"
}
```

### Caso 2: pedido inexistente

```text
GET /v1/pedidos/PED-9999   (sesión: standard_user)
→ HTTP 404 (texto exacto: Pendiente de definir por el PO)
```

### Caso 3: pedido de otro comprador

```text
GET /v1/pedidos/PED-0101   (sesión: standard_user)
→ HTTP 404, igual al caso 2 (RN-PED-22)
```

### Caso 4: sin sesión

```text
GET /v1/pedidos/PED-0001   (sin sesión)
→ HTTP 401 (texto exacto: Pendiente de definir por el PO)
```

## Valores del número de pedido

| Valor | Caso | Resultado esperado |
| :--- | :--- | :--- |
| `PED-0001` | Propio, estado `CREADO` | Estado `CREADO` |
| `PED-0004` | Propio, estado final | Estado `ENTREGADO` |
| `PED-0005` | Propio, cancelado | Estado `CANCELADO` |
| `PED-9999` | Inexistente | No encontrado |
| `PED-0101` | De otro comprador | No encontrado |
| `` (vacío) | Vacío | Pendiente de definir por el PO |
| `abc` | Formato inválido | Pendiente de definir por el PO |

## Verificación en base de datos

```sql
-- Estado guardado del pedido a verificar (solo lectura)
SELECT id, estado
FROM pedidos
WHERE id = @pedidoId;
```

> **Nota:** el estado que muestra la pantalla debe coincidir con `pedidos.estado` (RN-PED-24).
