import './header.css'
import { Link, useLocation } from 'react-router'
import { RUTAS } from '../constants/rutas'
import { useContext } from 'react'
import { UsuarioContext } from '../context/usuarioContext.tsx'

export const Header = () => {
  const { usuario } = useContext(UsuarioContext)
  const location = useLocation()
  const esAdmin = location.pathname === RUTAS.admin

  return (
    <section className='header'>
      <h2>enContacto</h2>
      {usuario && (
        <article className='botones-sesion'>
          {esAdmin ? (
            <Link className='boton' to={RUTAS.chat}>Volver a salas</Link>
          ) : (
            usuario?.rol === 'admin' && (
              <Link className='boton' to={RUTAS.admin}>Administrar</Link>
            )
          )}
          <Link className='boton' to={RUTAS.login}>Salir</Link>
        </article>
      )}
    </section>
  )
}
