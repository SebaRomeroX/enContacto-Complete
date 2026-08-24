import './paginaChats.css'
import { ListaSalas } from './ListaSalas'
import { SalaChat } from './sala/SalaChat'
import { useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { useContext, useEffect } from 'react'
import { UsuarioContext } from '../../context/usuarioContext.tsx'
import { SalasContext } from '../../context/salasContext.tsx'
import { PantallaLoading } from '../PantallaLoading'
import { Header } from '../Header'


export const PaginaChats = () => {
  const navigate = useNavigate()
  const { isLoading: usersLoading } = useContext(UsuarioContext)
  const { asignarSala, isLoading: salasLoading, aviso, descartarAviso } = useContext(SalasContext)
  const token = localStorage.getItem('token')

  const loading = token && (usersLoading || salasLoading)

  useEffect(() => {
    if (!token) navigate(RUTAS.login)
    return () => asignarSala(undefined)
  }, [token, navigate])

  if (loading) return <PantallaLoading isLoading={loading} />

  return (
    <section className='pagina-chats fade-in'>
      <Header />
      {aviso && (
        <section className='aviso-banner' role='alert'>
          <p>{aviso}</p>
          <button aria-label='Cerrar aviso' onClick={descartarAviso}>X</button>
        </section>
      )}
      <section className='pantalla' >
        <ListaSalas />
        <SalaChat />
      </section>
    </section>
  )
}