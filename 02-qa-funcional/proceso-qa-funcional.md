# Guía de Trabajo del QA Funcional con Kiro

> **Para qué sirve:** explica cómo trabaja un QA funcional en el día a día con Kiro y `qa-playbook`: qué configurar una vez, cómo se usa cada agente, cuándo conviene una skill suelta y qué hacer en cada punto de control.
> **Quién lo usa:** el QA funcional de cualquier equipo (Alfa, Beta, Gamma o Delta).
> **Cuándo se usa:** al incorporarse al equipo (secciones 1 y 2) y como consulta durante el sprint (secciones 3 a 8).

**Glosario rápido:**

- **Kiro:** el asistente de IA con el que se trabaja. **Agente:** una configuración de Kiro con un rol y permisos acotados (por ejemplo `qa-maestro`). **Skill:** un procedimiento reutilizable que Kiro sigue paso a paso.
- **MCP** (*Model Context Protocol*): el mecanismo con el que Kiro se conecta a herramientas externas, como Jira o GitHub.
- **HU:** historia de usuario. **PO:** Product Owner. **DoD:** *Definition of Done*, los criterios para dar una HU por terminada.
- **Test Plan, Test Set y Test Execution:** objetos de Xray. El plan agrupa el trabajo de un sprint o release, el set agrupa tests y la ejecución registra resultados.
- **Gherkin:** formato "Dado/Cuando/Entonces" (Given/When/Then) para escribir casos de prueba.

Para entender el modelo completo (niveles, piezas, reglas) ver [Cómo trabajamos con Kiro](../00-introduccion/como-trabajamos-con-kiro.md).

> **Ejemplo que se usa en toda la guía:** el producto es **Tienda Demo** (login, catálogo, carrito y checkout), el proyecto de Jira es `PROJ` y la HU de ejemplo es `PROJ-123`.

---

## 1. Antes de empezar (una sola vez)

### 1.1 Workspace

- Abrir siempre `qa-playbook` en Kiro, dentro del workspace `QA-WORKSPACE`.
- Sumar un repositorio de automatización (por ejemplo `plantilla-automation`) solo si la tarea lo necesita.
- Trabajar en una sesión nueva por HU o por tarea grande. Ayuda a que Kiro no mezcle contextos y consume menos créditos.

### 1.2 MCP

Configurar en `~/.kiro/settings/mcp.json`, cada uno con sus credenciales:

| MCP | Para qué | Cómo verificarlo |
| :--- | :--- | :--- |
| `@atlassian` | Jira y Xray: HU, bugs, comentarios, tests, sets, ejecuciones y Test Plans | Pedir "traeme la HU PROJ-123" y "buscá en Xray los tests de PROJ-123" |
| Repositorio documental (SharePoint, Drive u otro, **con escritura**) | Carpetas y links de evidencias | Pedir "listá la carpeta de evidencias de mi equipo" |
| `@figma` | Leer diseños de Figma (opcional) | Pedir el nodo de un link de Figma |
| `@github` | Repositorios de automatización y Pull Requests | Opcional para el QA funcional |

Figma: [configurar el token](../03-qa-automatizacion/configurar-figma-mcp.md).

> **Nota:** el archivo `mcp.json` guarda la configuración de cada servidor MCP. Las credenciales van en variables de entorno o en el gestor de secretos de cada herramienta, nunca dentro del playbook.

Kiro nunca pide ni escribe credenciales. Si una herramienta no responde, revisar el `mcp.json` y reconectar el servidor desde el panel de MCP.

### 1.3 Perfil del equipo

Revisar el perfil del equipo en [05-equipos](../05-equipos/indice-equipos.md). Los datos marcados "Por completar" se pueden cargar a mano o dejar que Kiro los pregunte la primera vez y proponga guardarlos. Los cambios al perfil se suben por Pull Request (PR).

---

## 2. Dos formas de trabajar

| | Con un agente | Con una skill suelta |
| :--- | :--- | :--- |
| **Cuándo** | El trabajo del día a día: arrancar el sprint, llevar una HU de punta a punta, preparar una regresión | Una tarea puntual: solo analizar, solo reportar un bug, solo revisar casos |
| **Cómo se usa** | Elegir el agente en el selector de agentes del chat y escribir el modo y la clave | Pedirlo en el chat ("analizá la HU PROJ-123") o escribir `/` y el nombre de la skill |
| **Qué agrega** | Encadena las etapas, muestra el recorrido, verifica el Test Plan del sprint y limita los permisos (no puede borrar; pide aprobación para escribir) | Nada extra: ejecuta el procedimiento y se detiene en sus puntos de control |
| **Recomendado para** | Todos los QA, siempre que sea posible | QA que ya conocen el flujo y necesitan una sola etapa |

