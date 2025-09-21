"use client"

// Configurações personalizáveis para o sistema LGPD (v0.3.0+)
export const LGPDConfig = {
  // Configurações do Banner (legado)
  banner: {
    backgroundColor: "#000000",
    textColor: "#ffffff",
    buttonPrimaryColor: "#004F9F",
    buttonSecondaryColor: "#ffffff",
    position: "bottom" as const,
    zIndex: 9900,
  },

  // Configurações do Modal (legado)
  modal: {
    maxWidth: "600px",
    zIndex: 999999,
    backdropColor: "rgba(0, 0, 0, 0.8)",
  },

  // Categorias de cookies disponíveis (legado)
  cookieCategories: {
    necessary: {
      name: "Necessários",
      description: "Cookies essenciais para o funcionamento básico do site",
      required: true,
      color: "#004F9F",
    },
    analytics: {
      name: "Performance",
      description: "Cookies para análise de desempenho e melhorias",
      required: false,
      color: "#004F9F",
    },
  },

  // Configurações de armazenamento (legado)
  storage: {
    consentKey: "cookieConsent",
    dateKey: "cookieConsent-date",
    interactionKey: "cookieConsent-interacted",
    expirationDays: 365,
  },

  // Textos personalizáveis (legado)
  texts: {
    banner: {
      title: "Cookies e Privacidade",
      description:
        "Utilizamos cookies para permitir uma melhor experiência em nosso website e para nos ajudar a compreender quais informações são mais úteis e relevantes para você. Conforme Decreto Estadual 15.572/2020 que trata da LGPD no Governo do Estado de Mato Grosso do Sul.",
      acceptAllButton: "Prosseguir com todos",
      customizeButton: "Definições de cookies",
      rejectAllButton: "Fechar",
    },
    modal: {
      title: "Preferências de Cookies",
      description:
        "Gerencie suas preferências de cookies. Você pode habilitar ou desabilitar categorias de cookies conforme sua preferência.",
      saveButton: "Salvar Preferências",
      acceptAllButton: "Aceitar Todos",
      rejectAllButton: "Rejeitar Não Essenciais",
      closeButton: "Fechar",
    },
  },

  urls: {
    privacyPolicy: "/politica-de-privacidade",
    termsOfService: "/termos-de-uso",
  },

  external: {
    useExternalLibrary: true,

    libraryConfig: {
      categories: {
        necessary: {
          id: "necessary",
          name: "Necessários",
          description:
            "Cookies essenciais para o funcionamento básico do site. Estes cookies são necessários para que o website funcione e não podem ser desligados nos nossos sistemas.",
          required: true,
          cookies: [
            {
              name: "cookieConsent",
              purpose: "Armazena as preferências de consentimento do usuário",
              duration: "1 ano",
              company: "GOV MS",
              type: "first-party",
            },
            {
              name: "post_login_intent",
              purpose: "Armazena a intenção de redirecionamento pós-login (curso/vaga)",
              duration: "Até 2 horas",
              company: "GOV MS",
              type: "first-party",
            },
            {
              name: "jwt_gov_token",
              purpose: "Token JWT para autenticação GOV.BR",
              duration: "Sessão",
              company: "GOV MS",
              type: "first-party",
            },
            {
              name: "jwt_token",
              purpose: "Token JWT principal para autenticação do usuário",
              duration: "Sessão",
              company: "GOV MS",
              type: "first-party",
            },
            {
              name: "refresh_token",
              purpose: "Token para renovação da sessão do usuário",
              duration: "Sessão",
              company: "GOV MS",
              type: "first-party",
            },
            {
              name: "BIGipServer*",
              purpose: "Cookies de balanceamento de carga do servidor",
              duration: "Sessão",
              company: "GOV MS",
              type: "first-party",
            },
          ],
        },

        analytics: {
          id: "analytics",
          name: "Performance e Análise",
          description:
            "Cookies para análise de desempenho e melhorias. Eles ajudam-nos a saber quais são as páginas mais e menos populares e a ver como os visitantes se movimentam pelo website.",
          required: false,
          cookies: [
            {
              name: "_ga",
              purpose: "Cookie principal do Google Analytics para análise de tráfego",
              duration: "2 anos",
              company: "Google",
              type: "third-party",
            },
            {
              name: "_ga_*",
              purpose: "Cookie específico do Google Analytics 4",
              duration: "2 anos",
              company: "Google",
              type: "third-party",
            },
            {
              name: "_clck",
              purpose: "Cookie do Microsoft Clarity para análise de sessão",
              duration: "1 ano",
              company: "Microsoft",
              type: "third-party",
            },
            {
              name: "_clsk",
              purpose: "Cookie do Microsoft Clarity para rastreamento de sessão",
              duration: "1 dia",
              company: "Microsoft",
              type: "third-party",
            },
          ],
        },

        functional: {
          id: "functional",
          name: "Funcionalidade",
          description:
            "Cookies que permitem que o website forneça funcionalidades melhoradas e personalização.",
          required: false,
          cookies: [
            {
              name: "vlibras:enabled",
              purpose: "Preferência de ativação do VLibras",
              duration: "Persistente",
              company: "GOV MS",
              type: "first-party",
            },
            {
              name: "accessibility-preferences",
              purpose: "Preferências de acessibilidade do usuário",
              duration: "1 ano",
              company: "GOV MS",
              type: "first-party",
            },
          ],
        },

        marketing: {
          id: "marketing",
          name: "Marketing",
          description:
            "Cookies utilizados para tornar as mensagens publicitárias mais relevantes para você.",
          required: false,
          cookies: [
            // Não usado atualmente, mas pode ser expandido no futuro
          ],
        },

        personalization: {
          id: "personalization",
          name: "Personalização",
          description:
            "Cookies que permitem personalizar a experiência do usuário no site.",
          required: false,
          cookies: [
            // Não usado atualmente, mas pode ser expandido no futuro
          ],
        },

        social: {
          id: "social",
          name: "Redes Sociais",
          description:
            "Cookies relacionados a funcionalidades de redes sociais e compartilhamento.",
          required: false,
          cookies: [
            // Não usado atualmente, mas pode ser expandido no futuro
          ],
        },
      },

      // === CONFIGURAÇÃO DE COOKIES ===
      cookie: {
        name: "cookieConsent",
        domain: undefined, // Usar domínio atual
        path: "/",
        sameSite: "lax" as const,
        secure: typeof window !== "undefined" && window.location.protocol === "https:",
        expirationDays: 365,
      },

      // === TEXTOS CUSTOMIZADOS ===
      texts: {
        bannerMessage:
          "Utilizamos cookies para permitir uma melhor experiência em nosso website e para nos ajudar a compreender quais informações são mais úteis e relevantes para você. Conforme Decreto Estadual 15.572/2020 que trata da LGPD no Governo do Estado de Mato Grosso do Sul.",
        acceptAllButtonText: "Prosseguir com todos",
        customizeButtonText: "Definições de cookies",
        rejectAllButtonText: "Fechar",
        preferencesModalTitle: "Preferências de Cookies",
        preferencesModalDescription:
          "Gerencie suas preferências de cookies. Você pode habilitar ou desabilitar categorias de cookies conforme sua preferência.",
        savePreferencesButtonText: "Salvar Preferências",
        acceptAllModalButtonText: "Aceitar Todos",
        rejectAllModalButtonText: "Rejeitar Não Essenciais",
        closeModalButtonText: "Fechar",
        necessaryAlwaysOn: "Sempre ativo",

        // Novos textos para detalhamento de cookies
        cookieDetailsTitle: "Detalhes dos Cookies",
        cookieName: "Nome",
        cookiePurpose: "Finalidade",
        cookieDuration: "Duração",
        cookieCompany: "Empresa",
        cookieType: "Tipo",
        privacyPolicyText: "Política de Privacidade",
        learnMoreText: "Saiba mais",
      },

      // === CONFIGURAÇÕES DE COMPORTAMENTO ===
      behavior: {
        disableAutomaticModal: true, // Usar nossos componentes customizados
        showBannerOnFirstVisit: true,
        autoAcceptAfterDays: null, // Não aceitar automaticamente
        respectDoNotTrack: true,
        enableConsentMode: true, // Google Consent Mode v2
        showCookieDetails: true, // Mostrar detalhes dos cookies
        allowCategoryToggle: true, // Permitir toggle individual de categorias
      },

      // === CONFIGURAÇÕES VISUAIS ===
      bannerProps: {
        PaperProps: {
          sx: {
            backgroundColor: "#000000",
            color: "#ffffff",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9900,
            borderRadius: 0,
            fontFamily: "'Segoe UI', 'Segoe UI Symbol', sans-serif",
          },
        },
        SnackbarProps: {
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
        },
      },

      modalProps: {
        DialogProps: {
          PaperProps: {
            sx: {
              backgroundColor: "#000000",
              color: "#ffffff",
              maxWidth: "700px",
              borderRadius: "8px",
              fontFamily: "'Segoe UI', 'Segoe UI Symbol', sans-serif",
            },
          },
        },
      },

      integrations: {
        googleTagManager: {
          enabled: !!process.env.NEXT_PUBLIC_G_TAG_MANAGER_ID,
          containerId: process.env.NEXT_PUBLIC_G_TAG_MANAGER_ID,
          enableConsentMode: true, // Google Consent Mode v2
          dataLayerName: "dataLayer",
        },
        googleAnalytics: {
          enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
          enableConsentMode: true,
        },
        microsoftClarity: {
          enabled: !!process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
          projectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
        },
        userway: {
          enabled: true,
        },
      },

      // === URLS ===
      urls: {
        privacyPolicy: "/politica-de-privacidade",
        termsOfService: "/termos-de-uso",
      },
    },
  },
}

export type LGPDConfigType = typeof LGPDConfig
