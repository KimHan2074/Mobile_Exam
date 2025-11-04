// import React, { useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Keyboard,
//   Alert,
// } from "react-native";

// const Calculator_BMI = () => {
//   const [height, setHeight] = useState("");
//   const [weight, setWeight] = useState("");
//   const [bmi, setBmi] = useState("");
//   const [category, setCategory] = useState("");
//   const [color, setColor] = useState("#000");
//   const [idealRange, setIdealRange] = useState("");
//   const [suggestion, setSuggestion] = useState("");

//   const heightRef = useRef<TextInput>(null);
//   const weightRef = useRef<TextInput>(null);

//   // Hàm reset & focus lại ô height
//   const resetAndFocus = () => {
//     setHeight("");
//     setWeight("");
//     setTimeout(() => {
//       heightRef.current?.focus(); // focus vào ô đầu tiên
//     }, 100);
//   };

//   const validateInput = () => {
//     if (!height || !weight) {
//       Alert.alert("Input Error", "Please enter both height and weight!", [
//         { text: "OK", onPress: resetAndFocus },
//       ]);
//       return false;
//     }

//     const h = parseFloat(height);
//     const w = parseFloat(weight);

//     if (isNaN(h) || isNaN(w)) {
//       Alert.alert("Input Error", "Height and weight must be valid numbers!", [
//         { text: "OK", onPress: resetAndFocus },
//       ]);
//       return false;
//     }

//     if (h <= 0 || w <= 0) {
//       Alert.alert("Input Error", "Height and weight must be greater than 0!", [
//         { text: "OK", onPress: resetAndFocus },
//       ]);
//       return false;
//     }

//     if (h > 300 || w > 500) {
//       Alert.alert("Input Error", "Please enter realistic values!", [
//         { text: "OK", onPress: resetAndFocus },
//       ]);
//       return false;
//     }

//     return true;
//   };

//   const calculateBMI = () => {
//     if (!validateInput()) return;

//     const h = parseFloat(height);
//     const heightInMeters = h > 3 ? h / 100 : h;
//     const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
//     const bmiFixed = bmiValue.toFixed(1);
//     setBmi(bmiFixed);

//     // Tính khoảng cân nặng lý tưởng
//     const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
//     const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);
//     setIdealRange(`${minIdeal} kg – ${maxIdeal} kg`);

//     let bmiCategory = "";
//     let bmiColor = "";
//     let advice = "";

//     if (bmiValue < 18.5) {
//       bmiCategory = "Underweight";
//       bmiColor = "#6D94C5";
//       advice =
//         "👉 Try to eat more nutrient-rich meals, increase protein intake, and do strength training to gain healthy weight.";
//     } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
//       bmiCategory = "Normal";
//       bmiColor = "#67C090";
//       advice =
//         "💪 You’re at a healthy weight! Maintain it with a balanced diet and regular exercise.";
//     } else if (bmiValue >= 25 && bmiValue <= 29.9) {
//       bmiCategory = "Overweight";
//       bmiColor = "#E2A16F";
//       advice =
//         "🚶‍♀️ Consider eating more vegetables, reducing sugar and fat intake, and doing more cardio or sports.";
//     } else {
//       bmiCategory = "Obese";
//       bmiColor = "#ED3F27";
//       advice =
//         "⚠️ You should consult a doctor or nutritionist for a safe and gradual weight-loss plan.";
//     }

//     setCategory(bmiCategory);
//     setColor(bmiColor);
//     setSuggestion(advice);
//     Keyboard.dismiss();
//   };

//   const resetAll = () => {
//     setHeight("");
//     setWeight("");
//     setBmi("");
//     setCategory("");
//     setColor("#000");
//     setIdealRange("");
//     setSuggestion("");
//     heightRef.current?.focus();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🧮 BMI Calculator</Text>

//       <TextInput
//         ref={heightRef}
//         style={styles.input}
//         placeholder="Enter height (cm or m)"
//         keyboardType="numeric"
//         value={height}
//         onChangeText={setHeight}
//         returnKeyType="next"
//         onSubmitEditing={() => weightRef.current?.focus()}
//       />

//       <TextInput
//         ref={weightRef}
//         style={styles.input}
//         placeholder="Enter weight (kg)"
//         keyboardType="numeric"
//         value={weight}
//         onChangeText={setWeight}
//       />

//       <TouchableOpacity style={styles.button} onPress={calculateBMI}>
//         <Text style={styles.buttonText}>Calculate</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.button, styles.resetButton]}
//         onPress={resetAll}
//       >
//         <Text style={styles.buttonText}>Reset</Text>
//       </TouchableOpacity>

