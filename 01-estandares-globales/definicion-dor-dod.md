# Definition of Ready (DoR) y Definition of Done (DoD)

> **Para qué sirve:** fija los criterios con los que QA decide si una Historia de Usuario (HU) está lista para diseñar casos de prueba (DoR, *Definition of Ready*) y si está terminada desde la perspectiva de QA (DoD, *Definition of Done*).
> **Quién lo usa:** el QA funcional de cada equipo (Alfa, Beta y Gamma), el Product Owner (PO) que responde las observaciones y los agentes de Kiro que analizan y cierran HU (`qa-maestro`).
> **Cuándo se usa:** el DoR, al analizar una HU antes de diseñar los casos (por ejemplo `PROJ-123`). El DoD, al cerrar la HU, después de ejecutar las pruebas. El Equipo Delta, que trabaja con SDD, usa [su propia versión](./definicion-dor-dod-sdd.md).

> **Nota:** una HU (también llamada historia de usuario) es la descripción de una necesidad desde el punto de vista de quien usa el producto. En este playbook el producto de ejemplo es **Tienda Demo**, una tienda online con login, catálogo, carrito y checkout.

---

## Definition of Ready (DoR)

Una HU está lista para QA cuando cumple:

1. **Formato:** "Como [rol], quiero [acción], para [beneficio]".
   > **Ejemplo:** "Como comprador, quiero agregar un producto al carrito, para poder pagarlo después".
2. **Criterios de aceptación:** claros, sin ambigüedad y testeables. Un criterio testeable se puede comprobar con un resultado observable (un valor, un mensaje, una pantalla). Palabras como "rápido" o "adecuado" no alcanzan: hay que pedir el número o la regla concreta.
3. **Reglas de negocio:** mensajes de error, códigos de estado, límites y validaciones documentados.
4. **Diseño y contratos:** link al diseño en Figma (si el equipo lo usa) y a la especificación de la API (Swagger u OpenAPI) cuando aplica.
5. **Dependencias:** servicios upstream (de los que depende la HU) y downstream (que dependen de la HU) identificados.
6. **Datos de prueba:** identificados, o indicado cómo obtenerlos. Siempre ficticios (por ejemplo los usuarios `standard_user` o `locked_out_user` del sitio demo).
7. **Performance:** el comentario de análisis tiene la decisión de performance ("Performance: aplica / no aplica") con su justificación. Si aplica, existe la tarea o historia de pedido vinculada, creada por el Tech Lead (TL) al menos 2 sprints antes del release. Ver el [plan de pruebas de performance](../03-qa-automatizacion/plan-pruebas-performance.md).

### Resultado del análisis

| Conclusión | Significado | Campo QA Análisis |
| :--- | :--- | :--- |
| Ready | Cumple todos los criterios | `REVISADO_OK` |
| Parcialmente Ready | Faltan datos que no impiden empezar el diseño | `REVISADO_NOOK` |
| No Ready | Faltan datos que impiden diseñar los casos | `REVISADO_NOOK` |

> **Nota:** "QA Análisis" es un campo personalizado de la HU en Jira. Los valores `REVISADO_OK` y `REVISADO_NOOK` son los que usa el playbook; si tu proyecto usa otros nombres, se ajustan en el perfil del equipo.

Si hay faltantes, se comenta en la HU con las observaciones y preguntas para el PO. El comentario y el cambio del campo se hacen con la confirmación del QA.

---

## Definition of Done (DoD) de QA

Una HU está terminada para QA cuando:

1. **Cobertura:** 100 % de los criterios de aceptación cubiertos por tests ejecutados en Xray (la herramienta de gestión de pruebas que se integra con Jira).
2. **Defectos:** sin bugs abiertos de severidad Bloqueante (Highest) o Alta (High) relacionados con la HU.
3. **Evidencia:** evidencia de ejecución en la carpeta de evidencias de la HU (por ejemplo `evidencias/PROJ-123/`), con el link registrado en la HU.
4. **Regresión:** regresión recomendada ejecutada en los módulos afectados.
5. **Automatización:** casos candidatos marcados en los campos de automatización del test.
6. **Defectos menores:** los bugs de severidad Baja (Low) que quedan abiertos están acordados con el PO.
7. **Performance:** si la decisión de performance fue "aplica", la prueba cumple su definición de terminado según el [plan de pruebas de performance](../03-qa-automatizacion/plan-pruebas-performance.md): informe final publicado y decisión registrada. Un resultado de severidad Media tiene la aceptación del riesgo del PO, del analista funcional y del TL. Uno de severidad Alta no cumple el DoD.

### Resultado del cierre

| Resultado | Significado |
| :--- | :--- |
| Finalizada sin pendientes | Cumple todos los criterios |
| Finalizada con bug menor aceptado | Queda un bug de severidad Baja acordado con el PO |
| Finalizada con bug pendiente | Queda un bug abierto que no está acordado. No cumple el DoD |

Si el DoD no se cumple, se listan los criterios incumplidos y no se propone la transición de la HU.

---

## Documentos relacionados

- [DoR y DoD del Equipo Delta (SDD)](./definicion-dor-dod-sdd.md)
- [Proceso de Test Plan de regresión](./proceso-test-plan-regresion.md)
- [Guía de trabajo del QA funcional](../02-qa-funcional/proceso-qa-funcional.md)
