---
name: qa-diseno-casos
description: Diseña los casos de prueba de una HU en dos pasos - primero la matriz de cobertura y después los escenarios Gherkin con etiquetas, campo Regresión y descripción - listos para cargar en Xray. Usar cuando el QA pide "generá los tests", "GENERAR_TESTS", "diseñá los casos", "armá los escenarios" o "armá el CSV para importar en Xray". No crea nada en Jira ni en Xray.
---
# Diseño de casos de prueba

> **Para qué sirve:** Define qué se prueba en una HU (Historia de Usuario) y escribe los casos de prueba, primero como una matriz de cobertura y después como escenarios Gherkin, priorizados por riesgo y sin duplicar lo que Xray ya cubre.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta, junto con el agente de Kiro.
> **Cuándo se usa:** Después de `qa-analisis-hu` y antes de `qa-carga-xray`. También cuando una HU cambió de alcance y hay que sumar casos.

> **Nota:** Gherkin es el formato de escritura de escenarios con las palabras `Given` (dado un contexto), `When` (cuando ocurre una acción) y `Then` (entonces se espera este resultado). Xray es la herramienta de Jira donde se guardan y ejecutan los casos. Un *punto de control* es el momento en que Kiro se detiene y espera tu confirmación.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.1 |
| Puntos de control | Matriz de cobertura, Casos de prueba |
| Archivos en `.qa-work/<CLAVE-HU>/` | Lee `02-analisis.md`. Escribe `03-matriz-cobertura.md`, `04-casos.md` y `04-casos.csv` (si se pide) |

> **Nota:** `.qa-work/<CLAVE-HU>/` (por ejemplo `.qa-work/PROJ-123/`) es la carpeta de trabajo de la HU. Cada archivo pasa por los estados *Borrador*, *Aprobado* y *Publicado*.

## Propósito

Definir qué se prueba y escribir los casos de una HU, priorizados por riesgo y sin duplicar la cobertura existente.

## Cuándo usarla

- Después de `qa-analisis-hu`, o cuando el QA ya tiene el análisis.
- Para agregar casos a una HU que cambió de alcance.

## Cuándo no usarla

- Para cargar los casos en Xray → `qa-carga-xray`.
- Para revisar casos ya cargados → `qa-revision-casos`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU | Sí | Pedirla |
| Análisis de la HU | Sí | Usar el de la conversación. Si no hay, ofrecer correr `qa-analisis-hu` o seguir con una lectura rápida de la HU y de la cobertura existente |
| Equipo | Sí | Deducirlo de la etiqueta o el componente de la HU y confirmarlo |
| Formato de salida | No | Borrador en el chat. Opción: CSV para importar en Xray |

## Contexto que lee

