import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PagoExito() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    // En este demo, la reserva ya se crea en el flujo simulado.
    // Si se integrase Stripe real, aquí podríamos finalizar la reserva usando session_id.
    const timer = setTimeout(() => navigate('/reservas', { replace: true }), 1500)
    return () => clearTimeout(timer)
  }, [])
  const sessionId = params.get('session_id')
  return (
    <main className="page" role="main">
      <section className="card">
        <header className="card__header">
          <h1 className="card__title">Pago exitoso</h1>
          <p className="card__subtitle">Gracias por tu reserva.</p>
        </header>
        <div className="form">
          {sessionId && <p>Session ID: {sessionId}</p>}
          <p>Serás redirigido a tus reservas…</p>
        </div>
      </section>
    </main>
  )
}


