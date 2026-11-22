// =============================================================================
// eslint.config.mjs - Reglas de calidad de código (ESLint)
// =============================================================================
// ESLint lee el código SIN ejecutarlo y avisa de errores y malas prácticas. Se corre con
// "npm run lint". Acá se activan tres juegos de reglas:
//   1. Las recomendadas de JavaScript.
//   2. Las recomendadas de TypeScript.
//   3. Las del plugin de Playwright, que hacen cumplir las reglas del equipo:
//      sin esperas fijas, sin test.only olvidados, sin tests sin aserciones.
// =============================================================================

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  // Carpetas que no se revisan (código generado o dependencias).
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'playwright/.auth/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Reglas de Playwright, solo para los archivos de tests, fixtures y utilidades.
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'fixtures/**/*.ts', 'utils/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Regla del equipo: prohibido waitForTimeout (esperas fijas).
      'playwright/no-wait-for-timeout': 'error',
      // Regla del equipo: un test.only olvidado deja sin correr al resto de la suite.
      'playwright/no-focused-test': 'error',
      // Un test saltado necesita justificación; por eso es advertencia y no error.
      'playwright/no-skipped-test': 'warn',
      // Todo test debe comprobar algo: sin "expect" no puede fallar.
      'playwright/expect-expect': 'error',
    },
  },
);
