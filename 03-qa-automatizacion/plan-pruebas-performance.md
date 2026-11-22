# Plan de Pruebas de Performance (genérico)

> **Para qué sirve:** definir cómo se planifica, ejecuta y reporta una prueba de performance (rendimiento) sobre un servicio o flujo, con una estructura basada en ISTQB y en la norma ISO/IEC/IEEE 29119-3. Sirve como plantilla de plan y como proceso permanente.
> **Quién lo usa:** QA Automation (arma y ejecuta las pruebas), el Tech Lead y el Product Owner de cada equipo (piden la prueba y deciden con los resultados), arquitectura y el equipo de infraestructura (validan el ambiente).
> **Cuándo se usa:** cuando una historia, un cambio o un incidente cumple alguno de los disparadores de la sección 4, y antes de cada release que tenga pruebas de performance obligatorias.

> **Nota (siglas y términos):**
> - **ISTQB** = *International Software Testing Qualifications Board*. Su certificación *Performance Testing* (CT-PT) es la base metodológica de este plan. **ISO/IEC/IEEE 29119-3** es la norma que define la documentación de pruebas.
> - **HU** = historia de usuario. **PO** = Product Owner. **PA** = analista de producto (también llamado analista funcional). **TL** = Tech Lead. **SRE** = *Site Reliability Engineering* (el equipo que opera la infraestructura). **DoR / DoD** = *Definition of Ready / Done*.
> - **VU** = *virtual user* (usuario virtual). **RPS** = *requests per second* (pedidos por segundo). **p95** = percentil 95: el 95 % de los pedidos tardó ese tiempo o menos.
> - **Umbral (*threshold*)** = valor límite de una métrica; si la corrida lo supera, la prueba falla.
> - **Baseline** = valores de referencia del servicio, medidos con carga controlada, contra los que se comparan las demás corridas.
> - **QA, PRE, PROD** = ambientes de pruebas, preproducción y producción.
>
> En este documento "la empresa" es una organización genérica (Acme) y el producto de los ejemplos es **Tienda Demo** (login, catálogo, carrito y checkout). El ejemplo de herramienta es **k6**, que **no está incluido** en la plantilla `plantilla-automation`: es un framework que el equipo puede sumar (ver [repositorios-y-frameworks.md](./repositorios-y-frameworks.md)).

## Ficha del documento

| Dato | Valor |
| :--- | :--- |
| Tipo de documento | Plan de pruebas de performance (genérico y reutilizable) |
| Base metodológica | ISTQB Certified Tester Performance Testing (CT-PT) e ISO/IEC/IEEE 29119-3 (estructura del plan de pruebas) |
| Quién arma y ejecuta las pruebas | Equipo de QA Automation |
| Seguimiento en Jira | Una épica de performance en el proyecto `AUTO` (por ejemplo `AUTO-10 Performance Test (armado y ejecución)`), con tareas hijas como `AUTO-45` |
| Herramienta de ejemplo | k6 (Grafana), con scripts en JavaScript |
| Evidencia | Repositorio documental del equipo (por ejemplo SharePoint o Drive) y la tarea AUTO |

## Estructura del plan

El contenido sigue la estructura típica de un plan de pruebas ISTQB:

| Sección | Contenido |
| :--- | :--- |
| 1 | Objetivo |
| 2 | Alcance |
| 3 | Roles y responsabilidades |
| 4 | Cuándo corresponde una prueba de performance |
| 5 | Integración con el ciclo de vida del desarrollo |
| 6 | Tipos de prueba (carga, estrés, pico, resistencia y otros) |
| 7 | Perfiles de carga |
| 8 | Métricas, umbrales y criterios de aceptación |
| 9 | Datos de prueba |
| 10 | Ambiente |
| 11 | Herramientas |
| 12 | Proceso y ejecución |
| 13 | Criterios de entrada, salida, suspensión y reanudación |
| 14 | Implementación en k6 (ejemplo) |
| 15 | Riesgos |
| 16 | Informe, severidad y hallazgos |
| 17 | Entregables y evidencia |
| 18 | Seguimiento y controles |
| 19 | Capacitación |
| Anexo A | Plantilla del pedido |
| Anexo B | Plantilla del plan de una prueba |
| Anexo C | Plantilla del informe |

> **Nota:** el orden de los números es el de este documento. Las secciones 1 a 5 definen el marco (por qué, quién, cuándo) y las secciones 6 a 17 son lo que se completa en el plan de cada prueba concreta.

---

## 1. Objetivo

Asegurar que los servicios críticos cumplen objetivos de tiempo de respuesta, *throughput* (cantidad de operaciones por unidad de tiempo), tasa de errores y estabilidad, tanto bajo la carga esperada como por encima de ella. También conocer su capacidad máxima y su comportamiento ante picos y carga sostenida, **antes** de que el cambio llegue a producción.

Objetivos específicos (ISTQB CT-PT):

1. Verificar que con la carga esperada (promedio y pico) se cumplen los criterios acordados.
2. Encontrar el punto de quiebre y el cuello de botella.
3. Detectar degradación con el tiempo (memoria, conexiones, colas).
4. Conocer cómo se recupera el sistema después de una sobrecarga.
5. Dar evidencia objetiva para decidir: liberar, ajustar, escalar o aceptar el riesgo.

> **Ejemplo (Tienda Demo):** "Verificar que el flujo de checkout (agregar al carrito, completar datos, confirmar) responde con p95 menor a 800 ms y menos de 1 % de errores con 50 compras por minuto, y encontrar a partir de qué carga se degrada."

## 2. Alcance

Todas las pruebas son **por endpoint** (por servicio, no por pantalla). Cuando hay que representar el recorrido de un usuario por el front, se simula llamando a los servicios que consume la aplicación en el mismo orden en que ella lo hace, pero siempre a nivel de endpoint.

| Incluye | No incluye |
| :--- | :--- |
| APIs y microservicios del back de Tienda Demo | Pruebas en producción |
| Servicios intermedios que consume el front (BFF, *backend for frontend*), incluida la simulación del recorrido de un usuario | Pruebas de performance del front en el navegador (render, tiempos de pantalla) |
| Flujos de negocio de punta a punta por API (login, catálogo, carrito, checkout, pedidos) | Pruebas de seguridad, de penetración y de denegación de servicio |
| Procesos masivos y batch (cargas de archivos, inserciones masivas, procesos de cierre) | Pruebas de caos o de inyección de fallas |
| Mensajería (colas, eventos) y accesos a base de datos | Ajustes de infraestructura (los hace el equipo dueño del servicio; QA los recomienda) |
| Servicios en el ambiente PRE | |

---

## 3. Roles y responsabilidades

**Regla.** El pedido lo hace el **equipo dueño del servicio o flujo** y lo formaliza su **TL**. Cualquier rol del equipo (TL, PO, analista de producto, desarrollo, QA) puede detectar que la prueba es necesaria, pero la solicitud formal sale del TL. Las pruebas las arma y ejecuta el **equipo de QA Automation**.

