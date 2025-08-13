<div align="center">
  <h1>react-lgpd-consent 🍪 </h1>
  <p><strong>A biblioteca de consentimento de cookies mais completa para React</strong></p>
  <p>Conformidade com LGPD, GDPR e CCPA (Partial) • TypeScript First • Zero Config</p>

  <div>
    <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/v/react-lgpd-consent?style=for-the-badge&logo=npm&color=cb3837&logoColor=white" alt="NPM Version"></a>
     <a href="https://www.npmjs.com/package/react-lgpd-consent"><img src="https://img.shields.io/npm/dm/react-lgpd-consent?style=for-the-badge&logo=npm&color=ff6b35&logoColor=white" alt="Downloads"></a>
     <a href="https://github.com/lucianoedipo/react-lgpd-consent/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white" alt="License"></a>
  </div>
  
  <div>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Ready"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React 18+"></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-Compatible-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Compatible"></a>
  </div>

  <br>

  <p>
    <a href="#-instalação"><strong>Instalação</strong></a> •
    <a href="#-uso-básico"><strong>Começar Agora</strong></a> •
    <a href="#-características-principais"><strong>Funcionalidades</strong></a> •
    <a href="#-api-e-funcionalidades"><strong>Documentação</strong></a> •
    <a href="#-conformidade-e-lgpd"><strong>Compliance</strong></a>
  </p>
</div>

---

## 🎯 **Por que escolher react-lgpd-consent?**

**A única biblioteca que você precisa para compliance completo de cookies no Brasil.** Desenvolvida seguindo as diretrizes oficiais da ANPD (Autoridade Nacional de Proteção de Dados), com foco em experiência do desenvolvedor e performance.

### 🏆 **Diferencial Competitivo**

- **🧠 AI-Powered Development**: Sistema inteligente de orientações que guia o desenvolvedor
- **🎯 Zero False Positives**: UI dinâmica que se adapta às suas necessidades reais
- **🚀 Performance First**: Bundle otimizado com tree-shaking e lazy loading
- **🛡️ Enterprise Ready**: Auditoria completa, logs de compliance e versionamento

## ✨ Características Principais

<table>
<tr>
<td width="50%">

### 🇧🇷 **Compliance Brasileiro**

- **LGPD/ANPD Oficial**: Implementação baseada nas diretrizes oficiais
- **Auditoria Completa**: Logs detalhados para conformidade
- **Minimização de Dados**: Armazena apenas o essencial
- **Transparência Total**: Textos e metadados completos

</td>
<td width="50%">

### 🧠 **Developer Experience**

- **AI-Guided Setup**: Orientações automáticas no console
- **TypeScript First**: Tipagem completa e autocomplete
- **Zero Config**: Funciona out-of-the-box
- **Hot Reload**: Mudanças instantâneas em desenvolvimento

</td>
</tr>
<tr>
<td>

### 🎨 **UI/UX Inteligente**

- **Material-UI Native**: Componentes prontos e customizáveis
- **Responsive Design**: Funciona em todos os dispositivos
- **Dark/Light Mode**: Suporte automático a temas
- **Accessibility First**: WCAG 2.1 AA compliant

</td>
<td>

### ⚡ **Performance**

- **Tree Shaking**: Bundle otimizado automaticamente
- **Lazy Loading**: Carregamento sob demanda
- **SSR/SSG Ready**: Next.js, Gatsby, Remix compatível
- **< 5KB gzipped**: Impacto mínimo no seu app

</td>
</tr>
</table>

### 🚀 **Integrações Nativas**

<div align="center">
  <img src="https://img.shields.io/badge/Google_Analytics-E37400?style=for-the-badge&logo=google-analytics&logoColor=white" alt="Google Analytics">
  <img src="https://img.shields.io/badge/Google_Tag_Manager-4285F4?style=for-the-badge&logo=google-tag-manager&logoColor=white" alt="Google Tag Manager">
  <img src="https://img.shields.io/badge/Facebook_Pixel-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook Pixel">
  <img src="https://img.shields.io/badge/Hotjar-FF3C00?style=for-the-badge&logo=hotjar&logoColor=white" alt="Hotjar">
  <img src="https://img.shields.io/badge/UserWay-6C5CE7?style=for-the-badge&logoColor=white" alt="UserWay">
