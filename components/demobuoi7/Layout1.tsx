import React from "react";
import { View, StyleSheet, Text } from "react-native";

const Layout1 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section1}>
        <Text style={styles.text}>Section 1</Text>
      </View>
      <View style={styles.section2}>
        <Text style={styles.text}>Section 2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
  },
  section1: {
    flex: 1, 
    backgroundColor: "#FFB6C1",
    justifyContent: "center",
    alignItems: "center",
  },
  section2: {
    flex: 1, 
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Layout1;
