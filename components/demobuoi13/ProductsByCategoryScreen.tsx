import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category, Product, addToCart, fetchCategories, fetchProductsByCategory } from '../../database/database';
import CategorySelector from '../demobuoi13/CategorySelector';
import { useUser } from './UserContext';
import { HomeStackParamList } from './types';

type ProductsByCategoryRouteProp = RouteProp<HomeStackParamList, 'ProductsByCategory'>;
type ProductsByCategoryNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductsByCategory'>;

export default function ProductsByCategoryScreen() {
  const route = useRoute<ProductsByCategoryRouteProp>();
  const navigation = useNavigation<ProductsByCategoryNavigationProp>();
  const { categoryId } = route.params;
  const { currentUser } = useUser();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

  useEffect(() => { fetchCategories().then(setCategories); }, []);
  useEffect(() => { fetchProductsByCategory(selectedCategoryId).then(setProducts); }, [selectedCategoryId]);

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

  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ.');
      return;
    }
    try {
      await addToCart(currentUser.id, product.id, 1);
      Alert.alert('Thành công', 'Đã thêm vào giỏ hàng.');
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={(id) => setSelectedCategoryId(id)} // update selected category + fetch sản phẩm
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardBody}
              onPress={() => navigation.navigate('Details', { product: item })}
            >
              <Image source={getImageSource(item.img)} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.price.toLocaleString()} đ</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, backgroundColor: '#fff' },
  cardBody: { flexDirection: 'row' },
  image: { width: 80, height: 80, marginRight: 10 },
  info: { justifyContent: 'center' },
  name: { fontWeight: 'bold' },
  addButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    paddingVertical: 6,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
});
