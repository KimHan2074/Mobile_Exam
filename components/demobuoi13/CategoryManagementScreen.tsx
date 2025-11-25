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
    addCategory,
    addProduct,
    deleteCategoryById,
    fetchCategories,
    fetchProductsByCategory,
    initDatabase,
    updateCategoryById,
} from '../../database/database';
import AdminBackButton from './AdminBackButton';
import Header from './Header';

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const [productModalCategory, setProductModalCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    img: '',
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productImageUri, setProductImageUri] = useState<string | null>(null);

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Product[]>>({});
  const [productsLoadingId, setProductsLoadingId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      await initDatabase();
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Load categories error:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách loại sản phẩm.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryModalVisible(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const handleSaveCategory = async () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên loại sản phẩm.');
      return;
    }
    try {
      setSavingCategory(true);
      let success = false;
      if (editingCategory) {
        success = await updateCategoryById(editingCategory.id, trimmed);
      } else {
        success = await addCategory(trimmed);
      }
      if (success) {
        await loadCategories();
        closeCategoryModal();
        Alert.alert('Thành công', editingCategory ? 'Đã cập nhật loại.' : 'Đã thêm loại mới.');
      } else {
        Alert.alert('Thất bại', 'Không thể lưu loại sản phẩm.');
      }
    } catch (error) {
      console.error('Save category error:', error);
      Alert.alert('Lỗi', 'Không thể lưu loại sản phẩm.');
    } finally {
      setSavingCategory(false);
    }
  };

  const confirmDeleteCategory = (category: Category) => {
    Alert.alert(
      'Xóa loại sản phẩm',
      `Xóa "${category.name}" sẽ xóa toàn bộ sản phẩm thuộc loại này. Bạn chắc chắn chứ?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => handleDeleteCategory(category.id),
        },
      ],
    );
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setSavingCategory(true);
      const success = await deleteCategoryById(id);
      if (success) {
        await loadCategories();
        setProductsByCategory(prev => {
          const clone = { ...prev };
          delete clone[id];
          return clone;
        });
        if (expandedCategoryId === id) {
          setExpandedCategoryId(null);
        }
        Alert.alert('Thành công', 'Đã xóa loại sản phẩm.');
      } else {
        Alert.alert('Thất bại', 'Không thể xóa loại sản phẩm.');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      Alert.alert('Lỗi', 'Không thể xóa loại sản phẩm.');
    } finally {
      setSavingCategory(false);
    }
  };

  const toggleProducts = async (category: Category) => {
    if (expandedCategoryId === category.id) {
      setExpandedCategoryId(null);
      return;
    }
    setExpandedCategoryId(category.id);
    if (!productsByCategory[category.id]) {
      try {
        setProductsLoadingId(category.id);
        const products = await fetchProductsByCategory(category.id);
        setProductsByCategory(prev => ({ ...prev, [category.id]: products }));
      } catch (error) {
        console.error('Fetch category products error:', error);
        Alert.alert('Lỗi', 'Không thể tải sản phẩm cho loại này.');
      } finally {
        setProductsLoadingId(null);
      }
    }
  };

  const openAddProductModal = (category: Category) => {
    setProductModalCategory(category);
    setProductForm({ name: '', price: '', img: '' });
    setProductImageUri(null);
  };

  const closeProductModal = () => {
    setProductModalCategory(null);
    setProductForm({ name: '', price: '', img: '' });
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
      return null;
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
    if (!productModalCategory) return;
    const trimmedName = productForm.name.trim();
    const trimmedImg = productForm.img.trim();
    const priceValue = Number(productForm.price);

    if (!trimmedName || !priceValue || priceValue <= 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên và giá sản phẩm hợp lệ.');
      return;
    }

    if (!productImageUri && !trimmedImg) {
      Alert.alert('Thiếu hình ảnh', 'Vui lòng chọn hình từ thư viện hoặc nhập tên file ảnh.');
      return;
    }

    try {
      setSavingProduct(true);
      const imageValue = productImageUri ?? trimmedImg;
      await addProduct({
        name: trimmedName,
        price: priceValue,
        img: imageValue,
        categoryId: productModalCategory.id,
      });
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới.');
      if (expandedCategoryId === productModalCategory.id) {
        const products = await fetchProductsByCategory(productModalCategory.id);
        setProductsByCategory(prev => ({ ...prev, [productModalCategory.id]: products }));
      }
      closeProductModal();
    } catch (error) {
      console.error('Add product error:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm.');
    } finally {
      setSavingProduct(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isExpanded = expandedCategoryId === item.id;
    const products = productsByCategory[item.id] ?? [];
    const isLoadingProducts = productsLoadingId === item.id;

    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryMeta}>ID: {item.id}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => openAddProductModal(item)}
            >
              <Text style={styles.iconButtonText}>＋SP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => openEditCategoryModal(item)}
            >
              <Text style={styles.iconButtonText}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteIconButton}
              onPress={() => confirmDeleteCategory(item)}
            >
              <Text style={styles.deleteIconText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.expandRow}
          onPress={() => toggleProducts(item)}
        >
          <Text style={styles.expandText}>
            {isExpanded ? 'Ẩn danh sách sản phẩm' : 'Xem sản phẩm thuộc loại này'}
          </Text>
          <Text style={styles.expandIndicator}>{isExpanded ? '▴' : '▾'}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.productsSection}>
            {isLoadingProducts ? (
              <View style={styles.productsLoading}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.productsLoadingText}>Đang tải sản phẩm...</Text>
              </View>
            ) : products.length === 0 ? (
              <Text style={styles.emptyProductsText}>Chưa có sản phẩm nào.</Text>
            ) : (
              products.map(product => {
                const previewSource = getImageSource(product.img);
                return (
                  <View key={product.id} style={styles.productRow}>
                    <View style={styles.productInfo}>
                      {previewSource && (
                        <Image source={previewSource} style={styles.productImage} />
                      )}
                      <Text style={styles.productName}>{product.name}</Text>
                    </View>
                    <Text style={styles.productPrice}>
                      {(product.price || 0).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        )}
      </View>
    );
  };

  const emptyListComponent = useMemo(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Chưa có loại sản phẩm nào.</Text>
        <Text style={styles.emptySubtitle}>
          Nhấn nút &quot;Thêm loại sản phẩm&quot; để bắt đầu.
        </Text>
      </View>
    );
  }, [loading]);

  return (
    <View style={styles.container}>
      <Header />
      <AdminBackButton />
      <Text style={styles.screenTitle}>📂 Quản trị loại sản phẩm</Text>
      <Text style={styles.screenSubtitle}>
        Xem, thêm, chỉnh sửa, xóa loại và bổ sung sản phẩm cho từng loại.
      </Text>

      <TouchableOpacity
        style={styles.addCategoryButton}
        onPress={openAddCategoryModal}
      >
        <Text style={styles.addCategoryText}>＋ Thêm loại sản phẩm</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => String(item.id)}
          renderItem={renderCategoryItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadCategories();
              }}
              tintColor="#6366F1"
            />
          }
          ListEmptyComponent={emptyListComponent}
        />
      )}

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCategoryModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Chỉnh sửa loại' : 'Thêm loại sản phẩm'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Tên loại sản phẩm"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={closeCategoryModal}
                disabled={savingCategory}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleSaveCategory}
                disabled={savingCategory}
              >
                <Text style={styles.modalSaveText}>
                  {savingCategory ? 'Đang lưu...' : 'Lưu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Product Modal */}
      <Modal
        visible={!!productModalCategory}
        transparent
        animationType="fade"
        onRequestClose={closeProductModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {productModalCategory
                ? `Thêm sản phẩm cho ${productModalCategory.name}`
                : 'Thêm sản phẩm'}
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
                  {savingProduct ? 'Đang lưu...' : 'Thêm'}
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
  addCategoryButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addCategoryText: {
    color: '#0369A1',
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  categoryMeta: {
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  iconButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  deleteIconButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  deleteIconText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  expandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  expandText: {
    color: '#475569',
    fontWeight: '500',
  },
  expandIndicator: {
    color: '#94A3B8',
  },
  productsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  productsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productsLoadingText: {
    color: '#475569',
  },
  emptyProductsText: {
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  productName: {
    color: '#0F172A',
    flexShrink: 1,
  },
  productPrice: {
    color: '#0EA5E9',
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
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: '600',
  },
  modalSave: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  imagePickerButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#4338CA',
    fontWeight: '600',
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
});

export default CategoryManagementScreen;

