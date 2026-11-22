---
inclusion: manual
name: contexto-negocio
description: Mapa maestro del negocio de Tienda Demo para QA. Índice de todas las áreas, sus equipos, el proyecto de Jira y el documento de reglas de negocio de cada módulo. Activar para ubicar un módulo o saber a qué equipo pertenece antes de analizar una historia.
---
# Mapa maestro del negocio de Tienda Demo — índice QA

> **Para qué sirve:** es un **índice general** del negocio para QA. Permite ubicar cualquier módulo: qué hace, qué equipo lo atiende, en qué proyecto de Jira se gestiona y dónde está su documento de reglas de negocio.
> **Quién lo usa:** QA de todos los equipos y los agentes de Kiro (`qa-maestro`, `qa-sprint`, `qa-sdd`) cuando necesitan ubicar un módulo antes de revisar una historia.
> **Cuándo se usa:** al recibir una HU (historia de usuario) de un módulo que no conocés, o cuando una HU toca más de un módulo y hay que saber a quién consultar.

> **Cómo se usa:** buscá el módulo en la tabla de la sección 2. Te lleva al equipo responsable y al documento de reglas. Si necesitás más profundidad (contrato de servicios, bugs históricos, inventario de tests), el equipo arma una "foto" dedicada del módulo, como se hizo con el ejemplo SDD de `vision-cliente/05-pedidos-sdd/`.
>
> **Mantenimiento (anti-desactualización):** este índice es una foto manual. Jira y el repositorio documental del equipo son las fuentes vivas. Al usarlo, verificá que el módulo y el documento sigan vigentes. Si encontrás un dato desactualizado, corregilo por Pull Request (PR).
>
> **Última actualización:** 2026-11-02.

---

## 1. Qué es Tienda Demo

**Tienda Demo** es una tienda online de ejemplo, inspirada en el sitio demo público SauceDemo (https://www.saucedemo.com/). Permite que un comprador ingrese con su usuario, vea un catálogo de productos, arme un carrito y complete una compra. Es el producto bajo prueba de este playbook.

El producto se organiza por **módulos** (acceso, catálogo, carrito, checkout, pedidos). Cada módulo lo atiende un **equipo** de desarrollo con su propio QA.

> **Nota:** "la empresa" (o "Acme") es la organización ficticia dueña del producto. Los nombres de equipos, proyectos y tableros de este playbook son ejemplos genéricos.

---

## 2. Mapa de módulos ↔ equipo ↔ proyecto Jira ↔ documentación

| Módulo / Funcionalidad | Equipo | Proyecto Jira | Documento de reglas de negocio |
| :--- | :--- | :--- | :--- |
| Acceso (login, usuarios bloqueados) | Equipo Gamma | `PROJ` | [01-acceso/reglas-negocio.md](./vision-cliente/01-acceso/reglas-negocio.md) |
| Catálogo (inventario, detalle, orden) | Equipo Alfa | `PROJ` | [02-catalogo/reglas-negocio.md](./vision-cliente/02-catalogo/reglas-negocio.md) |
| Carrito (agregar, quitar, contador) | Equipo Alfa | `PROJ` | [03-carrito/reglas-negocio.md](./vision-cliente/03-carrito/reglas-negocio.md) |
| Checkout (datos del comprador, resumen, confirmación) | Equipo Beta | `PROJ` | [04-checkout/reglas-negocio.md](./vision-cliente/04-checkout/reglas-negocio.md) |
| Pedidos y seguimiento (SDD) | Equipo Delta | `PROJ` | [05-pedidos-sdd/reglas-negocio.md](./vision-cliente/05-pedidos-sdd/reglas-negocio.md) |
| Administración de la tienda | Pendiente de definir por el PO | `PROJ` | [vision-administracion/reglas-negocio.md](./vision-administracion/reglas-negocio.md) |

> **Nota:** en el ejemplo, todos los equipos usan el mismo proyecto de Jira (`PROJ`) y se distinguen por la **etiqueta** del equipo (`alfa`, `beta`, `gamma`, `delta`). Las tareas de automatización van en el proyecto `AUTO`. Cada equipo puede tener su propio proyecto: se define en su perfil de [05-equipos/](../05-equipos/indice-equipos.md).

---

## 3. Herramientas del equipo de QA

| Necesidad | Herramienta (ejemplo) | Cómo se accede desde Kiro |
| :--- | :--- | :--- |
| Historias, bugs y tareas | Jira | Servidor MCP `@atlassian` |
| Casos, test sets y test plans | Xray (complemento de Jira) | Servidor MCP `@atlassian` |
| Repositorio y CI/CD | GitHub + GitHub Actions | Servidor MCP `@github` |
| Diseño de pantallas | Figma (opcional) | Servidor MCP `@figma` |

> **Nota:** MCP (Model Context Protocol) es el mecanismo que permite a Kiro conectarse a herramientas externas. Cada herramienta se accede con su servidor MCP.

---

## 4. Ambientes

| Ambiente | Para qué se usa | Regla |
| :--- | :--- | :--- |
| QA | Pruebas funcionales y de automatización | URL de ejemplo: https://www.saucedemo.com/ |
| PRE (preproducción) | Validación previa al pase a producción | Solo con acuerdo del equipo |
| PROD (producción) | Uso real | **Nunca se prueba en PROD** |

---

## 5. Áreas críticas (priorizar al probar)

Si algo de esto falla, el impacto es alto:

- **Acceso:** que solo ingresen usuarios habilitados y que el usuario bloqueado no pueda entrar.
- **Importes:** que el precio de cada producto, el subtotal, el impuesto y el total sean consistentes entre pantallas.
- **Carrito:** que el contador y el contenido coincidan siempre.
- **Checkout:** que los datos requeridos se validen y que la compra solo se confirme una vez.

> **Ejemplo:** si el total del resumen no coincide con la suma de los productos más el impuesto, es un defecto de alta criticidad aunque la compra termine "bien".

---

## 6. Qué hacer si el módulo no está en este índice

1. Preguntale al QA del equipo o al PO.
2. Documentá el módulo con la [plantilla de reglas de negocio](./plantilla-reglas-negocio.md).
3. Agregá la fila en la tabla de la sección 2 y subí el cambio por Pull Request.
