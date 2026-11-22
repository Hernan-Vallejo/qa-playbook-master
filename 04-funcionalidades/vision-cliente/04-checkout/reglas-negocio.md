# Checkout (Visión Cliente) — Reglas de Negocio

> **Para qué sirve:** documenta el checkout de Tienda Demo: los datos del comprador y sus validaciones (con los mensajes exactos), el resumen de la compra con subtotal, impuesto y total, y la confirmación final.
> **Quién lo usa:** QA del Equipo Beta (responsable del módulo) y los agentes de Kiro al revisar HU de checkout o pagos. Es la zona de mayor impacto del producto.
> **Cuándo se usa:** al analizar una HU de checkout, al diseñar casos de validación de campos, al armar la automatización de `CheckoutPage.ts`, `checkout.spec.ts` y `compra.spec.ts`.

> **Equipo:** Beta (checkout y pagos)
> **Proyecto Jira:** `PROJ`
> **Estado de la doc:** Completa para el alcance del sitio demo. Los puntos marcados "Pendiente de definir por el PO" requieren confirmación.
> **Última actualización:** 2026-11-02
> **Documento complementario:** `consultas-sql-qa.md` (consultas SELECT de ejemplo).

> **Nota sobre el origen de las reglas:** las reglas están **observadas en el sitio demo público** https://www.saucedemo.com/. En un proyecto real se confirman con el PO. El checkout mueve importes: es un **área crítica** del producto.

---

## Descripción

El checkout lleva al comprador desde el carrito hasta la confirmación de la compra en tres pasos: (1) datos del comprador, (2) resumen de la compra, (3) confirmación. El sitio demo no cobra de verdad: muestra un medio de pago y un envío fijos.

---

## Actores y Permisos

| Actor / Rol | Permiso requerido | Qué puede hacer |
| :--- | :--- | :--- |
| Comprador con sesión | Sesión iniciada y carrito con productos | Completar sus datos, revisar el resumen y finalizar la compra |

---

## Flujo Principal

1. Desde el carrito, el comprador presiona "Checkout".
2. **Paso 1 (datos del comprador):** completa nombre, apellido y código postal, y presiona "Continue".
3. **Paso 2 (resumen):** el sistema muestra los productos, el medio de pago, el envío y los importes. El comprador presiona "Finish".
4. **Paso 3 (confirmación):** el sistema muestra el mensaje de compra confirmada. El comprador vuelve al catálogo con "Back Home".

---

## Reglas de Negocio

### Paso 1: datos del comprador

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-CHK-01 | Campos del paso 1 | El comprador llega al paso 1 | Muestra tres campos: nombre (First Name), apellido (Last Name) y código postal (Zip/Postal Code) |
| RN-CHK-02 | Nombre requerido | Se presiona "Continue" con el nombre vacío | El sistema permanece en el paso 1 y muestra el mensaje exacto: `Error: First Name is required` |
| RN-CHK-03 | Apellido requerido | Nombre completo y apellido vacío | El sistema permanece en el paso 1 y muestra el mensaje exacto: `Error: Last Name is required` |
| RN-CHK-04 | Código postal requerido | Nombre y apellido completos, código postal vacío | El sistema permanece en el paso 1 y muestra el mensaje exacto: `Error: Postal Code is required` |
| RN-CHK-05 | Orden de validación | Los tres campos vacíos | Se muestra primero el mensaje del nombre (RN-CHK-02). Al completarlo, el del apellido (RN-CHK-03). Al completarlo, el del código postal (RN-CHK-04) |
| RN-CHK-06 | Datos completos | Nombre "Ana", apellido "Prueba" y código postal "1000" | El sistema avanza al paso 2 (resumen) |
| RN-CHK-07 | Cancelar | El comprador presiona "Cancel" en el paso 1 | El sistema vuelve al carrito y conserva sus productos |
| RN-CHK-08 | Cierre del mensaje de error | Hay un mensaje de error visible y se presiona la "x" | El mensaje desaparece |

> **Ejemplo (caso negativo):** `PROJ-103-CP02 - Apellido vacío muestra error de campo requerido`. Precondición: carrito con un producto y paso 1 abierto. Pasos: completar nombre "Ana", dejar el apellido vacío y código postal "1000", presionar "Continue". Resultado esperado: se muestra `Error: Last Name is required` y el sistema sigue en el paso 1.

### Paso 2: resumen de la compra

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-CHK-09 | Productos del resumen | El comprador llega al paso 2 | Lista exactamente los productos del carrito, con nombre, precio y cantidad |
| RN-CHK-10 | Subtotal | Paso 2 abierto | El "Item total" es la suma de los precios de los productos del carrito |
| RN-CHK-11 | Impuesto | Paso 2 abierto | El impuesto ("Tax") se muestra con dos decimales. En el sitio demo equivale al 8% del subtotal, redondeado a dos decimales. **Pendiente de definir por el PO** la regla de impuesto de un producto real |
| RN-CHK-12 | Total | Paso 2 abierto | El "Total" es el subtotal más el impuesto |
| RN-CHK-13 | Medio de pago y envío | Paso 2 abierto | El sitio demo muestra un medio de pago fijo y un envío fijo. **Pendiente de definir por el PO** las opciones reales |
| RN-CHK-14 | Cancelar en el resumen | El comprador presiona "Cancel" en el paso 2 | El sistema vuelve al catálogo y conserva los productos del carrito |

> **Ejemplo (verificación de importes):** carrito con Sauce Labs Backpack ($29.99) y Sauce Labs Bike Light ($9.99). Subtotal esperado: $39.98. Impuesto esperado (8%): $3.20. Total esperado: $43.18.

