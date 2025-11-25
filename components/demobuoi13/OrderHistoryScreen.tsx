import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import { OrderWithItems, fetchOrdersByUser } from '../../database/database';
import { useUser } from './UserContext';

const OrderHistoryScreen = () => {
  const { currentUser } = useUser();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchOrdersByUser(currentUser.id);
      setOrders(data);
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          Vui lòng đăng nhập để xem lịch sử mua hàng.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Lịch sử mua hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Đơn #{item.id}</Text>
              <Text style={styles.orderStatus}>{item.status}</Text>
            </View>
            <Text style={styles.orderDate}>
              Ngày đặt: {new Date(item.createdAt).toLocaleString('vi-VN')}
            </Text>
            <Text style={styles.orderTotal}>
              Tổng tiền: {item.totalAmount.toLocaleString('vi-VN')} đ
            </Text>
            <View style={styles.itemsList}>
              {item.items.map(orderItem => (
                <Text key={orderItem.id} style={styles.orderItem}>
                  • {orderItem.name} × {orderItem.quantity}
                </Text>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.infoText}>Bạn chưa có đơn hàng nào.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  infoText: {
    color: '#475569',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontWeight: '700',
    color: '#0F172A',
  },
  orderStatus: {
    color: '#0EA5E9',
    textTransform: 'capitalize',
  },
  orderDate: {
    color: '#475569',
    marginBottom: 4,
  },
  orderTotal: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  itemsList: {
    marginTop: 4,
    gap: 4,
  },
  orderItem: {
    color: '#475569',
  },
});

export default OrderHistoryScreen;

