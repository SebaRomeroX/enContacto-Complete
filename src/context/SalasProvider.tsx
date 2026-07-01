import { useEffect, useState, type PropsWithChildren } from 'react'
import type { MensajeType, Sala } from '../types/types';
import { getMensajes, postMensaje, deleteMensaje } from '../services/mensajes'
import { getSalas, postSalas, deleteSalas } from '../services/salas'
import { SalasContext, type SalaContextType } from './salasContext.tsx';



export const SalasProvider = ({ children } : PropsWithChildren) => {
  const [salas, setSalas] = useState<Sala[] | undefined>([])
  const [salaActiva, setSalaActiva] = useState<Sala | undefined>(undefined)
  const [listaMensajes, setMensajes] = useState<MensajeType[] | undefined>([])

  function actualizarMsjs() {
    // console.log('actualizar msj');
    getMensajes().then(res => setMensajes(res))
  }

  useEffect(() => {
    getSalas().then(res => setSalas(res))

    console.log('precarga msj');
    // lo dejo como precarga, luego ver si es necesario
    actualizarMsjs() 
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
    if (!salaActiva) return

    const newMensaje = { usuarioId, mensaje, salaId }
    
    // ARREGLAR ESTO NO ESTA ESPERANDO !!!
    const savedMensaje = await postMensaje(newMensaje)
    setMensajes(prevMsj => prevMsj?.concat(savedMensaje))
  }



  // SALAS

  async function eliminarSala(id: string) {
  try {
    const mensajesAEliminar = listaMensajes?.filter(msj => msj.salaId === id);
    
    if (mensajesAEliminar) {
      await Promise.all(mensajesAEliminar.map(msj => msj.id && deleteMensaje(msj.id)));
    }
    
    const mensajesRestantes = listaMensajes?.filter(msj => msj.salaId !== id);
    setMensajes(mensajesRestantes);

    await deleteSalas(id);
    
    const nuevasSalas = salas?.filter(sala => sala.id !== id);
    setSalas(nuevasSalas);
    
  } catch (error) {
    console.error('Error al eliminar la sala:', error);
  }
}

  async function crearSala (nombre: string) {
    if (salas?.find(sala => sala.nombre === nombre)) return

    const newSala = { nombre }

    const savedSala = await postSalas(newSala)
    setSalas(prev => prev?.concat(savedSala))
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
    cambiarNombre
  };

  return (
    <SalasContext.Provider value={value}>
      {children}
    </SalasContext.Provider>
  )
}