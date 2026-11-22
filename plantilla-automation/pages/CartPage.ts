// =============================================================================
// pages/CartPage.ts - Page Object de la pantalla del carrito
// =============================================================================
// Muestra los productos agregados y permite continuar con la compra.
// Ver LoginPage.ts para la explicación del patrón POM.
// =============================================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly productName: Locator; // Nombre del producto en el carrito
  readonly checkoutButton: Locator; // Botón "Checkout"

  constructor(page: Page) {
    super(page);

    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  // Continúa con la compra: pasa a la pantalla de datos del comprador.
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
