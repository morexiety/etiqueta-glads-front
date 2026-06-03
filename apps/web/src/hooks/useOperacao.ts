import { useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  Dispositivo,
  ImprimirPayload,
  ImprimirResponse,
  Insumo,
  PrintJob,
  RegraValidade,
} from '@/lib/types'

export function useInsumosOperacao(q?: string) {
  return useQuery({
    queryKey: ['insumos-operacao', q],
    queryFn: async () => {
      const all = await apiFetch<Insumo[]>(
        `/insumos${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      )
      return all.filter((i) => i.ativo && i.regras.length > 0)
    },
    staleTime: 60_000,
  })
}

export function useDispositivos(lojaId: string) {
  return useQuery({
    queryKey: ['dispositivos', lojaId],
    queryFn: () => apiFetch<Dispositivo[]>(`/lojas/${lojaId}/dispositivos`),
    refetchInterval: 30_000,
  })
}

export function useImprimir(lojaId: string) {
  return useMutation({
    mutationFn: (payload: ImprimirPayload) =>
      apiFetch<ImprimirResponse>(`/lojas/${lojaId}/etiquetas/imprimir`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  })
}

export function usePrintJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['print-jobs', jobId],
    queryFn: () => apiFetch<PrintJob>(`/print-jobs/${jobId}`),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'IMPRESSO' || status === 'ERRO') return false
      return 1000
    },
  })
}

export function calcularValidade(regra: RegraValidade, inicio = new Date()): Date {
  const ms =
    regra.unidade === 'HORAS'
      ? regra.duracao * 3_600_000
      : regra.duracao * 86_400_000
  return new Date(inicio.getTime() + ms)
}

export function getRecentes(): string[] {
  try {
    return JSON.parse(localStorage.getItem('selo:recent-insumos') ?? '[]')
  } catch {
    return []
  }
}

export function addRecente(insumoId: string): void {
  const atual = getRecentes().filter((id) => id !== insumoId)
  localStorage.setItem(
    'selo:recent-insumos',
    JSON.stringify([insumoId, ...atual].slice(0, 5)),
  )
}
