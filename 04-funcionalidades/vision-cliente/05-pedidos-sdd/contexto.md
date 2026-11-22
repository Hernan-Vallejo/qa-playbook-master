# Módulo: Pedidos y seguimiento (ejemplo SDD)

> **Para qué sirve:** es el contexto estable del módulo "Pedidos y seguimiento" de Tienda Demo. Es el **ejemplo de documentación para un equipo que trabaja con SDD** (Spec-Driven Development, desarrollo guiado por especificaciones): antes de programar se escribe una especificación (spec) revisable, y QA la revisa y deriva casos y datos de ella.
> **Quién lo usa:** QA del Equipo Delta (trabaja con SDD) y los agentes `qa-sdd` y sus skills (`qa-sdd-revision-spec`, `qa-sdd-plan-datos`, `qa-sdd-cobertura-dev`, `qa-sdd-fwt`).
> **Cuándo se usa:** al empezar a trabajar una HU (historia de usuario) del módulo, para tener el conocimiento funcional reutilizable sin releerlo cada vez.

> **Atención:** este módulo es un **ejemplo ficticio** que extiende Tienda Demo. El sitio demo SauceDemo **no tiene pedidos ni seguimiento**. Todo lo que no se pueda afirmar figura como **"Pendiente de definir por el PO"**. Los nombres de servicios son de ejemplo.

## Descripción

El módulo permite que el comprador, después de confirmar una compra en el [checkout](../04-checkout/reglas-negocio.md), consulte sus pedidos y vea el estado de cada uno. Cada compra confirmada genera un pedido.

## Servicios involucrados (ejemplo)

| Servicio | Responsabilidad |
| :--- | :--- |
| `pedidos-back` | Guarda los pedidos y sus estados. Expone la consulta de un pedido |
| `tienda-bff` | Orquesta la pantalla con los servicios (BFF: Backend for Frontend, servicio intermedio para el front) |
| `tienda-ui` | Pantalla del comprador |

> **Nota:** en un proyecto real, el equipo reemplaza esta tabla por sus servicios y repositorios reales. Los nombres de acá son ficticios. **Pendiente de definir por el PO** y el equipo de desarrollo.

## Integraciones externas (ejemplo)

| Proveedor | Para qué | Estado |
| :--- | :--- | :--- |
| Servicio de logística | Informa los cambios de estado de envío | Pendiente de definir por el PO |

## Modo de trabajo SDD

En el Equipo Delta, cada HU tiene una **spec** compuesta por tres documentos que escribe desarrollo antes de implementar:

| Documento de la spec | Contenido |
| :--- | :--- |
| `requirement.md` | Qué se pide: criterios de aceptación en formato "Cuando [pasa esto], el sistema debe [hacer aquello]" |
| `design.md` | Cómo se resuelve: diseño técnico, contratos y datos |
| `tasks.md` | Pasos de implementación |

QA revisa la spec **antes** de que se programe (ver `01-estandares-globales/definicion-dor-dod-sdd.md`), plantea preguntas al PO y deriva de ella los casos y los datos de prueba. Las preguntas pendientes de cada HU quedan en su archivo `preguntas-abiertas.md`.

## Documentos de esta carpeta

| Documento | Contenido |
| :--- | :--- |
| [reglas-negocio.md](./reglas-negocio.md) | Reglas de negocio de Pedidos y seguimiento |
| [datos-prueba.md](./datos-prueba.md) | Datos de prueba reutilizables del módulo |
| [glosario.md](./glosario.md) | Términos del dominio |
| `epicas/` | Contexto de cada épica. Ejemplo: [PROJ-40](./epicas/proj-40-seguimiento-de-pedidos/contexto.md) |
| `historias/` | Contexto de historias puntuales. Ejemplo: [PROJ-142](./historias/proj-142-consultar-estado-pedido/contexto.md) |

> **Nota:** los contratos de los servicios (Swagger u OpenAPI) no se guardan en esta carpeta: se piden al equipo en su versión vigente o se leen del repositorio del servicio.

## Referencias

- Contexto de negocio general: [contexto-funcionalidades.md](../../contexto-funcionalidades.md)
- Reglas de negocio: [reglas-negocio.md](./reglas-negocio.md)
- Perfil del equipo: [05-equipos/delta.md](../../../05-equipos/delta.md)
