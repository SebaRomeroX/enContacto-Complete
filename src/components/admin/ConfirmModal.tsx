import './modalSala.css'

type ConfirmModalProps = {
  mensaje: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal = ({ mensaje, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <section className='modal-overlay'>
      <div className='modal' role='alertdialog' aria-label='Confirmar acción'>
        <h3>{mensaje}</h3>
        <section className='modal__acciones'>
          <button type='button' className='boton boton-secundario' onClick={onCancel}>
            Cancelar
          </button>
          <button className='boton boton-eliminar' onClick={onConfirm}>
            Confirmar
          </button>
        </section>
      </div>
    </section>
  )
}
