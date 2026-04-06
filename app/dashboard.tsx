import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  const MenuCard = ({
    title,
    subtitle,
    screen,
  }: {
    title: string;
    subtitle: string;
    screen: any;
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(screen)}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🩸 Donor Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Welcome back! Ready to save lives today.
        </Text>
      </View>

      <View style={styles.menuWrapper}>
        <MenuCard
          title="Create Donation Request"
          subtitle="Request blood for a patient"
          screen="/donation-request"
        />

        <MenuCard
          title="My Requests"
          subtitle="View your donation history"
          screen="/my-requests"
        />

        <MenuCard
          title="Search Donor"
          subtitle="Find available donors"
          screen="/search-donor"
        />

        <MenuCard
          title="My Profile"
          subtitle="Update personal information"
          screen="/profile"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  header: {
    backgroundColor: "#d32f2f",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    marginTop: 8,
    color: "#ffeaea",
    fontSize: 15,
  },
  menuWrapper: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
  },
});