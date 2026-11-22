# Adaptar el playbook a un proyecto nuevo

> **Para qué sirve:** es la lista ordenada de lo que hay que reemplazar, conservar y verificar para llevar este playbook y la plantilla de automation a un proyecto real, sin dejar datos de ejemplo olvidados.
> **Quién lo usa:** la persona de QA (o el líder técnico) que arma el repositorio de un proyecto nuevo a partir de este.
> **Cuándo se usa:** una sola vez, al arrancar el proyecto. Lleva entre medio día y un día de trabajo.

## 1. Qué es genérico y qué es de ejemplo

El playbook mezcla dos tipos de contenido. Conviene tenerlos claros antes de editar.

| Tipo                       | Qué es                                                                                                      | Qué hacer                                      |
| :------------------------- | :---------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| **Proceso** (genérico)     | Cómo se analiza una HU, se diseñan casos, se reporta un bug, se cierra un sprint, se revisa un PR, etc.     | Conservar. Ajustar solo lo que tu equipo haga distinto |
| **Estándares** (genérico)  | DoR y DoD, formato de casos, etiquetas, severidades, convenciones de Git, reglas de seguridad de datos      | Conservar y ajustar a tu realidad              |
| **Datos de ejemplo**       | La empresa "Acme", el producto "Tienda Demo", los equipos Alfa a Delta, las claves `PROJ` y `AUTO`, SauceDemo | Reemplazar todo por datos de tu proyecto       |
| **Herramientas**           | Jira y Xray, GitHub y GitHub Actions, Kiro, Figma, Playwright                                                | Conservar si usás las mismas; si no, ver la sección 6 |

## 2. Antes de empezar

1. **Copiá el repositorio** completo a una carpeta nueva y creá tu propio repositorio de Git (sin la historia del original).
2. **Decidí si las dos partes van juntas o separadas.** El repositorio tiene el playbook y la carpeta `plantilla-automation/`. Podés dejarlos juntos (funcionan los dos workflows de la raíz) o separar la plantilla en su propio repositorio (ver el README principal, sección "Un repositorio con dos partes").
3. **Corré el script de búsqueda** para ver cuántos datos de ejemplo hay y dónde:

```powershell
# Desde la raíz del repositorio. Solo lee archivos, no modifica nada.
.\scripts\buscar-datos-de-ejemplo.ps1            # resumen por dato de ejemplo
.\scripts\buscar-datos-de-ejemplo.ps1 -Detalle   # además, cada línea encontrada
```

Volvé a correrlo al terminar cada sección de este documento: las cantidades tienen que ir bajando hasta cero (o hasta lo que decidas conservar a propósito).

## 3. Reemplazos, en orden

Hacelos en este orden: cada paso usa lo definido en el anterior.

### 3.1 Identidad del proyecto

Definí estos datos una sola vez y anotalos; los vas a necesitar en todos los pasos.

| Dato de ejemplo               | Qué poner                                                           | Dónde aparece                                  |
| :---------------------------- | :------------------------------------------------------------------ | :--------------------------------------------- |
| Empresa "Acme"                | El nombre de tu empresa (o "la empresa")                            | README, introducción, contexto de negocio      |
| Producto "Tienda Demo"        | El nombre de tu producto                                            | `04-funcionalidades/`, README, ejemplos        |
| Clave de Jira `PROJ`          | La clave de tu proyecto de historias                                | Casi todos los archivos (ejemplos `PROJ-123`)  |
| Clave de Jira `AUTO`          | La clave de tu proyecto o tablero de tareas de automatización       | `qa-crear-tarea-automatizacion`, `qa-automation`, contratos |
| Workspace `QA-WORKSPACE`      | El nombre de tu workspace de Kiro                                   | `como-trabajamos-con-kiro.md` y agentes        |

> **Nota:** reemplazar `PROJ` y `AUTO` con buscar y reemplazar de todo el repositorio es seguro **solo si** tu clave tiene un formato parecido (letras en mayúscula, guion y número). Revisá el resultado: `PROJ` aparece también dentro de palabras como "proyecto" en minúsculas, que no se debe tocar (el script busca la clave con mayúsculas).

