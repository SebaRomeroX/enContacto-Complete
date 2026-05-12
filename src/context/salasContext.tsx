import { useEffect, useState, type PropsWithChildren } from 'react'
import type { MensajeType, Sala } from '../types/types';
import { getMensajes, postMensaje, deleteMensaje } from '../services/mensajes'
import { getSalas, postSalas, deleteSalas } from '../services/salas'
import { SalasContext, type SalaContextType } from './listOfContexts';



export const SalasProvider = ({ children } : PropsWithChildren) => {
  const [salas, setSalas] = useState<Sala[] | undefined>([])
  const [salaActiva, setSalaActiva] = useState<Sala | undefined>(undefined)
  const [listaMensajes, setMensajes] = useState<MensajeType[] | undefined>([])

  useEffect(() => {
    getSalas().then(res => setSalas(res))
    getMensajes().then(res => setMensajes(res))
    console.log('api salas');
  }, [])

  console.log('mensajes :', listaMensajes);

  // MENSAJES
  function asignarSala (id: string) {
    const newSala = salas?.find(salaDB => salaDB.id === id)
    setSalaActiva(newSala)
  }
  
  async function agregarMensaje (mensaje: string, usuarioId: string, salaId: string) {
    if (!salaActiva) return

    const newMensaje = { usuarioId, mensaje, salaId }
    
    // ARREGLAR ESTO NO ESTA ESPERANDO !!!
    await postMensaje(newMensaje)
    setMensajes(prevMsj => prevMsj?.concat(newMensaje))
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

  function crearSala (nombre: string) {
    if (salas?.find(sala => sala.nombre === nombre)) return

    const newSala = { nombre }
    postSalas(newSala)
    setSalas(prev => prev?.concat(newSala))
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