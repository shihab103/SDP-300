import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const MenuButton = ({ title, screen }: { title: string; screen: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => screen && router.push(screen)}
    >
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🩸 Blood Donation App</Text>
      <Text style={styles.subtitle}>
        Save Life, Donate Blood
      </Text>

      <View style={styles.menuContainer}>
        <MenuButton title="🏠 Home" screen="/home" />
        <MenuButton title="🔍 Search Donor" screen="/search-donor" />
        <MenuButton title="📢 Blood Donation Request" screen="/donation-request" />
        <MenuButton title="ℹ️ About" screen="/about" />
        <MenuButton title="📊 Dashboard" screen="/dashboard" />

        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace("/login")}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 30,
  },
  menuContainer: {
    width: "90%",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  logoutBtn: {
    backgroundColor: "#d32f2f",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});