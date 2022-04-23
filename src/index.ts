import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  AnyLocalizationType,
  AnyObjectKey,
  ListenerType,
  LocalizationType,
  TranslateArgs,
} from './types';

const _listeners = new Map<symbol, ListenerType<AnyLocalizationType>>();

let _localizations: AnyLocalizationType;

let _currentLanguage: AnyObjectKey;

let _defaultLanguage: AnyObjectKey;

export function configureLocalization<T extends LocalizationType<AnyLocalizationType>>(
  localizations: T,
  defaultLanguage: keyof T,
): void {
  _localizations = localizations;
  _currentLanguage = defaultLanguage;
  _defaultLanguage = _currentLanguage;
}

export function addListener<T extends LocalizationType<AnyLocalizationType>>(
  listener: ListenerType<T>,
): () => boolean {
  const key = Symbol();
  _listeners.set(key, listener);

  return () => _listeners.delete(key);
}

export function translate<T extends LocalizationType<AnyLocalizationType>>(
  language: keyof T,
  key: keyof T[keyof T],
  args?: TranslateArgs,
): AnyObjectKey {
  const lang = language in _localizations ? language : _defaultLanguage;

  if (key in _localizations[lang]) {
    const text = _localizations[lang][key];
    if (args) {
      return text.replace(/\{([a-zA-Z0-9]+)\}/gm, (...match) => {
        const replacer = args[match[1]];

        return `${replacer ?? (replacer === null ? '' : match[0])}`;
      });
    }

    return text;
  }

  return key;
}

export function setLanguage<T extends LocalizationType<AnyLocalizationType>>(
  language: keyof T,
): void {
  if (_currentLanguage !== language) {
    _currentLanguage = language;
    _listeners.forEach(listener => {
      listener(language);
    });
  }
}

export function getLanguage<T extends LocalizationType<AnyLocalizationType>>(): keyof T {
  return _currentLanguage;
}

export function useLocalization<T extends LocalizationType<AnyLocalizationType>>() {
  const [currentLanguage, setCurrentLanguage] = useState<keyof T>(_currentLanguage);

  useEffect(() => {
    const unsubscribe = addListener<T>((nextLanguage: keyof T) => {
      setCurrentLanguage(nextLanguage);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const t = useCallback(
    (key: keyof T[keyof T], args?: TranslateArgs) => translate<T>(currentLanguage, key, args),
    [currentLanguage],
  );

  return useMemo(
    () => ({
      currentLanguage,
      t,
    }),
    [currentLanguage, t],
  );
}
