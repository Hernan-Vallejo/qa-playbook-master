# Guía de contribución al QA Playbook

> **Para qué sirve:** explica cómo proponer cambios al playbook (ramas, commits, Pull Requests, formato de los documentos) para que todos escriban y revisen igual.
> **Quién lo usa:** cualquier integrante del equipo de QA (funcional y automatización) que quiera agregar, corregir o actualizar contenido.
> **Cuándo se usa:** cada vez que vayas a modificar un archivo del repositorio.

## Quién puede contribuir

Todo integrante del equipo de QA puede y debe contribuir a este repositorio. Es responsabilidad de todos mantenerlo actualizado.

---

## Cuándo contribuir

- Cuando se descubre una regla de negocio nueva o no documentada.
- Cuando cambia un proceso (nuevo paso, nueva herramienta, nuevo flujo).
- Cuando se encuentra información desactualizada.
- Cuando un nuevo QA hace una pregunta que debería estar documentada aquí.
- Cuando se aprende algo que le puede servir a otro integrante del equipo.

---

## Cómo contribuir

### 1. Crear una tarea en Jira

Antes de hacer cambios, crear una tarea en el proyecto correspondiente (Jira es la herramienta de tickets; las claves son de ejemplo):

| Tipo de cambio | Proyecto Jira | Ejemplo |
| :--- | :--- | :--- |
| Documentación de procesos, reglas de negocio, estándares | `PROJ` | `PROJ-145` |
| Documentación relacionada a automatización | `AUTO` | `AUTO-45` |

En la tarea de Jira incluir:

- **Título:** breve descripción de qué se va a documentar.
- **Descripción:** detalle del alcance del cambio y los archivos afectados.

### 2. Crear una rama

Formato: `feature/<CLAVE>-<resumen>`, donde `<CLAVE>` es la clave de la tarea de Jira y `<resumen>` son dos o tres palabras en minúscula unidas por guiones.

```bash
git checkout -b feature/PROJ-145-reglas-carrito
git checkout -b feature/AUTO-45-login-negativos
```

### 3. Hacer los cambios

- Editar o crear archivos `.md` en la carpeta correspondiente.
- Seguir las convenciones de formato (ver más abajo).
- Mantener todos los documentos en español formal, con voseo ("Revisá", "Decime").

### 4. Commits

Formato: `<CLAVE>: <qué cambia>`. Es el mismo para el playbook y para los repositorios de automatización (ver [contratos, sección 10](./00-introduccion/kiro/contratos.md)). Un commit cuenta qué cambia; no lleva tipo ni prefijos adicionales.

```text
PROJ-145: agrega reglas de negocio del carrito
AUTO-45: agrega casos negativos de login
```

### 5. Crear el Pull Request (PR)

Un Pull Request es el pedido de revisión para integrar tu rama en `main`.

**Título del PR:** `<TIPO> | <CLAVE> | <título de la tarea en Jira>`, con `TIPO` = `FEAT` (contenido nuevo), `FIX` (corrección) o `CHORE` (mantenimiento).

```text
FEAT | PROJ-145 | Agregar reglas de negocio del carrito
FIX | AUTO-45 | Corregir documentación de pipelines CI/CD
```

**Descripción del PR:** incluir resumen de los cambios, archivos creados o modificados y link a la tarea de Jira (la skill `qa-crear-pr` arma la descripción homologada).

**Ejemplo de descripción:**

```markdown
## Resumen
Se documentan las reglas de negocio del carrito: agregar, quitar productos
y comportamiento del contador.

## Archivos modificados
- `04-funcionalidades/vision-cliente/03-carrito/reglas-negocio.md`

## Tarea Jira
PROJ-145
```

### 6. Revisión y merge

- Asignar a un revisor del equipo (cualquier QA puede revisar).
- La revisión es ligera: es documentación, no código.
- Los chequeos automáticos del PR tienen que estar en verde (ver la sección siguiente).
- Una vez aprobado, se mergea a `main`.

---

## Chequeos automáticos del PR (CI de documentación)

Cada PR dispara el workflow `.github/workflows/docs-lint.yml` (GitHub Actions; CI = integración continua, validaciones que corren solas). Tiene cuatro jobs:

| Job | Qué valida | Configuración |
| :--- | :--- | :--- |
| `markdownlint` | Formato Markdown que rompe el render (espacios al final, encabezados mal escritos, links vacíos) | `.github/markdownlint-cli2.jsonc` |
| `links` | Links relativos rotos entre documentos (los links externos no se validan) | `.github/lychee.toml` |
| `naming` | Nombres de archivos y carpetas (ver convenciones abajo) | `.github/check-naming.sh` |
| `secrets` | Credenciales o tokens filtrados, con gitleaks | Reglas por defecto de gitleaks |

> **Nota:** si un job falla, abrí el detalle en la pestaña "Checks" del PR, corregí lo que indica y subí un commit nuevo.

> **Plantilla de automation:** el workflow `.github/workflows/automation.yml` valida y prueba `plantilla-automation/` (tipos, ESLint, Prettier y tests de Playwright) cuando un PR toca esa carpeta.

---

## Convenciones de formato

### Nombres de archivos

- Todo en **minúsculas**.
- Separar palabras con **guiones** (`-`), nunca con espacios ni guion bajo.
- Sin tildes, ñ ni caracteres especiales.
- Extensión `.md` (en minúscula).
- No se permiten binarios de ofimática (`.docx`, `.xlsx`, `.pdf`): convertir a Markdown.

