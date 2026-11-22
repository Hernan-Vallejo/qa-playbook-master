# Carrito (Visión Cliente) — Reglas de Negocio

> **Para qué sirve:** documenta cómo funciona el carrito de Tienda Demo: agregar y quitar productos, el contador del ícono del carrito y qué muestra la pantalla del carrito.
> **Quién lo usa:** QA del Equipo Alfa (responsable del módulo), QA del Equipo Beta (el checkout parte del carrito) y los agentes de Kiro al revisar HU de carrito.
> **Cuándo se usa:** al analizar una HU de carrito, al diseñar casos de agregar y quitar, al armar la automatización de `CartPage.ts` y `carrito.spec.ts`.

> **Equipo:** Alfa (catálogo y carrito)
> **Proyecto Jira:** `PROJ`
> **Estado de la doc:** Completa para el alcance del sitio demo. Los puntos marcados "Pendiente de definir por el PO" requieren confirmación.
> **Última actualización:** 2026-11-02

> **Nota sobre el origen de las reglas:** las reglas están **observadas en el sitio demo público** https://www.saucedemo.com/. En un proyecto real se confirman con el PO. Este módulo no tiene `consultas-sql-qa.md` porque el sitio demo no tiene base accesible y el carrito no se persiste en una tabla documentada.

---

## Descripción

El carrito reúne los productos que el comprador eligió antes de pagar. Se agrega desde el catálogo (o desde el detalle de un producto), se consulta desde el ícono del carrito y es el punto de partida del checkout.

---

## Actores y Permisos

| Actor / Rol | Permiso requerido | Qué puede hacer |
| :--- | :--- | :--- |
| Comprador con sesión | Sesión iniciada | Agregar, quitar y consultar su carrito, y continuar al checkout |

---

## Flujo Principal

1. El comprador agrega uno o más productos desde el catálogo.
2. El sistema actualiza el contador del ícono del carrito.
3. El comprador abre el carrito.
4. El sistema muestra los productos agregados con nombre, descripción y precio.
5. El comprador puede quitar productos, volver al catálogo o continuar al checkout.

---

## Reglas de Negocio

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-CAR-01 | Carrito inicial vacío | Sesión recién iniciada con `standard_user` | El ícono del carrito no muestra contador (equivale a 0) y la pantalla del carrito no lista productos |
| RN-CAR-02 | Agregar un producto | El comprador presiona el botón de agregar de un producto | El contador del carrito pasa a mostrar el número de productos agregados, y el botón de ese producto cambia a un botón de quitar |
| RN-CAR-03 | Contador del carrito | Se agregan N productos distintos (N entre 1 y 6) | El contador muestra exactamente N |
| RN-CAR-04 | Quitar desde el catálogo | El comprador presiona el botón de quitar de un producto agregado | El contador baja en 1 y el botón vuelve a ser el de agregar |
| RN-CAR-05 | Quitar desde el carrito | El comprador presiona quitar sobre un producto en la pantalla del carrito | El producto desaparece de la lista y el contador baja en 1 |
| RN-CAR-06 | Quitar el último producto | El carrito tiene 1 producto y se quita | El contador desaparece (0) y la lista queda vacía |
| RN-CAR-07 | Contenido del carrito | El comprador abre el carrito | Muestra solo los productos agregados, con el mismo nombre y precio que en el catálogo (ver RN-CAT-09) |
| RN-CAR-08 | Cantidad por producto | El comprador agrega un producto | La cantidad de ese producto es 1. El producto agregado no se puede agregar de nuevo: el botón pasa a ser de quitar |
| RN-CAR-09 | Persistencia al navegar | El comprador agrega productos y navega por el catálogo, el detalle y el carrito | El contador y el contenido se mantienen sin cambios |
| RN-CAR-10 | Seguir comprando | El comprador presiona "Continue Shopping" en el carrito | El sistema vuelve al catálogo y conserva los productos del carrito |
| RN-CAR-11 | Ir al checkout | El comprador presiona "Checkout" en el carrito | El sistema muestra el primer paso del checkout (ver [04-checkout](../04-checkout/reglas-negocio.md)) |
| RN-CAR-12 | Agregar desde el detalle | El comprador agrega desde la pantalla de detalle de un producto | El resultado es el mismo que en RN-CAR-02: contador actualizado y botón de quitar |

> **Ejemplo (caso de borde, nuevo: todavía no está en la plantilla):** `PROJ-102-CP04 - Contador con los 6 productos`. Precondición: sesión iniciada con `standard_user`. Pasos: agregar los 6 productos del catálogo. Resultado esperado: el contador del ícono muestra `6`.

> **Ejemplo (caso de la plantilla):** `PROJ-102-CP03 - Quitar el único producto deja el carrito sin contador`. Resultado esperado: el contador deja de mostrarse y la lista del carrito está vacía (RN-CAR-06).

