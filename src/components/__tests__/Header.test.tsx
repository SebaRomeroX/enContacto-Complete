import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router'
import { UsuarioContext } from '../../context/usuarioContext'
import { Header } from '../Header'
import type { Usuario } from '../../types/types'

afterEach(cleanup)

const usuarioAdmin: Usuario = { id: '1', nombre: 'Admin', foto: 'admin.jpg', contra: '777', rol: 'admin' }
const usuarioUser: Usuario = { id: '2', nombre: 'Juan', foto: 'juan.jpg', contra: '123', rol: 'user' }

function renderHeader(usuario?: Usuario, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <UsuarioContext.Provider
        value={{
          usuario,
          listaUsuarios: [],
          crearUsuario: vi.fn(),
          eliminarUsuario: vi.fn(),
          logear: vi.fn(),
          cerrarSesion: vi.fn(),
          isLoading: false,
        }}
      >
        <Header />
      </UsuarioContext.Provider>
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('muestra "enContacto" siempre', () => {
    renderHeader()
    expect(screen.getByText('enContacto')).toBeInTheDocument()
  })

  it('sin usuario logueado: no muestra enlaces de sesión', () => {
    renderHeader()
    expect(screen.queryByText('Salir')).not.toBeInTheDocument()
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
    expect(screen.queryByText('Volver a salas')).not.toBeInTheDocument()
  })

  it('con usuario admin en /chat: muestra "Administrar" y "Salir"', () => {
    renderHeader(usuarioAdmin, '/')
    expect(screen.getByText('Administrar')).toBeInTheDocument()
    expect(screen.getByText('Salir')).toBeInTheDocument()
    expect(screen.queryByText('Volver a salas')).not.toBeInTheDocument()
  })
  
  it('en ruta /admin: muestra "Volver a salas"', () => {
    renderHeader(usuarioAdmin, '/admin')
    expect(screen.getByText('Volver a salas')).toBeInTheDocument()
    expect(screen.getByText('Salir')).toBeInTheDocument()
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
  })

  it('con usuario user en /chat: muestra solo "Salir"', () => {
    renderHeader(usuarioUser, '/')
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
    expect(screen.getByText('Salir')).toBeInTheDocument()
  })

})
