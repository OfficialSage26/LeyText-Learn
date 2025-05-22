import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordListScreen = () => {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // Load saved words
  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    const saved = await AsyncStorage.getItem('words');
    const parsed = saved ? JSON.parse(saved) : [];
    setWords(parsed);
  };

  const saveWords = async (newWords) => {
    await AsyncStorage.setItem('words', JSON.stringify(newWords));
    setWords(newWords);
  };

  const handleSave = () => {
    if (!word || !meaning) return Alert.alert('Error', 'Fill in both fields.');

    let updatedWords = [...words];

    if (editingIndex !== null) {
      updatedWords[editingIndex] = { ...updatedWords[editingIndex], word, meaning };
    } else {
      updatedWords.push({
        word,
        meaning,
        fromLang: 'English',
        toLang: 'Waray-Waray',
      });
    }

    saveWords(updatedWords);
    setWord('');
    setMeaning('');
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    const selected = words[index];
    setWord(selected.word);
    setMeaning(selected.meaning);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    Alert.alert('Delete', 'Are you sure you want to delete this word?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const newWords = [...words];
          newWords.splice(index, 1);
          saveWords(newWords);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word List</Text>

      <TextInput
        style={styles.input}
        placeholder="Word"
        value={word}
        onChangeText={setWord}
      />
      <TextInput
        style={styles.input}
        placeholder="Meaning"
        value={meaning}
        onChangeText={setMeaning}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>{editingIndex !== null ? 'Update Word' : 'Add Word'}</Text>
      </TouchableOpacity>

      <FlatList
        data={words}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.wordItem}>
            <Text style={styles.wordText}>{item.word} ➜ {item.meaning}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default WordListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffbe6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  wordItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  wordText: {
    fontSize: 16,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  editBtn: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
  deleteBtn: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});
