"use client"

import { useEffect } from "react"
import { ConsentGate as LibraryConsentGate } from "react-lgpd-consent"

import { useLGPDConsent } from "./LGPDWithLibrary"

// Re-exportar o ConsentGate original da biblioteca
export { LibraryConsentGate as ConsentGate }

// Utilitário para carregar scripts condicionalmente
export async function loadScript(
  id: string,
  src: string,
  attrs: Record<string, string> = {},
) {
  return new Promise((resolve, reject) => {
    // Verificar se o script já existe
    if (document.getElementById(id)) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.id = id
    script.src = src
    script.async = true

    // Aplicar atributos adicionais
    Object.entries(attrs).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    script.onload = () => {
      resolve(true)
    }

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`))
    }

    document.head.appendChild(script)
  })
}

// Hook para usar scripts condicionais com todas as 6 categorias ANPD
export function useConditionalScripts() {
  const { hasConsent } = useLGPDConsent()

  const loadConditionalScript = async (
    id: string,
    src: string,
    category: string = "necessary",
    attrs: Record<string, string> = {},
  ) => {
    if (
      !hasConsent(
        category as
          | "necessary"
          | "analytics"
          | "functional"
          | "marketing"
          | "personalization"
          | "social",
      )
    ) {
      return false
    }

    try {
      await loadScript(id, src, attrs)
      return true
    } catch (error) {
      console.error(`❌ Erro ao carregar script condicional ${id}:`, error)
      return false
    }
  }

  return { loadConditionalScript, hasConsent }
}

// Componente para Google Analytics/GTM com consentimento
interface ConditionalAnalyticsProps {
  gtmId: string
}

export function ConditionalAnalytics({ gtmId }: Readonly<ConditionalAnalyticsProps>) {
  const { hasConsent } = useLGPDConsent()

  useEffect(() => {
    if (hasConsent("analytics") && gtmId) {
      // Google Tag Manager com consentimento
      const script = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `

      const scriptElement = document.createElement("script")
      scriptElement.innerHTML = script
      document.head.appendChild(scriptElement)
    } else {
      console.log("🚫 Google Analytics/GTM desabilitado")
    }
  }, [hasConsent, gtmId])

  return null
}

// Componente específico para Microsoft Clarity
interface ConditionalClarityProps {
  projectId: string
}

export function ConditionalClarity({ projectId }: Readonly<ConditionalClarityProps>) {
  const { hasConsent } = useLGPDConsent()

  useEffect(() => {
    if (hasConsent("analytics") && projectId) {
      // Microsoft Clarity com consentimento
      /* eslint-disable */
      ;(function (
        c: Window & typeof globalThis,
        l: Document,
        a: string,
        r: string,
        i: string,
        t?: HTMLScriptElement,
        y?: Element,
      ) {
        // @ts-ignore
        c[a] =
          c[a] ||
          function () {
            // @ts-ignore
            const queue = (c[a].q = c[a].q || [])
            queue.push(arguments)
          }
        t = l.createElement(r) as HTMLScriptElement
        t.async = true
        t.src = "https://www.clarity.ms/tag/" + i
        y = l.getElementsByTagName(r)[0]
        y?.parentNode?.insertBefore(t, y)
      })(window, document, "clarity", "script", projectId)
      /* eslint-enable */
    } else {
      console.log("🚫 Microsoft Clarity desabilitado")
    }
  }, [hasConsent, projectId])

  return null
}

// Componente para VLibras com consentimento funcional
interface ConditionalVLibrasProps {
  onVLibrasToggle?: (enabled: boolean) => void
}

export function ConditionalVLibras({
  onVLibrasToggle,
}: Readonly<ConditionalVLibrasProps>) {
  const { hasConsent } = useLGPDConsent()
  const functionalConsent = hasConsent("functional")

  useEffect(() => {
    if (functionalConsent) {
      // Carregar VLibras apenas com consentimento funcional
      loadScript("vlibras-script", "https://vlibras.gov.br/app/vlibras-plugin.js", {
        "data-enabled": "true",
        "data-auto-init": "true",
      }).then(() => {
        onVLibrasToggle?.(true)
      })
    } else {
      // Remover VLibras se não houver consentimento
      const existingScript = document.getElementById("vlibras-script")
      if (existingScript) {
        existingScript.remove()
        onVLibrasToggle?.(false)
      }
    }
  }, [functionalConsent, onVLibrasToggle])

  return functionalConsent ? (
    <div id="vlibras">
      <div className="enabled">
        <div className="active" />
        <div>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
    </div>
  ) : null
}
