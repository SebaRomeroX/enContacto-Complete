import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import type { Usuario } from '../../types/types'
import { ModalNuevaSala } from '../admin/ModalNuevaSala'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const usuarios: Usuario[] = [
  { id: 'u1', nombre: 'Ana', foto: 'a.jpg', contra: '777', rol: 'user' },
  { id: 'u2', nombre: 'Beto', foto: 'b.jpg', contra: '777', rol: 'user' },
]

function renderModal(
  onSubmit = vi.fn().mockResolvedValue(undefined),
  onClose = vi.fn()
) {
  render(<ModalNuevaSala usuarios={usuarios} onClose={onClose} onSubmit={onSubmit} />)
  return { onSubmit, onClose }
}

describe('ModalNuevaSala', () => {
  it('renderiza el dialogo con input de nombre y lista de usuarios en columna', () => {
    renderModal()

    expect(screen.getByRole('dialog', { name: 'Nueva Sala' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre de sala')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Ana/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Beto/ })).toBeInTheDocument()
  })

  it('crear llama onSubmit con nombre y miembros elegidos y cierra el modal', async () => {
    const { onSubmit, onClose } = renderModal()

    fireEvent.change(screen.getByLabelText('Nombre de sala'), { target: { value: 'Proyecto X' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /Beto/ }))
    fireEvent.click(screen.getByText('Crear'))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Proyecto X', ['u2']))
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('sin nombre no llama onSubmit', () => {
    const { onSubmit } = renderModal()

    fireEvent.click(screen.getByText('Crear'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('si falla muestra el error dentro del modal y no lo cierra', async () => {
    const onClose = vi.fn()
    render(<ModalNuevaSala
      usuarios={usuarios}
      onClose={onClose}
      onSubmit={vi.fn().mockResolvedValue('No se pudo crear la sala')}
    />)

    fireEvent.change(screen.getByLabelText('Nombre de sala'), { target: { value: 'Proyecto X' } })
    fireEvent.click(screen.getByText('Crear'))

    expect(await screen.findByText('No se pudo crear la sala')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('cancelar cierra sin llamar onSubmit', () => {
    const { onSubmit, onClose } = renderModal()

    fireEvent.click(screen.getByText('Cancelar'))

    expect(onClose).toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
