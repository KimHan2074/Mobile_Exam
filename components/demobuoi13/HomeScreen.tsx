import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Category,
  Product,
  addToCart,
  fetchCategories,
  fetchProducts,
  initDatabase,
} from '../../database/database';
import Header from './Header';
import { useUser } from './UserContext';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { currentUser } = useUser();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // NEW — popup lọc
  const [filterVisible, setFilterVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase();
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);

      setCategories(cats);
      setAllProducts(prods.reverse());
      setProducts(prods.reverse());
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const categoryNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  useEffect(() => {
    let filtered = allProducts;
    const keyword = searchKeyword.trim().toLowerCase();

    if (keyword) {
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(keyword);
        const categoryMatch = (categoryNameMap[product.categoryId] || '')
          .toLowerCase()
          .includes(keyword);
        return nameMatch || categoryMatch;
      });
    }

    if (selectedCategoryId) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategoryId);
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!Number.isNaN(min)) {
      filtered = filtered.filter((product) => product.price >= min);
    }
    if (!Number.isNaN(max)) {
      filtered = filtered.filter((product) => product.price <= max);
    }

    setProducts(filtered);
  }, [allProducts, searchKeyword, selectedCategoryId, minPrice, maxPrice, categoryNameMap]);

  const getImageSource = (img: string): ImageSourcePropType => {
    if (img.startsWith('file://')) return { uri: img };
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

  const handleCategoryPress = () => {
    if (!categories.length) {
      Alert.alert('Thông báo', 'Đang tải danh mục sản phẩm...');
      return;
    }
    const firstCategory = categories[0];
    navigation.navigate('ProductsByCategory', {
      categoryId: firstCategory.id,
      categoryName: firstCategory.name,
    });
  };

  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ.', [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.navigate('Login'),
        },
        { text: 'Huỷ', style: 'cancel' },
      ]);
      return;
    }
    try {
      await addToCart(currentUser.id, product.id, 1);
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng.', [
        {
          text: 'Xem giỏ hàng',
          onPress: () => navigation.navigate('Cart'),
        },
        { text: 'Tiếp tục', style: 'cancel' },
      ]);
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ.');
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('Details', { product: item })}
    >
      <Image source={getImageSource(item.img)} style={styles.productImage} />

      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>

      <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>

      <TouchableOpacity
        style={styles.addCartButton}
        onPress={(event) => {
          event.stopPropagation();
          handleAddToCart(item);
        }}
      >
        <Text style={styles.addCartText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/images/Doreamon/khoac.jpg')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>🛍️ Doraemon Store</Text>
          <Text style={styles.bannerSubtitle}>Thời trang cho fan Doraemon</Text>
        </View>
      </View>

      {/* Navigation menu */}
      <View style={styles.navMenu}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navItemText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleCategoryPress}>
          <Text style={styles.navItemText}>📦 Danh mục sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* ------------------- NEW FILTER BAR ------------------- */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.filterSearch}
          placeholder="🔍 Tìm kiếm..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterButtonText}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      {/* ------------------- FILTER POPUP ------------------- */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bộ lọc sản phẩm</Text>

            <Text style={styles.modalLabel}>Danh mục</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategoryId ?? 0}
                onValueChange={(value) =>
                  setSelectedCategoryId(value === 0 ? null : value)
                }
                style={styles.picker}
              >
                <Picker.Item label="Tất cả danh mục" value={0} />
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.modalLabel}>Khoảng giá</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.modalInput}
                placeholder="Giá tối thiểu"
                keyboardType="numeric"
                value={minPrice}
                onChangeText={setMinPrice}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Giá tối đa"
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product section */}
      <Text style={styles.sectionTitle}>Sản phẩm mới nhất</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.productList}
        renderItem={renderProduct}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Hiện chưa có sản phẩm nào.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingTop: 8,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 4,
    color: '#475569',
    fontWeight: '600',
    fontSize: 11,
  },

  bannerContainer: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.32)',
    padding: 8,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: '#E2E8F0',
    fontSize: 11,
  },

  navMenu: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  navItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  navItemActive: {
    backgroundColor: '#E0E7FF',
    borderColor: '#A5B4FC',
  },
  navItemText: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },

  // ---------------- FILTER BAR ----------------
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterSearch: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    fontSize: 12,
  },
  filterButton: {
    width: 70,
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A5B4FC',
  },
  filterButtonText: {
    color: '#4338CA',
    fontWeight: '700',
    fontSize: 12,
  },

  // ---------------- FILTER MODAL ----------------
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
    maxHeight: '55%',       
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },

  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  picker: {
    height: 52,
    paddingLeft: 10,     
    fontSize: 14,
    color: '#0F172A',
  },

  priceRow: {
    flexDirection: 'row',
    gap: 8,
  },

  modalInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    fontSize: 13,
  },

  applyButton: {
    marginTop: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
  },

  applyButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  productList: {
    paddingBottom: 12,
  },

  productCard: {
    // flex: 1,
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginBottom: 5,
  },
  productName: {
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
    color: '#1E293B',
  },
  productPrice: {
    marginTop: 3,
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 11,
  },
  addCartButton: {
    marginTop: 6,
    width: '100%',
    backgroundColor: '#22C55E',
    paddingVertical: 4,
    borderRadius: 999,
  },
  addCartText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },

  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
  },
});

export default HomeScreen;

