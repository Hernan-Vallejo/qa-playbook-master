# Plantilla de Skill

> **Para qué sirve:** es el molde para escribir una skill nueva: un procedimiento paso a paso que Kiro sigue para una tarea concreta de QA (analizar una HU, cargar casos en Xray, reportar un bug), con sus puntos de control y sus criterios de calidad.
> **Quién lo usa:** el QA que crea o corrige una skill del playbook (se puede apoyar en la skill `qa-escribir-skills`).
> **Cuándo se usa:** cuando una tarea se repite y conviene homologarla para que todos los QA la hagan igual.

Copiar el bloque de abajo en `.kiro/skills/<nombre>/SKILL.md` y completar cada sección. Las reglas del contrato están en [contratos.md](../contratos.md), en la parte que describe las skills.

> **Nota:** una *skill* es un archivo `SKILL.md` dentro de su propia carpeta. El archivo empieza con un bloque de metadatos (el *frontmatter*, entre dos líneas `---`) con los campos `name` y `description`. El `name` debe ser igual al nombre de la carpeta (por ejemplo, la carpeta `qa-analisis-hu` contiene una skill con `name: qa-analisis-hu`). La `description` es lo que Kiro lee para decidir cuándo activar la skill, por eso debe incluir frases que el QA diría en el chat.

> **Nota:** HU = historia de usuario. Un *punto de control* es el momento en que la skill se detiene a mostrar lo que hizo y espera la confirmación explícita del QA antes de seguir. Se escribe como `[PUNTO DE CONTROL] <nombre> · esperando tu confirmación`. `.qa-work/` es la carpeta local donde las skills guardan lo que producen en cada etapa.

```markdown
---
name: qa-<accion>
description: <Qué hace en una oración>. Usar cuando el QA pide "<frase 1>", "<frase 2>" o "<frase 3>". No usar para <caso que no corresponde>.
---

# <Nombre legible de la skill>

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | <los que correspondan de contratos, sección 3.3: Contexto / Análisis / Matriz de cobertura / Casos de prueba / Carga en Xray / Reporte de bug / Re-ejecución / Cierre; o los propios del agente de la skill> |
| Archivos en `.qa-work/<CLAVE-HU>/` | <qué lee y qué escribe> |

## Propósito

<Qué resuelve, en una o dos oraciones.>

## Cuándo usarla

- <Situación 1>
- <Situación 2>

## Cuándo no usarla

- <Situación> → usar `<otra skill>`

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU, tarea o subtarea | Sí | Pedirla |
| Equipo | Sí | Deducirlo del proyecto de la clave y confirmarlo con el QA |
| Profundidad | No | Usar Estándar |
| <Otra> | <Sí/No> | <Acción> |

## Contexto que lee

1. Perfil del equipo: `05-equipos/<equipo>.md`.
2. Documentación funcional: todos los archivos de las carpetas de `04-funcionalidades/` que indica el perfil.
3. Catálogo de etiquetas: `02-qa-funcional/catalogo-etiquetas.md` (si la skill propone etiquetas).
4. Usuario de la sesión: `atlassianUserInfo`.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | <ej. getJiraIssue, searchJiraIssuesUsingJql, xray_get_tests> |
| Escritura (solo después de la confirmación) | <ej. xray_create_test, addOrEditJiraIssueComment> |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md`; crearlos si faltan. Leer el trabajo previo que use esta skill (contratos, sección del espacio de trabajo).
1. <Verbo + qué consulta o qué produce.>
2. <...>
3. **[PUNTO DE CONTROL] <nombre>.** Mostrar <qué>, guardarlo en `<archivo>` (Borrador) y esperar la respuesta del QA. Al aprobar, pasarlo a Aprobado; al publicar, a Publicado. Actualizar `indice.md`.
4. <Escritura, de a una cuando es en el repositorio de Xray.>
5. Verificar lo creado y mostrar el resumen.

## Punto de confirmación

Mostrar:

- <Elemento 1>
- <Elemento 2>

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

<Formato exacto: secciones, tabla o lista de claves creadas con links a https://<tu-sitio>.atlassian.net/browse/CLAVE.>

Firma en publicaciones de Jira: `Elaborado por <USUARIO JIRA> y Kiro`.

Siguiente paso sugerido: `<skill siguiente>`.

## Reglas

- <Restricción propia de esta skill.>

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| <Error> | <Causa> | <Acción> |

## Criterios de calidad

- <Cómo se reconoce una buena salida.>

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | <Caso normal> | <Salida esperada> |
| 2 | <Falta una entrada obligatoria> | Pide el dato y no avanza |
| 3 | <El artefacto ya existe> | Lo reutiliza o avisa; no duplica |
| 4 | <El QA rechaza la propuesta> | No escribe nada |
```

## Cómo completar cada parte

> **Ejemplo:** para una skill que analiza una historia de la Tienda Demo, `name` sería `qa-analisis-hu`, la clave de entrada sería `PROJ-123` y el equipo se deduciría del prefijo `PROJ` y se confirmaría con el QA (por ejemplo, Equipo Alfa para una historia del carrito).

| Parte | Qué va y por qué |
| :--- | :--- |
| Frontmatter (`name`, `description`) | `name` es igual al nombre de la carpeta y empieza con `qa-`. `description` dice qué hace, cuándo usarla (con frases reales del QA) y cuándo no. |
| Tabla de datos | `Estado` empieza en `Experimental`, pasa a `En evaluación` cuando la usa un equipo piloto y a `Homologado` cuando funciona bien con al menos dos equipos o dos QA distintos (estados de contratos, sección 8). `Versión` sube cuando se corrige la skill. `Puntos de control` lista las pausas. `Archivos en .qa-work` dice qué lee y qué escribe. |
| Propósito, Cuándo usarla, Cuándo no usarla | Dejan claro el alcance. Cada "cuándo no" apunta a la skill que sí corresponde. |
| Entradas | Qué necesita la skill y qué hace si falta. Las entradas obligatorias se piden; nunca se inventan. |
| Contexto que lee | Qué archivos del playbook consulta antes de proponer algo. |
| Herramientas MCP | Qué herramientas de los servidores MCP (`@atlassian`, `@github`) usa para leer y cuáles para escribir. La escritura solo ocurre después de la confirmación del QA. |
| Pasos | La secuencia numerada. El paso 0 siempre prepara el espacio de trabajo. Los puntos de control se marcan en negrita con `[PUNTO DE CONTROL]`. |
| Punto de confirmación | Qué se le muestra al QA y con qué pregunta se cierra. |
| Entregable | El formato exacto de la salida, la firma en Jira y la siguiente skill sugerida. |
| Reglas | Restricciones propias de la skill (por ejemplo, "nunca borrar", "una etapa por vez"). |
| Errores conocidos | Fallas ya vistas, su causa y qué hacer. Se completa con la experiencia. |
| Criterios de calidad | Cómo se reconoce una buena salida. |
| Casos de aceptación | Pruebas de la skill misma: qué debe pasar en el caso normal, si falta una entrada, si el artefacto ya existe y si el QA rechaza la propuesta. |
