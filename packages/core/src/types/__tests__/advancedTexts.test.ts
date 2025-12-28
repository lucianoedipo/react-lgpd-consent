/**
 * @fileoverview
 * Testes para o sistema avançado de textos com suporte a i18n e contextos específicos.
 */

import type { AdvancedConsentTexts } from '../advancedTexts'
import { EXPANDED_DEFAULT_TEXTS, resolveTexts, TEXT_TEMPLATES } from '../advancedTexts'

describe('Sistema Avançado de Textos', () => {
  describe('EXPANDED_DEFAULT_TEXTS', () => {
    it('deve conter textos expandidos básicos', () => {
      expect(EXPANDED_DEFAULT_TEXTS.confirm).toBe('Confirmar')
      expect(EXPANDED_DEFAULT_TEXTS.cancel).toBe('Cancelar')
      expect(EXPANDED_DEFAULT_TEXTS.loading).toBe('Carregando...')
    })

    it('deve conter feedback completo', () => {
      expect(EXPANDED_DEFAULT_TEXTS.feedback?.saveSuccess).toBe('Preferências salvas com sucesso!')
      expect(EXPANDED_DEFAULT_TEXTS.feedback?.saveError).toBe(
        'Erro ao salvar preferências. Tente novamente.',
      )
      expect(EXPANDED_DEFAULT_TEXTS.feedback?.consentUpdated).toBe('Consentimento atualizado.')
    })

    it('deve conter textos de acessibilidade', () => {
      expect(EXPANDED_DEFAULT_TEXTS.accessibility?.bannerLabel).toBe(
        'Banner de consentimento de cookies',
      )
      expect(EXPANDED_DEFAULT_TEXTS.accessibility?.modalLabel).toBe(
        'Modal de preferências de cookies',
      )
      expect(EXPANDED_DEFAULT_TEXTS.accessibility?.keyboardNavigation).toBe(
        'Use Tab para navegar, Enter para selecionar',
      )
    })

    it('deve conter descrições de categorias', () => {
      expect(EXPANDED_DEFAULT_TEXTS.categories?.necessary?.name).toBe('Cookies Necessários')
      expect(EXPANDED_DEFAULT_TEXTS.categories?.analytics?.name).toBe('Cookies de Analytics')
      expect(EXPANDED_DEFAULT_TEXTS.categories?.marketing?.name).toBe('Cookies de Marketing')
      expect(EXPANDED_DEFAULT_TEXTS.categories?.functional?.name).toBe('Cookies Funcionais')
    })

    it('deve conter textos por contexto', () => {
      expect(EXPANDED_DEFAULT_TEXTS.contexts?.ecommerce?.cartAbandonment).toBe(
        'Lembramos dos produtos no seu carrinho',
      )
      expect(EXPANDED_DEFAULT_TEXTS.contexts?.saas?.userAnalytics).toBe(
        'Análise de uso para melhorar funcionalidades',
      )
      expect(EXPANDED_DEFAULT_TEXTS.contexts?.government?.citizenServices).toBe(
        'Melhoria dos serviços ao cidadão',
      )
    })

    it('deve conter variações de tom', () => {
      expect(EXPANDED_DEFAULT_TEXTS.variants?.formal?.bannerMessage).toContain('sítio eletrônico')
      expect(EXPANDED_DEFAULT_TEXTS.variants?.casual?.bannerMessage).toContain('🍪')
      expect(EXPANDED_DEFAULT_TEXTS.variants?.concise?.bannerMessage).toBe(
        'Usamos cookies. Você aceita?',
      )
      expect(EXPANDED_DEFAULT_TEXTS.variants?.detailed?.bannerMessage).toContain(
        'tecnologias similares',
      )
    })

    it('deve conter internacionalização', () => {
      expect(EXPANDED_DEFAULT_TEXTS.i18n?.en?.bannerMessage).toBe(
        'We use cookies to enhance your experience.',
      )
      expect(EXPANDED_DEFAULT_TEXTS.i18n?.es?.bannerMessage).toBe(
        'Utilizamos cookies para mejorar su experiencia.',
      )
      expect(EXPANDED_DEFAULT_TEXTS.i18n?.fr?.bannerMessage).toBe(
        'Nous utilisons des cookies pour améliorer votre expérience.',
      )
    })

    it('deve conter textos técnicos', () => {
      expect(EXPANDED_DEFAULT_TEXTS.technical?.sessionCookies).toContain('temporários')
      expect(EXPANDED_DEFAULT_TEXTS.technical?.persistentCookies).toContain('permanecem')
      expect(EXPANDED_DEFAULT_TEXTS.technical?.thirdPartyCookies).toContain('diferentes do site')
    })

    it('deve conter configuração de cookie details', () => {
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.tableHeaders?.name).toBe('Nome')
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.tableHeaders?.purpose).toBe('Finalidade')
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.tableHeaders?.duration).toBe('Duração')
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.tableHeaders?.provider).toBe('Fornecedor')
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.toggleDetails?.expand).toBe('Ver detalhes')
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.scriptLabelPrefix).toBe('(script) ')
      expect(EXPANDED_DEFAULT_TEXTS.cookieDetails?.scriptPurpose).toBe('Script de integração ativo')
    })
  })

  describe('TEXT_TEMPLATES', () => {
    it('deve conter template para e-commerce', () => {
      const ecommerce = TEXT_TEMPLATES.ecommerce

      expect(ecommerce.bannerMessage).toContain('experiência de compra')
      expect(ecommerce.acceptAll).toBe('Aceitar e continuar')
      expect(ecommerce.variants?.casual?.bannerMessage).toContain('🛒')
    })

    it('deve conter template para SaaS', () => {
      const saas = TEXT_TEMPLATES.saas

      expect(saas.bannerMessage).toContain('desempenho da aplicação')
      expect(saas.acceptAll).toBe('Aceitar e otimizar')
      expect(saas.variants?.formal?.bannerMessage).toContain('performance')
    })

    it('deve conter template para governo', () => {
      const government = TEXT_TEMPLATES.government

      expect(government.bannerMessage).toContain('LGPD')
      expect(government.acceptAll).toBe('Aceitar em conformidade')
      expect(government.variants?.formal?.bannerMessage).toContain('Lei Geral de Proteção de Dados')
    })
  })

  describe('resolveTexts', () => {
    const mockAdvancedTexts: AdvancedConsentTexts = {
      bannerMessage: 'Mensagem padrão',
      acceptAll: 'Aceitar',
      declineAll: 'Recusar',
      preferences: 'Preferências',
      modalTitle: 'Título',
      modalIntro: 'Introdução',
      save: 'Salvar',
      necessaryAlwaysOn: 'Necessários',

      variants: {
        formal: {
          bannerMessage: 'Mensagem formal',
          acceptAll: 'Concordar',
        },
        casual: {
          bannerMessage: 'Mensagem casual 😊',
          acceptAll: 'Aceitar!',
        },
      },

      i18n: {
        en: {
          bannerMessage: 'English message',
          acceptAll: 'Accept All',
          declineAll: 'Decline',
          preferences: 'Preferences',
          modalTitle: 'Title',
          modalIntro: 'Introduction',
          save: 'Save',
          necessaryAlwaysOn: 'Necessary',
        },
        es: {
          bannerMessage: 'Mensaje en español',
          acceptAll: 'Aceptar Todo',
          declineAll: 'Rechazar',
          preferences: 'Preferencias',
          modalTitle: 'Título',
          modalIntro: 'Introducción',
          save: 'Guardar',
          necessaryAlwaysOn: 'Necesarios',
        },
      },
    }

    it('deve retornar textos padrão sem opções', () => {
      const resolved = resolveTexts(mockAdvancedTexts)

      expect(resolved.bannerMessage).toBe('Mensagem padrão')
      expect(resolved.acceptAll).toBe('Aceitar')
    })

    it('deve aplicar variação formal', () => {
      const resolved = resolveTexts(mockAdvancedTexts, { variant: 'formal' })

      expect(resolved.bannerMessage).toBe('Mensagem formal')
      expect(resolved.acceptAll).toBe('Concordar')
      expect(resolved.declineAll).toBe('Recusar') // Mantém padrão se não definido na variação
    })

    it('deve aplicar variação casual', () => {
      const resolved = resolveTexts(mockAdvancedTexts, { variant: 'casual' })

      expect(resolved.bannerMessage).toBe('Mensagem casual 😊')
      expect(resolved.acceptAll).toBe('Aceitar!')
    })

    it('deve aplicar idioma inglês', () => {
      const resolved = resolveTexts(mockAdvancedTexts, { language: 'en' })

      expect(resolved.bannerMessage).toBe('English message')
      expect(resolved.acceptAll).toBe('Accept All')
      expect(resolved.preferences).toBe('Preferences')
    })

    it('deve aplicar idioma espanhol', () => {
      const resolved = resolveTexts(mockAdvancedTexts, { language: 'es' })

      expect(resolved.bannerMessage).toBe('Mensaje en español')
      expect(resolved.acceptAll).toBe('Aceptar Todo')
    })

    it('deve combinar variação e idioma', () => {
      const textsWithVariantAndLang: AdvancedConsentTexts = {
        ...mockAdvancedTexts,
        variants: {
          formal: {
            bannerMessage: 'Formal português',
            acceptAll: 'Concordar',
          },
        },
        i18n: {
          en: {
            bannerMessage: 'Formal English',
            acceptAll: 'Agree',
            declineAll: 'Decline',
            preferences: 'Preferences',
            modalTitle: 'Title',
            modalIntro: 'Introduction',
            save: 'Save',
            necessaryAlwaysOn: 'Necessary',
          },
        },
      }

      // Variação primeiro, depois idioma
      const resolved = resolveTexts(textsWithVariantAndLang, {
        variant: 'formal',
        language: 'en',
      })

      expect(resolved.bannerMessage).toBe('Formal English') // Idioma sobrescreve variação
      expect(resolved.acceptAll).toBe('Agree')
    })

    it('deve manter textos padrão para idioma português', () => {
      const resolved = resolveTexts(mockAdvancedTexts, { language: 'pt' })

      expect(resolved.bannerMessage).toBe('Mensagem padrão')
      expect(resolved.acceptAll).toBe('Aceitar')
    })

    it('deve ignorar opções vazias', () => {
      const resolved = resolveTexts(mockAdvancedTexts, {})

      expect(resolved.bannerMessage).toBe('Mensagem padrão')
      expect(resolved.acceptAll).toBe('Aceitar')
    })

    it('deve lidar com variação inexistente', () => {
      const resolved = resolveTexts(mockAdvancedTexts, {
        variant: 'nonexistent' as any,
      })

      expect(resolved.bannerMessage).toBe('Mensagem padrão')
      expect(resolved.acceptAll).toBe('Aceitar')
    })

    it('deve lidar com idioma inexistente', () => {
      const resolved = resolveTexts(mockAdvancedTexts, {
        language: 'zh' as any,
      })

      expect(resolved.bannerMessage).toBe('Mensagem padrão')
      expect(resolved.acceptAll).toBe('Aceitar')
    })
  })

  describe('Integração com ConsentTexts', () => {
    it('deve ser compatível com interface ConsentTexts base', () => {
      const advancedTexts: AdvancedConsentTexts = {
        bannerMessage: 'Teste',
        acceptAll: 'Aceitar',
        declineAll: 'Recusar',
        preferences: 'Preferências',
        modalTitle: 'Modal',
        modalIntro: 'Introdução',
        save: 'Salvar',
        necessaryAlwaysOn: 'Necessários',

        // Campos expandidos
        confirm: 'Confirmar',
        categories: {
          analytics: {
            name: 'Analytics',
            description: 'Descrição',
          },
        },
      }

      // Deve ser utilizável como ConsentTexts básico
      const basicTexts = advancedTexts as any
      expect(basicTexts.bannerMessage).toBe('Teste')
      expect(basicTexts.acceptAll).toBe('Aceitar')
    })

    it('deve herdar corretamente de ConsentTexts', () => {
      const resolved = resolveTexts(TEXT_TEMPLATES.ecommerce)

      // Propriedades específicas definidas no template ecommerce
      expect(resolved.bannerMessage).toBe(
        'Utilizamos cookies para personalizar ofertas e melhorar sua experiência de compra.',
      )
      expect(resolved.acceptAll).toBe('Aceitar e continuar')

      // Deve ser um objeto válido com propriedades definidas
      expect(typeof resolved).toBe('object')
      expect(Object.keys(resolved).length).toBeGreaterThan(1)

      // Verifica que a função não quebra
      expect(resolved).toBeDefined()
      expect(resolved).not.toBeNull()
    })
  })
})
