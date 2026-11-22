// =============================================================================
// config/ambientes.ts - Ambientes de prueba (URLs) y protección contra producción
// =============================================================================
// Un "ambiente" es una instalación de la aplicación donde se prueba (QA, PRE...).
// Este archivo responde a una pregunta: "¿contra qué URL corren los tests?".
//
// Cómo se elige el ambiente (de mayor a menor prioridad):
//   1. Variables BASE_URL (web) y API_URL (API): pisan cualquier otro valor.
//   2. Variable TEST_ENV con el nombre del ambiente: demo | qa | pre.
//   3. Si no se define nada: "demo" (el sitio público SauceDemo y una API pública de práctica).
//
// REGLA DEL EQUIPO: nunca se corren pruebas contra producción. Este archivo lo hace cumplir:
//   - TEST_ENV=prod (o produccion) corta la ejecución con un error.
//   - Si definís HOSTS_BLOQUEADOS (lista separada por comas), cualquier URL que contenga uno de
//     esos textos también corta la ejecución. Ejemplo: HOSTS_BLOQUEADOS=www.mi-empresa.com,api.mi-empresa.com
// =============================================================================

// Nombres de ambiente permitidos. "prod" no está: a propósito.
export type NombreAmbiente = 'demo' | 'qa' | 'pre';

// Datos de un ambiente: URL de la aplicación web y URL de la API.
export interface Ambiente {
  nombre: string;
  web: string;
  api: string;
}

// Tabla de ambientes. Los de "qa" y "pre" son ejemplos con dominio reservado (example.com):
// reemplazalos por las URLs reales de tu proyecto.
const AMBIENTES: Record<NombreAmbiente, Omit<Ambiente, 'nombre'>> = {
  demo: {
    web: 'https://www.saucedemo.com',
    api: 'https://jsonplaceholder.typicode.com',
  },
  qa: {
    web: 'https://qa.example.com',
    api: 'https://api.qa.example.com',
  },
  pre: {
    web: 'https://pre.example.com',
    api: 'https://api.pre.example.com',
  },
};

// Devuelve el ambiente a usar, o lanza un error si se intenta apuntar a producción.
export function resolverAmbiente(): Ambiente {
  // Nombre pedido por el usuario. Se pasa a minúsculas para tolerar "QA" o "Qa".
  const pedido = (process.env.TEST_ENV ?? 'demo').toLowerCase();

  // Bloqueo de producción: se rechaza ANTES de armar ninguna URL.
  if (['prod', 'produccion', 'producción', 'production'].includes(pedido)) {
    throw new Error(
      'TEST_ENV apunta a producción. Las pruebas automatizadas nunca se ejecutan en producción.',
    );
  }

  // Si el nombre no existe en la tabla, se avisa con la lista de valores válidos.
  if (!(pedido in AMBIENTES)) {
    throw new Error(
      `TEST_ENV="${pedido}" no es válido. Valores posibles: ${Object.keys(AMBIENTES).join(', ')}.`,
    );
  }

  const base = AMBIENTES[pedido as NombreAmbiente];

  // BASE_URL y API_URL tienen prioridad sobre la tabla (útil en el CI o para un ambiente temporal).
  const ambiente: Ambiente = {
    nombre: pedido,
    web: process.env.BASE_URL ?? base.web,
    api: process.env.API_URL ?? base.api,
  };

  // Segunda barrera: lista de textos prohibidos dentro de las URLs (hosts de producción).
  const bloqueados = (process.env.HOSTS_BLOQUEADOS ?? '')
    .split(',')
    .map((texto) => texto.trim())
    .filter((texto) => texto.length > 0);

  for (const texto of bloqueados) {
    if (ambiente.web.includes(texto) || ambiente.api.includes(texto)) {
      throw new Error(`La URL contiene "${texto}", que está en HOSTS_BLOQUEADOS (producción).`);
    }
  }

  return ambiente;
}
