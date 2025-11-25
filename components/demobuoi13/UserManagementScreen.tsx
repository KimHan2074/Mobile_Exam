import React, { useEffect, useMemo, useState } from 'react';
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

import {
    User,
    deleteUser,
    fetchUsers,
    initDatabase,
    updateUser,
} from '../../database/database';
import AdminBackButton from './AdminBackButton';
import Header from './Header';
import { useUser } from './UserContext';

const roleOptions: Array<{ value: string; label: string }> = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'user', label: 'Người dùng' },
];

const UserManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [roleModalUser, setRoleModalUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      await initDatabase();
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Load users error:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openRoleModal = (user: User) => {
    setRoleModalUser(user);
  };

  const closeRoleModal = () => setRoleModalUser(null);

  const handleUpdateRole = async (role: string) => {
    if (!roleModalUser) return;
    if (roleModalUser.role === role) {
      closeRoleModal();
      return;
    }
    try {
      setSaving(true);
      const success = await updateUser({ ...roleModalUser, role });
      if (success) {
        setUsers(prev =>
          prev.map(u => (u.id === roleModalUser.id ? { ...u, role } : u)),
        );
        Alert.alert('Thành công', 'Đã cập nhật vai trò người dùng.');
      } else {
        Alert.alert('Thất bại', 'Cập nhật vai trò không thành công.');
      }
    } catch (error) {
      console.error('Update role error:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật vai trò.');
    } finally {
      setSaving(false);
      closeRoleModal();
    }
  };

  const confirmDeleteUser = (user: User) => {
    if (currentUser && currentUser.id === user.id) {
      Alert.alert('Không thể xóa', 'Bạn không thể tự xóa tài khoản của chính mình.');
      return;
    }
    Alert.alert(
      'Xóa người dùng',
      `Bạn có chắc chắn muốn xóa tài khoản "${user.username}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => handleDeleteUser(user.id),
        },
      ],
    );
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setSaving(true);
      const success = await deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        Alert.alert('Thành công', 'Đã xóa người dùng.');
      } else {
        Alert.alert('Thất bại', 'Không thể xóa người dùng.');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      Alert.alert('Lỗi', 'Không thể xóa người dùng.');
    } finally {
      setSaving(false);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isCurrentUser = currentUser?.id === item.id;
    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.userMeta}>
            ID: {item.id} • Vai trò: {item.role}
          </Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => openRoleModal(item)}
          >
            <Text style={styles.roleButtonText}>Cập nhật vai trò</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              isCurrentUser && styles.deleteButtonDisabled,
            ]}
            disabled={isCurrentUser}
            onPress={() => confirmDeleteUser(item)}
          >
            <Text style={styles.deleteButtonText}>
              {isCurrentUser ? 'Đang sử dụng' : 'Xóa'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const emptyListComponent = useMemo(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Chưa có người dùng nào.</Text>
        <Text style={styles.emptySubtitle}>
          Người dùng sẽ xuất hiện khi có tài khoản được tạo.
        </Text>
      </View>
    );
  }, [loading]);

  return (
    <View style={styles.container}>
      <Header />
      <AdminBackButton />
      <Text style={styles.screenTitle}>👥 Quản trị user</Text>
      <Text style={styles.screenSubtitle}>
        Theo dõi, cập nhật vai trò và xóa tài khoản người dùng.
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Đang tải danh sách người dùng...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          renderItem={renderUserItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadUsers();
              }}
              tintColor="#6366F1"
            />
          }
          ListEmptyComponent={emptyListComponent}
        />
      )}

      <Modal
        visible={!!roleModalUser}
        transparent
        animationType="fade"
        onRequestClose={closeRoleModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn vai trò mới</Text>
            <Text style={styles.modalSubtitle}>
              {roleModalUser ? `Tài khoản: ${roleModalUser.username}` : ''}
            </Text>
            {roleOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.roleOption,
                  roleModalUser?.role === option.value && styles.roleOptionActive,
                ]}
                onPress={() => handleUpdateRole(option.value)}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    roleModalUser?.role === option.value &&
                      styles.roleOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeRoleModal}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
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
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  screenSubtitle: {
    color: '#475569',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  userMeta: {
    color: '#475569',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  deleteButton: {
    width: 90,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  deleteButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    marginTop: 12,
    color: '#475569',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    color: '#475569',
    marginBottom: 16,
    marginTop: 4,
  },
  roleOption: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    alignItems: 'center',
  },
  roleOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  roleOptionText: {
    color: '#0F172A',
    fontWeight: '600',
  },
  roleOptionTextActive: {
    color: '#4F46E5',
  },
  cancelButton: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
});

export default UserManagementScreen;

