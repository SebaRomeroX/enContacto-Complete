import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
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
    expect(screen.queryByLabelText('Menú de usuario')).not.toBeInTheDocument()
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
    expect(screen.queryByText('Volver a salas')).not.toBeInTheDocument()
  })

  it('con usuario admin en /chat: muestra "Administrar" y el trigger del dropdown', () => {
    renderHeader(usuarioAdmin, '/')
    expect(screen.getByText('Administrar')).toBeInTheDocument()
    expect(screen.getByLabelText('Menú de usuario')).toBeInTheDocument()
    expect(screen.queryByText('Volver a salas')).not.toBeInTheDocument()
  })

  it('en ruta /admin: muestra "Volver a salas" y el trigger del dropdown', () => {
    renderHeader(usuarioAdmin, '/admin')
    expect(screen.getByText('Volver a salas')).toBeInTheDocument()
    expect(screen.getByLabelText('Menú de usuario')).toBeInTheDocument()
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
  })

  it('con usuario user en /chat: muestra solo el trigger del dropdown', () => {
    renderHeader(usuarioUser, '/')
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Menú de usuario')).toBeInTheDocument()
  })

  it('al hacer click en el trigger se abre el dropdown con nombre, editar perfil y salir', () => {
    renderHeader(usuarioUser)
    const trigger = screen.getByLabelText('Menú de usuario')
    fireEvent.click(trigger)

    expect(screen.getByText('Juan')).toBeInTheDocument()
    expect(screen.getByText('Editar perfil')).toBeInTheDocument()
    expect(screen.getByText('Salir')).toBeInTheDocument()
  })

  it('el botón "Editar perfil" está deshabilitado', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))

    const btn = screen.getByText('Editar perfil')
    expect(btn).toBeDisabled()
  })

  it('al hacer click en "Salir" se llama cerrarSesion', () => {
    const cerrarSesion = vi.fn()
    render(
      <MemoryRouter initialEntries={['/']}>
        <UsuarioContext.Provider
          value={{
            usuario: usuarioUser,
            listaUsuarios: [],
            crearUsuario: vi.fn(),
            eliminarUsuario: vi.fn(),
            logear: vi.fn(),
            cerrarSesion,
            isLoading: false,
          }}
        >
          <Header />
        </UsuarioContext.Provider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Salir'))
    expect(cerrarSesion).toHaveBeenCalledOnce()
  })

  it('el dropdown se cierra al hacer click fuera', () => {
    renderHeader(usuarioUser)
    const trigger = screen.getByLabelText('Menú de usuario')
    fireEvent.click(trigger)
    expect(screen.getByText('Juan')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('Juan')).not.toBeInTheDocument()
  })
})
