# Referencia de análisis

> **Para qué sirve:** Reúne los criterios con los que se analiza una HU (Historia de Usuario): cómo clasificar el cambio, qué mirar en cada capa, cómo evaluar riesgo, impacto, regresión, integración y performance.
> **Quién lo usa:** La skill `qa-analisis-hu` (y otras skills de análisis) cuando evalúa una HU, y el QA cuando quiere revisar los criterios a mano.
> **Cuándo se usa:** En el paso "Evaluar" de `qa-analisis-hu`, después de leer la HU, la documentación funcional y la cobertura existente.

> **Nota:** estos criterios resumen buenas prácticas de análisis de QA senior (qué cambió, qué puede romperse, qué hay que regresar). Se pueden ajustar al equipo, siempre dejando asentado el cambio en el `CHANGELOG.md` del playbook.

## Clasificación del cambio

Front, Back, BFF, API, Base de datos, Integración, Evento, Configuración, Seguridad, Permisos, Regla de negocio, Full stack, Refactor, Bug fix, Cambio de alcance. Una HU puede tener varias.

> **Ejemplo:** la HU "El carrito muestra el contador de productos" es de tipo Front (el número en el ícono) y Regla de negocio (cómo se cuenta cada producto agregado).

## Qué evaluar según la capa

> **Nota:** BFF (*Backend For Frontend*) es la capa intermedia que adapta los datos del back a lo que necesita la pantalla. JWT (*JSON Web Token*) es el token con el que el sistema reconoce a la persona que inició sesión.

| Capa | Qué mirar |
| :--- | :--- |
| Front | Figma (el diseño, si existe), estados de carga, vacío y error, responsive (adaptación a distintos tamaños de pantalla), consistencia visual, textos |
| BFF | Contrato de entrada y salida, datos que inyecta desde la sesión o el JWT, transformaciones, manejo de errores |
| Back | Endpoints, payloads (el cuerpo de los pedidos y respuestas), persistencia, códigos de estado, errores, eventos |

## Checklist integral

> **Nota:** "integral" significa mirar la HU en conjunto con lo que la rodea: otras HU, otras capas, la base de datos y los tests que ya existen. Cada punto responde a una duda concreta.

| # | Qué verificar |
| :--- | :--- |
| a | HU relacionadas, su cobertura y su estado. Bugs históricos del módulo como fuente de regresión. Comentarios de QA previos |
| b | Contrato BFF y BACK contra lo que implementa el Front: campos exigidos por una capa y no por otra, transformaciones, códigos distintos entre capas |
| c | Endpoints vecinos que comparten la entidad afectada y qué flujos existentes pueden romperse |
| d | Validaciones de base de datos: base, tabla y consulta para cada efecto (por ejemplo, en la base ficticia `tienda_qa`: tabla `pedidos`, consulta de solo lectura) |
| e | Tests existentes en Xray: reutilizar si ya hay cobertura; si la funcionalidad cambia, proponer deprecar los afectados y crear nuevos |
| f | Vigencia del contexto: Xray se consulta en vivo; el contrato documentado tiene fecha y puede estar desactualizado |

Si un punto no se pudo verificar, marcarlo como **INFORMACIÓN INSUFICIENTE**.

## Motor de riesgo

> **Nota:** un "motor" acá es una guía de decisión: una lista de factores y una tabla de niveles. No es un programa.

Evaluar impacto funcional, técnico, de negocio y de UX; complejidad; dependencias; integraciones; datos; cobertura; historial de bugs; criticidad.

| Nivel | Cuándo |
| :--- | :--- |
| Alto | Afecta dinero, permisos, seguridad, flujos críticos o varias capas, o hay bugs históricos en la zona |
| Medio | Afecta un flujo principal con dependencias acotadas |
| Bajo | Visual o aislado, sin dependencias |

Siempre justificar el nivel.

> **Ejemplo:** un cambio en el cálculo del total del checkout es riesgo Alto (afecta dinero). Cambiar el color de un botón del catálogo es riesgo Bajo.

## Motor de impacto

Directo, indirecto, de negocio, técnico, cross-module (entre módulos), blast radius (radio de alcance: cuánto del sistema se ve afectado si algo falla). Sin evidencia: **IMPACTO NO DETERMINABLE CON LA INFORMACIÓN DISPONIBLE**.

## Motor de regresión

Principio: mínima regresión efectiva (probar solo lo necesario para estar seguro de que lo existente sigue funcionando).

| Tipo | Alcance |
| :--- | :--- |
| No requerida | Sin dependencias comprobadas |
| Puntual | 1 o 2 flujos |
| Focalizada | Un área acotada |
| Cross-module | Varios módulos |
| Amplia | Toda la funcionalidad o el release |

Indicar qué probar, prioridad (P0 a P3, de más a menos urgente) y motivo. Siempre "recomendada", nunca "ejecutada": la skill recomienda y el QA decide y ejecuta.

## Motor de integración

Front aislado, Back aislado, BFF aislado, Front-BFF, BFF-Back, Front-BFF-Back, integración externa, E2E (*end-to-end*, de punta a punta, como lo recorre una persona usuaria). Si no aplica: **NO REQUIERE PRUEBA INTEGRAL**.

## Motor de performance

Decide si la HU necesita una prueba de performance. Los disparadores están en la sección 4 ("Cuándo corresponde una prueba de performance") de `03-qa-automatizacion/plan-pruebas-performance.md`: leer la tabla de ahí, no de memoria.

| Resultado | Cuándo | Línea del comentario de análisis |
| :--- | :--- | :--- |
| Obligatoria | Cumple al menos un disparador O-1 a O-6 | `Performance: aplica (O-x)` |
| Recomendada | Cumple algún R-1 a R-5 y ningún O | `Performance: aplica (R-x)` |
| No aplica | No cumple ninguno | `Performance: no aplica` con la justificación |

> **Nota:** O significa "obligatorio" y R significa "recomendado". El número identifica el disparador dentro de la tabla del plan de performance.

- Siempre justificar con evidencia: la HU, el cambio de arquitectura o infraestructura, el volumen, el SLA (*Service Level Agreement*, el nivel de servicio acordado) o el incidente. Sin evidencia: **INFORMACIÓN INSUFICIENTE** y preguntar al TL o a arquitectura. Nunca marcar "no aplica" por defecto.
- Si aplica, el pedido lo crea el **TL (líder técnico) del equipo** en el proyecto del equipo, con la planilla de la sección 12.1 (Anexo A) del plan de performance y **al menos 2 sprints antes del release**. La skill busca un pedido vinculado a la HU. Si no existe, lo informa y ofrece un borrador con la planilla para pasárselo al TL; no lo crea sin confirmación.
- Un pedido que falta es un faltante del DoR (*Definition of Ready*, punto 7): estado Parcialmente Ready, no No Ready.
- Si el release está a menos de 2 sprints, informarlo en Riesgos como riesgo del release para el TL y la persona que lidera QA.
- La HU con "aplica" la retoma `qa-preparar-regresion` para verificar que la prueba esté terminada antes del release.

## Preguntas de QA Senior

Qué cambió y por qué. Qué regla de negocio aplica. Qué puede romperse. Qué depende de esto. Qué riesgo existe. Qué probar y qué no. Qué regresar. Si hace falta prueba integral. Si la cobertura alcanza. Qué evidencia se necesita.

> **Nota:** si no sabés responder alguna de estas preguntas con la información de la HU, esa es una pregunta para el PO o para Desarrollo y va en las "Observaciones QA" del análisis.
