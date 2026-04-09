import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { AuthContext } from "../src/Provider/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = "https://webapp-delta-orpin.vercel.app";

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axios
        .get(`${API_URL}/get-user-role?email=${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Role Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [user?.email]);

  const MenuCard = ({
    title,
    subtitle,
    screen,
    icon,
  }: {
    title: string;
    subtitle: string;
    screen: any;
    icon: any;
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(screen)}
      activeOpacity={0.7}
    >
      <View style={styles.cardIconBox}>
        <MaterialCommunityIcons name={icon} size={26} color="#d32f2f" />
      </View>
      <View style={styles.cardTextContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text style={styles.loaderText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor="#b71c1c" barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {role === "admin" ? "🛡️ Admin Panel" : "🩸 Donor Dashboard"}
        </Text>
        <Text style={styles.headerSubtitle}>
          Welcome back, <Text style={styles.boldText}>{role?.toUpperCase()}</Text>
        </Text>
      </View>

      <View style={styles.menuWrapper}>
        {/* কমন রুট: প্রোফাইল */}
        <MenuCard
          title="My Profile"
          subtitle="View and update profile"
          screen="/profile"
          icon="account-circle-outline"
        />

        {/* Admin Only Routes */}
        {role === "admin" && (
          <>
            <MenuCard
              title="All Users"
              subtitle="Manage all registered users"
              screen="/allusers"
              icon="account-group-outline"
            />
            <MenuCard
              title="Donation Management"
              subtitle="Control all blood requests"
              screen="/donation-management"
              icon="clipboard-list-outline"
            />
          </>
        )}

        {/* Donor Only Routes */}
        {role === "donor" && (
          <>
            <MenuCard
              title="Donation Request"
              subtitle="Create a new blood request"
              screen="/create-donation-request"
              icon="hand-heart-outline"
            />
            <MenuCard
              title="My Donation Requests"
              subtitle="View your request history"
              screen="/my-donation-requests"
              icon="history"
            />
          </>
        )}

        <MenuCard
          title="Search Donor"
          subtitle="Find donors near you"
          screen="/search-donor"
          icon="magnify"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, color: "#666", fontWeight: "500" },
  header: {
    backgroundColor: "#d32f2f",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 5,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { marginTop: 5, color: "#ffcdd2", fontSize: 14 },
  boldText: { fontWeight: "bold", color: "#fff" },
  menuWrapper: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardIconBox: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 16,
  },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1f2937" },
  cardSubtitle: { marginTop: 2, fontSize: 12, color: "#6b7280" },
});