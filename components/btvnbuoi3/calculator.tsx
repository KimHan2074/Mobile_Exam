import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

const Calculator = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState<
    "add" | "sub" | "mul" | "div" | "compare" | null
  >(null);
  const [result, setResult] = useState<string | null>(null);

  const inputARef = useRef<TextInput>(null);
  const inputBRef = useRef<TextInput>(null);

  const handleCalculate = () => {
    // kiểm tra trống
    if (a.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập số a!");
      inputARef.current?.focus();
      return;
    }
    if (b.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập số b!");
      inputBRef.current?.focus();
      return;
    }

    // kiểm tra không phải số (nhập chữ)
    if (isNaN(Number(a)) || isNaN(Number(b))) {
      Alert.alert("Lỗi", "Giá trị nhập phải là số!");
      setA("");
      setB("");
      setResult(null);
      inputARef.current?.focus();
      return;
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (!operation) {
      Alert.alert("Lỗi", "Vui lòng chọn phép toán!");
      return;
    }

    let resText = "";

    switch (operation) {
      case "add":
        resText = `Kết quả: ${numA} + ${numB} = ${(numA + numB).toFixed(2)}`;
        break;
      case "sub":
        resText = `Kết quả: ${numA} - ${numB} = ${(numA - numB).toFixed(2)}`;
        break;
      case "mul":
        resText = `Kết quả: ${numA} × ${numB} = ${(numA * numB).toFixed(2)}`;
        break;
      case "div":
        if (numB === 0) {
          Alert.alert("Lỗi", "Không thể chia cho 0!");
          inputBRef.current?.focus();
          return;
        }
        resText = `Kết quả: ${numA} ÷ ${numB} = ${(numA / numB).toFixed(2)}`;
        break;
      case "compare":
        if (numA > numB) resText = `${numA} lớn hơn ${numB}`;
        else if (numA < numB) resText = `${numA} nhỏ hơn ${numB}`;
        else resText = `${numA} bằng ${numB}`;
        break;
      default:
        resText = "";
    }

    setResult(resText);
  };

  const renderRadio = (label: string, value: any) => (
    <TouchableOpacity
      key={value}
      style={styles.radioContainer}
      onPress={() => setOperation(value)}
    >
      <View style={styles.radioCircle}>
        {operation === value && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculator App</Text>
      <Text style={styles.subtitle}>Nhập hai số và chọn phép toán</Text>

      <TextInput
        ref={inputARef}
        style={styles.input}
        placeholder="Nhập số a"
        keyboardType="default"
        value={a}
        onChangeText={setA}
      />
      <TextInput
        ref={inputBRef}
        style={styles.input}
        placeholder="Nhập số b"
        keyboardType="default"
        value={b}
        onChangeText={setB}
      />

      <View style={styles.radioGroup}>
        {renderRadio("Cộng", "add")}
        {renderRadio("Trừ", "sub")}
        {renderRadio("Nhân", "mul")}
        {renderRadio("Chia", "div")}
        {renderRadio("So sánh", "compare")}
      </View>

      <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
        <Text style={styles.calcButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#80A1BA",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#91C4C3",
    marginBottom: 20,
  },
  input: {
    width: "85%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#91C4C3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#91C4C3",
  },
  radioLabel: {
    fontSize: 15,
    color: "#333",
  },
  calcButton: {
    backgroundColor: "#91C4C3",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calcButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultContainer: {
    marginTop: 25,
    width: "85%",
    backgroundColor: "#e9f3ff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cce0ff",
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#80A1BA",
  },
});

export default Calculator;
