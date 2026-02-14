import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import 'katex/dist/katex.min.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ persister }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
