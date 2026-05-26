import './pagChats.css'
import { ListaSalas } from './ListaSalas'
import { SalaChat } from './sala/SalaChat'
import { Link, useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { useEffect } from 'react'


export const PaginaChats = () => {
  const navigate = useNavigate()
  const permiso = localStorage.getItem('idUser')

  useEffect(() => {
    if (!permiso) navigate(RUTAS.login)
  }, [])

  return (
    <section className='pagina-chats'>
      <section className='chats-header'>
        <h2>EnContacto</h2>

        <article className='botones-sesion'>
          <Link className='boton' to={RUTAS.login}>Salir</Link>
          { permiso == 'Administrador' &&
            <Link className='boton' to={RUTAS.admin}>Administrar</Link>
          }
        </article>

      </section>
      <section className='pantalla' >
        <ListaSalas />
        <SalaChat />
      </section>
    </section>
  )
}