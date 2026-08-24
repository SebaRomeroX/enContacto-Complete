export type UserRol = 'admin' | 'user' | 'mod'

export type Usuario = {
  id?: string,
  foto: string,
  nombre: string,
  contra: string,
  rol: UserRol,
}

export type UsuarioPopulate = {
  id: string,
  nombre: string,
  foto: string,
}

export type SalaPopulate = {
  id: string,
  nombre: string,
}

export type MensajeType = {
  mensaje: string,
  usuarioId: string | UsuarioPopulate | null,
  salaId: string | SalaPopulate | null,
  id?: string,
  date?: string,
}

export type Sala = {
  nombre: string,
  id?: string,
  listaMiembros?: string[],
}

export type Credentials = {
  nombre: string,
  contra: string,
}