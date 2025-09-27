import { Link } from 'react-router-dom'
import { vehicles as sampleVehicles } from '../data/vehicles.js'
import SvgSuv2022 from '../components/SvgSuv2022.jsx'

export default function Home() {
  let logged = false
  try { logged = !!localStorage.getItem('authToken') } catch { logged = false }
  return (
    <main className="page">
      <section className="catalog" aria-labelledby="catalog-title">
        <header className="catalog__header">
          <h1 id="catalog-title" className="catalog__title">Encontrá tu próximo vehículo</h1>
          <p className="catalog__subtitle">Elige entre nuestras opciones más populares para tu viaje</p>
        </header>

        <ul className="cards" role="list">
          {sampleVehicles.map((vehicle) => (
            <li key={vehicle.id} className="cards__item">
              <article className="cardx" aria-labelledby={`${vehicle.id}-title`}>
                <div className="cardx__media">
                  {vehicle.id === 'suv-2022' ? (
                    <img
                      className="cardx__img"
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
                      className="cardx__img"
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
                </div>
                <div className="cardx__content">
                  <h2 id={`${vehicle.id}-title`} className="cardx__title">{vehicle.name}</h2>
                  <ul className="cardx__meta" role="list">
                    {vehicle.features.map((f) => (
                      <li key={f} className="cardx__chip">{f}</li>
                    ))}
                  </ul>
                  <div className="cardx__footer">
                    <span className="cardx__price">{vehicle.pricePerDay.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span>
                    <span className="cardx__note">/ día</span>
                    {logged ? (
                      <Link className="cardx__cta" to={`/reserva/${vehicle.id}`}>Reservar</Link>
                    ) : (
                      <Link className="cardx__cta" to={`/login`}>Ingresar para reservar</Link>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

