import {addListener, createLocalization, getLanguage, setLanguage, translate} from '../src';

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

it('test "addListener" function', () => {
  const listenerMock = jest.fn(() => undefined);
  const unsubscribe = addListener(listenerMock);
  setLanguage('fr');
  expect(listenerMock).toBeCalled();
  setLanguage('fr');
  setLanguage('fr');
  expect(listenerMock.mock.calls.length).toBe(1);
  setLanguage('en');
  expect(listenerMock).toBeCalled();
  expect(listenerMock.mock.calls.length).toBe(2);
  expect(unsubscribe()).toBeTruthy();
});
