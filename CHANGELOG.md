# Changelog

> **Para qué sirve:** es el registro de los cambios significativos del QA Playbook, ordenado de lo más nuevo a lo más viejo.
> **Quién lo usa:** quien mantiene el playbook (para anotar cambios) y quien lo usa (para saber qué cambió desde la última vez que lo leyó).
> **Cuándo se usa:** se agrega una entrada cada vez que se incorpora, corrige o elimina contenido relevante (documentos, skills, agentes, estándares).

## Cómo leer y escribir este changelog

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el versionado sigue [Semantic Versioning](https://semver.org/lang/es/): `MAYOR.MENOR.PARCHE`.

- **MAYOR:** cambio que rompe la forma de trabajar (por ejemplo, una reorganización de carpetas).
- **MENOR:** contenido nuevo compatible (un documento, una skill o un agente nuevo).
- **PARCHE:** correcciones menores (errores de redacción, links, datos).

Cada versión lleva el encabezado `## [versión] - AAAA-MM-DD` y agrupa los cambios en estas secciones (se usan solo las que apliquen):

| Sección | Qué va ahí |
| :--- | :--- |
| `Agregado` | Contenido nuevo |
| `Cambiado` | Cambios en contenido existente |
| `Corregido` | Errores corregidos |
| `Eliminado` | Contenido que se quitó |

> **Nota:** las fechas van en formato año-mes-día. La versión más nueva se escribe arriba de todo.

---

## [1.1.0] - 2026-11-21

### Plantilla reforzada, revisión de contenido y guía de adaptación

- **Agregado:** `plantilla-automation/` suma clase base `BasePage`, fixtures propios, sesión guardada (`storageState`) con un proyecto `setup`, proyectos por navegador (`BROWSERS`), ambientes con bloqueo de producción (`config/ambientes.ts`, `HOSTS_BLOQUEADOS`), pruebas de API con el cliente de Playwright, ESLint con reglas del equipo, Prettier y el comando `npm run verificar`. Pasa de 13 a 17 tests.
- **Agregado:** workflow de la raíz `.github/workflows/automation.yml`, que corre la plantilla dentro de este repositorio.
- **Agregado:** guía `00-introduccion/adaptar-a-un-proyecto-nuevo.md` y script `scripts/buscar-datos-de-ejemplo.ps1` para encontrar los datos de ejemplo a reemplazar.
- **Cambiado:** revisión de coherencia de agentes, skills, steering y documentos: modos y puntos de control iguales entre agente y skill, definición única de marcadores (`XRAY-PENDIENTE`), veredictos y etiquetas, referencias cruzadas verificadas.
- **Cambiado:** los tests de la plantilla pasan a las carpetas `tests/sin-sesion/`, `tests/con-sesion/` y `tests/api/`.
- **Cambiado:** el repositorio se inicializa con Git (rama `main`) y se documenta su estructura de "dos partes" (playbook y plantilla).

## [1.0.0] - 2026-11-20

### Versión genérica inicial

- Primera versión genérica del playbook, reutilizable por cualquier equipo de QA.
- **Agregado:** documentación de procesos y estándares (`00-introduccion/` a `03-qa-automatizacion/`), reglas de negocio de ejemplo de la Tienda Demo (`04-funcionalidades/`) y perfiles de equipos de ejemplo (`05-equipos/`).
- **Agregado:** configuración de Kiro con 7 agentes, 27 skills y 6 steering (`.kiro/`).
- **Agregado:** plantilla de automatización con Playwright y Page Object Model (`plantilla-automation/`).
- **Agregado:** CI de documentación con GitHub Actions (`.github/workflows/docs-lint.yml`): formato Markdown, links relativos, nombres de archivos y secretos.
