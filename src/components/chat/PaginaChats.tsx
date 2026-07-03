import './paginaChats.css'
import { ListaSalas } from './ListaSalas'
import { SalaChat } from './sala/SalaChat'
import { Link, useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { useContext, useEffect } from 'react'
import { UsuarioContext } from '../../context/usuarioContext.tsx'
import { SalasContext } from '../../context/salasContext.tsx'
import { PantallaLoading } from '../PantallaLoading'


export const PaginaChats = () => {
  const navigate = useNavigate()
  const { usuario, isLoading: usersLoading } = useContext(UsuarioContext)
  const { asignarSala, isLoading: salasLoading } = useContext(SalasContext)
  const token = localStorage.getItem('token')

  const loading = token && (usersLoading || salasLoading)

  useEffect(() => {
    if (!token) navigate(RUTAS.login)
    return () => asignarSala(undefined)
  }, [token, navigate])

  if (loading) return <PantallaLoading isLoading={loading} />

  return (
    <section className='pagina-chats fade-in'>
      <section className='chats-header'>
        <h2>enContacto</h2>

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