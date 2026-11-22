# Catálogo (Visión Cliente) — Reglas de Negocio

> **Para qué sirve:** documenta qué muestra el catálogo (inventario) de Tienda Demo: los 6 productos con sus precios, el detalle de cada uno y las opciones de orden (A-Z, Z-A y por precio).
> **Quién lo usa:** QA del Equipo Alfa (responsable del módulo), QA de otros equipos que necesiten datos de productos, y los agentes de Kiro al revisar HU del catálogo.
> **Cuándo se usa:** al analizar una HU de catálogo, orden o detalle de producto; al diseñar casos de orden; al armar la automatización de `InventoryPage.ts`.

> **Equipo:** Alfa (catálogo y carrito)
> **Proyecto Jira:** `PROJ`
> **Estado de la doc:** Completa para el alcance del sitio demo. Los puntos marcados "Pendiente de definir por el PO" requieren confirmación.
> **Última actualización:** 2026-11-02
> **Documento complementario:** `consultas-sql-qa.md` (consultas SELECT de ejemplo).

> **Nota sobre el origen de las reglas:** las reglas están **observadas en el sitio demo público** https://www.saucedemo.com/. En un proyecto real se confirman con el PO.

---

## Descripción

Después de iniciar sesión, el comprador ve el catálogo: una lista de productos con nombre, descripción, precio e imagen. Puede ordenarlos, abrir el detalle de uno y agregarlo al carrito (ver [03-carrito](../03-carrito/reglas-negocio.md)).

---

## Actores y Permisos

| Actor / Rol | Permiso requerido | Qué puede hacer |
| :--- | :--- | :--- |
| Comprador con sesión | Sesión iniciada | Ver el catálogo, ordenar, ver el detalle, agregar al carrito |
| Comprador sin sesión | — | No puede ver el catálogo (ver RN-ACC-08 en [01-acceso](../01-acceso/reglas-negocio.md)) |

---

## Flujo Principal

1. El comprador inicia sesión con un usuario habilitado.
2. El sistema muestra el catálogo con los productos.
3. El comprador elige un orden (opcional).
4. El comprador abre el detalle de un producto o lo agrega al carrito directamente.

---

## Productos del catálogo

El catálogo tiene **6 productos**. Precios en dólares, observados en el sitio demo.

| # | Producto | Precio |
| :--- | :--- | :--- |
| 1 | Sauce Labs Backpack | $29.99 |
| 2 | Sauce Labs Bike Light | $9.99 |
| 3 | Sauce Labs Bolt T-Shirt | $15.99 |
| 4 | Sauce Labs Fleece Jacket | $49.99 |
| 5 | Sauce Labs Onesie | $7.99 |
| 6 | Test.allTheThings() T-Shirt (Red) | $15.99 |

> **Nota:** hay dos productos con el mismo precio ($15.99, filas 3 y 6). Esto importa en el orden por precio (ver RN-CAT-06).

---

## Reglas de Negocio

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-CAT-01 | Cantidad de productos | `standard_user` con sesión iniciada | El catálogo muestra exactamente 6 productos |
| RN-CAT-02 | Datos de cada producto | Cualquier producto del catálogo | Muestra nombre, descripción, precio con símbolo `$` y dos decimales, imagen y un botón de agregar |
| RN-CAT-03 | Orden por defecto | Se ingresa al catálogo | El orden inicial es "Name (A to Z)": Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Test.allTheThings() T-Shirt (Red) |
| RN-CAT-04 | Opciones de orden | Se abre el selector de orden | Ofrece exactamente 4 opciones: `Name (A to Z)`, `Name (Z to A)`, `Price (low to high)`, `Price (high to low)` |
| RN-CAT-05 | Orden por nombre | Se elige `Name (Z to A)` | El orden pasa a ser el inverso del A-Z: Test.allTheThings() T-Shirt (Red), Onesie, Fleece Jacket, Bolt T-Shirt, Bike Light, Backpack |
| RN-CAT-06 | Orden por precio ascendente | Se elige `Price (low to high)` | Los precios se muestran de menor a mayor: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99. El orden entre los dos de $15.99 es **Pendiente de definir por el PO** |
| RN-CAT-07 | Orden por precio descendente | Se elige `Price (high to low)` | Los precios se muestran de mayor a menor: $49.99, $29.99, $15.99, $15.99, $9.99, $7.99. El orden entre los dos de $15.99 es **Pendiente de definir por el PO** |
| RN-CAT-08 | Detalle del producto | El comprador abre un producto | Muestra nombre, descripción, precio e imagen de ese producto, y un botón para volver al catálogo |
| RN-CAT-09 | Consistencia de precio | Un producto en catálogo, detalle y carrito | El precio es el mismo en las tres pantallas |
| RN-CAT-10 | El orden no cambia el contenido | Se cambia de orden | La cantidad de productos sigue siendo 6 y no se pierde ni se duplica ninguno |

