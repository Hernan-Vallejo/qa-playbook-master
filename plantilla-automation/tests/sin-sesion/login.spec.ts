// =============================================================================
// tests/sin-sesion/login.spec.ts - Pruebas de Login
// =============================================================================
// Carpeta "sin-sesion": acá van los tests que arrancan SIN usuario autenticado (el login mismo
// y los flujos completos que incluyen el login). Ver playwright.config.ts (proyectos).
//
// Historia de ejemplo: PROJ-101 "Iniciar sesión en la Tienda Demo".
// Cobertura: camino feliz (positivo), credenciales inválidas, usuario bloqueado y campos vacíos
// (negativos). Cada test prueba UNA sola cosa.
//
// Convención de nombre de cada test: "<ID-HISTORIA>-CP<NN> - <qué se prueba>".
// El ID (ej. PROJ-101-CP01) es el mismo que tiene el caso en el plan de pruebas, así cada test
// queda trazado a su caso.
// =============================================================================

// "test" y "expect" se importan de fixtures/: es el "test" de Playwright con los Page Objects
// ya disponibles como parámetros ({ loginPage }), sin escribir "new LoginPage(page)".
import { test, expect } from '../../fixtures';
import { USUARIOS } from '../../data/usuarios';

// test.describe agrupa los tests relacionados. Aparece como un bloque en el reporte.
test.describe('PROJ-101 - Login', () => {
  // Precondición: se ejecuta ANTES de cada test. Cada test tiene su propia pestaña limpia,
  // así que siempre se parte de la pantalla de login.
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // --- Positivo ---
  test('PROJ-101-CP01 - Login exitoso con usuario válido', async ({ loginPage, page }) => {
    await loginPage.login(USUARIOS.estandar.username, USUARIOS.estandar.password);

    // Resultado esperado: se llega al inventario (la URL cambia).
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // --- Negativos ---
  test('PROJ-101-CP02 - Login fallido con contraseña incorrecta', async ({ loginPage, page }) => {
    await loginPage.login(USUARIOS.estandar.username, 'clave_incorrecta');

    // Resultado esperado: mensaje de error visible con el texto exacto y se permanece en el login.
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('PROJ-101-CP03 - Login fallido con usuario bloqueado', async ({ loginPage, page }) => {
    await loginPage.login(USUARIOS.bloqueado.username, USUARIOS.bloqueado.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('PROJ-101-CP04 - Login fallido con usuario vacío', async ({ loginPage }) => {
    // Solo se escribe la contraseña: el usuario queda vacío.
    await loginPage.enterPassword(USUARIOS.estandar.password);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('PROJ-101-CP05 - Login fallido con contraseña vacía', async ({ loginPage }) => {
    // Solo se escribe el usuario: la contraseña queda vacía.
    await loginPage.enterUsername(USUARIOS.estandar.username);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });
});
