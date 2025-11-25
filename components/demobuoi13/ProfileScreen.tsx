import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getUserProfile, upsertUserProfile } from '../../database/database';
import { useUser } from './UserContext';

const ProfileScreen = () => {
  const { currentUser } = useUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setFullName('');
        setEmail('');
        setPhone('');
        setAddress('');
        return;
      }
      const profile = await getUserProfile(currentUser.id);
      setFullName(profile?.fullName || '');
      setEmail(profile?.email || '');
      setPhone(profile?.phone || '');
      setAddress(profile?.address || '');
    };
    loadProfile();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập.');
      return;
    }
    try {
      setSaving(true);
      await upsertUserProfile({
        userId: currentUser.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      Alert.alert('Thành công', 'Đã cập nhật thông tin tài khoản.');
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin.');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Vui lòng đăng nhập để cập nhật thông tin.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Thông tin tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
        multiline
      />
      <TouchableOpacity
        style={[styles.primaryButton, saving && styles.disabledButton]}
        disabled={saving}
        onPress={handleSave}
      >
        <Text style={styles.primaryText}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
  input: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  infoText: {
    color: '#475569',
    textAlign: 'center',
  },
});

export default ProfileScreen;

