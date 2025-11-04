import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const products = [
  { id: 1, name: "Giày thể thao", price: "250.000đ", image: require("../../assets/images/Doreamon/shoesDRM.jpg") },
  { id: 2, name: "Áo thun Doraemon", price: "180.000đ", image: require("../../assets/images/Doreamon/aothun.jpg") },
  { id: 3, name: "Balo học sinh", price: "320.000đ", image: require("../../assets/images/Doreamon/balo.jpg") },
  { id: 4, name: "Mũ bảo hiểm thời trang", price: "150.000đ", image: require("../../assets/images/Doreamon/hat.jpg") },
  { id: 5, name: "Đồng hồ trẻ em", price: "280.000đ", image: require("../../assets/images/Doreamon/watch.jpg") },
  { id: 6, name: "Áo khoác gió", price: "350.000đ", image: require("../../assets/images/Doreamon/khoac.jpg") },
  { id: 7, name: "Vở Doraemon", price: "20.000đ", image: require("../../assets/images/Doreamon/book.jpg") },
  { id: 8, name: "Bút chì Doraemon", price: "15.000đ", image: require("../../assets/images/Doreamon/butchi.jpg") },
  { id: 9, name: "Túi đeo chéo", price: "220.000đ", image: require("../../assets/images/Doreamon/tui.jpg") },
];

const Shop = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Doraemon Shop</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {products.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Doraemon Store</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#FFD93D",
    paddingVertical: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  card: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 6, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    flexGrow: 1,
    height: 200, 
    justifyContent: "space-between",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
 name: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,          
    height: 36,              
    overflow: "hidden",      
 },
  price: {
    color: "red",
    fontWeight: "bold",
    marginTop: 4,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#2F80ED",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  footer: {
    backgroundColor: "#FFD1D1",
    alignItems: "center",
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#444",
  },
});

export default Shop;