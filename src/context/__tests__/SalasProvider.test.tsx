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
const mockAgregarMiembros = vi.hoisted(() => vi.fn())
const mockQuitarMiembro = vi.hoisted(() => vi.fn())
const mockGetMensajes = vi.hoisted(() => vi.fn())
const mockPostMensaje = vi.hoisted(() => vi.fn())
const mockDeleteMensaje = vi.hoisted(() => vi.fn())

vi.mock('../../services/salas', () => ({
  getSalas: (...args: unknown[]) => mockGetSalas(...args),
  postSalas: (...args: unknown[]) => mockPostSalas(...args),
  deleteSalas: (...args: unknown[]) => mockDeleteSalas(...args),
  agregarMiembros: (...args: unknown[]) => mockAgregarMiembros(...args),
  quitarMiembro: (...args: unknown[]) => mockQuitarMiembro(...args),
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
  mockAgregarMiembros.mockImplementation(async (salaId: string, usuarioIds: string[]) => ({
    id: salaId,
    nombre: salasMock.find(s => s.id === salaId)?.nombre ?? '',
    listaMiembros: usuarioIds,
  }))
  mockQuitarMiembro.mockImplementation(async (salaId: string) => ({
    id: salaId,
    nombre: salasMock.find(s => s.id === salaId)?.nombre ?? '',
    listaMiembros: [],
  }))
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

  describe('membresia (403)', () => {
    it('asignarSala: un 403 al cargar mensajes saca la sala del estado y avisa', async () => {
      mockGetMensajes.mockRejectedValue({ response: { status: 403 } })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      act(() => {
        ctx.current.asignarSala('s1')
      })
      await act(async () => {})
      expect(ctx.current.salas).toHaveLength(1)
      expect(ctx.current.salas![0].id).toBe('s2')
      expect(ctx.current.salaActiva).toBeUndefined()
      expect(ctx.current.listaMensajes).toEqual([])
      expect(ctx.current.totalMensajes).toBe(0)
      expect(ctx.current.aviso).toBe('Ya no sos miembro de la sala "General"')
    })

    it('agregarMensaje: un 403 expulsa de la sala y devuelve false', async () => {
      mockPostMensaje.mockRejectedValue({ response: { status: 403 } })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      act(() => {
        ctx.current.asignarSala('s1')
      })
      await act(async () => {})
      const ok = await act(async () => ctx.current.agregarMensaje('hola', 'u1', 's1'))
      expect(ok).toBe(false)
      expect(ctx.current.salaActiva).toBeUndefined()
      expect(ctx.current.salas).toHaveLength(1)
      expect(ctx.current.aviso).toBeDefined()
    })

    it('descartarAviso limpia el aviso', async () => {
      mockGetMensajes.mockRejectedValue({ response: { status: 403 } })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      act(() => {
        ctx.current.asignarSala('s1')
      })
      await act(async () => {})
      expect(ctx.current.aviso).toBeDefined()
      act(() => {
        ctx.current.descartarAviso()
      })
      expect(ctx.current.aviso).toBeUndefined()
    })

    it('polling: un 403 en el refresco periodico expulsa de la sala', async () => {
      vi.useFakeTimers()
      mockGetMensajes.mockResolvedValue({ mensajes: mensajesMock, total: 2 })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      act(() => {
        ctx.current.asignarSala('s1')
      })
      await act(async () => {})
      expect(ctx.current.salaActiva).toBeDefined()

      mockGetMensajes.mockRejectedValue({ response: { status: 403 } })
      await act(async () => {
        await vi.advanceTimersByTime(3000)
      })
      expect(ctx.current.salaActiva).toBeUndefined()
      expect(ctx.current.listaMensajes).toEqual([])
      expect(ctx.current.aviso).toBe('Ya no sos miembro de la sala "General"')

      mockGetMensajes.mockClear()
      await act(async () => {
        await vi.advanceTimersByTime(9000)
      })
      expect(mockGetMensajes).not.toHaveBeenCalled()
    })

    it('un error no-403 al cargar mensajes NO expulsa', async () => {
      mockGetMensajes.mockRejectedValue({ response: { status: 500 } })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      act(() => {
        ctx.current.asignarSala('s1')
      })
      await act(async () => {})
      expect(ctx.current.salaActiva).toBeDefined()
      expect(ctx.current.salas).toHaveLength(2)
      expect(ctx.current.aviso).toBeUndefined()
    })
  })

  describe('miembros', () => {
    it('crearSala manda listaMiembros cuando se indican', async () => {
      const ctx = renderProvider()
      await waitForLoad(ctx)
      await act(async () => {
        await ctx.current.crearSala('Proyecto X', ['u2', 'u3'])
      })
      expect(mockPostSalas).toHaveBeenCalledWith({ nombre: 'Proyecto X', listaMiembros: ['u2', 'u3'] })
    })

    it('agregarMiembros actualiza la sala con la respuesta del endpoint', async () => {
      const ctx = renderProvider()
      await waitForLoad(ctx)
      await act(async () => {
        await ctx.current.agregarMiembros('s1', ['u2'])
      })
      expect(mockAgregarMiembros).toHaveBeenCalledWith('s1', ['u2'])
      expect(ctx.current.salas![0]).toEqual({ id: 's1', nombre: 'General', listaMiembros: ['u2'] })
    })

    it('agregarMiembros con lista vacia no llama al endpoint', async () => {
      const ctx = renderProvider()
      await waitForLoad(ctx)
      await act(async () => {
        await ctx.current.agregarMiembros('s1', [])
      })
      expect(mockAgregarMiembros).not.toHaveBeenCalled()
    })

    it('quitarMiembro actualiza la sala con la respuesta del endpoint', async () => {
      const salaConMiembros: Sala = { id: 's1', nombre: 'General', listaMiembros: ['u1', 'u2'] }
      mockGetSalas.mockResolvedValue([salaConMiembros, salaB])
      const ctx = renderProvider()
      await waitForLoad(ctx)
      await act(async () => {
        await ctx.current.quitarMiembro('s1', 'u1')
      })
      expect(mockQuitarMiembro).toHaveBeenCalledWith('s1', 'u1')
      expect(ctx.current.salas![0].listaMiembros).toEqual([])
    })

    it('quitarMiembro: un 404 ("no era miembro") remueve el id localmente sin lanzar', async () => {
      const salaConMiembros: Sala = { id: 's1', nombre: 'General', listaMiembros: ['u1', 'u2'] }
      mockGetSalas.mockResolvedValue([salaConMiembros, salaB])
      mockQuitarMiembro.mockRejectedValue({ response: { status: 404 } })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      await act(async () => {
        await expect(ctx.current.quitarMiembro('s1', 'u1')).resolves.toBeUndefined()
      })
      expect(ctx.current.salas![0].listaMiembros).toEqual(['u2'])
    })

    it('quitarMiembro: un error distinto de 404 se propaga', async () => {
      mockQuitarMiembro.mockRejectedValue({ response: { status: 403 } })
      const ctx = renderProvider()
      await waitForLoad(ctx)
      await act(async () => {
        await expect(ctx.current.quitarMiembro('s1', 'u1')).rejects.toBeDefined()
      })
    })
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
