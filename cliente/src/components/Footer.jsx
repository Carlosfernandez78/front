export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer role="contentinfo" style={{
      padding: '16px 24px',
      borderTop: '1px solid #1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <small style={{ color: '#9CA3AF' }}>
        © {year} Propiedad del titular. Todos los derechos reservados.
      </small>
    </footer>
  )
}


