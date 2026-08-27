import './header.css'
import '../components/admin/modalSala.css'
import { Link, useLocation, useNavigate } from 'react-router'
import { RUTAS } from '../constants/rutas'
import { useContext, useEffect, useRef, useState } from 'react'
import { UsuarioContext } from '../context/usuarioContext.tsx'

export const Header = () => {
  const { usuario, cerrarSesion, actualizarUsuario } = useContext(UsuarioContext)
  const location = useLocation()
  const navigate = useNavigate()
  const esAdmin = location.pathname === RUTAS.admin
  const [dropdownAbierto, setDropdownAbierto] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [modalPerfil, setModalPerfil] = useState(false)
  const [modalFoto, setModalFoto] = useState(false)
  const [modalContrasena, setModalContrasena] = useState(false)

  const [nuevaFoto, setNuevaFoto] = useState('')
  const [contraActual, setContraActual] = useState('')
  const [nuevaContra, setNuevaContra] = useState('')
  const [errorFoto, setErrorFoto] = useState('')
  const [errorContrasena, setErrorContrasena] = useState('')
  const [guardando, setGuardando] = useState(false)

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

  const abrirModalPerfil = () => {
    setDropdownAbierto(false)
    setModalPerfil(true)
  }

  const cerrarModalPerfil = () => {
    setModalPerfil(false)
    setErrorFoto('')
    setErrorContrasena('')
  }

  const abrirModalFoto = () => {
    setModalPerfil(false)
    setModalFoto(true)
  }

  const cerrarModalFoto = () => {
    setModalFoto(false)
    setNuevaFoto('')
    setErrorFoto('')
  }

  const abrirModalContrasena = () => {
    setModalPerfil(false)
    setModalContrasena(true)
  }

  const cerrarModalContrasena = () => {
    setModalContrasena(false)
    setContraActual('')
    setNuevaContra('')
    setErrorContrasena('')
  }

  const handleGuardarFoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevaFoto.trim()) {
      setErrorFoto('La URL de la foto no puede estar vacía')
      return
    }
    if (!usuario?.id) return

    setGuardando(true)
    setErrorFoto('')
    try {
      await actualizarUsuario(usuario.id, { foto: nuevaFoto.trim() })
      cerrarModalFoto()
    } catch {
      setErrorFoto('Error al actualizar la foto')
    } finally {
      setGuardando(false)
    }
  }

  const handleGuardarContrasena = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contraActual) {
      setErrorContrasena('Ingresa tu contraseña actual')
      return
    }
    if (nuevaContra.length < 6) {
      setErrorContrasena('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!usuario?.id) return

    setGuardando(true)
    setErrorContrasena('')
    try {
      await actualizarUsuario(usuario.id, { contra: nuevaContra, contraActual })
      cerrarModalContrasena()
    } catch (err) {
      const msg = (err as { response?: { data?: { detalles?: string[] } } })?.response?.data?.detalles?.[0]
      setErrorContrasena(msg || 'Error al actualizar la contraseña')
    } finally {
      setGuardando(false)
    }
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
                <button className='dropdown-item' onClick={abrirModalPerfil}>
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

      {modalPerfil && (
        <section className='modal-overlay'>
          <div className='modal' role='dialog' aria-label='Editar perfil'>
            <h3>Editar perfil</h3>
            {usuario.rol !== 'admin' && (
              <button className='boton' onClick={abrirModalFoto}>Cambiar Foto de perfil</button>
            )}
            <button className='boton' onClick={abrirModalContrasena}>Cambiar Contraseña</button>
            <section className='modal__acciones'>
              <button className='boton boton-secundario' onClick={cerrarModalPerfil}>Cancelar</button>
            </section>
          </div>
        </section>
      )}

      {modalFoto && (
        <section className='modal-overlay'>
          <form className='modal' role='dialog' aria-label='Cambiar foto de perfil' onSubmit={handleGuardarFoto}>
            <h3>Cambiar foto de perfil</h3>
            <input
              type='text'
              className='input-texto'
              placeholder='URL de la nueva foto'
              value={nuevaFoto}
              onChange={e => setNuevaFoto(e.target.value)}
            />
            {errorFoto && <p className='error-msg'>{errorFoto}</p>}
            <section className='modal__acciones'>
              <button type='button' className='boton boton-secundario' onClick={cerrarModalFoto}>Cancelar</button>
              <button type='submit' className='boton' disabled={guardando}>Guardar</button>
            </section>
          </form>
        </section>
      )}

      {modalContrasena && (
        <section className='modal-overlay'>
          <form className='modal' role='dialog' aria-label='Cambiar contraseña' onSubmit={handleGuardarContrasena}>
            <h3>Cambiar contraseña</h3>
            <input
              type='password'
              className='input-texto'
              placeholder='Contraseña actual'
              value={contraActual}
              onChange={e => setContraActual(e.target.value)}
            />
            <input
              type='password'
              className='input-texto'
              placeholder='Nueva contraseña (mín. 6 caracteres)'
              value={nuevaContra}
              onChange={e => setNuevaContra(e.target.value)}
            />
            {errorContrasena && <p className='error-msg'>{errorContrasena}</p>}
            <section className='modal__acciones'>
              <button type='button' className='boton boton-secundario' onClick={cerrarModalContrasena}>Cancelar</button>
              <button type='submit' className='boton' disabled={guardando}>Guardar</button>
            </section>
          </form>
        </section>
      )}
    </section>
  )
}
