import { useContext } from "react"
import { SalasContext } from "../../../context/salasContext"

type FichaProp = { nombre: string, id: string }
export const FichaSala = ({ nombre, id }: FichaProp) => {
  const { eliminarSala } = useContext(SalasContext)
  // const [editar, setEditar] = useState(false)

  return (
    <li>
      <section>
        <h4>{nombre}</h4>
      </section>
      <section className='botones'>
        <button className="boton" onClick={() => eliminarSala(id)}>Eliminar sala</button>
        {/* <button className="boton" onClick={() => vaciarChat(id)}>Borrar mensajes</button>
        { editar
          ? <EditForm nombre={nombre} id={id} ocultar={() => setEditar(false)} />
          : <button className="boton" onClick={() => setEditar(true)}>Cambiar nombre</button>
        } */}
      </section>
  </li>
  )
}