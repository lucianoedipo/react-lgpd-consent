/**
 * @fileoverview
 * Hooks públicos para interação com o sistema de consentimento LGPD.
 *
 * Este módulo exporta os hooks principais que devem ser usados pelos desenvolvedores
 * para acessar e manipular o estado de consentimento em seus componentes React.
 *
 * @author Luciano Édipo
 * @since 0.1.0
 */

import {
  useConsentActionsInternal,
  useConsentStateInternal,
  useConsentTextsInternal,
  useConsentHydrationInternal,
} from '../context/ConsentContext'
import { logger } from '../utils/logger'
import type { ConsentContextValue, ConsentTexts } from '../types/types'

/**
 * Hook principal para acessar e manipular o estado de consentimento de cookies LGPD.
 *
 * @remarks
 * Este é o hook mais importante da biblioteca para interagir com o sistema de consentimento.
 * Ele provê acesso completo ao estado atual do consentimento e às funções para modificar esse estado.
 *
 * ### Estado Disponível
 * - **`consented`**: `boolean` - Indica se o usuário já deu alguma resposta (aceitar/rejeitar)
 * - **`preferences`**: `CategoryPreferences` - Objeto com estado de cada categoria de cookie
 * - **`isModalOpen`**: `boolean` - Indica se o modal de preferências está aberto
 *
 * ### Ações Disponíveis
 * - **`acceptAll()`**: Aceita todas as categorias configuradas
 * - **`rejectAll()`**: Rejeita todas as categorias (exceto necessary)
 * - **`setPreference(category, enabled)`**: Define uma categoria específica
 * - **`setPreferences(preferences)`**: Define múltiplas categorias de uma vez
 * - **`openPreferences()`**: Abre o modal de preferências
 * - **`closePreferences()`**: Fecha o modal de preferências
 * - **`resetConsent()`**: Limpa all  consentimento (volta ao estado inicial)
 *
 * ### Performance e SSR
 * - O hook é otimizado com `useMemo` interno para evitar re-renders desnecessários
 * - Compatível com SSR (Next.js, Remix) - estado é hidratado após montagem no cliente
 * - Estado inicial é sempre `{ consented: false }` no servidor para evitar hydration mismatches
 *
 * ### Integração com Scripts
 * - Use junto com `ConsentScriptLoader` para carregamento condicional de scripts
 * - Estado `preferences` pode ser usado para ativar/desativar recursos condicionalmente
 * - Mudanças no consentimento são automaticamente persistidas em cookies
 *
 * @returns Um objeto contendo o estado completo e as ações de consentimento
 *
 * @throws {Error} Se usado fora do ConsentProvider - verifique se o componente está dentro de `<ConsentProvider>`
 *
 * @example Hook básico para verificar consentimento
 * ```tsx
 * function MyComponent() {
 *   const { consented, preferences, acceptAll, rejectAll } = useConsent();
 *
 *   if (!consented) {
 *     return <p>Aguardando decisão do usuário...</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Analytics: {preferences.analytics ? 'Ativo' : 'Inativo'}</p>
 *       <button onClick={rejectAll}>Rejeitar Todos</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Controle granular de categorias
 * ```tsx
 * function AdvancedSettings() {
 *   const { preferences, setPreference } = useConsent();
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={preferences.marketing}
 *           onChange={(e) => setPreference('marketing', e.target.checked)}
 *         />
 *         Cookies de Marketing
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Integração condicional com Google Analytics
 * ```tsx
 * function AnalyticsComponent() {
 *   const { consented, preferences } = useConsent();
 *
 *   React.useEffect(() => {
 *     if (consented && preferences.analytics) {
 *       // Inicializar Google Analytics
 *       gtag('config', 'GA_MEASUREMENT_ID');
 *       gtag('event', 'consent_granted', {
 *         ad_storage: preferences.marketing ? 'granted' : 'denied',
 *         analytics_storage: 'granted'
 *       });
 *     }
 *   }, [consented, preferences]);
 *
 *   return null; // Componente só para lógica
 * }
 * ```
 *
 * @example Uso avançado com múltiplas preferências
 * ```tsx
 * function BulkPreferencesControl() {
 *   const { setPreferences, preferences, consented } = useConsent();
 *
 *   const handleSavePreferences = () => {
 *     setPreferences({
 *       necessary: true,    // Sempre true
 *       analytics: true,
 *       marketing: false,
 *       functional: true,
 *       performance: false
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleSavePreferences} disabled={!consented}>
 *       Salvar Minhas Preferências
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Componente com estado de carregamento
 * ```tsx
 * function ConsentAwareFeature() {
 *   const { consented, preferences } = useConsent();
 *   const canShowFeature = consented && preferences.functional;
 *
 *   if (!consented) {
 *     return <div>⏳ Aguardando decisão sobre cookies...</div>;
 *   }
 *
 *   if (!preferences.functional) {
 *     return (
 *       <div>
 *         ❌ Este recurso requer cookies funcionais.
 *         <button onClick={() => window.openPreferencesModal?.()}>
 *           Alterar Preferências
 *         </button>
 *       </div>
 *     );
 *   }
 *
 *   return <div>✅ Recurso ativo com consentimento!</div>;
 * }
 * ```
 *
 * @see {@link ConsentProvider} - Provider que deve envolver os componentes
 * @see {@link ConsentContextValue} - Tipo do valor retornado
 *
 * @public
 * @since 0.1.0
 */
