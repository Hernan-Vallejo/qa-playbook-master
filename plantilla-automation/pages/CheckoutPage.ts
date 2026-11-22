// =============================================================================
// pages/CheckoutPage.ts - Page Object del proceso de compra (checkout)
// =============================================================================
// Agrupa las tres pantallas del checkout, que forman un solo flujo:
//   1. Datos del comprador (checkout-step-one)
//   2. Resumen de la compra (checkout-step-two)
//   3. Confirmación (checkout-complete)
// Ver LoginPage.ts para la explicación del patrón POM.
// =============================================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Comprador } from '../data/comprador';

export class CheckoutPage extends BasePage {
  // --- Paso 1: datos del comprador ---
  readonly firstNameInput: Locator; // Campo "First Name"
  readonly lastNameInput: Locator; // Campo "Last Name"
  readonly postalCodeInput: Locator; // Campo "Zip/Postal Code"
  readonly continueButton: Locator; // Botón "Continue"
  readonly errorMessage: Locator; // Mensaje de validación (campo requerido vacío)

  // --- Paso 2: resumen ---
  readonly productName: Locator; // Nombre del producto en el resumen
  readonly subtotalLabel: Locator; // Texto "Item total: $xx.xx"
  readonly finishButton: Locator; // Botón "Finish"

  // --- Paso 3: confirmación ---
  readonly completeHeader: Locator; // Título "Thank you for your order!"
  readonly completeText: Locator; // Texto de confirmación

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  // Completa el formulario del comprador. Recibe un objeto Comprador (ver data/comprador.ts).
  // Para probar un campo vacío, el test pasa una copia del comprador con ese campo en '' (cadena vacía).
  async fillBuyerInformation(comprador: Comprador): Promise<void> {
    await this.firstNameInput.fill(comprador.firstName);
    await this.lastNameInput.fill(comprador.lastName);
    await this.postalCodeInput.fill(comprador.postalCode);
  }

  // Continúa al resumen de la compra.
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  // Finaliza la compra desde el resumen.
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }
}
