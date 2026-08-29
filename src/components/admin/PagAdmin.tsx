import './pagAdmin.css'
import { useContext, useEffect, useState, type FormEvent } from "react"
import { UsuarioContext } from "../../context/usuarioContext.tsx"
import { useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { Ficha } from './Ficha'
import { FichaSala } from './FichaSala'
import { FormAdmin } from './FormAdmin'
import { ModalSala } from './ModalSala'
import { SalasContext } from '../../context/salasContext.tsx'
import { PantallaLoading } from '../PantallaLoading'
import { Cargando } from '../Cargando'
import { Header } from '../Header'
import { ConfirmModal } from './ConfirmModal'

function mensajeDeError(err: unknown): string | undefined {
  const response = (err as { response?: { status?: number, data?: { detalles?: unknown, error?: string } } })?.response
  if (!response) return undefined
  if (response.status === 403) return 'No tenes permisos para realizar esta accion'
  if (response.status === 429) return 'Demasiadas acciones seguidas, espera un momento e intenta de nuevo'
  if (response.status === 400) {
    if (typeof response.data?.detalles === 'string') return response.data.detalles
    if (typeof response.data?.error === 'string') return response.data.error
  }
  return undefined
}

export const PagAdmin = () => {
  const { salas, crearSala, eliminarSala, agregarMiembros, quitarMiembro, cambiarNombre, vaciarChat } = useContext(SalasContext)
  const { listaUsuarios, usuario, eliminarUsuario, crearUsuario, isLoading: usersLoading } = useContext(UsuarioContext)
  const { isLoading: salasLoading } = useContext(SalasContext)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const loading = token && (usersLoading || salasLoading)

  const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState('')
  const [modalNuevaSala, setModalNuevaSala] = useState(false)
  const [error, setError] = useState('')
  const [confirmarEliminarUsuario, setConfirmarEliminarUsuario] = useState<string | null>(null)
  const [confirmarEliminarSala, setConfirmarEliminarSala] = useState<string | null>(null)
  const [confirmarVaciarChat, setConfirmarVaciarChat] = useState<string | null>(null)

  const usuariosNoAdmin = listaUsuarios?.filter(u => u.rol !== 'admin' && u.id) ?? []

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
      await crearUsuario(nuevoNombreUsuario)
      setError('')
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo crear el usuario')
    }
    setNuevoNombreUsuario('')
  }

  async function handleCrearSala(nombre: string, listaMiembros: string[]): Promise<string | undefined> {
    try {
      await crearSala(nombre, listaMiembros)
      return undefined
    } catch (err) {
      return mensajeDeError(err) ?? 'No se pudo crear la sala'
    }
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

  async function handleAgregarMiembro(salaId: string, usuarioIds: string[]): Promise<string | undefined> {
    try {
      await agregarMiembros(salaId, usuarioIds)
      return undefined
    } catch (err) {
      return mensajeDeError(err) ?? 'No se pudo agregar el miembro'
    }
  }

  async function handleQuitarMiembro(salaId: string, usuarioId: string): Promise<string | undefined> {
    try {
      await quitarMiembro(salaId, usuarioId)
      return undefined
    } catch (err) {
      return mensajeDeError(err) ?? 'No se pudo quitar el miembro'
    }
  }

  async function handleCambiarNombre(salaId: string, nuevoNombre: string): Promise<string | undefined> {
    try {
      await cambiarNombre(salaId, nuevoNombre)
      return undefined
    } catch (err) {
      return mensajeDeError(err) ?? 'No se pudo cambiar el nombre'
    }
  }

  async function handleVaciarChat(salaId: string): Promise<string | undefined> {
    try {
      await vaciarChat(salaId)
      return undefined
    } catch (err) {
      return mensajeDeError(err) ?? 'No se pudo vaciar el chat'
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
          {usersLoading && !listaUsuarios?.length && <Cargando />}
          {listaUsuarios?.map(u =>
            u.rol !== 'admin' && (
              <Ficha
                key={u.id}
                onDelete={() => u.id && setConfirmarEliminarUsuario(u.id)}
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
          {salasLoading && !salas?.length && <Cargando />}
          {salas?.map(s =>
            s.id && (
              <FichaSala
                key={s.id}
                nombre={s.nombre}
                listaMiembros={s.listaMiembros}
                onDelete={() => setConfirmarEliminarSala(s.id!)}
                onAgregarMiembros={ids => handleAgregarMiembro(s.id!, ids)}
                onQuitarMiembro={uid => handleQuitarMiembro(s.id!, uid)}
                onCambiarNombre={nombre => handleCambiarNombre(s.id!, nombre)}
                onVaciarChat={() => setConfirmarVaciarChat(s.id!)}
              />
            )
          )}
        </ul>
        <button className='boton boton-nueva-sala' onClick={() => setModalNuevaSala(true)}>
          Nueva Sala
        </button>
        {modalNuevaSala && (
          <ModalSala
            modo='crear'
            usuarios={usuariosNoAdmin}
            onClose={() => setModalNuevaSala(false)}
            onSubmit={handleCrearSala}
          />
        )}
      </section>
      {confirmarEliminarUsuario && (
        <ConfirmModal
          mensaje='¿Estás seguro que deseas eliminar este usuario?'
          onConfirm={() => {
            handleEliminarUsuario(confirmarEliminarUsuario)
            setConfirmarEliminarUsuario(null)
          }}
          onCancel={() => setConfirmarEliminarUsuario(null)}
        />
      )}
      {confirmarEliminarSala && (
        <ConfirmModal
          mensaje='¿Estás seguro que deseas eliminar esta sala?'
          onConfirm={() => {
            handleEliminarSala(confirmarEliminarSala)
            setConfirmarEliminarSala(null)
          }}
          onCancel={() => setConfirmarEliminarSala(null)}
        />
      )}
      {confirmarVaciarChat && (
        <ConfirmModal
          mensaje='¿Estás seguro que deseas vaciar el chat de esta sala?'
          onConfirm={() => {
            handleVaciarChat(confirmarVaciarChat)
            setConfirmarVaciarChat(null)
          }}
          onCancel={() => setConfirmarVaciarChat(null)}
        />
      )}
    </section>
  )
}
