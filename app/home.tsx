import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DEMO_REQUESTS = [
  { id: "1", name: "Rahim Uddin", bloodGroup: "A+", date: "2024-05-20", location: "Dhanmondi, Dhaka", hospital: "Dhaka Medical College", bags: 2 },
  { id: "2", name: "Sumi Akter", bloodGroup: "O-", date: "2024-05-21", location: "Chittagong", hospital: "Evercare Hospital", bags: 1 },
  { id: "3", name: "Shihab Chowdhury", bloodGroup: "B+", date: "2024-05-22", location: "Sylhet", hospital: "Osmani Medical", bags: 3 },
  { id: "4", name: "Anika Tabassum", bloodGroup: "AB+", date: "2024-05-23", location: "Mirpur, Dhaka", hospital: "National Heart Foundation", bags: 1 },
  { id: "5", name: "Kamrul Hasan", bloodGroup: "A-", bloodGroupOriginal: "A-", date: "2024-05-24", location: "Rajshahi", hospital: "Rajshahi Medical", bags: 2 },
  { id: "6", name: "Jannat Rakhi", bloodGroup: "O+", date: "2024-05-25", location: "Khulna", hospital: "City Hospital", bags: 4 },
  { id: "7", name: "Tanvir Ahmed", bloodGroup: "B-", date: "2024-05-26", location: "Barishal", hospital: "Sher-e-Bangla Medical", bags: 2 },
  { id: "8", name: "Nabila Islam", bloodGroup: "A+", date: "2024-05-27", location: "Uttara, Dhaka", hospital: "Kuwait Bangladesh Charity Hospital", bags: 1 },
  { id: "9", name: "Sabbir Khan", bloodGroup: "AB-", date: "2024-05-28", location: "Comilla", hospital: "Central Medical College", bags: 2 },
  { id: "10", name: "Muna Sheikh", bloodGroup: "O+", date: "2024-05-29", location: "Mymensingh", hospital: "MMCH", bags: 1 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const slideAnim = useRef(new Animated.Value(-width * 0.5)).current;

  const filteredData = selectedGroup === "All" 
    ? DEMO_REQUESTS 
    : DEMO_REQUESTS.filter(item => item.bloodGroup === selectedGroup);

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(slideAnim, { toValue: -width * 0.5, duration: 300, useNativeDriver: true }).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  };

  const renderRequestCard = ({ item }: { item: typeof DEMO_REQUESTS[0] }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.bloodBadge}><Text style={styles.bloodText}>{item.bloodGroup}</Text></View>
        <View>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.postDate}>📅 {item.date}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}><Ionicons name="location-outline" size={14} /> {item.location}</Text>
        <Text style={styles.detailText}><Ionicons name="business-outline" size={14} /> {item.hospital}</Text>
        <Text style={styles.bagText}>🩸 Needs: {item.bags} Bag(s)</Text>
      </View>
      <TouchableOpacity style={styles.viewBtn}><Text style={styles.viewBtnText}>View Details</Text></TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View>
      <View style={styles.heroSection}>
        <Text style={styles.welcomeText}>Recent Blood Requests</Text>
        <Text style={styles.subtitle}>Help someone today by donating blood</Text>
      </View>

      {/* --- BLOOD GROUP FILTER (NEW FEATURE) --- */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        {BLOOD_GROUPS.map((group) => (
          <TouchableOpacity 
            key={group} 
            style={[
                styles.filterBadge, 
                selectedGroup === group && styles.filterBadgeActive
            ]}
            onPress={() => setSelectedGroup(group)}
          >
            <Text style={[
                styles.filterBadgeText, 
                selectedGroup === group && styles.filterBadgeTextActive
            ]}>{group}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name={isSidebarOpen ? "close" : "menu-outline"} size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Aid</Text>
        <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#fff" /></TouchableOpacity>
      </View>

      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <Pressable style={styles.blurArea} onPress={toggleSidebar} />
          <Animated.View style={[styles.sidebarContent, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.sidebarHeader}><Text style={styles.menuTitle}>Menu</Text></View>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => {toggleSidebar(); router.push("/dashboard")}}>
              <Ionicons name="grid-outline" size={22} color="#333" /><Text style={styles.sidebarText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => {toggleSidebar(); router.push("/profile")}}>
              <Ionicons name="information-circle-outline" size={22} color="#333" /><Text style={styles.sidebarText}>About Us</Text>
            </TouchableOpacity>
            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={[styles.sidebarItem, styles.logoutItem]} onPress={() => router.replace("/")}>
                <Ionicons name="log-out-outline" size={22} color="#d32f2f" /><Text style={[styles.sidebarText, {color: "#d32f2f"}]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* --- MAIN CONTENT --- */}
      <FlatList
        data={filteredData} // ফিল্টার করা ডাটা
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No requests for this group.</Text>}
      />

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab} onPress={() => router.push("/donation-request")}>
          <Ionicons name="add-circle-outline" size={26} color="#666" />
          <Text style={styles.footerTabText}>Request</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeTab} onPress={() => router.push("/home")}>
          <View style={styles.homeIconContainer}>
            <Ionicons name="home" size={28} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab} onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={26} color="#666" />
          <Text style={styles.footerTabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F6" },
  header: { height: 60, backgroundColor: "#d32f2f", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, zIndex: 1001 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  sidebarOverlay: { position: "absolute", top: 83, bottom: 70, left: 0, right: 0, zIndex: 1000 },
  sidebarContent: { width: width * 0.5, backgroundColor: "#fff", height: "100%", elevation: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, paddingTop: 10, position: "absolute", left: 0 },
  blurArea: { position: "absolute", right: 0, width: width, backgroundColor: "rgba(0,0,0,0.4)", height: "100%" },
  sidebarHeader: { padding: 20, marginTop: 10, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  menuTitle: { fontSize: 18, fontWeight: "bold", color: "#d32f2f" },
  sidebarItem: { flexDirection: "row", alignItems: "center", padding: 18, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  sidebarText: { marginLeft: 15, fontSize: 16, color: "#333", fontWeight: "500" },
  sidebarFooter: { flex: 1, justifyContent: "flex-end" },
  logoutItem: { borderTopWidth: 1, borderTopColor: "#eee" },
  scrollContent: { paddingBottom: 100 },
  heroSection: { padding: 20, paddingBottom: 10 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 14, color: "#777", marginTop: 5 },
  
  // New Styles for Filter
  filterContainer: { paddingHorizontal: 20, paddingBottom: 15, flexDirection: 'row' },
  filterBadge: { paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#ddd', elevation: 2 },
  filterBadgeActive: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
  filterBadgeText: { color: '#666', fontWeight: '600' },
  filterBadgeTextActive: { color: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },

  requestCard: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 15, borderRadius: 15, padding: 15, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  bloodBadge: { backgroundColor: "#ffebee", width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 15, borderWidth: 1, borderColor: "#d32f2f" },
  bloodText: { color: "#d32f2f", fontSize: 18, fontWeight: "bold" },
  patientName: { fontSize: 17, fontWeight: "bold", color: "#333" },
  postDate: { fontSize: 12, color: "#999" },
  cardDetails: { marginBottom: 12 },
  detailText: { fontSize: 14, color: "#555", marginBottom: 4 },
  bagText: { fontSize: 14, fontWeight: "bold", color: "#d32f2f", marginTop: 5 },
  viewBtn: { backgroundColor: "#fdf2f2", padding: 10, borderRadius: 8, alignItems: "center" },
  viewBtnText: { color: "#d32f2f", fontWeight: "bold" },
  footer: { position: "absolute", bottom: 0, width: "100%", height: 70, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderTopColor: "#eee", zIndex: 1001 },
  footerTab: { alignItems: "center", justifyContent: "center" },
  footerTabText: { fontSize: 12, color: "#666", marginTop: 2 },
  homeTab: { marginTop: -35 },
  homeIconContainer: { backgroundColor: "#d32f2f", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
});