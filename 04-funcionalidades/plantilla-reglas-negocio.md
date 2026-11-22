# [Nombre de la Funcionalidad] - Reglas de Negocio

> **Para qué sirve:** es la plantilla para documentar las reglas de negocio de un módulo nuevo, con el mismo formato que usan los demás módulos del playbook.
> **Quién lo usa:** QA, PO (Product Owner) y desarrollo, cuando se documenta o se actualiza un módulo.
> **Cuándo se usa:** al incorporar un módulo nuevo a `04-funcionalidades/` o cuando un módulo existente todavía no tiene su documento de reglas.

> **Equipo:** [Equipo responsable, ej: Equipo Alfa]
> **Proyecto Jira:** [Clave, ej: PROJ]
> **Estado de la doc:** [Borrador / En progreso / Completa]

<!--
  CÓMO USAR ESTA PLANTILLA
  1. Copiá este archivo dentro de la carpeta de la funcionalidad como
     `reglas-negocio.md` (no edites la plantilla original).
  2. Completá las secciones que apliquen y borrá las que no.
  3. Dejá un comentario HTML con la palabra TODO y lo pendiente (como los que ya tiene esta plantilla al final de cada sección) en lo que quede sin completar, así se ve qué falta.
  4. Todo en español. Nombres de servicios, campos y tablas tal como son
     en el sistema (no traducir). Los mensajes de error van con el texto EXACTO.
  5. Lo que la historia o el PO no definió se marca "Pendiente de definir por el PO".
     No se supone ni se inventa.
  Ver convenciones en CONTRIBUTING.md (raíz del repositorio) y el estándar de casos en
  .kiro/steering/qa-gherkin.md
-->

---

## Descripción

Breve resumen de qué hace la funcionalidad y qué problema de negocio resuelve.
Una o dos frases. Si es parte de un flujo mayor, mencionar dónde encaja.

> **Ejemplo:** "El carrito permite al comprador reunir productos antes de pagar. Está entre el catálogo y el checkout."

---

## Actores y Permisos

Quién puede operar y con qué permisos. Usar la nomenclatura real del sistema.

| Actor / Rol | Permiso requerido | Qué puede hacer |
| :--- | :--- | :--- |
| [ej: Comprador] | [ej: sesión iniciada] | [Agregar productos al carrito] |
| [ej: Administrador] | [ej: `catalogo.editar`] | [Editar productos] |

<!-- TODO: Documentar la estructura de permisos completa -->

---

## Flujo Principal

Los pasos del camino feliz, en orden. Enumerar de forma declarativa
(qué hace el sistema / el usuario), no a nivel de UI (sin selectores ni botones).

1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

<!-- TODO: Documentar el flujo completo -->

---

## Reglas de Negocio

El corazón del documento. Cada regla con su identificador, su condición y su comportamiento.
Incluir umbrales, topes, límites, mensajes de error exactos y códigos de estado.

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-XXX-01 | [Nombre de la regla] | [Cuándo aplica] | [Qué debe pasar, con valor o mensaje exacto] |

> **Nota:** cada regla debe poder comprobarse sin interpretar. Evitá "funciona bien" o "se muestra correctamente": decí qué se ve, qué valor, qué mensaje. El `ID` lleva el prefijo del módulo (`RN-ACC-` acceso, `RN-CAT-` catálogo, `RN-CAR-` carrito, `RN-CHK-` checkout, `RN-PED-` pedidos, `RN-ADM-` administración) y un número correlativo. Si la regla ya la prueba un test automatizado, anotá su ID de caso (por ejemplo `PROJ-101-CP03`) en una sección "Cobertura en la plantilla de automatización", como en [01-acceso](./vision-cliente/01-acceso/reglas-negocio.md).

Ejemplos de reglas a documentar:

- **Validaciones de entrada:** campos obligatorios, formatos, longitudes.
- **Límites y topes:** montos máximos y mínimos, cantidad de operaciones.
- **Mensajes de error:** texto exacto y código asociado.
- **Comportamiento condicional:** ej. qué pasa si el carrito está vacío.

