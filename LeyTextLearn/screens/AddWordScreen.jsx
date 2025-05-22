import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AddWordScreen = () => {
  const [fromLang, setFromLang] = useState('');
  const [toLang, setToLang] = useState('');
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [pronunciation, setPronunciation] = useState('');

  const handleSave = async () => {
    if (!word || !meaning) {
      Alert.alert('Missing Info', 'Please enter both word and meaning.');
      return;
    }
  
    const newWord = {
      fromLang,
      toLang,
      word,
      meaning,
      example,
      pronunciation,
    };
  
    try {
      const existing = await AsyncStorage.getItem('words');
      const words = existing ? JSON.parse(existing) : [];
      words.push(newWord);
      await AsyncStorage.setItem('words', JSON.stringify(words));
      Alert.alert('Saved!', 'Your word has been added.');
  
      setWord('');
      setMeaning('');
      setExample('');
      setPronunciation('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the word.');
      console.error(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Word</Text>

      <TextInput
        style={styles.input}
        placeholder="From Language (e.g. English)"
        value={fromLang}
        onChangeText={setFromLang}
      />
      <TextInput
        style={styles.input}
        placeholder="To Language (e.g. Waray)"
        value={toLang}
        onChangeText={setToLang}
      />
      <TextInput
        style={styles.input}
        placeholder="Word or Phrase"
        value={word}
        onChangeText={setWord}
      />
      <TextInput
        style={styles.input}
        placeholder="Meaning"
        value={meaning}
        onChangeText={setMeaning}
      />
      <TextInput
        style={styles.input}
        placeholder="Example Sentence"
        value={example}
        onChangeText={setExample}
      />
      <TextInput
        style={styles.input}
        placeholder="Pronunciation Tip"
        value={pronunciation}
        onChangeText={setPronunciation}
      />

      <Button title="Save Word" onPress={handleSave} />
    </View>
  );
};

export default AddWordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});