export function useConsent(): ConsentContextValue {
  const state = useConsentStateInternal()
  const actions = useConsentActionsInternal()
  return {
    consented: state.consented,
    preferences: state.preferences,
    isModalOpen: state.isModalOpen,
    acceptAll: actions.acceptAll,
    rejectAll: actions.rejectAll,
    setPreference: actions.setPreference,
    setPreferences: actions.setPreferences,
    openPreferences: actions.openPreferences,
    closePreferences: actions.closePreferences,
    resetConsent: actions.resetConsent,
  }
}

/**
 * Hook para acessar os textos personalizáveis da interface de consentimento.
 *
 * @remarks
 * Este hook retorna o objeto completo de textos configurados no `ConsentProvider`.
 * Os textos incluem tanto os valores padrão em português quanto as customizações
 * fornecidas via prop `texts`. É útil para criar componentes personalizados
 * que mantêm consistência com a configuração de textos do projeto.
 *
 * ### Textos Básicos Incluídos
 * - `bannerMessage`: Mensagem principal do banner
 * - `acceptAll`, `declineAll`, `preferences`: Textos dos botões
 * - `modalTitle`, `modalIntro`: Cabeçalho do modal
 * - `save`, `close`: Ações do modal
 *
 * ### Textos de Conformidade LGPD/ANPD (Opcionais)
 * - `controllerInfo`: Informações do controlador de dados
 * - `dataTypes`: Tipos de dados coletados
 * - `thirdPartySharing`: Compartilhamento com terceiros
 * - `userRights`: Direitos do titular dos dados
 * - `contactInfo`: Contato do DPO (Data Protection Officer)
 *
 * ### Personalização e Internacionalização
 * - Padrão em português brasileiro
 * - Suporte completo a customização via `ConsentProvider.texts`
 * - Tipagem TypeScript completa para IntelliSense
 * - Fallback automático para textos padrão quando não customizados
 *
 * @returns O objeto completo de textos da interface, mesclando padrões com customizações
 *
 * @throws {Error} Se usado fora do ConsentProvider - verifique se está dentro de `<ConsentProvider>`
 *
 * @example Usar textos em componente customizado
 * ```tsx
 * function CustomBanner() {
 *   const texts = useConsentTexts();
 *
 *   return (
 *     <div className="custom-banner">
 *       <p>{texts.bannerMessage}</p>
 *       <button>{texts.acceptAll}</button>
 *       <button>{texts.declineAll}</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Acessar textos ANPD específicos
 * ```tsx
 * function ComplianceInfo() {
 *   const texts = useConsentTexts();
 *
 *   return (
 *     <div>
 *       {texts.controllerInfo && <p>{texts.controllerInfo}</p>}
 *       {texts.userRights && <p>{texts.userRights}</p>}
 *       {texts.contactInfo && <p>{texts.contactInfo}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Modal customizado com textos consistentes
 * ```tsx
 * function CustomPreferencesModal() {
 *   const texts = useConsentTexts();
 *   const { preferences, setPreference, closePreferences } = useConsent();
 *
 *   return (
 *     <div className="custom-modal">
 *       <h2>{texts.preferencesTitle || texts.modalTitle}</h2>
 *       <p>{texts.preferencesDescription || texts.modalIntro}</p>
 *
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={preferences.analytics}
 *           onChange={(e) => setPreference('analytics', e.target.checked)}
 *         />
 *         Cookies Analíticos
 *       </label>
 *
 *       <div className="modal-actions">
 *         <button onClick={closePreferences}>{texts.close}</button>
 *         <button>{texts.save}</button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Componente multilíngue com fallbacks
 * ```tsx
 * function MultiLanguageBanner() {
 *   const texts = useConsentTexts();
 *   const [language, setLanguage] = useState('pt');
 *
 *   // Usar textos customizados baseado no idioma
 *   const message = language === 'en'
 *     ? 'We use cookies to improve your experience'
 *     : texts.bannerMessage;
 *
 *   const acceptText = language === 'en' ? 'Accept All' : texts.acceptAll;
 *
 *   return (
 *     <div>
 *       <select onChange={(e) => setLanguage(e.target.value)}>
 *         <option value="pt">Português</option>
 *         <option value="en">English</option>
 *       </select>
 *       <p>{message}</p>
 *       <button>{acceptText}</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ConsentTexts} - Interface completa dos textos
 * @see {@link ConsentProvider} - Para configurar textos personalizados
 *
 * @public
 * @since 0.1.0
 */