### Roles

| Rol | Responsabilidad |
| :--- | :--- |
| Equipo dueño del servicio o flujo (cualquier rol) | Detecta la necesidad de la prueba y la plantea al TL |
| **TL del equipo** | **Responsable de solicitar la prueba.** Crea o aprueba la tarea o historia de pedido con la planilla del Anexo A, acuerda los criterios de aceptación y decide sobre los resultados |
| **PO del equipo** | Aporta volumen de negocio, crecimiento esperado y fechas críticas. Prioriza el pedido. **Responsable de entregar la batería de datos en PRE** |
| Analista de producto (PA) | Colabora con el PO en la gestión de la batería de datos y en el volumen de referencia |
| Equipo de implementaciones o datos | Genera o habilita en PRE la batería de datos que pide QA Automation |
| QA del equipo | Evalúa los disparadores en el análisis de la HU y deja la decisión de performance en el comentario de análisis (sección 4) |
| Arquitectura | Valida el modelo de carga, define junto al TL los criterios de aceptación y coordina la ventana en PRE. Define cuánto tiempo se conserva la evidencia |
| SRE / DevOps / infraestructura | Valida la configuración de PRE antes de las corridas (instancias y memoria de cada servicio), monitorea durante las corridas y hace los ajustes de infraestructura |
| **Equipo de QA Automation** | Arma y ejecuta las pruebas: analiza, planifica, especifica los datos que necesita, implementa los scripts, define el baseline, ejecuta, analiza cada corrida, publica la evidencia, arma el informe y asigna la severidad del resultado |
| Especialista en performance | Referente técnico del equipo de QA Automation: acompaña el diseño, el análisis y las capacitaciones |
| **Líder de QA** | Prioriza el trabajo de performance del equipo de QA Automation, ejecuta los controles de la sección 18 y sigue los desvíos |

### RACI

R = ejecuta · A = responsable final · C = consultado · I = informado.

| Actividad | TL | PO | PA | Datos | Arquitectura | SRE | QA Automation | QA del equipo | Líder QA |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Detectar la necesidad (cualquier rol del equipo) | R | R | R | — | C | C | C | R | I |
| Registrar la decisión en el análisis de la HU | C | I | I | — | — | — | I | **R/A** | I |
| Solicitar la prueba (tarea o historia de pedido) | **A/R** | C | C | — | C | I | I | C | I |
| Crear la tarea en el proyecto `AUTO` | I | I | I | — | I | I | R | I | A |
| Perfil operacional y modelo de carga | C | C | C | — | A | C | R | I | I |
| Plan de la prueba | C | C | C | — | C | C | R | I | A |
| Especificar los datos requeridos en PRE | C | C | C | C | C | — | **R/A** | I | I |
| Gestionar y entregar la batería de datos en PRE | I | **A/R** | R | R | — | C | C | — | I |
| Armar los datos del piloto en QA | — | — | — | — | — | — | **R/A** | C | — |
| Validar la configuración de PRE | I | — | — | — | C | **R/A** | C | — | I |
| Definir el baseline | C | — | — | — | C | C | **R/A** | — | I |
| Acordar criterios de aceptación | **A** | I | I | — | **R** | C | R | I | I |
| Implementación y smoke en QA | I | — | — | — | — | — | R | — | A |
| Coordinar la ventana en PRE | C | — | — | — | **A** | R | R | — | I |
| Ejecución en PRE | I | — | — | — | C | C | R | — | A |
| Monitoreo durante la corrida | I | — | — | — | C | **R/A** | C | — | I |
| Análisis y publicación de cada corrida | I | I | I | — | C | C | R | — | A |
| Informe final y severidad del resultado | I | I | I | — | C | C | R | I | A |
| Aceptar el riesgo de un resultado de severidad media | **A/R** | R | R | — | C | C | C | I | I |
| Tratamiento de hallazgos | A/R | C | C | — | C | C | C | I | I |
| Frecuencia y umbrales de los controles | **A/R** | R | R | — | C | C | C | I | C |
| Ejecución de los controles y seguimiento de desvíos | I | I | I | — | I | — | C | I | **A/R** |

---

## 4. Cuándo corresponde una prueba de performance

El criterio es de riesgo (ISTQB): se prueba cuando una falla de performance tiene impacto alto o probabilidad alta.

### Obligatoria

| # | Disparador |
| :--- | :--- |
| O-1 | Servicio o flujo **nuevo** que forma parte de un flujo crítico de negocio (login, checkout, pagos) |
| O-2 | **Cambio de arquitectura o infraestructura** de un servicio crítico: migración de plataforma, cambio de base de datos, de caché, de motor de mensajería, de versión mayor de framework o de topología |
| O-3 | Cambio que **aumenta la carga esperada** por encima de lo probado (nuevo canal, nuevo cliente masivo, crecimiento acordado con negocio) |
| O-4 | Procesos **masivos o batch** nuevos o modificados (cargas de archivos, procesos de cierre, inserciones masivas) |
| O-5 | **Incidente productivo de performance** (lentitud, timeouts, caída por carga): la prueba reproduce el problema y valida la corrección |
| O-6 | Requisito no funcional explícito en la HU, la épica o el contrato con un tercero (acuerdo de nivel de servicio, SLA) |

### Recomendada

| # | Disparador |
| :--- | :--- |
| R-1 | Cambio en una consulta, índice o acceso a base de datos dentro de un flujo de alto volumen |
| R-2 | Integración nueva o modificada con un tercero (por ejemplo una pasarela de pagos) dentro de un flujo crítico |
| R-3 | Antes de una fecha pico conocida (campañas, liquidaciones, fin de mes) para servicios que la atraviesan |
| R-4 | Cambio de configuración de pools de conexiones, timeouts, caché o autoescalado |
| R-5 | Revalidación periódica de los servicios críticos, con la frecuencia que define el equipo (PO, PA y TL) según la observabilidad que tiene del servicio |

### No corresponde

Cambios de texto, estilos o pantallas sin impacto en el back, correcciones funcionales acotadas fuera de flujos críticos y servicios sin tráfico relevante. La decisión de no probar también se registra en el comentario de análisis (sección 4).

> **Ejemplo:** la HU `PROJ-150` "Nuevo medio de pago en el checkout" modifica el flujo crítico de checkout: aplica **O-1** y **R-2**. La HU `PROJ-151` "Cambiar el color del botón Agregar al carrito" no aplica.

---

## 5. Integración con el ciclo de vida del desarrollo

