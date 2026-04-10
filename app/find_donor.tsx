import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/src/Provider/AuthContext";

const FindDonor = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); 

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState("");
  const API_URL = "https://webapp-delta-orpin.vercel.app";

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/voluntary-donors`);
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
      Alert.alert("Error", "Could not fetch donor list.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBlood = (donor: any) => {
    Alert.alert(
      "Request Blood",
      `Send a request to ${donor.name} for ${donor.bloodGroup} blood?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Request", 
          onPress: () => Alert.alert("Success", "Your request has been sent!") 
        },
      ]
    );
  };

  const filteredDonors = filterGroup
    ? donors.filter((d: any) => d.bloodGroup === filterGroup)
    : donors;

  const renderDonorCard = ({ item }: { item: any }) => {
    const isCurrentUser = user?.email === item.email;

    return (
      <View style={styles.card}>
        {/* Blood Group Badge */}
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodBadgeText}>{item.bloodGroup}</Text>
        </View>

        <View style={styles.cardHeader}>
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.donorName}>
              {item.name} {isCurrentUser && <Text style={styles.youLabel}>(You)</Text>}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color="#94a3b8" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>
              {new Date(item.joinedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.requestBtn,
            isCurrentUser && styles.disabledBtn
          ]}
          disabled={isCurrentUser}
          onPress={() => handleRequestBlood(item)}
        >
          <Text style={[styles.requestBtnText, isCurrentUser && styles.disabledBtnText]}>
            {isCurrentUser ? "Your Profile" : "Request Blood"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Find a <Text style={{ color: "#ef4444" }}>Donor</Text></Text>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={["All", ...bloodGroups]}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFilterGroup(item === "All" ? "" : item)}
              style={[
                styles.filterChip,
                (filterGroup === item || (item === "All" && filterGroup === "")) && styles.activeFilterChip
              ]}
            >
              <Text style={[
                styles.filterChipText,
                (filterGroup === item || (item === "All" && filterGroup === "")) && styles.activeFilterChipText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : (
        <FlatList
          data={filteredDonors}
          keyExtractor={(item: any) => item._id}
          renderItem={renderDonorCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="database-search" size={60} color="#cbd5e1" />
              <Text style={styles.emptyText}>No donors found for this blood group.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: Platform.OS === "android" ? 50 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backBtn: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: "900", color: "#1e293b" },
  
  filterContainer: { paddingVertical: 15, backgroundColor: "#fff", paddingLeft: 20 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterChip: { backgroundColor: "#ef4444", borderColor: "#ef4444" },
  filterChipText: { color: "#64748b", fontWeight: "600" },
  activeFilterChipText: { color: "#fff" },

  listContent: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  bloodBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomLeftRadius: 20,
  },
  bloodBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: { width: 60, height: 60, borderRadius: 18, backgroundColor: "#f1f5f9" },
  headerText: { marginLeft: 15, flex: 1 },
  donorName: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  youLabel: { fontSize: 10, color: "#ef4444", fontWeight: "normal" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { fontSize: 12, color: "#94a3b8", marginLeft: 4 },

  infoBox: { borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 15, marginBottom: 20 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  infoLabel: { color: "#94a3b8", fontSize: 13 },
  infoValue: { color: "#475569", fontWeight: "600", fontSize: 13 },
  statusBadge: { backgroundColor: "#f0fdf4", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8 },
  statusText: { color: "#166534", fontWeight: "bold", fontSize: 10, textTransform: "uppercase" },

  requestBtn: {
    backgroundColor: "#fef2f2",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#f1f5f9" },
  requestBtnText: { color: "#ef4444", fontWeight: "bold", fontSize: 14 },
  disabledBtnText: { color: "#94a3b8" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyState: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 10, color: "#94a3b8", fontSize: 14, textAlign: "center" },
});

export default FindDonor;