/**
 * @fileoverview
 * Sistema de diagnóstico de peer dependencies e compatibilidade de versões.
 * Detecta problemas comuns como múltiplas instâncias de React e versões de MUI fora do range suportado.
 *
 * @author Luciano Édipo
 * @since 0.5.4
 */

import { logger } from './logger'
import { isProductionEnv } from './env'

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
 * Idiomas suportados para mensagens de diagnóstico de peer dependencies.
 *
 * @category Utils
 * @since 0.7.1
 */
export type PeerDepsLocale = 'pt-BR' | 'en'

/**
 * Estrutura de mensagens de erro e aviso para diagnóstico de peer dependencies.
 *
 * @category Utils
 * @since 0.7.1
 */
export interface PeerDepsMessages {
  MULTIPLE_REACT_INSTANCES: string
  UNSUPPORTED_REACT_VERSION: (version: string) => string
  UNSUPPORTED_MUI_VERSION: (version: string) => string
  MUI_OUT_OF_RANGE: (version: string) => string
}

function addPeerError(result: PeerDepsCheckResult, message: string, logWarnings: boolean) {
  result.ok = false
  result.errors.push(message)

  if (logWarnings) {
    console.error(message)
  }
}

function checkReactPeerVersion(
  result: PeerDepsCheckResult,
  messages: PeerDepsMessages,
  logWarnings: boolean,
) {
  if (detectMultipleReactInstances()) {
    addPeerError(result, messages.MULTIPLE_REACT_INSTANCES, logWarnings)
  }

  const reactVersion = getPackageVersion('react')
  if (!reactVersion || isVersionInRange(reactVersion, 18, 19)) {
    return
  }

  addPeerError(result, messages.UNSUPPORTED_REACT_VERSION(reactVersion), logWarnings)
}

function checkMuiPeerVersion(
  result: PeerDepsCheckResult,
  messages: PeerDepsMessages,
  currentWindow: Window,
  logWarnings: boolean,
) {
  const muiVersion = (currentWindow as Window & { '@mui/material'?: { version?: string } })[
    '@mui/material'
  ]?.version

  if (!muiVersion || isVersionInRange(muiVersion, 5, 7)) {
    return
  }

  result.warnings.push(messages.MUI_OUT_OF_RANGE(muiVersion))

  if (logWarnings) {
    logger.warn(messages.UNSUPPORTED_MUI_VERSION(muiVersion))
  }
}

/**
 * Mensagens de erro e aviso em português brasileiro (pt-BR).
 *
 * @internal
 */
const MESSAGES_PT_BR: PeerDepsMessages = {
  MULTIPLE_REACT_INSTANCES: `
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
`,

  UNSUPPORTED_REACT_VERSION: (version: string) => `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  AVISO: Versão do React não suportada                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 Versão detectada: React ${version}
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
`,

  UNSUPPORTED_MUI_VERSION: (version: string) => `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  AVISO: Versão do Material-UI fora do range recomendado                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 Versão detectada: @mui/material ${version}
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

  MUI_OUT_OF_RANGE: (version: string) =>
    `MUI versão ${version} detectada. Versões suportadas: 5.15.0+, 6.x ou 7.x. ` +
    `Alguns componentes podem não funcionar corretamente.`,
}

/**
 * Mensagens de erro e aviso em inglês (en).
 *
 * @internal
 */
const MESSAGES_EN: PeerDepsMessages = {
  MULTIPLE_REACT_INSTANCES: `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  ERROR: Multiple React instances detected                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

🔴 Problem:
   Your project is loading more than one copy of React, causing the error:
   "Invalid hook call. Hooks can only be called inside of the body of a 
    function component."

🔍 Probable cause:
   • pnpm/Yarn PnP without proper peer dependency hoisting
   • node_modules with duplicate React (classic npm/yarn)
   • Webpack/Vite with multiple resolutions of the same package

✅ Solutions:

   📦 PNPM (RECOMMENDED):
      Add to root package.json:
      {
        "pnpm": {
          "overrides": {
            "react": "$react",
            "react-dom": "$react-dom"
          }
        }
      }
      Run: pnpm install

   📦 NPM/Yarn:
      Add to root package.json:
      {
        "overrides": {
          "react": "^18.2.0 || ^19.0.0",
          "react-dom": "^18.2.0 || ^19.0.0"
        }
      }
      Run: npm install (or yarn install)
      
   🔧 Webpack:
      Add to webpack.config.js:
      module.exports = {
        resolve: {
          alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
          }
        }
      }

   ⚡ Vite:
      Add to vite.config.js:
      export default {
        resolve: {
          dedupe: ['react', 'react-dom']
        }
      }

