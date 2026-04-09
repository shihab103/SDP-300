import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import axios from "axios";
import { AuthContext } from "../src/Provider/AuthContext";

// Assets (JSON Data)
const districtsData = require("../assets/data/districts.json");
const upazilasData = require("../assets/data/upazilas.json");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const { createUser, updateUser }: any = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Modal Visibility States
  const [bloodModal, setBloodModal] = useState(false);
  const [districtModal, setDistrictModal] = useState(false);
  const [upazilaModal, setUpazilaModal] = useState(false);

  // Data States
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState<any[]>([]);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: "", email: "", password: "", confirmPassword: "",
      avatar: "", bloodGroup: "", districtId: "", districtName: "", upazilaId: "", upazilaName: ""
    }
  });

  const password = watch("password");
  const bloodGroup = watch("bloodGroup");
  const districtName = watch("districtName");
  const upazilaName = watch("upazilaName");
  const districtId = watch("districtId");

  // Load Initial JSON Data
  useEffect(() => {
    const dTable = districtsData.find((item: any) => item.type === "table" && item.name === "districts");
    const uTable = upazilasData.find((item: any) => item.type === "table" && item.name === "upazilas");
    if (dTable) setDistricts(dTable.data);
    if (uTable) setUpazilas(uTable.data);
  }, []);

  // Filter Upazilas when District changes
  useEffect(() => {
    if (districtId) {
      const filtered = upazilas.filter((u: any) => u.district_id.toString() === districtId.toString());
      setFilteredUpazilas(filtered);
      setValue("upazilaId", "");
      setValue("upazilaName", "");
    }
  }, [districtId, upazilas]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      // 1. Firebase User Creation
      const userCredential = await createUser(data.email, data.password);
      
      // 2. Firebase Profile Update
      if (updateUser) await updateUser({ displayName: data.name, photoURL: data.avatar });

      const backendData = {
        name: data.name,
        email: data.email,
        photoURL: data.avatar,
        bloodGroup: data.bloodGroup,
        district: data.districtId,
        upazila: data.upazilaId,
        districtName: data.districtName,
        upazilaName: data.upazilaName,
        role: "donor",
        status: "active",
      };

      // 3. MongoDB (Backend) Request
      const res = await axios.post("https://webapp-delta-orpin.vercel.app/add-user", backendData);

      if (res.data.insertedId) {
        Alert.alert("Success", "Registration Successful ✅");
        router.replace("/dashboard");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Selection Modal Component
  const SelectionModal = ({ visible, setVisible, title, data, onSelect, keyProp = "name" }: any) => (
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
                <Text style={styles.modalItemText}>{typeof item === 'string' ? item : item[keyProp]}</Text>
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🩸 Blood Donor Registration</Text>

      {/* Name */}
      <Text style={styles.label}>Full Name</Text>
      <Controller control={control} name="name" rules={{ required: "Name is required" }} render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Enter full name" onChangeText={onChange} value={value} />
      )} />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      {/* Email */}
      <Text style={styles.label}>Email Address</Text>
      <Controller control={control} name="email" rules={{ required: "Email is required" }} render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="example@mail.com" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} value={value} />
      )} />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Password Section */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Password</Text>
          <Controller control={control} name="password" rules={{ required: "Required", minLength: { value: 6, message: "Min 6 chars" } }} render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder="******" secureTextEntry onChangeText={onChange} value={value} />
          )} />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Confirm</Text>
          <Controller control={control} name="confirmPassword" rules={{ 
            required: "Required",
            validate: (val) => val === password || "Match failed"
          }} render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder="******" secureTextEntry onChangeText={onChange} value={value} />
          )} />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
        </View>
      </View>

      {/* Image URL Field */}
      <Text style={styles.label}>Avatar Image URL</Text>
      <Controller control={control} name="avatar" rules={{ required: "Avatar URL is required" }} render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="https://example.com/photo.jpg" onChangeText={onChange} value={value} />
      )} />
      {errors.avatar && <Text style={styles.errorText}>{errors.avatar.message}</Text>}

      {/* Blood Group Selector */}
      <Text style={styles.label}>Blood Group</Text>
      <TouchableOpacity style={styles.selectorTrigger} onPress={() => setBloodModal(true)}>
        <Text style={{ color: bloodGroup ? "#000" : "#999" }}>{bloodGroup || "Select Blood Group"}</Text>
      </TouchableOpacity>

      {/* District Selector */}
      <Text style={styles.label}>District</Text>
      <TouchableOpacity style={styles.selectorTrigger} onPress={() => setDistrictModal(true)}>
        <Text style={{ color: districtName ? "#000" : "#999" }}>{districtName || "Select District"}</Text>
      </TouchableOpacity>

      {/* Upazila Selector */}
      <Text style={styles.label}>Upazila</Text>
      <TouchableOpacity 
        style={[styles.selectorTrigger, !districtId && { opacity: 0.5 }]} 
        onPress={() => districtId ? setUpazilaModal(true) : Alert.alert("Wait", "Please select a district first")}
      >
        <Text style={{ color: upazilaName ? "#000" : "#999" }}>{upazilaName || "Select Upazila"}</Text>
      </TouchableOpacity>

      {/* All Selection Modals */}
      <SelectionModal visible={bloodModal} setVisible={setBloodModal} title="Select Blood Group" data={BLOOD_GROUPS} onSelect={(item: string) => setValue("bloodGroup", item)} />
      <SelectionModal visible={districtModal} setVisible={setDistrictModal} title="Select District" data={districts} onSelect={(item: any) => { setValue("districtId", item.id); setValue("districtName", item.name); }} />
      <SelectionModal visible={upazilaModal} setVisible={setUpazilaModal} title="Select Upazila" data={filteredUpazilas} onSelect={(item: any) => { setValue("upazilaId", item.id); setValue("upazilaName", item.name); }} />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register Now</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: "bold", color: "#d90429", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5, color: "#333", marginTop: 15 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, backgroundColor: "#f9f9f9" },
  selectorTrigger: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, backgroundColor: "#f9f9f9" },
  row: { flexDirection: "row" },
  errorText: { color: "red", fontSize: 12, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 15, padding: 20, maxHeight: "70%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#d90429" },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  modalItemText: { fontSize: 16, textAlign: "center" },
  closeButton: { backgroundColor: "#333", padding: 12, borderRadius: 8, marginTop: 15, alignItems: "center" },
  button: { backgroundColor: "#e63946", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 30 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});