</div>

## 🚀 Instalação

<details>
<summary><strong>📦 NPM/Yarn/PNPM</strong></summary>

```bash
# NPM
npm install react-lgpd-consent

# Yarn
yarn add react-lgpd-consent

# PNPM
pnpm add react-lgpd-consent
```

</details>

<details>
<summary><strong>📋 Dependências Peer</strong></summary>

Certifique-se de ter as seguintes dependências instaladas:

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled js-cookie
```

**Versões suportadas:**

- React: `^18.0.0`
- Material-UI: `^5.0.0`
- TypeScript: `^4.5.0` (opcional, mas recomendado)

</details>

<details>
<summary><strong>🎯 Instalação Completa (Recomendada)</strong></summary>

Para uma experiência completa, instale com todas as integrações:

```bash
npm install react-lgpd-consent @mui/material @emotion/react @emotion/styled js-cookie
```

</details>

## 📖 Uso Básico

### 🎯 **Setup em 30 segundos**

```tsx
import { ConsentProvider } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing'],
      }}
    >
      {/* Sua aplicação */}
      <YourApp />
    </ConsentProvider>
  )
}
```

### 🔥 **Exemplo Completo com Integrações**

```tsx
import {
  ConsentProvider,
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX',
  }),
  createGoogleTagManagerIntegration({
    gtmId: 'GTM-XXXXXXX',
  }),
]

function App() {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ['analytics', 'marketing', 'functional'],
      }}
      texts={{
        controllerInfo:
          'Controlado por: Sua Empresa LTDA (CNPJ: XX.XXX.XXX/XXXX-XX)',
        dataTypes: 'Coletamos dados de navegação, preferências e interações.',
        userRights:
          'Você pode acessar, corrigir ou excluir seus dados a qualquer momento.',
        contactInfo: 'Entre em contato: privacy@suaempresa.com',
      }}
      onConsentGiven={(state) => {
        console.log('✅ Consentimento registrado:', state)
        // Opcional: enviar para seu sistema de auditoria
      }}
      onConsentRevoked={(state) => {
        console.log('❌ Consentimento revogado:', state)
      }}
    >
      {/* Scripts carregados automaticamente após consentimento */}
      <ConsentScriptLoader integrations={integrations} />

      {/* Sua aplicação */}
      <HomePage />
    </ConsentProvider>
  )
}
```

### 🎨 **UI Customizada**

```tsx
import { ConsentProvider, useConsent, useCategories } from 'react-lgpd-consent'

function CustomCookieBanner() {
  const { acceptAll, acceptSelected, preferences } = useConsent()
  const categories = useCategories()

  return (
    <div className="custom-banner">
      <h3>🍪 Personalize sua experiência</h3>
      <p>Utilizamos cookies para melhorar sua navegação.</p>

      {categories.map((category) => (
        <label key={category.id}>
          <input
            type="checkbox"
            checked={preferences[category.id] ?? false}
            disabled={category.essential}
          />
          {category.name}
        </label>
      ))}

      <button onClick={acceptAll}>Aceitar Todos</button>
      <button onClick={() => acceptSelected(preferences)}>
        Salvar Preferências
      </button>
    </div>
  )
}

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics'] }}
      CookieBannerComponent={CustomCookieBanner}
    >
      <YourApp />
    </ConsentProvider>
  )
}
```

## 🔧 API e Funcionalidades

### 📊 **Categorias de Cookies Suportadas**

<table>
<tr>
<th>Categoria</th>
<th>ID</th>
<th>Descrição</th>
<th>Essencial</th>
</tr>
<tr>
<td>🔒 <strong>Necessários</strong></td>
<td><code>necessary</code></td>
<td>Cookies essenciais para funcionamento básico</td>
<td>✅ Sempre ativo</td>
</tr>
<tr>
<td>📈 <strong>Analíticos</strong></td>
<td><code>analytics</code></td>
<td>Google Analytics, Adobe Analytics, etc.</td>
<td>❌ Opcional</td>
</tr>
<tr>
<td>🎯 <strong>Marketing</strong></td>
<td><code>marketing</code></td>
<td>Facebook Pixel, Google Ads, remarketing</td>
<td>❌ Opcional</td>
</tr>
<tr>
<td>⚙️ <strong>Funcionais</strong></td>
<td><code>functional</code></td>
<td>Chat, mapas, vídeos incorporados</td>
<td>❌ Opcional</td>
</tr>
<tr>
<td>👥 <strong>Sociais</strong></td>
<td><code>social</code></td>
<td>Botões de compartilhamento, comentários</td>
<td>❌ Opcional</td>
</tr>
<tr>
<td>🎨 <strong>Personalização</strong></td>
<td><code>personalization</code></td>
<td>Preferências, temas, idiomas</td>
<td>❌ Opcional</td>
</tr>
</table>

### 🎛️ **Configuração Avançada**

<details>
<summary><strong>ConsentProvider Props</strong></summary>

```tsx
interface ConsentProviderProps {
  // ✨ Configuração de Categorias
  categories: {
    enabledCategories: CategoryId[]
    customCategories?: CustomCategory[]
  }

