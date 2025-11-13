/**
 * @fileoverview
 * Sistema de diagnóstico de peer dependencies e compatibilidade de versões.
 * Detecta problemas comuns como múltiplas instâncias de React e versões de MUI fora do range suportado.
 *
 * @author Luciano Édipo
 * @since 0.5.4
 */

import { logger } from './logger'

/**
 * Resultado da verificação de peer dependencies.
 *
 * @category Utils
 * @since 0.5.4
 */
export interface PeerDepsCheckResult {
  /** Se todas as verificações passaram sem problemas críticos */
  ok: boolean
  /** Lista de avisos detectados */
  warnings: string[]
  /** Lista de erros críticos detectados */
  errors: string[]
}

/**
 * Detecta múltiplas instâncias de React no ambiente.
 * Este é um dos problemas mais comuns que causam "Invalid hook call".
 *
 * @category Utils
 * @since 0.5.4
 *
 * @remarks
 * A detecção funciona verificando se existem múltiplos símbolos React carregados,
 * o que acontece quando há duplicação de pacotes (comum em pnpm/Yarn PnP sem configuração adequada).
 *
 * @returns `true` se múltiplas instâncias forem detectadas
 *
 * @internal
 */
function detectMultipleReactInstances(): boolean {
  if (typeof window === 'undefined') return false

  try {
    // Técnica 1: Verificar se há múltiplos símbolos React
    const reactSymbols = Object.getOwnPropertySymbols(window)
      .map((sym) => String(sym))
      .filter((name) => name.includes('react'))

    if (reactSymbols.length > 1) {
      return true
    }

    // Técnica 2: Verificar se React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED está duplicado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ReactModule = (window as any).React
    if (ReactModule && Array.isArray(ReactModule)) {
      return true // Múltiplas instâncias carregadas como array
    }

    // Técnica 3: Verificar se há múltiplas versões no contexto global
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasMultipleVersions = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size > 1

    return hasMultipleVersions || false
  } catch {
    // Se falhar a detecção, assumir que está ok (evitar falsos positivos)
    return false
  }
}

/**
 * Extrai a versão de um pacote se disponível no ambiente.
 *
 * @param packageName - Nome do pacote a verificar
 * @returns Versão do pacote ou null se não detectada
 *
 * @internal
 */
function getPackageVersion(packageName: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    // Tentar pegar do módulo carregado (se disponível globalmente para debug)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = (window as any)[packageName]
    if (pkg?.version) return pkg.version

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const React = (window as any).React
    if (packageName === 'react' && React?.version) {
      return React.version
    }

    return null
  } catch {
    return null
  }
}

/**
 * Verifica se uma versão está dentro do range esperado (simplified semver check).
 *
 * @param version - Versão a verificar (ex: "18.2.0")
 * @param minMajor - Versão major mínima aceita
 * @param maxMajor - Versão major máxima aceita
 * @returns `true` se a versão está no range
 *
 * @internal
 */
function isVersionInRange(version: string, minMajor: number, maxMajor: number): boolean {
  const major = parseInt(version.split('.')[0], 10)
  return major >= minMajor && major <= maxMajor
}

/**
 * Verifica compatibilidade de peer dependencies (React e MUI).
 *
 * @category Utils
 * @since 0.5.4
 *
 * @remarks
 * Esta função executa verificações em ambiente de desenvolvimento para detectar:
 * - Múltiplas instâncias de React (causa "Invalid hook call")
 * - Versões de React fora do range suportado (18-19)
 * - Versões de MUI fora do range suportado (5-7)
 *
 * As mensagens incluem:
 * - Descrição clara do problema
 * - Causa raiz provável
 * - Passos objetivos para resolver
 * - Links para documentação
 *
 * @param options - Opções de configuração
 * @param options.skipInProduction - Se true, pula verificação em produção (padrão: true)
 * @param options.logWarnings - Se true, loga avisos no console (padrão: true)
 *
 * @returns Resultado da verificação com lista de avisos e erros
 *
 * @example
 * ```typescript
 * import { checkPeerDeps } from '@react-lgpd-consent/core'
 *
 * // Verificar compatibilidade em desenvolvimento
 * const result = checkPeerDeps()
 * if (!result.ok) {
 *   console.log('Problemas detectados:', result.errors)
 * }
 * ```
 */
