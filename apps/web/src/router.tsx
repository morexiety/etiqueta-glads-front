import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import SelectLojaPage from '@/pages/SelectLojaPage'
import OperacaoPage from '@/pages/operacao/OperacaoPage'
import CatalogoPage from '@/pages/admin/CatalogoPage'
import SemaforoPage from '@/pages/admin/SemaforoPage'
import RelatoriosPage from '@/pages/admin/RelatoriosPage'
import AppLayout from '@/components/layout/AppLayout'
import OperacaoLayout from '@/components/layout/OperacaoLayout'

const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/lojas', element: <SelectLojaPage /> },
  {
    element: <OperacaoLayout />,
    children: [
      { path: '/lojas/:lojaId/operacao', element: <OperacaoPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/admin/catalogo', element: <CatalogoPage /> },
      { path: '/admin/semaforo/:lojaId', element: <SemaforoPage /> },
      { path: '/admin/relatorios/:lojaId', element: <RelatoriosPage /> },
    ],
  },
  { path: '*', element: <LoginPage /> },
]

export const router = createBrowserRouter(routes)
