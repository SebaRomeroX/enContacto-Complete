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
          actualizarUsuario: vi.fn(),
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
    fireEvent.click(screen.getByLabelText('Menú de usuario'))

    expect(screen.getByText('Juan')).toBeInTheDocument()
    expect(screen.getByText('Editar perfil')).toBeInTheDocument()
    expect(screen.getByText('Salir')).toBeInTheDocument()
  })

  it('el dropdown se cierra al hacer click fuera', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    expect(screen.getByText('Juan')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('Juan')).not.toBeInTheDocument()
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
            actualizarUsuario: vi.fn(),
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

  it('al hacer click en "Editar perfil" se abre el modal de opciones', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))

    expect(screen.getByRole('dialog', { name: 'Editar perfil' })).toBeInTheDocument()
    expect(screen.getByText('Cambiar Foto de perfil')).toBeInTheDocument()
    expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('el modal de opciones no muestra "Cambiar Foto de perfil" para admin', () => {
    renderHeader(usuarioAdmin)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))

    expect(screen.getByRole('dialog', { name: 'Editar perfil' })).toBeInTheDocument()
    expect(screen.queryByText('Cambiar Foto de perfil')).not.toBeInTheDocument()
    expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument()
  })

  it('al cancelar en el modal de opciones se cierra', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    expect(screen.getByRole('dialog', { name: 'Editar perfil' })).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByRole('dialog', { name: 'Editar perfil' })).not.toBeInTheDocument()
  })

  it('al hacer click en "Cambiar Foto de perfil" se abre el modal de foto', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Foto de perfil'))

    expect(screen.getByRole('dialog', { name: 'Cambiar foto de perfil' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('URL de la nueva foto')).toBeInTheDocument()
  })

  it('al cancelar en el modal de foto se cierra', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Foto de perfil'))

    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByRole('dialog', { name: 'Cambiar foto de perfil' })).not.toBeInTheDocument()
  })

  it('al guardar foto sin URL muestra error', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Foto de perfil'))

    fireEvent.click(screen.getByText('Guardar'))
    expect(screen.getByText('La URL de la foto no puede estar vacía')).toBeInTheDocument()
  })

  it('al hacer click en "Cambiar Contraseña" se abre el modal de contraseña', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Contraseña'))

    expect(screen.getByRole('dialog', { name: 'Cambiar contraseña' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña actual')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nueva contraseña (mín. 6 caracteres)')).toBeInTheDocument()
  })

  it('al cancelar en el modal de contraseña se cierra', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Contraseña'))

    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByRole('dialog', { name: 'Cambiar contraseña' })).not.toBeInTheDocument()
  })

  it('al guardar contraseña con menos de 6 caracteres muestra error', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Contraseña'))

    fireEvent.change(screen.getByPlaceholderText('Contraseña actual'), { target: { value: '123' } })
    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña (mín. 6 caracteres)'), { target: { value: '12345' } })
    fireEvent.click(screen.getByText('Guardar'))

    expect(screen.getByText('La nueva contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
  })

  it('al guardar contraseña sin actual muestra error', () => {
    renderHeader(usuarioUser)
    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Contraseña'))

    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña (mín. 6 caracteres)'), { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Guardar'))

    expect(screen.getByText('Ingresa tu contraseña actual')).toBeInTheDocument()
  })

  it('al guardar foto válida llama a actualizarUsuario', () => {
    const actualizarUsuario = vi.fn().mockResolvedValue(undefined)
    render(
      <MemoryRouter initialEntries={['/']}>
        <UsuarioContext.Provider
          value={{
            usuario: usuarioUser,
            listaUsuarios: [],
            crearUsuario: vi.fn(),
            eliminarUsuario: vi.fn(),
            actualizarUsuario,
            logear: vi.fn(),
            cerrarSesion: vi.fn(),
            isLoading: false,
          }}
        >
          <Header />
        </UsuarioContext.Provider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByLabelText('Menú de usuario'))
    fireEvent.click(screen.getByText('Editar perfil'))
    fireEvent.click(screen.getByText('Cambiar Foto de perfil'))
    fireEvent.change(screen.getByPlaceholderText('URL de la nueva foto'), { target: { value: 'https://newphoto.jpg' } })
    fireEvent.click(screen.getByText('Guardar'))

    expect(actualizarUsuario).toHaveBeenCalledWith('2', { foto: 'https://newphoto.jpg' })
  })
})
