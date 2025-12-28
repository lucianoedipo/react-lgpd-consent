/** @jest-environment node */
import Cookies from 'js-cookie'
import { createInitialConsentState, readConsentCookie, removeConsentCookie, writeConsentCookie } from '../cookieUtils'

jest.mock('js-cookie')

describe('cookieUtils (SSR)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('readConsentCookie retorna null quando document ausente', () => {
    expect(readConsentCookie('cookieConsent')).toBeNull()
  })

  it('removeConsentCookie não tenta remover sem document', () => {
    removeConsentCookie()
    expect(Cookies.remove).not.toHaveBeenCalled()
  })

  it('writeConsentCookie não escreve sem document/window', () => {
    writeConsentCookie(createInitialConsentState(), { enabledCategories: [] } as any)
    expect(Cookies.set).not.toHaveBeenCalled()
  })
})
