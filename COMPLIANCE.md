# COMPLIANCE.md - react-lgpd-consent

## 📜 Objetivo

Este documento descreve as medidas de conformidade da biblioteca **react-lgpd-consent** com a Lei Geral de Proteção de Dados (LGPD) e o Guia Orientativo da ANPD sobre Cookies e Proteção de Dados Pessoais.

## ✅ Conformidade Atual (MVP v0.1.x)

### Implementado e Funcional

- ✅ **Consentimento granular**: categorias `analytics` e `marketing` independentes
- ✅ **Sem pre-check**: cookies não essenciais desativados por padrão
- ✅ **Revogação e reconfiguração**: funções `resetConsent()` e `openPreferences()`
- ✅ **Banner não intrusivo**: não bloqueia navegação do usuário
- ✅ **Suporte SSR**: via prop `initialState` (evita flash)
- ✅ **Acessibilidade**: foco gerenciado, navegação por teclado, ARIA adequado
- ✅ **API estável**: identificadores em inglês, textos em pt-BR customizáveis
- ✅ **Segurança básica**: `SameSite=Lax`, `secure=true`, validação de cookies

## 🚀 Roadmap de Desenvolvimento

### v0.2.0 - Adequação ANPD (Próxima Release)

**Foco**: Baixo atrito, 100% backward-compatible, adequação básica ANPD

#### ✅ Implementar (Pronto para MVP)

- [ ] **Textos ANPD expandidos**: Campos opcionais em `ConsentTexts`

  ```typescript
  interface ConsentTexts {
    // Existentes (manter)
    bannerMessage: string
    acceptAll: string
    declineAll: string

    // NOVOS - opcionais
    controllerInfo?: string // "Controlado por [Empresa/CNPJ]"
    dataTypes?: string // "Coletamos dados de navegação..."
    thirdPartySharing?: string // "Compartilhamos com terceiros..."
    userRights?: string // "Seus direitos: acesso, correção..."
    contactInfo?: string // "Contato: dpo@empresa.com"
  }
  ```

- [ ] **Link de política visível**: Garantir `policyLinkUrl` destacado
- [ ] **Validação robusta de cookies**: Sanitização e versioning
- [ ] **Defaults de segurança**: Documentar configurações recomendadas
- [ ] **Testes de acessibilidade**: Validação com axe/Lighthouse

#### 📋 Critérios de Aceite v0.2.0

- [ ] Textos opcionais exibidos condicionalmente
- [ ] Cookie com `version` para migrações futuras
- [ ] Validação que ignora cookies malformados
- [ ] Documentação de segurança atualizada
- [ ] 100% backward compatible (sem breaking changes)

### v0.3.0 - Compliance Operacional

**Foco**: Estruturas avançadas, transparência total

#### 🏗️ Funcionalidades Principais

- [ ] **Modal detalhado de cookies**: Catálogo completo

  ```typescript
  interface CookieDetails {
    name: string
    purpose: string
    duration: string
    thirdParty?: string
    transferCountries?: string[]
  }

  interface CookieRegistry {
    [K in Category]: {
      description: string
      cookies: CookieDetails[]
      required: boolean
    }
  }
  ```

- [ ] **Logs de consentimento**: Registro client-side

  ```typescript
  interface ConsentLog {
    timestamp: Date
    action: 'given' | 'revoked' | 'modified'
    categories: ConsentPreferences
    userAgent: string
  }
  ```

- [ ] **Base legal por categoria**: `consent` | `legitimate_interest`
- [ ] **Callbacks expandidos**: Eventos de auditoria

### v0.4.0 - Auditoria e Relatórios

**Foco**: Ferramentas de compliance para DPO

#### 📊 Funcionalidades Avançadas

- [ ] **Relatórios de compliance**: `generateComplianceReport()`
- [ ] **Templates por setor**: E-commerce, mídia, educação, etc.
- [ ] **Exportação para DPO**: Dados estruturados para auditoria
- [ ] **Categorias dinâmicas**: Configurável via props (opcional)
- [ ] **Assinatura de cookies**: Integridade opcional

## 🎯 Controle de Progresso

### Marcos de Entrega

#### v0.2.0 - MVP Completo ⏳

- **Target**: 2 semanas
- **Status**: Em desenvolvimento
- **Bloqueadores**: -
- **Próximos passos**: Expandir `ConsentTexts`

#### v0.3.0 - Compliance Avançado 📋

- **Target**: 6-8 semanas
- **Status**: Planejamento
- **Dependências**: v0.2.0 completa
- **Próximos passos**: Design do `CookieRegistry`

#### v0.4.0 - Ferramentas DPO 📊

- **Target**: 12 semanas
- **Status**: Roadmap
- **Dependências**: v0.3.0 + feedback de usuários
- **Próximos passos**: Pesquisa com DPOs

## 🔒 Segurança e Privacidade

### Implementado

- ✅ Armazenamento client-side via `js-cookie`
- ✅ `SameSite=Lax`, `secure=true` em HTTPS
- ✅ Sem coleta antes do consentimento
- ✅ Validação básica de entrada

### Planejado

- 🔄 **v0.2**: Sanitização robusta + versioning
- 🔄 **v0.3**: Logs estruturados
- 🔄 **v0.4**: Assinatura opcional de cookies

## 📈 Métricas de Sucesso

### MVP (v0.2.0)

- [ ] 0 breaking changes
- [ ] Cobertura de testes > 90%
- [ ] Lighthouse Accessibility = 100
- [ ] Bundle size < 50KB

### Adoção (v0.3.0)

- [ ] 5+ projetos usando em produção
- [ ] Feedback de DPO/compliance
- [ ] Documentação de casos de uso

### Maturidade (v0.4.0)

- [ ] Template de compliance por setor
- [ ] Integração com ferramentas de auditoria
- [ ] Casos de sucesso documentados

## 📚 Referências e Padrões

- [Lei 13.709/2018 - LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Guia ANPD - Cookies e Proteção de Dados](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf)
- [GDPR Recital 32](https://gdpr-info.eu/recitals/no-32/) - Consentimento
- [ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32002L0058) - Cookies
