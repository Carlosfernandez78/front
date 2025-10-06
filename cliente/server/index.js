import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Datos en memoria para demo
const users = []
const reservations = []
const payments = []
const tokens = new Map()

// Vehículos (podemos mantener un subconjunto fijo)
const vehicles = [
  { id: 1, slug: 'sedan-2023', name: 'Sedán Compacto 2023', marca: 'Toyota', modelo: 'Yaris', pricePerDay: 28500 },
  { id: 2, slug: 'suv-2022', name: 'SUV Familiar 2022', marca: 'Toyota', modelo: 'RAV4', pricePerDay: 39500 },
  { id: 3, slug: 'pickup-2024', name: 'Pickup 4x4 2024', marca: 'Ford', modelo: 'Ranger', pricePerDay: 45500 },
]

const app = express()
app.use(cors())
app.use(express.json())

// Semilla: crear un usuario administrador por defecto
const ADMIN_EMAIL = 'admin@local.test'
const ADMIN_PASSWORD = 'admin123'
;(function seedAdmin() {
  const exists = users.find((u) => u.email === ADMIN_EMAIL)
  if (!exists) {
    users.push({
      id: users.length + 1,
      nombre: 'Admin',
      email: ADMIN_EMAIL,
      contrasena: ADMIN_PASSWORD,
      rol: 'admin',
    })
  }
})()

// Healthcheck de DB (simulado)
app.get('/api/test/db', (req, res) => {
  return res.json({ success: true })
})

// Helpers
function createToken(userId) {
  const token = `tok_${userId}_${Math.random().toString(36).slice(2)}`
  tokens.set(token, userId)
  return token
}

function generateReservationCode(id) {
  const ts = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `RES-${id}-${ts}-${rnd}`
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const userId = tokens.get(token)
  if (!userId) return res.status(401).json({ message: 'No autorizado' })
  req.userId = userId
  next()
}

function requireAdmin(req, res, next) {
  const user = users.find((u) => u.id === req.userId)
  if (!user) return res.status(401).json({ message: 'No autorizado' })
  if (user.rol !== 'admin') return res.status(403).json({ message: 'Requiere rol administrador' })
  next()
}

// Auth
app.post(['/auth/register', '/api/auth/register'], (req, res) => {
  const { nombre, email, contrasena } = req.body || {}
  if (!email || !contrasena) return res.status(400).json({ message: 'Email y contraseña requeridos' })
  const exists = users.find((u) => u.email === email)
  if (exists) return res.status(400).json({ message: 'Usuario ya existe' })
  const user = { id: users.length + 1, nombre: nombre || 'Usuario', email, contrasena, rol: 'user' }
  users.push(user)
  return res.status(201).json({ id: user.id, email: user.email, nombre: user.nombre, rol: user.rol })
})

app.post(['/auth/login', '/api/auth/login'], (req, res) => {
  const { email, contrasena } = req.body || {}
  const user = users.find((u) => u.email === email && u.contrasena === contrasena)
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })
  const token = createToken(user.id)
  return res.json({ token, rol: user.rol, nombre: user.nombre, email: user.email })
})

app.get(['/auth/perfil', '/api/auth/perfil'], authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.userId)
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  return res.json({ id: user.id, email: user.email, nombre: user.nombre, rol: user.rol })
})

// Ruta de ejemplo protegida para administradores
app.get(['/admin/health', '/api/admin/health'], authMiddleware, requireAdmin, (req, res) => {
  return res.json({ ok: true, usuarios: users.length, reservas: reservations.length })
})

// Admin: listar usuarios
app.get(['/admin/usuarios', '/api/admin/usuarios'], authMiddleware, requireAdmin, (req, res) => {
  const list = users.map(({ contrasena, ...u }) => u)
  return res.json(list)
})

// Admin: listar todas las reservas
app.get(['/admin/reservas', '/api/admin/reservas'], authMiddleware, requireAdmin, (req, res) => {
  return res.json(reservations)
})

// Vehículos
app.get(['/vehiculos', '/api/vehiculos'], (req, res) => {
  return res.json({ data: vehicles })
})

// Stripe Checkout (opcional)
app.post(['/payments/checkout-session', '/api/payments/checkout-session'], authMiddleware, async (req, res) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return res.status(501).json({ message: 'Stripe no configurado' })
    const { amount, currency = 'usd', success_path = '/pago/exito', cancel_path = '/pago/cancelado' } = req.body || {}
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Monto inválido' })
    const origin = req.headers.origin || `http://localhost:${process.env.FRONTEND_PORT || 5173}`
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(key)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'Reserva de vehículo' },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}${success_path}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancel_path}`,
    })
    return res.json({ id: session.id, url: session.url })
  } catch (e) {
    return res.status(500).json({ message: 'No se pudo crear sesión de pago' })
  }
})

// Pagos (simulados)
app.post(['/pagos/intent', '/api/pagos/intent'], authMiddleware, (req, res) => {
  const { amount, method } = req.body || {}
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Monto inválido' })
  const id = payments.length + 1
  const payment = { id, amount, method: method || 'tarjeta', status: 'requires_confirmation', user_id: req.userId }
  payments.push(payment)
  return res.status(201).json(payment)
})

app.post(['/pagos/confirm', '/api/pagos/confirm'], authMiddleware, (req, res) => {
  const { payment_id } = req.body || {}
  const payment = payments.find((p) => p.id === payment_id && p.user_id === req.userId)
  if (!payment) return res.status(404).json({ message: 'Pago no encontrado' })
  // Simulación: siempre aprobado
  payment.status = 'succeeded'
  return res.json(payment)
})

// Reservas
app.post(['/reservas', '/api/reservas'], authMiddleware, (req, res) => {
  const { vehiculo_id, fecha_inicio, fecha_fin, estado, payment_id } = req.body || {}
  if (!vehiculo_id || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ message: 'Datos incompletos' })
  }
  let finalEstado = estado || 'pendiente'
  if (payment_id) {
    const pay = payments.find((p) => p.id === payment_id && p.user_id === req.userId)
    if (!pay) return res.status(400).json({ message: 'Pago inválido' })
    if (pay.status === 'succeeded') finalEstado = 'pagado'
  }
  const reserva = {
    id: reservations.length + 1,
    usuario_id: req.userId,
    vehiculo_id,
    fecha_inicio,
    fecha_fin,
    estado: finalEstado,
    payment_id: payment_id || null,
  }
  reserva.codigo = generateReservationCode(reserva.id)
  reservations.push(reserva)
  return res.status(201).json(reserva)
})

app.get(['/reservas', '/api/reservas'], authMiddleware, (req, res) => {
  const list = reservations.filter((r) => r.usuario_id === req.userId)
  return res.json(list)
})

app.delete(['/reservas/:id', '/api/reservas/:id'], authMiddleware, (req, res) => {
  const id = parseInt(req.params.id, 10)
  const idx = reservations.findIndex((r) => r.id === id && r.usuario_id === req.userId)
  if (idx === -1) return res.status(404).json({ message: 'Reserva no encontrada' })
  reservations.splice(idx, 1)
  return res.status(204).send()
})

// Servir frontend estático (build de Vite) si existe
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')
app.use(express.static(distDir))

// Fallback SPA: enviar index.html para rutas no /api
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' })
  res.sendFile(path.join(distDir, 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`)
})


