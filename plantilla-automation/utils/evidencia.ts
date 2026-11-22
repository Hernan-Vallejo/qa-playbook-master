// =============================================================================
// utils/evidencia.ts - Guardar capturas de pantalla como evidencia
// =============================================================================
// La evidencia de una prueba es la captura que demuestra el resultado. Se guarda siempre con la
// misma convención, para encontrarla fácil y poder copiarla al repositorio documental del equipo:
//
//     evidencias/<ID-HISTORIA>/<ID-CASO>-<descripcion>.png
//     ejemplo: evidencias/PROJ-104/PROJ-104-CP01-compra-exitosa.png
//
// Regla: no dejar capturas de intentos fallidos o engañosos junto con las evidencias válidas.
// =============================================================================

import { Page } from '@playwright/test';

// Guarda una captura de página completa y devuelve la ruta donde quedó.
//   page         - la página del test
//   idHistoria   - clave de la historia, por ejemplo 'PROJ-104' (es el nombre de la carpeta)
//   idCaso       - ID del caso, por ejemplo 'PROJ-104-CP01'
//   descripcion  - texto corto en minúsculas y con guiones, por ejemplo 'compra-exitosa'
export async function guardarEvidencia(
  page: Page,
  idHistoria: string,
  idCaso: string,
  descripcion: string,
): Promise<string> {
  const ruta = `evidencias/${idHistoria}/${idCaso}-${descripcion}.png`;
  // Playwright crea las carpetas que falten en la ruta.
  await page.screenshot({ path: ruta, fullPage: true });
  return ruta;
}