  // 🎨 Customização de UI
  CookieBannerComponent?: ComponentType<CustomCookieBannerProps>
  PreferencesModalComponent?: ComponentType<CustomPreferencesModalProps>
  FloatingPreferencesButtonComponent?: ComponentType<CustomFloatingPreferencesButtonProps>

  // 📝 Textos Personalizados
  texts?: {
    controllerInfo?: string
    dataTypes?: string
    userRights?: string
    contactInfo?: string
    // ... mais opções
  }

  // ⚙️ Comportamento
  blocking?: boolean // Banner bloqueante
  disableDeveloperGuidance?: boolean // Desabilitar orientações

  // 📊 Callbacks de Auditoria
  onConsentGiven?: (state: ConsentState) => void
  onConsentRevoked?: (state: ConsentState) => void
  onPreferencesChanged?: (state: ConsentState) => void
}
```

</details>

### 🪝 **Hooks Disponíveis**

<details>
<summary><strong>useConsent()</strong></summary>

```tsx
const {
  // 📊 Estado
  consented, // boolean: usuário já deu consentimento?
  preferences, // Record<string, boolean>: preferências por categoria
  isHydrated, // boolean: dados carregados do cookie?

  // 🎬 Ações
  acceptAll, // () => void: aceitar todas as categorias
  rejectAll, // () => void: rejeitar todas (exceto essenciais)
  acceptSelected, // (prefs: Record<string, boolean>) => void
  resetConsent, // () => void: limpar tudo e mostrar banner novamente

  // 🔄 Controle de UI
  showPreferences, // () => void: abrir modal de preferências
  hidePreferences, // () => void: fechar modal
} = useConsent()
```

</details>

<details>
<summary><strong>useCategories()</strong></summary>

```tsx
const categories = useCategories() // Category[]

// Cada categoria tem:
interface Category {
  id: string
  name: string
  description: string
  essential: boolean
  examples?: string[]
}
```

</details>

<details>
<summary><strong>useCategoryStatus()</strong></summary>

```tsx
const isAnalyticsEnabled = useCategoryStatus('analytics') // boolean | null
// null = categoria não configurada
// true = categoria ativa e consentimento dado
// false = categoria ativa mas consentimento negado
```

</details>

### 🚀 **Integrações e Scripts**

<details>
<summary><strong>ConsentScriptLoader</strong></summary>

Carrega scripts automaticamente após o consentimento:

```tsx
import {
  ConsentScriptLoader,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createFacebookPixelIntegration,
} from 'react-lgpd-consent'

const integrations = [
  createGoogleAnalyticsIntegration({
    measurementId: 'G-XXXXXXXXXX',
    anonymizeIP: true,
    cookieFlags: 'SameSite=None; Secure',
  }),

  createGoogleTagManagerIntegration({
    gtmId: 'GTM-XXXXXXX',
    dataLayerName: 'dataLayer',
  }),

  createFacebookPixelIntegration({
    pixelId: '1234567890',
    advancedMatching: true,
  }),
]

