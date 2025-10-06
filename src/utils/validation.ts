import type { ConsentProviderProps, ProjectCategoriesConfig } from '../types/types'
import { logger } from './logger'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any

// Tipos runtime-lite para fallback quando Zod não estiver disponível (produção)
type LiteIssue = { path: string; message: string }

export type ValidationResult = {
  sanitized: {
    categories?: ProjectCategoriesConfig
  }
  warnings: string[]
  errors: string[]
}

const isDev = () =>
  typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production'

/**
 * Valida e saneia as props do ConsentProvider em modo DEV.
 * - Gera mensagens claras e acionáveis no console
 * - Remove itens inválidos que possam causar comportamento inesperado
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
      const enabled = Array.from(new Set([...(props.categories.enabledCategories ?? [])]))
      const sanitizedEnabled = enabled.filter((c) => c !== 'necessary')
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

  if (z) {
    const CustomCategorySchema = z.object({
      id: z.string().min(1, 'customCategories[].id deve ser uma string não vazia'),
      name: z.string().min(1, 'customCategories[].name deve ser uma string não vazia'),
      description: z
        .string()
        .min(1, 'customCategories[].description deve ser uma string não vazia'),
      essential: z.boolean().optional(),
      cookies: z.array(z.string().min(1)).optional(),
    })

    const ProjectCategoriesConfigSchema = z
      .object({
        enabledCategories: z.array(z.string().min(1)).optional(),
        customCategories: z.array(CustomCategorySchema).optional(),
      })
      .strict()

    const res = ProjectCategoriesConfigSchema.safeParse(props.categories)
    if (!res.success) {
      res.error.issues.forEach((issue) =>
        issues.push({ path: `categories.${issue.path.join('.')}`, message: issue.message }),
      )
    }
  }

  // Validação de categories (+sanitização) — independente de zod
  if (!props.categories) {
    warnings.push(
      "Prop 'categories' não fornecida. A lib aplicará um padrão seguro, mas recomenda-se definir 'categories.enabledCategories' explicitamente para clareza e auditoria.",
    )
  } else {
    const cat = props.categories
    const enabled = Array.from(new Set([...(cat.enabledCategories ?? [])]))
    if (enabled.includes('necessary')) {
      warnings.push("'necessary' é sempre incluída automaticamente — remova de enabledCategories.")
    }
    const sanitizedEnabled = enabled.filter((c) => c !== 'necessary')
    const invalidEnabled = sanitizedEnabled.filter((c) => typeof c !== 'string' || c.trim() === '')
    if (invalidEnabled.length > 0) {
      warnings.push(
        `enabledCategories contém valores inválidos: ${invalidEnabled
          .map((v) => String(v))
          .join(', ')} — remova ou corrija os IDs de categoria`,
      )
    }

    const custom = cat.customCategories ?? []
    if (z) {
      const CustomCategorySchema = z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        essential: z.boolean().optional(),
        cookies: z.array(z.string().min(1)).optional(),
      })
      const customParse = z.array(CustomCategorySchema).safeParse(custom)
      if (!customParse.success) {
        customParse.error.issues.forEach((issue) =>
          issues.push({ path: `customCategories.${issue.path.join('.')}`, message: issue.message }),
        )
      }
    }

    const ids = new Set<string>()
    const dupes: string[] = []
    ;['necessary', ...sanitizedEnabled].forEach((id) => {
      if (ids.has(id)) dupes.push(id)
      ids.add(id)
    })
    custom.forEach((c) => {
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

    sanitized.categories = {
      enabledCategories: sanitizedEnabled as ProjectCategoriesConfig['enabledCategories'],
      customCategories: custom,
    }
  }

  // Emitir mensagens no console (apenas em DEV)
  if (warnings.length > 0) {
    logger.warn('Validação do ConsentProvider:', ...warnings)
  }
  if (errors.length > 0 || issues.length > 0) {
    issues.forEach((i) => errors.push(`Prop inválida: ${i.path} — ${i.message}`))
    logger.error('Erros de configuração do ConsentProvider:', ...errors)
  }

  return { sanitized, warnings, errors }
}
