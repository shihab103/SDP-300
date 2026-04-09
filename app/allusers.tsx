import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../src/Provider/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  status: string;
}

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const API_URL = "https://webapp-delta-orpin.vercel.app";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/get-all-users`);
      const fetchedUsers = res.data;
      
      if (statusFilter === "all") {
        setUsers(fetchedUsers);
      } else {
        setUsers(fetchedUsers.filter((u: User) => u.status === statusFilter));
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUsers();
    }
  }, [user, statusFilter]);

  const handleUpdateRole = (email: string, currentRole: string) => {
    const nextRole = currentRole === "admin" ? "donor" : "admin";

    Alert.alert("Change Role", `Do you want to change this user's role to ${nextRole.toUpperCase()}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await axios.patch(`${API_URL}/update-role`, { email, role: nextRole });
            Alert.alert("Success", "User role updated successfully");
            fetchUsers();
          } catch (err) {
            Alert.alert("Error", "Role update failed");
          }
        },
      },
    ]);
  };

  const handleUpdateStatus = (email: string, status: string) => {
    const action = status === "blocked" ? "Block" : "Unblock";
    Alert.alert("Account Status", `Are you sure you want to ${action} this user?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await axios.patch(`${API_URL}/update-status`, { email, status });
            Alert.alert("Success", `User has been ${status}`);
            fetchUsers();
          } catch (err) {
            Alert.alert("Error", "Status update failed");
          }
        },
      },
    ]);
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.photoURL || "https://i.ibb.co.com/XrdhGKc5/20211008-130744.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? '#166534' : '#991b1b' }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Current Role: <Text style={styles.roleValue}>{item.role}</Text></Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleUpdateStatus(item.email, item.status === 'active' ? 'blocked' : 'active')}
        >
          <Ionicons name={item.status === 'active' ? "ban" : "checkmark-circle"} size={18} color="#ef4444" />
          <Text style={styles.actionButtonText}>{item.status === 'active' ? 'Block' : 'Unblock'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.roleBtn]} 
          onPress={() => handleUpdateRole(item.email, item.role)}
        >
          <MaterialCommunityIcons name="account-convert" size={18} color="#3b82f6" />
          <Text style={[styles.actionButtonText, { color: '#3b82f6' }]}>Change Role</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#b71c1c" barStyle="light-content" />

      {/* Header Section - Dashboard Matching Design */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 User Management</Text>
        <View style={styles.filterBox}>
          <Text style={styles.headerSubtitle}>Status Filter: </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['all', 'active', 'blocked'].map((f) => (
              <TouchableOpacity 
                key={f} 
                onPress={() => setStatusFilter(f)}
                style={[styles.filterChip, statusFilter === f && styles.activeFilterChip]}
              >
                <Text style={[styles.filterChipText, statusFilter === f && styles.activeFilterText]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#d32f2f" />
          <Text style={styles.loaderText}>Fetching Users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  
  // Curved Red Header
  header: { 
    backgroundColor: "#d32f2f", 
    paddingTop: 60, 
    paddingBottom: 35, 
    paddingHorizontal: 25, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  headerSubtitle: { color: "#ffcdd2", fontSize: 14, fontWeight: "600" },
  
  filterBox: { flexDirection: "row", alignItems: "center" },
  filterScroll: { marginLeft: 5 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.2)", marginRight: 8 },
  activeFilterChip: { backgroundColor: "#fff" },
  filterChipText: { color: "#ffcdd2", fontSize: 12, fontWeight: "bold" },
  activeFilterText: { color: "#d32f2f" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, color: "#666", fontWeight: "600" },
  listContent: { padding: 20, paddingTop: 25 },

  // User Card Design
  userCard: { 
    backgroundColor: "#fff", 
    borderRadius: 22, 
    padding: 18, 
    marginBottom: 16, 
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.08, 
    shadowRadius: 8 
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: "#E5E7EB", borderWidth: 2, borderColor: "#fff" },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 17, fontWeight: "bold", color: "#1F2937" },
  userEmail: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "900" },
  
  roleContainer: { marginTop: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  roleLabel: { fontSize: 13, color: "#9CA3AF" },
  roleValue: { fontWeight: "bold", color: "#374151", textTransform: "capitalize" },
  
  actionRow: { flexDirection: "row", marginTop: 15, justifyContent: "space-between" },
  actionButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 12, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: "#FEE2E2", 
    flex: 0.48, 
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  roleBtn: { borderColor: "#DBEAFE" },
  actionButtonText: { marginLeft: 8, fontSize: 13, fontWeight: "700", color: "#ef4444" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#9CA3AF", fontStyle: "italic" }
});

export default AllUsers;