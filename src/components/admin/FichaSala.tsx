import { useContext, useState } from 'react'
import { UsuarioContext } from '../../context/usuarioContext.tsx'
import './fichaSala.css'

type FichaSalaProps = {
  nombre: string
  listaMiembros?: string[]
  onDelete: () => void
  onQuitarMiembro: (usuarioId: string) => Promise<void> | void
  onAgregarMiembros: (usuarioIds: string[]) => Promise<void> | void
}

export const FichaSala = ({ nombre, listaMiembros = [], onDelete, onQuitarMiembro, onAgregarMiembros }: FichaSalaProps) => {
  const { listaUsuarios } = useContext(UsuarioContext)
  const [expandida, setExpandida] = useState(false)
  const [nuevoMiembro, setNuevoMiembro] = useState('')

  const nombreDe = (id: string) => listaUsuarios?.find(u => u.id === id)?.nombre ?? id
  const candidatos = listaUsuarios?.filter(u => u.id && !listaMiembros.includes(u.id)) ?? []

  function handleAgregar() {
    if (!nuevoMiembro) return
    onAgregarMiembros([nuevoMiembro])
    setNuevoMiembro('')
  }

  return (
    <li className='ficha ficha-sala'>
      <section className='ficha__content'>
        <h4>{nombre}</h4>
        <button type='button' className='boton' onClick={() => setExpandida(v => !v)}>
          Miembros ({listaMiembros.length})
        </button>
      </section>
      <section className='ficha__actions'>
        <button className='boton' onClick={onDelete}>
          Eliminar
        </button>
      </section>
      {expandida && (
        <section className='ficha-sala__miembros'>
          <ul>
            {listaMiembros.map(id => (
              <li key={id} className='ficha-sala__miembro'>
                <span>{nombreDe(id)}</span>
                <button type='button' aria-label={`Sacar a ${nombreDe(id)}`} onClick={() => onQuitarMiembro(id)}>
                  Sacar
                </button>
              </li>
            ))}
            {!listaMiembros.length && <li>Sin miembros</li>}
          </ul>
          <section className='ficha-sala__agregar'>
            <select value={nuevoMiembro} onChange={e => setNuevoMiembro(e.target.value)} aria-label='Agregar miembro'>
              <option value=''>Agregar miembro…</option>
              {candidatos.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
            <button type='button' className='boton' disabled={!nuevoMiembro} onClick={handleAgregar}>
              Agregar
            </button>
          </section>
        </section>
      )}
    </li>
  )
}
