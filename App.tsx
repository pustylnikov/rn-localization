import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createLocalization} from './dist';

const en = {
  welcome: 'Welcome',
  hello: 'Hello {name}',
};

const fr = {
  welcome: 'Bienvenue',
  hello: 'Bonjour {name}',
};

const localizations = {en, fr};

const {useLocalization, setLanguage, addListener} = createLocalization(localizations, 'en');

const App = () => {
  const {currentLanguage, t} = useLocalization();

  useEffect(() => {
    const unsubscribe = addListener(language => {
      console.log(language); // 'en' | 'fr'
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView>
      <Text style={styles.languageText}>Language: {currentLanguage}</Text>
      <View style={styles.contentView}>
        <View style={styles.buttonsView}>
          <TouchableOpacity style={styles.button} onPress={() => setLanguage('en')}>
            <Text style={styles.buttonText}>Set language: EN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setLanguage('fr')}>
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
