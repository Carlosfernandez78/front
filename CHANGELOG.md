# Changelog

Este archivo documenta los cambios relevantes de cada versión siguiendo
Keep a Changelog (formato) y Semantic Versioning.

## [Unreleased]

## [v0.3.0] - 2025-09-27

### Added
- Control de acceso completo:
  - `Login.jsx` con `useState`, `useNavigate`, fetch a `/auth/login`, manejo de errores y almacenamiento de token en `localStorage`.
  - Ruta `/register` reutilizando `Login` con prop `accion="registrar"` y envío a `/auth/register`.
  - Toggle de visibilidad de contraseña con ícono de ojo.
- `Navbar.jsx` reactivo:
  - Verifica token con `useEffect` y eventos `storage`/`authChanged`.
  - Muestra “Login/Registrarse” sin sesión y “Mis reservas/Desconectar/Reserva” con sesión.
- Playwright E2E:
  - Prueba Home y flujo Login/Reserva (2/2 OK).
- Documentación de entrega en `ENTREGA.md`.

### Changed
- Configuración de Playwright para permitir `E2E_BASE_URL` y adaptación a puertos dinámicos de Vite.
- Actualizaciones menores de selectors en tests (`#catalog-title`).

### Backend
- `auth.register`: hashing con `bcrypt`, `auth.login`: JWT con `JWT_SECRET`.
- Script `scripts/reset_password.js` para restablecer contraseñas.

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


