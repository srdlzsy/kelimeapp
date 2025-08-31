import React, { useState } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTopicDetailViewModel } from '../viewmodels/TopicDetailViewModel';

export default function TopicDetailView({ route, navigation }) {
  const { id } = route.params;
  const { topic, loading } = useTopicDetailViewModel(id);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAnswer, setShowAnswer] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.loadingText}>Konu yükleniyor...</Text>
      </View>
    );
  }

  if (!topic) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#F44336" />
        <Text style={styles.errorText}>Konu bulunamadı</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleAnswer = (index) => {
    setShowAnswer(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const openExampleModal = (example) => {
    setSelectedExample(example);
    setModalVisible(true);
  };

  const renderOverview = () => (
    <View>
      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionText}>{topic.description_tr}</Text>
      </View>

      <Text style={styles.sectionTitle}>Kullanım Alanları</Text>
      {topic.usage && Object.entries(topic.usage).map(([key, value], idx) => (
        <View key={idx} style={styles.usageItem}>
          <Text style={styles.usageTitle}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
          {value.map((item, i) => (
            <View key={i} style={styles.usageExample}>
              <Text style={styles.usageEn}>{item.en}</Text>
              <Text style={styles.usageTr}>{item.tr}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Zaman İfadeleri</Text>
      <View style={styles.timeExpressions}>
        {topic.time_expressions && topic.time_expressions.map((expr, idx) => (
          <View key={idx} style={styles.timeExpressionPill}>
            <Text style={styles.timeExpressionText}>{expr}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderExamples = () => (
    <View>
      <Text style={styles.sectionTitle}>Örnek Cümleler</Text>
      {topic.examples && topic.examples.map((ex, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={styles.exampleCard}
          onPress={() => openExampleModal(ex)}
        >
          <View style={styles.exampleContent}>
            <Text style={styles.exampleEn}>{ex.en}</Text>
            <Text style={styles.exampleTr}>{ex.tr}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Mini Diyaloglar</Text>
      {topic.mini_dialogues && topic.mini_dialogues.map((dialog, idx) => (
        <View key={idx} style={styles.dialogCard}>
          <Text style={styles.dialogContext}>{dialog.context}</Text>
          {dialog.lines.map((line, i) => (
            <View key={i} style={styles.dialogLine}>
              <Text style={styles.dialogText}>{line.en}</Text>
              <Text style={styles.dialogTranslation}>{line.tr}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderPractice = () => (
    <View>
      <Text style={styles.sectionTitle}>Pratik Alıştırmalar</Text>
      {topic.practice && topic.practice.map((practice, idx) => (
        <View key={idx} style={styles.practiceCard}>
          <Text style={styles.practiceType}>{practice.type}</Text>
          <Text style={styles.practiceInstructions}>{practice.instructions_tr}</Text>
          
          {practice.items.map((item, i) => (
            <View key={i} style={styles.practiceItem}>
              <Text style={styles.practiceQuestion}>{item.q}</Text>
              <TouchableOpacity onPress={() => toggleAnswer(`${idx}-${i}`)}>
                <Text style={styles.showAnswerText}>
                  {showAnswer[`${idx}-${i}`] ? 'Cevabı Gizle' : 'Cevabı Göster'}
                </Text>
              </TouchableOpacity>
              {showAnswer[`${idx}-${i}`] && (
                <Text style={styles.practiceAnswer}>Cevap: {item.a}</Text>
              )}
            </View>
          ))}
        </View>
      ))}

      {topic.mini_test && (
        <View style={styles.testCard}>
          <Text style={styles.testTitle}>Mini Test</Text>
          <Text style={styles.testInstructions}>Aşağıdaki soruları cevaplayın:</Text>
          
          {topic.mini_test.questions.map((question, idx) => (
            <View key={idx} style={styles.testQuestion}>
              <Text style={styles.testQuestionText}>{question.q}</Text>
              <TouchableOpacity onPress={() => toggleAnswer(`test-${idx}`)}>
                <Text style={styles.showAnswerText}>
                  {showAnswer[`test-${idx}`] ? 'Cevabı Gizle' : 'Cevabı Göster'}
                </Text>
              </TouchableOpacity>
              {showAnswer[`test-${idx}`] && (
                <Text style={styles.testAnswer}>Cevap: {question.a}</Text>
              )}
            </View>
          ))}
          
          <Text style={styles.testNote}>{topic.mini_test.score_note_tr}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3F51B5" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{topic.topic}</Text>
          <View style={styles.topicMeta}>
            <View style={[styles.difficultyBadge, 
              { backgroundColor: topic.difficulty === 'kolay' ? '#4CAF50' : 
                               topic.difficulty === 'kolay-orta' ? '#FF9800' : '#F44336' }]}>
              <Text style={styles.difficultyText}>{topic.difficulty}</Text>
            </View>
            <Text style={styles.levelText}>{topic.level}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Genel Bakış
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'examples' && styles.activeTab]}
          onPress={() => setActiveTab('examples')}
        >
          <Text style={[styles.tabText, activeTab === 'examples' && styles.activeTabText]}>
            Örnekler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'practice' && styles.activeTab]}
          onPress={() => setActiveTab('practice')}
        >
          <Text style={[styles.tabText, activeTab === 'practice' && styles.activeTabText]}>
            Pratik
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // ALT NAV BAR İÇİN
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'examples' && renderExamples()}
        {activeTab === 'practice' && renderPractice()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Örnek Cümle</Text>
            {selectedExample && (
              <>
                <Text style={styles.modalEnglish}>{selectedExample.en}</Text>
                <Text style={styles.modalTurkish}>{selectedExample.tr}</Text>
              </>
            )}
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  levelText: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3F51B5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3F51B5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  descriptionCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3F51B5',
    marginBottom: 8,
  },
  usageExample: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  usageEn: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  usageTr: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  timeExpressions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeExpressionPill: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  timeExpressionText: {
    fontSize: 14,
    color: '#3F51B5',
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exampleContent: {
    flex: 1,
    marginRight: 12,
  },
  exampleEn: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  exampleTr: {
    fontSize: 14,
    color: '#666',
  },
  dialogCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dialogContext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3F51B5',
    marginBottom: 12,
  },
  dialogLine: {
    marginBottom: 8,
  },
  dialogText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  dialogTranslation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  practiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  practiceInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  practiceItem: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  practiceQuestion: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  showAnswerText: {
    fontSize: 14,
    color: '#3F51B5',
    fontWeight: '500',
    marginBottom: 8,
  },
  practiceAnswer: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '500',
  },
  testCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  testInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  testQuestion: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  testQuestionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  testAnswer: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '500',
  },
  testNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalEnglish: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTurkish: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#3F51B5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
