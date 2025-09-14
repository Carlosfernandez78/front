export default function Login() {
  return (
    <main className="page">
      <section className="card" aria-labelledby="login-title">
        <header className="card__header">
          <h1 id="login-title" className="card__title">Iniciar sesión</h1>
          <p className="card__subtitle">Accede para reservar tu vehículo</p>
        </header>

        {/* Alerta informativa (simple) */}
        <div className="alert alert--info" role="alert" style={{ margin: '12px' }}>
          <strong>Importante:</strong> usa tu correo institucional para ingresar.
        </div>

        <form className="form" autoComplete="on">
          <div className="form__field">
            <label htmlFor="email" className="form__label">Correo electrónico</label>
            <input id="email" name="email" type="email" className="form__input" placeholder="tu@correo.com" required />
          </div>
          <div className="form__field">
            <label htmlFor="password" className="form__label">Contraseña</label>
            <input id="password" name="password" type="password" className="form__input" placeholder="••••••••" minLength={6} required />
          </div>

          <div className="form__row">
            <label className="checkbox">
              <input type="checkbox" id="remember" name="remember" />
              <span>Mantener sesión iniciada</span>
            </label>
            <a className="link" href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="button">Ingresar</button>
        </form>

        <footer className="card__footer">
          <p>¿No tienes cuenta? <a className="link" href="#">Crea una cuenta</a></p>
        </footer>
      </section>
    </main>
  )
}

