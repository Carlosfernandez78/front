# Alquiler de Vehículos — Actualización de Estilos y Bootstrap 5.3

## Descripción
Proyecto con dos pantallas: `login.html` y `reserva.html`. Se actualizaron estilos para demostrar propiedades de posicionamiento (relative, absolute, fixed, sticky), uso de `display` (flex y grid) e implementación de componentes de Bootstrap 5.3.

Los HTML incluyen comentarios in-line señalando explícitamente dónde se aplicó cada técnica y componente.

## Tecnologías
- HTML5, CSS3
- Bootstrap 5.3 (CDN)

## Cambios realizados

### 1) Bootstrap 5.3 por CDN
- Agregado en `<head>` de `login.html` y `reserva.html`.
- Se añadió también el bundle JS de Bootstrap antes de `</body>`.

### 2) Componentes de Bootstrap
- `login.html`: Alerta informativa (dismissible) para destacar el uso del correo institucional.
- Ambas páginas: Navbar de Bootstrap con `sticky-top` (siempre visible al hacer scroll).
- `reserva.html`: Botón CTA "Reservar" usando clases de Bootstrap (`btn btn-success`).

### 3) Posicionamiento (position)
- `relative`: En `reserva.html`, contenedor de la imagen (`.vehicle__media position-relative`) para posicionar elementos hijos.
- `absolute`: Badge "Oferta" (`.badge position-absolute`) superpuesta a la imagen.
- `fixed`: Botón CTA "Reservar" (`.position-fixed bottom-0 end-0`) fijo en esquina inferior derecha.
- `sticky`: Formulario de reserva (`.booking`) con `position: sticky; top: 16px;` (ver `reserva.css`).

### 4) Display (flex y grid)
- `login.html`:
  - `.page`: `display: grid;` (centra el contenido vertical y horizontalmente).
  - `.form__row`: `display: flex;` para alinear el checkbox y el enlace de recuperación.
- `reserva.html`:
  - `.grid`: `display: grid;` con dos columnas (detalle del vehículo + formulario) y breakpoint responsive.

## Archivos relevantes
- `login.html`
  - CDN Bootstrap, navbar `sticky-top`, alerta Bootstrap, `display: grid` en `.page`, `display: flex` en `.form__row`.
- `reserva.html`
  - CDN Bootstrap, navbar `sticky-top`, layout principal con CSS Grid, badge absoluta sobre la imagen, botón CTA `fixed`.
- `reserva.css`
  - Regla de `.booking` con `position: sticky; top: 16px;` y ajustes visuales.

## Cómo probar
1. Abrir `login.html` y `reserva.html` en el navegador.
2. Hacer scroll en `reserva.html` para ver:
   - La navbar siempre visible (sticky-top).
   - El formulario de reserva permaneciendo visible (sticky) en la columna derecha.
   - El botón "Reservar" fijo en la esquina inferior derecha.
3. En `login.html`, cerrar la alerta Bootstrap con la "X" para verificar el JS del bundle.

## Notas
- Se agregaron comentarios en los HTML indicando cada uso de `position`, `display` y componentes Bootstrap para facilitar la corrección.

## Capturas sugeridas (mocks para la entrega)
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

### Capturas en vista móvil (opcional recomendado)
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
