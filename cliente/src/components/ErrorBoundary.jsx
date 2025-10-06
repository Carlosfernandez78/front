import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Error inesperado' }
  }
  componentDidCatch(error, info) {
    // Se podría agregar logging aquí si fuese necesario
    // console.error(error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="page" role="main" style={{ padding: '24px' }}>
          <div className="card" style={{ maxWidth: 600 }}>
            <div className="card__header">
              <h1 className="card__title">Ocurrió un error</h1>
              <p className="card__subtitle">{this.state.message}</p>
            </div>
            <div className="form" style={{ paddingTop: 0 }}>
              <button className="button" onClick={() => this.setState({ hasError: false, message: '' })}>Reintentar</button>
            </div>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}


