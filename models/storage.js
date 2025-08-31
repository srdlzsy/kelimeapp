import AsyncStorage from '@react-native-async-storage/async-storage';
import grammarData from './grammar.json';

const STORAGE_KEY = 'GRAMMARS';

/**
 * Gramer verilerini AsyncStorage'a kaydet
 */
export const gramerVerileriniKaydet = async () => {
  try {
    const jsonValue = JSON.stringify(grammarData);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Gramer verileri başarıyla kaydedildi.');
  } catch (e) {
    console.error('Gramer verileri kaydedilemedi:', e);
  }
};

/**
 * Gramer verilerini AsyncStorage'dan yükle
 */
export const gramerVerileriniYukle = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      console.log('Gramer verileri yüklendi.');
      return data;
    } else {
      console.log('AsyncStorage\'da gramer verisi bulunamadı.');
      return null;
    }
  } catch (e) {
    console.error('Gramer verileri yüklenemedi:', e);
    return null;
  }
};
export const gramerVerileriniTemizle = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Gramer verileri temizlendi.');
  } catch (e) {
    console.error('Gramer verileri temizlenemedi:', e);
  }
}

/**
 * Gramer ünitelerini konu ve/veya zorluk seviyesine göre filtrele
 * @param {Object} veri - JSON verisi
 * @param {string} konuAnahtarKelimesi - Filtreleme için konu adı
 * @param {string} zorluk - Filtreleme için zorluk ('kolay', 'kolay-orta', 'orta', 'zor')
 */
export const gramerVerileriniFiltrele = (veri, konuAnahtarKelimesi = '', zorluk = '') => {
  if (!veri || veri.length === 0) return [];

  return veri.filter(unit => {
    const konuEslesiyor = konuAnahtarKelimesi
      ? unit.topic.toLowerCase().includes(konuAnahtarKelimesi.toLowerCase())
      : true;

    const zorlukEslesiyor = zorluk
      ? unit.difficulty.toLowerCase() === zorluk.toLowerCase()
      : true;

    return konuEslesiyor && zorlukEslesiyor;
  });
};