```text
Refinamiento ──> Análisis de la HU (QA) ──> Pedido (TL) ──> Planning ──> Desarrollo y QA ──> Regresión del release ──> PRE/PROD
     │                    │                      │               │               │                    │
  El equipo detecta   Decisión de            Tarea o historia  Tarea en       Smoke en QA        ¿Las pruebas
  requisitos no       performance en el      de pedido, al     AUTO (épica    Datos en PRE       obligatorias
  funcionales         comentario de          menos 2 sprints   de perfor-     Baseline           tienen informe
                      análisis               antes del release mance)         Corridas en PRE    y decisión?
```

| Etapa | Qué se hace | Quién | Evidencia |
| :--- | :--- | :--- | :--- |
| Refinamiento | El equipo identifica requisitos no funcionales, cambios de arquitectura y fechas pico | Cualquier rol del equipo | HU o épica con el requisito |
| Análisis de la HU (QA) | El QA evalúa los disparadores de la sección 4 y deja la decisión en el **comentario de análisis** de la HU: **"Performance: aplica (O-x / R-x) / no aplica"**, con la justificación | QA del equipo (skill `qa-analisis-hu`) | Comentario de análisis en la HU |
| Pedido | Si aplica, se **crea una tarea o historia de pedido** en el proyecto del equipo, con la planilla del Anexo A y vinculada a la HU de origen. Se crea **como mínimo 2 sprints antes del release** | TL del equipo | Tarea o historia de pedido |
| Planning | QA Automation crea la tarea en `AUTO` bajo la épica de performance, vinculada al pedido, y la planifica en su sprint | QA Automation, líder QA | Tarea AUTO vinculada |
| Desarrollo y QA | Piloto y smoke en QA, entrega de datos en PRE, validación de PRE por SRE, baseline, calibración y corridas en PRE | QA Automation, PO, SRE | Sección 12 |
| Regresión del release | Se verifica que toda HU del release con prueba obligatoria tenga informe, severidad y decisión | QA de regresión (skills `qa-preparar-regresion`, `qa-informe-regresion`) | Línea del informe de regresión |
| Salida a producción | La severidad del resultado define la recomendación (sección 16) | Líder QA, TL | Veredicto GO / GO WITH RISKS / NO GO |

> **Nota:** un pedido que llega con menos de 2 sprints de anticipación se informa al TL y al líder de QA como riesgo del release: la prueba puede no llegar a ejecutarse completa antes de la salida.

### DoR y DoD

Los criterios de performance de la HU están en [`definicion-dor-dod.md`](../01-estandares-globales/definicion-dor-dod.md):

- **DoR de la HU:** el comentario de análisis tiene la decisión de performance. Si aplica, existe la tarea o historia de pedido vinculada, creada al menos 2 sprints antes del release.
- **DoD de la HU:** si aplica, la prueba cumple su definición de terminado (sección 12.3). Un resultado de severidad media tiene la aceptación del riesgo de PO, PA y TL; uno de severidad alta no cumple el DoD.

---

## 6. Tipos de prueba

| Tipo (ISTQB) | Pregunta que responde | Cuándo se usa | Perfil de carga (sección 7) |
| :--- | :--- | :--- | :--- |
| Humo (*smoke*) | ¿El flujo funciona con 1 usuario? | Siempre, antes de cualquier otra | Una iteración o pocos usuarios, por segundos |
| **Carga (*load*)** | ¿Con la carga esperada se cumplen los objetivos? | Siempre que aplica la prueba | Carga promedio y carga pico esperadas |
| **Estrés (*stress*)** | ¿Cómo se comporta por encima del pico y cómo se recupera? | Servicios críticos, disparadores O-1 a O-5 | Escalones crecientes por encima del pico y bajada final |
| **Pico (*spike*)** | ¿Soporta un salto brusco de carga? | Fechas pico, lanzamientos, R-3 | Salto muy rápido a una carga alta, y vuelta a la normal |
| **Resistencia (*soak / endurance*)** | ¿Se degrada con el tiempo? | Servicios de uso continuo, sospecha de fugas de memoria o conexiones | Carga normal sostenida por horas |
| Capacidad / punto de quiebre (*breakpoint*) | ¿Hasta dónde llega antes de incumplir? | Cambios de infraestructura, O-2 y O-3 | Incremento continuo hasta que se incumple un umbral |
| Concurrencia | ¿Hay problemas cuando N usuarios hacen lo mismo a la vez? | Bloqueos, duplicados, stock o saldos | Muchos usuarios sobre el mismo recurso al mismo tiempo |
| Volumen | ¿Se comporta igual con grandes volúmenes de datos? | Procesos masivos, O-4 | Carga normal con una base de datos o archivos grandes |
| Escalabilidad | ¿Mejora al agregar recursos? | Ajustes de autoescalado o infraestructura | Mismas corridas antes y después del cambio |

Orden habitual: **humo en QA → baseline y calibración en PRE → carga (promedio y pico) → estrés → punto de quiebre → resistencia si aplica**. El plan de cada prueba elige qué tipos corresponden y lo justifica.

> **Ejemplo (Tienda Demo, servicio de checkout):** humo con 1 usuario; carga con 20 compras por minuto (promedio) y 60 (pico de campaña); estrés hasta 150 por minuto; resistencia de 3 horas a 20 por minuto para ver si crece el uso de memoria.

---

## 7. Perfiles de carga

El perfil de carga describe **cuánta carga se aplica y cómo evoluciona en el tiempo**. Se define en el plan de cada prueba a partir del perfil operacional (cómo se usa el servicio en producción: volumen por hora, hora pico, mezcla de operaciones y crecimiento esperado).

### Modelo de carga

| Modelo | Qué controla | Cuándo usarlo |
| :--- | :--- | :--- |
| **Abierto** (por tasa de llegada) | Cuántas iteraciones por segundo o minuto *llegan*, sin importar cuánto tarde el sistema | Carga, estrés y punto de quiebre: representa usuarios reales que llegan independientemente |
| **Cerrado** (por usuarios virtuales) | Cuántos VU hay a la vez; cada uno espera la respuesta antes de seguir | Concurrencia y sistemas con una cantidad acotada de usuarios simultáneos |

> **Nota:** en el modelo cerrado, si el sistema se enlentece, los VU esperan y la carga baja sola, ocultando el problema. Por eso para carga y estrés se prefiere el modelo abierto.

### Forma de cada perfil

| Perfil | Forma de la carga en el tiempo | Ejemplo para Tienda Demo |
| :--- | :--- | :--- |
| Humo | 1 VU durante pocas iteraciones | 1 usuario hace el flujo completo 3 veces |
| Carga promedio | Subida gradual, meseta sostenida, bajada | Subir a 20 compras/min en 2 min, mantener 15 min, bajar en 1 min |
| Carga pico | Igual, con la tasa del pico esperado | Subir a 60 compras/min, mantener 15 min |
| Estrés | Escalones: 100 %, 150 %, 200 % del pico, y bajada para medir recuperación | 60, 90, 120 compras/min, 5 min cada escalón, y luego bajada a 20 |
| Pico (*spike*) | Salto casi instantáneo, meseta corta, vuelta a la base | De 20 a 150 compras/min en 10 s, mantener 2 min, volver a 20 |
| Resistencia | Meseta de carga normal durante horas | 20 compras/min durante 3 h |
| Punto de quiebre | Rampa continua creciente hasta que se rompe un umbral | De 10 a 300 compras/min en 30 min, se corta al incumplir |

