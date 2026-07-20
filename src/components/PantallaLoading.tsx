import { useEffect, useRef, useState } from 'react'
import './PantallaLoading.css'

export const PantallaLoading = ({ isLoading }: { isLoading: boolean }) => {
  const [visible, setVisible] = useState(false)
  const startTime = useRef<number | null>(null)
  const MIN_DURATION = 2200

  useEffect(() => {
    if (isLoading) {
      startTime.current = Date.now()
      setVisible(true)
    } else if (startTime.current !== null) {
      const elapsed = Date.now() - startTime.current
      const remaining = Math.max(0, MIN_DURATION - elapsed)
      const timer = setTimeout(() => {
        setVisible(false)
        startTime.current = null
      }, remaining)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!visible) return null

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
