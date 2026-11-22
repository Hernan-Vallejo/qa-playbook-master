# Configurar Figma en Kiro mediante MCP

> **Para qué sirve:** conectar Kiro con Figma (herramienta de diseño) para que pueda leer los diseños de una historia de usuario y usarlos al analizar la HU o diseñar casos de prueba.
> **Quién lo usa:** cualquier QA que trabaje con historias que tienen diseños en Figma.
> **Cuándo se usa:** una sola vez por persona al configurar su entorno, y cada vez que hay que renovar el token (porque venció o porque se sospecha que se filtró).

> **Nota (siglas):** **MCP** = *Model Context Protocol*, la forma estándar en que Kiro se conecta con herramientas externas (Jira, GitHub, Figma). Cada conexión es un "servidor MCP". En el playbook, el servidor de Figma se nombra `@figma` y es **opcional**: solo hace falta si el equipo trabaja con diseños en Figma.

> **Atención:** el token de Figma da acceso a tus archivos con tus permisos. **Nunca se escribe en un archivo del repositorio, en un comentario de Jira, en un chat ni en una captura.** Se guarda en una variable de entorno de tu usuario y los archivos de configuración solo la referencian por nombre.

## 1. Generar el token en Figma

1. Ir a la configuración de Figma (menú de tu perfil → Settings) → pestaña *Security* → *Personal access tokens*.
2. Crear un token nuevo con estos permisos (scopes) de solo lectura:
   - **File content**: leer el contenido de los archivos y renderizar imágenes.
   - **File metadata**: leer los metadatos de los archivos.
   - **Library content**: leer datos de componentes y estilos (sistema de diseño).
   - **Library assets**: leer componentes y estilos publicados desde los archivos.
3. Copiar el token apenas se genera (Figma lo muestra una sola vez).

> **Nota:** los nombres exactos de los permisos pueden cambiar entre versiones de Figma. Lo importante es dar solo permisos de **lectura**. QA no necesita modificar diseños.

> **Nota:** el token tiene fecha de vencimiento (se elige al crearlo; se recomienda 90 días como máximo). Al vencer hay que generar uno nuevo (paso 1) y actualizar la variable (paso 2).

## 2. Guardar el token en una variable de entorno

El token se guarda en una variable de entorno de tu usuario, llamada por ejemplo `FIGMA_TOKEN`.

**Windows (PowerShell)**: guarda la variable de forma permanente para tu usuario.

```powershell
# Reemplazá <TU_TOKEN_DE_FIGMA> por el token copiado. Se ejecuta una sola vez.
[Environment]::SetEnvironmentVariable("FIGMA_TOKEN", "<TU_TOKEN_DE_FIGMA>", "User")
```

**macOS / Linux (bash o zsh)**: agregá la línea al archivo de perfil de tu shell (`~/.zshrc` o `~/.bashrc`).

```bash
# Reemplazá <TU_TOKEN_DE_FIGMA> por el token copiado.
export FIGMA_TOKEN="<TU_TOKEN_DE_FIGMA>"
```

Después **cerrá y volvé a abrir Kiro** (y la terminal) para que tome la variable nueva.

> **Atención:** el comando de arriba queda en el historial de tu terminal. Si compartís la máquina, borrá esa línea del historial. No pegues el token en ningún archivo del proyecto. Los archivos `.env` solo son aceptables si están en `.gitignore`, y aun así es preferible la variable del usuario.

## 3. Referenciar la variable en la configuración MCP

Abrí el archivo de configuración MCP de tu usuario (se crea si no existe):

```text
Windows:        C:\Users\<TU_USUARIO>\.kiro\settings\mcp.json
macOS / Linux:  ~/.kiro/settings/mcp.json
```

Agregá el servidor `figma` dentro de `mcpServers`. El token **no se escribe**: se referencia con `${FIGMA_TOKEN}`.

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "${FIGMA_TOKEN}"
      }
    }
  }
}
```

JSON no admite comentarios, así que cada campo se explica acá:

| Campo | Qué es |
| :--- | :--- |
| `mcpServers` | Lista de servidores MCP que Kiro puede usar. Si ya tenés otros (por ejemplo `atlassian` o `github`), agregá `figma` junto a ellos sin borrarlos |
| `figma` | Nombre con el que Kiro identifica al servidor (se usa como `@figma`) |
| `command` y `args` | Cómo se inicia el servidor. En este ejemplo se usa `npx` para ejecutar el paquete de la comunidad `figma-developer-mcp` en modo `--stdio`. Requiere Node.js instalado |
| `env` | Variables de entorno que recibe el servidor al iniciarse |
| `FIGMA_API_KEY` | Nombre de la variable que espera ese servidor. Su valor `${FIGMA_TOKEN}` le indica a Kiro que tome el contenido de tu variable de entorno `FIGMA_TOKEN` |

> **Nota:** este es un ejemplo con un servidor MCP de Figma de la comunidad. Existen otras opciones, incluido el servidor MCP que ofrece Figma. Si tu equipo elige otro, **seguí su documentación**: el comando, los argumentos y el nombre de la variable que espera pueden cambiar. Lo que no cambia es la regla: el token va en una variable de entorno y nunca en el archivo.

> **Nota:** la sintaxis `${NOMBRE_VARIABLE}` para tomar valores del entorno depende de la versión de Kiro. Si en tu versión no se reemplaza, consultá la documentación de Kiro sobre configuración de MCP o pedíselo al líder de QA. No pegues el token en el JSON como solución.

## 4. Verificar

1. Reiniciá la sesión de Kiro, o esperá a que el servidor MCP se reconecte.
2. Revisá en el panel de MCP de Kiro que el servidor `figma` figure como conectado.
3. Probalo pidiendo información de un archivo de Figma con su URL. Por ejemplo: "Con `@figma`, listame las pantallas del archivo `https://www.figma.com/design/<ID_DEL_ARCHIVO>/Tienda-Demo`".

Si falla:

| Síntoma | Causa probable | Qué hacer |
| :--- | :--- | :--- |
| El servidor figura desconectado | Node.js no instalado o la variable `FIGMA_TOKEN` no está definida en el proceso de Kiro | Instalar Node.js, y reiniciar Kiro después de crear la variable |
| Error 403 o "Forbidden" | Token vencido, revocado o sin los permisos de lectura | Generar un token nuevo (paso 1) y actualizar la variable (paso 2) |
| Error 404 o "Not found" | La URL es incorrecta o tu usuario de Figma no tiene acceso al archivo | Verificar la URL y pedir acceso al dueño del archivo |

## 5. Buenas prácticas con el token

- Un token por persona. No se comparten tokens.
- Si el token se publica por error (commit, chat, ticket), **revocalo de inmediato** en Figma y generá uno nuevo.
- Antes de hacer un commit, revisá que `mcp.json` y cualquier archivo del proyecto no contengan el valor del token. El archivo de tu usuario (`~/.kiro/settings/mcp.json`) no está en el repositorio, pero la regla igual aplica a cualquier configuración que compartas.
- Usá solo permisos de lectura.
