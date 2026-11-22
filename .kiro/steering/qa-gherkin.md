---
inclusion: auto
name: qa-gherkin
description: Estándar para diseñar y escribir casos de prueba en Gherkin para Xray (tests tipo Cucumber). Usar al generar, revisar o corregir casos de prueba, escenarios BDD o CSV de importación a Xray.
---
# Diseño y escritura de casos de prueba

> **Para qué sirve:** define cómo se diseñan los casos (técnicas, matriz de cobertura) y cómo se escriben en Gherkin para cargarlos en Xray: formato, `Scenario Outline`, estructura por capa, validaciones, descripción, campos y CSV de importación.
> **Quién lo usa:** Kiro (`inclusion: auto`: se carga cuando la tarea trata de casos de prueba o escenarios) y los QA que revisan o corrigen casos.
> **Cuándo se usa:** al generar, revisar o corregir casos de prueba, escenarios BDD o un CSV para importar en Xray.

> **Nota:** *Gherkin* es el lenguaje de escenarios con palabras clave `Given` (precondición), `When` (acción) y `Then` (resultado esperado). *BDD* (*Behavior Driven Development*) es el enfoque que escribe las pruebas como comportamiento de negocio. *Xray* es la herramienta de gestión de pruebas que se usa dentro de Jira. Todos los ejemplos de este archivo son ficticios y corresponden a la **Tienda Demo** (login, catálogo, carrito y checkout).

## Diseño

1. Partir de los criterios de aceptación, las reglas de negocio de `04-funcionalidades/` y la cobertura existente en Xray.
2. Aplicar técnicas ISTQB según el caso: partición de equivalencia, valores límite, tabla de decisión, transición de estados, casos de uso y error guessing basado en bugs históricos.
   > **Ejemplo:** para el campo código postal del checkout, partición de equivalencia (vacío, válido, con letras) y valores límite (largo mínimo y máximo permitido).
3. Priorizar por riesgo. Cubrir el flujo principal, los alternativos, los negativos y los bordes que tengan impacto.
4. Antes de escribir los escenarios, armar la matriz de cobertura: criterio de aceptación, condición de prueba, tipo de caso (positivo, negativo o borde), técnica, prioridad, capa y cobertura existente.
5. Si la funcionalidad ya tiene cobertura, reutilizarla. Si cambia, proponer marcar los tests afectados como no aplicables (con comentario `deprecado por <CLAVE>`) y crear los nuevos. No borrar ni duplicar.

## Formato

- Tests tipo **Cucumber** en Xray.
- Palabras clave en inglés (`Given`, `When`, `Then`, `And`); contenido en español. En back y BFF se usa el formato de la sección "Back o BFF".
- El campo Gherkin lleva los pasos (y los `Examples` si es Scenario Outline). El nombre del test va en el summary: `<Área>.<Capa>.<título>`.
- Un objetivo de prueba por escenario. `When` es una sola acción.
- Declarativo: describir comportamiento de negocio, no selectores ni detalles de implementación. En back y BFF sí se explicitan dominio, path, método y contrato, porque son el comportamiento que se prueba.
- Roles, permisos, montos y estados con la nomenclatura real del sistema.

## Scenario Outline

Usarlo cuando el test valida **la misma lógica con distintos datos u opciones**. Si cambia la lógica, el flujo o el resultado esperado, escribir escenarios independientes.

- Variables entre `< >` en los pasos; las comillas van en el paso (`'<usuario>'`), nunca dentro de la tabla.
- Cada fila de `Examples` es un caso trazable.

> **Ejemplo:**
>
> ```gherkin
> Scenario Outline: Login con credenciales inválidas
>   Given que el usuario está en la pantalla de login
>   When ingresa el usuario '<usuario>' y la clave '<clave>'
>   Then ve el mensaje de error '<mensaje>'
>
>   Examples:
>     | usuario       | clave         | mensaje                                  |
>     | standard_user | clave_erronea | <texto exacto definido en la HU>         |
>     |               | secret_sauce  | <texto exacto definido en la HU>         |
> ```
>
> Los usuarios y la clave son los del sitio demo público SauceDemo. En un proyecto real las credenciales no van en el caso: se leen de variables de entorno. Los mensajes se toman de la HU o de una ejecución real, no se inventan.

## Estructura por capa

### Front

```gherkin
Given que el usuario tiene permisos <permisos>
When <acción en la UI>
Then <resultado visible esperado>
And el BFF responde HTTP <código> con la estructura esperada
```

> **Nota:** `<permisos>`, `<acción en la UI>`, `<resultado visible esperado>` y `<código>` son huecos que se completan en cada caso. La última línea verifica que el servicio que alimenta la pantalla (BFF) respondió bien.

### Back o BFF

Es el formato estándar de todo caso de backend o BFF en Xray. Es declarativo y legible para documentar el caso; el `.feature` ejecutable de cada framework (por ejemplo Karate, un framework de pruebas de API que el equipo puede sumar, no incluido en la plantilla) se arma a partir de él.

El ejemplo es ficticio: el dominio, el path y el contrato de error no existen y se reemplazan por los del Swagger real del servicio.

```gherkin
Given el dominio "https://api.qa.example.com"
And path "/api/v1/pedidos/"
And path param '<idPedido>'
When metodo GET
And status '<status>'
And imprime la respuesta con diferentes mensajes de error:
"""
{
    "data": "string",
    "success": false,
    "exception": {
        "errorCode": "string",
        "errorMessage": "string",
        "timestamp": "string"
    }
}
"""
Examples:
  | status | idPedido | verificacionMensaje                         |
  |   404  | 999999   | <mensaje definido en el Swagger o la HU>    |
  |   400  |          | <mensaje definido en el Swagger o la HU>    |
```

