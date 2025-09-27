import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post } from '../lib/api.js'
import { useParams, Link } from 'react-router-dom'
import { getVehicleById } from '../data/vehicles.js'
import SvgSuv2022 from '../components/SvgSuv2022.jsx'

export default function Reserva() {
  const navigate = useNavigate()
  const { vehicleId } = useParams()
  const vehicle = getVehicleById(vehicleId) || getVehicleById('sedan-2023')
  // Intento mapear a un vehiculo_id numérico si viene como query (?vehiculoId=123)
  const vehiculoIdFromQuery = (() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const v = params.get('vehiculoId')
      return v ? parseInt(v, 10) : null
    } catch {
      return null
    }
  })()
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [pickupBranch, setPickupBranch] = useState(() => {
    try { return localStorage.getItem('pickupBranch') || '' } catch { return '' }
  })
  const [dropoffBranch, setDropoffBranch] = useState(() => {
    try { return localStorage.getItem('dropoffBranch') || 'same' } catch { return 'same' }
  })
  const formRef = useRef(null)
  const hasToken = useMemo(() => {
    try { return !!localStorage.getItem('authToken') } catch { return false }
  }, [])
  const [vehiculoIdBackend, setVehiculoIdBackend] = useState(null)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await get('/vehiculos')
        const items = Array.isArray(res?.data) ? res.data : []
        const name = (vehicle?.name || '').toLowerCase()
        const match = items.find((it) => {
          const s = `${it.marca} ${it.modelo}`.toLowerCase()
          return name.includes('suv') ? s.includes('rav') || s.includes('cr-v') : name.includes('pickup') ? s.includes('pickup') || s.includes('4x4') : s.includes('yaris') || s.includes('civic') || s.includes('gol')
        }) || items[0]
        if (match && match.id) setVehiculoIdBackend(match.id)
      } catch {}
    })()
  }, [vehicle?.id])

  const formatCurrency = (value) => value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
  const parseYMD = (value) => {
    if (!value) return null
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const days = useMemo(() => {
    const start = parseYMD(pickupDate)
    const end = parseYMD(returnDate)
    if (!start || !end) return 0
    const diffMs = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffMs / 86400000)
    return diffDays > 0 ? diffDays : 0
  }, [pickupDate, returnDate])
  const isValidDates = days > 0
  const total = useMemo(() => (isValidDates ? days * vehicle.pricePerDay : 0), [days, vehicle.pricePerDay, isValidDates])
  return (
    <main className="page">
      <section className="shell">
        <header className="shell__header">
          <h1 className="shell__title">Reserva de vehículo</h1>
          <p className="shell__subtitle">Completa los datos para confirmar tu alquiler</p>
        </header>

        <div className="grid">
          <article className="vehicle" aria-labelledby="vehiculo-titulo">
            <div className="vehicle__media">
              {vehicle.id === 'suv-2022' ? (
                <img
                  className="vehicle__img"
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/images/suv-2022.svg'
                  }}
                />
              ) : (
                <img
                  className="vehicle__img"
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="100%" height="100%" fill="%230b1220"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23e5e7eb" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="42">Imagen no disponible</text></svg>'
                  }}
                />
              )}
              <span className="vehicle__badge">Oferta</span>
            </div>
            <div className="vehicle__content">
              <h2 id="vehiculo-titulo" className="vehicle__title">{vehicle.name}</h2>
              <p className="vehicle__meta">{vehicle.features.join(' • ')}</p>
              <p className="vehicle__desc">Ideal para ciudad y viajes cortos. Consumo eficiente y gran maniobrabilidad.</p>
              <div className="vehicle__price">
                <span className="vehicle__price-amount">{vehicle.pricePerDay.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span>
                <span className="vehicle__price-note">/ día</span>
              </div>
            </div>
          </article>

          <form
            className="booking"
            aria-labelledby="reserva-titulo"
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault()
              if (!isValidDates) return
              // Revalidar autenticación al enviar
              try {
                const tk = localStorage.getItem('authToken')
                if (!tk) {
                  alert('Debes iniciar sesión para reservar.')
                  navigate('/login')
                  return
                }
              } catch {
                alert('Debes iniciar sesión para reservar.')
                navigate('/login')
                return
              }
              const reservation = {
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                pricePerDay: vehicle.pricePerDay,
                pickupDate,
                returnDate,
                days,
                total,
                createdAt: new Date().toISOString(),
              }
              ;(async () => {
                try {
                  // Forma esperada por backend
                  const body = {
                    usuario_id: 1, // TODO: si hay endpoint /auth/perfil podemos obtener el id real
                    vehiculo_id: vehiculoIdFromQuery || vehiculoIdBackend || 1,
                    fecha_inicio: pickupDate,
                    fecha_fin: returnDate,
                    estado: 'pendiente',
                  }
                  await post('/reservas', body)
                  alert('Reserva enviada correctamente.')
                  setPickupDate('')
                  setReturnDate('')
                  try { formRef.current && formRef.current.reset() } catch {}
                } catch (err) {
                  const key = 'reservations'
                  const existing = JSON.parse(localStorage.getItem(key) || '[]')
                  existing.push(reservation)
                  localStorage.setItem(key, JSON.stringify(existing))
                  alert('Reserva guardada localmente (sin conexión con el servidor).')
                  setPickupDate('')
                  setReturnDate('')
                  try { formRef.current && formRef.current.reset() } catch {}
                }
              })()
            }}
          >
            <h2 id="reserva-titulo" className="booking__title">Datos de la reserva</h2>
            {!hasToken && (
              <div className="alert alert--info" role="alert" style={{ marginBottom: '8px' }}>
                Inicia sesión para poder confirmar una reserva.
              </div>
            )}

            <div className="form__field">
              <label htmlFor="pickup-location" className="form__label">Sucursal de retiro</label>
              <div className="hover-wrap">
                <select id="pickup-location" className="form__input" required value={pickupBranch} onChange={(e)=>{ setPickupBranch(e.target.value); try{localStorage.setItem('pickupBranch', e.target.value)}catch{}}}>
                <option value="" disabled>Selecciona una sucursal</option>
                <option value="bsas">Buenos Aires</option>
                <option value="er">Entre Ríos</option>
                <option value="mis">Misiones</option>
                </select>
                <div className="hover-hint"><strong>Tip:</strong> pasá el mouse para ver las opciones disponibles y elegir tu sucursal de retiro.</div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__field">
                <label htmlFor="pickup-date" className="form__label">Fecha de retiro</label>
                <div className="hover-wrap input-wrap">
                  <input
                    id="pickup-date"
                    type="date"
                    className="form__input"
                    value={pickupDate}
                    onChange={(e) => {
                      const next = e.target.value
                      setPickupDate(next)
                      if (returnDate && next && parseYMD(returnDate) <= parseYMD(next)) {
                        setReturnDate('')
                      }
                    }}
                    required
                  />
                  <div className="hover-hint"><strong>Tip:</strong> elegí la fecha de retiro. La devolución debe ser posterior.</div>
                </div>
              </div>
              <div className="form__field">
                <label htmlFor="return-date" className="form__label">Fecha de devolución</label>
                <div className="hover-wrap input-wrap">
                  <input
                    id="return-date"
                    type="date"
                    className="form__input"
                    value={returnDate}
                    min={pickupDate || undefined}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                  <div className="hover-hint"><strong>Tip:</strong> seleccioná una fecha posterior al retiro.</div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__field">
                <label htmlFor="pickup-time" className="form__label">Hora de retiro</label>
                <div className="hover-wrap input-wrap">
                  <input id="pickup-time" type="time" className="form__input" defaultValue="10:00" required />
                  <div className="hover-hint"><strong>Tip:</strong> ayuda a coordinar la disponibilidad del vehículo.</div>
                </div>
              </div>
              <div className="form__field">
                <label htmlFor="return-time" className="form__label">Hora de devolución</label>
                <div className="hover-wrap input-wrap">
                  <input id="return-time" type="time" className="form__input" defaultValue="10:00" required />
                  <div className="hover-hint"><strong>Tip:</strong> evitá recargos devolviendo a tiempo.</div>
                </div>
              </div>
            </div>

            <div className="form__field">
              <label htmlFor="dropoff-location" className="form__label">Devolver en otra sucursal</label>
              <div className="hover-wrap">
                <select id="dropoff-location" className="form__input" value={dropoffBranch} onChange={(e)=>{ setDropoffBranch(e.target.value); try{localStorage.setItem('dropoffBranch', e.target.value)}catch{}}}>
                <option value="same">Devolver en la misma sucursal</option>
                <option value="bsas">Buenos Aires</option>
                <option value="er">Entre Ríos</option>
                <option value="mis">Misiones</option>
                </select>
                <div className="hover-hint"><strong>Tip:</strong> pasá el mouse para desplegar y seleccionar una sucursal distinta para la devolución.</div>
              </div>
            </div>

            <div className="hover-wrap">
              <fieldset className="extras">
                <legend className="extras__title">Extras opcionales</legend>
                <label className="checkbox"><input type="checkbox" /> Sillita para bebé</label>
                <label className="checkbox"><input type="checkbox" /> GPS</label>
                <label className="checkbox"><input type="checkbox" /> Conductor adicional</label>
              </fieldset>
              <div className="hover-hint"><strong>Tip:</strong> seleccioná extras según tus necesidades; podés modificarlos luego.</div>
            </div>

            <div className="form__field">
              <label htmlFor="age" className="form__label">Edad del conductor</label>
              <div className="hover-wrap">
                <input id="age" type="number" min="18" max="85" defaultValue="30" className="form__input" required />
                <div className="hover-hint"><strong>Tip:</strong> debe ser mayor de edad para poder alquilar.</div>
              </div>
            </div>

            <div className="form__field" aria-live="polite">
              <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                <span className="vehicle__price-note">Días:</span>
                <strong>{days}</strong>
              </div>
              <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                <span className="vehicle__price-note">Precio por día:</span>
                <strong>{formatCurrency(vehicle.pricePerDay)}</strong>
              </div>
              <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                <span className="vehicle__price-note">Total:</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              {!isValidDates && (pickupDate || returnDate) && (
                <div className="alert alert--info" role="alert" style={{ marginTop: '8px' }}>
                  Seleccioná fechas válidas: la devolución debe ser posterior al retiro.
                </div>
              )}
            </div>

            <button type="submit" className="button" disabled={!isValidDates || !hasToken}>Reservar ahora</button>
            <p className="booking__note">Al continuar aceptas los términos y condiciones del alquiler.</p>
          </form>
        </div>

        <a href="#reserva-titulo" className="cta-fixed">Reservar</a>
        <p style={{textAlign:'center',marginTop:'12px'}}>
          <Link className="link" to="/">Volver al catálogo</Link>
        </p>
      </section>
    </main>
  )
}


