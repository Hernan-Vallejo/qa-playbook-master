// =============================================================================
// tests/sin-sesion/compra.spec.ts - Flujo completo de compra (punta a punta, E2E)
// =============================================================================
// Historia de ejemplo: PROJ-104 "Comprar un producto".
// E2E = "end to end": recorre todo el flujo como lo haría un usuario real:
//   login -> agregar producto -> carrito -> checkout -> resumen -> confirmación.
//
// Este test usa la FORMA EXPLÍCITA: crea cada Page Object con "new ...(page)". Es la forma que se
// enseña primero porque deja ver qué pasa. Los demás tests usan la forma con fixtures
// (ver fixtures/index.ts); las dos son equivalentes, elegí una y mantenela en todo el proyecto.
//
// Reparto de responsabilidades (POM):
//   - Los Page Objects (pages/) saben CÓMO interactuar con cada pantalla.
//   - Este test define QUÉ se espera en cada paso (los "expect") y guarda la evidencia.
// =============================================================================

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USUARIOS } from '../../data/usuarios';
import { COMPRADOR } from '../../data/comprador';
import { guardarEvidencia } from '../../utils/evidencia';

test('PROJ-104-CP01 - Compra exitosa de un producto', async ({ page }) => {
  // 1. Creamos un objeto por cada pantalla que vamos a usar.
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // 2. Abrimos la tienda e iniciamos sesión.
  await loginPage.navigate();
  await loginPage.login(USUARIOS.estandar.username, USUARIOS.estandar.password);

  // 3. Verificamos que el login fue exitoso.
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');

  // 4. Agregamos la mochila al carrito y verificamos que el botón cambió a "Remove".
  await inventoryPage.addBackpackToCart();
  await expect(inventoryPage.backpackRemoveButton).toBeVisible();

  // 5. Vamos al carrito y verificamos que el producto está.
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

  // 6. Continuamos con el checkout y completamos los datos del comprador.
  await cartPage.clickCheckout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await checkoutPage.fillBuyerInformation(COMPRADOR);
  await checkoutPage.clickContinue();

  // 7. Verificamos el resumen de la compra.
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(checkoutPage.productName).toHaveText('Sauce Labs Backpack');

  // 8. Finalizamos y verificamos la confirmación.
  await checkoutPage.clickFinish();
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  await expect(checkoutPage.completeText).toBeVisible();

  // 9. Evidencia: captura de la pantalla final en evidencias/PROJ-104/ (ver utils/evidencia.ts).
  // Se guarda en el test (y no en el Page Object) porque es evidencia de ESTE escenario.
  await guardarEvidencia(page, 'PROJ-104', 'PROJ-104-CP01', 'compra-exitosa');
});
