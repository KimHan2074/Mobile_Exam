import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { Product, Category, fetchCategories, fetchProductsByCategory } from '../../database/database';
import CategorySelector from '../demobuoi13/CategorySelector';

type ProductsByCategoryRouteProp = RouteProp<HomeStackParamList, 'ProductsByCategory'>;
type ProductsByCategoryNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductsByCategory'>;

export default function ProductsByCategoryScreen() {
  const route = useRoute<ProductsByCategoryRouteProp>();
  const navigation = useNavigation<ProductsByCategoryNavigationProp>();
  const { categoryId } = route.params;

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
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', { product: item })}
          >
            <Image source={getImageSource(item.img)} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.price.toLocaleString()} đ</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6 },
  image: { width: 80, height: 80, marginRight: 10 },
  info: { justifyContent: 'center' },
  name: { fontWeight: 'bold' },
});
