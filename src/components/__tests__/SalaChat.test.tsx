import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { UsuarioContext } from '../../context/usuarioContext'
import { SalasContext, type SalaContextType } from '../../context/salasContext'
import type { MensajeType, Usuario } from '../../types/types.d'
import { SalaChat } from '../chat/sala/SalaChat'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const usuarioMock: Usuario = { id: 'u1', nombre: 'Admin', foto: 'a.jpg', contra: '777', rol: 'admin' }

const mensajesMock: MensajeType[] = [
  { id: 'm1', mensaje: 'hola', usuarioId: 'u1', salaId: 's1' },
  { id: 'm2', mensaje: 'chau', usuarioId: 'u2', salaId: 's1' },
  { id: 'm3', mensaje: 'otra sala', usuarioId: 'u1', salaId: 's2' },
]

const defaultSalasCtx: SalaContextType = {
  listaMensajes: mensajesMock,
  totalMensajes: mensajesMock.length,
  salaActiva: { id: 's1', nombre: 'General' },
  salas: [{ id: 's1', nombre: 'General' }],
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
  usuario: usuarioMock,
  listaUsuarios: [usuarioMock],
  crearUsuario: vi.fn(),
  eliminarUsuario: vi.fn(),
  logear: vi.fn(),
  cerrarSesion: vi.fn(),
  isLoading: false,
}

function renderSalaChat(salasOverrides?: Partial<SalaContextType>) {
  return render(
    <UsuarioContext.Provider value={usuarioCtxValue}>
      <SalasContext.Provider value={{ ...defaultSalasCtx, ...salasOverrides }}>
        <SalaChat />
      </SalasContext.Provider>
    </UsuarioContext.Provider>
  )
}

describe('SalaChat', () => {
  it('sin salaActiva: muestra placeholder', () => {
    renderSalaChat({ salaActiva: undefined })
    expect(screen.getByText('Elige un sala')).toBeInTheDocument()
    expect(screen.queryByText('General')).not.toBeInTheDocument()
  })

  it('con salaActiva: muestra nombre, mensajes filtrados y CajaMensaje', () => {
    renderSalaChat()
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('hola')).toBeInTheDocument()
    expect(screen.getByText('chau')).toBeInTheDocument()
    expect(screen.queryByText('otra sala')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Escribe aqui ...')).toBeInTheDocument()
  })

  it('con salaActiva y listaMensajes undefined: no rompe', () => {
    renderSalaChat({ listaMensajes: undefined })
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Escribe aqui ...')).toBeInTheDocument()
  })

  it('con salaId populate (objeto): filtra y muestra mensajes de la sala activa', () => {
    const msjsPopulate: MensajeType[] = [
      { id: 'm1', mensaje: 'hola', usuarioId: 'u1', salaId: { id: 's1', nombre: 'General' } },
      { id: 'm2', mensaje: 'chau', usuarioId: 'u2', salaId: { id: 's1', nombre: 'General' } },
      { id: 'm3', mensaje: 'otra sala', usuarioId: 'u1', salaId: { id: 's2', nombre: 'Random' } },
    ]
    renderSalaChat({ listaMensajes: msjsPopulate })
    expect(screen.getByText('hola')).toBeInTheDocument()
    expect(screen.getByText('chau')).toBeInTheDocument()
    expect(screen.queryByText('otra sala')).not.toBeInTheDocument()
  })

  it('muestra boton "Cargar mensajes anteriores" cuando hay mas mensajes', () => {
    renderSalaChat({ totalMensajes: 5 })
    expect(screen.getByRole('button', { name: 'Cargar mensajes anteriores' })).toBeInTheDocument()
  })

  it('click en "Cargar mensajes anteriores" llama cargarMasMensajes', () => {
    const cargarMasMensajes = vi.fn()
    renderSalaChat({ totalMensajes: 5, cargarMasMensajes })
    fireEvent.click(screen.getByRole('button', { name: 'Cargar mensajes anteriores' }))
    expect(cargarMasMensajes).toHaveBeenCalledOnce()
  })

  it('no muestra boton cuando no hay mas mensajes', () => {
    renderSalaChat({ totalMensajes: 2 })
    expect(screen.queryByRole('button', { name: 'Cargar mensajes anteriores' })).not.toBeInTheDocument()
  })
})
