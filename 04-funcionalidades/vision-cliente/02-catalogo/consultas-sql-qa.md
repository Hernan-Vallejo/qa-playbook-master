# Catálogo — Consultas y Scripts de QA

> **Para qué sirve:** reúne consultas SQL de **solo lectura (SELECT)** para verificar el catálogo en la base de QA: productos activos, precios y orden.
> **Quién lo usa:** QA del Equipo Alfa y de otros equipos que necesiten confirmar datos de productos.
> **Cuándo se usa:** al preparar la precondición de un caso de catálogo o al comparar lo que muestra la pantalla contra lo que hay en la base.

> **Atención:** el sitio demo https://www.saucedemo.com/ **no tiene una base de datos accesible**. Estas consultas son un **modelo para un proyecto real** sobre la base ficticia `tienda_qa`. Las tablas y columnas son un ejemplo.
> **Solo SELECT.** Ninguna consulta modifica datos.

---

## Esquema de ejemplo: tabla `productos`

| Columna | Tipo (ejemplo) | Descripción |
| :--- | :--- | :--- |
| `id` | entero | Identificador del producto |
| `nombre` | texto | Nombre que se muestra en el catálogo |
| `descripcion` | texto | Descripción del producto |
| `precio` | decimal(10,2) | Precio unitario en dólares |
| `activo` | booleano | `true` si el producto se muestra en el catálogo |

---

## 1. Productos activos del catálogo

Debe devolver 6 filas (regla RN-CAT-01 de [reglas-negocio.md](./reglas-negocio.md)).

```sql
-- Productos que se muestran en el catálogo, orden A-Z por nombre
SELECT id, nombre, precio
FROM productos
WHERE activo = true
ORDER BY nombre ASC;
```

---

## 2. Cantidad de productos activos

```sql
-- Debe devolver 6
SELECT COUNT(*) AS cantidad_activos
FROM productos
WHERE activo = true;
```

---

## 3. Orden por precio (para comparar con la pantalla)

```sql
-- Equivale a "Price (low to high)"
SELECT nombre, precio
FROM productos
WHERE activo = true
ORDER BY precio ASC, nombre ASC;

-- Equivale a "Price (high to low)"
SELECT nombre, precio
FROM productos
WHERE activo = true
ORDER BY precio DESC, nombre ASC;
```

> **Nota:** el desempate por nombre en estas consultas es solo para tener un resultado estable. El orden de desempate que debe mostrar la pantalla es **Pendiente de definir por el PO** (ver RN-CAT-06 y RN-CAT-07).

---

## 4. Precio de un producto

```sql
-- @nombre: reemplazar por el nombre del producto (ej. 'Sauce Labs Backpack')
-- Resultado esperado según la documentación: 29.99
SELECT nombre, precio
FROM productos
WHERE nombre = '@nombre';
```

---

## 5. Productos con precio repetido

Sirve para encontrar los casos de borde del orden por precio.

```sql
-- Precios que aparecen en más de un producto (esperado: 15.99 en 2 productos)
SELECT precio, COUNT(*) AS cantidad
FROM productos
WHERE activo = true
GROUP BY precio
HAVING COUNT(*) > 1;
```

---

## Cómo usar estas consultas en una prueba

1. Ejecutá la consulta 1 y anotá nombres y precios.
2. Compará, uno por uno, con lo que muestra el catálogo en la interfaz.
3. Cualquier diferencia de nombre o de precio se reporta como defecto con las dos evidencias (pantalla y resultado de la consulta).

> **Atención:** usá solo datos ficticios del set de QA. No pegues datos reales en casos, specs o tests.
