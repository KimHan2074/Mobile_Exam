import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CartItemWithProduct,
  fetchCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from '../../database/database';
import { useUser } from './UserContext';
import { HomeStackParamList } from './types';

const CartScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { currentUser } = useUser();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCart = useCallback(async () => {
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const data = await fetchCartItems(currentUser.id);
      setItems(data);
    } catch (error) {
      console.error('Load cart error:', error);
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser, refreshing]);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart]),
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handleChangeQuantity = async (
    item: CartItemWithProduct,
    delta: number,
  ) => {
    if (!currentUser) return;
    const next = item.quantity + delta;
    if (next <= 0) {
      await removeCartItem(currentUser.id, item.productId);
    } else {
      await updateCartItemQuantity(currentUser.id, item.productId, next);
    }
    loadCart();
  };

  const handleRemove = async (item: CartItemWithProduct) => {
    if (!currentUser) return;
    await removeCartItem(currentUser.id, item.productId);
    loadCart();
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://') || img.startsWith('http')) {
      return { uri: img };
    }
    switch (img) {
      case 'aothun.jpg':
        return require('../../assets/images/Doreamon/aothun.jpg');
      case 'shoesDRM.jpg':
        return require('../../assets/images/Doreamon/shoesDRM.jpg');
      case 'balo.jpg':
        return require('../../assets/images/Doreamon/balo.jpg');
      case 'hat.jpg':
        return require('../../assets/images/Doreamon/hat.jpg');
      case 'tui.jpg':
        return require('../../assets/images/Doreamon/tui.jpg');
      default:
        return require('../../assets/images/Doreamon/aothun.jpg');
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          Vui lòng đăng nhập để quản lý giỏ hàng của bạn.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={getImageSource(item.img)} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    {(item.price || 0).toLocaleString('vi-VN')} đ
                  </Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => handleChangeQuantity(item, -1)}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => handleChangeQuantity(item, 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item)}
                >
                  <Text style={styles.removeButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadCart();
                }}
                tintColor="#6366F1"
              />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.infoText}>Giỏ hàng của bạn đang trống.</Text>
              </View>
            }
          />
          <View style={styles.summary}>
            <View>
              <Text style={styles.summaryLabel}>Tổng cộng</Text>
              <Text style={styles.summaryValue}>
                {total.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <View style={styles.summaryActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.secondaryText}>Tiếp tục mua</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  items.length === 0 && styles.disabledButton,
                ]}
                disabled={items.length === 0}
                onPress={() => navigation.navigate('Checkout')}
              >
                <Text style={styles.primaryText}>Đặt hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,               
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,           
  },
  infoText: {
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 16,      
    fontSize: 13,               
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,           
    padding: 10,                
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,           
    alignItems: 'center',
    gap: 10,
  },

  image: {
    width: 58,                  
    height: 58,                 
    borderRadius: 10,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 14,                
    fontWeight: '700',
    color: '#0F172A',
  },

  price: {
    color: '#0EA5E9',
    marginTop: 3,               
    fontWeight: '600',
    fontSize: 13,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,               
    gap: 6,
  },

  qtyButton: {
    width: 24,                 
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyButtonText: {
    color: '#4338CA',
    fontSize: 16,              
    fontWeight: '700',
  },

  quantity: {
    minWidth: 26,              
    textAlign: 'center',
    fontWeight: '700',
    color: '#0F172A',
    fontSize: 14,
  },

  removeButton: {
    paddingVertical: 4,       
    paddingHorizontal: 10,     
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
  },

  removeButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 12,              
  },

  summary: {
    marginTop: 6,               
    padding: 12,                
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  summaryLabel: {
    color: '#475569',
    fontSize: 13,
  },

  summaryValue: {
    fontSize: 18,               
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },

  summaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,                    
    marginTop: 14,              
  },

  secondaryButton: {
    flex: 1,
    paddingVertical: 10,        
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    alignItems: 'center',
  },

  secondaryText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,               
  },

  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#CBD5F5',
  },

  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CartScreen;

