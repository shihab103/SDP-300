import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#ff4d4d", dark: "#7a0000" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.headerImage}
          contentFit="contain"
        />
      }
    >
      {/* App Title */}
      <ThemedView style={styles.container}>
        <Text style={styles.title}>🩸 Blood Donation App</Text>
        <Text style={styles.subtitle}>
          Save lives by donating blood or finding donors near you.
        </Text>
      </ThemedView>

      {/* Action Cards */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Become a Donor</Text>
        <Text style={styles.cardText}>
          Register yourself and help people in emergency situations.
        </Text>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.btnText}>Register Now</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Already a Member?</Text>
        <Text style={styles.cardText}>
          Login to manage donation requests and your profile.
        </Text>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnText}>Login</Text>
        </Pressable>
      </View>

      {/* Info Section */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ❤️ One donation can save up to three lives.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d90429",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
    color: "#555",
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: "#e63946",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryBtn: {
    backgroundColor: "#457b9d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  infoBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ffe5e5",
    borderRadius: 12,
    alignItems: "center",
  },

  infoText: {
    color: "#b00020",
    fontWeight: "500",
  },

  headerImage: {
    height: 180,
    width: 280,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});