### Definir la mezcla de operaciones

Si el flujo tiene varios pasos o varias operaciones, el plan indica el porcentaje de cada una según el uso real (por ejemplo, 70 % consultas de catálogo, 20 % agregar al carrito, 10 % checkout). Se documentan los *think times* (pausas entre acciones del usuario) si se usan.

> **Atención:** los números de los ejemplos son ilustrativos. Los valores reales salen del perfil operacional del servicio y se acuerdan con el PO, el TL y arquitectura.

---

## 8. Métricas, umbrales y criterios de aceptación

### Métricas

| Métrica | Cómo se lee |
| :--- | :--- |
| Tiempo de respuesta por paso | Percentiles p50, p90, p95, p99. El promedio no alcanza porque oculta la cola de los pedidos lentos |
| Duración de la iteración (flujo completo) | p95 contra el objetivo del flujo |
| Tiempo *end-to-end* | Desde el inicio hasta el fin de un proceso de negocio (por ejemplo, procesar un archivo completo) |
| *Throughput* | Operaciones por segundo logradas contra la tasa pedida |
| Tasa de errores | Global y por paso, con el status (500, 502, 503, *timeouts*) |
| Checks funcionales | Si el flujo de negocio se completa correctamente aunque haya errores técnicos (reintentos, alternativas) |
| Iteraciones descartadas (`dropped_iterations` en k6) | Si es mayor que 0, la herramienta no llegó a generar la carga pedida y la corrida **no es concluyente** |
| Uso de recursos | CPU, memoria, instancias, conexiones, colas y base de datos, provistos por SRE |
| Latencia de servicios dependientes | Medida por paso etiquetado (por ejemplo `3-Checkout-Confirmar`) |
| Recuperación | Tiempo hasta volver a valores normales después del estrés |

### Baseline

No hay criterios mínimos generales: cada flujo es distinto. Por eso **toda prueba define un baseline antes de empezar las corridas que se informan**.

- El baseline es la referencia de tiempos, *throughput*, errores y recursos del flujo en PRE con carga controlada.
- Si el servicio ya tiene una corrida aceptada en PRE, esa es el baseline. Si no, se obtiene en la calibración (paso 9 de la sección 12).
- Todas las corridas se comparan contra el baseline. El informe final lo actualiza.
- Sin baseline no se ejecutan las corridas de carga, estrés ni resistencia.

### Umbrales y criterios de aceptación

- Se expresan como umbrales medibles sobre el baseline: `p(95) < X ms` por paso, `iteration_duration p(95) < Y s`, tasa de fallos `< Z %`, *throughput* `≥ W` operaciones por segundo.
- Los **acuerdan el QA, el TL y arquitectura**. Nunca los define una sola persona.
- La primera corrida usa parámetros básicos. Los definitivos salen de la calibración en PRE (referencia: alrededor de 2 veces el p95 observado) y se ajustan con las corridas.
- Una corrida que no cumple **es un hallazgo**. No se relajan los umbrales para que pase.

> **Ejemplo de tabla de umbrales (valores ilustrativos):**
>
> | Paso | Métrica | Umbral |
> | :--- | :--- | :--- |
> | Login | p95 de tiempo de respuesta | menor a 500 ms |
> | Listar catálogo | p95 de tiempo de respuesta | menor a 400 ms |
> | Checkout, confirmar compra | p95 de tiempo de respuesta | menor a 800 ms |
> | Global | Tasa de pedidos fallidos | menor a 1 % |
> | Global | *Throughput* | al menos 95 % de la tasa pedida |
> | Global | Iteraciones descartadas | 0 |

---

## 9. Datos de prueba

| Ambiente | Quién arma los datos | Cómo |
| :--- | :--- | :--- |
| QA (piloto) | **Equipo de QA Automation** | Arma los datos necesarios para el humo y la prueba piloto |
| PRE (prueba real) | **PO del equipo**, con el PA y el equipo de datos o implementaciones | QA Automation especifica qué datos necesita; el PO gestiona y entrega la batería **en un plazo máximo de una semana**; QA Automation la suma al framework |

Pasos para PRE:

1. **Especificación.** En el plan, QA Automation explica cómo tienen que ser los datos: tipo de entidad (usuarios, productos, carritos, pedidos), cantidad de registros distintos según la carga planificada, estados y condiciones (stock, permisos, estado del pedido), si se consumen en cada iteración o se reutilizan, y qué efectos tienen. La especificación se deja en el pedido.
2. **Gestión y entrega.** El PO, con el PA y el equipo de datos, genera o habilita la batería en PRE y la entrega a QA Automation por el pedido, en un plazo máximo de una semana desde la especificación.
3. **Incorporación.** QA Automation la suma al framework, en un archivo por ambiente (por ejemplo `data/usuarios_pre.json`).
4. **Verificación.** Se valida con el humo o la calibración en PRE. Si los datos no alcanzan o no cumplen la especificación, se devuelve el pedido con el detalle y vuelve a correr el plazo.

Reglas:

- Sin la batería de datos en PRE **no se calibra ni se ejecuta**: es un criterio de entrada (sección 13).
- Los datos **quedan disponibles en PRE** después de la prueba, para las re-ejecuciones.
- La cantidad de registros distintos tiene que alcanzar para no medir solo caché ni generar bloqueos que no existen en producción.
- **Solo datos ficticios.** Sin datos personales reales ni credenciales en el código, en los logs ni en Jira (steering `qa-seguridad-datos`). Las credenciales se leen de variables de entorno.
- Las operaciones con efecto real en PRE (envío de correos, cobros de prueba, notificaciones) se ejecutan solo con el OK del TL.

> **Ejemplo (Tienda Demo):** para 60 compras por minuto durante 15 minutos hacen falta como mínimo 900 compras. Si cada usuario solo puede tener un carrito abierto, se piden al menos 900 usuarios de prueba distintos (por ejemplo `usuario_perf_0001` a `usuario_perf_0900`, todos ficticios), cada uno con stock disponible para los productos del flujo.

---

## 10. Ambiente

| Ambiente | Uso | Motivo |
| :--- | :--- | :--- |
| QA | Prueba piloto: armar el script y el humo | No es representativo: otra infraestructura, otros datos, otro tráfico. Un resultado de QA nunca se usa para concluir |
| **PRE** | Baseline, calibración y todas las corridas que se informan | Es lo más parecido a producción |
| PROD | **No se prueba** | Las pruebas de carga afectan a usuarios reales |

