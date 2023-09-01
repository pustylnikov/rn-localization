import {registerListener, createLocalization, getLanguage, setLanguage, translate} from '../src';

jest.useFakeTimers();

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [
    {countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false},
    {countryCode: 'FR', languageTag: 'fr-FR', languageCode: 'fr', isRTL: false},
  ]),
}));

beforeEach(() => {
  const en = {
    WELCOME: 'Welcome',
    HELLO: 'Hello {name}',
  };

  const fr = {
    WELCOME: 'Bienvenue',
    HELLO: 'Bonjour {name}',
  };

  const languages = {en, fr};

  createLocalization(languages, 'en');
});

it('test "getLanguage & setLanguage" functions', () => {
  expect(getLanguage()).toBe('en');
  expect(setLanguage('fr')).toBeUndefined();
  expect(getLanguage()).toBe('fr');
});

it('test "translate" function', () => {
  expect(translate('WELCOME', undefined, 'en')).toBe('Welcome');
  expect(translate('WELCOME', undefined, 'fr')).toBe('Bienvenue');
  expect(translate('HELLO', null, 'en')).toBe('Hello {name}');
  expect(translate('HELLO', {name: 'John'}, 'en')).toBe('Hello John');
  expect(translate('HELLO', null, 'fr')).toBe('Bonjour {name}');
  expect(translate('HELLO', {name: 'John'}, 'fr')).toBe('Bonjour John');
});

it('test "registerListener" function', () => {
  const listenerMock = jest.fn(() => undefined);
  const unsubscribe = registerListener(listenerMock);
  setLanguage('fr');
  jest.runAllTimers();
  expect(listenerMock).toBeCalled();
  setLanguage('fr');
  setLanguage('fr');
  jest.runAllTimers();
  expect(listenerMock.mock.calls.length).toBe(1);
  setLanguage('en');
  jest.runAllTimers();
  expect(listenerMock).toBeCalled();
  expect(listenerMock.mock.calls.length).toBe(2);
  expect(unsubscribe()).toBeTruthy();
});
