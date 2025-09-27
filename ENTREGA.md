# Entrega — Control de Acceso en React JS

## Cumplimiento del enunciado
- Ejercicio 1 (Login):
  - `cliente/src/pages/Login.jsx` usa `useState`, `useNavigate` y `try/catch`.
  - Envía credenciales a `/auth/login` con `fetch` encapsulado en `lib/api.js`.
  - Almacena token en `localStorage`.
- Ejercicio 2 (Navbar):
  - `cliente/src/components/Navbar.jsx` usa `useEffect` para chequear `localStorage` y eventos `storage`/`authChanged`.
  - Muestra Login/Registrarse sin sesión y “Desconectar”, “Mis reservas”, “Reserva” con sesión.
- Opcional (Registro):
  - Ruta `/register` usando el mismo componente `Login` con prop `accion="registrar"`.

## Cómo ejecutar
1. Backend
   - Ubicación: `C:\Users\carfe\Desktop\mi api`
   - Requisitos: MySQL y variables de entorno (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).
   - Iniciar:
     - PowerShell: `cd "C:\Users\carfe\Desktop\mi api"; npm install; npm run dev`
   - Endpoints principales: `/auth/register`, `/auth/login`, `/auth/perfil`, `/vehiculos`, `/reservas`.
2. Frontend
   - Ubicación: `cliente/`
   - Ejecutar: `cd cliente; npm install; npm run dev`
   - Vite abre en `http://localhost:5173` o `http://localhost:5174`.
   - Configurable vía `VITE_API_URL` (archivo `.env`).

## Pruebas E2E (Playwright)
- Instalar navegadores: `cd cliente; npx playwright install --with-deps`
- Ejecutar: `npm run test:e2e`
- Resultado actual: 2/2 pruebas pasaron.

## Evidencias
- Home renderiza `nav` y título `#catalog-title`.
- Flujo Login/Reserva: registra o inicia sesión, selecciona fechas y navega a “Mis reservas”.

## Extras UI
- Campo contraseña con botón de visibilidad (icono de ojo) en `Login.jsx`.
- Tema claro/oscuro (persistencia en `localStorage`).

## Notas
- Si el dev server cambia de puerto, Playwright usa `E2E_BASE_URL` o `localhost:5174` por defecto.
- Para restablecer contraseña en backend: `node scripts/reset_password.js <email> <nueva_contraseña>`.
