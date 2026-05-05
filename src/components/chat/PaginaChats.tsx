import './Chat.css'
import { ListaSalas } from './ListaSalas'
import { Chat } from './sala/Chat'
import { CajaMensaje } from './CajaMensaje'
import { Link } from 'react-router'
import { RUTAS } from '../../constants/consts'

export const PaginaChats = () => {
  return (
    <section className='pagina-chats'>
      <section className='chats-header'>
        <h2>EnContacto</h2>
        <Link className='boton' to={RUTAS.admin}>Administrar</Link>
      </section>
      <section className='pantalla' >
        <ListaSalas />
        <Chat />
      </section>
      <CajaMensaje />
    </section>
  )
}