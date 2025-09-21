import { discoverRuntimeCookies, detectConsentCookieName, categorizeDiscoveredCookies } from './cookieDiscovery';
import { COOKIE_PATTERNS_BY_CATEGORY } from './cookieRegistry';

describe('discoverRuntimeCookies', () => {
  it('should return an empty array when document is not defined', () => {
    // @ts-ignore
    global.document = undefined;
    expect(discoverRuntimeCookies()).toEqual([]);
  });

  it('should return an empty array when document.cookie is empty', () => {
    // @ts-ignore
    global.document = { cookie: '' };
    expect(discoverRuntimeCookies()).toEqual([]);
  });

  it('should return a list of cookies', () => {
    // @ts-ignore
    global.document = { cookie: '_ga=GA1.2.12345.67890; _gid=GA1.2.98765.43210; cookieConsent={"preferences":{"analytics":true}}' };
    expect(discoverRuntimeCookies()).toEqual([{ name: '_ga' }, { name: '_gid' }, { name: 'cookieConsent' }]);
  });
});

describe('detectConsentCookieName', () => {
  it('should return null when document is not defined', () => {
    // @ts-ignore
    global.document = undefined;
    expect(detectConsentCookieName()).toBeNull();
  });

  it('should return null when document.cookie is empty', () => {
    // @ts-ignore
    global.document = { cookie: '' };
    expect(detectConsentCookieName()).toBeNull();
  });

  it('should return the name of the consent cookie', () => {
    // @ts-ignore
    global.document = { cookie: '_ga=GA1.2.12345.67890; my-consent-cookie={"preferences":{"analytics":true},"version":"1"}; _gid=GA1.2.98765.43210' };
    expect(detectConsentCookieName()).toBe('my-consent-cookie');
  });

  it('should return null if no consent cookie is found', () => {
    // @ts-ignore
    global.document = { cookie: '_ga=GA1.2.12345.67890; _gid=GA1.2.98765.43210' };
    expect(detectConsentCookieName()).toBeNull();
  });
});

describe('categorizeDiscoveredCookies', () => {
  it('should return an empty object when no cookies are discovered', () => {
    expect(categorizeDiscoveredCookies([])).toEqual({});
  });

  it('should categorize cookies based on patterns', () => {
    const discoveredCookies = [{ name: '_ga' }, { name: '_fbp' }, { name: 'user_session' }];
    const categorized = categorizeDiscoveredCookies(discoveredCookies);
    expect(categorized).toEqual({
      analytics: [{ name: '_ga' }],
      marketing: [{ name: '_fbp' }],
      necessary: [{ name: 'user_session' }],
    });
  });

  it('should assign unknown cookies to analytics category', () => {
    const discoveredCookies = [{ name: 'unknown_cookie' }];
    const categorized = categorizeDiscoveredCookies(discoveredCookies);
    expect(categorized).toEqual({
      analytics: [{ name: 'unknown_cookie' }],
    });
  });

  it('should not categorize the consent cookie', () => {
    const discoveredCookies = [{ name: 'cookieConsent' }];
    const categorized = categorizeDiscoveredCookies(discoveredCookies);
    expect(categorized).toEqual({});
  });
});
