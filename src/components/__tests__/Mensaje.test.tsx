import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { UsuarioContext } from '../../context/usuarioContext'
import { Mensaje } from '../chat/sala/Mensaje'
import type { MensajeType, Usuario } from '../../types/types.d'

afterEach(cleanup)

const usuario1: Usuario = { id: 'u1', nombre: 'Juan', foto: 'juan.jpg', contra: '123', rol: 'user' }
const usuario2: Usuario = { id: 'u2', nombre: 'Maria', foto: 'maria.jpg', contra: '456', rol: 'user' }

const mensaje: MensajeType = { id: 'm1', mensaje: 'Hola mundo', usuarioId: 'u1', salaId: 's1' }

function renderMensaje(msj: MensajeType, listaUsuarios?: Usuario[]) {
  const usuarios = listaUsuarios ?? [usuario1, usuario2]
  return render(
    <UsuarioContext.Provider
      value={{
        usuario: usuario1,
        listaUsuarios: usuarios,
        crearUsuario: vi.fn(),
        eliminarUsuario: vi.fn(),
        logear: vi.fn(),
        cerrarSesion: vi.fn(),
        isLoading: false,
      }}
    >
      <Mensaje msj={msj} />
    </UsuarioContext.Provider>
  )
}

describe('Mensaje', () => {
  it('renderiza foto, nombre y texto del usuario', () => {
    renderMensaje(mensaje)
    expect(screen.getByText('Juan')).toBeInTheDocument()
    expect(screen.getByText('Hola mundo')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'juan.jpg')
  })

  it('si usuarioId no existe en lista: muestra version "eliminado"', () => {
    const msjEliminado: MensajeType = { id: 'm2', mensaje: 'mensaje', usuarioId: 'u-inexistente', salaId: 's1' }
    renderMensaje(msjEliminado)
    expect(screen.getByText('eliminado')).toBeInTheDocument()
    expect(screen.getByText('mensaje')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'no-foto.png')
  })
})
