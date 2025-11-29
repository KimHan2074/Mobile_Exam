import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Header from './Header';
import { AdminStackParamList } from './types';

const actions = [
  {
    key: 'users',
    title: 'Quản lý user',
    description: 'Xem, cập nhật vai trò, xóa user',
    icon: '👥',
    target: 'UserManagement' as const,
  },
  {
    key: 'categories',
    title: 'Quản lý loại sản phẩm',
    description: 'Xem, thêm, sửa, xóa loại',
    icon: '📂',
    target: 'CategoryManagement' as const,
  },
  {
    key: 'products',
    title: 'Quản lý sản phẩm',
    description: 'Xem, thêm, sửa, xóa sản phẩm',
    icon: '📦',
    target: 'ProductManagement' as const,
  },
  {
    key: 'orders',
    title: 'Quản lý đơn hàng',
    description: 'Xem và cập nhật trạng thái đơn hàng',
    icon: '📦',
    target: 'OrderManagement' as const,
  },
];

const AdminDashboard = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.card}>
        <Text style={styles.title}>🛡️ Trang chủ quản trị</Text>
        <Text style={styles.subtitle}>
          Chọn một chức năng quản trị bên dưới để bắt đầu làm việc.
        </Text>
      </View>

      <View style={styles.grid}>
        {actions.map(action => (
          <TouchableOpacity
            key={action.key}
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(action.target)}
          >
            <Text style={styles.icon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  grid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  icon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  actionDescription: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
});

export default AdminDashboard;

