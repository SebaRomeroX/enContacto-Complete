import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react'
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
  totalMensajes: 0,
  salaActiva: undefined,
  salas: salasMock,
  agregarMensaje: vi.fn().mockResolvedValue(true),
  actualizarMsjs: vi.fn(),
  cargarMasMensajes: vi.fn(),
  asignarSala: vi.fn(),
  eliminarSala: vi.fn(),
  crearSala: vi.fn(),
  agregarMiembros: vi.fn().mockResolvedValue(undefined),
  quitarMiembro: vi.fn().mockResolvedValue(undefined),
  vaciarChat: vi.fn(),
  cambiarNombre: vi.fn(),
  aviso: undefined,
  descartarAviso: vi.fn(),
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

    expect(screen.getAllByText('User').length).toBeGreaterThan(0)
    expect(screen.getByText('General')).toBeInTheDocument()

    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
    expect(screen.getByText('Nueva Sala')).toBeInTheDocument()

    expect(screen.getAllByText('Crear')).toHaveLength(1)
    expect(screen.getAllByText('Eliminar')).toHaveLength(1)

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

    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText('Eliminar'))

    expect(eliminarSala).toHaveBeenCalledWith('s1')
  })

  it('el boton Miembros abre el modal con los miembros actuales marcados', () => {
    localStorage.setItem('token', 'abc')
    renderPagAdmin({}, { salas: [{ id: 's1', nombre: 'General', listaMiembros: ['2'] }] })

    expect(screen.queryByRole('dialog', { name: 'Miembros de General' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText(/Miembros/))

    const dialogo = screen.getByRole('dialog', { name: 'Miembros de General' })
    expect(within(dialogo).getByRole('checkbox', { name: /User/ })).toBeChecked()
    expect(within(dialogo).getByText('Guardar')).toBeInTheDocument()
  })

  it('admin puede sacar un miembro desde el modal', async () => {
    localStorage.setItem('token', 'abc')
    const quitarMiembro = vi.fn().mockResolvedValue(undefined)
    renderPagAdmin({}, {
      quitarMiembro,
      salas: [{ id: 's1', nombre: 'General', listaMiembros: ['2'] }],
    })

    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText(/Miembros/))
    fireEvent.click(screen.getByRole('checkbox', { name: /User/ }))
    fireEvent.click(screen.getByText('Guardar'))

    await waitFor(() => expect(quitarMiembro).toHaveBeenCalledWith('s1', '2'))
  })

  it('admin puede agregar un miembro desde el modal', async () => {
    localStorage.setItem('token', 'abc')
    const agregarMiembros = vi.fn().mockResolvedValue(undefined)
    renderPagAdmin({}, {
      agregarMiembros,
      salas: [{ id: 's1', nombre: 'General', listaMiembros: [] }],
    })

    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText(/Miembros/))
    fireEvent.click(screen.getByRole('checkbox', { name: /User/ }))
    fireEvent.click(screen.getByText('Guardar'))

    await waitFor(() => expect(agregarMiembros).toHaveBeenCalledWith('s1', ['2']))
  })

  it('el admin no cuenta como miembro ni aparece en el modal de miembros', () => {
    localStorage.setItem('token', 'abc')
    renderPagAdmin({}, { salas: [{ id: 's1', nombre: 'General', listaMiembros: ['1', '2'] }] })

    expect(screen.getByText('Miembros (1)')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText(/Miembros/))

    const dialogo = screen.getByRole('dialog', { name: 'Miembros de General' })
    expect(within(dialogo).getByRole('checkbox', { name: /User/ })).toBeChecked()
    expect(within(dialogo).queryByRole('checkbox', { name: /Admin/ })).not.toBeInTheDocument()
  })

  it('guardar sin cambios no expulsa al admin aunque este en listaMiembros', async () => {
    localStorage.setItem('token', 'abc')
    const quitarMiembro = vi.fn().mockResolvedValue(undefined)
    renderPagAdmin({}, {
      quitarMiembro,
      salas: [{ id: 's1', nombre: 'General', listaMiembros: ['1', '2'] }],
    })

    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText(/Miembros/))
    fireEvent.click(screen.getByText('Guardar'))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(quitarMiembro).not.toHaveBeenCalled()
  })

  it('nueva sala abre un modal y permite elegir miembros iniciales', async () => {
    localStorage.setItem('token', 'abc')
    const crearSala = vi.fn().mockResolvedValue(undefined)
    renderPagAdmin({}, { crearSala })

    fireEvent.click(screen.getByText('Nueva Sala'))

    const dialogo = screen.getByRole('dialog', { name: 'Nueva Sala' })
    expect(within(dialogo).getByLabelText('Nombre de sala')).toBeInTheDocument()

    fireEvent.change(within(dialogo).getByLabelText('Nombre de sala'), { target: { value: 'Proyecto X' } })
    fireEvent.click(within(dialogo).getByRole('checkbox', { name: /User/ }))
    fireEvent.click(within(dialogo).getByText('Crear'))

    await waitFor(() => expect(crearSala).toHaveBeenCalledWith('Proyecto X', ['2']))
  })

  it('cancelar en el modal cierra sin crear la sala', () => {
    localStorage.setItem('token', 'abc')
    const crearSala = vi.fn().mockResolvedValue(undefined)
    renderPagAdmin({}, { crearSala })

    fireEvent.click(screen.getByText('Nueva Sala'))
    fireEvent.click(screen.getByText('Cancelar'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(crearSala).not.toHaveBeenCalled()
  })

  it('editar abre modal con opciones Miembros, Cambiar nombre, Vaciar chat y Eliminar', () => {
    localStorage.setItem('token', 'abc')
    renderPagAdmin()

    fireEvent.click(screen.getByText('Editar'))

    const dialogo = screen.getByRole('dialog', { name: 'Editar General' })
    expect(dialogo).toBeInTheDocument()
    expect(within(dialogo).getByText(/Miembros/)).toBeInTheDocument()
    expect(within(dialogo).getByText('Cambiar nombre')).toBeInTheDocument()
    expect(within(dialogo).getByText('Vaciar chat')).toBeInTheDocument()
    expect(within(dialogo).getByText('Eliminar')).toBeInTheDocument()
    expect(within(dialogo).getByText('Cancelar')).toBeInTheDocument()
  })

  it('admin puede vaciar chat de una sala', () => {
    localStorage.setItem('token', 'abc')
    const vaciarChat = vi.fn().mockResolvedValue(undefined)
    renderPagAdmin({}, { vaciarChat })

    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText('Vaciar chat'))

    expect(vaciarChat).toHaveBeenCalledWith('s1')
  })

  it('cancelar en el modal de editar cierra sin acciones', () => {
    localStorage.setItem('token', 'abc')
    const eliminarSala = vi.fn()
    renderPagAdmin({}, { eliminarSala })

    fireEvent.click(screen.getByText('Editar'))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Editar General' })).getByText('Cancelar'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(eliminarSala).not.toHaveBeenCalled()
  })
})
