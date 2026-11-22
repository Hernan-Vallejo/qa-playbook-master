// =============================================================================
// data/comprador.ts - Datos ficticios del comprador para el checkout
// =============================================================================
// Datos inventados, solo para pruebas. Nunca usar datos reales de personas.
// =============================================================================

// Forma de los datos que pide el formulario de checkout.
export interface Comprador {
  firstName: string; // Nombre
  lastName: string; // Apellido
  postalCode: string; // Código postal
}

// Comprador válido: completa los tres campos requeridos del checkout.
export const COMPRADOR: Comprador = {
  firstName: 'Ana',
  lastName: 'Prueba',
  postalCode: '1000',
};
