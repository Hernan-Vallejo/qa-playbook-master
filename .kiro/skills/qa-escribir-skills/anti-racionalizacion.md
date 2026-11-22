# Plantilla de anti-racionalización

> **Para qué sirve:** es una plantilla y un banco de ejemplos para agregar a una skill una sección que impide que el agente se saltee pasos con excusas.
> **Quién lo usa:** quien escribe o corrige una skill con `qa-escribir-skills`, y el propio agente cuando arma la sección.
> **Cuándo se usa:** cuando la prueba sin la skill mostró que el agente se saltea reglas bajo presión (apuro, "es trivial", datos faltantes).

Referencia de `qa-escribir-skills`. Se usa en cualquier skill que deba resistir que el agente se saltee pasos bajo presión.

> **Nota:** una *skill* es un procedimiento escrito que Kiro sigue cuando le pedís una tarea. "Contratos" es `00-introduccion/kiro/contratos.md`, con las reglas de cómo se escriben skills, agentes y steerings.

## Qué es

Una **racionalización** es una excusa que suena razonable pero sirve para saltarse una regla de la skill. Bajo presión (tiempo, frustración, "esto es trivial") un agente tiende a justificar el atajo en vez de seguir el procedimiento.

> **Ejemplo:** el agente piensa "es solo un comentario en Jira, lo publico directo". Suena razonable, pero se salta el punto de control donde el QA tiene que confirmar el texto.

La sección tiene tres partes:

1. **Regla central** y su grado de obligatoriedad.
2. **Tabla excusa → realidad**, que refuta las justificaciones observadas.
3. **Banderas rojas**: frases que delatan que se está por racionalizar.

## Bloque para copiar en una skill

Va después de "Reglas". Breve: una regla, de 4 a 6 filas y de 3 a 5 banderas rojas.

```markdown
## Anti-racionalización

**<Recomendación con OK del QA | Ley de Hierro>:** <regla central de la skill>.

| Excusa | Realidad |
| :--- | :--- |
| "<excusa observada 1>" | <refutación concreta> |
| "<excusa observada 2>" | <refutación concreta> |

Banderas rojas: "<frase 1>", "<frase 2>", "<frase 3>".
```

> **Nota:** cómo completar el bloque. `<Recomendación con OK del QA | Ley de Hierro>` es el grado (se elige uno, ver la tabla siguiente). `<regla central de la skill>` es la única regla que no se puede saltear, en una oración. Cada fila de la tabla lleva una excusa tal como se observó en la prueba sin la skill (entre comillas) y una refutación concreta, no genérica. Las banderas rojas son frases cortas que el agente suele decir justo antes de saltarse la regla.

## Grados de obligatoriedad

| Grado | Cuándo | Comportamiento |
| :--- | :--- | :--- |
| **Recomendación con OK del QA** | Por defecto | La skill propone, explica el beneficio, pide OK explícito y sigue según la respuesta |
| **Ley de Hierro** | Solo seguridad o acciones irreversibles | La skill no avanza hasta que se cumpla la regla. Ejemplos: no commitear secretos, no borrar en Jira o Xray, no publicar sin el punto de control |

Regla de oro: nada destructivo ni irreversible sin OK explícito del QA (`qa-principios`, control del QA).

> **Nota:** `qa-principios` es el steering (`.kiro/steering/qa-principios.md`) con los principios generales del QA. Xray es la herramienta de gestión de pruebas integrada con Jira. Un "punto de control" es una pausa donde Kiro muestra lo que va a hacer y espera confirmación.

## Banco de excusas

Elegir las que apliquen y adaptarlas a lo observado.

### Diagnóstico y reparación

| Excusa | Realidad |
| :--- | :--- |
| "Probá cambiar X a ver si anda" | Cambiar a ciegas no es diagnóstico; primero reproducir y aislar la causa |
| "Es un quick fix, después lo vemos" | Un fix sin causa raíz suele reabrir el problema |
| "Falla por el entorno" | Es una hipótesis: verificarla antes de descartarla |
| "Ya casi está, un cambio más" | Son 2 intentos como máximo (contratos §9.9); después se avisa al QA para que lo verifique a mano |
| "Ajusto el assert y pasa" | Un test que pasa sin validar el caso es un falso positivo |

> **Nota:** un *assert* (o aserción, `expect` en Playwright) es la comprobación del resultado esperado dentro de un test. Si se la cambia para que el test pase, el test deja de detectar el defecto. "Quick fix" es un arreglo rápido sin buscar la causa.

### Revisión

| Excusa | Realidad |
| :--- | :--- |
| "El código se ve bien, lo apruebo" | "Se ve bien" no es evidencia; cada observación cita archivo y línea |
| "Es obvio que cumple el caso" | Lo obvio también se verifica contra el caso |
| "Lo reviso rápido, confío en el autor" | La confianza no reemplaza leer el diff completo |

> **Nota:** el *diff* es la lista de cambios de un Pull Request (PR) o commit, es decir, lo que se agregó y se quitó respecto de la versión anterior.

### Publicación en Jira, Xray o GitHub

| Excusa | Realidad |
| :--- | :--- |
| "Es solo un comentario, lo publico" | Todo lo publicado pasa por el punto de control |
| "Ya me dijo que sí antes" | La confirmación vale solo para lo que se mostró; si cambió, se vuelve a pedir |
| "Lo creo y si está mal lo borro" | No se borra; se evita el error antes de escribir |

### Escritura de skills

| Excusa | Realidad |
| :--- | :--- |
| "Ya sé qué escribir, me salteo la prueba" | Sin la prueba no sabés qué excusa contrarrestar |
| "Quedó larga pero completa" | Las skills largas se ignoran |

## Banderas rojas genéricas

- "por ahora…"
- "después lo arreglo / lo veo / lo pruebo"
- "seguro es [causa no verificada]"
- "es trivial, no hace falta [paso]"
- "probá cambiar [algo] a ver"
- "confío en que está bien"

Al detectar una: detenerse, nombrar la regla que se estaba por saltar y retomar el procedimiento.

> **Nota:** esta lista es genérica. Las banderas rojas de una skill concreta deben salir de lo que se observó en su prueba sin la skill, no copiarse tal cual de acá.