### Comportamiento del usuario `problem_user`

| ID | Observación | Cómo usarla |
| :--- | :--- | :--- |
| RN-CAR-13 | Con `problem_user`, el sitio demo no cumple RN-CAR-02 y RN-CAR-04 para algunos productos: al presionar agregar o quitar, el contador o el botón no cambian (el producto afectado no está documentado: se registra al observarlo) | Caso negativo: el resultado esperado es el de RN-CAR-02 y RN-CAR-04; si no se cumple, es un defecto. Reportar el producto, la acción y el resultado observado, después de comparar con `standard_user` |

> **Atención:** el defecto es **intencional del sitio demo**. En un proyecto real se reporta como bug. Antes de reportar, repetí la prueba con `standard_user` para confirmar que la diferencia es del usuario.

### Pendiente de definir por el PO

| # | Tema | Por qué importa |
| :--- | :--- | :--- |
| 1 | Si el carrito se conserva después de cerrar sesión y volver a ingresar | Afecta casos de acceso y de carrito |
| 2 | Si un producto se puede agregar con cantidad mayor a 1 | El sitio demo no tiene selector de cantidad |
| 3 | Comportamiento del carrito vacío al presionar "Checkout" | El sitio demo permite avanzar, pero no está definido si es lo esperado |
| 4 | Límite máximo de productos en el carrito | No se puede diseñar el caso de borde sin el valor |
| 5 | Si el carrito se comparte entre pestañas del navegador | No está definido |

---

## Endpoints / Servicios

No aplica al sitio demo (no expone API documentada). En un proyecto real el equipo completa esta sección. **Pendiente de definir por el PO.**

---

## Estados

El carrito no tiene un ciclo de vida documentado. Se describe por su contenido:

| Estado | Significado | Se llega desde |
| :--- | :--- | :--- |
| Vacío | 0 productos, sin contador visible | Inicio de sesión, o quitar el último producto |
| Con productos | 1 a 6 productos, contador visible | Agregar un producto |

---

## Validación en Base de Datos

El sitio demo no tiene base de datos accesible. En un proyecto real, el carrito podría persistirse en una tabla como `carritos` (una fila por producto agregado, con `usuario_id`, `producto_id` y `cantidad`). **Pendiente de definir por el PO** si el carrito se guarda en servidor o solo en el navegador.

---

## Casos Borde y Escenarios de Error

- Agregar los 6 productos: el contador muestra 6.
- Agregar y quitar el mismo producto varias veces seguidas: el contador siempre coincide con los botones de quitar visibles.
- Recargar la página con productos en el carrito: **Pendiente de definir por el PO** si se conservan.
- Abrir el carrito sin productos y presionar "Checkout": **Pendiente de definir por el PO** el resultado esperado.
- Botón "atrás" del navegador desde el carrito: vuelve al catálogo y el contador se conserva.

---

## Dependencias

- Recibe productos de [02-catalogo](../02-catalogo/reglas-negocio.md).
- Alimenta a [04-checkout](../04-checkout/reglas-negocio.md).
- En la plantilla de automatización: `pages/CartPage.ts` y `tests/con-sesion/carrito.spec.ts`.

---

## Cobertura en la plantilla de automatización

Historia de ejemplo `PROJ-102` ("Agregar y quitar productos del carrito"), en `plantilla-automation/tests/con-sesion/carrito.spec.ts` (arranca con la sesión ya iniciada).

| Regla | Caso de prueba |
| :--- | :--- |
| RN-CAR-02 | `PROJ-102-CP01 - Agregar un producto actualiza el botón y el contador` |
| RN-CAR-07 | `PROJ-102-CP02 - El producto agregado aparece en el carrito` |
| RN-CAR-06 | `PROJ-102-CP03 - Quitar el único producto deja el carrito sin contador` |
| Resto de las reglas | Sin test automatizado todavía |

---

## Datos de Prueba

| Dato | Valor |
| :--- | :--- |
| Usuario | `standard_user` (clave `secret_sauce`, sitio demo público) |
| Producto de referencia | Sauce Labs Backpack ($29.99) |
| Segundo producto de referencia | Sauce Labs Bike Light ($9.99) |

> **Atención:** las credenciales son de un sitio demo público. En un proyecto real van en variables de entorno.

---

## Referencias

- Sitio demo: https://www.saucedemo.com/
- Módulo anterior: [02-catalogo/reglas-negocio.md](../02-catalogo/reglas-negocio.md)
- Módulo siguiente: [04-checkout/reglas-negocio.md](../04-checkout/reglas-negocio.md)
- Perfil del equipo: [05-equipos/alfa.md](../../../05-equipos/alfa.md)

---

## Changelog

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Documentación inicial: agregar, quitar, contador, persistencia y pendientes para el PO. |
