import './pagChats.css'
import { ListaSalas } from './ListaSalas'
import { SalaChat } from './sala/SalaChat'
import { Link, useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { useContext, useEffect } from 'react'
import { UsuarioContext } from '../../context/usuarioContext.tsx'
import { SalasContext } from '../../context/salasContext.tsx'


export const PaginaChats = () => {
  const navigate = useNavigate()
  const { usuario } = useContext(UsuarioContext)
  const { asignarSala } = useContext(SalasContext)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) navigate(RUTAS.login)
    return () => asignarSala(undefined)
  }, [token, navigate])

  return (
    <section className='pagina-chats'>
      <section className='chats-header'>
        <h2>EnContacto</h2>

        <article className='botones-sesion'>
          <Link className='boton' to={RUTAS.login}>Salir</Link>
          { usuario?.rol === 'admin' &&
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