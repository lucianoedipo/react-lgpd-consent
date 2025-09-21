# RFCs - React LGPD Consent

## Convenções de Versionamento

### Status dos RFCs

- **Proposta** - RFC em discussão, não implementado
- **✅ Implementado** - RFC totalmente implementado e entregue
- **🚧 Em Progresso** - RFC parcialmente implementado
- **❌ Rejeitado** - RFC descartado com justificativa
- **🔄 Revisão** - RFC precisa de ajustes antes da implementação

### Formato de Header

```markdown
# RFC-XXXX — Título da Proposta

Status: [Status atual]
Autor: [Nome/Username]
Data Proposta: YYYY-MM-DD
Data Implementação: YYYY-MM-DD (se aplicável)
Versão alvo: vX.Y.Z → **Entregue em vX.Y.Z** (se aplicável)
```

### Marcação de Etapas

Para RFCs implementados, marcar todas as etapas com ✅:

```markdown
## Implementação (etapas)

1. ✅ **Etapa 1**: Descrição
   - Detalhes de implementação
   - Arquivos modificados

2. ✅ **Etapa 2**: Descrição
   - Detalhes de implementação
   - Arquivos modificados
```

### Seção de Fechamento

RFCs implementados devem incluir:

```markdown
## ✅ Implementação Concluída

**RFC implementado completamente na versão vX.Y.Z**

### Arquivos Modificados

- Lista de arquivos principais alterados

### Métricas de Qualidade

- Cobertura de testes
- Compatibilidade
- Performance
```

## Lista de RFCs

| RFC                                          | Título                     | Status          | Versão |
| -------------------------------------------- | -------------------------- | --------------- | ------ |
| [0001](./0001-provider-blocking-strategy.md) | Provider Blocking Strategy | ✅ Implementado | v0.4.0 |

## Processo de Criação

1. **Proposta**: Criar RFC com status "Proposta"
2. **Discussão**: Revisar e refinar a proposta
3. **Implementação**: Marcar como "🚧 Em Progresso"
4. **Entrega**: Atualizar para "✅ Implementado" com detalhes
5. **Manutenção**: Manter histórico para referência futura

## Convenções de Nomenclatura

- Arquivos: `XXXX-kebab-case-titulo.md`
- Numeração sequencial: 0001, 0002, 0003...
- Títulos em português para RFCs internos
- Documentação técnica pode incluir inglês conforme necessário
