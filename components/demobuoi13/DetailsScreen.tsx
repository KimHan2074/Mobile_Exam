import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category, addToCart, fetchCategories } from '../../database/database'; // giả sử bạn có database.ts với fetchCategories
import CategorySelector from '../demobuoi13/CategorySelector';
import { useUser } from './UserContext';
import { HomeStackParamList } from './types';

type DetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Details'>;

const DetailsScreen = ({ route, navigation }: DetailsScreenProps) => {
  const { product } = route.params;
  const { currentUser } = useUser();
  const nav = useNavigation<any>();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // 🔥 HÀM XỬ LÝ ẢNH
  const getImageSource = (img: string): ImageSourcePropType => {
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

  // 🔥 CALLBACK khi nhấn vào category → điều hướng sang ProductsByCategory
  const handleSelectCategory = (id: number) => {
    const selected = categories.find(c => c.id === id);
    if (selected) {
      navigation.navigate('ProductsByCategory', {
        categoryId: selected.id,
        categoryName: selected.name,
      });
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ.', [
        {
          text: 'Đăng nhập',
          onPress: () => nav.navigate('Login'),
        },
        { text: 'Huỷ', style: 'cancel' },
      ]);
      return;
    }
    try {
      await addToCart(currentUser.id, product.id, 1);
      Alert.alert('Thành công', 'Đã thêm vào giỏ hàng.');
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>

      {/* ẢNH SẢN PHẨM */}
      <Image
        source={getImageSource(product.img)}
        style={styles.productImage}
        resizeMode="contain"
      />

      {/* THÔNG TIN SẢN PHẨM */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{product.id}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>{product.name}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.value}>{product.price.toLocaleString()} đ</Text>
      </View>

      {/* CATEGORY SELECTOR */}
      <Text style={styles.labelCategory}>Xem sản phẩm theo loại:</Text>
      <CategorySelector
        categories={categories}
        selectedId={product.categoryId} 
        onSelect={handleSelectCategory} 
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,        
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,       
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,   
    color: '#333'
  },
  productImage: {
    width: '100%',
    height: 200,        
    borderRadius: 10,
    marginBottom: 16,   
  },
  infoBox: {
    flexDirection: 'row',
    marginVertical: 4,  
  },
  label: {
    width: 70,          
    fontWeight: '600',
    fontSize: 14,       
    color: '#555',
  },
  value: {
    fontSize: 14,       
    color: '#222',
  },
  labelCategory: {
    marginTop: 14,      
    fontSize: 15,       
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    marginTop: 16,      
    backgroundColor: '#22C55E',
    borderRadius: 10,   
    paddingVertical: 10, 
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,       
  },
});


export default DetailsScreen;

