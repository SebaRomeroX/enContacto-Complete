import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useContext } from 'react'
import { SalasProvider } from '../SalasProvider'
import { SalasContext, type SalaContextType } from '../salasContext'
import type { Sala, MensajeType } from '../../types/types'
import type { MensajesParams } from '../../services/mensajes'

const mockGetSalas = vi.hoisted(() => vi.fn())
const mockPostSalas = vi.hoisted(() => vi.fn())
const mockDeleteSalas = vi.hoisted(() => vi.fn())
const mockGetMensajes = vi.hoisted(() => vi.fn())
const mockPostMensaje = vi.hoisted(() => vi.fn())
const mockDeleteMensaje = vi.hoisted(() => vi.fn())

vi.mock('../../services/salas', () => ({
  getSalas: (...args: unknown[]) => mockGetSalas(...args),
  postSalas: (...args: unknown[]) => mockPostSalas(...args),
  deleteSalas: (...args: unknown[]) => mockDeleteSalas(...args),
}))

vi.mock('../../services/mensajes', () => ({
  getMensajes: (...args: unknown[]) => mockGetMensajes(...args),
  postMensaje: (...args: unknown[]) => mockPostMensaje(...args),
  deleteMensaje: (...args: unknown[]) => mockDeleteMensaje(...args),
}))

const salaA: Sala = { id: 's1', nombre: 'General' }
const salaB: Sala = { id: 's2', nombre: 'Random' }
const salasMock: Sala[] = [salaA, salaB]

const mensaje1: MensajeType = { id: 'm1', mensaje: 'hola', usuarioId: 'u1', salaId: 's1', date: '2026-01-01T00:00:00.000Z' }
const mensaje2: MensajeType = { id: 'm2', mensaje: 'chau', usuarioId: 'u2', salaId: 's1', date: '2026-01-02T00:00:00.000Z' }
const mensajesMock: MensajeType[] = [mensaje2, mensaje1]

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
  mockGetMensajes.mockResolvedValue({ mensajes: mensajesMock, total: mensajesMock.length })
  mockPostSalas.mockImplementation(async (data: Sala) => ({ id: 's3', ...data }))
  mockPostMensaje.mockImplementation(async (data: MensajeType) => ({ id: 'm3', ...data }))
  mockDeleteSalas.mockResolvedValue(undefined)
  mockDeleteMensaje.mockResolvedValue(undefined)
})

afterEach(() => {
  localStorage.clear()
})

