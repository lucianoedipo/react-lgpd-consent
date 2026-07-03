/**
 * @fileoverview
 * Sistema de textos expandido com suporte avançado a internacionalização,
 * contextos específicos e variações de tom.
 *
 * @author Luciano Édipo
 * @since 0.4.1
 */

import type { ConsentTexts } from './types'

/**
 * Tipo auxiliar para variações de texto.
 *
 * Define um subconjunto opcional dos textos principais do banner e modal,
 * permitindo variações de tom (formal, casual, etc.) sem sobrescrever todos os textos.
 *
 * @category Types
 * @since 0.4.1
 */
type TextVariant = Partial<
  Pick<ConsentTexts, 'bannerMessage' | 'acceptAll' | 'declineAll' | 'modalTitle'>
>

/**
 * Tipo auxiliar para textos de idioma.
 *
 * Define um subconjunto dos textos principais, excluindo propriedades específicas de internacionalização
 * e contextos, para uso em configurações multilíngues.
 *
 * @category Types
 * @since 0.4.1
 */
type LanguageTexts = Partial<Omit<ConsentTexts, 'i18n' | 'variants' | 'contexts'>>

/**
 * Sistema de textos avançado com suporte a internacionalização e contextos específicos.
 *
 * Interface expandida que permite personalização granular de todas as mensagens da biblioteca.
 * Suporta múltiplos idiomas, contextos específicos (e-commerce, SaaS, governo), variações
 * de tom, e compliance completo com LGPD.
 *
 * @category Types
 * @since 0.4.1
 * @remarks
 * **Histórico**: v0.4.1 - Nova interface com suporte avançado a i18n e contextos
 *
 * @example Configuração multilíngue
 * ```typescript
 * const multiLangTexts: AdvancedConsentTexts = {
 *   // Herda de ConsentTexts básico
 *   bannerMessage: 'Utilizamos cookies para melhorar sua experiência.',
 *   acceptAll: 'Aceitar todos',
 *   declineAll: 'Recusar',
 *   preferences: 'Preferências',
 *   modalTitle: 'Preferências de Cookies',
 *   modalIntro: 'Personalize suas preferências de cookies.',
 *   save: 'Salvar',
 *   necessaryAlwaysOn: 'Cookies necessários (sempre ativos)',
 *
 *   // Textos expandidos
 *   variants: {
 *     formal: {
 *       bannerMessage: 'Este sítio utiliza cookies para otimizar a experiência de navegação.',
 *       acceptAll: 'Concordar com todos os cookies'
 *     },
 *     casual: {
 *       bannerMessage: '🍪 Olá! Usamos cookies para tornar tudo mais gostoso aqui.',
 *       acceptAll: 'Aceitar tudo'
 *     }
 *   },
 *
 *   // Internacionalização
 *   i18n: {
 *     en: {
 *       bannerMessage: 'We use cookies to enhance your experience.',
 *       acceptAll: 'Accept All',
 *       declineAll: 'Decline'
 *     },
 *     es: {
 *       bannerMessage: 'Utilizamos cookies para mejorar su experiencia.',
 *       acceptAll: 'Aceptar todo',
 *       declineAll: 'Rechazar'
 *     }
 *   }
 * }
 * ```
 */
export interface AdvancedConsentTexts extends ConsentTexts {
  // ===== TEXTOS ADICIONAIS =====
  /** Texto para confirmar ação */
  confirm?: string
  /** Texto para cancelar ação */
  cancel?: string
  /** Texto de carregamento */
  loading?: string

  // ===== TEXTOS POR CATEGORIA =====
  /** Textos específicos para cada categoria de cookie */
  categories?: {
    necessary?: {
      name?: string
      description?: string
      examples?: string
    }
    analytics?: {
      name?: string
      description?: string
      examples?: string
    }
    marketing?: {
      name?: string
      description?: string
      examples?: string
    }
    functional?: {
      name?: string
      description?: string
      examples?: string
    }
    performance?: {
      name?: string
      description?: string
      examples?: string
    }
  }

  // ===== TEXTOS DE ESTADO E FEEDBACK =====
  /** Mensagens de feedback ao usuário */
  feedback?: {
    /** Preferências salvas com sucesso */
    saveSuccess?: string
    /** Erro ao salvar preferências */
    saveError?: string
    /** Consentimento atualizado */
    consentUpdated?: string
    /** Cookies rejeitados */
    cookiesRejected?: string
    /** Configurações resetadas */
    settingsReset?: string
  }

