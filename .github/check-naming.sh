#!/usr/bin/env bash
# =============================================================================
# check-naming.sh - Validación de nombres de archivos y carpetas del Playbook
# =============================================================================
# Reglas (según CONTRIBUTING.md, sección "Convenciones de formato"):
#
#   ARCHIVOS .md:
#     - Solo minúsculas, dígitos y guiones: [a-z0-9-]
#     - Sin espacios, sin guion bajo, sin tildes/ñ, sin mayúsculas
#     - Extensión .md en minúscula
#
#   CARPETAS:
#     - Solo minúsculas, dígitos y guiones: [a-z0-9-]
#     - Las funcionalidades usan el patrón NN-nombre (ej: 04-checkout)
#     - Sin espacios, sin mayúsculas, sin tildes/ñ
#
#   PROHIBIDO:
#     - Binarios de ofimática (.docx, .xlsx, .pdf, .doc): convertir a Markdown
#       (también dentro de plantilla-automation/)
#
#   EXCEPCIONES (permitidas tal cual):
#     - README.md, CONTRIBUTING.md, CHANGELOG.md, LICENSE.md (solo en la raíz)
#     - Archivos ocultos de config (.gitignore, .env.example, etc.)
#     - Todo lo que esté bajo .git/, .github/, .kiro/, .qa-work/, node_modules/
#     - plantilla-automation/: es un proyecto de código (TypeScript) con sus
#       propias convenciones (por ejemplo, Page Objects en PascalCase como
#       pages/LoginPage.ts y README.md en mayúsculas). Se excluye del chequeo
#       de nombres; solo se le prohíben los binarios de ofimática.
#
# Recorre el filesystem con `find` (no depende de git, funciona en cualquier
# máquina con bash). Sale con código != 0 si encuentra alguna violación.
# =============================================================================

# -e: corta ante un error inesperado; -u: error si se usa una variable sin definir;
# -o pipefail: un pipe falla si falla cualquiera de sus partes.
set -euo pipefail

# Contador de violaciones encontradas.
errores=0

# Archivos de raíz permitidos en mayúsculas por convención.
es_archivo_raiz_permitido() {
  case "$1" in
    README.md|CONTRIBUTING.md|CHANGELOG.md|LICENSE.md) return 0 ;;
    *) return 1 ;;
  esac
}

# --- Validación de ARCHIVOS ---
# find lista todos los archivos; se excluyen las carpetas de infraestructura/config.
while IFS= read -r ruta; do
  ruta="${ruta#./}"                       # normalizar: quitar el "./" inicial
  case "$ruta" in
    .git/*|.github/*|.kiro/*|.qa-work/*|node_modules/*) continue ;;
  esac

  nombre=$(basename "$ruta")

  # Binarios de ofimática: prohibidos siempre (incluso en plantilla-automation/).
  case "$nombre" in
    *.docx|*.DOCX|*.xlsx|*.XLSX|*.pdf|*.PDF|*.doc|*.DOC)
      echo "ERROR: binario de ofimática (convertir a Markdown): $ruta"
      errores=$((errores + 1))
      continue
      ;;
  esac

  # La plantilla de automatización tiene sus propias convenciones: se salta el resto.
  case "$ruta" in
    plantilla-automation/*) continue ;;
  esac

  # Archivos de raíz permitidos: se saltan.
  if [ "$ruta" = "$nombre" ] && es_archivo_raiz_permitido "$nombre"; then
    continue
  fi

  # Archivos ocultos de config (empiezan con punto): se saltan.
  case "$nombre" in
    .*) continue ;;
  esac

  case "$nombre" in
    *.md)
      # Documentación Markdown: minúsculas con guiones.
      if ! printf '%s' "$nombre" | LC_ALL=C grep -qE '^[a-z0-9]+(-[a-z0-9]+)*\.md$'; then
        echo "ERROR: nombre de archivo inválido (usar minusculas-con-guiones.md): $ruta"
        errores=$((errores + 1))
      fi
      ;;
    *)
      # Otros archivos (html, json, etc.): solo caracteres simples.
      if printf '%s' "$nombre" | LC_ALL=C grep -q '[^a-z0-9._-]'; then
        echo "ERROR: caracter no permitido en el nombre: $ruta"
        errores=$((errores + 1))
      fi
      ;;
  esac
done <<< "$(find . -type f)"

# --- Validación de CARPETAS ---
while IFS= read -r dir; do
  dir="${dir#./}"                         # normalizar
  [ -z "$dir" ] && continue
  [ "$dir" = "." ] && continue

  case "$dir" in
    .git|.git/*|.github|.github/*|.kiro|.kiro/*|.qa-work|.qa-work/*|node_modules|node_modules/*) continue ;;
    # La plantilla de automatización (y todo lo que contiene) se excluye.
    plantilla-automation|plantilla-automation/*) continue ;;
  esac

  # Validar cada segmento de la ruta por separado.
  IFS='/' read -ra segmentos <<< "$dir"
  for seg in "${segmentos[@]}"; do
    if ! printf '%s' "$seg" | LC_ALL=C grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$'; then
      echo "ERROR: nombre de carpeta inválido (usar minusculas-con-guiones): $dir (segmento '$seg')"
      errores=$((errores + 1))
      break
    fi
  done
done <<< "$(find . -type d)"

echo ""
if [ "$errores" -gt 0 ]; then
  echo "Se encontraron $errores problema(s) de nombrado. Corregir antes de mergear."
  echo "Ver convenciones en CONTRIBUTING.md, sección 'Convenciones de formato'."
  exit 1
fi
echo "OK: nombres de archivos y carpetas válidos."