### 3.2 Reglas de negocio y funcionalidades (`04-funcionalidades/`)

Es la carpeta más específica del producto: **se reescribe entera**.

1. Dejá `plantilla-reglas-negocio.md` como está: es el molde.
2. Reemplazá `contexto-negocio.md` y `contexto-funcionalidades.md` por la descripción de tu producto, sus visiones (cliente, administración, etc.) y sus actores.
3. Por cada funcionalidad de tu producto, creá una carpeta `NN-nombre/` dentro de `vision-cliente/` (o la visión que corresponda) con su `reglas-negocio.md`, copiando el molde. Si tenés una base de datos de QA, sumá un `consultas-sql-qa.md` (solo consultas de lectura).
4. Borrá las carpetas de ejemplo (`01-acceso`, `02-catalogo`, `03-carrito`, `04-checkout`) cuando ya no las necesites. Conservá `05-pedidos-sdd/` solo si algún equipo trabaja con SDD; si no, borrala.
5. Las reglas de negocio del ejemplo (mensajes de error, montos, estados) **no se reutilizan**: son las de un sitio demo. No copies reglas que no estén definidas en tus historias; dejalas como pregunta para el PO.

### 3.3 Equipos (`05-equipos/`)

1. Creá un archivo por equipo copiando `00-introduccion/kiro/plantillas/plantilla-perfil-equipo.md`.
2. Completá en cada perfil: proyecto de Jira, etiqueta del equipo, JQL de las HU a probar, convenciones del equipo, referencias de Figma y repositorios.
3. Actualizá `indice-equipos.md`.
4. Borrá `alfa.md`, `beta.md`, `gamma.md` y `delta.md`, o renombralos si se parecen a tus equipos.

> **Nota:** las skills de sprint y regresión leen el perfil del equipo para saber qué JQL usar y dónde guardar las evidencias. Un perfil incompleto es la causa más común de que un agente pregunte datos que ya deberían estar.

### 3.4 Etiquetas, campos y estados de Jira

1. Revisá `02-qa-funcional/catalogo-etiquetas.md` y ajustá las etiquetas (equipos, capas, tipos de caso) a las tuyas.
2. Verificá los nombres de los campos personalizados que citan las skills y los steering (Regresión, Automatizado, Estado Automatización, Requiere pruebas de testing, Ambiente, Severidad). Si en tu Jira se llaman distinto, reemplazalos en `.kiro/steering/qa-jira-xray.md` y en las plantillas de `02-qa-funcional/plantillas/`.
3. Verificá los tipos de incidencia y estados (por ejemplo `Bug`, `Story`, `Test`, `Test Plan`, `Test Execution`). En algunos Jira en español, `Bug` se llama `Error`.

### 3.5 Plantilla de automation (`plantilla-automation/`)

Seguí esta lista en orden. Cada paso se puede verificar corriendo `npm run verificar` y `npx playwright test`.

| Paso | Qué hacer                                                                                                                                | Archivo                                         |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| 1    | Poner las URLs reales de `qa` y `pre` (web y API)                                                                                         | `config/ambientes.ts`                           |
| 2    | Definir `HOSTS_BLOQUEADOS` con los dominios de producción (en `.env` y en el workflow)                                                    | `.env.example`, `.github/workflows/`            |
| 3    | Cambiar el ambiente por defecto de `demo` a `qa` (valor por defecto de `TEST_ENV`)                                                         | `config/ambientes.ts`, `.env.example`           |
| 4    | Reemplazar los usuarios de prueba por los de tu ambiente, leídos de variables de entorno. Pedir las credenciales al equipo               | `data/usuarios.ts`, `.env`                      |
| 5    | Reemplazar los datos del comprador por los datos ficticios de tu dominio (o borrar el archivo si no aplica)                              | `data/comprador.ts`                             |
| 6    | Crear un Page Object por cada pantalla de tu producto, heredando de `BasePage` y copiando el estilo de `LoginPage.ts`                    | `pages/`                                        |
| 7    | Registrar los Page Objects nuevos como fixtures                                                                                           | `fixtures/index.ts`                             |
| 8    | Adaptar `tests/auth.setup.ts` al login de tu producto (qué pantalla, qué se espera ver al terminar)                                       | `tests/auth.setup.ts`                           |
| 9    | Escribir tus tests en `tests/sin-sesion/` y `tests/con-sesion/`, con el ID del caso en el título                                          | `tests/`                                        |
| 10   | Reemplazar el cliente y los tests de API por los de tu API (o borrar `api/`, `tests/api/` y el proyecto `api` de la configuración)        | `api/`, `tests/api/`, `playwright.config.ts`    |
| 11   | Borrar los tests y Page Objects de ejemplo que ya no usás                                                                                 | `pages/`, `tests/`                              |
| 12   | Cambiar el nombre y la descripción del proyecto                                                                                           | `package.json`                                  |
| 13   | Cargar `QA_USER` y `QA_PASSWORD` como secretos del repositorio y descomentar las líneas del workflow                                      | GitHub: Settings, Secrets and variables, Actions |
| 14   | Si separás la plantilla en su repositorio, borrar `.github/workflows/automation.yml` de la raíz del playbook                              | `.github/workflows/`                            |

