#!/bin/bash

# Script para análise de coverage localmente
# Uso: ./scripts/coverage-analysis.sh

set -e

echo "🧪 Executando testes com coverage..."
pnpm test:coverage

echo ""
echo "📊 Resumo de Coverage:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extrair métricas do JSON summary
if [ -f "coverage/coverage-summary.json" ]; then
  cat coverage/coverage-summary.json | jq -r '
    .total | 
    "✓ Statements: \(.statements.pct)%",
    "✓ Branches:   \(.branches.pct)%",
    "✓ Functions:  \(.functions.pct)%",
    "✓ Lines:      \(.lines.pct)%"
  '
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

echo "🌐 Abrindo relatório HTML no navegador..."
if command -v xdg-open > /dev/null; then
  xdg-open coverage/lcov-report/index.html
elif command -v open > /dev/null; then
  open coverage/lcov-report/index.html
else
  echo "⚠️  Não foi possível abrir automaticamente. Acesse: coverage/lcov-report/index.html"
fi

echo ""
echo "✅ Análise concluída!"
