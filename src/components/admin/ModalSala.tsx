import { useState, type FormEvent } from 'react'
import type { Usuario } from '../../types/types'
import { SelectorUsuarios } from './SelectorUsuarios'
import './modalSala.css'

type ModalSalaProps = {
  modo: 'crear' | 'miembros'
  usuarios: Usuario[]
  onClose: () => void
  onSubmit: (nombre: string, seleccionados: string[]) => Promise<string | undefined>
  nombreInicial?: string
  seleccionadosIniciales?: string[]
}

export const ModalSala = ({ modo, usuarios, onClose, onSubmit, nombreInicial = '', seleccionadosIniciales = [] }: ModalSalaProps) => {
  const esCrear = modo === 'crear'
  const [nombre, setNombre] = useState(esCrear ? '' : nombreInicial)
  const [seleccionados, setSeleccionados] = useState<string[]>(seleccionadosIniciales)
  const [error, setError] = useState('')

  function toggleMiembro(id: string) {
    setSeleccionados(prev => (
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (esCrear && !nombre) return
    setError('')
    const errorMsg = await onSubmit(nombre, seleccionados)
    if (errorMsg) setError(errorMsg)
    else onClose()
  }

  return (
    <section className='modal-overlay'>
      <form
        className='modal'
        role='dialog'
        aria-label={esCrear ? 'Nueva Sala' : `Miembros de ${nombreInicial}`}
        onSubmit={handleSubmit}
      >
        <h3>{esCrear ? 'Nueva Sala' : `Miembros de ${nombreInicial}`}</h3>
        {esCrear && (
          <input
            className='input-texto'
            placeholder='Nombre de sala'
            aria-label='Nombre de sala'
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        )}
        <section className='modal__miembros'>
          <SelectorUsuarios
            usuarios={usuarios}
            seleccionados={seleccionados}
            onToggle={toggleMiembro}
            legend={esCrear ? undefined : 'Miembros'}
          />
        </section>
        {error && <p className='error-msg'>{error}</p>}
        <section className='modal__acciones'>
          <button type='button' className='boton boton-secundario' onClick={onClose}>
            Cancelar
          </button>
          <button className='boton'>{esCrear ? 'Crear' : 'Guardar'}</button>
        </section>
      </form>
    </section>
  )
}
