import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
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
        onPress={event => {
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

      {/* Product section */}
      <Text style={styles.sectionTitle}>Sản phẩm mới nhất</Text>
      <View style={styles.filterWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm theo tên hoặc danh mục..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCategoryId ?? 0}
            onValueChange={(value) => setSelectedCategoryId(value === 0 ? null : value)}
            style={styles.picker}
          >
            <Picker.Item label="Tất cả danh mục" value={0} />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>
        <View style={styles.priceRow}>
          <TextInput
            style={styles.priceInput}
            placeholder="Giá tối thiểu"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Giá tối đa"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#475569',
    fontWeight: '600',
  },
  bannerContainer: {
    width: '100%',
    height: 130,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  navMenu: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  navItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#FFFFFF',
    marginTop: -4,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
  productList: {
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    alignItems: 'center',
  },
  productImage: {
    width: 105,
    height: 105,
    borderRadius: 10,
    marginBottom: 8,
  },
  productName: {
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    color: '#1E293B',
  },
  productPrice: {
    marginTop: 4,
    color: '#DC2626',
    fontWeight: '700',
  },
  addCartButton: {
    marginTop: 8,
    width: '100%',
    backgroundColor: '#22C55E',
    paddingVertical: 6,
    borderRadius: 999,
  },
  addCartText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 32,
  },
});

export default HomeScreen;
