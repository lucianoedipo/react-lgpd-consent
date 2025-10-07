# Guia de Conformidade LGPD

Este documento descreve as medidas de conformidade da biblioteca **react-lgpd-consent** com a Lei Geral de Proteção de Dados (LGPD) e as diretrizes da ANPD, detalhando as ferramentas que auxiliam os desenvolvedores a manter a conformidade.

**Referências Oficiais:**
- [Lei Geral de Proteção de Dados (Lei Nº 13.709/2018)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Guia Orientativo de Cookies e Proteção de Dados Pessoais da ANPD](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf)

## 📜 Objetivo

Este documento descreve as medidas de conformidade da biblioteca **react-lgpd-consent** com a Lei Geral de Proteção de Dados (LGPD) e as diretrizes da ANPD, detalhando as ferramentas que auxiliam os desenvolvedores a manter a conformidade.

## ✅ Princípios da LGPD Implementados

A biblioteca implementa os seguintes princípios e requisitos da LGPD:

- **Consentimento Granular**: O usuário tem controle sobre cada categoria de cookie não essencial através do modal de preferências.
- **Minimização de Dados**: O cookie de consentimento armazena **apenas** as preferências para as categorias que foram ativadas na configuração do `ConsentProvider`. Isso reduz a superfície de dados e atende ao princípio da minimização.
- **Transparência e Auditoria**: O cookie de consentimento armazena metadados essenciais para auditoria, como `version` (versão da estrutura do cookie), `consentDate` (data do primeiro consentimento), `lastUpdate` (data da última alteração) e `source` (origem da ação: "banner" ou "modal").
- **Facilidade de Revogação**: O usuário pode alterar suas preferências a qualquer momento através do botão flutuante e do modal de preferências, ou programaticamente.
- **Segurança**: O cookie é configurado com `SameSite=Lax` por padrão e o atributo `secure` é ativado automaticamente quando o site é servido via HTTPS.

## 🧠 Sistema de Orientações para Desenvolvedores

A biblioteca inclui um sistema que **orienta os desenvolvedores durante a implementação**, exibindo informações úteis no console para garantir que a configuração esteja correta.

### Console de Desenvolvimento

Em ambiente de desenvolvimento (`NODE_ENV !== 'production'`), a biblioteca exibe:

- **⚠️ Avisos**: Sobre configurações ausentes ou inconsistentes.
- **💡 Sugestões**: Recomendações para melhorar a conformidade.
- **🔧 Tabela de Categorias Ativas**: Uma lista clara de quais categorias estão em uso, para auxiliar na construção de UIs customizadas.

```
[🍪 LGPD-CONSENT] ⚠️  Avisos de Configuração
  [🍪 LGPD-CONSENT] Nenhuma configuração de categorias especificada. Usando padrão: necessary + analytics.

[🍪 LGPD-CONSENT] 🔧 Categorias Ativas (para UI customizada)
┌─────────────┬──────────────────────┬─────────────┬─────────────┐
│     ID      │         Nome         │ Toggle UI?  │ Essencial?  │
├─────────────┼──────────────────────┼─────────────┼─────────────┤
│ necessary   │ Cookies Necessários  │ ❌ NÃO      │ 🔒 SIM      │
│ analytics   │ Cookies Analíticos   │ ✅ SIM      │ ⚙️ NÃO      │
└─────────────┴──────────────────────┴─────────────┴─────────────┘
```

**IMPORTANTE**: Este sistema é **automaticamente desativado em produção**. Para forçar a desativação em qualquer ambiente, use a prop `disableDeveloperGuidance={true}` no `ConsentProvider`.

### Configuração Consciente

Para garantir a conformidade, especifique **apenas** as categorias de cookies que seu projeto realmente utiliza através da prop `categories`:

```tsx
<ConsentProvider
  categories={{
    // Habilita apenas as categorias que você realmente usa
    enabledCategories: ['analytics', 'marketing'],
  }}
>
  <App />
</ConsentProvider>
```

### Definição de Categorias (clareza e fonte única)

- A categoria `necessary` é sempre presente e cobre cookies essenciais (autenticação, segurança, operação básica do site).
- Categorias adicionais (`analytics`, `marketing`, `functional`, etc.) são opcionais e devem refletir apenas o que seu negócio realmente utiliza. Não habilite o que não usa.
- A fonte única de verdade para categorias é a prop `categories` do `ConsentProvider`. A UI e as integrações usam exatamente essa definição. Não declare categorias em outros lugares.

Exemplo mínimo (somente necessários):

```tsx
<ConsentProvider categories={{ enabledCategories: [] }}>
  <App />
</ConsentProvider>
```

Exemplo completo (site com analytics/marketing):

```tsx
<ConsentProvider categories={{ enabledCategories: ['analytics', 'marketing', 'functional'] }}>
  <App />
</ConsentProvider>
```

### Hooks de Validação

Para construir componentes de UI customizados que reagem à configuração, utilize os hooks:

- `useCategories()`: Fornece uma lista completa das categorias ativas no projeto.
- `useCategoryStatus('id')`: Verifica o status de uma categoria específica (se está ativa, se é essencial, etc.).

```tsx
import { useCategoryStatus } from 'react-lgpd-consent'

function AnalyticsFeature() {
  const analytics = useCategoryStatus('analytics')

  // Não renderiza o componente se a categoria 'analytics' não estiver configurada no ConsentProvider
  if (!analytics.isActive) {
    return null
  }

  return <AnalyticsDashboard />
}
```

## 🔒 Segurança e Privacidade

- **Armazenamento**: O consentimento é armazenado exclusivamente no cliente (cookie).
- **Sem Coleta de Dados Pessoais**: A biblioteca em si não coleta ou transmite dados pessoais identificáveis.
