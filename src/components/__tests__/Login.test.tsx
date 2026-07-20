import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router'
import { UsuarioContext } from '../../context/usuarioContext'
import { Login } from '../login/Login'

const mockNavigate = vi.fn()
const mockLogear = vi.fn()
const mockCerrarSesion = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorage.clear()
})

function renderLogin() {
  return render(
    <MemoryRouter>
      <UsuarioContext.Provider
        value={{
          usuario: undefined,
          listaUsuarios: [],
          logear: mockLogear,
          cerrarSesion: mockCerrarSesion,
          crearUsuario: vi.fn(),
          eliminarUsuario: vi.fn(),
          isLoading: false,
        }}
      >
        <Login />
      </UsuarioContext.Provider>
    </MemoryRouter>
  )
}

describe('Login', () => {
  it('limpia localStorage al montar', () => {
    localStorage.setItem('token', 'x')
    localStorage.setItem('user', 'x')
    localStorage.setItem('idUser', 'x')

    renderLogin()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('idUser')).toBeNull()
    expect(mockCerrarSesion).toHaveBeenCalledOnce()
  })

  it('inputs reflejan lo que escribe el usuario', () => {
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'Admin' } })
    fireEvent.change(screen.getByPlaceholderText('contraseña'), { target: { value: '777' } })

    expect(screen.getByPlaceholderText('usuario')).toHaveValue('Admin')
    expect(screen.getByPlaceholderText('contraseña')).toHaveValue('777')
  })

  function getForm() {
    return screen.getByPlaceholderText('usuario').closest('form')!
  }

  it('submit exitoso: navega a /', async () => {
    mockLogear.mockResolvedValue(true)
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'Admin' } })
    fireEvent.change(screen.getByPlaceholderText('contraseña'), { target: { value: '777' } })
    fireEvent.submit(getForm())

    expect(mockLogear).toHaveBeenCalledWith('Admin', '777')

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('submit fallido: muestra mensaje de error y hace focus al input', async () => {
    mockLogear.mockResolvedValue(false)
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'Admin' } })
    fireEvent.change(screen.getByPlaceholderText('contraseña'), { target: { value: 'wrong' } })
    fireEvent.submit(getForm())

    await vi.waitFor(() => {
      expect(screen.getByText('Los datos no coinciden con ningun perfil')).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText('usuario')).toHaveFocus()
  })
})
