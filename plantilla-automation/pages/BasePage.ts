// =============================================================================
// pages/BasePage.ts - Clase base de todos los Page Objects
// =============================================================================
// Reúne lo que comparten TODAS las pantallas, para no repetirlo en cada Page Object:
//   - guardar la "page" (la pestaña del navegador del test);
//   - navegar a una ruta.
//
// "abstract" significa que esta clase no se usa sola: solo sirve para que otras la extiendan
// ("class LoginPage extends BasePage"). Si más adelante todas las pantallas comparten un
// elemento (un menú, un encabezado, un banner de cookies), se agrega acá una sola vez.
// =============================================================================

import { Page } from '@playwright/test';

export abstract class BasePage {
  // "readonly page" en el parámetro del constructor declara y asigna la propiedad en un solo paso.
  constructor(readonly page: Page) {}

  // Navega a una ruta relativa. Se completa con el baseURL de playwright.config.ts.
  // Ejemplo: this.goto('/inventory.html') abre <baseURL>/inventory.html
  protected async goto(ruta: string): Promise<void> {
    await this.page.goto(ruta);
  }
}
