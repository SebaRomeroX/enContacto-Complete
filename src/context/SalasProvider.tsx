import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import type { MensajeType, Sala } from '../types/types';
import { getMensajes, postMensaje, deleteMensaje } from '../services/mensajes'
import { getSalas, postSalas, deleteSalas } from '../services/salas'
import { SalasContext, type SalaContextType } from './salasContext.tsx';

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

  const listaMensajesRef = useRef<MensajeType[] | undefined>([])
  useEffect(() => { listaMensajesRef.current = listaMensajes }, [listaMensajes])


  function cargarMensajesSala(salaId: string) {
    setMensajes([])
    setTotalMensajes(0)
    return getMensajes({ salaId, limit: 50 })
      .then(({ mensajes, total }) => {
        setMensajes(mensajes)
        setTotalMensajes(total)
      })
      .catch(err => console.error('Error al cargar mensajes de la sala:', err))
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
      .catch(err => console.error('Error al actualizar mensajes:', err))
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
      console.error('Error al agregar mensaje:', err)
      return false
    }
  }



  // SALAS

  async function eliminarSala(id: string) {
    try {
      await deleteSalas(id)

      setSalas(prev => prev?.filter(s => s.id !== id))
      if (salaActiva?.id === id) {
        setSalaActiva(undefined)
        setMensajes([])
        setTotalMensajes(0)
      }

      let offset = 0
      const todos: MensajeType[] = []
      for (;;) {
        const { mensajes, total } = await getMensajes({ salaId: id, limit: 100, offset })
        todos.push(...mensajes)
        offset += mensajes.length
        if (todos.length >= total || mensajes.length === 0) break
      }

      for (let i = 0; i < todos.length; i += 3) {
        const lote = todos.slice(i, i + 3)
        await Promise.all(
          lote
            .filter(msj => msj.id)
            .map(msj => deleteMensaje(msj.id!).catch(() => {}))
        )
      }

      actualizarMsjs()

    } catch (error) {
      console.error('Error al eliminar la sala:', error)
      throw error
    }
  }

  async function crearSala (nombre: string) {
    if (salas?.find(sala => sala.nombre === nombre)) return

    try {
      const newSala = { nombre }

      const savedSala = await postSalas(newSala)
      setSalas(prev => prev?.concat(savedSala))
    } catch (err) {
      console.error('Error al crear sala:', err)
      throw err
    }
  }




  // DE MOMENTO NO USAMOS ------------------------------
  function vaciarChat (id: string) {
    const newSalas = salas?.map(sala => {
      if (sala.id === id) {
        return {...sala, chat: []}
      }
      return sala
    })

    setSalas(newSalas)
  }

  function cambiarNombre (nombre: string, id: string) {
    const newSalas = salas?.map(sala => {
      if (sala.id === id) {
        return {...sala, nombre}
      }
      return sala
    })

    setSalas(newSalas)
  }
  //------------------------------------------------------




  // SALIDA
  const value: SalaContextType = {
    listaMensajes,
    totalMensajes,
    salaActiva,
    salas,
    agregarMensaje,
    asignarSala,
    eliminarSala,
    crearSala,
    vaciarChat,
    cambiarNombre,
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