1. Perfil del equipo: `05-equipos/<equipo>.md` (área, etiquetas habituales, si lleva bloque técnico).
2. Documentación funcional de las carpetas del perfil.
3. Steering `qa-gherkin` (las reglas de escritura de escenarios y las técnicas de diseño).
4. Catálogo de etiquetas: `02-qa-funcional/catalogo-etiquetas.md`.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Esta skill solo lee de `@atlassian` (Jira y Xray) y, si hay link de diseño, de `@figma`. No usa `@github`.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `getJiraIssue`, consulta de tests de Xray. `@figma`: lectura de un nodo de diseño |
| Escritura | Ninguna en Jira ni Xray. Solo el archivo CSV local, si el QA lo pide |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md`; crearlos si faltan. Si existe `02-analisis.md`, usarlo como análisis (avisar si la HU cambió después). Si existen `03-matriz-cobertura.md` o `04-casos.md`, mostrarlos y preguntar si se retoman.
1. Leer la HU y el análisis. Si falta la cobertura existente, consultarla en Xray.
2. **[PUNTO DE CONTROL] Matriz de cobertura · esperando tu confirmación.** Armar la tabla de la sección Entregable 1 aplicando las técnicas del steering `qa-gherkin` (partición de equivalencias, valores límite, tabla de decisión, etc.). Marcar qué condiciones ya están cubiertas por tests existentes. Guardarla en `03-matriz-cobertura.md` (Borrador).
3. **Punto de confirmación 1.** Mostrar la matriz y esperar. No escribir escenarios hasta que el QA la apruebe. Al aprobar, pasar el archivo a Aprobado y actualizar `indice.md`.
4. **[PUNTO DE CONTROL] Casos de prueba · esperando tu confirmación.** Por cada condición aprobada, escribir el caso con el formato del Entregable 2 y guardarlos en `04-casos.md` (Borrador):
   - ID del caso con la clave de la HU: `PROJ-123-CP01`, `PROJ-123-CP02`, etc. (clave de la HU, `-CP` y un número correlativo de dos cifras). Este es el ID canónico del caso: lo usan la carga en Xray, la automatización y el cierre.
   - Nombre `<Área>.<Capa>.<título>`, con el Área del perfil (por ejemplo `Cliente.FRONT.Login exitoso con usuario válido`).
   - Scenario Outline solo si es la misma lógica con distintos datos.
   - Etiquetas del catálogo (`02-qa-funcional/catalogo-etiquetas.md`), en su orden: Equipo, Capa, Tipo de caso (`positivo`, `negativo` o `borde`), Funcionalidad, Historia / Servicio y, si aportan, Módulo, Versión y Extra. La capa FRONT lleva la etiqueta `front`; BFF y BACK llevan `api`. Si el nivel de Historia / Servicio no es claro o no existe, listar candidatas y preguntar. Si el test es integral, preguntar antes de sumar las etiquetas de cada capa y `integracion`.
   - Regresión `Sí` o `No` con el motivo.
   - Candidato a automatizar `Sí` o `No` con el motivo.
   - Descripción: primera línea `ID del caso: <ID>`, objetivo, referencias y bloque técnico si el perfil lo indica (estructura en el steering `qa-gherkin`).
5. **Punto de confirmación 2.** Mostrar los casos y esperar. Al aprobar, pasar `04-casos.md` a Aprobado y actualizar `indice.md`.
6. Si el QA pide CSV, generarlo en `.qa-work/<CLAVE-HU>/04-casos.csv`, parsearlo y verificar cantidad de filas, columnas y codificación.

> **Nota:** "Candidato a automatizar" indica si el caso conviene pasarlo a un test automático de Playwright (ver `03-qa-automatizacion/proceso-automatizacion.md`). "Regresión" indica si el caso se vuelve a correr en cada release para comprobar que lo existente no se rompió.

## Punto de confirmación

- **1 (matriz):** "¿Aprobás la matriz, agregamos o sacamos condiciones?"
- **2 (casos):** "¿Aprobás los casos, ajustamos alguno o los dejamos acá?"

Si se pide un ajuste, corregir y volver a mostrar solo lo que cambió.

## Entregable

### 1. Matriz de cobertura

> **Nota:** la matriz relaciona cada criterio de aceptación (CA) de la HU con las condiciones que hay que probar. Así se ve de un vistazo si algún criterio quedó sin cubrir.

| # | Criterio de aceptación | Condición de prueba | Tipo | Técnica | Capa | Prioridad | Cobertura existente | Decisión |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | <CA> | <condición> | Positivo | <técnica ISTQB> | FRONT | P0 | <PROJ-310 o Ninguna> | Nuevo / Reutilizar / Actualizar |

Explicación de las columnas: **Tipo** es Positivo, Negativo o Borde (el conjunto de la HU debe incluir los tres; si falta alguno, se marca como gap). **Técnica** es la técnica de diseño que justifica la condición (ISTQB es el estándar internacional de certificación en testing). **Capa** es FRONT, BFF o BACK. **Prioridad** va de P0 (crítica) a P3 (baja) y se traslada a la prioridad del test en Jira así: P0 → Highest, P1 → High, P2 → Medium, P3 → Low. **Cobertura existente** es la clave del test de Xray que ya cubre la condición. **Decisión** indica si se crea un test nuevo, se reutiliza el existente o se actualiza.

Al pie: condiciones que quedan fuera de alcance y por qué.

### 2. Casos

> **Ejemplo:** el caso que sigue es el formato; los valores entre `<>` se reemplazan. Para la Tienda Demo, un caso real sería `PROJ-123-CP01`, `Cliente.FRONT.Login exitoso con usuario válido`, con `standard_user` (usuario público del sitio demo; en un proyecto real los datos de prueba y las credenciales van en variables de entorno, no en archivos).

```text
### <n>. <ID del caso> - <Área>.<Capa>.<título>     # ej. PROJ-123-CP01 - Cliente.FRONT.Login exitoso con usuario válido
Prioridad: <Highest/High/Medium/Low>                # prioridad del test en Jira (P0 a P3 de la matriz)
Tipo: Positivo | Negativo | Borde
Etiquetas: <etiqueta1>;<etiqueta2>;...             # del catálogo, en minúscula, separadas por punto y coma
Regresión: Sí | No — <motivo>
Candidato a automatizar: Sí | No — <motivo>
Descripción: ID del caso: <ID>. <objetivo>. Referencias: <Figma, Swagger>.
Gherkin:
  Given ...                                         # contexto inicial
  When ...                                          # una única acción
  Then ...                                          # resultado verificable
```

Siguiente paso sugerido: `qa-carga-xray`.

## Reglas

- No inventar mensajes de error, campos ni respuestas: tomarlos de la documentación o marcarlos como INFORMACIÓN INSUFICIENTE.
- No duplicar: si una condición ya está cubierta, proponer reutilizar el test existente.
- Si un test existente queda desactualizado, proponer deprecarlo (no aplicable, comentario `deprecado por <CLAVE>`). La deprecación la hace `qa-carga-xray` con confirmación.
- Casos extra fuera de los criterios de aceptación se marcan como "extra" para que el QA decida.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La importación falla con "folder not found" | La carpeta indicada en el CSV no coincide con la del repositorio de tests de Xray | Copiar la ruta exacta del perfil y verificarla en Xray |
| Columnas corridas en el CSV | Saltos de línea o `;` sin comillas | Encerrar Gherkin, descripción y etiquetas entre comillas y duplicar las internas |

## Criterios de calidad

- Cada criterio de aceptación tiene al menos una condición o una justificación de por qué no.
- Cada caso tiene un solo objetivo y un `When` atómico (una sola acción).
- Todas las etiquetas existen en el catálogo, o hay una propuesta de etiqueta nueva aprobada.
- Regresión y automatización tienen motivo.

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | HU nueva sin cobertura | Matriz completa y casos nuevos |
| 2 | HU con tests existentes (ej. `PROJ-123` con el test `PROJ-310`) | La matriz marca la cobertura existente y solo propone lo que falta |
| 3 | Varios casos con la misma lógica y distintos datos | Un Scenario Outline |
| 4 | Una etiqueta de nivel 3 no existe | Lista candidatas o propone una nueva para el catálogo; no la inventa |
| 5 | El QA no aprueba la matriz | No escribe escenarios |
