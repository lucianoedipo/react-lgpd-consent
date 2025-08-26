import {
  openPreferencesModal,
  _registerGlobalOpenPreferences,
  _unregisterGlobalOpenPreferences,
} from './useConsent'
import { logger } from '../utils/logger'

describe('openPreferencesModal global registration', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    _unregisterGlobalOpenPreferences()
  })

  test('warns when not registered', () => {
    const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {})
    openPreferencesModal()
    expect(spy).toHaveBeenCalled()
  })

  test('calls registered handler and can unregister', () => {
    const handler = jest.fn()
    _registerGlobalOpenPreferences(handler)

    openPreferencesModal()
    expect(handler).toHaveBeenCalledTimes(1)

    _unregisterGlobalOpenPreferences()
    const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {})
    openPreferencesModal()
    expect(spy).toHaveBeenCalled()
  })
})
