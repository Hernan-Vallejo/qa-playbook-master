# Visión del QA

> **Para qué sirve:** explica hacia dónde va el equipo de QA, qué rol cumple cada QA y cómo se apoya en Kiro (el IDE con inteligencia artificial) y en este playbook.
> **Quién lo usa:** todas las personas del equipo de QA (funcional y automatización), y quienes se suman al equipo y necesitan entender el enfoque.
> **Cuándo se usa:** al incorporarse al equipo, y como referencia cuando haya dudas sobre el alcance del rol o sobre las prioridades de calidad.

> **Nota:** en este documento "la empresa" es una empresa genérica (Acme). El producto de ejemplo es la **Tienda Demo**: una tienda online con login, catálogo de productos (inventario), carrito y checkout, inspirada en el sitio demo público https://www.saucedemo.com/. Reemplazá estos ejemplos por los de tu producto cuando adaptes el playbook: los pasos están en [Adaptar el playbook a un proyecto nuevo](./adaptar-a-un-proyecto-nuevo.md).

## Nuestra Visión

Ser un equipo de QA que no solo valide software, sino que garantice la **calidad integral del negocio**, actuando como factor clave en la confiabilidad, consistencia y evolución del producto.

En un entorno donde múltiples equipos conviven e interactúan constantemente, nuestro rol es asegurar que cada cambio mantenga la estabilidad del ecosistema completo.

---

## El Contexto en el que Operamos

La Tienda Demo no es un sistema aislado. Es un ecosistema donde:

- Cada funcionalidad impacta directa o indirectamente en otras. Ejemplo: un cambio en el catálogo afecta al carrito, y un cambio en el carrito afecta al checkout.
- Los distintos equipos (Alfa: catálogo y carrito; Beta: checkout y pagos; Gamma: cuenta y acceso; Delta: trabaja con especificaciones previas, ver más abajo) están fuertemente integrados.
- Las operaciones tienen impacto económico real: un precio mal calculado o un pedido duplicado cuesta dinero.
- La consistencia de datos es crítica: lo que muestra la pantalla tiene que coincidir con lo que hay en la base de datos de QA.
- Las integraciones (APIs, servicios intermedios entre el front y el back, procesos asíncronos, pasarela de pago) son parte esencial del funcionamiento.
- Una plataforma existente convive con componentes nuevos que se van migrando de a poco.

En este contexto: **todo tiene que ver con todo**. El QA no puede ser fragmentado ni aislado.

> **Nota:** los ambientes son QA, PRE (preproducción) y PROD (producción). Nunca se prueba en PROD.

---

## La Transformación que Estamos Viviendo

El rol de QA está siendo optimizado. No se trata de hacer menos: se trata de hacer diferente y con más impacto.

### De dónde venimos

- QA como ejecutor de pasos manuales
- Conocimiento en la cabeza de personas puntuales
- Análisis reactivo (después del desarrollo)
- Documentación dispersa entre carpetas compartidas, wikis y chats

### A dónde vamos

- **QA como analista de negocio asistido por IA**
- Conocimiento centralizado en este playbook
- Análisis proactivo (antes y durante el desarrollo)
- Documentación viva que Kiro consume para potenciar nuestro trabajo

---

## El Modelo de QA que Buscamos

> **Nota:** HU significa "historia de usuario": la descripción de una funcionalidad desde el punto de vista de quien la usa, con sus criterios de aceptación. DoR (*Definition of Ready*) es la lista de condiciones que una HU debe cumplir para poder empezar a trabajarla. DoD (*Definition of Done*) es la lista de condiciones para darla por terminada. Ambas están en [`01-estandares-globales/definicion-dor-dod.md`](../01-estandares-globales/definicion-dor-dod.md).

### QA como Analista de Negocio

- Entiende qué valida y por qué
- Conoce las reglas de negocio de su funcionalidad
- Detecta riesgos funcionales y operativos antes de que lleguen a testing
- Cuestiona las HU incompletas y pide precisión al PO (*Product Owner*, la persona que define qué se construye y prioriza)

### QA como Guardián del Proceso

- Valida el DoR antes del sprint: no acepta HU sin criterios claros
- Valida el DoD antes del release: no cierra sin cobertura completa
- Mantiene la trazabilidad: HU → casos de prueba → ejecución → evidencia → bug
- Usa Jira y Xray (las herramientas de ejemplo para tickets y gestión de pruebas) como fuente de verdad de cobertura

### QA como Generador de Conocimiento

- Lo que aprende lo documenta en este playbook
- Las reglas de negocio que descubre las plasma en `04-funcionalidades/`
- Los patrones de testing que identifica los comparte con el equipo
- Reduce la dependencia de conocimiento tribal (el que solo está en la cabeza de algunas personas)

### QA Asistido por IA (Kiro)

