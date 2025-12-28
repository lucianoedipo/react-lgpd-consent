/**
 * Script interativo para criação de changesets em monorepos TypeScript/Node.js.
 *
 * Permite selecionar pacotes, tipo de atualização, mensagem e gera arquivo .md para o changeset.
 *
 * @module
 * @remarks
 * Use este script para facilitar o fluxo de versionamento e changelog em projetos multi-pacote.
 * @example
 * pnpm exec tsx scripts/changeset-interactive.ts --prefix @react-lgpd-consent/
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'

/**
 * Argumentos da linha de comando recebidos pelo script.
 */
const args = process.argv.slice(2)

/**
 * Helper para obter valor de argumento flag.
 * @param flag Nome da flag (ex: '--prefix').
 * @returns Valor da flag ou undefined.
 * @internal
 */
const getArgValue = (flag: string) => {
  const idx = args.indexOf(flag)
  if (idx === -1 || idx + 1 >= args.length) return undefined
  return args[idx + 1]
}

/**
 * Prefixo para filtrar pacotes do workspace.
 */
const prefix =
  getArgValue('--prefix') ?? process.env.SCOPE_PREFIX ?? '@react-lgpd-consent/'

/**
 * Flag para incluir pacotes privados na seleção.
 */
const includePrivate = args.includes('--include-private')

/**
 * Interface readline para entrada interativa do usuário.
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * Códigos de cor ANSI para logs coloridos.
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

/**
 * Tipo de pacote do workspace.
 */
type WorkspacePackage = {
  name: string
  version: string
  path: string
  private?: boolean
}

/**
 * Função utilitária para log colorido.
 * @param msg Mensagem a ser exibida.
 * @param color Cor ANSI.
 */
const log = (msg: string, color: keyof typeof colors = 'reset') => {
  console.warn(colors[color] + msg + colors.reset)
}

/**
 * Função utilitária para pergunta interativa.
 * @param query Texto da pergunta.
 * @returns Resposta do usuário.
 */
const question = (query: string) =>
  new Promise<string>((resolve) => {
    rl.question(query, resolve)
  })

/**
 * Tipo de atualização de versão.
 */
type BumpType = 'patch' | 'minor' | 'major'

/**
 * Mensagens automáticas sugeridas para cada tipo de atualização.
 */
const autoMessages: Record<BumpType, string[]> = {
  patch: [
    'fix: correcoes e pequenas melhorias',
    'fix: atualizacao de dependencias',
    'fix: correcao de bugs',
    'chore: manutencao e correcoes',
  ],
  minor: [
    'feat: novas funcionalidades',
    'feat: melhorias e novas features',
    'feat: adicao de recursos',
    'feat: expansao de funcionalidades',
  ],
  major: [
    'BREAKING: mudancas incompativeis',
    'BREAKING: atualizacao major',
    'BREAKING: refatoracao com breaking changes',
    'feat!: mudancas significativas',
  ],
}

/**
 * Valida se a escolha de mensagem é válida.
 * @param choice Escolha do usuário.
 * @param messagesLen Quantidade de mensagens.
 * @returns Verdadeiro se válido.
 * @internal
 */
function isValidMessageChoice(choice: string, messagesLen: number) {
  const idx = Number.parseInt(choice, 10) - 1
  return !Number.isNaN(idx) && idx >= 0 && idx < messagesLen
}

/**
 * Busca pacotes do workspace no diretório packages/.
 * Se não houver monorepo, usa package.json da raiz como pacote único.
 * @returns Array de WorkspacePackage.
 * @example
 * const pkgs = getWorkspacePackages()
 */
