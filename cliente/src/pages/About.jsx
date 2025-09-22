export default function About() {
  return (
    <main className="page">
      <section className="shell" aria-labelledby="about-title">
        <header className="shell__header">
          <h1 id="about-title" className="shell__title">Acerca de Alquiler</h1>
          <p className="shell__subtitle">Conocé más sobre nuestro proyecto</p>
        </header>

        <div style={{ padding: '24px', display: 'grid', gap: '12px' }}>
          <p>
            Este sitio es un prototipo académico para gestionar alquileres de vehículos. Incluye
            navegación con rutas, páginas con interfaz accesible y formularios con estados básicos.
          </p>
          <ul>
            <li>Home: catálogo con tarjetas</li>
            <li>Login: formulario de autenticación</li>
            <li>Reserva: detalle del vehículo y formulario</li>
          </ul>
        </div>
      </section>
    </main>
  )
}