PRE es parecido a producción, pero algunos servicios pueden tener distinta cantidad de instancias o de memoria. Por eso **SRE participa antes de empezar las corridas**: valida la configuración de los servicios involucrados e informa las diferencias con producción. Las diferencias se declaran en el análisis de cada corrida y en el informe final.

Condiciones del ambiente durante una corrida:

- No hay despliegues ni otras pruebas en simultáneo. La ventana se coordina con arquitectura.
- Hay monitoreo disponible (CPU, memoria, instancias, conexiones, colas, base de datos).
- La máquina que genera la carga tiene recursos suficientes para no ser el cuello de botella.
- Los servicios de terceros no se sobrecargan: se usan simuladores (*mocks*) o un ambiente de pruebas del tercero.

---

## 11. Herramientas

| Herramienta | Uso |
| :--- | :--- |
| **k6** (Grafana, ejemplo) | Scripts de carga en JavaScript, parametrizados por ambiente y tipo de prueba. **No está incluido** en `plantilla-automation`: el equipo lo suma en un repositorio propio |
| Pipeline de CI/CD (por ejemplo GitHub Actions, con ejecución manual) | Forma de ejecutar en PRE de manera repetible, dejando los resultados como artefactos. Ver [pipelines-ci-cd.md](./pipelines-ci-cd.md) |
| Herramientas de monitoreo (por ejemplo Grafana, el monitoreo de la nube del equipo, el de la plataforma de contenedores) | Observar el sistema durante las corridas |
| Repositorio documental (SharePoint, Drive) | Evidencia de cada corrida e informe |
| Jira (proyecto del equipo y épica de performance en `AUTO`) | Pedido, tarea, decisiones, resultados y hallazgos |
| Kiro, agente `qa-performance`, steering `qa-performance` y skills `qa-performance-plan`, `qa-performance-analisis`, `qa-performance-informe` | Guían el proceso con puntos de control |

> **Nota:** el plan es independiente de la herramienta. Con JMeter, Gatling, Locust u otra se aplican las mismas secciones. Lo que cambia es cómo se escribe el script.

---

## 12. Proceso y ejecución

Cada paso tiene un punto de control: no se avanza sin la confirmación del responsable.

| # | Paso | Responsable | Entregable | Apoyo del playbook |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Decisión de performance en el análisis de la HU | QA del equipo | Comentario de análisis en la HU | Skill `qa-analisis-hu` |
| 2 | Pedido formal, al menos 2 sprints antes del release | TL del equipo | Tarea o historia de pedido con la planilla del Anexo A | — |
| 3 | Tarea en `AUTO` vinculada al pedido | QA Automation | Tarea `AUTO-XX` bajo la épica de performance y rama `feature/AUTO-XX-<resumen>` | Skill `qa-crear-tarea-automatizacion` |
| 4 | Análisis: perfil operacional y modelo de carga | QA Automation con arquitectura | Documento de análisis | Skill `qa-performance-analisis` |
| 5 | Plan de la prueba, con la especificación de los datos de PRE | QA Automation | Plan (Anexo B) y pedido de datos | Skill `qa-performance-plan` |
| 6 | Piloto en QA: implementación y humo con datos armados por QA | QA Automation | Script implementado y humo OK | Agente `qa-performance` |
| 7 | Entrega de la batería de datos en PRE (máximo una semana) | PO, con PA y datos | Datos entregados a QA Automation y sumados al framework | — |
| 8 | Validación de la configuración de PRE | SRE | Instancias y memoria de los servicios involucrados, y diferencias con producción | — |
| 9 | Baseline y calibración en PRE | QA Automation | Corrida de calibración, baseline y umbrales propuestos | Agente `qa-performance` |
| 10 | Acuerdo de criterios | TL y arquitectura | Criterios de aceptación acordados, registrados en la tarea AUTO | — |
| 11 | Corridas en PRE | QA Automation; SRE monitorea | Una corrida por tipo de prueba del plan | Agente `qa-performance` |
| 12 | Análisis y publicación de cada corrida | QA Automation | Análisis + reporte + resultados en crudo en el repositorio documental, con el link en el pedido y en la tarea AUTO | Agente `qa-performance` |
| 13 | Informe final y severidad del resultado | QA Automation | Informe (Anexo C) en el repositorio y en el repositorio documental; resumen en la tarea AUTO y tabla comparativa en el pedido | Skill `qa-performance-informe` |
| 14 | Decisión sobre los resultados | TL; con PO y PA si la severidad es media | Comentario en el pedido: liberar, ajustar, repetir o aceptar el riesgo | — |
| 15 | Tratamiento de hallazgos | Equipo dueño | Bugs o mejoras vinculados (sección 16) | Skill `qa-reporte-bug` |
| 16 | Pull Request | QA Automation | PR a la rama principal con el humo, la calibración y los umbrales acordados | Skill `qa-crear-pr` |

**[PUNTO DE CONTROL] Pedido · esperando tu confirmación** (antes del paso 4; es el primer punto de control de `ANALIZAR`, que verifica que la planilla del Anexo A esté completa)
**[PUNTO DE CONTROL] Plan de la prueba · esperando tu confirmación** (antes del paso 6; punto de control de `PLANIFICAR`)
**[PUNTO DE CONTROL] Valores propuestos · esperando tu confirmación** (al terminar el paso 9 y antes del paso 10; punto de control de `CALIBRAR`: se muestran el baseline y los umbrales propuestos para que el TL y arquitectura los acuerden en el paso 10. Hasta entonces no se corre lo que se informa, paso 11)

Los tres puntos de control de arriba son los del proceso formal. El agente `qa-performance` tiene además otros, uno por etapa de trabajo: `Modelo de carga` (`ANALIZAR`), `Diseño del script`, `Implementación` y `Smoke en QA` (`IMPLEMENTAR`), `Corrida de calibración` (`CALIBRAR`), `Corrida a ejecutar`, `Análisis de la corrida` y `Publicación en el repositorio documental` (`EJECUTAR`), `Informe final` (`INFORMAR`) y `Diagnóstico` y `Corrección` (`REPARAR`). La lista completa y su relación con cada skill está en el agente [`qa-performance`](../.kiro/agents/qa-performance.md).

### 12.1 Planilla del pedido

Todo pedido se arma con la planilla del Anexo A en la descripción de la tarea o historia. **Mientras más completa está, más rápido se puede avanzar.** Si falta una sección, QA Automation la pide en el pedido y la prueba no pasa a análisis hasta tenerla.

