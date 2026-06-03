import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Archive, Lock, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { InsumoFormDialog } from '@/components/catalogo/InsumoFormDialog'
import {
  useDesativarInsumo,
  useGrupos,
  useInsumos,
} from '@/hooks/useCatalogo'
import type { Insumo } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
            <TableCell key={j}>
              <div className="h-4 animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function InsumosTab() {
  const [busca, setBusca] = useState('')
  const [debouncedBusca] = useDebounce(busca, 300)
  const [grupoId, setGrupoId] = useState<string>('all')
  const [verInativos, setVerInativos] = useState(false)

  const { data: grupos = [] } = useGrupos()
  const { data: insumos = [], isLoading } = useInsumos({
    q: debouncedBusca || undefined,
    grupoId: grupoId !== 'all' ? grupoId : undefined,
    incluirInativos: verInativos || undefined,
  })
  const desativarInsumo = useDesativarInsumo()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Insumo | undefined>()

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(insumo: Insumo) {
    setEditing(insumo)
    setDialogOpen(true)
  }

  function handleDesativar(id: string) {
    toast('Desativar insumo?', {
      action: {
        label: 'Confirmar',
        onClick: () => desativarInsumo.mutate(id),
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar insumo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={grupoId} onValueChange={setGrupoId}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {grupos.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              id="ver-inativos"
              checked={verInativos}
              onCheckedChange={setVerInativos}
            />
            <Label htmlFor="ver-inativos" className="text-sm font-normal">
              Ver inativos
            </Label>
          </div>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="size-4" />
          Novo insumo
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Controlado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <SkeletonRows />}
            {!isLoading && insumos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <p className="text-muted-foreground">Nenhum insumo encontrado</p>
                  <Button variant="link" className="mt-2" onClick={openCreate}>
                    Criar insumo
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              insumos.map((item) => (
                <TableRow
                  key={item.id}
                  className={!item.ativo ? 'text-muted-foreground' : undefined}
                >
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.grupo?.nome ?? '—'}</TableCell>
                  <TableCell>{item.unidadeMedida}</TableCell>
                  <TableCell>
                    {item.controlado ? (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="size-3" />
                        Sim
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.ativo ? (
                      <Badge className="border-transparent bg-green-100 text-green-800 hover:bg-green-100">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar insumo"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      {item.ativo && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Desativar insumo"
                          onClick={() => handleDesativar(item.id)}
                        >
                          <Archive className="size-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <InsumoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        insumo={editing}
        grupos={grupos}
      />
    </div>
  )
}
