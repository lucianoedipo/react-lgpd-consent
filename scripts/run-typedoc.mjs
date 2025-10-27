#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(__dirname, '..')
const typedocOptions = resolve(workspaceRoot, 'typedoc.json')

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const result = spawnSync(pnpmCommand, ['exec', 'typedoc', '--options', typedocOptions], {
  cwd: workspaceRoot,
  stdio: 'inherit',
  shell: true,
})

if (result.status !== 0 && result.status !== null) {
  process.exit(result.status)
}
