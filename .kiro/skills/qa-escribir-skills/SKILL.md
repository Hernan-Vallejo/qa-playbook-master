---
name: qa-escribir-skills
description: Crea o corrige una skill del playbook o de un repositorio de automatización aplicando TDD a la documentación - primero una prueba sin la skill para ver qué atajos toma el agente, después la skill mínima con el contrato del playbook y, al final, la misma prueba con la skill hasta que se comporte bien. Usar cuando el QA pide "creá una skill", "esta skill no funciona", "no se dispara", "el agente se saltea pasos", o una retro propone crear o editar una skill. No usar para steerings (contratos §7).
---

# Escribir skills

> **Para qué sirve:** crea o corrige una skill (un procedimiento escrito que Kiro sigue cuando le pedís cierta tarea) probándola antes y después, igual que se prueba el código.
> **Quién lo usa:** cualquier QA o referente del playbook que necesite una skill nueva o arreglar una que no funciona (por ejemplo, el Equipo Delta al sumar una skill para sus specs).
> **Cuándo se usa:** cuando hay que crear una skill, cuando una skill no se activa con los pedidos esperados, cuando el agente se saltea pasos, o cuando una retro (reunión de mejora del equipo) propone crear o editar una skill.

> **Nota:** TDD = *Test-Driven Development*, desarrollo guiado por pruebas: primero se ve fallar algo (RED), después se lo corrige con lo mínimo (GREEN) y al final se pule (REFACTOR). Acá se aplica a la documentación: primero se observa qué hace el agente sin la skill. "Contratos" es `00-introduccion/kiro/contratos.md`, donde están las reglas de cómo se escriben skills, agentes y steerings (reglas fijas que Kiro lee siempre). MCP = *Model Context Protocol*, la conexión de Kiro con herramientas externas como `@atlassian` o `@github`.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Prueba sin la skill, Skill propuesta, Prueba con la skill |
| Archivos en `.qa-work/skills/<nombre-skill>/` | Escribe `01-prueba-base.md`, `02-skill.md`, `03-prueba-final.md` |

> **Ejemplo:** para una skill nueva `qa-revision-accesibilidad`, los borradores van en `.qa-work/skills/qa-revision-accesibilidad/`.

## Propósito

Que toda skill nueva o corregida se active cuando corresponde, siga el contrato del playbook y resista los atajos que un agente toma bajo presión. La skill se escribe contra comportamientos observados, no imaginados.

## Cuándo usarla

- Hay que crear una skill nueva (del playbook o de un framework).
- Una skill existente no se activa con los pedidos esperados.
- El agente se saltea un paso o un punto de control de una skill.
- Una retro o una revisión propone crear o editar una skill.

## Cuándo no usarla

- Hay que crear o ajustar un steering → contratos §7.
- Hay que crear un agente → contratos §6.
- Es un cambio menor de redacción que no altera el comportamiento → editar directamente y subir la versión.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Comportamiento objetivo | Sí | Preguntar qué tiene que lograr la skill que hoy no se logra |
| Dónde vive | Sí | Playbook (`qa-<accion>`) o repositorio del framework (`<prefijo>-<accion>`, por ejemplo `pw-<accion>` para la plantilla Playwright), según contratos §2 |
| Skill existente | Si es una corrección | Pedir la ruta |
| Pedidos con los que se debería activar | Sí | Pedir 3 frases reales de QA |

> **Nota:** la "descripción" de la skill (en el frontmatter, el bloque entre `---` al inicio del archivo) es lo que Kiro lee para decidir si la activa. Por eso hacen falta frases reales con las que un QA la pediría, por ejemplo "armame los casos de prueba del login".

## Contexto que lee

1. Contratos §2 (nombres), §4 (contrato de skill) y §8 (homologación, es decir, los requisitos para pasar de Experimental a oficial).
2. Plantilla `00-introduccion/kiro/plantillas/plantilla-skill.md`.
3. `anti-racionalizacion.md` de esta carpeta.
4. Las skills que se tocan o se parecen, para no duplicar.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | Ninguna obligatoria. Las que use la skill que se escribe, solo para entender su alcance |
| Escritura | Solo archivos: `.qa-work/skills/` y, después del punto de control, la carpeta de la skill |

> **Nota:** esta skill no necesita escribir en `@atlassian` ni en `@github`. Si la propuesta termina en un commit, Kiro solo sugiere el mensaje; el commit lo hace el QA.

## Pasos