En las dos formas el procedimiento es el mismo y el resultado se guarda en `.qa-work/`. Se puede empezar con una skill suelta y seguir después con el agente: retoma desde lo guardado.

---

## 3. El día a día con los agentes

> **Nota:** un **punto de control** es un momento en que Kiro se detiene, te muestra lo que armó y espera tu confirmación antes de seguir o de escribir en una herramienta externa. Se explica en detalle en la sección 5.

### 3.1 Inicio del sprint: agente `qa-sprint`

Al terminar la Planning (reunión de planificación del sprint), una vez por equipo. Lo hace el responsable del Test Plan.

```text
INICIO_SPRINT Equipo Alfa
```

También se puede usar el atajo opcional `/inicio-sprint Equipo Alfa` (un hook que lanza este mismo modo; ver `.kiro/hooks/qa-inicio-sprint.json`). Se indica el equipo y no la clave del proyecto, porque en este playbook los cuatro equipos comparten el proyecto `PROJ` y se distinguen por su etiqueta (`alfa`, `beta`, `gamma`, `delta`).

| Punto de control | Qué revisar |
| :--- | :--- |
| [PUNTO DE CONTROL] Planificación del sprint | HU con y sin pruebas, QA de cada HU, pendientes del sprint anterior, bugs a verificar, riesgos iniciales |
| [PUNTO DE CONTROL] Test Plan | Nombre, responsable, secciones con contenido, carpetas de evidencias y subtareas QA a cancelar |

Resultado: el Test Plan del sprint creado en Xray (por ejemplo "Test Plan Sprint 12 - Equipo Alfa"), las carpetas de evidencias en el repositorio documental y el reparto de las HU.

### 3.2 Trabajar una HU: agente `qa-maestro`

Para cada HU o subtarea QA. Se puede ir etapa por etapa o pedir el flujo completo.

**Flujo completo:**

```text
QA PROJ-123
```

**Por etapas:**

| Etapa | Pedido | Punto de control | Qué revisar |
| :--- | :--- | :--- | :--- |
| Análisis | `ANALIZAR_HU PROJ-123` | [PUNTO DE CONTROL] Contexto · [PUNTO DE CONTROL] Análisis | Fuentes y Swagger vigente. Readiness (si la HU está lista para diseñar casos), riesgos, preguntas al PO, cobertura existente, regresión recomendada. Si se publica el comentario y el campo QA Análisis |
| Diseño | `GENERAR_TESTS PROJ-123` | [PUNTO DE CONTROL] Matriz de cobertura · [PUNTO DE CONTROL] Casos de prueba | **Qué se va a probar y qué no** (antes de escribir). Luego el Gherkin, las etiquetas, Regresión y Automatizado |
| Carga | `CARGAR_XRAY PROJ-123` | [PUNTO DE CONTROL] Carga en Xray | Lista exacta de tests, Test Set, Test Execution, vínculos, evidencias |
| Ejecución | (manual, en Xray) | n/a | Ejecutar y subir evidencias a la carpeta de la HU en el repositorio documental |
| Auditoría (opcional) | `AUDITAR_EJECUCION PROJ-123` | [PUNTO DE CONTROL] Auditoría de la ejecución | Que cada test en PASS haya validado de verdad su resultado esperado, con la evidencia. Se recomienda antes del cierre cuando hay tests automatizados |
| Bug | `REPORTAR_BUG PROJ-123` + captura o JSON | [PUNTO DE CONTROL] Reporte de bug | Severidad, pasos, esperado y actual, vínculos |
| Re-test | `REEJECUTAR PROJ-123` | [PUNTO DE CONTROL] Re-ejecución | Tests incluidos, sufijo #2/#3, bug de origen |
| Cierre | `CIERRE_HU PROJ-123` | [PUNTO DE CONTROL] Cierre | Resultado del DoD, comentario de cierre, subtarea de ejecución, riesgos |

> **Nota:** la **matriz de cobertura** es una tabla que relaciona cada criterio de aceptación con los casos que lo prueban. Sirve para acordar el alcance antes de escribir los casos.

**Otros modos:**

| Pedido | Para qué |
| :--- | :--- |
| `ESTADO PROJ-123` | Ver en qué etapa está la HU y qué falta |
| `VALIDAR_TESTS PROJ-123` | Revisar la calidad de los casos de una HU o de una funcionalidad |
| `ACTUALIZAR_DOCUMENTACION PROJ-123` | Llevar al playbook las reglas o contratos que aparecieron en la HU |

Si el Test Plan del sprint no existe, `qa-maestro` se detiene y pide crearlo con `qa-sprint`.

