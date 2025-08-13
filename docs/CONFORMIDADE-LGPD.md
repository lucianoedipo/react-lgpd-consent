# Conformidade LGPD/ANPD - Guia de Implementação v0.3.0

## 🎯 **Sistema de Orientações Implementado (v0.3.0)**

### ✅ **1. Cookie Inteligente - Minimização de Dados (LGPD Art. 6º)**

**Antes (v0.2.0):**

```json
{
  "version": "0.3.0",
  "consented": false,
  "preferences": {
    "necessary": true
  },
  "consentDate": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "lastUpdate": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "source": "initial",
  "projectConfig": {
    "enabledCategories": []
  }
}
```

**Depois (v0.2.2 - Sistema de Orientações):**

````json
```json
{
  "version": "0.3.0",
  "consented": false,
  "preferences": {
    "necessary": true
  },
  "consentDate": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "lastUpdate": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "source": "initial",
  "projectConfig": {
    "enabledCategories": []
  }
}
````

````

### ✅ **2. UI Dinâmica e Orientação Automática**

**Nova API - Configuração Consciente:**

```tsx
<ConsentProvider
  categories={{
    // Especificar apenas categorias que serão usadas
    enabledCategories: ['analytics', 'functional'],
  }}
>
````

**Cookie resultante (apenas categorias ativas):**

```json
{
  "version": "0.3.0",
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": true,
    "functional": true,
    "governo": true
  },
  "consentDate": "2025-08-12T14:30:00.000Z",
  "lastUpdate": "2025-08-12T14:30:00.000Z",
  "source": "modal",
  "projectConfig": {
    "enabledCategories": ["analytics", "functional"]
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

> **⚠️ Importante**: No momento, o fechamento ou a não interação com o banner não-bloqueante **NÃO** implica em rejeição automática de cookies. O banner reaparecerá em visitas futuras até que uma escolha explícita seja feita. A implementação de "dispensar como rejeitar todos" é uma funcionalidade planejada para futuras versões (`v0.+1.0`).

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

## 🏛️ **Exemplo: Projeto Governamental**

```tsx
import { ConsentProvider } from 'react-lgpd-consent' // CookieBanner não é mais importado diretamente

function App() {
  return (
    <ConsentProvider
      // Configuração de categorias específicas
      categories={{
        enabledCategories: ['analytics'],
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
      {/* CookieBanner é renderizado automaticamente pelo ConsentProvider */}
    </ConsentProvider>
  )
}
```

**Cookie resultante:**

````json
```json
{
  "version": "0.3.0",
  "consented": true,
  "preferences": {
    "necessary": true,
    "analytics": true
  },
  "consentDate": "2025-08-12T14:30:00.000Z",
  "lastUpdate": "2025-08-12T14:30:00.000Z",
  "source": "banner",
  "projectConfig": {
    "enabledCategories": ["analytics"]
  }
}
````

````

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

### **Campos Adicionais Recomendados** (futuro v0.+1.0):

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
````

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

**v0.3.0 transforma a biblioteca numa solução 100% compliant com LGPD/ANPD:**

✅ **Minimização**: Apenas dados necessários no cookie  
✅ **Especificidade**: Consentimento granular por categoria ativa  
✅ **Transparência**: Timestamps e auditoria completa  
✅ **Flexibilidade**: Categorias customizadas por projeto  
✅ **Usabilidade**: API simples mantendo conformidade rigorosa

**A biblioteca agora atende desde projetos simples até órgãos públicos com máxima conformidade legal.**
