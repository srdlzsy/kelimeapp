// App.js
import React, { useEffect, useState } from 'react';
import { View, StatusBar, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './views/HomeScreen';
import WordListScreen from './views/WordListScreen';
import AddWordScreen from './views/AddWordScreen';
import QuizScreen from './views/QuizScreen';
import { initDatabase } from './models/Database';
import GrammarListesiScreen from './views/GrammarListesiScreen';
import TopicListView from './views/TopicListView';
import TopicDetailView from './views/TopicDetailView';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDatabase();
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };
    initializeApp();
  }, []);

  if (!isDbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={styles.loadingText}>Kelime Defteri Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#2E86C1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Kelime Uygulaması', headerShown: false }}
        />
        <Stack.Screen
          name="WordList"
          component={WordListScreen}
          options={{ title: 'Kelimeler' }}
        />
        <Stack.Screen
          name="AddWord"
          component={AddWordScreen}
          options={{ title: 'Yeni Kelime Ekle' }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: 'Kelime Quiz' }}
        />
        <Stack.Screen
          name="topics"
          component={TopicListView}
          options={{ title: 'Grammar Konuları' }}
        />
        <Stack.Screen
          name="GrammarList"
          component={GrammarListesiScreen}
          options={{ title: 'Grammar Konuları' }}
        />
      <Stack.Screen name="TopicDetailView" component={TopicDetailView} options={{ title: 'Konu Detayı' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '600',
  },
});
