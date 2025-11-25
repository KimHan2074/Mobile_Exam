import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../../database/database';

interface Props {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
}

const CategorySelector = ({ categories, selectedId, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.button, cat.id === selectedId && styles.selectedButton]}
          onPress={() => onSelect(cat.id)}
        >
          <Text style={styles.text}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  button: { padding: 10, backgroundColor: '#ccc', borderRadius: 6, margin: 5 },
  selectedButton: { backgroundColor: '#28a' },
  text: { color: '#fff' },
});

export default CategorySelector;
