import React, { useState, useContext } from "react";
import {
  ScrollView,
  View,
 Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../src/Provider/AuthContext";

export default function Login() {
  const { loginUser }: any = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    // ✅ validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Firebase login
      await loginUser(email, password);

      Alert.alert("Success", "Login Successful ✅");

      // replace so user can't go back to login
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🩸 Blood Donor Login</Text>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={formData.email}
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={formData.password}
        onChangeText={(v) => handleChange("password", v)}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>
          Don't have an account? Register
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
    color: "#d90429",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#e63946",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  registerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#457b9d",
    fontWeight: "500",
  },
});