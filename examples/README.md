# Exemplos Completos - react-lgpd-consent

Projetos **prontos para copiar e usar** em sua aplicação.

## 🆕 Novidades v0.7.0

Todos os exemplos foram atualizados com:

- ✅ **Callbacks de Lifecycle** - `onConsentInit`, `onConsentChange`, `onAuditLog`
- ✅ **Presets ANPD** - `createAnpdCategories()` para configuração rápida
- ✅ **Auditoria** - `createConsentAuditEntry()` para compliance
- ✅ **Mensagens de erro claras** - Hooks com erros em pt-BR

📖 **Documentação:** [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) | [API.md](../packages/react-lgpd-consent/API.md)

---

## 📁 Projetos Disponíveis

### 🔷 [next-app-router/](./next-app-router/)

**Next.js 14+ com App Router e Server Components**

- ✅ Configuração completa de consentimento
- ✅ SSR-safe (Server/Client Components)
- ✅ Integração Google Consent Mode v2
- ✅ Carregamento condicional de GA4 e GTM
- ✅ TypeScript configurado
- ✅ Pronto para produção

**Ideal para:**

- Aplicações Next.js modernas
- Sites com SEO crítico
- Projetos que precisam SSR

### 🔶 [vite/](./vite/)

**Vite + React (CSR otimizado)**

- ✅ Configuração completa de consentimento
- ✅ Build ultra-rápido com Vite
- ✅ Integração Google Consent Mode v2
- ✅ Carregamento condicional de scripts
- ✅ TypeScript configurado
- ✅ SPA otimizado

**Ideal para:**

- SPAs (Single Page Applications)
- Dashboards e painéis admin
- Aplicações client-side

## 🚀 Como Usar

### 1. Copie o Projeto

```bash
# Exemplo Next.js
cp -r examples/next-app-router my-project

# ou Exemplo Vite
cp -r examples/vite my-project
```

### 2. Instale Dependências

```bash
cd my-project
npm install
```

### 3. Configure Variáveis de Ambiente

```bash
# Crie .env.local (Next.js) ou .env (Vite)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 4. Rode o Projeto

```bash
npm run dev
```

## 📚 Estrutura Comum

Ambos os exemplos incluem:

### Componentes de Consentimento

- `ConsentProvider` - Provider principal com configuração
- `GtagConsentBootstrap` - Inicialização Google Consent Mode
- `GtagConsentUpdater` - Sincronização de mudanças
- `ConsentScriptLoader` - Carregamento condicional de scripts

### Integrações Prontas

- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Consent Mode v2 (sinais de consentimento)

### Categorias LGPD

- `necessary` - Cookies essenciais (sempre ativos)
- `analytics` - Análise de tráfego (Google Analytics)
- `marketing` - Marketing e publicidade (GTM, Ads)
- `functional` - Funcionalidades extras

## 🎯 Diferença entre Exemplos

| Feature                 | Next.js           | Vite          |
| ----------------------- | ----------------- | ------------- |
| **Renderização**        | SSR + CSR         | CSR apenas    |
| **SEO**                 | Ótimo             | Limitado      |
| **Performance Inicial** | Muito rápida      | Muito rápida  |
| **Build Tool**          | Turbopack/Webpack | Vite          |
| **Complexidade**        | Média             | Baixa         |
| **Uso Recomendado**     | Sites públicos    | Apps internos |

## 🔧 Customização

### Mudar Categorias

```tsx
<ConsentProvider
  categories={{
    enabledCategories: ['analytics', 'marketing', 'social'], // Adicione/remova
  }}
>
```

### Adicionar Nova Integração

```tsx
import { COMMON_INTEGRATIONS } from '@react-lgpd-consent/core'
;<ConsentScriptLoader
  integrations={[
    COMMON_INTEGRATIONS.googleAnalytics({ measurementId: GA_ID }),
    COMMON_INTEGRATIONS.facebookPixel({ pixelId: 'YOUR_PIXEL_ID' }), // Novo
  ]}
/>
```

### Customizar UI

```tsx
import { ConsentProvider, PreferencesModal } from '@react-lgpd-consent/mui'

<ConsentProvider
  PreferencesModalComponent={(props) => (
    <PreferencesModal {...props} hideBranding={true} />
  )}
>
```

## 📖 Documentação

- [Guia de Início Rápido](../QUICKSTART.md)
- [API Completa](../packages/react-lgpd-consent/API.md)
- [Guia de Migração](../MIGRATION.md)
- [Integrações](../packages/react-lgpd-consent/INTEGRACOES.md)

## 🐛 Troubleshooting

### Modal não aparece

```tsx
// ✅ Correto (pacote MUI - modal automático)
import { ConsentProvider } from '@react-lgpd-consent/mui'

// ❌ Incorreto (core - precisa fornecer modal)
import { ConsentProvider } from '@react-lgpd-consent/core'
```

### Scripts não carregam

1. Verifique se categorias estão habilitadas
2. Confirme que usuário deu consentimento
3. Veja console do navegador para erros

### SSR/Hydration mismatch (Next.js)

- Use `'use client'` em componentes de consentimento
- Não renderize banner/modal no servidor

## 💡 Para Desenvolvimento da Lib

**Para exemplos internos/demos do Storybook, veja:**

- 📁 **[../example/](../example/)** - Demos para desenvolvimento

---

**Mantido por:** @lucianoedipo  
**Licença:** MIT  
**Contribua:** [GitHub Issues](https://github.com/lucianoedipo/react-lgpd-consent/issues)
