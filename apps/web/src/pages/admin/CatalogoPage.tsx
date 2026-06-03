import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GruposTab } from '@/components/catalogo/GruposTab'
import { InsumosTab } from '@/components/catalogo/InsumosTab'

export default function CatalogoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Catálogo</h1>
      <Tabs defaultValue="insumos">
        <TabsList>
          <TabsTrigger value="insumos">Insumos</TabsTrigger>
          <TabsTrigger value="grupos">Grupos</TabsTrigger>
        </TabsList>
        <TabsContent value="insumos" className="mt-4">
          <InsumosTab />
        </TabsContent>
        <TabsContent value="grupos" className="mt-4">
          <GruposTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
