import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { FormAdmin } from '../admin/FormAdmin'

afterEach(cleanup)

describe('FormAdmin', () => {
  it('renderiza legend + inputs + boton "Crear"', () => {
    const onSubmit = vi.fn()
    render(
      <FormAdmin
        legend="Nuevo Usuario"
        onSubmit={onSubmit}
        campos={[
          { placeholder: 'Nombre', value: '', onChange: vi.fn(), required: true },
        ]}
      />
    )
    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })

  it('submit llama onSubmit con los datos del formulario', () => {
    const onSubmit = vi.fn()
    const onChange = vi.fn()

    render(
      <FormAdmin
        legend="Nuevo Usuario"
        onSubmit={onSubmit}
        campos={[
          { placeholder: 'Nombre', value: 'Juan', onChange, required: true },
        ]}
      />
    )

    const input = screen.getByPlaceholderText('Nombre')
    expect(input).toHaveValue('Juan')

    fireEvent.submit(input.closest('form')!)
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('renderiza multiples campos', () => {
    const onSubmit = vi.fn()
    render(
      <FormAdmin
        legend="Formulario"
        onSubmit={onSubmit}
        campos={[
          { placeholder: 'Campo 1', value: '', onChange: vi.fn() },
          { placeholder: 'Campo 2', value: '', onChange: vi.fn() },
        ]}
      />
    )
    expect(screen.getByPlaceholderText('Campo 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Campo 2')).toBeInTheDocument()
  })
})
