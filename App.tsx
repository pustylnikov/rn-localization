import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {configureLocalization, setLanguage, useLocalization} from './dist';
import {LocalizationType} from './dist/types';

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
      <Text style={styles.languageText}>Language: {currentLanguage}</Text>
      <View style={styles.contentView}>
        <View style={styles.buttonsView}>
          <TouchableOpacity style={styles.button} onPress={() => setLanguage<Localization>('en')}>
            <Text style={styles.buttonText}>Set language: EN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setLanguage<Localization>('fr')}>
            <Text style={styles.buttonText}>Set language: FR</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeText}>{t('welcome')}</Text>
        <View style={styles.moreTextView}>
          <Text style={styles.text}>{t('hello', {name: 'John'})}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  languageText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 15,
  },
  contentView: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  buttonsView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  moreTextView: {
    paddingTop: 20,
  },
  text: {
    color: '#333',
    fontSize: 16,
  },
});

export default App;
