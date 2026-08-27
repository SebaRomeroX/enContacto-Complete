import './header.css'
import { Link, useLocation, useNavigate } from 'react-router'
import { RUTAS } from '../constants/rutas'
import { useContext, useEffect, useRef, useState } from 'react'
import { UsuarioContext } from '../context/usuarioContext.tsx'

export const Header = () => {
  const { usuario, cerrarSesion } = useContext(UsuarioContext)
  const location = useLocation()
  const navigate = useNavigate()
  const esAdmin = location.pathname === RUTAS.admin
  const [dropdownAbierto, setDropdownAbierto] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSalir = () => {
    setDropdownAbierto(false)
    cerrarSesion()
    navigate(RUTAS.login)
  }

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
          <div className='dropdown-container' ref={dropdownRef}>
            <button
              className='dropdown-trigger'
              onClick={() => setDropdownAbierto(!dropdownAbierto)}
              aria-label='Menú de usuario'
              aria-expanded={dropdownAbierto}
            >
              <img className='dropdown-foto' src={usuario.foto} alt={usuario.nombre} />
            </button>
            {dropdownAbierto && (
              <div className='dropdown-menu'>
                <div className='dropdown-header'>
                  <img className='dropdown-header-foto' src={usuario.foto} alt={usuario.nombre} />
                  <span className='dropdown-nombre'>{usuario.nombre}</span>
                </div>
                <hr className='dropdown-separador' />
                <button className='dropdown-item' disabled>
                  Editar perfil
                </button>
                <button className='dropdown-item dropdown-item-salir' onClick={handleSalir}>
                  Salir
                </button>
              </div>
            )}
          </div>
        </article>
      )}
    </section>
  )
}
