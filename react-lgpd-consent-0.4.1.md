# [FEATURE] Expansão das Integrações Nativas de Scripts v0.4.1

## 📋 Status da Implementação

### ✅ Concluído (21/09/2025)
- **Bundle Size Monitoring**: Size-limit configurado com thresholds (ESM <12KB, CJS <75KB, Types <100KB)
- **Coverage Monitoring**: Jest com thresholds (85% statements, 80% branches, 70% functions, 85% lines)
- **CI/CD Pipeline**: GitHub Actions com enforcement automático de qualidade
- **Scripts de Monitoramento**: coverage-check.cjs para validação no CI
- **Codecov Integration**: Relatórios de cobertura em PRs
- **Bundle Quality Score**: 89% - todos os thresholds atendidos

### 🚧 Em Progresso
- Implementação das novas integrações de scripts (Facebook Pixel, Hotjar, etc.)
- Sistema de templates para configuração em lote
- Helpers utilitários para categorização inteligente

### ⏳ Pendente
- Documentação completa das novas APIs
- Exemplos práticos de uso
- Testes E2E das integrações

---

## Resumo da solicitação

Implementar integrações nativas adicionais para as ferramentas de analytics e marketing mais utilizadas no mercado brasileiro, especialmente Facebook Pixel, Hotjar, Mixpanel, e outras plataformas críticas para e-commerce e SaaS.

## Caso de uso / problema que resolve

**Problema Atual:**

- Desenvolvedores precisam criar integrações customizadas para cada ferramenta de analytics/marketing
- Configuração manual de scripts é propensa a erros e inconsistências
- Falta de padronização na implementação de ferramentas populares no Brasil
- Curva de aprendizado elevada para integrar corretamente com consentimento LGPD

**Impacto no Mercado:**

- **E-commerce**: Facebook Pixel é essencial para campanhas de remarketing
- **SaaS/Tech**: Hotjar, Mixpanel são fundamentais para product analytics
- **Corporativo**: Ferramentas de chat/suporte precisam respeitar consentimento
- **Acessibilidade**: Expansão de opções além do UserWay

## Solução proposta (esboço)

### 🎯 **Novas Integrações a Implementar**

#### 1. Facebook Pixel

```tsx
// Nova factory function
export function createFacebookPixelIntegration(config: FacebookPixelConfig): ScriptIntegration

interface FacebookPixelConfig {
  pixelId: string
  autoTrack?: boolean // PageView automático
  advancedMatching?: Record<string, unknown>
}
```

#### 2. Hotjar

```tsx
export function createHotjarIntegration(config: HotjarConfig): ScriptIntegration

interface HotjarConfig {
  siteId: string
  version?: number // padrão 6
  debug?: boolean
}
```

#### 3. Mixpanel

```tsx
export function createMixpanelIntegration(config: MixpanelConfig): ScriptIntegration

interface MixpanelConfig {
  token: string
  config?: Record<string, unknown>
  api_host?: string
}
```

#### 4. Clarity (Microsoft)

```tsx
export function createClarityIntegration(config: ClarityConfig): ScriptIntegration

interface ClarityConfig {
  projectId: string
  upload?: boolean
}
```

#### 5. Intercom/Zendesk Chat

```tsx
export function createIntercomIntegration(config: IntercomConfig): ScriptIntegration
export function createZendeskChatIntegration(config: ZendeskConfig): ScriptIntegration
```

### 🔧 **Melhorias no Sistema Base**

#### A. Categorização Inteligente

```tsx
// Novo helper para sugerir categoria automaticamente
export function suggestCategoryForScript(scriptName: string): Category[]

// Exemplo
suggestCategoryForScript('facebook-pixel') // ['marketing', 'advertising']
suggestCategoryForScript('hotjar') // ['analytics']
```

#### B. Configuração em Lote

```tsx
// Novo helper para setup rápido por tipo de negócio
export function createECommerceIntegrations(config: ECommerceConfig): ScriptIntegration[]
export function createSaaSIntegrations(config: SaaSConfig): ScriptIntegration[]
export function createCorporateIntegrations(config: CorporateConfig): ScriptIntegration[]

interface ECommerceConfig {
  googleAnalytics?: GoogleAnalyticsConfig
  facebookPixel?: FacebookPixelConfig
  hotjar?: HotjarConfig
  userway?: UserWayConfig
}
```

