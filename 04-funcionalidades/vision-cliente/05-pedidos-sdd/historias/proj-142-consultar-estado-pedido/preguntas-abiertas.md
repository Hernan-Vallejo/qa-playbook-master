# Preguntas Abiertas — PROJ-142

> **Para qué sirve:** registra las preguntas, asunciones y dudas detectadas al revisar la historia. Todo lo que la historia no responde queda acá, no se supone.
> **Quién lo usa:** QA del Equipo Delta y el PO de la historia, que responde las preguntas.
> **Cuándo se usa:** durante la revisión de la spec (antes de desarrollar) y mientras se diseñan los casos. Las preguntas se publican en Jira mencionando al PO, previa aprobación del texto exacto.

## Preguntas resueltas

| # | Pregunta | Respuesta | Fuente |
| :--- | :--- | :--- | :--- |
| P1 | ¿Un comprador puede consultar pedidos de otro? | No (RN-PED-05) | Regla de permisos del módulo |
| P2 | ¿La consulta modifica el pedido? | No: es solo lectura | Alcance de la HU |
| P3 | ¿Se requiere sesión? | Sí (RN-PED-06) | Regla de acceso |

## Preguntas pendientes

| # | Pregunta | Impacto | Responsable | Estado |
| :--- | :--- | :--- | :--- | :--- |
| P4 | ¿Cuál es el texto exacto del mensaje cuando el pedido no existe? | Alto: sin texto no se puede comprobar el resultado esperado | PO | Pendiente de definir por el PO |
| P5 | ¿Cuál es el texto exacto cuando el comprador no tiene pedidos? (estado vacío del listado, `RN-PED-23`; se registra acá porque surgió al revisar PROJ-142 y se resuelve en PROJ-143) | Medio | PO | Pendiente de definir por el PO |
| P6 | ¿Cuál es el formato válido del número de pedido? | Medio: define los casos de formato inválido | PO | Pendiente de definir por el PO |
| P7 | ¿Qué debe pasar con un número de pedido con espacios o en minúsculas? | Bajo | PO | Pendiente de definir por el PO |
| P8 | ¿Cuál es la lista oficial de estados y las transiciones permitidas? | Alto: define los casos de borde del ciclo de vida | PO | Pendiente de definir por el PO |
| P9 | ¿Cuánto puede tardar un cambio de estado en verse en la consulta? | Medio: define cuánto esperar en el test (con espera por condición, no fija) | PO | Pendiente de definir por el PO |
| P10 | ¿Qué debe ver el comprador si el servicio no responde? | Medio | PO | Pendiente de definir por el PO |

## Asunciones de QA

| ID | Asunción | Riesgo si es incorrecta |
| :--- | :--- | :--- |
| A1 | Los estados son los del modelo de ejemplo (`RN-PED-08`) | Si cambian, hay que rehacer los casos de estado |
| A2 | Un pedido ajeno responde igual que un inexistente | Si se revela que existe, hay un defecto de seguridad que reportar |
| A3 | La respuesta incluye número, estado y fecha | Si falta algún campo, hay que ajustar las verificaciones |
| A4 | Un comprador sin pedidos que consulta un número recibe lo mismo que ante un pedido inexistente (`RN-PED-21`) | Si debe mostrar otro mensaje, falta un criterio en la HU |

> **Atención:** las asunciones **no se convierten en reglas** sin confirmación del PO. Mientras tanto, los casos que dependen de ellas se marcan como bloqueados o "a confirmar".