function getWorkspacePackages(): WorkspacePackage[] {
  const packagesDir = path.resolve(process.cwd(), 'packages')
  if (!fs.existsSync(packagesDir)) {
    const rootPkgPath = path.resolve(process.cwd(), 'package.json')
    if (!fs.existsSync(rootPkgPath)) {
      return []
    }
    const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')) as {
      name?: string
      version?: string
      private?: boolean
    }
    if (!pkg.name) {
      return []
    }
    const single = {
      name: pkg.name,
      version: pkg.version ?? '0.0.0',
      path: process.cwd(),
      private: pkg.private,
    }
    return [single]
      .filter((entry) => (includePrivate ? true : !entry.private))
      .filter((entry) => (prefix ? entry.name.startsWith(prefix) : true))
  }

  const entries = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name, 'package.json'))
    .filter((pkgPath) => fs.existsSync(pkgPath))

  return entries
    .map((pkgPath) => {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
        name?: string
        version?: string
        private?: boolean
      }
      return {
        name: pkg.name ?? path.basename(path.dirname(pkgPath)),
        version: pkg.version ?? '0.0.0',
        path: path.dirname(pkgPath),
        private: pkg.private,
      }
    })
    .filter((pkg) => (includePrivate ? true : !pkg.private))
    .filter((pkg) => (prefix ? pkg.name.startsWith(prefix) : true))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Busca mensagens do git log para sugestão de changelog.
 * @param limit Quantidade de mensagens.
 * @param conventionalOnly Se filtra por mensagens convencionais.
 * @returns Array de mensagens.
 * @example
 * const msgs = getGitLogMessages(20, true)
 */
type GitLogEntry = {
  summary: string
  full: string
}

function getGitLogEntries(limit = 20, conventionalOnly = true): GitLogEntry[] {
  try {
    const format = '%H%x1f%s%x1f%b%x1e'
    const output = execSync(`git log -n ${limit} --pretty=format:${format}`, {
      encoding: 'utf8',
    })
    const conv = /^(feat|fix|docs|refactor|perf|test|ci|build)!?:/i
    return output
      .split('\x1e')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [, summaryRaw, bodyRaw] = entry.split('\x1f')
        const summary = summaryRaw?.trim() ?? ''
        const body = bodyRaw?.trim() ?? ''
        const full = [summary, body].filter(Boolean).join('\n').trim()
        return { summary, full: full || summary }
      })
      .filter((entry) => !!entry.summary)
      .filter((entry) => (conventionalOnly ? conv.test(entry.summary) : true))
  } catch (error) {
    log('⚠️  Nao foi possivel ler o git log: ' + (error as Error).message, 'yellow')
    return []
  }
}

/**
 * Monta mensagem do git log a partir da seleção do usuário.
 * @param choice Escolha do usuário (ex: g1,g2,g3-5).
 * @param gitMessages Array de mensagens do git.
 * @returns Mensagem formatada ou null.
 * @internal
 */
