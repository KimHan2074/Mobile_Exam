import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

import {
  initDatabase,
  fetchCategories,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProductsByNameOrCategory,
  Product,
  Category,
} from '../../database/database';

// Card sản phẩm với icon sửa/xóa
const ProductCard = ({
  item,
  onEdit,
  onDelete,
  getImageSource,
}: {
  item: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  getImageSource: (img: string) => ImageSourcePropType;
}) => (
  <View style={styles.card}>
    <Image source={getImageSource(item.img)} style={styles.image} />
    <View style={styles.infoContainer}>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
    </View>
    <View style={styles.iconRow}>
      <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.iconButton}>
        <Text style={styles.icon}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconButton}>
        <Text style={styles.icon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SanPhamSQLite = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    initDatabase(() => loadData());
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts(prods.reverse());
  };

  const handleAddOrUpdate = async () => {
    if (!name || !price) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và giá sản phẩm.');
      return;
    }
    const productData = {
      name,
      price: parseFloat(price),
      img: imageUri || 'aothun.jpg',
      categoryId,
    };
    try {
      if (editingId !== null) {
        await updateProduct({ id: editingId, ...productData });
        setEditingId(null);
      } else {
        await addProduct(productData);
      }
      setName('');
      setPrice('');
      setCategoryId(1);
      setImageUri(null);
      loadData();
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
    }
  };

  const handleEdit = (id: number) => {
    const p = products.find((x) => x.id === id);
    if (p) {
      setName(p.name);
      setPrice(p.price.toString());
      setCategoryId(p.categoryId);
      setImageUri(p.img);
      setEditingId(p.id);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa sản phẩm này không?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => { await deleteProduct(id); loadData(); } },
    ]);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) return { uri: img };
    switch (img) {
      case 'aothun.jpg': return require('../../assets/images/Doreamon/aothun.jpg');
      case 'shoesDRM.jpg': return require('../../assets/images/Doreamon/shoesDRM.jpg');
      case 'balo.jpg': return require('../../assets/images/Doreamon/balo.jpg');
      case 'hat.jpg': return require('../../assets/images/Doreamon/hat.jpg');
      case 'tui.jpg': return require('../../assets/images/Doreamon/tui.jpg');
      default: return require('../../assets/images/Doreamon/aothun.jpg');
    }
  };

  const handleSearch = async (keyword: string) => {
    if (keyword.trim() === '') loadData();
    else {
      const results = await searchProductsByNameOrCategory(keyword);
      setProducts(results.reverse());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Quản lý sản phẩm</Text>
      </View>

      {/* Form thêm/sửa */}
      <TextInput style={styles.input} placeholder="Tên sản phẩm" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Giá sản phẩm" keyboardType="numeric" value={price} onChangeText={setPrice} />
      <Picker selectedValue={categoryId} onValueChange={setCategoryId}>
        {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
      </Picker>
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.buttonText}>{imageUri ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
      </TouchableOpacity>
      {imageUri && <Image source={getImageSource(imageUri)} style={styles.selectedImage} />}
      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Tìm kiếm sản phẩm..." onChangeText={handleSearch} />

      {/* FlatList dạng grid với icon sửa/xóa */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard item={item} onEdit={handleEdit} onDelete={handleDelete} getImageSource={getImageSource} />
        )}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không có sản phẩm nào</Text>}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Doraemon Store</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#FFD93D',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0C93D',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333333' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    margin: 6,
    marginHorizontal: 12,
  },
  button: {
    backgroundColor: 'rgba(85, 121, 133, 1)',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  imagePicker: {
    backgroundColor: 'rgba(199, 129, 190, 1)',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  selectedImage: { width: 80, height: 80, marginVertical: 10, alignSelf: 'center', borderRadius: 8 },
  gridContainer: { paddingVertical: 10, paddingHorizontal: 4, justifyContent: 'space-around' },
  card: {
    flex: 1 / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 200,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginBottom: 6, resizeMode: 'cover' },
  infoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  productName: { fontWeight: 'bold', fontSize: 13, textAlign: 'center', lineHeight: 18, height: 36, color: '#333333' },
  productPrice: { color: '#E63946', fontWeight: 'bold', marginTop: 4, fontSize: 13 },
  iconRow: { flexDirection: 'row', marginTop: 6 },
  iconButton: { marginHorizontal: 6 },
  icon: { fontSize: 18 },
  footer: {
    backgroundColor: '#FFD1D1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5B5B5',
    marginTop: 10,
  },
  footerText: { fontSize: 14, color: '#444444' },
});

export default SanPhamSQLite;