#### C. Sistema de Templates

```tsx
// Templates pré-configurados
export const INTEGRATION_TEMPLATES = {
  ecommerce: {
    essential: ['google-analytics', 'facebook-pixel'],
    optional: ['hotjar', 'userway'],
    categories: ['analytics', 'marketing', 'functional'],
  },
  saas: {
    essential: ['google-analytics', 'mixpanel'],
    optional: ['intercom', 'hotjar'],
    categories: ['analytics', 'functional'],
  },
  corporate: {
    essential: ['google-analytics'],
    optional: ['userway', 'zendesk'],
    categories: ['analytics', 'functional'],
  },
}
```

### 📊 **Nova API Pública**

```tsx
// Adicionais em src/index.ts
export {
  createFacebookPixelIntegration,
  createHotjarIntegration,
  createMixpanelIntegration,
  createClarityIntegration,
  createIntercomIntegration,
  createZendeskChatIntegration,

  // Helpers utilitários
  suggestCategoryForScript,
  createECommerceIntegrations,
  createSaaSIntegrations,
  createCorporateIntegrations,

  // Templates
  INTEGRATION_TEMPLATES,

  // Tipos
  type FacebookPixelConfig,
  type HotjarConfig,
  type MixpanelConfig,
  type ClarityConfig,
  type IntercomConfig,
  type ZendeskConfig,
  type ECommerceConfig,
  type SaaSConfig,
  type CorporateConfig,
} from './utils/scriptIntegrations'
```

## Breaking change?

**Não** - Esta é uma adição puramente aditiva:

- Todas as APIs existentes permanecem inalteradas
- Novas integrações são opcionais
- Sistema `ConsentScriptLoader` mantém retrocompatibilidade total
- Sem mudanças em interfaces ou comportamentos existentes

## Critérios de aceitação

### ✅ **Implementação Técnica**

#### 1. Integrações Individuais

- [ ] **Facebook Pixel**: Implementação completa com init automático, PageView tracking, e suporte a custom events
- [ ] **Hotjar**: Script loading com siteId, configuração de version, e debug mode opcional
- [ ] **Mixpanel**: Implementação com token, configurações customizáveis, e suporte a api_host
- [ ] **Microsoft Clarity**: Integração com projectId e configurações de upload
- [ ] **Intercom**: Chat widget com configuração de app_id e customizações
- [ ] **Zendesk Chat**: Widget de suporte com configuração de account key

#### 2. Helpers e Utilitários

- [ ] **suggestCategoryForScript()**: Função que retorna categorias LGPD recomendadas por script
- [ ] **Templates de negócio**: Funções createECommerceIntegrations, createSaaSIntegrations, createCorporateIntegrations
- [ ] **INTEGRATION_TEMPLATES**: Constante com presets para diferentes tipos de negócio

#### 3. Documentação

- [ ] **INTEGRACOES.md**: Atualizar com todas as novas integrações e exemplos práticos
- [ ] **README.md**: Adicionar seção de integrações populares com quick-start
- [ ] **TSDoc**: Documentação completa de todas as novas APIs
- [ ] **Storybook**: Stories para demonstrar integrations em diferentes contextos

### ✅ **Qualidade e Testes**

#### 4. Cobertura de Testes

- [ ] **Unit tests**: Cada nova integration factory com mocks apropriados
- [ ] **Integration tests**: ConsentScriptLoader com múltiplas integrações novas
- [ ] **Type tests**: Verificação de TypeScript para todas as interfaces
- [ ] **E2E tests**: Carregamento real de scripts em ambiente de teste
- [ ] **Coverage improvement**: De 82.8% para 85%+ (statements) via CI enforcement
- [ ] **Coverage reporting**: Relatório automático no PR com mudanças de cobertura

#### 5. Performance e Compatibilidade

- [ ] **SSR-safe**: Todas as integrações funcionam em ambientes server-side
- [ ] **Tree-shaking**: Integrações não utilizadas não afetam bundle size
- [ ] **Bundle size monitoring**: Size-limit configurado para ESM (<12KB), CJS (<75KB), Types (<100KB)
- [ ] **Error handling**: Tratamento robusto de falhas de carregamento
- [ ] **Browser compatibility**: Suporte a todos os browsers da biblioteca

