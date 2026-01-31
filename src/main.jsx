import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import AllRoutes from './AllRoutes.jsx'
import { PlayerProvider } from './ContextAPI/PlayerContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <PlayerProvider>
        <AllRoutes />
      </PlayerProvider>
  </StrictMode>,
)