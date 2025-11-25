import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { BottomTabParamList } from './AppTabs';
import { useUser } from './UserContext';

const Header = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const { currentUser, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất khỏi tài khoản.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {currentUser ? `Xin chào, ${currentUser.username}` : 'Chưa đăng nhập'}
        </Text>
        <Text style={styles.subtitle}>
          {currentUser
            ? `Vai trò: ${currentUser.role}`
            : 'Hãy đăng nhập để mua hàng nhanh hơn'}
        </Text>
      </View>

      {currentUser ? (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    color: '#64748B',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EF4444',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default Header;

