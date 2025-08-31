import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useGrammarViewModel } from '../viewmodels/GrammarViewModel';

const GrammarListScreen = () => {
  const { gramerUniteleri, yukleniyor, uniteleriFiltrele } = useGrammarViewModel();
  const [arama, setArama] = useState('');
  const [zorluk, setZorluk] = useState('');

  const aramaYap = (metin) => {
    setArama(metin);
    uniteleriFiltrele(metin, zorluk);
  };

  const zorlukSec = (seviye) => {
    setZorluk(seviye);
    uniteleriFiltrele(arama, seviye);
  };

  const ogeyiRenderla = ({ item }) => (
    <View style={stiller.kart}>
      <Text style={stiller.baslik}>{item.topic} ({item.level} - {item.difficulty})</Text>
      <Text style={stiller.aciklamaEN}>{item.description_en}</Text>
      <Text style={stiller.aciklamaTR}>{item.description_tr}</Text>
      {item.examples?.map((ornek, indeks) => (
        <Text key={indeks} style={stiller.ornek}>EN: {ornek.en} | TR: {ornek.tr}</Text>
      ))}
    </View>
  );

  if (yukleniyor) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={stiller.konteyner}>
      <TextInput
        style={stiller.girdi}
        placeholder="Konu ara..."
        value={arama}
        onChangeText={aramaYap}
      />
      <View style={stiller.filtreKonteyneri}>
        <TouchableOpacity style={stiller.dugme} onPress={() => zorlukSec('kolay')}>
          <Text>Kolay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stiller.dugme} onPress={() => zorlukSec('orta')}>
          <Text>Orta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stiller.dugme} onPress={() => zorlukSec('zor')}>
          <Text>Zor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stiller.dugme} onPress={() => zorlukSec('')}>
          <Text>Hepsi</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={gramerUniteleri}
        keyExtractor={(item) => item.id.toString()}
        renderItem={ogeyiRenderla}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const stiller = StyleSheet.create({
  konteyner: { flex: 1, padding: 10, backgroundColor: '#fff' },
  girdi: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  filtreKonteyneri: { flexDirection: 'row', marginBottom: 10, justifyContent: 'space-around' },
  dugme: { padding: 8, backgroundColor: '#eee', borderRadius: 6 },
  kart: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fafafa' },
  baslik: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  aciklamaEN: { fontStyle: 'italic', color: '#333' },
  aciklamaTR: { color: '#555', marginBottom: 5 },
  ornek: { marginLeft: 5, color: '#666' }
});

export default GrammarListScreen;