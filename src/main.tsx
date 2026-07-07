import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UsuarioProvider } from './context/UsuarioProvider.tsx'
import { SalasProvider } from './context/SalasProvider.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/utilities.css'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <UsuarioProvider>
      <SalasProvider>
        <App />
      </SalasProvider>
    </UsuarioProvider>
  </ErrorBoundary>
)
