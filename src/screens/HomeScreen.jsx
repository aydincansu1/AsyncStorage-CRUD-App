import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function HomeScreen() {
  // Kullanıcının girdiği görev
  const [gorev, setGorev] = useState('');
  // Görev listesi
  const [gorevler, setGorevler] = useState([]);

  // Bileşen ilk kez yüklendiğinde görevleri yükle
  useEffect(() => {
    gorevleriYukle();
  }, []);

  // Görev ekleme fonksiyonu
  const gorevEkle = async () => {
    try {
      // Kullanıcı bir görev girdi mi kontrol et
      if (gorev.trim()) {
        // Yeni bir görev oluştur ve mevcut görevler listesine ekle
        const yeniGorevler = [
          ...gorevler,
          {id: uuid.v4(), gorev: gorev.trim()}, // Her görev için benzersiz ID oluştur
        ];
        setGorevler(yeniGorevler); // Yeni görevler listesini state'e kaydet

        // Güncellenmiş görevler AsyncStorage'a kaydediliyor
        await AsyncStorage.setItem('gorevler', JSON.stringify(yeniGorevler));

        // Görev input alanını temizle
        setGorev('');
      }
    } catch (e) {
      // Görev eklenirken bir hata oluşursa, hata mesajını konsola yaz
      console.error('Görev eklenirken hata oluştu:', e);
    }
  };

  // Görevleri AsyncStorage'dan yükleme fonksiyonu
  const gorevleriYukle = async () => {
    try {
      // AsyncStorage'dan görevler verisini al
      const kayitliGorevler = await AsyncStorage.getItem('gorevler');
      if (kayitliGorevler) {
        // Veriyi JSON formatında çözümle ve state'e kaydet
        setGorevler(JSON.parse(kayitliGorevler));
      }
    } catch (e) {
      // Görevler yüklenirken bir hata oluşursa, hata mesajını konsola yaz
      console.error('Görevler yüklenirken hata oluştu:', e);
    }
  };

  // Görev silme fonksiyonu
  const gorevSil = async id => {
    try {
      // Belirli bir ID'ye sahip görev hariç tüm görevleri filtrele
      const yeniGorevler = gorevler.filter(gorev => gorev.id !== id);
      setGorevler(yeniGorevler); // Yeni görevler listesini state'e kaydet

      // Güncellenmiş görevler AsyncStorage'a kaydediliyor
      await AsyncStorage.setItem('gorevler', JSON.stringify(yeniGorevler));
    } catch (e) {
      // Görev silinirken bir hata oluşursa, hata mesajını konsola yaz
      console.error('Görev silinirken hata oluştu:', e);
    }
  };

  // Görev düzenleme fonksiyonu
  const gorevDuzenle = id => {
    const mevcutGorevler = gorevler.find(item => item.id === id);
    if (!mevcutGorevler) return;

    Alert.prompt(
      'Görevi Düzenle',
      'Görevi güncellemek için yeni metni girin',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Tamam',
          onPress: newUpdateText => {
            if (newUpdateText.trim()) {
              // Mevcut görev metnini güncelle
              const yeniGorevler = gorevler.map(item =>
                item.id === id ? {...item, gorev: newUpdateText.trim()} : item,
              );
              setGorevler(yeniGorevler); // Güncellenmiş görevler listesini state'e kaydet

              // Güncellenmiş görevleri AsyncStorage'a kaydet
              AsyncStorage.setItem('gorevler', JSON.stringify(yeniGorevler));
            }
          },
        },
      ],
      'plain-text',
      mevcutGorevler.gorev,
    );
  };

  // Görev silme onayı fonksiyonu
  const silOnayi = id => {
    Alert.alert(
      'Sil',
      'Bu görevi silmek istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: () => gorevSil(id), // Evet seçeneğine tıklanınca görevi sil
        },
      ],
      {cancelable: false},
    );
  };

  // Liste öğelerini render eden fonksiyon
  const renderItem = ({item}) => (
    <View style={styles.todoitem}>
      <Text style={styles.todo}>{item.gorev}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => silOnayi(item.id)}>
          <Text style={{color: '#ffffff'}}>Sil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => gorevDuzenle(item.id)}>
          <Text style={{color: '#ffffff'}}>Düzenle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}>Görev Listesi</Text>
        <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <TextInput
              value={gorev}
              onChangeText={text => setGorev(text)}
              placeholder="Bir Görev Ekle"
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={gorevEkle}>
              <Text style={{color: '#fff'}}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={gorevler}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
}

// Stil tanımları
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
  todoitem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: 'lightblue',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {},
  headerText: {
    marginVertical: 20,
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'orange',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'tomato',
    padding: 8,
    marginLeft: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: 'orange',
    padding: 8,
    marginLeft: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'tomato',
    padding: 8,
    marginLeft: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todo: {
    borderWidth: 1,
    width: '60%',
    padding: 10,
    borderRadius: 5,
    borderColor: 'grey',
  },
});