| Sección | Qué se completa |
| :--- | :--- |
| Objetivo | Para qué se pide la prueba y qué disparador de la sección 4 aplica |
| Flujo funcional | Los pasos del flujo de negocio en el orden en que se ejecutan |
| Puntos críticos a estresar | Los endpoints, procesos o componentes donde se espera el riesgo |
| Contratos (Swagger / OpenAPI) | Link al contrato de cada endpoint involucrado |
| Volumen de referencia | Volumen de producción o esperado: operaciones por día, hora pico, mezcla y crecimiento |
| Qué se espera obtener | Qué se quiere confirmar, si se busca el punto de quiebre y qué evidencia se necesita para respaldar la salida a producción |

Además, el pedido queda vinculado a la HU o al cambio de origen y tiene el release asociado.

### 12.2 Trazabilidad en Jira

Todo pedido sigue la misma cadena de vínculos:

```text
HU o cambio de origen (proyecto del equipo, por ejemplo PROJ-150)
   └── Tarea o historia de pedido (proyecto del equipo, creada por el TL)
          <── "tests" ── Tarea AUTO de la prueba (hija de la épica de performance)
                             <── "tests" ── Tareas AUTO de ejecución en PRE, si se separan por campaña
```

| Elemento | Regla |
| :--- | :--- |
| Pedido | Tarea o historia en el proyecto del equipo, con la planilla del Anexo A, vinculada a la HU o al cambio de origen |
| Tarea AUTO | Tipo Tarea, proyecto `AUTO`, hija de la épica de performance, título `[Performance] <servicio o flujo> - <motivo>`, etiqueta `PERFORMANCE` y la etiqueta del equipo en minúscula (`alfa`, `beta`, `gamma`, `delta`) |
| Vínculo pedido ↔ tarea AUTO | Tipo `Test`: la tarea AUTO "tests" el pedido, y el pedido muestra "is tested by" |
| Tareas de ejecución en PRE | Opcionales, cuando una campaña de corridas se sigue por separado. Hijas de la misma épica y vinculadas con tipo `Test` a la tarea AUTO |
| Resultados | Links del repositorio documental de cada corrida y tabla comparativa en el pedido; resumen, conclusión y severidad en la tarea AUTO |

> **Nota:** antes de crear, editar o comentar tickets en Jira se muestra el texto exacto y se espera la aprobación del QA.

### 12.3 Definición de terminado de una prueba

1. Humo en QA OK.
2. Batería de datos en PRE entregada y sumada al framework.
3. Configuración de PRE validada por SRE.
4. Baseline definido y criterios acordados por TL y arquitectura.
5. Todas las corridas del plan ejecutadas en PRE, analizadas y publicadas en el repositorio documental.
6. Informe final publicado, con la severidad del resultado, y resultados registrados en el pedido y en la tarea AUTO.
7. Decisión sobre los resultados registrada. Si la severidad es media, con la aceptación del riesgo de PO, PA y TL.
8. Hallazgos registrados como bugs o mejoras.
9. PR a la rama principal aprobado.
10. Pedido y tarea AUTO cerrados **sin vinculadas abiertas**, salvo los hallazgos que pertenecen al equipo dueño, que quedan explícitos en el informe.

---

## 13. Criterios de entrada, salida, suspensión y reanudación

| Criterio | Condición |
| :--- | :--- |
| Entrada al análisis | Pedido del TL con la planilla completa y tarea AUTO creada |
| Entrada a la implementación | Plan aprobado |
| Entrada al baseline y la calibración en PRE | Humo en QA OK, **batería de datos en PRE entregada**, **configuración de PRE validada por SRE**, ventana coordinada con arquitectura, monitoreo disponible |
| Entrada a las corridas que se informan | Baseline definido y criterios acordados |
| Salida de una corrida | Corrida completa sin errores del generador de carga (iteraciones descartadas = 0), análisis hecho y publicado |
| Salida de la prueba | Definición de terminado (12.3) |
| Suspensión | Caída o inestabilidad de PRE, despliegue u otra prueba en simultáneo, cambio de instancias o memoria durante la corrida, datos agotados o incorrectos, efectos no previstos, generador de carga saturado, pedido de SRE o arquitectura |
| Reanudación | Causa resuelta y confirmada por quien suspendió; se repite la corrida completa, no se continúa una parcial |

---

## 14. Implementación en k6 (ejemplo)

> **Nota:** k6 no está incluido en `plantilla-automation`. Esta sección muestra una forma de organizar un repositorio de k6 y un script mínimo, como ejemplo.

Cada prueba tiene todas estas piezas:

| Pieza | Dónde (ejemplo) |
| :--- | :--- |
| Script | `src/tests/<dominio>/<nombre>-test.js` |
| Perfiles de carga | Un módulo común (por ejemplo `src/lib/options.js`) que define los perfiles de la sección 7 |
| Carga por ambiente | La tasa y la duración de cada perfil para `qa` y `pre` |
| URLs | Un archivo por ambiente (`src/env/qa.json`, `src/env/pre.json`) |
| Datos | `src/data/<nombre>_<ambiente>.json` (al menos `qa` y `pre`) |
| Scripts npm o comandos | Humo, carga y depuración de cada prueba |
| Pipeline | Workflow con ejecución manual y parámetros (ambiente, tipo de prueba) |
| Documentación | Análisis, plan e informe junto al test |

Reglas: nada hardcodeado (URLs, usuarios, claves), perfiles centralizados en un solo lugar, modelo abierto (`ramping-arrival-rate`) para carga, estrés y punto de quiebre, y sin secretos en el código (las credenciales se leen de variables de entorno). Cuando se simula el recorrido de un usuario por el front, el script llama a los servicios en el mismo orden que la aplicación.

Script mínimo de ejemplo (el sitio y los datos son ilustrativos; para probar de verdad se usa PRE):

```javascript
import http from 'k6/http';
import { check, group } from 'k6';

// Variables de entorno: nunca se escriben URLs ni credenciales reales en el script.
const BASE_URL = __ENV.BASE_URL;          // por ejemplo https://pre.example.com
const USUARIO = __ENV.QA_USER;            // usuario ficticio del set de QA
const CLAVE = __ENV.QA_PASSWORD;          // clave del usuario ficticio

export const options = {
  scenarios: {
    carga_promedio: {
      executor: 'ramping-arrival-rate',   // modelo abierto: se controla la tasa de llegada
      startRate: 1,                       // arranca con 1 iteración por unidad de tiempo
      timeUnit: '1m',                     // la unidad de tiempo es un minuto
      preAllocatedVUs: 50,                // usuarios virtuales reservados de antemano
      maxVUs: 200,                        // tope de usuarios virtuales si hace falta más
      stages: [
        { target: 20, duration: '2m' },   // subida a 20 iteraciones por minuto
        { target: 20, duration: '15m' },  // meseta sostenida
        { target: 0,  duration: '1m' },   // bajada
      ],
    },
  },
  thresholds: {                           // umbrales: si no se cumplen, la corrida falla
    http_req_failed: ['rate<0.01'],       // menos de 1 % de pedidos fallidos
    'http_req_duration{paso:login}': ['p(95)<500'],      // p95 del login menor a 500 ms
    'http_req_duration{paso:checkout}': ['p(95)<800'],   // p95 del checkout menor a 800 ms
    dropped_iterations: ['count==0'],     // el generador llegó a la carga pedida
  },
};

export default function () {
  group('Login', () => {
    const res = http.post(`${BASE_URL}/api/login`,
      JSON.stringify({ usuario: USUARIO, clave: CLAVE }),
      { headers: { 'Content-Type': 'application/json' }, tags: { paso: 'login' } });
    check(res, { 'login responde 200': (r) => r.status === 200 });
  });
  // Los pasos siguientes (catálogo, carrito, checkout) se agregan con el mismo patrón,
  // etiquetando cada pedido con tags: { paso: '...' } para medirlos por separado.
}
```

