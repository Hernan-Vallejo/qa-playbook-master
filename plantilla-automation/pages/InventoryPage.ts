// =============================================================================
// pages/InventoryPage.ts - Page Object de la pantalla de productos (inventario)
// =============================================================================
// Es la pantalla a la que se llega después de iniciar sesión: lista los productos
// y permite agregarlos al carrito. Ver LoginPage.ts para la explicación del patrón POM.
// =============================================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator; // Título de la pantalla ("Products")
  readonly backpackAddButton: Locator; // Botón "Add to cart" de la mochila
  readonly backpackRemoveButton: Locator; // Botón "Remove" de la mochila (aparece después de agregarla)
  readonly cartLink: Locator; // Ícono del carrito
  readonly cartBadge: Locator; // Globito con la cantidad de productos en el carrito (solo existe si hay productos)

  constructor(page: Page) {
    super(page);

    this.title = page.locator('[data-test="title"]');
    this.backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  // Abre el inventario directamente por su URL. Se usa cuando el test ya arranca con la sesión
  // iniciada (ver tests/con-sesion y config/sesion.ts); sin sesión, el sitio redirige al login.
  async navigate(): Promise<void> {
    await this.goto('/inventory.html');
  }

  // Agrega la mochila (Sauce Labs Backpack) al carrito.
  // El test no necesita conocer el selector del botón: solo llama a este método.
  async addBackpackToCart(): Promise<void> {
    await this.backpackAddButton.click();
  }

  // Quita la mochila del carrito desde esta misma pantalla.
  async removeBackpackFromCart(): Promise<void> {
    await this.backpackRemoveButton.click();
  }

  // Entra a la pantalla del carrito.
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
