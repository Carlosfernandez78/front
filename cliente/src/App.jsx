import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Reserva from './pages/Reserva.jsx'
import About from './pages/About.jsx'
import Reservations from './pages/Reservations.jsx'
import Admin from './pages/Admin.jsx'
import { get } from './lib/api.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import PagoExito from './pages/PagoExito.jsx'
import PagoCancelado from './pages/PagoCancelado.jsx'

function RequireAuth({ children }) {
  const location = useLocation()
  let hasToken = false
  try {
    hasToken = !!localStorage.getItem('authToken')
  } catch {
    hasToken = false
  }
  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function RequireAdmin({ children }) {
  const location = useLocation()
  const [status, setStatus] = useState('checking') // 'checking' | 'allowed' | 'forbidden' | 'unauth'

  useEffect(() => {
    let mounted = true
    async function verify() {
      try {
        const perfil = await get('/auth/perfil')
        if (!mounted) return
        if (perfil && perfil.rol === 'admin') setStatus('allowed')
        else setStatus('forbidden')
      } catch {
        setStatus('unauth')
      }
    }
    verify()
    return () => { mounted = false }
  }, [])

  if (status === 'checking') {
    return <main className="page" role="main" style={{ padding: '24px' }}><p>Verificando permisos…</p></main>
  }
  if (status === 'unauth') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (status === 'forbidden') {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login accion="ingresar" />} />
            <Route path="/register" element={<Login accion="registrar" />} />
            <Route path="/reserva" element={<RequireAuth><Reserva /></RequireAuth>} />
            <Route path="/reserva/:vehicleId" element={<RequireAuth><Reserva /></RequireAuth>} />
            <Route path="/reservas" element={<RequireAuth><Reservations /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><ErrorBoundary><Admin /></ErrorBoundary></RequireAdmin>} />
            <Route path="/about" element={<About />} />
            <Route path="/pago/exito" element={<RequireAuth><PagoExito /></RequireAuth>} />
            <Route path="/pago/cancelado" element={<RequireAuth><PagoCancelado /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
