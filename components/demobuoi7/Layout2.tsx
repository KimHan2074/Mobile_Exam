import React from "react";
import { View, StyleSheet, Text } from "react-native";

const Layout2 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section1}>
        <Text style={styles.text}>Section 1 (1/3)</Text>
      </View>
      <View style={styles.section2}>
        <Text style={styles.text}>Section 2 (2/3)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section1: {
    flex: 1, 
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  section2: {
    flex: 2, 
    backgroundColor: "#20B2AA",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Layout2;