📚 Documentation:
   https://github.com/lucianoedipo/react-lgpd-consent/blob/main/TROUBLESHOOTING.md#multiple-react-instances

────────────────────────────────────────────────────────────────────────────────
`,

  UNSUPPORTED_REACT_VERSION: (version: string) => `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  WARNING: Unsupported React version                                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 Detected version: React ${version}
✅ Supported versions: React 18.x or 19.x

🔍 react-lgpd-consent requires React 18.2.0+ or React 19.x

✅ Solution:
   Update React to a supported version:
   
   npm install react@^18.2.0 react-dom@^18.2.0
   
   or
   
   npm install react@^19.0.0 react-dom@^19.0.0

📚 Documentation:
   https://github.com/lucianoedipo/react-lgpd-consent/blob/main/TROUBLESHOOTING.md#react-version

────────────────────────────────────────────────────────────────────────────────
`,

  UNSUPPORTED_MUI_VERSION: (version: string) => `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  WARNING: Material-UI version out of recommended range                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 Detected version: @mui/material ${version}
✅ Supported versions: 5.15.0+, 6.x, 7.x

🔍 UI components (@react-lgpd-consent/mui) may have issues.

✅ Solution:
   Update MUI to a supported version:
   
   npm install @mui/material@^7.0.0 @emotion/react @emotion/styled
   
   or keep 5.15.0+:
   
   npm install @mui/material@^5.15.0 @emotion/react @emotion/styled

📚 Documentation:
   https://github.com/lucianoedipo/react-lgpd-consent/blob/main/TROUBLESHOOTING.md#mui-version