<!-- TODO: Documentar las reglas de negocio -->

---

## Endpoints / Servicios

Servicios involucrados. Sirve para automatización y para validar contratos.

| Servicio | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| [nombre] | [GET/POST/PUT/DELETE] | [`/v1/...`] | [qué hace] |

> **Nota:** si el producto no expone API documentada (como el sitio demo), escribí "No aplica" o "Pendiente de definir por el PO".

<!-- TODO: Documentar los endpoints -->

---

## Estados

Si la entidad tiene un ciclo de vida, documentar los estados y sus transiciones.

`[ESTADO_INICIAL]` → `[ESTADO_INTERMEDIO]` → `[ESTADO_FINAL]`

| Estado | Significado | Transición desde |
| :--- | :--- | :--- |
| [ej: CREADO] | [Pedido recién generado] | [Confirmación de compra] |
| [ej: ENVIADO] | [Pedido despachado] | [EN_PREPARACION] |

<!-- TODO: Documentar los estados (si aplica) -->

---

## Validación en Base de Datos

Dónde se persiste el resultado. Clave para que los tests validen de punta a punta
(no alcanza con la respuesta HTTP ni con lo que se ve en pantalla).

| Base / Esquema | Tabla | Qué validar |
| :--- | :--- | :--- |
| [ej: `tienda_qa`] | [ej: `pedidos`] | [ej: `estado` = 'CREADO' tras confirmar la compra] |

> **Atención:** las consultas son de **solo lectura (SELECT)**. Nunca se modifican datos desde las consultas de QA documentadas.

<!-- TODO: Documentar las tablas y campos a validar -->

---

## Casos Borde y Escenarios de Error

Situaciones límite o negativas que hay que contemplar al testear.

- [ej: Operación sin sesión → redirección al login]
- [ej: Campo obligatorio vacío → mensaje exacto del campo]
- [ej: Valor en el límite permitido y justo fuera del límite]

<!-- TODO: Documentar casos borde -->

---

## Dependencias

Servicios upstream/downstream, integraciones externas o feature flags de los
que depende esta funcionalidad.

- [ej: servicio de usuarios, servicio de pagos]
- [ej: feature flag de la funcionalidad nueva]

<!-- TODO: Documentar dependencias -->

---

## Datos de Prueba

Cómo obtener o preparar los datos para testear (usuarios, productos, flags).
No incluir credenciales reales ni datos sensibles. Usar solo datos ficticios.

> **Ejemplo:** usuarios `standard_user` / `locked_out_user` / `problem_user` (públicos del sitio demo); comprador ficticio "Ana Prueba", código postal "1000". En un proyecto real las credenciales van en variables de entorno, no en archivos.

<!-- TODO: Documentar datos de prueba -->

---

## Cobertura en la plantilla de automatización

Solo si el módulo ya tiene tests en `plantilla-automation/`. Relaciona cada regla con el caso que la prueba, para saber qué está cubierto y qué no (no se marca una regla como cubierta sin un test o una prueba manual que la respalde).

| Regla | Caso de prueba | Archivo del test |
| :--- | :--- | :--- |
| [RN-XXX-01] | [ej: `PROJ-101-CP01`] | [ej: `tests/sin-sesion/login.spec.ts`] |

<!-- TODO: Completar si el módulo se automatiza; borrar la sección si no aplica -->

---

## Preguntas abiertas para el PO

Todo lo que el documento no puede afirmar. Cada pregunta menciona al PO de la historia.

| # | Pregunta | Impacto | Estado |
| :--- | :--- | :--- | :--- |
| 1 | [Pregunta concreta] | [Qué casos quedan sin diseñar] | Pendiente de definir por el PO |

---

## Referencias

- [Enlace a HU / épica en Jira]
- [Enlace a diseño en Figma, si aplica]
- [Enlace a Swagger / OpenAPI, si aplica]
- [Documentos relacionados del playbook con path relativo]
