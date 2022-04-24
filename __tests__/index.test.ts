import {addListener, configureLocalization, getLanguage, setLanguage, translate} from '../src';

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

  configureLocalization(languages, 'en');
});

it('test "getLanguage & setLanguage" functions', () => {
  expect(getLanguage()).toBe('en');
  expect(setLanguage('fr')).toBeUndefined();
  expect(getLanguage()).toBe('fr');
});

it('test "translate" function', () => {
  expect(translate('en', 'WELCOME')).toBe('Welcome');
  expect(translate('fr', 'WELCOME')).toBe('Bienvenue');
  expect(translate('en', 'HELLO')).toBe('Hello {name}');
  expect(translate('en', 'HELLO', {name: 'John'})).toBe('Hello John');
  expect(translate('fr', 'HELLO')).toBe('Bonjour {name}');
  expect(translate('fr', 'HELLO', {name: 'John'})).toBe('Bonjour John');
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
