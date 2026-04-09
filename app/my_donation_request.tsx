import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../src/Provider/AuthContext";

interface DonationRequest {
  _id: string;
  recipientName: string;
  recipientDistrict: string;
  recipientUpazila: string;
  bloodGroup: string;
  donationDate: string;
  donationTime: string;
  donationStatus: string;
}

const MyDonationRequests = () => {
  const { user }: any = useContext(AuthContext);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://webapp-delta-orpin.vercel.app";

  useEffect(() => {
    if (user?.email) {
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/my-donation-requests?email=${user?.email}`
      );
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return { bg: "#fef3c7", text: "#b45309" };
      case "inprogress": return { bg: "#dbeafe", text: "#1d4ed8" };
      case "done": return { bg: "#dcfce7", text: "#15803d" };
      case "canceled": return { bg: "#fee2e2", text: "#b91c1c" };
      default: return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  const renderRequestItem = ({ item }: { item: DonationRequest }) => {
    const statusColors = getStatusStyle(item.donationStatus);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.bloodBadge}>
            <Text style={styles.bloodText}>{item.bloodGroup}</Text>
          </View>
          {/* Style Object Fix */}
          <View style={[styles.statusBadgeBase, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusTextBase, { color: statusColors.text }]}>
              {item.donationStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.recipientName}>{item.recipientName}</Text>
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{item.recipientDistrict}, {item.recipientUpazila}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-clock" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{item.donationDate} at {item.donationTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.stickyHeader}>
        <Text style={styles.headerTitle}>🩸 My Requests</Text>
        <Text style={styles.headerSubtitle}>
          Track your blood <Text style={styles.boldText}>donation posts</Text>
        </Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#d32f2f" />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequestItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No donation requests found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  stickyHeader: {
    backgroundColor: "#d32f2f",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40) : 60,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    zIndex: 1000,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { marginTop: 4, color: "#ffcdd2", fontSize: 14 },
  boldText: { fontWeight: "bold", color: "#fff" },
  
  listContainer: { padding: 20, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bloodBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloodText: { color: "#ef4444", fontWeight: "bold", fontSize: 14 },
  
  // স্টাইল ফাংশনের পরিবর্তে বেস স্টাইল ব্যবহার
  statusBadgeBase: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTextBase: {
    fontSize: 10,
    fontWeight: "900",
  },
  
  recipientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: "#9CA3AF",
    fontSize: 16,
  },
});

export default MyDonationRequests;