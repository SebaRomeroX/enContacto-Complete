import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router'
import { UsuarioContext } from '../../context/usuarioContext'
import { SalasContext, type SalaContextType } from '../../context/salasContext'
import type { Usuario, Sala } from '../../types/types.d'
import { PagAdmin } from '../admin/PagAdmin'

const mockNavigate = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const usuarioAdmin: Usuario = { id: '1', nombre: 'Admin', foto: 'a.jpg', contra: '777', rol: 'admin' }
const usuarioUser: Usuario = { id: '2', nombre: 'User', foto: 'b.jpg', contra: '123', rol: 'user' }
const listaUsuarios: Usuario[] = [usuarioAdmin, usuarioUser]
const salasMock: Sala[] = [{ id: 's1', nombre: 'General' }]

const salasContextValue: SalaContextType = {
  listaMensajes: [],
  salaActiva: undefined,
  salas: salasMock,
  agregarMensaje: vi.fn(),
  actualizarMsjs: vi.fn(),
  asignarSala: vi.fn(),
  eliminarSala: vi.fn(),
  crearSala: vi.fn(),
  vaciarChat: vi.fn(),
  cambiarNombre: vi.fn(),
  isLoading: false,
}

const usuarioCtxValue = {
  usuario: usuarioAdmin,
  listaUsuarios,
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

function renderPagAdmin(
  overridesUsuario?: Partial<typeof usuarioCtxValue>,
  overridesSalas?: Partial<SalaContextType>
) {
  return render(
    <MemoryRouter>
      <UsuarioContext.Provider value={{ ...usuarioCtxValue, ...overridesUsuario }}>
        <SalasContext.Provider value={{ ...salasContextValue, ...overridesSalas }}>
          <PagAdmin />
        </SalasContext.Provider>
      </UsuarioContext.Provider>
    </MemoryRouter>
  )
}

describe('PagAdmin', () => {
  it('sin token: redirige a /login', () => {
    localStorage.removeItem('token')
    renderPagAdmin()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('con token pero rol user: redirige a /login', () => {
    localStorage.setItem('token', 'abc')
    renderPagAdmin({ usuario: usuarioUser })
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('con token admin: renderiza listas de usuarios y salas + formularios', () => {
    localStorage.setItem('token', 'abc')
    renderPagAdmin()

    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Salas')).toBeInTheDocument()

    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()

    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
    expect(screen.getByText('Nueva Sala')).toBeInTheDocument()

    expect(screen.getAllByText('Crear')).toHaveLength(2)
    expect(screen.getAllByText('Eliminar')).toHaveLength(2)

    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('admin puede eliminar usuario', () => {
    localStorage.setItem('token', 'abc')
    const eliminarUsuario = vi.fn()
    renderPagAdmin({ eliminarUsuario })

    const deleteBtns = screen.getAllByText('Eliminar')
    fireEvent.click(deleteBtns[0])

    expect(eliminarUsuario).toHaveBeenCalledWith('2')
  })

  it('admin puede eliminar sala', () => {
    localStorage.setItem('token', 'abc')
    const eliminarSala = vi.fn()
    renderPagAdmin({}, { eliminarSala })

    const deleteBtns = screen.getAllByText('Eliminar')
    fireEvent.click(deleteBtns[deleteBtns.length - 1])

    expect(eliminarSala).toHaveBeenCalledWith('s1')
  })
})
