import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { SalasContext, type SalaContextType } from '../../context/salasContext'
import { ListaSalas } from '../chat/ListaSalas'

afterEach(cleanup)

const salasMock = [
  { id: 's1', nombre: 'General' },
  { id: 's2', nombre: 'Random' },
]

const salasContextValue: SalaContextType = {
  listaMensajes: [],
  salaActiva: undefined,
  salas: salasMock,
  agregarMensaje: vi.fn().mockResolvedValue(true),
  actualizarMsjs: vi.fn(),
  asignarSala: vi.fn(),
  eliminarSala: vi.fn(),
  crearSala: vi.fn(),
  vaciarChat: vi.fn(),
  cambiarNombre: vi.fn(),
  isLoading: false,
}

function renderListaSalas(overrides?: Partial<SalaContextType>) {
  return render(
    <SalasContext.Provider value={{ ...salasContextValue, ...overrides }}>
      <ListaSalas />
    </SalasContext.Provider>
  )
}

describe('ListaSalas', () => {
  it('renderiza lista de salas', () => {
    renderListaSalas()
    expect(screen.getByText('Salas')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Random')).toBeInTheDocument()
  })

  it('click en sala llama asignarSala con el id', () => {
    const asignarSala = vi.fn()
    renderListaSalas({ asignarSala })
    fireEvent.click(screen.getByText('General'))
    expect(asignarSala).toHaveBeenCalledWith('s1')
  })

  it('no renderiza nada si salas es undefined', () => {
    renderListaSalas({ salas: undefined })
    expect(screen.queryByText('General')).not.toBeInTheDocument()
  })
})
