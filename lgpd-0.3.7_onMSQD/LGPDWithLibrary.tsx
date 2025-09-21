"use client"

import { ReactNode } from "react"
import {
  ConsentGate,
  ConsentProvider,
  ConsentScriptLoader,
  useCategories,
  useCategoryStatus,
  useConsent,
  useOpenPreferencesModal,
} from "react-lgpd-consent"

// Importar nossos componentes customizados
import { LGPDConsentBanner } from "./LGPDConsentBanner"
import { LGPDPreferencesModal } from "./LGPDPreferencesModal"

// Wrapper para nosso banner customizado
function CustomBannerWrapper() {
  const consentData = useConsent()
  const { preferences, acceptAll, rejectAll } = consentData
  const openPreferencesModal = useOpenPreferencesModal()

  // Verificar se deve exibir o banner (se não tem consentimento ainda)
  // Banner deve aparecer se: não há preferências OU se analytics não foi definido
  const hasAnalyticsConsent = preferences?.analytics === true
  const shouldShowBanner = !hasAnalyticsConsent

  return (
    <LGPDConsentBanner
      isVisible={shouldShowBanner}
      onAcceptAll={() => {
        acceptAll()
      }}
      onOpenPreferences={() => {
        openPreferencesModal()
      }}
      onRejectAll={() => {
        rejectAll()
      }}
      onClose={() => {}} // Função vazia - o close agora chama rejectAll automaticamente
    />
  )
}

// Wrapper para nosso modal customizado
function CustomModalWrapper(props: unknown): React.ReactElement {
  const consentData = useConsent()
  const { preferences } = consentData

  // Type guard para props - usando as props corretas da biblioteca v0.3.1
  const modalProps = props as {
    preferences?: Record<string, boolean>
    setPreferences?: (prefs: Record<string, boolean>) => void
    closePreferences?: () => void
    isModalOpen?: boolean
    texts?: Record<string, string>
  }

  // Converter o estado da biblioteca para nosso formato
  const categories = {
    necessary: true, // Always true
    analytics: (modalProps.preferences?.analytics || preferences?.analytics) ?? false,
    functional: (modalProps.preferences?.functional || preferences?.functional) ?? false,
    marketing: (modalProps.preferences?.marketing || preferences?.marketing) ?? false,
    personalization:
      (modalProps.preferences?.personalization || preferences?.personalization) ?? false,
    social: (modalProps.preferences?.social || preferences?.social) ?? false,
  }

  return (
    <LGPDPreferencesModal
      isOpen={!!modalProps.isModalOpen}
      onClose={() => {
        if (modalProps.closePreferences) {
          modalProps.closePreferences()
        }
      }}
      categories={categories}
      onUpdateCategories={(updates) => {
        if (modalProps.setPreferences) {
          const newPrefs = { ...modalProps.preferences, ...updates }
          modalProps.setPreferences(newPrefs)
        }
      }}
      onSavePreferences={() => {
        if (modalProps.closePreferences) {
          modalProps.closePreferences()
        }
      }}
    />
  )
}

export interface ConsentCategories {
  necessary: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
  personalization: boolean
  social: boolean
}

export interface ConsentContextType {
  categories: ConsentCategories
  hasConsent: (category: keyof ConsentCategories) => boolean
  resetConsent?: () => void
  getConsentString?: () => string
  acceptAll: () => void
  isModalOpen: boolean
  hasUserInteracted: boolean
}

export function useLGPDConsent(): ConsentContextType {
  const consentData = useConsent()

  const { preferences, acceptAll, resetConsent } = consentData

  const categories: ConsentCategories = {
    necessary: true, // Sempre true
    analytics: preferences.analytics ?? false,
    functional: preferences.functional ?? false,
    marketing: preferences.marketing ?? false,
    personalization: preferences.personalization ?? false,
    social: preferences.social ?? false,
  }

  const hasConsent = (category: keyof ConsentCategories): boolean => {
    if (category === "necessary") return true
    return preferences[category] ?? false
  }

  // Verificar se o usuário já interagiu (baseado na existência de preferências)
  const hasUserInteracted = Object.keys(preferences).length > 0

  return {
    categories,
    hasConsent,
    resetConsent,
    getConsentString: undefined,
    acceptAll,
    isModalOpen: false, // A biblioteca gerencia isso internamente
    hasUserInteracted,
  }
}

interface LGPDConsentProviderProps {
  readonly children: ReactNode
}

/**
 * Provider usando a biblioteca react-lgpd-consent v0.3.0
 * com todas as funcionalidades modernas e melhorias de performance
 */
export function LGPDConsentProvider({ children }: LGPDConsentProviderProps) {
  return (
    <ConsentProvider
      // Configuração mínima - apenas as categorias REALMENTE USADAS
      categories={{
        enabledCategories: [
          "analytics", // 📊 Google Analytics/GTM
          // Removidas: functional, marketing, personalization, social
        ],
      }}
      // ✨ COMPONENTES CUSTOMIZADOS - usar nossos componentes em vez dos da biblioteca
      CookieBannerComponent={CustomBannerWrapper}
      PreferencesModalComponent={CustomModalWrapper}
      // 🚫 DESABILITAR botão flutuante - Nova API v0.3.1!
      disableFloatingPreferencesButton={true}
      // Callbacks para auditoria e DEBUG
      onConsentGiven={() => {}}
      disableDeveloperGuidance
    >
      {children}
    </ConsentProvider>
  )
}

// Componente de gate para renderização condicional
export { ConsentGate }

// Hook para verificar status de categoria específica
export { useCategoryStatus }

// Hook para obter todas as categorias ativas
export { useCategories }

// Hook para abrir modal de preferências programaticamente - NOVA API v0.3.1!
export { useOpenPreferencesModal }

// Componentes para uso direto se necessário
export { ConsentScriptLoader }

// Tipos exportados para TypeScript
export type { LGPDConsentProviderProps }