function App() {
  return (
    <ConsentProvider
      categories={{ enabledCategories: ['analytics', 'marketing'] }}
    >
      <ConsentScriptLoader integrations={integrations} />
      <YourApp />
    </ConsentProvider>
  )
}
```

</details>

<details>
<summary><strong>ConsentGate - Renderização Condicional</strong></summary>

Renderize componentes apenas com consentimento:

```tsx
import { ConsentGate } from 'react-lgpd-consent'

// Componente simples
<ConsentGate category="marketing">
  <FacebookPixel />
</ConsentGate>

// Múltiplas categorias (AND)
<ConsentGate categories={['analytics', 'marketing']}>
  <AdvancedTracking />
</ConsentGate>

// Fallback quando não consentido
<ConsentGate category="functional" fallback={<StaticMap />}>
  <InteractiveMap />
</ConsentGate>

// Hook para lógica customizada
function MyComponent() {
  const canShowAds = useCategoryStatus('marketing')

  if (canShowAds === null) return <Loading />
  if (!canShowAds) return <AdFreeExperience />

  return <AdsEnabledExperience />
}
```

</details>

## 🛡️ Conformidade e LGPD

<div align="center">
  <img src="https://img.shields.io/badge/Audit-Ready-007ACC?style=for-the-badge&logoColor=white" alt="Audit Ready">
  <img src="https://img.shields.io/badge/Privacy-First-6f42c1?style=for-the-badge&logoColor=white" alt="Privacy First">
</div>

### 📋 **Checklist de Conformidade LGPD**

<table>
<tr>
<td width="50%">

#### ✅ **Princípios Implementados**

- **✅ Minimização**: Apenas dados necessários
- **✅ Transparência**: Textos claros e detalhados
- **✅ Consentimento Livre**: Não bloqueante por padrão
- **✅ Finalidade**: Categorias específicas e bem definidas
- **✅ Adequação**: Conformidade com ANPD
- **✅ Segurança**: Cookies HTTPOnly quando possível

</td>
<td width="50%">

#### 📊 **Auditoria e Logs**

- **🕐 Timestamp**: Data/hora do consentimento
- **📍 Origem**: Banner, modal ou API
- **🔄 Versionamento**: Controle de mudanças
- **📝 Metadados**: Configuração do projeto
- **🔍 Rastreabilidade**: Histórico completo
- **📋 Exportação**: Logs em formato JSON

</td>
</tr>
</table>

### 🏛️ **Conformidade Regulatória**

<details>
<summary><strong>🇧🇷 LGPD (Lei Geral de Proteção de Dados)</strong></summary>

**Artigos implementados:**

- **Art. 8º**: Consentimento livre, informado e inequívoco
- **Art. 9º**: Consentimento específico e destacado
- **Art. 18º**: Direitos do titular (acesso, correção, eliminação)
- **Art. 46º**: Tratamento de dados sensíveis

**Funcionalidades:**

```tsx
<ConsentProvider
  texts={{
    controllerInfo: 'Controlador: Empresa XYZ (CNPJ: XX.XXX.XXX/XXXX-XX)',
    dataTypes: 'Dados de navegação, IP, cookies funcionais',
    userRights: 'Direito de acesso, correção, eliminação e portabilidade',
    contactInfo: 'DPO: privacy@empresa.com | Tel: (11) 9999-9999',
    legalBasis: 'Consentimento (Art. 7º, I) e Legítimo Interesse (Art. 7º, IX)',
  }}
/>
```

</details>

<details>
<summary><strong>🇪🇺 GDPR (General Data Protection Regulation)</strong></summary>

**Próxima versão (v0.3.0)** incluirá suporte completo ao GDPR:

- Consentimento granular por categoria
- Right to be forgotten (direito ao esquecimento)
- Data portability (portabilidade de dados)
- Consent withdrawal (retirada de consentimento)

</details>

<details>
<summary><strong>🇺🇸 CCPA (California Consumer Privacy Act)</strong></summary>

**Recursos CCPA planejados:**

- "Do Not Sell" toggle
- California resident detection
- Opt-out mechanisms
- Consumer rights notices

</details>

### 🏢 **Para Empresas e Auditoria**

<details>
<summary><strong>📊 Sistema de Auditoria Empresarial</strong></summary>

```tsx
import { ConsentProvider, useConsentAudit } from 'react-lgpd-consent'

