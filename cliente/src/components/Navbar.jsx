import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <strong style={{ marginRight: 'auto' }}>Alquiler</strong>
      <Link to="/" className="link">Home</Link>
      <Link to="/login" className="link">Login</Link>
      <Link to="/reserva" className="link">Reserva</Link>
    </nav>
  )
}