//       {bmi && (
//         <View style={styles.resultContainer}>
//           <Text style={[styles.resultText, { color }]}>
//             Your BMI: {bmi}
//           </Text>
//           <Text style={[styles.resultCategory, { color }]}>{category}</Text>

//           <Text style={styles.idealText}>
//             💡 Ideal Weight Range: {idealRange}
//           </Text>

//           <Text style={styles.suggestionText}>{suggestion}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F6F8",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 30,
//     color: "#333",
//   },
//   input: {
//     width: "80%",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     textAlign: "center",
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#91C4C3",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//     marginTop: 10,
//     width: "60%",
//   },
//   resetButton: {
//     backgroundColor: "#D97D55",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   resultContainer: {
//     marginTop: 30,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 12,
//     width: "85%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   resultText: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   resultCategory: {
//     fontSize: 18,
//     marginTop: 8,
//     marginBottom: 10,
//   },
//   idealText: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   suggestionText: {
//     fontSize: 15,
//     color: "#333",
//     textAlign: "center",
//     lineHeight: 22,
//   },
// });

// export default Calculator_BMI;


import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";

const Calculator_BMI = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#000");
  const [idealRange, setIdealRange] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);

  const resetAndFocus = () => {
    setHeight("");
    setWeight("");
    setTimeout(() => heightRef.current?.focus(), 100);
  };

  const validateInput = () => {
    if (!height || !weight) {
      Alert.alert("Input Error", "Please enter both height and weight!", [
        { text: "OK", onPress: resetAndFocus },
      ]);
      return false;
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0 || h > 300 || w > 500) {
      Alert.alert("Input Error", "Please enter realistic positive numbers!", [
        { text: "OK", onPress: resetAndFocus },
      ]);
      return false;
    }

    return true;
  };

  const calculateBMI = () => {
    if (!validateInput()) return;

    const h = parseFloat(height);
    const heightInMeters = h > 3 ? h / 100 : h;
    const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    const bmiFixed = bmiValue.toFixed(1);
    setBmi(bmiFixed);

    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    setIdealRange(`${minIdeal} kg – ${maxIdeal} kg`);

    let bmiCategory = "";
    let bmiColor = "";
    let advice = "";

    if (bmiValue < 18.5) {
      bmiCategory = "Underweight";
      bmiColor = "#6D94C5";
      advice =
        "👉 Try to eat more nutrient-rich meals, increase protein intake, and do strength training to gain healthy weight.";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      bmiCategory = "Normal";
      bmiColor = "#67C090";
      advice =
        "💪 You’re at a healthy weight! Maintain it with a balanced diet and regular exercise.";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      bmiCategory = "Overweight";
      bmiColor = "#E2A16F";
      advice =
        "🚶‍♀️ Consider eating more vegetables, reducing sugar and fat intake, and doing more cardio or sports.";
    } else {
      bmiCategory = "Obese";
      bmiColor = "#ED3F27";
      advice =
        "⚠️ You should consult a doctor or nutritionist for a safe and gradual weight-loss plan.";
    }

    setCategory(bmiCategory);
    setColor(bmiColor);
    setSuggestion(advice);
    Keyboard.dismiss();
  };

  const resetAll = () => {
    setHeight("");
    setWeight("");
    setBmi("");
    setCategory("");
    setColor("#000");
    setIdealRange("");
    setSuggestion("");
    heightRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧮 BMI Calculator</Text>

      {/* --- FORM SECTION --- */}
      <View style={styles.formSection}>
        <TextInput
          ref={heightRef}
          style={styles.input}
          placeholder="Enter height (cm or m)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          returnKeyType="next"
          onSubmitEditing={() => weightRef.current?.focus()}
        />

        <TextInput
          ref={weightRef}
          style={styles.input}
          placeholder="Enter weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={calculateBMI}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetAll}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- RESULT SECTION --- */}
      <View style={styles.resultSection}>
        {bmi ? (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, { color }]}>
              Your BMI: {bmi}
            </Text>
            <Text style={[styles.resultCategory, { color }]}>{category}</Text>
            <Text style={styles.idealText}>
              💡 Ideal Weight Range: {idealRange}
            </Text>
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            👇 Enter your info above to see your BMI result
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  formSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  button: {
    backgroundColor: "#91C4C3",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: "#D97D55",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  resultSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  resultCategory: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 10,
  },
  idealText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  suggestionText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default Calculator_BMI;

