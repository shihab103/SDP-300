import React, { useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Expo-র ডিফল্ট আইকন
import { AuthContext } from "../src/Provider/AuthContext";

// Assets
import loginAnimation from "../assets/loginAnimation.json";

export default function Login() {
  const { loginUser }: any = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      // Firebase Login logic
      await loginUser(formData.email, formData.password);
      
      Alert.alert("Success", "Login Successful ✅");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Lottie Animation Section */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={loginAnimation}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        {/* Login Card Section */}
        <View style={styles.card}>
          <Text style={styles.title}>Login Now</Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <MaterialCommunityIcons name="email-outline" size={22} color="#94a3b8" />
            <TextInput
              placeholder="Enter email"
              style={styles.input}
              value={formData.email}
              onChangeText={(v) => setFormData({ ...formData, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <MaterialCommunityIcons name="lock-outline" size={22} color="#94a3b8" />
            <TextInput
              placeholder="Enter password"
              style={styles.input}
              value={formData.password}
              onChangeText={(v) => setFormData({ ...formData, password: v })}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity style={styles.forgotContainer}>
             <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Remember Me */}
          <TouchableOpacity 
            style={styles.checkboxRow} 
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxSelected]}>
              {rememberMe && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>Remember Me</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Login Now</Text>
            )}
          </TouchableOpacity>

          <View style={styles.socialContainer}>
             <Text style={styles.orText}>Or login with social</Text>
             {/* Social Buttons Component goes here */}
          </View>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>You haven't registered yet? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.linkText}>Registration</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    minHeight: "100%",
  },
  lottieContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 10,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 35,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#e2e8f0",
    marginBottom: 20,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -10,
  },
  forgotText: {
    fontSize: 13,
    color: "#64748b",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    borderColor: "#e63946",
    backgroundColor: "#e63946",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#475569",
  },
  loginBtn: {
    backgroundColor: "#e63946",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  socialContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  orText: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    fontSize: 14,
    color: "#64748b",
  },
  linkText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "700",
  },
});