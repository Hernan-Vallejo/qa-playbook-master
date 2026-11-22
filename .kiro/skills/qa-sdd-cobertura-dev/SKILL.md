---
name: qa-sdd-cobertura-dev
description: A partir de los casos de prueba aprobados de una HU de un equipo SDD, arma la propuesta de cobertura para desarrollo - qué conviene cubrir con tests unitarios de back o BFF, qué con mocks de front, qué queda para QA integrado y qué gaps de testabilidad hay - trazada a caso y criterio, con prioridad MUST, SHOULD u OPTIONAL. Usar cuando el agente qa-sdd o el QA pide "PAQUETE", "cobertura para dev", "qué tiene que cubrir desarrollo", "shift left", "qué unit tests pedimos". No crea casos nuevos, no escribe tests ni evalúa la cobertura real del PR (qa-sdd-fwt).
---
# Cobertura para desarrollo (SDD)

> **Para qué sirve:** proponerle a desarrollo qué parte de los casos de prueba aprobados conviene cubrir con tests unitarios (back o BFF) o con mocks de front, y qué parte tiene que seguir probando QA de forma integrada. También detecta los elementos de pantalla que no se pueden identificar de forma estable (gaps de testabilidad).
> **Quién lo usa:** el QA de un equipo que trabaja con SDD (por ejemplo el Equipo Delta), directamente o a través del agente `qa-sdd`.
> **Cuándo se usa:** después de aprobar los casos de una historia de usuario (HU) y antes del "Paquete" (el segundo punto de control del flujo SDD, junto con el plan de datos).

> **Nota:** **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) es una forma de trabajo en la que, antes de programar, desarrollo escribe una especificación (spec) revisable: `requirement.md`, `design.md` y `tasks.md`. QA revisa esa spec y deriva de ella los casos y los datos de prueba. **BFF** (*Backend For Frontend*) es la capa de servicios que adapta el back a lo que necesita una pantalla. Un **mock** es una respuesta simulada que reemplaza a un servicio real durante una prueba. **Shift left** es mover la detección de defectos hacia las etapas tempranas, donde corregirlos cuesta menos. **PR** (*Pull Request*) es el pedido de revisión de un cambio de código en GitHub.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Paquete (junto con `qa-sdd-plan-datos`) |
| Archivos en `.qa-work/<CLAVE-HU>/` | Lee `03-matriz-cobertura.md`, `04-casos.md`, `sdd/01-revision-spec.md`. Escribe `sdd/02-cobertura-dev.md` |

> **Nota:** `<CLAVE-HU>` es la clave de la historia en Jira, por ejemplo `PROJ-142`. `.qa-work/` es la carpeta de trabajo local donde los agentes guardan sus borradores (cada archivo pasa por los estados Borrador, Aprobado y Publicado).

## Propósito

Mover hacia desarrollo la detección de los defectos que se pueden encontrar temprano y barato, sin falsear la cobertura: un test unitario o un mock prueban comportamiento local; la integración real sigue siendo de QA.

> **Ejemplo:** en la historia `PROJ-142` "Consultar el estado de un pedido", la regla "un pedido de otro comprador responde igual que uno inexistente" (`RN-PED-22`) se resuelve en un test unitario de desarrollo, y QA además la prueba integrada por API. En cambio, "el estado mostrado coincide con el que informa el servicio de logística real" solo se valida integrado, y queda para QA (la integración con logística está pendiente de definir por el PO).

## Cuándo usarla

- Después de aprobar los casos de una HU de un equipo SDD y antes del Paquete (Gate 2).
- Cuando cambian casos aprobados y hay que actualizar la propuesta.

> **Nota:** un **Gate** es un punto de aprobación obligatorio del flujo. El Gate 1 es la matriz de cobertura (qué se prueba y qué no). El Gate 2 es el Paquete: la cobertura que se propone a desarrollo más el plan de datos.

## Cuándo no usarla

- Sin casos aprobados: primero `qa-diseno-casos`.
- Para revisar los unitarios que desarrollo ya escribió → `qa-sdd-fwt`.
- Para automatizar los casos → agente `qa-automation`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU | Sí | Pedirla |
| Casos aprobados (`04-casos.md` Aprobado) | Sí | Detenerse: "Primero hay que aprobar los casos (GENERAR_TESTS)" |
| Matriz aprobada (`03-matriz-cobertura.md`) | Sí | Igual que arriba |
| Revisión de la spec (`sdd/01-revision-spec.md`) | No | Usar la HU y la spec. Avisar que no hubo revisión |
| Repositorio del código | No | Sin él, no se verifica la cobertura existente de desarrollo; se avisa |

