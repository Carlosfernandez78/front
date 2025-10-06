import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post } from '../lib/api.js'
import { useParams, Link } from 'react-router-dom'
import { getVehicleById } from '../data/vehicles.js'
import SvgSuv2022 from '../components/SvgSuv2022.jsx'
import QRCode from 'qrcode'

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
  const [step, setStep] = useState('form') // 'form' | 'resumen'
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [paying, setPaying] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [ticketCode, setTicketCode] = useState('')
  const [ticketQR, setTicketQR] = useState('')
  const [ticketStatus, setTicketStatus] = useState('')
  const [ticketDays, setTicketDays] = useState(null)
  const [ticketTotal, setTicketTotal] = useState(null)
  const [ticketPickup, setTicketPickup] = useState('')
  const [ticketReturn, setTicketReturn] = useState('')
  // Campos de pago (demo)
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('') // MM/AA
  const [cardCvv, setCardCvv] = useState('')
  const [cardDni, setCardDni] = useState('')
  const [transferCbu, setTransferCbu] = useState('')
  const [transferAlias, setTransferAlias] = useState('')
  const [transferBank, setTransferBank] = useState('')
  const [transferHolder, setTransferHolder] = useState('')
  const [transferReceipt, setTransferReceipt] = useState('')

  const isPaymentFormValid = useMemo(() => {
    if (paymentMethod === 'efectivo') return true
    if (paymentMethod === 'tarjeta') {
      const num = cardNumber.replace(/\D/g, '')
      const nameOk = cardName.trim().length >= 4
      const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)
      const cvvOk = /^\d{3,4}$/.test(cardCvv)
      const dniOk = /^\d{7,9}$/.test(cardDni)
      return num.length >= 13 && num.length <= 19 && nameOk && expOk && cvvOk && dniOk
    }
    if (paymentMethod === 'transferencia') {
      const cbuOk = /^\d{22}$/.test(transferCbu)
      const aliasOk = transferAlias.trim().length >= 6
      const bankOk = transferBank.trim().length >= 2
      const holderOk = transferHolder.trim().length >= 4
      return (cbuOk || aliasOk) && bankOk && holderOk
    }
    return false
  }, [paymentMethod, cardNumber, cardName, cardExpiry, cardCvv, cardDni, transferCbu, transferAlias, transferBank, transferHolder])
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
                  setPaymentError('')
                  setPaying(true)
                  let payment_id = null
                  // 1) Crear intento de pago
                  const intent = await post('/pagos/intent', { amount: total, method: paymentMethod })
                  payment_id = intent?.id || null
                  // 2) Confirmar pago (simulado: siempre aprobado)
                  const confirmed = await post('/pagos/confirm', { payment_id })
                  const paid = confirmed?.status === 'succeeded'
                  // 3) Crear reserva con referencia al pago
                  const body = {
                    vehiculo_id: vehiculoIdFromQuery || vehiculoIdBackend || 1,
                    fecha_inicio: pickupDate,
                    fecha_fin: returnDate,
                    estado: paid ? 'pagado' : 'pendiente',
                    payment_id,
                  }
                  const created = await post('/reservas', body)
                  const code = created?.codigo || ''
                  setTicketCode(code)
                  setTicketStatus(paid ? 'pagado' : 'pendiente')
                  // Snapshot de datos para el ticket (conservar aunque se limpien campos)
                  setTicketDays(days)
                  setTicketTotal(total)
                  setTicketPickup(pickupDate)
                  setTicketReturn(returnDate)
                  try {
                    if (code) {
                      const dataUrl = await QRCode.toDataURL(code, { width: 180, margin: 1, color: { dark: '#000000', light: '#FFFFFF00' } })
                      setTicketQR(dataUrl)
                    }
                  } catch {}
                  alert(paid ? 'Reserva pagada y confirmada.' : 'Reserva enviada correctamente.')
                  setPickupDate('')
                  setReturnDate('')
                  try { formRef.current && formRef.current.reset() } catch {}
                } catch (err) {
                  setPaymentError(err?.message || 'No se pudo procesar el pago')
                  const key = 'reservations'
                  const existing = JSON.parse(localStorage.getItem(key) || '[]')
                  existing.push(reservation)
                  localStorage.setItem(key, JSON.stringify(existing))
                  alert('Reserva guardada localmente (sin conexión con el servidor).')
                  setPickupDate('')
                  setReturnDate('')
                  try { formRef.current && formRef.current.reset() } catch {}
                } finally {
                  setPaying(false)
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

            <div className="form__field">
              <label htmlFor="payment-method" className="form__label">Método de pago</label>
              <div className="hover-wrap">
                <select id="payment-method" className="form__input" value={paymentMethod} onChange={(e)=> setPaymentMethod(e.target.value)}>
                  <option value="tarjeta">Tarjeta de crédito / débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo (en sucursal)</option>
                </select>
                <div className="hover-hint"><strong>Tip:</strong> para demo, todos los pagos se aprueban automáticamente.</div>
              </div>
            </div>

            {paymentError && (
              <div className="alert alert--info" role="alert" style={{ marginBottom: '8px' }}>
                {paymentError}
              </div>
            )}

            {step === 'resumen' && paymentMethod === 'tarjeta' && (
              <div className="form__field">
                <label className="form__label">Datos de tarjeta (demo)</label>
                <div className="form__row">
                  <div className="form__field">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form__input"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 19)
                        const grouped = digits.replace(/(.{4})/g, '$1 ').trim()
                        setCardNumber(grouped)
                      }}
                      required
                    />
                  </div>
                  <div className="form__field">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Nombre y apellido"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form__row">
                  <div className="form__field">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Vencimiento (MM/AA)"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^\d]/g, '').slice(0, 4)
                        if (v.length >= 3) v = `${v.slice(0,2)}/${v.slice(2)}`
                        setCardExpiry(v)
                      }}
                      required
                    />
                  </div>
                  <div className="form__field">
                    <input
                      type="password"
                      inputMode="numeric"
                      className="form__input"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0,4))}
                      required
                    />
                  </div>
                  <div className="form__field">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form__input"
                      placeholder="DNI del titular"
                      value={cardDni}
                      onChange={(e) => setCardDni(e.target.value.replace(/\D/g, '').slice(0,9))}
                      required
                    />
                  </div>
                </div>
                <p className="booking__note">Demo: no se envían datos sensibles; se valida localmente.</p>
              </div>
            )}

            {step === 'resumen' && paymentMethod === 'transferencia' && (
              <div className="form__field">
                <label className="form__label">Datos de transferencia (demo)</label>
                <div className="form__row">
                  <div className="form__field">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form__input"
                      placeholder="CBU (22 dígitos)"
                      value={transferCbu}
                      onChange={(e) => setTransferCbu(e.target.value.replace(/\D/g, '').slice(0,22))}
                    />
                  </div>
                  <div className="form__field">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Alias (opcional si informas CBU)"
                      value={transferAlias}
                      onChange={(e) => setTransferAlias(e.target.value.slice(0, 30))}
                    />
                  </div>
                </div>
                <div className="form__row">
                  <div className="form__field">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Banco"
                      value={transferBank}
                      onChange={(e) => setTransferBank(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form__field">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Titular de la cuenta"
                      value={transferHolder}
                      onChange={(e) => setTransferHolder(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form__field">
                  <input
                    type="text"
                    className="form__input"
                    placeholder="Comprobante (número u observación, opcional)"
                    value={transferReceipt}
                    onChange={(e) => setTransferReceipt(e.target.value)}
                  />
                </div>
                <p className="booking__note">Demo: se valida localmente tener CBU (o alias), banco y titular.</p>
              </div>
            )}

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

            {step === 'form' ? (
              <>
                <button type="button" className="button" disabled={!isValidDates || !hasToken} onClick={()=> setStep('resumen')}>Continuar al resumen</button>
                <p className="booking__note">Al continuar aceptas los términos y condiciones del alquiler.</p>
              </>
            ) : (
              <>
                <div className="card" style={{ width: '100%', maxWidth: '100%', marginBottom: '8px' }}>
                  <div className="card__header">
                    <h3 className="card__title" style={{ fontSize: '1.2rem' }}>Ticket de resumen</h3>
                    <p className="card__subtitle">Verifica los datos antes de pagar</p>
                  </div>
                  <div className="form" style={{ paddingTop: 0 }}>
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">Vehículo</span>
                      <strong>{vehicle.name}</strong>
                    </div>
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">Retiro</span>
                      <strong>{(ticketPickup || pickupDate) || '-'} {`(${pickupBranch || '—'})`}</strong>
                    </div>
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">Devolución</span>
                      <strong>{(ticketReturn || returnDate) || '-'} {`(${dropoffBranch === 'same' ? 'misma sucursal' : dropoffBranch || '—'})`}</strong>
                    </div>
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">Método de pago</span>
                      <strong>{paymentMethod}</strong>
                    </div>
                    <hr style={{ borderColor: '#1f2937', width: '100%' }} />
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">Días</span>
                      <strong>{ticketDays ?? days}</strong>
                    </div>
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">{ticketStatus === 'pagado' ? 'Total pagado' : 'Total'}</span>
                      <strong>{formatCurrency((ticketTotal ?? total) || 0)}</strong>
                    </div>
                    <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                      <span className="vehicle__price-note">Estado</span>
                      <strong style={{ textTransform: 'capitalize' }}>{ticketStatus || '—'}</strong>
                    </div>
                    {ticketStatus === 'pagado' && ticketCode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                        <div>
                          <div className="vehicle__price" style={{ justifyContent: 'space-between' }}>
                            <span className="vehicle__price-note">Código</span>
                            <strong>{ticketCode}</strong>
                          </div>
                          <p className="vehicle__price-note" style={{ margin: 0 }}>Guárdalo para consultas/cambios.</p>
                        </div>
                        {ticketQR && (
                          <img src={ticketQR} alt="Código QR de reserva" width="120" height="120" style={{ background: '#fff', borderRadius: '8px', padding: '6px' }} />
                        )}
                      </div>
                    )}
                    <button type="button" className="button" onClick={() => window.print()} style={{ background: '#1f2937', color: '#e5e7eb' }}>Imprimir/Guardar</button>
                  </div>
                </div>
                <div className="alert" role="status" style={{ marginBottom: '8px' }}>
                  Revisá el resumen y el método de pago antes de confirmar.
                </div>
                <button type="submit" className="button" disabled={!isValidDates || !hasToken || paying || ticketStatus === 'pagado' || !isPaymentFormValid}>{paying ? 'Procesando pago…' : (ticketStatus === 'pagado' ? 'Pago confirmado' : 'Confirmar y pagar')}</button>
                <button type="button" className="button" style={{ marginTop: '8px', background: '#374151', color: '#e5e7eb' }} onClick={()=> setStep('form')}>Volver</button>
              </>
            )}
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


