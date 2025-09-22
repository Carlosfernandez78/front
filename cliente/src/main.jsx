import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import App from './App.jsx'

// Inicializar tema desde localStorage o preferencia del sistema
const rootEl = document.documentElement
const saved = localStorage.getItem('theme')
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
if (saved === 'light' || (!saved && prefersLight)) {
  rootEl.setAttribute('data-theme', 'light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
