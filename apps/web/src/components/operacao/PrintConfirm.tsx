import { Loader2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { calcularValidade, useImprimir } from '@/hooks/useOperacao'
import type { EstadoConservacao, Insumo } from '@/lib/types'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

interface Props {
  insumo: Insumo
  estado: EstadoConservacao
  copias: number
  lojaId: string
  dispositivoId: string
  onCopiaChange: (n: number) => void
  onPrint: (jobId: string) => void
}

const ESTADO_LABEL: Record<EstadoConservacao, string> = {
  FECHADO: 'FECHADO',
  ABERTO: 'ABERTO',
  MANIPULADO: 'MANIPULADO',
}

function formatValidade(date: Date): string {
  const s = date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return s.replace(',', ' às')
}

export function PrintConfirm({
  insumo,
  estado,
  copias,
  lojaId,
  dispositivoId,
  onCopiaChange,
  onPrint,
}: Props) {
  const regra = insumo.regras.find((r) => r.estado === estado)!
  const validade = calcularValidade(regra)
  const imprimir = useImprimir(lojaId)

  function handleImprimir() {
    imprimir.mutate(
      {
        insumoId: insumo.id,
        estado,
        dispositivoId,
        copias,
      },
      {
        onSuccess: (res) => onPrint(res.jobId),
        onError: (err) => {
          const msg =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Erro ao imprimir'
          toast.error(msg)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl bg-zinc-800 p-4">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Produto:</span>
          <span className="text-right font-semibold">{insumo.nome}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Estado:</span>
          <span className="font-semibold">{ESTADO_LABEL[estado]}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Vence em:</span>
          <span className="text-right font-semibold">{formatValidade(validade)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg text-zinc-300">Cópias:</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={copias <= 1}
            onClick={() => onCopiaChange(Math.max(1, copias - 1))}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              'bg-zinc-700 text-2xl font-bold hover:bg-zinc-600',
              'disabled:opacity-40',
            )}
            aria-label="Menos cópias"
          >
            <Minus className="size-6" />
          </button>
          <span className="min-w-[2ch] text-center text-2xl font-bold">{copias}</span>
          <button
            type="button"
            disabled={copias >= 10}
            onClick={() => onCopiaChange(Math.min(10, copias + 1))}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              'bg-zinc-700 text-2xl font-bold hover:bg-zinc-600',
              'disabled:opacity-40',
            )}
            aria-label="Mais cópias"
          >
            <Plus className="size-6" />
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={imprimir.isPending}
        onClick={handleImprimir}
        className={cn(
          'flex h-16 w-full items-center justify-center gap-2 rounded-xl',
          'bg-green-600 text-2xl font-bold hover:bg-green-500',
          'disabled:opacity-60',
        )}
      >
        {imprimir.isPending ? (
          <>
            <Loader2 className="size-8 animate-spin" />
            Enviando...
          </>
        ) : (
          <>🖨️ IMPRIMIR</>
        )}
      </button>
    </div>
  )
}
