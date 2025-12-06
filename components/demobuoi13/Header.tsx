import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';

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
  const route = useRoute<RouteProp<BottomTabParamList>>();
  const { currentUser, logout } = useUser();
  const showActions = currentUser && route.name === 'Home';

  const handleLogout = async () => {
    await logout();
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất khỏi tài khoản.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.wrapper}>
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

      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserHome', { screen: 'Cart' })}
          >
            <Text style={styles.actionText}>🛒 Giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('UserHome', { screen: 'OrderHistory' })
            }
          >
            <Text style={styles.actionText}>📦 Đơn hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserHome', { screen: 'Profile' })}
          >
            <Text style={styles.actionText}>👤 Hồ sơ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
  },
  actionText: {
    color: '#4338CA',
    fontWeight: '600',
  },
});

export default Header;

