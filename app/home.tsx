import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  Animated,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DEMO_REQUESTS = [
  { id: "1", name: "Rahim Uddin", bloodGroup: "A+", date: "2024-05-20", location: "Dhanmondi, Dhaka", hospital: "Dhaka Medical College", bags: 2 },
  { id: "2", name: "Sumi Akter", bloodGroup: "O-", date: "2024-05-21", location: "Chittagong", hospital: "Evercare Hospital", bags: 1 },
  { id: "3", name: "Shihab Chowdhury", bloodGroup: "B+", date: "2024-05-22", location: "Sylhet", hospital: "Osmani Medical", bags: 3 },
  // ... (বাকি ডাটা একই থাকবে)
];

export default function HomeScreen() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const filteredData = selectedGroup === "All" 
    ? DEMO_REQUESTS 
    : DEMO_REQUESTS.filter(item => item.bloodGroup === selectedGroup);

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(slideAnim, { toValue: -width * 0.7, duration: 300, useNativeDriver: true }).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  };

  const renderRequestCard = ({ item }: { item: typeof DEMO_REQUESTS[0] }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.bloodBadge}><Text style={styles.bloodText}>{item.bloodGroup}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.postDate}>📅 {item.date}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}><Ionicons name="location-outline" size={14} /> {item.location}</Text>
        <Text style={styles.detailText}><Ionicons name="business-outline" size={14} /> {item.hospital}</Text>
        <Text style={styles.bagText}>🩸 Needs: {item.bags} Bag(s)</Text>
      </View>
      <TouchableOpacity style={styles.viewBtn}><Text style={styles.viewBtnText}>Donate Now ❤️</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/*StatusBar config to remove white space*/}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* --- ROUNDED HEADER --- */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="menu-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Aid</Text>
          <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#fff" /></TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Find recent <Text style={{fontWeight: 'bold', color: '#fff'}}>Blood Requests</Text></Text>
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

      {/* --- FILTER & LIST --- */}
      <View style={{ flex: 1 }}>
        {/* Filter on top of the list but under header */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {BLOOD_GROUPS.map((group) => (
              <TouchableOpacity 
                key={group} 
                style={[styles.filterBadge, selectedGroup === group && styles.filterBadgeActive]}
                onPress={() => setSelectedGroup(group)}
              >
                <Text style={[styles.filterBadgeText, selectedGroup === group && styles.filterBadgeTextActive]}>{group}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderRequestCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
        />
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  
  // Header Design (Rounded & No top space)
  stickyHeader: {
    backgroundColor: "#d32f2f",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 15 : 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "#ffcdd2", fontSize: 14, marginTop: 5 },

  // Filter Styles
  filterWrapper: { marginTop: -25, zIndex: 10 },
  filterScroll: { paddingHorizontal: 20, paddingBottom: 15 },
  filterBadge: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 20, marginRight: 10, elevation: 4 },
  filterBadgeActive: { backgroundColor: '#d32f2f' },
  filterBadgeText: { color: '#666', fontWeight: 'bold' },
  filterBadgeTextActive: { color: '#fff' },

  // List & Cards
  listContent: { padding: 20, paddingBottom: 100 },
  requestCard: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  bloodBadge: { backgroundColor: "#ffebee", width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 15, borderWidth: 1, borderColor: "#d32f2f" },
  bloodText: { color: "#d32f2f", fontSize: 18, fontWeight: "bold" },
  patientName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  postDate: { fontSize: 12, color: "#999" },
  cardDetails: { marginBottom: 15 },
  detailText: { fontSize: 14, color: "#555", marginBottom: 5 },
  bagText: { fontSize: 14, fontWeight: "bold", color: "#d32f2f" },
  viewBtn: { backgroundColor: "#d32f2f", padding: 12, borderRadius: 12, alignItems: "center" },
  viewBtnText: { color: "#fff", fontWeight: "bold" },

  // Sidebar
  sidebarOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 2000 },
  blurArea: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sidebarContent: { width: width * 0.7, backgroundColor: "#fff", height: "100%", paddingTop: 50 },
  sidebarHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuTitle: { fontSize: 22, fontWeight: "bold", color: "#d32f2f" },
  sidebarItem: { flexDirection: "row", alignItems: "center", padding: 20 },
  sidebarText: { marginLeft: 15, fontSize: 16, color: "#333" },
  sidebarFooter: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
  logoutItem: { borderTopWidth: 1, borderTopColor: "#eee" },

  // Footer
  footer: { position: "absolute", bottom: 0, width: "100%", height: 75, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderTopColor: "#eee", elevation: 20 },
  footerTab: { alignItems: "center" },
  footerTabText: { fontSize: 11, color: "#666", marginTop: 4 },
  homeTab: { marginTop: -40 },
  homeIconContainer: { backgroundColor: "#d32f2f", width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", elevation: 8, borderWidth: 4, borderColor: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});