Al terminar, estos tres comandos tienen que pasar:

```bash
cd plantilla-automation
npm ci
npm run verificar
npx playwright test
```

### 3.6 Skills y agentes de Kiro (`.kiro/`)

Casi todo se conserva. Revisá:

1. **Servidores MCP.** Los agentes usan `@atlassian` (Jira y Xray), `@github` y `@figma` (opcional). Si tu equipo usa otros, cambiá la lista `tools` y las reglas de `permissions` en el frontmatter de cada agente, y los nombres de herramientas que citan las skills. Los nombres de las herramientas de `@github` que figuran en los permisos son estimados: confirmalos contra el servidor MCP que instales.
2. **Skills de otros frameworks.** `qa-automation` cita skills de implementación de cada framework (por ejemplo `pw-implementar`) que viven en el repositorio de automation, no en el playbook. Sumalas a tu repositorio de automation cuando las necesites (ver `00-introduccion/kiro/contratos.md`, sección 9.3).
3. **Steering de la plantilla.** `plantilla-automation/.kiro/steering/pw-proyecto.md` y `pw-code-review.md` se mueven con la plantilla. Ajustalos si cambiás la estructura del proyecto.

### 3.7 Documentos de contexto

| Archivo                                          | Qué hacer                                                                                       |
| :----------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `README.md`                                      | Reescribir la presentación con el nombre de tu proyecto. Conservar la tabla de agentes y skills |
| `CONTRIBUTING.md`                                | Ajustar quién revisa los cambios del playbook y el nombre de la rama principal                  |
| `CHANGELOG.md`                                   | Empezar tu propio historial (`1.0.0`) y borrar el del original                                  |
| `00-introduccion/vision-qa.md`                   | Ajustar la visión de QA de tu equipo                                                            |
| `00-introduccion/presentacion-kiro-qa.html`      | Cambiar los ejemplos si la vas a presentar                                                      |
| `00-introduccion/kiro/decisiones.md`             | Conservar como historia de decisiones del modelo; agregar las tuyas con ID nuevo (`D-90`...)     |
| `.qa-work/`                                      | Vaciar los ejemplos. La carpeta es local de cada QA y está ignorada por Git salvo dos planillas |

## 4. Qué conservar sin tocar

Para no perder tiempo, esto **no se reemplaza** porque no depende del proyecto:

- La estructura de carpetas y los nombres de los archivos (otros documentos los citan).
- La numeración de secciones de `contratos.md` y los IDs `D-xx` de `decisiones.md`.
- Los puntos de control (`[PUNTO DE CONTROL] <nombre> · esperando tu confirmación`) y los modos de los agentes.
- Los procesos de las skills, los criterios de calidad y los casos de aceptación.
- Las reglas de seguridad de datos de `.kiro/steering/qa-seguridad-datos.md`.
- La convención de IDs de casos (`<CLAVE>-<n>-CP<NN>`) y la de ramas y commits.

## 5. Verificación final

Marcá cada punto antes de dar por terminada la adaptación.

