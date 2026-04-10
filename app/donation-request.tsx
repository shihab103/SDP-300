import axios from "axios";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AuthContext } from "../src/Provider/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

const districtsData = require("../assets/data/districts.json");
const upazilasData = require("../assets/data/upazilas.json");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const API_URL = "https://webapp-delta-orpin.vercel.app/create-donation-request";

export default function DonationRequest() {
  const { user, userInfo }: any = useContext(AuthContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientDistrictId: "",
    recipientUpazila: "",
    recipientUpazilaId: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // Data States
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState<any[]>([]);

  // Visibility States
  const [bloodModal, setBloodModal] = useState(false);
  const [districtModal, setDistrictModal] = useState(false);
  const [upazilaModal, setUpazilaModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  useEffect(() => {
    const dTable = districtsData.find(
      (item: any) => item.type === "table" && item.name === "districts"
    );
    const uTable = upazilasData.find(
      (item: any) => item.type === "table" && item.name === "upazilas"
    );
    if (dTable) setDistricts(dTable.data);
    if (uTable) setUpazilas(uTable.data);
  }, []);

  useEffect(() => {
    if (formData.recipientDistrictId) {
      const filtered = upazilas.filter(
        (u: any) =>
          u.district_id.toString() === formData.recipientDistrictId.toString()
      );
      setFilteredUpazilas(filtered);
    }
  }, [formData.recipientDistrictId, upazilas]);

  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormData({ ...formData, donationDate: formattedDate });
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString([], options);
    setFormData({ ...formData, donationTime: formattedTime });
    setTimePickerVisibility(false);
  };

  const handleSubmit = async () => {
    if (userInfo?.status === "blocked") {
      Alert.alert("Blocked!", "You are not authorized to post.");
      return;
    }

    const {
      recipientName,
      bloodGroup,
      recipientDistrict,
      recipientUpazila,
      donationDate,
      donationTime,
    } = formData;

    if (
      !recipientName ||
      !bloodGroup ||
      !recipientDistrict ||
      !recipientUpazila ||
      !donationDate ||
      !donationTime
    ) {
      Alert.alert("Error", "Please fill all required (*) fields.");
      return;
    }

    setLoading(true);

    const requestData = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      ...formData,
      donationStatus: "pending",
    };

    try {
      const response = await axios.post(API_URL, requestData);

      if (response.data.insertedId) {
        Alert.alert("Success!", "Request posted successfully.", [
          { text: "OK", onPress: () => router.push("/dashboard") },
        ]);
      }
    } catch (error: any) {
      console.error("Submission Error:", error.message);
      Alert.alert("Error", "Submission failed. Check your internet or server.");
    } finally {
      setLoading(false);
    }
  };

  const SelectionModal = ({
    visible,
    setVisible,
    title,
    data,
    onSelect,
    keyProp = "name",
  }: any) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  setVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>
                  {typeof item === "string" ? item : item[keyProp]}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* --- Sticky Header (Home Back with Icon) --- */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => router.push("/dashboard")}
        style={styles.stickyHeader}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" style={{marginRight: 5}} />
          <Text style={styles.headerTitle}>Blood Request</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Fill the form to find a <Text style={styles.boldText}>Hero Donor</Text>
        </Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Requester Info</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={[styles.input, styles.readOnly]}
              value={user?.displayName}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Email</Text>
            <TextInput
              style={[styles.input, styles.readOnly]}
              value={user?.email}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recipient Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Patient's Name"
              onChangeText={(t) =>
                setFormData({ ...formData, recipientName: t })
              }
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>District *</Text>
              <TouchableOpacity
                style={styles.selectorTrigger}
                onPress={() => setDistrictModal(true)}
              >
                <Text
                  style={{
                    color: formData.recipientDistrict ? "#000" : "#999",
                  }}
                  numberOfLines={1}
                >
                  {formData.recipientDistrict || "Select"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Upazila *</Text>
              <TouchableOpacity
                style={[
                  styles.selectorTrigger,
                  !formData.recipientDistrictId && { opacity: 0.5 },
                ]}
                onPress={() =>
                  formData.recipientDistrictId
                    ? setUpazilaModal(true)
                    : Alert.alert("Wait", "Select District First")
                }
              >
                <Text
                  style={{ color: formData.recipientUpazila ? "#000" : "#999" }}
                  numberOfLines={1}
                >
                  {formData.recipientUpazila || "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hospital Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dhaka Medical College"
              onChangeText={(t) =>
                setFormData({ ...formData, hospitalName: t })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput
              style={styles.input}
              placeholder="House, Road, Area details"
              onChangeText={(t) => setFormData({ ...formData, fullAddress: t })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Group *</Text>
            <TouchableOpacity
              style={styles.selectorTrigger}
              onPress={() => setBloodModal(true)}
            >
              <Text style={{ color: formData.bloodGroup ? "#000" : "#999" }}>
                {formData.bloodGroup || "Select Group"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Donation Date *</Text>
              <TouchableOpacity
                style={styles.selectorTrigger}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text
                  style={{ color: formData.donationDate ? "#000" : "#999" }}
                >
                  {formData.donationDate || "Pick Date"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Donation Time *</Text>
              <TouchableOpacity
                style={styles.selectorTrigger}
                onPress={() => setTimePickerVisibility(true)}
              >
                <Text
                  style={{ color: formData.donationTime ? "#000" : "#999" }}
                >
                  {formData.donationTime || "Pick Time"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Request Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Reason for blood request"
              multiline
              numberOfLines={4}
              onChangeText={(t) =>
                setFormData({ ...formData, requestMessage: t })
              }
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Post Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals এবং বাকি অংশ আগের মতোই থাকবে */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisibility(false)}
      />

      <SelectionModal
        visible={bloodModal}
        setVisible={setBloodModal}
        title="Select Blood"
        data={BLOOD_GROUPS}
        onSelect={(i: any) => setFormData({ ...formData, bloodGroup: i })}
      />
      <SelectionModal
        visible={districtModal}
        setVisible={setDistrictModal}
        title="Select District"
        data={districts}
        onSelect={(i: any) =>
          setFormData({
            ...formData,
            recipientDistrict: i.name,
            recipientDistrictId: i.id,
            recipientUpazila: "",
          })
        }
      />
      <SelectionModal
        visible={upazilaModal}
        setVisible={setUpazilaModal}
        title="Select Upazila"
        data={filteredUpazilas}
        onSelect={(i: any) =>
          setFormData({
            ...formData,
            recipientUpazila: i.name,
            recipientUpazilaId: i.id,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8f9fa" },
  stickyHeader: {
    backgroundColor: "#d32f2f",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50) : 60,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    zIndex: 1000,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { marginTop: 4, color: "#ffcdd2", fontSize: 14 },
  boldText: { fontWeight: "bold", color: "#fff" },
  scrollContainer: { padding: 18, paddingTop: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 22,
    marginBottom: 20,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingBottom: 5 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "bold", color: "#475569", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 12, fontSize: 15, backgroundColor: "#f9f9f9" },
  readOnly: { backgroundColor: "#f1f5f9", color: "#64748b" },
  selectorTrigger: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 14, backgroundColor: "#f9f9f9" },
  row: { flexDirection: "row", marginBottom: 15 },
  textArea: { height: 90, textAlignVertical: "top" },
  submitBtn: { backgroundColor: "#d32f2f", paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 10 },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20, maxHeight: "75%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#d32f2f" },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  modalItemText: { fontSize: 16, textAlign: "center" },
  closeButton: { backgroundColor: "#334155", padding: 12, borderRadius: 10, marginTop: 15, alignItems: "center" },
});