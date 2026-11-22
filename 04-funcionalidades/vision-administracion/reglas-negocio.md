# Visión Administración - Reglas de Negocio

> **Para qué sirve:** reserva el lugar de las reglas de la visión administrativa de Tienda Demo (personal interno de la tienda) y deja registrado qué falta definir. Hoy casi todo es **Pendiente de definir por el PO**.
> **Quién lo usa:** QA de cualquier equipo y el PO, para saber qué está documentado y qué no.
> **Cuándo se usa:** cuando una HU toca la administración de la tienda (productos, pedidos, usuarios). Antes de diseñar casos, hay que completar este documento con el PO.

> **Equipo:** Pendiente de definir por el PO
> **Proyecto Jira:** `PROJ`
> **Estado de la doc:** Borrador

> **Atención:** el sitio demo SauceDemo **no tiene una visión de administración**. No se inventan reglas: este documento solo registra el alcance previsto y las preguntas abiertas.

## Descripción

La Visión Administración sería la usada por el **Administrador de la tienda**, personal interno que gestiona el catálogo, los pedidos y los usuarios. Su alcance real es **Pendiente de definir por el PO**.

## Funcionalidades previstas (a confirmar)

| Funcionalidad | Relación con otros módulos | Estado |
| :--- | :--- | :--- |
| Gestión de productos (alta, edición, baja, precio) | Alimenta el [catálogo](../vision-cliente/02-catalogo/reglas-negocio.md) | Pendiente de definir por el PO |
| Gestión de pedidos (cambio de estado, cancelación) | Modifica el estado de los [pedidos](../vision-cliente/05-pedidos-sdd/reglas-negocio.md) | Pendiente de definir por el PO |
| Gestión de usuarios (bloqueo y desbloqueo) | Determina quién puede ingresar al [acceso](../vision-cliente/01-acceso/reglas-negocio.md) | Pendiente de definir por el PO |

## Actores y Permisos

| Actor / Rol | Permiso requerido | Qué puede hacer |
| :--- | :--- | :--- |
| Administrador de la tienda | Pendiente de definir por el PO | Pendiente de definir por el PO |
| Comprador | Ninguno sobre esta visión | No debe ver ni usar ninguna función de administración |

> **Nota:** como el actor "Comprador" no debe acceder a esta visión, en cuanto exista habrá que diseñar casos negativos de permisos (un comprador que intenta abrir una función de administración debe ser bloqueado). Es un **área crítica** del producto.

## Reglas de Negocio

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-ADM-01 | Acceso restringido | Un comprador intenta abrir una función de administración | El sistema debe bloquear el acceso. El mensaje exacto es Pendiente de definir por el PO |
| RN-ADM-02 | Coherencia con el catálogo | Un producto se modifica desde administración | El cambio se refleja en el catálogo. Cuánto tarda es Pendiente de definir por el PO |

> **Nota:** las únicas reglas escritas son las que se derivan de áreas críticas ya definidas para el producto (permisos y consistencia). El resto **no se afirma**.

## Preguntas abiertas para el PO

| # | Pregunta | Impacto | Estado |
| :--- | :--- | :--- | :--- |
| 1 | ¿La tienda tiene una visión de administración en el alcance de este producto? | Define si este documento se completa o se descarta | Pendiente de definir por el PO |
| 2 | ¿Qué roles de administración existen y qué permisos tiene cada uno? | Casos de permisos | Pendiente de definir por el PO |
| 3 | ¿Quién bloquea y desbloquea usuarios, y con qué mensaje? | Casos de acceso | Pendiente de definir por el PO |
| 4 | ¿Se puede editar el precio de un producto con pedidos existentes? | Coherencia de importes (RN-PED-03) | Pendiente de definir por el PO |
| 5 | ¿Quién cambia el estado de un pedido? | Casos de estados | Pendiente de definir por el PO |

## Validación en Base de Datos

Pendiente de definir. Si se confirma esta visión, las consultas se documentan en un `consultas-sql-qa.md` propio, **solo de lectura (SELECT)**, sobre la base ficticia `tienda_qa`.

## Cómo completar este documento

1. Reuní con el PO y respondé la tabla de preguntas abiertas.
2. Copiá la [plantilla de reglas de negocio](../plantilla-reglas-negocio.md) y completá las secciones que apliquen.
3. Reemplazá las filas "Pendiente de definir por el PO" por reglas concretas, con mensajes exactos.
4. Actualizá [contexto-negocio.md](../contexto-negocio.md) y subí el cambio por Pull Request.
