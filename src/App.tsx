import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { PaginaChats } from './components/chat/PaginaChats'
import { Admin } from './components/admin/Admin'
import { RUTAS } from './constants/consts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RUTAS.chat} Component={PaginaChats} />
        <Route path={RUTAS.admin} Component={Admin} />
      </Routes>
    </BrowserRouter>
    )
}

export default App
