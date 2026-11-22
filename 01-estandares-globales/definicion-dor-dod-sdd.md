# DoR y DoD de los equipos que trabajan con SDD (Equipo Delta)

> **Para qué sirve:** define cuándo una HU de un equipo SDD está lista para planificarse (DoR) y cuándo está terminada (DoD), e indica qué aporta QA en cada criterio.
> **Quién lo usa:** el Equipo Delta (desarrollo, PO, Scrum Master y QA) y el agente `qa-sdd`.
> **Cuándo se usa:** en el refinamiento y la planificación (DoR), al cerrar la HU (DoD) y antes de salir a producción (criterios de salida).

| Dato | Valor |
| :--- | :--- |
| Estado | Acuerdo vivo (V2) |
| Aplica a | Equipos con `Modalidad de trabajo = SDD` en su perfil de `05-equipos/` (hoy, el Equipo Delta) |
| Acuerdo inicial | 2026-06-23 |
| Versión V2 | 2026-07-17 |
| Relacionado | [DoR y DoD de los equipos funcionales](./definicion-dor-dod.md) |

**SDD** significa *Spec-Driven Development* (desarrollo guiado por especificaciones). Antes de implementar, el equipo de desarrollo escribe la especificación (spec) de la HU en tres archivos: `requirement.md` (qué se necesita), `design.md` (cómo se resuelve) y `tasks.md` (en qué pasos). QA revisa esa especificación, diseña los casos en paralelo al desarrollo y valida contra ella.

> **Ejemplo:** la épica "Pedidos y seguimiento" (`PROJ-40`) y su historia `PROJ-142` "Consultar el estado de un pedido" se trabajan con SDD. Sus documentos de ejemplo están en `04-funcionalidades/vision-cliente/05-pedidos-sdd/`.

Este documento es el DoR y DoD de esos equipos. Para el resto de los equipos vale [definicion-dor-dod.md](./definicion-dor-dod.md).

---

## SDD no es cascada

SDD es una capa de preparación **dentro** del marco ágil del equipo. No lo reemplaza. "Cascada" (*waterfall*) es el modelo en que primero se define todo y después se construye sin cambios.

> **SDD = preparar bien, ejecutar rápido, documentar lo real.** No es definir todo antes y no cambiar nada.

### Lo que se mantiene ágil

- Sprints iterativos con entrega incremental de valor.
- El equipo se auto-organiza para decidir cómo implementar.
- El alcance puede cambiar en el sprint si hay una buena razón y acuerdo del equipo.
- Feedback frecuente en review, daily y retro.
- Solo se especifica lo que entra al sprint, no todo el backlog.

### Lo que agrega SDD

- Un estándar más exigente de "lista para desarrollo" (DoR reforzado).
- QA arranca en paralelo, no después.
- La spec es un **documento vivo**: se actualiza durante y después de la implementación.
- Si desarrollo encuentra algo no previsto, lo resuelve y actualiza la spec.

### Señales de que el equipo está cayendo en cascada

- La spec se vuelve un documento que nadie puede tocar.
- Se rechaza trabajo terminado solo porque "no estaba exactamente así en la spec", sin evaluar si la solución es mejor.
- El equipo deja de conversar porque "ya está todo escrito".
- Se dedica más tiempo a especificar que a implementar.

> **Regla de oro:** la spec existe para que desarrollo no se bloquee y QA pueda arrancar en paralelo. Si la spec frena al equipo, hay que revisarla.

---

## Definition of Ready (DoR)

Una HU pasa a planificación cuando cumple **todos** estos criterios:

| # | Criterio | Detalle |
| :--- | :--- | :--- |
| 1 | Se entiende la necesidad del usuario | Está definido el motivo de la HU y el impacto del cambio |
| 2 | Criterios de aceptación definidos, claros y **validados por QA como testeables** | Están en Jira. QA confirma que puede escribir los casos a partir de ellos **antes de que empiece el sprint**. Se indica si hacen falta pruebas de carga o estrés |
| 3 | Dependencias visualizadas | Internas y externas, registradas en Jira |
| 4 | Dependencias externas resueltas | Con otros equipos, sectores o proveedores |
| 5 | Dependencias internas resueltas | Con otras HU del backlog |
| 6 | Especificación completa | La HU tiene `requirement.md` y `design.md` |
| 7 | Pendientes de la especificación resueltos | No quedan preguntas abiertas en requirement ni design que bloqueen la implementación |
| 8 | Plan de datos de prueba documentado | Qué datos hacen falta, de dónde salen y quién los provee. Si hay integraciones externas, la estrategia (mock, sandbox o stub). No se exige que los datos existan ni que el ambiente esté desplegado |
| 9 | El equipo está listo para estimar | Las dudas están evacuadas |
| 10 | Todo el equipo participó de la estimación | Incluye las pruebas |

