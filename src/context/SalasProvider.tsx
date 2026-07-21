import { useEffect, useState, type PropsWithChildren } from 'react'
import type { MensajeType, Sala } from '../types/types';
import { getMensajes, postMensaje, deleteMensaje } from '../services/mensajes'
import { getSalas, postSalas, deleteSalas } from '../services/salas'
import { SalasContext, type SalaContextType } from './salasContext.tsx';



export const SalasProvider = ({ children } : PropsWithChildren) => {
  const [salas, setSalas] = useState<Sala[] | undefined>([])
  const [salaActiva, setSalaActiva] = useState<Sala | undefined>(undefined)
  const [listaMensajes, setMensajes] = useState<MensajeType[] | undefined>([])
  const [isLoading, setIsLoading] = useState(true)


  function actualizarMsjs() {
    return getMensajes()
      .then(res => {
        if (JSON.stringify(res) !== JSON.stringify(listaMensajes)) {
          setMensajes(res)
        }
      })
      .catch(err => console.error('Error al actualizar mensajes:', err))
  }

  useEffect(() => {
    Promise.all([
      getSalas().then(res => setSalas(res)),
      actualizarMsjs(),
    ]).catch(err => console.error('Error al cargar datos iniciales:', err))
    .finally(() => setIsLoading(false))
  }, [])
  

  useEffect(() => {
    if (!salaActiva) return

    actualizarMsjs()

    const intervalo = setInterval(actualizarMsjs, 3000)
    return () => clearInterval(intervalo)
  }, [salaActiva])


  // console.log('mensajes :', listaMensajes);



  // SALA ACTIVA
  
  function asignarSala (id: string | undefined) {
    if (!id) {
      setSalaActiva(undefined)
      return
    }
    const newSala = salas?.find(salaDB => salaDB.id === id)
    setSalaActiva(newSala)
  }
  

  // MENSAJES

  async function agregarMensaje (mensaje: string, usuarioId: string, salaId: string) {
    if (!salaActiva) return false

    try {
      const newMensaje = { usuarioId, mensaje, salaId }
      const savedMensaje = await postMensaje(newMensaje)
      setMensajes(prevMsj => prevMsj?.concat(savedMensaje))
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
      if (salaActiva?.id === id) setSalaActiva(undefined)

      const mensajes = await getMensajes()
      const mensajesSala = mensajes.filter(msj => msj.salaId === id)

      for (let i = 0; i < mensajesSala.length; i += 3) {
        const lote = mensajesSala.slice(i, i + 3)
        await Promise.all(
          lote
            .filter(msj => msj.id)
            .map(msj => deleteMensaje(msj.id!).catch(() => {}))
        )
      }

      actualizarMsjs()

    } catch (error) {
      console.error('Error al eliminar la sala:', error);
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
    actualizarMsjs,
    salaActiva,
    salas,
    agregarMensaje,
    asignarSala,
    eliminarSala,
    crearSala,
    vaciarChat,
    cambiarNombre,
    isLoading,
  };

  return (
    <SalasContext.Provider value={value}>
      {children}
    </SalasContext.Provider>
  )
}