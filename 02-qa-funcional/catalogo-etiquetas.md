# Catálogo de Etiquetas de QA

> **Para qué sirve:** define la convención de etiquetado de los tests, Test Sets, Test Executions y Test Plans, y lista las etiquetas de ejemplo que usa el playbook. Etiquetar parejo permite filtrar y armar regresiones sin depender de la memoria de cada QA.
> **Quién lo usa:** el QA funcional de todos los equipos y los agentes de Kiro (`qa-maestro`, `qa-sdd`, `qa-sprint` y `qa-regresion`), que consultan este catálogo antes de proponer etiquetas.
> **Cuándo se usa:** al diseñar o cargar casos en Xray, al armar filtros de regresión (JQL) y cada vez que hace falta una etiqueta que no existe (ver sección 7).

| Dato | Valor |
| :--- | :--- |
| Alcance | Tests, Test Sets, Test Executions y Test Plans de Xray en Jira (proyecto `PROJ`) |
| Producto de ejemplo | **Tienda Demo**: tienda online con login, catálogo, carrito y checkout |
| Formato | minúsculas, palabras unidas con guion bajo, sin espacios, sin tildes ni Ñ |

> **Nota:** una **etiqueta** (*label*) es una palabra suelta que se agrega a un issue de Jira para poder buscarlo después. Se usa en filtros JQL (el lenguaje de búsqueda de Jira), por ejemplo `labels = login AND labels = negativo`.

Este catálogo es **de ejemplo y genérico**: cada equipo lo adapta a su producto, siguiendo las mismas reglas. Kiro lo consulta antes de proponer etiquetas.

---

## 1. Reglas de uso

1. **Usar siempre una etiqueta existente.** Buscarla primero en este catálogo.
2. **Agregar una etiqueta nueva solo cuando no exista una equivalente.** Antes de usarla en Jira o Xray, se agrega a este archivo (sección 7).
3. **No suponer etiquetas.** Si no está claro qué etiqueta corresponde, Kiro pregunta al QA antes de cargarla.
4. **Formato:** minúsculas, palabras unidas con guion bajo, sin espacios, sin tildes ni Ñ. Ejemplo: `carrito_contador`. Jira no admite espacios dentro de una etiqueta.
5. **No usar etiquetas para datos que ya tienen un campo o un tipo de issue.** La regresión va en el campo Regresión; la automatización, en los campos Automatizado y Estado Automatización; el tipo de artefacto (Test, Test Set, Test Execution, Test Plan) lo indica el tipo de issue.
6. **Una etiqueta por concepto.** Si dos etiquetas dicen lo mismo (`front` y `frontend`), se elige una y la otra se deja de usar.

---

## 2. Niveles y orden

Las etiquetas van de lo más general a lo más puntual.

| Orden | Categoría | Obligatoria | Qué identifica | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Equipo | Sí | Equipo que realiza los tests | `alfa` |
| 2 | Capa | Sí | Capa o tipo de prueba: `front`, `api`, `mobile`, `performance` | `front` |
| 3 | Tipo de caso | Sí | `positivo`, `negativo` o `borde` | `negativo` |
| 4 | Funcionalidad | Sí | Funcionalidad que se está probando | `login` |
| 5 | Historia o servicio | Sí | Funcionalidad específica de la HU o tarea | `login_usuario_bloqueado` |
| 6 | Módulo | No | Módulo de la aplicación, cuando aporta para filtrar | `catalogo` |
| 7 | Versión | No | Versión del endpoint o de la API | `v2` |
| 8 | Extra | No | Característica puntual que ayuda a encontrar el caso | `mensajes_error` |

> **Nota:** este catálogo no usa una etiqueta de Visión (cliente, administración): esa información ya está en el Área del nombre del test (por ejemplo `Cliente.FRONT.<título>`, ver el steering `qa-jira-xray`). Los perfiles de equipo (`05-equipos/`) lo confirman en su sección 5.

### Tests integrales

Un test que recorre varias capas (por ejemplo front y api) lleva **las etiquetas de cada capa más `integracion`**.

### Ejemplo completo

Caso `PROJ-123-CP02` "Login con usuario bloqueado muestra mensaje de error", del Equipo Gamma, probado desde la interfaz:

