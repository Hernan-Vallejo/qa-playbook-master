---
inclusion: manual
name: pw-code-review
description: Checklist de revisión de Pull Requests de automatización con Playwright y Page Object Model. Usar al revisar un PR de este repositorio con el skill qa-revisar-pr.
---

# Checklist de revisión de código (Playwright + POM)

> **Para qué sirve:** lista los criterios propios de este framework que se verifican al revisar un Pull Request. Se suman a los criterios transversales de la skill `qa-revisar-pr` del playbook.
> **Quién lo usa:** el agente `qa-pr` y la persona que revisa.
> **Cuándo se usa:** al revisar un PR de este repositorio (`inclusion: manual`: se carga solo cuando se pide).

## Cómo leer la severidad

> **Equivalencia con la skill `qa-revisar-pr`:** Bloqueante = Bloqueante; Observación = Importante; Sugerencia = Menor. Son los mismos niveles con otros nombres; el veredicto final (APROBADO, CON OBSERVACIONES, RECHAZADO) es el mismo.

| Severidad   | Qué significa                                                            | Efecto en el PR              |
| :---------- | :----------------------------------------------------------------------- | :--------------------------- |
| Bloqueante  | Rompe la suite, filtra datos sensibles o contradice una regla del equipo | No se aprueba hasta corregir |
| Observación | Mejora clara pero que no rompe nada                                      | Se aprueba con comentarios   |
| Sugerencia  | Preferencia de estilo o idea opcional                                    | No condiciona                |

## Bloqueantes

- [ ] No queda ningún `test.only` ni `test.skip` sin justificar. Un `test.skip` lleva el comentario `@BUG @BUG_<ID>` o `@SKIP_WIP` con causa, fecha y QA (ver `pw-proyecto.md`).
- [ ] Ningún título de test conserva el marcador provisorio `XRAY-PENDIENTE`: se reemplaza por la clave real al registrar la automatización.
- [ ] No hay `waitForTimeout` ni esperas fijas.
- [ ] No hay usuarios, claves, tokens ni datos reales escritos en el código, en los datos de prueba o en las capturas.
- [ ] Ningún ambiente de `config/ambientes.ts` ni `BASE_URL` / `API_URL` apunta a producción, y `HOSTS_BLOQUEADOS` está definido en el CI cuando el proyecto lo requiere.
- [ ] El Page Object y el cliente de API no contienen aserciones (`expect`).
- [ ] El test pasa y también falla si se cambia el resultado esperado (el autor lo comprobó).
- [ ] El pipeline de CI está en verde (incluye `npm run verificar`: tipos, ESLint y Prettier).

## Observaciones

- [ ] Los selectores usan `data-test`, `data-testid` o `getByRole`; no hay XPath largos ni `nth` innecesarios.
- [ ] Los localizadores están definidos en el constructor del Page Object, no repetidos en los tests.
- [ ] Los títulos siguen `<ID-HISTORIA>-CP<NN> - <qué se prueba>` y coinciden con los casos del plan de pruebas.
- [ ] Cada test prueba una sola cosa y es independiente de los demás.
- [ ] Hay casos negativos y de borde, no solo el camino feliz.
- [ ] El resultado esperado es concreto (texto exacto, valor, URL), no "se muestra correctamente".
- [ ] Los archivos nuevos respetan los nombres: `[Pantalla]Page.ts`, `[funcionalidad].spec.ts` y `[recurso].api.spec.ts`.
- [ ] Cada test está en la carpeta correcta: `sin-sesion/` (login y flujos desde cero), `con-sesion/` (el login es solo precondición) o `api/`.
- [ ] Las pantallas nuevas están registradas en `fixtures/index.ts` y heredan de `BasePage`.
- [ ] Hay comentarios que expliquen el porqué de lo que no es obvio.
- [ ] Las evidencias están en `evidencias/<ID-HISTORIA>/` y sin capturas de intentos fallidos.

## Sugerencias

- Extraer a un Page Object nuevo los elementos repetidos en dos o más tests.
- Mover a `tests/con-sesion/` los tests que usan el login solo como precondición (usan la sesión guardada).
- Agrupar con `test.describe` los tests de una misma historia.

## Veredictos posibles

`APROBADO`, `CON OBSERVACIONES` o `RECHAZADO` (uno o más bloqueantes sin resolver).
