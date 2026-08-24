import type { Usuario } from '../../types/types'
import './selectorUsuarios.css'

type SelectorUsuariosProps = {
  usuarios: Usuario[]
  seleccionados: string[]
  onToggle: (id: string) => void
}

export const SelectorUsuarios = ({ usuarios, seleccionados, onToggle }: SelectorUsuariosProps) => {
  return (
    <fieldset className='selector-usuarios'>
      <legend>Miembros iniciales (opcional)</legend>
      <ul>
        {usuarios.map(u =>
          u.id && (
            <li key={u.id}>
              <label>
                <input
                  type='checkbox'
                  checked={seleccionados.includes(u.id)}
                  onChange={() => onToggle(u.id!)}
                />
                <img src={u.foto} alt='' />
                <span>{u.nombre}</span>
              </label>
            </li>
          )
        )}
      </ul>
    </fieldset>
  )
}