────────────────────────────────────────────────────────────────────────────────
`,

  MUI_OUT_OF_RANGE: (version: string) =>
    `MUI version ${version} detected. Supported versions: 5.15.0+, 6.x or 7.x. ` +
    `Some components may not work properly.`,
}

/**
 * Mapa de mensagens por idioma.
 *
 * @internal
 */
const MESSAGES_BY_LOCALE: Record<PeerDepsLocale, PeerDepsMessages> = {
  'pt-BR': MESSAGES_PT_BR,
  en: MESSAGES_EN,
}

/**
 * Estado de configuração de i18n para mensagens de peer dependencies.
 *
 * @internal
 */
let currentLocale: PeerDepsLocale = 'pt-BR'
let customMessages: Partial<PeerDepsMessages> = {}

/**
 * Define o idioma para mensagens de diagnóstico de peer dependencies.
 *
 * @category Utils
 * @since 0.7.1
 *
 * @param locale - Idioma desejado ('pt-BR' ou 'en')
 *
 * @example
 * ```typescript
 * import { setPeerDepsLocale } from '@react-lgpd-consent/core'
 *
 * // Configurar mensagens em inglês
 * setPeerDepsLocale('en')
 * ```
 */
export function setPeerDepsLocale(locale: PeerDepsLocale): void {
  currentLocale = locale
}

/**
 * Obtém o idioma atual configurado para mensagens de diagnóstico.
 *
 * @category Utils
 * @since 0.7.1
 *
 * @returns O idioma atual
 *
 * @example
 * ```typescript
 * import { getPeerDepsLocale } from '@react-lgpd-consent/core'
 *
 * const locale = getPeerDepsLocale() // 'pt-BR' ou 'en'
 * ```
 */
export function getPeerDepsLocale(): PeerDepsLocale {
  return currentLocale
}

/**
 * Permite sobrescrever mensagens de diagnóstico com versões customizadas.
 * Útil para traduzir para outros idiomas ou personalizar o texto.
 *
 * @category Utils
 * @since 0.7.1
 *
 * @param messages - Objeto parcial com mensagens a sobrescrever
 *
 * @remarks
 * As mensagens customizadas têm prioridade sobre as mensagens padrão.
 * Pode fornecer apenas as mensagens que deseja sobrescrever.
 *
 * @example
 * ```typescript
 * import { setPeerDepsMessages } from '@react-lgpd-consent/core'
 *
 * // Customizar mensagens em espanhol
 * setPeerDepsMessages({
 *   MULTIPLE_REACT_INSTANCES: `ERROR: Múltiples instancias de React detectadas...`,
 *   UNSUPPORTED_REACT_VERSION: (v) => `Versión ${v} no soportada...`,
 * })
 * ```
 */
export function setPeerDepsMessages(messages: Partial<PeerDepsMessages>): void {
  customMessages = { ...customMessages, ...messages }
}

/**
 * Restaura as mensagens padrão, removendo qualquer customização.
 *
 * @category Utils
 * @since 0.7.1
 *
 * @example
 * ```typescript
 * import { resetPeerDepsMessages } from '@react-lgpd-consent/core'
 *
 * // Voltar para mensagens padrão
 * resetPeerDepsMessages()
 * ```
 */
export function resetPeerDepsMessages(): void {
  customMessages = {}
}

/**
 * Obtém as mensagens de acordo com o idioma e customizações atuais.
 *
 * @internal
 */
function getMessages(): PeerDepsMessages {
  const baseMessages = MESSAGES_BY_LOCALE[currentLocale]

  // Se não há customizações, retorna direto as mensagens base
  if (Object.keys(customMessages).length === 0) {
    return baseMessages
  }

  // Mescla mensagens base com customizações
  return {
    MULTIPLE_REACT_INSTANCES:
      customMessages.MULTIPLE_REACT_INSTANCES ?? baseMessages.MULTIPLE_REACT_INSTANCES,
    UNSUPPORTED_REACT_VERSION:
      customMessages.UNSUPPORTED_REACT_VERSION ?? baseMessages.UNSUPPORTED_REACT_VERSION,
    UNSUPPORTED_MUI_VERSION:
      customMessages.UNSUPPORTED_MUI_VERSION ?? baseMessages.UNSUPPORTED_MUI_VERSION,
    MUI_OUT_OF_RANGE: customMessages.MUI_OUT_OF_RANGE ?? baseMessages.MUI_OUT_OF_RANGE,
  }
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
  const currentWindow = globalThis.window
  if (currentWindow === undefined) return false

  try {
    // Técnica 1: Verificar se há múltiplos símbolos React
    const reactSymbols = Object.getOwnPropertySymbols(currentWindow)
      .map(String)
      .filter((name) => name.includes('react'))

    if (reactSymbols.length > 1) {
      return true
    }

    type ReactGlobal = {
      React?: unknown
      __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
        renderers?: {
          size?: number
        }
      }
    }

    // Técnica 2: Verificar se React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED está duplicado
    const ReactModule = (currentWindow as unknown as ReactGlobal).React
    if (ReactModule && Array.isArray(ReactModule)) {
      return true // Múltiplas instâncias carregadas como array
    }

    // Técnica 3: Verificar se há múltiplas versões no contexto global
    const hasMultipleVersions =
      ((currentWindow as unknown as ReactGlobal).__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size ??
        0) > 1

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
  const currentWindow = globalThis.window
  if (currentWindow === undefined) return null

  try {
    // Tentar pegar do módulo carregado (se disponível globalmente para debug)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = (currentWindow as any)[packageName]
    if (pkg?.version) return pkg.version

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const React = (currentWindow as any).React
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
  const major = Number.parseInt(version.split('.')[0], 10)
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
  if (skipInProduction && isProductionEnv()) {
    return result
  }

  // Apenas executar no browser
  const currentWindow = globalThis.window
  if (currentWindow === undefined) {
    return result
  }

  const messages = getMessages()

  checkReactPeerVersion(result, messages, logWarnings)
  checkMuiPeerVersion(result, messages, currentWindow, logWarnings)

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
