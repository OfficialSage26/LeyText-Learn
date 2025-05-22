import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LeyText Learn</Text>
      <Text style={styles.subtitle}>Learn Tagalog, English, Bisaya, and Waray-Waray</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Flashcards"
          onPress={() => navigation.navigate('Flashcards')}
        />
        <Button
          title="Take a Quiz"
          onPress={() => navigation.navigate('Quiz')}
        />
        <Button
          title="My Word List"
          onPress={() => navigation.navigate('Word List')}
        />
        <Button
          title="Add New Word"
          onPress={() => navigation.navigate('Add Word')}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
});