  // ===== TEXTOS DE ACESSIBILIDADE =====
  /** Labels ARIA e textos para leitores de tela */
  accessibility?: {
    /** Label do banner para leitores de tela */
    bannerLabel?: string
    /** Label do modal para leitores de tela */
    modalLabel?: string
    /** Instrução de navegação por teclado */
    keyboardNavigation?: string
    /** Estado do toggle de categoria */
    toggleState?: {
      enabled?: string
      disabled?: string
    }
    /** Região live para anúncios dinâmicos */
    liveRegion?: string
  }

  // ===== TEXTOS POR CONTEXTO DE USO =====
  /** Textos otimizados para diferentes contextos */
  contexts?: {
    /** Contexto e-commerce */
    ecommerce?: {
      cartAbandonment?: string
      personalizedOffers?: string
      paymentSecurity?: string
      productRecommendations?: string
    }
    /** Contexto SaaS */
    saas?: {
      userAnalytics?: string
      performanceMonitoring?: string
      featureUsage?: string
      customerSupport?: string
    }
    /** Contexto governamental */
    government?: {
      citizenServices?: string
      dataProtection?: string
      transparency?: string
      accessibility?: string
    }
    /** Contexto educacional */
    education?: {
      studentProgress?: string
      learningAnalytics?: string
      accessibility?: string
      parentalConsent?: string
    }
  }

  // ===== VARIAÇÕES DE TOM =====
  /** Diferentes variações de tom para a mesma mensagem */
  variants?: {
    /** Tom formal/profissional */
    formal?: TextVariant
    /** Tom casual/amigável */
    casual?: TextVariant
    /** Tom conciso/direto */
    concise?: TextVariant
    /** Tom detalhado/explicativo */
    detailed?: TextVariant
  }

  // ===== INTERNACIONALIZAÇÃO =====
  /** Suporte a múltiplos idiomas */
  i18n?: {
    /** Textos em inglês */
    en?: LanguageTexts
    /** Textos em espanhol */
    es?: LanguageTexts
    /** Textos em francês */
    fr?: LanguageTexts
    /** Textos em alemão */
    de?: LanguageTexts
    /** Textos em italiano */
    it?: LanguageTexts
  }

  // ===== TEXTOS TÉCNICOS E DETALHADOS =====
  /** Informações técnicas sobre cookies */
  technical?: {
    /** Explicação sobre cookies de sessão */
    sessionCookies?: string
    /** Explicação sobre cookies persistentes */
    persistentCookies?: string
    /** Explicação sobre cookies de terceiros */
    thirdPartyCookies?: string
    /** Como desabilitar cookies no navegador */
    browserSettings?: string
    /** Impacto de desabilitar cookies */
    disablingImpact?: string
  }

  // ===== TEXTOS PARA COOKIE DETAILS =====
  /** Cabeçalhos para tabela de detalhes de cookies */
  cookieDetails?: {
    tableHeaders?: {
      name?: string
      purpose?: string
      duration?: string
      provider?: string
      type?: string
    }
    /** Texto quando não há cookies para mostrar */
    noCookies?: string
    /** Botão para expandir/colapsar detalhes */
    toggleDetails?: {
      expand?: string
      collapse?: string
    }
    /** Prefixo exibido antes do ID do script */
    scriptLabelPrefix?: string
    /** Texto de finalidade para scripts ativos detectados */
    scriptPurpose?: string
  }
}

/**
 * Textos padrão expandidos para diferentes contextos e idiomas.
 *
 * @category Utils
 * @since 0.4.1
 */
