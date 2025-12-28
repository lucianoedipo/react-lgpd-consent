# Guia de Conformidade LGPD

Este documento descreve as medidas de conformidade da biblioteca **react-lgpd-consent** com a Lei Geral de Proteção de Dados (LGPD) e as diretrizes da ANPD, detalhando as ferramentas que auxiliam os desenvolvedores a manter a conformidade.

> 💡 **Implementando conformidade?** Veja [RECIPES.md](./RECIPES.md#4-bump-de-versão-de-consentimento) para receita de bump de versão quando sua política de privacidade mudar.

**Referências Oficiais:**

- [Lei Geral de Proteção de Dados (Lei Nº 13.709/2018)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Guia Orientativo de Cookies e Proteção de Dados Pessoais da ANPD](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf)
- Baseline local: `baseline/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf`

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

### Base ANPD (o que o guidance reforça)

Com base no guia da ANPD, o guidance reforça pontos como:

- Cookies não necessários devem iniciar desativados e depender de consentimento expresso.
- Não utilizar consentimento tácito nem opções pré-selecionadas.
- Oferecer aceitar/rejeitar/gerenciar com o mesmo destaque e possibilitar revogação simples e gratuita.
- Informar finalidades específicas, período de retenção e compartilhamento com terceiros.
- Disponibilizar mecanismo próprio de gerenciamento de cookies (navegador é complementar).

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
│ necessary   │ Cookies Necessários  │ ❌ NÃO      │ 🔒 SIM     │
│ analytics   │ Cookies Analíticos   │ ✅ SIM      │ ⚙️ NÃO     │
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

### Score de conformidade (orientativo, não normativo)

O **score de conformidade** exibido no guidance é **heurístico** e serve apenas para orientar a qualidade da configuração. Ele **não** substitui avaliação jurídica ou auditoria de compliance.

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

## 🛑 Modo hard block/veil (interação condicionada)

Alguns contextos regulatórios exigem que o usuário **decida explicitamente** antes de interagir com o site. Para isso:

- Use `blocking={true}` + `blockingMode="hard"` + `blockingStrategy="provider"`.
- O Provider aplica overlay e torna o conteúdo da aplicação **inerte** (`inert` + `aria-hidden`) até a decisão.
- O banner e o modal permanecem acessíveis por teclado, atendendo requisitos de acessibilidade.
- Use `cookieBannerProps.policyLinkUrl` para expor o link da política de privacidade.

Exemplo:

```tsx
<ConsentProvider
  categories={{ enabledCategories: ['analytics', 'marketing'] }}
  blocking
  blockingMode="hard"
  blockingStrategy="provider"
  cookieBannerProps={{ policyLinkUrl: '/privacidade' }}
>
  <App />
</ConsentProvider>
```

## 🔄 Versionamento de Consentimento (v0.5.x)

- **Resumo da solicitação**: habilitar namespace + versão para a chave de armazenamento de consentimento e uma estratégia clara de migração, inclusive ao compartilhar banners entre subdomínios.
- **Caso de uso — problema que resolve**: quando políticas, integrações ou categorias mudam de escopo, o consentimento anterior deixa de ser válido. Sem versionamento explícito, o estado antigo persiste e a organização perde rastreabilidade de conformidade.

### Solução adotada

- `storage.namespace` e `storage.version` geram automaticamente a chave (`namespace__v<versão>`) via `buildConsentStorageKey`.
- `storage.domain` propaga a mesma chave para subdomínios (`.example.com`, `.gov.br` etc.), evitando duplicação de banners.
- Ao detectar mudança na chave, o `ConsentProvider` remove o cookie antigo, reseta o estado e dispara o hook `onConsentVersionChange`.
- O hook fornece `{ previousKey, nextKey, resetConsent }` para que o controlador limpe caches auxiliares (localStorage, indexedDB, dataLayers) antes de liberar a nova experiência. O reset base já ocorre automaticamente.
- A alteração é **non-breaking**: consumidores que não configurarem `storage` continuam com o comportamento padrão (`lgpd-consent__v1`).
- Breaking change? **Não** — apenas quem altera manualmente `storage.version` força o re-consentimento; demais instalações permanecem inalteradas.

### Critérios de aceitação

- Alterar `storage.version` em produção força o fluxo de re-consentimento completo, incluindo remoção do cookie legado.
- Exemplos de subdomínio (`.example.com`) mantêm um único consentimento sincronizado.
- A cada bump, o guia de migração interno da equipe deve registrar motivo, data e responsável pelo versionamento.

### Exemplo prático (compartilhando consentimento entre subdomínios)

```tsx
import { ConsentProvider } from '@react-lgpd-consent/mui'

export function LGPDBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
      storage={{ namespace: 'portal.gov.br', version: '2025-Q4', domain: '.gov.br' }}
      onConsentVersionChange={({ previousKey, nextKey, resetConsent }) => {
        console.info('[LGPD] Versão atualizada', { previousKey, nextKey })
        localStorage.removeItem('marketing-overrides')
        resetConsent()
      }}
    >
      {children}
    </ConsentProvider>
  )
}
```

### Alternativas avaliadas

- **Invalidar sempre** ao carregar a página prejudica a experiência do cidadão/cliente e reduz adesão.
- **Nunca invalidar** mantém consentimentos fora de escopo, fragilizando a base legal.
- Namespace + versão equilibram os dois extremos e fornecem trilha de auditoria, atendendo recomendações da ANPD para revalidação transparente.

## 🔒 Política de “necessários sempre ativos”

- **Resumo da solicitação**: tornar explícito que cookies estritamente necessários são inegociáveis na UI e na persistência.
- **Caso de uso — problema resolvido**: impede que equipes técnicas ou usuários finais desativem acidentalmente a categoria essencial, mantendo a base legal de operação.

### Como a biblioteca garante a conformidade
- `ConsentProvider` injeta automaticamente a categoria `necessary` e a mantém como `true` em qualquer fluxo (UI, hooks, integrações).
- Tentativas de programar `setPreference('necessary', false)` ou `setPreferences({ necessary: false, ... })` são ignoradas, com logs de aviso.
- O `PreferencesModal` bloqueia o toggle e sinaliza visualmente “Cookies necessários (sempre ativos)”.
- A serialização (`writeConsentCookie`) força `necessary=true`, protegendo contra mutações diretas ou plugins de terceiros.
- A hidratação (`readConsentCookie` + `validateProjectPreferences`) também assegura que valores corrompidos sejam normalizados.

### Critérios de aceitação
- UI, hooks, dataLayer e persistência retornam `necessary=true` de forma consistente.
- Testes automatizados cobrem tentativas de toggle/bypass e garantem que a serialização normalize o estado.
- Breaking change? **Não** — comportamento alinhado à LGPD; consumidores já eram orientados a tratar a categoria como imutável.

## 🔒 Segurança e Privacidade

- **Armazenamento**: O consentimento é armazenado exclusivamente no cliente (cookie).
- **Sem Coleta de Dados Pessoais**: A biblioteca em si não coleta ou transmite dados pessoais identificáveis.
