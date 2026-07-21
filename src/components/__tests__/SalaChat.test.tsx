import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
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
  salaActiva: { id: 's1', nombre: 'General' },
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
})
