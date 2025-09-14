export default function Reserva() {
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
              <img
                className="vehicle__img"
                src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop"
                alt="Auto sedán color gris estacionado de perfil"
              />
              <span className="vehicle__badge">Oferta</span>
            </div>
            <div className="vehicle__content">
              <h2 id="vehiculo-titulo" className="vehicle__title">Sedán Compacto 2023</h2>
              <p className="vehicle__meta">Automático • 5 puertas • Aire Acondicionado • 2 maletas</p>
              <p className="vehicle__desc">Ideal para ciudad y viajes cortos. Consumo eficiente y gran maniobrabilidad.</p>
              <div className="vehicle__price">
                <span className="vehicle__price-amount">$28.500</span>
                <span className="vehicle__price-note">/ día</span>
              </div>
            </div>
          </article>

          <form className="booking" aria-labelledby="reserva-titulo">
            <h2 id="reserva-titulo" className="booking__title">Datos de la reserva</h2>

            <div className="form__field">
              <label htmlFor="pickup-location" className="form__label">Sucursal de retiro</label>
              <select id="pickup-location" className="form__input" required>
                <option value="" disabled>Selecciona una sucursal</option>
                <option value="centro">Buenos Aires - Centro</option>
                <option value="eze">Aeropuerto Ezeiza (EZE)</option>
                <option value="mdz">Mendoza - Ciudad</option>
              </select>
            </div>

            <div className="form__row">
              <div className="form__field">
                <label htmlFor="pickup-date" className="form__label">Fecha de retiro</label>
                <input id="pickup-date" type="date" className="form__input" required />
              </div>
              <div className="form__field">
                <label htmlFor="return-date" className="form__label">Fecha de devolución</label>
                <input id="return-date" type="date" className="form__input" required />
              </div>
            </div>

            <div className="form__row">
              <div className="form__field">
                <label htmlFor="pickup-time" className="form__label">Hora de retiro</label>
                <input id="pickup-time" type="time" className="form__input" defaultValue="10:00" required />
              </div>
              <div className="form__field">
                <label htmlFor="return-time" className="form__label">Hora de devolución</label>
                <input id="return-time" type="time" className="form__input" defaultValue="10:00" required />
              </div>
            </div>

            <div className="form__field">
              <label htmlFor="dropoff-location" className="form__label">Devolver en otra sucursal</label>
              <select id="dropoff-location" className="form__input">
                <option value="same">Devolver en la misma sucursal</option>
                <option value="centro">Buenos Aires - Centro</option>
                <option value="eze">Aeropuerto Ezeiza (EZE)</option>
                <option value="mdz">Mendoza - Ciudad</option>
              </select>
            </div>

            <fieldset className="extras">
              <legend className="extras__title">Extras opcionales</legend>
              <label className="checkbox"><input type="checkbox" /> Sillita para bebé</label>
              <label className="checkbox"><input type="checkbox" /> GPS</label>
              <label className="checkbox"><input type="checkbox" /> Conductor adicional</label>
            </fieldset>

            <div className="form__field">
              <label htmlFor="age" className="form__label">Edad del conductor</label>
              <input id="age" type="number" min="18" max="85" defaultValue="30" className="form__input" required />
            </div>

            <button type="submit" className="button">Reservar ahora</button>
            <p className="booking__note">Al continuar aceptas los términos y condiciones del alquiler.</p>
          </form>
        </div>

        <a href="#reserva-titulo" className="cta-fixed">Reservar</a>
      </section>
    </main>
  )
}


