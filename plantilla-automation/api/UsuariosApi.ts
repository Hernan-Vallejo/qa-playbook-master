// =============================================================================
// api/UsuariosApi.ts - Cliente de la API de usuarios (el "Page Object" de la API)
// =============================================================================
// Mismo patrón que pages/: una clase por recurso de la API. Esconde las URLs y los detalles
// de HTTP, y los tests solo dicen qué quieren hacer ("pedir el usuario 1").
//
// Ejemplo con la API pública de práctica https://jsonplaceholder.typicode.com (no guarda datos
// reales; es solo para aprender). En un proyecto real, reemplazala por la API de tu producto.
//
// Regla: igual que en los Page Objects, acá NO hay aserciones; devolvemos la respuesta y el
// test decide qué espera.
// =============================================================================

import { APIRequestContext, APIResponse } from '@playwright/test';

export class UsuariosApi {
  // "request" es el cliente HTTP de Playwright. Ya trae el baseURL de la API (proyecto "api").
  constructor(private readonly request: APIRequestContext) {}

  // GET /users -> lista de usuarios.
  async listar(): Promise<APIResponse> {
    return this.request.get('/users');
  }

  // GET /users/<id> -> un usuario por su identificador.
  async obtener(id: number): Promise<APIResponse> {
    return this.request.get(`/users/${id}`);
  }
}
