/**
 * Carrega um script dinamicamente após consentimento finalizado.
 * Aguarda que o usuário tome uma decisão definitiva (banner fechado ou preferências salvas).
 */
export function loadScript(
  id: string,
  src: string,
  category: 'analytics' | 'marketing' | null = null,
  attrs: Record<string, string> = {},
) {
  if (typeof document === 'undefined') return Promise.resolve()
  if (document.getElementById(id)) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const checkConsent = () => {
      // Aguarda o contexto estar disponível
      const consentCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('cookieConsent='))
        ?.split('=')[1]

      if (!consentCookie) {
        setTimeout(checkConsent, 100)
        return
      }

      try {
        const consent = JSON.parse(decodeURIComponent(consentCookie))

        // Verifica se o consentimento foi finalizado
        if (!consent.consented) {
          setTimeout(checkConsent, 100)
          return
        }

        // Se categoria específica, verifica permissão
        if (category && !consent.preferences[category]) {
          reject(new Error(`Consent not given for ${category} scripts`))
          return
        }

        // Carrega o script
        const s = document.createElement('script')
        s.id = id
        s.src = src
        s.async = true
        for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)

        s.onload = () => resolve()
        s.onerror = () => reject(new Error(`Failed to load script: ${src}`))

        document.body.appendChild(s)
      } catch {
        setTimeout(checkConsent, 100)
      }
    }

    checkConsent()
  })
}
