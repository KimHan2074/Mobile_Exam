import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Header from './Header';

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.card}>
        <Text style={styles.title}>🛡️ Trang chủ quản trị</Text>
        <Text style={styles.subtitle}>
          Vui lòng sử dụng các tính năng quản trị ở các tab hoặc menu liên quan.
        </Text>
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
});

export default AdminDashboard;

