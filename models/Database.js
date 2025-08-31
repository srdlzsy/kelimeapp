import AsyncStorage from '@react-native-async-storage/async-storage';
import seedWordsJson from './seedWords.json';

const USER_KEY = 'words';
const SEED_KEY = 'seedWords';

const ID_PREFIX = {
  USER: 'user-',
  SEED: 'seed-'
};

const safeJsonParse = (data) => {
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('JSON parse error:', error);
    return [];
  }
};

// Benzersiz ID üretme fonksiyonu
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Database başlat
export const initDatabase = async () => {
  try {
    const [existingUser, existingSeed] = await Promise.all([
      AsyncStorage.getItem(USER_KEY),
      AsyncStorage.getItem(SEED_KEY)
    ]);

    if (!existingUser) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify([]));
    }

    if (!existingSeed) {
      await AsyncStorage.setItem(SEED_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Seed kelimeleri ekle / getir
export const addSeedWords = async () => {
  try {
    const existingSeed = await AsyncStorage.getItem(SEED_KEY);
    let seeds = safeJsonParse(existingSeed);

    if (seeds.length === 0) {
      seeds = seedWordsJson.map(word => ({ 
        ...word, 
        id: `${ID_PREFIX.SEED}${word.id || generateUniqueId()}` 
      }));
      await AsyncStorage.setItem(SEED_KEY, JSON.stringify(seeds));
    }

    return seeds;
  } catch (error) {
    console.error('Error adding seed words:', error);
    throw error;
  }
};

// Kullanıcı kelimesi ekle
export const addWord = async (word, meaning, sentence, category) => {
  try {
    const existing = await AsyncStorage.getItem(USER_KEY);
    const words = safeJsonParse(existing);

    const newWord = {
      id: generateUniqueId(), // Benzersiz ID kullan
      word: word.trim(),
      meaning: meaning.trim(),
      sentence: sentence?.trim() || '',
      category: category?.trim() || 'Genel',
      createdAt: Date.now(),
    };

    words.push(newWord);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(words));
    return { ...newWord, id: `${ID_PREFIX.USER}${newWord.id}` };
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Diğer fonksiyonlar aynı kalabilir...
export const getSeedWords = async () => {
  try {
    const existingSeed = await AsyncStorage.getItem(SEED_KEY);
    return safeJsonParse(existingSeed);
  } catch (error) {
    console.error('Error getting seed words:', error);
    throw error;
  }
};

export const removeAllSeedWords = async () => {
  try {
    await AsyncStorage.setItem(SEED_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error deleting seed words:', error);
    throw error;
  }
};

export const getWords = async () => {
  try {
    const existing = await AsyncStorage.getItem(USER_KEY);
    const words = safeJsonParse(existing);
    return words.map(w => ({ ...w, id: `${ID_PREFIX.USER}${w.id}` }));
  } catch (error) {
    console.error('Error getting user words:', error);
    throw error;
  }
};

export const deleteWord = async (id) => {
  try {
    const existing = await AsyncStorage.getItem(USER_KEY);
    const words = safeJsonParse(existing);
    const numericId = id.toString().replace(ID_PREFIX.USER, '');
    const filtered = words.filter(w => w.id.toString() !== numericId);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

export const removeAllWords = async () => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error deleting all user words:', error);
    throw error;
  }
};