# Índice general de mi trabajo con Kiro

> **Para qué sirve:** es una planilla personal que resume en un solo lugar todo lo que cada QA tiene en curso en la carpeta `.qa-work/` (historias, sprints, regresiones, automatizaciones, performance y pull requests), para tener trazabilidad de lo que se hace.
> **Quién lo usa:** cada QA, en su copia local del playbook. Kiro puede leerla y actualizarla cuando se lo pedís.
> **Cuándo se usa:** al empezar el día (para saber en qué estado está cada tarea), durante el día (consultas puntuales) y al terminar (para registrar lo hecho).

> **Nota:** `.qa-work/` es el espacio de trabajo de los agentes: cada HU, sprint, regresión o tarea tiene su carpeta con borradores y un `indice.md` propio. HU es *Historia de Usuario*; PR es *Pull Request* (pedido para integrar una rama de código al repositorio principal). Los datos de las tablas de abajo son ejemplos genéricos de la **Tienda Demo** de la empresa ficticia Acme.

| Dato | Valor |
| :--- | :--- |
| QA | `<Nombre>` (ejemplo: Lucía Prueba) |
| Equipo | `<Equipo>` (ejemplo: Equipo Alfa) |
| Modalidad del equipo | `<Funcional / SDD>` (SDD = *Spec-Driven Development*, desarrollo guiado por especificaciones) |
| Última actualización | `<AAAA-MM-DD>` |

Esta planilla resume en un solo lugar todo lo que cada uno tiene en curso en `.qa-work/`. Cada HU, sprint, regresión o tarea tiene además su propia carpeta con su `indice.md`, que crean las skills automáticamente; aquí va una fila por cada una.

La idea es abrir y cerrar el día con esta planilla, para tener trazabilidad de lo que se hace:

| Momento | Qué pedirle a Kiro |
| :--- | :--- |
| Al empezar el día | "Revisá `.qa-work/indice-general.md` y decime en qué estado está cada una de mis tareas y cuál es el siguiente paso" |
| Durante el día | `ESTADO <clave>` al agente que corresponda, para ver una tarea puntual |
| Al terminar el día | "Actualizá `.qa-work/indice-general.md` con el estado de mis carpetas de `.qa-work/` y lo que hicimos hoy" |

También se puede completar a mano.

> **Atención:** esta planilla es personal. Se llena en la copia local y **no se commitea**. Ver "Cómo usar estas planillas" al final.

## Trabajo en curso

Cada fila es una tarea que todavía no terminó. Ejemplo de fila completa (borrala y reemplazala por las tuyas):

| Tipo | Clave | Título | Agente | Etapa actual | Estado | Siguiente paso | Carpeta | Actualizado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| HU | PROJ-123 | Login de usuarios | `qa-maestro` | Matriz de cobertura | Borrador | Confirmar la matriz y pasar a escribir los casos | `.qa-work/PROJ-123/` | 2026-11-02 |
| | | | | | | | | |

Valores de referencia:

- **Tipo:** HU · Sprint · Regresión · Automatización · Performance · PR.
- **Agente:** `qa-maestro` · `qa-sdd` · `qa-sprint` · `qa-regresion` · `qa-automation` · `qa-performance` · `qa-pr` · skill suelta (una skill usada directamente, sin agente).
- **Etapa actual:** el último punto de control (por ejemplo Análisis, Matriz de cobertura, Paquete, FWT, Cierre).
- **Estado:** Borrador · Aprobado · Publicado · Pausado · Terminado.
- **Carpeta:** `.qa-work/<CLAVE-HU>/`, `.qa-work/sprint-<equipo>-<N>/`, `.qa-work/regresion-<equipo>-<release>/`, `.qa-work/<AUTO-XX>/automatizacion/`, `.qa-work/<AUTO-XX>/performance/` o `.qa-work/pr-<repositorio>/`. Ejemplos: `.qa-work/PROJ-123/`, `.qa-work/sprint-alfa-12/`, `.qa-work/regresion-beta-2.4/`, `.qa-work/AUTO-45/automatizacion/`. La estructura completa está en `00-introduccion/kiro/contratos.md`, sección 3.5.

## Terminado

Cuando una tarea se cierra, se mueve su fila acá. "Publicado en" indica dónde quedó el resultado (comentario de Jira, Test Plan, PR, etc.).

| Tipo | Clave | Título | Agente | Cerrado el | Publicado en |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Automatización | AUTO-45 | Casos negativos de login | `qa-automation` | 2026-11-04 | PR de la rama `feature/AUTO-45-login-negativos` |
| | | | | | |

## Cómo usar estas planillas

1. Las planillas `indice-general.md` y `validacion-skills.md` vienen con una fila de ejemplo en el repositorio. El resto de `.qa-work/` no se versiona: es el trabajo local de cada uno.
2. Completarlas en la copia local (reemplazando los ejemplos por tus datos). Para que Git no las muestre como modificadas y no se suban por error, correr una vez en `qa-playbook`:

   ```bash
   # Le dice a Git que ignore los cambios locales de estos dos archivos
   git update-index --skip-worktree .qa-work/indice-general.md .qa-work/validacion-skills.md
   ```

3. Jira y Xray siguen siendo la fuente de verdad. Si esta planilla no coincide con lo publicado, vale lo publicado.
