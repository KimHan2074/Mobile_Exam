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

import { addUser, initDatabase } from '../../database/database';
import { BottomTabParamList } from './AppTabs';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();

  const handleSignup = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      await initDatabase();
      const success = await addUser(trimmedUsername, trimmedPassword, 'user');
      if (success) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
        setUsername('');
        setPassword('');
        navigation.navigate('Login');
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại sau.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản mới</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Đăng ký</Text>
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
    backgroundColor: '#6366F1',
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

export default SignupScreen;

