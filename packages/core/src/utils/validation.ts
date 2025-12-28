import type { ConsentProviderProps, ProjectCategoriesConfig } from '../types/types'
import { logger } from './logger'

/**
 * Declaração para uso de require dinâmico em ambientes Node.js.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any

/**
 * Tipo leve de issue para fallback quando Zod não está disponível (produção).
 * @category Types
 * @internal
 */
type LiteIssue = { path: string; message: string }

/**
 * Resultado da validação das props do ConsentProvider.
 * @category Types
 * @since 0.4.0
 */
export type ValidationResult = {
  /** Props saneadas para uso seguro */
  sanitized: {
    categories?: ProjectCategoriesConfig
  }
  /** Avisos não bloqueantes */
  warnings: string[]
  /** Erros bloqueantes */
  errors: string[]
}

/**
 * Detecta se está em ambiente de desenvolvimento (não produção).
 * @category Utils
 * @returns True se for ambiente de desenvolvimento
 * @internal
 */
const isDev = () => typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

/**
 * Remove duplicatas e filtra 'necessary' das categorias habilitadas.
 * @category Utils
 * @param categories Configuração de categorias
 * @returns Categorias saneadas
 * @internal
 */
const sanitizeCategories = (categories: ProjectCategoriesConfig) => {
  const enabled = [...new Set(categories.enabledCategories ?? [])]
  const sanitizedEnabled = enabled.filter((c) => c !== 'necessary')
  return {
    enabled,
    sanitizedEnabled,
    custom: categories.customCategories ?? [],
  }
}

/**
 * Coleta issues de validação usando Zod, se disponível.
 * @category Utils
 * @param z Instância de Zod (ou undefined)
 * @param categories Configuração de categorias
 * @param issues Array de issues a ser preenchido
 * @internal
 */
const collectZodIssues = (
  z: typeof import('zod') | undefined,
  categories: ProjectCategoriesConfig | undefined,
  issues: LiteIssue[],
) => {
  if (!z || !categories) return

  const CustomCategorySchema = z.object({
    id: z.string().min(1, 'customCategories[].id deve ser uma string não vazia'),
    name: z.string().min(1, 'customCategories[].name deve ser uma string não vazia'),
    description: z.string().min(1, 'customCategories[].description deve ser uma string não vazia'),
    essential: z.boolean().optional(),
    cookies: z.array(z.string().min(1)).optional(),
  })

  const ProjectCategoriesConfigSchema = z
    .object({
      enabledCategories: z.array(z.string().min(1)).optional(),
      customCategories: z.array(CustomCategorySchema).optional(),
    })
    .strict()

  const res = ProjectCategoriesConfigSchema.safeParse(categories)
  if (!res.success) {
    res.error.issues.forEach((issue) =>
      issues.push({ path: `categories.${issue.path.join('.')}`, message: issue.message }),
    )
  }

  const customParse = z.array(CustomCategorySchema).safeParse(categories.customCategories ?? [])
  if (!customParse.success) {
    customParse.error.issues.forEach((issue) =>
      issues.push({ path: `customCategories.${issue.path.join('.')}`, message: issue.message }),
    )
  }
}

/**
 * Coleta avisos de configuração de categorias (duplicatas, inválidas, etc).
 * @category Utils
 * @param input Objeto com enabled, sanitizedEnabled e custom
 * @returns Array de avisos
 * @internal
 */
