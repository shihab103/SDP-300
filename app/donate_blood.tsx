import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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

const { width } = Dimensions.get("window");

interface DonationRequest {
  _id: string;
  bloodGroup: string;
  recipientName: string;
  donationStatus: 'pending' | 'inprogress' | 'done';
  hospitalName: string;
  recipientUpazila: string;
  donationDate: string;
}

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function FindDonorScreen() {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [filterGroup, setFilterGroup] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const apiUrl = "https://webapp-delta-orpin.vercel.app";
      const res = await axios.get<DonationRequest[]>(`${apiUrl}/public-donation-requests`);
      
      setRequests(res.data);
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 500, 
        useNativeDriver: true 
      }).start();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load requests from server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (req.donationStatus === "done") return false;
    return filterGroup === "All" || req.bloodGroup === filterGroup;
  });

  const renderRequestCard = ({ item }: { item: DonationRequest }) => (
    <View style={styles.card}>
      <View style={styles.bloodBadge}>
        <Text style={styles.bloodBadgeText}>{item.bloodGroup}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.patientName}>{item.recipientName}</Text>
        
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

        <TouchableOpacity 
          style={styles.donateBtn}
          onPress={() => Alert.alert("Confirm", "Do you want to donate?")}
        >
          <Text style={styles.donateBtnText}>Donate Now ❤️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blood <Text style={{color: '#d32f2f'}}>Network</Text></Text>
        <TouchableOpacity onPress={fetchRequests} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }}>
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
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#d32f2f" />
        </View>
      ) : (
        <Animated.FlatList
          data={filteredRequests}
          renderItem={renderRequestCard}
          keyExtractor={(item: DonationRequest) => item._id}
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#333' },
  refreshBtn: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 12 },
  filterContainer: { paddingHorizontal: 20, alignItems: 'center' },
  chip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 15, backgroundColor: '#f5f5f5', marginRight: 8, borderWidth: 1, borderColor: '#eee' },
  chipActive: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
  chipText: { fontSize: 13, fontWeight: 'bold', color: '#666' },
  chipTextActive: { color: '#fff' },
  list: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    marginBottom: 20,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bloodBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomLeftRadius: 30,
    zIndex: 10
  },
  bloodBadgeText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  cardContent: { padding: 25 },
  patientName: { fontSize: 20, fontWeight: '900', color: '#333', marginBottom: 5, textTransform: 'uppercase' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#999', letterSpacing: 1 },
  infoContainer: { marginBottom: 20 },
  infoBoxFull: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f5', padding: 12, borderRadius: 15, marginBottom: 10 },
  infoTextMain: { marginLeft: 10, fontWeight: 'bold', color: '#444', fontSize: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 12, width: '48%' },
  infoTextSmall: { marginLeft: 6, fontSize: 11, fontWeight: '600', color: '#777' },
  donateBtn: { backgroundColor: '#d32f2f', padding: 16, borderRadius: 20, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }
});