# Acceso (Visión Cliente) — Reglas de Negocio

> **Para qué sirve:** documenta las reglas del login de Tienda Demo: quién puede ingresar, qué mensajes exactos se muestran ante un error y cómo se comportan los usuarios de prueba (normal, bloqueado y con problemas).
> **Quién lo usa:** QA del Equipo Gamma (responsable del módulo) y de los demás equipos, que dependen del login para probar sus módulos. También los agentes de Kiro al revisar HU de acceso.
> **Cuándo se usa:** al analizar una HU que toque login, sesión o usuarios; al diseñar casos negativos de acceso; al armar la automatización de `login.spec.ts`.

> **Equipo:** Gamma (cuenta y acceso)
> **Proyecto Jira:** `PROJ`
> **Estado de la doc:** Completa para el alcance del sitio demo. Los puntos marcados "Pendiente de definir por el PO" requieren confirmación.
> **Última actualización:** 2026-11-02
> **Documento complementario:** `consultas-sql-qa.md` (consultas SELECT de ejemplo para esta funcionalidad).

> **Nota sobre el origen de las reglas:** las reglas de este documento están **observadas en el sitio demo público** https://www.saucedemo.com/. En un proyecto real, cada regla debe confirmarse con el PO y la historia. Lo que el sitio demo no permite afirmar figura como **"Pendiente de definir por el PO"**.

---

## Descripción

El acceso permite que un comprador inicie sesión con usuario y clave. Si las credenciales son correctas y el usuario está habilitado, el sistema lo lleva al catálogo (inventario). Si no, muestra un mensaje de error. Es la puerta de entrada a todo el flujo de compra.

---

## Actores y Permisos

| Actor / Rol | Permiso requerido | Qué puede hacer |
| :--- | :--- | :--- |
| Comprador sin sesión | Ninguno | Ver la pantalla de login e intentar ingresar |
| Comprador con sesión | Sesión iniciada | Ver el catálogo, usar el carrito y comprar |
| Comprador bloqueado | — | No puede ingresar: el sistema le muestra un mensaje de bloqueo |

---

## Usuarios de prueba (sitio demo público)

| Usuario | Clave | Comportamiento esperado |
| :--- | :--- | :--- |
| `standard_user` | `secret_sauce` | Ingresa y llega al catálogo |
| `locked_out_user` | `secret_sauce` | No ingresa: mensaje de bloqueo (RN-ACC-03) |
| `problem_user` | `secret_sauce` | Ingresa, pero el catálogo y el carrito tienen comportamientos defectuosos a propósito (ver [02-catalogo](../02-catalogo/reglas-negocio.md) y [03-carrito](../03-carrito/reglas-negocio.md)) |

> **Atención:** son credenciales **públicas de un sitio demo**. En un proyecto real las credenciales **van en variables de entorno** (`QA_USER`, `QA_PASSWORD`), nunca en archivos, casos o tests. El sitio demo tiene otros usuarios de prueba que este playbook no cubre: **Pendiente de definir por el PO** si se incorporan.

---

## Flujo Principal

1. El comprador abre la pantalla de login.
2. Ingresa usuario y clave.
3. Presiona el botón de login.
4. El sistema valida las credenciales y el estado del usuario.
5. Si todo es correcto, muestra el catálogo (inventario) con los productos.

---

## Reglas de Negocio

| ID | Regla | Condición | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| RN-ACC-01 | Login exitoso | Usuario `standard_user` y clave `secret_sauce` | El sistema muestra la pantalla de catálogo (URL termina en `/inventory.html`) con 6 productos |
| RN-ACC-02 | Credenciales incorrectas | Usuario o clave que no corresponden a ningún usuario | El sistema permanece en el login y muestra el mensaje exacto: `Epic sadface: Username and password do not match any user in this service` |
| RN-ACC-03 | Usuario bloqueado | Usuario `locked_out_user` con clave correcta | El sistema permanece en el login y muestra el mensaje exacto: `Epic sadface: Sorry, this user has been locked out.` |
| RN-ACC-04 | Usuario requerido | Campo usuario vacío | El sistema muestra el mensaje exacto: `Epic sadface: Username is required` |
| RN-ACC-05 | Clave requerida | Usuario completo y campo clave vacío | El sistema muestra el mensaje exacto: `Epic sadface: Password is required` |
| RN-ACC-06 | Prioridad de validación de campos | Usuario y clave vacíos a la vez | El sistema muestra el mensaje de usuario requerido (RN-ACC-04) |
| RN-ACC-07 | Cierre de sesión | Usuario con sesión iniciada elige "Logout" en el menú | El sistema vuelve a la pantalla de login y no conserva la sesión |
| RN-ACC-08 | Acceso sin sesión | Se abre directamente la URL del catálogo sin haber iniciado sesión | El sistema muestra el login con un mensaje de error de acceso (texto exacto: ver nota) |
| RN-ACC-09 | Sensibilidad a mayúsculas | Usuario o clave con mayúsculas distintas (ej. `Standard_User`) | Se trata como credenciales incorrectas (RN-ACC-02) |
| RN-ACC-10 | Cierre del mensaje de error | Hay un mensaje de error visible y el comprador presiona la "x" del mensaje | El mensaje desaparece |

> **Nota (RN-ACC-04 a RN-ACC-06 y RN-ACC-08):** los mensajes de campo requerido y de acceso sin sesión están **observados en el sitio demo**. El texto observado para el acceso sin sesión es `Epic sadface: You can only access '/inventory.html' when you are logged in.`. Antes de usarlos en un proyecto real, confirmar con el PO.