### 3.3 Durante el sprint: agente `qa-sprint`

```text
SEGUIMIENTO Equipo Alfa
```

Muestra el avance de cada HU, los tests por estado y los bugs abiertos. Propone actualizar los riesgos, sumar HU no planificadas y completar vínculos faltantes en el Test Plan. Útil antes de la daily (reunión diaria del equipo) o cuando aparece un riesgo.

| Punto de control | Qué revisar |
| :--- | :--- |
| [PUNTO DE CONTROL] Avance del sprint | Tablero: etapa de cada HU, tests por estado, bugs abiertos, trazabilidad, riesgos |
| [PUNTO DE CONTROL] Actualización del Test Plan | Sección antes y después (riesgos, HU no planificadas, reparto) y vínculos a crear |

### 3.4 Cierre del sprint: agente `qa-sprint`

```text
CIERRE_SPRINT Equipo Alfa
```

Calcula las métricas con Xray, arma el informe con semáforo (`GO`, `GO WITH RISKS` o `NO GO`, escrito en texto), el resumen del trabajo de cada QA y los pendientes para el sprint siguiente, y propone publicarlo en el Test Plan.

| Punto de control | Qué revisar |
| :--- | :--- |
| [PUNTO DE CONTROL] Informe del sprint | Métricas, bugs por severidad, criterios de salida, semáforo, texto de las secciones 11 y 13 y si se transiciona el plan a Finalizada |

### 3.5 Salida productiva: agente `qa-regresion`

Solo cuando hay un release (versión que sale a producción).

```text
PREPARAR_REGRESION Equipo Beta release 2.4
```

| Punto de control | Qué revisar |
| :--- | :--- |
| [PUNTO DE CONTROL] Alcance del release | Épicas, HU, funcionalidades y flujos incluidos o excluidos |
| [PUNTO DE CONTROL] Selección de tests | Tests con Regresión = Sí, separados por Automatizado (`SI` = suite automatizada, `NO` = manual), tests sin campo Automatizado y gaps (funcionalidades del alcance sin tests de regresión) |
| [PUNTO DE CONTROL] Test Plan de regresión | Plan, Test Sets y Test Executions manual y automatizado, vínculos, carpeta |

Al terminar la ejecución (la hace el QA, o la suite automatizada en el pipeline; el agente no ejecuta pruebas):

```text
INFORME_REGRESION Equipo Beta release 2.4
```

| Punto de control | Qué revisar |
| :--- | :--- |
| [PUNTO DE CONTROL] Informe de release | Métricas por conjunto (automatizado, manual y total), bugs y bugs diferidos con acuerdo del PO, performance, riesgos y veredicto |

El veredicto del informe es `GO`, `GO WITH RISKS` o `NO GO`; las reglas para elegirlo están en la skill `qa-informe-regresion`. Ver [proceso de Test Plan de regresión](../01-estandares-globales/proceso-test-plan-regresion.md) y [estructura de los Test Plans](./estructura-test-plan.md).

---

## 4. Skills sueltas

Cada skill se puede usar sin agente. Se activa al pedir la tarea con palabras parecidas a las de la tabla, o escribiendo `/` y el nombre.

| Skill | Pedidos que la activan | Resultado |
| :--- | :--- | :--- |
| `qa-analisis-hu` | "analizá la HU", "¿está lista?", "qué riesgos tiene" | Análisis y comentario propuesto |
| `qa-diseno-casos` | "diseñá los casos", "generá los tests", "armá el CSV" | Matriz y casos en Gherkin |
| `qa-carga-xray` | "subí los tests", "creá el Test Set y la Test Execution" | Tests, set, ejecución y vínculos en Xray |
| `qa-auditar-ejecucion` | "auditá la ejecución", "¿los PASS son reales?" | Veredicto por test y comentario propuesto |
| `qa-reporte-bug` | "reportá el bug", "cargá el defecto" | Bug en Jira |
| `qa-reejecucion` | "re-ejecutá", "se corrigió el bug" | Test Execution #2, #3 |
| `qa-cierre-hu` | "¿puedo cerrar la HU?", "cerrá la HU" | Resultado del DoD y comentario de cierre |
| `qa-revision-casos` | "revisá los tests", "revisá la cobertura" | Observaciones y correcciones propuestas |
| `qa-actualizar-contexto` | "actualizá la documentación", "llegó un Swagger nuevo" | Cambios propuestos al playbook |
| `qa-inicio-sprint` | "arrancó el sprint", "creá el Test Plan del sprint" | Test Plan del sprint |
| `qa-seguimiento-sprint` | "cómo vamos en el sprint", "agregá un riesgo" | Avance y actualización del Test Plan |
| `qa-informe-sprint` | "informe de cierre del sprint" | Informe en el Test Plan |
| `qa-preparar-regresion` | "preparar la regresión" | Test Plan de regresión |
| `qa-informe-regresion` | "informe de regresión", "release readiness" | Informe y veredicto |

