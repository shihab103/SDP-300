import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "@/src/Provider/AuthContext";

const upazilasData = require("../assets/data/upazilas.json");
const { width } = Dimensions.get("window");

interface DonationRequest {
  _id: string;
  bloodGroup: string;
  recipientName: string;
  donationStatus: 'pending' | 'inprogress' | 'done';
  hospitalName: string;
  recipientUpazila: string;
  donationDate: string;
  donationTime?: string;
  donorEmail?: string;
  requesterEmail?: string;
}

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTANCE_RANGES = [
  { label: "All Distance", value: "All" },
  { label: "Under 20 KM", value: 20 },
  { label: "Under 50 KM", value: 50 },
  { label: "Under 100 KM", value: 100 },
];

const calculateDistance = (lat1: string, lon1: string, lat2: string, lon2: string) => {
  const l1 = parseFloat(lat1);
  const ln1 = parseFloat(lon1);
  const l2 = parseFloat(lat2);
  const ln2 = parseFloat(lon2);
  if (isNaN(l1) || isNaN(ln1) || isNaN(l2) || isNaN(ln2)) return null;
  const R = 6371; 
  const dLat = (l2 - l1) * Math.PI / 180;
  const dLon = (ln2 - ln1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(l1 * Math.PI / 180) * Math.cos(l2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); 
};

const checkDonationEligibility = (requests: DonationRequest[], userEmail: string) => {
  const doneDonations = requests.filter(r => r.donorEmail === userEmail && r.donationStatus === "done");
  if (doneDonations.length === 0) return { eligible: true };
  const latest = doneDonations.sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())[0];
  const lastDate = new Date(latest.donationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 90) return { eligible: false, remainingDays: 90 - diffDays };
  return { eligible: true };
};

