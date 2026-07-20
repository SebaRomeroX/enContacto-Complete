import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useContext } from 'react'
import { SalasProvider } from '../SalasProvider'
import { SalasContext, type SalaContextType } from '../salasContext'
import type { Sala, MensajeType } from '../../types/types'

const mockGetSalas = vi.hoisted(() => vi.fn())
const mockPostSalas = vi.hoisted(() => vi.fn())
const mockDeleteSalas = vi.hoisted(() => vi.fn())
const mockGetMensajes = vi.hoisted(() => vi.fn())
const mockPostMensaje = vi.hoisted(() => vi.fn())
const mockDeleteMensaje = vi.hoisted(() => vi.fn())

vi.mock('../../services/salas', () => ({
  getSalas: (...args: any[]) => mockGetSalas(...args),
  postSalas: (...args: any[]) => mockPostSalas(...args),
  deleteSalas: (...args: any[]) => mockDeleteSalas(...args),
}))

vi.mock('../../services/mensajes', () => ({
  getMensajes: (...args: any[]) => mockGetMensajes(...args),
  postMensaje: (...args: any[]) => mockPostMensaje(...args),
  deleteMensaje: (...args: any[]) => mockDeleteMensaje(...args),
}))

const salaA: Sala = { id: 's1', nombre: 'General' }
const salaB: Sala = { id: 's2', nombre: 'Random' }
const salasMock: Sala[] = [salaA, salaB]

const mensaje1: MensajeType = { id: 'm1', mensaje: 'hola', usuarioId: 'u1', salaId: 's1' }
const mensaje2: MensajeType = { id: 'm2', mensaje: 'chau', usuarioId: 'u2', salaId: 's1' }
const mensajesMock: MensajeType[] = [mensaje1, mensaje2]

function renderProvider() {
  const result: { current: SalaContextType } = { current: {} as SalaContextType }
  function Consumer() {
    result.current = useContext(SalasContext)
    return null
  }
  render(
    <SalasProvider>
      <Consumer />
    </SalasProvider>
  )
  return result
}

async function waitForLoad(ctx: { current: SalaContextType }) {
  await vi.waitFor(() => {
    expect(ctx.current.isLoading).toBe(false)
  })
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  mockGetSalas.mockResolvedValue(salasMock)
  mockGetMensajes.mockResolvedValue(mensajesMock)
  mockPostSalas.mockImplementation(async (data: any) => ({ id: 's3', ...data }))
  mockPostMensaje.mockImplementation(async (data: any) => ({ id: 'm3', ...data }))
  mockDeleteSalas.mockResolvedValue(undefined)
  mockDeleteMensaje.mockResolvedValue(undefined)
})

afterEach(() => {
  localStorage.clear()
})

describe('SalasProvider', () => {
  it('estado inicial: loading=true, salas=[], salaActiva=undefined, mensajes=[]', () => {
    mockGetSalas.mockReturnValue(new Promise(() => {}))
    mockGetMensajes.mockReturnValue(new Promise(() => {}))
    const ctx = renderProvider()
    expect(ctx.current.isLoading).toBe(true)
    expect(ctx.current.salas).toEqual([])
    expect(ctx.current.salaActiva).toBeUndefined()
    expect(ctx.current.listaMensajes).toEqual([])
  })

  it('fetch al montar: llama getSalas y getMensajes', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    expect(mockGetSalas).toHaveBeenCalledOnce()
    expect(mockGetMensajes).toHaveBeenCalled()
    expect(ctx.current.salas).toEqual(salasMock)
    expect(ctx.current.listaMensajes).toEqual(mensajesMock)
  })

  it('agregarMensaje: hace POST y concatena a listaMensajes', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    act(() => {
      ctx.current.asignarSala('s1')
    })
    expect(ctx.current.salaActiva).toEqual(salaA)
    await act(async () => {
      await ctx.current.agregarMensaje('nuevo msj', 'u1', 's1')
    })
    expect(mockPostMensaje).toHaveBeenCalledWith({
      usuarioId: 'u1',
      mensaje: 'nuevo msj',
      salaId: 's1',
    })
    expect(ctx.current.listaMensajes).toHaveLength(3)
    expect(ctx.current.listaMensajes![2].mensaje).toBe('nuevo msj')
  })

  it('crearSala: hace POST y concatena a salas', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    await act(async () => {
      await ctx.current.crearSala('NuevaSala')
    })
    expect(mockPostSalas).toHaveBeenCalledWith({ nombre: 'NuevaSala' })
    expect(ctx.current.salas).toHaveLength(3)
    expect(ctx.current.salas![2].nombre).toBe('NuevaSala')
  })

  it('crearSala: no duplica si ya existe el nombre', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    await act(async () => {
      await ctx.current.crearSala('General')
    })
    expect(mockPostSalas).not.toHaveBeenCalled()
    expect(ctx.current.salas).toHaveLength(2)
  })

  it('eliminarSala: hace DELETE, remueve de salas, limpia salaActiva y mensajes asociados', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    act(() => {
      ctx.current.asignarSala('s1')
    })
    expect(ctx.current.salaActiva).toBeDefined()
    await act(async () => {
      await ctx.current.eliminarSala('s1')
    })
    expect(mockDeleteSalas).toHaveBeenCalledWith('s1')
    expect(ctx.current.salas).toHaveLength(1)
    expect(ctx.current.salas![0].id).toBe('s2')
    expect(ctx.current.salaActiva).toBeUndefined()
    expect(mockDeleteMensaje).toHaveBeenCalledTimes(mensajesMock.length)
  })

  describe('polling', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('al seleccionar sala, refresca mensajes cada 3s', async () => {
      mockGetMensajes.mockResolvedValue(mensajesMock)
      const ctx = renderProvider()
      await waitForLoad(ctx)

      mockGetMensajes.mockClear()

      act(() => {
        ctx.current.asignarSala('s1')
      })

      expect(mockGetMensajes).toHaveBeenCalledTimes(1)

      await act(async () => {
        vi.advanceTimersByTime(3000)
      })
      expect(mockGetMensajes).toHaveBeenCalledTimes(2)

      await act(async () => {
        vi.advanceTimersByTime(3000)
      })
      expect(mockGetMensajes).toHaveBeenCalledTimes(3)
    })
  })
})
