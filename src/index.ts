import {useCallback, useEffect, useMemo, useState} from 'react';
import {LocaleListener, Translations, Args, TranslateArgs} from './types';
import {NativeModules, Platform} from 'react-native';

const $listeners = new Map<symbol, LocaleListener<Translations<any>>>();

let $localizations: any;

let $currentLanguage: any;

let $defaultLanguage: any;

function $setLocalizations<T extends Translations<T>>(value: T): void {
  $localizations = value;
}

function $getLocalizations<T extends Translations<T>>(): T {
  return $localizations;
}

function $setDefaultLanguage<T extends Translations<T>>(value: keyof T): void {
  $defaultLanguage = value;
}

function $setCurrentLanguage<T extends Translations<T>>(value: keyof T): void {
  $currentLanguage = value;
}

function $getListeners<T extends Translations<T>>(): Map<symbol, LocaleListener<Translations<T>>> {
  return $listeners;
}

export function getLanguage<T extends Translations<T>>(): keyof T {
  return $currentLanguage;
}

export function setLanguage<T extends Translations<T>>(value: keyof T): void {
  if (getLanguage<T>() !== value) {
    $setCurrentLanguage<T>(value);
    $getListeners<T>().forEach(listener => {
      listener(value);
    });
  }
}

export function addListener<T extends Translations<T>>(listener: LocaleListener<T>): () => boolean {
  const key = Symbol();
  $listeners.set(key, listener);

  return () => $listeners.delete(key);
}

export function createLocalization<T extends Translations<T>>(
  localizations: T,
  fallbackLanguage?: keyof T,
) {
  $setLocalizations<T>(localizations);
  const defaultLanguage = detectDefaultLanguage(
    Object.keys(localizations),
    fallbackLanguage as string,
  ) as keyof T;
  $setDefaultLanguage<T>(defaultLanguage);
  $setCurrentLanguage<T>(defaultLanguage);

  return {
    useLocalization: () => useLocalization<T>(),
    translate: (...args: TranslateArgs<T>) => translate<T>(...args),
    addListener: (listener: LocaleListener<T>) => addListener<T>(listener),
    setLanguage: (value: keyof T) => setLanguage<T>(value),
    getLanguage: () => getLanguage<T>(),
    getDefaultLanguage: () => getDefaultLanguage<T>(),
  };
}

export function translate<T extends Translations<T>>(...args: TranslateArgs<T>): string {
  const [key, values, language = getLanguage<T>()] = args;
  const localization = $getLocalizations<T>();
  const lang = language in localization ? language : getDefaultLanguage<T>();

  if (key in localization[lang]) {
    const text = localization[lang][key];
    if (values) {
      return text.replace(/\{([a-zA-Z0-9]+)\}/gm, (...match: any[]) => {
        const replacer = values[match[1]];

        return `${replacer ?? (replacer === null ? '' : match[0])}`;
      });
    }

    return text;
  }

  return `${key}`;
}

export function useLocalization<T extends Translations<T>>() {
  const [currentLanguage, setCurrentLanguage] = useState(getLanguage<T>());

  useEffect(() => {
    const unsubscribe = addListener<T>((nextLanguage: keyof T) => {
      setCurrentLanguage(nextLanguage);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const t = useCallback(
    (key: keyof T[keyof T], values?: Args) => translate<T>(key, values, currentLanguage),
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

export function getDefaultLanguage<T extends Translations<T>>(): keyof T {
  return $defaultLanguage;
}

function detectDefaultLanguage(supportedLanguages: string[], fallbackLanguage?: string): string {
  try {
    const deviceLanguages = getDeviceLanguages();

    for (let i = 0; i < deviceLanguages.length; i++) {
      const [language] = deviceLanguages[i].toLowerCase().split('-');
      if (supportedLanguages.includes(language)) {
        return language;
      }
    }
  } catch (e) {}

  return fallbackLanguage || supportedLanguages[0];
}

function getDeviceLanguages(): string[] {
  if (Platform.OS === 'ios') {
    const deviceLanguages = NativeModules.SettingsManager.settings.AppleLanguages;
    if (deviceLanguages && Array.isArray(deviceLanguages)) {
      return deviceLanguages;
    }
  } else {
    const deviceLanguage = NativeModules.I18nManager.localeIdentifier;
    if (deviceLanguage && typeof deviceLanguage === 'string') {
      return [deviceLanguage];
    }
  }

  return [];
}