export function useConsentTexts(): ConsentTexts {
  return useConsentTextsInternal()
}

/**
 * Hook para verificar se a hidratação do estado de consentimento foi concluída.
 *
 * @remarks
 * Em aplicações com Server-Side Rendering (SSR) como Next.js, o estado inicial
 * é sempre `false` no servidor para evitar diferenças de hidratação. Este hook
 * permite saber quando a biblioteca já leu o cookie do navegador e atualizou
 * o estado, evitando o "flash" do banner ou comportamentos inconsistentes.
 *
 * ### Casos de Uso Principais
 * - **Mostrar loading states** enquanto carrega o estado real do cookie
 * - **Evitar flash of unstyled content (FOUC)** com banners aparecendo/sumindo
 * - **Sincronizar componentes** que dependem do estado de consentimento
 * - **Inicializar scripts condicionalmente** apenas após hidratação
 *
 * ### Funcionamento Técnico
 * - No servidor (SSR): sempre retorna `false`
 * - No cliente: retorna `false` até o `useEffect` ler o cookie
 * - Após leitura do cookie: retorna `true` permanentemente
 * - Performance: otimizado para evitar re-renders desnecessários
 *
 * ### Frameworks Suportados
 * - **Next.js**: App Router e Pages Router
 * - **Remix**: SSR completo
 * - **Gatsby**: Static Generation + hidratação
 * - **Vite SSR**: Server-side rendering
 * - **Create React App**: Client-side only (sempre `true`)
 *
 * @returns `true` se a hidratação do cookie foi concluída, `false` durante SSR ou antes da hidratação
 *
 * @example Evitar flash do banner
 * ```tsx
 * function App() {
 *   const { consented } = useConsent();
 *   const isHydrated = useConsentHydration();
 *
 *   // Não mostrar nada até hidratar
 *   if (!isHydrated) {
 *     return <div>Carregando...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {!consented && <span>Banner aparecerá agora</span>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Controlar carregamento de scripts
 * ```tsx
 * function Analytics() {
 *   const { preferences } = useConsent();
 *   const isHydrated = useConsentHydration();
 *
 *   React.useEffect(() => {
 *     if (isHydrated && preferences.analytics) {
 *       // Só carrega analytics após hidratação
 *       loadGoogleAnalytics();
 *     }
 *   }, [isHydrated, preferences.analytics]);
 *
 *   return null;
 * }
 * ```
 *
 * @example Componente com loading state elegante
 * ```tsx
 * function ConsentDependentFeature() {
 *   const { consented, preferences } = useConsent();
 *   const isHydrated = useConsentHydration();
 *
 *   // Estados de loading
 *   if (!isHydrated) {
 *     return <div className="shimmer">Carregando preferências...</div>;
 *   }
 *
 *   // Estado não consentido
 *   if (!consented) {
 *     return (
 *       <div className="consent-required">
 *         <p>Configure suas preferências de cookies para usar este recurso.</p>
 *       </div>
 *     );
 *   }
 *
 *   // Estado com consentimento específico
 *   if (!preferences.functional) {
 *     return (
 *       <div className="consent-partial">
 *         <p>Este recurso requer cookies funcionais.</p>
 *         <button onClick={() => window.openPreferencesModal?.()}>
 *           Alterar Preferências
 *         </button>
 *       </div>
 *     );
 *   }
 *
 *   return <div>🚀 Recurso funcionando com consentimento!</div>;
 * }
 * ```
 *
 * @example Next.js - Prevenção de hydration mismatch
 * ```typescript
 * // pages/_app.tsx
 * function MyApp(props: any) {
 *   const isHydrated = useConsentHydration();
 *
 *   // Só renderiza componentes de consentimento após hidratação
 *   // para evitar diferenças entre servidor e cliente
 *   return (
 *     // ConsentProvider envolve tudo
 *     // Component com props normalmente
 *     // CookieBanner só se isHydrated for true
 *     // FloatingPreferencesButton só se isHydrated for true
 *   );
 * }
 * ```
 *
 * @example Hook customizado para features condicionais
 * ```tsx
 * function useConsentAwareFeature(requiredCategory: string) {
 *   const { consented, preferences } = useConsent();
 *   const isHydrated = useConsentHydration();
 *
 *   const isEnabled = React.useMemo(() => {
 *     if (!isHydrated) return false; // Loading
 *     if (!consented) return false;  // No consent
 *     return preferences[requiredCategory] === true;
 *   }, [isHydrated, consented, preferences, requiredCategory]);
 *
 *   return {
 *     isEnabled,
 *     isLoading: !isHydrated,
 *     hasConsented: consented,
 *     preferences
 *   };
 * }
 *
 * // Uso do hook customizado
 * function MyFeature() {
 *   const { isEnabled, isLoading } = useConsentAwareFeature('analytics');
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!isEnabled) return <ConsentRequired />;
 *
 *   return <AnalyticsChart />;
 * }
 * ```
 *
 * @see {@link ConsentProvider} - Para configuração SSR
 *
 * @public
 * @since 0.1.0
 */
