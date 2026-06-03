import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiFetch, ApiError } from '@/lib/api'
import type {
  CriarDispositivoResponse,
  CriarLojaPayload,
  DescartePayload,
  Loja,
  RelatorioResponse,
  SemaforoResponse,
} from '@/lib/types'

export function useSemaforo(lojaId: string) {
  return useQuery({
    queryKey: ['semaforo', lojaId],
    queryFn: () => apiFetch<SemaforoResponse>(`/lojas/${lojaId}/semaforo`),
    refetchInterval: 30_000,
  })
}

export function useDescartar(lojaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      etiquetaId,
      ...payload
    }: DescartePayload & { etiquetaId: string }) =>
      apiFetch(`/lojas/${lojaId}/etiquetas/${etiquetaId}/descartar`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success('Etiqueta descartada')
      qc.invalidateQueries({ queryKey: ['semaforo', lojaId] })
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : 'Erro ao descartar'
      toast.error(msg)
    },
  })
}

export function useRelatorio(
  lojaId: string,
  params: { inicio: string; fim: string } | null,
) {
  return useQuery({
    queryKey: ['relatorio', lojaId, params],
    queryFn: () =>
      apiFetch<RelatorioResponse>(
        `/lojas/${lojaId}/relatorio/desperdicio?inicio=${params!.inicio}&fim=${params!.fim}`,
      ),
    enabled: !!params,
  })
}

export function useLoja(lojaId: string) {
  return useQuery({
    queryKey: ['loja', lojaId],
    queryFn: () => apiFetch<Loja>(`/lojas/${lojaId}`),
  })
}

export function useCreateLoja() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CriarLojaPayload) =>
      apiFetch<Loja>('/lojas', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success('Loja criada')
      qc.invalidateQueries({ queryKey: ['lojas'] })
    },
  })
}

export function useCreateDispositivo(lojaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { nome: string; filaCups?: string }) =>
      apiFetch<CriarDispositivoResponse>(`/lojas/${lojaId}/dispositivos`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dispositivos', lojaId] })
    },
  })
}
