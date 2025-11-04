import React from "react";
import { View, StyleSheet, Text } from "react-native";

const GridBoxes = () => {
  return (
    <View style={styles.container}>
      {colors.map((color, index) => (
        <View key={index} style={[styles.box, { backgroundColor: color }]}>
          <Text style={styles.text}>Box {index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

const colors = [
  "#FF6B6B", "#FFD93D", "#6BCB77",
  "#4D96FF", "#843B62", "#FF9F1C",
  "#38B6FF", "#8338EC", "#FF006E",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center", // căn giữa dọc
    alignItems: "center",     // căn giữa ngang
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GridBoxes;