export default function FindDonorScreen() {
  const auth = useContext(AuthContext);
  const currentUserEmail = auth?.user?.email;

  // States
  const [userData, setUserData] = useState<any>(null);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [filterGroup, setFilterGroup] = useState<string>("All");
  const [filterDistance, setFilterDistance] = useState<string | number>("All");
  const [loading, setLoading] = useState<boolean>(true);

  const upazilaList = upazilasData.find((item: any) => item.name === "upazilas")?.data || [];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const apiUrl = "https://webapp-delta-orpin.vercel.app";

  useEffect(() => {
    if (currentUserEmail) {
      fetchInitialData();
    }
  }, [currentUserEmail]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch User and Requests in parallel
      const [userRes, requestsRes] = await Promise.all([
        axios.get(`${apiUrl}/users/${currentUserEmail}`),
        axios.get<DonationRequest[]>(`${apiUrl}/public-donation-requests`)
      ]);
      setUserData(userRes.data);
      setRequests(requestsRes.data);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (err) {
      Alert.alert("Error", "Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get<DonationRequest[]>(`${apiUrl}/public-donation-requests`);
      setRequests(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to refresh requests.");
    }
  };

  const handleDonate = async (id: string) => {
    if (!userData) return;
    const eligibility = checkDonationEligibility(requests, userData.email);

    if (!eligibility.eligible) {
      Alert.alert("Not Eligible Yet", `You can donate again after ${eligibility.remainingDays} days.`);
      return;
    }

    Alert.alert("Confirm", "Are you sure you want to donate to this patient?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Donate",
        onPress: async () => {
          try {
            await axios.patch(`${apiUrl}/donation-request/${id}`, {
              donationStatus: "inprogress",
              donorName: userData.name,
              donorEmail: userData.email,
            });
            Alert.alert("Thank You", "Your donation offer has been recorded.");
            fetchRequests();
          } catch (error) {
            Alert.alert("Error", "Action failed. Please try again.");
          }
        }
      }
    ]);
  };

  const handleCancel = async (id: string) => {
    try {
      await axios.patch(`${apiUrl}/cancel-donation/${id}`);
      Alert.alert("Cancelled", "Your donation offer has been cancelled.");
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "Failed to cancel offer.");
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (req.donationStatus === "done") return false;
    const matchesGroup = filterGroup === "All" || req.bloodGroup === filterGroup;
    
    let matchesDistance = true;
    if (filterDistance !== "All" && userData) {
      const userGeo = upazilaList.find((u: any) => u.name === userData.upazilaName);
      const reqGeo = upazilaList.find((u: any) => u.name === req.recipientUpazila);
      if (userGeo && reqGeo) {
        const dist = calculateDistance(userGeo.lat, userGeo.lon, reqGeo.lat, reqGeo.lon);
        matchesDistance = dist !== null && dist <= (filterDistance as number);
      } else {
        matchesDistance = false;
      }
    }
    return matchesGroup && matchesDistance;
  });

  const renderRequestCard = ({ item }: { item: DonationRequest }) => {
    if (!userData) return null;
    const userGeo = upazilaList.find((u: any) => u.name === userData.upazilaName);
    const reqGeo = upazilaList.find((u: any) => u.name === item.recipientUpazila);
    const distance = (userGeo && reqGeo) ? calculateDistance(userGeo.lat, userGeo.lon, reqGeo.lat, reqGeo.lon) : null;

    const isDonor = item.donorEmail === userData.email;
    const isInProgress = item.donationStatus === "inprogress";
    const isOwnRequest = item.requesterEmail === userData.email;

    return (
      <View style={styles.card}>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodBadgeText}>{item.bloodGroup}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.patientName}>{item.recipientName}</Text>
          {distance !== null && (
            <View style={styles.distanceTag}>
              <Ionicons name="navigate" size={12} color="#2196F3" />
              <Text style={styles.distanceText}>{distance} KM Away</Text>
            </View>
          )}
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: item.donationStatus === 'pending' ? '#FFC107' : '#2196F3' }]} />
            <Text style={styles.statusText}>{item.donationStatus.toUpperCase()}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoBoxFull}>
              <Ionicons name="business" size={16} color="#d32f2f" />
              <Text style={styles.infoTextMain}>{item.hospitalName}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Ionicons name="location" size={14} color="#666" />
                <Text style={styles.infoTextSmall}>{item.recipientUpazila}</Text>
              </View>
              <View style={styles.infoBox}>
                <Ionicons name="calendar" size={14} color="#666" />
                <Text style={styles.infoTextSmall}>{item.donationDate}</Text>
              </View>
            </View>
          </View>
          {isOwnRequest ? (
            <View style={styles.ownRequestTag}>
              <Text style={styles.ownRequestText}>Your Own Request</Text>
            </View>
          ) : isInProgress && isDonor ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item._id)}>
              <Text style={styles.cancelBtnText}>Cancel Offer ❌</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              disabled={isInProgress}
              style={[styles.donateBtn, isInProgress && { backgroundColor: '#ccc' }]}
              onPress={() => handleDonate(item._id)}
            >
              <Text style={styles.donateBtnText}>
                {isInProgress ? "Taken by Hero" : "Donate Now ❤️"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!currentUserEmail) {
    return <View style={styles.center}><Text>Please login to see requests.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blood <Text style={{color: '#d32f2f'}}>Network</Text></Text>
        <TouchableOpacity onPress={fetchInitialData} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {BLOOD_GROUPS.map((group) => (
            <TouchableOpacity
              key={group}
              onPress={() => setFilterGroup(group)}
              style={[styles.chip, filterGroup === group && styles.chipActive]}
            >
              <Text style={[styles.chipText, filterGroup === group && styles.chipTextActive]}>{group}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterContainer, { marginTop: 10 }]}>
          {DISTANCE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.label}
              onPress={() => setFilterDistance(range.value)}
              style={[styles.chip, filterDistance === range.value && styles.chipActiveBlue]}
            >
              <Text style={[styles.chipText, filterDistance === range.value && styles.chipTextActive]}>{range.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#d32f2f" /></View>
      ) : (
        <Animated.FlatList
          data={filteredRequests}
          renderItem={renderRequestCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          style={{ opacity: fadeAnim }}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="blood-bag" size={80} color="#eee" />
              <Text style={{color: '#999', marginTop: 10}}>No requests found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFD" },
  header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#333' },
  refreshBtn: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 12 },
  filterContainer: { paddingHorizontal: 20, alignItems: 'center' },
  chip: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12, backgroundColor: '#f5f5f5', marginRight: 8, borderWidth: 1, borderColor: '#eee' },
  chipActive: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
  chipActiveBlue: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  chipText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  chipTextActive: { color: '#fff' },
  list: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 25, marginBottom: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, overflow: 'hidden' },
  bloodBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#d32f2f', paddingHorizontal: 18, paddingVertical: 10, borderBottomLeftRadius: 25, zIndex: 10 },
  bloodBadgeText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  cardContent: { padding: 20 },
  patientName: { fontSize: 18, fontWeight: '900', color: '#333', textTransform: 'uppercase' },
  distanceTag: { flexDirection: 'row', alignItems: 'center', marginTop: 5, backgroundColor: '#e3f2fd', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  distanceText: { fontSize: 10, color: '#2196F3', fontWeight: 'bold', marginLeft: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 9, fontWeight: 'bold', color: '#999', letterSpacing: 1 },
  infoContainer: { marginBottom: 15 },
  infoBoxFull: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f5', padding: 10, borderRadius: 12, marginBottom: 8 },
  infoTextMain: { marginLeft: 8, fontWeight: 'bold', color: '#444', fontSize: 13 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 8, borderRadius: 10, width: '48%' },
  infoTextSmall: { marginLeft: 5, fontSize: 10, fontWeight: '600', color: '#777' },
  donateBtn: { backgroundColor: '#d32f2f', padding: 14, borderRadius: 15, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  cancelBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d32f2f', padding: 14, borderRadius: 15, alignItems: 'center' },
  cancelBtnText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 },
  ownRequestTag: { padding: 14, backgroundColor: '#f0f0f0', borderRadius: 15, alignItems: 'center' },
  ownRequestText: { color: '#999', fontWeight: 'bold', fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }
});