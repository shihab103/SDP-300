import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../src/Provider/AuthContext"; 

const { width } = Dimensions.get("window");

export default function SelflessContributionScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        const response = await axios.get(`https://webapp-delta-orpin.vercel.app/users/${user?.email}`);
        setUserData(response.data);
      } catch (error) {
        console.error("User fetch error:", error);
        Alert.alert("Error", "Could not load user profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email]);

  const handleContribute = async () => {
    if (!userData) return;

    try {
      setIsSubmitting(true);
      const apiUrl = "https://webapp-delta-orpin.vercel.app/add-voluntary-donor"; 
      
      const payload = {
        userId: userData._id,
        name: userData.name,
        email: userData.email,
        bloodGroup: userData.bloodGroup,
        location: `${userData.upazilaName}, ${userData.districtName}`,
        photoURL: userData.photoURL,
        joinedAt: new Date(),
        status: 'active'
      };

      const response = await axios.post(apiUrl, payload);

      if (response.data.insertedId) {
        Alert.alert(
          "Success! ❤️",
          "You are now a proud voluntary donor. Thank you for your kindness!",
          [{ text: "Great!", onPress: () => router.back() }]
        );
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to register as a donor.";
      Alert.alert("Wait!", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- Top Red Header Section --- */}
      <View style={styles.headerBg}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selfless Contribution</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- User Profile Card (Overlapping) --- */}
        {userData && (
          <View style={styles.profileCard}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.locationText}>{userData.upazilaName}, {userData.districtName}</Text>
                </View>
              </View>
              <View style={styles.bloodCircle}>
                <Text style={styles.bloodLabel}>Group</Text>
                <Text style={styles.bloodText}>{userData.bloodGroup}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Motivational Info */}
        <View style={styles.infoBox}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="heartbeat" size={35} color="#d32f2f" />
          </View>
          <Text style={styles.infoTitle}>Save a Life Today</Text>
          <Text style={styles.infoDesc}>
            Becoming a voluntary donor is a noble decision. Your availability can be the difference between life and death for someone in an emergency.
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitContainer}>
          <View style={styles.benefitCard}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.benefitLabel}>Emergency Ready</Text>
          </View>
          <View style={styles.benefitCard}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.benefitLabel}>Local Impact</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.submitBtn, (isSubmitting || !userData) && { opacity: 0.8 }]} 
          onPress={handleContribute}
          disabled={isSubmitting || !userData}
        >
          <View style={styles.btnInner}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="hand-holding-heart" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Commit to Save Lives</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          * You can opt-out at any time from your profile settings.
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  // Header Design
  headerBg: {
    backgroundColor: "#d32f2f",
    height: 160,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 8, marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },

  scrollContent: { paddingBottom: 40 },

  // Overlapping Profile Card
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10, 
    borderRadius: 25,
    padding: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 65, height: 65, borderRadius: 33, backgroundColor: '#eee' },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 13, color: '#777', marginLeft: 4 },
  bloodCircle: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2'
  },
  bloodLabel: { fontSize: 10, color: '#d32f2f', fontWeight: 'bold' },
  bloodText: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' },

  // Info Section
  infoBox: { alignItems: 'center', padding: 30 },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  infoTitle: { fontSize: 22, fontWeight: '900', color: '#222', marginBottom: 8 },
  infoDesc: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },

  // Benefit List
  benefitContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 30, paddingHorizontal: 20 },
  benefitCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E8F5E9', 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    borderRadius: 15 
  },
  benefitLabel: { marginLeft: 8, color: '#2E7D32', fontWeight: '600', fontSize: 13 },

  // Button
  submitBtn: {
    backgroundColor: '#d32f2f',
    marginHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnInner: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  noteText: { marginTop: 15, fontSize: 12, color: '#999', textAlign: 'center' }
});