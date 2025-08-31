import { useState, useEffect, useCallback } from 'react';
import * as db from '../models/Database';

export const useWordViewModel = () => {
  const [userWords, setUserWords] = useState([]);
  const [seedWords, setSeedWords] = useState([]);
  const [displayWords, setDisplayWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      setLoading(true);
      await db.initDatabase();
      await loadUserWords();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserWords = useCallback(async () => {
    try {
      const wordsFromDB = await db.getWords();
      setUserWords(wordsFromDB);
      updateCategories(wordsFromDB);
    } catch (error) {
      console.error('Error loading user words:', error);
    }
  }, []);

  const loadSeedWords = useCallback(async () => {
    try {
      const seeds = await db.addSeedWords();
      setSeedWords(seeds);
      setShowSeed(true);
      updateCategories(seeds);
    } catch (error) {
      console.error('Error loading seed words:', error);
      throw error;
    }
  }, []);

  const updateCategories = useCallback((wordsList) => {
    const uniqueCategories = ['all', ...new Set(wordsList.map(word => word.category || 'Genel'))];
    setCategories(uniqueCategories);
  }, []);

  const filterWords = useCallback(() => {
    let filtered = showSeed ? seedWords : userWords;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(word => word.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        word =>
          word.word.toLowerCase().includes(query) ||
          word.meaning.toLowerCase().includes(query)
      );
    }

    setDisplayWords(filtered);
  }, [userWords, seedWords, selectedCategory, searchQuery, showSeed]);

  useEffect(() => {
    filterWords();
  }, [filterWords]);

  const addNewWord = async (word, meaning, sentence, category) => {
    try {
      if (!word.trim() || !meaning.trim()) {
        throw new Error('Kelime ve anlam alanları zorunludur');
      }

      await db.addWord(word, meaning, sentence, category);
      await loadUserWords();
      setShowSeed(false);
      return true;
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  };

  const removeSeedWords = async () => {
    try {
      await db.removeAllSeedWords();
      setSeedWords([]);
      setShowSeed(false);
      await loadUserWords();
    } catch (error) {
      console.error('Error removing seed words:', error);
      throw error;
    }
  };

  const removeWord = async (id) => {
    try {
      await db.deleteWord(id);
      await loadUserWords();
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  };

  return {
    words: displayWords,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addNewWord,
    removeWord,
    loadUserWords,
    loadSeedWords,
    removeSeedWords,
    showSeed,
    loading
  };
};