import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordListScreen from './screens/WordListScreen';
import HomeScreen from './screens/HomeScreen';
import AddWordScreen from './screens/AddWordScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import QuizScreen from './screens/QuizScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Word List" component={WordListScreen} />
        <Stack.Screen name="Add Word" component={AddWordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
