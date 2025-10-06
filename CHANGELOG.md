# Changelog

Este archivo documenta los cambios relevantes de cada versión siguiendo
Keep a Changelog (formato) y Semantic Versioning.

## [Unreleased]

## [v0.3.0] - 2025-10-06

### Added
- Pagos simulados end-to-end:
  - Backend: `/api/pagos/intent`, `/api/pagos/confirm` y uso de `payment_id` en `/api/reservas`.
  - Front: selector de método (tarjeta/transferencia/efectivo), validaciones demo y flujo “Confirmar y pagar”.
- Ticket con código y QR:
  - Generación de `codigo` único en backend para cada reserva.
  - Ticket muestra estado, días, total pagado, código y QR (solo si pagado) y botón imprimir.
- Panel de administración estable:
  - Guard declarativo con verificación de `/auth/perfil`.
  - Vistas de métricas, usuarios y reservas (con estados vacíos).
- Footer fijo al fondo con layout `minHeight: 100vh`.
- Integración opcional Stripe Checkout (`/api/payments/checkout-session`) y dependencia `stripe`.

### Changed
- Navbar con badge de rol y mayor espaciado.
- `Reserva.jsx` reestructurado con paso de resumen previo a pago y snapshot de datos para impresión.
- `Reservations.jsx` ahora muestra el `codigo` si existe.

### Tech
- Dependencias: `qrcode` para QR, `stripe` opcional.

## [v0.2.0] - 2025-09-22

### Added
- Aplicación SPA en `cliente/` con React + Vite.
- Ruteo con `react-router-dom`:
  - `/` (Home): catálogo con cards y datos desde `src/data/vehicles.js`.
  - `/reserva` y `/reserva/:vehicleId`: detalle y formulario con cálculo de días y total.
  - `/reservas`: listado de reservas guardadas en `localStorage` (borrar y limpiar todo).
  - `/about`: información del proyecto.
  - `/login`: placeholder.
  - `*`: 404 (NotFound).
- Persistencia de reservas en `localStorage` con clave `reservations`.
- `Navbar` con enlaces y botón de tema; inicialización de tema (claro/oscuro) en `main.jsx`.
- Estilos unificados en `src/styles/styles.css` (migrados y ampliados),
  fondo con imagen y patrón superpuesto.
- Assets públicos en `cliente/public/images/` (incluye `suv-2022.jpg/.svg`, `bg.svg`, `pattern.svg`).
- Fallbacks de imagen para evitar roturas en cargas remotas.

### Changed
- Documentación: actualización de `README.md` (raíz) y `cliente/README.md` para reflejar la SPA,
  rutas, ejecución y estructura.

### Notes
- Esta versión corresponde a la “2da parte” del trabajo: migración a SPA
  manteniendo la demostración de posicionamiento (relative/absolute/fixed/sticky)
  y layouts con flex/grid.


