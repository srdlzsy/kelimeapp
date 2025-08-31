import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Dimensions, 
  ScrollView, Alert, Animated, Easing, Modal 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getWords, getSeedWords } from '../models/Database';
import { useQuizViewModel } from '../viewmodels/QuizViewModel';

const { width, height } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
  const [userWords, setUserWords] = useState([]);
  const [seedWords, setSeedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [progressAnim] = useState(new Animated.Value(0)); // FIX: Separate animation for progress

  const {
    quizWords,
    currentQuestion,
    currentQuestionIndex,
    showAnswer,
    quizFinished,
    selectedAnswer,
    isCorrect,
    detailedScore,
    maxCombo,
    multipleChoiceOptions,
    wordSource,
    userWordCount,
    seedWordCount,
    startQuiz,
    handleAnswer,
    nextQuestion,
    switchWordSource,
    progress // This might be a string or non-numeric value
  } = useQuizViewModel(userWords, seedWords);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const [userData, seedData] = await Promise.all([
          getWords(),
          getSeedWords()
        ]);
        setUserWords(userData);
        setSeedWords(seedData);
        
        if (userData.length > 0 || seedData.length > 0) {
          setShowSourceModal(true);
        }
      } catch (err) {
        Alert.alert('Hata', 'Kelimeler yüklenirken bir sorun oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadWords();
  }, []);

  // Animasyon efekti
  useEffect(() => {
    if (!quizFinished) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestionIndex]);

  // FIX: Animate progress separately
  useEffect(() => {
    // Ensure progress is a number between 0 and 1
    const numericProgress = typeof progress === 'number' ? progress : 
                           (currentQuestionIndex + 1) / (quizWords.length || 1);
    
    Animated.timing(progressAnim, {
      toValue: numericProgress,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width animation doesn't support native driver
    }).start();
  }, [progress, currentQuestionIndex, quizWords.length]);

  const handleStartQuiz = (source, mode = 'multipleChoice') => {
    try {
      startQuiz(mode, source);
      setShowSourceModal(false);
      // FIX: Reset progress animation
      progressAnim.setValue(0);
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleOptionPress = (option) => {
    handleAnswer(option);
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const getOptionStyle = (option) => {
    if (selectedAnswer === option) {
      return isCorrect ? styles.correctOption : styles.incorrectOption;
    }
    
    if (selectedAnswer !== null && option === currentQuestion.meaning) {
      return styles.correctOption;
    }
    
    return styles.optionButton;
  };

  const getOptionIcon = (option) => {
    if (selectedAnswer === option) {
      return isCorrect ? 'check-circle' : 'cancel';
    }
    return null;
  };

  const getOptionIconColor = (option) => {
    if (selectedAnswer === option) {
      return isCorrect ? '#27AE60' : '#E74C3C';
    }
    return '#95A5A6';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  // Kaynak seçim modal'ı
  if (showSourceModal) {
    return (
      <Modal visible={true} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quiz Kaynağını Seçin</Text>
            
            <TouchableOpacity 
              style={[styles.sourceButton, userWordCount === 0 && styles.disabledButton]}
              onPress={() => handleStartQuiz('user')}
              disabled={userWordCount === 0}
            >
              <View style={styles.sourceButtonContent}>
                <Icon name="person" size={24} color={userWordCount === 0 ? '#999' : '#2E86C1'} />
                <View style={styles.sourceButtonTextContainer}>
                  <Text style={[styles.sourceButtonText, userWordCount === 0 && styles.disabledText]}>
                    Kendi Kelimelerim
                  </Text>
                  <Text style={styles.sourceButtonSubtext}>
                    {userWordCount} kelime
                  </Text>
                </View>
              </View>
              {userWordCount === 0 && (
                <Icon name="error" size={16} color="#E74C3C" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.sourceButton, seedWordCount === 0 && styles.disabledButton]}
              onPress={() => handleStartQuiz('seed')}
              disabled={seedWordCount === 0}
            >
              <View style={styles.sourceButtonContent}>
                <Icon name="collections" size={24} color={seedWordCount === 0 ? '#999' : '#27AE60'} />
                <View style={styles.sourceButtonTextContainer}>
                  <Text style={[styles.sourceButtonText, seedWordCount === 0 && styles.disabledText]}>
                    Örnek Kelimeler
                  </Text>
                  <Text style={styles.sourceButtonSubtext}>
                    {seedWordCount} kelime
                  </Text>
                </View>
              </View>
              {seedWordCount === 0 && (
                <Icon name="error" size={16} color="#E74C3C" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (userWordCount === 0 && seedWordCount === 0) {
    return (
      <View style={styles.container}>
        <Icon name="error-outline" size={48} color="#E74C3C" />
        <Text style={styles.emptyText}>Quiz için yeterli kelime bulunamadı</Text>
        <TouchableOpacity 
          style={[styles.button, styles.addButton]} 
          onPress={() => navigation.navigate('AddWord')}
        >
          <Icon name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Kelime Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.seedButton]} 
          onPress={() => navigation.navigate('WordList')}
        >
          <Icon name="collections" size={20} color="white" />
          <Text style={styles.buttonText}>Örnek Kelimeler Yükle</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quizFinished) {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Icon name="emoji-events" size={64} color="#F1C40F" />
          <Text style={styles.resultTitle}>Quiz Tamamlandı!</Text>
          <Text style={styles.resultScore}>Puan: {detailedScore}</Text>
          <Text style={styles.resultCombo}>Maksimum Combo: {maxCombo}x</Text>
          <Text style={styles.resultAccuracy}>
            Doğruluk: {Math.round((detailedScore / (quizWords.length * 10)) * 100)}%
          </Text>
          <Text style={styles.resultSource}>
            Kaynak: {wordSource === 'user' ? 'Kendi Kelimelerim' : 'Örnek Kelimeler'}
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.restartButton]}
            onPress={() => setShowSourceModal(true)}
          >
            <Icon name="refresh" size={20} color="white" />
            <Text style={styles.buttonText}>Tekrar Oyna</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Home')}
            >
            <Icon name="home" size={20} color="white" />
            <Text style={styles.buttonText}>Ana Sayfa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: progressAnim.interpolate({ // FIX: Use progressAnim instead of progress
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {quizWords.length}
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="star" size={16} color="#F1C40F" />
            <Text style={styles.statText}>{detailedScore}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="flash-on" size={16} color="#E74C3C" />
            <Text style={styles.statText}>{maxCombo}x</Text>
          </View>
          <TouchableOpacity 
            style={styles.sourceBadge}
            onPress={() => setShowSourceModal(true)}
          >
            <Icon 
              name={wordSource === 'user' ? 'person' : 'collections'} 
              size={14} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Soru Kartı */}
      <Animated.View 
        style={[
          styles.card,
          {
            opacity: animation,
            transform: [
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }
            ]
          }
        ]}
      >
        <Text style={styles.questionText}>{currentQuestion.word}</Text>
        <Text style={styles.questionPrompt}>Aşağıdakilerden hangisi anlamıdır?</Text>
        
        {/* Seçenekler */}
        <View style={styles.optionsContainer}>
          {multipleChoiceOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                getOptionStyle(option),
                selectedAnswer !== null && styles.optionDisabled
              ]}
              onPress={() => handleOptionPress(option)}
              disabled={selectedAnswer !== null}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{option}</Text>
                {getOptionIcon(option) && (
                  <Icon 
                    name={getOptionIcon(option)} 
                    size={20} 
                    color={getOptionIconColor(option)} 
                    style={styles.optionIcon}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Geri Bildirim */}
      {selectedAnswer && (
        <Animated.View 
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE',
              opacity: animation
            }
          ]}
        >
          <Icon 
            name={isCorrect ? 'check' : 'close'} 
            size={24} 
            color={isCorrect ? '#27AE60' : '#E74C3C'} 
          />
          <Text style={[
            styles.feedbackText,
            { color: isCorrect ? '#27AE60' : '#E74C3C' }
          ]}>
            {isCorrect ? 'Doğru!' : `Yanlış! Doğru cevap: ${currentQuestion.meaning}`}
          </Text>
        </Animated.View>
      )}

      {/* Sonraki Soru Butonu */}
      {selectedAnswer && (
        <TouchableOpacity 
          style={[styles.button, styles.nextButton]}
          onPress={nextQuestion}
        >
          <Icon name="navigate-next" size={24} color="white"/>
          <Text style={styles.buttonText}>
            {currentQuestionIndex === quizWords.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Styles remain the same...

// styles aynı şekilde kalabilir
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2C3E50' },
  sourceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: '#F8F9FA', marginBottom: 12, borderWidth: 2, borderColor: '#E9ECEF' },
  disabledButton: { opacity: 0.6 },
  sourceButtonContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  sourceButtonTextContainer: { marginLeft: 12 },
  sourceButtonText: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  disabledText: { color: '#999' },
  sourceButtonSubtext: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },
  cancelButton: { marginTop: 16, padding: 12, alignItems: 'center' },
  cancelButtonText: { color: '#E74C3C', fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  progressContainer: { flex: 1, marginRight: 16 },
  progressBackground: { height: 8, backgroundColor: '#E9ECEF', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: '#2E86C1', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#6C757D' },
  statsContainer: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  statText: { fontSize: 14, fontWeight: '600', marginLeft: 4, color: '#2C3E50' },
  sourceBadge: { backgroundColor: '#3498DB', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: width * 0.9, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, marginBottom: 20 },
  questionText: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 12, color: '#2C3E50' },
  questionPrompt: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#7F8C8D' },
  optionsContainer: { width: '100%' },
  optionButton: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#E9ECEF' },
  optionDisabled: { opacity: 0.7 },
  optionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionText: { fontSize: 16, color: '#2C3E50', flex: 1 },
  optionIcon: { marginLeft: 8 },
  correctOption: { backgroundColor: '#E8F5E9', borderColor: '#27AE60' },
  incorrectOption: { backgroundColor: '#FFEBEE', borderColor: '#E74C3C' },
  button: { width: '85%', alignSelf: 'center', paddingVertical: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  nextButton: { backgroundColor: '#4CAF50' },
  restartButton: { backgroundColor: '#3498DB', marginTop: 20 },
  homeButton: { backgroundColor: '#95A5A6' },
  addButton: { backgroundColor: '#27AE60' },
  seedButton: { backgroundColor: '#9B59B6' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  feedbackContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 16, alignSelf: 'center', width: '90%' },
  feedbackText: { fontSize: 16, fontWeight: '600', marginLeft: 8, flex: 1 },
  emptyText: { fontSize: 16, color: '#2C3E50', fontWeight: 'bold', textAlign: 'center', marginTop: 16, marginBottom: 20 },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginVertical: 16 },
  resultScore: { fontSize: 20, color: '#2C3E50', marginBottom: 8 },
  resultCombo: { fontSize: 18, color: '#7F8C8D', marginBottom: 8 },
  resultAccuracy: { fontSize: 18, color: '#7F8C8D', marginBottom: 8 },
  resultSource: { fontSize: 16, color: '#3498DB', marginBottom: 24, fontWeight: '500' },
});
