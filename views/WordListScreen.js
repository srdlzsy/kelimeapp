import React, { useState, useEffect, memo, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Modal, TouchableWithoutFeedback, Keyboard, Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useWordViewModel } from '../viewmodels/WordViewModel';

const WordItem = memo(({ item, onDelete }) => (
  <View style={styles.item}>
    <View style={styles.wordInfo}>
      <Text style={styles.word}>{item.word}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
      {item.sentence && <Text style={styles.sentence}>"{item.sentence}"</Text>}
      {item.category && (
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      )}
    </View>
    <TouchableOpacity
      onPress={() => onDelete(item)}
      style={styles.deleteButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Feather name="trash-2" size={20} color="#999" />
    </TouchableOpacity>
  </View>
));

export default function WordListScreen({ navigation }) {
  const {
    words,
    searchQuery,
    setSearchQuery,
    removeWord,
    loadUserWords,
    loadSeedWords,
    removeSeedWords,
    showSeed,
    loading
  } = useWordViewModel();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [wordToDelete, setWordToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const confirmDelete = useCallback((word) => {
    setWordToDelete(word);
    setDeleteModalVisible(true);
  }, []);

  const handleDelete = async () => {
    if (!wordToDelete) return;
    try {
      await removeWord(wordToDelete.id);
      Alert.alert('Başarılı', `"${wordToDelete.word}" silindi.`);
    } catch (error) {
      console.error('Kelime silinirken hata:', error);
      Alert.alert('Hata', 'Kelime silinirken bir sorun oluştu.');
    } finally {
      setDeleteModalVisible(false);
      setWordToDelete(null);
    }
  };

  const handleSeedData = async () => {
    try {
      await loadSeedWords();
      Alert.alert('Başarılı', 'Örnek kelimeler gösteriliyor.');
    } catch (error) {
      console.error('Seed yüklenirken hata:', error);
      Alert.alert('Hata', 'Örnek kelimeler yüklenirken bir sorun oluştu.');
    }
  };

  const handleRemoveSeedData = async () => {
    try {
      await removeSeedWords();
      Alert.alert('Başarılı', 'Örnek kelimeler kaldırıldı.');
    } catch (error) {
      console.error('Seed kaldırılırken hata:', error);
      Alert.alert('Hata', 'Örnek kelimeler kaldırılırken bir sorun oluştu.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadUserWords();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadUserWords]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUserWords);
    return unsubscribe;
  }, [navigation, loadUserWords]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3d5afe" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.seedButtonsContainer}>
        <TouchableOpacity
          style={[styles.seedButton, showSeed && styles.seedButtonActive]}
          onPress={showSeed ? handleRemoveSeedData : handleSeedData}
        >
          <Text style={[styles.seedButtonText, showSeed && styles.seedButtonTextActive]}>
            {showSeed ? 'Örnekleri Kaldır' : 'Örnek Kelimeler Yükle'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Arama */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Kelime veya anlam ara..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Kelimeler */}
          {words.length > 0 ? (
        <FlatList
  data={words}
  keyExtractor={(item) => item.id} // Sadece id'yi kullan
  renderItem={({ item }) => (
    <WordItem item={item} onDelete={confirmDelete} />
  )}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  refreshing={refreshing}
  onRefresh={onRefresh}
/>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="book-open" size={60} color="#ddd" />
              <Text style={styles.emptyStateText}>
                {showSeed ? 'Örnek kelime bulunamadı' : 'Henüz kelime eklenmemiş.'}
              </Text>
              {!showSeed && (
                <TouchableOpacity
                  style={styles.addFirstWordButton}
                  onPress={() => navigation.navigate('AddWord')}
                >
                  <Text style={styles.addFirstWordText}>İlk Kelimeni Ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Silme Modal */}
          <Modal
            animationType="fade"
            transparent
            visible={deleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalIcon}>
                  <Feather name="alert-triangle" size={40} color="#e53935" />
                </View>
                <Text style={styles.modalTitle}>Emin misiniz?</Text>
                <Text style={styles.modalMessage}>
                  "{wordToDelete?.word}" kelimesini silmek istediğinize emin misiniz?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleDelete}
                  >
                    <Text style={styles.confirmButtonText}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666' },
  seedButtonsContainer: { paddingHorizontal: 16, marginBottom: 12 },
  seedButton: { 
    backgroundColor: 'transparent', 
    borderRadius: 12, 
    padding: 12,
    borderWidth: 1, 
    borderColor: '#3d5afe',
    alignItems: 'center'
  },
  seedButtonActive: {
    backgroundColor: '#3d5afe'
  },
  seedButtonText: { 
    color: '#3d5afe', 
    fontWeight: '600', 
    fontSize: 14 
  },
  seedButtonTextActive: {
    color: 'white'
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    marginHorizontal: 16, 
    marginBottom: 16, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    height: 50, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 2 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 16, 
    marginVertical: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 1 
  },
  wordInfo: { flex: 1, marginRight: 12 },
  word: { fontSize: 18, fontWeight: '600', color: '#212121', marginBottom: 4 },
  meaning: { fontSize: 15, color: '#424242', marginBottom: 6, lineHeight: 20 },
  sentence: { fontStyle: 'italic', color: '#666', marginBottom: 8, lineHeight: 20 },
  categoryTag: { alignSelf: 'flex-start', backgroundColor: '#f0f5ff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { fontSize: 12, color: '#3d5afe', fontWeight: '500' },
  deleteButton: { padding: 4 },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyStateText: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center', 
    marginTop: 16, 
    marginBottom: 16 
  },
  addFirstWordButton: {
    backgroundColor: '#3d5afe',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  addFirstWordText: {
    color: 'white',
    fontWeight: '600'
  },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '80%', maxWidth: 320, alignItems: 'center' },
  modalIcon: { marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' },
  modalMessage: { fontSize: 15, textAlign: 'center', marginBottom: 24, color: '#666', lineHeight: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22, minWidth: 100, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f0f0f0' },
  confirmButton: { backgroundColor: '#e53935' },
  cancelButtonText: { color: '#555', fontWeight: '600' },
  confirmButtonText: { color: 'white', fontWeight: '600' },
});