import { useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { getRecentes, useInsumosOperacao } from '@/hooks/useOperacao'
import type { Insumo } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  onSelect: (insumo: Insumo) => void
}

function SkeletonCards() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="min-h-[64px] animate-pulse rounded-xl bg-zinc-800"
        />
      ))}
    </div>
  )
}

function InsumoCard({
  insumo,
  onSelect,
}: {
  insumo: Insumo
  onSelect: (insumo: Insumo) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(insumo)}
      className={cn(
        'flex min-h-[64px] w-full cursor-pointer flex-col justify-center rounded-xl',
        'bg-zinc-800 px-4 py-3 text-left transition-transform active:scale-95',
        'hover:bg-zinc-700',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-lg font-semibold">{insumo.nome}</span>
        <span className="shrink-0 text-sm text-zinc-400">
          {insumo.unidadeMedida}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-sm text-zinc-400">
          {insumo.grupo?.nome ?? 'Sem grupo'}
        </span>
        {insumo.controlado && (
          <span className="text-xs font-medium text-amber-400">
            🔒 Controlado
          </span>
        )}
      </div>
    </button>
  )
}

export function InsumoSearch({ onSelect }: Props) {
  const [busca, setBusca] = useState('')
  const [debouncedBusca] = useDebounce(busca, 300)
  const q = debouncedBusca.trim() || undefined

  const { data: insumos = [], isLoading } = useInsumosOperacao(q)

  const recentes = useMemo(() => {
    if (q) return []
    const ids = getRecentes()
    const byId = new Map(insumos.map((i) => [i.id, i]))
    return ids.map((id) => byId.get(id)).filter((i): i is Insumo => !!i)
  }, [insumos, q])

  const listaPrincipal = useMemo(() => {
    if (!q) {
      const recentIds = new Set(recentes.map((i) => i.id))
      return insumos.filter((i) => !recentIds.has(i.id))
    }
    return insumos
  }, [insumos, q, recentes])

  return (
    <div className="space-y-4">
      <Input
        autoFocus
        placeholder="Buscar produto ou código de barras..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="h-14 border-zinc-600 bg-zinc-800 text-lg text-white placeholder:text-zinc-500"
      />

      {isLoading && <SkeletonCards />}

      {!isLoading && (
        <>
          {recentes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Recentes</p>
              {recentes.map((insumo) => (
                <InsumoCard key={insumo.id} insumo={insumo} onSelect={onSelect} />
              ))}
            </div>
          )}

          {listaPrincipal.length > 0 && (
            <div className="space-y-2">
              {recentes.length > 0 && !q && (
                <p className="text-sm text-zinc-400">Todos</p>
              )}
              {listaPrincipal.map((insumo) => (
                <InsumoCard key={insumo.id} insumo={insumo} onSelect={onSelect} />
              ))}
            </div>
          )}

          {insumos.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-zinc-300">Nenhum produto encontrado</p>
              <p className="mt-2 text-sm text-zinc-500">
                Cadastre insumos com regras de validade no catálogo.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