### ✅ **Developer Experience**

#### 6. Facilidade de Uso

- [ ] **Zero-config**: Templates funcionam out-of-the-box para casos comuns
- [ ] **IntelliSense**: Autocompletar completo para todas as configurações
- [ ] **Error messages**: Mensagens claras para configurações inválidas
- [ ] **Debug mode**: Logging detalhado para troubleshooting

#### 7. Exemplos Práticos

- [ ] **example/**: Exemplo completo usando novas integrações
- [ ] **Templates showcase**: Demonstração de cada template de negócio
- [ ] **Migration guide**: Como migrar de integrações customizadas para nativas

### ✅ **Compliance e Segurança**

#### 8. LGPD Compliance

- [ ] **Categorização correta**: Cada integração na categoria LGPD apropriada
- [ ] **Consentimento obrigatório**: Scripts só carregam após consentimento explícito
- [ ] **Data privacy**: Configurações que respeitam privacidade por padrão
- [ ] **Audit trail**: Logging de carregamento para auditoria

#### 9. Segurança

- [ ] **HTTPS only**: Todas as integrações usam conexões seguras
- [ ] **CSP friendly**: Headers de Content Security Policy compatíveis
- [ ] **No eval()**: Evitar execução de código inseguro
- [ ] **Sanitização**: Input validation em todas as configurações

## Alternativas consideradas

### 1. **Plugin System**:

Criar sistema de plugins externos para integrações.
**Rejeitado**: Complexidade desnecessária, preferível manter tudo nativo.

### 2. **Auto-detection**:

Detectar automaticamente scripts já presentes na página.
**Rejeitado**: Pode causar conflitos e não garante controle de consentimento.

### 3. **CDN-based**:

Hospedar integrações em CDN externa.
**Rejeitado**: Aumenta dependências e pontos de falha.

### 4. **Template-only approach**:

Apenas templates, sem integrações individuais.
**Rejeitado**: Remove flexibilidade para casos específicos.

### 🔧 **Bundle Size & Quality Monitoring**

#### D. Size Limit Integration

```json
// package.json - nova configuração
{
  "size-limit": [
    {
      "name": "ESM Bundle",
      "path": "dist/index.js",
      "limit": "12 KB"
    },
    {
      "name": "CJS Bundle",
      "path": "dist/index.cjs",
      "limit": "75 KB"
    },
    {
      "name": "Types",
      "path": "dist/index.d.ts",
      "limit": "100 KB"
    }
  ]
}
```

#### E. Coverage Monitoring

```yaml
# .github/workflows/ci.yml - novo job
- name: Test Coverage Report
  run: |
    npx jest --coverage --coverageReporters=json-summary
    node scripts/coverage-check.js
```

## Cronograma de Implementação

### **Semana 1**: Integrações Core + Monitoring

- Facebook Pixel + Hotjar (mais demandadas)
- **Size-limit setup** e configuração inicial
- **Coverage thresholds** no CI
- Testes unitários
- Documentação básica

### **Semana 2**: Integrações Complementares

- Mixpanel + Clarity + Chat widgets
- Sistema de templates
- Helper functions
- **Bundle size optimization** para novas integrações

### **Semana 3**: Polish & Exemplos

- Storybook stories
- Exemplo completo
- Documentação final
- Testes E2E
- **Coverage improvement** para atingir 85%+

### **Semana 4**: Release

- **Bundle size validation** final
- Code review final
- Performance testing
- Release candidate
- Launch v0.4.1

## Estimativa de Esforço

- **Development**: ~15-20 dias (1 dev)
- **Testing**: ~5-7 dias
- **Documentation**: ~3-5 dias
- **Bundle & Coverage Setup**: ~2-3 dias
- **Total**: ~27-33 dias

## Impacto Esperado

### **Para Desenvolvedores**

- ✅ **Setup time**: De ~2-4 horas para ~10 minutos por integração
- ✅ **Maintenance**: Redução de 80% no código de integração customizado
- ✅ **Consistency**: Padronização total das implementações

### **Para Negócios**

- ✅ **Time-to-market**: Lançamento de tracking 70% mais rápido
- ✅ **Compliance**: Zero risco de implementação incorreta de LGPD
- ✅ **Performance**: Bundle otimizado com tree-shaking

### **Para Ecossistema**

- ✅ **Adoption**: Esperado +40% de adoção da biblioteca
- ✅ **Community**: Redução de issues relacionadas a integrações
- ✅ **Market position**: Consolidação como solução #1 para LGPD + Analytics
- ✅ **Quality assurance**: Monitoramento contínuo de bundle size e cobertura de testes
- ✅ **Performance transparency**: Relatórios públicos de impacto no bundle a cada release

## Links / referências

- **API.md** - Documentação da API atual
- **INTEGRACOES.md** - Guia atual de integrações
- **CONFORMIDADE.md** - Requisitos LGPD
- **src/utils/scriptIntegrations.ts** - Implementação atual
- **example/CompleteExample.tsx** - Exemplo de uso avançado

## 📦 Bundle Size & Coverage Monitoring

### **Motivação**

Como biblioteca de terceiros, é crucial manter o bundle size mínimo e alta qualidade de código através de cobertura de testes rigorosa.

### **Estado Atual vs. Meta**

| Métrica                | Atual | Meta v0.4.1 | Limite CI          |
| ---------------------- | ----- | ----------- | ------------------ |
| **ESM Bundle**         | ~8KB  | <12KB       | ❌ Falha se >12KB  |
| **CJS Bundle**         | ~61KB | <75KB       | ❌ Falha se >75KB  |
| **Statement Coverage** | 82.8% | 85%+        | ⚠️ Warning se <85% |
| **Branch Coverage**    | 78.5% | 80%+        | ⚠️ Warning se <80% |

### **Implementação Técnica**

#### A. ✅ Package.json Configuration - **CONCLUÍDO**

```json
{
  "scripts": {
    "size-check": "size-limit",
    "test:coverage": "jest --coverage --coverageThreshold='{\"global\":{\"statements\":85,\"branches\":80,\"functions\":70,\"lines\":85}}'"
  },
  "devDependencies": {
    "size-limit": "^11.0.0",
    "@size-limit/preset-small-lib": "^11.0.0"
  },
  "size-limit": [
    {
      "name": "ESM Bundle",
      "path": "dist/index.js",
      "limit": "12 KB"
    },
    {
      "name": "CJS Bundle",
      "path": "dist/index.cjs",
      "limit": "75 KB"
    },
    {
      "name": "Complete Package",
      "path": "dist/index.js",
      "import": "{ ConsentProvider, useConsent, ConsentScriptLoader }",
      "limit": "15 KB"
    }
  ]
}
```

#### B. ✅ CI Workflow Enhancement - **CONCLUÍDO**

```yaml
# .github/workflows/ci.yml - novo job
jobs:
  ci:
    steps:
      # ... existing steps ...

      - name: Bundle Size Check
        run: |
          npm run build
          npx size-limit

      - name: Coverage Report & Check
        run: |
          npm run test:coverage
          npx jest --coverage --coverageReporters=json-summary

      - name: Coverage Comment (PR only)
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          lcov-file: ./coverage/lcov.info
```

#### C. ✅ Monitoramento Contínuo - **CONCLUÍDO**

- ✅ **Size-limit** reporta mudanças de bundle em cada PR
- ✅ **Coverage diff** mostra impacto de mudanças na cobertura  
- ✅ **Alerts automáticos** se limites forem ultrapassados
- ✅ **Histórico de tendências** via GitHub Actions artifacts
- ✅ **Script coverage-check.cjs** criado para enforcement no CI

### **Benefícios Esperados**

1. **👥 Para Desenvolvedores**
   - Feedback imediato sobre impacto no bundle
   - Prevenção de regressões de cobertura
   - Confiança na qualidade do código

2. **📦 Para Consumidores**
   - Garantia de bundle size controlado
   - Transparência sobre impacto de updates
   - Performance consistente

3. **🔧 Para Manutenção**
   - Detecção precoce de code bloat
   - Enforcement automático de qualidade
   - Métricas objetivas para releases

---

**Observação**: Esta feature complementa perfeitamente o **focus trapping** também planejado para v0.4.1. Juntas, criarão a versão mais robusta e completa da biblioteca até hoje, com monitoramento rigoroso de qualidade e performance.
