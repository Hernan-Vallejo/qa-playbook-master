// =============================================================================
// pages/LoginPage.ts - Page Object de la pantalla de Login
// =============================================================================
// ¿Qué es un Page Object (POM, Page Object Model)?
//   Una clase que representa UNA pantalla. Guarda dos cosas:
//     1. Los LOCALIZADORES: cómo encontrar cada elemento de la pantalla.
//     2. Las ACCIONES: qué se puede hacer en esa pantalla (escribir, hacer clic...).
//
// Regla de oro: el Page Object sabe CÓMO interactuar; el test decide QUÉ resultado espera.
// Por eso acá NO hay aserciones (expect): quedan en los tests.
//
// Ventaja: si cambia un selector, se corrige acá, en un solo lugar, y no en 20 tests.
// =============================================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// "export" permite importar esta clase desde otros archivos (los tests).
// "extends BasePage": hereda de BasePage la propiedad "page" (la pestaña del navegador del test)
// y el método goto().
export class LoginPage extends BasePage {
  // Localizadores: se declaran acá y se asignan en el constructor.
  // "readonly" indica que no se reasignan después.
  readonly usernameInput: Locator; // Campo "Username"
  readonly passwordInput: Locator; // Campo "Password"
  readonly loginButton: Locator; // Botón "Login"
  readonly errorMessage: Locator; // Mensaje de error que aparece si el login falla

  // El constructor se ejecuta al hacer "new LoginPage(page)".
  constructor(page: Page) {
    // super(page) ejecuta el constructor de BasePage, que guarda la página.
    super(page);

    // Selectores estables: se prefiere el atributo data-test (lo define el equipo de desarrollo
    // para las pruebas y no cambia con el diseño) antes que textos, clases CSS o posiciones.
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Abre la pantalla de login. Navegar es una acción de la pantalla, por eso vive acá.
  // '/' se completa con el baseURL definido en playwright.config.ts (variable BASE_URL).
  async navigate(): Promise<void> {
    await this.goto('/');
  }

  // Acción simple: escribir el usuario. "fill" borra el contenido previo y escribe el texto.
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  // Acción simple: escribir la contraseña.
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  // Acción simple: hacer clic en el botón Login.
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // Acción compuesta: agrupa las tres acciones anteriores, así el test escribe una sola línea:
  //   await loginPage.login('standard_user', 'secret_sauce');
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
