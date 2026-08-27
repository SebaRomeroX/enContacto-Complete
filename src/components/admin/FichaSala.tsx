import { useContext, useState } from 'react'
import { UsuarioContext } from '../../context/usuarioContext.tsx'
import { ModalSala } from './ModalSala'
import './fichaSala.css'

type FichaSalaProps = {
  nombre: string
  listaMiembros?: string[]
  onDelete: () => void
  onQuitarMiembro: (usuarioId: string) => Promise<string | undefined>
  onAgregarMiembros: (usuarioIds: string[]) => Promise<string | undefined>
  onCambiarNombre: (nuevoNombre: string) => Promise<string | undefined>
  onVaciarChat: () => Promise<string | undefined>
}

export const FichaSala = ({ nombre, listaMiembros = [], onDelete, onQuitarMiembro, onAgregarMiembros, onCambiarNombre, onVaciarChat }: FichaSalaProps) => {
  const { listaUsuarios } = useContext(UsuarioContext)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalMiembros, setModalMiembros] = useState(false)
  const [modalNombre, setModalNombre] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState(nombre)
  const [errorNombre, setErrorNombre] = useState('')

  // El admin es miembro implicito de todas las salas: no se cuenta, no se muestra y no puede ser expulsado
  const usuariosGestionables = listaUsuarios?.filter(u => u.id && u.rol !== 'admin') ?? []
  const idsAdmin = new Set(listaUsuarios?.filter(u => u.rol === 'admin' && u.id).map(u => u.id))
  const miembrosVisibles = listaMiembros.filter(id => !idsAdmin.has(id))

  async function handleGuardar(seleccionados: string[]): Promise<string | undefined> {
    const gestionables = new Set(usuariosGestionables.map(u => u.id))
    const aQuitar = listaMiembros.filter(id => gestionables.has(id) && !seleccionados.includes(id))
    const aAgregar = seleccionados.filter(id => !listaMiembros.includes(id))

    for (const id of aQuitar) {
      const errorMsg = await onQuitarMiembro(id)
      if (errorMsg) return errorMsg
    }
    if (aAgregar.length) {
      const errorMsg = await onAgregarMiembros(aAgregar)
      if (errorMsg) return errorMsg
    }
    return undefined
  }

  return (
    <li className='ficha ficha-sala'>
      <section className='ficha__content'>
        <h4>{nombre}</h4>
        <span className='ficha-sala__miembros'>Miembros ({miembrosVisibles.length})</span>
      </section>
      <section className='ficha__actions'>
        <button className='boton' onClick={() => setModalEditar(true)}>
          Editar
        </button>
      </section>
      {modalEditar && (
        <section className='modal-overlay'>
          <div className='modal' role='dialog' aria-label={`Editar ${nombre}`}>
            <h3>Editar - {nombre}</h3>
            <section className='modal__acciones'>
              <button className='boton' onClick={() => { setModalEditar(false); setModalMiembros(true) }}>
                Miembros ({miembrosVisibles.length})
              </button>
              <button className='boton' onClick={() => { setModalEditar(false); setNuevoNombre(nombre); setModalNombre(true) }}>
                Cambiar nombre
              </button>
              <button className='boton boton-eliminar' onClick={() => { setModalEditar(false); onVaciarChat() }}>
                Vaciar chat
              </button>
              <button className='boton boton-eliminar' onClick={() => { setModalEditar(false); onDelete() }}>
                Eliminar
              </button>
              <button type='button' className='boton boton-secundario' onClick={() => setModalEditar(false)}>
                Cancelar
              </button>
            </section>
          </div>
        </section>
      )}
      {modalMiembros && (
        <ModalSala
          modo='miembros'
          nombreInicial={nombre}
          usuarios={usuariosGestionables}
          seleccionadosIniciales={miembrosVisibles}
          onClose={() => setModalMiembros(false)}
          onSubmit={(_nombre, seleccionados) => handleGuardar(seleccionados)}
        />
      )}
      {modalNombre && (
        <section className='modal-overlay'>
          <form
            className='modal'
            role='dialog'
            aria-label='Cambiar nombre de sala'
            onSubmit={async (e) => {
              e.preventDefault()
              if (!nuevoNombre.trim()) return
              setErrorNombre('')
              const errorMsg = await onCambiarNombre(nuevoNombre.trim())
              if (errorMsg) setErrorNombre(errorMsg)
              else setModalNombre(false)
            }}
          >
            <h3>Cambiar nombre</h3>
            <input
              className='input-texto'
              placeholder='Nombre de sala'
              aria-label='Nombre de sala'
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              required
            />
            {errorNombre && <p className='error-msg'>{errorNombre}</p>}
            <section className='modal__acciones'>
              <button type='button' className='boton boton-secundario' onClick={() => setModalNombre(false)}>
                Cancelar
              </button>
              <button className='boton'>Guardar</button>
            </section>
          </form>
        </section>
      )}
    </li>
  )
}
