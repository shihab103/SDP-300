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

export default function Register() {
  const { createUser }: any = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { email, password, name, bloodGroup } = formData;

    // ✅ simple validation
    if (!name || !email || !password || !bloodGroup) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Firebase user create
      await createUser(email, password);

      Alert.alert("Success", "Registration Successful ✅");

      router.replace("/"); // go home
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🩸 Blood Donor Registration</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        onChangeText={(v) => handleChange("name", v)}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(v) => handleChange("password", v)}
      />

      <TextInput
        placeholder="Blood Group (A+, O-, etc)"
        style={styles.input}
        onChangeText={(v) => handleChange("bloodGroup", v)}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
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

  loginText: {
    marginTop: 18,
    textAlign: "center",
    color: "#457b9d",
    fontWeight: "500",
  },
});