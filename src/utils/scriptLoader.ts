/** @module src/utils/scriptLoader */
/**
 * @category Utils
 * @since 0.1.0
 * Utilitários para carregamento dinâmico e seguro de scripts externos no DOM.
 *
 * Fornece funções para carregar scripts de terceiros de forma condicional ao consentimento LGPD,
 * garantindo compatibilidade SSR e verificações de permissões por categoria.
 */

/**
 * @function
 * @category Utils
 * @since 0.1.0
 * Carrega dinamicamente um script externo no DOM.
 *
 * @remarks
 * Esta função é utilizada internamente pela biblioteca para carregar scripts de integração
 * após o consentimento do usuário. Ela garante que o script só seja inserido na página
 * se o consentimento for dado e o contexto estiver disponível.
 *
 * @param {string} id Um identificador único para o elemento `<script>` a ser criado.
 * @param {string} src A URL do script externo a ser carregado.
 * @param {string | null} [category=null] A categoria de consentimento exigida para o script. Suporta tanto categorias predefinidas quanto customizadas. Se o consentimento para esta categoria não for dado, o script não será carregado.
 * @param {Record<string, string>} [attrs={}] Atributos adicionais a serem aplicados ao elemento `<script>` (ex: `{ async: 'true' }`).
 * @returns {Promise<void>} Uma Promise que resolve quando o script é carregado com sucesso, ou rejeita se o consentimento não for dado ou ocorrer um erro de carregamento.
 * @example
 * ```ts
 * // Carregar um script de analytics após o consentimento
 * loadScript('my-analytics-script', 'https://example.com/analytics.js', 'analytics')
 *   .then(() => console.log('Script de analytics carregado!'))
 *   .catch(error => console.error('Erro ao carregar script:', error))
 * ```
 */
export function loadScript(
  id: string,
  src: string,
  category: string | null = null,
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

        // Verifica se o consentimento foi finalizado E não há modal aberto
        if (!consent.consented || consent.isModalOpen) {
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
