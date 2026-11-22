# Acceso — Consultas y Scripts de QA

> **Para qué sirve:** reúne consultas SQL de **solo lectura (SELECT)** para verificar datos de usuarios en la base de QA: estado de un usuario, usuarios bloqueados y existencia de los usuarios de prueba.
> **Quién lo usa:** QA del Equipo Gamma y de otros equipos que necesiten confirmar el estado de un usuario antes o después de una prueba.
> **Cuándo se usa:** al preparar la precondición de un caso (por ejemplo, confirmar que `locked_out_user` está bloqueado) o al validar en base de datos el resultado de una prueba.

> **Atención:** el sitio demo https://www.saucedemo.com/ **no tiene una base de datos accesible**. Estas consultas son un **modelo para un proyecto real**. Usan la base ficticia `tienda_qa` y sus tablas son un ejemplo, no el esquema de un sistema existente.
> **Solo SELECT.** Ninguna consulta de este documento modifica datos. Si necesitás cambiar datos de prueba, pedilo al responsable del set de datos de QA.
> **Datos ficticios.** No se escriben datos reales de personas. Reemplazá los placeholders (`@usuario`) por los valores de tu caso.

---

## Esquema de ejemplo: tabla `usuarios`

| Columna | Tipo (ejemplo) | Descripción |
| :--- | :--- | :--- |
| `id` | entero | Identificador interno del usuario |
| `username` | texto | Nombre de usuario con el que se ingresa (ej. `standard_user`) |
| `estado` | texto | `ACTIVO` o `BLOQUEADO` (modelo de ejemplo) |
| `rol` | texto | `COMPRADOR` en el ejemplo |
| `fecha_alta` | fecha | Fecha de creación del usuario |

---

## 1. Estado de un usuario

Sirve para confirmar si un usuario puede ingresar (regla RN-ACC-01 y RN-ACC-03 de [reglas-negocio.md](./reglas-negocio.md)).

```sql
-- Estado de un usuario por nombre de usuario
-- @usuario: reemplazar por el username del caso (ej. 'locked_out_user')
SELECT id, username, estado, rol, fecha_alta
FROM usuarios
WHERE username = '@usuario';
```

> **Ejemplo:** para el caso "Login con usuario bloqueado", la consulta debe devolver `estado = 'BLOQUEADO'` para `locked_out_user`.

---

## 2. Usuarios bloqueados

```sql
-- Lista de usuarios bloqueados (no pueden ingresar)
SELECT id, username, estado
FROM usuarios
WHERE estado = 'BLOQUEADO'
ORDER BY username;
```

---

## 3. Existencia de los usuarios de prueba

Verifica que los tres usuarios de prueba existan antes de correr los tests.

```sql
-- Usuarios de prueba esperados: deben devolverse 3 filas
SELECT username, estado
FROM usuarios
WHERE username IN ('standard_user', 'locked_out_user', 'problem_user')
ORDER BY username;
```

> **Nota:** si faltan filas, el set de datos de QA está incompleto. Pedí la carga al responsable del set de datos y no avances con la ejecución.

---

## 4. Cantidad de usuarios por estado

```sql
-- Resumen por estado (control rápido del set de datos)
SELECT estado, COUNT(*) AS cantidad
FROM usuarios
GROUP BY estado;
```

---

## Cómo usar estas consultas en una prueba

1. **Antes** del caso: ejecutá la consulta 1 para confirmar la precondición.
2. **Durante** el caso: ejecutá la prueba en la interfaz.
3. **Después** del caso: ejecutá de nuevo la consulta para confirmar que no cambió ningún dato que no debía cambiar.

> **Atención:** no pegues en casos, specs o tests datos reales de personas ni credenciales. Usá solo datos del set de QA.
