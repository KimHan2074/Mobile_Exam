import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CartItemWithProduct,
  createOrderFromCart,
  fetchCartItems,
  getUserProfile,
  upsertUserProfile,
} from '../../database/database';
import { useUser } from './UserContext';
import { HomeStackParamList } from './types';

const CheckoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { currentUser } = useUser();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [cartItems, profile] = await Promise.all([
        fetchCartItems(currentUser.id),
        getUserProfile(currentUser.id),
      ]);
      setItems(cartItems);
      setShippingName(profile?.fullName || currentUser.username);
      setShippingPhone(profile?.phone || '');
      setShippingAddress(profile?.address || '');
    } catch (error) {
      console.error('Checkout load error:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu thanh toán.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để đặt hàng.');
      return;
    }
    if (!items.length) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
      return;
    }
    if (!shippingName.trim() || !shippingPhone.trim() || !shippingAddress.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ.');
      return;
    }
    try {
      setSaving(true);
      await upsertUserProfile({
        userId: currentUser.id,
        fullName: shippingName.trim(),
        phone: shippingPhone.trim(),
        address: shippingAddress.trim(),
      });
      await createOrderFromCart(
        currentUser.id,
        shippingName.trim(),
        shippingPhone.trim(),
        shippingAddress.trim(),
      );
      Alert.alert('Thành công', 'Đơn hàng của bạn đã được tạo.', [
        {
          text: 'Xem đơn hàng',
          onPress: () => navigation.navigate('OrderHistory'),
        },
      ]);
    } catch (error) {
      console.error('Place order error:', error);
      Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          Vui lòng đăng nhập để tiếp tục thanh toán.
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧾 Thanh toán</Text>
      <Text style={styles.sectionTitle}>1. Thông tin giao hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={shippingName}
        onChangeText={setShippingName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={shippingPhone}
        onChangeText={setShippingPhone}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Địa chỉ giao hàng"
        value={shippingAddress}
        onChangeText={setShippingAddress}
        multiline
      />

      <Text style={styles.sectionTitle}>2. Đơn hàng của bạn</Text>
      {items.length === 0 ? (
        <Text style={styles.infoText}>Giỏ hàng đang trống.</Text>
      ) : (
        items.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderItemName}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.orderItemPrice}>
              {(item.price * item.quantity).toLocaleString('vi-VN')} đ
            </Text>
          </View>
        ))
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>{total.toLocaleString('vi-VN')} đ</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, (saving || !items.length) && styles.disabledButton]}
        disabled={saving || !items.length}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.primaryText}>
          {saving ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoText: {
    color: '#475569',
    textAlign: 'center',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderItemName: {
    flex: 1,
    marginRight: 12,
    color: '#0F172A',
  },
  orderItemPrice: {
    color: '#0EA5E9',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  primaryButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CBD5F5',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CheckoutScreen;