export const EXPANDED_DEFAULT_TEXTS: Partial<AdvancedConsentTexts> = {
  // Textos adicionais
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  loading: 'Carregando...',

  // Feedback
  feedback: {
    saveSuccess: 'Preferências salvas com sucesso!',
    saveError: 'Erro ao salvar preferências. Tente novamente.',
    consentUpdated: 'Consentimento atualizado.',
    cookiesRejected: 'Cookies opcionais rejeitados.',
    settingsReset: 'Configurações resetadas.',
  },

  // Acessibilidade
  accessibility: {
    bannerLabel: 'Banner de consentimento de cookies',
    modalLabel: 'Modal de preferências de cookies',
    keyboardNavigation: 'Use Tab para navegar, Enter para selecionar',
    toggleState: {
      enabled: 'Habilitado',
      disabled: 'Desabilitado',
    },
    liveRegion: 'Região de anúncios dinâmicos',
  },

  // Categorias
  categories: {
    necessary: {
      name: 'Cookies Necessários',
      description: 'Essenciais para o funcionamento básico do site e não podem ser desativados',
      examples: 'Sessão, segurança, preferências de idioma',
    },
    analytics: {
      name: 'Cookies de Analytics',
      description: 'Opcionais. Ajudam a entender como os visitantes usam o site',
      examples: 'Google Analytics, contadores de página',
    },
    marketing: {
      name: 'Cookies de Marketing',
      description: 'Opcionais. Usados para personalizar anúncios e ofertas',
      examples: 'Facebook Pixel, Google Ads, remarketing',
    },
    functional: {
      name: 'Cookies Funcionais',
      description: 'Opcionais. Melhoram a funcionalidade e personalização',
      examples: 'Chat, mapas, vídeos embarcados',
    },
    performance: {
      name: 'Cookies de Performance',
      description: 'Opcionais. Coletam informações sobre velocidade e estabilidade',
      examples: 'Monitoramento de erro, otimização de velocidade',
    },
  },

  // Contextos específicos
  contexts: {
    ecommerce: {
      cartAbandonment: 'Lembramos dos produtos no seu carrinho',
      personalizedOffers: 'Ofertas personalizadas baseadas no seu histórico',
      paymentSecurity: 'Segurança adicional no processo de pagamento',
      productRecommendations: 'Sugestões de produtos relevantes',
    },
    saas: {
      userAnalytics: 'Análise de uso para melhorar funcionalidades',
      performanceMonitoring: 'Monitoramento de performance da aplicação',
      featureUsage: 'Estatísticas de uso de recursos',
      customerSupport: 'Suporte ao cliente mais eficiente',
    },
    government: {
      citizenServices: 'Melhoria dos serviços ao cidadão',
      dataProtection: 'Proteção rigorosa dos dados pessoais',
      transparency: 'Transparência no uso de dados',
      accessibility: 'Recursos de acessibilidade digital',
    },
    education: {
      studentProgress: 'Acompanhamento do progresso educacional',
      learningAnalytics: 'Analytics para melhorar o aprendizado',
      accessibility: 'Recursos educacionais acessíveis',
      parentalConsent: 'Consentimento parental quando necessário',
    },
  },

  // Variações de tom
  variants: {
    formal: {
      bannerMessage:
        'Este sítio eletrônico utiliza cookies necessários e, mediante sua autorização, cookies opcionais para otimizar a experiência de navegação.',
      acceptAll: 'Concordar com todos os cookies',
      declineAll: 'Recusar cookies opcionais',
      modalTitle: 'Configuração de Cookies',
    },
    casual: {
      bannerMessage: '🍪 Ei! Usamos cookies para tornar sua experiência ainda melhor!',
      acceptAll: 'Aceitar tudo',
      declineAll: 'Só o essencial',
      modalTitle: 'Seus Cookies',
    },
    concise: {
      bannerMessage: 'Usamos cookies. Você aceita?',
      acceptAll: 'Sim',
      declineAll: 'Não',
      modalTitle: 'Cookies',
    },
    detailed: {
      bannerMessage:
        'Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, personalizar conteúdo, analisar tráfego e oferecer funcionalidades de redes sociais. Os cookies necessários permanecem ativos e os opcionais dependem da sua autorização.',
      acceptAll: 'Aceitar todos os cookies e tecnologias',
      declineAll: 'Recusar todos os cookies opcionais',
      modalTitle: 'Centro de Preferências de Privacidade',
    },
  },

  // Internacionalização simplificada (apenas textos básicos)
  i18n: {
    en: {
      bannerMessage: 'We use cookies to enhance your experience.',
      acceptAll: 'Accept All',
      declineAll: 'Decline',
      preferences: 'Preferences',
      modalTitle: 'Cookie Preferences',
      modalIntro: 'Customize your cookie preferences below.',
      save: 'Save Preferences',
      necessaryAlwaysOn: 'Necessary cookies (always active)',
    },
    es: {
      bannerMessage: 'Utilizamos cookies para mejorar su experiencia.',
      acceptAll: 'Aceptar Todo',
      declineAll: 'Rechazar',
      preferences: 'Preferencias',
      modalTitle: 'Preferencias de Cookies',
      modalIntro: 'Personalice sus preferencias de cookies a continuación.',
      save: 'Guardar Preferencias',
      necessaryAlwaysOn: 'Cookies necessárias (sempre ativas)',
    },
    fr: {
      bannerMessage: 'Nous utilisons des cookies pour améliorer votre expérience.',
      acceptAll: 'Tout Accepter',
      declineAll: 'Refuser',
      preferences: 'Préférences',
      modalTitle: 'Préférences des Cookies',
      modalIntro: 'Personnalisez vos préférences de cookies ci-dessous.',
      save: 'Enregistrer les Préférences',
      necessaryAlwaysOn: 'Cookies nécessaires (toujours actifs)',
    },
  },

  // Textos técnicos
  technical: {
    sessionCookies: 'Cookies de sessão são temporários e expiram quando você fecha o navegador.',
    persistentCookies:
      'Cookies persistentes permanecem no seu dispositivo até expirarem ou serem removidos.',
    thirdPartyCookies:
      'Cookies de terceiros são definidos por domínios diferentes do site que você está visitando.',
    browserSettings: 'Você pode gerenciar cookies nas configurações do seu navegador.',
    disablingImpact: 'Desabilitar cookies pode afetar a funcionalidade do site.',
  },

  // Cookie details
  cookieDetails: {
    tableHeaders: {
      name: 'Nome',
      purpose: 'Finalidade',
      duration: 'Duração',
      provider: 'Fornecedor',
      type: 'Tipo',
    },
    noCookies: 'Nenhum cookie encontrado para esta categoria.',
    toggleDetails: {
      expand: 'Ver detalhes',
      collapse: 'Ocultar detalhes',
    },
    scriptLabelPrefix: '(script) ',
    scriptPurpose: 'Script de integração ativo',
  },
}

