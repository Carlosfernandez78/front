import { Link } from 'react-router-dom'

export default function Navbar() {
  const toggleTheme = () => {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') === 'light' ? '' : 'light'
    if (next) root.setAttribute('data-theme', next)
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', next || 'dark')
  }
  return (
    <nav style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <strong style={{ marginRight: 'auto' }}>Alquiler</strong>
      <Link to="/" className="link">Home</Link>
      <Link to="/about" className="link">Acerca</Link>
      <Link to="/reservas" className="link">Mis reservas</Link>
      <Link to="/login" className="link">Login</Link>
      <Link to="/reserva" className="link">Reserva</Link>
      <button onClick={toggleTheme} className="button" style={{ width: 'auto', padding: '8px 10px' }}>Tema</button>
    </nav>
  )
}

