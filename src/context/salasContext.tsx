import { createContext, useEffect, useState, type PropsWithChildren } from 'react'
import type { Sala } from '../types/types';
import { getMensajes, postMensaje, deleteMensaje } from '../services/mensajes'
import { getSalas, postSalas, deleteSalas } from '../services/salas'


interface SalaContextType {
  salaActiva: Sala | undefined;
  salas: Sala[];
  agregarMensaje: (texto: string, id: string) => void;
  asignarSala: (id: string) => void;
  eliminarSala: (id: string) => void;
  crearSala: (nombre: string) => void;
  vaciarChat: (id: string) => void;
  cambiarNombre: (nombre: string, id: string) => void;
}

const defaultContextValue: SalaContextType = {
  salaActiva: undefined,
  salas: [],
  agregarMensaje: () => {},
  asignarSala: () => {},
  eliminarSala: () => {},
  crearSala: () => {},
  vaciarChat: () => {},
  cambiarNombre: () => {}
};

export const SalasContext = createContext<SalaContextType>(defaultContextValue);

export const SalasProvider = ({ children } : PropsWithChildren) => {
  const [salas, setSalas] = useState([])
  const [salaActiva, setSalaActiva] = useState<Sala | undefined>()
  const [listaMensajes, setMensajes] = useState([])
  
  useEffect(() => {
    getSalas().then(res => setSalas(res))
    getMensajes().then(res => setMensajes(res))
    console.log('api salas');
  }, [])

  console.log('mensajes :', listaMensajes);

  // MENSAJES
  function asignarSala (id: string) {
    const newSala = salas.find(salaDB => salaDB.id === id)
    setSalaActiva(newSala)
  }
  
  async function agregarMensaje (mensaje: string, usuarioId: string, salaId: string) {
    if (!salaActiva) return

    const newMensaje = { usuarioId, mensaje, salaId }
    
    // ARREGLAR ESTO NO ESTA ESPERANDO !!!
    await postMensaje(newMensaje)
    setMensajes(prevMsj => prevMsj.concat(newMensaje))
  }


  // SALAS
  async function eliminarSala(id: string) {
  try {
    const mensajesAEliminar = listaMensajes.filter(msj => msj.salaId === id);
    
    await Promise.all(mensajesAEliminar.map(msj => deleteMensaje(msj.id)));
    
    const mensajesRestantes = listaMensajes.filter(msj => msj.salaId !== id);
    setMensajes(mensajesRestantes);

    await deleteSalas(id);
    
    const nuevasSalas = salas.filter(sala => sala.id !== id);
    setSalas(nuevasSalas);
    
  } catch (error) {
    console.error('Error al eliminar la sala:', error);
  }
}

  function crearSala (nombre: string) {
    if (salas.find(sala => sala.nombre === nombre)) return

    const newSala = { nombre }
    postSalas(newSala)
    setSalas([...salas, newSala])
  }




  // DE MOMENTO NO USAMOS ------------------------------
  function vaciarChat (id: Id) {
    const newSalas = salas.map(sala => {
      if (sala.id === id) {
        return {...sala, chat: []}
      }
      return sala
    })

    setSalas(newSalas)
  }

  function cambiarNombre (nombre: string, id: Id) {
    const newSalas = salas.map(sala => {
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