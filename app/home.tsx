import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.7,
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

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* --- ROUNDED HEADER --- */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="menu-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Aid</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Save lives by{" "}
          <Text style={{ fontWeight: "bold", color: "#fff" }}>
            sharing blood
          </Text>
        </Text>
      </View>

      {/* --- ACTION SECTION --- */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.squareBtn, styles.findDonorBtn]}
          onPress={() => router.push("/find_donor")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="search" size={28} color="#d32f2f" />
          </View>
          <Text style={styles.btnLabel}>Find Donor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.squareBtn, styles.donateBloodBtn]}
          onPress={() => router.push("/donate_blood")}
        >
          <View style={[styles.iconCircle, styles.donateBloodBtnIcon]}>
            <Ionicons name="water" size={28} color="#fff" />
          </View>
          <Text style={[styles.btnLabel, { color: "#fff" }]}>Donate Blood</Text>
        </TouchableOpacity>
      </View>

      {/* --- SELFLESS CONTRIBUTION BUTTON (Full Width Dual Color) --- */}
      <TouchableOpacity
        style={styles.contributionContainer}
        onPress={() => router.push("/selfless-contribution")}
      >
        <View style={styles.dualBtn}>
          {/* Left Red Half */}
          <View style={styles.leftHalf}>
            <FontAwesome5 name="hands-helping" size={20} color="#fff" />
          </View>
          {/* Right White Half */}
          <View style={styles.rightHalf}>
            <Text style={styles.contributionText}>Selfless Contribution</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#d32f2f"
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <Pressable style={styles.blurArea} onPress={toggleSidebar} />
          <Animated.View
            style={[
              styles.sidebarContent,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.sidebarHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => {
                toggleSidebar();
                router.push("/dashboard");
              }}
            >
              <Ionicons name="grid-outline" size={22} color="#333" />
              <Text style={styles.sidebarText}>Dashboard</Text>
            </TouchableOpacity>
            <View style={styles.sidebarFooter}>
              <TouchableOpacity
                style={[styles.sidebarItem, styles.logoutItem]}
                onPress={() => router.replace("/")}
              >
                <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
                <Text style={[styles.sidebarText, { color: "#d32f2f" }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => router.push("/donation-request")}
        >
          <Ionicons name="add-circle-outline" size={26} color="#666" />
          <Text style={styles.footerTabText}>Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeTab}
          onPress={() => router.push("/home")}
        >
          <View style={styles.homeIconContainer}>
            <Ionicons name="home" size={28} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={26} color="#666" />
          <Text style={styles.footerTabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Header Design
  stickyHeader: {
    backgroundColor: "#d32f2f",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 15 : 60,
    paddingBottom: 60,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "#ffcdd2", fontSize: 14, marginTop: 5 },

  // Action Buttons Section
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: -40,
    zIndex: 10,
  },
  squareBtn: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 30,
    padding: 20,
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  findDonorBtn: { backgroundColor: "#fff" },
  donateBloodBtn: {
    backgroundColor: "#d32f2f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  donateBloodBtnIcon: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
  btnLabel: { fontSize: 16, fontWeight: "900", color: "#333", lineHeight: 20 },

  // Selfless Contribution Button Styling
  contributionContainer: {
    marginHorizontal: 25,
    marginTop: 20,
    height: 70,
    borderRadius: 20,
    elevation: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dualBtn: {
    flex: 1,
    flexDirection: "row",
  },
  leftHalf: {
    flex: 0.25, 
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
  },
  rightHalf: {
    flex: 0.75,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  contributionText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },

  // Sidebar & Footer (Keeping your original styles)
  sidebarOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 2000 },
  blurArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebarContent: {
    width: width * 0.7,
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 50,
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuTitle: { fontSize: 22, fontWeight: "bold", color: "#d32f2f" },
  sidebarItem: { flexDirection: "row", alignItems: "center", padding: 20 },
  sidebarText: { marginLeft: 15, fontSize: 16, color: "#333" },
  sidebarFooter: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
  logoutItem: { borderTopWidth: 1, borderTopColor: "#eee" },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 20,
  },
  footerTab: { alignItems: "center" },
  footerTabText: { fontSize: 11, color: "#666", marginTop: 4 },
  homeTab: { marginTop: -40 },
  homeIconContainer: {
    backgroundColor: "#d32f2f",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    borderWidth: 4,
    borderColor: "#fff",
  },
});
