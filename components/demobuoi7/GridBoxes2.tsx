import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GridBoxes2 = () => {
  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: "#FF6B6B" }]}>
          <Text style={styles.text}>Box 1</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#FFD93D" }]}>
          <Text style={styles.text}>Box 2</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#6BCB77" }]}>
          <Text style={styles.text}>Box 3</Text>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: "#4D96FF" }]}>
          <Text style={styles.text}>Box 4</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#843B62" }]}>
          <Text style={styles.text}>Box 5</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#FF9F1C" }]}>
          <Text style={styles.text}>Box 6</Text>
        </View>
      </View>

      {/* Row 3 */}
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: "#38B6FF" }]}>
          <Text style={styles.text}>Box 7</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#8338EC" }]}>
          <Text style={styles.text}>Box 8</Text>
        </View>
        <View style={[styles.box, { backgroundColor: "#FF006E" }]}>
          <Text style={styles.text}>Box 9</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  row: {
    flex: 1, 
    flexDirection: "row",
  },
  box: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GridBoxes2;
