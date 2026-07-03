import './pagAdmin.css'
import { useContext, useEffect, useState, type FormEvent } from "react"
import { UsuarioContext } from "../../context/usuarioContext.tsx"
import { Link, useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { Ficha } from './Ficha'
import { FormAdmin } from './FormAdmin'
import { SalasContext } from '../../context/salasContext.tsx'
import { PantallaLoading } from '../PantallaLoading'

export const PagAdmin = () => {
  const { salas, crearSala, eliminarSala } = useContext(SalasContext)
  const { listaUsuarios, usuario, eliminarUsuario, crearUsuario, isLoading: usersLoading } = useContext(UsuarioContext)
  const { isLoading: salasLoading } = useContext(SalasContext)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const loading = token && (usersLoading || salasLoading)

  const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState('')
  const [nuevoNombreSala, setNuevoNombreSala] = useState('')

  useEffect(() => {
    if (!token) {
      navigate(RUTAS.login)
      return
    }
    if (usuario && usuario.rol !== 'admin') {
      navigate(RUTAS.login)
    }
  }, [usuario, navigate])

  function handleCrearUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nuevoNombreUsuario) return
    crearUsuario(nuevoNombreUsuario, 'no-foto.png')
    setNuevoNombreUsuario('')
  }

  function handleCrearSala(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nuevoNombreSala) return
    crearSala(nuevoNombreSala)
    setNuevoNombreSala('')
  }

  if (loading) return <PantallaLoading isLoading={loading} />

  return (
    <section className='admin-page fade-in'>
      <section className='admin-header'>
        <h2>Administrador</h2>
        <Link className='boton' to={RUTAS.chat}>Volver a salas</Link>
      </section>
      <section>
        <ul className='lista-admin'>
          <h3>Usuarios</h3>
          {listaUsuarios?.map(u =>
            u.rol !== 'admin' && (
              <Ficha
                key={u.id}
                onDelete={() => u.id && eliminarUsuario(u.id)}
              >
                <img src={u.foto} />
                <h4>{u.nombre}</h4>
              </Ficha>
            )
          )}
        </ul>
        <FormAdmin
          legend="Nuevo Usuario"
          onSubmit={handleCrearUsuario}
          campos={[
            {
              placeholder: 'Nombre de usuario',
              value: nuevoNombreUsuario,
              onChange: setNuevoNombreUsuario,
              required: true 
            },
          ]}
        />
      </section>
      <section>
        <ul className='lista-admin'>
          <h3>Salas</h3>
          {salas?.map(s =>
            s.id && (
              <Ficha key={s.id} onDelete={() => eliminarSala(s.id)}>
                <h4>{s.nombre}</h4>
              </Ficha>
            )
          )}
        </ul>
        <FormAdmin
          legend="Nueva Sala"
          onSubmit={handleCrearSala}
          campos={[
            {
              placeholder: 'Nombre de sala',
              value: nuevoNombreSala,
              onChange: setNuevoNombreSala,
              required: true 
            },
          ]}
        />
      </section>
    </section>
  )
}
