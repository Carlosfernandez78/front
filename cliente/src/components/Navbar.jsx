import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const refreshAuth = () => {
    try {
      setIsLoggedIn(!!localStorage.getItem('authToken'))
    } catch {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    refreshAuth()
  }, [location.pathname])

  useEffect(() => {
    const onStorage = (e) => {
      if (!e || e.key === 'authToken') refreshAuth()
    }
    const onAuthChanged = () => refreshAuth()
    window.addEventListener('storage', onStorage)
    window.addEventListener('authChanged', onAuthChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('authChanged', onAuthChanged)
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') === 'light' ? '' : 'light'
    if (next) root.setAttribute('data-theme', next)
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', next || 'dark')
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken')
    } catch {}
    try { window.dispatchEvent(new Event('authChanged')) } catch {}
    setIsLoggedIn(false)
    navigate('/', { replace: true })
  }
  return (
    <nav style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <strong style={{ marginRight: 'auto' }}>Alquiler</strong>
      {isLoggedIn && <Link to="/" className="link">Home</Link>}
      <Link to="/about" className="link">Acerca</Link>
      {isLoggedIn && <Link to="/reservas" className="link">Mis reservas</Link>}
      {!isLoggedIn ? (
        <>
          <Link to="/login" className="link">Login</Link>
          <Link to="/register" className="link">Registrarse</Link>
        </>
      ) : (
        <button onClick={handleLogout} className="button" style={{ width: 'auto', padding: '8px 10px' }}>Desconectar</button>
      )}
      {isLoggedIn && <Link to="/reserva" className="link">Reserva</Link>}
      <button onClick={toggleTheme} className="button" style={{ width: 'auto', padding: '8px 10px' }}>Tema</button>
    </nav>
  )
}

