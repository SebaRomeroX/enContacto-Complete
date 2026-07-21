import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { UsuarioContext } from '../../context/usuarioContext'
import { SalasContext, type SalaContextType } from '../../context/salasContext'
import type { Usuario } from '../../types/types.d'
import { CajaMensaje } from '../chat/sala/CajaMensaje'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const usuarioMock: Usuario = { id: 'u1', nombre: 'Admin', foto: 'a.jpg', contra: '777', rol: 'admin' }

const defaultSalasCtx: SalaContextType = {
  listaMensajes: [],
  salaActiva: { id: 's1', nombre: 'General' },
  salas: [{ id: 's1', nombre: 'General' }],
  agregarMensaje: vi.fn().mockResolvedValue(true),
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

function renderCajaMensaje(
  overridesSalas?: Partial<SalaContextType>,
  overridesUsuario?: Partial<typeof usuarioCtxValue>
) {
  return render(
    <UsuarioContext.Provider value={{ ...usuarioCtxValue, ...overridesUsuario }}>
      <SalasContext.Provider value={{ ...defaultSalasCtx, ...overridesSalas }}>
        <CajaMensaje />
      </SalasContext.Provider>
    </UsuarioContext.Provider>
  )
}

function getForm() {
  return screen.getByPlaceholderText('Escribe aqui ...').closest('form')!
}

describe('CajaMensaje', () => {
  it('submit llama agregarMensaje con texto, usuarioId, salaId', () => {
    const agregarMensaje = vi.fn()
    renderCajaMensaje({ agregarMensaje })

    fireEvent.change(screen.getByPlaceholderText('Escribe aqui ...'), {
      target: { value: 'Hola' },
    })
    fireEvent.submit(getForm())

    expect(agregarMensaje).toHaveBeenCalledWith('Hola', 'u1', 's1')
  })

  it('previene espacios dobles (espacio al inicio no se escribe)', () => {
    renderCajaMensaje()
    const input = screen.getByPlaceholderText('Escribe aqui ...')

    fireEvent.change(input, { target: { value: ' ' } })
    expect(input).toHaveValue('')
  })

  it('previene doble espacio consecutivo', () => {
    renderCajaMensaje()
    const input = screen.getByPlaceholderText('Escribe aqui ...')

    fireEvent.change(input, { target: { value: 'hola ' } })
    fireEvent.change(input, { target: { value: 'hola  ' } })
    expect(input).toHaveValue('hola ')
  })

  it('input vacio no submittea', () => {
    const agregarMensaje = vi.fn()
    renderCajaMensaje({ agregarMensaje })

    fireEvent.submit(getForm())
    expect(agregarMensaje).not.toHaveBeenCalled()
  })

  it('no submittea si falta usuario', () => {
    const agregarMensaje = vi.fn()
    renderCajaMensaje({ agregarMensaje }, { usuario: undefined })

    fireEvent.change(screen.getByPlaceholderText('Escribe aqui ...'), {
      target: { value: 'Hola' },
    })
    fireEvent.submit(getForm())

    expect(agregarMensaje).not.toHaveBeenCalled()
  })

  it('no submittea si falta salaActiva', () => {
    const agregarMensaje = vi.fn()
    renderCajaMensaje({ agregarMensaje, salaActiva: undefined })

    fireEvent.change(screen.getByPlaceholderText('Escribe aqui ...'), {
      target: { value: 'Hola' },
    })
    fireEvent.submit(getForm())

    expect(agregarMensaje).not.toHaveBeenCalled()
  })


})
