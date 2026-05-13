import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UsuarioProvider } from './context/UsuarioProvider.tsx'
import { SalasProvider } from './context/SalasProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <UsuarioProvider>
    <SalasProvider>
      <App />
    </SalasProvider>
  </UsuarioProvider>
)
