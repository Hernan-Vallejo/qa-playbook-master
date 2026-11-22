// =============================================================================
// tests/api/usuarios.api.spec.ts - Pruebas de API (sin navegador)
// =============================================================================
// Las pruebas de API validan el back directamente, sin pasar por la pantalla. Son más rápidas
// y más estables que las de front. Lo que el back valida se prueba acá, no por la pantalla.
//
// El nombre termina en ".api.spec.ts" para que Playwright los asigne al proyecto "api"
// (ver playwright.config.ts). Ese proyecto no abre navegador: usa el fixture "request".
//
// Historia de ejemplo: PROJ-105 "Consultar usuarios por API".
// Ejemplo sobre la API pública de práctica jsonplaceholder (ver api/UsuariosApi.ts).
// =============================================================================

import { test, expect } from '@playwright/test';
import { UsuariosApi } from '../../api/UsuariosApi';

test.describe('PROJ-105 - API de usuarios', () => {
  test('PROJ-105-CP01 - Listar usuarios responde 200 y devuelve una lista no vacía', async ({
    request,
  }) => {
    const respuesta = await new UsuariosApi(request).listar();

    // Código HTTP esperado: 200 (OK).
    expect(respuesta.status()).toBe(200);
    const usuarios = await respuesta.json();
    expect(Array.isArray(usuarios)).toBe(true);
    expect(usuarios.length).toBeGreaterThan(0);
  });

  test('PROJ-105-CP02 - Obtener un usuario existente devuelve sus datos', async ({ request }) => {
    const respuesta = await new UsuariosApi(request).obtener(1);

    expect(respuesta.status()).toBe(200);
    const usuario = await respuesta.json();
    // Se verifica el contrato: los campos que el front necesita tienen que estar presentes.
    expect(usuario).toMatchObject({ id: 1 });
    expect(usuario).toHaveProperty('name');
    expect(usuario).toHaveProperty('email');
  });

  test('PROJ-105-CP03 - Obtener un usuario inexistente responde 404', async ({ request }) => {
    // Caso negativo: un id que no existe.
    const respuesta = await new UsuariosApi(request).obtener(999999);

    expect(respuesta.status()).toBe(404);
  });
});