Se ejecuta con: `k6 run -e BASE_URL=https://pre.example.com -e QA_USER=... -e QA_PASSWORD=... script.js` (los valores reales los provee el QA en la sesión o el pipeline como secretos).

---

## 15. Riesgos

| Riesgo | Mitigación |
| :--- | :--- |
| Pedido tardío o incompleto | Pedido al menos 2 sprints antes del release y con la planilla completa |
| Batería de datos en PRE insuficiente, repetida o tardía | Especificación en el plan, entrega del PO en una semana, verificación con el humo en PRE |
| Configuración de PRE distinta de producción | Validación de SRE antes de las corridas y diferencias declaradas en el informe |
| Efectos reales (cobros, mensajes, notificaciones) | OK del TL antes de ejecutar en PRE; uso de simuladores de terceros |
| El generador de carga es el cuello de botella | Revisar las iteraciones descartadas y los recursos de la máquina que genera la carga |
| Caché o datos calientes | Variar los datos y documentar la mezcla |
| Otras pruebas o despliegues en PRE en simultáneo | Ventana coordinada con arquitectura |
| Conclusiones con una sola corrida | Repetir antes de concluir |
| Umbrales relajados para que la prueba pase | Los acuerdan QA, TL y arquitectura; un incumplimiento es un hallazgo |
| Ejecución accidental en PROD | La URL del ambiente es obligatoria y se verifica; nunca se prueba en PROD |

---

## 16. Informe, severidad y hallazgos

### Contenido del informe final

El informe (Anexo C) incluye: objetivo, alcance, ambiente (con las diferencias respecto de producción), perfiles ejecutados, datos usados, resultados por métrica contra el baseline y los umbrales, cuellos de botella detectados, comportamiento de recuperación, riesgos, recomendaciones, severidad y conclusión.

### Severidad del resultado

QA Automation asigna una severidad a cada informe final. La severidad define la recomendación de salida a producción.

| Severidad | Significado | Recomendación | Quién decide |
| :--- | :--- | :--- | :--- |
| **Baja** | Sin problemas: se cumplen los criterios acordados o los desvíos no tienen impacto | Salir a producción (GO) | TL |
| **Media** | Hay un riesgo identificado y entendido | Salir a producción conociendo el riesgo (GO WITH RISKS). Requiere la **aceptación explícita de PO, PA y TL** en el pedido | PO, PA y TL |
| **Alta** | El riesgo es inaceptable | **QA no recomienda salir a producción** (NO GO) | TL, con la recomendación de QA registrada |

La severidad del informe se traslada al informe de regresión del release (sección 5).

### Hallazgos

| Hallazgo | Tratamiento |
| :--- | :--- |
| Incumplimiento de un criterio acordado | Bug (tipo `Bug` en Jira) en el proyecto del equipo dueño, vinculado al pedido y a la tarea AUTO, con la severidad del resultado |
| Degradación sin criterio acordado, cuello de botella, recomendación de infraestructura | Mejora o tarea técnica en el proyecto del equipo dueño |
| Problema del script o de los datos | Se corrige en la prueba o se pide corregir la batería. No es un hallazgo del sistema |

Cada hallazgo corregido se revalida con la misma corrida, usando los datos que quedaron en PRE, y se compara contra el baseline.

---

## 17. Entregables y evidencia

| Entregable | Dónde queda | Para qué |
| :--- | :--- | :--- |
| Decisión de performance | Comentario de análisis en la HU | Por qué se pidió o no la prueba |
| Pedido formal | Tarea o historia en el proyecto del equipo, con la planilla del Anexo A | Quién pidió, cuándo y por qué |
| Tarea AUTO | Jira, épica de performance | Seguimiento, decisiones y vínculos |
| Especificación y entrega de datos en PRE | Pedido | Qué se pidió y qué se entregó |
| Validación de PRE | Comentario de SRE en la tarea AUTO | Configuración y diferencias con producción |
| Análisis y plan | Repositorio de performance, junto al test | Cómo se definió la carga y los criterios |
| Baseline y criterios acordados | Comentario en la tarea AUTO y plan actualizado | Referencia y quién acordó qué |
| Corridas en PRE | Pipeline (ejecución) y repositorio documental (reporte, resultados en crudo y análisis) | Evidencia de cada ejecución |
| Informe final | Repositorio, repositorio documental, resumen en la tarea AUTO y tabla comparativa en el pedido | Resultados, severidad, cuellos de botella y recomendaciones |
| Decisión sobre los resultados | Comentario en el pedido (TL; PO, PA y TL si la severidad es media) | Aceptación o riesgo asumido |
| Hallazgos | Bugs o mejoras vinculados | Seguimiento de las correcciones |

**Retención:** la evidencia se conserva hasta que arquitectura indique que ya no es necesaria, con el máximo que defina la política de la empresa.

---

## 18. Seguimiento en Jira y controles internos

### Seguimiento

- Todas las tareas de performance están en la épica de performance del proyecto `AUTO`, con la etiqueta `PERFORMANCE`.
- Cada tarea AUTO está vinculada a su pedido (12.2).
- El líder de QA sigue el avance por la épica: pedidos recibidos, en curso, bloqueados (por datos o por ambiente) y cerrados.

### Controles

El líder de QA ejecuta los controles y registra los desvíos. La **frecuencia y los umbrales los define el equipo responsable (PO, PA y TL)** según lo que necesita y la observabilidad que tiene de sus servicios.

