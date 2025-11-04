import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HelloWorldScreen = () => {
    return (
        <View style={[styles.container]}>
            {/* <Text style={styles.text}>Hello Kim Hân! 'Hana'</Text> */}
            <Text style={{fontSize: 32, fontWeight: 'bold', color: '#06611dff'}}>Hello Hana!!! 'Kim Hân'</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0abd8ff'
  },
  // text: {
  //   fontSize: 32,
  //   fontWeight: 'bold',
  //   color: '#06611dff'
  // },
});

export default HelloWorldScreen;