```text
Correcto:   reglas-negocio.md
Correcto:   proceso-qa-funcional.md
Incorrecto: Reglas de Negocio.md
Incorrecto: proceso_qa_funcional.md
Incorrecto: Checkout-Documentacion.md
```

> **Excepción:** los archivos estándar de la raíz del repositorio se mantienen en mayúsculas por convención: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.

> **Excepción:** la carpeta `plantilla-automation/` es un proyecto de código con sus propias convenciones (por ejemplo, Page Objects en PascalCase como `pages/LoginPage.ts`, y su propio `README.md`). Queda fuera del chequeo de nombres; solo se le prohíben los binarios de ofimática. Sus convenciones están en [`plantilla-automation/README.md`](./plantilla-automation/README.md).

### Nombres de carpetas

- Minúsculas con guiones, sin espacios ni tildes.
- Las funcionalidades de `04-funcionalidades/vision-cliente/` llevan número de orden + nombre, todo unido con guiones: **`NN-nombre`**.
  - Ejemplo: `01-acceso/`, `04-checkout/`, `05-pedidos-sdd/`.

```text
Correcto:   03-carrito/
Correcto:   04-checkout/
Incorrecto: 03 - carrito/    (espacios)
Incorrecto: 04-Checkout/     (mayúsculas)
```

### Estructura de un documento

Todo documento empieza con el título y un bloque de tres líneas que explica para qué sirve, quién lo usa y cuándo:

```markdown
# Título Principal

> **Para qué sirve:** ...
> **Quién lo usa:** ...
> **Cuándo se usa:** ...

---

## Secciones con H2

### Subsecciones con H3

Contenido claro y directo.
```

### Reglas de escritura

- **Idioma:** español rioplatense con voseo, formal y claro.
- **Tono:** profesional y accesible; que cualquier persona del equipo lo entienda sin ambigüedad.
- **Siglas y jerga:** explicarlas la primera vez que aparecen (HU, DoR, DoD, SDD, MCP, POM, E2E).
- **Notas y ejemplos:** usar `> **Nota:** ...` y `> **Ejemplo:** ...` donde un paso o una regla no sea evidente.
- **Sin emojis ni iconos.** Si un icono tenía significado, escribirlo en texto: `[PUNTO DE CONTROL]`, `Atención:`, `APROBADO`, `CON OBSERVACIONES`, `RECHAZADO`, `Sí` / `No`. Los caracteres de árbol de carpetas (`├──`, `└──`, `│`) y las flechas (`→`) están permitidos.
- **Extensión:** lo mínimo necesario para que sea útil. No rellenar con contenido innecesario.
- **Tablas:** usarlas para comparaciones y listados estructurados.
- **TODOs:** si algo está incompleto, dejar `<!-- TODO: descripción -->` para que quede marcado.
- **Links:** referenciar documentos relacionados del mismo playbook con rutas relativas.
- **Datos de prueba:** siempre ficticios. Las únicas credenciales permitidas son las del sitio demo público SauceDemo (`standard_user` / `secret_sauce`), aclarando que son de un sitio demo público.

### Lo que va en cada carpeta

| Carpeta | Qué documentar |
| :--- | :--- |
| `00-introduccion/` | Visión del equipo, cómo utilizar Kiro, onboarding |
| `01-estandares-globales/` | Definiciones que aplican a todo el equipo (DoR, DoD, proceso de regresión) |
| `02-qa-funcional/` | Proceso del QA funcional, catálogo de etiquetas, estructura y plantillas de test plan |
| `03-qa-automatizacion/` | Procesos de automatización (repositorios, frameworks, pipelines, performance) |
| `04-funcionalidades/` | Reglas de negocio por visión y funcionalidad |
| `05-equipos/` | Un perfil por equipo, con los datos que cambian entre equipos |
| `.kiro/steering/` | Reglas que Kiro aplica automáticamente (modificar solo con criterio y consenso) |
| `.kiro/skills/` | Skills de Kiro (usar `qa-escribir-skills` para crear o corregir una) |
| `plantilla-automation/` | Plantilla de automatización con Playwright (código, no documentación) |

> **Para documentar reglas de negocio:** copiá `04-funcionalidades/plantilla-reglas-negocio.md` dentro de la carpeta de la funcionalidad como `reglas-negocio.md` y completá las secciones que apliquen. Así todas las funcionalidades quedan con el mismo formato y Kiro las consume de forma pareja.

> **Para agentes y skills:** el frontmatter (el bloque entre `---` al inicio del archivo) debe tener los campos `name` y `description`, y el `name` debe coincidir con el nombre de la carpeta o del archivo. No se agregan comentarios dentro del frontmatter de los agentes.

---

## Qué NO va en este repositorio

- Evidencias de pruebas (se guardan en el repositorio documental del equipo, por ejemplo SharePoint o Drive; en la plantilla de automatización se generan en `evidencias/<ID-HISTORIA>/` y se copian de ahí).
- Datos de prueba con información sensible o datos reales de personas o empresas.
- Credenciales, tokens o secretos (van en variables de entorno).
- Código fuente de automatización de los proyectos reales del equipo (corresponde a sus repositorios; acá solo vive la plantilla).
- Archivos binarios (Word, Excel, PDF): siempre convertir a Markdown.

---

## Criterios de revisión

La revisión es ligera pero debe verificar:

- ¿El contenido es correcto y está actualizado?
- ¿Está ubicado en la carpeta correcta?
- ¿Sigue las convenciones de formato?
- ¿Es comprensible para alguien que no tiene el contexto previo?
- ¿El idioma es formal y rioplatense, sin emojis?
- ¿Los chequeos automáticos del PR están en verde?

Si cumple estos criterios, se aprueba y se mergea.