- [ ] El script `buscar-datos-de-ejemplo.ps1` da cero en los datos que reemplazaste (o conservás alguno a propósito y lo sabés).
- [ ] `grep` de la palabra "Acme", "Tienda Demo" y "saucedemo" no devuelve nada que no sea intencional.
- [ ] No hay credenciales reales en ningún archivo (`git grep -i password`). Las credenciales del sitio demo ya no existen o están marcadas como públicas.
- [ ] `config/ambientes.ts` no tiene URLs de producción, y `HOSTS_BLOQUEADOS` las cubre.
- [ ] `npm run verificar` y `npx playwright test` pasan en `plantilla-automation/`.
- [ ] El workflow `docs-lint.yml` pasa en un Pull Request de prueba (formato Markdown, enlaces, nombres y secretos).
- [ ] Cada equipo tiene su perfil completo en `05-equipos/`.
- [ ] Un agente de prueba (por ejemplo `qa-maestro` con una HU real) arranca, lee el perfil y no pregunta datos que ya están en la documentación.
- [ ] Alguien que no participó de la adaptación leyó el README y pudo correr la plantilla siguiendo solo ese texto.

## 6. Si tu proyecto usa otras herramientas

El playbook está pensado con Jira, Xray, GitHub y Kiro. Todo es adaptable, pero con distinto costo.

| Si usás...                       | Qué cambia                                                                                                                                    | Costo |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :---- |
| **Otro gestor de tickets** (Azure DevOps, Linear...) | Cambia `@atlassian` por el servidor MCP que corresponda; los campos, estados y JQL de los steering y las skills de sprint y regresión; la clave `PROJ` | Alto  |
| **Otra herramienta de pruebas** (TestRail, Zephyr...) | Cambia el steering `qa-jira-xray`, las skills `qa-carga-xray`, `qa-registro-automatizacion` y la plantilla de casos                       | Alto  |
| **GitLab o Bitbucket**           | Cambia `@github` por su servidor MCP, las skills `qa-crear-pr` y `qa-revisar-pr` (Pull Request pasa a Merge Request en GitLab) y los workflows de CI | Medio |
| **Otro framework de automatización** (Cypress, Selenium, WebdriverIO) | Se reemplaza `plantilla-automation/`; conservá las convenciones (POM, IDs en los títulos, evidencias) y reescribí `pw-proyecto.md` | Medio |
| **Otro asistente de IA que no sea Kiro** | Los documentos siguen sirviendo como procedimientos; se pierden los agentes, los permisos y la carga automática del steering. Ver "Cómo usar el playbook SIN Kiro" en el README | Bajo  |
| **Otro idioma**                  | Hay que traducir los documentos y los mensajes; los nombres de skills y modos pueden quedar tal cual                                           | Alto  |

## 7. Problemas frecuentes al adaptar

| Síntoma                                                      | Causa probable                                                  | Qué hacer                                                                                              |
| :----------------------------------------------------------- | :-------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| El agente pregunta datos que ya están en `05-equipos/`        | El perfil del equipo está incompleto o tiene el formato viejo   | Completar todas las secciones del perfil con la plantilla                                              |
| Un JQL de las skills no devuelve nada                         | El campo o la etiqueta tienen otro nombre en tu Jira            | Ajustar el nombre en el perfil del equipo y en `catalogo-etiquetas.md`                                  |
| `docs-lint` falla por enlaces rotos                           | Renombraste o borraste un archivo que otro documento cita       | Buscar el nombre viejo con el script o con `grep` y actualizar los enlaces                              |
| `docs-lint` falla por nombres                                 | Un archivo `.md` nuevo tiene mayúsculas, tildes o espacios      | Renombrar con minúsculas, números y guiones (ver `CONTRIBUTING.md`)                                    |
| Los tests con sesión fallan todos                             | `tests/auth.setup.ts` no coincide con tu login                  | Adaptar el setup a tu pantalla de login y a lo que ves cuando entra bien                               |
| `TEST_ENV apunta a producción`                                | Se pidió `TEST_ENV=prod`                                        | Usar `qa` o `pre`. La plantilla no permite producción a propósito                                      |
