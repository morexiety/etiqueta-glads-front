import { Link, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OperacaoLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
      <header className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">Selo</p>
          <p className="font-semibold">Loja (placeholder)</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
          asChild
        >
          <Link to="/login" aria-label="Sair">
            <LogOut className="size-5" />
          </Link>
        </Button>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
