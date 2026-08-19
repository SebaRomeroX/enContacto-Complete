import './pagAdmin.css'
import { useContext, useEffect, useState, type FormEvent } from "react"
import { UsuarioContext } from "../../context/usuarioContext.tsx"
import { useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { Ficha } from './Ficha'
import { FormAdmin } from './FormAdmin'
import { SalasContext } from '../../context/salasContext.tsx'
import { PantallaLoading } from '../PantallaLoading'
import { Header } from '../Header'

function mensajeDeError(err: unknown): string | undefined {
  const response = (err as { response?: { status?: number, data?: { detalles?: unknown, error?: string } } })?.response
  if (!response) return undefined
  if (response.status === 403) return 'No tenes permisos para realizar esta accion'
  if (response.status === 400) {
    if (typeof response.data?.detalles === 'string') return response.data.detalles
    if (typeof response.data?.error === 'string') return response.data.error
  }
  return undefined
}

export const PagAdmin = () => {
  const { salas, crearSala, eliminarSala } = useContext(SalasContext)
  const { listaUsuarios, usuario, eliminarUsuario, crearUsuario, isLoading: usersLoading } = useContext(UsuarioContext)
  const { isLoading: salasLoading } = useContext(SalasContext)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const loading = token && (usersLoading || salasLoading)

  const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState('')
  const [nuevoNombreSala, setNuevoNombreSala] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate(RUTAS.login)
      return
    }
    if (usuario && usuario.rol !== 'admin') {
      navigate(RUTAS.login)
    }
  }, [usuario, navigate])

  async function handleCrearUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nuevoNombreUsuario) return
    try {
      await crearUsuario(nuevoNombreUsuario, 'no-foto.png')
      setError('')
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo crear el usuario')
    }
    setNuevoNombreUsuario('')
  }

  async function handleCrearSala(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nuevoNombreSala) return
    try {
      await crearSala(nuevoNombreSala)
      setError('')
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo crear la sala')
    }
    setNuevoNombreSala('')
  }

  async function handleEliminarUsuario(id: string) {
    try {
      await eliminarUsuario(id)
      setError('')
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo eliminar el usuario')
    }
  }

  async function handleEliminarSala(id: string) {
    try {
      await eliminarSala(id)
      setError('')
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo eliminar la sala')
    }
  }

  if (loading) return <PantallaLoading isLoading={loading} />

  return (
    <section className='admin-page fade-in'>
      <Header />
      {error && <p className='error-msg'>{error}</p>}
      <section>
        <ul className='lista-admin'>
          <h3>Usuarios</h3>
          {listaUsuarios?.map(u =>
            u.rol !== 'admin' && (
              <Ficha
                key={u.id}
                onDelete={() => u.id && handleEliminarUsuario(u.id)}
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
              <Ficha key={s.id} onDelete={() => handleEliminarSala(s.id)}>
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
