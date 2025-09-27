import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Reserva from './pages/Reserva.jsx'
import About from './pages/About.jsx'
import Reservations from './pages/Reservations.jsx'

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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login accion="ingresar" />} />
        <Route path="/register" element={<Login accion="registrar" />} />
        <Route path="/reserva" element={<RequireAuth><Reserva /></RequireAuth>} />
        <Route path="/reserva/:vehicleId" element={<RequireAuth><Reserva /></RequireAuth>} />
        <Route path="/reservas" element={<RequireAuth><Reservations /></RequireAuth>} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
