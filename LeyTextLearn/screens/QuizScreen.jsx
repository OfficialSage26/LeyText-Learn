import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizScreen = () => {
  const [words, setWords] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);

  useEffect(() => {
    const loadWords = async () => {
      const saved = await AsyncStorage.getItem('words');
      const list = saved ? JSON.parse(saved) : [];
      setWords(list);
    };

    loadWords();
  }, []);

  useEffect(() => {
    if (words.length >= 4) {
      generateQuestion();
    }
  }, [words]);

  const generateQuestion = () => {
    const correctWord = words[Math.floor(Math.random() * words.length)];

    // Get 3 random incorrect choices
    const wrongChoices = words
      .filter(w => w.meaning !== correctWord.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allChoices = [...wrongChoices, correctWord].sort(() => 0.5 - Math.random());

    setQuestion(correctWord);
    setChoices(allChoices);
    setSelected(null);
    setCorrect(null);
  };

  const checkAnswer = (choice) => {
    setSelected(choice);
    setCorrect(choice.meaning === question.meaning);
  };

  if (words.length < 4) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Add at least 4 words to use the quiz.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What does this mean?</Text>
      <Text style={styles.question}>{question?.word}</Text>
      {choices.map((choice, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.choice,
            selected && {
              backgroundColor:
                choice.meaning === question.meaning
                  ? '#2ecc71'
                  : choice === selected
                  ? '#e74c3c'
                  : '#f0f0f0',
            },
          ]}
          onPress={() => !selected && checkAnswer(choice)}
        >
          <Text style={styles.choiceText}>{choice.meaning}</Text>
        </TouchableOpacity>
      ))}

      {selected && (
        <TouchableOpacity style={styles.nextBtn} onPress={generateQuestion}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  choice: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 18,
    textAlign: 'center',
  },
  nextBtn: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
