// =============================================================================
// tests/con-sesion/checkout.spec.ts - Pruebas de validación del checkout
// =============================================================================
// Historia de ejemplo: PROJ-103 "Completar los datos del comprador".
// Cobertura: un caso negativo por cada campo requerido y el resumen con el total.
// El flujo completo de compra de punta a punta está en tests/sin-sesion/compra.spec.ts.
// Estos tests arrancan con la sesión ya iniciada (ver tests/auth.setup.ts).
// =============================================================================

import { test, expect } from '../../fixtures';
import { COMPRADOR } from '../../data/comprador';

test.describe('PROJ-103 - Checkout', () => {
  // Precondición: una mochila en el carrito y el formulario del comprador abierto.
  test.beforeEach(async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.navigate();
    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  // --- Negativos: un caso por campo requerido vacío ---
  test('PROJ-103-CP01 - Nombre vacío muestra error de campo requerido', async ({
    checkoutPage,
  }) => {
    // "{ ...COMPRADOR, firstName: '' }" copia el comprador válido y vacía solo el nombre.
    await checkoutPage.fillBuyerInformation({ ...COMPRADOR, firstName: '' });
    await checkoutPage.clickContinue();

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('PROJ-103-CP02 - Apellido vacío muestra error de campo requerido', async ({
    checkoutPage,
  }) => {
    await checkoutPage.fillBuyerInformation({ ...COMPRADOR, lastName: '' });
    await checkoutPage.clickContinue();

    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('PROJ-103-CP03 - Código postal vacío muestra error de campo requerido', async ({
    checkoutPage,
  }) => {
    await checkoutPage.fillBuyerInformation({ ...COMPRADOR, postalCode: '' });
    await checkoutPage.clickContinue();

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  // --- Positivo: datos completos llevan al resumen ---
  test('PROJ-103-CP04 - Datos completos muestran el resumen con el total del producto', async ({
    checkoutPage,
    page,
  }) => {
    await checkoutPage.fillBuyerInformation(COMPRADOR);
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.productName).toHaveText('Sauce Labs Backpack');
    // Precio de la mochila en el sitio demo: $29.99 (sin impuestos).
    await expect(checkoutPage.subtotalLabel).toHaveText('Item total: $29.99');
  });
});