| Step | Uso |
| :--- | :--- |
| `Given el dominio "<url>"` | URL base del servicio, entre comillas dobles |
| `And path "<path>"` | Path del endpoint, entre comillas dobles |
| `And path param '<param>'` | Parámetro de ruta (variable entre comillas simples) |
| `And query param '<param>'` | Parámetro de query, cuando aplique |
| `And header '<header>'` | Header requerido (por ejemplo, Authorization), cuando aplique |
| `And body:` + bloque `"""` | Cuerpo del request en POST, PUT o PATCH |
| `When metodo GET` / `POST` / `PUT` / `PATCH` / `DELETE` | Método HTTP. Es la única acción del escenario |
| `And status '<status>'` | Código HTTP esperado |
| `And imprime la respuesta ...:` + bloque `"""` | Contrato de la respuesta esperada |
| `And valida en <base> la <tabla o colección> "<nombre>" que <condición>` | Impacto en la base, cuando el servicio modifica estado (ver "Validaciones") |

Reglas de este formato:

- **Examples:** la primera columna suele ser el resultado esperado (`status`), seguida de los datos de entrada. Se suma una columna de mensaje esperado (`verificacionMensaje`) para validar el texto de error. La celda queda vacía cuando el caso omite un parámetro (por ejemplo, `idPedido` vacío para forzar un 400).
- **Contrato de respuesta:** el bloque `"""` representa la estructura esperada, con `"string"`, `false`, etc. como marcadores de tipo o valor. En errores, el objeto de error completo según el contrato real (`exception` o `error`, `success`, `timestamp`); en respuestas exitosas, la estructura del `data` o del cuerpo.
- Un objetivo de prueba por escenario y una fila de `Examples` por caso trazable.

## Validaciones

| Capa | Validación esperada |
| :--- | :--- |
| Back / API | Status y contrato de la respuesta. Si el servicio modifica estado (POST, PUT, PATCH, DELETE), también el impacto en la base (colección o tabla, campo y valor) |
| BFF | Contrato de entrada y salida, transformaciones y manejo de errores |
| Front | Comportamiento visible + respuesta del BFF |

Si no se puede validar la base o el BFF, decirlo en el caso. Los mensajes de error se toman de la documentación o de una ejecución real; nunca se inventan.

## Descripción del test

1. ID del caso, en la primera línea: `ID del caso: PROJ-123-CP01`. Lo asigna `qa-diseno-casos` (clave de la HU + `-CP` + número de dos cifras) y permite relacionar el test de Xray con el caso del borrador y con el test automatizado.
2. Objetivo del caso: qué valida y qué impacto se verifica.
3. Referencias: diseño en Figma (si existe), Swagger BACK, Swagger BFF. (Swagger u OpenAPI es el documento que describe los endpoints de un servicio.)
4. Bloque técnico (solo si el perfil del equipo lo indica): permisos, feature flag (interruptor que activa o desactiva una funcionalidad) y consultas de solo lectura a la base de QA.

En la importación por CSV, la descripción puede llevar wiki markup de Jira (`[texto|url]`, `{panel}`, `{code}`) y va entre comillas.

## Campos y etiquetas de cada test

- Regresión: siempre `Sí` o `No`.
- Automatizado y Estado Automatización según corresponda. Indicar en el borrador si el caso es candidato a automatizar: datos determinísticos, contrato estable, alta frecuencia y validación de base posible.
- Etiquetas del catálogo `02-qa-funcional/catalogo-etiquetas.md`, en el orden y con el formato que define el catálogo (ver steering `qa-jira-xray`). Todo caso lleva su tipo (`positivo`, `negativo` o `borde`), que coincide con la columna Tipo de la matriz de cobertura. Un test integral lleva las etiquetas de cada capa más `integracion`.

> **Ejemplo:** el caso `PROJ-123-CP02` "Login con usuario bloqueado muestra mensaje de error" del Equipo Gamma, probado desde la interfaz, lleva `gamma;front;negativo;login;login_usuario_bloqueado`.

## CSV para Xray

> **Nota:** el CSV permite importar muchos casos de una sola vez desde la pantalla de importación de Xray. Es muy sensible al formato: una columna corrida rompe la importación.

- UTF-8 con BOM (marca de orden de bytes al inicio del archivo; Excel la necesita para leer bien las tildes), delimitador `;`, un escenario por fila.
- Van entre comillas solo el Gherkin, la descripción y las etiquetas. Las comillas internas se duplican.
- Etiquetas separadas por `;`, sin espacios.
- La carpeta del repositorio debe coincidir exactamente con la de Xray.
- Antes de entregarlo, parsearlo y verificar la cantidad de casos y que no haya columnas corridas.
- Columnas, en este orden: `ID de Test;Resumen;Tipo de Test;Nombre de Prioridad;Regresión;Definiciones de Gherkin;Descripción;Directorio de Repositorio de Test;Etiquetas;Persona asignada;Ambiente;Prioridad de automation`. Tipo de Test = `Cucumber`. Los nombres de columna deben coincidir con los de tu instancia: si tu Xray usa otros, se ajustan.
- Fin de línea CRLF. Si la descripción no va entre comillas, no puede tener `;`: es la causa habitual del error `Number of columns is inconsistent on line N` al importar.