```text
gamma, front, negativo, login, login_usuario_bloqueado, mensajes_error
```

Test integral del mismo flujo, que además verifica el servicio de autenticación:

```text
gamma, front, api, integracion, negativo, login, login_usuario_bloqueado
```

> **Nota:** en Xray las etiquetas se escriben separadas por coma o por espacio en el campo Labels del test; las comas del ejemplo son solo para leerlo mejor. Los datos de prueba del ejemplo (usuario `locked_out_user`, clave `secret_sauce`) son los del sitio demo público SauceDemo; en un proyecto real las credenciales van en variables de entorno, nunca en archivos ni en etiquetas.

---

## 3. Cómo elige Kiro las etiquetas

1. Identifica equipo y capa a partir de la HU y del perfil del equipo.
2. Deduce el tipo de caso (`positivo`, `negativo` o `borde`) del propio caso.
3. Busca en este catálogo la funcionalidad y la historia o servicio que mejor describen el caso.
4. Si encuentra varias candidatas o ninguna, se las muestra al QA y pregunta. No inventa etiquetas.
5. Si el QA decide crear una etiqueta nueva, Kiro propone el cambio en este archivo (sección 7) antes de cargarla en Jira o Xray.

---

## 4. Convención de etiquetado

### 4.1 Equipo

Una etiqueta por equipo, en minúscula.

| Etiqueta | Equipo | Área de ejemplo |
| :--- | :--- | :--- |
| `alfa` | Equipo Alfa | Catálogo y carrito |
| `beta` | Equipo Beta | Checkout y pagos |
| `gamma` | Equipo Gamma | Cuenta y acceso (login) |
| `delta` | Equipo Delta | Pedidos y seguimiento. Trabaja con SDD (*Spec-Driven Development*, desarrollo guiado por especificaciones) |

### 4.2 Capa

| Etiqueta | Qué cubre | Herramienta de ejemplo |
| :--- | :--- | :--- |
| `front` | Pruebas de la interfaz web | Playwright (incluido en `plantilla-automation`) |
| `api` | Pruebas de servicios y contratos | Karate u otro framework que el equipo sume (no incluido en la plantilla) |
| `mobile` | Pruebas de la aplicación o el canal mobile | Framework mobile que el equipo sume (no incluido en la plantilla) |
| `performance` | Pruebas de carga, estrés y tiempos de respuesta | k6 u otro (no incluido en la plantilla) |
| `integracion` | Test que recorre varias capas. Se usa junto con las etiquetas de cada capa | n/a |

### 4.3 Tipo de caso

| Etiqueta | Cuándo se usa | Ejemplo en Tienda Demo |
| :--- | :--- | :--- |
| `positivo` | El camino esperado, con datos válidos | Login exitoso con `standard_user` |
| `negativo` | Un dato o acción inválida que el sistema debe rechazar | Login con `locked_out_user` muestra un mensaje de error |
| `borde` | Un valor en el límite de lo permitido o una situación poco común | Checkout con el código postal vacío o con un solo carácter |

> **Nota:** todo conjunto de casos de una HU debe incluir los tres tipos. Si falta alguno, la matriz de cobertura lo marca como gap.

### 4.4 Funcionalidad y historia o servicio

La funcionalidad es la categoría de orden 4 (qué se prueba) y la historia o servicio es la de orden 5 (qué parte puntual), según la tabla de la sección 2. Se arman combinando el nombre de la pantalla o el servicio con la acción.

| Funcionalidad | Historias o servicios de ejemplo | Equipo |
| :--- | :--- | :--- |
| `login` | `login_exitoso`, `login_usuario_bloqueado`, `login_campos_vacios` | `gamma` |
| `catalogo` | `catalogo_orden_precio`, `catalogo_filtro_nombre`, `catalogo_detalle_producto` | `alfa` |
| `carrito` | `carrito_agregar`, `carrito_quitar`, `carrito_contador` | `alfa` |
| `checkout` | `checkout_datos_comprador`, `checkout_resumen`, `checkout_confirmacion` | `beta` |
| `pedidos` | `pedidos_consultar_estado` (historia `PROJ-142`, épica `PROJ-40`) | `delta` |

