# Alquiler de Vehículos — HTML/CSS + React/Vite

Este repositorio contiene dos partes complementarias:

- HTML/CSS (raíz): prototipos estáticos con demostración de posicionamiento (relative, absolute, fixed, sticky), `display` (flex y grid) y componentes estilo Bootstrap (replicados en CSS propio).
- `cliente/` (React + Vite): migración a SPA con ruteo, catálogo, detalle de vehículo con formulario de reserva, persistencia en `localStorage`, listado de reservas y tema claro/oscuro.

## Novedades (2da parte — SPA en React)

- Migración a React + Vite en `cliente/` con ruteo mediante `react-router-dom`.
- Página `Home` con catálogo de vehículos (datos en `cliente/src/data/vehicles.js`).
- Página `Reserva` con cálculo de días, validación de fechas, total y guardado en `localStorage`.
- Página `Mis reservas` para listar, borrar y limpiar reservas guardadas localmente.
- Navbar con enlaces y botón de tema; inicialización del tema en `cliente/src/main.jsx` según preferencia del sistema/usuario.
- Estilos unificados en `cliente/src/styles/styles.css` (migrados y ampliados), fondo con imagen y patrón superpuesto.

## Integración con Backend (Node/Express + MySQL)

La SPA ahora se conecta a un backend (por defecto en `http://localhost:3000`).

- Variables de entorno (frontend): crear `cliente/.env`
  - `VITE_API_URL=http://localhost:3000`
- Proxy de desarrollo: `cliente/vite.config.js` reescribe `/api` → backend.
- Cliente HTTP reusable: `cliente/src/lib/api.js`
  - Anexa `Authorization: Bearer <token>` si existe.
  - Propaga mensajes de error del backend (`message`/`mensaje`).
  - Auto-logout si el backend responde `401` (elimina token y notifica `authChanged`).

### Flujo de autenticación
- Login (`/auth/login`) espera `{ email, contrasena }` y devuelve `{ token }`.
- Registro rápido desde Login (`/auth/register`): crea y luego inicia sesión.
- Tras login se redirige a `Mis reservas`, y la navbar muestra “Desconectar”.
- Rutas protegidas: `Home`, `Reserva`, `Mis reservas` requieren sesión; `Home` es público pero sin la opción de reservar si no hay sesión; `About`/`Login` siempre accesibles.

### Reserva
- Envío a backend (`POST /reservas`) con forma `{ usuario_id, vehiculo_id, fecha_inicio, fecha_fin, estado }`.
- Fallback local (si no hay servidor): guarda en `localStorage`.
- Limpieza del formulario tras reservar (fechas/valores), hints al pasar el mouse, íconos de fecha/hora accesibles.
- Sucursales: Buenos Aires / Entre Ríos / Misiones (retiro y devolución), persistidas en `localStorage`.
- `vehiculo_id` se infiere consultando `/vehiculos` (o se toma de `?vehiculoId=` si viene en la URL).
- Bloqueo si no hay sesión (deshabilita botón y redirige a `Login`).

### Mis reservas
- Carga desde backend (`GET /reservas`) con fallback a `localStorage`.
- Borrado individual (`DELETE /reservas/:id`) y “Limpiar todas” (intenta borrar en servidor y limpia local).
- Completa `pricePerDay` y `total` si el backend no los provee (en base a catálogo local/vehículo).
- Filtros por rango de fechas (desde/hasta), badge de estado (pendiente/confirmada/cancelada).
- Tabla responsiva en móviles (layout tipo “cards”).

### Pasos de ejecución (resumen)
1) Backend (en otro proyecto):
   - Variables: `PORT=3000, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET`.
   - Arrancar: `npm run dev` y verificar `GET /api/test/db`.
2) Frontend (este repo):
   - `cd cliente && npm install`
   - Crear `cliente/.env` con `VITE_API_URL`
   - `npm run dev` → `http://localhost:5173/`

### Endpoints utilizados
- `POST /auth/login` → `{ token }`
- `POST /auth/register`
- `GET /auth/perfil` (opcional para obtener `usuario_id` real)
- `GET /vehiculos` → `{ data: Vehiculo[] }`
- `GET /reservas` → `Reserva[]`
- `POST /reservas`, `DELETE /reservas/:id`

