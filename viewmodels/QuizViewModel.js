import { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const useQuizViewModel = (userWords = [], seedWords = []) => {
  const [quizWords, setQuizWords] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [quizMode, setQuizMode] = useState('multipleChoice');
  const [wordSource, setWordSource] = useState('user'); // 'user' veya 'seed'

  // Yeni state'ler
  const [detailedScore, setDetailedScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;

  // Kelime kaynağı değiştiğinde quiz kelimelerini güncelle
  useEffect(() => {
    const selectedWords = wordSource === 'user' ? userWords : seedWords;
    if (selectedWords && selectedWords.length > 0) {
      setQuizWords(shuffleArray(selectedWords));
    }
  }, [wordSource, userWords, seedWords]);

  useEffect(() => {
    if (quizWords.length > 0) {
      Animated.timing(progress, {
        toValue: (currentQuestionIndex + 1) / quizWords.length,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, quizWords.length]);

  // Mevcut kelimelerin sayısını kontrol et
  const getAvailableWordCount = (source) => {
    const words = source === 'user' ? userWords : seedWords;
    return words ? words.length : 0;
  };

  const startQuiz = (mode = 'multipleChoice', source = 'user') => {
    const selectedWords = source === 'user' ? userWords : seedWords;
    
    if (selectedWords.length === 0) {
      throw new Error(source === 'user' 
        ? 'Henüz kelime eklenmemiş' 
        : 'Örnek kelimeler yüklenmemiş');
    }

    if (mode === 'multipleChoice' && selectedWords.length < 4) {
      throw new Error('Çoktan seçmeli quiz için en az 4 kelime gerekli');
    }

    setWordSource(source);
    setQuizMode(mode);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizWords(shuffleArray(selectedWords));
    setDetailedScore(0);
    setCombo(0);
    setMaxCombo(0);
  };

  const handleAnswer = (answer) => {
    if (quizMode === 'multipleChoice') {
      setSelectedAnswer(answer);
      const correct = answer === currentQuestion.meaning;
      setIsCorrect(correct);

      if (correct) {
        setDetailedScore(prev => prev + 10);
        setCombo(prev => {
          const newCombo = prev + 1;
          if (newCombo > maxCombo) setMaxCombo(newCombo);
          return newCombo;
        });
      } else {
        setDetailedScore(prev => Math.max(0, prev - 5));
        setCombo(0);
      }

      setTimeout(nextQuestion, 500);
    } else {
      setShowAnswer(true);
    }
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (currentQuestionIndex < quizWords.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => startQuiz(quizMode, wordSource);

  const switchWordSource = (source) => {
    setWordSource(source);
    if (quizWords.length > 0) {
      startQuiz(quizMode, source);
    }
  };

  const currentQuestion = quizWords[currentQuestionIndex] || { word: '', meaning: '', sentence: '' };

  const getMultipleChoiceOptions = () => {
    if (!currentQuestion || quizWords.length < 4) return [currentQuestion.meaning];
    
    const correctAnswer = currentQuestion.meaning;
    const otherMeanings = shuffleArray(
      quizWords
        .filter(word => word.id !== currentQuestion.id) // ID'ye göre filtrele
        .map(w => w.meaning)
    ).slice(0, 3);
    
    return shuffleArray([correctAnswer, ...otherMeanings]);
  };

  // İlerleme yüzdesi
  const progressPercentage = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return {
    quizWords,
    currentQuestion,
    currentQuestionIndex,
    showAnswer,
    quizFinished,
    selectedAnswer,
    isCorrect,
    detailedScore,
    combo,
    maxCombo,
    quizMode,
    wordSource,
    userWordCount: userWords.length,
    seedWordCount: seedWords.length,
    multipleChoiceOptions: getMultipleChoiceOptions(),
    progress: progressPercentage,
    
    // Fonksiyonlar
    startQuiz,
    handleAnswer,
    nextQuestion,
    restartQuiz,
    setShowAnswer,
    setQuizMode,
    switchWordSource,
    getAvailableWordCount
  };
};