import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
