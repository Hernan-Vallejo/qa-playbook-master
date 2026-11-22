// =============================================================================
// fixtures/index.ts - Fixtures propios: los Page Objects listos para usar en los tests
// =============================================================================
// ¿Qué es un "fixture"?
//   En Playwright, un fixture es algo que el test recibe armado, como "page". Acá definimos
//   fixtures propios para recibir los Page Objects ya construidos, sin escribir
//   "new LoginPage(page)" en cada test.
//
// Sin fixtures (forma explícita, ver tests/sin-sesion/compra.spec.ts):
//   test('...', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     ...
//
// Con fixtures (forma que usan la mayoría de los tests):
//   test('...', async ({ loginPage }) => {
//     ...
//
// Cada fixture se crea solo si el test lo pide en su lista de parámetros, y cada test recibe
// objetos nuevos (independientes de los de otros tests).
//
// Para sumar una pantalla nueva: agregarla en "Fixtures" (tipo) y en "test.extend" (creación).
// =============================================================================

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Tipo: qué fixtures propios existen y de qué clase es cada uno.
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// "base.extend" crea una versión del "test" de Playwright con nuestros fixtures agregados.
// Cada fixture recibe "page" y llama a "use(...)" con el objeto que entrega al test.
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

// Se reexporta "expect" para que los tests importen todo desde un solo lugar:
//   import { test, expect } from '../../fixtures';
export { expect } from '@playwright/test';
