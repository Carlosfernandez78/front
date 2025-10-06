import { Link } from 'react-router-dom'

export default function PagoCancelado() {
  return (
    <main className="page" role="main">
      <section className="card">
        <header className="card__header">
          <h1 className="card__title">Pago cancelado</h1>
          <p className="card__subtitle">Puedes volver a intentarlo cuando quieras.</p>
        </header>
        <div className="form">
          <Link className="link" to="/reserva">Volver a la reserva</Link>
        </div>
      </section>
    </main>
  )
}