0. **Espacio de trabajo.** Crear `.qa-work/skills/<nombre-skill>/` si no existe.
1. **Objetivo.** Escribir en una oración el comportamiento que la skill tiene que lograr y los 3 pedidos con que se debería activar.
2. **Prueba sin la skill (RED).** En una sesión nueva, sin la skill (o con la versión actual si es una corrección), dar una tarea que tiente el atajo que la skill quiere evitar (apuro, "es trivial", dato faltante). Anotar textualmente las excusas y los pasos salteados.
3. **[PUNTO DE CONTROL] Prueba sin la skill · esperando tu confirmación.** Mostrar el escenario, lo que hizo el agente y las excusas observadas. Guardarlo en `01-prueba-base.md`. Esperar OK.
4. **Skill mínima (GREEN).** Escribirla con la plantilla, cubriendo las secciones de contratos §4.1. Cada excusa observada se contrarresta en "Reglas" o en la sección "Anti-racionalización" (ver abajo). Nada que no responda a un comportamiento observado o al contrato.
5. **[PUNTO DE CONTROL] Skill propuesta · esperando tu confirmación.** Mostrar la skill completa (o el diff, es decir, solo lo que cambia), con la versión y el estado. Guardarla en `02-skill.md`. Esperar OK.
6. **Escribir** la skill en su carpeta.
7. **Prueba con la skill (REFACTOR).** Repetir el escenario del paso 2 con la skill. Verificar también que se active con los 3 pedidos. Si aparece una excusa nueva, sumarla y volver al paso 4.
8. **[PUNTO DE CONTROL] Prueba con la skill · esperando tu confirmación.** Mostrar el resultado, guardarlo en `03-prueba-final.md` y esperar OK.
9. Registrar la skill en `decisiones.md` (`00-introduccion/kiro/decisiones.md`, sección 12: una fila nueva con estado Experimental y la fecha) y proponer el mensaje de commit.

## Sección anti-racionalización de una skill

Sección opcional de una skill. Se agrega cuando la prueba sin la skill mostró que el agente se saltea pasos. Va después de "Reglas", con el formato de `anti-racionalizacion.md`:

- La regla central y su grado: **Recomendación con OK del QA** (por defecto) o **Ley de Hierro** (solo seguridad o acciones irreversibles).
- Tabla excusa → realidad, de 4 a 6 filas, con las excusas observadas.
- De 3 a 5 banderas rojas.

> **Nota:** una "racionalización" es una excusa que suena razonable para saltarse una regla. Una "bandera roja" es una frase que delata que el agente está por hacerlo.

## Punto de confirmación

| Punto | Se muestra |
| :--- | :--- |
| Prueba sin la skill | Escenario, comportamiento observado, excusas textuales |
| Skill propuesta | Skill completa o diff, nombre, ubicación, versión y estado |
| Prueba con la skill | Resultado del mismo escenario, activación con los 3 pedidos, excusas nuevas si las hubo |

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

```text
Skill: <nombre> (<ubicación>) — versión <x.y> — Experimental
Excusas contrarrestadas: <n>
Activación: <3 pedidos> → se activa / no se activa
Archivos: <rutas>
Commit sugerido: <CLAVE>: <agrega|ajusta> la skill <nombre>
```

> **Ejemplo:** `Commit sugerido: AUTO-46: agrega la skill qa-revision-accesibilidad`. `<CLAVE>` es la clave del ticket que origina el cambio (por ejemplo una tarea `AUTO-46`). El formato es el de contratos §10: `<CLAVE>: <qué cambia>`, sin tipo ni prefijos adicionales. La skill solo sugiere el mensaje; el commit lo hace el QA.

Siguiente paso sugerido: usarla en casos reales y, para homologarla, cumplir contratos §8.

## Reglas

- No escribir ni editar una skill sin la prueba sin la skill. Sin ella no se sabe contra qué se escribe.
- La descripción dice qué hace y cuándo usarla, con frases reales de QA (contratos §4.1). Es lo que decide si la skill se activa.
- Skill corta: un buen ejemplo vale más que varios mediocres; tablas antes que prosa.
- Al editar una skill existente, subir la versión en su tabla de datos.
- Después de cambiar una descripción, verificar que se siga activando con sus pedidos.
- Sin datos de un equipo: se leen del perfil (contratos §4.2), por ejemplo `05-equipos/alfa.md`, en lugar de escribirlos dentro de la skill.

## Anti-racionalización

**Ley de Hierro:** no se escribe ni se edita una skill sin la prueba sin la skill.

| Excusa | Realidad |
| :--- | :--- |
| "Ya sé qué escribir, me salteo la prueba" | Sin la prueba no sabés qué excusa contrarrestar; la skill queda débil |
| "Quedó larga pero completa" | Las skills largas se ignoran; recortar a lo que responde a lo observado |
| "La descripción explica bien qué hace" | Sin los pedidos con que la pide un QA, no se activa cuando corresponde |
| "La pruebo después en un caso real" | Después nadie la prueba; el error aparece con un QA que no la armó |

Banderas rojas: "no hace falta la prueba", "la dejo larga por las dudas", "después la pruebo".

> **Nota:** esta skill usa el grado "Ley de Hierro" porque una skill sin probar se replica en todo el equipo y es difícil de detectar después.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La skill no se activa | La descripción describe el procedimiento y no los pedidos | Reescribirla con 3 frases reales de QA |
| El agente usa otra skill parecida | Descripciones que se pisan | Agregar "No usar para…" en las dos |
| La prueba con la skill pasa a la primera | Escenario sin presión | Endurecerlo (apuro, dato faltante, "es trivial") y repetir |

## Criterios de calidad

- Cada regla o fila anti-racionalización responde a algo observado o al contrato.
- La skill cumple las secciones de contratos §4.1.
- Se activa con los pedidos esperados y no con los de otras skills.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Skill nueva para el playbook | Prueba sin la skill, skill con la plantilla, prueba final y registro en decisiones |
| 2 | Skill que no se activa | Corrige la descripción y verifica la activación con 3 pedidos |
| 3 | El QA pide saltear la prueba | Explica la Ley de Hierro y no escribe la skill sin ella |
| 4 | Se pide un steering | Deriva a contratos §7 |
| 5 | El QA rechaza la propuesta | No escribe la skill |
