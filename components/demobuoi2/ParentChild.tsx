import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';

type Props = {
  name: string;
  age: number;
  handleChange: (newName: string, newAge: number) => void;
};

const ParentChild = () => {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(30);

  const handleChange = (newName: string, newAge: number) => {
    setName(newName);
    setAge(newAge);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Component</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Nhập tên của cha"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Nhập tuổi của cha"
          keyboardType="numeric"
          value={age.toString()}
          onChangeText={(text) => setAge(Number(text))}
          style={styles.input}
        />

        <Text style={styles.label}>Tên của cha: <Text style={styles.highlight}>{name || '...'}</Text></Text>
        <Text style={styles.label}>Tuổi của cha: <Text style={styles.highlight}>{age}</Text></Text>
      </View>

      <ChildComponent name={name} age={age} handleChange={handleChange} />
    </View>
  );
};

const ChildComponent = ({ name, age, handleChange }: Props) => {
  return (
    <View style={[styles.card, styles.childCard]}>
      <Text style={styles.title}>Child Component</Text>

      <Text style={styles.label}>Tên cha nhận được: <Text style={styles.highlight}>{name || '...'}</Text></Text>
      <Text style={styles.label}>Tuổi cha nhận được: <Text style={styles.highlight}>{age}</Text></Text>

      <TextInput
        placeholder="Thay đổi tên của cha từ con"
        value={name}
        onChangeText={(newName) => handleChange(newName, age)}
        style={styles.input}
      />

      <TextInput
        placeholder="Thay đổi tuổi của cha từ con"
        keyboardType="numeric"
        value={age.toString()}
        onChangeText={(newAge) => handleChange(name, Number(newAge))}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  childCard: {
    backgroundColor: '#E8F3FF',
    borderColor: '#3B82F6',
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 6,
    fontSize: 16,
    backgroundColor: '#F3F4F6',
  },
  label: {
    fontSize: 17,
    color: '#374151',
    marginVertical: 4,
  },
  highlight: {
    fontWeight: '600',
    color: '#2563EB',
  },
});

export default ParentChild;
