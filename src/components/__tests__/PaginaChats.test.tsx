import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router'
import { UsuarioContext } from '../../context/usuarioContext'
import { SalasContext, type SalaContextType } from '../../context/salasContext'
import type { Usuario } from '../../types/types'
import { PaginaChats } from '../chat/PaginaChats'

const mockNavigate = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const usuarioMock: Usuario = { id: '1', nombre: 'Admin', foto: 'a.jpg', contra: '777', rol: 'admin' }

const salasContextValue: SalaContextType = {
  listaMensajes: [],
  salaActiva: undefined,
  salas: [{ id: 's1', nombre: 'General' }],
  agregarMensaje: vi.fn(),
  actualizarMsjs: vi.fn(),
  asignarSala: vi.fn(),
  eliminarSala: vi.fn(),
  crearSala: vi.fn(),
  vaciarChat: vi.fn(),
  cambiarNombre: vi.fn(),
  isLoading: false,
}

const usuarioContextValue = {
  usuario: usuarioMock,
  listaUsuarios: [usuarioMock],
  crearUsuario: vi.fn(),
  eliminarUsuario: vi.fn(),
  logear: vi.fn(),
  cerrarSesion: vi.fn(),
  isLoading: false,
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorage.clear()
})

function renderPaginaChats() {
  return render(
    <MemoryRouter>
      <UsuarioContext.Provider value={usuarioContextValue}>
        <SalasContext.Provider value={salasContextValue}>
          <PaginaChats />
        </SalasContext.Provider>
      </UsuarioContext.Provider>
    </MemoryRouter>
  )
}

describe('PaginaChats', () => {
  it('sin token: redirige a /login', () => {
    localStorage.removeItem('token')
    renderPaginaChats()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('con token: renderiza Header + ListaSalas + SalaChat', () => {
    localStorage.setItem('token', 'abc123')
    renderPaginaChats()
    expect(screen.getByText('enContacto')).toBeInTheDocument()
    expect(screen.getByText('Salas')).toBeInTheDocument()
    expect(screen.getByText('Elige un sala')).toBeInTheDocument()
  })

  it('al desmontar: llama asignarSala(undefined)', () => {
    localStorage.setItem('token', 'abc123')
    const { unmount } = renderPaginaChats()
    unmount()
    expect(salasContextValue.asignarSala).toHaveBeenCalledWith(undefined)
  })
})
