<#
.SYNOPSIS
    Busca en el repositorio todos los datos de EJEMPLO que hay que reemplazar al llevar el playbook a un proyecto real.

.DESCRIPTION
    El playbook usa datos inventados (la empresa "Acme", el producto "Tienda Demo", los equipos Alfa/Beta/Gamma/Delta,
    las claves de Jira PROJ y AUTO, el sitio demo SauceDemo, etc.). Cuando lo adaptás a tu proyecto, tenés que
    reemplazarlos por los tuyos. Este script te dice DÓNDE están, para no dejar ninguno olvidado.

    El script SOLO LEE archivos: no modifica nada.

.PARAMETER Detalle
    Muestra cada línea encontrada (archivo, número de línea y texto). Sin este parámetro muestra solo el resumen.

.PARAMETER TerminosExtra
    Lista de textos adicionales a buscar (por ejemplo el nombre de tu empresa anterior, para confirmar que no quedó nada).

.PARAMETER Ruta
    Carpeta a revisar. Por defecto, la raíz del repositorio (la carpeta que contiene a "scripts").

.EXAMPLE
    .\scripts\buscar-datos-de-ejemplo.ps1
    Muestra cuántas veces aparece cada dato de ejemplo y en cuántos archivos.

.EXAMPLE
    .\scripts\buscar-datos-de-ejemplo.ps1 -Detalle
    Además muestra todas las líneas, para ir reemplazándolas una por una.

.EXAMPLE
    .\scripts\buscar-datos-de-ejemplo.ps1 -TerminosExtra "MiEmpresaVieja","mi-sistema-viejo"
    Suma tus propios términos a la búsqueda.
#>

[CmdletBinding()]
param(
    # Muestra el detalle de cada coincidencia.
    [switch]$Detalle,

    # Textos extra a buscar (opcional).
    [string[]]$TerminosExtra = @(),

    # Carpeta a revisar. Si no se indica, se calcula abajo: la raíz del repositorio.
    [string]$Ruta = ''
)

# Si no se pasó -Ruta, se usa la carpeta padre de la carpeta donde está este script ("scripts"), o sea la raíz del repositorio.
# $PSCommandPath es la ruta completa de este archivo; se usa en lugar de $PSScriptRoot porque funciona igual en Windows PowerShell 5.1 y en PowerShell 7.
if (-not $Ruta) { $Ruta = Split-Path -Parent (Split-Path -Parent $PSCommandPath) }

# Tabla de datos de ejemplo: "qué es" -> "expresión a buscar".
# [ordered] mantiene el orden en que se escriben, para que el resumen se lea siempre igual.
$datos = [ordered]@{
    'Empresa de ejemplo (Acme)'                 = 'Acme'
    'Producto de ejemplo (Tienda Demo)'         = 'Tienda Demo'
    'Equipos de ejemplo (Alfa/Beta/Gamma/Delta)' = 'Equipo (Alfa|Beta|Gamma|Delta)|\b(alfa|beta|gamma|delta)\.md'
    'Clave de Jira de historias (PROJ)'         = '\bPROJ-?\d*'
    'Clave de Jira de automatización (AUTO)'    = '\bAUTO-\d+'
    'Sitio demo (SauceDemo)'                    = 'saucedemo'
    'API de práctica (jsonplaceholder)'         = 'jsonplaceholder'
    'URLs de ejemplo (example.com)'             = 'example\.com'
    'Credenciales del sitio demo'               = 'standard_user|locked_out_user|problem_user|secret_sauce'
    'Base de datos ficticia (tienda_qa)'        = 'tienda_qa'
    'Workspace de ejemplo (QA-WORKSPACE)'       = 'QA-WORKSPACE'
}

# Los términos extra del usuario se agregan al final.
foreach ($t in $TerminosExtra) { $datos["Término extra: $t"] = [regex]::Escape($t) }

# Carpetas que no se revisan: dependencias, resultados de corridas y control de versiones.
$excluidas = '\\(node_modules|\.git|playwright-report|test-results)(\\|$)'

# Extensiones de texto que vale la pena revisar.
$extensiones = '.md', '.html', '.json', '.jsonc', '.yml', '.yaml', '.ts', '.mjs', '.toml', '.sh', '.ps1'

# Lista de archivos a revisar (sin las carpetas excluidas y sin este mismo script, que contiene los términos).
$archivos = Get-ChildItem -Path $Ruta -Recurse -File -Force |
    Where-Object {
        $_.FullName -notmatch $excluidas -and
        ($extensiones -contains $_.Extension.ToLower()) -and
        $_.FullName -ne $PSCommandPath
    }

Write-Host ""
Write-Host "Revisando $($archivos.Count) archivos en: $Ruta"
Write-Host ""

$resumen = foreach ($nombre in $datos.Keys) {
    # Select-String devuelve una coincidencia por línea. -Pattern admite expresiones regulares.
    $coincidencias = $archivos | Select-String -Pattern $datos[$nombre] -ErrorAction SilentlyContinue

    [pscustomobject]@{
        'Dato de ejemplo' = $nombre
        'Líneas'          = @($coincidencias).Count
        'Archivos'        = @($coincidencias | Select-Object -ExpandProperty Path -Unique).Count
    }

    # Con -Detalle se imprime cada línea para poder ir a corregirla.
    if ($Detalle -and $coincidencias) {
        Write-Host "== $nombre" -ForegroundColor Cyan
        foreach ($c in $coincidencias) {
            $relativa = $c.Path.Substring($Ruta.Length).TrimStart('\', '/')
            $texto = $c.Line.Trim()
            if ($texto.Length -gt 140) { $texto = $texto.Substring(0, 140) + '...' }
            Write-Host ("  {0}:{1}  {2}" -f $relativa, $c.LineNumber, $texto)
        }
        Write-Host ""
    }
}

Write-Host "Resumen: datos de ejemplo que hay que revisar" -ForegroundColor Green
$resumen | Format-Table -AutoSize

Write-Host "Qué hacer con esto: seguí la guía 00-introduccion/adaptar-a-un-proyecto-nuevo.md."
Write-Host "Una cantidad en 0 significa que ese dato ya no está en el repositorio."
