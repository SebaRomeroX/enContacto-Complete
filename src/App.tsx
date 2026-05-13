import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { PaginaChats } from './components/chat/PaginaChats'
import { PagAdmin } from './components/admin/PagAdmin'
import { RUTAS } from './constants/rutas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RUTAS.chat} Component={PaginaChats} />
        <Route path={RUTAS.admin} Component={PagAdmin} />
      </Routes>
    </BrowserRouter>
    )
}

export default App
