# Instruções para GitHub Copilot - react-lgpd-consent

## 🎯 Contexto do Projeto

Você está trabalhando na biblioteca **react-lgpd-consent**, uma solução completa para gerenciamento de consentimento de cookies em conformidade com a LGPD (Lei Geral de Proteção de Dados) brasileira.

### Tecnologias Principais

- **React 18+** com TypeScript
- **Material-UI (MUI)** para componentes
- **js-cookie** para persistência
- **SSR/Next.js** compatível

## 🏗️ Arquitetura e Padrões

### Estrutura de Diretórios

```
src/
├── context/ConsentContext.tsx    # Provider principal
├── components/                   # Componentes UI
│   ├── CookieBanner.tsx         # Banner de consentimento
│   └── PreferencesModal.tsx     # Modal de preferências
├── hooks/useConsent.ts          # Hook principal
├── utils/                       # Utilitários
│   ├── cookieUtils.ts          # Manipulação de cookies
│   ├── scriptLoader.ts         # Carregamento dinâmico
│   └── ConsentGate.tsx         # Renderização condicional
├── types/types.ts              # Tipos TypeScript
└── index.ts                    # Exports públicos
```

### Convenções de Código

#### Nomeação (CRÍTICO)

- **API pública**: SEMPRE em inglês (`consented`, `preferences`, `acceptAll`)
- **Textos de UI**: padrão pt-BR, customizável via props
- **Interfaces**: `PascalCase` em inglês
- **Props**: sempre `Readonly<T>`

#### Material-UI

- **Imports individuais**: `import Button from '@mui/material/Button'`
- **Pass-through props**: `SnackbarProps?: Partial<SnackbarProps>`
- **Acessibilidade**: sempre incluir `aria-labelledby`, `aria-describedby`

#### TypeScript

```typescript
// ✅ Correto
interface ConsentProviderProps {
  readonly initialState?: ConsentState
  readonly texts?: Partial<ConsentTexts>
  readonly children: React.ReactNode
}

// ❌ Evitar
interface ConsentProviderProps {
  initialState?: ConsentState // sem readonly
  texts?: ConsentTexts // sem Partial
}
```

## 🚀 Estado Atual (v0.1.x → v0.2.0)

### Já Implementado ✅

- Context Provider com reducer
- Banner não intrusivo
- Modal de preferências básico
- Hook `useConsent()` completo
- ConsentGate para renderização condicional
- Suporte SSR via `initialState`
- Acessibilidade básica

### Em Desenvolvimento (v0.2.0) 🔄

Foque nestas funcionalidades para a próxima release:

#### 1. Textos ANPD Expandidos

```typescript
// Expandir esta interface (ADITIVO, não quebrar):
interface ConsentTexts {
  // Existentes (MANTER)
  bannerMessage: string
  acceptAll: string
  declineAll: string
  preferences: string

  // NOVOS (opcionais)
  controllerInfo?: string // "Controlado por [Empresa/CNPJ]"
  dataTypes?: string // "Coletamos: navegação, preferências..."
  thirdPartySharing?: string // "Compartilhamos com: Google Analytics..."
  userRights?: string // "Direitos: acesso, correção, exclusão..."
  contactInfo?: string // "Contato DPO: dpo@empresa.com"
}
```

#### 2. Validação Robusta de Cookies

```typescript
// Adicionar ao cookieUtils.ts
interface CookieVersion {
  version: string // ex: "0.2.0"
  data: ConsentState
}

// Sanitizar cookies malformados
function sanitizeCookie(raw: unknown): ConsentState | null
```

#### 3. Exibição Condicional de Textos

No CookieBanner e PreferencesModal, exibir blocos adicionais se as props existirem:

```tsx
{
  texts.controllerInfo && (
    <Typography variant="caption" sx={{ mt: 1 }}>
      {texts.controllerInfo}
    </Typography>
  )
}
```

## 🎨 Guidelines de UI/UX

### Banner de Consentimento

- **Posição**: `position: fixed; bottom: 0` (Snackbar MUI)
- **Não bloqueante**: usuário pode navegar sem aceitar
- **Acessível**: foco automático, navegação por teclado
- **Responsivo**: funcionar em mobile e desktop

### Modal de Preferências

- **Material-UI Dialog**: usar componente padrão
- **Switches**: para cada categoria (analytics, marketing)
- **Descrições claras**: explicar cada categoria
- **Botões de ação**: Salvar, Aceitar Todos, Recusar Todos

### Estados Visuais

- **Loading**: durante salvamento de preferências
- **Debug mode**: forçar exibição para QA via prop `debug`
- **SSR**: sem flash, renderização condicional

## 🔒 Segurança e Compliance

### Cookies

- **SameSite**: `'Lax'` por padrão
- **Secure**: `true` em HTTPS
- **HttpOnly**: `false` (precisa ser acessível via JS)
- **Path**: `'/'` por padrão
- **MaxAge**: 365 dias padrão, configurável

### Dados Pessoais

- **Não coletar**: IPs, fingerprints, ou identificadores únicos
- **Minimização**: apenas preferências necessárias
- **Transparência**: usuário sempre sabe o que foi aceito

### SSR/Hidratação

```typescript
// Evitar em SSR
if (typeof window !== 'undefined') {
  // código que usa window/document
}
```

## 🧪 Testes e Qualidade

### Cenários Críticos para Testar

1. **SSR**: sem erros de hidratação
2. **Cookies malformados**: fallback para estado padrão
3. **Acessibilidade**: navegação por teclado funcional
4. **Props opcionais**: renderização condicional correta
5. **Backward compatibility**: versões antigas funcionam

### Ferramentas

- **Jest**: testes unitários
- **React Testing Library**: testes de componente
- **axe-core**: testes de acessibilidade
- **Lighthouse**: performance e A11y

## 🚨 NUNCA Fazer

❌ **Breaking changes** em v0.2.x (apenas aditivos)
❌ **Window/document** durante render SSR
❌ **Cookies automáticos** sem consentimento
❌ **Textos hardcoded** em inglês na UI
❌ **Imports barrel** do MUI (`@mui/material`)
❌ **Props mutáveis** (sempre Readonly<>)

## ✅ Sempre Fazer

✅ **Backward compatibility** em minor versions
✅ **Props opcionais** para novos recursos
✅ **Fallbacks seguros** para dados corrompidos  
✅ **Acessibilidade** desde o primeiro commit
✅ **Documentação JSDoc** em português
✅ **Tipos TypeScript** completos e precisos

## 📋 Checklist para PRs

Antes de fazer commit, verificar:

- [ ] API pública mantém compatibilidade
- [ ] Novos campos são opcionais com fallbacks
- [ ] Acessibilidade testada (Tab, Enter, Escape)
- [ ] SSR funciona (sem window/document no render)
- [ ] Tipos TypeScript corretos
- [ ] Props são Readonly<>
- [ ] JSDoc atualizado
- [ ] Testes passando
- [ ] Bundle size não aumentou significativamente

## 🎯 Próximos Marcos

### v0.2.0 - MVP Adequação ANPD

- Textos opcionais ANPD
- Validação robusta de cookies
- Defaults de segurança documentados

### v0.3.0 - Compliance Avançado

- Modal detalhado de cookies
- Logs de consentimento
- Base legal por categoria

### v0.4.0 - Ferramentas DPO

- Relatórios de compliance
- Templates por setor
- Exportação de dados

---

**Lembre-se**: Este é um projeto de compliance/LGPD. Priorize **segurança, acessibilidade e transparência** em todas as decisões de código.
