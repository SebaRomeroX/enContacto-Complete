import { createContext, useEffect, useState, type PropsWithChildren } from 'react'
import type { Id, Sala } from '../types/types';
import { crearNewId } from '../utils/crearNewId';
import { SALAS } from '../mocks/mock';
import { getMensajes, postMensaje } from '../services/mensajes'

interface SalaContextType {
  salaActiva: Sala | undefined;
  salas: Sala[];
  agregarMensaje: (texto: string, id: Id) => void;
  asignarSala: (id: Id) => void;
  eliminarSala: (id: Id) => void;
  crearSala: (nombre: string) => void;
  vaciarChat: (id: Id) => void;
  cambiarNombre: (nombre: string, id: Id) => void;
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
  const [salas, setSalas] = useState(SALAS)
  const [salaActiva, setSalaActiva] = useState<Sala | undefined>()



  // RENDER
  console.log('Sala: ', salaActiva)



  // MENSAJES
  function asignarSala (id: Id) {
    // const newSala = salas.find(salaDB => salaDB.id === id)
    // setSalaActiva(newSala)
    getMensajes().then(res => setSalaActiva(res))
  }
  
  async function agregarMensaje (texto: string, id: Id) {
    if (!salaActiva) return

    // TEMPORAL
    const salaId = 'sala-f54828dc-35af-485a-ac9e-9b776f4afa1a'
    //---------

    const newMensaje = { usuarioId: id, mensaje: texto, salaId }


    
    // ARREGLAR ESTO NO ESTA ESPERANDO !!!
    postMensaje(newMensaje)
    setSalaActiva(prevMsj => prevMsj.concat(newMensaje))
  }




  // SALAS
  function eliminarSala (id: Id) {
    const newSalas = salas.filter(sala => sala.id !== id)
    setSalas(newSalas)
  }

  function crearSala (nombre: string) {
    if (salas.find(sala => sala.nombre === nombre)) return

    const newId = crearNewId('sala')
    const newSala = { nombre, id: newId, chat: [] }
    setSalas([...salas, newSala])
  }

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



  // SALIDA
  const value: SalaContextType = {
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