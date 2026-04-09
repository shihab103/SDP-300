import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
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
        {/* Block/Unblock Button */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleUpdateStatus(item.email, item.status === 'active' ? 'blocked' : 'active')}
        >
          <Ionicons name={item.status === 'active' ? "ban" : "checkmark-circle"} size={18} color="#ef4444" />
          <Text style={styles.actionButtonText}>{item.status === 'active' ? 'Block' : 'Unblock'}</Text>
        </TouchableOpacity>

        {/* Change Role Button (Admin <-> Donor) */}
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
      <View style={styles.header}>
        <Text style={styles.title}>All Users</Text>
        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 15 },
  filterBox: { flexDirection: "row", alignItems: "center" },
  filterLabel: { fontWeight: "600", color: "#4B5563", marginRight: 10 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 7, borderRadius: 20, backgroundColor: "#F3F4F6", marginRight: 8 },
  activeFilterChip: { backgroundColor: "#ef4444" },
  filterChipText: { color: "#4B5563", fontSize: 13, fontWeight: "600" },
  activeFilterText: { color: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 15 },
  userCard: { backgroundColor: "#fff", borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#E5E7EB" },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  userEmail: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  roleContainer: { marginTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  roleLabel: { fontSize: 13, color: "#6B7280" },
  roleValue: { fontWeight: "bold", color: "#374151", textTransform: "capitalize" },
  actionRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  actionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: "#FEE2E2", flex: 0.48, justifyContent: "center" },
  roleBtn: { borderColor: "#DBEAFE" },
  actionButtonText: { marginLeft: 6, fontSize: 13, fontWeight: "700", color: "#ef4444" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#9CA3AF" }
});

export default AllUsers;