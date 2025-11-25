import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { getUserByCredentials, initDatabase } from '../../database/database';
import { BottomTabParamList } from './AppTabs';
import { useUser } from './UserContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const { setCurrentUser } = useUser();

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      await initDatabase();
      const user = await getUserByCredentials(trimmedUsername, trimmedPassword);
      if (user) {
        await setCurrentUser(user);
        Alert.alert('Đăng nhập thành công', `Xin chào ${user.username}!`);
        navigation.navigate('HomeTab');
      } else {
        Alert.alert('Thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại sau.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#0F172A',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default LoginScreen;