### 4.5 Módulo, versión y extra

| Categoría | Etiquetas de ejemplo | Uso |
| :--- | :--- | :--- |
| Módulo | `tienda_web`, `admin` | Cuando el producto tiene más de una aplicación |
| Versión | `v1`, `v2` | Versión de un endpoint (solo capa `api`) |
| Extra | `mensajes_error`, `ordenamiento`, `paginado`, `permisos`, `modal`, `responsive` | Característica puntual transversal a varias funcionalidades |

---

## 5. Etiquetas que no se usan

Estas etiquetas no se agregan a artefactos nuevos, porque la información que representan ya está en un campo o en el tipo de issue.

| Etiqueta | Motivo | Qué usar en su lugar |
| :--- | :--- | :--- |
| `regresion` | Duplica el campo | Campo **Regresión** (Sí o No) del test |
| `testing_manual` | Duplica el campo | Campo **Automatizado** (`NO`) y campo **Estado Automatización** |
| `test_set`, `test_execution`, `test_plan` | El tipo de issue ya lo dice | Tipo de issue de Xray |

### Campos de automatización del test

| Campo | Valores | Para qué sirve |
| :--- | :--- | :--- |
| Automatizado | `SI` o `NO` | Indica si el test se ejecuta con la suite automatizada del equipo (`SI`) o a mano (`NO`). Es obligatorio para armar la regresión |
| Estado Automatización | Por ejemplo `Automatizado`, `Candidato`, `No automatizable` | Indica en qué etapa de automatización está el test. Consultar los valores permitidos del campo en tu proyecto antes de setearlo |
| Regresión | `Sí` o `No` | Indica si el test entra en la regresión |

> **Nota:** los nombres exactos y los valores permitidos de estos campos dependen de la configuración de Jira de cada proyecto. Ante la duda, Kiro consulta los valores permitidos antes de escribir.

---

## 6. Cómo se usan las etiquetas para filtrar

Ejemplos de JQL (búsquedas de Jira) que se apoyan en esta convención:

```text
# Casos negativos de front del Equipo Gamma
project = PROJ AND issuetype = Test AND labels = gamma AND labels = front AND labels = negativo

# Casos de login de todos los equipos que aplican a regresión
project = PROJ AND issuetype = Test AND labels = login AND "Regresión" = "Sí"

# Regresión automatizada de login y carrito (la suite del equipo)
project = PROJ AND issuetype = Test AND labels in (login, carrito) AND "Regresión" = "Sí" AND "Automatizado" = "SI"

# Regresión manual de login y carrito (no automatizados)
project = PROJ AND issuetype = Test AND labels in (login, carrito) AND "Regresión" = "Sí" AND "Automatizado" = "NO"
```

Los dos últimos son los que arma `qa-preparar-regresion` para un release (ver `02-qa-funcional/estructura-test-plan.md`, sección 3).

> **Nota:** el nombre de los campos Regresión y Automatizado entre comillas debe coincidir con el de tu Jira. Los valores son `Sí` / `No` (con tilde) en Regresión y `SI` / `NO` (mayúsculas, sin tilde) en Automatizado.

---

## 7. Cómo agregar una etiqueta nueva

1. Confirmar que no existe una equivalente en este catálogo (buscar por palabra clave y por descripción).
2. Definir la categoría (sección 2) y el nombre según las reglas de la sección 1.
3. Agregar una fila en la tabla de su categoría, con una descripción clara y un ejemplo.
4. Agregar una línea en el registro de cambios (sección 8) con la fecha, la etiqueta y la HU o tarea que la originó (por ejemplo `PROJ-123`).
5. Subir el cambio por Pull Request (PR) del playbook. Recién después usarla en Jira o Xray.

Cuando Kiro detecta que hace falta una etiqueta nueva, prepara este cambio y lo muestra al QA para que lo confirme.

---

## 8. Registro de cambios

| Fecha | Cambio | Origen |
| :--- | :--- | :--- |
| 2026-10-28 | Versión inicial del catálogo genérico: convención, equipos, capas, tipos de caso y ejemplos de Tienda Demo | Reescritura del playbook |
