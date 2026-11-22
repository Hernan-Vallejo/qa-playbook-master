// =============================================================================
// config/sesion.ts - Ubicación de la sesión guardada (storageState)
// =============================================================================
// "storageState" es una función de Playwright que guarda en un archivo las cookies y el
// almacenamiento local de un navegador ya autenticado. Los tests que lo usan arrancan con
// la sesión iniciada, sin pasar por la pantalla de login (ahorra tiempo en suites grandes).
//
// El archivo se genera en cada corrida por tests/auth.setup.ts y está en .gitignore porque
// contiene datos de sesión: nunca se sube al repositorio.
// =============================================================================

// Ruta relativa a la raíz del proyecto donde se guarda la sesión del usuario estándar.
export const RUTA_SESION = 'playwright/.auth/estandar.json';