- Trabaja con agentes y skills homologados: todos los QA siguen el mismo proceso y producen los mismos entregables
- Revisa cada etapa antes de avanzar: Kiro propone, el QA aprueba, ajusta o frena
- Automatiza el análisis repetitivo y la carga en Jira y Xray, y se enfoca en el pensamiento crítico
- Alimenta al playbook para que Kiro tenga cada vez más contexto
- No delega el criterio: la IA amplifica, no reemplaza

---

## Kiro y el QA Playbook como Cerebro

Este repositorio no es documentación pasiva. Es el **cerebro operativo** del equipo de QA: todos lo tienen abierto y desde acá trabajan con Kiro.

| Componente | Función |
| :--- | :--- |
| **Agentes** (`.kiro/agents/`) | Roles de trabajo. Por ejemplo, `qa-sprint` organiza el sprint, `qa-maestro` acompaña cada HU y `qa-regresion` prepara las salidas a producción |
| **Skills** (`.kiro/skills/`) | Procedimientos homologados: análisis de HU, diseño de casos, carga en Xray, bugs, re-ejecución, cierre, test plans e informes |
| **Steerings** (`.kiro/steering/`) | Principios de QA y reglas de Jira, Xray, Gherkin y seguridad de datos que Kiro aplica siempre (un *steering* es un archivo de reglas que Kiro tiene en cuenta) |
| **Perfiles de equipo** (`05-equipos/`) | Lo propio de cada equipo: proyecto, integrantes, reparto, rutas y versiones |
| **Reglas de negocio** (`04-funcionalidades/`) | Contexto de dominio que Kiro usa para entender qué se está testeando |
| **Estándares** (`01-estandares-globales/`, `02-qa-funcional/`) | DoR y DoD, catálogo de etiquetas, estructura y plantillas de test plan |

Cómo se usa todo esto: [Cómo trabajamos con Kiro](./como-trabajamos-con-kiro.md).

Cuanto más completo esté este playbook, mejor trabaja Kiro con nosotros.

---

## Calidad como Responsabilidad Transversal

El QA debe evolucionar de validar funcionalidades individuales a:

- Entender el impacto de punta a punta (E2E, *end to end*) de cada cambio
- Anticipar riesgos entre sistemas y servicios
- Validar integraciones (API + base de datos + interfaz), no solo features aisladas
- Trabajar con foco en el negocio, no solo en la aplicación

Cada QA debe pensar en términos de:

- Flujo completo de una operación (no solo una pantalla). Ejemplo: entrar, elegir un producto, agregarlo al carrito, completar el checkout y ver la confirmación del pedido
- Dependencias entre servicios (front, servicios intermedios, back, base de datos)
- Consistencia de información (lo que muestra el front = lo que hay en la base de datos)
- Posibles efectos colaterales (si toco A, ¿se rompe B?)

---

## Integración de Testing Manual y Automatizado

Ambos enfoques son complementarios y se alimentan mutuamente:

```text
QA Funcional                          QA Automation
─────────────                         ─────────────
Analiza la HU
Diseña casos de prueba (Gherkin)
Ejecuta manualmente
Marca Automatizado / Regresión ──────> Implementa en el framework
                                       Ejecuta en el pipeline (CI/CD)
Valida regresión manual               Valida regresión automatizada
Reporta bugs                          Reporta tests inestables (flaky)
Documenta reglas de negocio           Mantiene la suite de regresión
```

> **Nota:** Gherkin es un formato de escritura de casos en lenguaje natural (Dado / Cuando / Entonces). CI/CD (*Continuous Integration / Continuous Delivery*) es la ejecución automática de pruebas y despliegues cada vez que cambia el código; en este playbook se usa GitHub Actions. Un test *flaky* es uno que a veces pasa y a veces falla sin que cambie el producto.

El funcional alimenta al automation con escenarios validados. El automation libera al funcional de la regresión repetitiva para que se enfoque en análisis de valor. El framework de referencia es Playwright con Page Object Model (POM), disponible en `plantilla-automation/`: trae pruebas de web (con y sin sesión iniciada), un ejemplo de pruebas de API y controles de calidad del código (ESLint y Prettier) que corren también en GitHub Actions. Otros frameworks (por ejemplo Karate para API, k6 para performance o herramientas mobile) son opciones que el equipo puede sumar; no están incluidos en esa plantilla.

---

## Principios del Equipo

1. **Si no está documentado, no existe.** Si Kiro no lo puede leer, no lo puede usar.
2. **La calidad no se prueba al final, se construye durante todo el proceso.**
3. **El QA más valioso es el que entiende el negocio, no el que ejecuta más pasos.**
4. **Automatizamos lo estable, analizamos lo nuevo.**
5. **Cada QA es responsable de mejorar este playbook.**

---

## Nuestro Objetivo Final

Construir un equipo QA que:

- Garantice estabilidad en un entorno complejo y en evolución
- Sea referente en calidad dentro de la organización
- Integre negocio, testing y automatización en un flujo continuo
- Se apoye en Kiro y la IA para ser más eficiente y estratégico
- Evolucione constantemente sin perder foco en el valor para el usuario final
