// =============================================================================
// tests/con-sesion/carrito.spec.ts - Pruebas del carrito
// =============================================================================
// Carpeta "con-sesion": estos tests arrancan con el usuario YA autenticado. La sesión la guarda
// una vez tests/auth.setup.ts y Playwright la carga en cada test (ver playwright.config.ts).
// Así no se repite el login en cada test, que es lo lento y lo que más falla por causas ajenas
// a lo que se quiere probar.
//
// Historia de ejemplo: PROJ-102 "Agregar y quitar productos del carrito".
// Cobertura: agregar (positivo), quitar y comprobar el contador (borde: de 1 a 0 productos).
// =============================================================================

import { test, expect } from '../../fixtures';

test.describe('PROJ-102 - Carrito', () => {
  // Precondición: abrir el inventario. La sesión ya está iniciada gracias al storageState.
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('PROJ-102-CP01 - Agregar un producto actualiza el botón y el contador', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addBackpackToCart();

    // El botón "Add to cart" cambia a "Remove" y el contador del carrito muestra 1.
    await expect(inventoryPage.backpackRemoveButton).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('PROJ-102-CP02 - El producto agregado aparece en el carrito', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');
  });

  test('PROJ-102-CP03 - Quitar el único producto deja el carrito sin contador', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.removeBackpackFromCart();

    // Caso borde: al volver a 0 productos desaparece el globito del contador
    // y el botón vuelve a ser "Add to cart".
    await expect(inventoryPage.cartBadge).toBeHidden();
    await expect(inventoryPage.backpackAddButton).toBeVisible();
  });
});
