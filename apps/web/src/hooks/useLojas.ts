import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Loja } from '@/lib/types'

export function useLojas() {
  return useQuery({
    queryKey: ['lojas'],
    queryFn: () => apiFetch<Loja[]>('/lojas'),
  })
}
