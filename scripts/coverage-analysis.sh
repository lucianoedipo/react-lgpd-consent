#!/bin/bash

# Script para análise de coverage localmente
# Uso: ./scripts/coverage-analysis.sh

set -euo pipefail

echo "🧪 Executando testes com coverage..."
pnpm test:coverage

echo ""
echo "📊 Resumo de Coverage:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extrair métricas do JSON summary
if [ -f "coverage/coverage-summary.json" ]; then
  if ! command -v jq > /dev/null 2>&1; then
    echo "⚠️  jq não instalado. Instale com: brew install jq (macOS) ou apt install jq (Linux)"
    exit 1
  fi
  
  jq -r '
    .total | 
    "✓ Statements: \(.statements.pct)%",
    "✓ Branches:   \(.branches.pct)%",
    "✓ Functions:  \(.functions.pct)%",
    "✓ Lines:      \(.lines.pct)%"
  ' < coverage/coverage-summary.json
else
  echo "⚠️  Arquivo coverage-summary.json não encontrado"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📁 Arquivos de coverage gerados:"
echo "  • LCOV:      coverage/lcov.info"
echo "  • Cobertura: coverage/cobertura-coverage.xml"
echo "  • Clover:    coverage/clover.xml"
echo "  • JSON:      coverage/coverage-final.json"
echo "  • Summary:   coverage/coverage-summary.json"
echo "  • HTML:      coverage/lcov-report/index.html"
echo ""

# Abrir navegador apenas em ambientes interativos (não CI)
if [ -z "${CI:-}" ] && [ -n "${DISPLAY:-}" ]; then
  echo "🌐 Abrindo relatório HTML no navegador..."
  if command -v xdg-open > /dev/null 2>&1; then
    xdg-open coverage/lcov-report/index.html 2>/dev/null || true
  elif command -v open > /dev/null 2>&1; then
    open coverage/lcov-report/index.html 2>/dev/null || true
  fi
else
  echo "💡 Relatório HTML disponível em: coverage/lcov-report/index.html"
fi

echo ""
echo "✅ Análise concluída!"
