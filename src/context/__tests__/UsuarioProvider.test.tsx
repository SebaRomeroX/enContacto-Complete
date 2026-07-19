import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useContext } from 'react'
import { UsuarioProvider } from '../UsuarioProvider'
import { UsuarioContext, type UsuarioContextType } from '../usuarioContext'
import type { Usuario } from '../../types/types'

const mockGetUsuarios = vi.hoisted(() => vi.fn())
const mockPostUsuarios = vi.hoisted(() => vi.fn())
const mockDeleteUsuario = vi.hoisted(() => vi.fn())
const mockLogin = vi.hoisted(() => vi.fn())

vi.mock('../../services/usuarios', () => ({
  getUsuarios: (...args: any[]) => mockGetUsuarios(...args),
  postUsuarios: (...args: any[]) => mockPostUsuarios(...args),
  deleteUsuario: (...args: any[]) => mockDeleteUsuario(...args),
}))

vi.mock('../../services/login', () => ({
  default: { login: (...args: any[]) => mockLogin(...args) },
}))

const usuarioAdmin: Usuario = { id: '1', nombre: 'Admin', foto: 'admin.jpg', contra: '777', rol: 'admin' }
const usuarioUser: Usuario = { id: '2', nombre: 'Juan', foto: 'juan.jpg', contra: '123', rol: 'user' }
const listaUsuarios: Usuario[] = [usuarioAdmin, usuarioUser]

function renderProvider() {
  const result: { current: UsuarioContextType } = { current: {} as UsuarioContextType }
  function Consumer() {
    result.current = useContext(UsuarioContext)
    return null
  }
  render(
    <UsuarioProvider>
      <Consumer />
    </UsuarioProvider>
  )
  return result
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  mockGetUsuarios.mockResolvedValue(listaUsuarios)
  mockPostUsuarios.mockImplementation(async (data: any) => ({ id: '3', ...data }))
  mockDeleteUsuario.mockResolvedValue(undefined)
  mockLogin.mockResolvedValue({ ...usuarioAdmin, token: 'abc' })
})

afterEach(() => {
  localStorage.clear()
})

describe('UsuarioProvider', () => {
  it('estado inicial: loading=true, usuario=undefined, listaUsuarios=[]', () => {
    mockGetUsuarios.mockReturnValue(new Promise(() => {}))
    const ctx = renderProvider()
    expect(ctx.current.isLoading).toBe(true)
    expect(ctx.current.usuario).toBeUndefined()
    expect(ctx.current.listaUsuarios).toEqual([])
  })

  it('fetch al montar: llama getUsuarios y setea listaUsuarios', async () => {
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    expect(mockGetUsuarios).toHaveBeenCalledOnce()
    expect(ctx.current.listaUsuarios).toEqual(listaUsuarios)
  })

  it('recupera sesión de localStorage si hay token al montar', async () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('user', JSON.stringify(usuarioAdmin))
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    expect(ctx.current.usuario).toEqual(usuarioAdmin)
  })

  it('recupera sesión buscando por nombre si el id no coincide', async () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('user', JSON.stringify({ id: 'x', nombre: 'Admin' }))
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    expect(ctx.current.usuario).toEqual(usuarioAdmin)
  })

  it('logear exitoso: llama loginService, setea usuario, retorna true', async () => {
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    let resultado = false
    await act(async () => {
      resultado = await ctx.current.logear('Admin', '777')
    })
    expect(mockLogin).toHaveBeenCalledWith({ nombre: 'Admin', contra: '777' })
    expect(ctx.current.usuario).toEqual(usuarioAdmin)
    expect(resultado).toBe(true)
  })

  it('logear fallido: no setea usuario, retorna false', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciales inválidas'))
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    let resultado = true
    await act(async () => {
      resultado = await ctx.current.logear('Admin', 'wrong')
    })
    expect(ctx.current.usuario).toBeUndefined()
    expect(resultado).toBe(false)
  })

  it('crearUsuario: hace POST y agrega a listaUsuarios', async () => {
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    await act(async () => {
      await ctx.current.crearUsuario('Pedro', 'pedro.jpg')
    })
    expect(mockPostUsuarios).toHaveBeenCalledWith({ nombre: 'Pedro', foto: 'pedro.jpg', contra: '777', rol: 'user' })
    expect(ctx.current.listaUsuarios).toHaveLength(3)
    expect(ctx.current.listaUsuarios![2].nombre).toBe('Pedro')
  })

  it('crearUsuario: no duplica si ya existe el nombre', async () => {
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    await act(async () => {
      await ctx.current.crearUsuario('Juan', 'juan.jpg')
    })
    expect(mockPostUsuarios).not.toHaveBeenCalled()
    expect(ctx.current.listaUsuarios).toHaveLength(2)
  })

  it('eliminarUsuario: hace DELETE y remueve de listaUsuarios', async () => {
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    await act(async () => {
      await ctx.current.eliminarUsuario('1')
    })
    expect(mockDeleteUsuario).toHaveBeenCalledWith('1')
    expect(ctx.current.listaUsuarios).toHaveLength(1)
    expect(ctx.current.listaUsuarios![0].id).toBe('2')
  })

  it('cerrarSesion: setea usuario undefined', async () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('user', JSON.stringify(usuarioAdmin))
    const ctx = renderProvider()
    await vi.waitFor(() => {
      expect(ctx.current.isLoading).toBe(false)
    })
    expect(ctx.current.usuario).toBeDefined()
    act(() => {
      ctx.current.cerrarSesion()
    })
    expect(ctx.current.usuario).toBeUndefined()
  })
})
