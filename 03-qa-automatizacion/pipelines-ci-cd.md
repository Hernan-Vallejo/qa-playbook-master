# Pipelines CI/CD con GitHub Actions
> **Para qué sirve:** explicar cómo se ejecutan las pruebas automatizadas en un pipeline de GitHub Actions, con los dos workflows de `plantilla-automation` explicados paso por paso (jobs, steps, variables y artefactos).
> **Quién lo usa:** QA Automation, que mantiene el pipeline, y cualquier QA que necesite entender por qué un PR quedó en rojo o dónde está el reporte.
> **Cuándo se usa:** al configurar la automatización en un repositorio nuevo, al revisar un PR y al analizar una corrida que falló.
> **Nota (siglas):** **CI/CD** = *Continuous Integration / Continuous Delivery*: ejecutar automáticamente, en un servidor, las validaciones de cada cambio de código. **PR** = Pull Request. **Workflow** = archivo YAML que define qué se ejecuta y cuándo. **Job** = conjunto de pasos que corre en una máquina. **Step** = cada paso de un job. **Runner** = la máquina (virtual) donde corre el workflow. **Artefacto** = archivo generado por la corrida (por ejemplo el reporte) que se guarda para descargarlo después.
## Visión general
El playbook usa **GitHub Actions** como única herramienta de CI/CD. GitHub solo ejecuta los workflows que están en la carpeta `.github/workflows/` de la **raíz** de un repositorio, y los ejecuta solos cuando ocurre el evento que declaran.
Este repositorio guarda dos cosas (la documentación del playbook y la plantilla de automatización `plantilla-automation/`), así que hay **dos workflows para la plantilla**. Hacen lo mismo y se usa uno u otro según dónde viva la plantilla:
| Workflow | Cuándo corre de verdad | Qué hace |
| :--- | :--- | :--- |
| `plantilla-automation/.github/workflows/playwright.yml` (nombre en Actions: `Playwright Tests`) | Cuando copiás la plantilla a **su propio repositorio**: allí el archivo queda en la raíz y GitHub lo ejecuta | Instala dependencias, verifica el código (`npm run verificar`), instala los navegadores, corre `npx playwright test` y sube el reporte HTML como artefacto |
| `.github/workflows/automation.yml` (nombre en Actions: `Automation (plantilla)`) | Dentro de **este** repositorio: el de `plantilla-automation/` queda en una subcarpeta y GitHub no lo lee, así que este es el que corre | Hace lo mismo, pero apuntando a la subcarpeta `plantilla-automation/` y solo cuando cambia algo de esa carpeta |
| `.github/workflows/docs-lint.yml` (nombre en Actions: `docs-lint`) | En cada PR hacia `main` de este repositorio | Valida la documentación (ver "Pipeline de documentación del playbook") |
> **Nota:** los frameworks opcionales (Karate, mobile, k6) no están incluidos en la plantilla. Si el equipo los suma, cada uno tendrá su propio workflow en su repositorio, con la misma estructura que se explica abajo (ver "Workflows para otros frameworks").
---
## Workflow 1: `playwright.yml` de la plantilla, paso por paso
Archivo: `plantilla-automation/.github/workflows/playwright.yml`.
> **Nota:** el YAML de abajo reproduce el archivo real con sus comentarios resumidos. Si el archivo de tu copia tiene diferencias (por ejemplo otra versión de Node o ramas distintas), la explicación de cada bloque sigue valiendo. Ante una diferencia manda el archivo del repositorio.
```yaml
name: Playwright Tests            # Nombre que se ve en la pestaña "Actions" de GitHub
on:                               # Eventos que disparan el workflow
  push:
    branches: [main, master]      # Al subir cambios a estas ramas (la principal del repositorio)
  pull_request:
    branches: [main, master]      # Al abrir o actualizar un PR hacia estas ramas
  workflow_dispatch:              # Permite correrlo a mano desde la pestaña Actions
jobs:                             # Lista de trabajos (cada uno corre en su propia máquina)
  test:                           # Nombre del job (acá hay uno solo: "test")
    timeout-minutes: 60           # Si pasa de 60 minutos, GitHub lo corta (evita corridas colgadas)
    runs-on: ubuntu-latest        # Runner: máquina virtual Linux que provee GitHub
    steps:                        # Pasos del job, se ejecutan en orden
      - uses: actions/checkout@v4 # 1. Descarga el código del repositorio en el runner
      - uses: actions/setup-node@v4   # 2. Instala Node.js
        with:
          node-version: lts/*     #    Versión LTS (soporte extendido) de Node
      - name: Install dependencies    # 3. Dependencias exactas de package-lock.json
        run: npm ci
      - name: Verificar código (tipos, lint y formato)   # 4. Controles de calidad antes de abrir navegadores
        run: npm run verificar
      - name: Install Playwright Browsers   # 5. Navegadores y librerías del sistema que necesita Playwright
        run: npx playwright install --with-deps
      - name: Run Playwright tests    # 6. Ejecuta todos los tests
        run: npx playwright test
        env:
          TEST_ENV: demo              # Ambiente a probar ("demo" = sitio público de práctica)
          # HOSTS_BLOQUEADOS: www.mi-empresa.com   (comentado: segunda barrera contra producción)
          BROWSERS: chromium          # Navegadores a usar (uno por proyecto de Playwright)
          # QA_USER: ${{ secrets.QA_USER }}        (comentado: en un proyecto real va como secret)
          # QA_PASSWORD: ${{ secrets.QA_PASSWORD }}
      - uses: actions/upload-artifact@v4   # 7. Sube archivos como artefacto de la corrida
        if: ${{ !cancelled() }}    #    Se ejecuta siempre, aunque los tests hayan fallado (salvo que se cancele la corrida)
        with:
          name: playwright-report  #    Nombre del artefacto que se descarga desde GitHub
          path: playwright-report/ #    Carpeta que se sube (reporte HTML de Playwright)
          retention-days: 30       #    Cuántos días lo conserva GitHub antes de borrarlo
```
### Explicación por bloque
**Encabezado: `name` y `on`**
- `name` es solo una etiqueta. Aparece en la lista de ejecuciones y en los chequeos de cada PR.
- `on` define los disparadores. Con `push` y `pull_request` sobre `main` o `master`, los tests corren cuando se integra código y también en cada PR antes de integrarlo. Así el PR muestra si rompe algo.
- `workflow_dispatch` agrega un botón "Run workflow" en la pestaña Actions para lanzarlo a mano.
- Se puede sumar una regresión programada con `schedule` y una expresión cron (por ejemplo `cron: '0 6 * * 1'` corre los lunes a las 06:00 UTC). La plantilla no la trae: es una opción del equipo (ver "Ejecuciones periódicas").
**`jobs` y el job `test`**
- Un *job* es un conjunto de pasos que corre en una máquina limpia. Si hubiera más de un job correrían en paralelo, salvo que se declare `needs:` para ordenarlos.
- `runs-on: ubuntu-latest` elige la máquina. Linux es la opción más rápida y barata para Playwright.
- `timeout-minutes: 60` es una red de seguridad: sin él, una corrida colgada consumiría minutos hasta el límite por defecto de GitHub, que es mucho mayor.
**`steps`: paso por paso**
| # | Paso | Qué hace | Por qué importa |
| :--- | :--- | :--- | :--- |
| 1 | `actions/checkout@v4` | Clona el repositorio en el runner | Sin esto el runner no tiene el código |
| 2 | `actions/setup-node@v4` con `node-version: lts/*` | Instala Node.js LTS | Playwright y las dependencias necesitan Node |
| 3 | `npm ci` | Instala exactamente lo que dice `package-lock.json` | Es más rápido y reproducible que `npm install`: falla si el lock no coincide con `package.json` |
| 4 | `npm run verificar` | Corre tres controles en cadena: `tsc --noEmit` (tipos de TypeScript), `eslint .` (reglas de código: sin `waitForTimeout`, sin `test.only`, todo test con aserciones) y `prettier --check .` (formato) | Falla rápido y barato, **antes** de abrir navegadores. Un código que no pasa estos controles no llega a ejecutarse. Es lo mismo que el QA corre en su equipo antes de subir la rama |
| 5 | `npx playwright install --with-deps` | Descarga los navegadores y sus dependencias del sistema | El runner no trae los navegadores de Playwright; `--with-deps` instala también las librerías de Linux |
| 6 | `npx playwright test` | Corre todos los proyectos de Playwright: `setup` (inicia sesión y la guarda), `chromium-sin-sesion`, `chromium-con-sesion` y `api` | Es el paso que valida el producto. Si falla, el job queda en rojo y el PR muestra el chequeo fallido |
| 7 | `actions/upload-artifact@v4` | Sube la carpeta `playwright-report/` | Permite descargar el reporte HTML con capturas y trazas, sin tener que reproducir el fallo |
> **Nota:** el nombre `chromium` de los proyectos sale de la variable `BROWSERS`. Con `BROWSERS: chromium,firefox` el paso 6 corre también `firefox-sin-sesion` y `firefox-con-sesion` (ver [guia-plantilla-automation.md](./guia-plantilla-automation.md), sección 4).
**Variables de entorno del paso 6**
| Variable | Qué hace | En el workflow de la plantilla |
| :--- | :--- | :--- |
| `TEST_ENV` | Elige el ambiente (`demo`, `qa` o `pre`) de `config/ambientes.ts`. `prod` corta la ejecución con un error | `demo` |
| `BROWSERS` | Lista de navegadores separados por coma: `chromium`, `firefox`, `webkit` o `movil` | `chromium` |
| `HOSTS_BLOQUEADOS` | Textos que no pueden aparecer en ninguna URL (por ejemplo el dominio de producción); si aparece uno, la ejecución se corta. Segunda barrera contra producción | Comentada: se activa en un proyecto real |
| `QA_USER` y `QA_PASSWORD` | Usuario y clave de prueba | Comentadas: el sitio demo usa credenciales públicas que ya vienen en `data/usuarios.ts` |
| `BASE_URL` y `API_URL` | Pisan las URL del ambiente elegido | No se definen |
**Artefactos**
- Un artefacto es un archivo o carpeta que el workflow guarda al terminar. Acá es el reporte HTML en `playwright-report/`.
- `if: ${{ !cancelled() }}` es clave: sin esa condición, si `npx playwright test` falla, los pasos siguientes se saltean y **justo cuando hace falta el reporte no se sube**.
- `retention-days: 30` limita cuánto tiempo queda disponible. Si el equipo necesita guardar evidencia más tiempo, la copia al repositorio documental (SharePoint o Drive) es responsabilidad del QA, como indica el estándar de evidencias.
---
## Workflow 2: `automation.yml` de la raíz de este repositorio, paso por paso
Archivo: `.github/workflows/automation.yml`.
Es el que corre cuando la plantilla vive **dentro de este repositorio**. Tiene los mismos pasos que el anterior, con estas diferencias:
```yaml
name: Automation (plantilla)      # Nombre que se ve en la pestaña "Actions"
on:
  pull_request:
    branches: [main, master]
    paths:                                    # Solo corre si cambió alguno de estos archivos
      - 'plantilla-automation/**'             #   cualquier archivo de la plantilla
      - '.github/workflows/automation.yml'    #   o este mismo workflow
  push:
    branches: [main, master]
    paths:                                    # Mismo filtro para los push
      - 'plantilla-automation/**'
      - '.github/workflows/automation.yml'
  workflow_dispatch:                          # Ejecución manual
jobs:
  automation:                     # Nombre del job (en el otro workflow se llama "test")
    timeout-minutes: 30           # Corte a los 30 minutos (el otro, a los 60)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: plantilla-automation   # Todos los comandos "run" corren dentro de la carpeta de la plantilla
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm                                              # Guarda en caché las dependencias de npm entre corridas
          cache-dependency-path: plantilla-automation/package-lock.json   # Dónde está el lock (no está en la raíz)
      - name: Install dependencies
        run: npm ci
      - name: Verificar código (tipos, lint y formato)
        run: npm run verificar
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
        env:
          TEST_ENV: demo
          BROWSERS: chromium
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: plantilla-automation/playwright-report/   # Las rutas de "uses" siguen siendo relativas a la raíz del repositorio
          retention-days: 30
```
| Diferencia | Por qué |
| :--- | :--- |
| `paths:` en `pull_request` y `push` | Este repositorio también tiene documentación. Si solo se editó un `.md`, no se gastan minutos de CI corriendo la plantilla |
| `defaults.run.working-directory` | `package.json` y `playwright.config.ts` están en `plantilla-automation/`, no en la raíz |
| `cache: npm` y `cache-dependency-path` | Acelera `npm ci`. Como el `package-lock.json` no está en la raíz, hay que indicar dónde está |
| `path: plantilla-automation/playwright-report/` | `working-directory` solo afecta a los pasos `run`. Los pasos `uses` (como `upload-artifact`) siguen partiendo de la raíz del repositorio |
| `timeout-minutes: 30` y job `automation` | La suite de la plantilla es chica; el corte es más corto. El nombre del job cambia, así que el chequeo del PR se ve como `Automation (plantilla) / automation` |
| No define `HOSTS_BLOQUEADOS` ni credenciales | La plantilla solo prueba el sitio demo público |
> **Atención:** si cambiás un paso del workflow de la plantilla (por ejemplo, agregás una variable), hacé el mismo cambio en **los dos** archivos para que sigan haciendo lo mismo.
### Variables de entorno y credenciales en el pipeline
Para un proyecto real, el paso de los tests lee `TEST_ENV` (o `BASE_URL` y `API_URL`), `HOSTS_BLOQUEADOS`, `QA_USER` y `QA_PASSWORD`:
- Las credenciales **nunca** se escriben en el YAML ni en el repositorio. Se guardan como *secrets* (Settings → Secrets and variables → Actions) y se pasan al paso de tests:
```yaml
      - name: Run Playwright tests
        run: npx playwright test
        env:
          TEST_ENV: qa                                  # ambiente de QA (definido en config/ambientes.ts)
          HOSTS_BLOQUEADOS: ${{ vars.HOSTS_BLOQUEADOS }}  # variable no secreta, por ejemplo www.mi-empresa.com
          BROWSERS: chromium
          QA_USER: ${{ secrets.QA_USER }}               # secreto: usuario de prueba del ambiente QA
          QA_PASSWORD: ${{ secrets.QA_PASSWORD }}       # secreto: clave del usuario de prueba
```
- El sitio demo SauceDemo tiene credenciales públicas (`standard_user` / `secret_sauce`), por eso la plantilla funciona sin configurar nada. Eso solo vale para el sitio demo.
- El pipeline apunta siempre al ambiente de QA o PRE. Nunca a PROD: `config/ambientes.ts` corta la ejecución si `TEST_ENV` es `prod` y, con `HOSTS_BLOQUEADOS`, si alguna URL contiene un texto de producción.
---
## Cómo leer el resultado de una corrida
1. En el PR, la sección "Checks" muestra el estado del workflow (`Playwright Tests` en un repositorio propio, `Automation (plantilla)` en este): verde (pasó), rojo (falló) o amarillo (en curso).
2. Entrar al detalle (Details) muestra cada paso con su log. Si falló `Verificar código (tipos, lint y formato)`, el error es de código (tipo, regla de ESLint o formato): se corrige con `npm run verificar` en tu equipo, y `npm run format` arregla el formato solo. Si falló `Run Playwright tests`, el log indica qué test falló y por qué.
3. Al final de la página de la corrida, en "Artifacts", se descarga `playwright-report`. Se descomprime y se abre `index.html`, o se corre `npx playwright show-report <carpeta>`.
4. Antes de volver a correr, se clasifica el fallo: bug del producto (se reporta con `qa-reporte-bug`), problema del test (se corrige en el PR) o problema del ambiente (se avisa a quien lo administra y se vuelve a correr cuando esté estable).
> **Atención:** reintentar hasta que pase tapa los problemas. Un test que falla a veces es un test inestable y hay que arreglarlo. Un test excluido por un bug o por un problema de ambiente se marca con `@BUG` o `@SKIP_WIP` (ver contratos, sección 9.9); nunca se borra.
### Ejecuciones periódicas
Además del pipeline en cada push y PR (el QA valida ahí su rama antes de integrar), un equipo puede tener un workflow programado (`schedule`) que corre la regresión automatizada cada cierto tiempo. Sus resultados y errores se revisan en una tarea `AUTO-` por ejecución (por ejemplo `AUTO-60 Revisión del workflow semanal`). Los agentes solo **leen** esos resultados: no lanzan corridas (ver contratos, sección 9.9, y decisión D-68). La plantilla no trae este workflow; para sumarlo, se agrega el disparador `schedule` al `on:` del workflow, por ejemplo:
```yaml
on:
  schedule:
    - cron: '0 6 * * 1'   # lunes a las 06:00 UTC
```
> **Ejemplo:** `AUTO-60` es una clave ficticia de una tarea de revisión.
---
## Workflows para otros frameworks
Si el equipo suma frameworks opcionales, el workflow sigue la misma estructura: `checkout`, instalar el entorno, ejecutar, subir el reporte como artefacto.
| Framework | Cambia respecto del workflow de Playwright |
| :--- | :--- |
| Karate (Java + Maven) | En lugar de `setup-node` se usa `actions/setup-java` y se ejecuta `mvn test` con la etiqueta (tag) a correr. Los reportes HTML y JUnit se suben como artefactos |
| Framework mobile | Se necesitan dispositivos: los runners de GitHub no tienen celulares, así que se usa una granja de dispositivos en la nube con sus credenciales como *secrets*. Según el contrato (sección 9.2), mobile no usa el CI del repositorio: el QA ejecuta y pasa el resultado |
| k6 (performance) | Se instala k6 (o se usa su acción oficial) y se ejecuta `k6 run` contra PRE, con umbrales (*thresholds*) que hacen fallar el paso. Se dispara de forma manual (`workflow_dispatch`) o antes de un release, nunca en cada push |
> **Ejemplo (esqueleto de k6, no incluido en la plantilla):**
>
> ```yaml
> name: Performance (k6)
> on:
>   workflow_dispatch:            # solo se ejecuta cuando alguien lo lanza a mano
>     inputs:
>       script:
>         description: 'Script de k6 a ejecutar'
>         required: true
> jobs:
>   k6:
>     runs-on: ubuntu-latest
>     steps:
>       - uses: actions/checkout@v4
>       - uses: grafana/setup-k6-action@v1      # instala k6
>       - run: k6 run ${{ inputs.script }}       # los thresholds del script hacen fallar el paso si no se cumplen
>         env:
>           BASE_URL: ${{ vars.BASE_URL }}       # ambiente PRE; nunca PROD
> ```
---
## Pipeline de documentación del playbook
El repositorio `qa-playbook` tiene su propio workflow, `.github/workflows/docs-lint.yml`, que corre en cada PR hacia `main`. Tiene cuatro jobs independientes y usa las configuraciones de la carpeta `.github/`:
| Job | Qué valida | Archivo de configuración |
| :--- | :--- | :--- |
| `markdownlint` | Formato de los archivos Markdown | `markdownlint-cli2.jsonc` |
| `links` | Enlaces relativos rotos entre documentos (modo sin conexión; los enlaces externos no se validan) | `lychee.toml` |
| `naming` | Convenciones de nombres de archivos y carpetas | `check-naming.sh` (script de bash) |
| `secrets` | Credenciales o tokens filtrados en el código y en el historial de git (herramienta gitleaks) | — |
---
## Resumen de reportes
| Repositorio | Reporte | Dónde se ve |
| :--- | :--- | :--- |
| `plantilla-automation` | Reporte HTML de Playwright | Artefacto `playwright-report` de la corrida en GitHub Actions |
| Karate (opcional) | Reportes HTML y JUnit | Artefactos de la corrida |
| Mobile (opcional) | Panel de la granja de dispositivos | Sitio de la herramienta elegida |
| k6 (opcional) | Resumen en consola, JSON y reporte HTML | Artefactos y, si se configura, un panel de monitoreo |
## Trazabilidad en Jira
Para que una corrida pueda rastrearse hasta su historia:
1. Las ramas y los commits llevan la clave de la tarea: `feature/AUTO-45-login-negativos`, `AUTO-45: agrega casos negativos de login`.
2. El PR menciona la tarea AUTO, la HU (`PROJ-123`) y los casos cubiertos, y la corrida de GitHub Actions que validó la rama.
3. El resultado del pipeline queda en el PR. Si se corre una regresión, el resumen se comenta en el Test Plan correspondiente (por ejemplo "Test Plan Regresión Release 2.4") previa aprobación del QA, como indica el estándar de Jira del equipo.
> **Nota:** el vínculo entre Jira y GitHub se logra por la clave en el nombre de rama, el commit y el PR. Para integraciones más avanzadas se puede usar el servidor MCP `@github` desde Kiro.
