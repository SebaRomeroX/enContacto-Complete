export type IdClase = 'user' | 'sala'
export type Id = `${IdClase}-${string}-${string}-${string}-${string}-${string}`;

export type UserRol = 'admin' | 'user'

export type Usuario = {
  id: Id,
  foto: string,
  nombre: string,
  contra: string,
  rol: UserRol
}

export type MensajeType = {
  mensaje: string,
  usuarioId: Id,
}
export type Sala = {
  nombre: string,
  id: Id,
  chat: MensajeType[]
}