import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UsuarioProvider } from './context/usuarioContext.tsx'
import { SalasProvider } from './context/salasContext.tsx'

createRoot(document.getElementById('root')!).render(
  <UsuarioProvider>
    <SalasProvider>
      <App />
    </SalasProvider>
  </UsuarioProvider>
)
