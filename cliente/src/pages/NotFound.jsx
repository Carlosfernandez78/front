import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="page" role="main">
      <section className="empty" aria-labelledby="nf-title">
        <h1 id="nf-title">Página no encontrada</h1>
        <p>La ruta a la que intentaste acceder no existe o fue movida.</p>
        <Link className="link" to="/">Volver al inicio</Link>
      </section>
    </main>
  )
}


