import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { Ficha } from '../admin/Ficha'

afterEach(cleanup)

describe('Ficha', () => {
  it('funcionamiento completo', () => {
    const onDelete = vi.fn()

    render(
      <Ficha onDelete={onDelete}>
        <h4>Juan</h4>
      </Ficha>
    )
    expect(screen.getByText('Juan')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onDelete).toHaveBeenCalledOnce()
  })
})
