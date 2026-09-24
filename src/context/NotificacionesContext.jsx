import { createContext, useContext, useState } from 'react'

const mockNotificaciones = [
  { id: 1, tipo: 'vencimiento', titulo: 'Vencimiento crítico', mensaje: 'ART Colectiva de Constructora Sur SRL vence en 2 días', cliente: 'Constructora Sur SRL', fecha: '2026-05-08T10:30:00', leido: false, urgencia: 'alta' },
  { id: 2, tipo: 'documento', titulo: 'Nuevo documento subido', mensaje: 'Constructora Sur SRL subió "Liquidación mayo 2026"', cliente: 'Constructora Sur SRL', fecha: '2026-05-08T09:15:00', leido: false, urgencia: null },
  { id: 3, tipo: 'vencimiento', titulo: 'Vencimiento próximo', mensaje: 'Habilitación municipal de Desarrollos Norte SA vence en 5 días', cliente: 'Desarrollos Norte SA', fecha: '2026-05-07T16:45:00', leido: false, urgencia: 'media' },
  { id: 4, tipo: 'usuario', titulo: 'Cliente incorporado', mensaje: 'Arq. Torres & Asoc. completó su registro en la plataforma', cliente: 'Arq. Torres & Asoc.', fecha: '2026-05-07T08:00:00', leido: true, urgencia: null },
  { id: 5, tipo: 'documento', titulo: 'Documento actualizado', mensaje: 'Se actualizó el plano de obra del proyecto Torres del Parque', cliente: 'Torres del Parque SA', fecha: '2026-05-06T14:20:00', leido: true, urgencia: null },
  { id: 6, tipo: 'actividad', titulo: 'Ficha actualizada', mensaje: 'Grupo Inmobiliario GR actualizó los datos de obra', cliente: 'Grupo Inmobiliario GR', fecha: '2026-05-05T11:00:00', leido: true, urgencia: null },
  { id: 7, tipo: 'actividad', titulo: 'Nuevo comentario', mensaje: 'Torres del Parque SA agregó una nota en su ficha', cliente: 'Torres del Parque SA', fecha: '2026-05-04T18:30:00', leido: true, urgencia: null },
]

const NotificacionesContext = createContext(null)

export function NotificacionesProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState(mockNotificaciones)

  const unreadCount = notificaciones.filter(n => !n.leido).length

  function marcarLeida(id) {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n))
  }

  function marcarTodasLeidas() {
    setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })))
  }

  function agregarActividad({ tipo = 'actividad', titulo, mensaje, cliente = '' }) {
    setNotificaciones(prev => [{
      id: Date.now(),
      tipo,
      titulo,
      mensaje,
      cliente,
      fecha: new Date().toISOString(),
      leido: false,
      urgencia: null,
    }, ...prev])
  }

  return (
    <NotificacionesContext.Provider value={{ notificaciones, unreadCount, marcarLeida, marcarTodasLeidas, agregarActividad }}>
      {children}
    </NotificacionesContext.Provider>
  )
}

export function useNotificaciones() {
  const ctx = useContext(NotificacionesContext)
  if (!ctx) throw new Error('useNotificaciones must be used within NotificacionesProvider')
  return ctx
}