describe('SalasProvider', () => {
  it('estado inicial: loading=true, salas=[], salaActiva=undefined, mensajes=[]', () => {
    mockGetSalas.mockReturnValue(new Promise(() => {}))
    const ctx = renderProvider()
    expect(ctx.current.isLoading).toBe(true)
    expect(ctx.current.salas).toEqual([])
    expect(ctx.current.salaActiva).toBeUndefined()
    expect(ctx.current.listaMensajes).toEqual([])
    expect(ctx.current.totalMensajes).toBe(0)
  })

  it('fetch al montar: llama getSalas y no trae mensajes globales', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    expect(mockGetSalas).toHaveBeenCalledOnce()
    expect(mockGetMensajes).not.toHaveBeenCalled()
    expect(ctx.current.salas).toEqual(salasMock)
  })

  it('asignarSala: trae los mensajes de esa sala con limit 50', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    act(() => {
      ctx.current.asignarSala('s1')
    })
    expect(ctx.current.salaActiva).toEqual(salaA)
    await act(async () => {})
    expect(mockGetMensajes).toHaveBeenCalledWith({ salaId: 's1', limit: 50 })
    expect(ctx.current.listaMensajes).toEqual(mensajesMock)
    expect(ctx.current.totalMensajes).toBe(2)
  })

  it('agregarMensaje: hace POST y antepone a listaMensajes', async () => {
    const ctx = renderProvider()
    await waitForLoad(ctx)
    act(() => {
      ctx.current.asignarSala('s1')
    })
    await act(async () => {})
    await act(async () => {
      await ctx.current.agregarMensaje('nuevo msj', 'u1', 's1')
    })
    expect(mockPostMensaje).toHaveBeenCalledWith({
      usuarioId: 'u1',
      mensaje: 'nuevo msj',
      salaId: 's1',
    })
    expect(ctx.current.listaMensajes).toHaveLength(3)
    expect(ctx.current.listaMensajes![0].mensaje).toBe('nuevo msj')
  })

  it('cargarMasMensajes: pide con offset y concatena al final', async () => {
    const mensajeViejo: MensajeType = { id: 'm0', mensaje: 'viejo', usuarioId: 'u1', salaId: 's1', date: '2025-12-31T00:00:00.000Z' }
    mockGetMensajes.mockImplementation((params?: MensajesParams) => {
      const page = params?.offset ? [mensajeViejo] : mensajesMock
      return Promise.resolve({ mensajes: page, total: 3 })
    })
    const ctx = renderProvider()
    await waitForLoad(ctx)
    act(() => {
      ctx.current.asignarSala('s1')
    })
    await act(async () => {})
    expect(ctx.current.listaMensajes).toHaveLength(2)
    await act(async () => {
      ctx.current.cargarMasMensajes()
    })
    expect(mockGetMensajes).toHaveBeenLastCalledWith({ salaId: 's1', limit: 50, offset: 2 })
    expect(ctx.current.listaMensajes).toHaveLength(3)
    expect(ctx.current.listaMensajes![2].mensaje).toBe('viejo')
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

  it('eliminarSala: hace DELETE, remueve de salas y limpia la sala activa', async () => {
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
    expect(mockDeleteMensaje).not.toHaveBeenCalled()
  })

  it('eliminarSala: un 404 de DELETE se trata como "ya estaba borrada" y no lanza', async () => {
    mockDeleteSalas.mockRejectedValue({ response: { status: 404 } })
    const ctx = renderProvider()
    await waitForLoad(ctx)
    await act(async () => {
      await expect(ctx.current.eliminarSala('s1')).resolves.toBeUndefined()
    })
    expect(ctx.current.salas).toHaveLength(1)
    expect(ctx.current.salas![0].id).toBe('s2')
    expect(mockDeleteMensaje).not.toHaveBeenCalled()
  })

  it('agregarMensaje: un 400 con salaId inexistente limpia la sala activa', async () => {
    mockPostMensaje.mockRejectedValue({
      response: { status: 400, data: { detalles: "el campo 'salaId' no corresponde a una sala existente" } },
    })
    const ctx = renderProvider()
    await waitForLoad(ctx)
    act(() => {
      ctx.current.asignarSala('s1')
    })
    await act(async () => {})
    expect(ctx.current.salaActiva).toBeDefined()
    const ok = await act(async () => ctx.current.agregarMensaje('hola', 'u1', 's1'))
    expect(ok).toBe(false)
    expect(ctx.current.salaActiva).toBeUndefined()
    expect(ctx.current.listaMensajes).toEqual([])
    expect(ctx.current.totalMensajes).toBe(0)
  })

  describe('polling', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('al seleccionar sala, refresca con desde los nuevos mensajes cada 3s', async () => {
      mockGetMensajes.mockResolvedValue({ mensajes: mensajesMock, total: 2 })
      const ctx = renderProvider()
      await waitForLoad(ctx)

      mockGetMensajes.mockClear()

      act(() => {
        ctx.current.asignarSala('s1')
      })

      await act(async () => {})

      expect(mockGetMensajes).toHaveBeenCalledTimes(2)
      expect(mockGetMensajes).toHaveBeenLastCalledWith({ salaId: 's1', limit: 50 })

      await act(async () => {
        vi.advanceTimersByTime(3000)
      })
      expect(mockGetMensajes).toHaveBeenCalledTimes(3)
      expect(mockGetMensajes).toHaveBeenLastCalledWith({ salaId: 's1', limit: 50, desde: '2026-01-02T00:00:00.000Z' })

      await act(async () => {
        vi.advanceTimersByTime(3000)
      })
      expect(mockGetMensajes).toHaveBeenCalledTimes(4)
    })
  })
})
