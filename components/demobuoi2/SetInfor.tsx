import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const SetInfor = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <View >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Information</Text>
      <Text>Name: {name}</Text>
      <Text>Age: {age}</Text>

      <ChildComponent name={name} age={age} setName={setName} setAge={setAge} />
    </View>
  )
}

export default SetInfor;

export const ChildComponent = ({ name, age, setName, setAge }: {
  name: string;
  age: string;
  setName: (name: string) => void;
  setAge: (age: string) => void;
}) => {
  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>ChildComponent</Text>

      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
    </View>
  )
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
          borderColor: '#ccc',
          marginVertical: 8,
          padding: 8,
          borderRadius: 5,
    }
})
