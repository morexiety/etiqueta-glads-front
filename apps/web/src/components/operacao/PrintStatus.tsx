import { useEffect } from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { usePrintJobStatus } from '@/hooks/useOperacao'

interface Props {
  jobId: string | null
  onReset: () => void
}

export function PrintStatus({ jobId, onReset }: Props) {
  const { data: job, isLoading } = usePrintJobStatus(jobId)
  const status = job?.status

  useEffect(() => {
    if (status === 'IMPRESSO') {
      const t = setTimeout(onReset, 1500)
      return () => clearTimeout(t)
    }
  }, [status, onReset])

  if (!jobId || (isLoading && !job)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Loader2 className="size-16 animate-spin text-zinc-400" />
        <p className="text-lg text-zinc-300">Enviando para a impressora...</p>
      </div>
    )
  }

  if (status === 'PENDENTE' || status === 'ENVIADO') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Loader2 className="size-16 animate-spin text-zinc-400" />
        <p className="text-lg text-zinc-300">Enviando para a impressora...</p>
      </div>
    )
  }

  if (status === 'IMPRESSO') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <CheckCircle className="size-24 text-green-500" strokeWidth={1.5} />
        <p className="text-2xl font-semibold text-green-400">
          Impresso com sucesso!
        </p>
      </div>
    )
  }

  if (status === 'ERRO') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-4">
        <AlertCircle className="size-24 text-red-500" strokeWidth={1.5} />
        <p className="text-center text-lg text-red-300">
          {job?.erro ?? 'Erro na impressão'}
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <button
            type="button"
            onClick={onReset}
            className="h-14 rounded-xl bg-zinc-700 text-lg font-semibold hover:bg-zinc-600"
          >
            Tentar novamente
          </button>
          <button
            type="button"
            onClick={onReset}
            className="h-14 rounded-xl border border-zinc-600 text-lg text-zinc-300 hover:bg-zinc-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Loader2 className="size-16 animate-spin text-zinc-400" />
      <p className="text-lg text-zinc-300">Aguardando impressora...</p>
    </div>
  )
}