export function checkPeerDeps(
  options: {
    skipInProduction?: boolean
    logWarnings?: boolean
  } = {},
): PeerDepsCheckResult {
  const { skipInProduction = true, logWarnings = true } = options

  const result: PeerDepsCheckResult = {
    ok: true,
    warnings: [],
    errors: [],
  }

  // Pular em produção por padrão
  const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'

  if (skipInProduction && isProduction) {
    return result
  }

  // Apenas executar no browser
  if (typeof window === 'undefined') {
    return result
  }

  // 1. Verificar múltiplas instâncias de React
  if (detectMultipleReactInstances()) {
    result.ok = false
    const errorMsg = `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  ERRO: Múltiplas instâncias de React detectadas                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

🔴 Problema:
   Seu projeto está carregando mais de uma cópia do React, causando o erro:
   "Invalid hook call. Hooks can only be called inside of the body of a 
    function component."

🔍 Causa provável:
   • pnpm/Yarn PnP sem hoisting adequado de peer dependencies
   • node_modules com React duplicado (npm/yarn clássico)
   • Webpack/Vite com múltiplas resoluções do mesmo pacote

✅ Soluções:

   📦 PNPM (RECOMENDADO):
      Adicione ao package.json raiz:
      {
        "pnpm": {
          "overrides": {
            "react": "$react",
            "react-dom": "$react-dom"
          }
        }
      }
      Execute: pnpm install

   📦 NPM/Yarn:
      Adicione ao package.json raiz:
      {
        "overrides": {
          "react": "^18.2.0 || ^19.0.0",
          "react-dom": "^18.2.0 || ^19.0.0"
        }
      }
      Execute: npm install (ou yarn install)
      
   🔧 Webpack:
      Adicione ao webpack.config.js:
      module.exports = {
        resolve: {
          alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
          }
        }
      }

   ⚡ Vite:
      Adicione ao vite.config.js:
      export default {
        resolve: {
          dedupe: ['react', 'react-dom']
        }
      }

📚 Documentação:
   https://github.com/lucianoedipo/react-lgpd-consent/blob/main/TROUBLESHOOTING.md#multiple-react-instances

────────────────────────────────────────────────────────────────────────────────
`
    result.errors.push(errorMsg)

    if (logWarnings) {
      console.error(errorMsg)
    }
  }

  // 2. Verificar versão do React
  const reactVersion = getPackageVersion('react')
  if (reactVersion) {
    if (!isVersionInRange(reactVersion, 18, 19)) {
      result.ok = false
      const errorMsg = `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  AVISO: Versão do React não suportada                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 Versão detectada: React ${reactVersion}
✅ Versões suportadas: React 18.x ou 19.x

🔍 O react-lgpd-consent requer React 18.2.0+ ou React 19.x

✅ Solução:
   Atualize o React para uma versão suportada:
   
   npm install react@^18.2.0 react-dom@^18.2.0
   
   ou
   
   npm install react@^19.0.0 react-dom@^19.0.0

📚 Documentação:
   https://github.com/lucianoedipo/react-lgpd-consent/blob/main/TROUBLESHOOTING.md#react-version

────────────────────────────────────────────────────────────────────────────────
`
      result.errors.push(errorMsg)

      if (logWarnings) {
        console.error(errorMsg)
      }
    }
  }

  // 3. Verificar versão do MUI (se estiver carregado)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const muiVersion = (window as any)['@mui/material']?.version
  if (muiVersion) {
    if (!isVersionInRange(muiVersion, 5, 7)) {
      result.warnings.push(
        `MUI versão ${muiVersion} detectada. Versões suportadas: 5.15.0+, 6.x ou 7.x. ` +
          `Alguns componentes podem não funcionar corretamente.`,
      )

      if (logWarnings) {
        logger.warn(
          `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  AVISO: Versão do Material-UI fora do range recomendado                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 Versão detectada: @mui/material ${muiVersion}
✅ Versões suportadas: 5.15.0+, 6.x, 7.x

🔍 Componentes de UI (@react-lgpd-consent/mui) podem apresentar problemas.

✅ Solução:
   Atualize o MUI para uma versão suportada:
   
   npm install @mui/material@^7.0.0 @emotion/react @emotion/styled
   
   ou mantenha 5.15.0+:
   
   npm install @mui/material@^5.15.0 @emotion/react @emotion/styled

📚 Documentação:
   https://github.com/lucianoedipo/react-lgpd-consent/blob/main/TROUBLESHOOTING.md#mui-version

────────────────────────────────────────────────────────────────────────────────
`,
        )
      }
    }
  }

  return result
}

/**
 * Executa verificação de peer dependencies e loga resultados automaticamente.
 * Versão conveniente de `checkPeerDeps` que sempre loga no console.
 *
 * @category Utils
 * @since 0.5.4
 *
 * @remarks
 * Esta função é chamada automaticamente pelo ConsentProvider em modo development.
 * Use `checkPeerDeps()` se precisar do resultado programaticamente sem logging.
 *
 * @example
 * ```typescript
 * import { runPeerDepsCheck } from '@react-lgpd-consent/core'
 *
 * // Executar verificação manual (já é automática no Provider)
 * runPeerDepsCheck()
 * ```
 */
export function runPeerDepsCheck(): void {
  const result = checkPeerDeps({ logWarnings: true })

  if (result.ok && result.warnings.length === 0) {
    logger.debug('✅ Peer dependencies check: OK')
  } else if (result.warnings.length > 0) {
    logger.warn('⚠️  Peer dependencies check: avisos detectados')
  }
}