| Id | Control | Tipo | Desvío |
| :--- | :--- | :--- | :--- |
| CP-01 | HU con disparador obligatorio sin decisión de performance en el comentario de análisis | Detectivo | HU con disparador y sin la línea "Performance: aplica / no aplica" |
| CP-02 | Decisión "aplica" sin tarea o historia de pedido | Detectivo | HU con "Performance: aplica" sin pedido vinculado |
| CP-03 | Pedido con menos de 2 sprints de anticipación respecto del release | Detectivo | Fecha del pedido posterior al límite |
| CP-04 | Pedido sin tarea AUTO en la épica de performance | Detectivo | Pedido sin vínculo `Test` a una tarea AUTO |
| CP-05 | Tarea AUTO de performance fuera de la épica o sin etiqueta `PERFORMANCE` | Detectivo | Tarea `[Performance]` sin épica o sin etiqueta |
| CP-06 | Batería de datos en PRE no entregada en una semana | Detectivo | Pedido sin datos entregados después del plazo |
| CP-07 | Corrida en PRE sin publicar en el repositorio documental o sin link en el pedido | Detectivo | Ejecución en PRE sin evidencia registrada |
| CP-08 | Resultado de severidad media sin aceptación de PO, PA y TL | Detectivo | Informe con severidad media sin el comentario de aceptación |
| CP-09 | Pedido o tarea AUTO finalizados con vinculadas abiertas, sin informe o sin decisión | Detectivo | Cierre que no cumple 12.3 |
| CP-10 | Release con prueba obligatoria sin informe, sin severidad o con severidad alta | Preventivo | Línea pendiente o NO GO en el informe de regresión |

**Indicadores:** pedidos recibidos, en curso, bloqueados y cerrados; anticipación de los pedidos; tiempo de entrega de datos en PRE; tiempo desde el pedido hasta el informe; resultados por severidad; desvíos por control y por equipo.

### Regularización de casos retroactivos

Si al implantar el proceso existen casos anteriores sin pedido, sin evidencia o sin decisión:

1. **Período:** los últimos 2 meses como máximo.
2. **Inventario:** listar las tareas de la épica del período y las HU que debieron tener prueba (disparadores O-1 a O-6).
3. **Clasificar** cada caso: completo, sin pedido del equipo, sin vínculo entre pedido y tarea AUTO, falta evidencia, falta informe o severidad, falta decisión, cerrado con vinculadas abiertas, no se probó.
4. **Acción por caso:** crear o vincular el pedido, completar la evidencia, asignar la severidad, registrar la decisión con el TL, cerrar lo pendiente o planificar la prueba si el riesgo sigue vigente.
5. **Seguimiento:** porcentaje regularizado por semana, informado al líder de QA hasta llegar al 100 %.

---

## 19. Capacitación

| Público | Contenido | Frecuencia |
| :--- | :--- | :--- |
| Equipo de QA Automation | Proceso de este documento, la herramienta de carga (por ejemplo k6), el pipeline, análisis de resultados y severidad (base ISTQB CT-PT), con el apoyo del especialista en performance | Cada 6 meses |

Fuera de las capacitaciones, el equipo de QA Automation se apoya siempre en el especialista en performance para el diseño y el análisis de cada prueba. Se registra la asistencia de cada capacitación como evidencia.

---

## Anexo A. Plantilla del pedido

Se copia en la descripción de la tarea o historia de pedido y se completa.

```text
Objetivo
  (Para qué se pide la prueba. Disparador de la sección 4: O-x / R-x)

Flujo funcional
  (Pasos del flujo de negocio, en orden)

Puntos críticos a estresar
  (Endpoints, procesos o componentes donde se espera el riesgo)

Contratos (Swagger / OpenAPI)
  Back:
  Servicios intermedios (BFF):

Volumen de referencia
  (Operaciones por día, hora pico, mezcla, crecimiento esperado)

Qué se espera obtener
  - Confirmar ...
  - Identificar el punto de quiebre / límite de capacidad (sí / no)
  - Contar con evidencia objetiva (tiempos de respuesta, throughput, tasa de error,
    uso de recursos) para respaldar la salida a producción

HU o cambio de origen:        (por ejemplo PROJ-150)
Release asociado:             (por ejemplo Release 2.4)
```

## Anexo B. Plantilla del plan de una prueba

| Sección | Qué se completa |
| :--- | :--- |
| 1. Identificación | Tarea AUTO, pedido, HU de origen, release, responsables |
| 2. Objetivo y disparadores | Qué se quiere demostrar y qué disparadores aplican |
| 3. Alcance | Endpoints y flujo incluidos y excluidos |
| 4. Perfil operacional | Volumen real, hora pico, mezcla de operaciones, crecimiento |
| 5. Tipos de prueba elegidos | Cuáles de la sección 6 y por qué |
| 6. Perfiles de carga | Modelo (abierto o cerrado), tasas, escalones y duraciones de cada tipo |
| 7. Métricas y umbrales | Tabla de métricas, baseline y umbrales propuestos (a acordar) |
| 8. Datos | Especificación de la batería de PRE: entidades, cantidades, estados, consumo |
| 9. Ambiente | PRE, diferencias con producción, ventana acordada, monitoreo |
| 10. Herramientas | Herramienta de carga, pipeline y monitoreo |
| 11. Criterios de entrada, salida, suspensión y reanudación | Los de la sección 13, ajustados a la prueba |
| 12. Cronograma | Fechas de piloto, entrega de datos, calibración y corridas |
| 13. Riesgos | Los de la sección 15 que aplican y los propios |
| 14. Aprobaciones | TL, arquitectura, SRE, líder de QA, con fecha |

## Anexo C. Plantilla del informe

| Sección | Qué se completa |
| :--- | :--- |
| 1. Resumen ejecutivo | Conclusión en pocas líneas, severidad y recomendación (GO / GO WITH RISKS / NO GO) |
| 2. Contexto | Objetivo, alcance, HU y pedido, release |
| 3. Ambiente | Configuración de PRE, diferencias con producción, fecha y hora de las corridas |
| 4. Pruebas ejecutadas | Tabla: tipo, perfil, duración, carga alcanzada, resultado |
| 5. Resultados por métrica | Cada métrica contra el baseline y el umbral, con tablas o gráficos |
| 6. Cuellos de botella y hallazgos | Qué se encontró, dónde y con qué evidencia |
| 7. Recuperación y estabilidad | Cómo se comportó tras el estrés y durante la resistencia |
| 8. Riesgos y limitaciones | Qué no se pudo probar, y qué diferencias podrían afectar la conclusión |
| 9. Recomendaciones | Ajustes, mejoras de infraestructura, pruebas pendientes |
| 10. Decisión | Quién decidió, cuándo y con qué condiciones |
| 11. Evidencia | Links al repositorio documental, a las corridas y a los bugs vinculados |

---

## Referencias

- Steering [`qa-performance`](../.kiro/steering/qa-performance.md): conceptos ISTQB y forma de trabajo.
- Agente [`qa-performance`](../.kiro/agents/qa-performance.md): modos y puntos de control.
- [DoR y DoD](../01-estandares-globales/definicion-dor-dod.md): criterios de performance en la HU.
- [Repositorios y frameworks](./repositorios-y-frameworks.md) y [Pipelines CI/CD](./pipelines-ci-cd.md): k6 como framework opcional y ejecución en pipelines.
- ISTQB Certified Tester Performance Testing (CT-PT), syllabus.
- ISO/IEC/IEEE 29119-3, documentación de pruebas.
