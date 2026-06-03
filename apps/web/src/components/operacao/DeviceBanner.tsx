import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDispositivos } from '@/hooks/useOperacao'

interface Props {
  lojaId: string
  dispositivoId: string | null
  onSelect: (id: string) => void
}

export function DeviceBanner({ lojaId, dispositivoId, onSelect }: Props) {
  const { data: dispositivos = [], isLoading } = useDispositivos(lojaId)

  useEffect(() => {
    if (dispositivos.length === 1 && !dispositivoId) {
      onSelect(dispositivos[0].id)
    }
  }, [dispositivos, dispositivoId, onSelect])

  if (isLoading) {
    return (
      <div className="border-b border-zinc-700 px-4 py-2">
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-700" />
      </div>
    )
  }

  if (dispositivos.length === 0) {
    return (
      <div className="border-b border-red-900/50 bg-red-950/80 px-4 py-2 text-sm text-red-200">
        Nenhuma impressora cadastrada
      </div>
    )
  }

  const selecionado = dispositivos.find((d) => d.id === dispositivoId)
  const offlineAviso = selecionado?.status === 'OFFLINE' && (
    <div className="border-b border-amber-900/50 bg-amber-950/80 px-4 py-2 text-sm text-amber-100">
      ⚠️ Impressora offline — verifique o Raspberry Pi
    </div>
  )

  if (dispositivos.length > 1) {
    return (
      <>
        {offlineAviso}
        <div className="flex items-center gap-2 border-b border-zinc-700 px-4 py-2">
          <span className="shrink-0 text-sm text-zinc-400">🖨️</span>
          <Select
            value={dispositivoId ?? undefined}
            onValueChange={onSelect}
          >
            <SelectTrigger className="h-9 border-zinc-600 bg-zinc-800 text-sm text-white">
              <SelectValue placeholder="Selecionar impressora" />
            </SelectTrigger>
            <SelectContent>
              {dispositivos.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nome} ({d.status === 'ONLINE' ? 'online' : 'offline'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    )
  }

  if (offlineAviso) {
    return offlineAviso
  }

  if (dispositivos.length === 1) {
    const d = dispositivos[0]
    return (
      <div className="border-b border-zinc-700 px-4 py-2 text-sm text-zinc-400">
        🖨️ {d.nome}
        <span
          className={
            d.status === 'ONLINE' ? 'ml-2 text-green-400' : 'ml-2 text-amber-400'
          }
        >
          {d.status === 'ONLINE' ? '● online' : '● offline'}
        </span>
      </div>
    )
  }

  return null
}