> **Ejemplo (caso de borde):** `PROJ-123-CP05 - Orden por precio con precios repetidos`. Resultado esperado: la lista de precios mostrada es exactamente `7.99, 9.99, 15.99, 15.99, 29.99, 49.99`.

### Comportamiento del usuario `problem_user`

El sitio demo hace que `problem_user` tenga defectos a propósito. Sirve para practicar la detección y el reporte de bugs.

| ID | Observación | Cómo usarla |
| :--- | :--- | :--- |
| RN-CAT-11 | Con `problem_user`, las imágenes de los productos no coinciden con cada producto (se repite la misma imagen) | Caso negativo: compararlo contra `standard_user` y reportar la diferencia |
| RN-CAT-12 | Con `problem_user`, al elegir un orden distinto del inicial la lista no se reordena (observado en el sitio demo) | Caso negativo: el resultado esperado es el de RN-CAT-03 a RN-CAT-07 (la lista se reordena); si no ocurre, es un defecto |

> **Atención:** estos defectos son **intencionales del sitio demo**, no un error del equipo. En un proyecto real un comportamiento así se reporta como bug. Siempre verificá el resultado observado antes de reportar.

### Pendiente de definir por el PO

| # | Tema | Por qué importa |
| :--- | :--- | :--- |
| 1 | Stock: qué pasa con un producto agotado | El sitio demo no maneja stock |
| 2 | Búsqueda y filtros por categoría | El sitio demo no los tiene |
| 3 | Paginación con más de 6 productos | No se puede diseñar el caso sin el límite por página |
| 4 | Orden de desempate en precios iguales | Afecta RN-CAT-06 y RN-CAT-07 |
| 5 | Moneda y formato de miles | Solo se observa `$` con dos decimales |
| 6 | Persistencia del orden elegido al navegar y volver | No está definido |

---

## Endpoints / Servicios

No aplica al sitio demo (no expone API documentada). En un proyecto real el equipo completa esta sección. **Pendiente de definir por el PO.**

---

## Validación en Base de Datos

El sitio demo no tiene base de datos accesible. En un proyecto real, ver `consultas-sql-qa.md`.

| Base / Esquema | Tabla | Qué validar |
| :--- | :--- | :--- |
| `tienda_qa` | `productos` | Cantidad de productos activos (6), nombre y precio de cada uno |

---

## Casos Borde y Escenarios de Error

- Dos productos con el mismo precio al ordenar por precio (RN-CAT-06 y RN-CAT-07).
- Cambiar de orden varias veces seguidas: la lista siempre tiene 6 productos.
- Abrir el detalle de un producto y volver: el catálogo se muestra sin perder los productos.
- Abrir el detalle de un producto que no existe (identificador inválido en la URL): **Pendiente de definir por el PO** qué se debe mostrar.
- Recargar la página con un orden elegido: **Pendiente de definir por el PO** si el orden se conserva.

---

## Dependencias

- Requiere sesión iniciada: ver [01-acceso](../01-acceso/reglas-negocio.md).
- Alimenta al carrito: ver [03-carrito](../03-carrito/reglas-negocio.md).
- En la plantilla de automatización: `pages/InventoryPage.ts` (se usa para llegar al catálogo y agregar productos; todavía no hay tests propios del catálogo: orden, detalle y precios son candidatos a automatizar).

---

## Datos de Prueba

| Dato | Valor |
| :--- | :--- |
| Usuario | `standard_user` (clave `secret_sauce`, sitio demo público) |
| Producto de referencia | Sauce Labs Backpack, $29.99 |
| Productos con precio repetido | Sauce Labs Bolt T-Shirt y Test.allTheThings() T-Shirt (Red), $15.99 |

> **Atención:** las credenciales son de un sitio demo público. En un proyecto real van en variables de entorno.

---

## Referencias

- Sitio demo: https://www.saucedemo.com/
- Módulo anterior: [01-acceso/reglas-negocio.md](../01-acceso/reglas-negocio.md)
- Módulo siguiente: [03-carrito/reglas-negocio.md](../03-carrito/reglas-negocio.md)
- Perfil del equipo: [05-equipos/alfa.md](../../../05-equipos/alfa.md)

---

## Changelog

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Documentación inicial: 6 productos, precios, opciones de orden, detalle y pendientes para el PO. |
