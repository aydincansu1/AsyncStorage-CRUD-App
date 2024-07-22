import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Login fonksiyonu
  const handleLogin = async () => {
    if (username && password) {
      // Bu örnekte basit bir doğrulama yapılır, gerçek bir uygulamada bu işlemi sunucuda yapmalısınız
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);

      // Login başarılı ise yönlendirme yapılır
      navigation.navigate('Home');
    } else {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kullanıcı Girişi</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'orange',
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 40,
    color: 'orange',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
