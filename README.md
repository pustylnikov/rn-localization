### Installation
```
npm install --save @anvilapp/rn-localization
```
or
```
yarn add @anvilapp/rn-localization
```

### Usage example
```typescript jsx
import {configureLocalization, setLanguage, useLocalization} from '@anvilapp/rn-localization';
import {LocalizationType} from 'rn-localization/dist/types';

const en = {
  welcome: 'Welcome',
  hello: 'Hello {name}',
};

const fr = {
  welcome: 'Bienvenue',
  hello: 'Bonjour {name}',
};

const localizations = {en, fr};

configureLocalization(localizations, 'en');

type Localization = LocalizationType<typeof localizations>;

const App = () => {
  const {currentLanguage, t} = useLocalization<Localization>();

  return (
    <SafeAreaView>
      <Text>Language: {currentLanguage}</Text>
      <View>
        <View>
          <TouchableOpacity onPress={() => setLanguage<Localization>('en')}>
            <Text>Set language: EN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage<Localization>('fr')}>
            <Text>Set language: FR</Text>
          </TouchableOpacity>
        </View>
        <Text>{t('welcome')}</Text>
        <View>
          <Text>{t('hello', {name: 'John'})}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
```
