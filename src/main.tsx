import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { InventoriesProvider } from './context/InventoriesProvider.tsx'
import { ApolloProvider } from '@apollo/client'
import client from './api/client.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <InventoriesProvider>
        <App />
      </InventoriesProvider>
    </ApolloProvider>
  </StrictMode>,
)
