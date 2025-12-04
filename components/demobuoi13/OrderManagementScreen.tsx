import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchOrdersWithUser, updateOrderStatus } from '../../database/database';
import AdminBackButton from './AdminBackButton';
import Header from './Header';

const AdminOrdersScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null); // thêm state quản lý expand

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await fetchOrdersWithUser();
      setOrders(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openStatusModal = (orderId: number, current: string) => {
    setCurrentOrderId(orderId);
    setNewStatus(current);
    setStatusModalVisible(true);
  };

  const closeStatusModal = () => {
    setCurrentOrderId(null);
    setNewStatus('');
    setStatusModalVisible(false);
  };

  const handleUpdateStatus = async () => {
    if (currentOrderId === null) return;
    try {
      setUpdatingStatus(true);
      const success = await updateOrderStatus(currentOrderId, newStatus);
      if (success) {
        Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng.');
        await loadOrders();
        closeStatusModal();
      } else {
        Alert.alert('Thất bại', 'Không thể cập nhật trạng thái.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const toggleExpandOrder = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const isExpanded = expandedOrderId === item.id;
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
            <Text style={styles.orderUser}>
              {item.fullName || item.username} - {item.email}
            </Text>
            <Text style={styles.orderUser}>{item.phone}</Text>
            <Text style={styles.orderUser}>{item.address}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => openStatusModal(item.id, item.status)}
          >
            <Text style={styles.iconButtonText}>{item.status}</Text>
          </TouchableOpacity>
        </View>

        {/* Nút xem sản phẩm trong đơn */}
        <TouchableOpacity
          style={styles.expandRow}
          onPress={() => toggleExpandOrder(item.id)}
        >
          <Text style={styles.expandText}>
            {isExpanded ? 'Ẩn sản phẩm trong đơn' : 'Xem sản phẩm trong đơn'}
          </Text>
          <Text style={styles.expandIndicator}>{isExpanded ? '▴' : '▾'}</Text>
        </TouchableOpacity>

        {/* Hiển thị sản phẩm nếu expand */}
        {isExpanded && (
            <View style={styles.itemsSection}>
                {item.items && item.items.length > 0 ? (
                item.items.map((prod: any) => (
                    <View key={prod.orderItemId} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                        {prod.productName} x{prod.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>
                        {(prod.price * prod.quantity).toLocaleString('vi-VN')} đ
                    </Text>
                    </View>
                ))
                ) : (
                <Text style={styles.emptyItemsText}>Không có sản phẩm nào.</Text>
                )}
            </View>
        )}

        <Text style={styles.orderTotal}>
          Tổng: {(item.totalAmount || 0).toLocaleString('vi-VN')} đ
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <AdminBackButton />
      <Text style={styles.screenTitle}>🛒 Quản trị đơn hàng</Text>
      <Text style={styles.screenSubtitle}>
        Xem danh sách đơn hàng và cập nhật trạng thái.
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
              tintColor="#6366F1"
            />
          }
        />
      )}

      {/* Status Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeStatusModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật trạng thái đơn hàng</Text>
            <Picker
              selectedValue={newStatus}
              onValueChange={(value) => setNewStatus(value)}
              style={{ marginVertical: 12 }}
            >
              <Picker.Item label="pending" value="pending" />
              <Picker.Item label="processing" value="processing" />
              <Picker.Item label="shipped" value="shipped" />
              <Picker.Item label="completed" value="completed" />
              <Picker.Item label="cancelled" value="cancelled" />
            </Picker>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={closeStatusModal}
                disabled={updatingStatus}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleUpdateStatus}
                disabled={updatingStatus}
              >
                <Text style={styles.modalSaveText}>
                  {updatingStatus ? 'Đang lưu...' : 'Lưu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16, 
    paddingTop: 16 
  },
  screenTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#0F172A', 
    marginTop: 8 
  },
  screenSubtitle: { 
    color: '#475569', 
    marginBottom: 16 
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  orderHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  orderId: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0F172A' 
  },
  orderUser: { 
    color: '#64748B', 
    marginTop: 2 
  },
  orderTotal: { 
    marginTop: 8, 
    fontWeight: '600', 
    color: '#0EA5E9' 
  },
  iconButton: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 10, 
    backgroundColor: '#EEF2FF' 
  },
  iconButtonText: { 
    color: '#4F46E5', 
    fontWeight: '600' 
  },
  loadingContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    color: '#475569' 
  },
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.45)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24 
  },
  modalContent: { 
    width: '100%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0F172A', 
    marginBottom: 12 
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12 
  },
  modalCancel: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#CBD5F5' 
  },
  modalCancelText: { 
    color: '#475569', 
    fontWeight: '600' 
  },
  modalSave: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 10, 
    backgroundColor: '#4F46E5' 
  },
  modalSaveText: { 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
  expandRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  expandText: { 
    color: '#475569', 
    fontWeight: '500' 
  },
  expandIndicator: { 
    color: '#94A3B8' 
  },
  itemsSection: { 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingTop: 12 
  },
  itemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 4 
  },
  itemName: { 
    color: '#0F172A', 
    flexShrink: 1 
  },
  itemPrice: { 
    color: '#0EA5E9', 
    fontWeight: '600' 
  },
  emptyItemsText: { 
    color: '#94A3B8', 
    fontStyle: 'italic' 
  },
});

export default AdminOrdersScreen;

