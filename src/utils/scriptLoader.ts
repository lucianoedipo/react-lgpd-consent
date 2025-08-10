/**
 * Carrega um script dinamicamente após verificação de consentimento.
 * Recomenda-se usar com ConsentGate para melhor controle.
 */
export function loadScript(
  id: string,
  src: string,
  attrs: Record<string, string> = {},
) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return

  const s = document.createElement('script')
  s.id = id
  s.src = src
  s.async = true
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.body.appendChild(s)
}

/**
 * Carrega script condicionalmente baseado no consentimento.
 * Aguarda o consentimento ser dado antes de executar.
 */
export function loadConditionalScript(
  id: string,
  src: string,
  condition: () => boolean,
  attrs: Record<string, string> = {},
  maxWaitMs = 5000,
) {
  if (typeof document === 'undefined') return Promise.resolve()
  if (document.getElementById(id)) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now()

    const checkCondition = () => {
      if (condition()) {
        loadScript(id, src, attrs)
        resolve()
      } else if (Date.now() - startTime > maxWaitMs) {
        reject(
          new Error(`Timeout waiting for consent condition for script ${id}`),
        )
      } else {
        setTimeout(checkCondition, 100) // Check every 100ms
      }
    }

    checkCondition()
  })
}
