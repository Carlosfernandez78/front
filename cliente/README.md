# Cliente — React + Vite

Proyecto inicializado con Vite (React, JavaScript) para el trabajo integrador. Cumple el enunciado de la actividad: crear proyecto con `npm create vite@latest`, eliminar `index.css` y `App.css` y sus imports, y generar la estructura base `styles`, `components` y `pages` con archivos placeholder.

## Requisitos previos
- Node.js 18+ y npm

## Instalación y ejecución
```bash
npm install
npm run dev
```
Abrí `http://localhost:5173/` en el navegador.

## Scripts útiles
- `npm run dev`: servidor de desarrollo (Vite)
- `npm run build`: build de producción
- `npm run preview`: previsualizar el build localmente

## Estructura del proyecto
```
cliente/
  src/
    components/
      Navbar.jsx
    pages/
      Home.jsx
      Login.jsx
    styles/
      styles.css
    App.jsx
    main.jsx
```

## Notas de la actividad
- Se eliminaron `src/index.css` y `src/App.css` y sus referencias en `main.jsx` y `App.jsx`.
- Los componentes `Home.jsx`, `Login.jsx` y `Navbar.jsx` están como placeholders para continuar la migración de pantallas.

## Próximos pasos (sugeridos)
- Importar los estilos globales en `main.jsx`:
  - `import './styles/styles.css'`
- Integrar `Navbar.jsx` dentro de `App.jsx` para tener navegación común.
- Migrar las vistas existentes:
  - Convertir `login.html` a React dentro de `pages/Login.jsx` (estructura y estilos).
  - Crear `pages/Reserva.jsx` y migrar `reserva.html` allí.
- Añadir enrutado básico (opcional): `react-router-dom` con rutas para `Home`, `Login` y `Reserva`.
- Centralizar estilos: mover reglas útiles de los CSS previos a `styles/styles.css` o módulos CSS.
