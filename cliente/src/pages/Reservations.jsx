import { useEffect, useState } from 'react'

export default function Reservations() {
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    try {
      const key = 'reservations'
      const rows = JSON.parse(localStorage.getItem(key) || '[]')
      setReservations(Array.isArray(rows) ? rows : [])
    } catch {
      setReservations([])
    }
  }, [])

  const handleDelete = (index) => {
    const next = reservations.filter((_, i) => i !== index)
    setReservations(next)
    localStorage.setItem('reservations', JSON.stringify(next))
  }

  const handleClear = () => {
    setReservations([])
    localStorage.removeItem('reservations')
  }

  const formatCurrency = (value) => value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })

  return (
    <main className="page">
      <section className="shell" aria-labelledby="reservations-title">
        <header className="shell__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div>
            <h1 id="reservations-title" className="shell__title">Mis reservas</h1>
            <p className="shell__subtitle">Listado de reservas guardadas en este dispositivo</p>
          </div>
          {reservations.length > 0 && (
            <button className="button" onClick={handleClear}>Limpiar todas</button>
          )}
        </header>

        {reservations.length === 0 ? (
          <div style={{ padding: '24px' }}>
            <p>No hay reservas guardadas.</p>
          </div>
        ) : (
          <div style={{ padding: '24px' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th>Vehículo</th>
                  <th>Retiro</th>
                  <th>Devolución</th>
                  <th>Días</th>
                  <th>Precio/día</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid #1f2937' }}>
                    <td>{r.vehicleName}</td>
                    <td>{r.pickupDate}</td>
                    <td>{r.returnDate}</td>
                    <td>{r.days}</td>
                    <td>{formatCurrency(r.pricePerDay)}</td>
                    <td>{formatCurrency(r.total)}</td>
                    <td>
                      <button className="button" onClick={() => handleDelete(idx)} style={{ padding: '8px 10px' }}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}


