import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import axios from "axios";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface DonationRequest {
  _id: string;
  recipientName: string;
  donorName: string;
  donorEmail: string;
  bloodGroup: string;
  hospitalName: string;
  donationStatus: string;
  donationDate: string;
  donationTime: string;
}

const AdminDonationManagement = () => {
  const navigation = useNavigation();
  const [inProgressRequests, setInProgressRequests] = useState<DonationRequest[]>([]);
  const [historyRequests, setHistoryRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://webapp-delta-orpin.vercel.app";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/public-donation-requests`);
      const inProgress = res.data.filter((req: DonationRequest) => req.donationStatus === "inprogress");
      const history = res.data.filter((req: DonationRequest) => req.donationStatus === "done");
      setInProgressRequests(inProgress);
      setHistoryRequests(history);
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to fetch donation records.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const message = status === 'done' 
      ? "Is this donation successfully completed?" 
      : "Do you want to cancel this progress?";
    
    Alert.alert("Confirm Update", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          try {
            await axios.patch(`${API_URL}/admin/update-status/${id}`, { status });
            Alert.alert("Updated", `Status changed to ${status}.`);
            fetchRequests(); 
          } catch (error) {
            Alert.alert("Error", "Action failed.");
          }
        },
      },
    ]);
  };

  const renderInProgressItem = (item: DonationRequest) => (
    <View key={item._id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodText}>{item.bloodGroup}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.recipientName}>{item.recipientName}</Text>
          <Text style={styles.donorInfo}>
            <FontAwesome5 name="user-alt" size={10} color="#666" /> Donor: {item.donorName}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <MaterialCommunityIcons name="hospital-building" size={14} color="#ef4444" />
        <Text style={styles.hospitalText}>{item.hospitalName}</Text>
      </View>
      {/* Corrected: Using View instead of div */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.doneBtn]} 
          onPress={() => handleStatusUpdate(item._id, "done")}
        >
          <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.cancelBtn]} 
          onPress={() => handleStatusUpdate(item._id, "canceled")}
        >
          <MaterialCommunityIcons name="close-circle" size={16} color="#666" />
          <Text style={[styles.btnText, { color: '#666' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryItem = (item: DonationRequest) => (
    <View key={item._id} style={[styles.card, styles.historyCard]}>
      <View style={styles.historyGrid}>
        <View style={styles.historyCol}>
          <Text style={styles.label}>RECIPIENT</Text>
          <Text style={styles.historyName}>{item.recipientName}</Text>
          <Text style={styles.historyBlood}>{item.bloodGroup}</Text>
        </View>
        <View style={styles.historyCol}>
          <Text style={styles.label}>HERO DONOR</Text>
          <Text style={styles.historyName}>{item.donorName}</Text>
          <Text style={styles.historyEmail}>{item.donorEmail}</Text>
        </View>
      </View>
      <View style={styles.historyFooter}>
        <Text style={styles.historyDetails}>
          <MaterialCommunityIcons name="calendar-clock" size={12} /> {item.donationDate} | {item.donationTime}
        </Text>
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>COMPLETED</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text style={styles.loaderText}>Loading records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* --- Sticky Header with Back Button --- */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> Management</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Review and update blood <Text style={styles.boldText}>donation requests</Text>
        </Text>
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View style={styles.contentWrapper}>
            <Text style={styles.sectionTitle}>
              IN-PROGRESS <Text style={{ color: "#ef4444" }}>DONATIONS</Text>
            </Text>
            {inProgressRequests.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No active donation in progress.</Text>
              </View>
            ) : (
              inProgressRequests.map(renderInProgressItem)
            )}

            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>
                PREVIOUS <Text style={{ color: "#3b82f6" }}>HISTORY</Text>
              </Text>
              {historyRequests.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No historical data available yet.</Text>
                </View>
              ) : (
                historyRequests.map(renderHistoryItem)
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loaderText: { marginTop: 10, color: "#666", fontWeight: "600" },
  
  stickyHeader: {
    backgroundColor: "#d32f2f",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ? StatusBar.currentHeight + 15 : 50) : 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 1000,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { marginTop: 4, color: "#ffcdd2", fontSize: 13, marginLeft: 52 },
  boldText: { fontWeight: "bold", color: "#fff" },

  contentWrapper: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#1F2937", marginBottom: 15, letterSpacing: 0.5, textTransform: 'uppercase' },
  emptyBox: { padding: 20, backgroundColor: '#fff', borderRadius: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  emptyText: { color: "#9CA3AF", fontStyle: "italic" },
  
  card: { backgroundColor: "#fff", borderRadius: 22, padding: 18, marginBottom: 16, elevation: 4, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  bloodBadge: { backgroundColor: "#fee2e2", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  bloodText: { color: "#ef4444", fontWeight: "900", fontSize: 13 },
  recipientName: { fontSize: 17, fontWeight: "bold", color: "#1f2937" },
  donorInfo: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  detailsRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  hospitalText: { fontSize: 12, color: "#9CA3AF", marginLeft: 6, fontStyle: "italic" },
  
  actionRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 15 },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 14 },
  doneBtn: { backgroundColor: "#10B981" },
  cancelBtn: { backgroundColor: "#F3F4F6" },
  btnText: { color: "#fff", fontSize: 12, fontWeight: "bold", marginLeft: 6, textTransform: "uppercase" },

  historySection: { borderTopWidth: 1, borderTopColor: "#E5E7EB", marginTop: 30, paddingTop: 20 },
  historyCard: { backgroundColor: "#fff", borderLeftWidth: 5, borderLeftColor: "#3b82f6" },
  historyGrid: { flexDirection: "row", justifyContent: "space-between" },
  historyCol: { flex: 1 },
  label: { fontSize: 9, fontWeight: "900", color: "#9CA3AF", letterSpacing: 0.8, marginBottom: 4 },
  historyName: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  historyBlood: { fontSize: 12, color: "#ef4444", fontWeight: "bold" },
  historyEmail: { fontSize: 10, color: "#9CA3AF" },
  historyFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
  historyDetails: { fontSize: 11, color: "#6B7280", fontWeight: "500" },
  completedBadge: { backgroundColor: "#dcfce7", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  completedText: { color: "#166534", fontSize: 9, fontWeight: "900" }
});

export default AdminDonationManagement;