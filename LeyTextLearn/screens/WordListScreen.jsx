import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const categories = ['All', 'Greetings', 'Food', 'Travel', 'Numbers', 'Market'];
const languageOptions = ['English', 'Tagalog', 'Bisaya', 'Waray-Waray'];

const WordListScreen = () => {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [category, setCategory] = useState('Greetings');
  const [filter, setFilter] = useState('All');
  const [editingIndex, setEditingIndex] = useState(null);
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Waray-Waray');

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
    if (!word || !meaning) {
      Alert.alert('Error', 'Please enter both word and meaning.');
      return;
    }

    let updatedWords = [...words];

    const newWord = {
      word,
      meaning,
      category,
      sourceLang,
      targetLang,
    };

    if (editingIndex !== null) {
      updatedWords[editingIndex] = newWord;
    } else {
      updatedWords.push(newWord);
    }

    saveWords(updatedWords);
    setWord('');
    setMeaning('');
    setCategory('Greetings');
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    const selected = words[index];
    setWord(selected.word);
    setMeaning(selected.meaning);
    setCategory(selected.category);
    setSourceLang(selected.sourceLang);
    setTargetLang(selected.targetLang);
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

  const filteredWords = words.filter(
    (w) =>
      (filter === 'All' || w.category === filter) &&
      w.sourceLang === sourceLang &&
      w.targetLang === targetLang
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LeyText Learn - Word List</Text>

      {/* Input Fields */}
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

      {/* Language Pickers */}
      <Text style={styles.label}>From (Source Language)</Text>
      <Picker
        selectedValue={sourceLang}
        style={styles.picker}
        onValueChange={setSourceLang}
      >
        {languageOptions.map((lang) => (
          <Picker.Item label={lang} value={lang} key={lang} />
        ))}
      </Picker>

      <Text style={styles.label}>To (Target Language)</Text>
      <Picker
        selectedValue={targetLang}
        style={styles.picker}
        onValueChange={setTargetLang}
      >
        {languageOptions.map((lang) => (
          <Picker.Item label={lang} value={lang} key={lang} />
        ))}
      </Picker>

      {/* Category Picker */}
      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={setCategory}
      >
        {categories.slice(1).map((cat) => (
          <Picker.Item label={cat} value={cat} key={cat} />
        ))}
      </Picker>

      {/* Add/Update Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>
          {editingIndex !== null ? 'Update Word' : 'Add Word'}
        </Text>
      </TouchableOpacity>

      {/* Filter by Category */}
      <Text style={styles.label}>Filter by Category</Text>
      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={setFilter}
      >
        {categories.map((cat) => (
          <Picker.Item label={cat} value={cat} key={cat} />
        ))}
      </Picker>

      {/* Word List */}
      <FlatList
        data={filteredWords}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.wordItem}>
            <Text style={styles.wordText}>
              {item.word} ➜ {item.meaning} ({item.category}) [{item.sourceLang} ➜ {item.targetLang}]
            </Text>
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
  container: { flex: 1, padding: 20, backgroundColor: '#fffbe6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  label: { fontWeight: 'bold', marginTop: 10 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  saveBtn: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontWeight: 'bold' },
  wordItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  wordText: { fontSize: 16, marginBottom: 6 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  editBtn: { color: '#2980b9', fontWeight: 'bold', marginRight: 15 },
  deleteBtn: { color: '#e74c3c', fontWeight: 'bold' },
});
