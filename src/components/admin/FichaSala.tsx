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
}

export const FichaSala = ({ nombre, listaMiembros = [], onDelete, onQuitarMiembro, onAgregarMiembros }: FichaSalaProps) => {
  const { listaUsuarios } = useContext(UsuarioContext)
  const [modalMiembros, setModalMiembros] = useState(false)

  async function handleGuardar(seleccionados: string[]): Promise<string | undefined> {
    const visibles = new Set(listaUsuarios?.filter(u => u.id).map(u => u.id))
    const aQuitar = listaMiembros.filter(id => visibles.has(id) && !seleccionados.includes(id))
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
        <button type='button' className='boton' onClick={() => setModalMiembros(true)}>
          Miembros ({listaMiembros.length})
        </button>
      </section>
      <section className='ficha__actions'>
        <button className='boton' onClick={onDelete}>
          Eliminar
        </button>
      </section>
      {modalMiembros && (
        <ModalSala
          modo='miembros'
          nombreInicial={nombre}
          usuarios={listaUsuarios ?? []}
          seleccionadosIniciales={listaMiembros}
          onClose={() => setModalMiembros(false)}
          onSubmit={(_nombre, seleccionados) => handleGuardar(seleccionados)}
        />
      )}
    </li>
  )
}
