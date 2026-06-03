import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import SelectLojaPage from '@/pages/SelectLojaPage'
import OperacaoPage from '@/pages/operacao/OperacaoPage'
import CatalogoPage from '@/pages/admin/CatalogoPage'
import SemaforoPage from '@/pages/admin/SemaforoPage'
import RelatoriosPage from '@/pages/admin/RelatoriosPage'
import LojasPage from '@/pages/admin/LojasPage'
import AppLayout from '@/components/layout/AppLayout'
import OperacaoLayout from '@/components/layout/OperacaoLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: '/lojas', element: <SelectLojaPage /> },
      {
        element: <OperacaoLayout />,
        children: [
          { path: '/lojas/:lojaId/operacao', element: <OperacaoPage /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: '/admin/catalogo', element: <CatalogoPage /> },
              { path: '/admin/semaforo/:lojaId', element: <SemaforoPage /> },
              { path: '/admin/relatorios/:lojaId', element: <RelatoriosPage /> },
              { path: '/admin/lojas', element: <LojasPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
