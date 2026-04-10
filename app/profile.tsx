import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import axios from "axios";
import { AuthContext } from "../src/Provider/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  bloodGroup: string;
  districtName: string;
  upazilaName: string;
  role: string;
  status: string;
}

const Profile = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const router = useRouter();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = "https://webapp-delta-orpin.vercel.app";

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      const encodedEmail = encodeURIComponent(user.email);
      axios.get(`${API_URL}/users/${encodedEmail}`)
        .then((res) => {
          setUserData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [user?.email]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header Section - এখন এখানে ক্লিক করলে হোম এ যাবে */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => router.push("/dashboard")}
        style={styles.header}
      >
        {/* ৩. ব্যাক আইকন যোগ করা হয়েছে */}
        <View style={styles.backIconContainer}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: userData?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.profileImage}
          />
          <View style={styles.activeDot} />
        </View>
        <Text style={styles.userName}>{userData?.name}</Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
        
        <View style={styles.badgeContainer}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userData?.role}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Info Cards Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="blood-bag" size={24} color="#ef4444" />
          <Text style={styles.statLabel}>Blood Group</Text>
          <Text style={styles.statValue}>{userData?.bloodGroup || 'N/A'}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="location-sharp" size={24} color="#ef4444" />
          <Text style={styles.statLabel}>District</Text>
          <Text style={styles.statValue}>{userData?.districtName || 'N/A'}</Text>
        </View>
      </View>

      {/* Details List */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <ProfileItem icon="account-outline" label="User ID" value={userData?._id.slice(-8).toUpperCase()} />
          <ProfileItem icon="map-marker-outline" label="Upazila" value={userData?.upazilaName} />
          <ProfileItem icon="shield-check-outline" label="Status" value={userData?.status} isLast />
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color="#666" />
          <Text style={styles.settingsText}>Account Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProfileItem = ({ icon, label, value, isLast }: any) => (
  <View style={[styles.itemRow, !isLast && styles.borderBottom]}>
    <View style={styles.iconBox}>
      <MaterialCommunityIcons name={icon} size={22} color="#ef4444" />
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value || "Not provided"}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#ccc" />
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "#ef4444",
    paddingTop: Platform.OS === "android" ? 50 : 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backIconContainer: {
    position: 'absolute',
    top: Platform.OS === "android" ? 45 : 55,
    left: 20,
  },
  imageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
    padding: 2,
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 55 },
  activeDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 12 },
  userEmail: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 2 },
  badgeContainer: { flexDirection: "row", marginTop: 15 },
  roleBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  roleText: { color: "#fff", fontWeight: "bold", fontSize: 12, textTransform: "uppercase" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: "#fff",
    width: (width - 60) / 2,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statLabel: { color: "#9ca3af", fontSize: 11, marginTop: 5, textTransform: "uppercase" },
  statValue: { color: "#1f2937", fontSize: 16, fontWeight: "bold" },
  detailsSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#374151", marginBottom: 15 },
  card: { backgroundColor: "#fff", borderRadius: 25, padding: 5, elevation: 2 },
  itemRow: { flexDirection: "row", alignItems: "center", padding: 15 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  iconBox: { backgroundColor: "#FEF2F2", padding: 10, borderRadius: 12 },
  itemTextContainer: { marginLeft: 15, flex: 1 },
  itemLabel: { color: "#9ca3af", fontSize: 11, textTransform: "uppercase" },
  itemValue: { color: "#1f2937", fontSize: 15, fontWeight: "600" },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  settingsText: { marginLeft: 10, color: "#4B5563", fontWeight: "bold" },
});

export default Profile;