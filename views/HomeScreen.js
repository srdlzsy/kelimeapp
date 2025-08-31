// views/HomeScreen.js
import React, { useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, StatusBar, 
  Animated, Easing, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // Animasyon değerleri
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleValue = new Animated.Value(0.8);

  // Buton animasyonları
  const scaleButton1 = new Animated.Value(1);
  const scaleButton2 = new Animated.Value(1);
  const scaleButton3 = new Animated.Value(1);
  const scaleButton4 = new Animated.Value(1);
  const scaleButton5 = new Animated.Value(1); // Grammar topics için

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient 
      colors={['#4CAF50', '#2E7D32', '#1B5E20']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      {/* Arka plan dekorasyonu */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {/* Başlık ve logo */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={40} color="white" />
          </View>
        </Animated.View>
        <Text style={styles.title}>Kelime Uygulaması</Text>
        <Text style={styles.subtitle}>Dil öğrenmek artık daha kolay</Text>
      </Animated.View>

      {/* Menü butonları */}
      <View style={styles.menuContainer}>
        <Animated.View style={{ transform: [{ scale: scaleButton1 }], opacity: fadeAnim, width: '100%' }}>
          <TouchableOpacity 
            style={[styles.menuButton, styles.buttonShadow]}
            onPress={() => navigation.navigate('WordList')}
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(scaleButton1)}
            onPressOut={() => handlePressOut(scaleButton1)}
          >
            <Ionicons name="list" size={24} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.menuButtonText}>Kelimeleri Görüntüle</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleButton2 }], opacity: fadeAnim, width: '100%' }}>
          <TouchableOpacity 
            style={[styles.menuButton, styles.buttonShadow]}
            onPress={() => navigation.navigate('AddWord')}
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(scaleButton2)}
            onPressOut={() => handlePressOut(scaleButton2)}
          >
            <Ionicons name="add-circle" size={24} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.menuButtonText}>Yeni Kelime Ekle</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleButton3 }], opacity: fadeAnim, width: '100%' }}>
          <TouchableOpacity 
            style={[styles.menuButton, styles.buttonShadow]}
            onPress={() => navigation.navigate('Quiz')}
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(scaleButton3)}
            onPressOut={() => handlePressOut(scaleButton3)}
          >
            <Ionicons name="help-circle" size={24} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.menuButtonText}>Kelime Quiz'i</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* <Animated.View style={{ transform: [{ scale: scaleButton4 }], opacity: fadeAnim, width: '100%' }}>
          <TouchableOpacity 
            style={[styles.menuButton, styles.buttonShadow]}
            onPress={() => navigation.navigate('GrammarList')}
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(scaleButton4)}
            onPressOut={() => handlePressOut(scaleButton4)}
          >
            <Ionicons name="school" size={24} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.menuButtonText}>Grammar Konuları</Text>
          </TouchableOpacity>
        </Animated.View> */}

        <Animated.View style={{ transform: [{ scale: scaleButton5 }], opacity: fadeAnim, width: '100%' }}>
          <TouchableOpacity 
            style={[styles.menuButton, styles.buttonShadow]}
            onPress={() => navigation.navigate('topics')}
            activeOpacity={0.9}
            onPressIn={() => handlePressIn(scaleButton5)}
            onPressOut={() => handlePressOut(scaleButton5)}
          >
            <Ionicons name="school" size={24} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.menuButtonText}>Grammar Konuları</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>© 2025 Tüm Hakları Saklıdır | Serdal Özsoy</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, overflow: 'hidden' },
  circle1: { position: 'absolute', width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35, backgroundColor: 'rgba(255, 255, 255, 0.1)', top: -width * 0.2, left: -width * 0.1 },
  circle2: { position: 'absolute', width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25, backgroundColor: 'rgba(255, 255, 255, 0.07)', bottom: -width * 0.15, right: -width * 0.1 },
  circle3: { position: 'absolute', width: width * 0.3, height: width * 0.3, borderRadius: width * 0.15, backgroundColor: 'rgba(255, 255, 255, 0.05)', top: height * 0.3, right: -width * 0.05 },
  header: { alignItems: 'center', marginBottom: 60 },
  logoContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.3)' },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8, textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  subtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' },
  menuContainer: { alignItems: 'center', width: '100%', marginBottom: 40 },
  menuButton: { backgroundColor: 'white', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginVertical: 12, width: '100%', flexDirection: 'row', justifyContent: 'center' },
  buttonShadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  buttonIcon: { marginRight: 10 },
  menuButtonText: { color: '#2E7D32', fontSize: 18, fontWeight: '600' },
  footer: { position: 'absolute', marginLeft: 20, bottom: 100, width: '100%', alignItems: 'center' },
  footerContainer: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  footerText: { color: 'white', fontSize: 14, fontWeight: '500' },
});

export default HomeScreen;
