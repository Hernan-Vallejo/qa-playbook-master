# Glosario — Módulo Pedidos y seguimiento

> **Para qué sirve:** define los términos del dominio de pedidos y de SDD, para que todos usen el mismo significado y los casos no se interpreten distinto.
> **Quién lo usa:** QA, PO y desarrollo del Equipo Delta; también quien se incorpora al equipo.
> **Cuándo se usa:** cuando aparece un término que no está claro, o al escribir una spec o un caso y hay que elegir un nombre único para un concepto.

| Término | Definición |
| :--- | :--- |
| Pedido | Registro que se crea al confirmar una compra en el checkout. Tiene número, comprador, ítems, importes y estado |
| Ítem del pedido | Cada producto comprado, con su cantidad y el precio unitario al momento de la compra |
| Número de pedido | Identificador único del pedido (formato de ejemplo `PED-0001`; el formato real es Pendiente de definir por el PO) |
| Estado del pedido | Etapa en la que está el pedido. Modelo de ejemplo: `CREADO`, `EN_PREPARACION`, `ENVIADO`, `ENTREGADO`, `CANCELADO` |
| Estado final | Estado desde el cual el pedido ya no cambia (`ENTREGADO` o `CANCELADO` en el modelo de ejemplo) |
| Subtotal | Suma de cantidad por precio unitario de todos los ítems (en el checkout: "Item total") |
| Impuesto | Importe que se suma al subtotal. En el sitio demo es el 8% del subtotal, redondeado a dos decimales |
| Total | Subtotal más impuesto |
| Checkout | Proceso de pago y confirmación de la compra, en tres pasos |
| Comprador | Persona que ingresa a la tienda y compra |
| SDD (Spec-Driven Development) | Desarrollo guiado por especificaciones: antes de programar se escribe una spec revisable |
| Spec | Conjunto de documentos (`requirement.md`, `design.md`, `tasks.md`) que describe una HU antes de implementarla |
| HU (historia de usuario) | Descripción de una necesidad del usuario, con criterios de aceptación. Ejemplo: PROJ-142 |
| Épica | Conjunto de historias relacionadas. Ejemplo: PROJ-40 "Pedidos y seguimiento" |
| Criterio de aceptación | Condición verificable que debe cumplirse. Formato: "Cuando [pasa esto], el sistema debe [hacer aquello]" |
| DoR (Definition of Ready) | Condiciones que debe cumplir una HU para empezar a desarrollarse |
| DoD (Definition of Done) | Condiciones que debe cumplir una HU para darse por terminada |
| PO (Product Owner) | Responsable del producto. Responde las preguntas funcionales |
| BFF (Backend for Frontend) | Servicio intermedio entre la pantalla y los servicios de fondo |
| Pendiente de definir por el PO | Marca que indica que el dato no está definido y no se debe suponer |
