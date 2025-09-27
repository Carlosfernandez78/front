const http = require('http')

const BASE = process.env.API || 'http://localhost:3000'

function httpRequest(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE)
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + (url.search || ''),
      headers: { ...headers },
    }
    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        const contentType = res.headers['content-type'] || ''
        if (contentType.includes('application/json')) {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data || 'null') })
          } catch {
            resolve({ status: res.statusCode, data })
          }
        } else {
          resolve({ status: res.statusCode, data })
        }
      })
    })
    req.on('error', reject)
    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body)
      if (!options.headers['Content-Type']) {
        req.setHeader('Content-Type', 'application/json')
      }
      req.setHeader('Content-Length', Buffer.byteLength(payload))
      req.write(payload)
    }
    req.end()
  })
}

;(async () => {
  console.log('CHECK /api/test/db')
  const health = await httpRequest('GET', '/api/test/db')
  console.log('DB STATUS:', health.status, typeof health.data === 'object' ? health.data.success : health.data)

  const email = `test${Date.now()}@ex.com`
  const pass = 'secret123'

  console.log('REGISTER', email)
  const reg = await httpRequest('POST', '/auth/register', { body: { nombre: 'Test', email, contrasena: pass } })
  console.log('REGISTER STATUS:', reg.status)

  console.log('LOGIN')
  const log = await httpRequest('POST', '/auth/login', { body: { email, contrasena: pass } })
  console.log('LOGIN STATUS:', log.status)
  const token = log.data && log.data.token
  if (!token) throw new Error('No token received')
  console.log('TOKEN PREFIX:', token.slice(0, 16) + '...')

  console.log('PERFIL')
  const perfil = await httpRequest('GET', '/auth/perfil', { headers: { Authorization: `Bearer ${token}` } })
  console.log('PERFIL STATUS:', perfil.status)
  const userId = perfil.data && perfil.data.id ? perfil.data.id : 1
  console.log('USER ID:', userId)

  console.log('VEHICULOS')
  const veh = await httpRequest('GET', '/vehiculos')
  console.log('VEHICULOS STATUS:', veh.status)
  const vehId = veh.data && veh.data.data && veh.data.data[0] && veh.data.data[0].id ? veh.data.data[0].id : 1
  console.log('VEHICULO ID:', vehId)

  console.log('CREAR RESERVA')
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const create = await httpRequest('POST', '/reservas', {
    headers: { Authorization: `Bearer ${token}` },
    body: { usuario_id: userId, vehiculo_id: vehId, fecha_inicio: today, fecha_fin: tomorrow, estado: 'pendiente' },
  })
  console.log('CREATE RESERVA STATUS:', create.status)

  console.log('LISTAR RESERVAS')
  const list = await httpRequest('GET', '/reservas', { headers: { Authorization: `Bearer ${token}` } })
  console.log('LISTAR RESERVAS STATUS:', list.status)
  console.log('RESERVAS COUNT:', Array.isArray(list.data) ? list.data.length : 'N/A')
})().catch((e) => {
  console.error('E2E ERROR:', e.message)
  process.exit(1)
})