function buildGitMessageFromSelection(choice: string, gitMessages: GitLogEntry[]) {
  function parseTokenRange(token: string) {
    const [rawStart, rawEnd] = token.split('-')
    const startStr = rawStart.replace(/^g/i, '')
    const endStr = rawEnd.replace(/^g/i, '')
    const start = Number.parseInt(startStr, 10) - 1
    const end = Number.parseInt(endStr, 10) - 1
    if (Number.isInteger(start) && Number.isInteger(end) && start <= end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
    return []
  }

  function addTokenIndices(token: string, indicesSet: Set<number>) {
    const normalized = token.startsWith('g') ? token.slice(1) : token
    if (!normalized) return
    if (normalized.includes('-')) {
      parseTokenRange(normalized).forEach((i) => indicesSet.add(i))
    } else {
      const stripped = normalized.replace(/^g/i, '')
      const idx = Number.parseInt(stripped, 10) - 1
      if (Number.isInteger(idx)) indicesSet.add(idx)
    }
  }

  const rawTokens = choice
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const indices = new Set<number>()
  rawTokens.forEach((token) => addTokenIndices(token, indices))

  const selected = Array.from(indices)
    .filter((i) => i >= 0 && i < gitMessages.length)
    .map((i) => gitMessages[i])

  if (selected.length === 0) return null
  if (selected.length === 1) return selected[0].full
  return selected.map((entry) => `- ${entry.full}`).join('\n')
}

/**
 * Seleciona pacotes do workspace interativamente.
 * @param packages Array de WorkspacePackage.
 * @returns Array de pacotes selecionados.
 */
async function selectPackages(packages: WorkspacePackage[]) {
  log('\n📦 Selecionar Pacotes', 'cyan')
  log('═'.repeat(50), 'dim')

  const options = [
    { key: '1', label: 'Todos os pacotes', value: 'all' },
    { key: '2', label: 'Selecionar manualmente', value: 'manual' },
  ]

  options.forEach((opt) => log(`  ${opt.key}. ${opt.label}`, 'bright'))

  const choice = await question(colors.yellow + '\nEscolha uma opcao (1-2): ' + colors.reset)

  if (choice === '1') {
    return packages
  }

  if (choice === '2') {
    log('\n📝 Pacotes disponiveis:', 'cyan')
    packages.forEach((pkg, idx) => {
      log(`  ${idx + 1}. ${pkg.name} ${colors.dim}(${pkg.version})${colors.reset}`)
    })

    const input = await question(
      colors.yellow + '\nDigite os numeros separados por virgula (ex: 1,3,5): ' + colors.reset,
    )

    const indices = input
      .split(',')
      .map((s) => Number.parseInt(s.trim(), 10) - 1)
      .filter((i) => i >= 0 && i < packages.length)

    return indices.map((i) => packages[i])
  }

  return []
}

/**
 * Seleciona tipo de atualização interativamente.
 * @returns Tipo de atualização.
 */
async function selectBumpType() {
  log('\n🔢 Tipo de Atualizacao', 'cyan')
  log('═'.repeat(50), 'dim')

  const types = [
    { key: '1', type: 'patch', desc: '0.1.0 -> 0.1.1 (correcoes)', color: 'green' },
    { key: '2', type: 'minor', desc: '0.1.0 -> 0.2.0 (features)', color: 'blue' },
    { key: '3', type: 'major', desc: '0.1.0 -> 1.0.0 (breaking changes)', color: 'red' },
  ]

  types.forEach((t) =>
    log(
      `  ${t.key}. ${colors.bright}${t.type}${colors.reset} - ${t.desc}`,
      t.color as keyof typeof colors,
    ),
  )

  const choice = await question(colors.yellow + '\nEscolha o tipo (1-3): ' + colors.reset)
  const typeMap: Record<string, BumpType> = {
    1: 'patch',
    2: 'minor',
    3: 'major',
  }
  return typeMap[choice] || 'patch'
}

/**
 * Seleciona mensagem de changeset interativamente.
 * @param bumpType Tipo de atualização.
 * @returns Mensagem selecionada.
 */
async function selectMessage(bumpType: BumpType) {
  log('\n✍️  Mensagem do Changeset', 'cyan')
  log('═'.repeat(50), 'dim')

  const messages = autoMessages[bumpType]
  const gitMessages = getGitLogEntries(20, true)

  log('  0. Mensagem personalizada', 'bright')
  messages.forEach((msg, idx) => log(`  ${idx + 1}. ${msg}`, 'dim'))

  if (gitMessages.length > 0) {
    log('\n📜 Sugestoes do git log (convencionais):', 'cyan')
    gitMessages.forEach((entry, idx) => log(`  g${idx + 1}. ${entry.summary}`, 'dim'))
  }

  async function handleCustomMessage() {
    const custom = await question(colors.yellow + 'Digite a mensagem: ' + colors.reset)
    if (custom.trim()) return custom
    log('⚠️  Mensagem vazia, tente novamente.', 'yellow')
    return null
  }

  function handleGitMessage(choice: string, gitMessages: GitLogEntry[]) {
    const gitMsg = buildGitMessageFromSelection(choice, gitMessages)
    if (gitMsg) {
      return gitMsg
    }
    log('⚠️  Opcao invalida, tente novamente.', 'yellow')
    return null
  }

  async function getSelectedMessage(choice: string) {
    if (choice === '0') {
      return await handleCustomMessage()
    }
    if (choice.startsWith('g')) {
      return handleGitMessage(choice, gitMessages)
    }
    if (isValidMessageChoice(choice, messages.length)) {
      const idx = Number.parseInt(choice, 10) - 1
      return messages[idx]
    }
    log('⚠️  Opcao invalida, tente novamente.', 'yellow')
    return null
  }

  while (true) {
    const choice = await question(
      colors.yellow +
        `\nEscolha uma opcao (0-${messages.length}${
          gitMessages.length ? ` ou g1-g${gitMessages.length}` : ''
        }): ` +
        colors.reset,
    )
    const selected = await getSelectedMessage(choice)
    if (selected) return selected
  }
}

/**
 * Confirmação final do changeset antes de criar arquivo.
 * @param selectedPackages Pacotes selecionados.
 * @param bumpType Tipo de atualização.
 * @param message Mensagem do changeset.
 * @returns Verdadeiro se confirmado.
 */
async function confirmChangeset(
  selectedPackages: WorkspacePackage[],
  bumpType: BumpType,
  message: string,
) {
  log('\n📋 Resumo do Changeset', 'cyan')
  log('═'.repeat(50), 'dim')
  log(`  Tipo: ${colors.bright}${bumpType}${colors.reset}`)
  log(`  Mensagem: ${colors.dim}${message}${colors.reset}`)
  log(`  Pacotes (${selectedPackages.length}):`)
  selectedPackages.forEach((pkg) => {
    log(`    • ${pkg.name} ${colors.dim}(${pkg.version})${colors.reset}`)
  })

  const confirm = await question(colors.yellow + '\n✓ Criar changeset? (s/N): ' + colors.reset)
  return confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'y'
}

/**
 * Função principal: executa fluxo interativo de criação de changeset.
 * @example
 * main()
 */
async function main() {
  log('\n🦋 Changeset Interativo', 'bright')
  log('═'.repeat(50), 'dim')

  const packages = getWorkspacePackages()
  if (packages.length === 0) {
    log('❌ Nenhum pacote encontrado no workspace', 'red')
    process.exit(1)
  }

  if (packages.length === 1) {
    log('\nModo single-package detectado', 'dim')
  }
  log(`\n${packages.length} pacotes disponiveis`, 'dim')

  const selectedPackages = await selectPackages(packages)
  if (selectedPackages.length === 0) {
    log('\n❌ Nenhum pacote selecionado', 'yellow')
    rl.close()
    process.exit(0)
  }

  const bumpType = await selectBumpType()
  const message = await selectMessage(bumpType)

  const confirmed = await confirmChangeset(selectedPackages, bumpType, message)
  if (!confirmed) {
    log('\n❌ Changeset cancelado', 'yellow')
    rl.close()
    process.exit(0)
  }

  const changesetId = `interactive-${bumpType}-${Date.now()}`
  const frontmatter = selectedPackages.map((pkg) => `'${pkg.name}': ${bumpType}`).join('\n')

  const content = `---\n${frontmatter}\n---\n\n${message}\n`

  const changesetDir = path.join(process.cwd(), '.changeset')
  if (!fs.existsSync(changesetDir)) {
    fs.mkdirSync(changesetDir, { recursive: true })
  }
  const changesetPath = path.join(changesetDir, `${changesetId}.md`)
  fs.writeFileSync(changesetPath, content)

  log('\n✅ Changeset criado com sucesso!', 'green')
  log(`   ID: ${colors.dim}${changesetId}${colors.reset}`)
  log(`   Arquivo: ${colors.dim}.changeset/${changesetId}.md${colors.reset}`)
  log(
    `\n💡 O CI executa ${colors.bright}pnpm changeset:version${colors.reset} na main. Localmente, use apenas se necessario.\n`,
  )

  rl.close()
}

/**
 * Executa o changeset interativo com tratamento de erros.
 * @example
 * runChangesetInteractive()
 */
try {
  await main()
} catch (err) {
  log('\n❌ Erro: ' + (err as Error).message, 'red')
  rl.close()
  process.exit(1)
}
