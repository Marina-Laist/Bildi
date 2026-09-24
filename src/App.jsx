import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificacionesProvider } from './context/NotificacionesContext'
import { AppLayout } from './components/layout/AppLayout'
import Login from './pages/compartidas/Login'
import Dashboard from './pages/estudio/Dashboard'
import ClientesLista from './pages/estudio/ClientesLista'
import AgregarCliente from './pages/estudio/AgregarCliente'
import DesarrollistaFicha from './pages/desarrollista/Ficha'
import ConstructoraFicha from './pages/constructora/Ficha'
import Documentos from './pages/compartidas/Documentos'
import Notificaciones from './pages/compartidas/Notificaciones'

const queryClient = new QueryClient()

function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && profile && !roles.includes(profile.rol)) {
    const defaultRoutes = { estudio: '/estudio', desarrollista: '/desarrollista', constructora: '/constructora' }
    return <Navigate to={defaultRoutes[profile.rol] || '/login'} replace />
  }

  return children
}

function RoleRedirect() {
  const { user, profile, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/login" replace />
  const routes = { estudio: '/estudio', desarrollista: '/desarrollista', constructora: '/constructora' }
  return <Navigate to={routes[profile.rol] || '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/estudio" element={<ProtectedRoute roles={['estudio']}><Dashboard /></ProtectedRoute>} />
        <Route path="/estudio/clientes" element={<ProtectedRoute roles={['estudio']}><ClientesLista /></ProtectedRoute>} />
        <Route path="/estudio/clientes/nuevo" element={<ProtectedRoute roles={['estudio']}><AgregarCliente /></ProtectedRoute>} />
        <Route path="/desarrollista" element={<ProtectedRoute roles={['estudio','desarrollista']}><DesarrollistaFicha /></ProtectedRoute>} />
        <Route path="/desarrollista/:id" element={<ProtectedRoute roles={['estudio','desarrollista']}><DesarrollistaFicha /></ProtectedRoute>} />
        <Route path="/constructora" element={<ProtectedRoute roles={['estudio','constructora']}><ConstructoraFicha /></ProtectedRoute>} />
        <Route path="/constructora/:id" element={<ProtectedRoute roles={['estudio','constructora']}><ConstructoraFicha /></ProtectedRoute>} />
        <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
        <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificacionesProvider>
            <AppRoutes />
          </NotificacionesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