> **Nota:** un *mock* es un servicio simulado que responde datos fijos; un *sandbox* es un ambiente de prueba que ofrece un tercero; un *stub* es una respuesta predefinida dentro del propio código de prueba.

Pendientes de la V2: definir si el criterio 8 se unifica con el 7 y si el 7 repite lo de los criterios 3 a 5.

### Cómo aporta QA al DoR

| Criterio | Qué hace QA | Agente y modo |
| :--- | :--- | :--- |
| 2 | Confirma que los criterios son testeables | `qa-sdd` · `ANALIZAR` |
| 6 y 7 | Revisa la coherencia HU ↔ requirement ↔ design ↔ tasks y señala gaps | `qa-sdd` · `REVISAR_SPEC` |
| 8 | Arma el plan de datos por caso | `qa-sdd` · `PAQUETE` |

---

## Definition of Done (DoD)

Una HU está terminada cuando cumple **todos** estos criterios:

| # | Criterio | Detalle |
| :--- | :--- | :--- |
| 1 | QA escribió los casos **antes** de que desarrollo termine | QA trabaja en paralelo con la spec y los criterios. Si no llegó, se analiza en la retro |
| 2 | No rompe CI/CD | El pipeline (la cadena automática de build y pruebas, CI/CD) corre bien después del merge y el ambiente sigue funcionando |
| 3 | Desplegado y validado en el ambiente de prueba | Se ejecutaron las pruebas necesarias (funcionales, de integración y las que apliquen) sin incidentes críticos abiertos |
| 4 | El PO vio una demostración | Y la aceptó |
| 5 | Criterios de aceptación cumplidos al 100 % | No se acepta "parcialmente cumplido". Incluye navegabilidad y UI kit (el conjunto de componentes visuales del producto) |
| 6 | Code review y tests unitarios | Al menos un code review de otro desarrollador, mediante Pull Request (PR). Los tests unitarios cubren la lógica crítica |
| 7 | Spec actualizada | Si desarrollo necesitó algo que no estaba en la spec, la spec se actualizó. Refleja lo que realmente se hizo |
| 8 | Se notificó a los involucrados | Personas o sectores que necesitan saberlo |

### Cómo aporta QA al DoD

| Criterio | Qué hace QA | Agente y modo |
| :--- | :--- | :--- |
| 1 | Casos aprobados y cargados en Xray antes del deploy a QA | `qa-sdd` · `GENERAR_TESTS`, `CARGAR_XRAY` |
| 3 y 5 | Ejecuta y audita que cada PASS valide el criterio | `qa-sdd` · `EJECUTAR` |
| 6 | Revisa la cobertura unitaria del cambio (no reemplaza el code review de desarrollo) | `qa-sdd` · `FWT` |
| 7 | Verifica en el cierre que la spec refleja lo implementado | `qa-sdd` · `CIERRE_HU` |

---

## Criterios para salir a producción

Además del DoD:

| # | Criterio | Detalle |
| :--- | :--- | :--- |
| 1 | Plan de rollback | El release tiene un plan de rollback (volver atrás el cambio) definido |
| 2 | Sin vulnerabilidades nuevas | No se introducen vulnerabilidades medias, altas ni críticas según el escaneo de seguridad del pipeline |
| 3 | Logueo de errores | Todo error posible se loguea con el nivel adecuado |
| 4 | Queries complejas validadas | Las consultas o actualizaciones complejas las valida quien administra la base de datos |
| 5 | Modelo operacional | La funcionalidad contempla el modelo operacional mínimo (monitoreo, alertas, soporte). Pendiente de validar con Arquitectura |

> **Atención:** las pruebas nunca se ejecutan en PROD (producción). Estos criterios se verifican en QA y PRE (preproducción).

---

## Notas de uso

- Es un acuerdo vivo. Los cambios se acuerdan con el equipo y se suben por Pull Request del playbook.
- Si una HU no cumple el DoR, no entra al sprint, salvo acuerdo explícito del equipo.
- Si una HU no cumple el DoD, no se cierra y vuelve a In Progress.
- El Scrum Master (SM) cuida el proceso, pero todo el equipo es responsable de cumplirlo.

## Registro de cambios

| Fecha | Cambio |
| :--- | :--- |
| 2026-10-28 | Se incorpora al playbook desde el acuerdo V2 del Equipo Delta, con el aporte de QA por criterio |
| 2026-07-17 | V2 del Equipo Delta |
| 2026-06-23 | V1: fusión de los criterios de DoR y DoD generales con enfoque SDD |
