import { Button } from '@/components/ui/button'

export default function OperacaoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Operação</h1>
      <p className="text-zinc-400">
        Etiquetagem rápida, impressão e controle de validade — Etapas seguintes.
      </p>
      <div className="mt-auto grid gap-3">
        <Button size="lg" className="h-14 text-lg" disabled>
          Nova etiqueta
        </Button>
        <Button size="lg" variant="secondary" className="h-14 text-lg" disabled>
          Reprint
        </Button>
      </div>
    </div>
  )
}
