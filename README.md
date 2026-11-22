# QA Playbook

> **Para qué sirve:** es un playbook genérico y reutilizable de QA (aseguramiento de calidad): documenta procesos, estándares, plantillas y reglas de negocio de ejemplo, y trae la configuración de Kiro (agentes, skills y steering) y una plantilla de automatización con Playwright.
> **Quién lo usa:** QA funcionales, QA de automatización, y también líderes técnicos, POs (Product Owners) y desarrolladores que quieran entender cómo se trabaja la calidad.
> **Cuándo se usa:** como referencia diaria, para el onboarding de gente nueva y como punto de partida para armar el playbook de tu propio equipo.

Este repositorio es el **cerebro de QA** de la empresa de ejemplo (la llamamos "Acme"). Todo el contenido gira en torno a un producto ficticio, la **Tienda Demo**: una tienda online con login, catálogo de productos (inventario), carrito y checkout, inspirada en el sitio demo público [SauceDemo](https://www.saucedemo.com/).

> **Nota:** el contenido es genérico. Los nombres de equipos (Alfa, Beta, Gamma, Delta), las claves de Jira (`PROJ`, `AUTO`) y las reglas de negocio son ejemplos. Para usarlo en tu empresa, reemplazalos por los tuyos manteniendo la estructura.

---

## Objetivo

- Centralizar el conocimiento del equipo QA en un único lugar.
- Transferir conocimiento sin depender de personas puntuales.
- Acelerar el onboarding de nuevos QA.
- Estandarizar los procesos de prueba, funcionales y automatizados.
- Ofrecer una base de conocimiento que Kiro (el asistente de IA) pueda consumir para analizar historias de usuario (HU), diseñar casos y validar criterios de calidad.

> **Principio clave:** si no está documentado, no existe. Si Kiro no lo puede leer, no lo puede usar.

---

## Glosario rápido

| Sigla | Significado |
| :--- | :--- |
| **HU** | Historia de usuario: pedido de funcionalidad escrito desde el punto de vista del usuario |
| **DoR** | Definition of Ready: condiciones que debe cumplir una HU para entrar al sprint |
| **DoD** | Definition of Done: condiciones para dar una HU por terminada |
| **SDD** | Spec-Driven Development: desarrollo guiado por especificaciones (se escribe una spec revisable antes de programar) |
| **MCP** | Model Context Protocol: forma estándar de conectar a Kiro con herramientas externas (Jira, GitHub, Figma) |
| **POM** | Page Object Model: patrón de automatización donde cada pantalla tiene una clase con sus localizadores y acciones |
| **E2E** | End to End: prueba de punta a punta de un flujo completo |
| **CI/CD** | Integración y entrega continuas: pipelines que corren solos en cada cambio |
| **PR** | Pull Request: pedido de revisión para integrar una rama en `main` |
| **Test plan** | Documento (en Jira/Xray) que agrupa las pruebas de un sprint o de una regresión |

---

## Kiro como partner de QA

Los archivos de `.kiro/` le enseñan a Kiro cómo trabaja el equipo: cómo interactuar con Jira, qué estándar Gherkin seguir al generar casos, cómo validar DoR y DoD y qué reglas de negocio aplican por funcionalidad. Un agente puede encadenar varias skills; una skill también se puede usar sola.

### Agentes, skills y steering

| Pieza | Qué es | Dónde vive | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Agente** | Un rol que encadena skills, muestra el estado y tiene permisos acotados | `.kiro/agents/` | `qa-maestro`: `ANALIZAR_HU PROJ-123` |
| **Skill** | Un procedimiento concreto con su punto de control. Se puede usar sola, sin agente | `.kiro/skills/<nombre>/SKILL.md` | "creá la tarea de automatización de PROJ-123" |
| **Steering** | Reglas y contexto que Kiro aplica siempre, con agente o sin él | `.kiro/steering/` | `qa-gherkin`, `qa-principios` |

Todos trabajamos en el workspace **QA-WORKSPACE**, con `qa-playbook` siempre abierto. Cómo armarlo, qué agente usar y qué skill sirve para qué: [Cómo trabajamos con Kiro](./00-introduccion/como-trabajamos-con-kiro.md).

> **Ejemplo:** podés pedirle a Kiro "Analizame la HU PROJ-123 y decime si cumple el DoR", "Generame casos Gherkin para el login" o "¿Qué reglas de negocio aplican al carrito?".

---

## Estructura del repositorio

```text
qa-playbook/
├── README.md                    Esta portada
├── CHANGELOG.md                 Registro de cambios del playbook
├── CONTRIBUTING.md              Cómo contribuir (ramas, commits, PR, formato)
├── .gitignore                   Qué archivos no se versionan
├── .github/                     CI de documentación (GitHub Actions + configuración de las validaciones)
├── .kiro/                       Configuración de Kiro
│   ├── agents/                  Los 7 agentes de QA
│   ├── hooks/                   Atajo opcional para iniciar el sprint
│   ├── steering/                Las 6 reglas que Kiro aplica siempre
│   └── skills/                  Las 27 skills (una carpeta por skill, cada una con SKILL.md)
├── .qa-work/                    Espacio de trabajo de ejemplo de los agentes (local, casi todo ignorado por git)
├── 00-introduccion/             Visión del QA y forma de trabajo con Kiro
│   └── kiro/                    Contratos, decisiones y plantillas de los componentes de Kiro
├── 01-estandares-globales/      DoR, DoD y proceso del test plan de regresión
├── 02-qa-funcional/             Proceso del QA funcional, etiquetas, estructura y plantillas de test plan
├── 03-qa-automatizacion/        Proceso de automatización, repositorios, pipelines, performance y guía de la plantilla
├── 04-funcionalidades/          Reglas de negocio de la Tienda Demo por funcionalidad
│   ├── vision-cliente/          Funcionalidades del comprador
│   │   ├── 01-acceso/           Login y usuarios bloqueados
│   │   ├── 02-catalogo/         Inventario, productos, orden y filtros
│   │   ├── 03-carrito/          Agregar, quitar y contador del carrito
│   │   ├── 04-checkout/         Datos del comprador, resumen y confirmación
│   │   └── 05-pedidos-sdd/      Ejemplo completo de trabajo con SDD (épica PROJ-40, historia PROJ-142)
│   └── vision-administracion/   Reglas de negocio de la administración de la tienda
├── 05-equipos/                  Un perfil por equipo (Alfa, Beta, Gamma, Delta) y su índice
├── scripts/                     Utilidades para adaptar el playbook (buscar datos de ejemplo)
└── plantilla-automation/        Plantilla de automatización Playwright + Page Object Model (ver su README.md)
```

---

## Cómo usar el playbook CON Kiro

1. **Instalá Kiro** y armá el workspace `QA-WORKSPACE` con `qa-playbook` siempre abierto (los pasos están en [Cómo trabajamos con Kiro](./00-introduccion/como-trabajamos-con-kiro.md)).
2. **Conectá los servidores MCP** que necesites: `@atlassian` (Jira y Xray), `@github` y, opcionalmente, `@figma`.
3. **Elegí un agente** según lo que vas a hacer: una HU (`qa-maestro`), una HU de un equipo SDD (`qa-sdd`), el sprint (`qa-sprint`), una regresión (`qa-regresion`), automatización (`qa-automation`), performance (`qa-performance`) o Pull Requests (`qa-pr`).
4. **O invocá una skill directamente**, por ejemplo "diseñá los casos de PROJ-123" (`qa-diseno-casos`).
5. **Respondé los puntos de control.** Cada skill se detiene en `[PUNTO DE CONTROL] <nombre> · esperando tu confirmación` y nada se publica en Jira, Xray o GitHub sin tu confirmación.
6. **Revisá los resultados.** Los agentes guardan su trabajo en `.qa-work/<CLAVE>/`.

## Cómo usar el playbook SIN Kiro

Los documentos son Markdown común y sirven sin ninguna herramienta de IA:

- **Leyéndolos a mano:** `01-estandares-globales/` (DoR y DoD), `02-qa-funcional/` (proceso, etiquetas, plantillas de test plan en HTML), `03-qa-automatizacion/` y `04-funcionalidades/` (reglas de negocio) funcionan como una guía de proceso y un checklist de revisión.
- **Leyendo las skills como procedimientos:** cada `.kiro/skills/<nombre>/SKILL.md` es un paso a paso con sus entradas, pasos, criterios de calidad y puntos de control. Podés seguirlo manualmente.
- **Pegándolos en otro asistente de IA:** copiá el contenido de una skill o de un steering (por ejemplo `qa-gherkin.md`) al inicio de la conversación en el asistente que uses, y sumá el documento de reglas de negocio de la funcionalidad. El asistente va a seguir el mismo método, aunque no tendrá las conexiones MCP: los datos de Jira y Xray los tenés que pegar vos.
- **Usando la plantilla de automatización:** `plantilla-automation/` funciona con Node.js y Playwright, sin Kiro.

> **Nota:** lo que se pierde sin Kiro es la automatización de los pasos (leer Jira, crear tests en Xray, guardar en `.qa-work/`) y los permisos acotados de cada agente.

---

## Quick start de la plantilla de automatización

`plantilla-automation/` es un proyecto Playwright con Page Object Model que prueba el sitio demo público https://www.saucedemo.com/ y una API pública de práctica. Trae fixtures, sesión guardada, proyectos por navegador, ambientes con bloqueo de producción, ESLint, Prettier y un workflow de CI. Detalle completo en su [README](./plantilla-automation/README.md) y en la [guía de la plantilla](./03-qa-automatizacion/guia-plantilla-automation.md).

```bash
cd plantilla-automation
npm ci                                                  # instala las dependencias
npx playwright install                                  # descarga los navegadores
npx playwright test                                     # corre todos los tests (17: sesión, web y API)
npx playwright test tests/sin-sesion/login.spec.ts      # corre un solo archivo
npx playwright test --project=api                       # corre solo los tests de API
npx playwright test --headed                            # corre viendo el navegador
npm run verificar                                       # tipos, ESLint y Prettier
npx playwright show-report                              # abre el reporte HTML
```

Variables de entorno opcionales (modelo en `plantilla-automation/.env.example`): `TEST_ENV`, `BASE_URL`, `API_URL`, `HOSTS_BLOQUEADOS`, `BROWSERS`, `HEADLESS`, `SLOW_MO`, `BROWSER_CHANNEL`, `QA_USER`, `QA_PASSWORD`. Las credenciales del sitio demo (`standard_user` / `secret_sauce`) son públicas; en un proyecto real van en variables de entorno o en los secretos del CI, nunca en el código.

---

## Un repositorio con dos partes

Este repositorio guarda dos cosas que se pueden separar:

| Parte | Carpeta | Qué es | Cómo se usa sola |
| :--- | :--- | :--- | :--- |
| Playbook | Todo menos `plantilla-automation/` | Documentación, procesos, plantillas y configuración de Kiro | Copiá la carpeta a tu repositorio de documentación |
| Plantilla de automation | `plantilla-automation/` | Proyecto Playwright listo para correr | Copiá la carpeta a un repositorio nuevo; allí su `.github/workflows/playwright.yml` queda en la raíz y funciona |

Dentro de este repositorio, los workflows que corren son los de la raíz (`.github/workflows/`): `docs-lint.yml` valida la documentación y `automation.yml` valida y prueba la plantilla.

## Llevarlo a tu proyecto

Seguí la guía [Adaptar a un proyecto nuevo](./00-introduccion/adaptar-a-un-proyecto-nuevo.md): qué archivos reemplazar, cuáles conservar y cómo encontrar todos los datos de ejemplo con el script `scripts/buscar-datos-de-ejemplo.ps1`.

---
## Los 7 agentes

| Agente | Qué hace |
| :--- | :--- |
| `qa-maestro` | QA funcional de una HU: análisis, diseño de casos, carga en Xray, bugs, re-ejecución y cierre |
| `qa-sdd` | HU de equipos con SDD: revisión de la spec, casos, paquete para desarrollo, FWT, ejecución con auditoría y cierre |
| `qa-sprint` | Nivel sprint: crea el test plan al inicio, muestra el avance y genera el informe de cierre |
| `qa-regresion` | Regresión de release: arma el alcance y el test plan de regresión y emite el informe con veredicto |
| `qa-automation` | Automatización: planifica, implementa, repara y registra en Xray los tests con Playwright y POM |
| `qa-performance` | Pruebas de performance: análisis, plan, implementación, corridas en PRE e informe |
| `qa-pr` | Pull Requests de repositorios de QA: revisa y comenta, o crea el PR con el formato homologado |

## Las 27 skills

| Skill | Qué hace |
| :--- | :--- |
| `qa-actualizar-contexto` | Propone cambios a la documentación funcional del playbook con lo aprendido en una HU o análisis |
| `qa-analisis-hu` | Analiza una HU: DoR, riesgos, impacto, regresión y cobertura existente |
| `qa-auditar-ejecucion` | Verifica con la evidencia que cada caso en PASS validó de verdad el resultado esperado |
| `qa-carga-xray` | Carga en Xray los casos aprobados, con Test Set, Test Execution y vínculos |
| `qa-cierre-hu` | Evalúa el cierre de QA de una HU y propone el comentario de cierre |
| `qa-crear-pr` | Crea el Pull Request de una rama de un repositorio de QA con el formato homologado |
| `qa-crear-tarea-automatizacion` | Crea en el tablero `AUTO` la tarea de automatización de una o varias HU |
| `qa-diseno-casos` | Diseña la matriz de cobertura y los escenarios Gherkin de una HU |
| `qa-escribir-skills` | Crea o corrige una skill aplicando TDD a la documentación |
| `qa-informe-regresion` | Genera el informe de regresión con métricas y veredicto de salida |
| `qa-informe-sprint` | Genera el informe de cierre de QA del sprint |
| `qa-inicio-sprint` | Arranca el sprint de QA: analiza HU y crea el test plan del sprint |
| `qa-performance-analisis` | Analiza el pedido de performance y arma el perfil operacional y el modelo de carga |
| `qa-performance-informe` | Analiza cada corrida de performance y arma el informe final |
| `qa-performance-plan` | Arma el plan de una prueba de performance |
| `qa-plan-automatizacion` | Decide qué casos se reutilizan, extienden, automatizan de cero o no se automatizan |
| `qa-preparar-regresion` | Prepara la regresión de un release: alcance, test plan, sets y ejecuciones |
| `qa-reejecucion` | Crea una nueva ejecución (`#2`, `#3`) de los tests de una HU |
| `qa-registro-automatizacion` | Registra en Xray lo automatizado y reemplaza los IDs provisorios por la clave real |
| `qa-reporte-bug` | Redacta y crea un bug en Jira con severidad, ambiente y vínculos |
| `qa-revisar-pr` | Revisa un Pull Request de QA y publica comentarios con confirmación |
| `qa-revision-casos` | Revisa la calidad de casos de prueba existentes y propone correcciones |
| `qa-sdd-cobertura-dev` | Arma la propuesta de cobertura que debería cubrir desarrollo en una HU SDD |
| `qa-sdd-fwt` | Revisión estática (Functional Walkthrough) del código de una HU SDD antes del deploy a QA |
| `qa-sdd-plan-datos` | Arma el plan de datos de prueba de una HU SDD |
| `qa-sdd-revision-spec` | Revisa la especificación SDD de una HU y dice qué falta para escribir casos |
| `qa-seguimiento-sprint` | Muestra el avance del sprint y actualiza el test plan |

---

## Cómo usar este repositorio

- **Como QA:** usalo como referencia diaria y consultalo antes de analizar una HU o diseñar casos.
- **Como contribuidor:** es una wiki viva; toda mejora al proceso debe reflejarse acá. Leé [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Qué cambió:** mirá el [CHANGELOG](./CHANGELOG.md).

Cada Pull Request pasa por un CI de documentación (`.github/workflows/docs-lint.yml`) que valida formato Markdown, links relativos, nombres de archivos y secretos.

## Herramientas del equipo

- **Fuente de verdad:** este repositorio (`qa-playbook`).
- **Gestión de pruebas:** Jira + Xray.
- **Repositorio y CI:** GitHub + GitHub Actions.
- **Automatización:** Playwright (incluido en `plantilla-automation/`). Karate (API), k6 (performance) y mobile son frameworks que el equipo puede sumar y no vienen incluidos en la plantilla.
