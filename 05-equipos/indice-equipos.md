# Índice de Equipos

> **Para qué sirve:** lista los equipos de QA del playbook, su proyecto de Jira, su modalidad de trabajo y el enlace a su perfil. Es la tabla que Kiro consulta para saber a qué equipo pertenece una historia.
> **Quién lo usa:** los agentes de Kiro (`qa-maestro`, `qa-sdd`, `qa-sprint`, ...) y cualquier QA que necesite ubicar el perfil de un equipo.
> **Cuándo se usa:** al empezar a trabajar una HU (historia de usuario), una subtarea o un bug, y al incorporar un equipo nuevo.

Kiro identifica el equipo por el **proyecto de Jira** de la clave de la HU, subtarea o bug y, cuando varios equipos comparten proyecto (como en este ejemplo), por la **etiqueta del equipo** que lleva la HU; después lee su perfil. Si la HU no tiene etiqueta o el equipo no está en esta tabla, pregunta al QA.

> **Nota:** los equipos de este playbook son un **ejemplo genérico** para el producto Tienda Demo. En un proyecto real, cada organización reemplaza esta tabla por sus equipos.

| Equipo | Etiqueta | Proyecto Jira | Board | QA | Módulos que atiende | Perfil |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Equipo Alfa | `alfa` | `PROJ` | Por completar | Por completar | Catálogo y carrito | [alfa.md](./alfa.md) |
| Equipo Beta | `beta` | `PROJ` | Por completar | Por completar | Checkout y pagos | [beta.md](./beta.md) |
| Equipo Gamma | `gamma` | `PROJ` | Por completar | Por completar | Cuenta y acceso (login) | [gamma.md](./gamma.md) |
| Equipo Delta | `delta` | `PROJ` | Por completar | Por completar | Pedidos y seguimiento (SDD) | [delta.md](./delta.md) |

> **Nota:** los cuatro equipos comparten el proyecto `PROJ` y se distinguen por su **etiqueta** (`alfa`, `beta`, `gamma`, `delta`): con solo la clave `PROJ-123` no alcanza para saber el equipo, hay que mirar la etiqueta de la HU. Las tareas de automatización de todos los equipos van en el proyecto `AUTO`.

Cada perfil indica su **Modalidad de trabajo**:

| Modalidad | Agente de Kiro | Qué significa |
| :--- | :--- | :--- |
| `Funcional` | `qa-maestro` | El equipo trabaja con historias y criterios de aceptación tradicionales |
| `SDD` | `qa-sdd` | SDD (*Spec-Driven Development*, desarrollo guiado por especificaciones): desarrollo escribe la spec antes de programar y QA la revisa |

Hoy el único equipo SDD es el **Equipo Delta**. Alfa, Beta y Gamma son funcionales.

Los nombres de archivo van en minúsculas por la convención del repositorio (`CONTRIBUTING.md`). El nombre del equipo, con mayúscula inicial, está en el título de cada perfil.

## Mapa de módulos por equipo

| Módulo | Documentación | Equipo |
| :--- | :--- | :--- |
| Acceso | [01-acceso](../04-funcionalidades/vision-cliente/01-acceso/reglas-negocio.md) | Gamma |
| Catálogo | [02-catalogo](../04-funcionalidades/vision-cliente/02-catalogo/reglas-negocio.md) | Alfa |
| Carrito | [03-carrito](../04-funcionalidades/vision-cliente/03-carrito/reglas-negocio.md) | Alfa |
| Checkout | [04-checkout](../04-funcionalidades/vision-cliente/04-checkout/reglas-negocio.md) | Beta |
| Pedidos y seguimiento | [05-pedidos-sdd](../04-funcionalidades/vision-cliente/05-pedidos-sdd/contexto.md) | Delta |
| Administración | [vision-administracion](../04-funcionalidades/vision-administracion/reglas-negocio.md) | Pendiente de definir por el PO |

## Agregar o modificar un equipo

1. Copiar `00-introduccion/kiro/plantillas/plantilla-perfil-equipo.md` como `05-equipos/<nombre>.md` (por ejemplo `05-equipos/alfa.md`).
2. Completar lo que se sepa y dejar "Por completar" en el resto.
3. Agregar la fila en esta tabla.
4. Subir el cambio por Pull Request (PR).
