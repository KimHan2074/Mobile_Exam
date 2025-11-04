import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
// rnfes
// Khi nào có sự thay đổi giá trị của state thì mới re-render lại - giá trị giống nhau sẽ không re-render lại
const HelloApp = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handlePress = () => {
    if (!name || !age) {
      Alert.alert("Vui lòng nhập đầy đủ tên và tuổi!");
    } else {
      Alert.alert(`Hello ${name}, ${age} tuổi nhé!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập thông tin của bạn</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Thẻ Button không dùng style như bên trên được */}
      <Button title="Say Hello!" onPress={handlePress} />

      <Text style={styles.result}>
        {name && age ? `Hello ${name}, ${age} tuổi` : ""}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "#b1b0b0ff",
    padding: 10,
    width: "80%",
    borderRadius: 8,
    marginBottom: 15
  },
  result: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  }
});

export default HelloApp;