### Paso 3: confirmación

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-CHK-15 | Compra confirmada | El comprador presiona "Finish" en el paso 2 | El sistema muestra el encabezado `Thank you for your order!` |
| RN-CHK-16 | Carrito luego de comprar | Se vuelve al catálogo con "Back Home" | El contador del carrito no se muestra (carrito vacío) |
| RN-CHK-17 | Compra única | Se presiona "Finish" una sola vez | Se registra una única compra. Solo se puede verificar en un proyecto con base de datos (consulta 4 de `consultas-sql-qa.md`): el sitio demo no guarda pedidos. **Pendiente de definir por el PO** cómo se previene el doble envío |

### Pendiente de definir por el PO

| # | Tema | Por qué importa |
| :--- | :--- | :--- |
| 1 | Largo máximo y caracteres permitidos en nombre, apellido y código postal | El sitio demo no valida formato: acepta cualquier texto. No se pueden diseñar casos de formato inválido sin la regla |
| 2 | Formato del código postal | Ídem |
| 3 | Qué hacer si se hace checkout con el carrito vacío | El sitio demo deja avanzar |
| 4 | Medios de pago y costos de envío reales | El sitio demo tiene valores fijos |
| 5 | Regla de impuestos y redondeo | Solo se observa 8% |
| 6 | Número de pedido y comprobante | El sitio demo no los genera |
| 7 | Mensajes ante falla de pago o del servicio | El sitio demo no tiene esos escenarios |

---

## Endpoints / Servicios

No aplica al sitio demo (no expone API documentada). En un proyecto real el equipo completa esta sección. **Pendiente de definir por el PO.**

---

## Estados

El sitio demo no muestra estados de una compra. En un proyecto real, la compra confirmada genera un pedido (ver [05-pedidos-sdd](../05-pedidos-sdd/reglas-negocio.md)).

| Paso | Pantalla | Salida |
| :--- | :--- | :--- |
| 1 | Datos del comprador | "Continue" → paso 2. "Cancel" → carrito |
| 2 | Resumen | "Finish" → paso 3. "Cancel" → catálogo |
| 3 | Confirmación | "Back Home" → catálogo |

---

## Validación en Base de Datos

El sitio demo no tiene base de datos accesible. En un proyecto real, ver `consultas-sql-qa.md` para verificar el pedido y sus importes en `pedidos` y `pedido_items` de la base ficticia `tienda_qa`.

---

## Casos Borde y Escenarios de Error

- Los tres campos vacíos: se muestra `Error: First Name is required`.
- Solo el código postal vacío: se muestra `Error: Postal Code is required`.
- Campos con solo espacios: **Pendiente de definir por el PO**.
- Campos con caracteres especiales o muy largos: **Pendiente de definir por el PO**.
- Cancelar y volver a entrar al checkout: si los campos conservan lo escrito o se limpian es **Pendiente de definir por el PO**.
- Recargar a mitad del flujo: si se conserva el paso, los datos y el carrito es **Pendiente de definir por el PO**.
- Presionar "Finish" dos veces seguidas: debe generarse una sola compra (RN-CHK-17).
- Un solo producto con precio mínimo (Sauce Labs Onesie, $7.99): el resumen debe mostrar `Item total: $7.99`, `Tax: $0.64` y `Total: $8.63` (8% de 7.99 = 0.6392, redondeado a 0.64).
- Un solo producto de referencia (Sauce Labs Backpack, $29.99): `Item total: $29.99`, `Tax: $2.40` y `Total: $32.39` (8% de 29.99 = 2.3992, redondeado a 2.40).

---

## Dependencias

- Parte del carrito: [03-carrito](../03-carrito/reglas-negocio.md).
- Genera un pedido para [05-pedidos-sdd](../05-pedidos-sdd/reglas-negocio.md).
- En la plantilla de automatización: `pages/CheckoutPage.ts`, `data/comprador.ts`, `tests/con-sesion/checkout.spec.ts` y `tests/sin-sesion/compra.spec.ts`.

---

## Cobertura en la plantilla de automatización

Historias de ejemplo `PROJ-103` ("Completar los datos del comprador", en `tests/con-sesion/checkout.spec.ts`) y `PROJ-104` ("Comprar un producto", en `tests/sin-sesion/compra.spec.ts`).

| Regla | Caso de prueba |
| :--- | :--- |
| RN-CHK-02 | `PROJ-103-CP01 - Nombre vacío muestra error de campo requerido` |
| RN-CHK-03 | `PROJ-103-CP02 - Apellido vacío muestra error de campo requerido` |
| RN-CHK-04 | `PROJ-103-CP03 - Código postal vacío muestra error de campo requerido` |
| RN-CHK-06, RN-CHK-09 y RN-CHK-10 (con un producto) | `PROJ-103-CP04 - Datos completos muestran el resumen con el total del producto` |
| RN-CHK-15 | `PROJ-104-CP01 - Compra exitosa de un producto` |
| Resto de las reglas | Sin test automatizado todavía |

---

## Datos de Prueba

| Dato | Valor |
| :--- | :--- |
| Usuario | `standard_user` (clave `secret_sauce`, sitio demo público) |
| Comprador ficticio | Nombre "Ana", apellido "Prueba" |
| Código postal | "1000" |
| Carrito de referencia | Sauce Labs Backpack ($29.99) y Sauce Labs Bike Light ($9.99) |

> **Atención:** solo datos ficticios. Nunca datos reales de clientes ni medios de pago reales.

---

## Referencias

- Sitio demo: https://www.saucedemo.com/
- Módulo anterior: [03-carrito/reglas-negocio.md](../03-carrito/reglas-negocio.md)
- Perfil del equipo: [05-equipos/beta.md](../../../05-equipos/beta.md)

---

## Changelog

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Documentación inicial: datos del comprador, mensajes exactos, resumen de importes, confirmación y pendientes para el PO. |