Rutas principales en la SPA:

- `/` catálogo (Home)
- `/login` formulario base (placeholder)
- `/reserva` y `/reserva/:vehicleId` detalle + formulario
- `/reservas` listado desde `localStorage`
- `/about` información del proyecto
- `*` 404 (NotFound)

Cómo ejecutar la SPA:

1. `cd cliente`
2. `npm install`
3. `npm run dev` → abrir `http://localhost:5173/`

## Tecnologías
- HTML5, CSS3
- React 19, React Router 7, Vite 7

## Demostración HTML/CSS (1ra parte)

### Posicionamiento (position)
- `relative`: en `reserva.html` sobre `.vehicle__media` para posicionar elementos hijos.
- `absolute`: insignia "Oferta" superpuesta a la imagen.
- `fixed`: CTA "Reservar" fijo en la esquina inferior derecha.
- `sticky`: formulario de reserva pegajoso (`.booking`) con `top: 16px`.

### Display (flex y grid)
- `login.html`:
  - `.page`: `display: grid;` (centrado vertical/horizontal).
  - `.form__row`: `display: flex;`.
- `reserva.html`:
  - `.grid`: `display: grid;` con dos columnas y breakpoint responsive.

## Archivos relevantes (raíz)
- `login.html`: alerta informativa, layout con grid/flex.
- `reserva.html`: grid principal, badge absoluta, CTA fijo.
- `reserva.css`: estilos y `position: sticky` para `.booking`.

## Archivos relevantes (SPA `cliente/`)
- `src/pages/Home.jsx`, `src/pages/Reserva.jsx`, `src/pages/Reservations.jsx`, `src/pages/About.jsx`, `src/pages/NotFound.jsx`
- `src/components/Navbar.jsx`, `src/components/SvgSuv2022.jsx`
- `src/data/vehicles.js`, `src/styles/styles.css`, `src/main.jsx`, `src/App.jsx`

## Cómo probar (HTML/CSS)
1. Abrir `login.html` y `reserva.html` en el navegador.
2. Verificar navbar visible, formulario sticky y CTA fijo al hacer scroll.

## Notas
- Los HTML incluyen comentarios para ubicar `position`/`display` y componentes.
- En la SPA, las reservas se almacenan en `localStorage` bajo la clave `reservations`.

## Capturas sugeridas
Inserta imágenes en una carpeta `captures/` y referencia aquí. Sugerencias:

1. Login — alerta visible
   - Archivo sugerido: `captures/login-alerta.png`
   - Qué mostrar: página al cargar, con la alerta Bootstrap abierta.

2. Reserva — vista inicial con badge “Oferta”
   - Archivo sugerido: `captures/reserva-inicial-badge.png`
   - Qué mostrar: imagen del vehículo con la insignia “Oferta” superpuesta.

3. Reserva — scroll con navbar sticky
   - Archivo sugerido: `captures/reserva-scroll-navbar.png`
   - Qué mostrar: parte media de la página con la navbar aún visible arriba.

4. Reserva — formulario sticky
   - Archivo sugerido: `captures/reserva-sticky-form.png`
   - Qué mostrar: el formulario visible al hacer scroll, permaneciendo ‘pegado’.

5. Reserva — botón “Reservar” fijo
   - Archivo sugerido: `captures/reserva-fixed-cta.png`
   - Qué mostrar: botón “Reservar” en esquina inferior derecha.

Cómo tomarlas:
- Abrí cada HTML en el navegador, ajusta el zoom si es necesario y usa la herramienta de captura del sistema.
- Guarda los archivos con los nombres sugeridos y súbelos junto con el proyecto.

### Capturas en vista móvil (opcional)
Suma estas capturas desde el emulador de dispositivos del navegador:

6. Login — móvil (alerta y layout centrado)
   - `captures/mobile-login.png`

7. Reserva — móvil (badge y CTA fijo visibles)
   - `captures/mobile-reserva-cta.png`

Cómo emular móvil:
- Abrí el HTML en Chrome/Edge/Firefox.
- Presioná F12 (DevTools) → ícono “Toggle device toolbar” (o Ctrl+Shift+M).
- Elegí un dispositivo (iPhone 12, Pixel 5) y actualizá la página.
- Ajustá el zoom si es necesario y tomá la captura.
