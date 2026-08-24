import { useState, type FormEvent } from 'react'
import type { Usuario } from '../../types/types'
import { SelectorUsuarios } from './SelectorUsuarios'
import './modalNuevaSala.css'

type ModalNuevaSalaProps = {
  usuarios: Usuario[]
  onClose: () => void
  onSubmit: (nombre: string, listaMiembros: string[]) => Promise<string | undefined>
}

export const ModalNuevaSala = ({ usuarios, onClose, onSubmit }: ModalNuevaSalaProps) => {
  const [nombre, setNombre] = useState('')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [error, setError] = useState('')

  function toggleMiembro(id: string) {
    setSeleccionados(prev => (
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ))
  }

  async function handleCrear(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nombre) return
    setError('')
    const errorMsg = await onSubmit(nombre, seleccionados)
    if (errorMsg) setError(errorMsg)
    else onClose()
  }

  return (
    <section className='modal-overlay'>
      <form className='modal' role='dialog' aria-label='Nueva Sala' onSubmit={handleCrear}>
        <h3>Nueva Sala</h3>
        <input
          className='input-texto'
          placeholder='Nombre de sala'
          aria-label='Nombre de sala'
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <section className='modal__miembros'>
          <SelectorUsuarios
            usuarios={usuarios}
            seleccionados={seleccionados}
            onToggle={toggleMiembro}
          />
        </section>
        {error && <p className='error-msg'>{error}</p>}
        <section className='modal__acciones'>
          <button type='button' className='boton boton-secundario' onClick={onClose}>
            Cancelar
          </button>
          <button className='boton'>Crear</button>
        </section>
      </form>
    </section>
  )
}
