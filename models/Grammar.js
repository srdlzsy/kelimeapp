import AsyncStorage from '@react-native-async-storage/async-storage';
import grammarData from './grammar_starter_A1_C1.json';

const ANAHTAR = 'GRAMER';

/**
 * Gramer başlangıç paketini AsyncStorage'a kaydet
 */
export const gramerVerileriniKaydet = async () => {
  try {
    const jsonDegeri = JSON.stringify(grammarData);
    await AsyncStorage.setItem(ANAHTAR, jsonDegeri);
    console.log('Gramer verileri başarıyla kaydedildi.');
  } catch (e) {
    console.error('Gramer verileri kaydedilemedi:', e);
  }
};

/**
 * Gramer başlangıç paketini AsyncStorage'dan yükle
 */
export const gramerVerileriniYukle = async () => {
  
  try {
    const jsonDegeri = await AsyncStorage.getItem(ANAHTAR);

    if (jsonDegeri != null) {
      gramerVerileriniKaydet(); // Veriyi kaydet
      console.log('Gramer verileri yüklendi.');
      const veri = JSON.parse(jsonDegeri);
      return veri;
    } else {
      console.log('AsyncStorage\'da gramer verisi bulunamadı.');
      return null;
    }
  } catch (e) {
    console.error('Gramer verileri yüklenemedi:', e);
    return null;
  }
};

/**
 * Gramer ünitelerini konu anahtar kelimesi ve/veya zorluk seviyesine göre filtrele
 * @param {Object} veri - Yüklenen gramer verisi
 * @param {string} [konuAnahtarKelimesi] - Konu içinde aranacak anahtar kelime
 * @param {string} [zorluk] - 'kolay', 'orta', 'zor'
 */
export const gramerVerileriniFiltrele = (veri, konuAnahtarKelimesi = '', zorluk = '') => {
  if (!veri || !veri.units) return [];
  return veri.units.filter(unit => {
    const konuEslesiyor = konuAnahtarKelimesi ? unit.topic.toLowerCase().includes(konuAnahtarKelimesi.toLowerCase()) : true;
    const zorlukEslesiyor = zorluk ? unit.difficulty.toLowerCase() === zorluk.toLowerCase() : true;
    return konuEslesiyor && zorlukEslesiyor;
  });
};