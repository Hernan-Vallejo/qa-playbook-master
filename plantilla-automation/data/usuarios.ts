// =============================================================================
// data/usuarios.ts - Usuarios de prueba
// =============================================================================
// Centraliza los usuarios en un solo lugar. Así los tests no tienen usuarios ni claves
// escritos "a mano" y, si cambian, se corrige en un único archivo.
//
// IMPORTANTE sobre credenciales:
//   - Los valores por defecto de abajo son los usuarios del sitio demo público SauceDemo.
//     Son públicos y NO son secretos: están publicados en la propia página de login.
//   - En un proyecto real las credenciales NUNCA se escriben en el código. Se piden al
//     equipo y se pasan por variables de entorno (archivo .env local o secretos del CI).
// =============================================================================

// Forma que tiene un usuario de prueba: un nombre y una clave.
export interface Usuario {
  username: string;
  password: string;
}

// Clave compartida por todos los usuarios del sitio demo. Se puede reemplazar con QA_PASSWORD.
const clave = process.env.QA_PASSWORD ?? 'secret_sauce';

export const USUARIOS: Record<'estandar' | 'bloqueado', Usuario> = {
  // Usuario válido: puede iniciar sesión y comprar. Se puede reemplazar con QA_USER.
  estandar: {
    username: process.env.QA_USER ?? 'standard_user',
    password: clave,
  },
  // Usuario bloqueado: el sitio demo le niega el acceso. Sirve para el caso negativo de login.
  bloqueado: {
    username: 'locked_out_user',
    password: clave,
  },
};
