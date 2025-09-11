import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
// Register PWA Service Worker (optional; works when plugin is installed)
if ('serviceWorker' in navigator) {
  import(/* @vite-ignore */ 'virtual:pwa-register')
    .then(({ registerSW }) => {
      try { registerSW({ immediate: true }) } catch {}
    })
    .catch(() => {})
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
