import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../src/Provider/AuthContext";

interface Notification {
  _id: string;
  recipients: string[];
  message: string;
  type: 'canceled' | 'done' | string;
  isRead: boolean;
  timestamp: string;
}

const { height } = Dimensions.get("window");
const API_URL = "https://webapp-delta-orpin.vercel.app";

const NotificationBell: React.FC = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const email = user.email.trim(); 
      const res = await axios.get(`${API_URL}/notifications/${email}`);

      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    }
  }, [user?.email, fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getStatusStyle = (type: string) => {
    switch (type) {
      case 'canceled':
        return { icon: 'close-circle-outline', color: '#d32f2f', bg: '#fef2f2' };
      case 'done':
        return { icon: 'check-circle-outline', color: '#2e7d32', bg: '#f1f8e9' };
      default:
        return { icon: 'bell-outline', color: '#0288d1', bg: '#e1f5fe' };
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const status = getStatusStyle(item.type);
    return (
      <View style={[styles.notifItem, !item.isRead && styles.unreadBg]}>
        <View style={[styles.notifIconCircle, { backgroundColor: status.bg }]}>
          <MaterialCommunityIcons 
            name={status.icon as any} 
            size={24} 
            color={status.color} 
          />
        </View>
        <View style={styles.notifTextContent}>
          <Text style={styles.notifMessage} numberOfLines={3}>
            {item.message}
          </Text>
          <Text style={styles.notifTime}>
            {new Date(item.timestamp).toLocaleString('bn-BD')}
          </Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={() => setShowModal(true)} 
        style={styles.bellButton}
      >
        <Ionicons name="notifications-outline" size={26} color="#ffffff" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Notification</Text>
              <TouchableOpacity onPress={fetchNotifications} style={{padding: 5}}>
                <Ionicons name="refresh" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color="#d32f2f" />
                <Text style={styles.loadingText}>loading...</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderNotificationItem}
                extraData={notifications}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                  <View style={styles.emptyBox}>
                    <Ionicons name="notifications-off-outline" size={70} color="#ddd" />
                    <Text style={styles.emptyText}>No Notification found</Text>
                  </View>
                }
              />
            )}
            
            <SafeAreaView edges={['bottom']}>
              <TouchableOpacity 
                style={styles.closeFooter}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeFooterText}>Close</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bellButton: { padding: 5 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    height: height * 0.88,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  listContent: { flexGrow: 1, paddingBottom: 20 },
  notifItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  unreadBg: { backgroundColor: '#fff9f9' },
  notifIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifTextContent: { flex: 1 },
  notifMessage: { fontSize: 14, color: '#333', lineHeight: 20 },
  notifTime: { fontSize: 11, color: '#999', marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d32f2f',
    marginLeft: 8,
  },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#bbb' },
  closeFooter: { 
    padding: 16, 
    alignItems: 'center', 
    backgroundColor: '#fdfdfd',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  closeFooterText: { color: '#d32f2f', fontWeight: '600' }
});

export default NotificationBell;