> **Ejemplo (caso negativo):** `PROJ-101-CP03 - Login fallido con usuario bloqueado`. Precondición: pantalla de login abierta. Pasos: ingresar `locked_out_user` y `secret_sauce`, presionar login. Resultado esperado: se muestra `Epic sadface: Sorry, this user has been locked out.` y la URL no contiene `/inventory.html`.

### Pendiente de definir por el PO

| # | Tema | Por qué importa |
| :--- | :--- | :--- |
| 1 | Cantidad máxima de intentos fallidos antes de bloquear un usuario | El sitio demo no bloquea por intentos: el bloqueo está fijo en `locked_out_user` |
| 2 | Tiempo de vencimiento de la sesión | No se puede diseñar un caso de sesión expirada sin el valor |
| 3 | Política de claves (largo mínimo, caracteres) | El sitio demo no tiene alta de usuarios ni cambio de clave |
| 4 | Recuperación de clave | El sitio demo no tiene esa función |
| 5 | Si el carrito se conserva después de cerrar sesión | Afecta casos de carrito y de acceso |

---

## Endpoints / Servicios

No aplica al sitio demo: no expone una API documentada. En un proyecto real, el equipo completa esta sección. **Pendiente de definir por el PO.**

---

## Estados

Estados de un usuario (modelo de ejemplo para un proyecto real, usado en `consultas-sql-qa.md`):

| Estado | Significado | Efecto en el login |
| :--- | :--- | :--- |
| `ACTIVO` | Usuario habilitado | Puede ingresar (RN-ACC-01) |
| `BLOQUEADO` | Usuario bloqueado | No puede ingresar (RN-ACC-03) |

> **Nota:** los nombres de estado son un **modelo de ejemplo**. El sitio demo no los muestra. **Pendiente de definir por el PO** los estados reales en un proyecto.

---

## Validación en Base de Datos

El sitio demo no tiene base de datos accesible. En un proyecto real, ver `consultas-sql-qa.md` para verificar el estado de un usuario en la base ficticia `tienda_qa`.

| Base / Esquema | Tabla | Qué validar |
| :--- | :--- | :--- |
| `tienda_qa` | `usuarios` | `estado` = 'BLOQUEADO' para el usuario `locked_out_user` |

---

## Casos Borde y Escenarios de Error

- Usuario y clave vacíos: se muestra `Epic sadface: Username is required` (RN-ACC-06).
- Usuario con espacios al inicio o al final: **Pendiente de definir por el PO** si se recortan o se rechazan.
- Clave correcta con usuario inexistente: mismo mensaje que RN-ACC-02. El sistema no debe revelar cuál de los dos datos es incorrecto.
- Usar el botón "atrás" del navegador después de cerrar sesión: no se debe mostrar el catálogo con la sesión anterior. Por RN-ACC-08, el sistema debe mostrar el login con el mensaje de acceso sin sesión. Si el sitio responde distinto, **Pendiente de definir por el PO** cuál es el comportamiento esperado.
- Recargar la página del catálogo con sesión iniciada: la sesión se conserva.

---

## Dependencias

- El módulo de acceso es prerrequisito de [02-catalogo](../02-catalogo/reglas-negocio.md), [03-carrito](../03-carrito/reglas-negocio.md) y [04-checkout](../04-checkout/reglas-negocio.md).
- En la plantilla de automatización: `pages/LoginPage.ts`, `tests/sin-sesion/login.spec.ts` y `data/usuarios.ts`.

---

## Cobertura en la plantilla de automatización

Historia de ejemplo `PROJ-101` ("Iniciar sesión en la Tienda Demo"), en `plantilla-automation/tests/sin-sesion/login.spec.ts`. Los tests comprueban el fragmento del mensaje que va después de `Epic sadface: ` (por ejemplo `Sorry, this user has been locked out`); el texto completo con el prefijo es el de la columna "Comportamiento esperado" de las reglas.

| Regla | Caso de prueba |
| :--- | :--- |
| RN-ACC-01 | `PROJ-101-CP01 - Login exitoso con usuario válido` |
| RN-ACC-02 | `PROJ-101-CP02 - Login fallido con contraseña incorrecta` |
| RN-ACC-03 | `PROJ-101-CP03 - Login fallido con usuario bloqueado` |
| RN-ACC-04 | `PROJ-101-CP04 - Login fallido con usuario vacío` |
| RN-ACC-05 | `PROJ-101-CP05 - Login fallido con contraseña vacía` |
| RN-ACC-06 a RN-ACC-10 | Sin test automatizado todavía: se prueban a mano o quedan como candidatos a automatizar |

---

## Datos de Prueba

| Dato | Valor |
| :--- | :--- |
| Usuario normal | `standard_user` |
| Usuario bloqueado | `locked_out_user` |
| Usuario con problemas | `problem_user` |
| Clave (sitio demo público) | `secret_sauce` |
| Usuario inexistente (para RN-ACC-02) | `usuario_inexistente` |

> **Atención:** en un proyecto real se piden los usuarios de prueba al responsable del set de datos de QA y se cargan por variables de entorno.

---

## Referencias

- Sitio demo: https://www.saucedemo.com/
- Contexto general: [contexto-funcionalidades.md](../../contexto-funcionalidades.md)
- Siguiente módulo del flujo: [02-catalogo/reglas-negocio.md](../02-catalogo/reglas-negocio.md)
- Perfil del equipo: [05-equipos/gamma.md](../../../05-equipos/gamma.md)

---

## Changelog

| Fecha | Cambio |
| :--- | :--- |
| 2026-11-02 | Documentación inicial: login, usuarios de prueba, mensajes exactos y pendientes para el PO. |
