# RN-Localization

A simple and easy-to-use localization library for React Native.

## Installation

To install the package, simply run:

```
npm install @anvilapp/rn-localization
```

or

```
yarn add @anvilapp/rn-localization
```

## Usage

First, you need to create a localization context by passing an object containing your translations and a fallback
language.

```tsx
import { createLocalization } from '@anvilapp/rn-localization';

const en = {
  welcome: 'Welcome',
  hello: 'Hello {name}',
};

const fr = {
  welcome: 'Bienvenue',
  hello: 'Bonjour {name}',
};

const localizations = { en, fr };

const { useLocalization, setLanguage, registerListener } = createLocalization(localizations, 'en');
```

Then, you can use the `useLocalization` hook to get the current language and a t function to translate keys.

```tsx
const { currentLanguage, t } = useLocalization();

console.log(currentLanguage); // 'en'
console.log(t('welcome')); // 'Welcome'
console.log(t('hello', { name: 'John' })); // 'Hello John'
```

You can change the current language using the `setLanguage` function.

```tsx
setLanguage('fr');
console.log(t('welcome')); // 'Bienvenue'
```

You can also subscribe to language changes by using the `registerListener` function.

```tsx
const unsubscribe = registerListener(language => {
  console.log(language); // 'fr'
});
```

## Example

```tsx
import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { createLocalization } from '@anvilapp/rn-localization';

const en = {
  welcome: 'Welcome',
  hello: 'Hello {name}',
};

const fr = {
  welcome: 'Bienvenue',
  hello: 'Bonjour {name}',
};

const localizations = { en, fr };

const { useLocalization, setLanguage, registerListener } = createLocalization(localizations, 'en');

const App = () => {
  const { currentLanguage, t } = useLocalization();

  useEffect(() => {
    const unsubscribe = registerListener(language => {
      console.log(language); // 'en' | 'fr'
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView>
      <Text>Language: {currentLanguage}</Text>
      <Text>{t('welcome')}</Text>
      <Text>{t('hello', { name: 'John' })}</Text>
      <TouchableOpacity onPress={() => setLanguage('en')}>
        <Text>Set EN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setLanguage('fr')}>
        <Text>Set FR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
```

## API
- `createLocalization<T extends Translations<T>>(localizations: T, fallbackLanguage?: keyof T): object`: Create a localization context by passing an object containing your translations and a fallback language. It returns an
  object with the following functions:
    - `useLocalization`
    - `translate`
    - `setLanguage`
    - `registerListener`
    - `getLanguage`
    - `getDefaultLanguage`
- `useLocalization<T extends Translations<T>>(): object`: A React hook that returns the current language and a t function to translate keys.
- `translate<T extends Translations<T>>(...args: TranslateArgs<T>): string`: Translate a key using the current language and an optional set of values.
- `setLanguage<T extends Translations<T>>(value: keyof T): void`: Change the current language.
- `registerListener<T extends Translations<T>>(listener: LocaleListener<T>): () => boolean`: Subscribe to language changes. It returns an unsubscribe function.
- `getLanguage<T extends Translations<T>>(): keyof T`: Returns the current language.
- `getDefaultLanguage<T extends Translations<T>>(): keyof T`: Returns the default language.
