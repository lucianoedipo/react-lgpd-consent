# Conformidade LGPD/ANPD - Guia de Implementação v0.2.1

## 🎯 **Resumo das Correções Implementadas**

### ✅ **1. Cookie de Consentimento Reestruturado**

**Antes (v0.2.0):**

```json
{
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": true,
    "functional": true,
    "marketing": true,
    "social": true,
    "personalization": true
  },
  "isModalOpen": false
}
```

**Depois (v0.2.1 - Conformidade ANPD):**

```json
{
  "version": "1.0",
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": false
  },
  "consentDate": "2025-08-12T14:30:00.000Z",
  "lastUpdate": "2025-08-12T14:30:00.000Z",
  "source": "banner"
}
```

### ✅ **2. Configuração de Categorias por Projeto**

**Nova API - Apenas categorias usadas:**

```tsx
<ConsentProvider
  categories={{
    // Especificar apenas categorias que serão usadas
    enabledCategories: ['analytics', 'functional'],
    // Categorias específicas do projeto
    customCategories: [{
      id: 'governo',
      name: 'Integração Governamental',
      description: 'Cookies para sistemas gov.br',
      essential: false
    }]
  }}
>
```

**Cookie resultante (apenas categorias ativas):**

```json
{
  "preferences": {
    "necessary": true,
    "analytics": false,
    "functional": false,
    "governo": false
  }
}
```

### ✅ **3. Comportamentos LGPD Rigorosos**

#### **Banner Bloqueante:**

```tsx
<ConsentProvider blocking={true}>
  {/* Usuário DEVE decidir antes de continuar */}
  {/* Cookie criado apenas após decisão explícita */}
</ConsentProvider>
```

#### **Banner Não-Bloqueante (Padrão LGPD):**

```tsx
<ConsentProvider blocking={false}>
  {' '}
  {/* padrão */}
  {/* Estado inicial: "Rejeitar todos" (exceto necessários) */}
  {/* Cookie criado na primeira interação */}
</ConsentProvider>
```

### ✅ **4. Auditoria e Rastreabilidade**

**Campos obrigatórios no cookie:**

- `version`: Controle de migração
- `consentDate`: Timestamp da primeira interação
- `lastUpdate`: Timestamp da última modificação
- `source`: Origem da decisão (`banner`, `modal`, `programmatic`)

**Campos removidos do cookie:**

- `isModalOpen`: Estado de UI (não persistir)
- Categorias não utilizadas no projeto

---

## 📋 **Guia de Migração v0.2.0 → v0.2.1**

### **1. Especificar Categorias Ativas**

```tsx
// ❌ Antes - Todas as 6 categorias sempre ativas
<ConsentProvider>

// ✅ Depois - Apenas categorias necessárias
<ConsentProvider
  categories={{
    enabledCategories: ['analytics'], // Só analytics + necessary
  }}
>
```

### **2. Banner Bloqueante**

```tsx
// ✅ Para compliance rigorosa
<ConsentProvider blocking={true}>
  <CookieBanner /> {/* Bloqueia até decisão */}
```

### **3. Migração Automática de Cookies**

A biblioteca detecta e migra automaticamente cookies v0.2.0:

- Adiciona campos obrigatórios (`version`, timestamps, `source`)
- Remove `isModalOpen`
- Preserva preferências existentes

---

## 🏛️ **Exemplo: Projeto Governamental**

```tsx
import { ConsentProvider, CookieBanner } from 'react-lgpd-consent'

function App() {
  return (
    <ConsentProvider
      // Configuração de categorias específicas
      categories={{
        enabledCategories: ['analytics'],
        customCategories: [
          {
            id: 'governo',
            name: 'Integração gov.br',
            description: 'Cookies para login único e serviços governamentais',
            essential: false,
          },
        ],
      }}
      // Banner bloqueante para compliance rigorosa
      blocking={true}
      // Textos específicos para órgão público
      texts={{
        bannerMessage:
          'Este site utiliza cookies conforme Decreto 15.572/2020...',
        controllerInfo:
          'Controlador: Secretaria XYZ - CNPJ: 00.000.000/0001-00',
        contactInfo: 'DPO: dpo@secretaria.gov.br',
      }}
      // Callback para auditoria
      onConsentGiven={(state) => {
        // Log para sistema de auditoria
        console.log('Consentimento registrado:', {
          timestamp: state.consentDate,
          categories: Object.keys(state.preferences).filter(
            (k) => state.preferences[k],
          ),
          source: state.source,
        })
      }}
    >
      <YourApp />
      <CookieBanner />
    </ConsentProvider>
  )
}
```

**Cookie resultante:**

```json
{
  "version": "1.0",
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": false,
    "governo": true
  },
  "consentDate": "2025-08-12T14:30:00.000Z",
  "lastUpdate": "2025-08-12T14:30:00.000Z",
  "source": "banner"
}
```

---

## 🛡️ **Conformidade ANPD Garantida**

### ✅ **Princípio da Minimização**

- Cookie contém apenas dados essenciais para funcionamento
- Apenas categorias realmente utilizadas são incluídas
- Campos de UI não são persistidos

### ✅ **Consentimento Específico e Informado**

- Usuário decide categoria por categoria
- Textos específicos por setor (governo, saúde, educação)
- Base legal e informações de contato do DPO

### ✅ **Transparência e Auditoria**

- Timestamps completos para prestação de contas
- Origem da decisão registrada
- Versionamento para controle de migração

### ✅ **Direito de Revogação**

- Modal de preferências sempre acessível
- `resetConsent()` para revogar completamente
- Histórico de modificações via `lastUpdate`

---

## 💡 **Outras Informações para Conformidade**

### **Campos Adicionais Recomendados** (futuro v0.2.2):

```tsx
// Informações extras para compliance avançada
export interface ConsentCookieData {
  // ... campos atuais ...

  // 🆕 Campos opcionais para compliance avançada
  userAgent?: string // Para detecção de bot/scraping
  ipHash?: string // Hash do IP (não IP completo - LGPD)
  sessionId?: string // ID da sessão (para correlação)
  geolocation?: string // Região/país (para multi-jurisdição)
  language?: string // Idioma preferido
  deviceType?: string // mobile/desktop (para analytics)
}
```

### **Integração com Sistemas de Auditoria:**

```tsx
// Hook para auditoria avançada
const auditLog = useConsentAuditLog({
  includeUserAgent: true,
  includeSessionId: true,
  autoExport: { format: 'csv', interval: 'monthly' },
})

// Exemplo de log completo
const logEntry = {
  timestamp: '2025-08-12T14:30:00.000Z',
  action: 'consent_modified',
  categories: ['necessary', 'analytics'],
  source: 'modal',
  userAgent: 'Mozilla/5.0...',
  sessionId: 'abc123',
  previousState: { analytics: false },
  newState: { analytics: true },
}
```

---

## 🎯 **Conclusão**

**v0.2.1 transforma a biblioteca numa solução 100% compliant com LGPD/ANPD:**

✅ **Minimização**: Apenas dados necessários no cookie  
✅ **Especificidade**: Consentimento granular por categoria ativa  
✅ **Transparência**: Timestamps e auditoria completa  
✅ **Flexibilidade**: Categorias customizadas por projeto  
✅ **Usabilidade**: API simples mantendo conformidade rigorosa

**A biblioteca agora atende desde projetos simples até órgãos públicos com máxima conformidade legal.**
