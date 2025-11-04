import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';

const QuanLySV = () => {
  type StudentType = {
    id: number;
    name: string;
    age: number;
    grade: number;
  };

  const [students, setStudents] = useState<StudentType[]>([
    { id: 1, name: 'An', age: 19, grade: 8.5 },
    { id: 2, name: 'Bình', age: 17, grade: 7.2 },
    { id: 3, name: 'Hân', age: 22, grade: 9.0 },
    { id: 4, name: 'Kim', age: 20, grade: 8.0 },
    { id: 5, name: 'Hậu', age: 25, grade: 8.1 },
  ]);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null); // ID sinh viên đang sửa
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Hàm thêm hoặc cập nhật sinh viên
  const handleAddOrUpdate = () => {
    if (!name.trim() || !age.trim() || !grade.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (editingId) {
      // --- Cập nhật sinh viên ---
      const updatedList = students.map((sv) =>
        sv.id === editingId
          ? { ...sv, name: name.trim(), age: parseInt(age), grade: parseFloat(grade) }
          : sv
      );
      setStudents(updatedList);
      setEditingId(null);
      Alert.alert('Thành công', 'Cập nhật sinh viên thành công!');
    } else {
      // --- Thêm sinh viên ---
      const newStudent: StudentType = {
        id: Date.now(),
        name: name.trim(),
        age: parseInt(age),
        grade: parseFloat(grade),
      };
      setStudents((prev) => [...prev, newStudent]);
      Alert.alert('Thành công', 'Thêm sinh viên mới!');
    }

    // reset input
    setName('');
    setAge('');
    setGrade('');
  };

  //Sửa
  const handleEdit = (student: StudentType) => {
    setName(student.name);
    setAge(student.age.toString());
    setGrade(student.grade.toString());
    setEditingId(student.id);
  };
// Xóa
  const handleDelete = (id: number, name: string) => {
  Alert.alert(
    'Xác nhận',
    `Bạn có chắc muốn xóa sinh viên "${name}" không?`,
    [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setStudents((prev) => prev.filter((sv) => sv.id !== id));
          Alert.alert('Thành công', 'Đã xóa sinh viên!');
        },
      },
    ],
    { cancelable: true }
  );
};

// SORT
  const sortByGrade = () => {
    const sorted = [...students].sort((a, b) => b.grade - a.grade);
    setStudents(sorted);
  };

  // Hàm lọc sinh viên có điểm >= 8
const filterHighGrades = () => {
  if (isFiltered) {
    // Nếu đang lọc thì hiển thị lại toàn bộ
    setStudents([
      { id: 1, name: 'An', age: 19, grade: 8.5 },
      { id: 2, name: 'Bình', age: 17, grade: 7.2 },
      { id: 3, name: 'Hân', age: 22, grade: 9.0 },
      { id: 4, name: 'Kim', age: 20, grade: 8.0 },
      { id: 5, name: 'Hậu', age: 25, grade: 8.1 },
    ]);
    setIsFiltered(false);
  } else {
    const filtered = students.filter((sv) => sv.grade >= 8);
    setStudents(filtered);
    setIsFiltered(true);
  }
};

// Hàm tìm kiếm theo tên
  // Hàm tìm kiếm theo tên
const searchByName = (text: string) => {
  setSearchText(text);

  if (text.trim() === "") {
    // Khi xóa hết ký tự, hiển thị lại toàn bộ danh sách gốc
    setStudents([
      { id: 1, name: 'An', age: 19, grade: 8.5 },
      { id: 2, name: 'Bình', age: 17, grade: 7.2 },
      { id: 3, name: 'Hân', age: 22, grade: 9.0 },
      { id: 4, name: 'Kim', age: 20, grade: 8.0 },
      { id: 5, name: 'Hậu', age: 25, grade: 8.1 },
    ]);
  } else {
    // Lọc danh sách theo tên (dựa trên danh sách gốc)
    const filtered = [
      { id: 1, name: 'An', age: 19, grade: 8.5 },
      { id: 2, name: 'Bình', age: 17, grade: 7.2 },
      { id: 3, name: 'Hân', age: 22, grade: 9.0 },
      { id: 4, name: 'Kim', age: 20, grade: 8.0 },
      { id: 5, name: 'Hậu', age: 25, grade: 8.1 },
    ].filter((sv) =>
      sv.name.toLowerCase().includes(text.toLowerCase())
    );
    setStudents(filtered);
  }
};

  const Student = ({ item, index }: { item: StudentType; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.center]}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={[styles.cell, styles.center]}>{item.age}</Text>
      <Text style={[styles.cell, styles.center]}>{item.grade}</Text>

      <View style={[styles.cell, styles.actionCell]}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
            <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id, item.name)}
        >
            <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? 'Cập nhật thông tin sinh viên' : 'Nhập thông tin sinh viên'}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên..."
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập tuổi..."
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập điểm..."
          keyboardType="numeric"
          value={grade}
          onChangeText={setGrade}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
          <Text style={styles.buttonText}>
            {editingId ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Danh sách sinh viên</Text>
      {/* Ô tìm kiếm */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên sinh viên..."
        value={searchText}
        onChangeText={searchByName}
      />
      <View>
        <TouchableOpacity style={styles.sortButton} onPress={sortByGrade}>
          <Text style={styles.sortButtonText}>Sắp xếp theo điểm (cao → thấp)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton} onPress={filterHighGrades}>
            <Text style={styles.filterButtonText}>
                {isFiltered ? 'Hiển thị toàn bộ sinh viên' : 'Lọc sinh viên điểm ≥ 8'}
            </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.headerCell, styles.center]}>STT</Text>
        <Text style={styles.headerCell}>Tên</Text>
        <Text style={[styles.headerCell, styles.center]}>Tuổi</Text>
        <Text style={[styles.headerCell, styles.center]}>Điểm</Text>
        <Text style={[styles.headerCell, styles.center, { flex: 1.5 }]}>Thao tác</Text>
      </View>

      <FlatList
        data={students}
        renderItem={Student}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default QuanLySV;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', paddingTop: 10 },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  form: { paddingHorizontal: 15, marginBottom: 10 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#4D96FF',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 10 },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4D96FF',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  cell: { flex: 1, textAlign: 'left', paddingHorizontal: 5 },
  center: { textAlign: 'center' },
  actionCell: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  editBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  deleteBtn: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  sortButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 240,
    marginBottom: 10,
    marginLeft: 11
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#00BFA6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 240,
    marginBottom: 10,
    marginLeft: 11,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
