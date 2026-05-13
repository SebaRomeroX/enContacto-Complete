import './pagChats.css'
import { ListaSalas } from './ListaSalas'
import { SalaChat } from './sala/SalaChat'
import { Link } from 'react-router'
import { RUTAS } from '../../constants/rutas'

export const PaginaChats = () => {
  return (
    <section className='pagina-chats'>
      <section className='chats-header'>
        <h2>EnContacto</h2>
        <Link className='boton' to={RUTAS.admin}>Administrar</Link>
      </section>
      <section className='pantalla' >
        <ListaSalas />
        <SalaChat />
      </section>
    </section>
  )
}