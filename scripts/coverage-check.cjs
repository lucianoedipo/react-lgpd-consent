#!/usr/bin/env node

/**
 * Script para verificar a cobertura de testes e gerar relatório
 * Usado no CI para enforcement de qualidade
 */

const fs = require('node:fs')
const path = require('node:path')

const COVERAGE_FILE = path.join(__dirname, '../coverage/coverage-summary.json')

function checkCoverage() {
  if (!fs.existsSync(COVERAGE_FILE)) {
    console.error('❌ Coverage file not found. Run tests with coverage first.')
    process.exit(1)
  }

  const coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'))
  const { total } = coverage

  const thresholds = {
    statements: 85,
    branches: 80,
    functions: 70,
    lines: 85,
  }

  console.log('\n📊 Coverage Report:')
  console.log('==================')

  let failed = false

  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const current = total[metric].pct
    const status = current >= threshold ? '✅' : '❌'

    if (current < threshold) {
      failed = true
    }

    console.log(`${status} ${metric.padEnd(12)}: ${current.toFixed(2)}% (threshold: ${threshold}%)`)
  })

  console.log('==================')

  if (failed) {
    console.log('\n❌ Coverage below thresholds. Please add more tests.')
    process.exit(1)
  } else {
    console.log('\n✅ All coverage thresholds met!')
  }

  // Calcular tendência se possível
  const bundleInfo = {
    statements: total.statements.pct,
    branches: total.branches.pct,
    functions: total.functions.pct,
    lines: total.lines.pct,
    timestamp: new Date().toISOString(),
  }

  console.log(
    '\n📈 Bundle Quality Score:',
    Math.round(
      (bundleInfo.statements + bundleInfo.branches + bundleInfo.functions + bundleInfo.lines) / 4,
    ),
    '%',
  )
}

if (require.main === module) {
  checkCoverage()
}

module.exports = { checkCoverage }
