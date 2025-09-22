# Cliente — React + Vite (SPA de Alquiler)

Aplicación de página única que migra los prototipos HTML/CSS a React. Incluye catálogo, detalle con formulario de reserva, persistencia en `localStorage`, listado de reservas, ruteo y tema claro/oscuro.

## Requisitos previos
- Node.js 18+ y npm

## Instalación y ejecución
```bash
npm install
npm run dev
```
Abrí `http://localhost:5173/`.

## Scripts útiles
- `npm run dev`: servidor de desarrollo (Vite)
- `npm run build`: build de producción
- `npm run preview`: previsualización local del build

## Estructura del proyecto
```
cliente/
  src/
    components/
      Navbar.jsx
      SvgSuv2022.jsx
    pages/
      Home.jsx
      Login.jsx
      Reserva.jsx
      Reservations.jsx
      About.jsx
      NotFound.jsx
    styles/
      styles.css
    App.jsx
    main.jsx
     data/
       vehicles.js
```

## Funcionalidades
- Catálogo con cards en `Home.jsx` usando datos de `data/vehicles.js`.
- Detalle y formulario en `Reserva.jsx` con cálculo de días, validación y total.
- Persistencia de reservas en `localStorage` y listado en `Reservations.jsx`.
- Ruteo declarado en `App.jsx` (`/`, `/login`, `/reserva`, `/reserva/:vehicleId`, `/reservas`, `/about`).
- Tema claro/oscuro con preferencia guardada en `localStorage` (ver `main.jsx` y botón "Tema" en `Navbar.jsx`).

## Assets
- Imágenes en `public/images/` (incluye `suv-2022.jpg`, `suv-2022.svg`, `bg.svg`, `pattern.svg`).

## Notas
- Para vehículos remotos, se configura `onError` con un fallback embebido o local.
- Los estilos unificados reemplazan los de los prototipos (`login.css`/`reserva.css`).

## Próximos pasos (sugeridos)
- Importar los estilos globales en `main.jsx`:
  - `import './styles/styles.css'`
- Integrar `Navbar.jsx` dentro de `App.jsx` para tener navegación común.
- Migrar las vistas existentes:
  - Convertir `login.html` a React dentro de `pages/Login.jsx` (estructura y estilos).
  - Crear `pages/Reserva.jsx` y migrar `reserva.html` allí.
- Añadir enrutado básico (opcional): `react-router-dom` con rutas para `Home`, `Login` y `Reserva`.
- Centralizar estilos: mover reglas útiles de los CSS previos a `styles/styles.css` o módulos CSS.
