import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { InventoriesProvider } from './context/InventoriesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InventoriesProvider>
      <App />
    </InventoriesProvider>
  </StrictMode>,
)
