# Checkout — Consultas y Scripts de QA

> **Para qué sirve:** reúne consultas SQL de **solo lectura (SELECT)** para verificar en la base de QA el pedido generado por una compra: datos del comprador, importes e ítems.
> **Quién lo usa:** QA del Equipo Beta (checkout) y del Equipo Delta (pedidos).
> **Cuándo se usa:** después de ejecutar una compra de prueba, para confirmar que lo que se ve en pantalla coincide con lo que se guardó.

> **Atención:** el sitio demo https://www.saucedemo.com/ **no tiene una base de datos accesible**: no guarda pedidos. Estas consultas son un **modelo para un proyecto real** sobre la base ficticia `tienda_qa`. Las tablas y columnas son un ejemplo.
> **Solo SELECT.** Ninguna consulta modifica datos.
> **Datos ficticios.** Comprador de prueba "Ana Prueba", código postal "1000".

---

## Esquema de ejemplo

**Tabla `pedidos`**

| Columna | Tipo (ejemplo) | Descripción |
| :--- | :--- | :--- |
| `id` | entero | Identificador del pedido |
| `usuario_id` | entero | Usuario que compró (referencia a `usuarios.id`) |
| `estado` | texto | Estado del pedido (ver [05-pedidos-sdd](../05-pedidos-sdd/reglas-negocio.md)) |
| `nombre` | texto | Nombre del comprador ingresado en el checkout |
| `apellido` | texto | Apellido del comprador |
| `codigo_postal` | texto | Código postal ingresado |
| `subtotal` | decimal(10,2) | Suma de los precios de los ítems |
| `impuesto` | decimal(10,2) | Impuesto calculado |
| `total` | decimal(10,2) | Subtotal más impuesto |
| `creado_en` | fecha y hora | Momento de la confirmación |

**Tabla `pedido_items`**

| Columna | Tipo (ejemplo) | Descripción |
| :--- | :--- | :--- |
| `id` | entero | Identificador de la línea |
| `pedido_id` | entero | Pedido al que pertenece |
| `producto_id` | entero | Producto comprado |
| `cantidad` | entero | Cantidad (1 en el modelo de ejemplo) |
| `precio_unitario` | decimal(10,2) | Precio del producto al momento de la compra |

---

## 1. Último pedido de un usuario

```sql
-- Último pedido del usuario de prueba
-- @usuario: reemplazar por el username (ej. 'standard_user')
SELECT p.id, p.estado, p.nombre, p.apellido, p.codigo_postal,
       p.subtotal, p.impuesto, p.total, p.creado_en
FROM pedidos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE u.username = '@usuario'
ORDER BY p.creado_en DESC
LIMIT 1;
```

> **Ejemplo:** tras comprar Backpack y Bike Light, se espera `subtotal = 39.98`, `impuesto = 3.20` y `total = 43.18` (ver el ejemplo de verificación de importes, RN-CHK-10 a RN-CHK-12, en [reglas-negocio.md](./reglas-negocio.md)).

---

## 2. Ítems de un pedido

```sql
-- @pedidoId: reemplazar por el id del pedido a verificar
SELECT pi.producto_id, pr.nombre, pi.cantidad, pi.precio_unitario
FROM pedido_items pi
JOIN productos pr ON pr.id = pi.producto_id
WHERE pi.pedido_id = @pedidoId
ORDER BY pr.nombre;
```

---

## 3. Coherencia de importes del pedido

Detecta pedidos en los que el subtotal no coincide con la suma de sus ítems. Debe devolver 0 filas.

```sql
-- Pedidos cuyo subtotal no coincide con la suma de sus ítems (esperado: 0 filas)
SELECT p.id, p.subtotal, SUM(pi.cantidad * pi.precio_unitario) AS suma_items
FROM pedidos p
JOIN pedido_items pi ON pi.pedido_id = p.id
GROUP BY p.id, p.subtotal
HAVING p.subtotal <> SUM(pi.cantidad * pi.precio_unitario);
```

```sql
-- Pedidos cuyo total no es subtotal + impuesto (esperado: 0 filas)
SELECT id, subtotal, impuesto, total
FROM pedidos
WHERE total <> subtotal + impuesto;
```

---

## 4. Compra duplicada

Sirve para verificar la regla RN-CHK-17 (compra única al presionar "Finish").

```sql
-- Pedidos del mismo usuario con los mismos importes creados en el mismo minuto
-- (esperado: 0 filas si se presionó "Finish" una sola vez)
SELECT usuario_id, total, COUNT(*) AS cantidad
FROM pedidos
WHERE creado_en >= CURRENT_TIMESTAMP - INTERVAL '10 minutes'
GROUP BY usuario_id, total, DATE_TRUNC('minute', creado_en)
HAVING COUNT(*) > 1;
```

> **Nota:** la sintaxis de fechas (`INTERVAL`, `DATE_TRUNC`) varía según el motor de base de datos. Adaptala al motor de tu proyecto.

---

## 5. Datos del comprador guardados

```sql
-- Verifica que se guardaron los datos del comprador de prueba
SELECT id, nombre, apellido, codigo_postal
FROM pedidos
WHERE nombre = 'Ana' AND apellido = 'Prueba' AND codigo_postal = '1000'
ORDER BY creado_en DESC;
```

---

## Cómo usar estas consultas en una prueba

1. Anotá el pedido que esperás (productos e importes) **antes** de comprar.
2. Ejecutá la compra en la interfaz.
3. Ejecutá las consultas 1 y 2 y compará con lo anotado y con lo que mostró el resumen.
4. Si algo no coincide, reportá el defecto con la captura del resumen y el resultado de la consulta.

> **Atención:** no pegues datos reales de clientes ni medios de pago en casos, specs o tests.
