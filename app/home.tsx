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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const DEMO_REQUESTS = [
  { id: "1", name: "Rahim Uddin", bloodGroup: "A+", date: "2024-05-20", location: "Dhanmondi, Dhaka", hospital: "Dhaka Medical College", bags: 2 },
  { id: "2", name: "Sumi Akter", bloodGroup: "O-", date: "2024-05-21", location: "Chittagong", hospital: "Evercare Hospital", bags: 1 },
  { id: "3", name: "Shihab Chowdhury", bloodGroup: "B+", date: "2024-05-22", location: "Sylhet", hospital: "Osmani Medical", bags: 3 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.5)).current;

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
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

  // ScrollView এর পরিবর্তে Header Component
  const ListHeader = () => (
    <View style={styles.heroSection}>
      <Text style={styles.welcomeText}>Recent Blood Requests</Text>
      <Text style={styles.subtitle}>Help someone today by donating blood</Text>
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
            <View style={styles.sidebarHeader}>
                <Text style={styles.menuTitle}>Menu</Text>
            </View>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => {toggleSidebar(); router.push("/dashboard")}}>
              <Ionicons name="grid-outline" size={22} color="#333" />
              <Text style={styles.sidebarText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => {toggleSidebar(); router.push("/about")}}>
              <Ionicons name="information-circle-outline" size={22} color="#333" />
              <Text style={styles.sidebarText}>About Us</Text>
            </TouchableOpacity>
            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={[styles.sidebarItem, styles.logoutItem]} onPress={() => router.replace("/")}>
                <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
                <Text style={[styles.sidebarText, {color: "#d32f2f"}]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* --- MAIN CONTENT (FlatList as the main scroller) --- */}
      <FlatList
        data={DEMO_REQUESTS}
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

        <TouchableOpacity style={styles.footerTab} onPress={() => router.push("/about")}>
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
  heroSection: { padding: 20 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 14, color: "#777", marginTop: 5 },
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