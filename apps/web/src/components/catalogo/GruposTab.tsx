import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useDeleteGrupo, useGrupos } from '@/hooks/useCatalogo'
import type { GrupoInsumo } from '@/lib/types'
import { GrupoFormDialog } from '@/components/catalogo/GrupoFormDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
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
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 5 }).map((__, j) => (
            <TableCell key={j}>
              <div className="h-4 animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function GruposTab() {
  const { data: grupos = [], isLoading } = useGrupos()
  const deleteGrupo = useDeleteGrupo()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GrupoInsumo | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(grupo: GrupoInsumo) {
    setEditing(grupo)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Novo grupo
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Grupo pai</TableHead>
              <TableHead className="text-right">Subgrupos</TableHead>
              <TableHead className="text-right">Insumos</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <SkeletonRows />}
            {!isLoading && grupos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <p className="text-muted-foreground">Nenhum grupo cadastrado</p>
                  <Button variant="link" className="mt-2" onClick={openCreate}>
                    Criar primeiro grupo
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              grupos.map((grupo) => (
                <TableRow key={grupo.id}>
                  <TableCell className="font-medium">{grupo.nome}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {grupo.pai?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {grupo._count?.filhos ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {grupo._count?.insumos ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar grupo"
                        onClick={() => openEdit(grupo)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Excluir grupo"
                        onClick={() => setDeleteId(grupo.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <GrupoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        grupo={editing}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O grupo será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteGrupo.mutate(deleteId, { onSettled: () => setDeleteId(null) })
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
