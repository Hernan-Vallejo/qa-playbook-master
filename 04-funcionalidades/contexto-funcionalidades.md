# Contexto de Funcionalidades — Tienda Demo

> **Para qué sirve:** da la visión general del producto bajo prueba (**Tienda Demo**), de sus pantallas, actores, canales y de cómo está organizada la carpeta `04-funcionalidades/`. Es el punto de partida para ubicar cualquier funcionalidad.
> **Quién lo usa:** QA (funcional y automatización), Kiro y sus agentes cuando necesitan entender el contexto del producto antes de analizar una historia (HU, historia de usuario).
> **Cuándo se usa:** al empezar a trabajar con el producto, al incorporarse a un equipo y cada vez que una HU toca un módulo que todavía no conocés.

> **Documentos relacionados:**
> - [contexto-negocio.md](./contexto-negocio.md): índice maestro del negocio (áreas, equipos, proyecto Jira y documento de reglas de cada módulo). Empezá ahí para ubicar un módulo.
> - [plantilla-reglas-negocio.md](./plantilla-reglas-negocio.md): plantilla para documentar las reglas de un módulo nuevo.
> - [vision-cliente/05-pedidos-sdd/](./vision-cliente/05-pedidos-sdd/contexto.md): ejemplo completo de documentación para un equipo que trabaja con SDD (Spec-Driven Development, desarrollo guiado por especificaciones).

