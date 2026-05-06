import type { Sala, Usuario } from "../types/types"

export const USUARIOS: Usuario[] = [
  { id: 'user-a65973f5-eeea-49f4-a961-524469665658',
    foto: '53.jpg',
    nombre: 'Mariela Vallejo',
    contra: '777',
    rol: 'user'
  },
  { id: 'user-d22dee92-ec52-465f-9d70-19f79972715b',
    foto: '0.png',
    nombre: 'Administrador',
    contra: '333',
    rol: 'admin'
  },
]

export const SALAS: Sala[] = [
  {
    nombre: 'Tutorial',
    id: 'sala-f54828dc-35af-485a-ac9e-9b776f4afa1a',
    chat: [
      {
        mensaje: 'Esta es la version completa de la app',
        usuarioId: USUARIOS[0].id
      },
      {
        mensaje: 'Estos mensajes estan hardcodeados en el front',
        usuarioId: USUARIOS[0].id
      },
    ]
  },
]