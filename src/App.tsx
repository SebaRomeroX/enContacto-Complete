import { BrowserRouter, Route, Routes } from 'react-router'
import { PaginaChats } from './components/chat/PaginaChats'
import { PagAdmin } from './components/admin/PagAdmin'
import { Login } from './components/login/Login'
import { RUTAS } from './constants/rutas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RUTAS.login} Component={Login} />
        <Route path={RUTAS.chat} Component={PaginaChats} />
        <Route path={RUTAS.admin} Component={PagAdmin} />
      </Routes>
    </BrowserRouter>
    )
}

export default App
