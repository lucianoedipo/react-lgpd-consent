import { ConsentProvider } from './src/context/ConsentContext'
import { CookieBanner } from './src/components/CookieBanner'
import { PreferencesModal } from './src/components/PreferencesModal'
import { ConsentGate } from './src/utils/ConsentGate'
import { useConsent } from './src/hooks/useConsent'

const customTexts = {
  bannerMessage: 'Utilizamos cookies para melhorar sua experiência.',
  acceptAll: 'Aceitar todos',
  declineAll: 'Recusar todos',
  preferences: 'Preferências',
  controllerInfo:
    'Controlado por React LGPD Consent Ltda - CNPJ 00.000.000/0001-00',
  dataTypes: 'Coletamos: navegação, preferências, estatísticas.',
  thirdPartySharing: 'Compartilhamos com: Google Analytics, Facebook Pixel.',
  userRights: 'Direitos: acesso, correção, exclusão.',
  contactInfo: 'Contato DPO: dpo@reactlgpd.com',
}

export default function ExampleApp() {
  const { consented, openPreferences, preferences } = useConsent()

  return (
    <ConsentProvider texts={customTexts}>
      {/* Banner de consentimento fixo */}
      <CookieBanner />

      {/* Modal de preferências */}
      <PreferencesModal />

      {/* Exemplo de uso condicional */}
      <ConsentGate category="analytics">
        <div>Google Analytics carregado!</div>
      </ConsentGate>

      {/* Exemplo de botão para abrir modal manualmente */}
      <button onClick={openPreferences}>Abrir preferências</button>

      {/* Exibir estado atual para debug */}
      <pre>{JSON.stringify({ consented, preferences }, null, 2)}</pre>
    </ConsentProvider>
  )
}