function AuditDashboard() {
  const auditData = useConsentAudit()

  return (
    <div>
      <h3>📊 Relatório de Consentimento</h3>
      <p>Total de usuários: {auditData.totalUsers}</p>
      <p>Taxa de aceitação: {auditData.acceptanceRate}%</p>
      <p>Última atualização: {auditData.lastUpdate}</p>

      <button onClick={() => auditData.exportLogs('csv')}>
        📥 Exportar Logs CSV
      </button>
    </div>
  )
}

// Configuração com callbacks de auditoria
;<ConsentProvider
  onConsentGiven={(state) => {
    // Enviar para sistema de auditoria interno
    fetch('/api/consent-audit', {
      method: 'POST',
      body: JSON.stringify({
        userId: getCurrentUserId(),
        timestamp: new Date().toISOString(),
        preferences: state.preferences,
        source: state.source,
        version: state.version,
      }),
    })
  }}
  // ... outras props
/>
```

</details>

**💡 Recomendação**: Para implementação empresarial, considere nosso pacote premium `react-lgpd-consent-enterprise` com recursos avançados de auditoria e relatórios.

---

## 🤝 Contribuições

<div align="center">
  <img src="https://contrib.rocks/image?repo=lucianoedipo/react-lgpd-consent" alt="Contributors">
</div>

Contribuições são **muito bem-vindas**! Este é um projeto open-source e da comunidade brasileira para a comunidade.

### 🚀 **Como Contribuir**

1. **🔧 Issues**: Reporte bugs ou sugira melhorias
2. **💡 Features**: Proponha novas funcionalidades
3. **📖 Documentação**: Melhore a documentação
4. **🧪 Testes**: Adicione ou melhore os testes
5. **🌍 Internacionalização**: Ajude com traduções

### 📋 **Roadmap**

<details>
<summary><strong>🗺️ Próximas Versões</strong></summary>

#### v0.3.X+ - Compliance Avançado (Em Desenvolvimento)

- [x] Sistema completo de logs de auditoria
- [ ] Templates setoriais (governo, saúde, educação)
- [ ] Presets visuais por setor (WCAG AAA)
- [ ] Modal detalhado de cookies

#### v0.4.0 - Multi-Regulamentação

- [ ] Suporte completo GDPR
- [ ] Implementação CCPA
- [ ] Sistema de plugins extensível
- [ ] API server-side para Next.js

#### v0.5.0 - Enterprise Features

- [ ] Dashboard de analytics
- [ ] A/B testing para banners
- [ ] Integração com CMPs existentes
- [ ] SDK para mobile (React Native)

</details>

### 💬 **Comunidade**

- **🐛 Issues**: [GitHub Issues](https://github.com/lucianoedipo/react-lgpd-consent/issues)
- **💬 Discussões**: [GitHub Discussions](https://github.com/lucianoedipo/react-lgpd-consent/discussions)

---

## 📄 Licença

<div align="center">
  <p>
    <img src="https://img.shields.io/npm/l/react-lgpd-consent?style=for-the-badge&color=green&logoColor=white" alt="MIT License">
  </p>
  <p>
    Este projeto está licenciado sob a <strong>MIT License</strong>.<br>
    Veja o arquivo <a href="LICENSE"><strong>LICENSE</strong></a> para mais detalhes.
  </p>
  <p>
    <em>Feito com ❤️ por <a href="https://github.com/lucianoedipo">@lucianoedipo</a> e a comunidade brasileira</em>
  </p>
</div>

---

<div align="center">
  <h3>⭐ Se este projeto te ajudou, deixe uma estrela!</h3>
  <p>
    <a href="https://github.com/lucianoedipo/react-lgpd-consent/stargazers">
      <img src="https://img.shields.io/github/stars/lucianoedipo/react-lgpd-consent?style=social" alt="Stars">
    </a>
  </p>
</div>