> **Nota:** `GENERAR_TESTS` es el comando del agente `qa-sdd` que diseña la matriz de cobertura y los casos de prueba. La matriz de cobertura relaciona cada condición de la spec con los casos que la prueban.

## Contexto que lee

1. Steering `qa-sdd` (las reglas del flujo SDD: jerarquía de verdad, subtareas estándar, versiones de las fuentes).
2. Los archivos de entrada en `.qa-work/<CLAVE-HU>/`.
3. `sdd/00-fuentes.md`: si la spec cambió después de aprobar los casos, avisar antes de seguir.
4. Si la HU tiene front: el steering de locators de la plantilla de automatización (`plantilla-automation/.kiro/steering/pw-proyecto.md`) o del repositorio de front que use el equipo. Si no está disponible, la parte de testabilidad de front queda como INFORMACIÓN INSUFICIENTE.
5. Código del producto, solo puntual, para ver si ya hay cobertura equivalente. No se recorre el repositorio completo.

> **Nota:** un **locator** (localizador) es la forma de identificar un elemento de la pantalla en un test, por ejemplo `data-test="login-button"`. Es estable cuando no depende del texto ni de la posición del elemento.

## Herramientas MCP

> **Nota:** **MCP** (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a sistemas externos. En este playbook se usan los servidores `@atlassian` (Jira y Xray) y `@github` (repositorio y pull requests).

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue` (servidor `@atlassian`); herramientas de lectura de archivos, listado de carpetas y búsqueda de código del servidor `@github` |
| Escritura | Ninguna. El archivo local no necesita confirmación. Esta skill y el agente `qa-sdd` no hacen commits ni push en la rama de desarrollo: si el QA quiere dejar la propuesta en el repositorio, se le entrega el contenido para que lo suba quien corresponda (modo `PAQUETE` del agente, paso 5). El comentario para el equipo se publica en Jira después del Paquete y con OK |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/sdd/`. Verificar que matriz y casos estén Aprobados.
1. **Mapa caso → criterio.** Para cada caso: condición de la matriz, criterio o regla de origen, prioridad y capa. Un caso sin origen en la matriz no entra a la propuesta y se informa como **desvío de la matriz**.
2. **Tipo de HU.** Back, BFF, Front o Mixta.
3. **Clasificar cada caso** con la tabla de responsabilidad de abajo.
4. **Back y BFF.** Para los candidatos a unitario, describir comportamiento, condición, resultado esperado y dependencia a simular. No inventar clases, métodos ni mocks concretos.
5. **Front.** Para los candidatos a mock: request o evento a controlar, respuesta simulada, estado de la UI esperado, verificaciones clave y si QA necesita después un E2E real.
6. **Testabilidad de front.** Para cada elemento que los casos necesitan identificar, aplicar el steering de locators. Si no hay forma única y estable de identificarlo, registrar un **gap de locator** con el elemento, los casos afectados y el contrato estable que se pide.
7. **Prioridad** de cada recomendación con las preguntas de abajo. No pasar todo el plan a desarrollo.
8. Guardar `sdd/02-cobertura-dev.md` (Borrador) con el formato del Entregable y devolver el resumen al agente para el punto de control **Paquete**.

> **Nota:** **E2E** (*end-to-end*, de punta a punta) es una prueba que recorre el flujo completo como lo haría un usuario, con todos los componentes reales conectados. **UI** es la interfaz de usuario (las pantallas).

### Responsabilidad

Cada caso aprobado se clasifica en una de estas clases. La clase indica quién lo cubre y cómo.

| Clase | Cuándo |
| :--- | :--- |
| `DEV_SHIFT_LEFT` | El defecto se detecta con un unitario o un mock, con un resultado local y determinista, y QA no necesita repetirlo |
| `DEV_AND_QA` | Desarrollo cubre la lógica local, pero QA tiene que validar contrato, persistencia o integración real |
| `QA_INTEGRATION_REQUIRED` | Solo se puede validar integrado (otros servicios, base real, ambiente) |
| `NOT_RECOMMENDED_FOR_DEV` | El costo para desarrollo es alto y el valor bajo |

### Prioridad

Se responde: ¿lo detectaría antes y barato?, ¿el resultado es local y determinista?, ¿corre rápido en el pipeline?, ¿ya existe cobertura equivalente?, ¿QA necesita integración igual?

> **Nota:** un resultado **determinista** es el que da siempre lo mismo con las mismas entradas, sin depender de la hora, del orden de ejecución ni de servicios externos. El **pipeline** es el conjunto de pasos automáticos de CI/CD (integración y entrega continuas) que corre el repositorio, por ejemplo con GitHub Actions.

| Prioridad | Cuándo |
| :--- | :--- |
| `MUST_DEV` | Regla de negocio o validación crítica, determinista y sin cobertura previa |
| `SHOULD_DEV` | Valor alto, pero hay cobertura parcial o el riesgo es medio |
| `OPTIONAL_DEV` | Suma, pero no bloquea nada |
| `QA_ONLY` | No se recomienda a desarrollo |

## Punto de confirmación

Esta skill no tiene punto de control propio: su resultado se muestra en el **Paquete** del agente `qa-sdd`, junto con el plan de datos. Si se usa suelta, mostrar el entregable y preguntar: "¿Aprobás la propuesta para desarrollo, ajustamos algo o la dejamos acá?"

> **Nota:** un punto de control se presenta siempre con la marca `[PUNTO DE CONTROL] Paquete · esperando tu confirmación`. Hasta que el QA responda, el agente no avanza ni publica nada.

## Entregable

El archivo `sdd/02-cobertura-dev.md` tiene esta estructura. Las tablas se completan con una fila por recomendación.

```text
Cobertura para desarrollo - <CLAVE-HU>
Tipo: Back | BFF | Front | Mixta · Casos considerados: <n> · Casos basados en la spec de <fecha>
Resumen: MUST_DEV <n> · SHOULD_DEV <n> · Mocks de front <n> · QA integrado <n> · Gaps de testabilidad <n>

Back / BFF - unitarios sugeridos
| ID | Casos | Criterio | Escenario | Condición | Resultado esperado | Dependencia a simular | Prioridad | QA después |

Front - escenarios con mocks
| ID | Casos | Criterio | Request o evento | Respuesta simulada | Estado de UI | Verificaciones | E2E real después |

Front - testabilidad
| Elemento | Casos | Identificación propuesta | Única y estable | Estado (listo / gap de locator) |

Lo que QA mantiene integrado
| Casos | Por qué un unitario o un mock no alcanza | Capa |

Mejoras de testabilidad
| ID | Gap | Impacto | Pedido a desarrollo |

A confirmar
- Solo lo que impide un resultado esperado determinista.
```

Cada fila referencia al menos un caso y su criterio. Sin esa traza, no entra.

> **Ejemplo:** fila de unitarios para `PROJ-142`: ID `U-01` · Casos `PROJ-142-CP03` · Criterio `CA-3` · Escenario "consultar un pedido de otro comprador" · Condición "`standard_user` pide `PED-0101`, que pertenece a `problem_user`" · Resultado esperado "responde HTTP 404, igual que ante un pedido inexistente (el texto exacto está pendiente de definir por el PO)" · Dependencia a simular "el repositorio de pedidos" · Prioridad `MUST_DEV` · QA después "Sí: lo prueba integrado por API (`DEV_AND_QA`)".

## Reglas

- No se crean casos nuevos: se usan los aprobados.
- **Un mock de front no cubre un endpoint**: demuestra que el front maneja esa respuesta, no que el back la produzca.
- Un unitario que cubre un 500 no reemplaza la prueba integrada si hay riesgo de integración: va como `DEV_AND_QA`.
- La implementación actual no redefine el resultado esperado.
- No se pide `data-testid` (o `data-test`) para todo: se aplica el steering de locators.
- No se recomienda `waitForTimeout`, `force: true` ni posiciones (`nth`, `first`, `last`) para resolver ambigüedad.
- No se modifica código ni spec. No se publica en la rama de desarrollo desde esta skill.

> **Nota:** `waitForTimeout` es una espera fija en Playwright (frena el test un tiempo determinado, pase lo que pase). `force: true` obliga a Playwright a actuar sobre un elemento aunque no esté listo. Ambos esconden problemas de sincronización o de identificación del elemento, por eso no se recomiendan.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| Un caso no tiene fila en la matriz | Se agregó un caso después de aprobar la matriz | Informarlo como desvío de la matriz y dejarlo fuera hasta que el QA lo resuelva |
| La spec cambió después de aprobar los casos | Desarrollo actualizó el design | Avisar y preguntar si se revisan los casos antes |

## Criterios de calidad

- Cada recomendación tiene caso, criterio, resultado esperado y prioridad.
- Lo que va a desarrollo es selectivo: no es una copia de los casos.
- La frontera entre lo local de desarrollo y lo integrado de QA está explícita.

## Casos de aceptación

Son los escenarios con los que se verifica que la skill se comporta como se espera.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | HU back con validaciones de input deterministas | Unitarios `MUST_DEV` con condición y resultado esperado |
| 2 | Caso que depende de la respuesta real de un servicio externo de logística | `QA_INTEGRATION_REQUIRED` |
| 3 | HU front con dos botones iguales sin identificación | Gap de locator, sin forzar `nth` |
| 4 | Casos sin aprobar | Se detiene y pide aprobar los casos |
