import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FlashcardScreen = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      const saved = await AsyncStorage.getItem('words');
      const parsed = saved ? JSON.parse(saved) : [];
      setWords(parsed.filter(w => w.sourceLang === 'English' && w.targetLang === 'Waray-Waray'));
    };

    loadWords();
  }, []);

  const handleNext = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handleFlip = () => {
    setShowMeaning(!showMeaning);
  };

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No flashcards available. Please add words first.</Text>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <TouchableOpacity style={styles.card} onPress={handleFlip}>
        <Text style={styles.cardText}>
          {showMeaning ? currentWord.meaning : currentWord.word}
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        {showMeaning ? `Category: ${currentWord.category}` : 'Tap to see meaning'}
      </Text>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlashcardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffeaa7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  cardText: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  nextBtn: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  nextText: { color: 'white', fontWeight: 'bold' },
  note: { marginTop: 8, color: '#7f8c8d' },
});
