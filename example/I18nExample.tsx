/**
 * Exemplo de uso da API de i18n para mensagens de peer dependencies.
 *
 * Demonstra como:
 * - Configurar idioma (pt-BR ou en)
 * - Customizar mensagens com traduções próprias
 * - Obter idioma atual
 * - Resetar customizações
 *
 * @since 0.7.1
 */

import {
  ConsentProvider,
  getPeerDepsLocale,
  resetPeerDepsMessages,
  setPeerDepsLocale,
  setPeerDepsMessages,
  type PeerDepsLocale,
} from '@react-lgpd-consent/core'
import { useEffect, useState } from 'react'

/**
 * Componente de demonstração da API de i18n.
 */
export function I18nExample() {
  const [locale, setLocale] = useState<PeerDepsLocale>('pt-BR')
  const [customized, setCustomized] = useState(false)

  useEffect(() => {
    // Obter idioma inicial
    const currentLocale = getPeerDepsLocale()
    setLocale(currentLocale)
  }, [])

  const handleLocaleChange = (newLocale: PeerDepsLocale) => {
    setPeerDepsLocale(newLocale)
    setLocale(newLocale)
  }

  const handleCustomizeSpanish = () => {
    setPeerDepsMessages({
      MULTIPLE_REACT_INSTANCES: `
╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  ERROR: Múltiples instancias de React detectadas                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

🔴 Problema:
   Su proyecto está cargando más de una copia de React.
   
✅ Solución:
   Configure package.json con overrides para React.
`,
      UNSUPPORTED_REACT_VERSION: (version: string) => `
Versión de React ${version} no soportada.
Versiones soportadas: React 18.x o 19.x
`,
      UNSUPPORTED_MUI_VERSION: (version: string) => `
Versión de Material-UI ${version} fuera del rango recomendado.
Versiones soportadas: 5.15.0+, 6.x, 7.x
`,
      MUI_OUT_OF_RANGE: (version: string) =>
        `MUI versión ${version} detectada. Versiones soportadas: 5.15.0+, 6.x o 7.x.`,
    })
    setCustomized(true)
  }

  const handleReset = () => {
    resetPeerDepsMessages()
    setCustomized(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Exemplo de i18n - Mensagens de Peer Dependencies</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Configuração de Idioma</h2>
        <p>
          Idioma atual: <strong>{locale}</strong>
          {customized && <span style={{ color: 'orange' }}> (Customizado)</span>}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => handleLocaleChange('pt-BR')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: locale === 'pt-BR' ? '#4CAF50' : '#ddd',
              color: locale === 'pt-BR' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🇧🇷 Português (pt-BR)
          </button>

          <button
            onClick={() => handleLocaleChange('en')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: locale === 'en' ? '#4CAF50' : '#ddd',
              color: locale === 'en' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🇺🇸 English (en)
          </button>

          <button
            onClick={handleCustomizeSpanish}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: customized ? '#FF9800' : '#ddd',
              color: customized ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🇪🇸 Customizar (Español)
          </button>

          {customized && (
            <button
              onClick={handleReset}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ↺ Resetar
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <h2>Como usar no seu projeto</h2>

        <h3>1. Configurar idioma inglês</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { setPeerDepsLocale } from '@react-lgpd-consent/core'

// No início da sua aplicação
setPeerDepsLocale('en')`}
        </pre>

        <h3>2. Customizar mensagens (ex: traduzir para espanhol)</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { setPeerDepsMessages } from '@react-lgpd-consent/core'

setPeerDepsMessages({
  UNSUPPORTED_REACT_VERSION: (version) => 
    \`Versión \${version} no soportada. Use React 18.x o 19.x\`,
  MUI_OUT_OF_RANGE: (version) => 
    \`MUI \${version} no es compatible\`,
})`}
        </pre>

        <h3>3. Obter idioma atual</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { getPeerDepsLocale } from '@react-lgpd-consent/core'

const currentLocale = getPeerDepsLocale() // 'pt-BR' ou 'en'`}
        </pre>

        <h3>4. Resetar customizações</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { resetPeerDepsMessages } from '@react-lgpd-consent/core'

// Volta para mensagens padrão do idioma configurado
resetPeerDepsMessages()`}
        </pre>
      </div>

      <ConsentProvider
        categories={{
          enabledCategories: ['necessary', 'analytics'],
        }}
      >
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <p>
            <strong>Nota:</strong> As mensagens de diagnóstico aparecem no console do navegador
            quando há problemas de compatibilidade (ex: versão React incorreta).
          </p>
          <p>
            Abra o DevTools (F12) e force um erro de versão React para ver as mensagens no idioma
            configurado.
          </p>
        </div>
      </ConsentProvider>
    </div>
  )
}

export default I18nExample
