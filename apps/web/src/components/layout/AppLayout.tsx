import { Link, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/admin/catalogo', label: 'Catálogo' },
  { to: '/admin/semaforo/loja-demo', label: 'Semáforo' },
  { to: '/admin/relatorios/loja-demo', label: 'Relatórios' },
]

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/30 md:flex">
        <div className="border-b px-4 py-5">
          <span className="text-lg font-semibold">Selo</span>
          <p className="text-xs text-muted-foreground">Administração</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/login">
              <LogOut className="size-4" />
              Sair
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
          <span className="font-semibold">Selo</span>
          <nav className="flex gap-2 text-sm">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
