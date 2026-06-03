import type { EstadoConservacao, Insumo, RegraValidade } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  insumo: Insumo
  onSelect: (estado: EstadoConservacao) => void
}

const ESTADO_CONFIG: Record<
  EstadoConservacao,
  { emoji: string; label: string; className: string }
> = {
  FECHADO: {
    emoji: '📦',
    label: 'FECHADO',
    className: 'bg-blue-700 hover:bg-blue-600',
  },
  ABERTO: {
    emoji: '📂',
    label: 'ABERTO',
    className: 'bg-amber-700 hover:bg-amber-600',
  },
  MANIPULADO: {
    emoji: '🍴',
    label: 'MANIPULADO',
    className: 'bg-orange-700 hover:bg-orange-600',
  },
}

function formatDuracao(regra: RegraValidade): string {
  return `${regra.duracao} ${regra.unidade === 'HORAS' ? 'HORAS' : 'DIAS'}`
}

function formatVenceEm(regra: RegraValidade): string {
  if (regra.unidade === 'HORAS') {
    return regra.duracao === 1 ? 'Vence em 1h' : `Vence em ${regra.duracao}h`
  }
  return regra.duracao === 1 ? 'Vence em 1d' : `Vence em ${regra.duracao}d`
}

export function EstadoSelect({ insumo, onSelect }: Props) {
  const regras = insumo.regras

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold">{insumo.nome}</h2>
      <div className="space-y-3">
        {regras.map((regra) => {
          const cfg = ESTADO_CONFIG[regra.estado]
          return (
            <button
              key={regra.estado}
              type="button"
              onClick={() => onSelect(regra.estado)}
              className={cn(
                'flex min-h-[72px] w-full items-center justify-between rounded-xl px-4',
                'text-xl font-semibold transition-transform active:scale-95',
                cfg.className,
              )}
            >
              <span>
                {cfg.emoji} {cfg.label}
              </span>
              <span className="text-right text-base font-normal opacity-90">
                <span className="block">{formatVenceEm(regra)}</span>
                <span className="text-sm opacity-80">{formatDuracao(regra)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