export function useConsentHydration(): boolean {
  return useConsentHydrationInternal()
}

/**
 * Hook que retorna uma função para abrir o modal de preferências de forma programática.
 * @hook
 * @category Hooks
 * @since 0.3.1+
 * @remarks
 * Este hook oferece uma maneira ReactJS-idiomática de abrir o modal de preferências
 * em qualquer lugar da aplicação. Diferente do botão flutuante padrão, permite
 * controle total sobre quando e como o modal é acionado.
 *
 * ### Casos de Uso Principais
 * - **Links no footer/header**: "Configurações de Cookies", "Preferências"
 * - **Botões customizados**: Design próprio para abrir preferências
 * - **Fluxos condicionais**: Abrir modal baseado em ações do usuário
 * - **Integração com menus**: Adicionar item de menu para configurações
 *
 * ### Vantagens sobre função global
 * - **Type-safe**: TypeScript com tipagem completa
 * - **React-friendly**: Integra com ciclo de vida dos componentes
 * - **Automático**: Sem necessidade de verificar se ConsentProvider existe
 * - **Testável**: Fácil de mockar em testes unitários
 *
 * ### Performance
 * - Função estável: não causa re-renders quando usada como dependency
 * - Memoizada internamente para otimização
 * - Sem overhead: apenas proxy para ação interna do contexto
 *
 * @returns Uma função estável que abre o modal de preferências quando chamada
 *
 * @throws {Error} Se usado fora do ConsentProvider - verifique se está dentro de `<ConsentProvider>`
 *
 * @example Hook básico no footer
 * ```tsx
 * function MeuFooter() {
 *   const abrirModal = useOpenPreferencesModal();
 *
 *   return (
 *     <footer>
 *       <a href="#" onClick={abrirModal}>
 *         Configurações de Cookies
 *       </a>
 *     </footer>
 *   );
 * }
 * ```
 *
 * @example Botão customizado com ícone
 * ```tsx
 * import { Settings } from '@mui/icons-material';
 *
 * function CustomPreferencesButton() {
 *   const openModal = useOpenPreferencesModal();
 *
 *   return (
 *     <button
 *       onClick={openModal}
 *       className="preferences-btn"
 *       aria-label="Configurar cookies"
 *     >
 *       <Settings /> Cookies
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Menu dropdown com opções
 * ```tsx
 * function UserMenu() {
 *   const openPreferences = useOpenPreferencesModal();
 *   const [menuOpen, setMenuOpen] = useState(false);
 *
 *   return (
 *     <div className="user-menu">
 *       <button onClick={() => setMenuOpen(!menuOpen)}>
 *         Menu ▼
 *       </button>
 *       {menuOpen && (
 *         <ul>
 *           <li><a href="/profile">Meu Perfil</a></li>
 *           <li><a href="/settings">Configurações</a></li>
 *           <li>
 *             <button onClick={openPreferences}>
 *               Preferências de Cookies
 *             </button>
 *           </li>
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Integração com router para mudança de página
 * ```tsx
 * function CookieSettingsPage() {
 *   const openModal = useOpenPreferencesModal();
 *   const navigate = useNavigate(); // React Router
 *
 *   React.useEffect(() => {
 *     // Abre modal automaticamente na página de configurações
 *     openModal();
 *   }, [openModal]);
 *
 *   const handleModalClose = () => {
 *     // Volta para página anterior quando modal fechar
 *     navigate(-1);
 *   };
 *
 *   return <div>Configurações de cookies carregando...</div>;
 * }
 * ```
 *
 * @example Hook condicional com verificação de consentimento
 * ```tsx
 * function SmartCookieButton() {
 *   const { consented } = useConsent();
 *   const openPreferences = useOpenPreferencesModal();
 *
 *   // Se usuário já deu consentimento, mostra "Alterar"
 *   // Se não deu consentimento, mostra "Configurar"
 *   const buttonText = consented ? 'Alterar Preferências' : 'Configurar Cookies';
 *   const buttonIcon = consented ? '⚙️' : '🍪';
 *
 *   return (
 *     <button
 *       onClick={openPreferences}
 *       className={consented ? 'modify-btn' : 'setup-btn'}
 *     >
 *       {buttonIcon} {buttonText}
 *     </button>
 *   );
 * }
 * ```
 */
