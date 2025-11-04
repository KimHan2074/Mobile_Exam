import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Alert } from 'react-native';

const DanhBa = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Linh', phone: '0889333444' },
    { id: 2, name: 'Hung', phone: '0377511308' },
    { id: 3, name: 'Thanh', phone: '0513040405' },
  ]);

  // State cho chức năng sửa liên hệ
  const [editingContact, setEditingContact] = useState<{ id: number; name: string; phone: string } | null>(null);

  const nameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);

  // Thêm liên hệ mới
  const handleAddContact = () => {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;

    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên');
      setTimeout(() => { nameInputRef.current?.focus(); }, 0);
      return;
    } else if (!nameRegex.test(name)) {
      Alert.alert('Lỗi', 'Tên chỉ được chứa chữ cái và khoảng trắng');
      setTimeout(() => { nameInputRef.current?.focus(); }, 0);
      return;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ. Vui lòng nhập 10-12 chữ số.');
      setTimeout(() => { phoneInputRef.current?.focus(); }, 0);
      return;
    }

    const newContact = {
      id: contacts.length + 1,
      name: name.trim(),
      phone: phone.trim(),
    };

    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
  };

  // Chọn liên hệ để sửa
  const selectContactToEdit = (contact: { id: number; name: string; phone: string }) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setTimeout(() => { nameInputRef.current?.focus(); }, 0);
  };

  // Lưu liên hệ đã sửa
  const saveEditedContact = () => {
    if (editingContact) {
      const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
      const phoneRegex = /^[0-9]{10,12}$/;

      if (!name.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập tên');
        setTimeout(() => { nameInputRef.current?.focus(); }, 0);
        return;
      } else if (!nameRegex.test(name)) {
        Alert.alert('Lỗi', 'Tên chỉ được chứa chữ cái và khoảng trắng');
        setTimeout(() => { nameInputRef.current?.focus(); }, 0);
        return;
      }

      if (!phoneRegex.test(phone)) {
        Alert.alert('Lỗi', 'Số điện thoại không hợp lệ. Vui lòng nhập 10-12 chữ số.');
        setTimeout(() => { phoneInputRef.current?.focus(); }, 0);
        return;
      }

      const updatedContacts = contacts.map(contact =>
        contact.id === editingContact.id
          ? { ...contact, name: name.trim(), phone: phone.trim() }
          : contact
      );

      setContacts(updatedContacts);
      setEditingContact(null);
      setName('');
      setPhone('');
    }
  };

  // Xóa liên hệ
  const deleteContact = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa liên hệ này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => {
          const updatedContacts = contacts.filter(contact => contact.id !== id);
          setContacts(updatedContacts);

          // Nếu đang sửa liên hệ này, reset form
          if (editingContact?.id === id) {
            setEditingContact(null);
            setName('');
            setPhone('');
          }
        }}
      ]
    );
  };

  // Lọc danh sách theo searchText
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📒 Danh Bạ Cute</Text>

      <TextInput
        ref={nameInputRef}
        style={styles.input}
        placeholder="🌸 Nhập tên"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        ref={phoneInputRef}
        style={styles.input}
        placeholder="📞 Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>+ THÊM</Text>
      </TouchableOpacity>

      {editingContact && (
        <TouchableOpacity style={styles.addButton} onPress={saveEditedContact}>
          <Text style={styles.addButtonText}>💾 LƯU</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Tìm kiếm..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        style={styles.list}
        data={filteredContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactRow}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => selectContactToEdit(item)}>
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>👤 {item.name} - {item.phone}</Text>
              </View>
            </TouchableOpacity>

            {/* Nút sửa */}
            <TouchableOpacity onPress={() => selectContactToEdit(item)} style={styles.iconButton}>
                <Text style={styles.iconText}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteContact(item.id)}>
              <View style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe6f0',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4081',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffcce0',
  },
  searchInput: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcce0',
  },
  addButton: {
    backgroundColor: '#ff66b2',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItem: {
    backgroundColor: '#fff',
    marginVertical: 5,
    padding: 12,
    borderRadius: 10,
    borderColor: '#ffcce0',
    borderWidth: 1,
  },
  contactText: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
  marginLeft: 10,
  backgroundColor: '#ff66b2', // màu bút chì
  padding: 10,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
iconText: {
  fontSize: 16,
  color: 'white',
},
});

export default DanhBa;

