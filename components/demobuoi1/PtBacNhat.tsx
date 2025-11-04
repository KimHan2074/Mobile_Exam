// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

// const PtBacNhat = () => {
//   const [a, setA] = useState("");
//   const [b, setB] = useState("");
//   const [result, setResult] = useState<string | null>(null);

//   const handleSolve = () => {
//     const numA = parseFloat(a);
//     const numB = parseFloat(b);

//     if (isNaN(numA) || isNaN(numB)) {
//       Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các số a và b!");
//       return;
//     }

//     if (numA === 0) {
//       if (numB === 0) {
//         setResult("Phương trình có vô số nghiệm");
//       } else {
//         setResult("Phương trình vô nghiệm");
//       }
//     } else {
//       const x = (-numB / numA).toFixed(2);
//       setResult(`Nghiệm x = ${x}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Giải phương trình bậc nhất: ax + b = 0</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Nhập a"
//         keyboardType="numeric"
//         value={a}
//         onChangeText={setA}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Nhập b"
//         keyboardType="numeric"
//         value={b}
//         onChangeText={setB}
//       />

//       <Button title="Giải Phương Trình" onPress={handleSolve} />

//       {result && <Text style={styles.result}>{result}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     width: "80%",
//     padding: 10,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   result: {
//     fontSize: 18,
//     marginTop: 20,
//     fontWeight: "600",
//   },
// });

// export default PtBacNhat;



import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";

const PtBacNhat = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // ref để điều hướng con trỏ nhập liệu khi lỗi
  const inputARef = useRef<TextInput>(null);
  const inputBRef = useRef<TextInput>(null);

  const handleSolve = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (a.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập giá trị a!");
      setA("");
      setB("");
      setResult(null);
      inputARef.current?.focus(); // Trỏ đến ô a
      return;
    }

    if (b.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập giá trị b!");
      setA("");
      setB("");
      setResult(null);
      inputBRef.current?.focus(); // Trỏ đến ô b
      return;
    }

    if (isNaN(numA) || isNaN(numB)) {
      Alert.alert("Lỗi", "Giá trị nhập phải là số!");
      setA("");
      setB("");
      setResult(null);
      inputARef.current?.focus();
      return;
    }

    if (numA === 0) {
      if (numB === 0) {
        setResult("Phương trình có vô số nghiệm");
      } else {
        setResult("Phương trình vô nghiệm");
      }
    } else {
      const x = (-numB / numA).toFixed(2);
      setResult(`Nghiệm x = ${x}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình bậc nhất: ax + b = 0</Text>

      <TextInput
        ref={inputARef}
        style={styles.input}
        placeholder="Nhập a"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />
      <TextInput
        ref={inputBRef}
        style={styles.input}
        placeholder="Nhập b"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSolve}>
        <Text style={styles.buttonText}>Giải Phương Trình</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultBox}>
            <Text style={styles.result}>{result}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "80%",
    padding: 10,
    marginBottom: 10,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#647FBC",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  resultContainer: {
    marginTop: 30,
    width: "85%",
    backgroundColor: "#c8d8d6ff", // màu nền View lớn
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultBox: {
    backgroundColor: "#b6cfcbff", // màu View nhỏ chứa result
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  result: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#647FBC",
  },
});

export default PtBacNhat;
