import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";

type Props = {
  name: string;
  age: number;
};

const SayHello = ({ name, age }: Props) => {
    const handlePress = () => {
        Alert.alert(`Hello bạn, ${name}, ${age} tuổi nhé!`);
    };

    return (
        <View style={[styles.container]}>
            {/* <Text style={styles.text}>Hello Kim Hân! 'Hana'</Text>
            <Text style={{fontSize: 32, fontWeight: 'bold', color: '#06611dff'}}>Hello Hana!!! 'Kim Hân'</Text> */}

            <Text style={{fontSize: 32, fontWeight: 'bold', color: '#06611dff'}}>
            {name && age ? `Hello bạn, ${name}` : ""}
            </Text>
            {/* Thẻ Button không dùng style như bên trên được */}
            <Button title="Say Hello Hẹ Hẹ" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c6b0c3ff'
  },
  // text: {
  //   fontSize: 32,
  //   fontWeight: 'bold',
  //   color: '#06611dff'
  // },
});

export default SayHello;