import { useEffect, useState } from 'react'
import { get } from '../lib/api.js'

export default function Admin() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [reservas, setReservas] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setError('')
      setLoading(true)
      try {
        const [s, u, r] = await Promise.all([
          get('/admin/health').catch(() => null),
          get('/admin/usuarios').catch(() => []),
          get('/admin/reservas').catch(() => []),
        ])
        if (!mounted) return
        const safeStats = s && typeof s === 'object' ? s : { usuarios: 0, reservas: 0 }
        const safeUsers = Array.isArray(u) ? u : []
        const safeRes = Array.isArray(r) ? r : []
        setStats(safeStats)
        setUsuarios(safeUsers)
        setReservas(safeRes)
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'Error cargando datos de administración')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main className="page" role="main" style={{ padding: '24px' }}>
      <div className="catalog" style={{ maxWidth: '1100px', width: '100%' }}>
        <div className="catalog__header">
          <h1 className="catalog__title">Panel de administración</h1>
          <p className="catalog__subtitle">Métricas del sistema, usuarios registrados y reservas realizadas.</p>
        </div>
      {loading && <p>Cargando…</p>}
      {error && (
        <div className="alert alert--info" role="alert" style={{ margin: '12px 0' }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <section className="card" aria-labelledby="adm-stats">
            <header className="card__header">
              <h2 id="adm-stats" className="card__title">Métricas</h2>
            </header>
            <div className="card__body">
              <ul role="list" className="cardx__meta" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <li className="cardx__chip">Usuarios: {stats?.usuarios ?? 0}</li>
                <li className="cardx__chip">Reservas: {stats?.reservas ?? 0}</li>
              </ul>
            </div>
          </section>

          <section className="card" aria-labelledby="adm-users">
            <header className="card__header">
              <h2 id="adm-users" className="card__title">Usuarios</h2>
            </header>
            <div className="card__body" style={{ overflowX: 'auto' }}>
              {usuarios.length === 0 ? (
                <p className="cardx__note">No hay usuarios para mostrar.</p>
              ) : (
                <table className="table" role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr role="row">
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Nombre</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} role="row">
                      <td role="cell" style={{ padding: '8px' }}>{u.id}</td>
                      <td role="cell" style={{ padding: '8px' }}>{u.nombre}</td>
                      <td role="cell" style={{ padding: '8px' }}>{u.email}</td>
                      <td role="cell" style={{ padding: '8px' }}>{u.rol}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="card" aria-labelledby="adm-res">
            <header className="card__header">
              <h2 id="adm-res" className="card__title">Reservas</h2>
            </header>
            <div className="card__body" style={{ overflowX: 'auto' }}>
              {reservas.length === 0 ? (
                <p className="cardx__note">Aún no hay reservas.</p>
              ) : (
                <table className="table" role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr role="row">
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Usuario</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Vehículo</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Inicio</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Fin</th>
                    <th role="columnheader" style={{ textAlign: 'left', padding: '8px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id} role="row">
                      <td role="cell" style={{ padding: '8px' }}>{r.id}</td>
                      <td role="cell" style={{ padding: '8px' }}>{r.usuario_id}</td>
                      <td role="cell" style={{ padding: '8px' }}>{r.vehiculo_id}</td>
                      <td role="cell" style={{ padding: '8px' }}>{r.fecha_inicio}</td>
                      <td role="cell" style={{ padding: '8px' }}>{r.fecha_fin}</td>
                      <td role="cell" style={{ padding: '8px' }}>{r.estado}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      )}
      </div>
    </main>
  )
}


