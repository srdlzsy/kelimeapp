import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWordViewModel } from '../viewmodels/WordViewModel';

export default function AddWordScreen({ navigation }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [sentence, setSentence] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNewWord } = useWordViewModel(); // ✅ Hook'u buraya al

  const saveWord = async () => {
    if (isSubmitting) return;
    
    if (!word.trim()) {
      Alert.alert('Hata', 'Lütfen bir kelime giriniz');
      return;
    }
    
    if (!meaning.trim()) {
      Alert.alert('Hata', 'Lütfen kelimenin anlamını giriniz');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
     await addNewWord(word.trim(), meaning.trim(), sentence.trim(), category.trim());
      Alert.alert('Başarılı', 'Kelime başarıyla eklendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Kelime eklenirken hata:', error);
      Alert.alert('Hata', 'Kelime eklenirken bir sorun oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setWord('');
    setMeaning('');
    setSentence('');
    setCategory('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="title" size={20} color="#7E7E7E" style={styles.inputIcon} />
              <TextInput
                placeholder="Kelime *"
                placeholderTextColor="#9E9E9E"
                style={styles.input}
                value={word}
                onChangeText={setWord}
                returnKeyType="next"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="translate" size={20} color="#7E7E7E" style={styles.inputIcon} />
              <TextInput
                placeholder="Anlam *"
                placeholderTextColor="#9E9E9E"
                style={styles.input}
                value={meaning}
                onChangeText={setMeaning}
                returnKeyType="next"
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="short-text" size={20} color="#7E7E7E" style={styles.inputIcon} />
              <TextInput
                placeholder="Örnek cümle (opsiyonel)"
                placeholderTextColor="#9E9E9E"
                style={[styles.input, styles.multilineInput]}
                value={sentence}
                onChangeText={setSentence}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="category" size={20} color="#7E7E7E" style={styles.inputIcon} />
              <TextInput
                placeholder="Kategori (opsiyonel)"
                placeholderTextColor="#9E9E9E"
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                returnKeyType="done"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.clearButton]} 
                onPress={clearForm}
                disabled={isSubmitting}
              >
                <Icon name="clear" size={20} color="#E74C3C" />
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton, isSubmitting && styles.disabledButton]} 
                onPress={saveWord}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.buttonText}>Ekleniyor...</Text>
                ) : (
                  <>
                    <Icon name="check" size={20} color="white" />
                    <Text style={styles.buttonText}>Kaydet</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.requiredText}>* İşaretli alanlar zorunludur</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
  },
  saveButton: {
    backgroundColor: '#27AE60',
    flex: 1,
    marginLeft: 12,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#E74C3C',
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#E74C3C',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  requiredText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 8,
  },
});



