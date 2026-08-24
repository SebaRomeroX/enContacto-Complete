import { createContext } from "react";
import type { MensajeType, Sala } from "../types/types";

export interface SalaContextType {
  listaMensajes: MensajeType[] | undefined
  totalMensajes: number
  salaActiva: Sala | undefined;
  salas: Sala[] | undefined;
  aviso: string | undefined;
  agregarMensaje: (mensaje: string, usuarioId: string, salaId: string) => Promise<boolean>;
  actualizarMsjs: () => void
  cargarMasMensajes: () => void
  asignarSala: (id: string | undefined) => void;
  eliminarSala: (id: string) => Promise<void>;
  crearSala: (nombre: string, listaMiembros?: string[]) => Promise<void>;
  agregarMiembros: (salaId: string, usuarioIds: string[]) => Promise<void>;
  quitarMiembro: (salaId: string, usuarioId: string) => Promise<void>;
  vaciarChat: (id: string) => void;
  cambiarNombre: (nombre: string, id: string) => void;
  descartarAviso: () => void;
  isLoading: boolean
}

const defaultSalasValue: SalaContextType = {
  listaMensajes: undefined,
  totalMensajes: 0,
  salaActiva: undefined,
  salas: [],
  aviso: undefined,
  agregarMensaje: async () => false,
  asignarSala: () => {},
  eliminarSala: async () => {},
  crearSala: async () => {},
  agregarMiembros: async () => {},
  quitarMiembro: async () => {},
  vaciarChat: () => {},
  cambiarNombre: () => {},
  descartarAviso: () => {},
  actualizarMsjs: () => {},
  cargarMasMensajes: () => {},
  isLoading: true,
};

export const SalasContext = createContext<SalaContextType>(defaultSalasValue);