Una skill suelta **no tiene los permisos del agente**: las escrituras dependen de la configuración de permisos de Kiro de cada QA. Por eso, para escribir en Jira, Xray o el repositorio documental se recomienda usar el agente.

---

## 5. En cada punto de control

Kiro muestra:

```text
[PUNTO DE CONTROL] Matriz de cobertura · esperando tu confirmación
```

| Respuesta del QA | Qué hace Kiro |
| :--- | :--- |
| "sí", "dale", "confirmo", "OK" | Sigue con lo que mostró |
| Un ajuste ("sacá el caso 3", "la capa es API") | Corrige, guarda y vuelve a mostrar lo que cambió |
| "lo dejamos acá" | Se detiene. Lo hecho queda guardado en `.qa-work/` |
| Cualquier otra respuesta | La toma como ajuste o como parada, nunca como confirmación |

Además, cuando Kiro va a escribir en Jira, Xray o el repositorio documental, la herramienta pide aprobación. Aprobar solo si coincide con lo que se confirmó en el punto de control.

### Profundidad

Agregar al pedido "rápido" o "exhaustivo" si hace falta. Por defecto se usa Estándar.

---

## 6. Retomar el trabajo

Todo lo que se produce queda en `.qa-work/` (no se sube a git):

| Carpeta | Contenido |
| :--- | :--- |
| `.qa-work/<HU>/` | Contexto, análisis, matriz, casos, carga, re-ejecuciones, cierre, bugs |
| `.qa-work/sprint-<equipo>-<N>/` | Planificación, Test Plan, seguimientos, informe |
| `.qa-work/regresion-<equipo>-<release>/` | Alcance, selección, Test Plan, informe |

> **Ejemplo:** `.qa-work/PROJ-123/` para la HU `PROJ-123` y `.qa-work/sprint-alfa-12/` para el Sprint 12 del Equipo Alfa.

Para retomar en otra sesión: `ESTADO <CLAVE>` en `qa-maestro`. Kiro lee el `indice.md`, compara con Jira y Xray y ofrece seguir desde la última etapa aprobada.

---

## 7. Buenas prácticas

1. **Revisar la matriz de cobertura con atención.** Es el punto donde más se ahorra: un error de alcance se corrige antes de escribir los casos.
2. **Una HU por sesión.** Menos contexto mezclado y menos créditos.
3. **Aportar lo que Kiro no sabe.** Acuerdos con el PO, cambios de contrato, datos de prueba: decirlo en el punto de control.
4. **No confirmar por inercia.** Si algo no está claro, pedir el ajuste.
5. **Llevar al playbook lo aprendido** con `ACTUALIZAR_DOCUMENTACION`, para que la próxima HU parta con más contexto.
6. **Etiquetas solo del catálogo.** Si hace falta una nueva, primero se agrega al [catálogo](./catalogo-etiquetas.md).

---

## 8. Problemas frecuentes

| Situación | Qué hacer |
| :--- | :--- |
| "No existe el Test Plan del sprint" | Pedir al responsable que corra `INICIO_SPRINT` en `qa-sprint` |
| Kiro no encuentra el equipo | Verificar que el proyecto esté en el [índice de equipos](../05-equipos/indice-equipos.md) |
| Kiro pregunta datos del equipo cada vez | Aceptar que los guarde en el perfil y subir el cambio por Pull Request |
| No se crean las carpetas de evidencias | El MCP del repositorio documental no tiene escritura habilitada |
| Un vínculo quedó mal en Jira | No se puede borrar por API: borrarlo a mano en Jira |
| Xray responde que el repositorio se está actualizando | Kiro lo maneja: busca el test antes de reintentar para no duplicar |
| Kiro propone algo que no corresponde | Responder con el ajuste. Si se repite, avisar para mejorar la skill |

---

## 9. Documentos relacionados

- [Cómo trabajamos con Kiro](../00-introduccion/como-trabajamos-con-kiro.md)
- [DoR y DoD](../01-estandares-globales/definicion-dor-dod.md)
- [Catálogo de etiquetas](./catalogo-etiquetas.md)
- [Estructura de los Test Plans](./estructura-test-plan.md)
- [Equipos](../05-equipos/indice-equipos.md)
- [Proceso de automatización](../03-qa-automatizacion/proceso-automatizacion.md)
