import { useEffect, useState } from 'react'
import { get, del as apiDel } from '../lib/api.js'
import { vehicles as sampleVehicles } from '../data/vehicles.js'

export default function Reservations() {
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    (async () => {
      // Helper: calcular días
      const calcDays = (start, end) => {
        const a = start ? new Date(start) : null
        const b = end ? new Date(end) : null
        if (!a || !b) return 0
        const ms = b.getTime() - a.getTime()
        const d = Math.ceil(ms / 86400000)
        return d > 0 ? d : 0
      }
      // Helper: mapear vehiculo_id a un precio aproximado según modelo/marca
      const guessPricesByVehicleId = async () => {
        try {
          const veh = await get('/vehiculos')
          const items = Array.isArray(veh?.data) ? veh.data : []
          const priceOf = (marca, modelo) => {
            const s = `${marca || ''} ${modelo || ''}`.toLowerCase()
            if (s.includes('rav') || s.includes('cr-v') || s.includes('tracker')) return sampleVehicles.find(v => v.id === 'suv-2022')?.pricePerDay || 39500
            if (s.includes('pickup') || s.includes('4x4')) return sampleVehicles.find(v => v.id === 'pickup-2024')?.pricePerDay || 45500
            // sedanes comunes
            return sampleVehicles.find(v => v.id === 'sedan-2023')?.pricePerDay || 28500
          }
          const map = new Map()
          for (const it of items) {
            map.set(it.id, priceOf(it.marca, it.modelo))
          }
          return map
        } catch {
          return new Map()
        }
      }

      const vehiclePriceMap = await guessPricesByVehicleId()

      try {
        const rows = await get('/reservas')
        if (Array.isArray(rows)) {
          const enriched = rows.map(r => {
            const start = r.fecha_inicio || r.pickupDate
            const end = r.fecha_fin || r.returnDate
            const days = typeof r.days === 'number' ? r.days : calcDays(start, end)
            const pricePerDay = typeof r.pricePerDay === 'number' ? r.pricePerDay : (typeof r.precio_dia === 'number' ? r.precio_dia : (r.vehiculo_id ? (vehiclePriceMap.get(r.vehiculo_id) || null) : null))
            const total = typeof r.total === 'number' ? r.total : (pricePerDay && days ? pricePerDay * days : null)
            return { ...r, days, pricePerDay, total }
          })
          setReservations(enriched)
          return
        }
      } catch {
        // ignore and fallback
      }
      try {
        const key = 'reservations'
        const rows = JSON.parse(localStorage.getItem(key) || '[]')
        const enriched = Array.isArray(rows) ? rows.map(r => ({ ...r, total: r.total ?? (r.pricePerDay && r.days ? r.pricePerDay * r.days : r.total) })) : []
        setReservations(enriched)
      } catch {
        setReservations([])
      }
    })()
  }, [])

  const handleDelete = async (index) => {
    const item = reservations[index]
    // Si viene del backend y tiene id, intentar borrarlo en el servidor
    if (item && item.id) {
      try {
        await apiDel(`/reservas/${item.id}`)
      } catch {}
    }
    const next = reservations.filter((_, i) => i !== index)
    setReservations(next)
    try { localStorage.setItem('reservations', JSON.stringify(next)) } catch {}
  }

  const handleClear = async () => {
    // Intentar borrar todas las reservas del backend si hay ids
    const ids = reservations.map(r => r && r.id).filter(Boolean)
    if (ids.length) {
      try {
        await Promise.all(ids.map(id => apiDel(`/reservas/${id}`).catch(() => {})))
      } catch {}
    }
    setReservations([])
    try { localStorage.removeItem('reservations') } catch {}
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

        {/* Filtros por rango de fechas */}
        <div style={{ padding: '0 24px 12px' }}>
          <div className="form__row">
            <div className="form__field" style={{ maxWidth: 260 }}>
              <label className="form__label">Desde</label>
              <input type="date" className="form__input" onChange={(e)=>{
                const v = e.target.value
                setReservations(prev => prev.slice()) // trigger no-op if needed
                try { window._filterFrom = v } catch {}
              }}/>
            </div>
            <div className="form__field" style={{ maxWidth: 260 }}>
              <label className="form__label">Hasta</label>
              <input type="date" className="form__input" onChange={(e)=>{
                const v = e.target.value
                setReservations(prev => prev.slice())
                try { window._filterTo = v } catch {}
              }}/>
            </div>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div style={{ padding: '24px' }}>
            <p>No hay reservas guardadas.</p>
          </div>
        ) : (
          <div style={{ padding: '24px' }}>
            <table className="table table--responsive" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th>Vehículo</th>
                  <th>Retiro</th>
                  <th>Devolución</th>
                  <th>Días</th>
                  <th>Precio/día</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Código</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservations
                  .filter((r)=>{
                    const from = window._filterFrom
                    const to = window._filterTo
                    const start = r.fecha_inicio || r.pickupDate
                    if (!from && !to) return true
                    if (from && !to) return start >= from
                    if (!from && to) return start <= to
                    return start >= from && start <= to
                  })
                  .map((r, idx) => {
                  // Normalización para soportar backend y localStorage
                  const name = r.vehicleName || (r.vehiculo_id ? `Vehículo #${r.vehiculo_id}` : 'Vehículo')
                  const pickup = r.pickupDate || r.fecha_inicio || ''
                  const ret = r.returnDate || r.fecha_fin || ''
                  const calcDays = (() => {
                    const parse = (v) => (v ? new Date(v) : null)
                    const a = parse(pickup)
                    const b = parse(ret)
                    if (!a || !b) return r.days || 0
                    const ms = b.getTime() - a.getTime()
                    const d = Math.ceil(ms / 86400000)
                    return d > 0 ? d : (r.days || 0)
                  })()
                  const price = typeof r.pricePerDay === 'number' ? r.pricePerDay : (typeof r.precio_dia === 'number' ? r.precio_dia : null)
                  const total = typeof r.total === 'number' ? r.total : (price ? price * calcDays : null)
                  const estado = r.estado || 'pendiente'
                  return (
                    <tr key={idx} style={{ borderTop: '1px solid #1f2937' }}>
                      <td data-label="Vehículo">{name}</td>
                      <td data-label="Retiro">{pickup}</td>
                      <td data-label="Devolución">{ret}</td>
                      <td data-label="Días">{calcDays}</td>
                      <td data-label="Precio/día">{typeof price === 'number' ? formatCurrency(price) : '-'}</td>
                      <td data-label="Total">{typeof total === 'number' ? formatCurrency(total) : '-'}</td>
                      <td data-label="Estado">
                        <span style={{
                          padding:'2px 8px',borderRadius:'999px',
                          background: estado==='confirmada'?'#16a34a33':estado==='cancelada'?'#ef444433':'#f59e0b33',
                          color: estado==='confirmada'?'#22c55e':estado==='cancelada'?'#f87171':'#fbbf24',
                          fontWeight:700,fontSize:'.85rem'
                        }}>{estado}</span>
                      </td>
                      <td data-label="Código" style={{ fontFamily: 'monospace' }}>{r.codigo || '—'}</td>
                      <td data-label="Acciones">
                        <button className="button" onClick={() => handleDelete(idx)} style={{ padding: '8px 10px' }}>
                          Borrar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}




