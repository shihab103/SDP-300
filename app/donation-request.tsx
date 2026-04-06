import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AuthContext } from "../src/Provider/AuthContext";

const districtsData = require("../assets/data/districts.json");
const upazilasData = require("../assets/data/upazilas.json");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
    const dTable = districtsData.find((item: any) => item.type === "table" && item.name === "districts");
    const uTable = upazilasData.find((item: any) => item.type === "table" && item.name === "upazilas");
    if (dTable) setDistricts(dTable.data);
    if (uTable) setUpazilas(uTable.data);
  }, []);

  useEffect(() => {
    if (formData.recipientDistrictId) {
      const filtered = upazilas.filter(
        (u: any) => u.district_id.toString() === formData.recipientDistrictId.toString()
      );
      setFilteredUpazilas(filtered);
    }
  }, [formData.recipientDistrictId, upazilas]);

  // Date & Time Logic
  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormData({ ...formData, donationDate: formattedDate });
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = date.toLocaleTimeString([], options);
    setFormData({ ...formData, donationTime: formattedTime });
    setTimePickerVisibility(false);
  };

  const handleSubmit = async () => {
    if (userInfo?.status === "blocked") {
      Alert.alert("Blocked!", "You are not authorized to post.");
      return;
    }
    const { recipientName, bloodGroup, recipientDistrict, recipientUpazila, donationDate, donationTime } = formData;
    if (!recipientName || !bloodGroup || !recipientDistrict || !recipientUpazila || !donationDate || !donationTime) {
      Alert.alert("Error", "Please fill all required (*) fields.");
      return;
    }
    setLoading(true);
    try {
      console.log("Final Data:", formData);
      Alert.alert("Success!", "Request posted successfully.", [{ text: "OK", onPress: () => router.push("/home") }]);
    } catch (error) {
      Alert.alert("Error", "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const SelectionModal = ({ visible, setVisible, title, data, onSelect, keyProp = "name" }: any) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item); setVisible(false); }}>
                <Text style={styles.modalItemText}>{typeof item === "string" ? item : item[keyProp]}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>🩸 Donation Request</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Requester Info</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput style={[styles.input, styles.readOnly]} value={user?.displayName} editable={false} placeholder="Loading name..." />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Email</Text>
            <TextInput style={[styles.input, styles.readOnly]} value={user?.email} editable={false} placeholder="Loading email..." />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recipient Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Name *</Text>
            <TextInput style={styles.input} placeholder="Patient's Name" onChangeText={(t) => setFormData({ ...formData, recipientName: t })} />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>District *</Text>
              <TouchableOpacity style={styles.selectorTrigger} onPress={() => setDistrictModal(true)}>
                <Text style={{ color: formData.recipientDistrict ? "#000" : "#999" }} numberOfLines={1}>
                  {formData.recipientDistrict || "Select"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Upazila *</Text>
              <TouchableOpacity
                style={[styles.selectorTrigger, !formData.recipientDistrictId && { opacity: 0.5 }]}
                onPress={() => formData.recipientDistrictId ? setUpazilaModal(true) : Alert.alert("Wait", "Select District First")}
              >
                <Text style={{ color: formData.recipientUpazila ? "#000" : "#999" }} numberOfLines={1}>
                  {formData.recipientUpazila || "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hospital Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Dhaka Medical College" onChangeText={(t) => setFormData({ ...formData, hospitalName: t })} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput style={styles.input} placeholder="House, Road, Area details" onChangeText={(t) => setFormData({ ...formData, fullAddress: t })} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Group *</Text>
            <TouchableOpacity style={styles.selectorTrigger} onPress={() => setBloodModal(true)}>
              <Text style={{ color: formData.bloodGroup ? "#000" : "#999" }}>
                {formData.bloodGroup || "Select Group"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Donation Date *</Text>
              <TouchableOpacity style={styles.selectorTrigger} onPress={() => setDatePickerVisibility(true)}>
                <Text style={{ color: formData.donationDate ? "#000" : "#999" }}>
                  {formData.donationDate || "Pick Date"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Donation Time *</Text>
              <TouchableOpacity style={styles.selectorTrigger} onPress={() => setTimePickerVisibility(true)}>
                <Text style={{ color: formData.donationTime ? "#000" : "#999" }}>
                  {formData.donationTime || "Pick Time"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Request Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Reason for blood request (e.g. Emergency surgery)"
              multiline
              numberOfLines={4}
              onChangeText={(t) => setFormData({ ...formData, requestMessage: t })}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Post Request</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date & Time Modals */}
      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleDateConfirm} onCancel={() => setDatePickerVisibility(false)} minimumDate={new Date()} />
      <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleTimeConfirm} onCancel={() => setTimePickerVisibility(false)} />

      {/* Selection Modals */}
      <SelectionModal visible={bloodModal} setVisible={setBloodModal} title="Select Blood" data={BLOOD_GROUPS} onSelect={(i: any) => setFormData({ ...formData, bloodGroup: i })} />
      <SelectionModal visible={districtModal} setVisible={setDistrictModal} title="Select District" data={districts} onSelect={(i: any) => setFormData({ ...formData, recipientDistrict: i.name, recipientDistrictId: i.id, recipientUpazila: "" })} />
      <SelectionModal visible={upazilaModal} setVisible={setUpazilaModal} title="Select Upazila" data={filteredUpazilas} onSelect={(i: any) => setFormData({ ...formData, recipientUpazila: i.name, recipientUpazilaId: i.id })} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#e63946", textAlign: "center", marginBottom: 20, marginTop: 40 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingBottom: 5 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "bold", color: "#475569", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: "#f9f9f9" },
  readOnly: { backgroundColor: "#f1f5f9", color: "#64748b" },
  selectorTrigger: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 14, backgroundColor: "#f9f9f9" },
  row: { flexDirection: "row", marginBottom: 15 },
  textArea: { height: 90, textAlignVertical: "top" },
  submitBtn: { backgroundColor: "#e63946", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20, maxHeight: "75%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#e63946" },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  modalItemText: { fontSize: 16, textAlign: "center" },
  closeButton: { backgroundColor: "#334155", padding: 12, borderRadius: 10, marginTop: 15, alignItems: "center" },
});