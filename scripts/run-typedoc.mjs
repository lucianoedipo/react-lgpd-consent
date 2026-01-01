#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirnameESM = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = resolve(__dirnameESM, '..')
const typedocOptions = resolve(workspaceRoot, 'typedoc.json')

// Extrair versão do pacote principal
const mainPkgPath = resolve(workspaceRoot, 'packages/react-lgpd-consent/package.json')
const mainPkg = JSON.parse(readFileSync(mainPkgPath, 'utf-8'))
const version = process.env.TYPEDOC_VERSION || mainPkg.version

console.log(`📚 Gerando TypeDoc para react-lgpd-consent v${version}`)

// Ler typedoc.json
const config = JSON.parse(readFileSync(typedocOptions, 'utf-8'))
config.name = `react-lgpd-consent v${version}`

// Salvar temporariamente
const tempConfig = resolve(workspaceRoot, 'typedoc.temp.json')
writeFileSync(tempConfig, JSON.stringify(config, null, 2))

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const result = spawnSync(pnpmCommand, ['exec', 'typedoc', '--options', tempConfig], {
  cwd: workspaceRoot,
  stdio: 'inherit',
})

// Limpar arquivo temporário
try {
  unlinkSync(tempConfig)
} catch {
  // Ignorar erro se não conseguir deletar
}

if (result.status !== 0 && result.status !== null) {
  process.exit(result.status)
}
