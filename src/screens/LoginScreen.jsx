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
import GoogleIcon from '../Icon/GoogleIcon';

export default function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Login function
  const handleLogin = async () => {
    if (username && password) {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      setPassword('');
      setUsername('');
      // If login is successful, navigate to Home
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Hi there!</Text>
        <Text style={styles.text}>Log in to start your first mission.</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          onFocus={() => setUsernameFocused(true)}
          onBlur={() => setUsernameFocused(false)}
          style={[
            styles.input,
            usernameFocused ? styles.inputFocused : styles.inputBlurred,
          ]}
          placeholder="Your email"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          style={[
            styles.input,
            passwordFocused ? styles.inputFocused : styles.inputBlurred,
          ]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonGoogle} onPress={handleLogin}>
          <GoogleIcon />
          <Text style={styles.buttonTextGoogle}>Log in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 235,
    alignItems: 'center',
    backgroundColor: '#ffff',
    gap: 42,
  },

  headerText: {
    color: '#232323',
    fontSize: 50,
    fontWeight: '800',
    fontFamily: 'Poppins',
    lineHeight: 50,
    textAlign: 'center',
    fontStyle: 'normal',
  },
  text: {
    color: '#232323',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 12,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  headerContainer: {
    gap: 16,
  },
  inputContainer: {
    width: 315,
    padding: 8,
    gap: 16,
  },

  input: {
    fontSize: 16,
    height: 42,
    fontWeight: '300',
    lineHeight: 16,
    fontFamily: 'Poppins',
    width: 300,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 11,
    borderWidth: 1,
    borderRadius: 5,
  },

  inputFocused: {
    borderColor: '#1976D2',
  },

  inputBlurred: {
    borderColor: '#CECECE',
  },

  buttonContainer: {
    width: 263,
    gap: 16,
  },

  button: {
    justifyContent: 'center',
    backgroundColor: '#232323',
    borderRadius: 30,
  },
  buttonText: {
    color: '#ffff',
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 108,
  },
  buttonTextGoogle: {
    color: '#232323',
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 12,
    paddingBottom: 12,
  },
  buttonGoogle: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#232323',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