const collectCategoryWarnings = (input: {
  enabled: string[]
  sanitizedEnabled: string[]
  custom: ProjectCategoriesConfig['customCategories']
}): string[] => {
  const warnings: string[] = []
  const { enabled, sanitizedEnabled, custom } = input

  if (enabled.includes('necessary')) {
    warnings.push("'necessary' é sempre incluída automaticamente — remova de enabledCategories.")
  }

  const invalidEnabled = sanitizedEnabled.filter((c) => typeof c !== 'string' || c.trim() === '')
  if (invalidEnabled.length > 0) {
    warnings.push(
      `enabledCategories contém valores inválidos: ${invalidEnabled
        .map(String)
        .join(', ')} — remova ou corrija os IDs de categoria`,
    )
  }

  const ids = new Set<string>()
  const dupes: string[] = []
  ;['necessary', ...sanitizedEnabled].forEach((id) => {
    if (ids.has(id)) dupes.push(id)
    ids.add(id)
  })
  custom?.forEach((c) => {
    if (ids.has(c.id)) dupes.push(c.id)
    ids.add(c.id)
  })
  if (dupes.length > 0) {
    warnings.push(
      `IDs de categoria duplicados detectados: ${Array.from(new Set(dupes)).join(
        ', ',
      )} — verifique 'enabledCategories' e 'customCategories'.`,
    )
  }

  return warnings
}

/**
 * Emite mensagens de validação no console (apenas em DEV).
 * @category Utils
 * @param warnings Avisos não bloqueantes
 * @param errors Erros bloqueantes
 * @param issues Issues detalhadas (ex: Zod)
 * @internal
 */
const reportValidationMessages = (warnings: string[], errors: string[], issues: LiteIssue[]) => {
  if (warnings.length > 0) {
    logger.warn('Validação do ConsentProvider:', ...warnings)
  }
  if (errors.length > 0 || issues.length > 0) {
    issues.forEach((i) => errors.push(`Prop inválida: ${i.path} — ${i.message}`))
    logger.error('Erros de configuração do ConsentProvider:', ...errors)
  }
}

/**
 * Valida e saneia as props do ConsentProvider.
 *
 * - Em DEV: usa validação detalhada (Zod, se disponível) e gera mensagens claras no console.
 * - Em produção: faz apenas sanitização leve, sem dependências extras.
 *
 * @category Utils
 * @param props Props do ConsentProvider (apenas categories)
 * @returns Resultado da validação (sanitizado, avisos, erros)
 * @remarks
 * - Remove itens inválidos que possam causar comportamento inesperado.
 * - Gera mensagens acionáveis para o dev.
 * @since 0.4.0
 * @example
 * const result = validateConsentProviderProps({ categories: { enabledCategories: ['analytics'] } })
 */
export function validateConsentProviderProps(
  props: Readonly<Pick<ConsentProviderProps, 'categories'>>,
): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []
  const sanitized: ValidationResult['sanitized'] = {}

  // Em produção, não executa validação pesada nem inclui Zod no bundle
  if (!isDev()) {
    if (props.categories) {
      // Sanitização leve em produção: remover 'necessary' se vier por engano
      const { sanitizedEnabled } = sanitizeCategories(props.categories)
      sanitized.categories = {
        enabledCategories: sanitizedEnabled as ProjectCategoriesConfig['enabledCategories'],
        customCategories: props.categories.customCategories,
      }
    }
    return { sanitized, warnings, errors }
  }

  // DEV: tenta carregar Zod dinamicamente para validações detalhadas
  let z: typeof import('zod') | undefined
  try {
    z = require('zod') as typeof import('zod')
  } catch {
    // Ambiente de teste/build pode não resolver 'zod' — segue com validações leves
    z = undefined
  }

  const issues: LiteIssue[] = []
  collectZodIssues(z, props.categories, issues)

  // Validação de categories (+sanitização) — independente de zod
  if (props.categories) {
    const { enabled, sanitizedEnabled, custom } = sanitizeCategories(props.categories)
    warnings.push(...collectCategoryWarnings({ enabled, sanitizedEnabled, custom }))

    sanitized.categories = {
      enabledCategories: sanitizedEnabled as ProjectCategoriesConfig['enabledCategories'],
      customCategories: custom,
    }
  } else {
    warnings.push(
      "Prop 'categories' não fornecida — o ConsentProvider requer configuração de categorias.",
    )
  }

  // Emitir mensagens no console (apenas em DEV)
  reportValidationMessages(warnings, errors, issues)

  return { sanitized, warnings, errors }
}