export function useOpenPreferencesModal() {
  const { openPreferences } = useConsent()
  return openPreferences
}

/**
 * Função utilitária para abrir o modal de preferências de fora de um componente React.
 * @category Utils
 * @since 0.3.1+
 * @remarks
 * Esta função permite acesso ao sistema de consentimento a partir de código que não está
 * dentro do contexto React, como scripts vanilla JS, bibliotecas de terceiros, ou
 * integrações com sistemas legados. É automaticamente registrada pelo `ConsentProvider`.
 *
 * ### Casos de Uso Principais
 * - **Scripts vanilla JS**: Integração com código não-React existente
 * - **Bibliotecas de terceiros**: Chatbots, widgets, plugins
 * - **Event listeners globais**: Atalhos de teclado, eventos personalizados
 * - **APIs externas**: Callbacks de serviços que precisam alterar consentimento
 * - **Código legado**: Sistemas antigos que não podem ser refatorados para React
 *
 * ### Funcionamento Técnico
 * - **Registro automático**: ConsentProvider registra a função na montagem
 * - **Cleanup automático**: Função é limpa quando ConsentProvider desmonta
 * - **Thread-safe**: Verificações internas evitam erros se chamada antes da inicialização
 * - **Logging integrado**: Avisos informativos se ConsentProvider não estiver disponível
 *
 * ### Window Global Access
 * A função também fica disponível globalmente como `window.openPreferencesModal`
 * para máxima compatibilidade com scripts antigos e bibliotecas externas.
 *
 * @example Integração com script vanilla JS
 * ```javascript
 * // Em um arquivo .js separado
 * import { openPreferencesModal } from 'react-lgpd-consent';
 *
 * const botaoExterno = document.getElementById('cookie-settings-button');
 * botaoExterno.addEventListener('click', () => {
 *   openPreferencesModal();
 * });
 * ```
 *
 * @example Chatbot ou widget de terceiros
 * ```javascript
 * // Integração com chatbot
 * window.chatbot.addCommand('cookies', () => {
 *   if (window.openPreferencesModal) {
 *     window.openPreferencesModal();
 *   } else {
 *     console.warn('Sistema de cookies não está disponível');
 *   }
 * });
 * ```
 *
 * @example Event listener para atalho de teclado
 * ```javascript
 * // Atalho Ctrl+Shift+C para abrir configurações
 * document.addEventListener('keydown', (event) => {
 *   if (event.ctrlKey && event.shiftKey && event.key === 'C') {
 *     event.preventDefault();
 *     openPreferencesModal();
 *   }
 * });
 * ```
 *
 * @example Callback de API externa
 * ```javascript
 * // Quando API externa solicitar mudança de consentimento
 * window.externalAPI.onConsentChangeRequest(() => {
 *   // Verifica se função está disponível antes de chamar
 *   if (typeof openPreferencesModal === 'function') {
 *     openPreferencesModal();
 *   } else {
 *     // Fallback para quando React não estiver inicializado
 *     console.log('Sistema de consentimento ainda não está pronto');
 *   }
 * });
 * ```
 *
 * @example jQuery/legacy system integration
 * ```javascript
 * // Para sistemas antigos com jQuery
 * $(document).ready(function() {
 *   $('.cookie-settings-link').on('click', function(e) {
 *     e.preventDefault();
 *
 *     // Tenta usar a função importada, senão usa a global
 *     const openModal = window.openPreferencesModal || openPreferencesModal;
 *
 *     if (openModal) {
 *       openModal();
 *     } else {
 *       alert('Sistema de cookies não disponível no momento');
 *     }
 *   });
 * });
 * ```
 *
 * @see {@link useOpenPreferencesModal} - Versão hook para uso dentro de componentes React
 * @see {@link ConsentProvider} - Provider que registra esta função automaticamente
 *
 * @public
 */
let globalOpenPreferences: (() => void) | null = null

export function openPreferencesModal() {
  if (globalOpenPreferences) {
    globalOpenPreferences()
  } else {
    logger.warn(
      'openPreferencesModal: ConsentProvider não foi inicializado ou não está disponível.',
    )
  }
}

// Função interna para registrar o handler global
export function _registerGlobalOpenPreferences(openPreferences: () => void) {
  globalOpenPreferences = openPreferences
}

// Função interna para limpar o handler global
export function _unregisterGlobalOpenPreferences() {
  globalOpenPreferences = null
}