> **Nota sobre los datos de este documento:** Tienda Demo es un producto **genérico de ejemplo**, inspirado en el sitio demo público SauceDemo (https://www.saucedemo.com/). Donde una regla se observa en el sitio demo se indica. Donde el sitio demo no permite afirmar algo, figura como **"Pendiente de definir por el PO"** (PO = Product Owner, responsable del producto). En un proyecto real, esos puntos se confirman con el PO antes de diseñar casos de prueba. Nunca se suponen.

## Visión General

**Tienda Demo** es una tienda online simple. Un comprador entra con su usuario, mira el catálogo de productos, arma un carrito y completa una compra en el checkout (el proceso de pago y confirmación). Para esta guía alcanza para practicar todo el ciclo de QA: reglas de negocio, casos positivos, negativos y de borde, automatización de front y SDD.

El producto se organiza en **visiones**, que representan la perspectiva de cada tipo de actor.

| Visión | Carpeta | Descripción |
| :--- | :--- | :--- |
| **Visión Cliente** | `vision-cliente/` | Todo lo que hace el comprador: ingresar, ver el catálogo, usar el carrito, pagar y consultar sus pedidos |
| **Visión Administración** | `vision-administracion/` | Lo que haría el personal interno de la tienda (gestión de productos y pedidos). El sitio demo no tiene esta visión: queda como **Pendiente de definir por el PO** |

## Funcionalidades de la Visión Cliente

| # | Funcionalidad | Carpeta | Equipo | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| 01 | Acceso | `vision-cliente/01-acceso/` | Equipo Gamma | Login, usuarios bloqueados, cierre de sesión |
| 02 | Catálogo | `vision-cliente/02-catalogo/` | Equipo Alfa | Inventario de 6 productos, detalle, orden A-Z / Z-A / precio |
| 03 | Carrito | `vision-cliente/03-carrito/` | Equipo Alfa | Agregar, quitar, contador del carrito |
| 04 | Checkout | `vision-cliente/04-checkout/` | Equipo Beta | Datos del comprador, resumen de la compra, confirmación |
| 05 | Pedidos y seguimiento | `vision-cliente/05-pedidos-sdd/` | Equipo Delta (SDD) | Consultar el estado de un pedido. Ejemplo de documentación SDD |

> **Nota:** el equipo responsable de cada módulo está en [05-equipos/indice-equipos.md](../05-equipos/indice-equipos.md). Si una HU toca varios módulos, coordinan los QA de ambos equipos.

## Stack tecnológico (genérico)

Este playbook no depende de una tecnología puntual del producto. Para la automatización, la referencia es la plantilla incluida (`plantilla-automation/`).

| Capa | Tecnología de referencia |
| :--- | :--- |
| Frontend | Aplicación web (SPA, página de una sola carga) servida desde el ambiente de QA |
| Backend | Servicios REST. En un proyecto real, el equipo documenta acá sus servicios |
| Base de datos | Relacional. Para los ejemplos de consultas se usa la base ficticia `tienda_qa` (tablas `usuarios`, `productos`, `carritos`, `pedidos`, `pedido_items`) |
| Pruebas de front | Playwright con Page Object Model (POM, patrón que separa "cómo interactuar" de "qué se espera"), con y sin sesión iniciada |
| Pruebas de API | Ejemplo con Playwright (`tests/api/` de la plantilla); el equipo puede sumar Karate u otro framework |

> **Nota:** el sitio demo SauceDemo es solo front: **no tiene base de datos accesible ni API documentada**. Las consultas SQL de este playbook son un modelo para un proyecto real.

## Ambientes

| Ambiente | Uso | URL de ejemplo |
| :--- | :--- | :--- |
| QA | Se prueba acá | https://www.saucedemo.com/ (sitio demo público). En un proyecto real: `https://qa.example.com`. En la plantilla de automatización se elige con `TEST_ENV` (`demo` por defecto; `qa` y `pre` traen URLs de ejemplo que se reemplazan por las reales) |
| PRE (preproducción) | Validación final previa a producción | Por completar por el equipo |
| PROD (producción) | Uso real de los clientes | **Nunca se prueba en PROD** |

## Actores Involucrados

| Actor | Descripción |
| :--- | :--- |
| **Comprador** | Persona que ingresa a la tienda, arma el carrito y compra. En el sitio demo se representa con usuarios de prueba |
| **Comprador bloqueado** | Usuario al que se le impide ingresar. En el sitio demo: `locked_out_user` |
| **Administrador de la tienda** | Personal interno. **Pendiente de definir por el PO** (el sitio demo no lo tiene) |

### Usuarios de prueba del sitio demo

| Usuario | Clave | Para qué sirve |
| :--- | :--- | :--- |
| `standard_user` | `secret_sauce` | Usuario normal: camino feliz |
| `locked_out_user` | `secret_sauce` | Usuario bloqueado: no puede ingresar |
| `problem_user` | `secret_sauce` | Usuario con comportamientos defectuosos a propósito: sirve para practicar la detección de defectos |

> **Atención:** estas credenciales son **públicas y pertenecen a un sitio demo**. En un proyecto real las credenciales **no se escriben en archivos**: se piden al QA en la sesión y se usan por variables de entorno (`QA_USER`, `QA_PASSWORD`).

## Flujo general de compra

```text
Login → Catálogo (inventario) → Agregar productos → Carrito → Checkout (datos del comprador)
      → Resumen de la compra → Finalizar → Confirmación de la compra
```

Cada paso depende del anterior. Un fallo temprano (por ejemplo, el login) bloquea todo el flujo. Por eso conviene probar primero el login y después los módulos siguientes.

## Estructura de este directorio

```text
04-funcionalidades/
├── contexto-funcionalidades.md       ← Este archivo
├── contexto-negocio.md               ← Índice maestro del negocio
├── plantilla-reglas-negocio.md       ← Plantilla para documentar un módulo
│
├── vision-cliente/
│   ├── 01-acceso/                    reglas-negocio.md, consultas-sql-qa.md
│   ├── 02-catalogo/                  reglas-negocio.md, consultas-sql-qa.md
│   ├── 03-carrito/                   reglas-negocio.md
│   ├── 04-checkout/                  reglas-negocio.md, consultas-sql-qa.md
│   └── 05-pedidos-sdd/               ejemplo SDD (contexto, reglas, datos, glosario, épicas e historias)
│
└── vision-administracion/            reglas-negocio.md
```

## Cómo se documenta cada módulo

Cada carpeta de funcionalidad contiene, como mínimo:

| Archivo | Contenido |
| :--- | :--- |
| `reglas-negocio.md` | Reglas concretas y verificables del módulo (mensajes exactos, valores, estados) |
| `consultas-sql-qa.md` | (Si aplica) consultas de solo lectura para verificar datos en la base de QA |

> **Ejemplo:** para probar el bloqueo de usuarios, el QA lee `01-acceso/reglas-negocio.md` (regla RN-ACC-03: mensaje exacto) y, si el proyecto tiene base de datos, `01-acceso/consultas-sql-qa.md` para verificar el estado del usuario.

## Reglas generales de documentación

- Los criterios se escriben como **"Cuando [pasa esto], el sistema debe [hacer aquello]"**.
- Se evitan palabras no verificables ("rápido", "adecuado", "válido", "intuitivo"). Si aparecen, se pide el número o la regla concreta.
- Si la historia o el documento no dicen algo, **no se supone**: queda como pregunta para el PO.
- Los mensajes de error se escriben con el **texto exacto**, tal como los muestra el sistema.
- Las consultas SQL son **solo SELECT**.
