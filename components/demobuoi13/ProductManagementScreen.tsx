import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    Category,
    Product,
    addProduct,
    deleteProduct,
    fetchCategories,
    fetchProducts,
    initDatabase,
    updateProduct,
} from '../../database/database';
import AdminBackButton from './AdminBackButton';
import Header from './Header';

const ProductManagementScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    img: '',
    categoryId: 0,
  });
  const [productImageUri, setProductImageUri] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      await initDatabase();
      const [catData, productData] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      setCategories(catData);
      setProducts(productData.reverse());
    } catch (error) {
      console.error('Load products error:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let data = products;
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter(
        product =>
          product.name.toLowerCase().includes(keyword) ||
          String(product.price).includes(keyword),
      );
    }
    if (filterCategoryId) {
      data = data.filter(product => product.categoryId === filterCategoryId);
    }
    return data;
  }, [products, searchKeyword, filterCategoryId]);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      img: '',
      categoryId: categories[0]?.id ?? 0,
    });
    setProductImageUri(null);
    setProductModalVisible(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: String(product.price),
      img: product.img,
      categoryId: product.categoryId,
    });
    setProductImageUri(product.img.startsWith('file://') ? product.img : null);
    setProductModalVisible(true);
  };

  const closeProductModal = () => {
    setProductModalVisible(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      img: '',
      categoryId: categories[0]?.id ?? 0,
    });
    setProductImageUri(null);
  };

  const handlePickProductImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setProductImageUri(result.assets[0].uri);
    }
  };

  const getImageSource = (img: string) => {
    if (!img) {
      return require('../../assets/images/Doreamon/aothun.jpg');
    }
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

  const productPreviewSource = useMemo(() => {
    if (productImageUri) {
      return { uri: productImageUri };
    }
    const trimmed = productForm.img.trim();
    if (trimmed) {
      return getImageSource(trimmed);
    }
    return null;
  }, [productImageUri, productForm.img]);

  const handleSaveProduct = async () => {
    const trimmedName = productForm.name.trim();
    const priceValue = Number(productForm.price);
    const trimmedImg = productForm.img.trim();
    const categoryId = productForm.categoryId;

    if (!trimmedName || !priceValue || priceValue <= 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên và giá sản phẩm hợp lệ.');
      return;
    }

    if (!categoryId) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn danh mục.');
      return;
    }

    if (!productImageUri && !trimmedImg) {
      Alert.alert(
        'Thiếu hình ảnh',
        'Vui lòng chọn hình từ thư viện hoặc nhập tên file ảnh.',
      );
      return;
    }

    const imageValue = productImageUri ?? trimmedImg;

    try {
      setSavingProduct(true);
      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          name: trimmedName,
          price: priceValue,
          img: imageValue,
          categoryId,
        });
      } else {
        await addProduct({
          name: trimmedName,
          price: priceValue,
          img: imageValue,
          categoryId,
        });
      }
      await loadData();
      closeProductModal();
      Alert.alert(
        'Thành công',
        editingProduct ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.',
      );
    } catch (error) {
      console.error('Save product error:', error);
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm.');
    } finally {
      setSavingProduct(false);
    }
  };

  const confirmDeleteProduct = (product: Product) => {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn chắc chắn muốn xóa "${product.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => handleDeleteProduct(product.id),
        },
      ],
    );
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setSavingProduct(true);
      await deleteProduct(id);
      await loadData();
      Alert.alert('Thành công', 'Đã xóa sản phẩm.');
    } catch (error) {
      console.error('Delete product error:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm.');
    } finally {
      setSavingProduct(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={getImageSource(item.img)} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productMeta}>
          {(item.price || 0).toLocaleString('vi-VN')} đ
        </Text>
        <Text style={styles.productMeta}>
          Danh mục:{' '}
          {categories.find(cat => cat.id === item.categoryId)?.name || 'Không rõ'}
        </Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditProductModal(item)}
        >
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDeleteProduct(item)}
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <AdminBackButton />
      <Text style={styles.screenTitle}>📦 Quản trị sản phẩm</Text>
      <Text style={styles.screenSubtitle}>
        Quản lý danh sách sản phẩm: xem, thêm, sửa, xóa.
      </Text>

      <TouchableOpacity style={styles.addButton} onPress={openAddProductModal}>
        <Text style={styles.addButtonText}>＋ Thêm sản phẩm</Text>
      </TouchableOpacity>

      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc giá..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filterCategoryId ?? 0}
            onValueChange={value => setFilterCategoryId(value === 0 ? null : value)}
          >
            <Picker.Item label="Tất cả danh mục" value={0} />
            {categories.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => String(item.id)}
          renderItem={renderProductItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadData();
              }}
              tintColor="#6366F1"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Chưa có sản phẩm nào.</Text>
              <Text style={styles.emptySubtitle}>
                Hãy thêm sản phẩm đầu tiên của bạn.
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={productModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeProductModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Tên sản phẩm"
              value={productForm.name}
              onChangeText={value => setProductForm(prev => ({ ...prev, name: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá sản phẩm"
              keyboardType="numeric"
              value={productForm.price}
              onChangeText={value => setProductForm(prev => ({ ...prev, price: value }))}
            />
            <View style={styles.categoryPicker}>
              <Text style={styles.categoryPickerLabel}>Danh mục:</Text>
              <Picker
                selectedValue={productForm.categoryId}
                onValueChange={value =>
                  setProductForm(prev => ({ ...prev, categoryId: value }))
                }
              >
                {categories.map(cat => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Tên file ảnh (ví dụ: aothun.jpg)"
              value={productForm.img}
              onChangeText={value => setProductForm(prev => ({ ...prev, img: value }))}
            />
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handlePickProductImage}
              disabled={savingProduct}
            >
              <Text style={styles.imagePickerText}>
                {productImageUri ? 'Chọn lại hình ảnh' : 'Chọn hình từ thư viện'}
              </Text>
            </TouchableOpacity>
            {productPreviewSource && (
              <Image source={productPreviewSource} style={styles.previewImage} />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={closeProductModal}
                disabled={savingProduct}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleSaveProduct}
                disabled={savingProduct}
              >
                <Text style={styles.modalSaveText}>
                  {savingProduct ? 'Đang lưu...' : 'Lưu'}
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
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  screenSubtitle: {
    color: '#475569',
    marginBottom: 12,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  addButtonText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 14,
  },
  filterBar: {
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 28,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    alignItems: 'center',
    gap: 10,
  },
  productImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  productMeta: {
    color: '#475569',
    marginTop: 2,
    fontSize: 12,
  },
  productActions: {
    gap: 6,
  },
  editButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  editButtonText: {
    color: '#4338CA',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  deleteButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 13,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#475569',
    fontSize: 13,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    color: '#475569',
    marginTop: 3,
    textAlign: 'center',
    fontSize: 13,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },

  categoryPicker: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  categoryPickerLabel: {
    fontWeight: '600',
    color: '#0F172A',
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 14,
  },

  imagePickerButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#4338CA',
    fontWeight: '600',
    fontSize: 14,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancel: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  modalSave: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ProductManagementScreen;

