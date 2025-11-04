import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageSourcePropType,
} from "react-native";

const Shop = ({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: ImageSourcePropType;
}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>

      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );
};


const ShopComponent = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Doraemon Shop</Text>
      </View>

      {/* Danh sách sản phẩm */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        <Shop
          name="Giày thể thao"
          price="250.000đ"
          image={require("../../assets/images/Doreamon/shoesDRM.jpg")}
        />
        <Shop
          name="Áo thun Doraemon"
          price="180.000đ"
          image={require("../../assets/images/Doreamon/aothun.jpg")}
        />
        <Shop
          name="Balo học sinh"
          price="320.000đ"
          image={require("../../assets/images/Doreamon/balo.jpg")}
        />
        <Shop
          name="Mũ bảo hiểm thời trang"
          price="150.000đ"
          image={require("../../assets/images/Doreamon/hat.jpg")}
        />
        <Shop
          name="Đồng hồ trẻ em"
          price="280.000đ"
          image={require("../../assets/images/Doreamon/watch.jpg")}
        />
        <Shop
          name="Áo khoác gió"
          price="350.000đ"
          image={require("../../assets/images/Doreamon/khoac.jpg")}
        />
        <Shop
          name="Vở Doraemon"
          price="20.000đ"
          image={require("../../assets/images/Doreamon/book.jpg")}
        />
        <Shop
          name="Bút chì Doraemon"
          price="15.000đ"
          image={require("../../assets/images/Doreamon/butchi.jpg")}
        />
        <Shop
          name="Túi đeo chéo"
          price="220.000đ"
          image={require("../../assets/images/Doreamon/tui.jpg")}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Doraemon Store</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  header: {
    backgroundColor: "#FFD93D",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0C93D",
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#333333" 
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  card: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-between",
    height: 200,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    height: 36,
    overflow: "hidden",
    color: "#333333",
  },
  productPrice: {
    color: "#E63946",
    fontWeight: "bold",
    marginTop: 4,
    fontSize: 13,
  },
  buyButton: {
    backgroundColor: "#2F80ED",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  footer: {
    backgroundColor: "#FFD1D1",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5B5B5",
  },
  footerText: {
    fontSize: 14,
    color: "#444444",
  },
});

export default ShopComponent;