/**
 * Utilitário para resolver textos baseado em idioma, contexto e variação.
 *
 * @category Utils
 * @since 0.4.1
 *
 * @param texts - Textos avançados configurados
 * @param options - Opções de resolução
 * @returns Textos resolvidos para o contexto
 */
export function resolveTexts(
  texts: AdvancedConsentTexts,
  options: {
    language?: 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it'
    context?: 'ecommerce' | 'saas' | 'government' | 'education'
    variant?: 'formal' | 'casual' | 'concise' | 'detailed'
  } = {},
): AdvancedConsentTexts {
  const { language = 'pt', variant } = options

  // Começar com textos base
  let resolved: AdvancedConsentTexts = { ...texts }

  // Aplicar variação de tom se especificada
  if (variant && texts.variants?.[variant]) {
    resolved = { ...resolved, ...texts.variants[variant] }
  }

  // Aplicar idioma se especificado e diferente do padrão
  if (language !== 'pt' && texts.i18n?.[language]) {
    resolved = { ...resolved, ...texts.i18n[language] }
  }

  return resolved
}

/**
 * Templates pré-configurados para diferentes contextos.
 *
 * @category Utils
 * @since 0.4.1
 */
export const TEXT_TEMPLATES = {
  ecommerce: {
    ...EXPANDED_DEFAULT_TEXTS,
    bannerMessage:
      'Utilizamos cookies para personalizar ofertas e melhorar sua experiência de compra.',
    acceptAll: 'Aceitar e continuar',
    variants: {
      casual: {
        bannerMessage: '🛒 Usamos cookies para encontrar as melhores ofertas para você!',
        acceptAll: 'Quero ofertas personalizadas!',
      },
    },
  } as AdvancedConsentTexts,

  saas: {
    ...EXPANDED_DEFAULT_TEXTS,
    bannerMessage: 'Utilizamos cookies para otimizar o desempenho da aplicação e sua experiência.',
    acceptAll: 'Aceitar e otimizar',
    variants: {
      formal: {
        bannerMessage:
          'Esta aplicação utiliza cookies para análise de performance e melhoria contínua da experiência do usuário.',
        acceptAll: 'Autorizar coleta de dados de uso',
      },
    },
  } as AdvancedConsentTexts,

  government: {
    ...EXPANDED_DEFAULT_TEXTS,
    bannerMessage:
      'Este portal utiliza cookies em conformidade com a LGPD para melhorar os serviços públicos.',
    acceptAll: 'Aceitar em conformidade',
    variants: {
      formal: {
        bannerMessage:
          'Este sítio eletrônico do governo utiliza cookies estritamente necessários e opcionais, em conformidade com a Lei Geral de Proteção de Dados.',
        acceptAll: 'Concordar com o uso de cookies',
      },
    },
  } as AdvancedConsentTexts,
} as const
