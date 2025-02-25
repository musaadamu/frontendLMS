import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Add the non-null assertion operator (!) to fix the Container type error
const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)