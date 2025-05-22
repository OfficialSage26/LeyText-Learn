import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FlashcardScreen = () => {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      const savedWords = await AsyncStorage.getItem('words');
      const parsed = savedWords ? JSON.parse(savedWords) : [];
      setWords(parsed);
    };

    loadWords();
  }, []);

  const nextCard = () => {
    if (words.length === 0) return;
    setIndex((prev) => (prev + 1) % words.length);
    setShowAnswer(false);
  };

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No words found. Add some words first!</Text>
      </View>
    );
  }

  const current = words[index];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard {index + 1} of {words.length}</Text>

      <TouchableOpacity style={styles.card} onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.cardText}>
          {showAnswer ? `${current.meaning}\n(${current.toLang})` : `${current.word}\n(${current.fromLang})`}
        </Text>
        <Text style={styles.tapHint}>{showAnswer ? 'Tap to hide answer' : 'Tap to show answer'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={nextCard}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlashcardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  tapHint: {
    fontSize: 14,
    color: '#777',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    fontSize: 16,
    color: '#777',
  },
});
