import './PantallaLoading.css'

export const PantallaLoading = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null

  return (
    <div className='pantalla-loading'>
      <div className='loading-content'>
        <h1 className='loading-marca'>enContacto</h1>
        <p className='loading-slogan'>Tu equipo. Siempre. enContacto</p>
        <p className='loading-texto'>Cargando...</p>
        <div className='loading-spinner' />
      </div>
    </div>
  )
}
