import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { post } from '../lib/api.js'

export default function Login({ accion = 'ingresar' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const isRegister = accion === 'registrar'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await post('/auth/register', { nombre: 'Usuario', email, contrasena: password })
        navigate('/login', { replace: true })
      } else {
        const data = await post('/auth/login', { email, contrasena: password })
        const token = data?.token
        if (token) {
          localStorage.setItem('authToken', token)
          if (data && data.rol) {
            try { localStorage.setItem('authRole', data.rol) } catch {}
          }
          try { window.dispatchEvent(new Event('authChanged')) } catch {}
        }
        navigate('/reservas', { replace: true })
      }
    } catch (err) {
      if (isRegister && (err?.status === 400 || err?.status === 409)) {
        const msg = (err?.message || '').toLowerCase()
        if (msg.includes('existe') || msg.includes('exist') || msg.includes('duplic')) {
          // Usuario ya existe: enviar a login directamente
          navigate('/login', { replace: true })
          return
        }
      }
      setError(err?.message || (isRegister ? 'No se pudo registrar' : 'No se pudo iniciar sesión'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="login-title">
        <header className="card__header">
          <h1 id="login-title" className="card__title">{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
          <p className="card__subtitle">{isRegister ? 'Registra tus datos para comenzar' : 'Accede para reservar tu vehículo'}</p>
        </header>

        {error && (
          <div className="alert alert--info" role="alert" style={{ margin: '12px' }}>
            {error}
          </div>
        )}

        <form className="form form--narrow" autoComplete="on" onSubmit={handleSubmit}>
          <div className="form__field">
            <label htmlFor="email" className="form__label">Correo electrónico</label>
            <input id="email" name="email" type="email" className="form__input" placeholder="tu@correo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form__field">
            <label htmlFor="password" className="form__label">Contraseña</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form__input"
                placeholder="••••••••"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{ width: 'auto', padding: '8px 10px' }}
              >
                {showPassword ? (
                  // Ojo tachado
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M4 4l16 16" />
                  </svg>
                ) : (
                  // Ojo
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form__row">
            <label className="checkbox">
              <input type="checkbox" id="remember" name="remember" />
              <span>Mantener sesión iniciada</span>
            </label>
            <a className="link" href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="button" disabled={loading}>{loading ? (isRegister ? 'Creando…' : 'Ingresando…') : (isRegister ? 'Registrarse' : 'Ingresar')}</button>
        </form>

        <footer className="card__footer">
          {isRegister ? (
            <p>¿Ya tienes cuenta? <Link className="link" to="/login">Iniciar sesión</Link></p>
          ) : (
            <p>¿No tienes cuenta? <Link className="link" to="/register">Crea una cuenta</Link></p>
          )}
        </footer>
      </section>
    </main>
  )
}

