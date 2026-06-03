import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiFetch, ApiError } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import type {
  EstadoConservacao,
  GrupoInsumo,
  Insumo,
  UnidadeTempo,
} from '@/lib/types'

// ── Grupos ───────────────────────────────────────────

export function useGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: () => apiFetch<GrupoInsumo[]>('/grupos'),
  })
}

export function useCreateGrupo() {
  return useMutation({
    mutationFn: (data: { nome: string; paiId?: string }) =>
      apiFetch<GrupoInsumo>('/grupos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success('Grupo criado')
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
  })
}

export function useUpdateGrupo() {
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; nome: string; paiId?: string }) =>
      apiFetch<GrupoInsumo>(`/grupos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success('Grupo atualizado')
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
  })
}

export function useDeleteGrupo() {
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/grupos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Grupo excluído')
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast.error('Remova os subgrupos e insumos antes de excluir')
      } else {
        toast.error(err instanceof Error ? err.message : 'Erro ao excluir grupo')
      }
    },
  })
}

// ── Insumos ──────────────────────────────────────────

export function useInsumos(filters?: {
  q?: string
  grupoId?: string
  incluirInativos?: boolean
}) {
  const params = new URLSearchParams()
  if (filters?.q) params.set('q', filters.q)
  if (filters?.grupoId) params.set('grupoId', filters.grupoId)
  if (filters?.incluirInativos) params.set('incluirInativos', 'true')
  const qs = params.toString()

  return useQuery({
    queryKey: ['insumos', filters],
    queryFn: () => apiFetch<Insumo[]>(`/insumos${qs ? `?${qs}` : ''}`),
  })
}

type InsumoPayload = {
  nome: string
  unidadeMedida: string
  grupoId?: string
  codigoBarras?: string
  controlado: boolean
}

export function useCreateInsumo() {
  return useMutation({
    mutationFn: (data: InsumoPayload) =>
      apiFetch<Insumo>('/insumos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] })
    },
  })
}

export function useUpdateInsumo() {
  return useMutation({
    mutationFn: ({ id, ...data }: InsumoPayload & { id: string }) =>
      apiFetch<Insumo>(`/insumos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] })
    },
  })
}

export function useDesativarInsumo() {
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/insumos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Insumo desativado')
      queryClient.invalidateQueries({ queryKey: ['insumos'] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao desativar insumo')
    },
  })
}

// ── Regras ───────────────────────────────────────────

export function useAtualizarRegras() {
  return useMutation({
    mutationFn: ({
      insumoId,
      regras,
    }: {
      insumoId: string
      regras: Array<{
        estado: EstadoConservacao
        duracao: number
        unidade: UnidadeTempo
      }>
    }) =>
      apiFetch<void>(`/insumos/${insumoId}/regras`, {
        method: 'PUT',
        body: JSON.stringify({ regras }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] })
    },
  })
}
