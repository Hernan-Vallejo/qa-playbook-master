// =============================================================================
// tests/auth.setup.ts - Inicia sesión una sola vez y guarda la sesión
// =============================================================================
// Este archivo NO es un test de negocio: es un "setup" (preparación). Playwright lo corre
// primero (proyecto "setup" de playwright.config.ts) y los proyectos "*-con-sesion" dependen de él.
//
// Qué hace: abre el login, entra con el usuario estándar y guarda las cookies en
// playwright/.auth/estandar.json. Después, cada test de tests/con-sesion/ arranca con esas
// cookies y ya está autenticado.
//
// Si el login falla acá, fallan todos los tests con sesión: es lo esperado, porque sin login
// no se puede probar nada de lo que sigue.
// =============================================================================

import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USUARIOS } from '../data/usuarios';
import { RUTA_SESION } from '../config/sesion';

setup('autenticar al usuario estándar y guardar la sesión', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.navigate();
  await loginPage.login(USUARIOS.estandar.username, USUARIOS.estandar.password);

  // Se confirma que el login funcionó ANTES de guardar la sesión; si no, se guardaría una sesión inválida.
  await expect(inventoryPage.title).toHaveText('Products');

  // Guarda cookies y almacenamiento local del navegador en el archivo de sesión.
  await page.context().storageState({ path: RUTA_SESION });
});
