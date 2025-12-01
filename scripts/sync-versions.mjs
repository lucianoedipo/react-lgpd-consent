#!/usr/bin/env node
/**
 * Script de Sincronização de Versões
 *
 * Lógica: Se qualquer pacote interno (core ou mui) recebeu bump do changeset,
 * o agregador (react-lgpd-consent) DEVE receber o mesmo tipo de bump.
 *
 * Cenários:
 * - core: 0.6.2 → 0.6.3 (patch) → main: 0.6.1 → 0.6.2 (patch também)
 * - mui: 0.6.1 → 0.7.0 (minor) → main: 0.6.8 → 0.7.0 (minor também)
 * - core: 0.6.8, mui: 0.6.2 → 0.6.3 (patch) → main: 0.6.7 → 0.6.8 (patch)
 *
 * IMPORTANTE: Este script é executado APÓS o changeset version, então
 * se houve mudança em core/mui, suas versões já foram bumpeadas.
 * Precisamos comparar com estado anterior (via git) para detectar bumps.
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..')

const CORE_PKG = path.join(rootDir, 'packages/core/package.json')
const MUI_PKG = path.join(rootDir, 'packages/mui/package.json')
const MAIN_PKG = path.join(rootDir, 'packages/react-lgpd-consent/package.json')

async function readPackageJson(filePath) {
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

async function writePackageJson(filePath, pkg) {
  await fs.writeFile(filePath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
}

function getGitVersion(filePath) {
  try {
    const relativePath = path.relative(rootDir, filePath)
    const content = execSync(`git show HEAD:${relativePath}`, { encoding: 'utf-8' })
    return JSON.parse(content).version
  } catch {
    // Se não houver versão anterior (novo pacote), retorna 0.0.0
    return '0.0.0'
  }
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number)
  return { major, minor, patch }
}

function compareVersions(v1, v2) {
  const parsed1 = parseVersion(v1)
  const parsed2 = parseVersion(v2)

  if (parsed1.major !== parsed2.major) return parsed1.major - parsed2.major
  if (parsed1.minor !== parsed2.minor) return parsed1.minor - parsed2.minor
  return parsed1.patch - parsed2.patch
}

function getBumpType(oldVersion, newVersion) {
  const old = parseVersion(oldVersion)
  const next = parseVersion(newVersion)

  if (next.major > old.major) return 'major'
  if (next.minor > old.minor) return 'minor'
  if (next.patch > old.patch) return 'patch'
  return null
}

function applyBump(version, bumpType) {
  const { major, minor, patch } = parseVersion(version)

  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      return version
  }
}

async function main() {
  console.log('\n🔄 Sincronizando versões dos pacotes...\n')

  try {
    // Ler versões atuais (pós-changeset)
    const corePkg = await readPackageJson(CORE_PKG)
    const muiPkg = await readPackageJson(MUI_PKG)
    const mainPkg = await readPackageJson(MAIN_PKG)

    const coreVersion = corePkg.version
    const muiVersion = muiPkg.version
    const mainVersion = mainPkg.version

    console.log(`📦 Versões atuais (pós-changeset):`)
    console.log(`   @react-lgpd-consent/core: ${coreVersion}`)
    console.log(`   @react-lgpd-consent/mui:  ${muiVersion}`)
    console.log(`   react-lgpd-consent:       ${mainVersion}`)

    // Pegar versões anteriores do git
    const coreOldVersion = getGitVersion(CORE_PKG)
    const muiOldVersion = getGitVersion(MUI_PKG)
    const mainOldVersion = getGitVersion(MAIN_PKG)

    console.log(`\n📜 Versões anteriores (git HEAD):`)
    console.log(`   @react-lgpd-consent/core: ${coreOldVersion}`)
    console.log(`   @react-lgpd-consent/mui:  ${muiOldVersion}`)
    console.log(`   react-lgpd-consent:       ${mainOldVersion}`)

    // Detectar bumps em core e mui
    const coreBump = getBumpType(coreOldVersion, coreVersion)
    const muiBump = getBumpType(muiOldVersion, muiVersion)

    console.log(`\n🔍 Bumps detectados:`)
    console.log(`   core: ${coreBump || 'nenhum'}`)
    console.log(`   mui:  ${muiBump || 'nenhum'}`)

    // Determinar o bump necessário para main
    let requiredBump = null
    if (coreBump === 'major' || muiBump === 'major') {
      requiredBump = 'major'
    } else if (coreBump === 'minor' || muiBump === 'minor') {
      requiredBump = 'minor'
    } else if (coreBump === 'patch' || muiBump === 'patch') {
      requiredBump = 'patch'
    }

    if (requiredBump) {
      const newMainVersion = applyBump(mainVersion, requiredBump)

      console.log(`\n✨ Aplicando bump ${requiredBump} ao agregador...`)
      console.log(`   ${mainVersion} → ${newMainVersion}`)

      mainPkg.version = newMainVersion
      await writePackageJson(MAIN_PKG, mainPkg)

      console.log(`\n✅ react-lgpd-consent atualizado!`)
    } else {
      console.log(`\n✅ Nenhum bump necessário no agregador`)
    }

    // Atualizar dependência de core em mui
    const finalCorePkg = await readPackageJson(CORE_PKG)
    const finalMuiPkg = await readPackageJson(MUI_PKG)

    if (finalMuiPkg.dependencies?.['@react-lgpd-consent/core']) {
      const expectedDep = `workspace:^${finalCorePkg.version}`
      const currentDep = finalMuiPkg.dependencies['@react-lgpd-consent/core']

      if (currentDep !== expectedDep) {
        finalMuiPkg.dependencies['@react-lgpd-consent/core'] = expectedDep
        await writePackageJson(MUI_PKG, finalMuiPkg)
        console.log(`\n✅ Dependência de core em mui atualizada: ${expectedDep}`)
      }
    }

    console.log('\n🎉 Sincronização completa!\n')
  } catch (error) {
    console.error('\n❌ Erro ao sincronizar versões:', error)
    process.exit(1)
  }
}

await main()
