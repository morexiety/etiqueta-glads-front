export type Papel = 'ADMIN' | 'GESTOR' | 'OPERADOR'

export interface Usuario {
  id: string
  nome: string
  email: string
  papel: Papel
  organizacaoId: string
  ativo: boolean
}

export interface Loja {
  id: string
  nome: string
  endereco?: string
  ativa: boolean
  _count?: { etiquetas: number; dispositivos: number }
}

export interface ApiErrorBody {
  message: string
}

export type EstadoConservacao = 'FECHADO' | 'ABERTO' | 'MANIPULADO'
export type UnidadeTempo = 'HORAS' | 'DIAS'

export interface RegraValidade {
  id: string
  insumoId: string
  estado: EstadoConservacao
  duracao: number
  unidade: UnidadeTempo
}

export interface GrupoInsumo {
  id: string
  nome: string
  paiId?: string
  pai?: { id: string; nome: string }
  _count?: { filhos: number; insumos: number }
}

export interface Insumo {
  id: string
  nome: string
  unidadeMedida: string
  codigoBarras?: string
  controlado: boolean
  ativo: boolean
  grupoId?: string
  grupo?: { id: string; nome: string }
  regras: RegraValidade[]
}

export type DispositivoStatus = 'ONLINE' | 'OFFLINE'
export type PrintJobStatus = 'PENDENTE' | 'ENVIADO' | 'IMPRESSO' | 'ERRO'

export interface Dispositivo {
  id: string
  nome: string
  status: DispositivoStatus
  ultimoPing?: string
  filaCups: string
}

export interface ImprimirPayload {
  insumoId: string
  estado: EstadoConservacao
  dispositivoId: string
  copias: number
}

export interface ImprimirResponse {
  etiquetaId: string
  jobId: string
  status: 'ENVIADO' | 'PENDENTE'
  dataValidade: string
}

export interface PrintJob {
  id: string
  status: PrintJobStatus
  erro?: string
  concluidoEm?: string
}

export type StatusEtiqueta = 'ATIVA' | 'VENCIDA' | 'DESCARTADA'
export type MotivoDescarte = 'VENCIMENTO' | 'AVARIA' | 'SOBRA' | 'USO_TOTAL' | 'OUTRO'

export interface EtiquetaSemaforo {
  id: string
  estado: EstadoConservacao
  dataValidade: string
  dataInicio: string
  status: StatusEtiqueta
  insumo: { id: string; nome: string; unidadeMedida: string }
}

export interface SemaforoResponse {
  lojaId: string
  geradoEm: string
  totais: { verde: number; amarelo: number; vermelho: number }
  verde: EtiquetaSemaforo[]
  amarelo: EtiquetaSemaforo[]
  vermelho: EtiquetaSemaforo[]
}

export interface DescartePayload {
  motivo: MotivoDescarte
  justificativa?: string
  quantidade?: number
}

export interface RelatorioResponse {
  periodo: { inicio: string; fim: string }
  lojaId: string
  resumo: { totalCriadas: number; totalDescartadas: number; taxaDesperdicio: number }
  porMotivo: Record<string, number>
  porInsumo: Array<{ insumoId: string; nome: string; total: number }>
}

export interface CriarLojaPayload {
  nome: string
  endereco?: string
}

export interface CriarDispositivoResponse {
  deviceId: string
  secret: string
  aviso: string
}
