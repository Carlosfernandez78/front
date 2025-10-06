import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState('')

  const refreshAuth = () => {
    try {
      const has = !!localStorage.getItem('authToken')
      setIsLoggedIn(has)
      const r = localStorage.getItem('authRole') || ''
      setRole(r)
    } catch {
      setIsLoggedIn(false)
      setRole('')
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
      localStorage.removeItem('authRole')
    } catch {}
    try { window.dispatchEvent(new Event('authChanged')) } catch {}
    setIsLoggedIn(false)
    setRole('')
    navigate('/', { replace: true })
  }
  return (
    <nav style={{ padding: '16px 24px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '24px' }}>
      <strong style={{ marginRight: 'auto' }}>Alquiler</strong>
      {isLoggedIn && (
        <span
          aria-label={`Rol: ${role || 'usuario'}`}
          title={`Rol: ${role || 'usuario'}`}
          style={{
            background: '#111827',
            border: '1px solid #374151',
            color: role === 'admin' ? '#F59E0B' : '#9CA3AF',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
          }}
        >
          {role === 'admin' ? 'Admin' : 'Usuario'}
        </span>
      )}
      {isLoggedIn && <Link to="/" className="link" style={{ padding: '6px 10px' }}>Home</Link>}
      <Link to="/about" className="link" style={{ padding: '6px 10px' }}>Acerca</Link>
      {isLoggedIn && <Link to="/reservas" className="link" style={{ padding: '6px 10px' }}>Mis reservas</Link>}
      {!isLoggedIn ? (
        <>
          <Link to="/login" className="link" style={{ padding: '6px 10px' }}>Login</Link>
          <Link to="/register" className="link" style={{ padding: '6px 10px' }}>Registrarse</Link>
        </>
      ) : (
        <button onClick={handleLogout} className="button" style={{ width: 'auto', padding: '10px 12px' }}>Desconectar</button>
      )}
      {isLoggedIn && <Link to="/reserva" className="link" style={{ padding: '6px 10px' }}>Reserva</Link>}
      {isLoggedIn && role === 'admin' && <Link to="/admin" className="link" style={{ padding: '6px 10px' }}>Admin</Link>}
      <button onClick={toggleTheme} className="button" style={{ width: 'auto', padding: '10px 12px' }}>Tema</button>
    </nav>
  )
}

