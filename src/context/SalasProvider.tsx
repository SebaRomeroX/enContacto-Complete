import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import type { MensajeType, Sala } from '../types/types';
import { getMensajes, postMensaje } from '../services/mensajes'
import { getSalas, postSalas, deleteSalas, agregarMiembros as agregarMiembrosApi, quitarMiembro as quitarMiembroApi, cambiarNombre as cambiarNombreApi, vaciarSala as vaciarSalaApi } from '../services/salas'
import { SalasContext, type SalaContextType } from './salasContext.tsx';

function statusDeError(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status
}

function dedupeMensajes(list: MensajeType[]): MensajeType[] {
  const vistos = new Set<string>()
  const res: MensajeType[] = []
  for (const msj of list) {
    if (!msj.id || !vistos.has(msj.id)) {
      if (msj.id) vistos.add(msj.id)
      res.push(msj)
    }
  }
  return res
}

export const SalasProvider = ({ children } : PropsWithChildren) => {
  const [salas, setSalas] = useState<Sala[] | undefined>([])
  const [salaActiva, setSalaActiva] = useState<Sala | undefined>(undefined)
  const [listaMensajes, setMensajes] = useState<MensajeType[] | undefined>([])
  const [totalMensajes, setTotalMensajes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [aviso, setAviso] = useState<string | undefined>(undefined)

  const listaMensajesRef = useRef<MensajeType[] | undefined>([])
  useEffect(() => { listaMensajesRef.current = listaMensajes }, [listaMensajes])

  // MEMBRESIA: el admin te saco de la sala (403 en GET/POST de mensajes)
  function expulsarDeSala(salaId: string) {
    const sala = salas?.find(s => s.id === salaId)
    setSalas(prev => prev?.filter(s => s.id !== salaId))
    if (salaActiva?.id === salaId) {
      setSalaActiva(undefined)
      setMensajes([])
      setTotalMensajes(0)
    }
    if (sala) setAviso(`Ya no sos miembro de la sala "${sala.nombre}"`)
  }

  function cargarMensajesSala(salaId: string) {
    setMensajes([])
    setTotalMensajes(0)
    return getMensajes({ salaId, limit: 50 })
      .then(({ mensajes, total }) => {
        setMensajes(mensajes)
        setTotalMensajes(total)
      })
      .catch(err => {
        if (statusDeError(err) === 403) {
          expulsarDeSala(salaId)
          return
        }
        console.error('Error al cargar mensajes de la sala:', err)
      })
  }

  function actualizarMsjs() {
    if (!salaActiva?.id) return Promise.resolve()

    const actual = listaMensajesRef.current ?? []
    const desde = actual[0]?.date

    return getMensajes({ salaId: salaActiva.id, limit: 50, ...(desde ? { desde } : {}) })
      .then(({ mensajes, total }) => {
        setMensajes(prev => dedupeMensajes([...mensajes, ...(prev ?? [])]))
        setTotalMensajes(total)
      })
      .catch(err => {
        if (statusDeError(err) === 403) {
          expulsarDeSala(salaActiva.id)
          return
        }
        console.error('Error al actualizar mensajes:', err)
      })
  }

  function cargarMasMensajes() {
    if (!salaActiva?.id) return Promise.resolve()

    const actual = listaMensajesRef.current ?? []
    return getMensajes({ salaId: salaActiva.id, limit: 50, offset: actual.length })
      .then(({ mensajes, total }) => {
        setMensajes(prev => dedupeMensajes([...(prev ?? []), ...mensajes]))
        setTotalMensajes(total)
      })
      .catch(err => console.error('Error al cargar mensajes anteriores:', err))
  }

  useEffect(() => {
    getSalas()
      .then(res => setSalas(res))
      .catch(err => console.error('Error al cargar datos iniciales:', err))
      .finally(() => setIsLoading(false))
  }, [])


  useEffect(() => {
    if (!salaActiva?.id) return

    actualizarMsjs()

    const intervalo = setInterval(actualizarMsjs, 3000)
    return () => clearInterval(intervalo)
  }, [salaActiva])


  // SALA ACTIVA

  function asignarSala (id: string | undefined) {
    if (!id) {
      setSalaActiva(undefined)
      setMensajes([])
      setTotalMensajes(0)
      return
    }
    const newSala = salas?.find(salaDB => salaDB.id === id)
    setSalaActiva(newSala)
    if (newSala?.id) cargarMensajesSala(newSala.id)
  }


  // MENSAJES

  async function agregarMensaje (mensaje: string, usuarioId: string, salaId: string) {
    if (!salaActiva) return false

    try {
      const newMensaje = { usuarioId, mensaje, salaId }
      const savedMensaje = await postMensaje(newMensaje)
      setMensajes(prev => dedupeMensajes([savedMensaje, ...(prev ?? [])]))
      setTotalMensajes(prev => prev + 1)
      return true
    } catch (err) {
      const response = (err as { response?: { status?: number, data?: { detalles?: unknown, error?: string } } })?.response
      const detalles = typeof response?.data?.detalles === 'string' ? response.data.detalles : ''
      const errorMsg = typeof response?.data?.error === 'string' ? response.data.error : ''
      if (response?.status === 403) {
        expulsarDeSala(salaId)
        return false
      }
      if (response?.status === 400 && (detalles.includes('salaId') || errorMsg.includes('salaId'))) {
        setSalaActiva(undefined)
        setMensajes([])
        setTotalMensajes(0)
      }
      console.error('Error al agregar mensaje:', err)
      return false
    }
  }



  // SALAS

  async function eliminarSala(id: string) {
    try {
      await deleteSalas(id)
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status !== 404) {
        console.error('Error al eliminar la sala:', error)
        throw error
      }
    }

    setSalas(prev => prev?.filter(s => s.id !== id))
    if (salaActiva?.id === id) {
      setSalaActiva(undefined)
      setMensajes([])
      setTotalMensajes(0)
    }
  }

  async function crearSala (nombre: string, listaMiembros?: string[]) {
    if (salas?.find(sala => sala.nombre === nombre)) return

    try {
      const newSala = { nombre, ...(listaMiembros?.length ? { listaMiembros } : {}) }

      const savedSala = await postSalas(newSala)
      setSalas(prev => prev?.concat(savedSala))
    } catch (err) {
      console.error('Error al crear sala:', err)
      throw err
    }
  }

  // MIEMBROS (solo admin)

  async function agregarMiembros (salaId: string, usuarioIds: string[]) {
    if (!usuarioIds.length) return
    try {
      const salaActualizada = await agregarMiembrosApi(salaId, usuarioIds)
      setSalas(prev => prev?.map(s => (s.id === salaId ? salaActualizada : s)))
    } catch (err) {
      console.error('Error al agregar miembros:', err)
      throw err
    }
  }

  async function quitarMiembro (salaId: string, usuarioId: string) {
    try {
      const salaActualizada = await quitarMiembroApi(salaId, usuarioId)
      setSalas(prev => prev?.map(s => (s.id === salaId ? salaActualizada : s)))
    } catch (err) {
      if (statusDeError(err) === 404) {
        setSalas(prev => prev?.map(s => (
          s.id === salaId ? { ...s, listaMiembros: s.listaMiembros?.filter(id => id !== usuarioId) } : s
        )))
        return
      }
      console.error('Error al quitar miembro:', err)
      throw err
    }
  }




  async function vaciarChat (id: string) {
    try {
      await vaciarSalaApi(id)
    } catch (err) {
      console.error('Error al vaciar el chat:', err)
      throw err
    }

    if (salaActiva?.id === id) {
      setMensajes([])
      setTotalMensajes(0)
    }
  }

  async function cambiarNombre (id: string, nombre: string) {
    const salaActualizada = await cambiarNombreApi(id, nombre)
    setSalas(prev => prev?.map(s => (s.id === id ? salaActualizada : s)))
  }
  //------------------------------------------------------




  // SALIDA
  const value: SalaContextType = {
    listaMensajes,
    totalMensajes,
    salaActiva,
    salas,
    aviso,
    agregarMensaje,
    asignarSala,
    eliminarSala,
    crearSala,
    agregarMiembros,
    quitarMiembro,
    vaciarChat,
    cambiarNombre,
    descartarAviso: () => setAviso(undefined),
    actualizarMsjs,
    cargarMasMensajes,
    isLoading,
  };

  return (
    <SalasContext.Provider value={value}>
      {children}
    </SalasContext.Provider>
  )
}
